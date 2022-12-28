import {axiosClient} from "./axiosClient";

export const getListQuizAPI = ({ page = 1, limit = 10 }) => {
  return axiosClient.get(`/quiz/all/available`);
};

export const getListExpiredQuizAPI = () => {
  return axiosClient.get(`/quiz/all/expired`);
};

export const getNotRegisterChildAPI = () => {
  return axiosClient.get(`/quiz/all/not-registered-child`);
};

export const createQuizAPI = data => {
  return axiosClient.post(`quiz`, data);
};

export const getQuizInfoAPI = ({ id }) => {
  return axiosClient.get(`quiz/${id}`);
};


// api for pratice
export const getListPraticeAPI = () => {
  return axiosClient.get(`/quiz/practice`);
};

export const getPracticeIdAPI = ({quizId, userId}) => {
  return axiosClient.get(`/practice/${quizId}/${userId}`);
}

export const getPracticeHistoryAPI = ({combinedId}) => {
  return axiosClient.get(`/practice/get-practice-by-id/${combinedId}`);
}
