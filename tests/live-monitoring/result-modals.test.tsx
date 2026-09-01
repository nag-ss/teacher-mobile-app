import React from 'react';
import { fireEvent } from '@testing-library/react-native';
import AIResultModal from '@/components/live-monitoring/AIResult';
import CWResultModal from '@/components/live-monitoring/CWResult';
import SlipTestResultModal from '@/components/live-monitoring/SlipTestResult';
import { renderWithProviders } from '../test-utils/renderWithProviders';

jest.mock('@react-navigation/native', () => {
  const React = require('react');
  return {
    useFocusEffect: (callback: () => void) => {
      React.useEffect(() => {
        callback();
      }, [callback]);
    },
  };
});

jest.mock('@/components/live-monitoring/CWAnalysis', () => () => null);
jest.mock('@/components/live-monitoring/StudentModal', () => () => null);
jest.mock('@/components/live-monitoring/SlipTestQuestionResult', () => () => null);
jest.mock('@/components/live-monitoring/STAnalysis', () => () => null);

const basePreloadedState = {
  classes: { liveClass: {} },
};

describe('Result modals', () => {
  it('shows AI check result, accuracy and insight', () => {
    const onClose = jest.fn();
    const { getByText } = renderWithProviders(
      <AIResultModal
        visible
        onClose={onClose}
        studentAnswer={{
          result: 'Pass',
          accuracy: 90,
          insight: 'Strong understanding of ratios',
        }}
      />,
      { preloadedState: basePreloadedState }
    );

    expect(getByText('Pass')).toBeTruthy();
    expect(getByText('90%')).toBeTruthy();
    expect(getByText(/Strong understanding of ratios/)).toBeTruthy();
  });

  it('calls onClose when Cancel is pressed on AI check result modal', () => {
    const onClose = jest.fn();
    const { getByText } = renderWithProviders(
      <AIResultModal
        visible
        onClose={onClose}
        studentAnswer={{ result: 'Pass', accuracy: 90, insight: 'Good work' }}
      />,
      { preloadedState: basePreloadedState }
    );

    fireEvent.press(getByText('Cancel'));
    expect(onClose).toHaveBeenCalled();
  });

  it('shows classwork result, accuracy and AI insight', () => {
    const { getByText } = renderWithProviders(
      <CWResultModal
        visible
        onClose={jest.fn()}
        studentAnswer={{
          result: 'Pass',
          accuracy: 80,
          ai_insight: 'Good formula application',
          strengths: ['Clear steps'],
          areas_for_improvement: ['Check units'],
        }}
      />,
      { preloadedState: basePreloadedState }
    );

    expect(getByText('Pass')).toBeTruthy();
    expect(getByText('80%')).toBeTruthy();
    expect(getByText(/Good formula application/)).toBeTruthy();
    expect(getByText('Clear steps')).toBeTruthy();
    expect(getByText('Check units')).toBeTruthy();
  });

  it('shows slip test performance summary with student name and score', () => {
    const { getByText } = renderWithProviders(
      <SlipTestResultModal
        visible
        onClose={jest.fn()}
        student={{
          student_name: 'Akshay Sharma',
          score: 17,
          total_marks: 20,
          percentage: '85%',
          insight: 'Solid performance',
        }}
      />,
      { preloadedState: basePreloadedState }
    );

    expect(getByText('Performance Summary')).toBeTruthy();
    expect(getByText('Akshay Sharma')).toBeTruthy();
    expect(getByText('17/20')).toBeTruthy();
    expect(getByText(/Solid performance/)).toBeTruthy();
  });
});
