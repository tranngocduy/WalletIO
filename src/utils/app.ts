import { Platform } from 'react-native';

import fs from 'react-native-fs';

export const isIOS = !!(Platform.OS === 'ios');

export const timeoutSleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

export const sourceHTMLByPlatform = () => {
  const source = { uri: `${fs.MainBundlePath}/initChart.html` };
  return { source };
}

export const parseDataToObject = (data: any) => {
  if (!data) return {};
  try {
    return JSON.parse(data);
  }
  catch (error) {
    return {};
  }
}
