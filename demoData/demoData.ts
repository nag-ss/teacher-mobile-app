import moment from 'moment';

/**
 * Temporary home-dashboard demo UI.
 * Flip to `false` (or delete this file + imports) before shipping real data.
 */
export const DEMO_UI = true;

export const FORCE_LIVE_CARD = DEMO_UI;
export const FORCE_ACTION_REQUIRED_UI = DEMO_UI;
export const FORCE_TIMELINE_UI = DEMO_UI;
export const FORCE_NOTIFICATION_UI = DEMO_UI;

/* ─── Live class card ─────────────────────────────────────────────── */

const LIVE_TIME_FMT = 'HH:mm:ss';

/** Fallback live-card payload when FORCE_LIVE_CARD is on and no API live class. */
export const buildDemoLiveClass = () => ({
  class_schedule_id: 'force-live',
  subject_name: 'Mathematics',
  start_time: moment().format(LIVE_TIME_FMT),
  end_time: moment().add(45, 'minutes').format(LIVE_TIME_FMT),
  division_name: '10',
  section_name: 'A',
  class_details: [{ topic: 'Angle Identities' }],
});

/* ─── Needs you / Action required ─────────────────────────────────── */

export type ActionRequiredDemoItem = {
  id: string;
  subject: string;
  body: string;
  meta: string;
  cta: string;
};

export const DEMO_ACTION_REQUIRED_ITEMS: ActionRequiredDemoItem[] = [
  {
    id: '1',
    subject: 'Geometry VII-B',
    body: ' reflection from yesterday',
    meta: 'Mon 1:30 · 3 taps',
    cta: 'Reflect',
  },
  {
    id: '2',
    subject: 'Trigonometry VII-A',
    body: ' tomorrow 9:10 is unprepped',
    meta: 'Plan written · starts on its own',
    cta: 'Prep class',
  },
];

/* ─── Notifications ───────────────────────────────────────────────── */

export type NotificationType = 'reminder' | 'plan_ready' | 'student_alert' | 'meeting';

export type NotificationTextPart = { text: string; bold?: boolean };

export type NotificationStudentDetailStat = {
  label: string;
  value: string;
};

export type NotificationStudentDetail = {
  summary: string;
  lately: NotificationStudentDetailStat[];
};

export type NotificationDemoItem = {
  id: string;
  type: NotificationType;
  parts: NotificationTextPart[];
  meta: string;
  unread?: boolean;
  detail?: NotificationStudentDetail;
};

export const DEMO_NOTIFICATION_TODAY: NotificationDemoItem[] = [
  {
    id: '1',
    type: 'reminder',
    unread: true,
    parts: [
      { text: 'Reminder', bold: true },
      { text: " · Trigonometry VII-A at 9:10 isn't prepped" },
    ],
    meta: '8:40 · 30 min before',
  },
  {
    id: '2',
    type: 'plan_ready',
    unread: true,
    parts: [
      { text: 'Quadratic Equations VIII-A', bold: true },
      { text: ' plan is ready' },
    ],
    meta: '9:58',
  },
  {
    id: '3',
    type: 'student_alert',
    parts: [
      { text: 'Dev Patel', bold: true },
      { text: ' missed his third Notebook Check' },
    ],
    meta: '9:40 · VIII-B · Algebra',
    detail: {
      summary: 'Missed 3 Notebook Checks in a row · Algebra',
      lately: [
        { label: 'Last quiz', value: '2 / 6' },
        { label: 'Understanding', value: '4.6 · down 0.8' },
        { label: 'Notebook Checks', value: '1 of 4 met' },
      ],
    },
  },
  {
    id: '4',
    type: 'meeting',
    parts: [
      { text: 'Dept meeting', bold: true },
      { text: ' moved to 2:30' },
    ],
    meta: '8:30',
  },
];

export const DEMO_NOTIFICATION_YESTERDAY: NotificationDemoItem[] = [
  {
    id: '5',
    type: 'reminder',
    parts: [
      { text: 'Reminder', bold: true },
      { text: " · tomorrow's Trigonometry VII-A isn't prepped" },
    ],
    meta: 'Mon 6:00 pm · the evening before',
  },
];

/* ─── Timeline ────────────────────────────────────────────────────── */

export type DemoClassStatus =
  | 'live'
  | 'reflect'
  | 'unprepped'
  | 'prepped'
  | 'done';

export type TimelineDemoItem = {
  class_schedule_id: string;
  start_time: string;
  end_time: string;
  subject_name: string;
  division_name?: string;
  section_name?: string;
  class_details?: { Topic?: string }[];
  is_reflected?: boolean;
  reflected_at?: string;
  quiz_sent?: boolean;
  quiz_average?: number;
  force_status?: DemoClassStatus;
  type?: string;
};

