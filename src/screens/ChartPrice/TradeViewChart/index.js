import React, { useMemo, useRef } from 'react';
import { View } from 'react-native';

import { initChartBO, initSeriesBO, updateExpiration } from '@/html';
import { sourceHTMLByPlatform, parseDataToObject } from '@/utils/app';
import { useSignalEffect, bo_symbolPriceSignal } from '@/utils/signals';

import { WebSource } from '@/components/WebSource';

import { ExpirationRange } from './ExpirationRange';

import { styles } from './styles';

export const TradeViewChart = () => {
  const { source } = sourceHTMLByPlatform();

  const isArea = true;

  const setting = { type: 'area', interval: { value: '500ms', count: 100, timeUnit: 'millisecond' } };

  const webSourceRef = useRef(null);

  const isLoadSeriesReady = useRef(false);

  const isChartSeriesReady = useRef(false);

  const expirationRangeViewRef = useRef(null);

  const symbolAdjustSeriesViewRef = useRef(null);

  const _loadOptions = () => {
    webSourceRef.current?.injectJavaScript?.(updateExpiration());

    isChartSeriesReady.current = true;

    expirationRangeViewRef.current?.setReadyExpiration?.();
  }

  const _onMessage = event => {
    const eventData = event.nativeEvent?.data;

    const initConfig = JSON.stringify(setting);

    const item = parseDataToObject(eventData);

    if ((item?.eventType === 'readyChart')) webSourceRef.current?.injectJavaScript?.(initChartBO(initConfig, isArea));

    if (item?.eventType === 'initChartComplete') webSourceRef.current?.injectJavaScript?.(initSeriesBO());

    if (item?.eventType === 'initSeriesComplete') _loadOptions();

    console.log('item', item)
  }

  const _streamData = liveData => {
    if (!!liveData?.open_time && !!liveData?.close && !!isChartSeriesReady.current) {
      const data = JSON.stringify({ ...liveData, time: liveData.open_time, price: liveData.close });

      webSourceRef?.current?.injectJavaScript?.(`_createPointSubscription('${data}')`);
    }
  }

  useSignalEffect(() => {
    const liveData = bo_symbolPriceSignal.value;

    if (!liveData || !liveData?.open_time || !liveData?.close) return null;

    _streamData(liveData);
  }, []);

  const memoExpirationRange = useMemo(() => <ExpirationRange chartSeriesRef={webSourceRef} ref={expirationRangeViewRef} />, []);

  return (
    <View style={styles.container}>
      <WebSource source={source} onMessage={_onMessage} ref={webSourceRef} />

      {memoExpirationRange}
    </View>
  )

}
