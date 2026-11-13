import AppKit
import Carbon.HIToolbox
import WebKit

private let hotkeyHandler: EventHandlerUPP = { _, _, _ -> OSStatus in
  DispatchQueue.main.async { FridayAppDelegate.shared?.togglePanel() }
  return noErr
}

private final class FridayPanel: NSPanel {
  override var canBecomeKey: Bool { true }
  override var canBecomeMain: Bool { false }
}

private final class FridayAppDelegate: NSObject, NSApplicationDelegate, WKScriptMessageHandler, WKNavigationDelegate, WKUIDelegate {
  static var shared: FridayAppDelegate?

  private var panel: FridayPanel?
  private var webView: WKWebView?
  private var hotkeyRef: EventHotKeyRef?
  private var eventHandler: EventHandlerRef?
  private var dragMonitor: Any?
  private var didPosition = false
  private let outputLock = NSLock()

  func applicationDidFinishLaunching(_ notification: Notification) {
    NSApp.setActivationPolicy(.accessory)
    installHotkeyHandler()
    readStandardInput()
  }

  func applicationWillTerminate(_ notification: Notification) {
    if let hotkeyRef { UnregisterEventHotKey(hotkeyRef) }
    if let eventHandler { RemoveEventHandler(eventHandler) }
    if let dragMonitor { NSEvent.removeMonitor(dragMonitor) }
  }

  private func send(_ message: [String: Any]) {
    guard JSONSerialization.isValidJSONObject(message),
      let data = try? JSONSerialization.data(withJSONObject: message),
      let line = String(data: data, encoding: .utf8) else { return }
    outputLock.lock()
    defer { outputLock.unlock() }
    FileHandle.standardOutput.write(Data((line + "\n").utf8))
  }

  private func json(_ value: Any) -> String {
    if value is NSNull { return "null" }
    guard JSONSerialization.isValidJSONObject(["value": value]),
      let data = try? JSONSerialization.data(withJSONObject: ["value": value]),
      let object = try? JSONSerialization.jsonObject(with: data) as? [String: Any],
      let wrapped = object["value"],
      JSONSerialization.isValidJSONObject([wrapped]),
      let encoded = try? JSONSerialization.data(withJSONObject: [wrapped]),
      let text = String(data: encoded, encoding: .utf8) else { return "null" }
    return String(text.dropFirst().dropLast())
  }

  private func evaluate(_ script: String) {
    DispatchQueue.main.async { self.webView?.evaluateJavaScript(script, completionHandler: nil) }
  }

  private func respond(_ id: String, ok: Bool, value: Any) {
    evaluate("window.FridayNative?.resolve(\(json(id)),\(ok ? "true" : "false"),\(json(value)))")
  }

  private func readStandardInput() {
    DispatchQueue.global(qos: .userInitiated).async {
      while let line = readLine(strippingNewline: true) {
        guard let data = line.data(using: .utf8),
          let message = try? JSONSerialization.jsonObject(with: data) as? [String: Any],
          let type = message["type"] as? String else { continue }
        if type == "request", message["method"] as? String == "pickDirectory", let id = message["id"] as? String {
          DispatchQueue.main.async { self.pickDirectory(id: id) }
          continue
        }
        switch type {
        case "configure", "hotkey", "terminate":
          DispatchQueue.main.async { self.handleHostCommand(message) }
        case "response":
          guard let id = message["id"] as? String else { continue }
          let ok = message["ok"] as? Bool ?? false
          let value = message["value"] ?? NSNull()
          DispatchQueue.main.async { self.respond(id, ok: ok, value: value) }
        case "stream":
          guard let id = message["id"] as? String, let event = message["event"] else { continue }
          DispatchQueue.main.async {
            self.evaluate("window.FridayNative?.stream(\(self.json(id)),\(self.json(event)))")
          }
        case "streamEnd":
          guard let id = message["id"] as? String else { continue }
          let messageText = message["message"] ?? NSNull()
          DispatchQueue.main.async {
            self.evaluate("window.FridayNative?.streamEnd(\(self.json(id)),\(self.json(messageText)))")
          }
        default:
          self.send(message)
        }
      }
    }
  }

  private func handleHostCommand(_ message: [String: Any]) {
    switch message["type"] as? String {
    case "configure":
      registerHotkey(message["hotkey"] as? String ?? "Alt+Space")
      setupPanel()
      if let path = message["htmlPath"] as? String {
        let url = URL(fileURLWithPath: path)
        webView?.loadFileURL(url, allowingReadAccessTo: url.deletingLastPathComponent())
      }
    case "hotkey":
      registerHotkey(message["hotkey"] as? String ?? "Alt+Space")
    case "terminate":
      NSApp.terminate(nil)
    default:
      break
    }
  }

