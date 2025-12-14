import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';

import {launchImageLibrary, ImageLibraryOptions} from 'react-native-image-picker';

import { ColorMode } from '../ui/color-mode-manager';
import { LoggerFactory } from '../../internal/logger/logger';
import Media from '../../types/media';

import CustomImage from './custom-image';
import DefaultImage from './default-image-url';
import SmallText from './small-text';

const logger = LoggerFactory.getLogger('ImagePicker');

interface Props {
  id:string,
  colorMode: ColorMode;
  picked?:(medias:Media[]|null)=>void;
}

interface RichMedia extends Media {
  sizeKb: number;
  width: number;
  height: number;
  uri: string;
}

const ImageWidth = 100;
const selectionLimit = 9;

const defaultFirstImageSource = {
  name: 'default',
  uri:DefaultImage,
  width:ImageWidth,
  height:ImageWidth,
  sizeKb: 0,
}

function ImagePicker(props:Props) {
  const [images, setImages] = React.useState<RichMedia[]|null>(null);

  // select an image
  const pick = () => {
    const options:ImageLibraryOptions = {
      mediaType: 'mixed',
      quality: 1,
      videoQuality: 'high',
      selectionLimit: selectionLimit,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        logger.info('User cancelled image picker');
      } else if (response.errorCode) {
        logger.error('ImagePicker Error: ', response.errorMessage);
      } else {
        if (response.assets) {
          const medias = response.assets.map(asset => {
            if (asset.fileName && asset.uri) {
              return {
                name: asset.fileName,
                blob: urltoBlob(asset.uri),
                dataUrl: asset.uri,
                uri: asset.uri,
                sizeKb: (asset.fileSize ?? 0) / 1024.,
                width: ImageWidth,
                height: ImageWidth,
              }
            } else {
              return null
            }
          }).filter((media): media is RichMedia => media !== null);
          if (medias.length > 0) {
            props.picked?.(medias);
            setImages(medias);
          }
        }
      }
    });
  }

  const style = StyleSheet.create({
    container: {
      flexDirection: 'row',
    },
    firstImageStyle : {
      position: 'relative',
      width: ImageWidth,
      height: ImageWidth,
    }
  });

  const firstImage = images?.[0] || defaultFirstImageSource;

  const otherImagesView = images?.slice(1).map((image, index) => (<CustomImage
        key={index+1}
        width={ImageWidth}
        height={ImageWidth}
        source={image}
        colorMode={props.colorMode}
     />)) ?? []

  return (<View style={style.container}>
      <View id={`image-picker-${props.id}`} style={style.firstImageStyle}> 
        <CustomImage
          key={0}
          width={ImageWidth}
          height={ImageWidth}
          source={firstImage}
          onPress={pick}
          onLongPress={()=>setImages(null)}
          colorMode={props.colorMode}
        />
        <SmallText
          styles={{
            position: 'absolute',
            bottom: 0,
            left: 5,
          }}
          text={`${(firstImage.sizeKb).toFixed(2)}KB`}
          colorMode={props.colorMode}
        />
      </View>
          {otherImagesView}
    </View>
  )
}

async function urltoBlob(url: string): Promise<Blob> {
  const res = await fetch(url)
  return res.blob()
}

export default ImagePicker;