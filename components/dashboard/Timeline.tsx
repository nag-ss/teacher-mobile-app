import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, LayoutChangeEvent } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { getScheduleClasses } from '@/store/classSlice';
import moment from 'moment';
import { useFocusEffect } from '@react-navigation/native';
import ClassPrep from './ClassPrep';
import SvgLoader from '@/utils/SvgLoader';

const DAY_LABELS = ['Yesterday', 'Today', 'Tomorrow'] as const;

const DAY_START_HOUR = 8;
const DAY_END_HOUR = 17;
const HOUR_SPAN = DAY_END_HOUR - DAY_START_HOUR;
const DEFAULT_PX_PER_HOUR = 52;
const TIME_GUTTER = 52;
const CLASS_CARD_HEIGHT = 36;
const HALF_CARD_HEIGHT = 26;
/** Extra space between two items sharing the same hour. */
const HALF_PAIR_GAP = 10;

const HOURS = Array.from(
  { length: DAY_END_HOUR - DAY_START_HOUR + 1 },
  (_, i) => DAY_START_HOUR + i
);

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

const formatHourLabel = (hour: number) => {
  if (hour === 12) return '12';
  if (hour === DAY_START_HOUR) return '8 am';
  if (hour === 13) return '1 pm';
  if (hour > 12) return String(hour - 12);
  return String(hour);
};

type ClassStatus = 'live' | 'reflect' | 'unprepped' | 'prepped' | 'done';

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
const getClassStatus = (
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
    /** Past class with a plan/topic is treated as done; otherwise needs Reflect. */
    return prepped ? 'done' : 'reflect';
  }

  if (isUpcoming) return prepped ? 'prepped' : 'unprepped';
  return null;
};

