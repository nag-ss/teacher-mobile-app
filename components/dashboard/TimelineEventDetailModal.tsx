import React from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import moment from 'moment';
import SvgLoader from '@/utils/SvgLoader';
import { TIME_GUTTER, type ClassStatus, type TimelineEvent } from '@/hooks/useTimeline';

const COLOR = {
  ink: '#1F1E1C',
  muted: '#8A8880',
  border: '#ECEAE4',
  reflect: '#9B7625',
  done: '#1E4FA6',
} as const;

const CARD_WIDTH = 376;
const CARD_HEIGHT = 300;
/** No CTA button when reflection is already done. */
const CARD_HEIGHT_DONE = 236;
const POPUP_GAP = 8;
const SCREEN_PAD = 12;
/** Shift popup left over the time gutter + timeline card inset. */
const POPUP_LEFT_OFFSET = TIME_GUTTER + 58;

export type PopupAnchor = {
  x: number;
  y: number;
  height: number;
};

type Props = {
  event: TimelineEvent | null;
  dayLabel: string;
  anchor: PopupAnchor | null;
  onClose: () => void;
  onAction: (event: TimelineEvent) => void;
};

const parseTime = (raw?: string) => {
  const cleaned = String(raw || '').split('.')[0];
  const parsed = moment(cleaned, ['HH:mm:ss', 'HH:mm', 'h:mm A'], true);
  return parsed.isValid() ? parsed : null;
};

const getTopic = (raw: any) =>
  String(
    raw?.class_details?.[0]?.Topic ||
      raw?.class_details?.[0]?.topic ||
      raw?.topic ||
      ''
  ).trim();

const getQuizLabel = (raw: any) => {
  if (raw?.quiz_label) return String(raw.quiz_label);
  const sent = raw?.quiz_sent === true || raw?.is_quiz_sent === true;
  const avg = raw?.quiz_average ?? raw?.quiz_avg;
  if (sent && avg != null) return `sent · ${avg}% average`;
  if (sent) return 'sent';
  if (raw?.quiz_sent === false) return 'not sent';
  return '—';
};

const STATUS_FOOTER: Record<
  ClassStatus,
  { text: (grade: string) => string; color: string }
> = {
  reflect: {
    text: (grade) =>
      grade
        ? `Reflection open until the next ${grade} class`
        : 'Reflection open until the next class',
    color: COLOR.reflect,
  },
  unprepped: {
    text: () => 'Class still needs prep',
    color: COLOR.reflect,
  },
  prepped: {
    text: () => 'Prep ready for this class',
    color: '#2F6FED',
  },
  live: {
    text: () => 'Class is live now',
    color: COLOR.ink,
  },
  done: {
    text: () => 'Reflected',
    color: COLOR.done,
  },
};

const ACTION_LABEL: Partial<Record<ClassStatus, string>> = {
  reflect: 'Reflect',
  unprepped: 'Prep class',
  prepped: 'View prep',
  live: 'Open class',
};

const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <View style={[styles.row, styles.rowBorder]}>
    <Text style={styles.rowLabel}>{label}</Text>
    <Text style={styles.rowValue} numberOfLines={2}>
      {value}
    </Text>
  </View>
);

