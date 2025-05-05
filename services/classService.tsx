import apiRequest from '../utils/api';
import { GET_LIVE_CLASS, GET_SCHEDULE_CLASSES } from '../utils/apiRoutes'
import moment from 'moment';

const getLiveClass = async (reqData: any, userToken: string) => {
    const reqUrl = GET_LIVE_CLASS + '?date='+moment(new Date()).format('YYYY-MM-DD')
    console.log(reqUrl)
  return await apiRequest(reqUrl, 'GET', reqData, userToken);
};

const getScheduleClasses = async (reqData: any, userToken: string) => {
    const reqUrl = GET_SCHEDULE_CLASSES + '?date='+moment(new Date()).format('YYYY-MM-DD')
    // const reqUrl = GET_SCHEDULE_CLASSES + '?date=2025-05-03'
    // const reqUrl = 'class_management/get_teacher_schedule?date=2025-05-03'
  return await apiRequest(reqUrl, 'GET', reqData, userToken);
};

const authService = {
    getLiveClass,
    getScheduleClasses
};

export default authService;
