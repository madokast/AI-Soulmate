import React from "react";
import { StyleSheet, View } from "react-native";

import MainText from "./base/main-text";

import { ColorMode } from "./ui/color-mode-manager";

interface Props {
  colorMode: ColorMode;
}

function Header(props: Props) {
  return (
    <View style={styles.container}>
      <MainText text="Header" colorMode={props.colorMode} />
    </View>
  );
}

const HeaderHeight = 60;

const styles = StyleSheet.create({
  container: {
    height: HeaderHeight,
    alignItems: "center",
  },
});

export {Header, HeaderHeight};
