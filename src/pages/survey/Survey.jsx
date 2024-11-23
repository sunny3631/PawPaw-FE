import { useNavigate, useParams } from "react-router-dom";
import Layout from "../../components/common/Layout";
import * as S from "./SurveyStyle";
import SurveyIcon from "../../img/SurveyIcon.png";

import { useEffect, useState } from "react";
import { getChildSurveyList, getChildSurveyDetail } from "../../api/SurveyApi";
import { child } from "../../api/child";

const Survey = ({ accessToken }) => {
  const params = useParams();
  accessToken = ``;
  // const params = { childAddress: 1 };
  // console.log(params);
  const navigate = useNavigate();

  const [information, setInformation] = useState({
    name: "",
    age: "",
    imgUrl: "",
  });

  const [surveyList, setSurveyList] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    // Fetch child information
    const fetchChildData = async () => {
      try {
        const response = await child.return(params.childId);
        console.log(params.childId);

        if (response.data.isSuccess) {
          setInformation({
            name: response.data.result.name,
            age: response.data.result.birthDate,
            imgUrl: response.data.result.profile,
          });
        }
      } catch (error) {
        console.error("아이 정보 조회 실패:", error);
        setErrorMessage("아이 정보를 불러오는 중 오류가 발생했습니다.");
      }
    };

    // Fetch survey list
    const fetchSurveys = async () => {
      try {
        const surveys = await getChildSurveyList(params.childId, accessToken);
        console.log("Surveys:", surveys); // 데이터를 확인
        setSurveyList(surveys);
      } catch (error) {
        console.error(
          "API 호출 중 오류 발생:",
          error.response || error.message
        );
        setErrorMessage(
          error.response?.data?.message || "오류가 발생했습니다."
        );
      }
    };
    if (params.childId) {
      fetchChildData();
      fetchSurveys();
    }
  }, [params.childId, accessToken]);

  const handleSurveyClick = async (surveyId) => {
    try {
      const surveyDetail = await getChildSurveyDetail(surveyId, accessToken);

      console.log("Survey Detail:", surveyDetail);

      navigate(`/surveyQuestion`, {
        state: {
          surveyId: surveyId,
          initialIdx: 0,
          canEdit: false,
          initialScores: new Array(40).fill(0),
        },
      });
    } catch (error) {
      console.error("검사 세부 정보 조회 실패:", error);
      setErrorMessage("검사 세부 정보를 불러오는 중 오류가 발생했습니다.");
    }
  };

  return (
    <Layout
      name={information.name}
      age={information.age}
      imgUrl={information.imgUrl}
    >
      <S.Container>
        <h2>{information.name}의 검사지</h2>
        {errorMessage && <div>{errorMessage}</div>}
        <S.TestList>
          {surveyList.map((survey) => (
            <S.TestItem
              key={survey.surveyId}
              onClick={() => handleSurveyClick(survey.surveyId)}
            >
              <div className="icon">
                <img src={SurveyIcon} alt="Icon" />
              </div>
              <div>
                <div className="title">{survey.title}</div>
                <div className="date">검사 일자: {survey.surveyDate}</div>
              </div>
              <div className="info">{survey.description}</div>
            </S.TestItem>
          ))}
        </S.TestList>
        <S.SurveyButton onClick={() => navigate("/surveyList")}>
          검사하기
        </S.SurveyButton>
      </S.Container>
    </Layout>
  );
};

export default Survey;
