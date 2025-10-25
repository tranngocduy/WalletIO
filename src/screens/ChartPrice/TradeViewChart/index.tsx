import React, { useRef } from 'react';
import { View } from 'react-native';
import { WebViewMessageEvent } from 'react-native-webview';

import { initChartBO, initSeriesBO, updateExpiration } from '@/html';
import { runAfterInteractions, sourceHTMLByPlatform, parseDataToObject } from '@/utils/app';

import { WebSource, WebSourceRefs } from '@/components/WebSource';

import { styles } from './styles';

export const TradeViewChart: React.FC<{}> = () => {
  const { source } = sourceHTMLByPlatform();

  const isArea = true;

  const setting = { type: 'area', interval: { value: '500ms', count: 100, timeUnit: 'millisecond' } };

  const isChartSeriesReady = useRef(false);

  const webSourceRef = useRef<WebSourceRefs>(null);

  const expirationRangeViewRef = useRef(null);

  const _loadOptions = () => {
    webSourceRef.current?.injectJavaScript?.(updateExpiration());

    runAfterInteractions(() => {
      isChartSeriesReady.current = true;
    }, 1000);
  }

  const _onMessage = (event: WebViewMessageEvent) => {
    const eventData = event.nativeEvent?.data;

    const initConfig = JSON.stringify(setting);

    const item = parseDataToObject(eventData);

    if ((item?.eventType === 'readyChart')) webSourceRef.current?.injectJavaScript?.(initChartBO(initConfig, isArea));

    if (item?.eventType === 'initChartComplete') webSourceRef.current?.injectJavaScript?.(initSeriesBO());

    if (item?.eventType === 'initSeriesComplete') _loadOptions();

  }
  return (
    <View style={styles.container}>
      <WebSource source={source} onMessage={_onMessage} ref={webSourceRef} />

    </View>
  )

}
