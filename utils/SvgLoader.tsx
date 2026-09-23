import React, { useEffect, useState } from 'react';
import { SvgUri } from 'react-native-svg'; // Import SvgUri for displaying SVGs
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
  sidebarLogo: require('../assets/beta_images/sidebar_logo.svg'),
  sidebarHome: require('../assets/beta_images/home.svg'),
  sidebarHomeActive: require('../assets/beta_images/home_active.svg'),
  sidebarClasses: require('../assets/beta_images/classes.svg'),
  sidebarClassesActive: require('../assets/beta_images/classes_active.svg'),
  sidebarCalendar: require('../assets/beta_images/calendar.svg'),
  sidebarCalendarActive: require('../assets/beta_images/calendar_active.svg'),
  sidebarAnalytics: require('../assets/beta_images/analytics.svg'),
  sidebarAnalyticsActive: require('../assets/beta_images/analytics_active.svg'),
  sidebarProfile: require('../assets/beta_images/profile.svg'),
  sidebarProfileActive: require('../assets/beta_images/profile_active.svg'),
  sidebarLogout: require('../assets/beta_images/sidebar_logout.svg'),
};

interface SvgLoaderProps {
  svgFilePath: keyof typeof svgAssets; // Only allow keys defined in svgAssets
  width?: number;
  height?: number;
  style?: any;
  resizeMode? : string
}

const SvgLoader: React.FC<SvgLoaderProps> = ({ svgFilePath, width = 100, height = 100, style, resizeMode, ...rest}) => {
  const [uri, setUri] = useState<string | null>(null);

  useEffect(() => {
    // Get the asset corresponding to the svgFilePath
    const asset = svgAssets[svgFilePath];
    const assetInstance = Asset.fromModule(asset); // Load the asset using expo-asset
    assetInstance.downloadAsync().then(() => {
      setUri(assetInstance.localUri); // Get the local URI of the asset
    });
  }, [svgFilePath]);

  if (!uri) {
    return null; // Or show a loading spinner, placeholder, etc.
  }

  return <SvgUri width={width} height={height} uri={uri} style={[style]} {...rest} />;
};

export default SvgLoader;
