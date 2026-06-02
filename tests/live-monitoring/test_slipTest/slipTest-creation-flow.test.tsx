import React, { useRef } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { act, fireEvent, render, waitFor } from '@testing-library/react-native';
import ClassPrep from '@/components/dashboard/ClassPrep';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import {
  saveSlipTestQuiz,
  cancelSlipTestQuiz,
  getTeacherClassTasks,
} from '@/store/classSlice';

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
}));

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

jest.mock('@/store/classSlice', () => ({
  addTaskToClass: jest.fn(),
  addSlipTestToClass: jest.fn(() => ({ type: 'classes/addSlipTestToClass' })),
  getTeacherClassTasks: jest.fn(() => ({ type: 'classes/getTeacherClassTasks' })),
  deleteTeacherClassTask: jest.fn(),
  editTeacherClassTask: jest.fn(),
  updateSlipTest: jest.fn(),
  getClassQuiz: jest.fn(() => ({ type: 'classes/getClassQuiz' })),
  getClassTopicSubTopics: jest.fn(() => ({ type: 'classes/getClassTopicSubTopics' })),
  setClassTopicSubTopic: jest.fn(),
  saveSlipTestQuiz: jest.fn((taskId: number) => ({ type: 'classes/saveSlipTestQuiz', payload: taskId })),
  cancelSlipTestQuiz: jest.fn((taskId: number) => ({ type: 'classes/cancelSlipTestQuiz', payload: taskId })),
  getLiveClass: jest.fn(),
  getScheduleClasses: jest.fn(),
}));

jest.mock('@/components/Modals/Modal_1_SummaryModal', () => () => null);
jest.mock('@/components/Modals/Modal_2_ClassTaskModal', () => () => null);
jest.mock('@/components/Modals/Modal_4_AICheckModal', () => () => null);
jest.mock('@/components/Modals/ClassworkModal', () => () => null);
jest.mock('@/components/PrepClass/DeleteQuestionModal', () => () => null);
jest.mock('@/components/PrepClass/QuestionCard', () => () => null);

jest.mock('react-native-mathjax-html-to-svg', () => ({
  MathJaxSvg: ({ children }: { children: React.ReactNode }) => {
    const { Text } = require('react-native');
    return <Text>{children}</Text>;
  },
}));

jest.mock('@/components/Modals/Modal_3_CreateTaskModal', () => {
  const React = require('react');
  const { Text, TouchableOpacity } = require('react-native');
  return function MockTaskModal(props: any) {
    if (!props.visible) return null;
    return (
      <>
        <Text>Task Modal</Text>
        <TouchableOpacity onPress={() => props.clickedNext('SlipTest')}>
          <Text>Create</Text>
        </TouchableOpacity>
      </>
    );
  };
});

jest.mock('@/components/Modals/Modal_5_GenerateSlipTest', () => {
  const React = require('react');
  const { Text, TouchableOpacity, View } = require('react-native');
  return function MockGenerateSlipTestModal(props: any) {
    if (!props.visible) return null;
    return (
      <View>
        <Text>Generate Slip Test</Text>
        <Text>Topic</Text>
        <Text>Sub Topic</Text>
        <TouchableOpacity onPress={props.clickedNext}>
          <Text>Next</Text>
        </TouchableOpacity>
      </View>
    );
  };
});

jest.mock('@/components/Modals/Modal_6_SlipTestDetails', () => {
  const React = require('react');
  const { Text, TouchableOpacity, View } = require('react-native');
  return function MockTestSettingsModal(props: any) {
    if (!props.visible) return null;
    return (
      <View>
        <Text>Test Setup</Text>
        <Text>Multiple Choice</Text>
        <Text>Subjective</Text>
        <TouchableOpacity
          onPress={() =>
            props.generateSlipTest({
              duration: 10,
              marks: 10,
              difficulty: 5,
              mcqCount: 3,
              subCount: 2,
              totalQuestions: 5,
              title: 'Slip Test Ratios',
            })
          }
        >
          <Text>Generate Test</Text>
        </TouchableOpacity>
      </View>
    );
  };
});

const mockedUseDispatch = useDispatch as unknown as jest.Mock;
const mockedUseSelector = useSelector as unknown as jest.Mock;
const mockedUseNavigation = useNavigation as unknown as jest.Mock;
const mockedSaveSlipTestQuiz = saveSlipTestQuiz as unknown as jest.Mock;
const mockedCancelSlipTestQuiz = cancelSlipTestQuiz as unknown as jest.Mock;
const mockedGetTeacherClassTasks = getTeacherClassTasks as unknown as jest.Mock;