const withDate = (date: string, items: TimelineDemoItem[]) =>
  items.map((item) => ({ ...item, date }));

/** Today — mixed statuses for UI preview. */
const TODAY_FORCE_ITEMS: TimelineDemoItem[] = [
  {
    class_schedule_id: 'force-9to10',
    start_time: '09:00:00',
    end_time: '10:00:00',
    subject_name: 'Algebra',
    division_name: '8',
    section_name: 'A',
    class_details: [{ Topic: 'Linear equations' }],
    is_reflected: true,
    reflected_at: '09:05:00',
    force_status: 'done',
  },
  {
    class_schedule_id: 'force-11-class',
    start_time: '11:00:00',
    end_time: '11:30:00',
    subject_name: 'Geometry',
    division_name: '7',
    section_name: 'B',
    class_details: [{ Topic: 'Triangles' }],
    quiz_sent: true,
    quiz_average: 64,
    force_status: 'reflect',
  },
  {
    class_schedule_id: 'force-11-break',
    start_time: '11:30:00',
    end_time: '12:00:00',
    subject_name: 'Break',
    type: 'break',
  },
  {
    class_schedule_id: 'force-1-half-a',
    start_time: '13:00:00',
    end_time: '13:30:00',
    subject_name: 'Statistics',
    division_name: '8',
    section_name: 'B',
    class_details: [{ Topic: 'Mean median' }],
    force_status: 'live',
  },
  {
    class_schedule_id: 'force-1-half-b',
    start_time: '13:30:00',
    end_time: '14:00:00',
    subject_name: 'Probability',
    division_name: '8',
    section_name: 'C',
    class_details: [],
    force_status: 'unprepped',
  },
  {
    class_schedule_id: 'force-2to3-break',
    start_time: '14:00:00',
    end_time: '15:00:00',
    subject_name: 'Break',
    type: 'break',
  },
  {
    class_schedule_id: 'force-4to5',
    start_time: '16:00:00',
    end_time: '17:00:00',
    subject_name: 'Chemistry',
    division_name: '9',
    section_name: 'A',
    class_details: [{ Topic: 'Acids and bases' }],
    force_status: 'prepped',
  },
];

/** Yesterday — mostly completed / reflect. */
const YESTERDAY_FORCE_ITEMS: TimelineDemoItem[] = [
  {
    class_schedule_id: 'force-y-8',
    start_time: '08:30:00',
    end_time: '09:30:00',
    subject_name: 'History',
    division_name: '6',
    section_name: 'A',
    class_details: [{ Topic: 'Ancient India' }],
    is_reflected: true,
    reflected_at: '09:40:00',
    force_status: 'done',
  },
  {
    class_schedule_id: 'force-y-10',
    start_time: '10:00:00',
    end_time: '11:00:00',
    subject_name: 'English',
    division_name: '7',
    section_name: 'C',
    class_details: [{ Topic: 'Poetry analysis' }],
    is_reflected: true,
    reflected_at: '11:10:00',
    force_status: 'done',
  },
  {
    class_schedule_id: 'force-y-break',
    start_time: '11:00:00',
    end_time: '11:30:00',
    subject_name: 'Break',
    type: 'break',
  },
  {
    class_schedule_id: 'force-y-12',
    start_time: '12:00:00',
    end_time: '12:30:00',
    subject_name: 'Biology',
    division_name: '9',
    section_name: 'B',
    class_details: [{ Topic: 'Cell structure' }],
    force_status: 'reflect',
  },
  {
    class_schedule_id: 'force-y-15',
    start_time: '15:00:00',
    end_time: '16:00:00',
    subject_name: 'Physics',
    division_name: '10',
    section_name: 'A',
    class_details: [{ Topic: 'Motion graphs' }],
    force_status: 'reflect',
  },
];

/** Tomorrow — upcoming / prep heavy. */
const TOMORROW_FORCE_ITEMS: TimelineDemoItem[] = [
  {
    class_schedule_id: 'force-t-9',
    start_time: '09:00:00',
    end_time: '10:00:00',
    subject_name: 'Trigonometry',
    division_name: '10',
    section_name: 'B',
    class_details: [{ Topic: 'Sine rule' }],
    force_status: 'prepped',
  },
  {
    class_schedule_id: 'force-t-11',
    start_time: '11:00:00',
    end_time: '12:00:00',
    subject_name: 'Geography',
    division_name: '8',
    section_name: 'A',
    class_details: [{ Topic: 'Climate zones' }],
    force_status: 'prepped',
  },
  {
    class_schedule_id: 'force-t-break',
    start_time: '12:00:00',
    end_time: '12:30:00',
    subject_name: 'Break',
    type: 'break',
  },
  {
    class_schedule_id: 'force-t-13',
    start_time: '13:00:00',
    end_time: '13:30:00',
    subject_name: 'Art',
    division_name: '6',
    section_name: 'B',
    class_details: [{ Topic: 'Watercolors' }],
    force_status: 'unprepped',
  },
  {
    class_schedule_id: 'force-t-15',
    start_time: '15:00:00',
    end_time: '16:00:00',
    subject_name: 'Computer Science',
    division_name: '9',
    section_name: 'C',
    class_details: [{ Topic: 'Loops & arrays' }],
    force_status: 'unprepped',
  },
];

