import React, { useMemo, useRef } from 'react';
import { View } from 'react-native';

import { initChartBO, initSeriesBO, updateExpiration } from '@/html';
import { sourceHTMLByPlatform, parseDataToObject } from '@/utils/app';
import { useSignalEffect, bo_symbolPriceSignal } from '@/utils/signals';

import { WebSource } from '@/components/WebSource';

import { ExpirationRange } from './ExpirationRange';
import { ExpirationSeries } from './ExpirationSeries';
import SymbolSeriesRange from './SymbolSeriesRange';

import { styles } from './styles';

export const TradeViewChart = () => {
  const { source } = sourceHTMLByPlatform();

  // const setting = { type: 'candles', interval: { value: '1m', count: 10, timeUnit: 'minute' }  };

  const setting = { type: 'area', interval: { value: '500ms', count: 100, timeUnit: 'millisecond' } };

  const webSourceRef = useRef(null);

  const isLoadSeriesReady = useRef(false);

  const isChartSeriesReady = useRef(false);

  const expirationRangeViewRef = useRef(null);

  const expirationSeriesViewRef = useRef(null);

  const symbolSeriesRangeViewRef = useRef(null);

  const symbolAdjustSeriesViewRef = useRef(null);

  const _loadOptions = () => {
    webSourceRef.current?.injectJavaScript?.(updateExpiration());

    isChartSeriesReady.current = true;

    expirationRangeViewRef.current?.setReadyExpiration?.();
  }

  const _loadMoreChart = params => symbolSeriesRangeViewRef?.current?.loadMore?.(params);

  const _focusHistory = params => expirationSeriesViewRef.current?.focusHistory?.(params);

  const _onMessage = event => {
    const eventData = event.nativeEvent?.data;

    const initConfig = JSON.stringify(setting);

    const item = parseDataToObject(eventData);

    if ((item?.eventType === 'readyChart')) webSourceRef.current?.injectJavaScript?.(initChartBO(initConfig, (setting.type === 'area')));

    if (item?.eventType === 'initChartComplete') webSourceRef.current?.injectJavaScript?.(initSeriesBO());

    if (item?.eventType === 'initSeriesComplete') _loadOptions();

    if (item?.eventType === 'handleSelection') _loadMoreChart(item.data);

    if (item?.eventType === 'handleViewHistory') _focusHistory(item.data);
  }

  const _loadSeriesData = liveData => {
    if (!liveData?.open_time) return null;
    isLoadSeriesReady.current = true;
  }

  const _loadDataEmpty = (liveData) => {
    if (!liveData?.open_time) return null;
    symbolSeriesRangeViewRef.current?.loadDataEmpty?.(liveData);
  }

  const _streamData = liveData => {
    if (!!liveData?.open_time && !!liveData?.close && !!isChartSeriesReady.current) {
      const data = JSON.stringify({ ...liveData, time: liveData.open_time, price: liveData.close });

      webSourceRef?.current?.injectJavaScript?.(`_createPointSubscription('${data}')`);

      if (!isLoadSeriesReady.current) _loadSeriesData(liveData);
    }
  }

  useSignalEffect(() => {
    const liveData = bo_symbolPriceSignal.value;

    if (!!isLoadSeriesReady.current) _loadDataEmpty(liveData);

    if (!liveData || !liveData?.open_time || !liveData?.close) return null;

    _streamData(liveData);
  }, []);

  const memoExpirationRange = useMemo(() => <ExpirationRange chartSeriesRef={webSourceRef} ref={expirationRangeViewRef} />, []);

  const memoExpirationSeries = useMemo(() => <ExpirationSeries chartSeriesRef={webSourceRef} ref={expirationSeriesViewRef} />, []);

  const memoSymbolSeriesRange = useMemo(() => <SymbolSeriesRange chartSeriesRef={webSourceRef} ref={symbolSeriesRangeViewRef} />, []);

  return (
    <View style={styles.container}>
      <WebSource source={source} onMessage={_onMessage} ref={webSourceRef} />

      {memoExpirationRange}
      {memoExpirationSeries}
      {memoSymbolSeriesRange}
    </View>
  )

}
