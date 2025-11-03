import React from "react";
import { StyleSheet, View, Image } from "react-native";
import { ImageURISource } from "react-native";

import MainText from "./base/main-text";
import SmallText from "./base/small-text";
import Attachment from "./attachment";

import { ColorMode } from "./ui/color-mode-manager";
import { Post as PostType, Attachment as AttachmentType } from "../types/post";

interface Props {
  post: PostType
  colorMode: ColorMode;
}

function Post(props: Props) {
  const post = props.post;
  return (
    <View style={[styles.container, styles[props.colorMode]]}>
      <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
        <View style={{flex:1}}><MainText text={post.content} colorMode={props.colorMode} /></View>
            {attachmentView(post.attachments, props.colorMode)}
        </View>
      <SmallText text="2025-10-24 17:44" colorMode={props.colorMode} />
    </View>
  );
}

function attachmentView(items: AttachmentType[] | undefined, colorMode: ColorMode) {
  if (!items) {
    return [];
  }

  return items.map(attachment => Attachment({attachment:attachment, colorMode:colorMode}));
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
});

export default Post;