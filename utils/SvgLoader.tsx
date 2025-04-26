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
//   icon: require('../../assets/images/icon.svg'),
//   background: require('../../assets/images/background.svg'),
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
