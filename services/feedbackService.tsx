import apiRequest from '../utils/api';
import { SUBMIT_FEEDBACK } from '../utils/apiRoutes';

const submitFeedback = async (body: FormData, userToken: string | null) => {
  return await apiRequest(SUBMIT_FEEDBACK, 'POST', body, userToken, true);
};

export default {
  submitFeedback,
};
