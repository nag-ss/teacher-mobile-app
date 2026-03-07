import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ROLES } from '@/constants/feedbackConstants';

type RoleDropdownProps = {
  value: string;
  open: boolean;
  onToggle: () => void;
  onSelect: (role: string) => void;
  hasError?: boolean;
  emptyPlaceholder?: string;
  defaultPlaceholder?: string;
};

export function RoleDropdown({
  value,
  open,
  onToggle,
  onSelect,
  hasError,
  emptyPlaceholder = 'This field is required',
  defaultPlaceholder = 'Select role',
}: RoleDropdownProps) {
  const placeholderText = !value ? (hasError ? emptyPlaceholder : defaultPlaceholder) : '';
  return (
    <View style={styles.card}>
      <Text style={styles.label}>Role *</Text>
      <TouchableOpacity
        style={[styles.input, open && styles.inputOpen]}
        onPress={onToggle}
        activeOpacity={0.7}
      >
        <Text style={[styles.roleText, !value && styles.placeholder]}>
          {value || placeholderText}
        </Text>
        <Text style={[styles.chevron, open && styles.chevronUp]}>▼</Text>
      </TouchableOpacity>
      {open && (
        <View style={styles.dropdownList}>
          {ROLES.map((r) => (
            <TouchableOpacity
              key={r}
              style={[styles.dropdownOption, r === value && styles.dropdownOptionSelected]}
              onPress={() => onSelect(r)}
              activeOpacity={0.7}
            >
              <Text style={styles.dropdownOptionText}>{r}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 14,
    marginBottom: 14,
    width: '100%',
    alignSelf: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  label: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 13,
    color: '#222',
    marginBottom: 8,
  },
  input: {
    fontFamily: 'Montserrat_400Regular',
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 13,
    color: '#222',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 36,
  },
  inputOpen: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  roleText: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 13,
    color: '#222',
  },
  placeholder: {
    fontFamily: 'Montserrat_400Regular',
    color: '#9E9E9E',
  },
  chevron: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 10,
    color: '#666',
  },
  chevronUp: {
    transform: [{ rotate: '180deg' }],
  },
  dropdownList: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: '#E0E0E0',
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    overflow: 'hidden',
  },
  dropdownOption: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E0E0E0',
  },
  dropdownOptionSelected: {
    backgroundColor: '#F5F5F5',
  },
  dropdownOptionText: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 13,
    color: '#222',
  },
});
