/* eslint-disable react/react-in-jsx-scope */
import {AlertIcon, CurrentLocationIcon, PlayIcon} from '../../../assets/icons';
import {COLOR_WHITE} from '../../../constants/theme';
import {Card, Header} from '../../molecules';
import styles from './styles';
import {Text, View, TouchableOpacity} from 'react-native';

export interface DeviceProps {
  deviceName: string;
  alertDistance: number;
  currentDistance: number;
}

export default function Device({
  deviceName,
  alertDistance,
  currentDistance,
}: DeviceProps) {
  return (
    <View style={styles.deviceScreen}>
      <Header />
      <Text style={styles.name}>{deviceName}</Text>
      <View style={styles.cardsContainer}>
        <View style={styles.twoColContainer}>
          <Card customStyle={styles.playSoundCard}>
            <TouchableOpacity
              style={styles.roundedIconContainer}
              // onPress={onClick}
            >
              <PlayIcon />
            </TouchableOpacity>
            <Text style={styles.cardTitle}>Play Sound</Text>
          </Card>
          <Card customStyle={styles.distanceCard}>
            <View style={styles.roundedIconContainer}>
              <CurrentLocationIcon width={24} height={24} color={COLOR_WHITE} />
            </View>
            <View style={styles.distanceTextsContainer}>
              <Text style={styles.cardTitle}>{currentDistance} meters</Text>
              <Text style={styles.cardText}>From you</Text>
            </View>
          </Card>
        </View>
        <Card customStyle={styles.alertDistanceCard}>
          <View style={styles.roundedIconContainer}>
            <AlertIcon width={24} height={24} color={COLOR_WHITE} />
          </View>
          <Text style={styles.cardTitle}>
            Alert Distance: {alertDistance} meters
          </Text>
          <View style={styles.separator} />
          <TouchableOpacity
            style={styles.editDistanceButton}
            // onPress={onClick}
          >
            <Text style={styles.buttonText}>Edit Distance</Text>
          </TouchableOpacity>
        </Card>
        <Card customStyle={styles.actionsCard}>
          <TouchableOpacity
          // onPress={onClick}
          >
            <Text style={styles.buttonText}>Rename Item</Text>
          </TouchableOpacity>
          <View style={styles.separator} />
          <TouchableOpacity
            style={styles.editDistanceButton}
            // onPress={onClick}
          >
            <Text style={styles.buttonText}>Delete Device</Text>
          </TouchableOpacity>
        </Card>
      </View>
    </View>
  );
}
