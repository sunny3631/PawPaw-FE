import { useNavigate, useParams } from "react-router-dom";
import Layout from "../../components/common/Layout";
import * as S from "./SurveyStyle";
import SurveyIcon from "../../img/SurveyIcon.png";

import { useEffect, useState } from "react";
import { getChildSurveyList, getChildSurveyDetail } from "../../api/SurveyApi";
import { child } from "../../api/child";

const Survey = () => {
  const params = useParams();
  const navigate = useNavigate();
  const childAddress = params.childAddress ? params.childAddress : "sumin_test";
  const childId = params.id ? params.id : 12;
  // console.log(childAddress, child);
  // debugger;
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
        const response = await child.return(childId);

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
        const data = await getChildSurveyList(childId);

        setSurveyList(data.surveys);
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
    if (childId) {
      fetchChildData();
      fetchSurveys();
    }
  }, [childId]);

  const handleSurveyClick = async (childSurveyId) => {
    try {
      // 기검사내역들
      navigate(`/SurveyResult/${childSurveyId}`, {
        state: {
          childId: childId,
          // initialIdx: 0,
          // canEdit: false,
          // initialScores: new Array(40).fill(0),
        },
      });
    } catch (error) {
      console.error("검사 세부 정보 조회 실패:", error);
      setErrorMessage("검사 세부 정보를 불러오는 중 오류가 발생했습니다.");
    }
  };

  return (
    <Layout childID={childId} childAddress={childAddress}>
      <S.Container>
        <h2>{information.name}의 검사지</h2>
        {errorMessage && <div>{errorMessage}</div>}
        <S.TestList>
          {surveyList.map((survey, idx) => (
            <S.TestItem
              key={idx}
              onClick={() => handleSurveyClick(survey.childSurveyId)}
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
        <S.SurveyButton onClick={() => navigate(`/surveyList/${childId}`)}>
          검사하기
        </S.SurveyButton>
      </S.Container>
    </Layout>
  );
};

export default Survey;
