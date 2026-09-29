import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import SvgLoader from '@/utils/SvgLoader';
import { useLeftSidebarLayout } from '../../hooks/Responsive/useLeftSidebarLayout';

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
  const layout = useLeftSidebarLayout();

  const isActive = (route: string) =>
    currentRoute === route || (currentRoute === 'live-monitoring' && route === 'Home');

  const fullName = [user?.first_name, user?.last_name].filter(Boolean).join(' ') || 'Teacher';
  const initials = getInitials(user?.first_name, user?.last_name);
  const subjectLabel = formatSubjects(user?.subjects);

  return (
    <View
      style={[
        styles.sidebar,
        {
          width: layout.sidebarWidth,
          paddingTop: layout.paddingTop,
          paddingHorizontal: layout.paddingHorizontal,
          paddingBottom: layout.paddingBottom,
        },
      ]}
    >
      <View style={[styles.navBox, { width: layout.contentWidth, gap: layout.navGap }]}>
        <View
          style={[
            styles.header,
            { height: layout.headerHeight, gap: layout.headerGap },
          ]}
        >
          <View
            style={[
              styles.logoBox,
              { width: layout.logoSize, height: layout.logoSize },
            ]}
          >
            <SvgLoader svgFilePath="sidebarLogo" width={32} height={32} />
          </View>
          <View style={styles.brandBox}>
            <Text style={styles.brand}>Super Slate</Text>
          </View>
        </View>

        <View style={[styles.menu, { width: layout.contentWidth, gap: layout.menuGap }]}>
          {menuItems.map((item) => {
            const active = isActive(item.route);
            const iconKey = active ? item.activeIcon : item.icon;

            return (
              <TouchableOpacity
                key={item.label}
                style={[
                  styles.menuItem,
                  {
                    width: layout.contentWidth,
                    height: layout.menuItemHeight,
                    paddingHorizontal: layout.menuItemPaddingH,
                    gap: layout.menuItemGap,
                    borderRadius: layout.menuItemRadius,
                  },
                  active && styles.selectedMenu,
                ]}
                activeOpacity={0.7}
                onPress={() => navigation.navigate(item.route)}
              >
                <View style={styles.menuIconBox}>
                  <SvgLoader svgFilePath={iconKey} width={20} height={20} />
                </View>
                <View style={styles.menuLabelBox}>
                  <Text style={[styles.menuLabel, active && styles.selectedLabel]}>
                    {item.label}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <View
        style={[
          styles.footer,
          { width: layout.contentWidth, gap: layout.footerGap },
        ]}
      >
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
          <View style={styles.initialsBox}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
        </View>
        <View style={styles.userInfo}>
          <View style={styles.userNameBox}>
            <Text style={styles.userName} numberOfLines={1}>
              {fullName}
            </Text>
          </View>
          <View style={styles.userRoleBox}>
            <Text style={styles.userSubject} numberOfLines={1}>
              {subjectLabel}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => onLogoutPress?.()}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <View
            style={[
              styles.logoutBox,
              { width: layout.logoutBoxSize, height: layout.logoutBoxSize },
            ]}
          >
            <SvgLoader svgFilePath="sidebarLogout" width={18} height={18} />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Sidebar;

const styles = StyleSheet.create({
  sidebar: {
    alignSelf: 'stretch',
    backgroundColor: '#FAFAF8',
    borderRightWidth: 1,
    borderRightColor: '#D9D6CF',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  navBox: {},
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  logoBox: {
    borderRadius: 2.66667,
    flexGrow: 0,
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  brandBox: {
    height: 28,
    flexGrow: 0,
    flexShrink: 0,
    justifyContent: 'center',
  },
  brand: {
    fontSize: 20,
    lineHeight: 28,
    color: '#1F1E1C',
    fontFamily: 'Montserrat_700Bold',
    includeFontPadding: false,
  },
  menu: {},
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
    paddingVertical: 0,
    flexGrow: 0,
    flexShrink: 0,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  selectedMenu: {
    backgroundColor: '#FFFFFF',
    borderColor: '#EDEBE6',
    shadowColor: '#000',
    shadowOpacity: 0.0313726,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  menuIconBox: {
    width: 20,
    height: 20,
    flexGrow: 0,
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuLabelBox: {
    height: 17,
    flexGrow: 0,
    flexShrink: 0,
    justifyContent: 'center',
  },
  menuLabel: {
    fontSize: 14,
    lineHeight: 17,
    color: '#8A8880',
    fontFamily: 'Inter_600SemiBold',
    includeFontPadding: false,
  },
  selectedLabel: {
    color: '#1F1E1C',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
    padding: 0,
    flexGrow: 0,
    flexShrink: 0,
  },
  avatar: {
    backgroundColor: '#B7E7CE',
    padding: 0,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    flexGrow: 0,
    flexShrink: 0,
  },
  initialsBox: {
    height: 17,
    flexGrow: 0,
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 14,
    lineHeight: 17,
    color: '#0D8A57',
    fontFamily: 'Inter_700Bold',
    includeFontPadding: false,
  },
  userInfo: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    padding: 0,
    gap: 4,
    flexGrow: 1,
    flexShrink: 1,
    minWidth: 0,
  },
  userNameBox: {
    height: 17,
    maxWidth: '100%',
    flexGrow: 0,
    flexShrink: 1,
    justifyContent: 'center',
  },
  userName: {
    fontSize: 14,
    lineHeight: 17,
    color: '#1F1E1C',
    fontFamily: 'Inter_600SemiBold',
    includeFontPadding: false,
  },
  userRoleBox: {
    height: 15,
    maxWidth: '100%',
    flexGrow: 0,
    flexShrink: 1,
    justifyContent: 'center',
  },
  userSubject: {
    fontSize: 12,
    lineHeight: 15,
    color: '#8A8880',
    fontFamily: 'Inter_400Regular',
    includeFontPadding: false,
  },
  logoutButton: {
    flexGrow: 0,
    flexShrink: 0,
  },
  logoutBox: {
    flexGrow: 0,
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
