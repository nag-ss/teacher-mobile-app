import apiRequest from '../utils/api';
import { GET_LIVE_CLASS, GET_SCHEDULE_CLASSES, ADD_TASK_TO_TEACHER_CLASS, GET_TEACHER_CLASS_TASKS, DELETE_TEACHER_CLASS_TASK } from '../utils/apiRoutes'
import moment from 'moment';

const getLiveClass = async (reqData: any, userToken: string) => {
  // const date = moment(new Date()).format('YYYY-MM-DD');
  // const reqUrl = GET_LIVE_CLASS + `?date=${date}`;
  const reqUrl = GET_LIVE_CLASS + '?date=2025-05-14'
  console.log(reqUrl)
  return await apiRequest(reqUrl, 'GET', reqData, userToken);
};

const getScheduleClasses = async (reqData: any, userToken: string) => {
    // const date = moment(new Date()).format('YYYY-MM-DD');
    // const reqUrl = GET_SCHEDULE_CLASSES + `?date=${date}`;
    const reqUrl = GET_SCHEDULE_CLASSES + '?date=2025-05-14'
    // const reqUrl = 'class_management/get_teacher_schedule?date=2025-05-03'
  return await apiRequest(reqUrl, 'GET', reqData, userToken);
};

const getTeacherClassTasks = async (reqData: any, userToken: string) => {
  const class_id = 98 // My school (Super School)
  const teacher_id = 1 // Daljit Singh
  const division_id = 43
  const subject_id = 1
  const reqUrl = GET_TEACHER_CLASS_TASKS + `?class_schedule_id=${class_id}&teacher_id=${teacher_id}&division_id=${division_id}&subject_id=${subject_id}`;
  return await apiRequest(reqUrl, 'GET', reqData, userToken);
};

const addTaskToClass = async(reqData: any, userToken: string) => {
  console.log(reqData)
  const reqUrl = ADD_TASK_TO_TEACHER_CLASS + "?provider=openai";
  return await apiRequest(reqUrl, 'POST', reqData, userToken);
}

const deleteTeacherClassTask = async(taskID: number, userToken: string) => {
  console.log(taskID);
  const reqUrl = `${DELETE_TEACHER_CLASS_TASK}/${taskID}`;
  return await apiRequest(reqUrl, 'DELETE', taskID, userToken);
}

const authService = {
    getLiveClass,
    getScheduleClasses,
    addTaskToClass,
    getTeacherClassTasks,
    deleteTeacherClassTask
};

export default authService;
