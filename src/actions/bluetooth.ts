import { registerPlugin, Capacitor } from "@capacitor/core";

interface UWBPlugin {
    startScanning: () => Promise<void>;
}

const UWB = registerPlugin<UWBPlugin>("UWBPlugin");

export const startUWBScanning = async () => {
    if (Capacitor.isNativePlatform()) {
        try {
            await UWB.startScanning();
            console.log("UWB scanning started...");
        } catch (error) {
            console.error("Error starting UWB scan:", error);
        }
    } else {
        console.log("UWB only works on native devices");
    }
};




