import React, { memo, useCallback, useEffect, useMemo, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Pressable } from 'react-native';
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

/** Dev preview: force one card state. Set true + FORCE_PREVIEW_STATE to preview. */
const FORCE_LIVE_CARD = true;
type LivePreviewState =
  | 'live'
  | 'unprepped'
  | 'prepped'
  | 'next_prepped'
  | 'next_unprepped'
  | 'all_done'
  | 'no_class';
const FORCE_PREVIEW_STATE: LivePreviewState = 'live';

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

type FooterProps = {
  label: string;
  onPress: () => void;
  light?: boolean;
};

const JoinButton = memo(({ label, onPress, light }: FooterProps) => {
  const content = (
    <View style={styles.joinButtonInner}>
      <Text style={[styles.joinButtonText, light && styles.joinButtonTextDark]} numberOfLines={1}>
        {label}
      </Text>
      <SvgLoader
        svgFilePath="betaRightArrow"
        width={12}
        height={12}
        color={light ? '#1F1E1C' : '#FFFFFF'}
      />
    </View>
  );

  if (light) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.joinButton,
          styles.joinButtonLight,
          pressed && styles.joinButtonLightPressed,
        ]}
      >
        {content}
      </Pressable>
    );
  }

  return (
    <TouchableOpacity style={styles.joinButton} onPress={onPress} activeOpacity={0.8}>
      {content}
    </TouchableOpacity>
  );
});

type CardBodyProps = {
  activeClass: any;
  previewState: LivePreviewState;
  onJoin: () => void;
};

