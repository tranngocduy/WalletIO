import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { View } from 'react-native';
import { WebView } from 'react-native-webview';

import { styles } from './styles';

type WebSourceProps = { source?: any, onMessage?: any }

export type WebSourceRefs = { injectJavaScript?: (params: any) => void };

export const WebSource = forwardRef<WebSourceRefs, WebSourceProps>(({ source, onMessage }, ref) => {
  const jsCode = `
    if (!!root && !!root.dispose && (typeof(root.dispose) === 'function')) root.dispose();
    if (!chart.isDisposed()) chart.events.off('panended', _handleSelection);
    if (!chart.isDisposed()) xAxis.offPrivate('selectionMax', _updateDateSelectionMax);
  `;

  const webViewRef = useRef<WebView>(null);

  const _onMessage = (params: any) => onMessage?.(params);

  const _injectJavaScript = (params: any) => webViewRef.current?.injectJavaScript?.(params);

  useImperativeHandle(ref, () => ({ injectJavaScript: _injectJavaScript }));

  useEffect(() => {
    return () => { webViewRef.current?.injectJavaScript?.(jsCode); };
  }, []);

  return (
    <View style={styles.container}>
      <WebView
        source={source}
        style={styles.view}
        containerStyle={styles.chart}

        scrollEnabled={false}
        scalesPageToFit={true}
        javaScriptEnabled={true}
        sharedCookiesEnabled={true}
        thirdPartyCookiesEnabled={true}
        allowFileAccessFromFileURLs={true}
        allowUniversalAccessFromFileURLs={true}

        originWhitelist={['*']}
        mixedContentMode='always'
        androidLayerType='hardware'

        onMessage={_onMessage}

        ref={webViewRef}
      />
    </View>
  )

});
