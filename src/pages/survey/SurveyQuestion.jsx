import { useEffect, useState } from "react";
// import { SurveyText } from "../../";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import Navigation from "../../components/common/Navigation.jsx";

const SurveyQuestion = () => {
  const navigate = useNavigate(); // 함수 호출로 수정
  const {
    state,
    // state = {
    //   surveyId: 1,
    //   initialIdx: 0,
    //   canEdit: true,
    //   initialScores: new Array(40).fill(0), // 5 * 8
    // },
  } = useLocation();
  // const surveyQuestions = SurveyText[state.idx] || [];

  // 넘겨줘야할 것들
  // 1. 기설문인지 여부
  // 2. 기설문이라면 기답안들
  // 3. 기설문이라면 현재 인덱스값
  const [surveyQuestions, setSurveyQuestions] = useState([
    {
      question: "엎드려 놓으면 고개를 잠깐 들었다 내린다.",
      imageUrl: "www.example.com",
    },
  ]);

  // mock test scores
  useEffect(() => {
    // debugger;
    //const data = await axios.getdksadaskdl;askd();
    //setSurveyQuestions(data);
    setSurveyQuestions(
      new Array(40).fill({
        question: "엎드려 놓으면 고개를 잠깐 들었다 내린다.",
        imageUrl: "www.example.com",
      })
    );
    setScores(state.initialScores);
    // console.log(surveyQuestions[state.initialIdx].question);
  }, []);

  const [index, setIndex] = useState(state.initialIdx);
  const [activate, setActivate] = useState();
  const [scores, setScores] = useState(state.initialScores);

  const scoreBoard = [3, 2, 1, 0];

  const handleScores = (newEL) => {
    const nextScores = scores.map((el, idx) => (idx === index ? newEL : el));
    setScores(nextScores);
  };

  const submitScores = async () => {
    if (state.canEdit) await alert("survey Complete." + scores);
    navigate(-1);
    // api calling~
  };

  if (!surveyQuestions) {
    return <div>설문을 불러오는 중입니다...</div>;
  }

  return (
    <>
      <LayoutContainer>
        <Header>
          <BackButton onClick={() => navigate(-1)}>←</BackButton>
          <div className="text">검사지 목록</div>
        </Header>
        <InformationText>
          질문 항목에 대해 다음 네 가지 중 하나에 표기해 주십시오.
        </InformationText>
        <Content>
          <QuestionText>{surveyQuestions[index].question}</QuestionText>
          {/* {surveyQuestions[index].imageUrl !== null ? <img src=""></img> : null} */}
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
  font-size: 18px;
  font-weight: semi-bold;
  margin: 20px 0;
  text-align: center;
`;

const ScoreBoard = styled.div`
  display: flex;
  justify-content: space-around;
  margin-top: 70px;
  margin-bottom: 40px;
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
  margin: 20px 0;
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

const InformationText = styled.div`
  margin: 20px;
  display: flex;
  justify-content: center; /* 가로 가운데 정렬 */
  align-items: center; /* 세로 가운데 정렬 */
  font-size: 15px;
  font-weight: lighter;
  text-align: center;
  height: 50px; /* 컨테이너 높이 추가 (필요 시 조정 가능) */
`;
