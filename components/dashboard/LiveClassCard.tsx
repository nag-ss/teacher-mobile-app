import React, { memo, useCallback, useEffect, useMemo, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { getLiveClass, getScheduleClasses, setUnAuth } from '@/store/classSlice';
import moment from 'moment';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { setClassId, setSelectedTask } from '@/store/liveMonitoringSlice';
import { logout } from '@/store/authSlice';
import SvgLoader from '@/utils/SvgLoader';
import ClassPrep from './ClassPrep';

const REFRESH_MS = 300000;
const TIME_FMT = 'HH:mm:ss';

/** Temporary: always show the live card. */
const FORCE_LIVE_CARD = true;

function useIntervalApi(callback: () => void, delay: number) {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!delay) return;
    const id = setInterval(() => savedCallback.current(), delay);
    return () => clearInterval(id);
  }, [delay]);
}

const normalizeTime = (time?: string) => (time ? String(time).split('.')[0] : '');

const formatTimeRange = (start?: string, end?: string) => {
  const startLabel = (start ? moment(normalizeTime(start), TIME_FMT) : moment()).format('h:mm A');
  const endLabel = (
    end ? moment(normalizeTime(end), TIME_FMT) : moment().add(30, 'minutes')
  ).format('h:mm A');
  return `${startLabel} – ${endLabel}`;
};

const ROMAN_MAP: [number, string][] = [
  [10, 'X'],
  [9, 'IX'],
  [5, 'V'],
  [4, 'IV'],
  [1, 'I'],
];

const toRoman = (value: string | number) => {
  const num = typeof value === 'number' ? value : parseInt(String(value).replace(/\D/g, ''), 10);
  if (!num || Number.isNaN(num) || num < 1 || num > 20) return String(value);

  let remaining = num;
  let result = '';
  for (const [n, symbol] of ROMAN_MAP) {
    while (remaining >= n) {
      result += symbol;
      remaining -= n;
    }
  }
  return result;
};

const str = (v: any) => (v == null ? '' : v.toString().trim());

const getGradeLabel = (c: any) => {
  const rawDivision = str(c?.division_name) || str(c?.division) || str(c?.grade_name);
  const section = str(c?.section_name) || str(c?.section);
  const cleaned = rawDivision.replace(/^class\s+/i, '');
  const division = /\d/.test(cleaned) ? toRoman(cleaned) : cleaned;

  if (division && section) return `Grade ${division} · Section ${section}`;
  if (division) return `Grade ${division}`;
  if (section) return `Section ${section}`;
  return '—';
};

const getClassDetails = (c: any) => {
  const details = c?.class_details?.[0];
  const topic = details ? details.topic || details.Topic || '' : '';
  return {
    title: topic || c?.subject_name || 'Class',
    topic,
    isPrepped: Boolean(topic),
  };
};

const JoinButton = memo(({ onPress }: { onPress: () => void }) => (
  <TouchableOpacity style={styles.joinButton} onPress={onPress} activeOpacity={0.8}>
    <View style={styles.joinButtonInner}>
      <Text style={styles.joinButtonText} numberOfLines={1}>
        Join Class
      </Text>
      <SvgLoader svgFilePath="betaRightArrow" width={12} height={12} color="#FFFFFF" />
    </View>
  </TouchableOpacity>
));

type CardBodyProps = {
  activeClass: any;
  isPrepped: boolean;
  onJoin: () => void;
};

const LiveCardBody = memo(({ activeClass, isPrepped, onJoin }: CardBodyProps) => {
  const gradeLabel = getGradeLabel(activeClass);
  const details = getClassDetails(activeClass);
  const subjectLabel = activeClass?.subject_name || details.title || 'Class';

  return (
    <View style={styles.card}>
      <View style={styles.content}>
        <View style={styles.statusRow}>
          <View style={styles.statusLeft}>
            <View style={styles.statusDot} />
            <View style={styles.liveLabelBox}>
              <Text style={styles.statusText}>LIVE NOW</Text>
              {isPrepped ? (
                <Text style={styles.preppedText}> · PREPPED</Text>
              ) : (
                <Text style={styles.unpreppedText}> · UNPREPPED</Text>
              )}
            </View>
          </View>
          <Text style={styles.time}>
            {formatTimeRange(activeClass.start_time, activeClass.end_time)}
          </Text>
        </View>

        <View style={styles.heroTextBlock}>
          <Text style={styles.meta} numberOfLines={1}>
            {gradeLabel}
          </Text>
          <Text style={styles.subject} numberOfLines={1}>
            {subjectLabel}
          </Text>
          <View style={styles.topicRow}>
            <Text style={styles.topic} numberOfLines={1}>
              {details.topic}
            </Text>
            <JoinButton onPress={onJoin} />
          </View>
        </View>
      </View>
    </View>
  );
});

