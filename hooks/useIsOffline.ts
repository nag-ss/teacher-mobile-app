import { useNetInfo } from '@react-native-community/netinfo';

/** True when the device is offline / internet not reachable. */
export function useIsOffline() {
  const { isConnected, isInternetReachable, type } = useNetInfo();

  if (isConnected === false) return true;
  if (isInternetReachable === false) return true;
  if (type === 'none') return true;
  return false;
}
