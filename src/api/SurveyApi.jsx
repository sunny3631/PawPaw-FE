import { api } from "./instance/userInstance";
import axios from "axios";

// const api = axios.create({
//   baseURL: "http://3.37.62.216",
//   headers: {
//     Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIzIiwiYXV0aCI6IlJPTEVfVVNFUiIsImV4cCI6MTczMjU4OTMxMH0.XEGssc-J_vWYBa4m5QO4F47x60gxz47gP0eZOKpip1M`,
//   },
// });

//문진표 검사지 목록 조회
const getSurveyList = async () => {
  try {
    const { data } = await api.get("/api/surveys");
    if (data.isSuccess) {
      return data.result;
    } else {
      throw new Error(data.message || "데이터를 불러오지 못했습니다.");
    }
  } catch (error) {
    console.error("API 호출 중 오류 발생:", error);
    throw error;
  }
};

//문진표 검사지 문항 조회
const getSurveyDetail = async (surveyId) => {
  try {
    const { data } = await api.get(`/api/surveys/${surveyId}`);
    if (data.isSuccess) {
      return data.result;
    } else {
      throw new Error(data.message || "데이터를 불러오지 못했습니다.");
    }
  } catch (error) {
    console.error("API 호출 중 오류 발생:", error);
    throw error;
  }
};

//아이 문진표 검사 내역 목록 조회
const getChildSurveyList = async (childId) => {
  try {
    const { data } = await api.get(`/api/children/${childId}/surveys`);
    if (data.isSuccess) {
      return data.result;
    } else {
      throw new Error(data.message || "데이터를 불러오지 못했습니다.");
    }
  } catch (error) {
    console.error("API 호출 중 오류 발생:", error);
    throw error;
  }
};

//아이 문진표 검사 내역 상세 조회
const getChildSurveyDetail = async (childSurveyId) => {
  try {
    const { data } = await api.get(`/api/childSurveys/${childSurveyId}`);
    if (data.isSuccess) {
      return data.result;
    } else {
      throw new Error(data.message || "데이터를 불러오지 못했습니다.");
    }
  } catch (error) {
    console.error("API 호출 중 오류 발생:", error);
    throw error;
  }
};

//아이 문진표 검사 영역별 응답 내용 조회
const getCategoryResponse = async (childSurveyId, categoryCode) => {
  try {
    const { data } = await api.get(
      `/api/childSurveys/${childSurveyId}/categories/${categoryCode}`
    );
    if (data.isSuccess) {
      return data.result;
    } else {
      throw new Error(data.message || "데이터를 불러오지 못했습니다.");
    }
  } catch (error) {
    console.error("API 호출 중 오류 발생:", error);
    throw error;
  }
};

//문진표 검사 등록
const postSurvey = async (childId, surveyId, data) => {
  try {
    const requestData = {
      surveyResponses: data,
    };
    console.log(requestData);

    const response = await api.post(
      `/api/children/${childId}/surveys/${surveyId}`,
      requestData
    );

    if (response.data.isSuccess) {
      return response.data.result;
      debugger;
    } else {
      throw new Error(
        response.data.message || "설문 데이터를 저장할 수 없습니다."
      );
    }
  } catch (error) {
    console.error("API 호출 중 오류 발생:", error);
    throw error;
  }
};

//아이 건강 정보 조회
const getChildHealth = async (childId) => {
  try {
    const { data } = await api.get(`/api/children/${childId}/health`);
    if (data.isSuccess) {
      return data.result;
    } else {
      throw new Error(data.message || "건강 정보를 불러오지 못했습니다.");
    }
  } catch (error) {
    console.error("API 호출 중 오류 발생:", error);
    throw error;
  }
};

export {
  getSurveyList,
  getSurveyDetail,
  getChildSurveyList,
  getChildSurveyDetail,
  getCategoryResponse,
  postSurvey,
  getChildHealth,
};
