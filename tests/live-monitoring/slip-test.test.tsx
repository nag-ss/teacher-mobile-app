import React, { useRef } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { act, fireEvent, waitFor } from '@testing-library/react-native';
import { useSelector } from 'react-redux';
import ClassPrep from '@/components/dashboard/ClassPrep';
import { useNavigation } from '@react-navigation/native';
import { renderWithProviders } from '../test-utils/renderWithProviders';
import { createClassPrepState } from '../test-utils/defaultState';
import { setupAuthenticatedTest } from '../test-utils/setupTest';
import {
  mockAxiosResponse,
  mockClassPrepOpenApis,
  mockSlipTestCancelApis,
  mockSlipTestGenerationApis,
  mockSlipTestSaveApis,
  mockedAxios,
} from '../test-utils/mockApi';

jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
  useFocusEffect: jest.fn(),
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
  const { createTaskModalMock } = require('../mocks/classPrepModals');
  return createTaskModalMock('SlipTest');
});

jest.mock('@/components/Modals/Modal_5_GenerateSlipTest', () => {
  const { createGenerateSlipTestModalMock } = require('../mocks/classPrepModals');
  return createGenerateSlipTestModalMock();
});

jest.mock('@/components/Modals/Modal_6_SlipTestDetails', () => {
  const { createSlipTestSettingsModalMock } = require('../mocks/classPrepModals');
  return createSlipTestSettingsModalMock();
});

const mockedUseNavigation = useNavigation as unknown as jest.Mock;

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

const quizDetails = {
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

const inQueueSlipTestTask = {
  task_id: 99,
  task_type: 'SlipTest',
  status: 'in_queue',
  status_name: 'In Queue',
  title: 'Slip Test Ratios',
  quiz_id: 10,
};

const ClassPrepHarness = () => {
  const ref = useRef<any>(null);
  const classTasks = useSelector((state: any) => state.classes.classTasks);

  return (
    <View>
      <Text>{TEXT.LIVE_MONITOR}</Text>
      {classTasks.map((task: any) => (
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

describe('Slip Test creation', () => {
  beforeEach(async () => {
    await setupAuthenticatedTest();
    mockedUseNavigation.mockReturnValue({ navigate: jest.fn(), setOptions: jest.fn() });
  });

  const renderHarness = () =>
    renderWithProviders(<ClassPrepHarness />, {
      preloadedState: createClassPrepState({ classTasks: [] }),
    });

  const openTaskModal = async (
    getByLabelText: (label: string) => any,
    findByText: (text: string) => Promise<any>
  ) => {
    mockClassPrepOpenApis();
    fireEvent.press(getByLabelText(TEXT.ADD_TASK_BUTTON));
    await findByText(TEXT.TASK_MODAL);
  };

  const openSlipTestPreview = async (utils: ReturnType<typeof renderHarness>) => {
    await openTaskModal(utils.getByLabelText, utils.findByText);
    fireEvent.press(await utils.findByText(TEXT.CREATE));
    await utils.findByText(TEXT.GENERATE_SLIP_TEST);
    fireEvent.press(await utils.findByText(TEXT.NEXT));
    await utils.findByText(TEXT.TEST_SETUP);

    mockSlipTestGenerationApis(quizDetails);
    const generateButton = await utils.findByText(TEXT.GENERATE_TEST);
    jest.useFakeTimers();
    try {
      await act(async () => {
        fireEvent.press(generateButton);
      });
      await act(async () => {
        jest.advanceTimersByTime(10000);
      });
      await waitFor(() => {
        expect(utils.queryByText(TEXT.GENERATING)).toBeNull();
      });
    } finally {
      jest.useRealTimers();
    }
    await utils.findByText(TEXT.PREVIEW);
  };

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
    await openTaskModal(utils.getByLabelText, utils.findByText);
    fireEvent.press(await utils.findByText(TEXT.CREATE));
    fireEvent.press(await utils.findByText(TEXT.NEXT));

    mockSlipTestGenerationApis(quizDetails);
    const generateButton = await utils.findByText(TEXT.GENERATE_TEST);
    jest.useFakeTimers();
    try {
      await act(async () => {
        fireEvent.press(generateButton);
      });
      expect(utils.getByText(TEXT.GENERATING)).toBeTruthy();
      await act(async () => {
        jest.advanceTimersByTime(10000);
      });
      await waitFor(() => expect(mockedAxios).toHaveBeenCalled());
    } finally {
      jest.useRealTimers();
    }
  });

  it('creates slip test card with In Queue status when Save is pressed on preview', async () => {
    const utils = renderHarness();
    await openSlipTestPreview(utils);

    mockSlipTestSaveApis([inQueueSlipTestTask]);
    await act(async () => {
      fireEvent.press(await utils.findByTestId('slip-test-save-button'));
    });

    await waitFor(() => {
      expect(mockedAxios).toHaveBeenCalledWith(
        expect.objectContaining({
          url: expect.stringContaining('teacher_task_id=99'),
        })
      );
      expect(utils.queryByText(TEXT.PREVIEW)).toBeNull();
      expect(utils.getByText(TEXT.IN_QUEUE)).toBeTruthy();
      expect(utils.getByText(TEXT.LIVE_MONITOR)).toBeTruthy();
    });
  });

  it('does not create slip test card and returns to live monitoring when Cancel is pressed on preview', async () => {
    const utils = renderHarness();
    await openSlipTestPreview(utils);

    mockSlipTestCancelApis();
    const cancelButtons = utils.getAllByText(TEXT.CANCEL);
    await act(async () => {
      fireEvent.press(cancelButtons[cancelButtons.length - 1]);
    });

    await waitFor(() => {
      expect(mockedAxios).toHaveBeenCalledWith(
        expect.objectContaining({
          url: expect.stringContaining('state=cancel'),
        })
      );
      expect(utils.queryByText(TEXT.PREVIEW)).toBeNull();
      expect(utils.queryByText(TEXT.IN_QUEUE)).toBeNull();
      expect(utils.getByText(TEXT.LIVE_MONITOR)).toBeTruthy();
    });
  });
});
