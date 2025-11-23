import React from "react";
import { StyleSheet, View } from "react-native";

import MainText from "./base/main-text";
import SmallText from "./base/small-text";
import Attachment, { AttachmentWidth } from "./attachment";
import { LoggerFactory } from '../internal/logger/logger';

import { timestampToDateTime } from "../internal/data-time";
import { ColorMode } from "./ui/color-mode-manager";
import PostType from "../types/post";
import AttachmentType from "../types/attachment";

const logger = LoggerFactory.getLogger('Post');

interface Props {
  post: PostType
  colorMode: ColorMode;
  width: number;
}

function Post(props: Props) {
  const post = props.post;
  const time = timestampToDateTime(post.created_at);
  const id = post.id;

  const attachmentViews = attachmentView(post.attachments, props.colorMode);
  const attachmentWidth = attachmentViews.length * AttachmentWidth;

  logger.trace(`width: ${props.width}`);
  return (
    <View style={[styles.container, styles[props.colorMode]]}>
      <View style={{
        width: props.width - attachmentWidth,
        flex: 1,
      }}>
        <MainText text={post.content} colorMode={props.colorMode} />
        <SmallText text={`${time} #${id}`} colorMode={props.colorMode} />
      </View>
      <View>
        {attachmentViews}
      </View>
    </View>
  );
}

function attachmentView(items: AttachmentType[] | undefined, colorMode: ColorMode) {
  if (!items) {
    return [];
  }

  return items.map(attachment => Attachment({ attachment: attachment, colorMode: colorMode }));
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: "flex-start",
    justifyContent: "space-between",
    padding: 5,
    borderRadius: 20,
    borderWidth: 3,
  },
  light: {
    backgroundColor: 'rgb(210, 210, 210)', // 白色背景，适合浅色模式
    borderColor: 'rgb(255, 255, 255)',
  },
  dark: {
    backgroundColor: 'rgb(50, 50, 50)', // 深灰色背景，适合深色模式
    borderColor: 'rgb(48, 48, 48)',
  },
});

export default Post;