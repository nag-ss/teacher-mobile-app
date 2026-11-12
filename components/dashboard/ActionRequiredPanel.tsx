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
    width: 676,
    height: 460,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
    alignSelf: 'stretch',
    flexGrow: 0,
  },
});

export default ActionRequiredPanel;
