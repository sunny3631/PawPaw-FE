import { useEffect, useState } from "react";
// import { SurveyText } from "../../";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import Navigation from "../../components/common/Navigation.jsx";
import SurveyInstruc from "../../img/SurveyInstruc.png";
import { getSurveyDetail } from "../../api/SurveyApi.jsx";
import { postSurvey } from "../../api/SurveyApi.jsx";

const SurveyQuestion = () => {
  const navigate = useNavigate(); // 함수 호출로 수정
  const {
    // state,
    state = {
      childId: 1,
      surveyId: 1,
      initialIdx: 0,
      canEdit: true,
      initialScores: new Array(40).fill(0), // 5 * 8
    },
  } = useLocation();
  const params = useParams();

  const [index, setIndex] = useState(state.initialIdx);
  const [activate, setActivate] = useState();
  const [scores, setScores] = useState(state.initialScores);
  const [surveyQuestions, setSurveyQuestions] = useState();

  const scoreBoard = [3, 2, 1, 0];

  // const surveyQuestions = SurveyText[state.idx] || [];

  // 넘겨줘야할 것들
  // 1. 기설문인지 여부
  // 2. 기설문이라면 기답안들
  // 3. 기설문이라면 현재 인덱스값

  // mock test scores
  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        const data = await getSurveyDetail(state.surveyId);
        setSurveyQuestions(data.questions);
      } catch (error) {
        console.error("검사 목록 조회 실패:", error);
      }
    };
    if (state.surveyId) {
      fetchSurveys();
    }
  }, [state.surveyId]);

  const handleScores = (newEL) => {
    const nextScores = scores.map((el, idx) => (idx === index ? newEL : el));
    setScores(nextScores);
  };

  const submitScores = async () => {
    if (state.canEdit === false) return;

    try {
      const data = await postSurvey(state.childId, state.surveyId, scores);
      console.log(data);
    } catch (error) {
      console.error("검사 목록 조회 실패:", error);
    }
    navigate(-1);
  };

  // if (!surveyQuestions) {
  //   return <div>설문을 불러오는 중입니다...</div>;
  // }

  return (
    <>
      <LayoutContainer>
        <Header>
          <BackButton onClick={() => navigate(-1)}>←</BackButton>
        </Header>
        <Information>
          질문 항목에 대해 다음 네 가지 중 하나에 표기해 주십시오.
          <Instruction>
            <img src={SurveyInstruc} alt="Instruction" />
          </Instruction>
        </Information>
        <Content>
          {surveyQuestions ? (
            <>
              <QuestionText>{surveyQuestions[index].question}</QuestionText>

              {surveyQuestions[index].imageUrl !== null ? (
                <img src={surveyQuestions[index].imageUrl} alt="img" />
              ) : (
                <></>
              )}
            </>
          ) : (
            <></>
          )}
          <ScoreBoard>
            {scoreBoard.map((el) => (
              <ScoreButton
                key={el}
                onClick={
                  state.canEdit
                    ? () => {
                        handleScores(el);
                      }
                    : null
                }
                selected={scores[index] === el}
              >
                {el}
              </ScoreButton>
            ))}
          </ScoreBoard>
          <NavigationButtons>
            <NavButton
              onClick={() => setIndex((prev) => (prev - 1 >= 0 ? prev - 1 : 0))}
            >
              이전
            </NavButton>
            {index < 39 ? (
              <NavButton onClick={() => setIndex((prev) => prev + 1)}>
                다음
              </NavButton>
            ) : (
              <NavButton
                onClick={() => {
                  submitScores();
                }}
              >
                {"done"}
              </NavButton>
            )}
          </NavigationButtons>
        </Content>
        <NavigationWrapper>
          <Navigation activate={activate} setActivate={setActivate} />
        </NavigationWrapper>
      </LayoutContainer>
    </>
  );
};

export default SurveyQuestion;

// Styled Components
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
`;

const QuestionText = styled.div`
  font-size: 23px;
  font-weight: semi-bold;
  text-shadow: 2px 2px 5px rgba(219, 139, 0, 0.3);
  padding-top: 60px;
  padding-bottom: 65px;
  text-align: center;
`;

const ScoreBoard = styled.div`
  display: flex;
  justify-content: space-around;
  padding-top: 130px;
  margin-bottom: 30px;
`;

const ScoreButton = styled.button`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: 2px solid ${({ selected }) => (selected ? "#a7de9b" : "#ccc")};
  background-color: ${({ selected }) => (selected ? "#DFF2BF" : "#fff")};
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: 0.2s;

  &:hover {
    transform: scale(1.1);
  }
`;

const NavigationButtons = styled.div`
  display: flex;
  justify-content: space-between;
  padding-top: 10px;
`;

const NavButton = styled.button`
  flex: 1;
  padding: 10px;
  margin: 0 10px;
  background-color: #f9d49b;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: bold;
  color: white;
  cursor: pointer;

  &:hover {
    background-color: #e3b96f;
  }
`;

const NavigationWrapper = styled.div`
  position: fixed;
  bottom: 0;
  width: 100%;
  background-color: #fff;
`;

const Information = styled.div`
  margin: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  height: 50px;
  display: table-column;
  font-family: "GmarketSans";
  font-size: 11px;
  font-weight: bold;
`;

const Instruction = styled.div`
  width: 100%; /* 부모 컨테이너의 크기에 맞춤 */
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 15px;

  img {
    width: 350px; /* 이미지 너비 */
    height: auto; /* 비율 유지 */
    max-width: 100%; /* 부모 컨테이너에 맞게 크기 제한 */
  }
`;
