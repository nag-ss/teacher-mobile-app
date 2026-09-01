import React, { useRef } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { act, fireEvent, waitFor } from '@testing-library/react-native';
import ClassPrep from '@/components/dashboard/ClassPrep';
import AITask from '@/components/live-monitoring/AITask';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { renderWithProviders } from '../test-utils/renderWithProviders';
import { createClassPrepState } from '../test-utils/defaultState';
import {
  mockAxiosResponse,
  mockClassPrepOpenApis,
  mockClassPrepSaveApis,
  mockedAxios,
} from '../test-utils/mockApi';

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
  return createClassTaskModalMock({ cardLabel: 'AI Check Card' });
});

jest.mock('@/components/Modals/Modal_3_CreateTaskModal', () => {
  const { createTaskModalMock } = require('../mocks/classPrepModals');
  return createTaskModalMock('AICheck');
});

jest.mock('@/components/Modals/Modal_4_AICheckModal', () => {
  const { createAICheckModalMock } = require('../mocks/classPrepModals');
  return createAICheckModalMock();
});

jest.mock('@/components/Modals/ClassworkModal', () => () => null);

const mockedUseNavigation = useNavigation as unknown as jest.Mock;
const mockedUseFocusEffect = useFocusEffect as unknown as jest.Mock;

const TEXT = {
  ADD_TASK_BUTTON: 'add-task-button',
  TASK_MODAL: 'Task Modal',
  PREPARE: 'Prepare for Class',
  NEXT: 'Next',
  CREATE: 'Create',
  AI_CHECK_POPUP: 'AI Check',
  AI_CHECK_CARD: 'AI Check Card',
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

const setupClassPrep = (selectedClassData?: any) => {
  mockClassPrepOpenApis();
  mockedUseNavigation.mockReturnValue({ navigate: jest.fn(), setOptions: jest.fn() });
  return renderWithProviders(<ClassPrepHarness selectedClassData={selectedClassData} />, {
    preloadedState: createClassPrepState(),
  });
};

const renderAITask = (
  task: Record<string, unknown>,
  props: Partial<React.ComponentProps<typeof AITask>> = {}
) =>
  renderWithProviders(
    <AITask
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

describe('AI Check creation', () => {
  it('shows saved AI check in task list after save from ClassPrep', async () => {
    mockClassPrepOpenApis();
    mockClassPrepSaveApis([{ task_id: 1, title: 'Saved AI Task', task_type: 'AICheck' }]);
    mockedUseNavigation.mockReturnValue({ navigate: jest.fn(), setOptions: jest.fn() });

    const ref = React.createRef<any>();
    const { getByLabelText, findByText, findByTestId, store } = renderWithProviders(
      <>
        <TouchableOpacity
          accessibilityLabel="open-prep"
          onPress={() => ref.current?.setSelectedClass(false)}
        >
          <Text>Open</Text>
        </TouchableOpacity>
        <ClassPrep item={{}} selectedClass={selectedClass} updateTopicSubTopic={jest.fn()} ref={ref} />
      </>,
      { preloadedState: createClassPrepState() }
    );

    fireEvent.press(getByLabelText('open-prep'));
    await findByText('Your AI-Powered Assistant');
    fireEvent.press(await findByText('+ Add a Task'));
    await findByText(TEXT.TASK_MODAL);
    fireEvent.press(await findByText(TEXT.CREATE));
    await findByText(TEXT.AI_CHECK_POPUP);

    await act(async () => {
      fireEvent.press(await findByTestId('ai-check-save-button'));
    });

    await waitFor(() => {
      expect(store.getState().classes.classTasks).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ title: 'Saved AI Task', task_type: 'AICheck' }),
        ])
      );
    });
    expect(await findByText('Saved AI Task')).toBeTruthy();
  });

  it('deletes AI check card when Delete is pressed from 3 dots options', async () => {
    const { getByLabelText, findByText, queryByText } = setupClassPrep(selectedClassWithoutTopic);
    fireEvent.press(getByLabelText(TEXT.ADD_TASK_BUTTON));
    await findByText(TEXT.PREPARE);
    fireEvent.press(await findByText(TEXT.NEXT));
    await findByText(TEXT.AI_CHECK_CARD);
    fireEvent.press(await findByText(TEXT.MORE));
    fireEvent.press(await findByText(TEXT.DELETE));
    expect(queryByText(TEXT.AI_CHECK_CARD)).toBeNull();
  });
});

