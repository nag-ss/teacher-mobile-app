import apiRequest from '../utils/api';
import { GET_CLASS_ATTENDANCE, GET_AI_TASK_CHECK, GET_CLASSWORK_CHECK, GET_SLIPTEST_CHECK } from '../utils/apiRoutes'
import moment from 'moment';

const getAttendance = async (reqData: any, userToken: string) => {
    const reqUrl = GET_CLASS_ATTENDANCE + '?class_schedule_id='+reqData.classId
    console.log(reqUrl)
  return await apiRequest(reqUrl, 'GET', reqData, userToken);
};

const getAITaskCheckResults = async (reqData: any, userToken: string) => {
    const reqUrl = GET_AI_TASK_CHECK + '?class_schedule_id='+reqData.classId
    console.log(reqUrl)
  return await apiRequest(reqUrl, 'GET', reqData, userToken);
};

const getClassworkResults = async (reqData: any, userToken: string) => {
    const reqUrl = GET_CLASSWORK_CHECK + '?class_schedule_id='+reqData.classId
    console.log(reqUrl)
  return await apiRequest(reqUrl, 'GET', reqData, userToken);
};

const getSlipTestResults = async (reqData: any, userToken: string) => {
    const reqUrl = GET_SLIPTEST_CHECK + '?class_schedule_id='+reqData.classId
    console.log(reqUrl)
  return await apiRequest(reqUrl, 'GET', reqData, userToken);
};

const liveMonitoringService = {
    getAttendance,
    getAITaskCheckResults,
    getClassworkResults,
    getSlipTestResults
};

export default liveMonitoringService;