const TEXT = {
  ADD_TASK_BUTTON: 'add-task-button',
  TASK_MODAL: 'Task Modal',
  CREATE: 'Create',
  GENERATE_SLIP_TEST: 'Generate Slip Test',
  TEST_SETUP: 'Test Setup',
  NEXT: 'Next',
  GENERATE_TEST: 'Generate Test',
  GENERATING: 'Generating your Test...',
  PREVIEW: 'Slip Test Ratios Preview',
  SAVE: 'Save',
  CANCEL: 'Cancel',
  IN_QUEUE: 'In Queue',
  LIVE_MONITOR: 'live-monitoring-screen',
} as const;

const selectedClass = {
  class_schedule_id: 123,
  teacher_id: 11,
  division_id: 7,
  subject_id: 5,
  subject_name: 'Math',
  division_name: 'Grade 6',
  section_name: 'A',
  date: '2026-04-30',
  class_details: [{ topic: 'Ratios', sub_topic: ['Basics'] }],
};

const inQueueSlipTestTask = {
  task_id: 99,
  task_type: 'SlipTest',
  status: 'in_queue',
  status_name: 'In Queue',
  title: 'Slip Test Ratios',
  quiz_id: 10,
};

const ClassPrepHarness = ({ classTasks = [] }: { classTasks?: any[] }) => {
  const ref = useRef<any>(null);
  return (
    <View>
      <Text>{TEXT.LIVE_MONITOR}</Text>
      {classTasks.map((task) => (
        <Text key={task.task_id}>{task.status_name}</Text>
      ))}
      <TouchableOpacity
        accessibilityLabel={TEXT.ADD_TASK_BUTTON}
        onPress={() => ref.current?.setSelectedClass(true)}
      >
        <Text>Add Task</Text>
      </TouchableOpacity>
      <ClassPrep item={{}} selectedClass={selectedClass} updateTopicSubTopic={jest.fn()} ref={ref} />
    </View>
  );
};