const LiveSessionCard = ({ selectedDate }: { selectedDate?: string }) => {
  const dispatch = useDispatch<any>();
  const navigation = useNavigation<any>();
  const classPrepRef = useRef<any>(null);

  const liveClass = useSelector((state: any) => state.classes.liveClass);
  const classTimeline = useSelector((state: any) => state.classes.classTimeline);
  const unAuthorised = useSelector((state: any) => state.classes.unAuthorised);

  const date = selectedDate || moment().format('YYYY-MM-DD');
  const isToday = moment(date).isSame(moment(), 'day');
  const schedule = useMemo(
    () => (classTimeline || []).filter((item: any) => !item?.date || item.date === date),
    [classTimeline, date]
  );

  const loadSchedule = useCallback(async () => {
    await dispatch(getScheduleClasses({ date } as any));
  }, [dispatch, date]);

  const refreshLiveInBackground = useCallback(async () => {
    if (!isToday) return;
    await dispatch(getLiveClass(undefined));
  }, [dispatch, isToday]);

  const refreshAll = useCallback(async () => {
    await Promise.all([loadSchedule(), refreshLiveInBackground()]);
  }, [loadSchedule, refreshLiveInBackground]);

  useIntervalApi(refreshAll, isToday ? REFRESH_MS : 0);

  useFocusEffect(
    useCallback(() => {
      refreshAll();
    }, [refreshAll])
  );

  useEffect(() => {
    if (unAuthorised) {
      dispatch(setUnAuth());
      dispatch(logout());
    }
  }, [unAuthorised, dispatch]);

  const activeClass = useMemo(() => {
    if (isToday && liveClass?.class_schedule_id) {
      const match = schedule.find((c: any) => c.class_schedule_id === liveClass.class_schedule_id);
      return match ? { ...match, ...liveClass } : liveClass;
    }

    if (!FORCE_LIVE_CARD) return null;

    return (
      schedule[0] || {
        class_schedule_id: 'force-live',
        subject_name: 'Mathematics',
        start_time: moment().format(TIME_FMT),
        end_time: moment().add(45, 'minutes').format(TIME_FMT),
        division_name: '10',
        section_name: 'A',
        class_details: [{ topic: 'Angle Identities' }],
      }
    );
  }, [isToday, schedule, liveClass]);

  const classScheduleId = activeClass?.class_schedule_id;
  const isPrepped = Boolean(getClassDetails(activeClass || {}).isPrepped);

  const navigateToMonitor = useCallback(() => {
    if (!classScheduleId || classScheduleId === 'force-live' || !isToday) return;
    dispatch(setSelectedTask('Attendance'));
    dispatch(setClassId(classScheduleId));
    navigation.navigate('live-monitoring');
  }, [dispatch, navigation, classScheduleId, isToday]);

  const openClassPrep = useCallback(() => {
    classPrepRef.current?.setSelectedClass();
  }, []);

  const onJoin = useCallback(() => {
    if (isPrepped) navigateToMonitor();
    else openClassPrep();
  }, [isPrepped, navigateToMonitor, openClassPrep]);

  if (!activeClass) return null;

  return (
    <View style={styles.wrap}>
      <LiveCardBody activeClass={activeClass} isPrepped={isPrepped} onJoin={onJoin} />

      {!isPrepped ? (
        <View style={styles.prepHost} pointerEvents="box-none">
          <ClassPrep
            item={activeClass}
            selectedClass={activeClass}
            updateTopicSubTopic={noop}
            ref={classPrepRef}
          />
        </View>
      ) : null}
    </View>
  );
};

const noop = () => {};

const styles = StyleSheet.create({
  wrap: {
    alignSelf: 'stretch',
    width: '100%',
  },
  prepHost: {
    position: 'absolute',
    width: 0,
    height: 0,
    overflow: 'visible',
  },
  card: {
    alignSelf: 'stretch',
    width: '100%',
    /** Match ActionRequiredPanel so left text lines up with "Needs you". */
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 22,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EDEBE6',
    overflow: 'hidden',
  },
  content: {
    gap: 16,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  statusLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexShrink: 1,
    minWidth: 0,
  },
  statusDot: {
    width: 8,
    height: 8,
    backgroundColor: '#1F1E1C',
    borderRadius: 4,
  },
  liveLabelBox: {
    height: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    color: '#1F1E1C',
    fontFamily: 'Inter_600SemiBold',
    includeFontPadding: false,
  },
  unpreppedText: {
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    color: '#87590A',
    fontFamily: 'Inter_600SemiBold',
    includeFontPadding: false,
  },
  preppedText: {
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    color: '#1F1E1C',
    fontFamily: 'Inter_600SemiBold',
    includeFontPadding: false,
  },
  heroTextBlock: {
    gap: 6,
  },
  topicRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  time: {
    fontSize: 14,
    lineHeight: 17,
    color: '#4A4844',
    fontFamily: 'Inter_700Bold',
    includeFontPadding: false,
    textAlign: 'right',
  },
  subject: {
    fontSize: 32,
    lineHeight: 39,
    color: '#1A1A1A',
    fontFamily: 'Montserrat_700Bold',
    includeFontPadding: false,
  },
  topic: {
    flex: 1,
    minWidth: 0,
    fontSize: 16,
    lineHeight: 20,
    color: '#4A4844',
    fontFamily: 'Inter_500Medium',
    includeFontPadding: false,
  },
  meta: {
    fontSize: 14,
    lineHeight: 17,
    color: '#1A1A1A',
    fontFamily: 'Inter_500Medium',
    includeFontPadding: false,
  },
  joinButton: {
    width: 124,
    height: 40,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: -16,
    backgroundColor: '#1F1E1C',
    borderWidth: 1,
    borderColor: '#ECEAE4',
    borderRadius: 10,
    overflow: 'hidden',
  },
  joinButtonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  joinButtonText: {
    fontSize: 12,
    lineHeight: 16,
    color: '#FFFFFF',
    fontFamily: 'Inter_600SemiBold',
    includeFontPadding: false,
  },
});

export default LiveSessionCard;
