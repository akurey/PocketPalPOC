import {Dispatch, SetStateAction, useEffect, useState} from 'react';
import {
  NativeModules,
  NativeEventEmitter,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import {useAppContext} from '../../../App/App';
// import {encode} from 'base-64';
import ReactNativeBiometrics, {BiometryTypes} from 'react-native-biometrics';

const SECONDS_TO_SCAN_FOR = 3;
const SERVICE_UUIDS: string[] = [];
const ALLOW_DUPLICATES = true;

interface HomeProps {}

interface Hook {
  isAlert: boolean;
  isScanning: boolean;
  isConnecting: boolean;
  compatibleDevicesModalVisible: boolean;
  addDeviceModalVisible: boolean;
  peripherals: Map<string, Peripheral>;
  peripheralConnected: Peripheral | undefined;
  newDeviceDistance: string;
  setNewDeviceDistance: Dispatch<SetStateAction<string>>;
  newDeviceName: string;
  showAddDeviceModal: (peripheralName: string) => void;
  hideAddDeviceModal: () => void;
  setNewDeviceName: Dispatch<SetStateAction<string>>;
  showCompatibleDevicesModal: () => void;
  hideCompatibleDevicesModal: () => void;
  togglePeripheralConnection: (peripheral: Peripheral) => Promise<void>;
  handleAuthenticate: () => void;
  sendSignalToTurnOnLED: (peripheral: Peripheral, signal: number) => void;
  biometricsType: string;
}
import BleManager, {
  BleDisconnectPeripheralEvent,
  BleManagerDidUpdateValueForCharacteristicEvent,
  BleScanCallbackType,
  BleScanMatchMode,
  BleScanMode,
  Peripheral,
} from 'react-native-ble-manager';
const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

declare module 'react-native-ble-manager' {
  // enrich local contract with custom state properties needed by App.tsx
  interface Peripheral {
    connected?: boolean;
    connecting?: boolean;
  }
}

export function useHome({}: HomeProps): Hook {
  const {state: contextState, dispatch} = useAppContext();
  const [newDeviceName, setNewDeviceName] = useState('');
  const [compatibleDevicesModalVisible, setCompatibleDevicesModalVisible] =
    useState(false);
  const [addDeviceModalVisible, setAddDeviceModalVisible] = useState(false);
  const [newDeviceDistance, setNewDeviceDistance] = useState('2');
  const [isConnecting, setIsConnecting] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [peripherals, setPeripherals] = useState(
    new Map<Peripheral['id'], Peripheral>(),
  );
  const [peripheralConnected, setPeripheralConnected] = useState<Peripheral>();
  const [isAlert, setIsAlert] = useState(false);

  const [biometricsType, setBiometricsType] = useState('');

  const handleAuthenticate = async () => {
    try {
      const biometrics = new ReactNativeBiometrics({
        allowDeviceCredentials: true,
      });
      const {available, biometryType} = await biometrics.isSensorAvailable();
      if (available) {
        const result = await biometrics.simplePrompt({
          promptMessage: 'Authenticate',
        });
        if (result.success) {
          console.log('SUCCESS');
          if (peripheralConnected) {
            await BleManager.disconnect(peripheralConnected?.id);
          }
          setIsAlert(false);
          // Biometric authentication successful
        } else {
          console.log('FAIL');
          // Biometric authentication failed
        }
      } else {
        console.log('Biometrics not available');
        // Biometric authentication not available
        // fallback to username/password login
      }
    } catch (error) {
      console.error(error);
    }
  };

  const startScan = () => {
    if (!isScanning) {
      // reset found peripherals before scan
      setPeripherals(new Map<Peripheral['id'], Peripheral>());

      try {
        console.debug('[startScan] starting scan...');
        setIsScanning(true);
        BleManager.scan(SERVICE_UUIDS, SECONDS_TO_SCAN_FOR, ALLOW_DUPLICATES, {
          matchMode: BleScanMatchMode.Sticky,
          scanMode: BleScanMode.LowLatency,
          callbackType: BleScanCallbackType.AllMatches,
        })
          .then(() => {
            console.debug('[startScan] scan promise returned successfully.');
          })
          .catch((err: any) => {
            console.error('[startScan] ble scan returned in error', err);
          });
      } catch (error) {
        console.error('[startScan] ble scan error thrown', error);
      }
    }
  };

  const handleStopScan = () => {
    setIsScanning(false);
    console.debug('[handleStopScan] scan is stopped.');
  };

  const handleDisconnectedPeripheral = (
    event: BleDisconnectPeripheralEvent,
  ) => {
    console.debug(
      `[handleDisconnectedPeripheral][${event.peripheral}] disconnected.`,
    );
    setPeripherals(map => {
      let p = map.get(event.peripheral);
      if (p) {
        p.connected = false;
        return new Map(map.set(event.peripheral, p));
      }
      return map;
    });
  };

  const handleConnectPeripheral = (event: any) => {
    console.log(`[handleConnectPeripheral][${event.peripheral}] connected.`);
  };

  const handleUpdateValueForCharacteristic = (
    data: BleManagerDidUpdateValueForCharacteristicEvent,
  ) => {
    console.debug(
      `[handleUpdateValueForCharacteristic] received data from '${data.peripheral}' with characteristic='${data.characteristic}' and value='${data.value}'`,
    );
  };

  //Se ejecuta cada vez que se encuentra un peripheal
  const handleDiscoverPeripheral = (peripheral: Peripheral) => {
    if (peripheral.name) {
      setPeripherals(map => {
        return new Map(map.set(peripheral.id, peripheral));
      });
    }
  };

  const togglePeripheralConnection = async (peripheral: Peripheral) => {
    setIsConnecting(true);
    if (peripheral && peripheral.connected) {
      //Si el peripheral ya esta conectado entonces lo desconecta.
      try {
        await BleManager.disconnect(peripheral.id);
      } catch (error) {
        console.error(
          `[togglePeripheralConnection][${peripheral.id}] error when trying to disconnect device.`,
          error,
        );
      } finally {
        setIsConnecting(false);
      }
    } else {
      await connectPeripheral(peripheral);
    }
  };

  const connectPeripheral = async (peripheral: Peripheral) => {
    try {
      if (peripheral) {
        setPeripherals(map => {
          let p = map.get(peripheral.id);
          if (p) {
            p.connecting = true;
            return new Map(map.set(p.id, p));
          }
          return map;
        });

        await BleManager.connect(peripheral.id);
        console.debug(`[connectPeripheral][${peripheral.id}] connected.`);

        setPeripherals(map => {
          let p = map.get(peripheral.id);
          if (p) {
            p.connecting = false;
            p.connected = true;
            setPeripheralConnected(p);
            setIsConnecting(false);

            return new Map(map.set(p.id, p));
          }
          return map;
        });

        // before retrieving services, it is often a good idea to let bonding & connection finish properly
        await sleep(900);

        /* Test read current RSSI value, retrieve services first */
        await BleManager.retrieveServices(peripheral.id);

        const rssi = await BleManager.readRSSI(peripheral.id);
        console.debug(
          `[connectPeripheral][${peripheral.id}] retrieved current RSSI value: ${rssi}.`,
        );

        setPeripherals(map => {
          let p = map.get(peripheral.id);
          if (p) {
            p.rssi = rssi;
            setPeripheralConnected(p);
            setIsConnecting(false);
            return new Map(map.set(p.id, p));
          }
          return map;
        });
        await BleManager.disconnect(peripheral?.id);
      }
    } catch (error) {
      console.error(
        `[connectPeripheral][${peripheral.id}] connectPeripheral error`,
        error,
      );
    }
  };

  const sendSignalToTurnOnLED = async (
    peripheral: Peripheral,
    signal: number,
  ) => {
    try {
      if (signal > 0) {
        setIsAlert(true);
      }
      if (peripheral) {
        setPeripherals(map => {
          let p = map.get(peripheral.id);
          if (p) {
            p.connecting = true;
            return new Map(map.set(p.id, p));
          }
          return map;
        });

        await BleManager.connect(peripheral.id);
        console.debug(`[connectPeripheral][${peripheral.id}] connected.`);

        setPeripherals(map => {
          let p = map.get(peripheral.id);
          if (p) {
            p.connecting = false;
            p.connected = true;
            setPeripheralConnected(p);
            setIsConnecting(false);

            return new Map(map.set(p.id, p));
          }
          return map;
        });

        // before retrieving services, it is often a good idea to let bonding & connection finish properly
        await sleep(900);

        /* Test read current RSSI value, retrieve services first */
        const peripheralData = await BleManager.retrieveServices(peripheral.id);

        const services = peripheralData.services;
        const characteristics = peripheralData.characteristics;
        if (services?.length && characteristics?.length) {
          // activar alarma
          // Valor que se enviará para encender el LED (puede variar según la configuración del dispositivo)
          const valueToWrite = new Uint8Array([signal]); // Puedes ajustar este valor según las especificaciones del dispositivo
          // Convertir Uint8Array a un array de números
          const valueArray = Array.from(valueToWrite);
          // Escribir el valor en la característica correspondiente
          await BleManager.write(
            peripheral.id,
            services[services.length - 1].uuid,
            characteristics[characteristics.length - 1].characteristic,
            valueArray,
          );
        }
      }
    } catch (error) {
      console.error(
        `[connectPeripheral][${peripheral.id}] connectPeripheral error`,
        error,
      );
    }
  };

  function sleep(ms: number) {
    return new Promise<void>(resolve => setTimeout(resolve, ms));
  }

  useEffect(() => {
    try {
      BleManager.start({showAlert: false})
        .then(() => console.debug('BleManager started.'))
        .catch((error: any) =>
          console.error('BeManager could not be started.', error),
        );
    } catch (error) {
      console.error('unexpected error starting BleManager.', error);
      return;
    }

    const listeners = [
      bleManagerEmitter.addListener(
        'BleManagerDiscoverPeripheral',
        handleDiscoverPeripheral,
      ),
      bleManagerEmitter.addListener('BleManagerStopScan', handleStopScan),
      bleManagerEmitter.addListener(
        'BleManagerDisconnectPeripheral',
        handleDisconnectedPeripheral,
      ),
      bleManagerEmitter.addListener(
        'BleManagerDidUpdateValueForCharacteristic',
        handleUpdateValueForCharacteristic,
      ),
      bleManagerEmitter.addListener(
        'BleManagerConnectPeripheral',
        handleConnectPeripheral,
      ),
    ];

    handleAndroidPermissions();

    return () => {
      console.debug('[app] main component unmounting. Removing listeners...');
      for (const listener of listeners) {
        listener.remove();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAndroidPermissions = () => {
    if (Platform.OS === 'android' && Platform.Version >= 31) {
      PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      ]).then(result => {
        if (result) {
          console.debug(
            '[handleAndroidPermissions] User accepts runtime permissions android 12+',
          );
        } else {
          console.error(
            '[handleAndroidPermissions] User refuses runtime permissions android 12+',
          );
        }
      });
    } else if (Platform.OS === 'android' && Platform.Version >= 23) {
      PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      ).then(checkResult => {
        if (checkResult) {
          console.debug(
            '[handleAndroidPermissions] runtime permission Android <12 already OK',
          );
        } else {
          PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          ).then(requestResult => {
            if (requestResult) {
              console.debug(
                '[handleAndroidPermissions] User accepts runtime permission android <12',
              );
            } else {
              console.error(
                '[handleAndroidPermissions] User refuses runtime permission android <12',
              );
            }
          });
        }
      });
    }
  };

  const showCompatibleDevicesModal = () => {
    setCompatibleDevicesModalVisible(true);
    startScan();
  };

  const hideCompatibleDevicesModal = () => {
    setCompatibleDevicesModalVisible(false);
    handleStopScan();
  };

  const showAddDeviceModal = (peripheralName: string) => {
    setNewDeviceName(peripheralName);
    setAddDeviceModalVisible(true);
    setCompatibleDevicesModalVisible(false);
  };

  const hideAddDeviceModal = () => setAddDeviceModalVisible(false);

  return {
    isAlert,
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
    handleAuthenticate,
    sendSignalToTurnOnLED,
    biometricsType,
  };
}
