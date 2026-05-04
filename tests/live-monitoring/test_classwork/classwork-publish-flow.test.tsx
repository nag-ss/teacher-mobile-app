import React from 'react';
import { act, fireEvent, render, waitFor } from '@testing-library/react-native';
import ClassWork from '@/components/live-monitoring/ClassWork';
import { useDispatch, useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import { publishClasswork } from '@/store/classSlice';

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
  publishClasswork: jest.fn((payload) => ({ type: 'classes/publishClasswork', payload })),
}));

jest.mock('@/store/liveMonitoringSlice', () => ({
  clearSelectedTaskData: jest.fn(() => ({ type: 'live/clearSelectedTaskData' })),
  getClassworkResults: jest.fn(() => ({ type: 'live/getClassworkResults' })),
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

jest.mock('@/components/Modals/ClassworkModal', () => {
  return function MockClassworkModal() {
    return null;
  };
});

const mockedUseDispatch = useDispatch as unknown as jest.Mock;
const mockedUseSelector = useSelector as unknown as jest.Mock;
const mockedUseFocusEffect = useFocusEffect as unknown as jest.Mock;
const mockedPublishClasswork = publishClasswork as unknown as jest.Mock;

const task = {
  task_id: 77,
  task_type: 'Classwork',
  title: 'CW Ratios',
  status: 'in_queue',
  status_name: 'In Queue',
  published_work_id: null,
  work_detail: { end_time: new Date().toISOString() },
};

describe('Classwork publish flow', () => {
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
      <ClassWork task={task} refreshTasks={jest.fn()} editTask={jest.fn()} deleteTask={jest.fn()} viewTask={jest.fn()} />
    );

    fireEvent.press(await findByText('Publish'));
    await findByText('Publish Classwork');

    fireEvent.press(await findByText('Cancel'));

    await waitFor(() => {
      expect(queryByText('Publish Classwork')).toBeNull();
    });
  });

  it('publishes when Publish is pressed in popup', async () => {
    const dispatchMock = jest.fn().mockResolvedValue({ payload: {} });
    mockedUseDispatch.mockReturnValue(dispatchMock);
    const refreshTasks = jest.fn();

    const { findByText, queryByText, getAllByText } = render(
      <ClassWork task={task} refreshTasks={refreshTasks} editTask={jest.fn()} deleteTask={jest.fn()} viewTask={jest.fn()} />
    );

    const publishButtons = getAllByText('Publish');
    fireEvent.press(publishButtons[publishButtons.length - 1]);
    await findByText('Publish Classwork');

    const popupPublishButtons = getAllByText('Publish');
    fireEvent.press(popupPublishButtons[popupPublishButtons.length - 1]);

    await waitFor(() => {
      expect(mockedPublishClasswork).toHaveBeenCalledWith({ task_id: 77 });
      expect(refreshTasks).toHaveBeenCalled();
      expect(queryByText('Publish Classwork')).toBeNull();
    });
  });

  it('shows Launching status after publish phase', async () => {
    mockedUseDispatch.mockReturnValue(jest.fn().mockResolvedValue({ payload: {} }));
    const launchingTask = {
      ...task,
      status: 'published',
      status_name: 'Launching',
      published_work_id: 1,
    };

    const { findAllByText } = render(
      <ClassWork task={launchingTask} refreshTasks={jest.fn()} editTask={jest.fn()} deleteTask={jest.fn()} viewTask={jest.fn()} />
    );

    const launchingLabels = await findAllByText('Launching');
    expect(launchingLabels.length).toBeGreaterThan(0);
  });

  it('shows ongoing timer until time is up', async () => {
    jest.useFakeTimers();
    mockedUseDispatch.mockReturnValue(jest.fn().mockResolvedValue({ payload: {} }));
    const inProgressTask = {
      ...task,
      status: 'in_progress',
      status_name: 'On Going',
      published_work_id: 1,
      work_detail: { end_time: new Date(Date.now() + 2000).toISOString() },
    };

    const { findByText, queryByText } = render(
      <ClassWork task={inProgressTask} refreshTasks={jest.fn()} editTask={jest.fn()} deleteTask={jest.fn()} viewTask={jest.fn()} />
    );

    await findByText('On Going');
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    await waitFor(() => {
      expect(queryByText(/Time Left:/)).toBeTruthy();
    });

    act(() => {
      jest.advanceTimersByTime(2000);
    });
    await waitFor(() => {
      expect(queryByText('Time up!')).toBeTruthy();
    });
    jest.useRealTimers();
  });

  it('shows Evaluating status after ongoing phase', async () => {
    mockedUseDispatch.mockReturnValue(jest.fn().mockResolvedValue({ payload: {} }));
    const evaluatingTask = {
      ...task,
      status: 'evaluating',
      status_name: 'Evaluating',
      published_work_id: 1,
    };

    const { findByText } = render(
      <ClassWork task={evaluatingTask} refreshTasks={jest.fn()} editTask={jest.fn()} deleteTask={jest.fn()} viewTask={jest.fn()} />
    );

    await findByText('Evaluating');
  });

  it('shows Evaluated status after evaluating is done', async () => {
    mockedUseDispatch.mockReturnValue(jest.fn().mockResolvedValue({ payload: {} }));
    const evaluatedTask = {
      ...task,
      status: 'evaluated',
      status_name: 'Evaluated',
      published_work_id: 1,
    };

    const { findAllByText } = render(
      <ClassWork task={evaluatedTask} refreshTasks={jest.fn()} editTask={jest.fn()} deleteTask={jest.fn()} viewTask={jest.fn()} />
    );

    const evaluatedLabels = await findAllByText('Evaluated');
    expect(evaluatedLabels.length).toBeGreaterThan(0);
  });

  it('changes CTA button text according to status', async () => {
    mockedUseDispatch.mockReturnValue(jest.fn().mockResolvedValue({ payload: {} }));
    const cases = [
      { status: 'in_queue', status_name: 'In Queue', expectedCta: 'Publish' },
      { status: 'published', status_name: 'Launching', expectedCta: 'Launching' },
      { status: 'in_progress', status_name: 'On Going', expectedCta: 'On Going' },
      { status: 'completed', status_name: 'Completed', expectedCta: 'Completed' },
      { status: 'evaluating', status_name: 'Evaluating', expectedCta: 'Evaluating' },
      { status: 'evaluated', status_name: 'Evaluated', expectedCta: 'Evaluated' },
      { status: 'loading', status_name: 'Loading', expectedCta: 'Loading' },
    ];

    for (const item of cases) {
      const { getAllByText, unmount } = render(
        <ClassWork
          task={{ ...task, status: item.status, status_name: item.status_name, published_work_id: 1 }}
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
