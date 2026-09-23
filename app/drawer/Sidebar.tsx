import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import SvgLoader from '@/utils/SvgLoader';

const menuItems = [
  { icon: 'sidebarHome', activeIcon: 'sidebarHomeActive', label: 'Home', route: 'Home' },
  { icon: 'sidebarClasses', activeIcon: 'sidebarClassesActive', label: 'Classes', route: 'Classes' },
  { icon: 'sidebarCalendar', activeIcon: 'sidebarCalendarActive', label: 'Calendar', route: 'Calendar' },
  { icon: 'sidebarAnalytics', activeIcon: 'sidebarAnalyticsActive', label: 'Analytics', route: 'Analytics' },
  { icon: 'sidebarProfile', activeIcon: 'sidebarProfileActive', label: 'Profile', route: 'Profile' },
] as const;

const getInitials = (firstName?: string, lastName?: string) => {
  const first = firstName?.trim()?.[0] ?? '';
  const last = lastName?.trim()?.[0] ?? '';
  return `${first}${last}`.toUpperCase() || 'U';
};

const formatSubjects = (subjects: unknown) => {
  if (Array.isArray(subjects)) {
    return subjects.filter(Boolean).join(', ') || '—';
  }
  if (typeof subjects === 'string' && subjects.trim()) {
    return subjects;
  }
  return '—';
};

type SidebarProps = {
  navigation: any;
  currentRoute?: string;
  onLogoutPress?: () => void;
};

const Sidebar = ({ navigation, currentRoute = 'Home', onLogoutPress }: SidebarProps) => {
  const { user } = useSelector((state: any) => state.user);

  const isActive = (route: string) =>
    currentRoute === route || (currentRoute === 'live-monitoring' && route === 'Home');

  const fullName = [user?.first_name, user?.last_name].filter(Boolean).join(' ') || 'Teacher';
  const initials = getInitials(user?.first_name, user?.last_name);
  const subjectLabel = formatSubjects(user?.subjects);

  return (
    <View style={styles.sidebar}>
      <View style={styles.header}>
        <SvgLoader svgFilePath="sidebarLogo" width={32} height={32} />
        <Text style={styles.brand}>Super Slate</Text>
      </View>

      <View style={styles.menu}>
        {menuItems.map((item) => {
          const active = isActive(item.route);
          const iconKey = active ? item.activeIcon : item.icon;

          return (
            <TouchableOpacity
              key={item.label}
              style={[styles.menuItem, active && styles.selectedMenu]}
              activeOpacity={0.7}
              onPress={() => navigation.navigate(item.route)}
            >
              <SvgLoader svgFilePath={iconKey} width={18} height={18} />
              <Text style={[styles.menuLabel, active && styles.selectedLabel]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.footer}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.userName} numberOfLines={1}>
            {fullName}
          </Text>
          <Text style={styles.userSubject} numberOfLines={1}>
            {subjectLabel}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => onLogoutPress?.()}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <SvgLoader svgFilePath="sidebarLogout" width={18} height={18} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Sidebar;

const styles = StyleSheet.create({
  sidebar: {
    width: 220,
    backgroundColor: '#F7F7F5',
    borderRightWidth: 1,
    borderRightColor: '#E8E7E3',
    paddingTop: 24,
    paddingHorizontal: 12,
    paddingBottom: 20,
    justifyContent: 'flex-start',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    marginBottom: 28,
    gap: 10,
  },
  brand: {
    fontSize: 16,
    lineHeight: 20,
    color: '#1A1A1A',
    fontFamily: 'Montserrat_700Bold',
    includeFontPadding: false,
  },
  menu: {
    flex: 1,
    gap: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    gap: 12,
  },
  selectedMenu: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  menuLabel: {
    fontSize: 15,
    lineHeight: 20,
    color: '#8A8880',
    fontFamily: 'Montserrat_500Medium',
    includeFontPadding: false,
  },
  selectedLabel: {
    color: '#1A1A1A',
    fontFamily: 'Montserrat_700Bold',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
    paddingTop: 16,
    gap: 10,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#D4E8C2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 12,
    lineHeight: 16,
    color: '#3D5C2A',
    fontFamily: 'Montserrat_700Bold',
    includeFontPadding: false,
  },
  userInfo: {
    flex: 1,
    minWidth: 0,
  },
  userName: {
    fontSize: 13,
    lineHeight: 18,
    color: '#1A1A1A',
    fontFamily: 'Montserrat_700Bold',
    includeFontPadding: false,
  },
  userSubject: {
    fontSize: 12,
    lineHeight: 16,
    color: '#8A8880',
    fontFamily: 'Montserrat_400Regular',
    includeFontPadding: false,
    marginTop: 1,
  },
  logoutButton: {
    padding: 4,
  },
});
