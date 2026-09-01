import React, { useCallback, useState } from 'react';
import moment from 'moment';
import { setupAuthenticatedTest } from '../test-utils/setupTest';
import { act, fireEvent, waitFor } from '@testing-library/react-native';

import TimelineCard from '@/components/dashboard/TimelineCard';
import { getScheduleClasses } from '@/store/classSlice';
import { useDispatch } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import { renderWithProviders } from '../test-utils/renderWithProviders';
import { createClassPrepState } from '../test-utils/defaultState';
import {
  mockAxiosResponse,
  mockClassPrepOpenApis,
  mockedAxios,
} from '../test-utils/mockApi';

jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(() => ({ navigate: jest.fn(), setOptions: jest.fn() })),
  useFocusEffect: jest.fn(),
}));

jest.mock('react-native-elements', () => ({
  Badge: 'Badge',
}));

jest.mock('@/components/Modals/Modal_1_SummaryModal', () => {
  const { createSummaryModalMock } = require('../mocks/classPrepModals');
  return createSummaryModalMock({
    topic: 'Periodic Table',
    subTopic: { id: 1, sub_topic: 'Elements and Symbols' },
    showTopicPickerLabels: true,
  });
});

jest.mock('@/components/Modals/Modal_2_ClassTaskModal', () => {
  const { createClassTaskModalMock } = require('../mocks/classPrepModals');
  return createClassTaskModalMock({ secondaryAction: { label: 'Close', onPress: 'onClose' } });
});

jest.mock('@/components/Modals/Modal_3_CreateTaskModal', () => {
  const { createTaskModalMock } = require('../mocks/classPrepModals');
  return createTaskModalMock('AICheck', { createLabel: 'Create AI Check' });
});

jest.mock('@/components/Modals/Modal_4_AICheckModal', () => {
  const { createAICheckFormShellMock } = require('../mocks/classPrepModals');
  return createAICheckFormShellMock();
});
jest.mock('@/components/Modals/Modal_5_GenerateSlipTest', () => 'GenerateSlipTestModal');
jest.mock('@/components/Modals/Modal_6_SlipTestDetails', () => 'TestSettingsModal');
jest.mock('@/components/Modals/ClassworkModal', () => 'ClassworkCheckModal');
jest.mock('@/components/Modals/SlipTestModal', () => 'SlipTestDetailsModal');
jest.mock('@/components/PrepClass/DeleteQuestionModal', () => 'DeleteQuestionModal');
jest.mock('@/components/PrepClass/LoadingSlipTestModal', () => 'LoadingSlipTestModal');

const mockedUseFocusEffect = useFocusEffect as unknown as jest.Mock;

