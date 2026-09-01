import mockAsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock';

jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage);

jest.mock('@expo/vector-icons', () => ({
  MaterialCommunityIcons: 'MaterialCommunityIcons',
  MaterialIcons: 'MaterialIcons',
}));

jest.mock('react-native-vector-icons/FontAwesome', () => 'FontAwesome');

jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

jest.mock('@/utils/SvgLoader', () => 'SvgLoader');

jest.mock('axios', () => ({
  __esModule: true,
  default: jest.fn(),
}));

import { resetAxiosMock } from './tests/test-utils/mockApi';

beforeEach(() => {
  jest.clearAllMocks();
  resetAxiosMock();
});
