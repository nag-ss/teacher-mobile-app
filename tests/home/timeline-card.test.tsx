import React from 'react';
import moment from 'moment';
import { fireEvent, render, waitFor } from '@testing-library/react-native';

import TimelineCard from '@/components/dashboard/TimelineCard';
import { useDispatch, useSelector } from 'react-redux';
import {
  getTeacherClassTasks,
  getClassTopicSubTopics,
  setClassTopicSubTopic,
} from '@/store/classSlice';

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(() => ({ navigate: jest.fn(), setOptions: jest.fn() })),
}));

jest.mock('@expo/vector-icons', () => ({
  MaterialIcons: 'MaterialIcons',
}));

jest.mock('react-native-elements', () => ({
  Badge: 'Badge',
}));

jest.mock('@/utils/SvgLoader', () => 'SvgLoader');

jest.mock('@/store/classSlice', () => ({
  getTeacherClassTasks: jest.fn((payload) => ({
    type: 'classes/getTeacherClassTasks',
    payload,
  })),
  getClassTopicSubTopics: jest.fn((payload) => ({
    type: 'classes/getClassTopicSubTopics',
    payload,
  })),
  setClassTopicSubTopic: jest.fn((payload) => ({
    type: 'classes/setClassTopicSubTopic',
    payload,
  })),
  getScheduleClasses: jest.fn(() => ({ type: 'classes/getScheduleClasses' })),
  getLiveClass: jest.fn(() => ({ type: 'classes/getLiveClass' })),
  addTaskToClass: jest.fn(),
  editTeacherClassTask: jest.fn(),
  deleteTeacherClassTask: jest.fn(),
  addSlipTestToClass: jest.fn(),
  updateSlipTest: jest.fn(),
  getClassQuiz: jest.fn(),
  saveSlipTestQuiz: jest.fn(),
  cancelSlipTestQuiz: jest.fn(),
}));

jest.mock('@/components/Modals/Modal_1_SummaryModal', () => {
  const React = require('react');
  const { Text, View, TouchableOpacity } = require('react-native');
  return function MockSummaryModal(props: any) {
    if (!props.visible) return null;
    return (
      <View>
        <Text>Prepare for Class</Text>
        <Text>Set Topic</Text>
        <Text>Topic  :</Text>
        <Text>Sub Topic :</Text>
        <TouchableOpacity
          onPress={() =>
            props.setTopicSubTopicAndMoveToNext(
              { topic: 'Periodic Table' },
              { id: 1, sub_topic: 'Elements and Symbols' }
            )
          }
        >
          <Text>Next</Text>
        </TouchableOpacity>
      </View>
    );
  };
});

jest.mock('@/components/Modals/Modal_2_ClassTaskModal', () => {
  const React = require('react');
  const { Text, TouchableOpacity, View } = require('react-native');
  return function MockClassTaskModal(props: any) {
    if (!props.visible) return null;
    return (
      <View>
        <Text>Your AI-Powered Assistant</Text>
        <TouchableOpacity onPress={props.onClose}>
          <Text>Close</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={props.addTask}>
          <Text>+ Add a Task</Text>
        </TouchableOpacity>
      </View>
    );
  };
});

jest.mock('@/components/Modals/Modal_3_CreateTaskModal', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return function MockTaskModal(props: any) {
    if (!props.visible) return null;
    return <Text>Task Modal</Text>;
  };
});

jest.mock('@/components/Modals/Modal_4_AICheckModal', () => 'AiCheckModal');
jest.mock('@/components/Modals/Modal_5_GenerateSlipTest', () => 'GenerateSlipTestModal');
jest.mock('@/components/Modals/Modal_6_SlipTestDetails', () => 'TestSettingsModal');
jest.mock('@/components/Modals/ClassworkModal', () => 'ClassworkCheckModal');
jest.mock('@/components/Modals/SlipTestModal', () => 'SlipTestDetailsModal');
jest.mock('@/components/PrepClass/DeleteQuestionModal', () => 'DeleteQuestionModal');
jest.mock('@/components/PrepClass/LoadingSlipTestModal', () => 'LoadingSlipTestModal');

const mockedUseDispatch = useDispatch as unknown as jest.Mock;
const mockedUseSelector = useSelector as unknown as jest.Mock;
const mockedGetTeacherClassTasks = getTeacherClassTasks as unknown as jest.Mock;
const mockedGetClassTopicSubTopics = getClassTopicSubTopics as unknown as jest.Mock;
const mockedSetClassTopicSubTopic = setClassTopicSubTopic as unknown as jest.Mock;

const TEXT = {
  CARD_TIME: '09:00 - 09:30',
  PREPARE: 'Prepare for Class',
  NEXT: 'Next',
  AI_ASSISTANT: 'Your AI-Powered Assistant',
  ADD_TASK: '+ Add a Task',
  TASK_MODAL: 'Task Modal',
  CLOSE: 'Close',
} as const;

const today = moment().format('YYYY-MM-DD');

const timelineItem = {
  classId: 123,
  time: TEXT.CARD_TIME,
  category: 'Chemistry',
  live: false,
  startTime: '09:00',
  classLength: 30,
  isClassOver: false,
};

type ClassDetailFixture = {
  topic: string;
  sub_topic: string[];
};

