/* eslint-disable react/react-in-jsx-scope */
import {View, Text, ActivityIndicator} from 'react-native';
import styles from './styles';
import {COLOR_WHITE} from '../../../constants/theme';

export default function ConnectingDevice({}) {
  return (
    <View style={styles.deviceContainer}>
      <View style={styles.locationIconContainer}>
        <ActivityIndicator
          animating={true}
          color={COLOR_WHITE}
          size={100}
          style={styles.activityIndicator}
        />
      </View>
      <View style={styles.deviceInfoContainer}>
        <Text style={styles.deviceName}>Connecting ...</Text>
        <View style={styles.distanceInfoContainer}></View>
      </View>
    </View>
  );
}
