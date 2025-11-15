import React from 'react';
import { View } from 'react-native';


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
  const id = `image-picker-${props.id}`
  const inputId = `${id}-input`
  const [imageUri, setImageUri] = React.useState<string>(DefaultImage);

  React.useEffect(() => {
    const imagePicker = document.getElementById(id);
    if (imagePicker) {
      const input = document.createElement('input');
      input.id = inputId;
      input.type = 'file';
      input.setAttribute('label', 'choose an image');
      input.accept = 'image/*';
      input.style.display = 'none';
      input.addEventListener('change', (e) => {
        logger.debug(`change input: ${inputId}`);
        const files = (e.target as HTMLInputElement).files;
        if (files && files.length > 0) {
          const file = files[0];
          const reader = new FileReader();
          reader.onloadend = () => {
            logger.info(`read image: ${file.name}`);
            setImageUri(reader.result as string);
          };
          reader.readAsDataURL(file);
        }
        // 重置输入框（下次选择同一文件可触发 change）
        input.value = '';
      });
      imagePicker.appendChild(input);
    }
    return () => {
      if (imagePicker) {
        const input = document.getElementById(inputId);
        if (input) {
          input.remove();
        }
      }
    }
  }, []);

  // select an image
  const pick = () => {
    const input = document.getElementById(inputId);
    if (input) {
      logger.debug(`click input: ${inputId}`);
      input.click();
    }
  }

  const source = {
    uri:imageUri,
    width:ImageWidth,
    height:ImageWidth,
  }

  return (<View id={id}>
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