import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { useDispatch, useSelector } from 'react-redux';
import { setClassOverviewFilters } from '@/store/classSlice';
import { buildGradeOptions, buildSectionOptions } from './filterLogic';

type Option = { label: string; value: string };
type TeacherClassItem = {
  division?: {
    name?: string;
  };
};

const ClassOverviewFilters = () => {
  const dispatch = useDispatch();
  const { grade: selectedGrade = '', section: selectedSection = '', students: selectedStudents = 'all' } = useSelector(
    (state: any) => state.classes?.classOverviewFilters ?? {}
  );
  const teacherClasses: TeacherClassItem[] = useSelector((state: any) => state.user?.user?.classes ?? []);

  const [openDropdown, setOpenDropdown] = useState<'grade' | 'section' | 'students' | null>(null);
  const gradeOptions: Option[] = useMemo(() => buildGradeOptions(teacherClasses), [teacherClasses]);
  const sectionOptions: Option[] = useMemo(
    () => buildSectionOptions(teacherClasses, selectedGrade),
    [teacherClasses, selectedGrade]
  );

  const studentOptions: Option[] = useMemo(
    () => [
      { label: 'All', value: 'all' },
    ],
    []
  );

  useEffect(() => {
    if (!gradeOptions.length) return;
    const hasValidGrade = gradeOptions.some((item) => item.value === selectedGrade);
    if (hasValidGrade) return;
    const defaultGrade = gradeOptions[0].value;
    const defaultSections = buildSectionOptions(teacherClasses, defaultGrade);
    dispatch(
      setClassOverviewFilters({
        grade: defaultGrade,
        section: defaultSections[0]?.value ?? '',
      })
    );
  }, [dispatch, gradeOptions, selectedGrade]);

  return (
    <View style={styles.container}>
      <View style={[styles.field, { zIndex: 30 }]}>
        <Text style={styles.label}>Grade</Text>
        <Text style={styles.colon}>:</Text>
        <View style={styles.pickerWrap}>
          <DropDownPicker
            open={openDropdown === 'grade'}
            value={selectedGrade}
            items={gradeOptions}
            setOpen={(next: any) => {
              const open = typeof next === 'function' ? next(openDropdown === 'grade') : next;
              setOpenDropdown(open ? 'grade' : null);
            }}
            setValue={(callback: any) => {
              const value = typeof callback === 'function' ? callback(selectedGrade) : callback;
              dispatch(setClassOverviewFilters({ grade: value, section: '' }));
            }}
            style={styles.picker}
            dropDownContainerStyle={styles.dropDownContainer}
            textStyle={styles.pickerText}
            placeholder="Select"
            listMode="SCROLLVIEW"
          />
        </View>
      </View>

      <View style={[styles.field, { zIndex: 20 }]}>
        <Text style={styles.label}>Section</Text>
        <Text style={styles.colon}>:</Text>
        <View style={styles.pickerWrap}>
          <DropDownPicker
            open={openDropdown === 'section'}
            value={selectedSection}
            items={sectionOptions}
            setOpen={(next: any) => {
              const open = typeof next === 'function' ? next(openDropdown === 'section') : next;
              setOpenDropdown(open ? 'section' : null);
            }}
            setValue={(callback: any) => {
              const value = typeof callback === 'function' ? callback(selectedSection) : callback;
              dispatch(setClassOverviewFilters({ section: value }));
            }}
            style={styles.picker}
            dropDownContainerStyle={styles.dropDownContainer}
            textStyle={styles.pickerText}
            placeholder="Select"
            listMode="SCROLLVIEW"
          />
        </View>
      </View>

      <View style={[styles.field, { zIndex: 10 }]}>
        <Text style={styles.label}>Students</Text>
        <Text style={styles.colon}>:</Text>
        <View style={styles.pickerWrap}>
          <DropDownPicker
            open={openDropdown === 'students'}
            value={selectedStudents}
            items={studentOptions}
            setOpen={(next: any) => {
              const open = typeof next === 'function' ? next(openDropdown === 'students') : next;
              setOpenDropdown(open ? 'students' : null);
            }}
            setValue={(callback: any) => {
              const value = typeof callback === 'function' ? callback(selectedStudents) : callback;
              dispatch(setClassOverviewFilters({ students: value }));
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