const LiveCardBody = memo(({ activeClass, previewState, onJoin }: CardBodyProps) => {
  const gradeLabel = getGradeLabel(activeClass);
  const details = getClassDetails(activeClass);
  const subjectLabel = activeClass?.subject_name || details.title || 'Class';
  const topicLabel = details.topic || 'Angle Identities';
  const isNext = previewState === 'next_prepped' || previewState === 'next_unprepped';
  const buttonLabel = isNext
    ? previewState === 'next_prepped'
      ? 'Open Plan'
      : 'Prep Class'
    : 'Join Class';

  if (previewState === 'all_done') {
    return (
      <View style={styles.doneCard}>
        <View style={styles.doneIconBox}>
          <SvgLoader svgFilePath="liveCorrect" width={14} height={11} color="#2F6FED" />
        </View>
        <View style={styles.doneTextBlock}>
          <Text style={styles.doneTitle}>All wrapped up</Text>
          <Text style={styles.doneSubtitle}>4 classes taught</Text>
        </View>
      </View>
    );
  }

  if (previewState === 'no_class') {
    return (
      <View style={styles.doneCard}>
        <View style={styles.emptyIconBox}>
          <SvgLoader svgFilePath="liveCalendar" width={18} height={18} />
        </View>
        <View style={styles.doneTextBlock}>
          <Text style={styles.doneTitle}>No classes scheduled today</Text>
          <Text style={styles.doneSubtitle}>
            Enjoy the break — or prep an upcoming class from Calendar
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <View style={styles.content}>
        <View style={styles.statusRow}>
          <View style={styles.statusLeft}>
            <View style={styles.statusDot} />
            <View style={styles.liveLabelBox}>
              {isNext ? (
                <>
                  <Text style={styles.statusText}>NEXT</Text>
                  {previewState === 'next_prepped' ? (
                    <Text style={styles.preppedText}> · PREPPED</Text>
                  ) : (
                    <Text style={styles.unpreppedText}> · UNPREPPED</Text>
                  )}
                </>
              ) : (
                <>
                  <Text style={styles.statusText}>LIVE NOW</Text>
                  {previewState === 'prepped' ? (
                    <Text style={styles.preppedText}> · PREPPED</Text>
                  ) : previewState === 'unprepped' ? (
                    <Text style={styles.unpreppedText}> · UNPREPPED</Text>
                  ) : null}
                </>
              )}
            </View>
          </View>
          <View style={styles.timeBox}>
            <Text style={styles.time}>
              {formatTimeRange(activeClass.start_time, activeClass.end_time)}
            </Text>
          </View>
        </View>

        <View style={styles.heroTextBlock}>
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
            <JoinButton label={buttonLabel} onPress={onJoin} light={isNext} />
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
    loadSchedule();
  }, [date, loadSchedule]);

  useEffect(() => {
    if (unAuthorised) {
      dispatch(setUnAuth());
      dispatch(logout());
    }
  }, [unAuthorised, dispatch]);

  const hasLiveFromApi = Boolean(isToday && liveClass?.class_schedule_id);

  const activeClass = useMemo(() => {
    if (hasLiveFromApi) {
      const match = schedule.find(
        (c: any) => c.class_schedule_id === liveClass.class_schedule_id
      );
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
  }, [hasLiveFromApi, schedule, liveClass]);

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

  const livePreviewState: LivePreviewState = FORCE_LIVE_CARD
    ? FORCE_PREVIEW_STATE
    : isPrepped
      ? 'prepped'
      : 'unprepped';

  return (
    <View style={styles.wrap}>
      <LiveCardBody
        activeClass={activeClass}
        previewState={livePreviewState}
        onJoin={onJoin}
      />

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
    height: 176,
    paddingTop: 24,
    /** Match ActionRequiredPanel so left text lines up with "Needs you". */
    paddingHorizontal: 24,
    paddingBottom: 32,
    borderRadius: 20,
    flexDirection: 'column',
    alignItems: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EDEBE6',
    flexGrow: 0,
    flexShrink: 0,
    overflow: 'hidden',
  },
  doneCard: {
    alignSelf: 'stretch',
    width: '100%',
    height: 92,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    gap: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EDEBE6',
    borderRadius: 18,
    flexGrow: 0,
    flexShrink: 0,
  },
  doneIconBox: {
    width: 48,
    height: 48,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 0,
    backgroundColor: '#E8F0FC',
    borderRadius: 12,
    flexGrow: 0,
    flexShrink: 0,
  },
  emptyIconBox: {
    width: 48,
    height: 48,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 0,
    backgroundColor: '#F2F1EC',
    borderRadius: 12,
    flexGrow: 0,
    flexShrink: 0,
  },
  doneTextBlock: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
    gap: 4,
    flexGrow: 1,
    flexShrink: 1,
    minWidth: 0,
    overflow: 'visible',
  },
  doneTitle: {
    minHeight: 24,
    alignSelf: 'stretch',
    fontSize: 16,
    lineHeight: 24,
    color: '#1F1E1C',
    fontFamily: 'Montserrat_700Bold',
    fontStyle: 'normal',
    includeFontPadding: false,
    flexGrow: 0,
    overflow: 'visible',
  },
  doneSubtitle: {
    minHeight: 16,
    alignSelf: 'stretch',
    fontSize: 12,
    lineHeight: 17,
    color: '#8A8880',
    fontFamily: 'Inter_400Regular',
    fontStyle: 'normal',
    includeFontPadding: false,
    flexGrow: 0,
    overflow: 'visible',
  },
  content: {
    alignSelf: 'stretch',
    width: '100%',
    flex: 1,
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'space-between',
    gap: 20,
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
  unpreppedText: {
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    color: '#87590A',
    fontFamily: 'Inter_600SemiBold',
    fontStyle: 'normal',
    includeFontPadding: false,
  },
  preppedText: {
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
    gap: 6,
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
    width: 151,
    height: 17,
    flexGrow: 0,
    flexShrink: 0,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  time: {
    width: 151,
    height: 17,
    fontSize: 14,
    lineHeight: 17,
    color: '#4A4844',
    fontFamily: 'Inter_700Bold',
    fontStyle: 'normal',
    includeFontPadding: false,
    textAlign: 'right',
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
    width: 124,
    height: 40,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 0,
    paddingHorizontal: 16,
    marginTop: -16,
    backgroundColor: '#1F1E1C',
    borderWidth: 1,
    borderColor: '#ECEAE4',
    borderRadius: 10,
    flexGrow: 0,
    flexShrink: 0,
    overflow: 'hidden',
  },
  joinButtonLight: {
    backgroundColor: '#FFFFFF',
    borderColor: '#EDEBE6',
  },
  joinButtonLightPressed: {
    backgroundColor: '#B5B2AA',
    borderColor: '#ECEAE4',
  },
  joinButtonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    flexGrow: 0,
    flexShrink: 0,
  },
  joinButtonText: {
    fontSize: 12,
    lineHeight: 16,
    color: '#FFFFFF',
    fontFamily: 'Inter_600SemiBold',
    fontStyle: 'normal',
    includeFontPadding: false,
    flexGrow: 0,
    flexShrink: 0,
  },
  joinButtonTextDark: {
    color: '#1F1E1C',
  },
});

export default LiveSessionCard;
