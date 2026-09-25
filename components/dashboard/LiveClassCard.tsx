import React, { memo, useCallback, useEffect, useMemo, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
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

/* ----------------------------- hooks ----------------------------- */

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

/* ----------------------------- helpers (pure, module-level) ----------------------------- */

/** Normalize API times like "14:16:00.054000" → "14:16:00" */
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
    isPrepped: Boolean(topic),
  };
};

/* ----------------------------- presentational pieces ----------------------------- */

type FooterProps = {
  grade: string;
  label: string;
  onPress: () => void;
  outlined?: boolean;
};

const ClassFooter = memo(({ grade, label, onPress, outlined }: FooterProps) => (
  <View style={styles.heroFooterRow}>
    <View style={styles.gradeBoxLive}>
      <Text style={styles.meta} numberOfLines={1}>
        {grade}
      </Text>
    </View>

    <TouchableOpacity
      style={[styles.joinButton, outlined && styles.reviewPlanButton]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.joinButtonTextBox}>
        <Text style={[styles.joinButtonText, outlined && styles.reviewPlanButtonText]}>
          {label}
        </Text>
      </View>
      <View style={styles.joinArrowBox}>
        <MaterialIcons name="arrow-forward" size={24} color={outlined ? '#1F1E1C' : '#FFFFFF'} />
      </View>
    </TouchableOpacity>
  </View>
));

const EmptyState = memo(() => (
  <View style={styles.emptyContent}>
    <View style={styles.emptyIconBox}>
      <View style={styles.clockIcon}>
        <SvgLoader svgFilePath="liveCalendar" width={24} height={24} />
      </View>
    </View>
    <View style={styles.emptyTextBlock}>
      <View style={styles.emptyTitleBox}>
        <Text style={styles.emptyTitle}>No classes scheduled today</Text>
      </View>
      <View style={styles.emptySubtitleBox}>
        <Text style={styles.emptySubtitle} numberOfLines={2}>
          Enjoy the break — or prep an upcoming class from Calendar
        </Text>
      </View>
    </View>
  </View>
));

const AllDoneState = memo(
  ({
    count,
    isPastDay,
    dayName,
  }: {
    count: number;
    isPastDay?: boolean;
    dayName?: string;
  }) => (
  <View style={styles.emptyContent}>
    <View style={styles.doneIconBox}>
      <View style={styles.clockIcon}>
        <SvgLoader svgFilePath="liveCorrect" width={18} height={14} />
      </View>
    </View>
    <View style={styles.emptyTextBlock}>
      <View style={styles.emptyTitleBox}>
        <Text style={styles.emptyTitle}>
          {isPastDay && dayName
            ? `${dayName}, all wrapped up`
            : "That's a wrap for today"}
        </Text>
      </View>
      <View style={styles.emptySubtitleBox}>
        <Text style={styles.emptySubtitle} numberOfLines={2}>
          {isPastDay
            ? `${count} ${count === 1 ? 'class' : 'classes'} taught · tap any class below to review how it went`
            : `${count} ${count === 1 ? 'class' : 'classes'} done · review how they went in Analytics`}
        </Text>
      </View>
    </View>
  </View>
));

const AheadState = memo(({ count, dayName }: { count: number; dayName: string }) => (
  <View style={styles.emptyContent}>
    <View style={styles.emptyIconBox}>
      <View style={styles.clockIcon}>
        <SvgLoader svgFilePath="tomorrowLive" width={24} height={24} />
      </View>
    </View>
    <View style={styles.emptyTextBlock}>
      <View style={styles.emptyTitleBox}>
        <Text style={styles.emptyTitle}>Get a head start on {dayName}</Text>
      </View>
      <View style={styles.emptySubtitleBox}>
        <Text style={styles.emptySubtitle} numberOfLines={2}>
          {count} {count === 1 ? 'class' : 'classes'} on the roster · check prep status and plan ahead
        </Text>
      </View>
    </View>
  </View>
));

/* ----------------------------- main component ----------------------------- */

