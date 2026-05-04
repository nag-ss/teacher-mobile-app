import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import ClassworkModal from '@/components/Modals/ClassworkModal';
import { useDispatch } from 'react-redux';

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
}));

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

jest.mock('react-native-vector-icons/FontAwesome', () => 'FontAwesome');
jest.mock('@/components/PrepClass/WritePadView', () => () => null);

jest.mock('react-native-reanimated', () => ({
  RotateInDownLeft: {},
}));

jest.mock('react-native-dropdown-picker', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return function MockDropDownPicker() {
    return (
      <View>
        <Text>Dropdown</Text>
      </View>
    );
  };
});

const mockedUseDispatch = useDispatch as unknown as jest.Mock;

const baseProps = {
  visible: true,
  taskType: 'Classwork',
  selectedTask: null,
  onClose: jest.fn(),
  goBack: jest.fn(),
  goBackToTasksModal: jest.fn(),
  saveAICheckDetails: jest.fn(),
};

describe('ClassworkModal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedUseDispatch.mockReturnValue(jest.fn());
  });

  it('saves classwork with title, time, marks and formula', async () => {
    const saveAICheckDetails = jest.fn();
    const { findByPlaceholderText, findByText } = render(
      <ClassworkModal {...baseProps} saveAICheckDetails={saveAICheckDetails} />
    );

    fireEvent.changeText(await findByPlaceholderText('Enter check title'), 'CW Ratios Check');
    fireEvent.changeText(await findByPlaceholderText('Type Here:'), 'a:b = c:d');
    fireEvent.press(await findByText('Save'));

    expect(saveAICheckDetails).toHaveBeenCalledWith({
      title: 'CW Ratios Check',
      matchType: 'approx',
      time: 5,
      marks: 5,
      textInput: 'a:b = c:d',
      taskId: undefined,
    });
  });

  it('keeps previous data when edit is cancelled', async () => {
    const selectedTask = {
      task_id: 55,
      title: 'CW Old',
      instructions: { textInput: 'old formula', marks: 5, time: 5 },
    };
    const { findByPlaceholderText, findByText, rerender } = render(
      <ClassworkModal {...baseProps} selectedTask={selectedTask} />
    );

    fireEvent.changeText(await findByPlaceholderText('Enter check title'), 'CW Changed');
    fireEvent.press(await findByText('Cancel'));
    expect(baseProps.goBack).toHaveBeenCalled();

    rerender(<ClassworkModal {...baseProps} selectedTask={{ ...selectedTask }} />);
    expect((await findByPlaceholderText('Enter check title')).props.value).toBe('CW Old');
  });

  it('updates data when edited values are saved', async () => {
    const saveAICheckDetails = jest.fn();
    const selectedTask = {
      task_id: 55,
      title: 'CW Old',
      instructions: { textInput: 'old formula', marks: 5, time: 5 },
    };
    const { findByPlaceholderText, findByText } = render(
      <ClassworkModal
        {...baseProps}
        selectedTask={selectedTask}
        saveAICheckDetails={saveAICheckDetails}
      />
    );

    fireEvent.changeText(await findByPlaceholderText('Enter check title'), 'CW New');
    fireEvent.changeText(await findByPlaceholderText('Type Here:'), 'new formula');
    fireEvent.press(await findByText('Save'));

    expect(saveAICheckDetails).toHaveBeenCalledWith({
      title: 'CW New',
      matchType: 'approx',
      time: 5,
      marks: 5,
      textInput: 'new formula',
      taskId: 55,
    });
  });
});
