import React, { useRef } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { fireEvent, render } from '@testing-library/react-native';

import ClassPrep from '@/components/dashboard/ClassPrep';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

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

jest.mock('@/components/Modals/Modal_1_SummaryModal', () => {
  const React = require('react');
  const { Text, TouchableOpacity } = require('react-native');
  return function MockSummaryModal(props: any) {
    if (!props.visible) return null;
    return (
      <>
        <Text>Prepare for Class</Text>
        <TouchableOpacity
          onPress={() =>
            props.setTopicSubTopicAndMoveToNext(
              { topic: 'Ratios' },
              { id: 99, sub_topic: 'Basics' }
            )
          }
        >
          <Text>Next</Text>
        </TouchableOpacity>
      </>
    );
  };
});

jest.mock('@/components/Modals/Modal_2_ClassTaskModal', () => {
  const React = require('react');
  const { Text, TouchableOpacity } = require('react-native');
  return function MockClassTaskModal(props: any) {
    if (!props.visible) return null;
    return (
      <>
        <Text>Your AI-Powered Assistant</Text>
        <TouchableOpacity onPress={props.goBack}>
          <Text>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={props.addTask}>
          <Text>+ Add a Task</Text>
        </TouchableOpacity>
      </>
    );
  };
});

jest.mock('@/components/Modals/Modal_3_CreateTaskModal', () => {
  const React = require('react');
  const { Text, TouchableOpacity } = require('react-native');
  return function MockNewTaskModal(props: any) {
    if (!props.visible) return null;
    return (
      <>
        <Text>Task Modal</Text>
        <TouchableOpacity onPress={props.onClose}>
          <Text>Cancel</Text>
        </TouchableOpacity>
      </>
    );
  };
});

const mockedUseDispatch = useDispatch as unknown as jest.Mock;
const mockedUseSelector = useSelector as unknown as jest.Mock;
const mockedUseNavigation = useNavigation as unknown as jest.Mock;

const TEXT = {
  ADD_TASK_BUTTON: 'add-task-button',
  PREPARE: 'Prepare for Class',
  NEXT: 'Next',
  AI: 'Your AI-Powered Assistant',
  EDIT: 'Edit',
  ADD_TASK: '+ Add a Task',
  TASK_MODAL: 'Task Modal',
  CANCEL: 'Cancel',
} as const;

const selectedClass = {
  class_schedule_id: 123,
  teacher_id: 11,
  division_id: 7,
  subject_id: 5,
  division_name: 'Grade 6',
  section_name: 'A',
  date: '2026-04-30',
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
  mockedUseDispatch.mockReturnValue(jest.fn());
  mockedUseNavigation.mockReturnValue({ navigate: jest.fn(), setOptions: jest.fn() });
  return render(<ClassPrepHarness selectedClassData={selectedClassData} />);
};

const openAIModal = async (
  getByLabelText: (label: string) => any,
  findByText: (text: string) => Promise<any>
) => {
  fireEvent.press(getByLabelText(TEXT.ADD_TASK_BUTTON));
  await findByText(TEXT.PREPARE);
  fireEvent.press(await findByText(TEXT.NEXT));
  await findByText(TEXT.AI);
};

describe('Live monitoring add task flow', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    const mockState = {
      classes: {
        classTasks: [],
        topics: [{ topic: 'Ratios', sub_topic: [{ id: 99, sub_topic: 'Basics' }] }],
        quiz_details: { questions: [], title: '' },
        loading: false,
      },
      user: { user: { id: 44 } },
    };
    mockedUseSelector.mockImplementation((selector) => selector(mockState));
  });

  it('opens AI assistant popup after selecting topic/subtopic and pressing Next', async () => {
    const { getByLabelText, findByText } = setup();
    await openAIModal(getByLabelText, findByText);
  });

  it('goes back to topic/subtopic popup when Edit is pressed', async () => {
    const { getByLabelText, findByText } = setup();
    await openAIModal(getByLabelText, findByText);

    fireEvent.press(await findByText(TEXT.EDIT));
    await findByText(TEXT.PREPARE);
  });

  it('re-opens AI assistant popup when Next is pressed again after Edit', async () => {
    const { getByLabelText, findByText } = setup();
    await openAIModal(getByLabelText, findByText);

    fireEvent.press(await findByText(TEXT.EDIT));
    await findByText(TEXT.PREPARE);
    fireEvent.press(await findByText(TEXT.NEXT));
    await findByText(TEXT.AI);
  });

  it('opens task modal when + Add a Task is pressed in AI assistant modal', async () => {
    const { getByLabelText, findByText } = setup();
    await openAIModal(getByLabelText, findByText);

    fireEvent.press(await findByText(TEXT.ADD_TASK));
    await findByText(TEXT.TASK_MODAL);
  });

  it('closes task modal when Cancel is pressed', async () => {
    const { getByLabelText, findByText, queryByText } = setup();
    await openAIModal(getByLabelText, findByText);

    fireEvent.press(await findByText(TEXT.ADD_TASK));
    await findByText(TEXT.TASK_MODAL);

    fireEvent.press(await findByText(TEXT.CANCEL));
    expect(queryByText(TEXT.TASK_MODAL)).toBeNull();
  });

  it('opens task modal directly when topic and subtopic are already set', async () => {
    const selectedClassWithTopic = {
      ...selectedClass,
      class_details: [{ topic: 'Ratios', sub_topic: ['Basics'] }],
    };
    const { getByLabelText, findByText, queryByText } = setup(selectedClassWithTopic);

    fireEvent.press(getByLabelText(TEXT.ADD_TASK_BUTTON));

    await findByText(TEXT.TASK_MODAL);
    expect(queryByText(TEXT.PREPARE)).toBeNull();
  });
});
