import { Dimensions, Platform, StatusBar, TextStyle } from 'react-native';
import { hasNotch, hasDynamicIsland } from 'react-native-device-info';

import { isIOS } from '@/utils/app';

const { width, height } = Dimensions.get('window');
const isDynamicIsland = !!isIOS && hasDynamicIsland();
const androidVersion = +Platform.Version.toString?.()?.split?.('.')?.[0];

export const wWidth = width;
export const wHeight = height;

export const isHasUIEdgeToEdge = ((!!isIOS && hasNotch()) || !!isDynamicIsland) || (!isIOS && (androidVersion >= 35));
export const statusHeight = !isIOS ? ((StatusBar?.currentHeight || 32)) : !!isDynamicIsland ? 54 : !!isHasUIEdgeToEdge ? 48 : 22;

export const headerHeight = 52;
export const footerHeight = !!isHasUIEdgeToEdge ? 24 : 16;
export const styleProps = { flex: 1, backgroundColor: '#FFFFFF' };

export const fonts = {
  default: {
    normal700: { fontFamily: 'JetBrainsMono-Bold' } as TextStyle,
    normal600: { fontFamily: 'JetBrainsMono-SemiBold' } as TextStyle,
    normal500: { fontFamily: 'JetBrainsMono-Medium' } as TextStyle,
    normal400: { fontFamily: 'JetBrainsMono-Regular' } as TextStyle
  }
}
