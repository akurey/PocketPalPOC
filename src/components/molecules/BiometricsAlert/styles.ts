import {StyleSheet} from 'react-native';
import {
  COLOR_PRIMARY,
  COLOR_PRIMARY_DARK,
  COLOR_WHITE,
} from '../../../constants/theme';

export default StyleSheet.create({
  homeTopContainer: {
    padding: 20,
  },
  text: {
    color: COLOR_PRIMARY_DARK,
    fontFamily: 'Helvetica',
    fontStyle: 'normal',
    fontWeight: '400',
    textAlign: 'center',
    width: 200,
    alignSelf: 'center',
    marginBottom: 30,
  },
  title: {
    fontWeight: '700',
    fontSize: 20,
    lineHeight: 23,
  },
  container: {
    paddingVertical: 45,
    paddingHorizontal: 30,
  },
  button: {
    backgroundColor: COLOR_PRIMARY,
    borderRadius: 37,
    justifyContent: 'center',
    display: 'flex',
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 32,
    gap: 10,
  },
  buttonText: {
    color: COLOR_WHITE,
    textAlign: 'center',
    fontSize: 16,
    verticalAlign: 'middle',
  },
  alertIcon: {
    alignSelf: 'center',
    marginBottom: 30,
  },
});