const TimelineEventDetailModal = ({
  event,
  dayLabel,
  anchor,
  onClose,
  onAction,
}: Props) => {
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();

  if (!event || !anchor) return null;

  const start = parseTime(event.raw?.start_time);
  const end = parseTime(event.raw?.end_time);
  const timeRange =
    start && end
      ? `${start.format('H:mm')} – ${end.format('H:mm')}`
      : event.timeLabel;
  const topic = getTopic(event.raw) || '—';
  const quiz = getQuizLabel(event.raw);
  const footer = event.status ? STATUS_FOOTER[event.status] : null;
  const actionLabel = event.status ? ACTION_LABEL[event.status] : undefined;
  const title = [event.title, event.grade].filter(Boolean).join(' · ');
  const isDone = event.status === 'done';
  const reflectedAt =
    parseTime(event.raw?.reflected_at) ||
    parseTime(event.raw?.reflection_time) ||
    end;
  const footerText = isDone
    ? reflectedAt
      ? `Reflected at ${reflectedAt.format('H:mm')}`
      : 'Reflected'
    : footer
      ? footer.text(event.grade)
      : null;
  const footerColor = isDone ? COLOR.done : footer?.color ?? COLOR.muted;
  const cardHeight = isDone ? CARD_HEIGHT_DONE : CARD_HEIGHT;

  const belowTop = anchor.y + anchor.height + POPUP_GAP;
  const aboveTop = anchor.y - cardHeight - POPUP_GAP;
  const fitsBelow = belowTop + cardHeight <= windowHeight - SCREEN_PAD;
  const top = fitsBelow ? belowTop : Math.max(SCREEN_PAD, aboveTop);

  let left = anchor.x - POPUP_LEFT_OFFSET;
  if (left + CARD_WIDTH > windowWidth - SCREEN_PAD) {
    left = windowWidth - SCREEN_PAD - CARD_WIDTH;
  }
  left = Math.max(SCREEN_PAD, left);

  return (
    <Modal
      visible
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <View style={[styles.card, { top, left, height: cardHeight }]}>
          <View style={styles.header}>
            <View style={styles.titleRow}>
              <SvgLoader svgFilePath="timelinePopup" width={16} height={16} />
              <Text style={styles.title} numberOfLines={1}>
                {title}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={onClose}
              hitSlop={8}
              activeOpacity={0.7}
            >
              <SvgLoader svgFilePath="timelinePopupClose" width={12} height={12} />
            </TouchableOpacity>
          </View>

          <View style={styles.rows}>
            <DetailRow
              label="When"
              value={`${timeRange} · ${dayLabel.toLowerCase()}`}
            />
            <DetailRow label="Topic" value={topic} />
            <DetailRow label="Quiz" value={quiz} />
          </View>

          {footerText ? (
            <View style={styles.statusRow}>
              {isDone ? (
                <View style={styles.statusIcon}>
                  <SvgLoader
                    svgFilePath="liveCorrect"
                    width={12}
                    height={10}
                    color={COLOR.done}
                  />
                </View>
              ) : (
                <View style={[styles.statusDot, { backgroundColor: footerColor }]} />
              )}
              <Text
                style={[styles.statusText, { color: footerColor }]}
                numberOfLines={2}
              >
                {footerText}
              </Text>
            </View>
          ) : null}

          {actionLabel ? (
            <View style={styles.actionRow}>
              <TouchableOpacity
                style={styles.actionBtn}
                activeOpacity={0.8}
                onPress={() => onAction(event)}
              >
                <Text style={styles.actionText}>{actionLabel}</Text>
              </TouchableOpacity>
            </View>
          ) : null}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(26, 26, 26, 0.2)',
  },
  card: {
    position: 'absolute',
    flexDirection: 'column',
    alignItems: 'flex-start',
    width: CARD_WIDTH,
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#ECEAE4',
    borderRadius: 16,
    shadowColor: '#1F1E1C',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.16,
    shadowRadius: 40,
    elevation: 16,
  },
  header: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 8,
  },
  titleRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    minWidth: 0,
    height: 24,
  },
  title: {
    flexShrink: 1,
    height: 24,
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    lineHeight: 24,
    color: '#1F1E1C',
    includeFontPadding: false,
  },
  closeBtn: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rows: {
    alignSelf: 'stretch',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
    paddingVertical: 11,
  },
  rowBorder: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: COLOR.border,
  },
  rowLabel: {
    height: 20,
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    lineHeight: 20,
    color: '#8A8880',
    includeFontPadding: false,
  },
  rowValue: {
    flex: 1,
    height: 20,
    textAlign: 'right',
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    lineHeight: 20,
    color: '#1F1E1C',
    includeFontPadding: false,
  },
  statusRow: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    gap: 6,
  },
  statusIcon: {
    width: 12,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    flexShrink: 0,
  },
  statusText: {
    flex: 1,
    flexShrink: 1,
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
    lineHeight: 16,
    includeFontPadding: false,
  },
  actionRow: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    height: 64,
    paddingTop: 24,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 82,
    height: 40,
    paddingHorizontal: 16,
    backgroundColor: '#1F1E1C',
    borderWidth: 1,
    borderColor: '#1F1E1C',
    borderRadius: 10,
  },
  actionText: {
    height: 17,
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    lineHeight: 17,
    color: '#FFFFFF',
    includeFontPadding: false,
  },
});

export default TimelineEventDetailModal;
