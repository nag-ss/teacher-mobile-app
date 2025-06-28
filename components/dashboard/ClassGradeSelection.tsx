import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {Picker} from '@react-native-picker/picker';
import DropDownPicker from 'react-native-dropdown-picker';

const ClassGradeSelection = () => {
  const [selectedGrade, setSelectedGrade] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);
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

  const [open, setOpen] = useState(false);
  const [gradeOpen, setGradeOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    { label: 'Option 1', value: 'option1' },
    { label: 'Option 2', value: 'option2' }
  ]);

  
  return (
    <View style={styles.container}>
      <View style={styles.dropdownContainer}>
        {/* <Picker
            selectedValue={selectedGrade}
            onValueChange={(itemValue, itemIndex) =>
                setSelectedGrade(itemValue)
            }
            >
                {
                    gradeOptions.map((gradeData) => {
                        return (<Picker.Item key={gradeData.label} style={{fontSize: 12}} label={gradeData.label} value={gradeData.value} />)
                    })
                }
        </Picker> */}
        <DropDownPicker
          placeholder="Select Grade"
          placeholderStyle={{ fontSize: 12 }}
          open={gradeOpen}
          value={selectedGrade}
          items={gradeOptions}
          setOpen={setGradeOpen}
          setValue={setSelectedGrade}
          // setItems={setItems}
          style={{
            borderColor: 'lightgray',      // 👉 Default border
            borderRadius: 8            // Optional: rounded corners
          }}
          dropDownContainerStyle={{
            borderColor: 'lightgray'       // 👉 Dropdown list border
          }}
        />
        </View>
        <View style={styles.dropdownContainer}>
        {/* <Picker
            selectedValue={selectedSection}
            onValueChange={(itemValue, itemIndex) =>
                setSelectedSection(itemValue)
            }>
                {
                    sectionOptions.map((sectionData) => {
                        return (<Picker.Item key={sectionData.label} style={{fontSize: 12}} label={sectionData.label} value={sectionData.value} />)
                    })
                }
        </Picker> */}
        <DropDownPicker
          placeholder="Select Section"
          placeholderStyle={{ fontSize: 11 }}
          open={open}
          value={selectedSection}
          items={sectionOptions}
          setOpen={setOpen}
          setValue={setSelectedSection}
          style={{
            borderColor: 'lightgray',      // 👉 Default border
            borderRadius: 8            // Optional: rounded corners
          }}
          dropDownContainerStyle={{
            borderColor: 'lightgray'       // 👉 Dropdown list border
          }}
          // setItems={setItems}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // justifyContent: 'center',
    // alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10
  },
  title: {
    fontSize: 20,
    marginBottom: 10,
  },
  dropdownContainer: {
    // flexDirection: 'row',
    justifyContent: 'space-between',
    width: '49%',
  },
  selectionText: {
    marginTop: 20,
    fontSize: 16,
    color: '#333',
  },
});

export default ClassGradeSelection;
