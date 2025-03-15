package io.ionic.starter

import android.content.Context
import android.uwb.*
import android.util.Log

class UWBManager(context: Context) {
    private val uwbManager = context.getSystemService(UwbManager::class.java)

    fun startScanning() {
        if (uwbManager == null) {
            Log.e("UWB", "UWB is not supported on this device")
            return
        }

        val session = uwbManager.createRangingSession(object : RangingSession.Callback {
            override fun onRangingResult(results: RangingResult) {
                Log.d("UWB", "Distance to friend: ${results.distanceMm / 1000.0} meters")
            }

            override fun onRangingClosed(reason: Int) {
                Log.e("UWB", "UWB session closed: $reason")
            }
        })

        session.start()
    }
}
