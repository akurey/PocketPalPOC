import {StyleSheet} from 'react-native';
import {COLOR_PRIMARY} from '../../../constants/theme';

export default StyleSheet.create({
  logoContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  logoText: {
    // fontFamily: 'AdventPro_700Bold',
    fontSize: 22.5,
    lineHeight: 32,
    color: COLOR_PRIMARY,
  },
});
