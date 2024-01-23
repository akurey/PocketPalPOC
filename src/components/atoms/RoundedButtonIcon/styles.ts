import {StyleSheet} from 'react-native';
import {COLOR_SECONDARY} from '../../../constants/theme';

export default StyleSheet.create({
  roundedButton: {
    backgroundColor: COLOR_SECONDARY,
    borderRadius: 100,
    width: 65,
    height: 65,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
