import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import {
  DEMO_ACTION_REQUIRED_ITEMS,
  FORCE_ACTION_REQUIRED_UI,
} from '@/demoData/demoData';

const ActionRequiredPanel = () => {
  const actions = FORCE_ACTION_REQUIRED_UI ? DEMO_ACTION_REQUIRED_ITEMS : [];
  const count = actions.length;
  const hasActions = count > 0;

  return (
    <View style={styles.card}>
      <View style={styles.boxTop}>
        <Text style={styles.title}>Needs you</Text>
        {hasActions ? (
          <View style={styles.countCircle}>
            <Text style={styles.countText}>{count}</Text>
          </View>
        ) : null}
      </View>

      <View style={styles.boxMiddle}>
        <Text style={styles.subtitle}>
          Things only you can do. Each clears itself when done.
        </Text>
      </View>

      <View style={styles.boxBottom}>
        {hasActions ? (
          <ScrollView
            style={styles.list}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          >
            {actions.map((item) => (
              <View key={item.id} style={styles.row}>
                <View style={styles.rowLeft}>
                  <View style={styles.dot} />
                  <View style={styles.rowTextBox}>
                    <Text style={styles.rowTitle} numberOfLines={2}>
                      <Text style={styles.rowSubject}>{item.subject}</Text>
                      {item.body}
                    </Text>
                    <Text style={styles.rowMeta} numberOfLines={1}>
                      {item.meta}
                    </Text>
                  </View>
                </View>
                <Pressable
                  style={({ pressed }) => [
                    styles.ctaButton,
                    pressed && styles.ctaButtonPressed,
                  ]}
                >
                  <Text style={styles.ctaText} numberOfLines={1}>
                    {item.cta}
                  </Text>
                </Pressable>
              </View>
            ))}
          </ScrollView>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>You're all caught up</Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default ActionRequiredPanel;

const styles = StyleSheet.create({
  card: {
    flex: 460,
    alignSelf: 'stretch',
    minHeight: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
  },
  boxTop: {
    alignSelf: 'stretch',
    height: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    color: '#1F1E1C',
    fontFamily: 'Montserrat_600SemiBold',
  },
  countCircle: {
    minWidth: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F1EFEA',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  countText: {
    fontSize: 12,
    color: '#1F1E1C',
    fontFamily: 'Inter_600SemiBold',
  },
  boxMiddle: {
    alignSelf: 'stretch',
    height: 20,
    justifyContent: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 12,
    color: '#8A8880',
    fontFamily: 'Inter_400Regular',
  },
  boxBottom: {
    alignSelf: 'stretch',
    flex: 1,
    minHeight: 0,
  },
  list: {
    flex: 1,
    alignSelf: 'stretch',
  },
  listContent: {
    paddingBottom: 12,
  },
  row: {
    alignSelf: 'stretch',
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
    borderTopWidth: 1,
    borderTopColor: '#EDEBE6',
  },
  rowLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    minWidth: 0,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#D69A1E',
    flexShrink: 0,
  },
  rowTextBox: {
    flex: 1,
    minWidth: 0,
    height: 38,
    flexDirection: 'column',
    gap: 2,
    justifyContent: 'center',
  },
  rowTitle: {
    fontSize: 14,
    color: '#1F1E1C',
    fontFamily: 'Inter_400Regular',
  },
  rowSubject: {
    fontFamily: 'Inter_700Bold',
    color: '#1F1E1C',
  },
  rowMeta: {
    fontSize: 12,
    color: '#8A8880',
    fontFamily: 'Inter_400Regular',
  },
  ctaButton: {
    height: 36,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#EDEBE6',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  ctaButtonPressed: {
    backgroundColor: '#F1EFEA',
  },
  ctaText: {
    fontSize: 12,
    color: '#1F1E1C',
    fontFamily: 'Inter_600SemiBold',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#8A8880',
    fontFamily: 'Inter_400Regular',
  },
});
