import React, { useRef } from 'react';
import { act, fireEvent, render, waitFor } from '@testing-library/react-native';
import { Text, TouchableOpacity, View } from 'react-native';
import SlipTestDetailsModal from '@/components/Modals/SlipTestModal';
import Quiz from '@/components/live-monitoring/Quiz';
import ClassPrep from '@/components/dashboard/ClassPrep';
import { useDispatch, useSelector } from 'react-redux';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import {
  deleteQuestion,
  replaceQuestion,
  getClassQuiz,
  editSubjectiveQuestion,
  deleteTeacherClassTask,
  getTeacherClassTasks,
} from '@/store/classSlice';

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

jest.mock('@react-navigation/native', () => ({
  useFocusEffect: jest.fn(),
  useNavigation: jest.fn(),
}));

jest.mock('@/store/classSlice', () => ({
  deleteQuestion: jest.fn((id: number) => ({ type: 'classes/deleteQuestion', payload: id })),
  replaceQuestion: jest.fn((payload: any) => ({ type: 'classes/replaceQuestion', payload })),
  getClassQuiz: jest.fn((id: number) => ({ type: 'classes/getClassQuiz', payload: id })),
  editSubjectiveQuestion: jest.fn((payload: any) => ({
    type: 'classes/editSubjectiveQuestion',
    payload,
  })),
  editObjectiveQuestion: jest.fn(),
  publishQuiz: jest.fn(),
  deleteTeacherClassTask: jest.fn((id: number) => ({
    type: 'classes/deleteTeacherClassTask',
    payload: id,
  })),
  getTeacherClassTasks: jest.fn(() => ({ type: 'classes/getTeacherClassTasks' })),
  addTaskToClass: jest.fn(),
  addSlipTestToClass: jest.fn(),
  updateSlipTest: jest.fn(),
  getClassTopicSubTopics: jest.fn(),
  setClassTopicSubTopic: jest.fn(),
  saveSlipTestQuiz: jest.fn(),
  cancelSlipTestQuiz: jest.fn(),
  getLiveClass: jest.fn(),
  getScheduleClasses: jest.fn(),
  getTaskStatus: jest.fn(),
}));

