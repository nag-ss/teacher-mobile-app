import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { useSelector } from 'react-redux';

type Option = { label: string; value: string };

const ClassOverviewFilters = () => {
  const { liveClass } = useSelector((state: any) => state.classes);

  const [gradeOpen, setGradeOpen] = useState(false);
  const [sectionOpen, setSectionOpen] = useState(false);
  const [studentsOpen, setStudentsOpen] = useState(false);

  const gradeOptions: Option[] = useMemo(
    () => [
      { label: 'VII', value: 'VII' },
      { label: 'VIII', value: 'VIII' },
      { label: 'IX', value: 'IX' },
      { label: 'X', value: 'X' },
    ],
    []
  );

  const sectionOptions: Option[] = useMemo(
    () => [
      { label: 'A', value: 'A' },
      { label: 'B', value: 'B' },
      { label: 'C', value: 'C' },
    ],
    []
  );

  const studentOptions: Option[] = useMemo(
    () => [
      { label: 'All', value: 'all' },
      { label: 'Active', value: 'active' },
      { label: 'Inactive', value: 'inactive' },
    ],
    []
  );

  const [selectedGrade, setSelectedGrade] = useState<string>(liveClass?.division_name ?? 'VII');
  const [selectedSection, setSelectedSection] = useState<string>(liveClass?.section_name ?? 'A');
  const [selectedStudents, setSelectedStudents] = useState<string>('all');

  useEffect(() => {
    if (liveClass?.division_name) setSelectedGrade(liveClass.division_name);
    if (liveClass?.section_name) setSelectedSection(liveClass.section_name);
  }, [liveClass]);

  return (
    <View style={styles.container}>
      <View style={[styles.field, { zIndex: 30 }]}>
        <Text style={styles.label}>Grade</Text>
        <Text style={styles.colon}>:</Text>
        <View style={styles.pickerWrap}>
          <DropDownPicker
            open={gradeOpen}
            value={selectedGrade}
            items={gradeOptions}
            setOpen={setGradeOpen}
            setValue={setSelectedGrade}
            onOpen={() => {
              setSectionOpen(false);
              setStudentsOpen(false);
            }}
            style={styles.picker}
            dropDownContainerStyle={styles.dropDownContainer}
            textStyle={styles.pickerText}
            placeholder="VII"
            listMode="SCROLLVIEW"
          />
        </View>
      </View>

      <View style={[styles.field, { zIndex: 20 }]}>
        <Text style={styles.label}>Section</Text>
        <Text style={styles.colon}>:</Text>
        <View style={styles.pickerWrap}>
          <DropDownPicker
            open={sectionOpen}
            value={selectedSection}
            items={sectionOptions}
            setOpen={setSectionOpen}
            setValue={setSelectedSection}
            onOpen={() => {
              setGradeOpen(false);
              setStudentsOpen(false);
            }}
            style={styles.picker}
            dropDownContainerStyle={styles.dropDownContainer}
            textStyle={styles.pickerText}
            placeholder="A"
            listMode="SCROLLVIEW"
          />
        </View>
      </View>

      <View style={[styles.field, { zIndex: 10 }]}>
        <Text style={styles.label}>Students</Text>
        <Text style={styles.colon}>:</Text>
        <View style={styles.pickerWrap}>
          <DropDownPicker
            open={studentsOpen}
            value={selectedStudents}
            items={studentOptions}
            setOpen={setStudentsOpen}
            setValue={setSelectedStudents}
            onOpen={() => {
              setGradeOpen(false);
              setSectionOpen(false);
            }}
            style={styles.picker}
            dropDownContainerStyle={styles.dropDownContainer}
            textStyle={styles.pickerText}
            placeholder="All"
            listMode="SCROLLVIEW"
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom: 8,
    paddingHorizontal: 6,
    zIndex: 50,
  },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  label: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 14,
    color: '#111',
  },
  colon: {
    marginHorizontal: 6,
    fontSize: 16,
    color: '#555',
  },
  pickerWrap: {
    flex: 1,
    maxWidth: 120,
  },
  picker: {
    borderColor: 'lightgray',
    borderRadius: 6,
    minHeight: 34,
    height: 34,
  },
  dropDownContainer: {
    borderColor: 'lightgray',
  },
  pickerText: {
    fontSize: 12,
    color: '#111',
  },
});

export default ClassOverviewFilters;
