import { Platform } from 'react-native';

import fs from 'react-native-fs';

export const isIOS = !!(Platform.OS === 'ios');

export const timeoutSleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

export const sourceHTMLByPlatform = () => {
  const source = { uri: `${fs.MainBundlePath}/initChart.html` };
  return { source };
}
