import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';

import Profile from '../../app/profile/index';
import { useSelector } from 'react-redux';

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
}));

jest.mock('react-native-elements', () => {
  const React = require('react');
  const { TouchableOpacity, Text } = require('react-native');
  return {
    Button: ({ title, onPress }: { title: string; onPress?: () => void }) => (
      <TouchableOpacity onPress={onPress}>
        <Text>{title}</Text>
      </TouchableOpacity>
    ),
  };
});

const mockedUseSelector = useSelector as unknown as jest.Mock;

type ProfileTestState = {
  user: {
    user: {
      first_name: string;
      email: string;
      school_name: string;
      subjects: string;
    };
  };
};

const MOCK_USER = {
  first_name: 'Jane',
  email: 'jane.doe@school.edu',
  school_name: 'Green Valley School',
  subjects: 'Math, Science',
};

const DEFAULT_STATE: ProfileTestState = {
  user: { user: MOCK_USER },
};

const renderWithState = (state: ProfileTestState = DEFAULT_STATE) => {
  mockedUseSelector.mockImplementation((selector) => selector(state));
  return render(<Profile />);
};

describe('Profile screen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders profile title and section headings', () => {
    const { getByText } = renderWithState();

    expect(getByText('Profile')).toBeTruthy();
    expect(getByText('Profile Settings')).toBeTruthy();
    expect(getByText('Account Settings')).toBeTruthy();
  });

  it('displays user data from redux state', () => {
    const { getByDisplayValue } = renderWithState();

    expect(getByDisplayValue('Jane')).toBeTruthy();
    expect(getByDisplayValue('jane.doe@school.edu')).toBeTruthy();
    expect(getByDisplayValue('Green Valley School')).toBeTruthy();
    expect(getByDisplayValue('Math, Science')).toBeTruthy();
  });

  it('displays static profile fields', () => {
    const { getByDisplayValue } = renderWithState();

    expect(getByDisplayValue('28')).toBeTruthy();
    expect(getByDisplayValue('VII')).toBeTruthy();
    expect(getByDisplayValue('Yes')).toBeTruthy();
  });

  it('marks editable fields as editable', () => {
    const { getByDisplayValue } = renderWithState();

    expect(getByDisplayValue('Jane').props.editable).toBe(true);
    expect(getByDisplayValue('VII').props.editable).toBe(true);
    expect(getByDisplayValue('Math, Science').props.editable).toBe(true);
  });

  it('marks non-editable fields as read-only', () => {
    const { getByDisplayValue } = renderWithState();

    expect(getByDisplayValue('28').props.editable).toBe(false);
    expect(getByDisplayValue('Green Valley School').props.editable).toBe(false);
    expect(getByDisplayValue('jane.doe@school.edu').props.editable).toBe(false);
    expect(getByDisplayValue('********').props.editable).toBe(false);
    expect(getByDisplayValue('Yes').props.editable).toBe(false);
  });

  it('masks the change password field', () => {
    const { getByDisplayValue } = renderWithState();

    expect(getByDisplayValue('********').props.secureTextEntry).toBe(true);
  });

  it('renders Cancel and Save Changes buttons', () => {
    const { getByText } = renderWithState();

    expect(getByText('Cancel')).toBeTruthy();
    expect(getByText('Save Changes')).toBeTruthy();
  });

  it('allows pressing action buttons without crashing', () => {
    const { getByText } = renderWithState();

    fireEvent.press(getByText('Cancel'));
    fireEvent.press(getByText('Save Changes'));
  });

  it('renders all profile field labels', () => {
    const { getByText } = renderWithState();

    expect(getByText('First Name')).toBeTruthy();
    expect(getByText('Employee ID')).toBeTruthy();
    expect(getByText('Grade')).toBeTruthy();
    expect(getByText('Subjects')).toBeTruthy();
    expect(getByText('School')).toBeTruthy();
    expect(getByText('Email Address')).toBeTruthy();
    expect(getByText('Change Password')).toBeTruthy();
    expect(getByText('Availability')).toBeTruthy();
  });

  it('renders profile image section', () => {
    const { UNSAFE_getAllByType } = renderWithState();
    const images = UNSAFE_getAllByType(require('react-native').Image);

    expect(images.length).toBeGreaterThanOrEqual(1);
  });
});
