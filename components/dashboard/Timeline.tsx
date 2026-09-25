import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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

const hasTopicSet = (item: any) => {
  const details = item?.class_details?.[0];
  const topic = details?.topic || details?.Topic;
  return Boolean(topic?.toString?.().trim?.());
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
  isFutureDay,
}: {
  item: any;
  currentDate: string;
  isPastDay?: boolean;
  isFutureDay?: boolean;
}) => {
  const classPrepRef = useRef<any>();
  const isCompleted = item.isClassOver;
  const isLive = item.live;
  const awaitingAdmin = Boolean(isFutureDay && item.awaitingAdmin);
  const canOpenPrep = !isCompleted && !awaitingAdmin;
  const statusLabel = isCompleted
    ? 'Completed'
    : isLive
      ? 'Live now'
      : awaitingAdmin
        ? 'Awaiting admin'
        : 'Prep ready';
  const showPastSummary = Boolean(isPastDay);

  const openClassPrep = () => {
    if (canOpenPrep) {
      classPrepRef.current?.setSelectedClass();
    }
  };

  const onPress = () => {
    if (showPastSummary) {
      // Summary navigation can be wired later; keep row tappable.
      return;
    }
    openClassPrep();
  };

  return (
    <>
      <TouchableOpacity
        style={[styles.row, (!isCompleted || showPastSummary || isFutureDay) && styles.rowCard]}
        activeOpacity={0.7}
        onPress={onPress}
        disabled={(isCompleted && !showPastSummary) || awaitingAdmin}
      >
        <View style={styles.timeBox}>
          <Text
            style={[
              styles.time,
              isCompleted && !showPastSummary && styles.textMuted,
            ]}
          >
            {item.timeLabel}
          </Text>
          <Text
            style={[
              styles.timePeriod,
              isCompleted && !showPastSummary && styles.textMuted,
            ]}
          >
            {item.timePeriod}
          </Text>
        </View>

        <View style={styles.classMeta}>
          <View style={styles.subjectBox}>
            <Text
              style={[
                styles.title,
                (isCompleted && !showPastSummary) || awaitingAdmin
                  ? styles.textMuted
                  : null,
              ]}
              numberOfLines={1}
            >
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
              <Text
                style={[
                  styles.status,
                  isCompleted || awaitingAdmin
                    ? styles.statusCompleted
                    : styles.statusReady,
                ]}
              >
                {statusLabel}
              </Text>
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

const ROW_HEIGHT = 85; // padding 40 + subject/grade meta 45
const ROW_GAP = 16;
const VISIBLE_ROWS = 3;
const LIST_HEIGHT = ROW_HEIGHT * VISIBLE_ROWS + ROW_GAP * (VISIBLE_ROWS - 1) + 32;

const TimelineWithClassDetails = ({ selectedDate }: { selectedDate?: string }) => {
  const dispatch = useDispatch<any>();
  const classTimeline = useSelector((state: any) => state.classes.classTimeline);
  const date = selectedDate || moment().format('YYYY-MM-DD');
  const [contentHeight, setContentHeight] = useState(1);
  const [layoutHeight, setLayoutHeight] = useState(LIST_HEIGHT);
  const [scrollY, setScrollY] = useState(0);

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

  const today = moment().format('YYYY-MM-DD');
  const isPastDay = moment(date).isBefore(today, 'day');
  const isFutureDay = moment(date).isAfter(today, 'day');

  const rows = useMemo(() => {
    const list = (classTimeline || []).filter(
      (t: any) => !t.date || t.date === date
    );
    if (!list.length) return [];

    const now = moment();
    const normalizeStart = (t: any) => String(t.start_time || '').split('.')[0];

    return [...list]
      .sort((a, b) => normalizeStart(a).localeCompare(normalizeStart(b)))
      .map((timeline: any) => {
      const startRaw = String(timeline.start_time).split('.')[0];
      const endRaw = String(timeline.end_time).split('.')[0];
      const start = moment(startRaw, 'HH:mm:ss');
      const end = moment(endRaw, 'HH:mm:ss');
      const classDate = timeline.date || date;
      const startDateTime = moment(`${classDate} ${startRaw}`, 'YYYY-MM-DD HH:mm:ss');
      const endDateTime = moment(`${classDate} ${endRaw}`, 'YYYY-MM-DD HH:mm:ss');
      const topicSet = hasTopicSet(timeline);

      const live =
        !isPastDay &&
        !isFutureDay &&
        now.isSameOrBefore(endDateTime) &&
        now.isSameOrAfter(startDateTime);
      const isClassOver = isPastDay || (!isFutureDay && now.isSameOrAfter(endDateTime));

      return {
        classId: timeline.class_schedule_id,
        time: `${start.format('HH:mm')} - ${end.format('HH:mm')}`,
        timeLabel: start.format('h:mm'),
        timePeriod: start.format('A'),
        startTime: start.format('HH:mm'),
        classLength: moment.duration(end.diff(start)).asMinutes(),
        category: timeline.subject_name,
        title: isFutureDay && !topicSet ? 'Topic to be set' : getTitle(timeline),
        gradeLabel: getGradeLabel(timeline),
        live,
        isClassOver,
        awaitingAdmin: isFutureDay && !topicSet,
        raw: timeline,
      };
    });
  }, [classTimeline, date, isPastDay, isFutureDay, today]);

  const canScroll = contentHeight > layoutHeight + 1;
  const thumbHeight = 24;
  const maxScroll = Math.max(1, contentHeight - layoutHeight);
  const thumbOffset = canScroll
    ? (scrollY / maxScroll) * (layoutHeight - thumbHeight)
    : 0;

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
          onScroll={(e) => setScrollY(e.nativeEvent.contentOffset.y)}
          onContentSizeChange={(_w, h) => setContentHeight(h)}
          onLayout={(e) => setLayoutHeight(e.nativeEvent.layout.height)}
        >
          {rows.length ? (
            rows.map((item: any) => (
              <ClassTimelineRow
                key={item.classId}
                item={item}
                currentDate={date}
                isPastDay={isPastDay}
                isFutureDay={isFutureDay}
              />
            ))
          ) : (
            <Text style={styles.emptyText}>No classes scheduled for this day.</Text>
          )}
        </ScrollView>

        <View style={styles.scrollTrack}>
          <View
            style={[
              styles.scrollThumb,
              {
                height: thumbHeight,
                transform: [{ translateY: thumbOffset }],
                opacity: canScroll ? 1 : 0.35,
              },
            ]}
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
