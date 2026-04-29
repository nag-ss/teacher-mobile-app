import React from 'react';
import { Alert } from 'react-native';
import { act, fireEvent, render, waitFor } from '@testing-library/react-native';

import Feedback from '../../app/feedback/index';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper', () => ({}), {
  virtual: true,
});

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
}));

jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
}));

jest.mock('@/store/feedbackSlice', () => {
  const mockSubmitFeedback = jest.fn((payload) => ({ type: 'feedback/submit', payload }));
  (mockSubmitFeedback as any).fulfilled = {
    match: jest.fn(),
  };
  return {
    __esModule: true,
    submitFeedback: mockSubmitFeedback,
  };
});

const mockedUseDispatch = useDispatch as unknown as jest.Mock;
const mockedUseNavigation = useNavigation as unknown as jest.Mock;
const mockedSubmitFeedback = require('@/store/feedbackSlice').submitFeedback as jest.Mock & {
  fulfilled: { match: jest.Mock };
};

const setup = ({
  response,
  isSuccess,
}: {
  response: unknown;
  isSuccess: boolean;
}) => {
  const dispatchMock = jest.fn().mockResolvedValue(response);
  const navigateMock = jest.fn();

  mockedUseDispatch.mockReturnValue(dispatchMock);
  mockedUseNavigation.mockReturnValue({ navigate: navigateMock });
  mockedSubmitFeedback.fulfilled.match.mockReturnValue(isSuccess);

  const utils = render(<Feedback />);
  return { ...utils, dispatchMock, navigateMock };
};

const goToLastPageAndSave = (getByText: (text: string) => any) => {
  fireEvent.press(getByText('Next'));
  fireEvent.press(getByText('Next'));
  fireEvent.press(getByText('Save'));
};

const fillForm = (utils: ReturnType<typeof setup>) => {
  fireEvent.changeText(utils.getByPlaceholderText('Please enter your name'), 'John');
  fireEvent.changeText(utils.getByPlaceholderText('Enter school name'), 'School');
  fireEvent.press(utils.getByText('Select role'));
  fireEvent.press(utils.getByText('Teacher'));
};

describe('Feedback flow', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    jest.spyOn(Alert, 'alert').mockImplementation(jest.fn());
  });

  afterEach(() => {
    act(() => {
      jest.runOnlyPendingTimers();
    });
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it('shows required field errors when user saves without required details', () => {
    const { getByText, getAllByPlaceholderText } = setup({ response: undefined, isSuccess: false });

    goToLastPageAndSave(getByText);

    expect(getAllByPlaceholderText('This field is required')).toHaveLength(2);
    expect(getByText('This field is required')).toBeTruthy();
  });

  it('opens submit modal when required fields are provided', () => {
    const utils = setup({ response: undefined, isSuccess: false });
    fillForm(utils);
    goToLastPageAndSave(utils.getByText);
    expect(utils.getByText('Submit Feedback')).toBeTruthy();
  });

  it('submits feedback and shows success modal on fulfilled response', async () => {
    const fulfilledAction = { type: 'feedback/submit/fulfilled', payload: { ok: true } };
    const utils = setup({ response: fulfilledAction, isSuccess: true });
    fillForm(utils);
    goToLastPageAndSave(utils.getByText);
    fireEvent.press(utils.getByText('Submit'));

    await waitFor(() => {
      expect(mockedSubmitFeedback).toHaveBeenCalled();
      expect(utils.dispatchMock).toHaveBeenCalled();
      expect(utils.getByText('Thank You!')).toBeTruthy();
    });

    act(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(utils.navigateMock).toHaveBeenCalledWith('Home');
  });

  it('shows alert when submit feedback fails', async () => {
    const rejectedAction = { type: 'feedback/submit/rejected', payload: { message: 'Request failed' } };
    const utils = setup({ response: rejectedAction, isSuccess: false });
    fillForm(utils);
    goToLastPageAndSave(utils.getByText);
    fireEvent.press(utils.getByText('Submit'));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Error', 'Request failed');
    });
  });
});
