import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Pressable } from 'react-native';
import moment from 'moment';
import ClassPrep from './ClassPrep';
import TimelineEventDetailModal, {
  type PopupAnchor,
} from './TimelineEventDetailModal';
import TimelineCalendarPopover, {
  type CalendarAnchor,
} from './TimelineCalendarPopover';
import SvgLoader from '@/utils/SvgLoader';
import {
  useTimeline,
  HOURS,
  DAY_START_HOUR,
  LABEL_PAD_TOP,
  TIME_GUTTER,
  formatHourLabel,
  minutesToY,
  type ClassStatus,
  type TimelineEvent,
} from '@/hooks/useTimeline';
import { getForceClassDates } from '@/demoData/demoData';

/** Tall cards keep 10; short (half-hour) cards use a tighter corner. */
const cardRadius = (height: number) => (height < 40 ? 8 : 10);

const COLOR = {
  ink: '#1F1E1C',
  muted: '#8A8880',
  mutedSoft: '#B0AEA6',
  border: '#ECEAE4',
  borderSoft: '#EDEBE6',
} as const;

/** Shared text tokens — compose with layout-only styles. */
const text = StyleSheet.create({
  title: {
    includeFontPadding: false,
    fontSize: 14,
    lineHeight: 17,
    color: COLOR.ink,
    fontFamily: 'Inter_600SemiBold',
  },
  meta: {
    includeFontPadding: false,
    fontSize: 12,
    lineHeight: 15,
    color: COLOR.muted,
    fontFamily: 'Inter_400Regular',
  },
  section: {
    includeFontPadding: false,
    fontSize: 16,
    lineHeight: 24,
    color: COLOR.ink,
    fontFamily: 'Montserrat_600SemiBold',
  },
  emptyTitle: {
    includeFontPadding: false,
    fontSize: 16,
    lineHeight: 20,
    color: COLOR.ink,
    fontFamily: 'Inter_600SemiBold',
    textAlign: 'center',
  },
});

const STATUS_META: Record<
  Exclude<ClassStatus, 'done'>,
  { label: string; color: string }
> = {
  live: { label: 'Live', color: COLOR.ink },
  reflect: { label: 'Reflect', color: '#D69A1E' },
  unprepped: { label: 'Unprepped', color: '#D69A1E' },
  prepped: { label: 'Prepped', color: '#2F6FED' },
};

const StatusBadge = ({
  status,
  compact,
}: {
  status: Exclude<ClassStatus, 'done'>;
  compact?: boolean;
}) => {
  const meta = STATUS_META[status];
  return (
    <View style={styles.statusRow}>
      <View style={[styles.statusDot, { backgroundColor: meta.color }]} />
      <Text
        style={[
          text.title,
          styles.statusText,
          compact && styles.statusTextShort,
          { color: meta.color },
        ]}
      >
        {meta.label}
      </Text>
    </View>
  );
};

const STRIPE_GAP = 7;

const EventCard = ({
  event,
  onPress,
}: {
  event: TimelineEvent;
  onPress: (event: TimelineEvent, anchor: PopupAnchor) => void;
}) => {
  const cardRef = useRef<View>(null);
  const [width, setWidth] = useState(0);
  const isBreak = event.type === 'break';
  const isLive = event.status === 'live';
  const isDone = event.status === 'done';
  const isShortCard = event.height < 40;
  const showMeta = event.title.trim().length <= 16;
  const stripeCount = isBreak && width > 0 ? Math.ceil(width / STRIPE_GAP) + 6 : 0;

  const handlePress = () => {
    cardRef.current?.measureInWindow((x, y, _w, h) => {
      onPress(event, { x, y, height: h });
    });
  };

  const shellStyle = [
    styles.eventCard,
    {
      top: event.top,
      height: event.height,
      borderRadius: cardRadius(event.height),
    },
    isBreak || !isLive ? styles.cardBorder : styles.classCardLive,
    isBreak && styles.eventCardBreak,
  ];

  const breakBody = (
    <>
      <View style={styles.breakStripes} pointerEvents="none">
        {Array.from({ length: stripeCount }, (_, i) => (
          <View
            key={i}
            style={[styles.breakStripe, { left: i * STRIPE_GAP - 24 }]}
          />
        ))}
      </View>
      <Text style={[text.meta, styles.breakText]}>
        {`Break · ${event.durationLabel ?? ''}`}
      </Text>
    </>
  );

  const classBody = (
    <>
      <View style={styles.classLeft}>
        <Text
          style={[
            text.title,
            styles.classTitle,
            isShortCard && styles.classTitleShort,
            isDone && styles.textDone,
          ]}
          numberOfLines={1}
        >
          {event.title}
        </Text>
        {showMeta ? (
          <Text
            style={[
              text.meta,
              isShortCard && styles.classMetaShort,
              isDone && styles.textMetaDone,
            ]}
            numberOfLines={1}
          >
            {[event.grade, event.timeLabel].filter(Boolean).join(' · ')}
          </Text>
        ) : null}
      </View>
      {isDone ? (
        <SvgLoader svgFilePath="liveCorrect" width={14} height={11} color="#8A8880" />
      ) : event.status && event.status !== 'done' ? (
        <StatusBadge status={event.status} compact={isShortCard} />
      ) : null}
    </>
  );

  if (isBreak) {
    return (
      <View
        style={shellStyle}
        onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
      >
        {breakBody}
      </View>
    );
  }

  return (
    <View ref={cardRef} style={shellStyle} collapsable={false}>
      <TouchableOpacity
        style={styles.eventPressable}
        activeOpacity={0.75}
        onPress={handlePress}
      >
        {classBody}
      </TouchableOpacity>
    </View>
  );
};

