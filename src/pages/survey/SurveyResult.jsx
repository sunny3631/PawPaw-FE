import { useEffect, useState } from "react";
import {
  getCategoryResponse,
  getChildSurveyDetail,
  getSurveyAllResult,
} from "../../api/SurveyApi";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

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

  const [analysisData, setAnalysisData] = useState([]);

  const params = useParams();
  const childId = state.childId;

  const childSurveyId = params.childSurveyId;

  useEffect(() => {
    const fetchServeyResult = async () => {
      try {
        const data = await getChildSurveyDetail(childSurveyId);
        setSurveyResult(data);

        const analysisResult = await getSurveyAllResult(childSurveyId);

        // averageScore를 소수점 3자리로 반올림하여 number 타입으로 저장
        const processedAreas = analysisResult.areas.map((area) => ({
          ...area,
          averageScore: Number(area.averageScore.toFixed(3)),
        }));

        setAnalysisData(processedAreas);
        console.log(processedAreas);
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

          <Container>
            <SectionContainer>
              <Title>아동 발달 평가 차트</Title>
              <ChartSection>
                <ResponsiveContainer width="100%" height={400}>
                  <RadarChart data={analysisData}>
                    <PolarGrid gridType="polygon" />
                    <PolarAngleAxis
                      dataKey="category"
                      tick={{
                        fill: "#374151",
                        fontSize: "14px",
                      }}
                      tickFormatter={(value, index) => {
                        // 각 위치별로 줄바꿈 추가
                        if (value === "소근육운동") return "소근육";
                        if (value === "대근육운동") return "대근육";
                        return value;
                      }}
                      dy={4} // 약간의 여백 추가
                    />
                    <PolarRadiusAxis
                      angle={90}
                      domain={[0, 24]} // 최대값을 24로 설정
                      tick={{ fontSize: "12px" }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(255, 255, 255, 0.9)",
                        border: "none",
                        borderRadius: "8px",
                        padding: "10px",
                      }}
                      formatter={(value, name) => [
                        `${value.toFixed(1)}점`,
                        name === "childScore" ? "아동 점수" : "전체 평균",
                      ]}
                      labelFormatter={(label) => label} // category 이름
                    />
                    <Radar
                      name="아동 점수"
                      dataKey="childScore"
                      stroke="#FFA5A5"
                      fill="#FFA5A5"
                      fillOpacity={0.5}
                    />
                    <Radar
                      name="전체 평균"
                      dataKey="averageScore"
                      stroke="#A5B6FF"
                      fill="#A5B6FF"
                      fillOpacity={0.5}
                    />
                    <Legend
                      wrapperStyle={{
                        fontFamily: "'Noto Sans KR', sans-serif",
                      }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </ChartSection>
            </SectionContainer>

            <SectionContainer>
              <Title>분석 결과</Title>
              <AnalysisSection>
                <ScoreList>
                  {analysisData.map((item) => {
                    const difference = (
                      item.childScore - Number(item.averageScore.toFixed(3))
                    ).toFixed(2);
                    const isPositive = difference > 0;
                    return (
                      <ScoreItem key={item.category}>
                        <AreaName>{item.category}</AreaName>
                        <ScoreInfo>
                          <Scores>{item.childScore.toFixed(1)}점</Scores>
                          <Difference $isPositive={isPositive}>
                            {isPositive ? "+" : ""}
                            {difference}
                          </Difference>
                        </ScoreInfo>
                      </ScoreItem>
                    );
                  })}
                </ScoreList>
              </AnalysisSection>
            </SectionContainer>
          </Container>
        </Content>
      </LayoutContainer>
    </>
  );
};

export default SurveyResult;

const LayoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
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

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 32rem;
  padding: 30px;
  margin: 0 auto;
`;

const SectionContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 1rem;
`;

const Title = styled.span`
  font-size: 1.1rem;
  font-weight: 600;
  color: #1f2937;
  padding-left: 0.25rem;
`;

const ChartSection = styled.div`
  background-color: rgba(255, 255, 255, 0.3);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-radius: 16px;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const AnalysisSection = styled.div`
  background-color: rgba(255, 255, 255, 0.3);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-radius: 16px;
  padding: 1.25rem;
`;

const ScoreList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const ScoreItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  border-bottom: 1px solid #e5e7eb;

  &:last-child {
    border-bottom: none;
  }
`;

const AreaName = styled.span`
  font-weight: 500;
  color: #374151;
`;

const ScoreInfo = styled.div`
  display: flex;
  gap: 1.25rem;
  align-items: center;
`;

const Scores = styled.span`
  font-weight: 500;
  color: #374151;
`;

const Difference = styled.span`
  font-weight: 500;
  min-width: 3rem;
  text-align: right;
  color: ${(props) => (props.$isPositive ? "#059669" : "#DC2626")};
`;
