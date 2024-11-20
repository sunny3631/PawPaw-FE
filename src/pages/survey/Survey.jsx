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
    name: "test",
    age: "22months",
    imgUrl: "",
  });
  const [surveyList, setSurveyList] = useState([
    {
      surveyId: 1,
      title: "발달 선별 검사 1차",
      minAgeMonths: 4,
      maxAgeMonths: 5,
    },
    {
      surveyId: 2,
      title: "발달 선별 검사 2차",
      minAgeMonths: 6,
      maxAgeMonths: 7,
    },
    {
      surveyId: 3,
      title: "발달 선별 검사 3차",
      minAgeMonths: 8,
      maxAgeMonths: 9,
    },
    {
      surveyId: 4,
      title: "발달 선별 검사 4차",
      minAgeMonths: 10,
      maxAgeMonths: 11,
    },
    {
      surveyId: 5,
      title: "발달 선별 검사 5차",
      minAgeMonths: 12,
      maxAgeMonths: 13,
    },
  ]);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    // Fetch child information
    const fetchChildData = async () => {
      try {
        const response = await child.return(params.childAddress);

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
        const surveys = await getChildSurveyList(
          params.childAddress,
          accessToken
        );
        setSurveyList(surveys);
      } catch (error) {
        console.error("검사 목록 조회 실패:", error);
        setErrorMessage("검사 목록을 불러오는 중 오류가 발생했습니다.");
      }
    };

    if (params.childAddress) {
      fetchChildData();
      fetchSurveys();
    }
  }, [params.childAddress, accessToken]);

  const handleSurveyClick = async (surveyId) => {
    try {
      // const surveyDetail = await getChildSurveyDetail(surveyId, accessToken);
      // const surveyDetail = {};
      // console.log("Survey Detail:", surveyDetail);
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
        <S.SurveyTitle>{information.name}의 검사지</S.SurveyTitle>
        {errorMessage && <div>{errorMessage}</div>}
        <S.TestList>
          {surveyList.map((survey) => (
            <div>
              <S.TestItem
                key={survey.id}
                onClick={() => handleSurveyClick(survey.id)}
              >
                <div className="icon">
                  <img src={SurveyIcon} alt="Icon" />
                </div>
                <div>
                  <div className="title">{survey.title}</div>
                  <div className="date">검사 일자: {survey.date}</div>
                </div>
                <div className="info">{survey.description}</div>
              </S.TestItem>
            </div>
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
