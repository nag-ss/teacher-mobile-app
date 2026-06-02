import React from 'react';
import { act, fireEvent, render, waitFor } from '@testing-library/react-native';
import AiCheckModal from '@/components/Modals/Modal_4_AICheckModal';
import { useDispatch } from 'react-redux';

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
}));

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

jest.mock('react-native-vector-icons/FontAwesome', () => 'FontAwesome');
jest.mock('@/components/PrepClass/WritePadView', () => () => null);

jest.mock('react-native-radio-buttons-group', () => {
  const React = require('react');
  const { View } = require('react-native');
  return function MockRadioGroup() {
    return <View />;
  };
});

jest.mock('react-native-elements', () => ({
  CheckBox: () => null,
}));

const mockedUseDispatch = useDispatch as unknown as jest.Mock;

const baseProps = {
  visible: true,
  taskType: 'AICheck',
  selectedTask: null,
  onClose: jest.fn(),
  goBack: jest.fn(),
  saveAICheckDetails: jest.fn(),
};

describe('AICheckModal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedUseDispatch.mockReturnValue(jest.fn());
  });

  it('saves AI check with title, match type and text input', async () => {
    const saveAICheckDetails = jest.fn().mockResolvedValue(undefined);
    const { findByPlaceholderText, findByText } = render(
      <AiCheckModal {...baseProps} saveAICheckDetails={saveAICheckDetails} />
    );

    fireEvent.changeText(await findByPlaceholderText('Enter check title'), 'AI Ratios Check');
    fireEvent.changeText(await findByPlaceholderText('Type Here:'), 'a:b = c:d');
    await act(async () => {
      fireEvent.press(await findByText('Save'));
    });

    await waitFor(() => {
      expect(saveAICheckDetails).toHaveBeenCalledWith({
        title: 'AI Ratios Check',
        checkType: 'Custom (Manual Input)',
        selectedId: 'approx',
        textInput: 'a:b = c:d',
        taskId: undefined,
      });
    });
  });

  it('keeps previous data when edit is cancelled', async () => {
    const selectedTask = {
      task_id: 55,
      title: 'AI Old',
      instructions: { textInput: 'old formula', selectedId: 'approx' },
    };
    const { findByPlaceholderText, findByText, rerender } = render(
      <AiCheckModal {...baseProps} selectedTask={selectedTask} />
    );

    fireEvent.changeText(await findByPlaceholderText('Enter check title'), 'AI Changed');
    fireEvent.press(await findByText('Cancel'));
    expect(baseProps.goBack).toHaveBeenCalled();

    rerender(<AiCheckModal {...baseProps} selectedTask={{ ...selectedTask }} />);
    expect((await findByPlaceholderText('Enter check title')).props.value).toBe('AI Old');
  });

  it('updates data when edited values are saved', async () => {
    const saveAICheckDetails = jest.fn().mockResolvedValue(undefined);
    const selectedTask = {
      task_id: 55,
      title: 'AI Old',
      instructions: { textInput: 'old formula', selectedId: 'approx' },
    };
    const { findByPlaceholderText, findByText } = render(
      <AiCheckModal
        {...baseProps}
        selectedTask={selectedTask}
        saveAICheckDetails={saveAICheckDetails}
      />
    );

    fireEvent.changeText(await findByPlaceholderText('Enter check title'), 'AI New');
    fireEvent.changeText(await findByPlaceholderText('Type Here:'), 'new formula');
    await act(async () => {
      fireEvent.press(await findByText('Save'));
    });

    await waitFor(() => {
      expect(saveAICheckDetails).toHaveBeenCalledWith({
        title: 'AI New',
        checkType: 'Custom (Manual Input)',
        selectedId: 'approx',
        textInput: 'new formula',
        taskId: 55,
      });
    });
  });
});
