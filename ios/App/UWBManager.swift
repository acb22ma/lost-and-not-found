import Foundation
import NearbyInteraction
import UIKit

class UWBManager: NSObject, NISessionDelegate {
    var niSession: NISession?

    override init() {
        super.init()
        niSession = NISession()
        niSession?.delegate = self
    }

    func startUWBInteraction(with token: NIDiscoveryToken) {
        let config = NINearbyPeerConfiguration(peerToken: token)
        niSession?.run(config)
    }

    func session(_ session: NISession, didUpdate nearbyObjects: [NINearbyObject]) {
        for obj in nearbyObjects {
            print("Distance to friend: \(obj.distance ?? 0) meters")
        }
    }
}
