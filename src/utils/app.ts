import { Platform, InteractionManager } from 'react-native';

export const isIOS = !!(Platform.OS === 'ios');

export const timeoutSleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

export const runAfterInteractions = (fn: Function, time: number = 0) => {
  let timer: NodeJS.Timeout;

  InteractionManager.runAfterInteractions(() => {
    timer = setTimeout(() => {
      if (!!fn && (typeof (fn) === 'function')) fn();
      clearTimeout(timer);
    }, time);
  });
}
