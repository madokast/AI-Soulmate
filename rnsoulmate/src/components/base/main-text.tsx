
import { StyleProp, StyleSheet, Text, TextStyle } from "react-native";
import { ColorMode } from "../ui/color-mode-manager";

interface Props {
  text: string;
  colorMode: ColorMode;
  styles?: StyleProp<TextStyle>;
}

function MainText(props: Props) {
    const colorMode = props.colorMode;
    const text = props.text;
    return (
        <Text style={[styles.mainText, styles[colorMode], props.styles]}>{text}</Text>
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
