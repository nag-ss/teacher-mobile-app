import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import moment from 'moment';
import ClassPrep from './ClassPrep';
import SvgLoader from '@/utils/SvgLoader';
import {
  useTimeline,
  HOURS,
  DAY_START_HOUR,
  LABEL_PAD_TOP,
  TIME_GUTTER,
  formatHourLabel,
  type ClassStatus,
  type TimelineEvent,
} from '@/hooks/useTimeline';

const STATUS_LABEL: Record<Exclude<ClassStatus, 'done'>, string> = {
  live: 'Live',
  reflect: 'Reflect',
  unprepped: 'Unprepped',
  prepped: 'Prepped',
};

const STATUS_DOT: Record<Exclude<ClassStatus, 'done'>, any> = {
  live: { backgroundColor: '#1F1E1C' },
  reflect: { backgroundColor: '#D69A1E' },
  unprepped: { backgroundColor: '#D69A1E' },
  prepped: { backgroundColor: '#2F6FED' },
};

const STATUS_TEXT: Record<Exclude<ClassStatus, 'done'>, any> = {
  live: { color: '#1F1E1C' },
  reflect: { color: '#D69A1E' },
  unprepped: { color: '#D69A1E' },
  prepped: { color: '#2F6FED' },
};

const StatusBadge = ({ status }: { status: Exclude<ClassStatus, 'done'> }) => (
  <View style={styles.statusRow}>
    <View style={[styles.statusDot, STATUS_DOT[status]]} />
    <Text style={[styles.statusText, STATUS_TEXT[status]]}>{STATUS_LABEL[status]}</Text>
  </View>
);

const BreakCard = ({ event }: { event: TimelineEvent }) => {
  const [size, setSize] = useState({ width: 0, height: 0 });
  const stripeCount =
    size.width > 0 ? Math.ceil((size.width + size.height * 2) / 7) + 4 : 0;

  return (
    <View
      style={[
        styles.breakCard,
        event.isCompact && styles.cardCompact,
        { top: event.top, height: event.height },
      ]}
      onLayout={(e) => {
        const { width, height } = e.nativeEvent.layout;
        if (width !== size.width || height !== size.height) {
          setSize({ width, height });
        }
      }}
    >
      <View style={styles.breakStripes} pointerEvents="none">
        {Array.from({ length: stripeCount }).map((_, i) => (
          <View
            key={i}
            style={[
              styles.breakStripe,
              {
                left: i * 7 - size.height,
                height: size.height * 3,
                top: -size.height,
              },
            ]}
          />
        ))}
      </View>
      <Text style={styles.breakText}>{`Break · ${event.durationLabel}`}</Text>
    </View>
  );
};

