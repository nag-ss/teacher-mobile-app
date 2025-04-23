import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {Picker} from '@react-native-picker/picker';

const ClassGradeSelection = () => {
  const [selectedGrade, setSelectedGrade] = useState();
  const [selectedSection, setSelectedSection] = useState();
  // Options for the Grade and Section
  const gradeOptions = [
    { label: 'Grade VII', value: 'Grade VII' },
    { label: 'Grade VIII', value: 'Grade VIII' },
    { label: 'Grade IX', value: 'Grade IX' },
  ];

  const sectionOptions = [
    { label: 'Section A', value: 'Section A' },
    { label: 'Section B', value: 'Section B' },
    { label: 'Section C', value: 'Section C' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.dropdownContainer}>
        <Picker
            selectedValue={selectedGrade}
            onValueChange={(itemValue, itemIndex) =>
                setSelectedGrade(itemValue)
            }
            >
                {
                    gradeOptions.map((gradeData) => {
                        return (<Picker.Item style={{fontSize: 12}} label={gradeData.label} value={gradeData.value} />)
                    })
                }
        </Picker>
        </View>
        <View style={styles.dropdownContainer}>
        <Picker
            selectedValue={selectedSection}
            onValueChange={(itemValue, itemIndex) =>
                setSelectedSection(itemValue)
            }>
                {
                    sectionOptions.map((sectionData) => {
                        return (<Picker.Item style={{fontSize: 12}} label={sectionData.label} value={sectionData.value} />)
                    })
                }
        </Picker>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // justifyContent: 'center',
    // alignItems: 'center',
    flexDirection: 'row'
  },
  title: {
    fontSize: 20,
    marginBottom: 10,
  },
  dropdownContainer: {
    // flexDirection: 'row',
    justifyContent: 'space-around',
    width: '50%',
  },
  selectionText: {
    marginTop: 20,
    fontSize: 16,
    color: '#333',
  },
});

export default ClassGradeSelection;
