import {StyleSheet} from 'react-native';
import {
  COLOR_PRIMARY,
  COLOR_PRIMARY_DARK,
  COLOR_WHITE,
} from '../../../constants/theme';

export default StyleSheet.create({
  deviceContainer: {
    borderRadius: 20,
    backgroundColor: COLOR_WHITE,
    display: 'flex',
    flexDirection: 'row',
    gap: 10,
    alignSelf: 'stretch',
    marginTop: 24,
  },
  locationIconContainer: {
    backgroundColor: COLOR_PRIMARY,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
  },
  deviceInfoContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: 23,
  },
  deviceName: {
    color: COLOR_PRIMARY_DARK,
    fontFamily: 'Helvetica',
    fontSize: 24,
    fontWeight: '700',
  },
  iconTextContainer: {
    display: 'flex',
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  deviceInfoText: {
    color: COLOR_PRIMARY_DARK,
    fontFamily: 'Helvetica',
    fontSize: 12,
    fontWeight: '400',
  },
  distanceInfoContainer: {
    display: 'flex',
    gap: 11,
  },
});
