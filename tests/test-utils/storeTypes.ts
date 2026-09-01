import userReducer from '@/store/authSlice';
import classReducer from '@/store/classSlice';
import liveMonitorReducer from '@/store/liveMonitoringSlice';
import feedbackReducer from '@/store/feedbackSlice';

export type RootState = {
  user: ReturnType<typeof userReducer>;
  classes: ReturnType<typeof classReducer>;
  liveMonitor: ReturnType<typeof liveMonitorReducer>;
  feedback: ReturnType<typeof feedbackReducer>;
};

export type ClassesStateOverrides = Partial<{
  liveClass: Record<string, unknown>;
  quiz_details: Record<string, unknown>;
  topics: Array<{ topic: string; sub_topic: Array<{ id: number; sub_topic: string }> }>;
  classTasks: Array<Record<string, unknown>>;
  classTimeline: Array<Record<string, unknown>>;
  loading: boolean;
  error: null;
  unAuthorised: boolean;
}>;

export type LiveMonitorStateOverrides = Partial<{
  selectedTaskSection: string;
  selectedTask: Record<string, unknown> | null;
  selectedTaskId: string;
  studentsData: Array<Record<string, unknown>>;
  studentsCountData: Array<Record<string, unknown>>;
  loading: boolean;
  error: null;
  classId: number;
  studentPerformance: unknown;
  studentCWPerformance: unknown;
  taskSummary: Record<string, unknown> | null;
}>;

export type PreloadedStateOverrides = {
  user?: Partial<RootState['user']>;
  classes?: ClassesStateOverrides;
  liveMonitor?: LiveMonitorStateOverrides;
  feedback?: Partial<RootState['feedback']>;
};
