import React, { useEffect, useRef } from 'react';
import { View } from 'react-native';

import { parseDataToObject } from '@/utils/app';
import { bo_symbolPriceSignal } from '@/utils/signals';
import { createObservable } from '@/utils/createObservable';

export const WebsocketProvider = () => {

  const socketProviderRef = useRef(null);

  const _onOpen = () => console.log('@@@@@@@@@@ socket open!!');

  const _onClose = () => _disconnect('@@@@@@@@@@ socket close!!');

  const _onError = () => _disconnect('@@@@@@@@@@ socket error!!');

  const _onMessage = event => {
    const data = parseDataToObject(event?.data);
    bo_symbolPriceSignal.value = { open_time: data?.E, close: +data.c, high: +data.h, low: +data.l }; //volume: +data.v
  }

  const _loadSocket = () => {
    const socket = createObservable();

    if (!!socket) {
      socketProviderRef.current = socket;
      socketProviderRef.current?.addEventListener?.('open', _onOpen);
      socketProviderRef.current?.addEventListener?.('close', _onClose);
      socketProviderRef.current?.addEventListener?.('error', _onError);
      socketProviderRef.current?.addEventListener?.('message', _onMessage);
    }
  }

  useEffect(() => { _loadSocket() }, []);

  return <View />;

}
