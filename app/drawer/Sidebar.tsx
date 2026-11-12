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
          <SvgLoader svgFilePath="sidebarLogo" width={48} height={48} />
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
                <Text
                  style={[styles.menuLabel, active && styles.selectedLabel]}
                  numberOfLines={1}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.avatar}>
          <Text style={styles.avatarText} numberOfLines={1}>
            {initials}
          </Text>
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
        <Text style={styles.logoutLabel} numberOfLines={1}>
          Log Out
        </Text>
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
    width: 104,
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
    width: 48,
    height: 48,
    borderRadius: 24,
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
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 2,
    gap: 4,
    width: 96,
    minHeight: 56,
    flexGrow: 0,
    overflow: 'visible',
  },
  selectedMenu: {
    backgroundColor: '#1F1E1C',
    borderRadius: 8,
  },
  menuIconBox: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  menuLabel: {
    fontSize: 12,
    lineHeight: 16,
    color: '#8A8880',
    fontFamily: 'Inter_400Regular',
    fontStyle: 'normal',
    textAlign: 'center',
    includeFontPadding: false,
    flexGrow: 0,
    flexShrink: 0,
    width: '100%',
  },
  selectedLabel: {
    color: '#F6F5F1',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E8E4DC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    minWidth: 20,
    height: 17,
    fontSize: 14,
    lineHeight: 17,
    color: '#8A8880',
    fontFamily: 'Inter_700Bold',
    fontStyle: 'normal',
    includeFontPadding: false,
    textAlign: 'center',
    flexGrow: 0,
    flexShrink: 0,
  },
  logoutButton: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    width: 96,
    paddingVertical: 8,
  },
  logoutIconBox: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutLabel: {
    fontSize: 12,
    lineHeight: 16,
    color: '#8A8880',
    fontFamily: 'Inter_400Regular',
    textAlign: 'center',
    includeFontPadding: false,
    width: '100%',
  },
});
