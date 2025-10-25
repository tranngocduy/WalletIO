import React from 'react';
import { TouchableOpacity, Keyboard, TouchableOpacityProps, GestureResponderEvent } from 'react-native';

import { runAfterInteractions } from '@/utils/app';

export const TouchableView: React.FC<TouchableOpacityProps> = ({ children, activeOpacity, onPress, ...props }) => {

  const _onPress = (event: GestureResponderEvent) => {
    Keyboard?.dismiss?.();
    runAfterInteractions(() => onPress?.(event));
  }

  return (
    <TouchableOpacity {...props} activeOpacity={(activeOpacity || 0.5)} onPress={_onPress}>
      {children}
    </TouchableOpacity>
  )

}
