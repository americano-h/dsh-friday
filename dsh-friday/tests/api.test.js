import assert from 'node:assert/strict'
import { Readable } from 'node:stream'
import test from 'node:test'
import { createApi } from '../src/host/api.js'

function fixture(connection = {}) {
  let route
  let config = { retentionDays: 30 }
  const ctx = {
    connection,
    effect: (callback) => callback(),
    webServer: { register: (value) => { route = value } },
    attachments: { imageLimits: {} },
    sessionController: {
      modelCatalog: async () => ({ groups: [{ id: 'p', models: [{ id: 'm' }] }] }),
    },
  }
  createApi(ctx, {
    repository: { list: async () => [] },
    configStore: {
      load: async () => {},
      get: () => config,
      update: async (apply) => { config = await apply(config); return config },
    },
  })
  async function settings({ method = 'GET', peer, header = '1', body } = {}) {
    const req = Object.assign(Readable.from(body ? [Buffer.from(JSON.stringify(body))] : []), {
      method,
      url: '/dsh-friday/api/v1/config',
      headers: { 'x-dsh-friday': header, 'content-type': 'application/json' },
    })
    const response = {}
    await route.handler(req, {
      writeHead: (status) => { response.status = status },
      end: (value) => { response.body = JSON.parse(value) },
    }, peer)
    return response
  }
  return { route, settings }
}

test('new DSH settings route permits read and save only with host admission and the Friday header', async () => {
  const { route, settings } = fixture()
  const peer = { id: 'owner' }
  assert.equal(route.auth, 'required')
  assert.equal((await settings()).status, 401)
  assert.equal((await settings({ method: 'PUT', peer, header: '', body: { retentionDays: 10 } })).status, 403)
  assert.equal((await settings({ method: 'PUT', body: { retentionDays: 10 } })).status, 401)
  const initial = await settings({ peer })
  assert.equal(initial.status, 200)
  assert.equal(initial.body.config.retentionDays, 30)
  assert.equal(initial.body.models[0].model, 'm')

  const saved = await settings({ method: 'PUT', peer, body: { retentionDays: 14 } })
  assert.equal(saved.status, 200)
  assert.equal((await settings({ peer })).body.config.retentionDays, 14)
})

test('older DSH settings route still honors the connection rejection', async () => {
  const connection = {
    requestRejection(req) {
      assert.equal(this, connection)
      assert.equal(req.url, '/dsh-friday/api/v1/config')
      return this.rejection
    },
  }
  const { settings } = fixture(connection)
  assert.equal((await settings()).status, 200)
  connection.rejection = 403
  assert.equal((await settings()).status, 403)
})