const NOV_11_FORCE_ITEMS: TimelineDemoItem[] = [
  {
    class_schedule_id: 'force-1111-9',
    start_time: '09:00:00',
    end_time: '10:00:00',
    subject_name: 'Economics',
    division_name: '11',
    section_name: 'A',
    class_details: [{ Topic: 'Demand curves' }],
    force_status: 'done',
  },
  {
    class_schedule_id: 'force-1111-13',
    start_time: '13:00:00',
    end_time: '14:00:00',
    subject_name: 'Civics',
    division_name: '8',
    section_name: 'B',
    class_details: [{ Topic: 'Local government' }],
    force_status: 'reflect',
  },
];

const NOV_21_FORCE_ITEMS: TimelineDemoItem[] = [
  {
    class_schedule_id: 'force-1121-10',
    start_time: '10:00:00',
    end_time: '11:00:00',
    subject_name: 'Chemistry',
    division_name: '9',
    section_name: 'A',
    class_details: [{ Topic: 'Periodic table' }],
    force_status: 'prepped',
  },
  {
    class_schedule_id: 'force-1121-break',
    start_time: '11:00:00',
    end_time: '11:30:00',
    subject_name: 'Break',
    type: 'break',
  },
  {
    class_schedule_id: 'force-1121-14',
    start_time: '14:00:00',
    end_time: '14:30:00',
    subject_name: 'Music',
    division_name: '7',
    section_name: 'A',
    class_details: [{ Topic: 'Rhythm basics' }],
    force_status: 'unprepped',
  },
  {
    class_schedule_id: 'force-1121-16',
    start_time: '16:00:00',
    end_time: '17:00:00',
    subject_name: 'Math Lab',
    division_name: '10',
    section_name: 'C',
    class_details: [{ Topic: 'Graphing practice' }],
    force_status: 'prepped',
  },
];

const NOV_30_FORCE_ITEMS: TimelineDemoItem[] = [
  {
    class_schedule_id: 'force-1130-8',
    start_time: '08:00:00',
    end_time: '09:00:00',
    subject_name: 'PE',
    division_name: '6',
    section_name: 'A',
    class_details: [{ Topic: 'Team sports' }],
    force_status: 'done',
  },
  {
    class_schedule_id: 'force-1130-11',
    start_time: '11:00:00',
    end_time: '12:00:00',
    subject_name: 'Literature',
    division_name: '9',
    section_name: 'B',
    class_details: [{ Topic: 'Short stories' }],
    force_status: 'live',
  },
  {
    class_schedule_id: 'force-1130-15',
    start_time: '15:00:00',
    end_time: '16:00:00',
    subject_name: 'Algebra II',
    division_name: '10',
    section_name: 'A',
    class_details: [{ Topic: 'Quadratics' }],
    force_status: 'prepped',
  },
];

const hasClassSession = (items: TimelineDemoItem[]) =>
  items.some((item) => item.type !== 'break');

const getForceScheduleByDate = (): Record<string, TimelineDemoItem[]> => {
  const today = moment().format('YYYY-MM-DD');
  const yesterday = moment().subtract(1, 'day').format('YYYY-MM-DD');
  const tomorrow = moment().add(1, 'day').format('YYYY-MM-DD');

  return {
    [yesterday]: YESTERDAY_FORCE_ITEMS,
    [today]: TODAY_FORCE_ITEMS,
    [tomorrow]: TOMORROW_FORCE_ITEMS,
    '2026-11-11': NOV_11_FORCE_ITEMS,
    '2026-11-21': NOV_21_FORCE_ITEMS,
    '2026-11-30': NOV_30_FORCE_ITEMS,
  };
};

/** Only dates that actually have classes (breaks alone don't count). */
export const getForceClassDates = () =>
  Object.entries(getForceScheduleByDate())
    .filter(([, items]) => hasClassSession(items))
    .map(([date]) => date);

/** Demo schedule — `force_status` locks badge so every state is visible. */
export const buildForceTimelineItems = (date: string) => {
  const byDate = getForceScheduleByDate();
  return withDate(date, byDate[date] ?? []);
};
