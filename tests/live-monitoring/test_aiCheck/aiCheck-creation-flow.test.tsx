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
  const { Text, TouchableOpacity, View } = require('react-native');
  return function MockClassTaskModal(props: any) {
    const [showOptions, setShowOptions] = React.useState(false);
    const [showAiCheckCard, setShowAiCheckCard] = React.useState(true);
    if (!props.visible) return null;
    return (
      <View>
        <Text>Your AI-Powered Assistant</Text>
        {showAiCheckCard ? (
          <>
            <Text>AI Check Card</Text>
            <TouchableOpacity onPress={() => setShowOptions(!showOptions)}>
              <Text>More</Text>
            </TouchableOpacity>
            {showOptions ? (
              <TouchableOpacity onPress={() => setShowAiCheckCard(false)}>
                <Text>Delete</Text>
              </TouchableOpacity>
            ) : null}
          </>
        ) : null}
        <TouchableOpacity onPress={props.addTask}>
          <Text>+ Add a Task</Text>
        </TouchableOpacity>
      </View>
    );
  };
});

jest.mock('@/components/Modals/Modal_3_CreateTaskModal', () => {
  const React = require('react');
  const { Text, TouchableOpacity } = require('react-native');
  return function MockTaskModal(props: any) {
    if (!props.visible) return null;
    return (
      <>
        <Text>Task Modal</Text>
        <TouchableOpacity onPress={() => props.clickedNext('AICheck')}>
          <Text>Create</Text>
        </TouchableOpacity>
      </>
    );
  };
});

jest.mock('@/components/Modals/Modal_4_AICheckModal', () => {
  const React = require('react');
  const { Text, View } = require('react-native');
  return function MockAiCheckModal({ visible }: any) {
    if (!visible) return null;
    return (
      <View>
        <Text>AI Check</Text>
      </View>
    );
  };
});

jest.mock('@/components/Modals/ClassworkModal', () => () => null);

const mockedUseDispatch = useDispatch as unknown as jest.Mock;
const mockedUseSelector = useSelector as unknown as jest.Mock;
const mockedUseNavigation = useNavigation as unknown as jest.Mock;

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

const setup = (selectedClassData?: any) => {
  mockedUseDispatch.mockReturnValue(jest.fn());
  mockedUseNavigation.mockReturnValue({ navigate: jest.fn(), setOptions: jest.fn() });
  return render(<ClassPrepHarness selectedClassData={selectedClassData} />);
};

const openTaskModal = async (
  getByLabelText: (label: string) => any,
  findByText: (text: string) => Promise<any>
) => {
  fireEvent.press(getByLabelText(TEXT.ADD_TASK_BUTTON));
  await findByText(TEXT.TASK_MODAL);
};

describe('AI Check creation flow', () => {
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

  it('opens AI check popup when AI check create is pressed from task modal', async () => {
    const { getByLabelText, findByText } = setup();
    await openTaskModal(getByLabelText, findByText);
    fireEvent.press(await findByText(TEXT.CREATE));
    await findByText(TEXT.AI_CHECK_POPUP);
  });

  it('deletes AI check card when Delete is pressed from 3 dots options', async () => {
    const { getByLabelText, findByText, queryByText } = setup(selectedClassWithoutTopic);
    fireEvent.press(getByLabelText(TEXT.ADD_TASK_BUTTON));
    await findByText(TEXT.PREPARE);
    fireEvent.press(await findByText(TEXT.NEXT));
    await findByText(TEXT.AI_CHECK_CARD);
    fireEvent.press(await findByText(TEXT.MORE));
    fireEvent.press(await findByText(TEXT.DELETE));
    expect(queryByText(TEXT.AI_CHECK_CARD)).toBeNull();
  });
});
