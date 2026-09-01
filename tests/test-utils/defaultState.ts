import type { ClassesStateOverrides, LiveMonitorStateOverrides, PreloadedStateOverrides, RootState } from './storeTypes';

export type { ClassesStateOverrides, LiveMonitorStateOverrides, PreloadedStateOverrides, RootState };

const baseAuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null as string | null,
  mobileNumber: null,
  userToken: null,
  todayLoginData: null,
  notiCount: 0,
  notifications: null,
};

const baseClassesState = {
  liveClass: {} as Record<string, unknown>,
  quiz_details: {} as Record<string, unknown>,
  topics: [] as Array<{ topic: string; sub_topic: Array<{ id: number; sub_topic: string }> }>,
  classTasks: [] as Array<Record<string, unknown>>,
  classTimeline: [] as Array<Record<string, unknown>>,
  loading: false,
  error: null,
  unAuthorised: false,
};

const baseLiveMonitorState = {
  selectedTaskSection: '',
  selectedTask: null,
  selectedTaskId: '',
  studentsData: [] as unknown[],
  studentsCountData: [] as unknown[],
  loading: false,
  error: null,
  classId: 0,
  studentPerformance: null,
  studentCWPerformance: null,
  taskSummary: null,
};

export function createPreloadedState(overrides: PreloadedStateOverrides = {}): Partial<RootState> {
  return {
    user: { ...baseAuthState, ...overrides.user },
    classes: { ...baseClassesState, ...overrides.classes },
    liveMonitor: { ...baseLiveMonitorState, ...overrides.liveMonitor },
    feedback: { loading: false, error: null, ...overrides.feedback },
  } as Partial<RootState>;
}

export function createClassPrepState(
  overrides: ClassesStateOverrides = {},
  userId = 44
): PreloadedStateOverrides {
  return {
    user: { user: { id: userId } as never },
    classes: {
      topics: [{ topic: 'Ratios', sub_topic: [{ id: 99, sub_topic: 'Basics' }] }],
      quiz_details: { questions: [], title: '' },
      ...overrides,
    },
  };
}
