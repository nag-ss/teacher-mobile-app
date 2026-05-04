import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react-native';

import LiveClassCard from '@/components/dashboard/LiveClassCard';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
  useFocusEffect: jest.fn(),
}));

jest.mock('@/store/classSlice', () => ({
  getLiveClass: jest.fn(() => ({ type: 'classes/getLiveClass' })),
  getScheduleClasses: jest.fn(() => ({ type: 'classes/getScheduleClasses' })),
  setUnAuth: jest.fn(() => ({ type: 'classes/setUnAuth' })),
}));

jest.mock('@/store/authSlice', () => ({
  logout: jest.fn(() => ({ type: 'auth/logout' })),
}));

jest.mock('@/store/liveMonitoringSlice', () => ({
  setClassId: jest.fn((payload) => ({ type: 'liveMonitor/setClassId', payload })),
  setSelectedTask: jest.fn((payload) => ({ type: 'liveMonitor/setSelectedTask', payload })),
}));

const mockedUseDispatch = useDispatch as unknown as jest.Mock;
const mockedUseSelector = useSelector as unknown as jest.Mock;
const mockedUseNavigation = useNavigation as unknown as jest.Mock;
const mockedUseFocusEffect = useFocusEffect as unknown as jest.Mock;

describe('LiveClassCard join now', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockedUseFocusEffect.mockImplementation(() => {});

    const mockState = {
      classes: {
        liveClass: {
          class_schedule_id: 123,
          start_time: '09:00:00',
          end_time: '09:30:00',
          subject_name: 'Maths',
          class_details: [{ topic: 'Ratios', sub_topic: ['Basics'] }],
        },
        classTimeline: [],
        unAuthorised: false,
      },
    };
    mockedUseSelector.mockImplementation((selector) => selector(mockState));
  });

  it('navigates to live monitoring when Join now is pressed', async () => {
    const dispatchMock = jest.fn().mockResolvedValue({ payload: null });
    const navigateMock = jest.fn();

    mockedUseDispatch.mockReturnValue(dispatchMock);
    mockedUseNavigation.mockReturnValue({ navigate: navigateMock });

    const { getByText } = render(<LiveClassCard />);

    await waitFor(() => {
      expect(getByText('Join now')).toBeTruthy();
    });

    fireEvent.press(getByText('Join now'));

    expect(dispatchMock).toHaveBeenCalled();
    expect(navigateMock).toHaveBeenCalledWith('live-monitoring');
  });
});
