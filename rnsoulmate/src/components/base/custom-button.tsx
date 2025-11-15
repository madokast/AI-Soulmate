import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { GestureResponderEvent } from 'react-native';

import { ColorMode } from '../ui/color-mode-manager';
import SmallText from './small-text';

interface Props {
  onPress: () => void;
  title: string;
  colorMode: ColorMode;
}

function CustomButton(props: Props) {
  const style = {...styles.button, ...styles[props.colorMode]};
  const [isActive, setActive] = React.useState(false);

  // 按下事件
  const pressIn = () => {
    setActive(true);
  }
  
  // 松开事件
  const pressOut = () => {
    setActive(true);
    try {
      props.onPress();
    } finally {
      setActive(false);
    }
  }

  return (
    <Pressable
      onPressIn={pressIn}
      onPressOut={pressOut}
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
    paddingTop: 4,
    paddingBottom: 6,
    paddingLeft: 10,
    paddingRight: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  [ColorMode.Light]: {
    backgroundColor: 'rgb(11, 136, 213)',
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