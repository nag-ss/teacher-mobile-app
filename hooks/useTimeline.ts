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
export const DEFAULT_PX_PER_HOUR = 52;
export const LABEL_PAD_TOP = 10;
export const LABEL_PAD_BOTTOM = 14;
export const TIME_GUTTER = 52;

/** Temporary: always show a full day of sample timeline cards (ignore API). */
const FORCE_TIMELINE_UI = true;

const buildForceTimelineItems = (date: string) => [
  {
    class_schedule_id: 'force-half-a',
    date,
    start_time: '08:00:00',
    end_time: '08:30:00',
    subject_name: 'Mensuration',
    division_name: '7',
    section_name: 'C',
    class_details: [{ Topic: 'Surface area' }],
  },
  {
    class_schedule_id: 'force-half-b',
    date,
    start_time: '08:30:00',
    end_time: '09:00:00',
    subject_name: 'Arithmetic',
    division_name: '7',
    section_name: 'A',
    class_details: [],
  },
  {
    class_schedule_id: 'force-break',
    date,
    start_time: '11:00:00',
    end_time: '12:00:00',
    subject_name: 'Break',
    is_break: true,
  },
  {
    class_schedule_id: 'force-1pm',
    date,
    start_time: '13:00:00',
    end_time: '13:30:00',
    subject_name: 'Geometry',
    division_name: '7',
    section_name: 'B',
    class_details: [{ Topic: 'Triangles' }],
  },
  {
    class_schedule_id: 'force-break-half',
    date,
    start_time: '13:30:00',
    end_time: '14:00:00',
    subject_name: 'Break',
    is_break: true,
  },
  {
    class_schedule_id: 'force-hour',
    date,
    start_time: '14:00:00',
    end_time: '15:00:00',
    subject_name: 'Algebra',
    division_name: '8',
    section_name: 'B',
    class_details: [{ Topic: 'Quadratic equations' }],
  },
  {
    class_schedule_id: 'force-3pm',
    date,
    start_time: '15:00:00',
    end_time: '15:40:00',
    subject_name: 'Chemistry',
    division_name: '8',
    section_name: 'A',
    class_details: [{ Topic: 'Acids and bases' }],
  },
  {
    class_schedule_id: 'force-cross-a',
    date,
    start_time: '15:45:00',
    end_time: '16:15:00',
    subject_name: 'Statistics',
    division_name: '9',
    section_name: 'A',
    class_details: [{ Topic: 'Mean median' }],
  },
  {
    class_schedule_id: 'force-cross-b',
    date,
    start_time: '16:15:00',
    end_time: '16:45:00',
    subject_name: 'Probability',
    division_name: '9',
    section_name: 'B',
    class_details: [],
  },
];

/** Visual gap between abutting cards (not part of the time scale). */
const CARD_INSET = 4;
/** Slightly taller half-hour cards (less inset). */
const HALF_HOUR_INSET = 2;
/** Extra shrink for ~1hr cards only. */
const ONE_HOUR_EXTRA_INSET = 3;
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
  durationLabel: string;
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

const isBreakItem = (item: any) => {
  const subject = String(item?.subject_name || item?.title || '').toLowerCase();
  return (
    item?.is_break === true ||
    item?.period?.is_break === true ||
    item?.type === 'break' ||
    item?.event_type === 'break' ||
    item?.schedule_type === 'break' ||
    subject === 'break' ||
    subject.includes('lunch') ||
    subject.includes('break')
  );
};

const isReflected = (item: any) =>
  item?.is_reflected === true ||
  item?.reflection_completed === true ||
  item?.reflection_status === 'completed' ||
  item?.reflection_status === 'done';

const needsReflection = (item: any) =>
  item?.needs_reflection === true ||
  item?.reflection_pending === true ||
  item?.reflection_status === 'pending' ||
  item?.is_reflected === false;

/** Map API class → UI state: live | reflect | done | unprepped | prepped */
export const getClassStatus = (
  item: any,
  date: string,
  now: moment.Moment
): ClassStatus | null => {
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
    if (isReflected(item)) return 'done';
    if (needsReflection(item)) return 'reflect';
    return prepped ? 'done' : 'reflect';
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

/**
 * Timeline data + layout math: fetch schedule, clock, statuses, and event positions.
 */
export const useTimeline = () => {
  const dispatch = useDispatch<any>();
  const classTimeline = useSelector((state: any) => state.classes.classTimeline);
  const [dayIndex, setDayIndex] = useState(1); // Today
  const date = moment().add(dayIndex - 1, 'days').format('YYYY-MM-DD');
  const dayLabel = DAY_LABELS[dayIndex];
  const [now, setNow] = useState(moment());
  const [pxPerHour, setPxPerHour] = useState(DEFAULT_PX_PER_HOUR);

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
      const isHalfHour = durationMinutes >= 25 && durationMinutes <= 35;
      const isOneHour = durationMinutes >= 55 && durationMinutes <= 65;
      const baseInset = isOneHour
        ? CARD_INSET + ONE_HOUR_EXTRA_INSET
        : isHalfHour
          ? HALF_HOUR_INSET
          : CARD_INSET;
      const inset = Math.min(baseInset, slotHeight / 4);

      built.push({
        type: isBreak ? 'break' : 'class',
        id: String(timeline.class_schedule_id ?? `class-${index}`),
        top: rangeStart + inset,
        height: Math.max(MIN_CARD_HEIGHT, slotHeight - inset * 2),
        title: timeline.subject_name || (isBreak ? 'Break' : 'Class'),
        grade: isBreak ? '' : getGradeChip(timeline),
        timeLabel: start.format('h:mm'),
        /** Only breaks show duration in the UI. */
        durationLabel: isBreak ? formatDurationLabel(durationMinutes) : '',
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
    dayIndex,
    setDayIndex,
    date,
    dayLabel,
    now,
    events,
    nowTop,
    dayHeight,
    gridContentHeight,
    pxPerHour,
    onGridLayout,
  };
};
