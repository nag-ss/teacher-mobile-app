import React from 'react';
import { Alert } from 'react-native';
import { act, fireEvent, waitFor } from '@testing-library/react-native';

import Feedback from '@/app/feedback/index';
import { useNavigation } from '@react-navigation/native';
import { renderWithProviders } from '../test-utils/renderWithProviders';
import { mockAxiosError, mockAxiosResponse } from '../test-utils/mockApi';

jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper', () => ({}), {
  virtual: true,
});

jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
}));

jest.mock('react-native-vector-icons/AntDesign', () => 'AntDesign');

const mockedUseNavigation = useNavigation as unknown as jest.Mock;

const setup = () => {
  const navigateMock = jest.fn();
  mockedUseNavigation.mockReturnValue({ navigate: navigateMock });
  const utils = renderWithProviders(<Feedback />);
  return { ...utils, navigateMock };
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
    const utils = setup();

    goToLastPageAndSave(utils.getByText);

    expect(utils.getAllByPlaceholderText('This field is required')).toHaveLength(2);
    expect(utils.getByText('This field is required')).toBeTruthy();
  });

  it('submits feedback and shows success modal on fulfilled response', async () => {
    mockAxiosResponse({ ok: true });
    const utils = setup();
    fillForm(utils);
    goToLastPageAndSave(utils.getByText);
    fireEvent.press(utils.getByText('Submit'));

    await waitFor(() => {
      expect(utils.getByText('Thank You!')).toBeTruthy();
    });

    act(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(utils.navigateMock).toHaveBeenCalledWith('Home');
  });

  it('shows alert when submit feedback fails', async () => {
    mockAxiosError('Request failed', 401);
    const utils = setup();
    fillForm(utils);
    goToLastPageAndSave(utils.getByText);
    fireEvent.press(utils.getByText('Submit'));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalled();
    });
  });

  it('navigates between feedback pages with Previous and Next', () => {
    const utils = setup();
    fillForm(utils);

    expect(utils.getByText('Do you like using our teacher app in the class ?')).toBeTruthy();

    fireEvent.press(utils.getByText('Next'));
    expect(utils.getByText('Which feature did you like the most in the teacher app and why?')).toBeTruthy();

    fireEvent.press(utils.getByText('Previous'));
    expect(utils.getByText('Do you like using our teacher app in the class ?')).toBeTruthy();
  });
});
