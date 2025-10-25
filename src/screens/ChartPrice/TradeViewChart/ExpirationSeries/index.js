import React, { useRef, forwardRef, useImperativeHandle, memo } from 'react';
import { View } from 'react-native';

import { TouchableView } from '@/components/TouchableView';

import styles from './styles';

export const ExpirationSeries = forwardRef(({ chartSeriesRef }, ref) => {

  const viewRef = useRef(null);

  const _onFocus = () => chartSeriesRef?.current?.injectJavaScript?.(`_jumpToLastView()`);

  const _focusHistory = params => {
    const isViewHistory = !!params?.isViewHistory;

    const opacity = !!isViewHistory ? 1 : 0;
    const pointerEvents = !isViewHistory ? 'none' : 'auto';
    viewRef.current?.setNativeProps?.({ opacity, pointerEvents });
  }

  useImperativeHandle(ref, () => ({ focusHistory: _focusHistory }));

  return (
    <View style={styles.container} pointerEvents='none' ref={viewRef}>
      <TouchableView style={styles.view} onPress={_onFocus}></TouchableView>
    </View>
  )

});
