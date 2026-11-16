import { useCallback, useEffect, useMemo, useState } from 'react';
import { LayoutChangeEvent } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import moment from 'moment';
import { getScheduleClasses } from '@/store/classSlice';
import { getGradeChip } from '@/utils/grade';

export const DAY_LABELS = ['Yesterday', 'Today', 'Tomorrow'] as const;

export const DAY_START_HOUR = 8;
export const DAY_END_HOUR = 17;
export const HOUR_SPAN = DAY_END_HOUR - DAY_START_HOUR;
/** Matches ~measured grid when timeline card is at maxHeight 650. */
export const DEFAULT_PX_PER_HOUR = 60;
export const LABEL_PAD_TOP = 10;
export const LABEL_PAD_BOTTOM = 14;
export const TIME_GUTTER = 52;

/** Temporary: force sample schedule for UI. */
const FORCE_TIMELINE_UI = true;

type ForceItem = {
  class_schedule_id: string;
  start_time: string;
  end_time: string;
  subject_name: string;
  division_name?: string;
  section_name?: string;
  class_details?: { Topic?: string }[];
  is_reflected?: boolean;
  reflected_at?: string;
  quiz_sent?: boolean;
  quiz_average?: number;
  force_status?: ClassStatus;
  type?: string;
};

const withDate = (date: string, items: ForceItem[]) =>
  items.map((item) => ({ ...item, date }));

/** Today — mixed statuses for UI preview. */
const TODAY_FORCE_ITEMS: ForceItem[] = [
  {
    class_schedule_id: 'force-9to10',
    start_time: '09:00:00',
    end_time: '10:00:00',
    subject_name: 'Algebra',
    division_name: '8',
    section_name: 'A',
    class_details: [{ Topic: 'Linear equations' }],
    is_reflected: true,
    reflected_at: '09:05:00',
    force_status: 'done',
  },
  {
    class_schedule_id: 'force-11-class',
    start_time: '11:00:00',
    end_time: '11:30:00',
    subject_name: 'Geometry',
    division_name: '7',
    section_name: 'B',
    class_details: [{ Topic: 'Triangles' }],
    quiz_sent: true,
    quiz_average: 64,
    force_status: 'reflect',
  },
  {
    class_schedule_id: 'force-11-break',
    start_time: '11:30:00',
    end_time: '12:00:00',
    subject_name: 'Break',
    type: 'break',
  },
  {
    class_schedule_id: 'force-1-half-a',
    start_time: '13:00:00',
    end_time: '13:30:00',
    subject_name: 'Statistics',
    division_name: '8',
    section_name: 'B',
    class_details: [{ Topic: 'Mean median' }],
    force_status: 'live',
  },
  {
    class_schedule_id: 'force-1-half-b',
    start_time: '13:30:00',
    end_time: '14:00:00',
    subject_name: 'Probability',
    division_name: '8',
    section_name: 'C',
    class_details: [],
    force_status: 'unprepped',
  },
  {
    class_schedule_id: 'force-2to3-break',
    start_time: '14:00:00',
    end_time: '15:00:00',
    subject_name: 'Break',
    type: 'break',
  },
  {
    class_schedule_id: 'force-4to5',
    start_time: '16:00:00',
    end_time: '17:00:00',
    subject_name: 'Chemistry',
    division_name: '9',
    section_name: 'A',
    class_details: [{ Topic: 'Acids and bases' }],
    force_status: 'prepped',
  },
];

