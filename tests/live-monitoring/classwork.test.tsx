import React, { useRef } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { act, fireEvent, waitFor } from '@testing-library/react-native';
import ClassPrep from '@/components/dashboard/ClassPrep';
import ClassWork from '@/components/live-monitoring/ClassWork';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { renderWithProviders } from '../test-utils/renderWithProviders';
import { createClassPrepState } from '../test-utils/defaultState';
import { mockAxiosResponse, mockClassPrepOpenApis, mockedAxios } from '../test-utils/mockApi';

jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
  useFocusEffect: jest.fn(),
}));

jest.mock('react-native-paper', () => {
  const React = require('react');
  const { View, TouchableOpacity, Text } = require('react-native');
  return {
    Menu: ({ children, visible, anchor }: any) => (
      <View>
        {anchor}
        {visible ? children : null}
      </View>
    ),
    IconButton: ({ onPress }: any) => (
      <TouchableOpacity accessibilityLabel="task-menu" onPress={onPress}>
        <Text>menu</Text>
      </TouchableOpacity>
    ),
    Divider: () => <View />,
  };
});

jest.mock('@/components/Modals/Modal_1_SummaryModal', () => {
  const { createSummaryModalMock } = require('../mocks/classPrepModals');
  return createSummaryModalMock();
});

jest.mock('@/components/Modals/Modal_2_ClassTaskModal', () => {
  const { createClassTaskModalMock } = require('../mocks/classPrepModals');
  return createClassTaskModalMock({ cardLabel: 'Classwork Card' });
});

jest.mock('@/components/Modals/Modal_3_CreateTaskModal', () => {
  const { createTaskModalMock } = require('../mocks/classPrepModals');
  return createTaskModalMock('Classwork');
});

jest.mock('@/components/Modals/ClassworkModal', () => {
  const { createClassworkModalShellMock } = require('../mocks/classPrepModals');
  return createClassworkModalShellMock();
});

const mockedUseNavigation = useNavigation as unknown as jest.Mock;
const mockedUseFocusEffect = useFocusEffect as unknown as jest.Mock;

const TEXT = {
  ADD_TASK_BUTTON: 'add-task-button',
  TASK_MODAL: 'Task Modal',
  PREPARE: 'Prepare for Class',
  NEXT: 'Next',
  CREATE: 'Create',
  CLASSWORK_POPUP: 'Class Work Check',
  CLASSWORK_CARD: 'Classwork Card',
  MORE: 'More',
  DELETE: 'Delete',
} as const;

const selectedClass = {
  class_schedule_id: 123,
  teacher_id: 11,
  division_id: 7,
  subject_id: 5,
  division_name: 'Grade 6',
  section_name: 'A',
  date: '2026-04-30',
  class_details: [{ topic: 'Ratios', sub_topic: ['Basics'] }],
};

const selectedClassWithoutTopic = {
  ...selectedClass,
  class_details: [],
};

const ClassPrepHarness = ({ selectedClassData = selectedClass }: { selectedClassData?: any }) => {
  const ref = useRef<any>(null);
  return (
    <>
      <TouchableOpacity
        accessibilityLabel={TEXT.ADD_TASK_BUTTON}
        onPress={() => ref.current?.setSelectedClass(true)}
      >
        <Text>Add Task</Text>
      </TouchableOpacity>
      <ClassPrep item={{}} selectedClass={selectedClassData} updateTopicSubTopic={jest.fn()} ref={ref} />
    </>
  );
};

const setup = (selectedClassData?: any) => {
  mockClassPrepOpenApis();
  mockedUseNavigation.mockReturnValue({ navigate: jest.fn(), setOptions: jest.fn() });
  return renderWithProviders(<ClassPrepHarness selectedClassData={selectedClassData} />, {
    preloadedState: createClassPrepState(),
  });
};

const openTaskModal = async (
  getByLabelText: (label: string) => any,
  findByText: (text: string) => Promise<any>
) => {
  fireEvent.press(getByLabelText(TEXT.ADD_TASK_BUTTON));
  await findByText(TEXT.TASK_MODAL);
};

const renderClassWork = (
  task: Record<string, unknown>,
  props: Partial<React.ComponentProps<typeof ClassWork>> = {}
) =>
  renderWithProviders(
    <ClassWork
      task={task as never}
      refreshTasks={jest.fn()}
      editTask={jest.fn()}
      deleteTask={jest.fn()}
      viewTask={jest.fn()}
      {...props}
    />,
    {
      preloadedState: {
        liveMonitor: { classId: 123, selectedTaskSection: '', selectedTaskId: '' },
        user: { user: { id: 44 } as never },
      },
    }
  );

