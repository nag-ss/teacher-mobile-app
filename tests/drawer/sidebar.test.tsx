import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import Sidebar from '@/app/drawer/Sidebar';

jest.mock('expo-router', () => ({
  usePathname: jest.fn(() => '/Home'),
}));

jest.mock('@expo/vector-icons', () => ({
  MaterialCommunityIcons: 'MaterialCommunityIcons',
}));

const MENU_ROUTES = ['Home', 'Classes', 'Profile', 'Analitics', 'Logout', 'Feedback'] as const;

describe('Sidebar', () => {
  const navigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const pressMenuItem = (route: (typeof MENU_ROUTES)[number]) => {
    const { getByTestId } = render(<Sidebar navigation={{ navigate }} />);
    fireEvent.press(getByTestId(`sidebar-menu-${route}`));
  };

  it('navigates to Home when Home is pressed', () => {
    pressMenuItem('Home');
    expect(navigate).toHaveBeenCalledWith('Home');
  });

  it('navigates to Classes when Classes is pressed', () => {
    pressMenuItem('Classes');
    expect(navigate).toHaveBeenCalledWith('Classes');
  });

  it('navigates to Profile when Profile is pressed', () => {
    pressMenuItem('Profile');
    expect(navigate).toHaveBeenCalledWith('Profile');
  });

  it('navigates to Feedback when Feedback is pressed', () => {
    pressMenuItem('Feedback');
    expect(navigate).toHaveBeenCalledWith('Feedback');
  });

  it('navigates to Logout when Logout is pressed', () => {
    pressMenuItem('Logout');
    expect(navigate).toHaveBeenCalledWith('Logout');
  });
});
