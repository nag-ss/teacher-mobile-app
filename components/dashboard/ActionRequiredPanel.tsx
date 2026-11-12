import React from 'react';
import { View, StyleSheet } from 'react-native';

const ActionRequiredPanel = () => {
  return <View style={styles.card} />;
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    paddingVertical: 20,
    paddingHorizontal: 24,
    width: '100%',
    height: 460,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EDEBE6',
    borderRadius: 16,
    alignSelf: 'stretch',
    flexGrow: 0,
    marginTop: 'auto',
  },
});

export default ActionRequiredPanel;
