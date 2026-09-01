import React from 'react';
import { fireEvent } from '@testing-library/react-native';
import StudentCard from '@/components/live-monitoring/StudentCard';
import { renderWithProviders } from '../test-utils/renderWithProviders';

jest.mock('@/components/live-monitoring/StudentModal', () => {
  const { Text } = require('react-native');
  return function MockStudentModal({ visible }: { visible: boolean }) {
    return visible ? <Text>Attendance Result Modal</Text> : null;
  };
});

jest.mock('@/components/live-monitoring/SlipTestResult', () => {
  const { Text } = require('react-native');
  return function MockSlipTestResult({ visible }: { visible: boolean }) {
    return visible ? <Text>Slip Test Result Modal</Text> : null;
  };
});

jest.mock('@/components/live-monitoring/CWResult', () => {
  const { Text } = require('react-native');
  return function MockCWResult({ visible }: { visible: boolean }) {
    return visible ? <Text>Classwork Result Modal</Text> : null;
  };
});

jest.mock('@/components/live-monitoring/AIResult', () => {
  const { Text } = require('react-native');
  return function MockAIResult({ visible }: { visible: boolean }) {
    return visible ? <Text>AI Check Result Modal</Text> : null;
  };
});

jest.mock('@/components/live-monitoring/ProgressCircle', () => {
  const { Text } = require('react-native');
  return function MockProgressCircle() {
    return <Text>Progress</Text>;
  };
});

const baseStudent = {
  student_id: 1,
  student_name: 'Akshay Sharma',
  status: 'Active',
};

const renderStudentCard = (selectedTaskSection: string, student: Record<string, unknown> = baseStudent) =>
  renderWithProviders(<StudentCard student={student} />, {
    preloadedState: {
      liveMonitor: { selectedTaskSection },
      classes: { liveClass: {} },
    },
  });

describe('Student results', () => {
  it('opens attendance modal when Attendance task is selected', async () => {
    const { getByText, findByText } = renderStudentCard('Attendance');

    fireEvent.press(getByText('Akshay Sharma'));
    expect(await findByText('Attendance Result Modal')).toBeTruthy();
  });

  it('opens slip test modal when SlipTest task is selected', async () => {
    const { getByText, findByText } = renderStudentCard('SlipTest');

    fireEvent.press(getByText('Akshay Sharma'));
    expect(await findByText('Slip Test Result Modal')).toBeTruthy();
  });

  it('opens classwork modal when Classwork task is selected', async () => {
    const { getByText, findByText } = renderStudentCard('Classwork');

    fireEvent.press(getByText('Akshay Sharma'));
    expect(await findByText('Classwork Result Modal')).toBeTruthy();
  });

  it('opens AI check modal when AICheck task is selected', async () => {
    const { getByText, findByText } = renderStudentCard('AICheck');

    fireEvent.press(getByText('Akshay Sharma'));
    expect(await findByText('AI Check Result Modal')).toBeTruthy();
  });

  it('does not open any modal when no task section is selected', () => {
    const { getByText, queryByText } = renderStudentCard('');

    fireEvent.press(getByText('Akshay Sharma'));
    expect(queryByText('Attendance Result Modal')).toBeNull();
    expect(queryByText('Slip Test Result Modal')).toBeNull();
    expect(queryByText('Classwork Result Modal')).toBeNull();
    expect(queryByText('AI Check Result Modal')).toBeNull();
  });
});