describe('Classwork creation', () => {
  it('opens class work check popup when classwork create is pressed from task modal', async () => {
    const { getByLabelText, findByText } = setup();
    await openTaskModal(getByLabelText, findByText);
    fireEvent.press(await findByText(TEXT.CREATE));
    await findByText(TEXT.CLASSWORK_POPUP);
  });

  it('deletes classwork card when Delete is pressed from 3 dots options', async () => {
    const { getByLabelText, findByText, queryByText } = setup(selectedClassWithoutTopic);
    fireEvent.press(getByLabelText(TEXT.ADD_TASK_BUTTON));
    await findByText(TEXT.PREPARE);
    fireEvent.press(await findByText(TEXT.NEXT));
    await findByText(TEXT.CLASSWORK_CARD);
    fireEvent.press(await findByText(TEXT.MORE));
    fireEvent.press(await findByText(TEXT.DELETE));
    expect(queryByText(TEXT.CLASSWORK_CARD)).toBeNull();
  });
});

const publishTask = {
  task_id: 77,
  task_type: 'Classwork',
  title: 'CW Ratios',
  status: 'in_queue',
  status_name: 'In Queue',
  published_work_id: null,
  work_detail: { end_time: new Date().toISOString() },
};

describe('Classwork publish', () => {
  beforeEach(() => {
    let hasRunFocusEffect = false;
    mockedUseFocusEffect.mockImplementation((cb: any) => {
      if (!hasRunFocusEffect) {
        hasRunFocusEffect = true;
        cb();
      }
    });
  });

  it('publishes when Publish is pressed in popup', async () => {
    mockAxiosResponse({});
    const refreshTasks = jest.fn();

    const { findByText, queryByText, getByTestId } = renderClassWork(publishTask, { refreshTasks });

    fireEvent.press(getByTestId('classwork-publish-button'));
    await findByText('Publish Classwork');
    fireEvent.press(getByTestId('classwork-publish-confirm-button'));

    await waitFor(() => {
      expect(mockedAxios).toHaveBeenCalledWith(
        expect.objectContaining({
          url: expect.stringContaining('publish_classwork/77'),
        })
      );
      expect(refreshTasks).toHaveBeenCalled();
      expect(queryByText('Publish Classwork')).toBeNull();
    });
  });

  it('shows ongoing timer until time is up', async () => {
    jest.useFakeTimers();
    const inProgressTask = {
      ...publishTask,
      status: 'in_progress',
      status_name: 'On Going',
      published_work_id: 1,
      work_detail: { end_time: new Date(Date.now() + 2000).toISOString() },
    };

    const { findByText, queryByText } = renderClassWork(inProgressTask);

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

  it('changes CTA button text according to status', async () => {
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
      const { getAllByText, unmount } = renderClassWork({
        ...publishTask,
        status: item.status,
        status_name: item.status_name,
        published_work_id: 1,
      });
      expect(getAllByText(item.expectedCta).length).toBeGreaterThan(0);
      unmount();
    }
  });

  it('shows publish error when publishClasswork returns detail', async () => {
    mockedAxios.mockRejectedValueOnce({
      response: { status: 400, data: { detail: 'Already published' } },
      message: 'Bad Request',
      config: {},
      isAxiosError: true,
    });

    const { findByText, getAllByText, getByTestId } = renderClassWork(publishTask);

    fireEvent.press(getByTestId('classwork-publish-button'));
    await findByText('Publish Classwork');
    fireEvent.press(getByTestId('classwork-publish-confirm-button'));

    expect(await findByText('Already published')).toBeTruthy();
  });

  it('loads results when View Results is pressed on evaluated task', async () => {
    mockAxiosResponse({ students: [] });
    const { getByTestId, store } = renderClassWork({
      ...publishTask,
      status: 'evaluated',
      status_name: 'Evaluated',
      published_work_id: 1,
    });

    fireEvent.press(getByTestId('classwork-publish-button'));

    await waitFor(() => {
      expect(store.getState().liveMonitor.selectedTaskSection).toBe('Classwork');
      expect(store.getState().liveMonitor.selectedTaskId).toBe(77);
      expect(mockedAxios).toHaveBeenCalled();
    });
  });

  it('calls editTask from overflow menu when task is in queue', async () => {
    const editTask = jest.fn();
    const { getByTestId, getAllByLabelText } = renderClassWork(publishTask, { editTask });

    fireEvent.press(getAllByLabelText('task-menu')[0]);
    fireEvent.press(getByTestId('classwork-edit-button'));
    expect(editTask).toHaveBeenCalledWith(77, 'Classwork');
  });

  it('calls deleteTask from overflow menu when task is in queue', async () => {
    const deleteTask = jest.fn();
    const { getByTestId, getAllByLabelText } = renderClassWork(publishTask, { deleteTask });

    fireEvent.press(getAllByLabelText('task-menu')[0]);
    fireEvent.press(getByTestId('classwork-delete-button'));
    expect(deleteTask).toHaveBeenCalledWith(77, 'Classwork');
  });
});
