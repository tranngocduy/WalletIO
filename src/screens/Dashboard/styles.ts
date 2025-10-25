import { StyleSheet } from 'react-native';
import { statusHeight } from '@/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: statusHeight
  },
  scroll: {
    flexGrow: 1,
    padding: 16
  },
  item: {
    paddingTop: 12,
    paddingBottom: 12
  },
  label: {
    fontSize: 14,
    lineHeight: 21,
    color: '#000000'
  }
});
