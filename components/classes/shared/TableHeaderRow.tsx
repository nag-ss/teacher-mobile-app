import React from 'react';
import { StyleSheet, Text, View, type StyleProp, type TextStyle } from 'react-native';

export type TableHeaderColumn = {
  key: string;
  label: string;
  textStyle?: StyleProp<TextStyle>;
};

type Props = {
  columns: TableHeaderColumn[];
};

const TableHeaderRow = ({ columns }: Props) => {
  return (
    <View style={styles.headerRow}>
      {columns.map((c) => (
        <Text key={c.key} style={[styles.headerCell, c.textStyle]}>
          {c.label}
        </Text>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: '#fff',
  },
  headerCell: {
    fontFamily: 'Roboto_500Medium',
    fontSize: 11,
    color: '#6B7280',
    paddingHorizontal: 4,
    textAlign: 'center',
  },
});

export default TableHeaderRow;

