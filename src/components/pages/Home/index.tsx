import React, {useState, useEffect, Fragment} from 'react';
import {View, Text, FlatList, ScrollView, TouchableOpacity} from 'react-native';
import {Modal, Portal, ActivityIndicator} from 'react-native-paper';
import {COLOR_SECONDARY} from '../../../constants/theme';
import {DEVICENAME} from '../../../constants/states';
import {ProfileIcon, SettingsIcon} from '../../../assets/icons';
import {RoundedButtonWithIcon} from '../../atoms';
import {useHome} from './useHome';
import styles from './styles';
import {BiometricsAlert, Device, Header} from '../../molecules';
import {ErrorBoxImage} from '../../../assets/images';
import {useAppContext} from '../../../App/App';

import {Peripheral} from 'react-native-ble-manager';
import ConnectingDevice from '../../molecules/Device/connectingDevice';

declare module 'react-native-ble-manager' {
  // enrich local contract with custom state properties needed by App.tsx
  interface Peripheral {
    connected?: boolean;
    connecting?: boolean;
  }
}
interface RssiData {
  rssi: number;
  currentDistance: number;
  timestamp: string;
}

const Home = ({rssi, currentDistance, timestamp}: RssiData) => {
  const [rssiDataList, setRssiDataList] = useState<RssiData[]>([]);
  const [averageDistance, setAverageDistance] = useState<String>('');

  const {
    isAlert,
    isScanning,
    isConnecting,
    compatibleDevicesModalVisible,
    peripherals,
    peripheralConnected,
    showAddDeviceModal,
    showCompatibleDevicesModal,
    hideCompatibleDevicesModal,
    togglePeripheralConnection,
    handleAuthenticate,
    sendSignalToTurnOnLED,
    biometricsType,
    peripheralSelected,
    setPeripheralSelected,
    sendSignalToTurnOffLED,
  } = useHome({});

  useEffect(() => {
    if (peripheralConnected) {
    }
  }, [peripheralConnected]);
  //
  useEffect(() => {
    if (rssi && currentDistance > 0 && timestamp.length) {
      const newRssiDataList = [
        ...rssiDataList.slice(-2), // Keep the last 29 records
        {rssi, currentDistance, timestamp},
      ];
      setRssiDataList(newRssiDataList);
      const totalRssi = newRssiDataList.reduce(
        (sum, data) => sum + data.rssi,
        0,
      );
      const totalDistance = newRssiDataList.reduce(
        (sum, data) => sum + data.currentDistance,
        0,
      );

      const averageRssi = totalRssi / newRssiDataList.length;
      console.debug('🛜 ~ average rssi:', averageRssi);
      const averageDistance = totalDistance / newRssiDataList.length;
      setAverageDistance(averageDistance.toFixed(2));

      if (averageRssi < -73) {
        activeAlarm();
      }
    }
  }, [rssi]);

  const onPressConnect = (item: any) => {
    setPeripheralSelected(item);
    showAddDeviceModal(item.name);
    togglePeripheralConnection(item);
  };

  const renderItem = ({item}: {item: any}) => {
    return (
      <View style={styles.deviceIten}>
        <Text style={[styles.modalText, styles.deviceName]}>{item.name}</Text>
        <TouchableOpacity
          style={styles.addDeviceButton}
          onPress={() => onPressConnect(item)}>
          <Text style={[styles.modalText, styles.addButtonText]}>Add</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const {state} = useAppContext();

  const activeAlarm = () => {
    if (peripheralSelected) {
      console.log('sendSignalToTurnOnLED', peripheralSelected, 1);
      sendSignalToTurnOnLED(peripheralSelected, 1);
    }
  };

  const deactiveAlarm = () => {
    if (peripheralSelected) {
      sendSignalToTurnOffLED(peripheralSelected);
      //sendSignalToTurnOnLED(peripheralSelected, 0);
    }
  };
  return (
    <Fragment>
      <View style={styles.homeTopContainer}>
        <Header />
        <Text style={[styles.text, styles.greetingText]}>Hi User,</Text>
        <Text style={[styles.text, styles.welcomeText]}>Welcome!</Text>
        <Portal>
          {/* {state.device && ( */}
          <Modal
            visible={isAlert}
            contentContainerStyle={styles.modal}
            dismissable={false}>
            <BiometricsAlert
              handleAuthenticate={handleAuthenticate}
              biometricsType={biometricsType}
            />
          </Modal>
          {/* )} */}
        </Portal>
      </View>
      <ScrollView contentContainerStyle={styles.scrollView}>
        {isConnecting && <ConnectingDevice />}
        {peripheralConnected ? (
          <Device
            deviceName={DEVICENAME}
            alertDistance={1.5} //{parseInt(state.device.alertDistance, 10)}
            currentLocation={`${averageDistance} meters away.`}
            onPressAction={() =>
              togglePeripheralConnection(peripheralConnected)
            }
          />
        ) : !isConnecting ? (
          <Fragment>
            <ErrorBoxImage style={styles.noDevicesImage} />
            <Text style={styles.noDevicesText}>
              You haven't registered any device
            </Text>
          </Fragment>
        ) : null}
      </ScrollView>
      <View style={styles.homeButtonsContainer}>
        {/* <TouchableOpacity onPress={activeAlarm}>
          <SettingsIcon />
        </TouchableOpacity> */}

        <View style={styles.addButtonContainer}>
          <RoundedButtonWithIcon
            disabled={state.device !== null}
            onClick={showCompatibleDevicesModal}
          />
        </View>
        {/* <TouchableOpacity onPress={deactiveAlarm}>
          <ProfileIcon />
        </TouchableOpacity> */}
      </View>
      {/* compatible devices modal */}
      <Portal>
        <Modal
          visible={compatibleDevicesModalVisible}
          contentContainerStyle={styles.modal}
          dismissable={false}>
          <View style={styles.modalContainer}>
            <Text style={[styles.modalText, styles.modalTitle]}>
              Compatible Devices
            </Text>
            {isScanning ? (
              <Fragment>
                <ActivityIndicator
                  animating={true}
                  color={COLOR_SECONDARY}
                  size={100}
                  style={styles.activityIndicator}
                />
                <Text style={[styles.modalText, styles.modalSubtitle]}>
                  Looking for devices
                </Text>
              </Fragment>
            ) : peripherals.size ? (
              <>
                <View style={styles.deviceContainer}>
                  <FlatList
                    data={Array.from(peripherals.values())}
                    contentContainerStyle={{rowGap: 8}}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                  />
                </View>
              </>
            ) : (
              <Fragment>
                <ErrorBoxImage
                  style={styles.modalErrorImage}
                  width={70}
                  height={79}
                  color={COLOR_SECONDARY}
                />
                <Text style={[styles.modalText, styles.notFoundText]}>
                  No compatible devices found
                </Text>
                <TouchableOpacity
                  style={styles.retryButton}
                  onPress={showCompatibleDevicesModal}>
                  <Text style={[styles.modalText, styles.modalButtonText]}>
                    Retry
                  </Text>
                </TouchableOpacity>
              </Fragment>
            )}
            <TouchableOpacity
              style={styles.modalCancelButton}
              onPress={hideCompatibleDevicesModal}>
              <Text style={[styles.modalText, styles.modalSubtitle]}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </Portal>
      {/* add device modal */}
    </Fragment>
  );
};

export default Home;
