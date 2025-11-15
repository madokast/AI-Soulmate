import React from 'react';
import { View } from 'react-native';

import {launchImageLibrary, ImageLibraryOptions} from 'react-native-image-picker';

import { ColorMode } from '../ui/color-mode-manager';
import { LoggerFactory } from '../../internal/logger/logger';
import CustomImage from './custom-image';
import DefaultImage from './default-image-url';
const logger = LoggerFactory.getLogger('ImagePicker');

interface Props {
  id:string,
  colorMode: ColorMode;
}

const ImageWidth = 100;

function ImagePicker(props:Props) {
  const [imageUri, setImageUri] = React.useState<string>(DefaultImage);

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

  return (<View id={`image-picker-${props.id}`}>
      <CustomImage
        width={ImageWidth}
        height={ImageWidth}
        source={source}
        onPress={pick}
        onLongPress={()=>setImageUri(DefaultImage)}
        colorMode={props.colorMode}
      />
    </View>
  )
}


export default ImagePicker;