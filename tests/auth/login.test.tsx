import React from 'react';
import { fireEvent, waitFor } from '@testing-library/react-native';

import Login from '@/app/login/index';
import { renderWithProviders } from '../test-utils/renderWithProviders';
import { mockedAxios, mockAxiosResponse } from '../test-utils/mockApi';

describe('Login flow', () => {
  it('calls login API with entered credentials on Sign In', async () => {
    mockAxiosResponse({ access_token: 'new-token', refresh_token: 'refresh-token' });
    const { getByPlaceholderText, getByTestId } = renderWithProviders(<Login />);

    fireEvent.changeText(getByPlaceholderText('Username'), 'teacher.user');
    fireEvent.changeText(getByPlaceholderText('Enter your password'), 'secure-pass');
    fireEvent.press(getByTestId('sign-in-button'));

    await waitFor(() => {
      expect(mockedAxios).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'POST',
          data: expect.objectContaining({
            grant_type: 'password',
            username: 'teacher.user',
            password: 'secure-pass',
          }),
        })
      );
    });
  });

  it('shows error message when login error exists in state', () => {
    const { getByText } = renderWithProviders(<Login />, {
      preloadedState: {
        user: { error: 'Username or Password is wrong' },
      },
    });

    expect(getByText('Username or Password is wrong')).toBeTruthy();
  });

  it('does not show error message when login error is null', () => {
    const { queryByText } = renderWithProviders(<Login />);

    expect(queryByText('Username or Password is wrong')).toBeNull();
  });

  it('toggles password visibility when eye icon is pressed', () => {
    const { getByTestId } = renderWithProviders(<Login />);
    const passwordInput = getByTestId('password-input');
    const eyeToggleButton = getByTestId('toggle-password-visibility');

    expect(passwordInput.props.secureTextEntry).toBe(true);
    fireEvent.press(eyeToggleButton);
    expect(getByTestId('password-input').props.secureTextEntry).toBe(false);
  });

  it('fetches user details after login when token becomes available', async () => {
    mockAxiosResponse({ access_token: 'new-token', refresh_token: 'refresh-token' });
    mockAxiosResponse({ id: 44, name: 'Teacher User' });
    const { getByPlaceholderText, getByTestId, store } = renderWithProviders(<Login />);

    fireEvent.changeText(getByPlaceholderText('Username'), 'teacher.user');
    fireEvent.changeText(getByPlaceholderText('Enter your password'), 'secure-pass');
    fireEvent.press(getByTestId('sign-in-button'));

    await waitFor(() => {
      expect(store.getState().user.userToken).toBe('new-token');
      expect(store.getState().user.user?.name).toBe('Teacher User');
    });

    expect(mockedAxios).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'GET',
      })
    );
  });

  it('calls login API with empty credentials when Sign In is pressed without input', async () => {
    mockAxiosResponse({ access_token: 'new-token', refresh_token: 'refresh-token' });
    const { getByTestId } = renderWithProviders(<Login />);

    fireEvent.press(getByTestId('sign-in-button'));

    await waitFor(() => {
      expect(mockedAxios).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'POST',
          data: expect.objectContaining({
            grant_type: 'password',
            username: '',
            password: '',
          }),
        })
      );
    });
  });

  it('disables Sign In while login request is in progress', () => {
    const { getByTestId } = renderWithProviders(<Login />, {
      preloadedState: {
        user: { loading: true },
      },
    });

    expect(getByTestId('sign-in-button').props.accessibilityState?.disabled ?? getByTestId('sign-in-button').props.disabled).toBe(true);
  });

  it('sets loading state while login request is pending', async () => {
    mockedAxios.mockImplementation(() => new Promise(() => {}));
    const { getByPlaceholderText, getByTestId, store } = renderWithProviders(<Login />);

    fireEvent.changeText(getByPlaceholderText('Username'), 'teacher.user');
    fireEvent.changeText(getByPlaceholderText('Enter your password'), 'secure-pass');
    fireEvent.press(getByTestId('sign-in-button'));

    await waitFor(() => {
      expect(store.getState().user.loading).toBe(true);
    });
  });
});
