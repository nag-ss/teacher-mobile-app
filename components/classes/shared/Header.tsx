import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

type Props = {
  title: string;
  query?: string;
  onChangeQuery?: (next: string) => void;
  searchDisabled?: boolean;
  searchPlaceholder?: string;
  onPressSort?: () => void;
  onPressFilter?: () => void;
};

const TableHeaderControls = ({
  title,
  query = '',
  onChangeQuery,
  searchDisabled = false,
  searchPlaceholder = 'Search Keywords',
  onPressSort,
  onPressFilter,
}: Props) => {
  return (
    <View style={styles.topRow}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.controlsRow}>
        <View style={styles.searchBox}>
          <TextInput
            value={query}
            onChangeText={onChangeQuery}
            placeholder={searchPlaceholder}
            placeholderTextColor="#111827"
            style={styles.searchInput}
            editable={!searchDisabled}
            selectTextOnFocus={!searchDisabled}
          />
          <MaterialIcons name="search" size={18} color="#111827" />
        </View>

        <TouchableOpacity style={styles.outlineAction} activeOpacity={0.7} onPress={onPressSort}>
          <Text style={styles.outlineActionText}>Sort</Text>
          <MaterialIcons name="sort" size={18} color="#111827" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.outlineAction} activeOpacity={0.7} onPress={onPressFilter}>
          <Text style={styles.outlineActionText}>Filter</Text>
          <MaterialIcons name="filter-list" size={18} color="#111827" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 18.28,
    paddingBottom: 12,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 12,
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
    paddingBottom: 12,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#111827',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 32,
    width: 180,
    backgroundColor: '#fff',
  },
  searchInput: {
    flex: 1,
    fontFamily: 'Roboto_400Regular',
    fontSize: 11,
    color: '#111827',
    paddingVertical: 0,
    paddingRight: 8,
  },
  outlineAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  outlineActionText: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 11,
    color: '#111827',
  },
});

export default TableHeaderControls;

