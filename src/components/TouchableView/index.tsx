import React from 'react';
import { TouchableOpacity, Keyboard, TouchableOpacityProps, GestureResponderEvent } from 'react-native';

export const TouchableView: React.FC<TouchableOpacityProps> = ({ children, activeOpacity, onPress, ...props }) => {

  const _onPress = (event: GestureResponderEvent) => {
    onPress?.(event);
    Keyboard?.dismiss?.();
  }

  return (
    <TouchableOpacity {...props} activeOpacity={(activeOpacity || 0.5)} onPress={_onPress}>
      {children}
    </TouchableOpacity>
  )

}
