import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface ProgressBarProps {
  progress: number; 
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
  const getSegmentColor = (index: number) => {
    if (progress >= (index + 1) * 10) {
      return '#21C17C'; 
    } else if (progress >= index * 10) {
      return '#FFB61D'; 
    } else {
      return 'lightgray'; 
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Syllabus Completed - {progress}%</Text>
      <View style={styles.progressBar}>
        {[...Array(10)].map((_, index) => (
          <View
            key={index}
            style={[
              styles.segment,
              {borderTopLeftRadius: index == 0 ? 5 : 0},
              {borderBottomLeftRadius: index == 0 ? 5 : 0},
              {borderTopRightRadius: index == 9 ? 5 : 0},
              {borderBottomRightRadius: index == 9 ? 5 : 0},
              { backgroundColor: getSegmentColor(index) },
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // width: '80%',
    padding: 15,
    // alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'lightgray',
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 1 },
    // shadowOpacity: 0.1,
    // shadowRadius: 2,
    // elevation: 5,
  },
  text: {
    fontSize: 16,
    marginBottom: 10,
    color: '#333',
    fontWeight: 'bold'
  },
  progressBar: {
    flexDirection: 'row',
    width: '100%',
    height: 18,
    borderRadius: 5,
    overflow: 'hidden',
  },
  segment: {
    flex: 1,
    margin: 1,
    // borderRadius: 5
  },
});

export default ProgressBar;
