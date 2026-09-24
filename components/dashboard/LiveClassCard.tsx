import React, { useCallback, useEffect, useRef, useState } from 'react';
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

function useIntervalApi(callback: () => void, delay: number) {
  const savedCallback = useRef<() => void>();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!delay) return;

    const tick = () => savedCallback.current?.();
    const id = setInterval(tick, delay);

    return () => clearInterval(id);
  }, [delay]);
}

const formatTimeRange = (start?: string, end?: string) => {
  const startLabel = start
    ? moment(start, 'HH:mm:ss').format('h:mm')
    : moment().format('h:mm');
  const endLabel = end
    ? moment(end, 'HH:mm:ss').format('h:mm A')
    : moment().add(30, 'minutes').format('h:mm A');
  return `${startLabel} – ${endLabel}`;
};

const formatCountdown = (startTime?: string) => {
  if (!startTime) return 'SOON';
  const startMoment = moment(`${moment().format('YYYY-MM-DD')} ${startTime}`, 'YYYY-MM-DD HH:mm:ss');
  const diffMs = startMoment.diff(moment());
  if (diffMs <= 0) return 'SOON';

  const duration = moment.duration(diffMs);
  const hours = Math.floor(duration.asHours());
  const minutes = duration.minutes();

  if (hours > 0) return `IN ${hours}H ${minutes}M`;
  return `IN ${minutes}M`;
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

const getGradeLabel = (nextClass: any) => {
  const rawDivision =
    nextClass?.division_name?.toString().trim() ||
    nextClass?.division?.toString().trim() ||
    nextClass?.grade_name?.toString().trim() ||
    '';
  const section =
    nextClass?.section_name?.toString().trim() ||
    nextClass?.section?.toString().trim() ||
    '';
  const cleaned = rawDivision.replace(/^class\s+/i, '');
  const division = /\d/.test(cleaned) ? toRoman(cleaned) : cleaned;

  if (division && section) return `Grade ${division} · Section ${section}`;
  if (division) return `Grade ${division}`;
  if (section) return `Section ${section}`;
  return '—';
};

const getClassDetails = (nextClass: any) => {
  const details = nextClass?.class_details?.[0];
  if (!details) {
    return {
      title: nextClass?.subject_name || 'Class',
      subtitle: '',
      isPrepped: false,
    };
  }

  const topic = details.topic || details.Topic || '';
  const subTopic = Array.isArray(details.sub_topic)
    ? details.sub_topic[0]
    : details.Sub_topic?.[0] || '';

  return {
    title: topic || nextClass?.subject_name || 'Class',
    subtitle: subTopic || '',
    isPrepped: Boolean(topic),
  };
};

const LiveSessionCard = () => {
  const dispatch = useDispatch<any>();
  const navigation = useNavigation<any>();
  const classPrepRef = useRef<any>();
  const { liveClass, unAuthorised } = useSelector((state: any) => state.classes);
  const [nextClass, setNextClass] = useState<any>({});
  const [isNextClass, setIsNextClass] = useState(false);
  const [, setTick] = useState(0);

  const getDetails = async () => {
    const liveClassDataRes = await dispatch(getLiveClass());
    if (!liveClassDataRes.payload) {
      getClassFromSchedule();
    } else {
      setNextClass(liveClassDataRes.payload);
      setIsNextClass(false);
    }
  };

  useIntervalApi(getDetails, 300000);

  useFocusEffect(
    useCallback(() => {
      getDetails();
    }, [])
  );

  useEffect(() => {
    if (unAuthorised) {
      dispatch(setUnAuth());
      dispatch(logout());
    }
  }, [unAuthorised]);

  useEffect(() => {
    if (liveClass.class_schedule_id) {
      setNextClass(liveClass);
      setIsNextClass(false);
    }
  }, [liveClass]);

  useEffect(() => {
    if (!isNextClass) return;
    const id = setInterval(() => setTick((t) => t + 1), 60000);
    return () => clearInterval(id);
  }, [isNextClass]);

  const getClassFromSchedule = async () => {
    const reqObj: any = {
      date: moment(new Date()).format('YYYY-MM-DD'),
    };
    const schClassesRes = await dispatch(getScheduleClasses(reqObj));
    const tLime = schClassesRes.payload;
    if (tLime && tLime.length) {
      const now = new Date();
      const currentMinutes = now.getHours() * 60 + now.getMinutes();
      const timelineDataArray = tLime
        .map((timeline: any) => {
          const startTime = moment(timeline.start_time, 'HH:mm:ss').format('HH:mm');
          const [hours, minutes] = startTime.split(':').map(Number);
          const itemMinutes = hours * 60 + minutes;
          return { ...timeline, itemMinutes };
        })
        .filter((item: any) => item.itemMinutes > currentMinutes)
        .sort((a: any, b: any) => a.itemMinutes - b.itemMinutes);

      if (timelineDataArray.length) {
        setNextClass(timelineDataArray[0]);
        setIsNextClass(true);
        return;
      }
    }
    setNextClass({});
    setIsNextClass(false);
  };

  const navigateToMonitor = () => {
    if (nextClass?.class_schedule_id) {
      dispatch(setSelectedTask('Attendance'));
      dispatch(setClassId(nextClass.class_schedule_id));
      navigation.navigate('live-monitoring');
    }
  };

  const openClassPrep = () => {
    classPrepRef.current?.setSelectedClass();
  };

  const hasClass = Boolean(nextClass?.class_schedule_id);
  const isLive = hasClass && !isNextClass;
  const classDetails = getClassDetails(nextClass);
  const gradeLabel = getGradeLabel(nextClass);

  return (
    <>
      <View style={[styles.card, !hasClass && styles.cardEmpty, isNextClass && styles.cardNext]}>
        {isLive && <View style={styles.accentBar} />}
        {isNextClass && <View style={styles.accentBarNext} />}

        {isLive ? (
          <View style={styles.content}>
            <View style={styles.statusRow}>
              <View style={styles.statusDot} />
              <View style={styles.liveLabelBox}>
                <Text style={styles.statusText}>LIVE NOW</Text>
              </View>
            </View>

            <View style={styles.heroInfoRow}>
              <View style={styles.heroTextBlock}>
                <View style={styles.timeBox}>
                  <Text style={styles.time}>
                    {formatTimeRange(nextClass.start_time, nextClass.end_time)}
                  </Text>
                </View>

                <View style={styles.subjectBox}>
                  <Text style={styles.subject} numberOfLines={1}>
                    {nextClass.subject_name || 'Class'}
                  </Text>
                </View>
              </View>

              <View style={styles.heroFooterRow}>
                <View style={styles.gradeBoxLive}>
                  <Text style={styles.meta} numberOfLines={1}>
                    {gradeLabel}
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.joinButton}
                  onPress={navigateToMonitor}
                  activeOpacity={0.8}
                >
                  <View style={styles.joinButtonTextBox}>
                    <Text style={styles.joinButtonText}>Join Class</Text>
                  </View>
                  <View style={styles.joinArrowBox}>
                    <MaterialIcons name="arrow-forward" size={24} color="#FFFFFF" />
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ) : isNextClass ? (
          <View style={styles.heroMainContentTypeA}>
            <View style={styles.statusRow}>
              <View style={styles.statusDotNext} />
              <View style={styles.liveLabelNext}>
                <Text>
                  <Text style={styles.statusTextNext}>
                    NEXT · {formatCountdown(nextClass.start_time)}
                  </Text>
                  {!classDetails.isPrepped && (
                    <Text style={styles.notPreppedText}> - NOT PREPPED</Text>
                  )}
                </Text>
              </View>
            </View>

            <View style={styles.heroInfoRowNext}>
              <View style={styles.heroTextBlockNext}>
                <View style={styles.heroTimeBox}>
                  <Text style={styles.heroTime}>
                    {formatTimeRange(nextClass.start_time, nextClass.end_time)}
                  </Text>
                </View>

                <View style={styles.heroTitleBox}>
                  <Text style={styles.heroTitle} numberOfLines={1}>
                    {nextClass.subject_name || classDetails.title || 'Class'}
                  </Text>
                </View>
              </View>

              <View style={styles.heroFooterRow}>
                <View style={styles.gradeBoxLive}>
                  <Text style={styles.heroGrade} numberOfLines={1}>
                    {gradeLabel}
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.joinButton}
                  onPress={openClassPrep}
                  activeOpacity={0.8}
                >
                  <View style={styles.joinButtonTextBox}>
                    <Text style={styles.joinButtonText}>Prep Class</Text>
                  </View>
                  <View style={styles.joinArrowBox}>
                    <MaterialIcons name="arrow-forward" size={24} color="#FFFFFF" />
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ) : (
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
        )}
      </View>

      {isNextClass && nextClass?.class_schedule_id ? (
        <ClassPrep
          item={nextClass}
          selectedClass={nextClass}
          updateTopicSubTopic={() => {}}
          ref={classPrepRef}
        />
      ) : null}
    </>
  );
};

