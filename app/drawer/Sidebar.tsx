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

const Sidebar = ({
  navigation,
  currentRoute = 'Home',
  onLogoutPress,
}: SidebarProps) => {
  const { user } = useSelector((state: any) => state.user);
  const initials = getInitials(user?.first_name, user?.last_name);

  const isActive = (route: string) =>
    currentRoute === route || (currentRoute === 'live-monitoring' && route === 'Home');

  return (
    <View style={styles.sidebar}>
      <View style={styles.topBox}>
        <View style={styles.logoBox}>
          <View style={styles.logoInner}>
            <SvgLoader svgFilePath="sidebarLogo" width={40} height={40} />
          </View>
        </View>
        <View style={styles.menuBox}>
          {menuItems.map((item) => {
            const active = isActive(item.route);

            return (
              <TouchableOpacity
                key={item.route}
                style={[styles.menuItem, active && styles.menuItemActive]}
                activeOpacity={0.7}
                onPress={() => navigation.navigate(item.route)}
              >
                <SvgLoader
                  svgFilePath={item.icon}
                  width={20}
                  height={20}
                  color={active ? '#FFFFFF' : '#8A8880'}
                />
                <View style={styles.menuLabelBox}>
                  <Text
                    style={[styles.menuLabel, active && styles.menuLabelActive]}
                    numberOfLines={1}
                  >
                    {item.label}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}

          <View style={styles.avatar}>
            <Text style={styles.avatarText} numberOfLines={1}>
              {initials}
            </Text>
          </View>
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
    width: 104,
    alignSelf: 'stretch',
    backgroundColor: '#FFFFFF',
    paddingTop: 24,
    /** Match home paddingBottom so logout lines up with Needs you bottom edge */
    paddingBottom: 24,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  topBox: {
    width: 88,
    height: 408,
    alignItems: 'center',
  },
  logoBox: {
    width: 68,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  logoInner: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuBox: {
    width: 88,
    alignItems: 'center',
    /** Match live card: home 24+56+16=96; logo ends at 24+8+52=84 → +12 */
    marginTop: 12,
    gap: 12,
  },
  menuItem: {
    width: 88,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuItemActive: {
    backgroundColor: '#1F1E1C',
    borderRadius: 12,
  },
  menuLabelBox: {
    alignSelf: 'stretch',
    height: 16,
    justifyContent: 'center',
  },
  menuLabel: {
    fontSize: 12,
    color: '#8A8880',
    fontFamily: 'Inter_400Regular',
    textAlign: 'center',
  },
  menuLabelActive: {
    color: '#FFFFFF',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F1EFEA',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  avatarText: {
    fontSize: 14,
    color: '#8A8880',
    fontFamily: 'Inter_700Bold',
    textAlign: 'center',
  },
  logoutButton: {
    width: 87,
    height: 56,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  logoutIconBox: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutLabel: {
    fontSize: 12,
    color: '#8A8880',
    fontFamily: 'Inter_400Regular',
    textAlign: 'center',
  },
});
