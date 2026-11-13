import AppKit
import JarvisPanelCore

@MainActor
final class FridayOrb {
  let orb = OrbPanel(count: 1600)
  var onMove: (() -> Void)?
  private var dragStart: CGPoint?
  private var dock: DockEdge?
  private var hovering = false
  private var tracking: Timer?
  private var screensObserver: NSObjectProtocol?
  private let toggle: () -> Void

  init(toggle: @escaping () -> Void) { self.toggle = toggle }

  func start() {
    orb.setMissionControlHidden(true)
    orb.orbView.setReduceMotion(NSWorkspace.shared.accessibilityDisplayShouldReduceMotion)
    if let screen = NSScreen.main { place(on: screen) }
    orb.onPress = { [weak self] in self?.dragStart = self?.orb.frame.origin }
    orb.onDrag = { [weak self] delta in
      guard let self, let start = dragStart, let screen = pointerScreen else { return }
      dock = nil
      orb.orbView.setDock(nil)
      var frame = orb.frame
      frame.origin = CGPoint(x: start.x + delta.x, y: start.y + delta.y)
      orb.setFrameOrigin(Placement.clampOrigin(frame: frame, visible: screen.visibleFrame))
      onMove?()
    }
    orb.onRelease = { [weak self] moved in
      guard let self else { return }
      dragStart = nil
      if moved, let screen = orb.screen {
        let target = Placement.snap(frame: orb.frame, visible: screen.visibleFrame, notchX: nil)
        dock = target.dock
        orb.setFrameOrigin(target.origin)
        hovering = false
        orb.orbView.setDock(dock)
        onMove?()
      } else { toggle() }
    }
    tracking = Timer.scheduledTimer(withTimeInterval: 1.0 / 25, repeats: true) { [weak self] _ in
      MainActor.assumeIsolated { self?.trackCursor() }
    }
    screensObserver = NotificationCenter.default.addObserver(forName: NSApplication.didChangeScreenParametersNotification,
                                                            object: nil, queue: .main) { [weak self] _ in
      MainActor.assumeIsolated { self?.moveToActiveScreen(); self?.onMove?() }
    }
    orb.orderFrontRegardless()
  }

  private var pointerScreen: NSScreen? {
    NSScreen.screens.first { $0.frame.contains(NSEvent.mouseLocation) } ?? NSScreen.main
  }

  private func place(on screen: NSScreen) {
    let visible = screen.visibleFrame
    orb.setFrameOrigin(CGPoint(x: visible.maxX - orb.frame.width - 12, y: visible.midY))
    dock = nil
    hovering = false
    orb.orbView.setDock(nil)
  }

  func moveToActiveScreen() {
    if let screen = pointerScreen, !screen.visibleFrame.contains(orb.center) { place(on: screen) }
  }

  private func trackCursor() {
    guard dragStart == nil else { return }
    let hit = Placement.overOrb(NSEvent.mouseLocation, frame: orb.frame, strip: dock, stripOpen: hovering)
    orb.ignoresMouseEvents = !hit
    guard hit != hovering else { return }
    hovering = hit
    if dock != nil { orb.orbView.setDock(hit ? nil : dock) }
  }

  func stop() {
    tracking?.invalidate()
    if let screensObserver { NotificationCenter.default.removeObserver(screensObserver) }
    orb.orderOut(nil)
  }
}
