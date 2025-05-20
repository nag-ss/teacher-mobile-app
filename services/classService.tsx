import apiRequest from '../utils/api';
import { GET_LIVE_CLASS, GET_SCHEDULE_CLASSES, ADD_TASK_TO_TEACHER_CLASS, GET_TEACHER_CLASS_TASKS } from '../utils/apiRoutes'
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
  const class_id = 87 // My school (Super School)
  const teacher_id = 1 // Daljit Singh
  const division_id = 1
  const subject_id = 1
  const reqUrl = GET_TEACHER_CLASS_TASKS + `?class_schedule_id=${class_id}&teacher_id=${teacher_id}&division_id=${division_id}&subject_id=${subject_id}`;
  return await apiRequest(reqUrl, 'GET', reqData, userToken);
};

const addTaskToClass = async(reqData: any, userToken: string) => {
  const data = {title: "Quiz Sample 211",
    task_type: "SlipTest",
    start_date: "2025-05-19",
    end_date: "2025-05-19",
    instructions: {
      text: {
        Q1: "How to generate Quiz"
      }
    },
    subject_id: 1,
    teacher_id: 1,
    division_id: 43,
    class_schedule_id: 98,
    quiz: {
      title: "Linear Eq Quiz 764",
      start_date: "2025-05-19T20:00:00",
      duration: 30,
      is_auto: true,
      asset_link: {
        sample_link: {
          l1: "www.google.com"
        }
      },
      topic: "Linear Equations",
      sub_topic: "Introduction",
      skills: {
        skill_1: {
          s1: "Level 1 Xyz"
        }
      },
      quiz_type: "SlipTest",
      is_public: true,
      difficulty_id: 1,
      school_id: 1,
      division_id: 43,
      subject_id: 1,
      is_notified: false
    }
  }
  
  
  console.log(data)
  console.log(userToken);
  const reqUrl = ADD_TASK_TO_TEACHER_CLASS
  return await apiRequest(reqUrl, 'POST', data, userToken);
}

const authService = {
    getLiveClass,
    getScheduleClasses,
    addTaskToClass,
    getTeacherClassTasks
};

export default authService;
