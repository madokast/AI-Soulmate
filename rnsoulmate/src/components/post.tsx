import React from "react";
import { StyleSheet, View, Image } from "react-native";
import { ImageURISource } from "react-native";

import MainText from "./base/main-text";
import SmallText from "./base/small-text";
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
    <View style={[styles.container, styles[props.colorMode]]}>
      <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
        <View style={{flex:1}}><MainText text={props.content} colorMode={props.colorMode} /></View>
            {attachmentView(props.attachments, props.colorMode)}
        </View>
      <SmallText text="2025-10-24 17:44" colorMode={props.colorMode} />
    </View>
  );
}

function attachmentView(items: Attachment[], colorMode: ColorMode) {
  const eachOne = (item:Attachment) => {
    const imageSource: ImageURISource = { 
      uri: item.url,
      width: 78,
      height: 78,
    };
    return <View style={[styles.attachment, stylesAttachment[colorMode]]} >
        <Image key={item.url} source={imageSource} />
      </View>;
  }

  return items.map(eachOne);
}

const styles = StyleSheet.create({
  container: {
    alignItems: "flex-start",
    justifyContent: "center",
    padding: 5,
    borderRadius: 20,
    borderWidth: 3,
  },
  light: {
    backgroundColor: 'rgb(230, 230, 230)', // 白色背景，适合浅色模式
    borderColor: 'rgb(255, 255, 255)',
  },
  dark: {
    backgroundColor: 'rgb(30, 30, 30)', // 深灰色背景，适合深色模式
    borderColor: 'rgb(20, 20, 20)',
  },
  attachment: {
    borderWidth: 2,
    borderRadius: 2,
  }
});

const stylesAttachment = StyleSheet.create({
  light: {
    borderColor: 'rgb(230, 230, 230)', // 白色背景，适合浅色模式
  },
  dark: {
    borderColor: 'rgb(30, 30, 30)', // 深灰色背景，适合深色模式
  },
})

export default Post;