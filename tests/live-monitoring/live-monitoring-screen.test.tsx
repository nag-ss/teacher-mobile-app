import React from 'react';
import { useNavigation } from '@react-navigation/native';
import LiveMonitoring from '@/app/live-monitoring/index';
import { renderWithProviders } from '../test-utils/renderWithProviders';

jest.mock('react-native-webview', () => {
  const { View } = require('react-native');
  return { WebView: View };
});

jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
  useFocusEffect: jest.fn(),
}));

// Stub TaskSection — real one mounts ClassPrep + fires async getTeacherClassTasks on focus,
// which causes act(...) warnings in a sync smoke test.
jest.mock('@/components/live-monitoring/TaskSection', () => {
  const { Text, View } = require('react-native');
  return function MockTaskSection() {
    return (
      <View>
        <Text>AI Tasks</Text>
      </View>
    );
  };
});

const mockedUseNavigation = useNavigation as unknown as jest.Mock;

describe('Live monitoring screen', () => {
  beforeEach(() => {
    mockedUseNavigation.mockReturnValue({
      navigate: jest.fn(),
      setOptions: jest.fn(),
    });
  });

  it('renders task section, student grid, and sets navigation header', () => {
    const setOptions = jest.fn();
    mockedUseNavigation.mockReturnValue({ navigate: jest.fn(), setOptions });

    const { getByText } = renderWithProviders(<LiveMonitoring />, {
      preloadedState: {
        classes: {
          liveClass: {
            class_schedule_id: 1,
            teacher_id: 44,
            division_id: 7,
            subject_id: 3,
            division_name: 'VII',
            subject_name: 'Math',
          },
        },
        liveMonitor: {
          studentsData: [
            { student_id: 1, student_name: 'Akshay Sharma', status: 'Active' },
          ],
        },
      },
    });

    expect(getByText('AI Tasks')).toBeTruthy();
    expect(getByText('Students Overview')).toBeTruthy();
    expect(getByText('Akshay Sharma')).toBeTruthy();
    expect(getByText('VII - Math')).toBeTruthy();
    expect(setOptions).toHaveBeenCalled();
  });
});
