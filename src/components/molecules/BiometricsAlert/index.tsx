import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import styles from './styles';
import {AlertIconModal, TouchIcon, FaceIcon} from '../../../assets/icons';
export interface BiometricsAlertProps {
  handleAuthenticate: () => void;
  biometricsType: string;
}
export default function BiometricsAlert({
  handleAuthenticate,
  biometricsType,
}: BiometricsAlertProps) {
  console.log(biometricsType);
  return (
    <>
      <View style={styles.container}>
        <Text style={[styles.text, styles.title]}>PocketPal Alert</Text>
        <View style={styles.alertIcon}>
          <AlertIconModal />
        </View>
        <Text style={[styles.text]}>
          Your distance alert has been activated
        </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => handleAuthenticate()}>
          <View>
            {biometricsType === 'faceid' ? <FaceIcon /> : <TouchIcon />}
          </View>
          <Text style={styles.buttonText}> Deactivate with biometrics</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}
