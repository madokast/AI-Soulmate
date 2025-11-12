import React from "react";
import { StyleSheet, TextInput, Button, View, Platform, TextInputKeyPressEventData, NativeSyntheticEvent } from "react-native";

import { LoggerFactory } from "../internal/logger/logger";

import { ColorMode } from "./ui/color-mode-manager";

const logger = LoggerFactory.getLogger("header");

interface Props {
  colorMode: ColorMode;
}

function Header(props: Props) {
  const [inputText, setInputText] = React.useState('');

  const submit = () => {
    logger.info(`submit: ${inputText}`);
    setInputText("");
  }

 // 监听键盘按键，处理 Ctrl+Enter 组合键
  const handleKeyPress = (e:NativeSyntheticEvent<TextInputKeyPressEventData>) => {
    const { key, ctrlKey, metaKey } = e.nativeEvent as {key:string, ctrlKey:boolean, metaKey:boolean};
    // 检测 Enter 键，且按下了 Ctrl（Windows/Linux）或 Command（Mac）
    if (key === 'Enter' && (ctrlKey || metaKey)) {
      // 触发确认逻辑
      submit();
      // 阻止默认行为（避免 Enter 键导致的换行）
      e.preventDefault?.();
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={[inputStyle.input, inputStyle[props.colorMode]]}
        placeholder=""
        value={inputText}
        onChangeText={setInputText} // 实时更新输入状态
        keyboardType="default" // 默认键盘类型
        autoCapitalize="none" // 不自动大写
        autoCorrect={false} // 关闭自动纠错
        multiline={true} // 关键：开启多行模式
        numberOfLines={3} // 默认显示3行（内容超过会自动滚动）
        onKeyPress={handleKeyPress} // 绑定按键监听
      />
      <Button
        title="➤"
        color={buttonStyle[props.colorMode].color}
        onPress={submit} // 点击时传递输入内容
        disabled={!inputText.trim()} // 当输入为空时禁用按钮
      />
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flexDirection: 'row', // 关键：设置为水平排列
    padding: 5, // 整体内边距
    paddingLeft: 20,
    alignItems: 'center', // 垂直方向居中对齐（让输入框和按钮高度对齐）
    gap: 10, // 输入框和按钮之间的间距（也可用marginRight实现）
  },
});

const inputStyle = StyleSheet.create({
  input: {
    width: "100%",
    padding: 5,
    borderRadius: 20,
    borderWidth: 3,
    fontSize: 16,
  },
  light: {
    backgroundColor: 'rgb(210, 210, 210)', // 白色背景，适合浅色模式
    borderColor: 'rgb(255, 255, 255)',
    color: "rgb(20, 20, 20)",
  },
  dark: {
    backgroundColor: 'rgb(30, 30, 30)', // 深灰色背景，适合深色模式
    borderColor: 'rgb(20, 20, 20)',
    color: "rgb(200, 200, 200)",
  },
});

const buttonStyle = {
  light: {
    color: 'rgb(210, 210, 210)'
  },
  dark: {
    color: 'rgb(30, 30, 30)'
  }
}

export { Header };
