export const runtime = {
  uiWorkspace: null,
  workspaces: null,
  layout: null,
  refreshConfig: null,
}

export function openTask(sessionId) {
  try {
    runtime.uiWorkspace?.openSession(sessionId)
    runtime.layout?.selectPanel(null)
  } catch (error) {
    console.warn('dsh-friday: cannot open task', error)
  }
}

export function openInbox() {
  try {
    runtime.layout?.selectPanel('inbox')
  } catch (error) {
    console.warn('dsh-friday: cannot open Inbox', error)
  }
}
