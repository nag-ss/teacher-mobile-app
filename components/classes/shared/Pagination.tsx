import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

type Props = {
  page: number;
  pageCount: number;
  onPrev: () => void;
  onNext: () => void;
  onSetPage: (p: number) => void;
};

const Pagination = ({ page, pageCount, onPrev, onNext, onSetPage }: Props) => {
  const paginationItems = useMemo(() => {
    if (pageCount <= 5) return Array.from({ length: pageCount }, (_, i) => i + 1);
    if (page <= 2) return [1, 2, 'ellipsis', pageCount - 1, pageCount] as const;
    if (page >= pageCount - 1) return [1, 2, 'ellipsis', pageCount - 1, pageCount] as const;
    return [1, 'ellipsis', page, 'ellipsis', pageCount] as const;
  }, [page, pageCount]);

  if (pageCount <= 1) return null;

  return (
    <View style={styles.nav}>
      <View style={styles.navLeft}>
        <TouchableOpacity style={styles.navButton} onPress={onPrev} disabled={page === 1} activeOpacity={0.7}>
          <MaterialIcons name="chevron-left" size={20} color="#111827" />
          <Text style={styles.navButtonText}>Previous</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.navCenter}>
        <View style={styles.pagination}>
          {paginationItems.map((item, idx) => {
            if (item === 'ellipsis') {
              return (
                <Text key={`e-${idx}`} style={styles.ellipsis}>
                  …
                </Text>
              );
            }
            const p = item as number;
            return (
              <TouchableOpacity
                key={p}
                style={[styles.pageDot, p === page && styles.pageDotActive]}
                onPress={() => onSetPage(p)}
                activeOpacity={0.7}
              >
                <Text style={[styles.pageDotText, p === page && styles.pageDotTextActive]}>
                  {String(p).padStart(2, '0')}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <View style={styles.navRight}>
        <TouchableOpacity style={styles.navButton} onPress={onNext} disabled={page === pageCount} activeOpacity={0.7}>
          <Text style={styles.navButtonText}>Next</Text>
          <MaterialIcons name="chevron-right" size={20} color="#111827" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  nav: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  navLeft: { flex: 1, alignItems: 'flex-start' },
  navCenter: { flex: 1, alignItems: 'center' },
  navRight: { flex: 1, alignItems: 'flex-end' },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 0,
    height: 48,
  },
  navButtonText: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 12,
    color: '#666',
  },
  pagination: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pageDot: {
    width: 34,
    height: 34,
    borderRadius: 8,
    borderWidth: 0,
    borderColor: 'transparent',
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 0,
    flexShrink: 0,
  },
  pageDotActive: {
    backgroundColor: '#21C17C',
    borderColor: '#21C17C',
    borderWidth: 1,
  },
  pageDotText: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  pageDotTextActive: {
    fontFamily: 'Montserrat_400Regular',
    color: '#fff',
  },
  ellipsis: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    paddingHorizontal: 6,
  },
});

export default Pagination;

