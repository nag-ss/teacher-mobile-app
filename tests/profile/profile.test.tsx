import React from 'react';
import { fireEvent } from '@testing-library/react-native';

import Profile from '@/app/profile/index';
import { renderWithProviders } from '../test-utils/renderWithProviders';

jest.mock('react-native-elements', () => {
  const React = require('react');
  const { TouchableOpacity, Text } = require('react-native');
  return {
    Button: ({ title, onPress, testID }: { title: string; onPress?: () => void; testID?: string }) => (
      <TouchableOpacity testID={testID} onPress={onPress}>
        <Text>{title}</Text>
      </TouchableOpacity>
    ),
  };
});

const MOCK_USER = {
  first_name: 'Jane',
  email: 'jane.doe@school.edu',
  school_name: 'Green Valley School',
  subjects: 'Math, Science',
};

const renderProfile = () =>
  renderWithProviders(<Profile />, {
    preloadedState: {
      user: {
        user: MOCK_USER as never,
        isAuthenticated: true,
        userToken: 'token' as never,
      },
    },
  });

describe('Profile screen', () => {
  it('renders profile layout with headings, image, and action buttons', () => {
    const { getByText, UNSAFE_getAllByType } = renderProfile();
    const images = UNSAFE_getAllByType(require('react-native').Image);

    expect(getByText('Profile')).toBeTruthy();
    expect(getByText('Profile Settings')).toBeTruthy();
    expect(getByText('Account Settings')).toBeTruthy();
    expect(getByText('Cancel')).toBeTruthy();
    expect(getByText('Save Changes')).toBeTruthy();
    expect(images.length).toBeGreaterThanOrEqual(1);
  });

  it('displays user and static field values with correct editable states', () => {
    const { getByDisplayValue } = renderProfile();

    expect(getByDisplayValue('Jane').props.editable).toBe(true);
    expect(getByDisplayValue('VII').props.editable).toBe(true);
    expect(getByDisplayValue('Math, Science').props.editable).toBe(true);

    expect(getByDisplayValue('28').props.editable).toBe(false);
    expect(getByDisplayValue('Green Valley School').props.editable).toBe(false);
    expect(getByDisplayValue('jane.doe@school.edu').props.editable).toBe(false);
    expect(getByDisplayValue('Yes').props.editable).toBe(false);

    expect(getByDisplayValue('********').props.editable).toBe(false);
    expect(getByDisplayValue('********').props.secureTextEntry).toBe(true);
  });

  it('allows pressing Save Changes and Cancel without crashing', () => {
    const { getByTestId } = renderProfile();

    fireEvent.press(getByTestId('profile-cancel-button'));
    fireEvent.press(getByTestId('profile-save-button'));
  });

  it('exposes save and cancel buttons via testID', () => {
    const { getByTestId } = renderProfile();

    expect(getByTestId('profile-save-button')).toBeTruthy();
    expect(getByTestId('profile-cancel-button')).toBeTruthy();
  });
});