/** Yesterday — mostly completed / reflect. */
const YESTERDAY_FORCE_ITEMS: ForceItem[] = [
  {
    class_schedule_id: 'force-y-8',
    start_time: '08:30:00',
    end_time: '09:30:00',
    subject_name: 'History',
    division_name: '6',
    section_name: 'A',
    class_details: [{ Topic: 'Ancient India' }],
    is_reflected: true,
    reflected_at: '09:40:00',
    force_status: 'done',
  },
  {
    class_schedule_id: 'force-y-10',
    start_time: '10:00:00',
    end_time: '11:00:00',
    subject_name: 'English',
    division_name: '7',
    section_name: 'C',
    class_details: [{ Topic: 'Poetry analysis' }],
    is_reflected: true,
    reflected_at: '11:10:00',
    force_status: 'done',
  },
  {
    class_schedule_id: 'force-y-break',
    start_time: '11:00:00',
    end_time: '11:30:00',
    subject_name: 'Break',
    type: 'break',
  },
  {
    class_schedule_id: 'force-y-12',
    start_time: '12:00:00',
    end_time: '12:30:00',
    subject_name: 'Biology',
    division_name: '9',
    section_name: 'B',
    class_details: [{ Topic: 'Cell structure' }],
    force_status: 'reflect',
  },
  {
    class_schedule_id: 'force-y-15',
    start_time: '15:00:00',
    end_time: '16:00:00',
    subject_name: 'Physics',
    division_name: '10',
    section_name: 'A',
    class_details: [{ Topic: 'Motion graphs' }],
    force_status: 'reflect',
  },
];

/** Tomorrow — upcoming / prep heavy. */
const TOMORROW_FORCE_ITEMS: ForceItem[] = [
  {
    class_schedule_id: 'force-t-9',
    start_time: '09:00:00',
    end_time: '10:00:00',
    subject_name: 'Trigonometry',
    division_name: '10',
    section_name: 'B',
    class_details: [{ Topic: 'Sine rule' }],
    force_status: 'prepped',
  },
  {
    class_schedule_id: 'force-t-11',
    start_time: '11:00:00',
    end_time: '12:00:00',
    subject_name: 'Geography',
    division_name: '8',
    section_name: 'A',
    class_details: [{ Topic: 'Climate zones' }],
    force_status: 'prepped',
  },
  {
    class_schedule_id: 'force-t-break',
    start_time: '12:00:00',
    end_time: '12:30:00',
    subject_name: 'Break',
    type: 'break',
  },
  {
    class_schedule_id: 'force-t-13',
    start_time: '13:00:00',
    end_time: '13:30:00',
    subject_name: 'Art',
    division_name: '6',
    section_name: 'B',
    class_details: [{ Topic: 'Watercolors' }],
    force_status: 'unprepped',
  },
  {
    class_schedule_id: 'force-t-15',
    start_time: '15:00:00',
    end_time: '16:00:00',
    subject_name: 'Computer Science',
    division_name: '9',
    section_name: 'C',
    class_details: [{ Topic: 'Loops & arrays' }],
    force_status: 'unprepped',
  },
];

const NOV_11_FORCE_ITEMS: ForceItem[] = [
  {
    class_schedule_id: 'force-1111-9',
    start_time: '09:00:00',
    end_time: '10:00:00',
    subject_name: 'Economics',
    division_name: '11',
    section_name: 'A',
    class_details: [{ Topic: 'Demand curves' }],
    force_status: 'done',
  },
  {
    class_schedule_id: 'force-1111-13',
    start_time: '13:00:00',
    end_time: '14:00:00',
    subject_name: 'Civics',
    division_name: '8',
    section_name: 'B',
    class_details: [{ Topic: 'Local government' }],
    force_status: 'reflect',
  },
];

const NOV_21_FORCE_ITEMS: ForceItem[] = [
  {
    class_schedule_id: 'force-1121-10',
    start_time: '10:00:00',
    end_time: '11:00:00',
    subject_name: 'Chemistry',
    division_name: '9',
    section_name: 'A',
    class_details: [{ Topic: 'Periodic table' }],
    force_status: 'prepped',
  },
  {
    class_schedule_id: 'force-1121-break',
    start_time: '11:00:00',
    end_time: '11:30:00',
    subject_name: 'Break',
    type: 'break',
  },
  {
    class_schedule_id: 'force-1121-14',
    start_time: '14:00:00',
    end_time: '14:30:00',
    subject_name: 'Music',
    division_name: '7',
    section_name: 'A',
    class_details: [{ Topic: 'Rhythm basics' }],
    force_status: 'unprepped',
  },
  {
    class_schedule_id: 'force-1121-16',
    start_time: '16:00:00',
    end_time: '17:00:00',
    subject_name: 'Math Lab',
    division_name: '10',
    section_name: 'C',
    class_details: [{ Topic: 'Graphing practice' }],
    force_status: 'prepped',
  },
];

