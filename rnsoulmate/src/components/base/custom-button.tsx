import React from 'react';
import { DimensionValue, Pressable, StyleSheet } from 'react-native';

import { ColorMode } from '../ui/color-mode-manager';
import SmallText from './small-text';

interface Props {
  onPress: () => void;
  onLongPress?: () => void;
  title: string;
  colorMode: ColorMode;
  width?: DimensionValue;
  height?: number;
  borderRadius?: number;
  paddingBottom?: number;
  paddingTop?: number;
  paddingLeft?: number;
  paddingRight?: number;
  longPressThresholdMs?: number;
}

const LongPressThresholdMs = 1500; // 长按阈值，单位毫秒

function CustomButton(props: Props) {
  const style = {
    ...styles.button,
    ...styles[props.colorMode],
    width: props.width ?? 32,
    height: props.height ?? 32,
    borderRadius: props.borderRadius ?? 12,
    paddingBottom: props.paddingBottom ?? 2,
    paddingTop: props.paddingTop ?? 1,
    paddingLeft: props.paddingLeft ?? 1,
    paddingRight: props.paddingRight ?? 2,
    alignItems: 'center',
    justifyContent: 'center',
  };
  const [isActive, setActive] = React.useState(false);

  return (
    <Pressable
      onPressIn={() => setActive(true)}
      onPressOut={() => setActive(false)}
      onPress={props.onPress}
      onLongPress={props.onLongPress}
      delayLongPress={props.longPressThresholdMs ?? LongPressThresholdMs}
      style={[
        style,
        isActive && buttonPressedStyles[props.colorMode], // 按下时的样式
      ]}
    >
      <SmallText text={props.title} colorMode={props.colorMode} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  [ColorMode.Light]: {
    backgroundColor: 'rgba(85, 175, 232, 1)',
  },
  [ColorMode.Dark]: {
    backgroundColor: 'rgb(11, 136, 213)',
  }
});

const buttonPressedStyles = StyleSheet.create({
  [ColorMode.Light]: {
    backgroundColor: 'rgb(210, 210, 210)',
  },
  [ColorMode.Dark]: {
    backgroundColor: 'rgb(50, 50, 50)',
  }
});

export default CustomButton;