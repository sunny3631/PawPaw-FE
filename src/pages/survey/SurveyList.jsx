import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import styled from "styled-components";
import SurveyIcon from "../../img/SurveyIcon.png";
import Navigation from "../../components/common/Navigation.jsx";
import { getSurveyList } from "../../api/SurveyApi.jsx";

const SurveyList = () => {
  const navigate = useNavigate();

  const [activate, setActivate] = useState();
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 서버에서 문진표 목록 데이터를 가져오는 함수
  const fetchSurveyList = async () => {
    try {
      setLoading(true);
      const data = await getSurveyList();
      setSurveyList(data);
    } catch (err) {
      setError("데이터를 불러오는데 실패했습니다.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // fetchSurveyList();
    setLoading(false);
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <>
      <LayoutContainer>
        <Header>
          <BackButton onClick={() => navigate(-1)}>←</BackButton>
          <div className="text">검사지 목록</div>
        </Header>
        <Content>
          <TestList>
            {surveyList.map((survey, idx) => {
              return (
                <TestItem
                  key={survey.surveyId}
                  onClick={() =>
                    navigate("/surveyQuestion", {
                      state: {
                        surveyId: survey.surveyId,
                        initialIdx: 0,
                        canEdit: true,
                        initialScores: new Array(40).fill(0),
                      },
                    })
                  }
                >
                  <Card
                    title={survey.title}
                    minAgeMonths={survey.minAgeMonths}
                    maxAgeMonths={survey.maxAgeMonths}
                    idx={idx}
                  />
                </TestItem>
              );
            })}
          </TestList>

          <NavigationWrapper>
            <Navigation activate={activate} setActivate={setActivate} />
          </NavigationWrapper>
        </Content>
      </LayoutContainer>
    </>
  );
};

export const Card = ({ title, minAgeMonths, maxAgeMonths, idx }) => {
  return (
    <CardContainer>
      <div className="icon">
        <img src={SurveyIcon} alt="Icon" />
      </div>

      <div className="title">{title || `발달 선별 검사 ${idx + 1}차`}</div>
      <div className="info">
        생후 {minAgeMonths} ~ {maxAgeMonths}개월
      </div>
    </CardContainer>
  );
};

// 스타일 컴포넌트
const LayoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f9f9f9;
`;

const Header = styled.div`
  padding: 20px;
  font-size: 20px;
  font-weight: bold;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
`;

const Content = styled.div`
  flex: 1;
  overflow-y: auto;
`;

const TestList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 20px;
`;

const TestItem = styled.div`
  background: #fff;
  border-radius: 10px;
  padding: 15px;
  cursor: pointer;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
`;

const CardContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;

  .icon {
    margin-bottom: 10px;
  }

  .title {
    font-size: 16px;
    font-weight: bold;
  }

  .info {
    font-size: 14px;
    color: #666;
  }
`;

const NavigationWrapper = styled.div`
  position: fixed;
  bottom: 0;
  width: 100%;
`;

export default SurveyList;
