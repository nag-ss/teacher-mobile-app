import React, { memo, useCallback, useEffect, useMemo, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { getLiveClass, getScheduleClasses, setUnAuth } from '@/store/classSlice';
import moment from 'moment';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { setClassId, setSelectedTask } from '@/store/liveMonitoringSlice';
import { logout } from '@/store/authSlice';
import { useLiveClassLayout, type LiveClassLayout } from '@/hooks/Responsive/useLiveClassLayout';
import ClassPrep from './ClassPrep';

const REFRESH_MS = 300000;
const TIME_FMT = 'HH:mm:ss';

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
  const startLabel = (start ? moment(normalizeTime(start), TIME_FMT) : moment()).format('h:mm');
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

type FooterProps = {
  label: string;
  onPress: () => void;
  layout: LiveClassLayout;
};

const JoinButton = memo(({ label, onPress, layout }: FooterProps) => (
  <TouchableOpacity
    style={[
      styles.joinButton,
      {
        width: layout.joinButtonWidth,
        height: layout.joinButtonHeight,
        paddingHorizontal: layout.joinButtonPaddingH,
        gap: layout.joinButtonGap,
      },
    ]}
    onPress={onPress}
    activeOpacity={0.8}
  >
    <View style={styles.joinButtonTextBox}>
      <Text style={styles.joinButtonText}>{label}</Text>
    </View>
    <View style={styles.joinArrowBox}>
      <MaterialIcons name="arrow-forward" size={16} color="#FFFFFF" />
    </View>
  </TouchableOpacity>
));

const LiveSessionCard = ({ selectedDate }: { selectedDate?: string }) => {
  const dispatch = useDispatch<any>();
  const navigation = useNavigation<any>();
  const classPrepRef = useRef<any>(null);
  const layout = useLiveClassLayout();

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
    loadSchedule();
  }, [date, loadSchedule]);

  useEffect(() => {
    if (unAuthorised) {
      dispatch(setUnAuth());
      dispatch(logout());
    }
  }, [unAuthorised, dispatch]);

  const hasLiveFromApi = Boolean(isToday && liveClass?.class_schedule_id);

  /** Force LIVE NOW card visible for layout/dev even when API has no live class. */
  const FORCE_LIVE_CARD = true;

  const activeClass = useMemo(() => {
    if (hasLiveFromApi) {
      const match = schedule.find(
        (c: any) => c.class_schedule_id === liveClass.class_schedule_id
      );
      return match ? { ...match, ...liveClass } : liveClass;
    }

    if (!FORCE_LIVE_CARD) return null;

    if (schedule[0]) return schedule[0];

    return {
      class_schedule_id: 'force-live',
      subject_name: 'Mathematics',
      start_time: moment().format(TIME_FMT),
      end_time: moment().add(45, 'minutes').format(TIME_FMT),
      division_name: '10',
      section_name: 'A',
      class_details: [{ topic: 'Angle Identities' }],
    };
  }, [hasLiveFromApi, schedule, liveClass]);

  const classScheduleId = activeClass?.class_schedule_id;
  const classDetails = useMemo(
    () =>
      activeClass
        ? getClassDetails(activeClass)
        : { title: '', topic: '', isPrepped: false },
    [activeClass]
  );
  const gradeLabel = useMemo(
    () => (activeClass ? getGradeLabel(activeClass) : '—'),
    [activeClass]
  );
  const { isPrepped, topic } = classDetails;
  const subjectLabel = activeClass?.subject_name || classDetails.title || 'Class';
  const topicLabel = topic || 'Angle Identities';

  const navigateToMonitor = useCallback(() => {
    if (!classScheduleId || classScheduleId === 'force-live' || !isToday) return;
    dispatch(setSelectedTask('Attendance'));
    dispatch(setClassId(classScheduleId));
    navigation.navigate('live-monitoring');
  }, [dispatch, navigation, classScheduleId, isToday]);

  const openClassPrep = useCallback(() => {
    classPrepRef.current?.setSelectedClass();
  }, []);

  if (!activeClass) return null;

  return (
    <View style={styles.wrap}>
      <View
        style={[
          styles.card,
          {
            height: layout.cardHeight,
            paddingTop: layout.cardPadding - 8,
            paddingHorizontal: layout.cardPadding,
            paddingBottom: layout.cardPadding,
            borderRadius: layout.cardRadius,
          },
        ]}
      >
        <View style={[styles.content, { gap: layout.contentGap }]}>
          <View style={styles.statusRow}>
            <View style={styles.statusLeft}>
              <View style={styles.statusDot} />
              <View style={styles.liveLabelBox}>
                <Text style={styles.statusText}>LIVE</Text>
                {!isPrepped ? (
                  <Text style={styles.notPreppedText}> · NOT PREPPED</Text>
                ) : null}
              </View>
            </View>
            <View style={styles.timeBox}>
              <Text style={styles.time}>
                {formatTimeRange(activeClass.start_time, activeClass.end_time)}
              </Text>
            </View>
          </View>

          <View style={[styles.heroTextBlock, { gap: layout.heroTextGap }]}>
            <View style={styles.gradeBoxLive}>
              <Text style={styles.meta} numberOfLines={1}>
                {gradeLabel}
              </Text>
            </View>
            <View style={styles.subjectBox}>
              <Text style={styles.subject} numberOfLines={1}>
                {subjectLabel}
              </Text>
            </View>
            <View style={styles.topicRow}>
              <View style={styles.topicBox}>
                <Text style={styles.topic} numberOfLines={1}>
                  {topicLabel}
                </Text>
              </View>
              <JoinButton
                label={isPrepped ? 'Join Class' : 'Prep & Start'}
                onPress={isPrepped ? navigateToMonitor : openClassPrep}
                layout={layout}
              />
            </View>
          </View>
        </View>
      </View>

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
    flexDirection: 'column',
    alignItems: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EDEBE6',
    flexGrow: 0,
    flexShrink: 0,
    shadowColor: '#000',
    shadowOpacity: 0.0235294,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 8 },
    elevation: 2,
    overflow: 'hidden',
  },
  content: {
    alignSelf: 'stretch',
    width: '100%',
    flex: 1,
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'space-between',
    padding: 0,
    zIndex: 1,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    alignSelf: 'stretch',
    width: '100%',
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
    flexGrow: 0,
    flexShrink: 0,
  },
  liveLabelBox: {
    height: 16,
    flexDirection: 'row',
    alignItems: 'center',
    flexGrow: 0,
    flexShrink: 0,
    justifyContent: 'center',
  },
  statusText: {
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    color: '#1F1E1C',
    fontFamily: 'Inter_600SemiBold',
    fontStyle: 'normal',
    includeFontPadding: false,
  },
  notPreppedText: {
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    color: '#1F1E1C',
    fontFamily: 'Inter_600SemiBold',
    fontStyle: 'normal',
    includeFontPadding: false,
  },
  heroTextBlock: {
    alignSelf: 'stretch',
    width: '100%',
    flexDirection: 'column',
    alignItems: 'stretch',
    padding: 0,
  },
  topicRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    alignSelf: 'stretch',
    width: '100%',
    gap: 12,
  },
  timeBox: {
    height: 17,
    flexGrow: 0,
    flexShrink: 0,
    justifyContent: 'center',
  },
  time: {
    fontSize: 14,
    lineHeight: 17,
    color: '#8A8880',
    fontFamily: 'Inter_500Medium',
    includeFontPadding: false,
  },
  subjectBox: {
    height: 39,
    alignSelf: 'stretch',
    flexGrow: 0,
    flexShrink: 0,
    justifyContent: 'center',
  },
  subject: {
    fontSize: 32,
    lineHeight: 39,
    color: '#1A1A1A',
    fontFamily: 'Montserrat_700Bold',
    fontStyle: 'normal',
    includeFontPadding: false,
  },
  topicBox: {
    flex: 1,
    minWidth: 0,
    minHeight: 19,
    justifyContent: 'center',
    overflow: 'visible',
  },
  topic: {
    fontSize: 16,
    lineHeight: 20,
    color: '#4A4844',
    fontFamily: 'Inter_500Medium',
    fontStyle: 'normal',
    includeFontPadding: false,
  },
  gradeBoxLive: {
    width: 230,
    height: 17,
    alignSelf: 'stretch',
    flexGrow: 0,
    flexShrink: 0,
    justifyContent: 'center',
  },
  meta: {
    fontSize: 14,
    lineHeight: 17,
    color: '#1A1A1A',
    fontFamily: 'Inter_500Medium',
    fontStyle: 'normal',
    includeFontPadding: false,
  },
  joinButton: {
    boxSizing: 'border-box',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 0,
    marginTop: -16,
    backgroundColor: '#1F1E1C',
    borderWidth: 1,
    borderColor: '#ECEAE4',
    borderRadius: 10,
    flexGrow: 0,
    flexShrink: 0,
  },
  joinButtonTextBox: {
    flexGrow: 0,
    flexShrink: 0,
    justifyContent: 'center',
  },
  joinButtonText: {
    fontSize: 14,
    lineHeight: 17,
    color: '#FFFFFF',
    fontFamily: 'Inter_600SemiBold',
    includeFontPadding: false,
  },
  joinArrowBox: {
    width: 16,
    height: 16,
    flexGrow: 0,
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default LiveSessionCard;