  private func setupPanel() {
    guard panel == nil else { return }
    let panel = FridayPanel(contentRect: NSRect(x: 0, y: 0, width: 736, height: 78), styleMask: [.borderless, .resizable], backing: .buffered, defer: false)
    panel.isFloatingPanel = true
    panel.level = .floating
    panel.hidesOnDeactivate = false
    panel.isOpaque = false
    panel.backgroundColor = .clear
    panel.hasShadow = true
    panel.collectionBehavior = [.canJoinAllSpaces, .fullScreenAuxiliary]
    panel.minSize = NSSize(width: 520, height: 78)
    panel.isReleasedWhenClosed = false

    let container: NSView
    if #available(macOS 26.0, *) {
      let glass = NSGlassEffectView()
      glass.cornerRadius = 18
      container = glass
    } else {
      let glass = NSVisualEffectView()
      glass.material = .popover
      glass.blendingMode = .behindWindow
      glass.state = .active
      glass.wantsLayer = true
      glass.layer?.cornerRadius = 18
      glass.layer?.masksToBounds = true
      container = glass
    }
    container.frame = NSRect(x: 0, y: 0, width: 736, height: 78)
    panel.contentView = container

    let configuration = WKWebViewConfiguration()
    configuration.userContentController.add(self, name: "fridayBridge")
    let preferences = WKWebpagePreferences()
    preferences.allowsContentJavaScript = true
    configuration.defaultWebpagePreferences = preferences
    let webView = WKWebView(frame: container.bounds, configuration: configuration)
    webView.navigationDelegate = self
    webView.uiDelegate = self
    webView.setValue(false, forKey: "drawsBackground")
    webView.underPageBackgroundColor = .clear
    webView.translatesAutoresizingMaskIntoConstraints = false
    container.addSubview(webView)
    NSLayoutConstraint.activate([
      webView.leadingAnchor.constraint(equalTo: container.leadingAnchor),
      webView.trailingAnchor.constraint(equalTo: container.trailingAnchor),
      webView.topAnchor.constraint(equalTo: container.topAnchor),
      webView.bottomAnchor.constraint(equalTo: container.bottomAnchor),
    ])
    self.panel = panel
    self.webView = webView

