import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { getLiveClass, getScheduleClasses, setUnAuth } from '@/store/classSlice';
import moment from 'moment';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { setClassId, setSelectedTask } from '@/store/liveMonitoringSlice';
import { logout } from '@/store/authSlice';

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
  const rawDivision = nextClass?.division_name?.toString().trim() || '';
  const section = nextClass?.section_name?.toString().trim();
  const cleaned = rawDivision.replace(/^class\s+/i, '');
  const division = /\d/.test(cleaned) ? toRoman(cleaned) : cleaned;

  if (division && section) return `Grade ${division} · Section ${section}`;
  if (division) return `Grade ${division}`;
  if (section) return `Section ${section}`;
  return '—';
};

const LiveSessionCard = () => {
  const dispatch = useDispatch<any>();
  const navigation = useNavigation<any>();
  const { liveClass, unAuthorised } = useSelector((state: any) => state.classes);
  const [nextClass, setNextClass] = useState<any>({});
  const [isNextClass, setIsNextClass] = useState(false);

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
    }
  }, [liveClass]);

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
      }
    }
  };

  const navigateToMonitor = () => {
    if (nextClass?.class_schedule_id) {
      dispatch(setSelectedTask('Attendance'));
      dispatch(setClassId(nextClass.class_schedule_id));
      navigation.navigate('live-monitoring');
    }
  };

  const hasClass = Boolean(nextClass?.class_schedule_id);
  const isLive = hasClass && !isNextClass;

  return (
    <View style={[styles.card, !hasClass && styles.cardEmpty]}>
      {hasClass && <View style={styles.accentBar} />}

      {hasClass ? (
        <View style={styles.content}>
          <View style={styles.statusRow}>
            <View style={[styles.statusDot, !isLive && styles.statusDotUpcoming]} />
            <View style={styles.liveLabelBox}>
              <Text style={[styles.statusText, !isLive && styles.statusTextUpcoming]}>
                {isLive ? 'LIVE NOW' : 'UPCOMING'}
              </Text>
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
              <View style={styles.gradeBox}>
                <Text style={styles.meta} numberOfLines={1}>
                  {getGradeLabel(nextClass)}
                </Text>
              </View>

              <TouchableOpacity
                style={[styles.joinButton, isNextClass && styles.joinButtonUpcoming]}
                onPress={navigateToMonitor}
                activeOpacity={0.8}
                disabled={isNextClass}
              >
                <View style={styles.joinButtonTextBox}>
                  <Text style={styles.joinButtonText}>
                    {isNextClass ? 'Upcoming' : 'Join Class'}
                  </Text>
                </View>
                {!isNextClass && (
                  <View style={styles.joinArrowBox}>
                    <MaterialIcons name="arrow-forward" size={24} color="#FFFFFF" />
                  </View>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ) : (
        <View style={styles.emptyContent}>
          <Text style={styles.emptyTitle}>No Classes Found Today</Text>
          <Text style={styles.emptySubtitle}>You’re all clear for now.</Text>
        </View>
      )}
    </View>
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
  cardEmpty: {},
  accentBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: '#21C17C',
  },
  content: {
    alignSelf: 'stretch',
    width: '100%',
    flexDirection: 'column',
    alignItems: 'flex-start',
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
  statusDotUpcoming: {
    backgroundColor: '#8A8880',
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
  statusTextUpcoming: {
    color: '#8A8880',
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
  gradeBox: {
    height: 17,
    flexGrow: 0,
    flexShrink: 0,
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
  joinButtonUpcoming: {
    backgroundColor: '#C8C6BE',
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
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  emptyTitle: {
    fontSize: 18,
    lineHeight: 22,
    color: '#1F1E1C',
    fontFamily: 'Inter_600SemiBold',
    includeFontPadding: false,
  },
  emptySubtitle: {
    marginTop: 6,
    fontSize: 14,
    lineHeight: 17,
    color: '#8A8880',
    fontFamily: 'Inter_400Regular',
    includeFontPadding: false,
  },
});

export default LiveSessionCard;
