import React, { useRef } from 'react';
import { act, fireEvent, waitFor } from '@testing-library/react-native';
import { Text, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import SlipTestDetailsModal from '@/components/Modals/SlipTestModal';
import Quiz from '@/components/live-monitoring/Quiz';
import ClassPrep from '@/components/dashboard/ClassPrep';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { renderWithProviders } from '../test-utils/renderWithProviders';
import { createClassPrepState } from '../test-utils/defaultState';
import { setupAuthenticatedTest } from '../test-utils/setupTest';
import { mockAxiosResponse, mockClassPrepOpenApis, mockedAxios } from '../test-utils/mockApi';

jest.mock('@react-navigation/native', () => ({
  useFocusEffect: jest.fn(),
  useNavigation: jest.fn(),
}));

jest.mock('react-native-mathjax-html-to-svg', () => ({
  MathJaxSvg: ({ children }: { children: React.ReactNode }) => {
    const { Text } = require('react-native');
    return <Text>{children}</Text>;
  },
}));

jest.mock('react-native-vector-icons/Feather', () => {
  const React = require('react');
  const { TouchableOpacity, Text } = require('react-native');
  return function MockFeather(props: any) {
    return (
      <TouchableOpacity accessibilityLabel="question-menu" onPress={props.onPress}>
        <Text>menu</Text>
      </TouchableOpacity>
    );
  };
});

jest.mock('react-native-vector-icons/AntDesign', () => 'AntDesign');
jest.mock('react-native-vector-icons/FontAwesome', () => 'FontAwesome');
jest.mock('@/components/PrepClass/ReplaceEditQuestionModal', () => () => null);

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

jest.mock('@/components/Modals/Modal_1_SummaryModal', () => () => null);
jest.mock('@/components/Modals/Modal_2_ClassTaskModal', () => () => null);
jest.mock('@/components/Modals/Modal_3_CreateTaskModal', () => () => null);
jest.mock('@/components/Modals/Modal_4_AICheckModal', () => () => null);
jest.mock('@/components/Modals/Modal_5_GenerateSlipTest', () => () => null);
jest.mock('@/components/Modals/Modal_6_SlipTestDetails', () => () => null);
jest.mock('@/components/Modals/ClassworkModal', () => () => null);
jest.mock('@/components/PrepClass/LoadingSlipTestModal', () => () => null);

const mockedUseFocusEffect = useFocusEffect as unknown as jest.Mock;
const mockedUseNavigation = useNavigation as unknown as jest.Mock;

const makeQuestion = (id: number, question: string, answer = 'original answer') => ({
  question_id: id,
  marks: 5,
  is_objective: false,
  body: { Question: question },
  answer: { explanation: answer },
});

const baseQuizDetails = {
  quiz_id: 10,
  task_id: 99,
  title: 'Slip Test Ratios',
  topic: 'Ratios',
  sub_topic: 'Basics',
};

const previewBaseProps = {
  selectedClass: { division_name: 'Grade 6', section_name: 'A' },
  selectedTask: { published_quiz_id: null },
  new_quiz: true,
  visible: true,
  saveSlipTest: jest.fn(),
  cancelSlipTest: jest.fn(),
  closeSlipTest: jest.fn(),
};

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

const slipTestTask = {
  task_id: 99,
  task_type: 'SlipTest',
  status: 'in_queue',
  status_name: 'In Queue',
  title: 'Slip Test Ratios',
  quiz_id: 10,
  published_quiz_id: null,
};

const LiveMonitorHarness = () => {
  const classPrepRef = useRef<any>(null);
  const classTasks = useSelector((state: any) => state.classes.classTasks);
  const deleteTask = (taskId: number, taskType: string) => {
    classPrepRef.current?.deleteTask(taskId, taskType, true);
  };

  return (
    <View>
      <Text>live-monitoring-screen</Text>
      {classTasks.map((task: any) => (
        <Quiz
          key={task.task_id}
          task={task}
          refreshTasks={jest.fn()}
          editTask={jest.fn()}
          deleteTask={deleteTask}
          viewTask={jest.fn()}
        />
      ))}
      <ClassPrep
        item={{}}
        selectedClass={selectedClass}
        updateTopicSubTopic={jest.fn()}
        ref={classPrepRef}
      />
    </View>
  );
};

describe('Slip Test publish', () => {
  beforeEach(async () => {
    await setupAuthenticatedTest();
    mockedUseNavigation.mockReturnValue({ navigate: jest.fn(), setOptions: jest.fn() });
  });

  describe('preview question actions', () => {
    const renderPreview = (questions: ReturnType<typeof makeQuestion>[]) =>
      renderWithProviders(<SlipTestDetailsModal {...previewBaseProps} />, {
        preloadedState: {
          classes: {
            quiz_details: { ...baseQuizDetails, questions },
            loading: false,
          },
        },
      });

    const openMenuForFirstQuestion = async (utils: ReturnType<typeof renderPreview>) => {
      await utils.findByText('What is ratio?');
      fireEvent.press(utils.getAllByLabelText('question-menu')[0]);
    };

    it('deletes a question when Delete is confirmed from preview', async () => {
      mockAxiosResponse({});
      mockAxiosResponse({
        ...baseQuizDetails,
        questions: [makeQuestion(2, 'Second question', 'answer two')],
      });

      const utils = renderPreview([
        makeQuestion(1, 'What is ratio?', 'original answer'),
        makeQuestion(2, 'Second question', 'answer two'),
      ]);
      await openMenuForFirstQuestion(utils);
      fireEvent.press(await utils.findByText('Delete'));
      await utils.findByText('Delete Question?');

      await act(async () => {
        const deleteButtons = utils.getAllByText('Delete');
        fireEvent.press(deleteButtons[deleteButtons.length - 1]);
      });

      await waitFor(() => {
        expect(mockedAxios).toHaveBeenCalledWith(
          expect.objectContaining({ url: expect.stringContaining('/1') })
        );
        expect(utils.queryByText('What is ratio?')).toBeNull();
        expect(utils.getByText('Second question')).toBeTruthy();
      });
    });

    it('replaces a question when Replace is confirmed from preview', async () => {
      mockAxiosResponse({
        new_question: makeQuestion(1, 'Replaced question text', 'replaced answer'),
        original_question_id: 1,
      });

      const utils = renderPreview([
        makeQuestion(1, 'What is ratio?', 'original answer'),
        makeQuestion(2, 'Second question', 'answer two'),
      ]);
      await openMenuForFirstQuestion(utils);
      fireEvent.press(await utils.findByText('Replace'));
      await utils.findByText('Replace Question?');

      await act(async () => {
        const replaceButtons = utils.getAllByText('Replace');
        fireEvent.press(replaceButtons[replaceButtons.length - 1]);
      });

      await waitFor(() => {
        expect(mockedAxios).toHaveBeenCalledWith(
          expect.objectContaining({
            method: 'POST',
            data: expect.objectContaining({
              question_id: 1,
              additional_context: 'I want this question changed',
            }),
          })
        );
      });
    });

    it('saves edited question when Save is pressed in edit modal', async () => {
      mockAxiosResponse({});

      const utils = renderPreview([makeQuestion(1, 'What is ratio?', 'original answer')]);
      await openMenuForFirstQuestion(utils);
      fireEvent.press(await utils.findByText('Edit'));
      await utils.findByText('*Question');

      fireEvent.changeText(await utils.findByDisplayValue('What is ratio?'), 'Updated ratio question');
      fireEvent.changeText(await utils.findByDisplayValue('original answer'), 'updated answer');

      await act(async () => {
        fireEvent.press(utils.getAllByText('Save')[0]);
      });

      await waitFor(() => {
        expect(mockedAxios).toHaveBeenCalledWith(
          expect.objectContaining({
            method: 'PATCH',
            data: expect.objectContaining({
              question: 'Updated ratio question',
              subjective_answer: 'updated answer',
            }),
          })
        );
      });
    });

    it('does not change question when edit is cancelled', async () => {
      const utils = renderPreview([makeQuestion(1, 'What is ratio?', 'original answer')]);
      await openMenuForFirstQuestion(utils);
      fireEvent.press(await utils.findByText('Edit'));

      fireEvent.changeText(await utils.findByDisplayValue('What is ratio?'), 'Draft change only');

      mockAxiosResponse({
        ...baseQuizDetails,
        questions: [makeQuestion(1, 'What is ratio?', 'original answer')],
      });
      await act(async () => {
        fireEvent.press(utils.getAllByText('Cancel')[0]);
      });

      await waitFor(() => {
        expect(
          mockedAxios.mock.calls.some((call) => {
            const config = call[0] as { method?: string; url?: string };
            return config.method === 'PATCH' && config.url?.includes('subjective_question');
          })
        ).toBe(false);
        expect(utils.queryByText('*Question')).toBeNull();
      });

      expect(utils.getByText('What is ratio?')).toBeTruthy();
    });
  });

  describe('live monitoring task card', () => {
    beforeEach(() => {
      let hasRunFocusEffect = false;
      mockedUseFocusEffect.mockImplementation((cb: any) => {
        if (!hasRunFocusEffect) {
          hasRunFocusEffect = true;
          cb();
        }
      });
    });

    it('deletes slip test card when Delete is confirmed from task menu', async () => {
      mockAxiosResponse({});
      mockAxiosResponse([]);

      const utils = renderWithProviders(<LiveMonitorHarness />, {
        preloadedState: createClassPrepState({ classTasks: [slipTestTask], liveClass: selectedClass }),
      });

      expect(utils.getAllByText('Slip Test Ratios').length).toBeGreaterThan(0);
      expect(utils.getByText('In Queue')).toBeTruthy();

      fireEvent.press(utils.getAllByLabelText('task-menu')[0]);
      fireEvent.press(await utils.findByText('Delete'));
      await utils.findByText('Delete Task?');

      await act(async () => {
        const deleteButtons = utils.getAllByText('Delete');
        fireEvent.press(deleteButtons[deleteButtons.length - 1]);
      });

      await waitFor(() => {
        expect(mockedAxios).toHaveBeenCalledWith(
          expect.objectContaining({ url: expect.stringContaining('99') })
        );
        expect(utils.queryByText('Delete Task?')).toBeNull();
        expect(utils.queryByText('Slip Test Ratios')).toBeNull();
        expect(utils.queryByText('In Queue')).toBeNull();
      });
    });
  });

  describe('quiz card publish', () => {
    const baseTask = {
      task_id: 99,
      task_type: 'SlipTest',
      title: 'Slip Test Ratios',
      status: 'in_queue',
      status_name: 'In Queue',
      quiz_id: 10,
      published_quiz_id: null,
      quiz_details: { duration: 10, quiz_type: 'SlipTest' },
    };

    const renderQuiz = (
      task: Record<string, unknown>,
      props: Partial<React.ComponentProps<typeof Quiz>> = {}
    ) =>
      renderWithProviders(
        <Quiz
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
            classes: { liveClass: { division_id: 7 } },
          },
        }
      );

    beforeEach(() => {
      let hasRunFocusEffect = false;
      mockedUseFocusEffect.mockImplementation((cb: any) => {
        if (!hasRunFocusEffect) {
          hasRunFocusEffect = true;
          cb();
        }
      });
    });

    it('publishes quiz when Start Now is pressed in popup', async () => {
      mockAxiosResponse({ status: 'in_progress' });
      const refreshTasks = jest.fn();

      const { findByText, queryByText, getByTestId } = renderQuiz(baseTask, { refreshTasks });

      fireEvent.press(getByTestId('quiz-publish-button'));
      await findByText('Start Quiz');
      fireEvent.press(getByTestId('quiz-start-now-button'));

      await waitFor(() => {
        expect(mockedAxios).toHaveBeenCalledWith(
          expect.objectContaining({
            url: expect.stringContaining('publish_quiz/99'),
            data: expect.objectContaining({
              quiz_id: 10,
              quiz_type: 'SlipTest',
              duration: 10,
              division_id: 7,
            }),
          })
        );
        expect(refreshTasks).toHaveBeenCalled();
        expect(queryByText('Start Quiz')).toBeNull();
      });
    });

    it('shows publish error when publishQuiz returns detail', async () => {
      mockedAxios.mockRejectedValueOnce({
        response: { status: 400, data: { detail: 'Quiz already started' } },
        message: 'Bad Request',
        config: {},
        isAxiosError: true,
      });

      const { findByText, getByTestId } = renderQuiz(baseTask);

      fireEvent.press(getByTestId('quiz-publish-button'));
      await findByText('Start Quiz');
      fireEvent.press(getByTestId('quiz-start-now-button'));

      expect(await findByText('Quiz already started')).toBeTruthy();
    });

    it('changes CTA button text according to status', () => {
      const cases = [
        { status: 'in_queue', status_name: 'In Queue', expectedCta: 'Publish' },
        { status: 'published', status_name: 'Launching', expectedCta: 'Launching' },
        { status: 'in_progress', status_name: 'On Going', expectedCta: 'Update Results' },
        { status: 'completed', status_name: 'Completed', expectedCta: 'Update Results' },
        { status: 'evaluated', status_name: 'Evaluated', expectedCta: 'View Results' },
        { status: 'loading', status_name: 'Loading', expectedCta: 'Wait' },
      ];

      for (const item of cases) {
        let hasRunFocusEffect = false;
        mockedUseFocusEffect.mockImplementation((cb: any) => {
          if (!hasRunFocusEffect) {
            hasRunFocusEffect = true;
            cb();
          }
        });
        const { getAllByText, unmount } = renderQuiz({
          ...baseTask,
          status: item.status,
          status_name: item.status_name,
          published_quiz_id: 1,
        });
        expect(getAllByText(item.expectedCta).length).toBeGreaterThan(0);
        unmount();
      }
    });

    it('loads results when View Results is pressed on evaluated task', async () => {
      mockAxiosResponse({ students: [] });

      const { getByTestId, store } = renderQuiz({
        ...baseTask,
        status: 'evaluated',
        status_name: 'Evaluated',
        published_quiz_id: 1,
      });

      fireEvent.press(getByTestId('quiz-publish-button'));

      await waitFor(() => {
        expect(store.getState().liveMonitor.selectedTaskSection).toBe('SlipTest');
        expect(store.getState().liveMonitor.selectedTaskId).toBe(99);
        expect(mockedAxios).toHaveBeenCalled();
      });
    });

    it('calls editTask from overflow menu when task is in queue', async () => {
      const editTask = jest.fn();
      const { getByTestId, getAllByLabelText } = renderQuiz(baseTask, { editTask });

      fireEvent.press(getAllByLabelText('task-menu')[0]);
      fireEvent.press(getByTestId('quiz-edit-button'));
      expect(editTask).toHaveBeenCalledWith(99, 'SlipTest');
    });

    it('calls viewTask from overflow menu when quiz is published', async () => {
      const viewTask = jest.fn();
      const { getByTestId, getAllByLabelText } = renderQuiz(
        {
          ...baseTask,
          status: 'in_progress',
          status_name: 'On Going',
          published_quiz_id: 5,
        },
        { viewTask }
      );

      fireEvent.press(getAllByLabelText('task-menu')[0]);
      fireEvent.press(getByTestId('quiz-view-button'));
      expect(viewTask).toHaveBeenCalledWith(10, 99);
    });
  });
});
