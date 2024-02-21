/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import React, {
  Dispatch,
  Reducer,
  createContext,
  useContext,
  useReducer,
  useState,
} from 'react';
import {
  DeviceEventEmitter,
  PermissionsAndroid,
  Platform,
  SafeAreaView,
  StatusBar,
  AppState as stateApp,
} from 'react-native';
import {useEffect} from 'react';
import styles from './styles';
import {Provider} from 'react-native-paper';
import {Home} from '../components/pages';
import Beacons from 'react-native-beacons-manager';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BackgroundService from 'react-native-background-actions';

interface DeviceData {
  device?: any;
  alertDistance: string;
  name: string;
  rwCharacteristic: any;
  isAlert?: boolean;
  rssi?: number;
}

interface AppState {
  device: DeviceData | null;
}

type AppAction = {type: 'SET_DEVICE'; payload: DeviceData};

interface AppContextType {
  state: AppState;
  dispatch: Dispatch<AppAction>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const initialState: AppState = {
  device: null,
};

const appReducer: Reducer<AppState, AppAction> = (state, action) => {
  switch (action.type) {
    case 'SET_DEVICE':
      return {...state, device: action.payload};
    default:
      return state;
  }
};

const requestBluetoothPermission = async () => {
  if (Platform.OS === 'ios') {
    return true;
  }
  if (
    Platform.OS === 'android' &&
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
  ) {
    const apiLevel = parseInt(Platform.Version.toString(), 10);
    if (apiLevel < 31) {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    if (
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN &&
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT
    ) {
      const result = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      ]);

      return (
        result['android.permission.BLUETOOTH_CONNECT'] ===
          PermissionsAndroid.RESULTS.GRANTED &&
        result['android.permission.BLUETOOTH_SCAN'] ===
          PermissionsAndroid.RESULTS.GRANTED &&
        result['android.permission.ACCESS_FINE_LOCATION'] ===
          PermissionsAndroid.RESULTS.GRANTED
      );
    }
  }

  // this.showErrorToast('Permission have not been granted')
  console.warn('Permission have not been granted');

  return false;
};

export interface Beacon {
  uuid: string;
  major: number;
  minor: number;
  rssi: number;
  proximity: string;
  accuracy: number;
}

function App(): React.JSX.Element {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const [currentDistance, setCurrentDistance] = useState(0);
  const [rssi, setRssi] = useState(0);
  const [timestamp, setTimestamp] = useState('');

  const sleep = (time: number | undefined) => {
    return new Promise(resolve => setTimeout(() => resolve(12), time));
  };

  const veryIntensiveTask = async (taskDataArguments: {delay: any}) => {
    // Example of an infinite loop task
    const {delay} = taskDataArguments;
    await new Promise(async resolve => {
      for (let i = 0; BackgroundService.isRunning(); i++) {
        await sleep(delay);
      }
    });
  };
  const options = {
    taskName: 'background task rssi beacons',
    taskTitle: 'background task rssi beacons',
    taskDesc: 'background task rssi beacons',
    // taskIcon: {
    //   name: 'ic_launcher',
    //   type: 'mipmap',
    // },
    // color: '#ff00ff',
    // linkingURI: '', // See Deep Linking for more info
    parameters: {
      delay: 3000,
    },
  };

  const initBackgroundFetch = async () => {
    await BackgroundService.start(veryIntensiveTask, options);
    await BackgroundService.updateNotification({
      taskDesc: 'New ExampleTask description',
    });
  };

  // Load data from AsyncStorage on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const deviceData = await AsyncStorage.getItem('deviceData');
        if (deviceData) {
          dispatch({type: 'SET_DEVICE', payload: JSON.parse(deviceData)});
        }
      } catch (error) {
        console.error('Error loading data from AsyncStorage:', error);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    const subscription = stateApp.addEventListener('change', nextAppState => {
      if (nextAppState === 'background') {
        initBackgroundFetch();
      }
      if (nextAppState === 'active') {
        BackgroundService.stop();
      }
      if (nextAppState === 'inactive') {
        initBackgroundFetch();
      }
    });

    return () => {
      subscription.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Save data to AsyncStorage whenever device changes
  useEffect(() => {
    const saveData = async () => {
      try {
        await AsyncStorage.setItem('deviceData', JSON.stringify(state.device));
      } catch (error) {
        console.error('Error saving data to AsyncStorage:', error);
      }
    };

    saveData();
  }, [state.device]);

  useEffect(() => {
    requestBluetoothPermission();
    rangeBeacons();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const rangeBeacons = async () => {
    const region = {
      identifier: 'ESP TAG APP',
      uuid: 'FDA50693-A4E2-4FB1-AFCF-C6EB07647825', // Why this is burned ?
      major: 10167,
      minor: 61958,
    };

    if (Platform.OS === 'android') {
      Beacons.detectIBeacons();
    } else {
      try {
        Beacons.requestAlwaysAuthorization();
        Beacons.startMonitoringForRegion(region);
      } catch (error) {
        console.error(`Beacons not started, error: ${error}`);
      }
    }

    try {
      await Beacons.startRangingBeaconsInRegion(region);
      console.log('📶 Beacons ranging started succesfully!');
    } catch (err) {
      console.error(`Beacons ranging not started, error: ${err}`);
    }

    if (Platform.OS === 'ios') {
      Beacons.startUpdatingLocation();
    }
  };

  useEffect(() => {
    DeviceEventEmitter.addListener('beaconsDidRange', ({beacons}) => {
      beacons.map((beacon: Beacon) => {
        if (
          beacon.rssi !== 0 &&
          beacon.uuid === 'FDA50693-A4E2-4FB1-AFCF-C6EB07647825' //For android use: //'fda50693-a4e2-4fb1-afcf-c6eb07647825'
        ) {
          const time = new Date();
          const opciones = {
            timeZone: 'America/Mexico_City', // Timezone: UTC-6
            hour12: true, // 24 Hours Format
          };
          const dateTimeUTC6 = time.toLocaleString('es-MX', opciones);
          setRssi(beacon.rssi);
          setTimestamp(dateTimeUTC6);
          const pathLossExponent = 2.0;
          const distance = Math.pow(
            10,
            (-69 - beacon.rssi) / (10 * pathLossExponent),
          );
          setCurrentDistance(distance);
        }
      });
    });

    DeviceEventEmitter.addListener('regionDidEnter', data => {
      console.log('regionDidEnter', data);
    });
    DeviceEventEmitter.addListener('regionDidExit', data => {
      console.log('regionDidExit', data);
    });
  }, []);

  return (
    <AppContext.Provider value={{state, dispatch}}>
      <Provider>
        <SafeAreaView style={styles.container}>
          <StatusBar />
          <Home
            rssi={rssi}
            currentDistance={currentDistance}
            timestamp={timestamp}
          />
        </SafeAreaView>
      </Provider>
    </AppContext.Provider>
  );
}

export default App;

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
