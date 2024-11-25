import { useEffect, useState } from "react";
import { getCategoryResponse, getChildSurveyDetail } from "../../api/SurveyApi";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";

const SurveyResult = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [surveyResult, setSurveyResult] = useState({
    childSurveyId: 3,
    title: "발달 선별 검사 3차",
    surveyDate: "2024-10-27",
    ageAtSurvey: {
      months: 4,
      days: 3,
    },

    scores: [],
  });
  const params = useParams();
  const childId = state.childId;

  const childSurveyId = params.childSurveyId;

  useEffect(() => {
    const fetchServeyResult = async () => {
      try {
        const data = await getChildSurveyDetail(childSurveyId);
        setSurveyResult(data);
      } catch (error) {
        console.error("검사 결과 조회 실패:", error);
      }
    };
    if (childSurveyId) {
      fetchServeyResult();
    }
  }, [childSurveyId]);

  const handleResultClick = async (idx) => {
    const categoryCode = `CTG-00${idx + 1}`;
    const data = await getCategoryResponse(childSurveyId, categoryCode);
    const initialScores = data.surveyResponses;
    const regex = /[^0-9]/g;
    const surveyId = surveyResult.title.replace(regex, "");

    navigate(`/surveyQuestion/${childId}`, {
      state: {
        surveyId: surveyId,
        initialIdx: idx * 8,
        canEdit: false,
        initialScores: initialScores,
      },
    });
  };
  return (
    <>
      <LayoutContainer>
        <Header>
          <BackButton onClick={() => navigate(-1)}>←</BackButton>
          <div className="text">{surveyResult.title}</div>
        </Header>
        <Content>
          <InfoBox>
            <div className="text">검사 일자 : {surveyResult.surveyDate}</div>
            <div className="text">
              검사 당시 나이 : {surveyResult.ageAtSurvey.months}개월
              {surveyResult.ageAtSurvey.days}일
            </div>
          </InfoBox>
          <SurveyScoreContainer>
            <SurveyHeader>
              <div>항목</div>
              <div>점수</div>
              <div className="cutoff">최저 평균 최고</div>
            </SurveyHeader>
            {surveyResult.scores.map((el, idx) => (
              <SurveyRow key={idx} onClick={() => handleResultClick(idx)}>
                <Category>{el.category}</Category>
                <Score>{el.score}점</Score>
                <CutoffScores>
                  <div>{el.cutoffScores.low}</div>
                  <div>{el.cutoffScores.medium}</div>
                  <div>{el.cutoffScores.high}</div>
                </CutoffScores>
              </SurveyRow>
            ))}
          </SurveyScoreContainer>
        </Content>
      </LayoutContainer>
    </>
  );
};

export default SurveyResult;

const LayoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 150vh;
  background-color: #ffeccf;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  position: relative;
  font-size: 26px;
  background-color: #f9d49b;
  font-weight: bold;
  color: #333;
  height: 120px;
`;

const BackButton = styled.div`
  position: absolute;
  left: 16px;
  cursor: pointer;
`;

const Content = styled.div`
  flex: 1;
  overflow-y: auto;
  padding-top: 13px;
  padding-bottom: 60px;

  .text {
    align-items: center;
    font-size: 21px;
    padding-left: 20px;
    padding-bottom: 5px;
  }
`;

const SurveyScoreContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 15px;
  margin-top: 40px;
  background-color: #d4e3cc;
  border-radius: 10%;
  margin-left: 10px;
  margin-right: 10px;
`;

const InfoBox = styled.div`
  display: flex;
  flex-direction: column;

  padding: 10px;
  background-color: #3d849f;
  background: rgba(248, 246, 246, 0.65);
  border-radius: 5px;
  backface-visibility: 50%;

  .text {
    text-decoration-color: #f8f8f8;
  }
`;

const Category = styled.div`
  font-size: 20px;
  font-weight: bold;
  color: #5c4a4a;
`;

const Score = styled.div`
  font-size: 22px;
  color: #fe8a8a;
  font-weight: semi-bold;
`;

const CutoffScores = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 5px;
  text-align: center;
  font-size: 16px;
  font-weight: normal;
  color: #4f2304;

  div {
    padding: 10px;
  }
`;

const SurveyHeader = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 2fr;
  font-weight: bold;
  color: #4f2304;
  font-weight: semi-bold;
  text-align: center;
  font-size: 18px;
  padding: 10px 0;
  padding-bottom: 15px;
  border-bottom: 2px solid #9f877e;
  margin-bottom: 10px;

  .cutoff {
    gap: 20px;
  }
`;

const SurveyRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 2fr; /* 항목, 점수, 절단점 비율 */
  align-items: center;
  text-align: center;
  font-size: 16px;
  padding: 10px 0;

  &:hover {
    background-color: #c8e6c9; /* hover 효과 */
    cursor: pointer;
  }
`;
