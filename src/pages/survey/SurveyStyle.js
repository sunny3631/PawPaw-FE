import styled from "styled-components";

const Container = styled.div`
  background-color: #ffeccf;
  padding: 20px;
  border-radius: 10px;
  min-height: 500px;

  @media (max-width: 480px) {
    padding: 15px;
  }
`;

const TestList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column; /* 세로 방향 정렬 */
  gap: 16px;

  @media (max-width: 480px) {
    gap: 15px;
  }
`;

const TestItem = styled.li`
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: #fff;
  border-radius: 10px;
  padding: 25px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.02); /* 마우스 호버 시 약간 확대 */
  }

  @media (max-width: 480px) {
    padding: 15px;
  }

  .icon {
    width: 40px; /* 아이콘 가로 크기 조정 */
    height: 40px; /* 아이콘 세로 크기 조정 */
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 20px;
    background-color: #ffd27f;

    img {
      width: 75%;
    }

    @media (max-width: 480px) {
      width: 47px; /* 모바일 화면에서 아이콘 크기 줄임 */
      height: 47px;
      margin-right: 10px;
    }
  }
  .title {
    font-weight: bold;
    font-size: 20px;
    color: #333;

    @media (max-width: 480px) {
      font-size: 17px; /* 모바일에서 제목 글씨 크기 축소 */
    }
  }

  .info {
    font-size: 14px;
    color: #888;

    @media (max-width: 480px) {
      font-size: 12px;
    }
  }

  .date {
    font-size: 16px;
    color: #555;
    padding-left: 1px;
    padding-top: 3px;

    @media (max-width: 480px) {
      font-size: 13px;

      flex-direction: column;
    }
  }
`;

const SurveyButton = styled.button`
  position: fixed;
  bottom: 80px;
  right: 40px;
  background-color: #ffd27f;
  color: #fff;
  border: none;
  border-radius: 50px;
  padding: 15px 25px;
  font-size: 20px;
  cursor: pointer;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.2);

  &:hover {
    background-color: #ffbb57;
  }

  @media (max-width: 480px) {
    padding: 11px 21px;
    font-size: 16px;
    right: 15px;
  }
`;

export { Container, TestList, TestItem, SurveyButton };