const NOV_30_FORCE_ITEMS: ForceItem[] = [
  {
    class_schedule_id: 'force-1130-8',
    start_time: '08:00:00',
    end_time: '09:00:00',
    subject_name: 'PE',
    division_name: '6',
    section_name: 'A',
    class_details: [{ Topic: 'Team sports' }],
    force_status: 'done',
  },
  {
    class_schedule_id: 'force-1130-11',
    start_time: '11:00:00',
    end_time: '12:00:00',
    subject_name: 'Literature',
    division_name: '9',
    section_name: 'B',
    class_details: [{ Topic: 'Short stories' }],
    force_status: 'live',
  },
  {
    class_schedule_id: 'force-1130-15',
    start_time: '15:00:00',
    end_time: '16:00:00',
    subject_name: 'Algebra II',
    division_name: '10',
    section_name: 'A',
    class_details: [{ Topic: 'Quadratics' }],
    force_status: 'prepped',
  },
];

const hasClassSession = (items: ForceItem[]) =>
  items.some((item) => item.type !== 'break');

const getForceScheduleByDate = (): Record<string, ForceItem[]> => {
  const today = moment().format('YYYY-MM-DD');
  const yesterday = moment().subtract(1, 'day').format('YYYY-MM-DD');
  const tomorrow = moment().add(1, 'day').format('YYYY-MM-DD');

  return {
    [yesterday]: YESTERDAY_FORCE_ITEMS,
    [today]: TODAY_FORCE_ITEMS,
    [tomorrow]: TOMORROW_FORCE_ITEMS,
    '2026-11-11': NOV_11_FORCE_ITEMS,
    '2026-11-21': NOV_21_FORCE_ITEMS,
    '2026-11-30': NOV_30_FORCE_ITEMS,
  };
};

/** Only dates that actually have classes (breaks alone don't count). */
export const getForceClassDates = () =>
  Object.entries(getForceScheduleByDate())
    .filter(([, items]) => hasClassSession(items))
    .map(([date]) => date);

/** Demo schedule — `force_status` locks badge so every state is visible. */
const buildForceTimelineItems = (date: string) => {
  const byDate = getForceScheduleByDate();
  return withDate(date, byDate[date] ?? []);
};

/** Visual gap between abutting cards (not part of the time scale). */
const CARD_INSET = 4;
/** Tighter inset → taller cards for non-1hr slots. */
const SHORT_CARD_INSET = 2;
const MIN_CARD_HEIGHT = 20;

/** Flat minutes-from-8am → Y. Hour lines are ticks only. */
export const minutesToY = (minutes: number, pxPerHour: number) => {
  const dayEnd = HOUR_SPAN * 60;
  const clamped = Math.max(0, Math.min(minutes, dayEnd));
  return (clamped / 60) * pxPerHour;
};

export const HOURS = Array.from(
  { length: DAY_END_HOUR - DAY_START_HOUR + 1 },
  (_, i) => DAY_START_HOUR + i
);

export type ClassStatus = 'live' | 'reflect' | 'unprepped' | 'prepped' | 'done';

export type TimelineEvent = {
  type: 'class' | 'break';
  id: string;
  top: number;
  height: number;
  title: string;
  grade: string;
  timeLabel: string;
  /** Only set for breaks (shown as `Break · 30 min`). */
  durationLabel?: string;
  status: ClassStatus | null;
  raw: any;
};

const parseTime = (raw?: string) => {
  const cleaned = String(raw || '').split('.')[0];
  const parsed = moment(cleaned, ['HH:mm:ss', 'HH:mm', 'h:mm A'], true);
  return parsed.isValid() ? parsed : null;
};