describe('Slip Test creation flow', () => {
  let classTasks: any[];
  let quizDetails: any;
  let dispatchMock: jest.Mock;

  const syncSelector = () => {
    mockedUseSelector.mockImplementation((selector) =>
      selector({
        classes: {
          classTasks,
          topics: [{ topic: 'Ratios', sub_topic: [{ id: 99, sub_topic: 'Basics' }] }],
          quiz_details: quizDetails,
          loading: false,
        },
        user: { user: { id: 44, school_id: 1 } },
      })
    );
  };

  const setupDispatch = () => {
    dispatchMock = jest.fn().mockImplementation(async (action: any) => {
      if (typeof action === 'object' && action.type === 'classes/addSlipTestToClass') {
        return { payload: { task_id: 99 } };
      }
      if (typeof action === 'object' && action.type === 'classes/saveSlipTestQuiz') {
        classTasks = [inQueueSlipTestTask];
        return { payload: { status: 'in_queue', status_name: 'In Queue' } };
      }
      if (typeof action === 'object' && action.type === 'classes/cancelSlipTestQuiz') {
        classTasks = [];
        return { payload: {} };
      }
      if (typeof action === 'object' && action.type === 'classes/getTeacherClassTasks') {
        return { payload: classTasks };
      }
      if (typeof action === 'object' && action.type === 'classes/getClassQuiz') {
        return { payload: quizDetails };
      }
      return { payload: {} };
    });
    mockedUseDispatch.mockReturnValue(dispatchMock);
    mockedUseNavigation.mockReturnValue({ navigate: jest.fn(), setOptions: jest.fn() });
    syncSelector();
  };

  const renderHarness = (tasks: any[] = []) => {
    classTasks = tasks;
    setupDispatch();
    return render(<ClassPrepHarness classTasks={classTasks} />);
  };

  const openTaskModal = async (
    getByLabelText: (label: string) => any,
    findByText: (text: string) => Promise<any>
  ) => {
    fireEvent.press(getByLabelText(TEXT.ADD_TASK_BUTTON));
    await findByText(TEXT.TASK_MODAL);
  };

  const openSlipTestPreview = async (utils: ReturnType<typeof render>) => {
    await openTaskModal(utils.getByLabelText, utils.findByText);
    fireEvent.press(await utils.findByText(TEXT.CREATE));
    await utils.findByText(TEXT.GENERATE_SLIP_TEST);
    fireEvent.press(await utils.findByText(TEXT.NEXT));
    await utils.findByText(TEXT.TEST_SETUP);
    await act(async () => {
      fireEvent.press(await utils.findByText(TEXT.GENERATE_TEST));
    });
    await waitFor(() => {
      expect(utils.queryByText(TEXT.GENERATING)).toBeNull();
    });
    await utils.findByText(TEXT.PREVIEW);
  };

  beforeEach(() => {
    jest.clearAllMocks();
    classTasks = [];
    quizDetails = {
      quiz_id: 10,
      task_id: 99,
      title: 'Slip Test Ratios',
      topic: 'Ratios',
      sub_topic: 'Basics',
      questions: [
        {
          question_id: 1,
          marks: 5,
          is_objective: false,
          body: { Question: 'What is ratio?' },
          answer: { explanation: 'a:b' },
        },
      ],
    };
    setupDispatch();
  });

  it('opens topic and subtopic popup when slip test create is pressed from task modal', async () => {
    const utils = renderHarness();
    await openTaskModal(utils.getByLabelText, utils.findByText);
    fireEvent.press(await utils.findByText(TEXT.CREATE));
    await utils.findByText(TEXT.GENERATE_SLIP_TEST);
    await utils.findByText('Topic');
    await utils.findByText('Sub Topic');
  });

  it('opens test setup popup when Next is pressed from topic selection', async () => {
    const utils = renderHarness();
    await openTaskModal(utils.getByLabelText, utils.findByText);
    fireEvent.press(await utils.findByText(TEXT.CREATE));
    await utils.findByText(TEXT.GENERATE_SLIP_TEST);
    fireEvent.press(await utils.findByText(TEXT.NEXT));
    await utils.findByText(TEXT.TEST_SETUP);
    await utils.findByText('Multiple Choice');
    await utils.findByText('Subjective');
  });

  it('shows generating your test popup when Generate Test is pressed', async () => {
    const utils = renderHarness();
    dispatchMock.mockImplementation(async (action: any) => {
      if (typeof action === 'object' && action.type === 'classes/addSlipTestToClass') {
        await new Promise((resolve) => setTimeout(resolve, 100));
        return { payload: { task_id: 99 } };
      }
      if (typeof action === 'object' && action.type === 'classes/getTeacherClassTasks') {
        return { payload: classTasks };
      }
      if (typeof action === 'object' && action.type === 'classes/getClassQuiz') {
        return { payload: quizDetails };
      }
      return { payload: {} };
    });
    await openTaskModal(utils.getByLabelText, utils.findByText);
    fireEvent.press(await utils.findByText(TEXT.CREATE));
    fireEvent.press(await utils.findByText(TEXT.NEXT));
    await act(async () => {
      fireEvent.press(await utils.findByText(TEXT.GENERATE_TEST));
    });
    await utils.findByText(TEXT.GENERATING);
    await waitFor(() => expect(dispatchMock.mock.calls.length).toBeGreaterThan(0));
  });

  it('creates slip test card with In Queue status when Save is pressed on preview', async () => {
    const utils = renderHarness();
    await openSlipTestPreview(utils);

    await act(async () => {
      fireEvent.press(await utils.findByText(TEXT.SAVE));
    });

    await waitFor(() => {
      expect(mockedSaveSlipTestQuiz).toHaveBeenCalledWith(99);
      expect(mockedGetTeacherClassTasks).toHaveBeenCalled();
      expect(utils.queryByText(TEXT.PREVIEW)).toBeNull();
    });

    classTasks = [inQueueSlipTestTask];
    syncSelector();
    utils.rerender(<ClassPrepHarness classTasks={classTasks} />);

    expect(utils.getByText(TEXT.IN_QUEUE)).toBeTruthy();
    expect(utils.getByText(TEXT.LIVE_MONITOR)).toBeTruthy();
  });

  it('does not create slip test card and returns to live monitoring when Cancel is pressed on preview', async () => {
    const utils = renderHarness();
    await openSlipTestPreview(utils);

    const cancelButtons = utils.getAllByText(TEXT.CANCEL);
    await act(async () => {
      fireEvent.press(cancelButtons[cancelButtons.length - 1]);
    });

    await waitFor(() => {
      expect(mockedCancelSlipTestQuiz).toHaveBeenCalledWith(99);
      expect(mockedGetTeacherClassTasks).toHaveBeenCalled();
      expect(utils.queryByText(TEXT.PREVIEW)).toBeNull();
      expect(utils.queryByText(TEXT.IN_QUEUE)).toBeNull();
      expect(utils.getByText(TEXT.LIVE_MONITOR)).toBeTruthy();
    });
  });
});
