// types/custom-react-native-beacons-manager.d.ts

declare module 'react-native-beacons-manager' {
  interface BeaconsManager {
    detectIBeacons(): unknown;
    startMonitoringForRegion(region: {
      identifier: string;
      uuid: string;
      major: number;
      minor: number;
    }): unknown;
    startRangingBeaconsInRegion(region: {
      identifier: string;
      uuid: string;
      major: number;
      minor: number;
    }): unknown;
    startUpdatingLocation(): unknown;
    requestAlwaysAuthorization(): Promise<void>;
  }

  const beaconsManager: BeaconsManager;
  export default beaconsManager;
}