const minutesFromDayStart = (m: moment.Moment) =>
  m.hours() * 60 + m.minutes() - DAY_START_HOUR * 60;

export const formatHourLabel = (hour: number) => {
  if (hour === 12) return '12';
  if (hour === DAY_START_HOUR) return '8 am';
  if (hour === 13) return '1 pm';
  if (hour > 12) return String(hour - 12);
  return String(hour);
};

const hasTopic = (item: any) =>
  Boolean(
    item?.class_details?.[0]?.Topic ||
      item?.class_details?.[0]?.topic ||
      item?.topic
  );

const isBreakItem = (item: any) => item?.type === 'break';

/** Map API class → UI state: live | reflect | done | unprepped | prepped */
export const getClassStatus = (
  item: any,
  date: string,
  now: moment.Moment
): ClassStatus | null => {
  /** Preview-only override so every badge can be shown at once. */
  if (
    item?.force_status === 'live' ||
    item?.force_status === 'reflect' ||
    item?.force_status === 'done' ||
    item?.force_status === 'unprepped' ||
    item?.force_status === 'prepped'
  ) {
    return item.force_status;
  }

  const start = parseTime(item?.start_time);
  const end = parseTime(item?.end_time);
  if (!start || !end) return null;

  const startAt = moment(`${date} ${start.format('HH:mm:ss')}`, 'YYYY-MM-DD HH:mm:ss');
  const endAt = moment(`${date} ${end.format('HH:mm:ss')}`, 'YYYY-MM-DD HH:mm:ss');
  const isToday = moment(date).isSame(now, 'day');
  const isPastDay = moment(date).isBefore(now, 'day');
  const isFutureDay = moment(date).isAfter(now, 'day');
  const isUpcoming = isFutureDay || (isToday && startAt.isAfter(now));
  const ended = isPastDay || (isToday && endAt.isSameOrBefore(now));
  const prepped = hasTopic(item);

  if (isToday && startAt.isSameOrBefore(now) && endAt.isAfter(now)) return 'live';

  if (ended) {
    if (item?.is_reflected === true) return 'done';
    return 'reflect';
  }

  if (isUpcoming) return prepped ? 'prepped' : 'unprepped';
  return null;
};

const formatDurationLabel = (minutes: number) => {
  if (minutes >= 55 && minutes <= 65) return '1 hr';
  if (minutes % 60 === 0) {
    const hours = minutes / 60;
    return hours === 1 ? '1 hr' : `${hours} hr`;
  }
  return `${minutes} min`;
};

const formatDayLabel = (dateStr: string) => {
  const d = moment(dateStr, 'YYYY-MM-DD');
  if (d.isSame(moment(), 'day')) return 'Today';
  if (d.isSame(moment().subtract(1, 'day'), 'day')) return 'Yesterday';
  if (d.isSame(moment().add(1, 'day'), 'day')) return 'Tomorrow';
  /** Calendar-picked dates: e.g. Wed 17 */
  return d.format('ddd D');
};

/**
 * Timeline data + layout math: fetch schedule, clock, statuses, and event positions.
 */
