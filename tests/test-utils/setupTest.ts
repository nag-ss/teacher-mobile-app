import AsyncStorage from '@react-native-async-storage/async-storage';

export async function setupAuthenticatedTest(token = 'test-token') {
  await AsyncStorage.setItem('userToken', token);
}
