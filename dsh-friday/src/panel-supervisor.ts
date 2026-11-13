export type PanelExitDecision =
  | { action: 'respawn'; delayMs: number }
  | { action: 'stay-down'; reason: 'disposed' | 'clean-exit' | 'crash-limit' | 'stopped' };

export { PanelSupervisor } from './host/panel-supervisor.js';
