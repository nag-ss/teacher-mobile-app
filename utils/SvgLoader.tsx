import React, { useEffect, useState } from 'react';
import { SvgUri, SvgXml } from 'react-native-svg';
import { Asset } from 'expo-asset';

// Mapping of static asset paths
const svgAssets = {
  logo: require('../assets/images/ss/Logo.svg'),
  aiAssistant: require('../assets/images/ss/aiAsistant.svg'),
  aiCheck: require('../assets/images/ss/aiCheck.svg'),
  autoTest: require('../assets/images/ss/autoTest.svg'),
  classUpload: require('../assets/images/ss/classUpload.svg'),
  chemistry: require('../assets/images/ss/Chemistry.svg'),
  liveclass: require('../assets/images/ss/LiveClass.svg'),
  iconUpcoming: require('../assets/images/ss/Icons-upcoming.svg'),
  iconCompleted: require('../assets/images/ss/Icons-completed.svg'),
  rightArrow: require('../assets/images/ss/TaskDueIcon.svg'),
  activityAnalytics: require('../assets/images/ss/activityAnalytics.svg'),
  activityEngagement: require('../assets/images/ss/activityEngagement.svg'),
  activityStruggle: require('../assets/images/ss/activityStruggle.svg'),
  activityTrend: require('../assets/images/ss/activityTrend.svg'),
  alertAlert: require('../assets/images/ss/alertAlert.svg'),
  alertCorrect: require('../assets/images/ss/alertCorrect.svg'),
  loginLogo: require('../assets/beta_images/login_logo.svg'),
  loginIcon: require('../assets/beta_images/login_icon.svg'),
  loginError: require('../assets/beta_images/error.svg'),
  loginLeftArrow: require('../assets/beta_images/left_arrow.svg'),
  loginEmail: require('../assets/beta_images/Email.svg'),
  loginLogout: require('../assets/beta_images/logout.svg'),
  sidebarLogo: require('../assets/beta_images_1/logo.svg'),
  sidebarHome: require('../assets/beta_images_1/home.svg'),
  sidebarClasses: require('../assets/beta_images_1/classes.svg'),
  sidebarStudent360: require('../assets/beta_images_1/student360.svg'),
  sidebarCalendar: require('../assets/beta_images_1/calender.svg'),
  sidebarAnalytics: require('../assets/beta_images/analytics.svg'),
  sidebarAnalyticsActive: require('../assets/beta_images/analytics_active.svg'),
  sidebarProfile: require('../assets/beta_images/profile.svg'),
  sidebarProfileActive: require('../assets/beta_images/profile_active.svg'),
  sidebarLogout: require('../assets/beta_images/sidebar_logout.svg'),
  notificationLeftArrow: require('../assets/beta_images/notification_left_arrow.svg'),
  notificationRightArrow: require('../assets/beta_images/notification_right_arrow.svg'),
  notificationActive: require('../assets/beta_images/active_notification.svg'),
  notificationInactive: require('../assets/beta_images/inactive_notification.svg'),
  notificationClose: require('../assets/beta_images/notification_close.svg'),
  notificationAlert: require('../assets/beta_images/notification_alert.svg'),
  notificationClock: require('../assets/beta_images/notification_clock.svg'),
  notificationTest: require('../assets/beta_images/notification_test.svg'),
  notificationCheckbox: require('../assets/beta_images/notification_checkbox.svg'),
  notificationForward: require('../assets/beta_images/notification_forward.svg'),
  timelineArrow: require('../assets/beta_images/timeline_arrow.svg'),
  clock: require('../assets/beta_images/clock.svg'),
  liveCalendar: require('../assets/beta_images/live_calendar.svg'),
  liveCorrect: require('../assets/beta_images/live_correct.svg'),
  tomorrowLive: require('../assets/beta_images/tomorrow_live.svg'),
  calendarEmpty: require('../assets/beta_images_1/calender.svg'),
  refreshIcon: require('../assets/beta_images_1/refresh.svg'),
};

interface SvgLoaderProps {
  svgFilePath: keyof typeof svgAssets;
  width?: number;
  height?: number;
  style?: any;
  resizeMode?: string;
  /** When set, recolors SVG stroke/fill hex values (UI active states). */
  color?: string;
}

const applySvgColor = (xml: string, color: string) =>
  xml
    .replace(/stroke="#[0-9A-Fa-f]{3,8}"/g, `stroke="${color}"`)
    .replace(/fill="#[0-9A-Fa-f]{3,8}"/g, `fill="${color}"`)
    .replace(/stroke='#[0-9A-Fa-f]{3,8}'/g, `stroke='${color}'`)
    .replace(/fill='#[0-9A-Fa-f]{3,8}'/g, `fill='${color}'`);

const SvgLoader: React.FC<SvgLoaderProps> = ({
  svgFilePath,
  width = 100,
  height = 100,
  style,
  resizeMode,
  color,
  ...rest
}) => {
  const [uri, setUri] = useState<string | null>(null);
  const [xml, setXml] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const asset = svgAssets[svgFilePath];
    const assetInstance = Asset.fromModule(asset);

    assetInstance.downloadAsync().then(async () => {
      if (cancelled) return;
      const localUri = assetInstance.localUri;
      setUri(localUri);

      if (color && localUri) {
        const response = await fetch(localUri);
        const rawXml = await response.text();
        if (!cancelled) setXml(applySvgColor(rawXml, color));
      } else {
        setXml(null);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [svgFilePath, color]);

  if (color) {
    if (!xml) return null;
    return <SvgXml width={width} height={height} xml={xml} style={[style]} {...rest} />;
  }

  if (!uri) {
    return null;
  }

  return <SvgUri width={width} height={height} uri={uri} style={[style]} {...rest} />;
};

export default SvgLoader;
