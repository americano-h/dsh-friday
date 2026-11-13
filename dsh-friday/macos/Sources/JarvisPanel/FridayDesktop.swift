import AppKit
import Carbon.HIToolbox
import WebKit
import SwiftUI
import JarvisPanelCore

final class FridayAppDelegate: NSObject, NSApplicationDelegate, WKScriptMessageHandler, WKNavigationDelegate, WKUIDelegate {
  private var panel: OverlayPanel?
  private var webView: WKWebView?
  private var documentURL: URL?
  private lazy var hotkey = HotKey { [weak self] _ in self?.togglePanel() }
  private lazy var desktop = FridayOrb { [weak self] in self?.togglePanel() }
  private let outputLock = NSLock()

  func applicationDidFinishLaunching(_ notification: Notification) {
    desktop.start()
    readStandardInput()
  }

  func applicationWillTerminate(_ notification: Notification) {
    hotkey.invalidate()
    desktop.stop()
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
        switch type {
        case "configure", "hotkey", "show", "terminate":
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
          continue
        }
      }
      DispatchQueue.main.async { NSApp.terminate(nil) }
    }
  }

  private func handleHostCommand(_ message: [String: Any]) {
    switch message["type"] as? String {
    case "configure":
      registerHotkey(message["hotkey"] as? String ?? "Alt+Space")
      setupPanel()
      if let path = message["htmlPath"] as? String {
        let url = URL(fileURLWithPath: path)
        documentURL = url.standardizedFileURL
        webView?.loadFileURL(url, allowingReadAccessTo: url.deletingLastPathComponent())
      }
    case "hotkey":
      registerHotkey(message["hotkey"] as? String ?? "Alt+Space")
    case "show":
      showPanel(sessionId: message["sessionId"] as? String)
    case "terminate":
      NSApp.terminate(nil)
    default:
      break
    }
  }

  private func setupPanel() {
    guard panel == nil else { return }
    let panel = OverlayPanel(root: EmptyView())
    panel.setMissionControlHidden(true)
    panel.ignoresMouseEvents = false
    let container = NSView(frame: NSRect(x: 0, y: 0, width: 508, height: 92))
    panel.contentView = container
    panel.setContentSize(container.frame.size)
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

    desktop.onMove = { [weak self] in
      guard let self, panel.isVisible else { return }
      self.positionPanel(panel.frame.size)
    }
  }

  private func positionPanel(_ size: CGSize) {
    guard let panel, let screen = desktop.orb.screen ?? NSScreen.main else { return }
    let visible = screen.visibleFrame
    let size = CGSize(width: min(size.width, visible.width), height: min(size.height, visible.height))
    let layout = Placement.quickBar(center: desktop.orb.center, visible: visible,
                                    barSize: CGSize(width: size.width, height: 76))
    var frame = CGRect(x: layout.bar.minX, y: layout.growsUp ? layout.bar.minY : layout.bar.maxY - size.height,
                       width: size.width, height: size.height)
    frame.origin = Placement.clampOrigin(frame: frame, visible: visible)
    panel.setFrame(frame, display: true)
  }

  func togglePanel() {
    guard let panel else { return }
    if panel.isVisible { hidePanel() }
    else { showPanel() }
  }

  private func showPanel(sessionId: String? = nil) {
    setupPanel()
    guard let panel else { return }
    desktop.moveToActiveScreen()
    positionPanel(panel.frame.size)
    NSApp.activate(ignoringOtherApps: true)
    panel.makeKeyAndOrderFront(nil)
    send(["type": "status", "visible": true])
    evaluate("window.FridayNative?.visibility(true,\(json(sessionId as Any? ?? NSNull())))")
  }

  private func hidePanel() {
    panel?.orderOut(nil)
    send(["type": "status", "visible": false])
    evaluate("window.FridayNative?.visibility(false)")
  }

  private func registerHotkey(_ spec: String) {
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
    let keySpec = HotKeySpec(keyCode: UInt32(keyCode), modifiers: modifiers)
    let registered = keySpec.map { hotkey.replace(with: $0) } ?? false
    let error: Any = registered ? NSNull() : "Could not register " + spec
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
    guard message.frameInfo.isMainFrame, let documentURL,
      message.frameInfo.request.url?.standardizedFileURL == documentURL, message.name == "fridayBridge", let body = message.body as? [String: Any], let type = body["type"] as? String else { return }
    if type == "command" {
      switch body["command"] as? String {
      case "hide": hidePanel()
      case "clientReady":
        send(["type": "status", "pageReady": true])
        evaluate("window.FridayNative?.visibility(\(panel?.isVisible == true ? "true" : "false"))")
      case "activity":
        if let params = body["params"] as? [String: Any], let name = params["motion"] as? String, let motion = OrbMotion(rawValue: name) {
          desktop.orb.orbView.apply(motion: motion, tint: motion == .error ? .red : motion == .attention ? .amber : .cyan)
        }
      case "resize":
        if let params = body["params"] as? [String: Any],
          let width = params["width"] as? Double, let height = params["height"] as? Double {
          positionPanel(NSSize(width: width + 16, height: height + 16))
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
    if type == "request", body["method"] as? String == "pickDirectory", let id = body["id"] as? String {
      pickDirectory(id: id)
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
    let local = navigationAction.request.url?.standardizedFileURL == documentURL && documentURL != nil
    decisionHandler(local ? .allow : .cancel)
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

