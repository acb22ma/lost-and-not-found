package io.ionic.starter

import com.getcapacitor.BridgeActivity
import com.getcapacitor.Plugin
import com.getcapacitor.annotation.CapacitorPlugin
import com.getcapacitor.JSObject
import com.getcapacitor.PluginCall
import com.getcapacitor.PluginMethod

@CapacitorPlugin(name = "UWBPlugin")
class UWBPlugin : Plugin() {
    private var uwbManager: UWBManager? = null

    override fun load() {
        uwbManager = UWBManager(context)
    }

    @PluginMethod
    fun startScanning(call: PluginCall) {
        uwbManager?.startScanning()
        val result = JSObject()
        result.put("status", "scanning started")
        call.resolve(result)
    }
}

