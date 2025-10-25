
import { StyleSheet, Text } from "react-native";
import { ColorMode } from "./ui/color-mode-manager";

interface Props {
  text: string;
  colorMode: ColorMode;
}

function MainText(props: Props) {
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
    "color": "rgb(20, 20, 20)"
  },
  dark: {
    "color": "rgb(200, 200, 200)"
  }
});

export default MainText;
