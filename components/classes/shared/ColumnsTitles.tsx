import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, type StyleProp, type TextStyle } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export type TableHeaderColumn = {
  key: string;
  label: string;
  textStyle?: StyleProp<TextStyle>;
};

type Props = {
  columns: TableHeaderColumn[];
  sortKey?: string;
  onPressSortColumn?: (key: string) => void;
};

const ColumnsTitles = ({ columns, sortKey, onPressSortColumn }: Props) => {
  return (
    <View style={styles.headerRow}>
      {columns.map((c) => (
        <View key={c.key} style={[styles.headerCell, c.textStyle as any]}>
          <Text
            style={[
              styles.headerLabel,
              c.key === 'action' ? { marginRight: 0 } : null,
            ]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {c.label}
          </Text>
          {c.key === 'action' ? null : (
            <TouchableOpacity onPress={() => onPressSortColumn?.(c.key)} hitSlop={8}>
              <MaterialIcons name="sort" size={12} color={sortKey === c.key ? '#111827' : '#9CA3AF'} />
            </TouchableOpacity>
          )}
        </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    fontFamily: 'Roboto_500Medium',
    fontSize: 11,
    color: '#6B7280',
    paddingHorizontal: 4,
  },
  headerLabel: {
    flexShrink: 1,
    fontFamily: 'Roboto_500Medium',
    fontSize: 11,
    color: '#6B7280',
    // Keep a tiny gap between the label and icon
    marginRight: 4,
  },
});

export default ColumnsTitles;

