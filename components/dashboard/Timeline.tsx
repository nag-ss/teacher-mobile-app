import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { getScheduleClasses } from '@/store/classSlice';
import moment from 'moment';
import { useFocusEffect } from '@react-navigation/native';
import ClassPrep from './ClassPrep';
import SvgLoader from '@/utils/SvgLoader';

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

const getGradeLabel = (item: any) => {
  const rawDivision = item?.division_name?.toString().trim() || '';
  const section = item?.section_name?.toString().trim();
  const cleaned = rawDivision.replace(/^class\s+/i, '');
  const division = /\d/.test(cleaned) ? toRoman(cleaned) : cleaned;

  if (division && section) return `Grade ${division} · Section ${section}`;
  if (division) return `Grade ${division}`;
  if (section) return `Section ${section}`;
  return '—';
};

const ClassTimelineRow = ({
  item,
  currentDate,
  isPastDay,
}: {
  item: any;
  currentDate: string;
  isPastDay?: boolean;
}) => {
  const classPrepRef = useRef<any>();
  const showPastSummary = Boolean(isPastDay);

  const onPress = () => {
    if (showPastSummary) return;
    classPrepRef.current?.setSelectedClass();
  };

  return (
    <>
      <TouchableOpacity
        style={[styles.row, styles.rowCard]}
        activeOpacity={0.7}
        onPress={onPress}
      >
        <View style={styles.timeBox}>
          <Text style={styles.time}>{item.timeLabel}</Text>
          <Text style={styles.timePeriod}>{item.timePeriod}</Text>
        </View>

        <View style={styles.classMeta}>
          <View style={styles.subjectBox}>
            <Text style={styles.title} numberOfLines={1}>
              {item.title}
            </Text>
          </View>
          <View style={styles.gradeBox}>
            <Text style={styles.grade} numberOfLines={1}>
              {item.gradeLabel}
            </Text>
          </View>
        </View>

        {showPastSummary ? (
          <View style={styles.summaryBlock}>
            <Text style={styles.summaryText}>View summary</Text>
            <View style={styles.arrowBox}>
              <View style={styles.arrowVector}>
                <SvgLoader svgFilePath="timelineArrow" width={8} height={14} />
              </View>
            </View>
          </View>
        ) : (
          <View style={styles.statusBlock}>
            <View style={styles.statusBox}>
              <Text style={[styles.status, styles.statusReady]}>Prep ready</Text>
            </View>
            <View style={styles.arrowBox}>
              <View style={styles.arrowVector}>
                <SvgLoader svgFilePath="timelineArrow" width={8} height={14} />
              </View>
            </View>
          </View>
        )}
      </TouchableOpacity>

      {moment(new Date()).format('YYYY-MM-DD') <= currentDate ? (
        <ClassPrep
          item={item}
          selectedClass={item.raw}
          updateTopicSubTopic={() => {}}
          ref={classPrepRef}
        />
      ) : null}
    </>
  );
};

const ROW_HEIGHT = 85;
const ROW_GAP = 16;
const VISIBLE_ROWS = 3;
const LIST_HEIGHT = ROW_HEIGHT * VISIBLE_ROWS + ROW_GAP * (VISIBLE_ROWS - 1) + 32;
const THUMB_HEIGHT = 24;

