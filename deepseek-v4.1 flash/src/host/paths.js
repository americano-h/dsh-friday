import { mkdir } from 'node:fs/promises'
import { homedir } from 'node:os'
import { join, resolve } from 'node:path'

export const DSH_HOME = process.env.DSH_HOME || join(homedir(), '.dsh')
export const DATA_DIR = join(DSH_HOME, 'storages', 'dsh-friday')
export const INBOX_DIR = join(DATA_DIR, 'inbox')
export const INDEX_FILE = join(DATA_DIR, 'index.json')
export const CONFIG_FILE = join(DATA_DIR, 'config.json')

export async function ensureDirs() {
  await mkdir(DATA_DIR, { recursive: true })
  await mkdir(INBOX_DIR, { recursive: true })
}

export function isInboxCwd(cwd) {
  if (typeof cwd !== 'string' || !cwd) return false
  return resolve(cwd) === resolve(INBOX_DIR)
}
