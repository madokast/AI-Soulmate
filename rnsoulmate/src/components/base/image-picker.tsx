import React from 'react';
import { View, StyleSheet } from 'react-native';

import {launchImageLibrary, ImageLibraryOptions} from 'react-native-image-picker';

import { ColorMode } from '../ui/color-mode-manager';
import { LoggerFactory } from '../../internal/logger/logger';
import CustomImage from './custom-image';
import DefaultImage from './default-image-url';
import SmallText from './small-text';

const logger = LoggerFactory.getLogger('ImagePicker');

interface Props {
  id:string,
  colorMode: ColorMode;
  picked?:(uri:string|null)=>void;
}

const ImageWidth = 100;

function ImagePicker(props:Props) {
  const [imageUri, setImageUri0] = React.useState<string>(DefaultImage);
  const [imageSize, setImageSize] = React.useState<number>(0);

  const setImageUri = (uri:string|null) => {
    setImageUri0(uri ?? DefaultImage);
    setImageSize(uri ? uri.length : 0);
    props.picked?.(uri); // 通知父组件图片已选择
  }

  // select an image
  const pick = () => {
    const options:ImageLibraryOptions = {
      mediaType: 'photo',
      quality: 1,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        logger.info('User cancelled image picker');
      } else if (response.errorCode) {
        logger.error('ImagePicker Error: ', response.errorMessage);
      } else {
        const uri = response.assets?.[0].uri || null;
        if (uri) {
          setImageUri(uri);
        } else {
          logger.error('ImagePicker Error: uri is null');
        }
      }
    });
  }

  const source = {
    uri:imageUri,
    width:ImageWidth,
    height:ImageWidth,
  }

  const parentStyle = {
    ...styles.parent,
    width: ImageWidth,
    height: ImageWidth,
  };

  return (<View id={`image-picker-${props.id}`} style={parentStyle}> 
      <CustomImage
        width={ImageWidth}
        height={ImageWidth}
        source={source}
        onPress={pick}
        onLongPress={()=>setImageUri(null)}
        colorMode={props.colorMode}
      />
      <SmallText
        styles={{
          position: 'absolute',
          bottom: 0,
          left: 5,
        }}
        text={`${(imageSize / 1024).toFixed(2)}KB`}
        colorMode={props.colorMode}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  parent: {
    position: 'relative',
  }
});


export default ImagePicker;