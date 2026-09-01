import React from 'react';
import { act, fireEvent, waitFor } from '@testing-library/react-native';
import AiCheckModal from '@/components/Modals/Modal_4_AICheckModal';
import { renderWithProviders } from '../test-utils/renderWithProviders';

jest.mock('@/components/PrepClass/WritePadView', () => () => null);

jest.mock('react-native-radio-buttons-group', () => {
  const React = require('react');
  const { TouchableOpacity, Text, View } = require('react-native');
  return function MockRadioGroup({ onPress, selectedId }: any) {
    return (
      <View>
        <TouchableOpacity accessibilityLabel="exact-match" onPress={() => onPress('exact')}>
          <Text>Exact Match{selectedId === 'exact' ? ' selected' : ''}</Text>
        </TouchableOpacity>
        <TouchableOpacity accessibilityLabel="approx-match" onPress={() => onPress('approx')}>
          <Text>Approximate Match</Text>
        </TouchableOpacity>
      </View>
    );
  };
});

jest.mock('react-native-elements', () => ({
  CheckBox: () => null,
}));

const baseProps = {
  visible: true,
  taskType: 'AICheck',
  selectedTask: null,
  onClose: jest.fn(),
  goBack: jest.fn(),
  saveAICheckDetails: jest.fn(),
};

const renderModal = (props = {}) =>
  renderWithProviders(<AiCheckModal {...baseProps} {...props} />);

describe('AI Check modal', () => {
  it('shows Title is Required when Save is pressed without title', async () => {
    const saveAICheckDetails = jest.fn();
    const { findByText } = renderModal({ saveAICheckDetails });

    await act(async () => {
      fireEvent.press(await findByText('Save'));
    });

    expect(await findByText('Title is Required')).toBeTruthy();
    expect(saveAICheckDetails).not.toHaveBeenCalled();
  });

  it('saves AI check with exact match type when selected', async () => {
    const saveAICheckDetails = jest.fn().mockResolvedValue(undefined);
    const { findByPlaceholderText, findByText, getByLabelText } = renderModal({ saveAICheckDetails });

    fireEvent.changeText(await findByPlaceholderText('Enter check title'), 'Exact Match Check');
    fireEvent.changeText(await findByPlaceholderText('Type Here:'), 'x = 1');
    fireEvent.press(getByLabelText('exact-match'));
    await act(async () => {
      fireEvent.press(await findByText('Save'));
    });

    await waitFor(() => {
      expect(saveAICheckDetails).toHaveBeenCalledWith({
        title: 'Exact Match Check',
        checkType: 'Custom (Manual Input)',
        selectedId: 'exact',
        textInput: 'x = 1',
        taskId: undefined,
      });
    });
  });

  it('saves AI check with title, match type and text input', async () => {
    const saveAICheckDetails = jest.fn().mockResolvedValue(undefined);
    const { findByPlaceholderText, findByText } = renderModal({ saveAICheckDetails });

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
    const { findByPlaceholderText, findByText, rerender } = renderModal({ selectedTask });

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
    const { findByPlaceholderText, findByText } = renderModal({ selectedTask, saveAICheckDetails });

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
