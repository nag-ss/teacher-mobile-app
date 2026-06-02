import React from 'react';
import { act, fireEvent, render, waitFor } from '@testing-library/react-native';
import TestSettingsModal from '@/components/Modals/Modal_6_SlipTestDetails';

jest.mock('react-native-vector-icons/MaterialIcons', () => 'MaterialIcons');

jest.mock('react-native-element-dropdown', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return {
    Dropdown: () => (
      <View>
        <Text>Dropdown</Text>
      </View>
    ),
  };
});

jest.mock('@react-native-community/slider', () => {
  const React = require('react');
  const { View } = require('react-native');
  return () => <View testID="difficulty-slider" />;
});

jest.mock('react-native-input-spinner', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return function MockInputSpinner() {
    return (
      <View>
        <Text>Spinner</Text>
      </View>
    );
  };
});

const baseProps = {
  visible: true,
  selectedTask: null,
  onClose: jest.fn(),
  generateSlipTest: jest.fn(),
};

describe('SlipTestSettingsModal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('submits title, time, marks, difficulty and question counts when Generate Test is pressed', async () => {
    const generateSlipTest = jest.fn();
    const { findByPlaceholderText, findByText } = render(
      <TestSettingsModal {...baseProps} generateSlipTest={generateSlipTest} />
    );

    fireEvent.changeText(await findByPlaceholderText('Enter Test title'), 'Slip Test Ratios');
    await act(async () => {
      fireEvent.press(await findByText('Generate Test'));
    });

    await waitFor(() => {
      expect(generateSlipTest).toHaveBeenCalledWith({
        duration: 10,
        marks: 10,
        difficulty: 5,
        mcqCount: 3,
        subCount: 2,
        totalQuestions: 5,
        title: 'Slip Test Ratios',
      });
    });
  });
});
