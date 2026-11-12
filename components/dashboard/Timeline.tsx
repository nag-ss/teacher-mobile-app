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
const CHIP_HEIGHT = 28;

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

const getClassStatus = (
  item: any,
  date: string,
  isNext: boolean
): { kind: 'reflect' | 'unprepped' | 'prepped' | 'attention' | 'done'; label: string } => {
  const topic =
    item?.class_details?.[0]?.Topic ||
    item?.class_details?.[0]?.topic ||
    item?.topic ||
    '';
  const isPrepped = Boolean(topic);
  const isPastDay = moment(date).isBefore(moment(), 'day');
  const end = parseTime(item?.end_time);
  const start = parseTime(item?.start_time);
  const now = moment();
  const isToday = moment(date).isSame(now, 'day');
  const ended =
    isPastDay ||
    (isToday && end && moment(date + ' ' + end.format('HH:mm:ss'), 'YYYY-MM-DD HH:mm:ss').isBefore(now));
  const started =
    isToday &&
    start &&
    moment(date + ' ' + start.format('HH:mm:ss'), 'YYYY-MM-DD HH:mm:ss').isBefore(now);

  if (ended && isPrepped) return { kind: 'done', label: '' };
  if (ended) return { kind: 'reflect', label: 'Reflect' };
  if (isNext && isPrepped) return { kind: 'prepped', label: 'Prepped' };
  if (isNext && !isPrepped) return { kind: 'unprepped', label: 'Unprepped' };
  if (started && !ended && !isPrepped) return { kind: 'attention', label: 'Needs attention' };
  if (!isPrepped) return { kind: 'unprepped', label: 'Unprepped' };
  return { kind: 'prepped', label: 'Prepped' };
};

type TimelineEvent =
  | {
      type: 'class';
      id: string;
      top: number;
      height: number;
      title: string;
      grade: string;
      timeLabel: string;
      isNext: boolean;
      status: ReturnType<typeof getClassStatus>;
      raw: any;
    }
  | {
      type: 'break';
      id: string;
      top: number;
      height: number;
      label: string;
    }
  | {
      type: 'meeting';
      id: string;
      top: number;
      height: number;
      title: string;
      timeLabel: string;
      icon: 'flag' | 'people';
    };

const HatchBlock = ({ children, style }: { children: React.ReactNode; style?: any }) => (
  <View style={[styles.hatchWrap, style]}>
    <View style={styles.hatchLayer} pointerEvents="none">
      {Array.from({ length: 28 }).map((_, i) => (
        <View key={i} style={[styles.hatchLine, { left: i * 14 - 40 }]} />
      ))}
    </View>
    {children}
  </View>
);

const StatusBadge = ({
  status,
}: {
  status: ReturnType<typeof getClassStatus>;
}) => {
  if (status.kind === 'done') {
    return (
      <View style={styles.checkBadge}>
        <Text style={styles.checkMark}>✓</Text>
      </View>
    );
  }

  const color =
    status.kind === 'reflect'
      ? '#D97706'
      : status.kind === 'unprepped'
        ? '#B45309'
        : status.kind === 'attention'
          ? '#DC2626'
          : '#2563EB';

  return (
    <View style={styles.statusRow}>
      <View style={[styles.statusDot, { backgroundColor: color }]} />
      <Text style={[styles.statusText, { color }]}>{status.label}</Text>
    </View>
  );
};

