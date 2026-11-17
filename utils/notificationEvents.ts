import { DeviceEventEmitter } from 'react-native';

export const CLOSE_NOTIFICATIONS = 'close-notifications';

export const closeNotifications = () => {
  DeviceEventEmitter.emit(CLOSE_NOTIFICATIONS);
};
