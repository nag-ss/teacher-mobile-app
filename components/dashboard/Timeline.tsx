import React, { useCallback, useMemo, useRef, useState } from 'react';
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

const getTitle = (item: any) => {
  const details = item?.class_details?.[0];
  if (details) {
    const topic = details.topic || details.Topic;
    const subTopic = Array.isArray(details.sub_topic)
      ? details.sub_topic[0]
      : details.Sub_topic?.[0];
    if (topic && subTopic) return `${topic} — ${subTopic}`;
    if (topic) return topic;
    if (subTopic) return subTopic;
  }
  return item?.subject_name || 'Class';
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

const ClassTimelineRow = ({ item, currentDate }: { item: any; currentDate: string }) => {
  const classPrepRef = useRef<any>();
  const isCompleted = item.isClassOver;
  const isLive = item.live;
  const canOpenPrep = !isCompleted;
  const statusLabel = isCompleted ? 'Completed' : isLive ? 'Live now' : 'Prep ready';

  const openClassPrep = () => {
    if (canOpenPrep) {
      classPrepRef.current?.setSelectedClass();
    }
  };

  return (
    <>
      <TouchableOpacity
        style={[styles.row, !isCompleted && styles.rowCard]}
        activeOpacity={canOpenPrep ? 0.7 : 1}
        onPress={openClassPrep}
        disabled={!canOpenPrep}
      >
        <View style={styles.timeBox}>
          <Text style={[styles.time, isCompleted && styles.textMuted]}>
            {item.timeLabel}
          </Text>
          <Text style={[styles.timePeriod, isCompleted && styles.textMuted]}>
            {item.timePeriod}
          </Text>
        </View>

        <View style={styles.classMeta}>
          <View style={styles.subjectBox}>
            <Text style={[styles.title, isCompleted && styles.textMuted]} numberOfLines={1}>
              {item.title}
            </Text>
          </View>
          <View style={styles.gradeBox}>
            <Text style={styles.grade} numberOfLines={1}>
              {item.gradeLabel}
            </Text>
          </View>
        </View>

        <View style={styles.statusBlock}>
          <View style={styles.statusBox}>
            <Text style={[styles.status, isCompleted ? styles.statusCompleted : styles.statusReady]}>
              {statusLabel}
            </Text>
          </View>
          <View style={styles.arrowBox}>
            <View style={styles.arrowVector}>
              <SvgLoader svgFilePath="timelineArrow" width={8} height={14} />
            </View>
          </View>
        </View>
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

const ROW_HEIGHT = 85; // padding 40 + subject/grade meta 45
const ROW_GAP = 16;
const VISIBLE_ROWS = 3;
const LIST_HEIGHT = ROW_HEIGHT * VISIBLE_ROWS + ROW_GAP * (VISIBLE_ROWS - 1) + 32;

const TimelineWithClassDetails = () => {
  const dispatch = useDispatch<any>();
  const { classTimeline } = useSelector((state: any) => state.classes);
  const [date, setDate] = useState(moment(new Date()).format('YYYY-MM-DD'));

  const getDetails = async (currentDate: string) => {
    await dispatch(getScheduleClasses({ date: currentDate }));
  };

  useFocusEffect(
    useCallback(() => {
      const today = moment(new Date()).format('YYYY-MM-DD');
      setDate(today);
      getDetails(today);
    }, [])
  );

  const rows = useMemo(() => {
    if (!classTimeline?.length) return [];

    return classTimeline.map((timeline: any) => {
      const start = moment(timeline.start_time, 'HH:mm:ss');
      const end = moment(timeline.end_time, 'HH:mm:ss');
      const startDateTime = moment(`${timeline.date} ${timeline.start_time}`);
      const endDateTime = moment(`${timeline.date} ${timeline.end_time}`);
      const now = moment();

      return {
        classId: timeline.class_schedule_id,
        time: `${start.format('HH:mm')} - ${end.format('HH:mm')}`,
        timeLabel: start.format('h:mm'),
        timePeriod: start.format('A'),
        startTime: start.format('HH:mm'),
        classLength: moment.duration(end.diff(start)).asMinutes(),
        category: timeline.subject_name,
        title: getTitle(timeline),
        gradeLabel: getGradeLabel(timeline),
        live: now.isSameOrBefore(endDateTime) && now.isSameOrAfter(startDateTime),
        isClassOver: now.isSameOrAfter(endDateTime),
        raw: timeline,
      };
    });
  }, [classTimeline]);

  return (
    <View style={styles.container}>
      <View style={styles.sectionLabelBox}>
        <Text style={styles.header}>TODAY'S CLASSES</Text>
      </View>

      <ScrollView
        style={styles.list}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        {rows.length ? (
          rows.map((item: any) => (
            <ClassTimelineRow key={item.classId} item={item} currentDate={date} />
          ))
        ) : (
          <Text style={styles.emptyText}>No classes scheduled for today.</Text>
        )}
      </ScrollView>
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
  list: {
    width: '100%',
    alignSelf: 'stretch',
    height: LIST_HEIGHT,
    flexGrow: 0,
    flexShrink: 0,
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
  statusCompleted: {
    color: '#8A8880',
    fontFamily: 'Inter_500Medium',
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
  textMuted: {
    color: '#8A8880',
    fontFamily: 'Inter_500Medium',
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