type TimelineEvent = {
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

const formatDurationLabel = (minutes: number) => {
  if (minutes >= 55 && minutes <= 65) return '1 hr';
  if (minutes % 60 === 0) {
    const hours = minutes / 60;
    return hours === 1 ? '1 hr' : `${hours} hr`;
  }
  return `${minutes} min`;
};

const STATUS_LABEL: Record<Exclude<ClassStatus, 'done'>, string> = {
  live: 'Live',
  reflect: 'Reflect',
  unprepped: 'Unprepped',
  prepped: 'Prepped',
};

const STATUS_DOT: Record<Exclude<ClassStatus, 'done'>, any> = {
  live: { backgroundColor: '#1F1E1C' },
  reflect: { backgroundColor: '#D69A1E' },
  unprepped: { backgroundColor: '#D69A1E' },
  prepped: { backgroundColor: '#2F6FED' },
};

const STATUS_TEXT: Record<Exclude<ClassStatus, 'done'>, any> = {
  live: { color: '#1F1E1C' },
  reflect: { color: '#D69A1E' },
  unprepped: { color: '#D69A1E' },
  prepped: { color: '#2F6FED' },
};

const StatusBadge = ({ status }: { status: Exclude<ClassStatus, 'done'> }) => (
  <View style={styles.statusRow}>
    <View style={[styles.statusDot, STATUS_DOT[status]]} />
    <Text style={[styles.statusText, STATUS_TEXT[status]]}>{STATUS_LABEL[status]}</Text>
  </View>
);

const BreakCard = ({ event }: { event: TimelineEvent }) => {
  const [size, setSize] = useState({ width: 0, height: 0 });
  const stripeCount =
    size.width > 0
      ? Math.ceil((size.width + size.height * 2) / 7) + 4
      : 0;

  return (
    <View
      style={[
        styles.breakCard,
        event.isCompact && styles.cardCompact,
        { top: event.top, height: event.height },
      ]}
      onLayout={(e) => {
        const { width, height } = e.nativeEvent.layout;
        if (width !== size.width || height !== size.height) {
          setSize({ width, height });
        }
      }}
    >
      <View style={styles.breakStripes} pointerEvents="none">
        {Array.from({ length: stripeCount }).map((_, i) => (
          <View
            key={i}
            style={[
              styles.breakStripe,
              {
                left: i * 7 - size.height,
                height: size.height * 3,
                top: -size.height,
              },
            ]}
          />
        ))}
      </View>
      <Text style={styles.breakText}>
        {`Break · ${event.durationLabel}`}
      </Text>
    </View>
  );
};

const ClassCard = ({
  event,
  date,
}: {
  event: TimelineEvent;
  date: string;
}) => {
  const classPrepRef = useRef<any>();
  const canPrep = !moment(date).isBefore(moment(), 'day');
  const isLive = event.status === 'live';
  const isDone = event.status === 'done';
  const isNextPrepped = event.status === 'prepped' && event.isNext;
  const showMeta = event.title.trim().length <= 16;

  if (event.type === 'break') {
    return <BreakCard event={event} />;
  }

  return (
    <>
      <TouchableOpacity
        style={[
          styles.classCard,
          event.isCompact && styles.cardCompact,
          { top: event.top, height: event.height },
          isDone
            ? styles.classCardDone
            : isLive
              ? styles.classCardLive
              : styles.classCardDefault,
          isNextPrepped && styles.classCardNext,
        ]}
        activeOpacity={0.75}
        onPress={() => {
          if (canPrep && !isDone) classPrepRef.current?.setSelectedClass();
        }}
      >
        {isNextPrepped ? <View style={styles.nextStrip} /> : null}
        <View style={styles.classLeft}>
          <Text
            style={[styles.classTitle, isDone && styles.classTitleDone]}
            numberOfLines={1}
          >
            {event.title}
          </Text>
          {showMeta ? (
            <Text
              style={[styles.classMeta, isDone && styles.classMetaDone]}
              numberOfLines={1}
            >
              {[event.grade, event.timeLabel].filter(Boolean).join(' · ')}
            </Text>
          ) : null}
          {isNextPrepped ? <Text style={styles.nextTag}>Next</Text> : null}
        </View>
        {isDone ? (
          <SvgLoader svgFilePath="liveCorrect" width={14} height={11} color="#8A8880" />
        ) : event.status && event.status !== 'done' ? (
          <StatusBadge status={event.status} />
        ) : null}
      </TouchableOpacity>

      {canPrep ? (
        <ClassPrep
          item={event.raw}
          selectedClass={event.raw}
          updateTopicSubTopic={() => {}}
          ref={classPrepRef}
        />
      ) : null}
    </>
  );
};

const TimelineWithClassDetails = (_props: { selectedDate?: string } = {}) => {
  const dispatch = useDispatch<any>();
  const classTimeline = useSelector((state: any) => state.classes.classTimeline);
  const [dayIndex, setDayIndex] = useState(1); // Today
  const date = moment().add(dayIndex - 1, 'days').format('YYYY-MM-DD');
  const dayLabel = DAY_LABELS[dayIndex];
  const [now, setNow] = useState(moment());
  const [pxPerHour, setPxPerHour] = useState(DEFAULT_PX_PER_HOUR);

  useEffect(() => {
    const id = setInterval(() => setNow(moment()), 30000);
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
    setPxPerHour(height / HOUR_SPAN);
  }, []);

  const dayHeight = HOUR_SPAN * pxPerHour;

  const events = useMemo(() => {
    const source = (classTimeline || [])
      .filter((t: any) => !t.date || t.date === date)
      .slice()
      .sort((a: any, b: any) =>
        String(a.start_time || '').localeCompare(String(b.start_time || ''))
      );

    const built: TimelineEvent[] = [];
    const hourCardHeight = Math.min(CLASS_CARD_HEIGHT, Math.max(28, pxPerHour * 0.7));

    /** Hours that contain 2+ short items get the half-pair gap. */
    const itemsPerHour = new Map<number, number>();
    source.forEach((timeline: any) => {
      const start = parseTime(timeline.start_time);
      if (!start) return;
      const hour = start.hours();
      itemsPerHour.set(hour, (itemsPerHour.get(hour) || 0) + 1);
    });

    source.forEach((timeline: any, index: number) => {
      const start = parseTime(timeline.start_time);
      const end = parseTime(timeline.end_time);
      if (!start) return;

      const isBreak = isBreakItem(timeline);
      const status = isBreak ? null : getClassStatus(timeline, date, now);
      if (!isBreak && !status) return;

      const startTop = Math.max(0, (minutesFromDayStart(start) / 60) * pxPerHour);
      const endTop = end
        ? Math.max(startTop, (minutesFromDayStart(end) / 60) * pxPerHour)
        : startTop + pxPerHour;
      const durationMinutes = end ? Math.max(1, end.diff(start, 'minutes')) : 60;
      const isOneHour = durationMinutes >= 55 && durationMinutes <= 65;
      const isHalfHour = durationMinutes >= 25 && durationMinutes <= 35;
      const shareHour = (itemsPerHour.get(start.hours()) || 0) >= 2;
      /** 1-hour events center between hour labels; half-hour / others center in their range. */
      let slotStart = isOneHour
        ? Math.max(0, (minutesFromDayStart(start.clone().startOf('hour')) / 60) * pxPerHour)
        : startTop;
      let slotEnd = isOneHour ? slotStart + pxPerHour : endTop;
      if (isHalfHour && shareHour) {
        const inSecondHalf = start.minutes() >= 30;
        if (inSecondHalf) slotStart += HALF_PAIR_GAP / 2;
        else slotEnd -= HALF_PAIR_GAP / 2;
      }
      const slotHeight = Math.max(0, slotEnd - slotStart);
      const cardHeight = isHalfHour
        ? Math.min(HALF_CARD_HEIGHT, Math.max(20, slotHeight))
        : hourCardHeight;
      const top = slotStart + Math.max(0, (Math.max(cardHeight, slotHeight) - cardHeight) / 2);

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
        isCompact: isHalfHour,
        raw: timeline,
      });
    });

    /** Next tag: earliest upcoming prepped class. */
    const nextPrepped = built.find((e) => e.type === 'class' && e.status === 'prepped');
    if (nextPrepped) nextPrepped.isNext = true;

    return built;
  }, [classTimeline, date, now, pxPerHour]);

  const showNow = moment(date).isSame(now, 'day');
  const nowTop = showNow
    ? Math.max(0, Math.min(dayHeight, (minutesFromDayStart(now) / 60) * pxPerHour))
    : null;

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.headerBox}>
          <Text style={styles.header} numberOfLines={1}>
            Your day
          </Text>
        </View>

        <View style={styles.dayPill}>
          <TouchableOpacity
            style={styles.daySegment}
            onPress={() => setDayIndex((prev) => Math.max(0, prev - 1))}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            disabled={dayIndex === 0}
          >
            <SvgLoader svgFilePath="notificationLeftArrow" width={7} height={10} />
          </TouchableOpacity>
          <View style={styles.dayDivider} />
          <View style={styles.dayLabelSegment}>
            <Text style={styles.dayLabel}>{dayLabel}</Text>
          </View>
          <View style={styles.dayDivider} />
          <TouchableOpacity
            style={styles.daySegment}
            onPress={() => setDayIndex((prev) => Math.min(2, prev + 1))}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            disabled={dayIndex === 2}
          >
            <SvgLoader svgFilePath="notificationRightArrow" width={7} height={10} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.gridHost} onLayout={onGridLayout}>
        {!events.length ? (
          <View style={styles.emptyState}>
            <SvgLoader
              svgFilePath="calendarEmpty"
              width={32}
              height={32}
              color="#C4C2BA"
            />
            <View style={styles.emptyTitleBox}>
              <Text style={styles.emptyTitle} numberOfLines={1}>
                {dayIndex === 0
                  ? 'No classes yesterday'
                  : dayIndex === 2
                    ? 'No classes tomorrow'
                    : 'No classes today'}
              </Text>
            </View>
            <Text style={styles.emptySubtitle}>
              {moment(date).format('dddd')} · enjoy the day off
            </Text>
          </View>
        ) : (
          <View style={[styles.dayGrid, { height: dayHeight }]}>
            {HOURS.map((hour) => {
              const top = (hour - DAY_START_HOUR) * pxPerHour;
              return (
                <View key={hour} style={[styles.hourRow, { top, height: pxPerHour }]}>
                  <Text style={styles.hourLabel}>{formatHourLabel(hour)}</Text>
                </View>
              );
            })}

            <View style={styles.eventsLayer}>
              {events.map((event) => (
                <ClassCard key={event.id} event={event} date={date} />
              ))}
            </View>

            {nowTop != null ? (
              <View style={[styles.nowLineWrap, { top: nowTop }]} pointerEvents="none">
                <View style={styles.nowPill}>
                  <Text style={styles.nowPillText}>{now.format('H:mm')}</Text>
                </View>
                <View style={styles.nowLine} />
              </View>
            ) : null}
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: 'stretch',
    width: '100%',
    height: '100%',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 0,
    paddingRight: 0,
    paddingBottom: 0,
    paddingLeft: 4,
    width: '100%',
    height: 36,
    alignSelf: 'stretch',
    flexGrow: 0,
    marginBottom: 28,
  },
  headerBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 0,
    height: 36,
    flexGrow: 0,
    flexShrink: 0,
  },
  header: {
    height: 24,
    fontSize: 16,
    lineHeight: 24,
    color: '#1F1E1C',
    fontFamily: 'Montserrat_600SemiBold',
    fontStyle: 'normal',
    includeFontPadding: false,
    textAlignVertical: 'center',
    flexGrow: 0,
    flexShrink: 0,
  },
  dayPill: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 36,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EDEBE6',
    borderRadius: 10,
    overflow: 'hidden',
    flexGrow: 0,
    flexShrink: 0,
    marginLeft: 'auto',
  },
  daySegment: {
    width: 36,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayDivider: {
    width: StyleSheet.hairlineWidth,
    alignSelf: 'stretch',
    backgroundColor: '#EDEBE6',
  },
  dayLabelSegment: {
    minWidth: 72,
    height: '100%',
    paddingHorizontal: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayLabel: {
    fontSize: 14,
    lineHeight: 17,
    color: '#1F1E1C',
    fontFamily: 'Inter_600SemiBold',
    includeFontPadding: false,
    textAlign: 'center',
  },
  gridHost: {
    flex: 1,
    alignSelf: 'stretch',
    width: '100%',
    minHeight: 0,
  },
  dayGrid: {
    position: 'relative',
    width: '100%',
  },
  hourRow: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  hourLabel: {
    width: TIME_GUTTER - 8,
    fontSize: 12,
    lineHeight: 16,
    color: '#8A8880',
    fontFamily: 'Inter_400Regular',
    includeFontPadding: false,
    textAlign: 'right',
    marginTop: -7,
    paddingRight: 8,
  },
  eventsLayer: {
    position: 'absolute',
    left: TIME_GUTTER,
    right: 0,
    top: 0,
    bottom: 0,
  },
  breakCard: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    gap: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ECEAE4',
    overflow: 'hidden',
  },
  breakStripes: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  breakStripe: {
    position: 'absolute',
    width: 3.5,
    backgroundColor: '#E8E6E0',
    transform: [{ rotate: '28deg' }],
  },
  breakText: {
    fontSize: 12,
    lineHeight: 15,
    color: '#8A8880',
    fontFamily: 'Inter_500Medium',
    includeFontPadding: false,
    zIndex: 1,
  },
  classCard: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    gap: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    overflow: 'hidden',
  },
  cardCompact: {
    borderRadius: 8,
  },
  classCardLive: {
    borderWidth: 1.5,
    borderColor: '#1F1E1C',
  },
  classCardDefault: {
    borderWidth: 1,
    borderColor: '#ECEAE4',
  },
  classCardDone: {
    borderWidth: 1,
    borderColor: '#ECEAE4',
  },
  classCardNext: {
    paddingLeft: 16,
  },
  classTitleDone: {
    color: '#8A8880',
  },
  classMetaDone: {
    color: '#B0AEA6',
  },
  nextStrip: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: '#1F1E1C',
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  classLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    minWidth: 0,
    paddingRight: 8,
  },
  classTitle: {
    fontSize: 14,
    lineHeight: 17,
    color: '#1F1E1C',
    fontFamily: 'Inter_600SemiBold',
    includeFontPadding: false,
    flexShrink: 1,
  },
  classMeta: {
    fontSize: 12,
    lineHeight: 15,
    color: '#8A8880',
    fontFamily: 'Inter_400Regular',
    includeFontPadding: false,
  },
  nextTag: {
    fontSize: 12,
    lineHeight: 15,
    color: '#1F1E1C',
    fontFamily: 'Inter_400Regular',
    includeFontPadding: false,
    marginLeft: 'auto',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexShrink: 0,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    lineHeight: 15,
    fontFamily: 'Inter_600SemiBold',
    includeFontPadding: false,
  },
  nowLineWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 5,
  },
  nowPill: {
    backgroundColor: '#1F1E1C',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginRight: 4,
    minWidth: 44,
    alignItems: 'center',
  },
  nowPillText: {
    color: '#FFFFFF',
    fontSize: 11,
    lineHeight: 14,
    fontFamily: 'Inter_600SemiBold',
    includeFontPadding: false,
  },
  nowLine: {
    flex: 1,
    height: 2,
    backgroundColor: '#1F1E1C',
    borderRadius: 1,
  },
  emptyState: {
    flex: 1,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingBottom: 40,
  },
  emptyTitleBox: {
    flexDirection: 'column',
    alignItems: 'center',
    padding: 0,
    minWidth: 132,
    minHeight: 24,
    flexGrow: 0,
    flexShrink: 0,
    justifyContent: 'center',
    marginTop: 4,
  },
  emptyTitle: {
    fontSize: 16,
    lineHeight: 20,
    color: '#1F1E1C',
    fontFamily: 'Inter_600SemiBold',
    includeFontPadding: false,
    textAlign: 'center',
    flexShrink: 0,
  },
  emptySubtitle: {
    minWidth: 183,
    minHeight: 20,
    fontSize: 14,
    lineHeight: 20,
    color: '#8A8880',
    fontFamily: 'Inter_400Regular',
    fontStyle: 'normal',
    includeFontPadding: false,
    textAlign: 'center',
    flexGrow: 0,
    flexShrink: 0,
  },
});

export default TimelineWithClassDetails;
