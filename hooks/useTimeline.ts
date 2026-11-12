import { useCallback, useEffect, useMemo, useState } from 'react';
import { LayoutChangeEvent } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import moment from 'moment';
import { getScheduleClasses } from '@/store/classSlice';

export const DAY_LABELS = ['Yesterday', 'Today', 'Tomorrow'] as const;

export const DAY_START_HOUR = 8;
export const DAY_END_HOUR = 17;
export const HOUR_SPAN = DAY_END_HOUR - DAY_START_HOUR;
export const DEFAULT_PX_PER_HOUR = 52;
export const LABEL_PAD_TOP = 10;
export const LABEL_PAD_BOTTOM = 14;
export const TIME_GUTTER = 52;

const CLASS_CARD_HEIGHT = 36;
const HALF_CARD_HEIGHT = 26;
const HALF_PAIR_GAP = 8;
const HOUR_BLOCK_INSET = 4;

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
  isNext: boolean;
  isCompact: boolean;
  raw: any;
};

const toRoman = (value: string | number) => {
  const num = typeof value === 'number' ? value : parseInt(String(value).replace(/\D/g, ''), 10);
  if (!num || Number.isNaN(num) || num < 1 || num > 20) return String(value);

  const map: [number, string][] = [
    [10, 'X'],
    [9, 'IX'],
    [5, 'V'],
    [4, 'IV'],
    [1, 'I'],
  ];

  let remaining = num;
  let result = '';
  for (const [n, symbol] of map) {
    while (remaining >= n) {
      result += symbol;
      remaining -= n;
    }
  }
  return result;
};

const getGradeChip = (item: any) => {
  const rawDivision = item?.division_name?.toString().trim() || '';
  const section = item?.section_name?.toString().trim();
  const cleaned = rawDivision.replace(/^class\s+/i, '');
  const division = /\d/.test(cleaned) ? toRoman(cleaned) : cleaned;
  if (division && section) return `${division}-${section}`;
  if (division) return division;
  if (section) return section;
  return '';
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

  useEffect(() => {
    getDetails(date);
  }, [date, getDetails]);

  const onGridLayout = useCallback((e: LayoutChangeEvent) => {
    const height = e.nativeEvent.layout.height;
    if (height <= 0) return;
    const usable = Math.max(0, height - LABEL_PAD_TOP - LABEL_PAD_BOTTOM);
    setPxPerHour(usable / HOUR_SPAN);
  }, []);

  const dayHeight = HOUR_SPAN * pxPerHour;
  const gridContentHeight = LABEL_PAD_TOP + dayHeight + LABEL_PAD_BOTTOM;

  const events = useMemo(() => {
    const source = (classTimeline || [])
      .filter((t: any) => !t.date || t.date === date)
      .slice()
      .sort((a: any, b: any) =>
        String(a.start_time || '').localeCompare(String(b.start_time || ''))
      );

    const built: TimelineEvent[] = [];
    const hourCardHeight = Math.min(CLASS_CARD_HEIGHT, Math.max(28, pxPerHour * 0.45));

    const itemsPerHour = new Map<number, number>();
    source.forEach((timeline: any) => {
      const start = parseTime(timeline.start_time);
      if (!start) return;
      itemsPerHour.set(start.hours(), (itemsPerHour.get(start.hours()) || 0) + 1);
    });

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

      const rangeStart = Math.max(0, (startMinutes / 60) * pxPerHour);
      const rawEndMinutes = end ? minutesFromDayStart(end) : startMinutes + 60;
      const rangeEnd = Math.max(
        rangeStart,
        (Math.min(rawEndMinutes, HOUR_SPAN * 60) / 60) * pxPerHour
      );
      const durationMinutes = end ? Math.max(1, end.diff(start, 'minutes')) : 60;
      const isHalfHour = durationMinutes >= 25 && durationMinutes <= 35;
      const isOneHour = durationMinutes >= 55 && durationMinutes <= 65;
      const isLive = status === 'live';
      const shareHour = (itemsPerHour.get(start.hours()) || 0) >= 2;
      const rangeHeight = Math.max(0, rangeEnd - rangeStart);

      let top: number;
      let cardHeight: number;
      let isCompact = false;

      if (isLive || isOneHour) {
        const inset = Math.min(HOUR_BLOCK_INSET, rangeHeight / 4);
        top = rangeStart + inset;
        cardHeight = Math.max(hourCardHeight, rangeHeight - inset * 2);
      } else {
        let slotStart = rangeStart;
        let slotEnd = rangeEnd;
        if (isHalfHour && shareHour) {
          if (start.minutes() >= 30) slotStart += HALF_PAIR_GAP / 2;
          else slotEnd -= HALF_PAIR_GAP / 2;
        }
        const slotHeight = Math.max(0, slotEnd - slotStart);
        isCompact = isHalfHour;
        cardHeight = Math.min(HALF_CARD_HEIGHT, Math.max(20, slotHeight));
        top = slotStart + Math.max(0, (slotHeight - cardHeight) / 2);
      }

      built.push({
        type: isBreak ? 'break' : 'class',
        id: String(timeline.class_schedule_id ?? `class-${index}`),
        top,
        height: cardHeight,
        title: timeline.subject_name || (isBreak ? 'Break' : 'Class'),
        grade: isBreak ? '' : getGradeChip(timeline),
        timeLabel: start.format('h:mm'),
        durationLabel: formatDurationLabel(durationMinutes),
        status,
        isNext: false,
        isCompact,
        raw: timeline,
      });
    });

    const nextPrepped = built.find((e) => e.type === 'class' && e.status === 'prepped');
    if (nextPrepped) nextPrepped.isNext = true;

    return built;
  }, [classTimeline, date, now, pxPerHour]);

  /** Timeline window is 8am–5pm only; hide the now-line outside that window. */
  const nowMinutes = minutesFromDayStart(now);
  const dayEndMinutes = HOUR_SPAN * 60;
  const showNow =
    moment(date).isSame(now, 'day') &&
    nowMinutes >= 0 &&
    nowMinutes < dayEndMinutes;
  const nowTop = showNow
    ? LABEL_PAD_TOP + (nowMinutes / 60) * pxPerHour
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