const styles = StyleSheet.create({
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
  cardNext: {
    height: 217,
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
  liveLabelNext: {
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
  heroInfoRowNext: {
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
  time: {
    fontSize: 14,
    lineHeight: 17,
    color: '#8A8880',
    fontFamily: 'Inter_500Medium',
    includeFontPadding: false,
  },
  heroTimeBox: {
    width: 111,
    height: 17,
    flexGrow: 0,
    flexShrink: 0,
    justifyContent: 'center',
  },
  heroTime: {
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
  heroTitleBox: {
    alignSelf: 'stretch',
    height: 39,
    flexGrow: 0,
    flexShrink: 0,
    justifyContent: 'center',
  },
  heroTitle: {
    fontSize: 32,
    lineHeight: 39,
    color: '#1F1E1C',
    fontFamily: 'Montserrat_700Bold',
    includeFontPadding: false,
  },
  subTopicBox: {
    flexGrow: 0,
    flexShrink: 0,
    justifyContent: 'center',
  },
  subTopic: {
    fontSize: 16,
    lineHeight: 19,
    color: '#8A8880',
    fontFamily: 'Inter_400Regular',
    includeFontPadding: false,
  },
  gradeBox: {
    flexGrow: 0,
    flexShrink: 0,
    justifyContent: 'center',
    maxWidth: '100%',
  },
  gradeBoxLive: {
    flex: 1,
    minWidth: 0,
    marginRight: 12,
    justifyContent: 'center',
  },
  heroGradeBox: {
    height: 17,
    flexGrow: 0,
    flexShrink: 0,
    justifyContent: 'center',
    maxWidth: '100%',
  },
  heroGrade: {
    fontSize: 14,
    lineHeight: 17,
    color: '#8A8880',
    fontFamily: 'Inter_400Regular',
    includeFontPadding: false,
  },
  meta: {
    fontSize: 14,
    lineHeight: 17,
    color: '#8A8880',
    fontFamily: 'Inter_400Regular',
    includeFontPadding: false,
  },
  nextGradeText: {
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
  clockIcon: {
    width: 24,
    height: 24,
    flexGrow: 0,
    flexShrink: 0,
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
