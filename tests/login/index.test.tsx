import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react-native';

import Login from '../../app/login/index';
import { useDispatch, useSelector } from 'react-redux';
import { userDetails, userLogin } from '@/store/authSlice';

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

jest.mock('@/store/authSlice', () => ({
  userLogin: jest.fn((payload) => ({ type: 'auth/userLogin', payload })),
  userDetails: jest.fn((payload) => ({ type: 'auth/userDetails', payload })),
}));

jest.mock('@expo/vector-icons', () => ({
  MaterialCommunityIcons: 'MaterialCommunityIcons',
}));

const mockedUseDispatch = useDispatch as unknown as jest.Mock;
const mockedUseSelector = useSelector as unknown as jest.Mock;
const mockedUserLogin = userLogin as unknown as jest.Mock;
const mockedUserDetails = userDetails as unknown as jest.Mock;
type LoginTestState = {
  user: {
    userToken: string | null;
    error: string | null;
  };
};

const DEFAULT_STATE: LoginTestState = { user: { userToken: null, error: null } };

const setupDispatch = () => {
  const dispatchMock = jest.fn().mockResolvedValue(undefined);
  mockedUseDispatch.mockReturnValue(dispatchMock);
  return dispatchMock;
};

const renderWithState = (state: LoginTestState = DEFAULT_STATE) => {
  mockedUseSelector.mockImplementation((selector) => selector(state));
  return render(<Login />);
};

describe('Login flow', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('dispatches userLogin with entered credentials on Sign In', async () => {
    const dispatchMock = setupDispatch();
    const { getByPlaceholderText, getByTestId } = renderWithState();

    fireEvent.changeText(getByPlaceholderText('Username'), 'teacher.user');
    fireEvent.changeText(getByPlaceholderText('Enter your password'), 'secure-pass');
    fireEvent.press(getByTestId('sign-in-button'));

    expect(mockedUserLogin).toHaveBeenCalledWith({
      grant_type: 'password',
      username: 'teacher.user',
      password: 'secure-pass',
    });
    expect(dispatchMock).toHaveBeenCalledWith({
      type: 'auth/userLogin',
      payload: {
        grant_type: 'password',
        username: 'teacher.user',
        password: 'secure-pass',
      },
    });
  });

  it('dispatches userDetails when userToken exists', async () => {
    const dispatchMock = setupDispatch();
    renderWithState({ user: { userToken: 'token-123', error: null } });

    await waitFor(() => {
      expect(mockedUserDetails).toHaveBeenCalledWith('token-123');
      expect(dispatchMock).toHaveBeenCalledWith({
        type: 'auth/userDetails',
        payload: 'token-123',
      });
    });
  });

  it('shows error message when login error exists in state', () => {
    setupDispatch();
    const { getByText } = renderWithState({
      user: { userToken: null, error: 'Username or Password is wrong' },
    });

    expect(getByText('Username or Password is wrong')).toBeTruthy();
  });

  it('does not show error message when login error is null', () => {
    setupDispatch();
    const { queryByText } = renderWithState();

    expect(queryByText('Username or Password is wrong')).toBeNull();
  });

  it('toggles password visibility when eye icon is pressed', () => {
    setupDispatch();
    const { getByTestId } = renderWithState();
    const passwordInput = getByTestId('password-input');
    const eyeToggleButton = getByTestId('toggle-password-visibility');

    expect(passwordInput.props.secureTextEntry).toBe(true);
    fireEvent.press(eyeToggleButton);
    expect(getByTestId('password-input').props.secureTextEntry).toBe(false);
  });
});
