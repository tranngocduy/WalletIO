import React from 'react';
import { Text, TextProps, StyleProp, TextStyle } from 'react-native';

import { fonts } from '@/theme';

export const TextBase: React.FC<TextProps> = ({ children, ...props }) => {

  let style: StyleProp<TextStyle> = props.style || {};

  if (!(props.style as TextStyle).fontWeight) style = [style, fonts.default.normal400];

  if ((props.style as TextStyle).fontWeight === '400') style = [style, fonts.default.normal400];

  if ((props.style as TextStyle).fontWeight === '500') style = [style, fonts.default.normal500];

  if ((props.style as TextStyle).fontWeight === '600') style = [style, fonts.default.normal600];

  if ((props.style as TextStyle).fontWeight === '700') style = [style, fonts.default.normal700];

  return <Text {...props} style={style} allowFontScaling={false}>{children}</Text>;

}
