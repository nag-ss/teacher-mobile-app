import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

interface ProfileFieldProps {
  label: string;
  value: string;
  editable?: boolean;
}

const ProfileField = ({ label, value, editable = true }: ProfileFieldProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        value={value}
        editable={editable}
        secureTextEntry={label.toLowerCase().includes('password')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginVertical: 8, flex: 1 },
  label: { fontSize: 14, color: '#333' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    fontSize: 16,
    borderRadius: 6,
    backgroundColor: '#f9f9f9',
  },
});

export default ProfileField;
