import React from "react";
import { StyleSheet, View } from "react-native";

import MainText from "./base/main-text";

import { ColorMode } from "./ui/color-mode-manager";

interface Props {
  colorMode: ColorMode;
}

function Footer(props: Props) {
  return (
    <View style={styles.container}>
      <MainText text="Footer" colorMode={props.colorMode} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 60,
  },
});

export default Footer;
