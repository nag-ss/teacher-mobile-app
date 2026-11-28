import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import SvgLoader from '@/utils/SvgLoader';
import { useSidebarResponsive } from '@/hooks/responsive/sidebarResponsive';

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
  const layout = useSidebarResponsive();
  const { user } = useSelector((state: any) => state.user);
  const initials = getInitials(user?.first_name, user?.last_name);

  const isActive = (route: string) =>
    currentRoute === route || (currentRoute === 'live-monitoring' && route === 'Home');

  return (
    <View
      style={[
        styles.sidebar,
        {
          width: layout.width,
          paddingTop: layout.paddingTop,
          paddingBottom: layout.paddingBottom,
        },
      ]}
    >
      <View style={[styles.topBox, { width: layout.menuItemWidth }]}>
        <View
          style={[
            styles.logoBox,
            {
              width: layout.logoSize + 20,
              height: layout.logoSize + 4,
            },
          ]}
        >
          <View
            style={[
              styles.logoInner,
              { width: layout.logoSize, height: layout.logoSize },
            ]}
          >
            <SvgLoader
              svgFilePath="sidebarLogo"
              width={Math.round(layout.logoSize * 0.83)}
              height={Math.round(layout.logoSize * 0.83)}
            />
          </View>
        </View>
        <View style={[styles.menuBox, { width: layout.menuItemWidth }]}>
          {menuItems.map((item) => {
            const active = isActive(item.route);

            return (
              <TouchableOpacity
                key={item.route}
                style={[
                  styles.menuItem,
                  {
                    width: layout.menuItemWidth,
                    height: layout.showLabels ? 56 : 44,
                  },
                  active && styles.menuItemActive,
                ]}
                activeOpacity={0.7}
                onPress={() => navigation.navigate(item.route)}
              >
                <SvgLoader
                  svgFilePath={item.icon}
                  width={20}
                  height={20}
                  color={active ? '#FFFFFF' : '#8A8880'}
                />
                {layout.showLabels ? (
                  <View style={styles.menuLabelBox}>
                    <Text
                      style={[styles.menuLabel, active && styles.menuLabelActive]}
                      numberOfLines={1}
                    >
                      {item.label}
                    </Text>
                  </View>
                ) : null}
              </TouchableOpacity>
            );
          })}

          <View
            style={[
              styles.avatar,
              {
                width: layout.avatarSize,
                height: layout.avatarSize,
                borderRadius: layout.avatarSize / 2,
              },
            ]}
          >
            <Text style={styles.avatarText} numberOfLines={1}>
              {initials}
            </Text>
          </View>
        </View>
      </View>

      <TouchableOpacity
        style={[
          styles.logoutButton,
          {
            width: layout.menuItemWidth,
            height: layout.showLabels ? 56 : 44,
          },
        ]}
        onPress={() => onLogoutPress?.()}
        activeOpacity={0.7}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <View style={styles.logoutIconBox}>
          <SvgLoader svgFilePath="sidebarLogout" width={20} height={20} />
        </View>
        {layout.showLabels ? (
          <Text style={styles.logoutLabel} numberOfLines={1}>
            Log Out
          </Text>
        ) : null}
      </TouchableOpacity>
    </View>
  );
};

export default Sidebar;

const styles = StyleSheet.create({
  sidebar: {
    alignSelf: 'stretch',
    backgroundColor: '#FFFFFF',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  topBox: {
    alignItems: 'center',
  },
  logoBox: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  logoInner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuBox: {
    alignItems: 'center',
    marginTop: 12,
    gap: 12,
  },
  menuItem: {
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
