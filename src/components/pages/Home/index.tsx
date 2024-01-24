/**
 * Sample BLE React Native App
 */

import React, {useState, useEffect, Fragment} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  StatusBar,
  NativeModules,
  NativeEventEmitter,
  Platform,
  PermissionsAndroid,
  FlatList,
  TouchableHighlight,
  Pressable,
  ScrollView,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
  TextInput,
} from 'react-native';
import {Modal, Portal, ActivityIndicator} from 'react-native-paper';
import {
  COLOR_LIGHT_GRAY,
  COLOR_PRIMARY_DARK,
  COLOR_SECONDARY,
} from '../../../constants/theme';
import {DEVICENAME, SEARCHING} from '../../../constants/states';
import {
  MinusIcon,
  PlusIcon,
  ProfileIcon,
  SettingsIcon,
} from '../../../assets/icons';
import {RoundedButtonWithIcon} from '../../atoms';
import {useHome} from './useHome';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import styles from './styles';
import {Device, Header} from '../../molecules';
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

const Home = () => {
  const [peripheralSelected, setPeripheralSelected] = useState<Peripheral>();

  const {
    isScanning,
    isConnecting,
    compatibleDevicesModalVisible,
    addDeviceModalVisible,
    peripherals,
    peripheralConnected,
    newDeviceDistance,
    setNewDeviceDistance,
    newDeviceName,
    showAddDeviceModal,
    hideAddDeviceModal,
    setNewDeviceName,
    showCompatibleDevicesModal,
    hideCompatibleDevicesModal,
    togglePeripheralConnection,
    increaseDistance,
    decreaseDistance,
    sendSignalToTurnOnLED,
  } = useHome({});

  useEffect(() => {
    if (peripheralConnected) {
      // hideAddDeviceModal();
    }
  }, [peripheralConnected]);
  //console.debug('peripherals map updated', [...peripherals.entries()]);

  const onPressAddDevice = (item: any) => {
    setPeripheralSelected(item);
    showAddDeviceModal(item.name);
  };

  const onPressConnect = () => {
    if (peripheralSelected) {
      hideAddDeviceModal();
      togglePeripheralConnection(peripheralSelected);
    }
  };

  const renderItem = ({item}: {item: any}) => {
    return (
      <View style={styles.deviceIten}>
        <Text style={[styles.modalText, styles.deviceName]}>{item.name}</Text>
        <TouchableOpacity
          style={styles.addDeviceButton}
          onPress={() => onPressAddDevice(item)}>
          <Text style={[styles.modalText, styles.addButtonText]}>Add</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const {state} = useAppContext();

  const activeAlarm = () => {
    if (peripheralSelected) {
      sendSignalToTurnOnLED(peripheralSelected.id, 1);
    }
  };

  const deactiveAlarm = () => {
    if (peripheralSelected) {
      sendSignalToTurnOnLED(peripheralSelected.id, 0);
    }
  };
  return (
    <Fragment>
      <View style={styles.homeTopContainer}>
        <Header />
        <Text style={[styles.text, styles.greetingText]}>Hi User,</Text>
        <Text style={[styles.text, styles.welcomeText]}>Welcome!</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollView}>
        {isConnecting && <ConnectingDevice />}
        {peripheralConnected ? (
          <Device
            deviceName={DEVICENAME}
            alertDistance={10} //{parseInt(state.device.alertDistance, 10)}
            currentLocation={'With you'} //{currentDistance <= parseInt(state.device.alertDistance, 10)? 'With you': `${currentDistance.toFixed(2)} meters away.`}
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
        <TouchableOpacity onPress={activeAlarm}>
          <SettingsIcon />
        </TouchableOpacity>

        <View style={styles.addButtonContainer}>
          <RoundedButtonWithIcon
            disabled={state.device !== null}
            onClick={showCompatibleDevicesModal}
          />
        </View>
        <TouchableOpacity onPress={deactiveAlarm}>
          <ProfileIcon />
        </TouchableOpacity>
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
      <Portal>
        <Modal
          visible={addDeviceModalVisible}
          contentContainerStyle={styles.modal}
          dismissable={false}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={[styles.modalContainer, styles.addDeviceContainer]}>
              <Text style={[styles.modalText, styles.modalTitle]}>
                Add New Device
              </Text>
              <View style={styles.nameInputContainer}>
                <Text style={[styles.modalText, styles.deviceName]}>
                  Name Device
                </Text>
                <TextInput
                  style={[styles.input, styles.modalText, styles.inputText]}
                  onChangeText={setNewDeviceName}
                  value={newDeviceName}
                />
              </View>
              <View style={styles.distanceContainer}>
                <Text style={[styles.modalText, styles.deviceName]}>
                  Set Alert Distance (meters)
                </Text>
                <View style={styles.distanceControllerContainer}>
                  <TouchableOpacity
                    style={styles.distanceButton}
                    onPress={decreaseDistance}
                    disabled={newDeviceDistance === '1'}>
                    <MinusIcon
                      color={
                        newDeviceDistance === '1'
                          ? COLOR_LIGHT_GRAY
                          : COLOR_PRIMARY_DARK
                      }
                    />
                  </TouchableOpacity>
                  {/* todo: add validation */}
                  <TextInput
                    style={[
                      styles.input,
                      styles.modalText,
                      styles.distanceInput,
                    ]}
                    onChangeText={setNewDeviceDistance}
                    value={newDeviceDistance}
                    keyboardType="number-pad"
                  />
                  <TouchableOpacity
                    style={styles.distanceButton}
                    onPress={increaseDistance}
                    disabled={newDeviceDistance === '10'}>
                    <PlusIcon
                      height={20}
                      width={20}
                      color={
                        newDeviceDistance === '10'
                          ? COLOR_LIGHT_GRAY
                          : COLOR_PRIMARY_DARK
                      }
                    />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.buttonsContainer}>
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={hideAddDeviceModal}>
                  <Text style={[styles.modalText, styles.modalSubtitle]}>
                    Cancel
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.modalRightButton]}
                  onPress={onPressConnect}
                  disabled={newDeviceName === '' || newDeviceDistance === ''}>
                  <Text style={[styles.modalText, styles.modalButtonText]}>
                    Add
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </Portal>
    </Fragment>
  );
};

export default Home;
