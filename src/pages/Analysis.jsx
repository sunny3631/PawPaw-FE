import { useParams } from "react-router-dom";
import styled from "styled-components";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  ResponsiveContainer,
} from "recharts";

import Layout from "../components/common/Layout";

const Analysis = () => {
  const { childAddress, childID } = useParams();

  const data = [
    { area: "대근육", child: 2.5, avg: 2.1 },
    { area: "소근육", child: 2.3, avg: 2.4 },
    { area: "인지", child: 2.1, avg: 2.2 },
    { area: "언어", child: 1.8, avg: 2.3 },
    { area: "사회성", child: 2.4, avg: 2.0 },
  ];

  const summary = {
    totalAreas: 5,
    belowNormal: 0,
    normal: 5,
  };

  return (
    <Layout childAddress={childAddress} childID={childID}>
      <Container>
        <SectionContainer>
          <Title>아동 발달 평가 차트</Title>
          <ChartSection>
            <ResponsiveContainer width="100%" height={400}>
              <RadarChart data={data}>
                <PolarGrid gridType="polygon" />
                <PolarAngleAxis dataKey="area" tick={{ fill: "#374151" }} />
                <PolarRadiusAxis angle={90} domain={[0, 3]} />
                <Radar
                  name="아동 점수"
                  dataKey="child"
                  stroke="#FFA5A5"
                  fill="#FFA5A5"
                  fillOpacity={0.3}
                />
                <Radar
                  name="전체 평균"
                  dataKey="avg"
                  stroke="#A5B6FF"
                  fill="#A5B6FF"
                  fillOpacity={0.3}
                />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </ChartSection>
        </SectionContainer>

        <SectionContainer>
          <Title>분석 결과</Title>
          <AnalysisSection>
            <SummaryGrid>
              <SummaryItem>
                <SummaryLabel>전체</SummaryLabel>
                <SummaryValue>{summary.totalAreas}</SummaryValue>
              </SummaryItem>
              <SummaryItem>
                <SummaryLabel>부족</SummaryLabel>
                <SummaryValue>{summary.belowNormal}</SummaryValue>
              </SummaryItem>
              <SummaryItem>
                <SummaryLabel>정상</SummaryLabel>
                <SummaryValue>{summary.normal}</SummaryValue>
              </SummaryItem>
            </SummaryGrid>

            <ScoreList>
              {data.map((item) => {
                const difference = (item.child - item.avg).toFixed(2);
                const isPositive = difference > 0;
                return (
                  <ScoreItem key={item.area}>
                    <AreaName>{item.area}</AreaName>
                    <ScoreInfo>
                      <Score>{item.child.toFixed(1)}점</Score>
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
    </Layout>
  );
};

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

const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
  margin-bottom: 1.5rem;
`;

const SummaryItem = styled.div`
  background-color: rgba(255, 255, 255, 0.5);
  border-radius: 0.5rem;
  text-align: center;
`;

const SummaryLabel = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 0.25rem;
`;

const SummaryValue = styled.p`
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
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

const Score = styled.span`
  font-weight: 500;
  color: #374151;
`;

const Difference = styled.span`
  font-weight: 500;
  min-width: 3rem;
  text-align: right;
  color: ${(props) => (props.$isPositive ? "#059669" : "#DC2626")};
`;

export default Analysis;