const ClassCard = ({
  event,
  date,
}: {
  event: TimelineEvent;
  date: string;
}) => {
  const classPrepRef = useRef<any>();
  const canPrep = !moment(date).isBefore(moment(), 'day');
  const isLive = event.status === 'live';
  const isDone = event.status === 'done';
  const isNextPrepped = event.status === 'prepped' && event.isNext;
  const showMeta = event.title.trim().length <= 16;

  if (event.type === 'break') {
    return <BreakCard event={event} />;
  }

  return (
    <>
      <TouchableOpacity
        style={[
          styles.classCard,
          event.isCompact && styles.cardCompact,
          { top: event.top, height: event.height },
          isDone
            ? styles.classCardDone
            : isLive
              ? styles.classCardLive
              : styles.classCardDefault,
          isNextPrepped && styles.classCardNext,
        ]}
        activeOpacity={0.75}
        onPress={() => {
          if (canPrep && !isDone) classPrepRef.current?.setSelectedClass();
        }}
      >
        {isNextPrepped ? <View style={styles.nextStrip} /> : null}
        <View style={styles.classLeft}>
          <Text
            style={[styles.classTitle, isDone && styles.classTitleDone]}
            numberOfLines={1}
          >
            {event.title}
          </Text>
          {showMeta ? (
            <Text
              style={[styles.classMeta, isDone && styles.classMetaDone]}
              numberOfLines={1}
            >
              {[event.grade, event.timeLabel].filter(Boolean).join(' · ')}
            </Text>
          ) : null}
          {isNextPrepped ? <Text style={styles.nextTag}>Next</Text> : null}
        </View>
        {isDone ? (
          <SvgLoader svgFilePath="liveCorrect" width={14} height={11} color="#8A8880" />
        ) : event.status && event.status !== 'done' ? (
          <StatusBadge status={event.status} />
        ) : null}
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
  const {
    dayIndex,
    setDayIndex,
    date,
    dayLabel,
    now,
    events,
    nowTop,
    dayHeight,
    gridContentHeight,
    pxPerHour,
    onGridLayout,
  } = useTimeline();

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
          <View style={[styles.dayGrid, { height: gridContentHeight }]}>
            {HOURS.map((hour) => {
              const top = LABEL_PAD_TOP + (hour - DAY_START_HOUR) * pxPerHour;
              return (
                <View key={hour} style={[styles.hourRow, { top }]}>
                  <Text style={styles.hourLabel}>{formatHourLabel(hour)}</Text>
                </View>
              );
            })}

            <View
              style={[
                styles.eventsLayer,
                { top: LABEL_PAD_TOP, height: dayHeight },
              ]}
            >
              {events.map((event) => (
                <ClassCard key={event.id} event={event} date={date} />
              ))}
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
    height: 24,
    fontSize: 16,
    lineHeight: 24,
    color: '#1F1E1C',
    fontFamily: 'Montserrat_600SemiBold',
    fontStyle: 'normal',
    includeFontPadding: false,
    textAlignVertical: 'center',
    flexGrow: 0,
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
    overflow: 'hidden',
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
    alignItems: 'center',
    height: 16,
    marginTop: -8,
  },
  hourLabel: {
    width: TIME_GUTTER - 8,
    fontSize: 12,
    lineHeight: 16,
    color: '#8A8880',
    fontFamily: 'Inter_400Regular',
    includeFontPadding: false,
    textAlign: 'right',
    paddingRight: 8,
  },
  eventsLayer: {
    position: 'absolute',
    left: TIME_GUTTER,
    right: 0,
  },
  breakCard: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    gap: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ECEAE4',
    overflow: 'hidden',
  },
  breakStripes: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  breakStripe: {
    position: 'absolute',
    width: 3.5,
    backgroundColor: '#E8E6E0',
    transform: [{ rotate: '28deg' }],
  },
  breakText: {
    fontSize: 12,
    lineHeight: 15,
    color: '#8A8880',
    fontFamily: 'Inter_500Medium',
    includeFontPadding: false,
    zIndex: 1,
  },
  classCard: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    gap: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    overflow: 'hidden',
  },
  cardCompact: {
    borderRadius: 8,
  },
  classCardLive: {
    borderWidth: 1.5,
    borderColor: '#1F1E1C',
  },
  classCardDefault: {
    borderWidth: 1,
    borderColor: '#ECEAE4',
  },
  classCardDone: {
    borderWidth: 1,
    borderColor: '#ECEAE4',
  },
  classCardNext: {
    paddingLeft: 16,
  },
  classTitleDone: {
    color: '#8A8880',
  },
  classMetaDone: {
    color: '#B0AEA6',
  },
  nextStrip: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: '#1F1E1C',
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
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
  classMeta: {
    fontSize: 12,
    lineHeight: 15,
    color: '#8A8880',
    fontFamily: 'Inter_400Regular',
    includeFontPadding: false,
  },
  nextTag: {
    fontSize: 12,
    lineHeight: 15,
    color: '#1F1E1C',
    fontFamily: 'Inter_400Regular',
    includeFontPadding: false,
    marginLeft: 'auto',
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
    fontFamily: 'Inter_600SemiBold',
    includeFontPadding: false,
  },
  nowLineWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 5,
    transform: [{ translateY: -10 }],
  },
  nowPill: {
    backgroundColor: '#1F1E1C',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginRight: 0,
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
