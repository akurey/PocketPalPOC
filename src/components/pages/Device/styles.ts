import {StyleSheet} from 'react-native';
import {
  COLOR_PRIMARY,
  COLOR_PRIMARY_DARK,
  COLOR_WHITE,
} from '../../../constants/theme';

export default StyleSheet.create({
  deviceScreen: {
    padding: 20,
  },
  name: {
    marginTop: 40,
    marginBottom: 32,
    color: COLOR_PRIMARY_DARK,
    fontFamily: 'Helvetica',
    fontSize: 24,
    fontWeight: '700',
  },
  actionsCard: {
    display: 'flex',
    gap: 10,
  },
  playSoundCard: {
    display: 'flex',
    gap: 10,
  },
  distanceCard: {
    display: 'flex',
    gap: 8,
  },
  alertDistanceCard: {
    display: 'flex',
    gap: 10,
  },
  twoColContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    gap: 16,
  },
  cardsContainer: {
    display: 'flex',
    gap: 13,
  },
  roundedIconContainer: {
    backgroundColor: COLOR_PRIMARY,
    borderRadius: 100,
    width: 48,
    height: 48,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTitle: {
    color: COLOR_WHITE,
    fontFamily: 'Helvetica',
    fontSize: 16,
    fontWeight: '700',
  },
  cardText: {
    color: COLOR_WHITE,
    fontFamily: 'Helvetica',
    fontSize: 12,
  },
  distanceTextsContainer: {
    display: 'flex',
    gap: 2,
  },
  separator: {
    borderTopWidth: 0.5,
    borderStyle: 'solid',
    borderColor: COLOR_WHITE,
  },
  editDistanceButton: {
    marginTop: 2,
  },
  buttonText: {
    color: COLOR_WHITE,
    fontFamily: 'Helvetica',
    fontSize: 14,
    fontWeight: '400',
  },
});
