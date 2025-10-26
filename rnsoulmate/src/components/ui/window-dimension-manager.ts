import { useEffect, useState } from "react";
import { Dimensions, Platform, StatusBar } from "react-native";

import { OS } from "../../internal/system";
import { LoggerFactory } from "../../internal/logger/logger";

const logger = LoggerFactory.getLogger("WindowDimensionManager");

interface WindowDimension {
  width: number;
  height: number;
}

class WindowDimensionManager {
  private paddingTop: number = 0;
  constructor() {
    // 计算顶部安全区域的高度
    if (Platform.OS === OS.Android) {
      this.paddingTop = StatusBar.currentHeight ?? 0;
    }
    if (Platform.OS === OS.Web) {
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
    }
  }

  useValue(): WindowDimension {
    // 初始化窗口尺寸状态
    const [windowDimension, setWindowDimension] = useState<WindowDimension>({
      width: Dimensions.get("window").width,
      height: Dimensions.get("window").height - this.paddingTop,
    });

    // 监听窗口尺寸变化
    useEffect(() => {
      const subscription = Dimensions.addEventListener(
        'change',
        ({window}) => {
          setWindowDimension({
            width: window.width,
            height: window.height - this.paddingTop,
          });
        },
      );
      return () => subscription?.remove();
    }, []);

    logger.debug(`Window dimension: ${windowDimension.width}x${windowDimension.height}`);

    return windowDimension;
  }
}

export { WindowDimensionManager };
export type { WindowDimension };