const TEXT = {
  CARD_TIME: '09:00 - 09:30',
  PREPARE: 'Prepare for Class',
  NEXT: 'Next',
  AI_ASSISTANT: 'Your AI-Powered Assistant',
  ADD_TASK: '+ Add a Task',
  TASK_MODAL: 'Task Modal',
  CREATE_AI_CHECK: 'Create AI Check',
  AI_CHECK_FORM: 'AI Check Form',
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

const renderTimelineCard = async (selectedClass: SelectedClassFixture = selectedClassWithoutTopic) => {
  await setupAuthenticatedTest();
  mockClassPrepOpenApis();
  return renderWithProviders(
    <TimelineCard
      idx="0-0"
      item={timelineItem}
      height={2}
      currentDate={today}
      selectedClass={selectedClass}
    />,
    {
      preloadedState: createClassPrepState({
        topics: [
          {
            topic: 'Periodic Table',
            sub_topic: [{ id: 1, sub_topic: 'Elements and Symbols' }],
          },
        ],
      }),
    }
  );
};

const openPrepareClassPopup = async (
  getByText: (text: string) => any,
  findByText: (text: string) => Promise<any>
) => {
  fireEvent.press(getByText(TEXT.CARD_TIME));
  await findByText(TEXT.PREPARE);
};

describe('Timeline card', () => {
  it('opens prepare class popup with topic and subtopic fields on first click', async () => {
    const { getByText, queryByText, findByText } = await renderTimelineCard();

    expect(queryByText(TEXT.PREPARE)).toBeNull();

    await openPrepareClassPopup(getByText, findByText);

    expect(getByText('Set Topic')).toBeTruthy();
    expect(getByText('Topic  :')).toBeTruthy();
    expect(getByText('Sub Topic :')).toBeTruthy();

    expect(mockedAxios).toHaveBeenCalled();
  });

  it('saves topic and subtopic on Next, then opens AI assistant on second card click', async () => {
    const { getByText, queryByText, findByText, rerender } = await renderTimelineCard();

    await openPrepareClassPopup(getByText, findByText);
    mockAxiosResponse({});
    mockAxiosResponse([]);
    mockAxiosResponse(null);

    await act(async () => {
      fireEvent.press(getByText(TEXT.NEXT));
    });

    await waitFor(() => {
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

    mockClassPrepOpenApis();
    fireEvent.press(getByText(TEXT.CARD_TIME));

    await waitFor(() => {
      expect(getByText(TEXT.AI_ASSISTANT)).toBeTruthy();
      expect(getByText(TEXT.ADD_TASK)).toBeTruthy();
    });
  });

  it('does not open prepare class popup when class is already over', () => {
    const { getByText, queryByText } = renderWithProviders(
      <TimelineCard
        idx="0-1"
        item={{ ...timelineItem, isClassOver: true }}
        height={2}
        currentDate={today}
        selectedClass={selectedClassWithoutTopic}
      />,
      { preloadedState: createClassPrepState({ topics: [] }) }
    );

    fireEvent.press(getByText(TEXT.CARD_TIME));

    expect(queryByText(TEXT.PREPARE)).toBeNull();
    expect(mockedAxios).not.toHaveBeenCalled();
  });

  it('opens AI check form when Create AI Check is pressed from task modal on timeline', async () => {
    const { getByText, findByText } = await renderTimelineCard(selectedClassWithTopic);

    fireEvent.press(getByText(TEXT.CARD_TIME));
    await waitFor(() => {
      expect(getByText(TEXT.AI_ASSISTANT)).toBeTruthy();
    });

    fireEvent.press(getByText(TEXT.ADD_TASK));
    await findByText(TEXT.TASK_MODAL);
    fireEvent.press(await findByText(TEXT.CREATE_AI_CHECK));
    await findByText(TEXT.AI_CHECK_FORM);
  });
});

function TimelineCalendarHarness() {
  const dispatch = useDispatch<any>();
  const [show, setShow] = useState(false);
  const [calendarDate, setCalendarDate] = useState(moment(new Date()).format('DD-MM-YYYY'));

  const fetchSchedule = async (currentDate: string) => {
    await dispatch(getScheduleClasses({ date: currentDate }));
  };

  useFocusEffect(
    useCallback(() => {
      setCalendarDate(moment(new Date()).format('DD-MM-YYYY'));
      fetchSchedule(moment(new Date()).format('YYYY-MM-DD'));
    }, [])
  );

  const onDateChange = (selectedDate: string) => {
    setShow(false);
    setCalendarDate(moment(selectedDate).format('DD-MM-YYYY'));
    fetchSchedule(moment(selectedDate).format('YYYY-MM-DD'));
  };

  const { View, Text, TouchableOpacity } = require('react-native');

  return (
    <View>
      <Text>Today's Timeline</Text>
      <TouchableOpacity accessibilityLabel="calendar-icon" onPress={() => setShow(!show)}>
        <Text>CalendarIcon</Text>
      </TouchableOpacity>
      <Text>{calendarDate}</Text>
      {show ? (
        <TouchableOpacity
          accessibilityLabel="select-calendar-day"
          onPress={() => onDateChange('2026-09-15')}
        >
          <Text>Select Calendar Day</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

describe('Timeline calendar', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    let hasRunFocusEffect = false;
    mockedUseFocusEffect.mockImplementation((cb: () => void) => {
      if (!hasRunFocusEffect) {
        hasRunFocusEffect = true;
        cb();
      }
    });
  });

  it('fetches schedule on mount for today', async () => {
    mockAxiosResponse([]);
    renderWithProviders(<TimelineCalendarHarness />);

    await waitFor(() => {
      expect(mockedAxios).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            date: moment(new Date()).format('YYYY-MM-DD'),
          }),
        })
      );
    });
  });

  it('fetches schedule when a new date is selected from calendar', async () => {
    mockAxiosResponse([]);
    const { getByLabelText, findByLabelText, getByText } = renderWithProviders(
      <TimelineCalendarHarness />
    );

    fireEvent.press(getByLabelText('calendar-icon'));
    mockAxiosResponse([]);
    fireEvent.press(await findByLabelText('select-calendar-day'));

    await waitFor(() => {
      expect(mockedAxios).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ date: '2026-09-15' }),
        })
      );
      expect(getByText('15-09-2026')).toBeTruthy();
    });
  });
});
