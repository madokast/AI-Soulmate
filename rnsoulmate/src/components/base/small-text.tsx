
import { StyleSheet, Text } from "react-native";
import { ColorMode } from "../ui/color-mode-manager";

interface Props {
  text: string;
  colorMode: ColorMode;
}

function SmallText(props: Props){
    const colorMode = props.colorMode;
    const text = props.text;
    return (
        <Text style={[styles.mainText, styles[colorMode]]}>{text}</Text>
    );
}

const styles = StyleSheet.create({
  mainText: {
    fontSize: 16,
  },
  light: {
    "color": "rgb(50, 50, 50)"
  },
  dark: {
    "color": "rgb(150, 150, 150)"
  }
});

export default SmallText;
