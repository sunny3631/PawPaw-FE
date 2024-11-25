import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import styled from "styled-components";
import SurveyIcon from "../../img/SurveyIcon.png";
import Navigation from "../../components/common/Navigation.jsx";
import { getSurveyList } from "../../api/SurveyApi.jsx";

const SurveyList = () => {
  const navigate = useNavigate();
  const params = useParams();

  const childId = params.id;

  const [activate, setActivate] = useState();
  const [surveyList, setSurveyList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 서버에서 문진표 목록 데이터를 가져오는 함수
  const fetchSurveyList = async () => {
    try {
      setLoading(true);
      const data = await getSurveyList();

      const guraData = [
        {
          surveyId: 5,
          title: "발달 선별 검사 5차",
          minAgeMonths: 12,
          maxAgeMonths: 13,
        },
        {
          surveyId: 6,
          title: "발달 선별 검사 6차",
          minAgeMonths: 14,
          maxAgeMonths: 15,
        },
        {
          surveyId: 7,
          title: "발달 선별 검사 7차",
          minAgeMonths: 16,
          maxAgeMonths: 17,
        },
        {
          surveyId: 8,
          title: "발달 선별 검사 8차",
          minAgeMonths: 18,
          maxAgeMonths: 19,
        },
      ];
      setSurveyList(data.concat(guraData));
    } catch (err) {
      setError("데이터를 불러오는데 실패했습니다.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSurveyList();
    // setLoading(false);
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
                  onClick={() => {
                    if (idx > 3) return;

                    navigate(`/surveyQuestion/${childId}`, {
                      state: {
                        surveyId: survey.surveyId,
                        initialIdx: 0,
                        canEdit: true,
                        initialScores: new Array(40).fill(0),
                      },
                    });
                  }}
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

const LayoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 860px;
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
