import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import SvgLoader from '@/utils/SvgLoader';

const menuItems = [
  { icon: 'sidebarHome', label: 'Home', route: 'Home' },
  { icon: 'sidebarClasses', label: 'Classes', route: 'Classes' },
  { icon: 'sidebarStudent360', label: 'Student360', route: 'Analytics' },
  { icon: 'sidebarCalendar', label: 'Calender', route: 'Calendar' },
] as const;

const getInitials = (firstName?: string, lastName?: string) => {
  const first = firstName?.trim()?.[0] ?? '';
  const last = lastName?.trim()?.[0] ?? '';
  return `${first}${last}`.toUpperCase() || 'U';
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

  const initials = getInitials(user?.first_name, user?.last_name);

  return (
    <View style={styles.sidebar}>
      <View style={styles.topSection}>
        <View style={styles.logoBox}>
          <SvgLoader svgFilePath="sidebarLogo" width={40} height={40} />
        </View>

        <View style={styles.menu}>
          {menuItems.map((item) => {
            const active = isActive(item.route);

            return (
              <TouchableOpacity
                key={item.label}
                style={[styles.menuItem, active && styles.selectedMenu]}
                activeOpacity={0.7}
                onPress={() => navigation.navigate(item.route)}
              >
                <View style={styles.menuIconBox}>
                  <SvgLoader
                    svgFilePath={item.icon}
                    width={20}
                    height={20}
                    color={active ? '#FFFFFF' : '#8A8880'}
                  />
                </View>
                <Text style={[styles.menuLabel, active && styles.selectedLabel]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={() => onLogoutPress?.()}
        activeOpacity={0.7}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <View style={styles.logoutIconBox}>
          <SvgLoader svgFilePath="sidebarLogout" width={20} height={20} />
        </View>
        <Text style={styles.logoutLabel}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Sidebar;

const styles = StyleSheet.create({
  sidebar: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: 24,
    paddingHorizontal: 0,
    gap: 24,
    width: 88,
    alignSelf: 'stretch',
    backgroundColor: '#FFFFFF',
    flexGrow: 0,
  },
  topSection: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 16,
    width: '100%',
  },
  logoBox: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  menu: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
    width: '100%',
  },
  menuItem: {
    boxSizing: 'border-box',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
    gap: 4,
    width: 72,
    height: 56,
    flexGrow: 0,
  },
  selectedMenu: {
    backgroundColor: '#1F1E1C',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.0313726,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  menuIconBox: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuLabel: {
    height: 16,
    fontSize: 12,
    lineHeight: 16,
    color: '#8A8880',
    fontFamily: 'Inter_400Regular',
    fontStyle: 'normal',
    textAlign: 'center',
    includeFontPadding: false,
    flexGrow: 0,
  },
  selectedLabel: {
    color: '#F6F5F1',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E8E4DC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 14,
    lineHeight: 17,
    color: '#8A8880',
    fontFamily: 'Inter_700Bold',
    includeFontPadding: false,
  },
  logoutButton: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    width: 72,
    paddingVertical: 8,
  },
  logoutIconBox: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutLabel: {
    fontSize: 11,
    lineHeight: 13,
    color: '#8A8880',
    fontFamily: 'Inter_600SemiBold',
    textAlign: 'center',
    includeFontPadding: false,
  },
});
