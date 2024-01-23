/* eslint-disable react/react-in-jsx-scope */
import {View, Text, TouchableOpacity} from 'react-native';
import styles from './styles';
import {
  AlertIcon,
  CurrentLocationIcon,
  LocationIcon,
} from '../../../assets/icons';

export interface DeviceProps {
  deviceName: string;
  alertDistance: number;
  currentLocation: string;
  onPressAction?: () => void;
}

export default function Device({
  deviceName,
  alertDistance,
  currentLocation,
  onPressAction,
}: DeviceProps) {
  return (
    <TouchableOpacity
      style={styles.deviceContainer}
      onPress={onPressAction ? onPressAction : undefined}>
      <View style={styles.locationIconContainer}>
        <LocationIcon />
      </View>
      <View style={styles.deviceInfoContainer}>
        <Text style={styles.deviceName}>{deviceName}</Text>
        <View style={styles.distanceInfoContainer}>
          <View style={styles.iconTextContainer}>
            <AlertIcon />
            <Text style={styles.deviceInfoText}>
              Alert Distance: {alertDistance} meters
            </Text>
          </View>
          <View style={styles.iconTextContainer}>
            <CurrentLocationIcon />
            <Text style={styles.deviceInfoText}>
              Current Location: {currentLocation}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
