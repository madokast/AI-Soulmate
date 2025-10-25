import React from "react";
import { StyleSheet, View } from "react-native";

import MainText from "./base/main-text";

import { ColorMode } from "./ui/color-mode-manager";

interface Props {

}

function Header(props: Props) {
  return (
    <View style={styles.container}>
      <MainText text="Header" colorMode={ColorMode.Light} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 60,
  },
});

export default Header;