const LiveSessionCard = ({ selectedDate }: { selectedDate?: string }) => {
  const dispatch = useDispatch<any>();
  const navigation = useNavigation<any>();
  const classPrepRef = useRef<any>(null);

  const liveClass = useSelector((state: any) => state.classes.liveClass);
  const classTimeline = useSelector((state: any) => state.classes.classTimeline);
  const unAuthorised = useSelector((state: any) => state.classes.unAuthorised);

  const date = selectedDate || moment().format('YYYY-MM-DD');
  const isToday = moment(date).isSame(moment(), 'day');
  const isPastDay = moment(date).isBefore(moment(), 'day');
  const isFutureDay = moment(date).isAfter(moment(), 'day');
  const schedule = useMemo(
    () => (classTimeline || []).filter((item: any) => !item?.date || item.date === date),
    [classTimeline, date]
  );
  const classCount = schedule.length;

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

  // No clock math — live only if API says so; otherwise first scheduled class as next.
  const hasLiveFromApi = Boolean(isToday && liveClass?.class_schedule_id);
  const allClassesDone = isPastDay && classCount > 0;
  const isAhead = isFutureDay && classCount > 0;
  const isLive = hasLiveFromApi;
  const isNextClass = isToday && !hasLiveFromApi && classCount > 0;

  const activeClass = useMemo(() => {
    if (hasLiveFromApi) {
      const match = schedule.find(
        (c: any) => c.class_schedule_id === liveClass.class_schedule_id
      );
      return match ? { ...match, ...liveClass } : liveClass;
    }
    return schedule[0] || {};
  }, [hasLiveFromApi, schedule, liveClass]);

  const classScheduleId = activeClass?.class_schedule_id;
  const hasClass = Boolean(classScheduleId);

  const classDetails = useMemo(() => getClassDetails(activeClass), [activeClass]);
  const gradeLabel = useMemo(() => getGradeLabel(activeClass), [activeClass]);
  const { isPrepped } = classDetails;
  const subjectLabel = activeClass.subject_name || classDetails.title || 'Class';

  const navigateToMonitor = useCallback(() => {
    if (!classScheduleId || !isToday) return;
    dispatch(setSelectedTask('Attendance'));
    dispatch(setClassId(classScheduleId));
    navigation.navigate('live-monitoring');
  }, [dispatch, navigation, classScheduleId, isToday]);

  const openClassPrep = useCallback(() => {
    classPrepRef.current?.setSelectedClass();
  }, []);

  const showPrep = hasClass && !isPastDay && (isNextClass || !isPrepped);

  return (
    <View style={styles.wrap}>
      <View
        style={[
          styles.card,
          (!hasClass || allClassesDone || isAhead) && styles.cardEmpty,
          allClassesDone && styles.cardAllDone,
          isNextClass && styles.cardNext,
          (isLive || isNextClass || allClassesDone || isAhead) && styles.cardWithAccent,
        ]}
      >
        {isLive && (
          <View style={[styles.accentBar, !isPrepped && styles.accentBarLiveNotPrepped]} />
        )}
        {(isNextClass || isAhead) && <View style={styles.accentBarNext} />}
        {allClassesDone && <View style={styles.accentBar} />}

        {isLive ? (
          <View style={styles.content}>
            <View style={styles.statusRow}>
              <View style={[styles.statusDot, !isPrepped && styles.statusDotLiveNotPrepped]} />
              <View style={styles.liveLabelBox}>
                {isPrepped ? (
                  <Text style={styles.statusText}>LIVE NOW</Text>
                ) : (
                  <Text>
                    <Text style={styles.statusTextLiveNotPrepped}>LIVE NOW</Text>
                    <Text style={styles.notPreppedText}> · NOT PREPPED</Text>
                  </Text>
                )}
              </View>
            </View>

            <View style={styles.heroInfoRow}>
              <View style={styles.heroTextBlock}>
                <View style={styles.timeBox}>
                  <Text style={styles.time}>
                    {formatTimeRange(activeClass.start_time, activeClass.end_time)}
                  </Text>
                </View>
                <View style={styles.subjectBox}>
                  <Text style={styles.subject} numberOfLines={1}>
                    {subjectLabel}
                  </Text>
                </View>
              </View>

              <ClassFooter
                grade={gradeLabel}
                label={isPrepped ? 'Join Class' : 'Prep & Start'}
                onPress={isPrepped ? navigateToMonitor : openClassPrep}
              />
            </View>
          </View>
        ) : isNextClass ? (
          <View style={styles.heroMainContentTypeA}>
            <View style={styles.statusRow}>
              <View style={styles.statusDotNext} />
              <View style={styles.liveLabelBox}>
                <Text>
                  <Text style={styles.statusTextNext}>
                    NEXT · IN 5H
                  </Text>
                  {!isPrepped && <Text style={styles.notPreppedText}> - NOT PREPPED</Text>}
                </Text>
              </View>
            </View>

            <View style={styles.heroInfoRow}>
              <View style={styles.heroTextBlockNext}>
                <View style={styles.heroTimeBox}>
                  <Text style={styles.time}>
                    {formatTimeRange(activeClass.start_time, activeClass.end_time)}
                  </Text>
                </View>
                <View style={styles.subjectBox}>
                  <Text style={styles.subject} numberOfLines={1}>
                    {subjectLabel}
                  </Text>
                </View>
              </View>

              <ClassFooter
                grade={gradeLabel}
                label={isPrepped ? 'Review Plan' : 'Prep Class'}
                onPress={openClassPrep}
                outlined={isPrepped}
              />
            </View>
          </View>
        ) : isAhead ? (
          <AheadState
            count={3}
            dayName={moment(date).format('dddd')}
          />
        ) : allClassesDone ? (
          <AllDoneState
            count={3}
            isPastDay={isPastDay}
            dayName={moment(date).format('dddd')}
          />
        ) : (
          <EmptyState />
        )}
      </View>

      {showPrep ? (
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

/* ----------------------------- styles (visually unchanged; duplicates merged, unused removed) ----------------------------- */

const styles = StyleSheet.create({
  wrap: {
    alignSelf: 'stretch',
    width: '100%',
  },
  // Keep ClassPrep/modals mounted without adding layout gap under the card.
  prepHost: {
    position: 'absolute',
    width: 0,
    height: 0,
    overflow: 'visible',
  },
  card: {
    alignSelf: 'stretch',
    width: '100%',
    height: 217,
    flexDirection: 'column',
    alignItems: 'flex-start',
    padding: 32,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EDEBE6',
    borderRadius: 20,
    flexGrow: 0,
    flexShrink: 0,
    shadowColor: '#000',
    shadowOpacity: 0.0235294,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 8 },
    elevation: 2,
    overflow: 'hidden',
  },
  cardEmpty: {
    height: 120,
    minHeight: 0,
    padding: 24,
    justifyContent: 'center',
    borderRadius: 20,
    shadowOpacity: 0.0156863,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 1,
    overflow: 'visible',
  },
  cardAllDone: {
    overflow: 'hidden',
  },
  cardNext: {
    height: 217,
    overflow: 'hidden',
  },
  // Drop left border so accent sits on the outer edge (no white gap inside the border).
  cardWithAccent: {
    borderLeftWidth: 0,
    overflow: 'hidden',
  },
  accentBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 8,
    backgroundColor: '#21C17C',
  },
  accentBarLiveNotPrepped: {
    backgroundColor: '#E8A33D',
  },
  accentBarNext: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 8,
    backgroundColor: '#EDEBE6',
  },
  content: {
    alignSelf: 'stretch',
    width: '100%',
    height: '100%',
    flexDirection: 'column',
    alignItems: 'stretch',
    padding: 0,
    gap: 20,
    flexGrow: 0,
    flexShrink: 0,
    zIndex: 1,
  },
  heroMainContentTypeA: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    alignSelf: 'stretch',
    width: '100%',
    padding: 0,
    gap: 20,
    flexGrow: 0,
    flexShrink: 0,
    zIndex: 1,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    backgroundColor: '#21C17C',
    borderRadius: 4,
    flexGrow: 0,
    flexShrink: 0,
  },
  statusDotLiveNotPrepped: {
    backgroundColor: '#E8A33D',
  },
  statusDotNext: {
    width: 8,
    height: 8,
    backgroundColor: '#8A8880',
    borderRadius: 4,
    flexGrow: 0,
    flexShrink: 0,
  },
  liveLabelBox: {
    height: 17,
    flexGrow: 0,
    flexShrink: 0,
    justifyContent: 'center',
  },
  statusText: {
    fontSize: 14,
    lineHeight: 17,
    color: '#0D8A57',
    fontFamily: 'Inter_600SemiBold',
    includeFontPadding: false,
  },
  statusTextLiveNotPrepped: {
    fontSize: 14,
    lineHeight: 17,
    color: '#E8A33D',
    fontFamily: 'Inter_600SemiBold',
    includeFontPadding: false,
  },
  statusTextNext: {
    fontSize: 14,
    lineHeight: 17,
    color: '#8A8880',
    fontFamily: 'Inter_600SemiBold',
    includeFontPadding: false,
  },
  notPreppedText: {
    fontSize: 14,
    lineHeight: 17,
    color: '#E8A33D',
    fontFamily: 'Inter_600SemiBold',
    includeFontPadding: false,
  },
  heroInfoRow: {
    alignSelf: 'stretch',
    width: '100%',
    flexDirection: 'column',
    alignItems: 'stretch',
    padding: 0,
    gap: 8,
    flexGrow: 0,
    flexShrink: 0,
  },
  heroTextBlock: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    padding: 0,
    gap: 8,
  },
  heroTextBlockNext: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    alignSelf: 'stretch',
    padding: 0,
    gap: 8,
    flexGrow: 0,
    flexShrink: 0,
  },
  heroFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  timeBox: {
    height: 17,
    flexGrow: 0,
    flexShrink: 0,
    justifyContent: 'center',
  },
  heroTimeBox: {
    width: 111,
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
    color: '#1F1E1C',
    fontFamily: 'Montserrat_700Bold',
    includeFontPadding: false,
  },
  gradeBoxLive: {
    flex: 1,
    minWidth: 0,
    marginRight: 12,
    justifyContent: 'center',
  },
  meta: {
    fontSize: 14,
    lineHeight: 17,
    color: '#8A8880',
    fontFamily: 'Inter_400Regular',
    includeFontPadding: false,
  },
  joinButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 0,
    gap: 8,
    height: 48,
    backgroundColor: '#21C17C',
    borderRadius: 8,
    flexGrow: 0,
    flexShrink: 0,
  },
  reviewPlanButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#EDEBE6',
  },
  joinButtonTextBox: {
    height: 24,
    flexGrow: 0,
    flexShrink: 0,
    justifyContent: 'center',
  },
  joinButtonText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#FFFFFF',
    fontFamily: 'Montserrat_600SemiBold',
    includeFontPadding: false,
  },
  reviewPlanButtonText: {
    color: '#1F1E1C',
  },
  joinArrowBox: {
    width: 24,
    height: 24,
    flexGrow: 0,
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyContent: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
    width: '100%',
    padding: 0,
    gap: 20,
    flexGrow: 0,
    flexShrink: 0,
    zIndex: 1,
  },
  emptyIconBox: {
    width: 56,
    height: 56,
    padding: 0,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F2F1EC',
    borderRadius: 12,
    flexGrow: 0,
    flexShrink: 0,
  },
  doneIconBox: {
    width: 56,
    height: 56,
    padding: 0,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E8F8F0',
    borderRadius: 12,
    flexGrow: 0,
    flexShrink: 0,
  },
  clockIcon: {
    width: 24,
    height: 24,
    flexGrow: 0,
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTextBlock: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    padding: 0,
    gap: 8,
    width: '100%',
    flexGrow: 1,
    flexShrink: 1,
    minWidth: 0,
  },
  emptyTitleBox: {
    alignSelf: 'stretch',
    flexGrow: 0,
    flexShrink: 0,
    justifyContent: 'center',
  },
  emptyTitle: {
    fontSize: 22,
    lineHeight: 27,
    color: '#1F1E1C',
    fontFamily: 'Montserrat_600SemiBold',
    includeFontPadding: false,
  },
  emptySubtitleBox: {
    alignSelf: 'stretch',
    flexGrow: 0,
    flexShrink: 0,
    justifyContent: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    lineHeight: 19,
    color: '#8A8880',
    fontFamily: 'Inter_400Regular',
    includeFontPadding: false,
  },
});

export default LiveSessionCard;