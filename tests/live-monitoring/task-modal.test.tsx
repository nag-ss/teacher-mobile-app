import React, { useRef } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { fireEvent } from '@testing-library/react-native';
import ClassPrep from '@/components/dashboard/ClassPrep';
import { useNavigation } from '@react-navigation/native';
import { renderWithProviders } from '../test-utils/renderWithProviders';
import { createClassPrepState } from '../test-utils/defaultState';
import { mockClassPrepOpenApis } from '../test-utils/mockApi';

jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
}));

jest.mock('@/components/Modals/Modal_1_SummaryModal', () => {
  const { createSummaryModalMock } = require('../mocks/classPrepModals');
  return createSummaryModalMock();
});

jest.mock('@/components/Modals/Modal_2_ClassTaskModal', () => {
  const { createClassTaskModalMock } = require('../mocks/classPrepModals');
  return createClassTaskModalMock({ secondaryAction: { label: 'Edit', onPress: 'goBack' } });
});

jest.mock('@/components/Modals/Modal_3_CreateTaskModal', () => {
  const { createTaskModalMock } = require('../mocks/classPrepModals');
  return createTaskModalMock('AICheck', { showCancel: true });
});

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
  mockClassPrepOpenApis();
  mockedUseNavigation.mockReturnValue({ navigate: jest.fn(), setOptions: jest.fn() });
  return renderWithProviders(<ClassPrepHarness selectedClassData={selectedClassData} />, {
    preloadedState: createClassPrepState(),
  });
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

describe('Task modal flow', () => {
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