jest.mock('@/store/liveMonitoringSlice', () => ({
  clearSelectedTaskData: jest.fn(() => ({ type: 'live/clearSelectedTaskData' })),
  getSlipTestResults: jest.fn(() => ({ type: 'live/getSlipTestResults' })),
  setSelectedTask: jest.fn(),
  setSelectedTaskData: jest.fn(),
  setSelectedTaskId: jest.fn(),
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
jest.mock('@/components/PrepClass/EditWriteQuestionModal', () => () => null);
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

const mockedUseDispatch = useDispatch as unknown as jest.Mock;
const mockedUseSelector = useSelector as unknown as jest.Mock;
const mockedUseFocusEffect = useFocusEffect as unknown as jest.Mock;
const mockedUseNavigation = useNavigation as unknown as jest.Mock;
const mockedDeleteQuestion = deleteQuestion as unknown as jest.Mock;
const mockedReplaceQuestion = replaceQuestion as unknown as jest.Mock;
const mockedGetClassQuiz = getClassQuiz as unknown as jest.Mock;
const mockedEditSubjectiveQuestion = editSubjectiveQuestion as unknown as jest.Mock;
const mockedDeleteTeacherClassTask = deleteTeacherClassTask as unknown as jest.Mock;
const mockedGetTeacherClassTasks = getTeacherClassTasks as unknown as jest.Mock;

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

const LiveMonitorHarness = ({ classTasks }: { classTasks: any[] }) => {
  const classPrepRef = useRef<any>(null);
  const deleteTask = (taskId: number, taskType: string) => {
    classPrepRef.current?.deleteTask(taskId, taskType, true);
  };
  return (
    <View>
      <Text>live-monitoring-screen</Text>
      {classTasks.map((task) => (
        <View key={task.task_id}>
          <Quiz
            task={task}
            refreshTasks={jest.fn()}
            editTask={jest.fn()}
            deleteTask={deleteTask}
            viewTask={jest.fn()}
          />
        </View>
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

describe('Slip Test publish flow', () => {
  describe('preview question actions', () => {
    let quizState: any;
    let dispatchMock: jest.Mock;

    const setQuizQuestions = (questions: any[]) => {
      quizState = { ...baseQuizDetails, questions };
      mockedUseSelector.mockImplementation((selector) =>
        selector({
          classes: { quiz_details: quizState, loading: false },
        })
      );
    };

    const renderPreview = () => {
      setQuizQuestions(quizState.questions);
      return render(<SlipTestDetailsModal {...previewBaseProps} />);
    };

    const openMenuForFirstQuestion = async (utils: ReturnType<typeof render>) => {
      await utils.findByText('What is ratio?');
      fireEvent.press(utils.getAllByLabelText('question-menu')[0]);
    };

    beforeEach(() => {
      jest.clearAllMocks();
      quizState = {
        ...baseQuizDetails,
        questions: [
          makeQuestion(1, 'What is ratio?', 'original answer'),
          makeQuestion(2, 'Second question', 'answer two'),
        ],
      };
      dispatchMock = jest.fn().mockResolvedValue({
        payload: {
          new_question: makeQuestion(1, 'Replaced question text', 'replaced answer'),
          original_question_id: 1,
        },
      });
      mockedUseDispatch.mockReturnValue(dispatchMock);
      setQuizQuestions(quizState.questions);
    });

    it('deletes a question when Delete is confirmed from preview', async () => {
      const utils = renderPreview();
      await openMenuForFirstQuestion(utils);
      fireEvent.press(await utils.findByText('Delete'));
      await utils.findByText('Delete Question?');

      await act(async () => {
        const deleteButtons = utils.getAllByText('Delete');
        fireEvent.press(deleteButtons[deleteButtons.length - 1]);
      });

      await waitFor(() => {
        expect(mockedDeleteQuestion).toHaveBeenCalledWith(1);
        expect(mockedGetClassQuiz).toHaveBeenCalledWith(10);
      });

      setQuizQuestions([makeQuestion(2, 'Second question', 'answer two')]);
      utils.rerender(<SlipTestDetailsModal {...previewBaseProps} />);

      await waitFor(() => {
        expect(utils.queryByText('What is ratio?')).toBeNull();
        expect(utils.getByText('Second question')).toBeTruthy();
      });
    });

    it('replaces a question when Replace is confirmed from preview', async () => {
      const utils = renderPreview();
      await openMenuForFirstQuestion(utils);
      fireEvent.press(await utils.findByText('Replace'));
      await utils.findByText('Replace Question?');

      await act(async () => {
        const replaceButtons = utils.getAllByText('Replace');
        fireEvent.press(replaceButtons[replaceButtons.length - 1]);
      });

      await waitFor(() => {
        expect(mockedReplaceQuestion).toHaveBeenCalledWith({
          question_id: 1,
          additional_context: 'I want this question changed',
        });
      });
    });

    it('saves edited question when Save is pressed in edit modal', async () => {
      const utils = renderPreview();
      await openMenuForFirstQuestion(utils);
      fireEvent.press(await utils.findByText('Edit'));
      await utils.findByText('*Question');

      fireEvent.changeText(await utils.findByDisplayValue('What is ratio?'), 'Updated ratio question');
      fireEvent.changeText(await utils.findByDisplayValue('original answer'), 'updated answer');

      await act(async () => {
        fireEvent.press(utils.getAllByText('Save')[0]);
      });

      await waitFor(() => {
        expect(mockedEditSubjectiveQuestion).toHaveBeenCalledWith({
          question_id: 1,
          question: 'Updated ratio question',
          description: '',
          subjective_answer: 'updated answer',
        });
      });
    });

    it('does not change question when edit is cancelled', async () => {
      const utils = renderPreview();
      await openMenuForFirstQuestion(utils);
      fireEvent.press(await utils.findByText('Edit'));

      fireEvent.changeText(await utils.findByDisplayValue('What is ratio?'), 'Draft change only');

      await act(async () => {
        fireEvent.press(utils.getAllByText('Cancel')[0]);
      });

      await waitFor(() => {
        expect(mockedEditSubjectiveQuestion).not.toHaveBeenCalled();
        expect(utils.queryByText('*Question')).toBeNull();
      });

      expect(utils.getByText('What is ratio?')).toBeTruthy();
    });
  });

  describe('live monitoring task card', () => {
    let classTasks: any[];
    let dispatchMock: jest.Mock;

    const syncSelector = () => {
      mockedUseSelector.mockImplementation((selector) =>
        selector({
          classes: {
            classTasks,
            liveClass: selectedClass,
            quiz_details: { questions: [], title: '', topic: '', sub_topic: '' },
            loading: false,
          },
          liveMonitor: { selectedTaskSection: '', classId: 123, selectedTaskId: null },
          user: { user: { id: 44, school_id: 1 } },
        })
      );
    };

    beforeEach(() => {
      jest.clearAllMocks();
      let hasRunFocusEffect = false;
      mockedUseFocusEffect.mockImplementation((cb: any) => {
        if (!hasRunFocusEffect) {
          hasRunFocusEffect = true;
          cb();
        }
      });

      classTasks = [slipTestTask];
      dispatchMock = jest.fn().mockImplementation(async (action: any) => {
        if (typeof action === 'object' && action.type === 'classes/deleteTeacherClassTask') {
          classTasks = classTasks.filter((task) => task.task_id !== action.payload);
          return { payload: {} };
        }
        if (typeof action === 'object' && action.type === 'classes/getTeacherClassTasks') {
          return { payload: classTasks };
        }
        return { payload: {} };
      });
      mockedUseDispatch.mockReturnValue(dispatchMock);
      mockedUseNavigation.mockReturnValue({ navigate: jest.fn(), setOptions: jest.fn() });
      syncSelector();
    });

    it('deletes slip test card when Delete is confirmed from task menu', async () => {
      const utils = render(<LiveMonitorHarness classTasks={classTasks} />);

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
        expect(mockedDeleteTeacherClassTask).toHaveBeenCalledWith(99);
        expect(mockedGetTeacherClassTasks).toHaveBeenCalled();
        expect(utils.queryByText('Delete Task?')).toBeNull();
      });

      syncSelector();
      utils.rerender(<LiveMonitorHarness classTasks={classTasks} />);

      expect(utils.queryByText('Slip Test Ratios')).toBeNull();
      expect(utils.queryByText('In Queue')).toBeNull();
    });
  });
});
