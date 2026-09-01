import React from 'react';
import { act, fireEvent, waitFor } from '@testing-library/react-native';
import ClassworkModal from '@/components/Modals/ClassworkModal';
import { renderWithProviders } from '../test-utils/renderWithProviders';

jest.mock('@/components/PrepClass/WritePadView', () => () => null);

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

const baseProps = {
  visible: true,
  taskType: 'Classwork',
  selectedTask: null,
  onClose: jest.fn(),
  goBack: jest.fn(),
  goBackToTasksModal: jest.fn(),
  saveAICheckDetails: jest.fn(),
};

const renderModal = (props = {}) =>
  renderWithProviders(<ClassworkModal {...baseProps} {...props} />);

describe('Classwork modal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows Please fill all the details when Save is pressed without required fields', async () => {
    const saveAICheckDetails = jest.fn();
    const { findByText } = renderModal({ saveAICheckDetails });

    await act(async () => {
      fireEvent.press(await findByText('Save'));
    });

    expect(await findByText('Please fill all the details')).toBeTruthy();
    expect(saveAICheckDetails).not.toHaveBeenCalled();
  });

  it('saves classwork with title, time, marks and formula', async () => {
    const saveAICheckDetails = jest.fn().mockResolvedValue(undefined);
    const { findByPlaceholderText, findByText } = renderModal({ saveAICheckDetails });

    fireEvent.changeText(await findByPlaceholderText('Enter check title'), 'CW Ratios Check');
    fireEvent.changeText(await findByPlaceholderText('Type Here:'), 'a:b = c:d');
    await act(async () => {
      fireEvent.press(await findByText('Save'));
    });

    await waitFor(() => {
      expect(saveAICheckDetails).toHaveBeenCalledWith({
        title: 'CW Ratios Check',
        matchType: 'approx',
        time: 5,
        marks: 5,
        textInput: 'a:b = c:d',
        taskId: undefined,
      });
    });
  });

  it('keeps previous data when edit is cancelled', async () => {
    const selectedTask = {
      task_id: 55,
      title: 'CW Old',
      instructions: { textInput: 'old formula', marks: 5, time: 5 },
    };
    const { findByPlaceholderText, findByText, rerender } = renderModal({ selectedTask });

    fireEvent.changeText(await findByPlaceholderText('Enter check title'), 'CW Changed');
    fireEvent.press(await findByText('Cancel'));
    expect(baseProps.goBack).toHaveBeenCalled();

    await act(async () => {
      rerender(<ClassworkModal {...baseProps} selectedTask={{ ...selectedTask }} />);
    });

    expect((await findByPlaceholderText('Enter check title')).props.value).toBe('CW Old');
  });

  it('updates data when edited values are saved', async () => {
    const saveAICheckDetails = jest.fn().mockResolvedValue(undefined);
    const selectedTask = {
      task_id: 55,
      title: 'CW Old',
      instructions: { textInput: 'old formula', marks: 5, time: 5 },
    };
    const { findByPlaceholderText, findByText } = renderModal({ selectedTask, saveAICheckDetails });

    fireEvent.changeText(await findByPlaceholderText('Enter check title'), 'CW New');
    fireEvent.changeText(await findByPlaceholderText('Type Here:'), 'new formula');
    await act(async () => {
      fireEvent.press(await findByText('Save'));
    });

    await waitFor(() => {
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
});
