import React, { useEffect, useState } from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import moment from 'moment';
import SvgLoader from '@/utils/SvgLoader';

/** Keep library locale; only shorten weekday labels to M/T/W… */
const calendarLocale =
  LocaleConfig.locales[LocaleConfig.defaultLocale] || LocaleConfig.locales.en;
if (calendarLocale) {
  calendarLocale.dayNamesShort = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
}

const COLOR = {
  ink: '#1F1E1C',
  mute: '#8A8880',
  hair: '#ECEAE4',
  soft: '#F1EFEA',
  dot: '#C8C6BE',
} as const;

const CARD_WIDTH = 320;
const CARD_HEIGHT_EST = 330;
const SCREEN_PAD = 12;
const POPUP_GAP = 8;
const POPUP_RIGHT_NUDGE = 40;
const DAY_SIZE = 36;

export type CalendarAnchor = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type CalendarDay = {
  dateString: string;
  month: number;
  year: number;
};

type Props = {
  visible: boolean;
  selectedDate: string;
  anchor: CalendarAnchor | null;
  onSelectDate: (date: string) => void;
  onClose: () => void;
  onPressToday: () => void;
};

const circleStyle = (filled: boolean) => ({
  width: DAY_SIZE,
  height: DAY_SIZE,
  borderRadius: DAY_SIZE / 2,
  alignItems: 'center' as const,
  justifyContent: 'center' as const,
  ...(filled
    ? { backgroundColor: COLOR.ink }
    : {
        backgroundColor: 'transparent',
        borderWidth: 1.5,
        borderColor: COLOR.ink,
      }),
});

const TimelineCalendarPopover = ({
  visible,
  selectedDate,
  anchor,
  onSelectDate,
  onClose,
  onPressToday,
}: Props) => {
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const [visibleMonth, setVisibleMonth] = useState(
    () => moment(selectedDate).format('YYYY-MM-DD')
  );

  useEffect(() => {
    if (!visible) return;
    setVisibleMonth(moment(selectedDate).format('YYYY-MM-DD'));
  }, [visible, selectedDate]);

  const today = moment().format('YYYY-MM-DD');
  const markedDates: Record<string, any> = {};

  if (today !== selectedDate) {
    markedDates[today] = {
      customStyles: {
        container: circleStyle(false),
        text: { color: COLOR.ink, fontFamily: 'Inter_600SemiBold' },
      },
    };
  }

  markedDates[selectedDate] = {
    customStyles: {
      container: circleStyle(true),
      text: { color: '#FFFFFF', fontFamily: 'Inter_600SemiBold' },
    },
  };

  if (!visible || !anchor) return null;

  const preferredTop = anchor.y + anchor.height + POPUP_GAP;
  const top =
    preferredTop + CARD_HEIGHT_EST > windowHeight - SCREEN_PAD
      ? Math.max(SCREEN_PAD, anchor.y - CARD_HEIGHT_EST - POPUP_GAP)
      : preferredTop;

  let left = anchor.x + anchor.width - CARD_WIDTH + POPUP_RIGHT_NUDGE;
  if (left < SCREEN_PAD) left = SCREEN_PAD;
  if (left + CARD_WIDTH > windowWidth - SCREEN_PAD) {
    left = windowWidth - SCREEN_PAD - CARD_WIDTH;
  }

  return (
    <Modal visible transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <View style={[styles.card, { top, left }]}>
          <Calendar
            key={visible ? `open-${selectedDate}` : 'closed'}
            current={visibleMonth}
            firstDay={1}
            markingType="custom"
            markedDates={markedDates}
            onDayPress={(day: CalendarDay) => {
              onSelectDate(day.dateString);
              onClose();
            }}
            onMonthChange={(month: CalendarDay) => {
              setVisibleMonth(
                `${month.year}-${String(month.month).padStart(2, '0')}-01`
              );
            }}
            renderArrow={(direction: 'left' | 'right') => (
              <View style={styles.arrowBtn}>
                <SvgLoader
                  svgFilePath={
                    direction === 'left'
                      ? 'notificationLeftArrow'
                      : 'notificationRightArrow'
                  }
                  width={7}
                  height={10}
                />
              </View>
            )}
            theme={{
              calendarBackground: '#FFFFFF',
              textSectionTitleColor: COLOR.mute,
              dayTextColor: COLOR.ink,
              todayTextColor: COLOR.ink,
              monthTextColor: COLOR.ink,
              textDisabledColor: '#C8C6BE',
              textDayFontFamily: 'Inter_500Medium',
              textMonthFontFamily: 'Inter_600SemiBold',
              textDayHeaderFontFamily: 'Inter_500Medium',
              textDayFontSize: 14,
              textMonthFontSize: 16,
              textDayHeaderFontSize: 12,
              textDayStyle: { marginTop: 0, textAlign: 'center' },
              'stylesheet.calendar.header': {
                header: {
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingLeft: 4,
                  paddingRight: 4,
                  marginTop: 2,
                  marginBottom: 2,
                },
                week: {
                  marginTop: 4,
                  flexDirection: 'row',
                  justifyContent: 'space-around',
                },
                dayHeader: {
                  flex: 1,
                  textAlign: 'center',
                  marginTop: 2,
                  marginBottom: 4,
                  fontSize: 12,
                  fontFamily: 'Inter_500Medium',
                  color: COLOR.mute,
                },
              },
              'stylesheet.day.basic': {
                base: {
                  width: DAY_SIZE,
                  height: DAY_SIZE,
                  alignItems: 'center',
                  justifyContent: 'center',
                },
              },
              'stylesheet.calendar.main': {
                dayContainer: {
                  flex: 1,
                  alignItems: 'center',
                },
                week: {
                  marginTop: 2,
                  marginBottom: 2,
                  flexDirection: 'row',
                  justifyContent: 'space-around',
                },
              },
            }}
          />

          <View style={styles.footer}>
            <View style={styles.legend}>
              <View style={styles.legendDot} />
              <Text style={styles.legendText}>days with your classes</Text>
            </View>
            <TouchableOpacity
              style={styles.todayBtn}
              activeOpacity={0.75}
              onPress={() => {
                onPressToday();
                setVisibleMonth(moment().format('YYYY-MM-DD'));
                onClose();
              }}
            >
              <Text style={styles.todayText}>Today</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(26, 26, 26, 0.18)',
  },
  card: {
    position: 'absolute',
    width: CARD_WIDTH,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLOR.hair,
    paddingTop: 4,
    paddingBottom: 10,
    paddingHorizontal: 12,
    shadowColor: '#1F1E1C',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.16,
    shadowRadius: 40,
    elevation: 16,
  },
  arrowBtn: {
    width: 28,
    height: 28,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLOR.hair,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 10,
    paddingHorizontal: 6,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: COLOR.hair,
  },
  legend: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexShrink: 1,
  },
  legendDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLOR.dot,
  },
  legendText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    lineHeight: 16,
    color: COLOR.mute,
    includeFontPadding: false,
  },
  todayBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 52,
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: COLOR.soft,
    borderRadius: 8,
  },
  todayText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
    lineHeight: 16,
    color: COLOR.ink,
    includeFontPadding: false,
  },
});

export default TimelineCalendarPopover;
