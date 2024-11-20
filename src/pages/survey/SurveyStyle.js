import styled from "styled-components";

const Container = styled.div`
  background-color: #ffeccf;
  padding: 10px;
  border-radius: 10px;
`;

const TabContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  margin-top: 17px;
  margin-bottom: 12px;
`;

const TabButton = styled.button`
  background-color: #fffcf5;
  border: none;
  padding: 10px 20px;
  font-weight: bold;
  cursor: pointer;
  color: #4a4343;
  font-size: 14px;
  flex: 1;

  // 첫 번째 버튼 왼쪽 둥근 모서리 적용
  &:first-child {
    border-top-left-radius: 10px;
    border-bottom-left-radius: 10px;
  }

  // 마지막 버튼 오른쪽 둥근 모서리 적용
  &:last-child {
    border-top-right-radius: 10px;
    border-bottom-right-radius: 10px;
  }

  // 버튼 사이 구분선 추가
  &:not(:last-child) {
    border-right: 1px solid #ddd;
  }

  &:hover {
    background-color: #f9d49b;
  }
`;

const TestList = styled.li`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  @media (max-width: 2000px) {
    display: flex;
    justify-content: center; /* 가로 가운데 정렬 */
    align-items: center; /* 세로 가운데 정렬 */
    width: 100%;
    height: 100%;
  }
`;

const TestItem = styled.ul`
  display: flex;
  align-items: center;
  width: 95%;
  height: 80px;
  cursor: pointer;
  background-color: #fff;
  border-radius: 10px;
  margin-top: 10px;
  .icon {
    width: 40px;
    height: 40px;
    background-position: center;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    margin-left: 9px;
    margin-right: 20px; /* 아이콘과 텍스트 사이 간격 */

    @media (max-width: 2000px) {
      width: 30px;
      height: 30px;
      font-size: 16px;
    }
  }

  .info {
    font-size: 0.8rem;
    color: #888;
    margin-top: 4px;
  }

  .title {
    font-weight: semi-bold;
    font-size: 17px;
    padding-top: 2px;
  }

  .date {
    font-size: 0.7rem;
    color: #888;
    margin-left: auto;
    padding-right: 20px;
  }

  @media (max-width: 2000px) {
    width: 95%;
    height: 65px;
    flex-direction: row;
    align-items: center;
    padding: 8px;
  }
`;

const SurveyTitle = styled.div`
  // text-weight: bold;
`;
const SurveyButton = styled.button`
  // text-weight: bold;
`;
// const AddButton = styled.button`
//   background-color: #ffd27f;
//   color: #fff;
//   border: none;
//   border-radius: 20px;
//   padding: 10px 20px;
//   font-size: 16px;
//   cursor: pointer;
//   position: fixed;
//   bottom: 20px;
//   right: 20px;

//   &:hover {
//     background-color: #ffbb57;
//   }
// `;

export {
  Container,
  TabContainer,
  TabButton,
  TestList,
  TestItem,
  SurveyTitle,
  SurveyButton,
};
