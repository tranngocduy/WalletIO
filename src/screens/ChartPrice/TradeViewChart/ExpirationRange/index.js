import React, { useRef, forwardRef, useImperativeHandle } from 'react';
import { View } from 'react-native';

import { dayjs } from '@/utils/timeTz';

export const ExpirationRange = forwardRef(({ chartSeriesRef }, ref) => {

  const timeintervalRef = useRef(null);

  const _updateExpiration = expireAt => chartSeriesRef?.current?.injectJavaScript?.(`_updateExpiration('BTCUSDT', 1, ${expireAt})`);

  const _setReadyExpiration = () => {
    _updateExpiration(dayjs().endOf('minutes').valueOf());

    timeintervalRef.current = setInterval(() => { _updateExpiration(dayjs().endOf('minutes').valueOf()); }, 15000)
  };

  useImperativeHandle(ref, () => ({ setReadyExpiration: _setReadyExpiration }));

  return <View />;

});
