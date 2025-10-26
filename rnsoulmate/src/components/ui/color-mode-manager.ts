/**
 * 系统 color mode 管理器
 * 管理 UI 呈现 dark / light 模式
 */

import { useEffect, useState } from "react";
import { Appearance, Platform } from "react-native";
import { useColorScheme as useDeviceColorMode } from 'react-native';

import { OS } from "../../internal/system";
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

  constructor(userDefaultColorMode?: string) {
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

  useValue(): ColorMode {
    // 获取当前设备颜色模式
    const deviceColorMode = useDeviceColorMode();

    // 获取用户颜色模式（当前颜色模式为 auto 时，监听设备颜色，否则使用用户颜色模式）
    const [colorMode, setColorMode] = useState(this.current());
    useEffect(() => {
      setColorMode(this.current());
    }, [deviceColorMode])

    const switchColorMode = () => setColorMode(this.switch())

    // 注册监听 Ctrl+M 键，切换颜色模式
    useEffect(() => {
      if (Platform.OS === OS.Web) {
        logger.info('Ctrl+M to switch color mode');
        const handleKeyDown = (event: KeyboardEvent) => {
          if (event.ctrlKey && event.key === 'm') {
            switchColorMode();
          }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => {
          window.removeEventListener('keydown', handleKeyDown);
        };
      }
    }, [])

    return colorMode;
  }
}

export { ColorMode, ColorModeManager };