const TimelineWithClassDetails = () => {
  const classPrepRef = useRef<any>();
  const dayLabelRef = useRef<View>(null);
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);
  const [popupAnchor, setPopupAnchor] = useState<PopupAnchor | null>(null);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [calendarAnchor, setCalendarAnchor] = useState<CalendarAnchor | null>(
    null
  );
  /** Kept after the detail modal closes so ClassPrep (and its modals) stay mounted. */
  const [prepEvent, setPrepEvent] = useState<TimelineEvent | null>(null);
  const {
    date,
    setDate,
    dayLabel,
    goPrevDay,
    goNextDay,
    goToToday,
    canGoPrevDay,
    canGoNextDay,
    now,
    events,
    nowTop,
    dayHeight,
    gridContentHeight,
    pxPerHour,
    onGridLayout,
  } = useTimeline();

  const openDetail = (event: TimelineEvent, anchor: PopupAnchor) => {
    setSelectedEvent(event);
    setPopupAnchor(anchor);
    if (event.status !== 'done') setPrepEvent(event);
  };

  const closeDetail = () => {
    setSelectedEvent(null);
    setPopupAnchor(null);
  };

  const handleDetailAction = (event: TimelineEvent) => {
    if (event.status === 'done') {
      closeDetail();
      return;
    }
    setPrepEvent(event);
    classPrepRef.current?.setSelectedClass();
    closeDetail();
  };

  const openCalendar = () => {
    dayLabelRef.current?.measureInWindow((x, y, width, height) => {
      setCalendarAnchor({ x, y, width, height });
      setCalendarOpen(true);
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={[text.section, styles.header]} numberOfLines={1}>
          Your day
        </Text>

        <View style={styles.dayPill}>
          <Pressable
            style={({ pressed }) => [
              styles.daySegment,
              canGoPrevDay && pressed && styles.daySegmentPressed,
              !canGoPrevDay && styles.daySegmentDisabled,
            ]}
            onPress={goPrevDay}
            disabled={!canGoPrevDay}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <SvgLoader
              svgFilePath="notificationLeftArrow"
              width={7}
              height={10}
              color="#1F1E1C"
            />
          </Pressable>
          <View style={styles.dayDivider} />
          <View ref={dayLabelRef} collapsable={false}>
            <Pressable style={styles.dayLabelSegment} onPress={openCalendar}>
              <Text style={[text.title, styles.dayLabel]} numberOfLines={1}>
                {dayLabel}
              </Text>
            </Pressable>
          </View>
          <View style={styles.dayDivider} />
          <Pressable
            style={({ pressed }) => [
              styles.daySegment,
              canGoNextDay && pressed && styles.daySegmentPressed,
              !canGoNextDay && styles.daySegmentDisabled,
            ]}
            onPress={goNextDay}
            disabled={!canGoNextDay}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <SvgLoader
              svgFilePath="notificationRightArrow"
              width={7}
              height={10}
              color="#1F1E1C"
            />
          </Pressable>
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
            <Text style={[text.emptyTitle, styles.emptyTitle]} numberOfLines={1}>
              {`No classes ${dayLabel.toLowerCase()}`}
            </Text>
            <Text style={[text.meta, styles.emptySubtitle]}>
              {moment(date).format('dddd')} · enjoy the day off
            </Text>
          </View>
        ) : (
          <View style={[styles.dayGrid, { height: gridContentHeight }]}>
            {HOURS.map((hour) => {
              const top =
                LABEL_PAD_TOP +
                minutesToY((hour - DAY_START_HOUR) * 60, pxPerHour);
              return (
                <View key={hour} style={[styles.hourRow, { top }]}>
                  <Text style={[text.meta, styles.hourLabel]}>
                    {formatHourLabel(hour)}
                  </Text>
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
                <EventCard
                  key={event.id}
                  event={event}
                  onPress={openDetail}
                />
              ))}
            </View>

            {nowTop != null ? (
              <View style={[styles.nowLineWrap, { top: nowTop }]} pointerEvents="none">
                <View style={styles.nowPill}>
                  <Text style={[text.title, styles.nowPillText]}>
                    {now.format('H:mm')}
                  </Text>
                </View>
                <View style={styles.nowLine} />
              </View>
            ) : null}
          </View>
        )}
      </View>

      <TimelineEventDetailModal
        event={selectedEvent}
        dayLabel={dayLabel}
        anchor={popupAnchor}
        onClose={closeDetail}
        onAction={handleDetailAction}
      />

      <TimelineCalendarPopover
        visible={calendarOpen}
        selectedDate={date}
        anchor={calendarAnchor}
        classDates={getForceClassDates()}
        onSelectDate={setDate}
        onClose={() => setCalendarOpen(false)}
        onPressToday={goToToday}
      />

      {prepEvent ? (
        <ClassPrep
          key={prepEvent.id}
          item={prepEvent.raw}
          selectedClass={prepEvent.raw}
          updateTopicSubTopic={() => {}}
          ref={classPrepRef}
        />
      ) : null}
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
    paddingLeft: 4,
    width: '100%',
    height: 42,
    alignSelf: 'stretch',
    flexGrow: 0,
    marginBottom: 12,
  },
  header: {
    height: 24,
    textAlignVertical: 'center',
    flexShrink: 0,
  },
  dayPill: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 42,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: COLOR.borderSoft,
    borderRadius: 12,
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
  daySegmentPressed: {
    backgroundColor: '#F1EFEA',
  },
  daySegmentDisabled: {
    opacity: 0.35,
  },
  dayDivider: {
    width: StyleSheet.hairlineWidth,
    alignSelf: 'stretch',
    backgroundColor: COLOR.borderSoft,
  },
  dayLabelSegment: {
    width: 104,
    height: '100%',
    paddingHorizontal: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayLabel: {
    width: '100%',
    textAlign: 'center',
  },
  gridHost: {
    flex: 1,
    alignSelf: 'stretch',
    width: '100%',
    minHeight: 0,
    /** Allow now-pill to draw fully (wrap uses translateY). */
    overflow: 'visible',
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
    lineHeight: 16,
    textAlign: 'right',
    paddingRight: 8,
  },
  eventsLayer: {
    position: 'absolute',
    left: TIME_GUTTER,
    right: 0,
  },
  cardBorder: {
    borderWidth: 1,
    borderColor: COLOR.border,
  },
  eventCard: {
    position: 'absolute',
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    overflow: 'hidden',
  },
  eventPressable: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    gap: 8,
  },
  eventCardBreak: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  breakStripes: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  breakStripe: {
    position: 'absolute',
    top: -48,
    width: 3.5,
    height: 220,
    backgroundColor: '#E8E6E0',
    transform: [{ rotate: '28deg' }],
  },
  breakText: {
    fontFamily: 'Inter_500Medium',
    textAlign: 'center',
    zIndex: 1,
  },
  classCardLive: {
    borderWidth: 1.5,
    borderColor: COLOR.ink,
  },
  textDone: {
    color: COLOR.muted,
  },
  textMetaDone: {
    color: COLOR.mutedSoft,
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
    flexShrink: 1,
    fontFamily: 'Inter_700Bold',
  },
  classTitleShort: {
    fontSize: 12,
    lineHeight: 15,
  },
  classMetaShort: {
    fontSize: 10,
    lineHeight: 13,
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
  },
  statusTextShort: {
    fontSize: 10,
    lineHeight: 13,
  },
  nowLineWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 5,
    transform: [{ translateY: -10 }, { translateX: -4 }],
  },
  nowPill: {
    backgroundColor: COLOR.ink,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    minWidth: 44,
    alignItems: 'center',
  },
  nowPillText: {
    color: '#FFFFFF',
    fontSize: 11,
    lineHeight: 14,
  },
  nowLine: {
    flex: 1,
    height: 2,
    backgroundColor: COLOR.ink,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingBottom: 40,
  },
  emptyTitle: {
    marginTop: 4,
  },
  emptySubtitle: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
});

export default TimelineWithClassDetails;
