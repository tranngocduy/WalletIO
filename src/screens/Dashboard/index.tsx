import React from 'react';
import { View, FlatList } from 'react-native';

import { useStackNavigation } from '@/hooks/useNavigation';

import { TextBase } from '@/components/TextBase';
import { TouchableView } from '@/components/TouchableView';
import { WebsocketProvider } from '@/components/WebsocketProvider';

import { styles } from './styles';

export const Dashboard: React.FC<{}> = () => {

  const { navigate } = useStackNavigation();

  const item = [{ label: 'Biểu đồ', page: 'ChartPrice' }];

  const _onPressPage = (page: any) => navigate(page);

  const _keyExtractor = (item: { label: string, page: string }) => `${item.page}`;

  const _renderItem = ({ item }: { item: { label: string, page: string } }) => {
    return <TouchableView style={styles.item} hitSlop={12} onPress={_onPressPage.bind(this, item.page)}><TextBase style={styles.label}>{item?.label}</TextBase></TouchableView>
  }

  return (
    <View style={styles.container}>
      <FlatList data={item} renderItem={_renderItem} keyExtractor={_keyExtractor} contentContainerStyle={styles.scroll} />

      <WebsocketProvider />
    </View>
  )

}