type SelectedClassFixture = {
  class_schedule_id: number;
  teacher_id: number;
  division_id: number;
  subject_id: number;
  division_name: string;
  section_name: string;
  date: string;
  class_details: ClassDetailFixture[];
};

const selectedClassWithoutTopic: SelectedClassFixture = {
  class_schedule_id: 123,
  teacher_id: 11,
  division_id: 7,
  subject_id: 5,
  division_name: 'Grade 6',
  section_name: 'A',
  date: today,
  class_details: [],
};

const selectedClassWithTopic: SelectedClassFixture = {
  ...selectedClassWithoutTopic,
  class_details: [{ topic: 'Periodic Table', sub_topic: ['Elements and Symbols'] }],
};

const defaultState = {
  classes: {
    classTasks: [],
    topics: [
      {
        topic: 'Periodic Table',
        sub_topic: [{ id: 1, sub_topic: 'Elements and Symbols' }],
      },
    ],
  },
  user: { user: { id: 44 } },
};

const renderTimelineCard = (selectedClass: SelectedClassFixture = selectedClassWithoutTopic) => {
  const dispatchMock = jest.fn().mockResolvedValue(undefined);
  mockedUseDispatch.mockReturnValue(dispatchMock);
  mockedUseSelector.mockImplementation((selector) => selector(defaultState));

  return {
    dispatchMock,
    ...render(
      <TimelineCard
        idx="0-0"
        item={timelineItem}
        height={2}
        currentDate={today}
        selectedClass={selectedClass}
      />
    ),
  };
};

const openPrepareClassPopup = async (
  getByText: (text: string) => any,
  findByText: (text: string) => Promise<any>
) => {
  fireEvent.press(getByText(TEXT.CARD_TIME));
  await findByText(TEXT.PREPARE);
};

describe('TimelineCard prepare class', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('opens prepare class popup with topic and subtopic fields on first click', async () => {
    const { getByText, queryByText, findByText, dispatchMock } = renderTimelineCard();

    expect(queryByText(TEXT.PREPARE)).toBeNull();

    await openPrepareClassPopup(getByText, findByText);

    expect(getByText('Set Topic')).toBeTruthy();
    expect(getByText('Topic  :')).toBeTruthy();
    expect(getByText('Sub Topic :')).toBeTruthy();

    expect(mockedGetTeacherClassTasks).toHaveBeenCalledWith({
      class_schedule_id: 123,
      teacher_id: 44,
      subject_id: 5,
      division_id: 7,
    });
    expect(mockedGetClassTopicSubTopics).toHaveBeenCalledWith({
      subject_id: 5,
      division_id: 7,
    });
    expect(dispatchMock).toHaveBeenCalled();
  });

  it('saves topic and subtopic on Next, then opens AI assistant on second card click', async () => {
    const { getByText, queryByText, findByText, rerender } = renderTimelineCard();

    await openPrepareClassPopup(getByText, findByText);
    fireEvent.press(getByText(TEXT.NEXT));

    await waitFor(() => {
      expect(mockedSetClassTopicSubTopic).toHaveBeenCalledWith({
        class_schedule_id: 123,
        subject_topic_id: 1,
      });
      expect(queryByText(TEXT.PREPARE)).toBeNull();
    });

    fireEvent.press(getByText(TEXT.CLOSE));
    expect(queryByText(TEXT.AI_ASSISTANT)).toBeNull();

    rerender(
      <TimelineCard
        idx="0-0"
        item={timelineItem}
        height={2}
        currentDate={today}
        selectedClass={selectedClassWithTopic}
      />
    );

    fireEvent.press(getByText(TEXT.CARD_TIME));

    await waitFor(() => {
      expect(getByText(TEXT.AI_ASSISTANT)).toBeTruthy();
      expect(getByText(TEXT.ADD_TASK)).toBeTruthy();
    });
  });

  it('opens task modal when Add a Task is pressed from AI assistant popup', async () => {
    const { getByText, queryByText, findByText } = renderTimelineCard(selectedClassWithTopic);

    fireEvent.press(getByText(TEXT.CARD_TIME));

    await waitFor(() => {
      expect(getByText(TEXT.AI_ASSISTANT)).toBeTruthy();
    });

    fireEvent.press(getByText(TEXT.ADD_TASK));
    await findByText(TEXT.TASK_MODAL);
    expect(queryByText(TEXT.PREPARE)).toBeNull();
  });

  it('does not open prepare class popup when class is already over', () => {
    const dispatchMock = jest.fn().mockResolvedValue(undefined);
    mockedUseDispatch.mockReturnValue(dispatchMock);
    mockedUseSelector.mockImplementation((selector) =>
      selector({
        classes: { classTasks: [], topics: [] },
        user: { user: { id: 44 } },
      })
    );

    const { getByText, queryByText } = render(
      <TimelineCard
        idx="0-1"
        item={{ ...timelineItem, isClassOver: true }}
        height={2}
        currentDate={today}
        selectedClass={selectedClassWithoutTopic}
      />
    );

    fireEvent.press(getByText(TEXT.CARD_TIME));

    expect(queryByText(TEXT.PREPARE)).toBeNull();
    expect(mockedGetTeacherClassTasks).not.toHaveBeenCalled();
  });
});
