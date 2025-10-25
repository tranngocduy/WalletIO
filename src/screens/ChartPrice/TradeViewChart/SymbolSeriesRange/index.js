import React, { useRef, forwardRef, useImperativeHandle, memo } from 'react';
import { View } from 'react-native';

import { dayjs } from '@/utils/timeTz';

const SymbolSeriesRange = forwardRef(({ chartSeriesRef }, ref) => {

  const dateMinRef = useRef(null);

  const timeBlurRef = useRef(null);

  const _symbolMarketHistory = async ({ startTime, endTime }) => {
    const response = await fetch(`https://api.binance.com/api/v3/klines?symbol=TRXUSDT&interval=1s&limit=60&startTime=${startTime}&endTime=${endTime}`);

    const result = await response.json();

    const candles = result?.map?.(item => ({ open_time: item?.[0], close: +item?.[1], high: +item?.[2], low: +item?.[3] }));


    dateMinRef.current = candles?.[0]?.open_time;

    return { data: { candles } };
  }

  const _loadDataEmpty = async (liveData) => {
    if (!timeBlurRef.current) {
      timeBlurRef.current = true;

      const endTime = liveData?.open_time;
      const startTime = dayjs().add(-1, 'minutes').valueOf();
      const result = await _symbolMarketHistory({ startTime, endTime });

      if (!!result?.data?.candles?.[0]) {
        const data = result?.data?.candles?.sort((a, b) => (a.open_time - b.open_time));
        const params = data?.map?.(item => ({ ...item, time: item.open_time, price: item.close })) || [];
        chartSeriesRef?.current?.injectJavaScript?.(`_insertSocketEmptyData('${JSON.stringify(params)}')`);
      }
    }
  }

  const _loadMore = async params => {
    const dateMin = params?.dateMin;

    if (!!dateMinRef.current && !!dateMin && (dateMin < dateMinRef.current)) {
      chartSeriesRef?.current?.injectJavaScript?.(`_handleOnRangeLoading(${dateMinRef.current})`);

      const result = await _symbolMarketHistory({ startTime: Math.floor(dateMin), endTime: dateMinRef.current });

      if (!!result?.data?.candles?.[0]) {
        const data = result?.data?.candles?.sort((a, b) => (a.open_time - b.open_time));
        const params = data?.map?.(item => ({ ...item, time: item.open_time, price: item.close })) || [];
        chartSeriesRef?.current?.injectJavaScript?.(`_insertSocketEmptyData('${JSON.stringify(params)}')`);
      }

      chartSeriesRef?.current?.injectJavaScript?.(`_handleOffRangeLoading()`);
    }
  }

  useImperativeHandle(ref, () => ({ loadMore: _loadMore, loadDataEmpty: _loadDataEmpty }));

  return <View />;

});

export default memo(SymbolSeriesRange, () => true);