const ClassCard = ({
  event,
  date,
}: {
  event: Extract<TimelineEvent, { type: 'class' }>;
  date: string;
}) => {
  const classPrepRef = useRef<any>();
  const canPrep = !moment(date).isBefore(moment(), 'day');

  return (
    <>
      <TouchableOpacity
        style={[
          styles.classCard,
          { top: event.top, height: event.height },
          event.isNext && styles.classCardNext,
        ]}
        activeOpacity={0.75}
        onPress={() => {
          if (canPrep) classPrepRef.current?.setSelectedClass();
        }}
      >
        <View style={styles.classLeft}>
          <Text style={styles.classTitle} numberOfLines={1}>
            {event.title}
          </Text>
          {event.isNext ? <Text style={styles.nextTag}>Next</Text> : null}
          {event.grade ? (
            <Text style={styles.classMeta} numberOfLines={1}>
              {event.grade}
            </Text>
          ) : null}
          <Text style={styles.classMeta}>{event.timeLabel}</Text>
        </View>
        <StatusBadge status={event.status} />
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
    const list = (classTimeline || [])
      .filter((t: any) => !t.date || t.date === date)
      .slice()
      .sort((a: any, b: any) =>
        String(a.start_time || '').localeCompare(String(b.start_time || ''))
      );

    const nextId = (() => {
      if (!moment(date).isSame(moment(), 'day')) return null;
      const upcoming = list.find((t: any) => {
        const start = parseTime(t.start_time);
        if (!start) return false;
        const startAt = moment(date + ' ' + start.format('HH:mm:ss'), 'YYYY-MM-DD HH:mm:ss');
        return startAt.isAfter(now);
      });
      return upcoming?.class_schedule_id ?? null;
    })();

    const built: TimelineEvent[] = [];
    const cardHeight = Math.min(CLASS_CARD_HEIGHT, Math.max(28, pxPerHour * 0.7));

    list.forEach((timeline: any, index: number) => {
      const start = parseTime(timeline.start_time);
      const end = parseTime(timeline.end_time);
      if (!start) return;

      const top = Math.max(0, (minutesFromDayStart(start) / 60) * pxPerHour);
      const isNext = timeline.class_schedule_id === nextId;
      const status = getClassStatus(timeline, date, isNext);

      built.push({
        type: 'class',
        id: String(timeline.class_schedule_id ?? `class-${index}`),
        top,
        height: cardHeight,
        title: timeline.subject_name || 'Class',
        grade: getGradeChip(timeline),
        timeLabel: start.format('h:mm'),
        isNext,
        status,
        raw: timeline,
      });

      const next = list[index + 1];
      if (!end || !next) return;
      const nextStart = parseTime(next.start_time);
      if (!nextStart) return;

      const gapMinutes = nextStart.diff(end, 'minutes');
      if (gapMinutes < 10) return;

      const gapTop = Math.max(0, (minutesFromDayStart(end) / 60) * pxPerHour);
      const gapHeight = Math.max(20, (gapMinutes / 60) * pxPerHour - 4);
      const hour = end.hours();
      const isLunch = gapMinutes >= 30 && hour >= 11 && hour <= 13;

      built.push({
        type: 'break',
        id: `break-${timeline.class_schedule_id}-${index}`,
        top: gapTop + 2,
        height: Math.min(gapHeight, isLunch ? Math.max(28, pxPerHour * 0.75) : Math.max(22, pxPerHour * 0.5)),
        label: isLunch ? `Lunch · ${gapMinutes} min` : `Break · ${gapMinutes} min`,
      });
    });

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
                  <View style={styles.hourLine} />
                </View>
              );
            })}

            <View style={styles.eventsLayer}>
              {events.map((event) => {
                if (event.type === 'break') {
                  return (
                    <HatchBlock
                      key={event.id}
                      style={[styles.breakBlock, { top: event.top, height: event.height }]}
                    >
                      <Text style={styles.breakText}>{event.label}</Text>
                    </HatchBlock>
                  );
                }

                if (event.type === 'meeting') {
                  return (
                    <View
                      key={event.id}
                      style={[styles.meetingChip, { top: event.top, height: event.height }]}
                    >
                      <Text style={styles.meetingIcon}>{event.icon === 'flag' ? '⚑' : '👥'}</Text>
                      <Text style={styles.meetingText} numberOfLines={1}>
                        {event.title} {event.timeLabel}
                      </Text>
                    </View>
                  );
                }

                return <ClassCard key={event.id} event={event} date={date} />;
              })}
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
    fontSize: 12,
    lineHeight: 16,
    textTransform: 'uppercase',
    color: '#8A8880',
    fontFamily: 'Inter_600SemiBold',
    includeFontPadding: false,
    textAlignVertical: 'center',
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
  hourLine: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#EDEBE6',
    marginTop: 0,
  },
  eventsLayer: {
    position: 'absolute',
    left: TIME_GUTTER,
    right: 0,
    top: 0,
    bottom: 0,
  },
  classCard: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EDEBE6',
    borderRadius: 10,
  },
  classCardNext: {
    borderLeftWidth: 3,
    borderLeftColor: '#1F1E1C',
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
  nextTag: {
    fontSize: 12,
    lineHeight: 15,
    color: '#8A8880',
    fontFamily: 'Inter_400Regular',
    includeFontPadding: false,
  },
  classMeta: {
    fontSize: 12,
    lineHeight: 15,
    color: '#8A8880',
    fontFamily: 'Inter_400Regular',
    includeFontPadding: false,
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
    fontFamily: 'Inter_500Medium',
    includeFontPadding: false,
  },
  checkBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F2EE',
  },
  checkMark: {
    fontSize: 12,
    color: '#8A8880',
    fontFamily: 'Inter_600SemiBold',
    includeFontPadding: false,
  },
  hatchWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    borderRadius: 8,
    backgroundColor: '#F3F2EE',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hatchLayer: {
    ...StyleSheet.absoluteFillObject,
  },
  hatchLine: {
    position: 'absolute',
    top: -20,
    bottom: -20,
    width: 6,
    backgroundColor: 'rgba(255,255,255,0.7)',
    transform: [{ rotate: '25deg' }],
  },
  breakBlock: {},
  breakText: {
    fontSize: 12,
    lineHeight: 15,
    color: '#8A8880',
    fontFamily: 'Inter_500Medium',
    includeFontPadding: false,
    zIndex: 1,
  },
  meetingChip: {
    position: 'absolute',
    left: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    backgroundColor: '#EDEBE6',
    borderRadius: 8,
    height: CHIP_HEIGHT,
    maxWidth: '85%',
  },
  meetingIcon: {
    fontSize: 11,
  },
  meetingText: {
    fontSize: 12,
    lineHeight: 15,
    color: '#5C5A54',
    fontFamily: 'Inter_500Medium',
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
