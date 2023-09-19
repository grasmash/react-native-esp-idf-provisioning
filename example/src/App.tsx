import * as React from 'react';

import { StyleSheet, View, Text, Button } from 'react-native';
import {
  connect,
  createESPDevice,
  scanWifiList,
  searchESPDevices,
} from 'react-native-esp-idf-provisioning';
import {
  ESPSecurity,
  ESPTransport,
  type ESPDevice,
  type ESPWifiList,
  type ESPStatusResponse,
} from '../../src/types';

export default function App() {
  const [devices, setDevices] = React.useState<ESPDevice[]>();
  const [device, setDevice] = React.useState<ESPDevice>();
  const [response, setResponse] = React.useState<ESPStatusResponse>();
  const [wifiList, setWifiList] = React.useState<ESPWifiList[]>();

  const onSearchESPDevices = React.useCallback(async () => {
    try {
      const espDevices = await searchESPDevices(
        'ORBITAL_',
        ESPTransport.ble,
        ESPSecurity.secure
      );

      console.info(espDevices);
      setDevices(espDevices);
    } catch (error) {
      console.error(error);
    }
  }, []);

  const onCreateESPDevice = React.useCallback(async () => {
    try {
      if (!devices) {
        throw new Error('No devices in list');
      }

      if (!devices[0]) {
        throw new Error('No devices in list');
      }

      const proofOfPossesion = '2D2YDA6EPKKU';
      const espDevice = await createESPDevice(
        devices[0].name,
        ESPTransport.ble,
        ESPSecurity.secure,
        proofOfPossesion
      );
      console.info(espDevice);
      setDevice(espDevice);
    } catch (error) {
      console.error(error);
    }
  }, [devices]);

  const onConnect = React.useCallback(async () => {
    try {
      if (!device) {
        throw new Error('No device created');
      }

      const espResponse = await connect();
      console.info(espResponse);
      setResponse(espResponse);
    } catch (error) {
      console.error(error);
    }
  }, [device]);

  const onScanWifiList = React.useCallback(async () => {
    try {
      if (!device) {
        throw new Error('No device created');
      }

      const espWifiList = await scanWifiList();
      console.info(espWifiList);
      setWifiList(espWifiList);
    } catch (error) {
      console.error(error);
    }
  }, [device]);

  return (
    <View style={styles.container}>
      <Button onPress={onSearchESPDevices} title="Search ESP Devices" />
      <Button onPress={onCreateESPDevice} title="Create ESP device" />
      <Button onPress={onConnect} title="Connect to ESP device" />
      <Button onPress={onScanWifiList} title="Scan Wi-Fi List" />
      <Text>Devices: {JSON.stringify(devices)}</Text>
      <Text>Device: {JSON.stringify(device)}</Text>
      <Text>Response: {JSON.stringify(response)}</Text>
      <Text>WifiList: {JSON.stringify(wifiList)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});
