/**
 * 系统 color mode 管理器
 * 管理 UI 呈现 dark / light 模式
 */

import { Appearance } from "react-native";

import { LoggerFactory } from "../../internal/logger/logger";

const logger = LoggerFactory.getLogger("ColorModeManager");

enum ColorMode {
  Light = "light",
  Dark = "dark",
}

enum ColorModeAuto {
  Light = "light",
  Dark = "dark",
  Auto = "auto",
}

class ColorModeManager {
  // 用户默认定义的模式
  private userDefaultColorMode: ColorModeAuto;
  private currentColorMode: ColorMode;

  constructor(userDefaultColorMode: string) {
    logger.info(`new ColorModeManager with default color mode: ${userDefaultColorMode}`)
    switch (userDefaultColorMode) {
      case ColorMode.Light:
        this.userDefaultColorMode = ColorModeAuto.Light;
        break;
      case ColorMode.Dark:
        this.userDefaultColorMode = ColorModeAuto.Dark;
        break;
      default:
        this.userDefaultColorMode = ColorModeAuto.Auto;
    }
    this.currentColorMode = this.current();
    logger.info(`current color mode: ${this.currentColorMode}`)
  }

  // 获取当前应该呈现的颜色模式
  current(): ColorMode {
    // 返回用户指定的模式，除非 AUTO
    switch (this.userDefaultColorMode) {
      case ColorModeAuto.Light:
        return ColorMode.Light;
      case ColorModeAuto.Dark:
        return ColorMode.Dark;
      case ColorModeAuto.Auto:
        const deviceColorMode = Appearance.getColorScheme();
        logger.info(`device color mode: ${deviceColorMode}`)
        switch (deviceColorMode) {
          case "light":
            return ColorMode.Light;
          case "dark":
            return ColorMode.Dark;
          default:
            return ColorMode.Light;
        }
    }
  }

  switch(): ColorMode {
    if (this.userDefaultColorMode === ColorModeAuto.Auto) {
      logger.info(`switch color mode from ${this.currentColorMode}`)
      switch (this.currentColorMode) {
        case ColorMode.Light:
          this.currentColorMode = ColorMode.Dark;
          break
        case ColorMode.Dark:
          this.currentColorMode = ColorMode.Light;
          break
      }
    }
    return this.currentColorMode;
  }
}

export { ColorMode, ColorModeManager };