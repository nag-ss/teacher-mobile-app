type ClassTaskModalOptions = {
  cardLabel?: string;
  secondaryAction?: { label: string; onPress: 'goBack' | 'onClose' };
};

type SummaryModalOptions = {
  topic?: string;
  subTopic?: { id: number; sub_topic: string };
  showTopicPickerLabels?: boolean;
};

type TaskModalOptions = {
  createLabel?: string;
  showCancel?: boolean;
};

type AICheckSavePayload = {
  title: string;
  checkType: string;
  selectedId: string;
  textInput: string;
};

type SlipTestSettingsOptions = {
  title?: string;
};

const DEFAULT_AI_CHECK_SAVE: AICheckSavePayload = {
  title: 'Saved AI Task',
  checkType: 'Custom (Manual Input)',
  selectedId: 'approx',
  textInput: 'x=1',
};

const DEFAULT_SLIP_TEST_SETTINGS = {
  duration: 10,
  marks: 10,
  difficulty: 5,
  mcqCount: 3,
  subCount: 2,
  totalQuestions: 5,
  title: 'Slip Test Ratios',
};

export function createSummaryModalMock(options: SummaryModalOptions = {}) {
  const React = require('react');
  const { Text, TouchableOpacity, View } = require('react-native');
  const topic = options.topic ?? 'Ratios';
  const subTopic = options.subTopic ?? { id: 99, sub_topic: 'Basics' };

  return function MockSummaryModal(props: any) {
    if (!props.visible) return null;
    return (
      <View>
        <Text>Prepare for Class</Text>
        {options.showTopicPickerLabels ? (
          <>
            <Text>Set Topic</Text>
            <Text>Topic :</Text>
            <Text>Sub Topic :</Text>
          </>
        ) : null}
        <TouchableOpacity
          onPress={() => props.setTopicSubTopicAndMoveToNext({ topic }, subTopic)}
        >
          <Text>Next</Text>
        </TouchableOpacity>
      </View>
    );
  };
}

export function createClassTaskModalMock(options: ClassTaskModalOptions = {}) {
  const React = require('react');
  const { Text, TouchableOpacity, View } = require('react-native');
  const cardLabel = options.cardLabel ?? 'AI Check Card';

  return function MockClassTaskModal(props: any) {
    const [showOptions, setShowOptions] = React.useState(false);
    const [showCard, setShowCard] = React.useState(true);
    if (!props.visible) return null;

    const handleSecondaryAction = () => {
      if (options.secondaryAction?.onPress === 'goBack') {
        props.goBack?.();
      } else if (options.secondaryAction?.onPress === 'onClose') {
        props.onClose?.();
      }
    };

    return (
      <View>
        <Text>Your AI-Powered Assistant</Text>
        {options.secondaryAction ? (
          <TouchableOpacity onPress={handleSecondaryAction}>
            <Text>{options.secondaryAction.label}</Text>
          </TouchableOpacity>
        ) : null}
        {props.classTasks?.map((task: any) => (
          <Text key={task.task_id}>{task.title}</Text>
        ))}
        {showCard ? (
          <>
            <Text>{cardLabel}</Text>
            <TouchableOpacity onPress={() => setShowOptions(!showOptions)}>
              <Text>More</Text>
            </TouchableOpacity>
            {showOptions ? (
              <TouchableOpacity onPress={() => setShowCard(false)}>
                <Text>Delete</Text>
              </TouchableOpacity>
            ) : null}
          </>
        ) : null}
        <TouchableOpacity onPress={props.addTask}>
          <Text>+ Add a Task</Text>
        </TouchableOpacity>
      </View>
    );
  };
}

export function createTaskModalMock(taskType: string, options: TaskModalOptions = {}) {
  const React = require('react');
  const { Text, TouchableOpacity } = require('react-native');
  const createLabel = options.createLabel ?? 'Create';

  return function MockTaskModal(props: any) {
    if (!props.visible) return null;
    return (
      <>
        <Text>Task Modal</Text>
        <TouchableOpacity onPress={() => props.clickedNext(taskType)}>
          <Text>{createLabel}</Text>
        </TouchableOpacity>
        {options.showCancel ? (
          <TouchableOpacity onPress={props.onClose}>
            <Text>Cancel</Text>
          </TouchableOpacity>
        ) : null}
      </>
    );
  };
}

export function createAICheckModalMock(savePayload: Partial<AICheckSavePayload> = {}) {
  const React = require('react');
  const { Text, TouchableOpacity, View } = require('react-native');
  const payload = { ...DEFAULT_AI_CHECK_SAVE, ...savePayload };

  return function MockAiCheckModal(props: any) {
    if (!props.visible) return null;
    return (
      <View>
        <Text>AI Check</Text>
        <TouchableOpacity testID="ai-check-save-button" onPress={() => props.saveAICheckDetails(payload)}>
          <Text>Save Task</Text>
        </TouchableOpacity>
      </View>
    );
  };
}

export function createAICheckFormShellMock() {
  const React = require('react');
  const { Text, View } = require('react-native');

  return function MockAiCheckFormModal({ visible }: { visible: boolean }) {
    if (!visible) return null;
    return (
      <View>
        <Text>AI Check Form</Text>
      </View>
    );
  };
}

export function createClassworkModalShellMock() {
  const React = require('react');
  const { Text, View } = require('react-native');

  return function MockClassworkModal({ visible }: { visible: boolean }) {
    if (!visible) return null;
    return (
      <View>
        <Text>Class Work Check</Text>
      </View>
    );
  };
}

export function createGenerateSlipTestModalMock() {
  const React = require('react');
  const { Text, TouchableOpacity, View } = require('react-native');

  return function MockGenerateSlipTestModal(props: any) {
    if (!props.visible) return null;
    return (
      <View>
        <Text>Generate Slip Test</Text>
        <Text>Topic</Text>
        <Text>Sub Topic</Text>
        <TouchableOpacity onPress={props.clickedNext}>
          <Text>Next</Text>
        </TouchableOpacity>
      </View>
    );
  };
}

export function createSlipTestSettingsModalMock(options: SlipTestSettingsOptions = {}) {
  const React = require('react');
  const { Text, TouchableOpacity, View } = require('react-native');
  const settings = { ...DEFAULT_SLIP_TEST_SETTINGS, title: options.title ?? DEFAULT_SLIP_TEST_SETTINGS.title };

  return function MockTestSettingsModal(props: any) {
    if (!props.visible) return null;
    return (
      <View>
        <Text>Test Setup</Text>
        <Text>Multiple Choice</Text>
        <Text>Subjective</Text>
        <TouchableOpacity onPress={() => props.generateSlipTest(settings)}>
          <Text>Generate Test</Text>
        </TouchableOpacity>
      </View>
    );
  };
}
