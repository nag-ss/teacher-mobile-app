import React from 'react';
import Home from '@/app/home/index';
import { renderWithProviders } from '../test-utils/renderWithProviders';

jest.mock('@/components/dashboard/LiveClassCard', () => {
  const { Text } = require('react-native');
  return function MockLiveClassCard() {
    return <Text>LiveClassCardStub</Text>;
  };
});

jest.mock('@/components/dashboard/Timeline', () => {
  const { Text } = require('react-native');
  return function MockTimeline() {
    return <Text>TimelineStub</Text>;
  };
});

describe('Home screen', () => {
  it('renders welcome header and main dashboard sections', () => {
    const { getByText } = renderWithProviders(<Home />, {
      preloadedState: {
        user: {
          user: {
            first_name: 'Jane',
            last_name: 'Doe',
            school_name: 'Green Valley School',
          } as never,
        },
      },
    });

    expect(getByText('Green Valley School')).toBeTruthy();
    expect(getByText('Welcome Jane Doe')).toBeTruthy();
    expect(getByText('Welcome back! Let’s make today a meaningful day of learning.')).toBeTruthy();
    expect(getByText('LiveClassCardStub')).toBeTruthy();
    expect(getByText('TimelineStub')).toBeTruthy();
    expect(getByText('Class Snapshot')).toBeTruthy();
    expect(getByText('Performance Summary')).toBeTruthy();
  });
});
