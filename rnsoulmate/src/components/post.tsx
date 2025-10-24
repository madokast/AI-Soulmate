import React from "react";
import { JSX } from "react";
import { StyleSheet, View, Image } from "react-native";
import { ImageURISource } from "react-native";

import MainText from "./main-text";
import SmallText from "./small-text";
import { ColorMode } from "./ui/color-mode-manager";

interface Attachment {
  url: string;
}

interface Props {
  content: string;
  attachments: Attachment[];
  colorMode: ColorMode;
}

function Post(props: Props) {
  return (
    <View style={styles.container}>
      <MainText text={props.content} colorMode={props.colorMode} />
      {attachmentView(props.attachments)}
      <SmallText text="2025-10-24 17:44" colorMode={props.colorMode} />
    </View>
  );
}

function attachmentView(items: Attachment[]) {
  const eachOne = (item:Attachment) => {
    const imageSource: ImageURISource = { 
      uri: item.url,
      width: 80,
      height: 80,
    };
    return <Image key={item.url} source={imageSource} />;
  }

  return items.map(eachOne);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default Post;