export const useTimeline = () => {
  const dispatch = useDispatch<any>();
  const classTimeline = useSelector((state: any) => state.classes.classTimeline);
  const [date, setDate] = useState(() => moment().format('YYYY-MM-DD'));
  const dayLabel = formatDayLabel(date);
  const [now, setNow] = useState(moment());
  const [pxPerHour, setPxPerHour] = useState(DEFAULT_PX_PER_HOUR);

  const canGoPrevDay = true;
  const canGoNextDay = true;

  const goPrevDay = useCallback(() => {
    setDate((prev) => moment(prev).subtract(1, 'day').format('YYYY-MM-DD'));
  }, []);

  const goNextDay = useCallback(() => {
    setDate((prev) => moment(prev).add(1, 'day').format('YYYY-MM-DD'));
  }, []);

  const goToToday = useCallback(() => {
    setDate(moment().format('YYYY-MM-DD'));
  }, []);

  useEffect(() => {
    const id = setInterval(() => setNow(moment()), 1000);
    return () => clearInterval(id);
  }, []);

  const getDetails = useCallback(
    async (currentDate: string) => {
      await dispatch(getScheduleClasses({ date: currentDate } as any));
    },
    [dispatch]
  );

  useFocusEffect(
    useCallback(() => {
      getDetails(date);
    }, [date, getDetails])
  );

  const onGridLayout = useCallback((e: LayoutChangeEvent) => {
    const height = e.nativeEvent.layout.height;
    if (height <= 0) return;
    const usable = Math.max(0, height - LABEL_PAD_TOP - LABEL_PAD_BOTTOM);
    setPxPerHour(Math.max(1, usable / HOUR_SPAN));
  }, []);

  const dayHeight = HOUR_SPAN * pxPerHour;
  const gridContentHeight = LABEL_PAD_TOP + dayHeight + LABEL_PAD_BOTTOM;

  const events = useMemo(() => {
    const apiSource = (classTimeline || [])
      .filter((t: any) => !t.date || t.date === date)
      .slice()
      .sort((a: any, b: any) =>
        String(a.start_time || '').localeCompare(String(b.start_time || ''))
      );
    const source = FORCE_TIMELINE_UI
      ? buildForceTimelineItems(date)
      : apiSource;

    const built: TimelineEvent[] = [];

    source.forEach((timeline: any, index: number) => {
      const start = parseTime(timeline.start_time);
      const end = parseTime(timeline.end_time);
      if (!start) return;
      /** Only show items that start within 8am–5pm. */
      const startMinutes = minutesFromDayStart(start);
      if (startMinutes < 0 || startMinutes >= HOUR_SPAN * 60) return;

      const isBreak = isBreakItem(timeline);
      const status = isBreak ? null : getClassStatus(timeline, date, now);
      if (!isBreak && !status) return;

      const rawEndMinutes = end ? minutesFromDayStart(end) : startMinutes + 60;
      const endMinutes = Math.min(rawEndMinutes, HOUR_SPAN * 60);
      const rangeStart = minutesToY(startMinutes, pxPerHour);
      const rangeEnd = minutesToY(endMinutes, pxPerHour);
      const slotHeight = Math.max(0, rangeEnd - rangeStart);
      const durationMinutes = end ? Math.max(1, end.diff(start, 'minutes')) : 60;
      const isOneHour = durationMinutes >= 55 && durationMinutes <= 65;
      const inset = Math.min(
        isOneHour ? CARD_INSET : SHORT_CARD_INSET,
        slotHeight / 4
      );

      built.push({
        type: isBreak ? 'break' : 'class',
        id: String(timeline.class_schedule_id ?? `class-${index}`),
        top: rangeStart + inset,
        height: Math.max(MIN_CARD_HEIGHT, slotHeight - inset * 2),
        title: timeline.subject_name || (isBreak ? 'Break' : 'Class'),
        grade: isBreak ? '' : getGradeChip(timeline),
        timeLabel: start.format('h:mm'),
        ...(isBreak
          ? { durationLabel: formatDurationLabel(durationMinutes) }
          : {}),
        status,
        raw: timeline,
      });
    });

    return built;
  }, [classTimeline, date, now, pxPerHour]);

  /** Clock-only now-line: same Y for every slot type (no card-height pinning). */
  const nowMinutes = minutesFromDayStart(now);
  const dayEndMinutes = HOUR_SPAN * 60;
  const showNow =
    moment(date).isSame(now, 'day') &&
    nowMinutes >= 0 &&
    nowMinutes < dayEndMinutes;
  const nowTop = showNow
    ? LABEL_PAD_TOP + minutesToY(nowMinutes, pxPerHour)
    : null;

  return {
    date,
    setDate,
    dayLabel,
    goPrevDay,
    goNextDay,
    goToToday,
    canGoPrevDay,
    canGoNextDay,
    now,
    events,
    nowTop,
    dayHeight,
    gridContentHeight,
    pxPerHour,
    onGridLayout,
  };
};
