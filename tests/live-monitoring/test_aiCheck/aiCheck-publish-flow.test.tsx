import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import AITask from '@/components/live-monitoring/AITask';
import { useDispatch, useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import { launchAICheckTask } from '@/store/classSlice';

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

jest.mock('@react-navigation/native', () => ({
  useFocusEffect: jest.fn(),
}));

jest.mock('@/store/classSlice', () => ({
  addTaskToClass: jest.fn(),
  getTaskStatus: jest.fn(),
  launchAICheckTask: jest.fn((payload) => ({ type: 'classes/launchAICheckTask', payload })),
}));

jest.mock('@/store/liveMonitoringSlice', () => ({
  clearSelectedTaskData: jest.fn(() => ({ type: 'live/clearSelectedTaskData' })),
  getAITaskCheckResults: jest.fn(() => ({ type: 'live/getAITaskCheckResults' })),
  setSelectedTask: jest.fn((payload) => ({ type: 'live/setSelectedTask', payload })),
  setSelectedTaskData: jest.fn((payload) => ({ type: 'live/setSelectedTaskData', payload })),
  setSelectedTaskId: jest.fn((payload) => ({ type: 'live/setSelectedTaskId', payload })),
}));

jest.mock('react-native-paper', () => {
  const React = require('react');
  const { View, TouchableOpacity, Text } = require('react-native');
  return {
    Menu: ({ children }: any) => <View>{children}</View>,
    IconButton: ({ onPress }: any) => (
      <TouchableOpacity onPress={onPress}>
        <Text>IconButton</Text>
      </TouchableOpacity>
    ),
    Divider: () => <View />,
  };
});

jest.mock('@/components/Modals/Modal_4_AICheckModal', () => {
  return function MockAiCheckModal() {
    return null;
  };
});

const mockedUseDispatch = useDispatch as unknown as jest.Mock;
const mockedUseSelector = useSelector as unknown as jest.Mock;
const mockedUseFocusEffect = useFocusEffect as unknown as jest.Mock;
const mockedLaunchAICheckTask = launchAICheckTask as unknown as jest.Mock;

const task = {
  task_id: 77,
  task_type: 'AICheck',
  title: 'AI Ratios Check',
  status: 'in_queue',
  status_name: 'In Queue',
  class_schedule_id: 123,
};

describe('AI Check publish flow', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    let hasRunFocusEffect = false;
    mockedUseFocusEffect.mockImplementation((cb: any) => {
      if (!hasRunFocusEffect) {
        hasRunFocusEffect = true;
        cb();
      }
    });
    mockedUseSelector.mockImplementation((selector) =>
      selector({
        liveMonitor: { selectedTaskSection: '', classId: 123, selectedTaskId: null },
        user: { user: { id: 44 } },
        classes: { liveClass: {} },
      })
    );
  });

  it('closes publish popup when Cancel is pressed', async () => {
    const dispatchMock = jest.fn().mockResolvedValue({ payload: {} });
    mockedUseDispatch.mockReturnValue(dispatchMock);

    const { findByText, queryByText } = render(
      <AITask task={task} refreshTasks={jest.fn()} editTask={jest.fn()} deleteTask={jest.fn()} viewTask={jest.fn()} />
    );

    fireEvent.press(await findByText('Launch'));
    await findByText('Publish AI Check');

    fireEvent.press(await findByText('Cancel'));

    await waitFor(() => {
      expect(queryByText('Publish AI Check')).toBeNull();
    });
  });

  it('launches when Launch is pressed in popup', async () => {
    const dispatchMock = jest.fn().mockResolvedValue({ payload: { status: 'in_progress' } });
    mockedUseDispatch.mockReturnValue(dispatchMock);
    const refreshTasks = jest.fn();

    const { findByText, queryByText, getAllByText } = render(
      <AITask task={task} refreshTasks={refreshTasks} editTask={jest.fn()} deleteTask={jest.fn()} viewTask={jest.fn()} />
    );

    const launchButtons = getAllByText('Launch');
    fireEvent.press(launchButtons[launchButtons.length - 1]);
    await findByText('Publish AI Check');

    const popupLaunchButtons = getAllByText('Launch');
    fireEvent.press(popupLaunchButtons[popupLaunchButtons.length - 1]);

    await waitFor(() => {
      expect(mockedLaunchAICheckTask).toHaveBeenCalledWith({
        task_id: 77,
        class_schedule_id: 123,
      });
      expect(refreshTasks).toHaveBeenCalled();
      expect(queryByText('Publish AI Check')).toBeNull();
    });
  });

  it('shows In Queue status badge for queued task', async () => {
    mockedUseDispatch.mockReturnValue(jest.fn().mockResolvedValue({ payload: {} }));

    const { findByText } = render(
      <AITask task={task} refreshTasks={jest.fn()} editTask={jest.fn()} deleteTask={jest.fn()} viewTask={jest.fn()} />
    );

    await findByText('In Queue');
  });

  it('shows Evaluated status badge when task is evaluated', async () => {
    mockedUseDispatch.mockReturnValue(jest.fn().mockResolvedValue({ payload: {} }));
    const evaluatedTask = {
      ...task,
      status: 'evaluated',
      status_name: 'Evaluated',
    };

    const { findByText } = render(
      <AITask task={evaluatedTask} refreshTasks={jest.fn()} editTask={jest.fn()} deleteTask={jest.fn()} viewTask={jest.fn()} />
    );

    await findByText('Evaluated');
  });

  it('changes CTA button text according to status', async () => {
    mockedUseDispatch.mockReturnValue(jest.fn().mockResolvedValue({ payload: {} }));
    const cases = [
      { status: 'in_queue', status_name: 'In Queue', expectedCta: 'Launch' },
      { status: 'completed', status_name: 'Completed', expectedCta: 'Update Results' },
      { status: 'evaluated', status_name: 'Evaluated', expectedCta: 'View Results' },
      { status: 'in_progress', status_name: 'On Going', expectedCta: 'Update Results' },
    ];

    for (const item of cases) {
      let hasRunFocusEffect = false;
      mockedUseFocusEffect.mockImplementation((cb: any) => {
        if (!hasRunFocusEffect) {
          hasRunFocusEffect = true;
          cb();
        }
      });
      const { getAllByText, unmount } = render(
        <AITask
          task={{ ...task, status: item.status, status_name: item.status_name }}
          refreshTasks={jest.fn()}
          editTask={jest.fn()}
          deleteTask={jest.fn()}
          viewTask={jest.fn()}
        />
      );
      expect(getAllByText(item.expectedCta).length).toBeGreaterThan(0);
      unmount();
    }
  });
});
