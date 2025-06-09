import apiRequest from '../utils/api';
import { 
  GET_LIVE_CLASS, 
  GET_SCHEDULE_CLASSES, 
  ADD_TASK_TO_TEACHER_CLASS, 
  GET_TEACHER_CLASS_TASKS, 
  DELETE_TEACHER_CLASS_TASK, 
  EDIT_TEACHER_CLASS_TASK, 
  QUIZ_GENERATION_STATUS,
  GET_QUIZ
} from '../utils/apiRoutes'
import moment from 'moment';

const RETRY_LIMIT = 5;
const RETRY_DELAY_MS = 10000;
const COMPLETED_STATUS = 'completed';
const FAILED_STATUS = 'failed';
const QUEUED_STATUS =   'queued';
const GENERATING_STATUS = 'generating';

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

const editTeacherClassTask = async(task: any, userToken: string) => {
  const id = task.id;
  delete task.id;
  delete task.instructions?.taskId;

  const reqUrl = `${EDIT_TEACHER_CLASS_TASK}/${id}`;
  
  return await apiRequest(reqUrl, 'PATCH', task, userToken);
}

const getSlipTestStatus = async(quiz_id: number, userToken: string) => {
  const reqUrl = `${QUIZ_GENERATION_STATUS}/${quiz_id}`;
  let attempt = 0;
  while(attempt < RETRY_LIMIT) {
    const response = await apiRequest(reqUrl, 'GET', quiz_id, userToken);
    if (response.status == 'completed'){
      return response;
    } else if (response.status == 'failed') {
      return response;
    } 
    attempt += 1;
    if (attempt < RETRY_LIMIT) {
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS));
    } 
  }
}

const addSlipTestToClass = async(quiz: any, userToken: string) => {
  console.log(quiz)
  const reqUrl = ADD_TASK_TO_TEACHER_CLASS + "?provider=openai";
  const quiz_task = await apiRequest(reqUrl, 'POST', quiz, userToken);
  const {quiz_id} = quiz_task;
  await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS));
  const statusUrl = `${QUIZ_GENERATION_STATUS}/${quiz_id}`;
  let attempt = 0;
  let status_response; 
  while(attempt < RETRY_LIMIT) {
    status_response = await apiRequest(statusUrl, 'GET', quiz_id, userToken);
    if (status_response.status == COMPLETED_STATUS){
      break;
    } else if (status_response.status == FAILED_STATUS) {
      return status_response;
    } 
    attempt += 1;
    if (attempt < RETRY_LIMIT) {
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS));
    } 
  }

  if (status_response.status == COMPLETED_STATUS) {
    const getQuizUrl = `${GET_QUIZ}/${quiz_id}`
    return await apiRequest(getQuizUrl, 'GET', quiz_id, userToken);
  }

  if(status_response.status == QUEUED_STATUS || status_response.status == GENERATING_STATUS) {
    return status_response;
  }

}

const authService = {
    getLiveClass,
    getScheduleClasses,
    addTaskToClass,
    getTeacherClassTasks,
    deleteTeacherClassTask,
    editTeacherClassTask,
    getSlipTestStatus, 
    addSlipTestToClass
};

export default authService;