    dragMonitor = NSEvent.addLocalMonitorForEvents(matching: .leftMouseDown) { event in
      guard event.window === panel else { return event }
      let point = panel.mouseLocationOutsideOfEventStream
      let compact = panel.frame.height < 120
      let inTopStrip = point.y >= panel.frame.height - (compact ? 16 : 46) && (compact || point.x < panel.frame.width - 140)
      let inOuterBorder = point.x < 8 || point.x > panel.frame.width - 8 || point.y < 8
      if inTopStrip || inOuterBorder {
        panel.performDrag(with: event)
        return nil
      }
      return event
    }
  }

  func togglePanel() {
    guard let panel else { return }
    if panel.isVisible { hidePanel() }
    else { showPanel() }
  }

  private func showPanel() {
    setupPanel()
    guard let panel else { return }
    if !didPosition { panel.center(); didPosition = true }
    NSApp.activate(ignoringOtherApps: true)
    panel.makeKeyAndOrderFront(nil)
    send(["type": "status", "visible": true])
    evaluate("window.FridayNative?.visibility(true)")
  }

  private func hidePanel() {
    panel?.orderOut(nil)
    send(["type": "status", "visible": false])
    evaluate("window.FridayNative?.visibility(false)")
  }

  private func installHotkeyHandler() {
    var eventType = EventTypeSpec(eventClass: OSType(kEventClassKeyboard), eventKind: OSType(kEventHotKeyPressed))
    InstallEventHandler(GetApplicationEventTarget(), hotkeyHandler, 1, &eventType, nil, &eventHandler)
  }

  private func registerHotkey(_ spec: String) {
    if let hotkeyRef { UnregisterEventHotKey(hotkeyRef); self.hotkeyRef = nil }
    let parts = spec.split(separator: "+").map(String.init)
    guard let key = parts.last, let keyCode = carbonKeyCode(key) else {
      send(["type": "status", "hotkeyError": "Unsupported hotkey: \(spec)"])
      return
    }
    var modifiers: UInt32 = 0
    for modifier in parts.dropLast() {
      switch modifier.lowercased() {
      case "alt", "option", "opt": modifiers |= UInt32(optionKey)
      case "meta", "cmd", "command": modifiers |= UInt32(cmdKey)
      case "ctrl", "control": modifiers |= UInt32(controlKey)
      case "shift": modifiers |= UInt32(shiftKey)
      default: break
      }
    }
    let id = EventHotKeyID(signature: OSType(0x46524944), id: 1)
    let status = RegisterEventHotKey(UInt32(keyCode), modifiers, id, GetApplicationEventTarget(), 0, &hotkeyRef)
    let error: Any = status == noErr ? NSNull() : "Could not register \(spec). It may already be used by another application (Carbon status \(status))."
    send(["type": "status", "hotkeyError": error])
  }

  private func carbonKeyCode(_ key: String) -> Int? {
    let codes: [String: Int] = [
      "SPACE": kVK_Space, "ENTER": kVK_Return, "ESCAPE": kVK_Escape, "TAB": kVK_Tab,
      "BACKSPACE": kVK_Delete, "DELETE": kVK_ForwardDelete,
      "ARROWUP": kVK_UpArrow, "ARROWDOWN": kVK_DownArrow, "ARROWLEFT": kVK_LeftArrow, "ARROWRIGHT": kVK_RightArrow,
      "A": kVK_ANSI_A, "B": kVK_ANSI_B, "C": kVK_ANSI_C, "D": kVK_ANSI_D, "E": kVK_ANSI_E,
      "F": kVK_ANSI_F, "G": kVK_ANSI_G, "H": kVK_ANSI_H, "I": kVK_ANSI_I, "J": kVK_ANSI_J,
      "K": kVK_ANSI_K, "L": kVK_ANSI_L, "M": kVK_ANSI_M, "N": kVK_ANSI_N, "O": kVK_ANSI_O,
      "P": kVK_ANSI_P, "Q": kVK_ANSI_Q, "R": kVK_ANSI_R, "S": kVK_ANSI_S, "T": kVK_ANSI_T,
      "U": kVK_ANSI_U, "V": kVK_ANSI_V, "W": kVK_ANSI_W, "X": kVK_ANSI_X, "Y": kVK_ANSI_Y, "Z": kVK_ANSI_Z,
      "0": kVK_ANSI_0, "1": kVK_ANSI_1, "2": kVK_ANSI_2, "3": kVK_ANSI_3, "4": kVK_ANSI_4,
      "5": kVK_ANSI_5, "6": kVK_ANSI_6, "7": kVK_ANSI_7, "8": kVK_ANSI_8, "9": kVK_ANSI_9,
      "F1": kVK_F1, "F2": kVK_F2, "F3": kVK_F3, "F4": kVK_F4, "F5": kVK_F5, "F6": kVK_F6,
      "F7": kVK_F7, "F8": kVK_F8, "F9": kVK_F9, "F10": kVK_F10, "F11": kVK_F11, "F12": kVK_F12,
    ]
    return codes[key.uppercased()]
  }

  private func pickDirectory(id: String) {
    let picker = NSOpenPanel()
    picker.canChooseFiles = false
    picker.canChooseDirectories = true
    picker.allowsMultipleSelection = false
    picker.prompt = "Choose"
    let completion: (NSApplication.ModalResponse) -> Void = { response in
      self.respond(id, ok: true, value: response == .OK ? picker.url?.path ?? NSNull() : NSNull())
    }
    if let panel, panel.isVisible { picker.beginSheetModal(for: panel, completionHandler: completion) }
    else { completion(picker.runModal()) }
  }

  func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
    guard message.name == "fridayBridge", let body = message.body as? [String: Any], let type = body["type"] as? String else { return }
    if type == "command" {
      switch body["command"] as? String {
      case "hide": hidePanel()
      case "clientReady":
        send(["type": "status", "pageReady": true])
        evaluate("window.FridayNative?.visibility(\(panel?.isVisible == true ? "true" : "false"))")
      case "resize":
        if let panel, let params = body["params"] as? [String: Any],
          let width = params["width"] as? Double, let height = params["height"] as? Double {
          let size = NSSize(width: max(520, width + 16), height: max(78, height + 16))
          var frame = panel.frame
          frame.origin.y = frame.maxY - size.height
          frame.size = size
          panel.setFrame(frame, display: true, animate: false)
        }
      case "copy":
        if let params = body["params"] as? [String: Any], let text = params["text"] as? String {
          NSPasteboard.general.clearContents()
          NSPasteboard.general.setString(text, forType: .string)
        }
      case "openURL":
        if let params = body["params"] as? [String: Any], let text = params["url"] as? String,
          let url = URL(string: text), ["http", "https"].contains(url.scheme?.lowercased() ?? "") {
          NSWorkspace.shared.open(url)
        }
      default: break
      }
      return
    }
    send(body)
  }

  func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
    send(["type": "status", "loaded": true])
  }

  func webView(_ webView: WKWebView, decidePolicyFor navigationAction: WKNavigationAction, decisionHandler: @escaping (WKNavigationActionPolicy) -> Void) {
    if navigationAction.targetFrame == nil, let url = navigationAction.request.url, ["http", "https"].contains(url.scheme?.lowercased() ?? "") {
      decisionHandler(.cancel)
      NSWorkspace.shared.open(url)
      return
    }
    decisionHandler(.allow)
  }

  func webView(_ webView: WKWebView, runOpenPanelWith parameters: WKOpenPanelParameters, initiatedByFrame frame: WKFrameInfo, completionHandler: @escaping ([URL]?) -> Void) {
    let picker = NSOpenPanel()
    picker.canChooseFiles = true
    picker.canChooseDirectories = false
    picker.allowsMultipleSelection = parameters.allowsMultipleSelection
    picker.allowedContentTypes = [.png, .jpeg, .webP, .gif]
    let completion: (NSApplication.ModalResponse) -> Void = { response in
      completionHandler(response == .OK ? picker.urls : nil)
    }
    if let panel, panel.isVisible { picker.beginSheetModal(for: panel, completionHandler: completion) }
    else { completion(picker.runModal()) }
  }
}

private let application = NSApplication.shared
private let delegate = FridayAppDelegate()
FridayAppDelegate.shared = delegate
application.delegate = delegate
application.run()
