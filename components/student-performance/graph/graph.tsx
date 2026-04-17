import React, { useState, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
  VictoryChart,
  VictoryLine,
  VictoryAxis,
} from 'victory-native';
import { Dropdown } from 'react-native-element-dropdown';
import graphData from '@/data/graphData';

const MONTHS = Object.keys(graphData);
const MONTH_OPTIONS = MONTHS.map((m) => ({ label: m, value: m }));

const ACTUAL_VALUES = [0, 10, 25, 50, 75, 100];
const VISUAL_POSITIONS = [0, 20, 40, 60, 80, 100];
const DOTTED_POSITIONS = [30, 70, 100];

const toVisual = (value: number) => {
  if (value <= ACTUAL_VALUES[0]) return VISUAL_POSITIONS[0];
  if (value >= ACTUAL_VALUES[ACTUAL_VALUES.length - 1])
    return VISUAL_POSITIONS[VISUAL_POSITIONS.length - 1];
  for (let i = 1; i < ACTUAL_VALUES.length; i++) {
    if (value <= ACTUAL_VALUES[i]) {
      const ratio =
        (value - ACTUAL_VALUES[i - 1]) /
        (ACTUAL_VALUES[i] - ACTUAL_VALUES[i - 1]);
      return VISUAL_POSITIONS[i - 1] + ratio * (VISUAL_POSITIONS[i] - VISUAL_POSITIONS[i - 1]);
    }
  }
  return VISUAL_POSITIONS[VISUAL_POSITIONS.length - 1];
};

const Graph = () => {
  const [selectedMonth, setSelectedMonth] = useState(MONTHS[0]);

  const monthData = graphData[selectedMonth as keyof typeof graphData];

  const assignmentLine = useMemo(
    () => monthData.map((d, i) => ({ x: i + 1, y: toVisual(d.assignment) })),
    [monthData],
  );
  const quizLine = useMemo(
    () => monthData.map((d, i) => ({ x: i + 1, y: toVisual(d.quiz) })),
    [monthData],
  );

  const stats = useMemo(() => {
    const all = monthData.flatMap((d) => [
      { name: d.label, type: 'Assignment', score: d.assignment },
      { name: d.label, type: 'Quiz', score: d.quiz },
    ]);
    const avg = Math.round(all.reduce((s, d) => s + d.score, 0) / all.length);
    const best = all.reduce((b, d) => (d.score > b.score ? d : b));
    const worst = all.reduce((w, d) => (d.score < w.score ? d : w));
    return { avg, best, worst };
  }, [monthData]);

  return (
    <View style={styles.shell}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Performance Trends Over Time</Text>
        <Dropdown
          data={MONTH_OPTIONS}
          value={selectedMonth}
          onChange={(item) => setSelectedMonth(item.value)}
          labelField="label"
          valueField="value"
          style={styles.dropdown}
          selectedTextStyle={styles.dropdownText}
          itemTextStyle={styles.dropdownText}
          containerStyle={styles.dropdownContainer}
          flatListProps={{ nestedScrollEnabled: true }}
          maxHeight={80}
        />
      </View>

      <View style={styles.chartWrapper}>
        <VictoryChart
          height={280}
          padding={{ top: 20, bottom: 40, left: 40, right: 150 }}
          domain={{ y: [0, 100] }}
        >
          <VictoryAxis
            tickValues={monthData.map((_, i) => i + 1)}
            tickFormat={monthData.map(() => '')}
            style={{
              axis: { stroke: '#E5E7EB' },
              tickLabels: {
                fontFamily: 'Roboto_400Regular',
                fontSize: 10,
                fill: '#6B7280',
                padding: 8,
              },
              grid: { stroke: 'transparent' },
            }}
          />
          <VictoryAxis
            dependentAxis
            tickValues={VISUAL_POSITIONS}
            tickFormat={ACTUAL_VALUES.map(String)}
            style={{
              axis: { stroke: 'transparent' },
              tickLabels: {
                fontFamily: 'Roboto_400Regular',
                fontSize: 10,
                fill: '#6B7280',
                padding: 8,
              },
              grid: { stroke: 'transparent' },
            }}
          />
          <VictoryAxis
            dependentAxis
            tickValues={DOTTED_POSITIONS}
            style={{
              axis: { stroke: 'transparent' },
              tickLabels: { fill: 'transparent', fontSize: 0 },
              grid: {
                stroke: '#E5E7EB',
                strokeDasharray: '4,4',
              },
            }}
          />
          <VictoryLine
            data={assignmentLine}
            interpolation="monotoneX"
            style={{ data: { stroke: '#F87171', strokeWidth: 2 } }}
          />
          <VictoryLine
            data={quizLine}
            interpolation="monotoneX"
            style={{ data: { stroke: '#6366F1', strokeWidth: 2 } }}
          />
        </VictoryChart>
      </View>

      <View style={styles.footerRow}>
        <Text style={styles.footerText}>
          Best Performance :{' '}
          <Text style={styles.footerBold}>
            {stats.best.name} - {stats.best.score}%
          </Text>
        </Text>
        <Text style={styles.footerText}>
          Lowest Performance :{' '}
          <Text style={styles.footerBold}>
            {stats.worst.name} - {stats.worst.score}%
          </Text>
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  shell: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginTop: 10,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  title: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 16,
    color: '#111827',
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 34,
    width: 120,
  },
  dropdownText: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 12,
    color: '#111827',
  },
  dropdownContainer: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  chartWrapper: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  footerText: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 11,
    color: '#6B7280',
  },
  footerBold: {
    fontFamily: 'Montserrat_600SemiBold',
    color: '#111827',
  },
});

export default Graph;
