import axios from 'axios';

export const mockedAxios = axios as jest.MockedFunction<typeof axios>;

export function resetAxiosMock() {
  mockedAxios.mockReset();
}

export function mockAxiosResponse(data: unknown, status = 200) {
  mockedAxios.mockResolvedValueOnce({ data, status, statusText: 'OK', headers: {}, config: {} as any });
}

export function mockAxiosError(message: string, status = 400) {
  mockedAxios.mockRejectedValueOnce({
    response: { status, data: { message } },
    request: {},
    message,
    config: {},
    isAxiosError: true,
  });
}

/** Default API responses when ClassPrep opens (getTeacherClassTasks + getClassTopicSubTopics). */
export function mockClassPrepOpenApis(
  tasks: unknown[] = [],
  topics: unknown[] = [{ topic: 'Ratios', sub_topic: [{ id: 99, sub_topic: 'Basics' }] }]
) {
  mockAxiosResponse(tasks);
  mockAxiosResponse(topics);
}

/** Default API responses after saving a task (addTaskToClass + refresh tasks). */
export function mockClassPrepSaveApis(tasks: unknown[]) {
  mockAxiosResponse({});
  mockAxiosResponse(tasks);
}

/** Slip test generation: create quiz, poll status, fetch quiz, refresh tasks. */
export function mockSlipTestGenerationApis(quizDetails: unknown) {
  mockAxiosResponse({ quiz_id: 10, task_id: 99 });
  mockAxiosResponse({ status: 'completed' });
  mockAxiosResponse(quizDetails);
  mockAxiosResponse([]);
}

export function mockSlipTestSaveApis(tasks: unknown[]) {
  mockAxiosResponse({});
  mockAxiosResponse(tasks);
}

export function mockSlipTestCancelApis() {
  mockAxiosResponse({});
  mockAxiosResponse([]);
}
