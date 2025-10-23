
import { JSX } from "react";
import { StyleSheet, Text } from "react-native";
import { ColorMode } from "../internal/system";

interface MainTextProps {
  text: string;
  colorMode: ColorMode;
}

function MainText(props: MainTextProps): JSX.Element {
    const colorMode = props.colorMode;
    const text = props.text;
    return (
        <Text style={[styles.mainText, styles[colorMode]]}>{text}</Text>
    );
}

const styles = StyleSheet.create({
  mainText: {
    fontSize: 20,
  },
  light: {
    "color": "rgb(0, 0, 0)"
  },
  dark: {
    "color": "rgb(201, 200, 197)"
  }
});

export default MainText;