const publishTask = {
  task_id: 77,
  task_type: 'AICheck',
  title: 'AI Ratios Check',
  status: 'in_queue',
  status_name: 'In Queue',
  class_schedule_id: 123,
};

describe('AI Check publish', () => {
  beforeEach(() => {
    let hasRunFocusEffect = false;
    mockedUseFocusEffect.mockImplementation((cb: any) => {
      if (!hasRunFocusEffect) {
        hasRunFocusEffect = true;
        cb();
      }
    });
  });

  it('closes publish popup when Cancel is pressed', async () => {
    const { findByText, queryByText, getByTestId } = renderAITask(publishTask);

    fireEvent.press(getByTestId('ai-check-launch-button'));
    await findByText('Publish AI Check');
    fireEvent.press(await findByText('Cancel'));

    await waitFor(() => {
      expect(queryByText('Publish AI Check')).toBeNull();
    });
  });

  it('launches when Launch is pressed in popup', async () => {
    mockAxiosResponse({ status: 'in_progress' });
    const refreshTasks = jest.fn();

    const { findByText, queryByText, getByTestId } = renderAITask(publishTask, { refreshTasks });

    fireEvent.press(getByTestId('ai-check-launch-button'));
    await findByText('Publish AI Check');
    fireEvent.press(getByTestId('ai-check-launch-confirm-button'));

    await waitFor(() => {
      expect(mockedAxios).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ task_id: 77, class_schedule_id: 123 }),
        })
      );
      expect(refreshTasks).toHaveBeenCalled();
      expect(queryByText('Publish AI Check')).toBeNull();
    });
  });

  it('changes CTA button text according to status', async () => {
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
      const { getAllByText, unmount } = renderAITask({
        ...publishTask,
        status: item.status,
        status_name: item.status_name,
      });
      expect(getAllByText(item.expectedCta).length).toBeGreaterThan(0);
      unmount();
    }
  });

  it('loads results when View Results is pressed on evaluated task', async () => {
    mockAxiosResponse({ students: [] });
    const { findByText, getByTestId, store } = renderAITask({
      ...publishTask,
      status: 'evaluated',
      status_name: 'Evaluated',
    });

    fireEvent.press(getByTestId('ai-check-launch-button'));

    await waitFor(() => {
      expect(store.getState().liveMonitor.selectedTaskSection).toBe('AICheck');
      expect(store.getState().liveMonitor.selectedTaskId).toBe(77);
      expect(mockedAxios).toHaveBeenCalled();
    });
  });

  it('calls editTask from overflow menu when task is in queue', async () => {
    const editTask = jest.fn();
    const { getByTestId, getAllByLabelText } = renderAITask(publishTask, { editTask });

    fireEvent.press(getAllByLabelText('task-menu')[0]);
    fireEvent.press(getByTestId('ai-check-edit-button'));
    expect(editTask).toHaveBeenCalledWith(77, 'AICheck');
  });

  it('calls deleteTask from overflow menu when task is in queue', async () => {
    const deleteTask = jest.fn();
    const { getByTestId, getAllByLabelText } = renderAITask(publishTask, { deleteTask });

    fireEvent.press(getAllByLabelText('task-menu')[0]);
    fireEvent.press(getByTestId('ai-check-delete-button'));
    expect(deleteTask).toHaveBeenCalledWith(77, 'AICheck');
  });

  it('keeps publish popup open when launch returns no status', async () => {
    mockAxiosResponse({});
    const refreshTasks = jest.fn();

    const { findByText, getByTestId } = renderAITask(publishTask, { refreshTasks });

    fireEvent.press(getByTestId('ai-check-launch-button'));
    await findByText('Publish AI Check');
    fireEvent.press(getByTestId('ai-check-launch-confirm-button'));

    await waitFor(() => {
      expect(mockedAxios).toHaveBeenCalled();
      expect(refreshTasks).toHaveBeenCalled();
    });
    expect(await findByText('Publish AI Check')).toBeTruthy();
  });
});
