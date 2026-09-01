import React from 'react';
import { fireEvent, waitFor } from '@testing-library/react-native';

import LiveClassCard from '@/components/dashboard/LiveClassCard';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { renderWithProviders } from '../test-utils/renderWithProviders';
import { setupAuthenticatedTest } from '../test-utils/setupTest';
import { mockAxiosResponse, mockedAxios } from '../test-utils/mockApi';

jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
  useFocusEffect: jest.fn(),
}));

const mockedUseNavigation = useNavigation as unknown as jest.Mock;
const mockedUseFocusEffect = useFocusEffect as unknown as jest.Mock;

const liveClassPayload = {
  class_schedule_id: 123,
  start_time: '09:00:00',
  end_time: '09:30:00',
  subject_name: 'Maths',
  class_details: [{ topic: 'Ratios', sub_topic: ['Basics'] }],
};

describe('LiveClassCard join now', () => {
  beforeEach(async () => {
    await setupAuthenticatedTest();
    let hasRunFocusEffect = false;
    mockedUseFocusEffect.mockImplementation((cb: () => void) => {
      if (!hasRunFocusEffect) {
        hasRunFocusEffect = true;
        cb();
      }
    });
  });

  it('navigates to live monitoring when Join now is pressed', async () => {
    mockAxiosResponse(liveClassPayload);
    const navigateMock = jest.fn();
    mockedUseNavigation.mockReturnValue({ navigate: navigateMock });

    const { getByText, store } = renderWithProviders(<LiveClassCard />, {
      preloadedState: {
        classes: { liveClass: liveClassPayload },
      },
    });

    await waitFor(() => {
      expect(getByText('Join now')).toBeTruthy();
    });

    fireEvent.press(getByText('Join now'));

    expect(store.getState().liveMonitor.classId).toBe(123);
    expect(store.getState().liveMonitor.selectedTaskSection).toBe('Attendance');
    expect(navigateMock).toHaveBeenCalledWith('live-monitoring');
  });

  it('shows Upcoming label when next class comes from schedule', async () => {
    mockAxiosResponse(null);
    mockAxiosResponse([
      {
        class_schedule_id: 456,
        start_time: '23:59:00',
        end_time: '23:59:30',
        subject_name: 'Science',
        class_details: [{ topic: 'Cells', sub_topic: ['Basics'] }],
      },
    ]);

    mockedUseNavigation.mockReturnValue({ navigate: jest.fn() });

    const { findByText } = renderWithProviders(<LiveClassCard />, {
      preloadedState: {
        classes: { liveClass: {}, classTimeline: [] },
      },
    });

    await findByText('Upcoming');
    expect(mockedAxios).toHaveBeenCalled();
  });

  it('shows empty state when no live or scheduled class exists', async () => {
    mockAxiosResponse(null);
    mockAxiosResponse(null);

    mockedUseNavigation.mockReturnValue({ navigate: jest.fn() });

    const { findByText } = renderWithProviders(<LiveClassCard />, {
      preloadedState: {
        classes: { liveClass: {}, classTimeline: [] },
      },
    });

    await findByText('No Classes Found Today');
  });
});
