import React from 'react';
import { View } from 'react-native';

import { TradeViewChart } from './TradeViewChart';

import { styles } from './styles';

export const ChartPrice: React.FC<{}> = () => {

  return (
    <View style={styles.container}>
      <View style={{height: '70%'}}>
        <TradeViewChart />
      </View>
    </View>
  )

}
