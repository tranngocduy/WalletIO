package com.walletio

import android.os.Build
import android.os.Bundle
import android.view.View
import android.view.Window
import android.graphics.Color
import android.view.WindowManager

import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate

class MainActivity : ReactActivity() {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  override fun getMainComponentName(): String = "WalletIO"

  /**
   * Returns the instance of the [ReactActivityDelegate]. We use [DefaultReactActivityDelegate]
   * which allows you to enable New Architecture with a single boolean flags [fabricEnabled]
   */
  override fun createReactActivityDelegate(): ReactActivityDelegate =
      DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)
  
  /**
   *
   *
   */
  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(null)

    if (Build.VERSION.SDK_INT >= 19 && Build.VERSION.SDK_INT < 21) {
      setWindowFlag(WindowManager.LayoutParams.FLAG_TRANSLUCENT_STATUS, true)
    }
    if (Build.VERSION.SDK_INT >= 19) {
      window.decorView.systemUiVisibility = View.SYSTEM_UI_FLAG_LAYOUT_STABLE or View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
    }
    if (Build.VERSION.SDK_INT >= 21) {
      setWindowFlag(WindowManager.LayoutParams.FLAG_TRANSLUCENT_STATUS, false)
      window.statusBarColor = Color.TRANSPARENT
    }
  }

  override fun invokeDefaultOnBackPressed() {
    moveTaskToBack(true)
  }

  private fun setWindowFlag(bits: Int, on: Boolean) {
    val win = window
    val winParams = win.attributes
    if (on) {
      winParams.flags = winParams.flags or bits
    } else {
      winParams.flags = winParams.flags and bits.inv()
    }
    win.attributes = winParams
  }
}