const TimelineWithClassDetails = ({ selectedDate }: { selectedDate?: string }) => {
  const dispatch = useDispatch<any>();
  const classTimeline = useSelector((state: any) => state.classes.classTimeline);
  const date = selectedDate || moment().format('YYYY-MM-DD');
  const thumbRef = useRef<View>(null);
  const scrollYRef = useRef(0);
  const metricsRef = useRef({ contentHeight: 1, layoutHeight: LIST_HEIGHT });

  const updateThumb = useCallback((scrollY = scrollYRef.current) => {
    const { contentHeight, layoutHeight } = metricsRef.current;
    const canScroll = contentHeight > layoutHeight + 1;
    const maxScroll = Math.max(1, contentHeight - layoutHeight);
    const offset = canScroll
      ? (scrollY / maxScroll) * (layoutHeight - THUMB_HEIGHT)
      : 0;

    thumbRef.current?.setNativeProps({
      style: {
        height: THUMB_HEIGHT,
        opacity: canScroll ? 1 : 0.35,
        transform: [{ translateY: offset }],
      },
    });
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

  const isPastDay = moment(date).isBefore(moment(), 'day');

  const rows = useMemo(() => {
    const list = (classTimeline || []).filter(
      (t: any) => !t.date || t.date === date
    );
    if (!list.length) return [];

    const normalizeStart = (t: any) => String(t.start_time || '').split('.')[0];

    return [...list]
      .sort((a, b) => normalizeStart(a).localeCompare(normalizeStart(b)))
      .map((timeline: any) => {
        const startRaw = String(timeline.start_time).split('.')[0];
        const start = moment(startRaw, 'HH:mm:ss');

        return {
          classId: timeline.class_schedule_id,
          timeLabel: start.format('h:mm'),
          timePeriod: start.format('A'),
          title: timeline.subject_name || 'Class',
          gradeLabel: getGradeLabel(timeline),
          raw: timeline,
        };
      });
  }, [classTimeline, date]);

  const headerLabel = moment(date).isSame(moment(), 'day')
    ? "TODAY'S CLASSES"
    : `${moment(date).format('dddd').toUpperCase()}'S CLASSES`;

  return (
    <View style={styles.container}>
      <View style={styles.sectionLabelBox}>
        <Text style={styles.header}>{headerLabel}</Text>
      </View>

      <View style={styles.listRow}>
        <ScrollView
          style={styles.list}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          onScroll={(e) => {
            scrollYRef.current = e.nativeEvent.contentOffset.y;
            updateThumb(scrollYRef.current);
          }}
          onContentSizeChange={(_w, h) => {
            metricsRef.current.contentHeight = h;
            updateThumb();
          }}
          onLayout={(e) => {
            metricsRef.current.layoutHeight = e.nativeEvent.layout.height;
            updateThumb();
          }}
        >
          {rows.length ? (
            rows.map((item: any) => (
              <ClassTimelineRow
                key={item.classId}
                item={item}
                currentDate={date}
                isPastDay={isPastDay}
              />
            ))
          ) : (
            <Text style={styles.emptyText}>No classes scheduled for this day.</Text>
          )}
        </ScrollView>

        <View style={styles.scrollTrack}>
          <View
            ref={thumbRef}
            style={[styles.scrollThumb, { height: THUMB_HEIGHT, opacity: 0.35 }]}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: 'stretch',
    width: '100%',
    flexDirection: 'column',
    alignItems: 'flex-start',
    padding: 0,
    gap: 16,
    flexGrow: 0,
    flexShrink: 0,
  },
  sectionLabelBox: {
    height: 15,
    flexGrow: 0,
    flexShrink: 0,
    justifyContent: 'center',
  },
  header: {
    fontSize: 12,
    lineHeight: 15,
    textTransform: 'uppercase',
    color: '#8A8880',
    fontFamily: 'Inter_600SemiBold',
    includeFontPadding: false,
  },
  listRow: {
    width: '100%',
    alignSelf: 'stretch',
    height: LIST_HEIGHT,
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: 8,
  },
  list: {
    flex: 1,
    alignSelf: 'stretch',
    height: '100%',
  },
  scrollTrack: {
    width: 4,
    alignSelf: 'stretch',
    height: '100%',
    backgroundColor: '#EDEBE6',
    borderRadius: 2,
    overflow: 'hidden',
  },
  scrollThumb: {
    width: 4,
    backgroundColor: '#8A8880',
    borderRadius: 2,
  },
  listContent: {
    gap: ROW_GAP,
    paddingBottom: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
    width: '100%',
    height: ROW_HEIGHT,
    paddingHorizontal: 20,
    paddingVertical: 0,
    flexGrow: 0,
    flexShrink: 0,
  },
  rowCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EDEBE6',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.0156863,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 1,
  },
  timeBox: {
    minWidth: 70,
    height: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flexGrow: 0,
    flexShrink: 0,
  },
  time: {
    fontSize: 15,
    lineHeight: 18,
    color: '#1F1E1C',
    fontFamily: 'Inter_600SemiBold',
    includeFontPadding: false,
  },
  timePeriod: {
    fontSize: 15,
    lineHeight: 18,
    color: '#1F1E1C',
    fontFamily: 'Inter_600SemiBold',
    includeFontPadding: false,
  },
  classMeta: {
    flexGrow: 1,
    flexShrink: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
    padding: 0,
    gap: 8,
    minWidth: 0,
    marginLeft: 28,
  },
  subjectBox: {
    height: 20,
    flexGrow: 0,
    flexShrink: 0,
    justifyContent: 'center',
    maxWidth: '100%',
  },
  title: {
    fontSize: 16,
    lineHeight: 20,
    color: '#1F1E1C',
    fontFamily: 'Montserrat_600SemiBold',
    includeFontPadding: false,
  },
  gradeBox: {
    height: 17,
    flexGrow: 0,
    flexShrink: 0,
    justifyContent: 'center',
    maxWidth: '100%',
  },
  grade: {
    fontSize: 14,
    lineHeight: 17,
    color: '#8A8880',
    fontFamily: 'Inter_400Regular',
    includeFontPadding: false,
  },
  statusBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    flexShrink: 0,
    marginLeft: 16,
  },
  summaryBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    flexShrink: 0,
    marginLeft: 16,
  },
  summaryText: {
    fontSize: 14,
    lineHeight: 17,
    color: '#0D8A57',
    fontFamily: 'Inter_600SemiBold',
    includeFontPadding: false,
  },
  statusBox: {
    flexGrow: 0,
    flexShrink: 0,
    justifyContent: 'center',
  },
  status: {
    fontSize: 14,
    lineHeight: 17,
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  statusReady: {
    color: '#0D8A57',
    fontFamily: 'Inter_600SemiBold',
  },
  arrowBox: {
    width: 20,
    height: 20,
    padding: 0,
    position: 'relative',
    flexGrow: 0,
    flexShrink: 0,
  },
  arrowVector: {
    position: 'absolute',
    left: '20%',
    right: '20%',
    top: '15%',
    bottom: '15%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 14,
    lineHeight: 17,
    color: '#8A8880',
    fontFamily: 'Inter_400Regular',
    includeFontPadding: false,
    paddingVertical: 12,
  },
});

export default TimelineWithClassDetails;
