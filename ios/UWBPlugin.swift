import Capacitor

@objc(UWBPlugin)
public class UWBPlugin: CAPPlugin {
    let uwbManager = UWBManager()

    @objc func startScanning(_ call: CAPPluginCall) {
        DispatchQueue.main.async {
            self.uwbManager.startUWBInteraction()
            call.resolve(["status": "scanning started"])
        }
    }
}
