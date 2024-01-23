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

declare module 'react-native-ble-manager' {
  // enrich local contract with custom state properties needed by App.tsx
  interface Peripheral {
    connected?: boolean;
    connecting?: boolean;
  }
}

const Home = () => {
  const {
    isScanning,
    compatibleDevicesModalVisible,
    connectionStatus,
    peripherals,
    peripheralConnected,
    showCompatibleDevicesModal,
    hideCompatibleDevicesModal,
    togglePeripheralConnection,
  } = useHome({});

  useEffect(() => {
    if (peripheralConnected) {
      console.log('🚀 ~ useEffect ~ peripheralConnected:', peripheralConnected);
      hideCompatibleDevicesModal();
    }
  }, [peripheralConnected]);
  //console.debug('peripherals map updated', [...peripherals.entries()]);

  const renderItem = ({item}: {item: any}) => {
    return (
      <View style={styles.deviceIten}>
        <Text style={[styles.modalText, styles.deviceName]}>{item.name}</Text>
        <TouchableOpacity
          style={styles.addDeviceButton}
          onPress={() => togglePeripheralConnection(item)}>
          <Text style={[styles.modalText, styles.addButtonText]}>Add</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const {state} = useAppContext();

  return (
    <Fragment>
      <View style={styles.homeTopContainer}>
        <Header />
        <Text style={[styles.text, styles.greetingText]}>Hi User,</Text>
        <Text style={[styles.text, styles.welcomeText]}>Welcome!</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollView}>
        {peripheralConnected ? (
          <Device
            deviceName={DEVICENAME}
            alertDistance={10}
            currentLocation={'With you'}
            onPressAction={() =>
              togglePeripheralConnection(peripheralConnected)
            }
          />
        ) : (
          <Fragment>
            <ErrorBoxImage style={styles.noDevicesImage} />
            <Text style={styles.noDevicesText}>
              You haven't registered any device
            </Text>
          </Fragment>
        )}
      </ScrollView>
      <View style={styles.homeButtonsContainer}>
        <SettingsIcon />
        <View style={styles.addButtonContainer}>
          <RoundedButtonWithIcon
            disabled={state.device !== null}
            onClick={showCompatibleDevicesModal}
          />
        </View>
        <ProfileIcon />
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
                  {/* <Text style={[styles.modalText, styles.deviceName]}>
                    {compatibleDevice?.name ||
                      compatibleDevice?.localName ||
                      'PocketPal'}
                  </Text> */}

                  {/* <TouchableOpacity
                    style={styles.addDeviceButton}
                    onPress={() => console.log('Add')}>
                    <Text style={[styles.modalText, styles.addButtonText]}>
                      Add
                    </Text>
                  </TouchableOpacity> */}
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
    </Fragment>
  );
};

export default Home;
