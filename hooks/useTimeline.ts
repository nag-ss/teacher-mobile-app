import { useCallback, useEffect, useMemo, useState } from 'react';
import { LayoutChangeEvent } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import moment from 'moment';
import { getScheduleClasses } from '@/store/classSlice';
import { getGradeChip } from '@/utils/grade';
import { useIsOffline } from '@/hooks/useIsOffline';
import {
  FORCE_TIMELINE_UI,
  buildForceTimelineItems,
} from '@/demoData/demoData';

export const DAY_LABELS = ['Yesterday', 'Today', 'Tomorrow'] as const;

export const DAY_START_HOUR = 8;
export const DAY_END_HOUR = 17;
export const HOUR_SPAN = DAY_END_HOUR - DAY_START_HOUR;
/** Matches ~measured grid when timeline card is at maxHeight 650. */
export const DEFAULT_PX_PER_HOUR = 60;
export const LABEL_PAD_TOP = 10;
export const LABEL_PAD_BOTTOM = 14;
/** Wide enough for zero-padded 24h labels (`08:00`). */
export const TIME_GUTTER = 62;

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

/** 24-hour scale ticks, e.g. `08:00`, `13:00`. */
export const formatHourLabel = (hour: number) =>
  `${String(hour).padStart(2, '0')}:00`;

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
  const isOffline = useIsOffline();
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

  /** Pause the live now-line while offline so it stops traversing. */
  useEffect(() => {
    if (isOffline) return;
    setNow(moment());
    const id = setInterval(() => setNow(moment()), 1000);
    return () => clearInterval(id);
  }, [isOffline]);

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
