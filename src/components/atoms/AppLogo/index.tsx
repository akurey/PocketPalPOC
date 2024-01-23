/* eslint-disable react/react-in-jsx-scope */
import {View, Text} from 'react-native';
import styles from './styles';
import {LocationPinIcon} from '../../../assets/icons';

export default function Logo() {
  return (
    <View style={styles.logoContainer}>
      <LocationPinIcon />
      <Text style={styles.logoText}>PocketPal</Text>
    </View>
  );
  // }
}
