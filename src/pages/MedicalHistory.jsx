import React, { useState } from "react";
import Layout from "../components/common/Layout";
import styled from "styled-components";
import Check from "../assets/check.svg";
import { Link } from "react-router-dom";
import Addbutton from "../assets/addbutton.svg";
import AddModal from "../components/AddModal";

/* 스타일 컴포넌트 */
const Container = styled.div`
  padding: 30px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  h1 {
    color: #6a5555;
    font-family: Karla;
    font-size: 25px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
    letter-spacing: 2px;
  }
`;

const SortButton = styled.button`
  background-color: #fff;
  border: 1px solid #adadad;
  border-radius: 5px;
  padding: 5px 10px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  color: #4a4343;
`;

const Record = styled.div`
  //padding: 10px 0;

  color: #4a4343;
  font-family: Karla;
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  margin-bottom: 50px;
`;

const Date = styled.div`
  font-size: 16px;
  font-weight: bold;
  color: #4a4343;
  margin-bottom: 30px;
  border-bottom: 1px solid #4a4343;
  display: inline-block;
`;

const Info = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-left: 10px;
  border-bottom: 1px solid #adadad;
  padding-bottom: 5px;

  a {
    display: flex;
    justify-content: space-between;
    text-decoration: none !important; /* 우선순위 강제 */
    align-items: center;
    width: 100%;
    //color: inherit;
  }

  .diagnosis {
    display: flex;
    align-items: center;

    .check img {
      margin-right: 10px;
      width: 20px;
      height: 20px;
    }

    .content {
      font-size: 16px;
      font-weight: bold;
      color: #4a4343;
    }
  }
`;

const Treatment = styled.div`
  border-radius: 24px;
  background: #ffcc80;
  padding: 5px 10px;
  //font-size: 14px;
  font-weight: bold;
  text-align: center;
  color: #4a4343;
  //width: 70px;
  height: 31px;
  flex-shrink: 0;
  color: #4a4343;
  text-align: center;
  font-family: Karla;
  font-size: 12px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
`;

const AddButton = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-right: 13px;
`;
const Button = styled.button`
  background: none;
  border: none;
  cursor: pointer;
`;

const ModalHeader = styled.h2`
  color: #4a4343;
  font-family: "KOTRA HOPE";
  font-size: 36px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  text-align: center;
  margin-bottom: 20px;
`;
const TabContainer = styled.div`
  display: flex;
  border-radius: 41px;
  margin: 0 auto;
  width: 90%;
  height: 37px;
  border: 1px solid #4a4343;
  margin-bottom: 20px;
  overflow: hidden;
`;

/* 개별 탭 버튼 */
const TabButton = styled.button`
  flex: 1;
  border: none;
  outline: none;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  font-family: Karla, sans-serif;
  background-color: ${(props) => (props.active ? "#FFCC80" : "white")};

  &:first-child {
    border-top-left-radius: 41px;
    border-bottom-left-radius: 41px;
  }

  &:last-child {
    border-top-right-radius: 41px;
    border-bottom-right-radius: 41px;
  }
`;

const FormLayout = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;
const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-size: 14px;
  color: #4a4343;
  margin-bottom: 5px;
`;

const Input = styled.input`
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #adadad;
  border-radius: 5px;
`;

const Textarea = styled.textarea`
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #adadad;
  border-radius: 5px;
  resize: none;
`;

const FileInput = styled.div`
  margin-bottom: 15px;

  label {
    display: flex;
    align-items: center;
    background-color: #ffcc80;
    border-radius: 5px;
    padding: 10px;
    font-size: 14px;
    font-weight: bold;
    cursor: pointer;
    color: #4a4343;
  }

  input {
    display: none;
  }
`;

const SubmitButton = styled.button`
  background-color: #ffcc80;
  border: none;
  border-radius: 24px;
  padding: 10px 20px;
  font-size: 16px;
  font-weight: bold;
  color: #4a4343;
  cursor: pointer;

  &:hover {
    background-color: #ffb74d;
  }
`;

const MedicalHistory = ({ name, age, imgUrl }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("hospital"); // 현재 선택된 탭 상태

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const [sortOrder, setSortOrder] = useState("최신순");

  // 진료 내역 샘플 데이터
  const historyData = [
    {
      id: 1,
      date: "2024년 10월 19일",
      diagnosis: "고열, 두통",
      treatment: "행복한 내과",
    },
    {
      id: 2,
      date: "2024년 10월 15일",
      diagnosis: "사랑니 발치",
      treatment: "미소 치과",
    },
    {
      id: 3,
      date: "2024년 9월 28일",
      diagnosis: "급성 위염",
      treatment: "사랑 약국",
    },
  ];

  // Helper: 날짜 문자열을 ISO 8601 형식으로 변환
  const parseDate = (dateString) => {
    const [year, month, day] = dateString
      .replace(/년|월|일/g, "") // "년", "월", "일" 제거
      .split(" ")
      .map((item) => parseInt(item.trim(), 10)); // 숫자로 변환 후 공백 제거
    return new window.Date(year, month - 1, day); // Date 객체 생성
  };

  // 정렬 함수
  const sortedData =
    sortOrder === "최신순"
      ? [...historyData].sort((a, b) => parseDate(b.date) - parseDate(a.date))
      : [...historyData].sort((a, b) => parseDate(a.date) - parseDate(b.date));

  return (
    <Layout name={name} age={age} imgUrl={imgUrl}>
      <Container>
        <Header>
          <h1>진료내역</h1>
          <SortButton
            onClick={() =>
              setSortOrder(sortOrder === "최신순" ? "오래된순" : "최신순")
            }
          >
            {sortOrder}
          </SortButton>
        </Header>
        {sortedData.map((item) => (
          <Record key={item.id}>
            <Link
              to={`/details/${item.id}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <Date>{item.date}</Date>
              <Info>
                <div className="diagnosis">
                  <div className="check">
                    <img src={Check} alt="checked" />
                  </div>
                  <div className="content">{item.diagnosis}</div>
                </div>
                <Treatment>{item.treatment}</Treatment>
              </Info>
            </Link>
          </Record>
        ))}
      </Container>
      <AddButton>
        <Button onClick={openModal}>
          <img src={Addbutton} alt="add" />
        </Button>
        <AddModal isOpen={isModalOpen} onClose={closeModal}>
          <ModalHeader>진료내역 추가</ModalHeader>
          <TabContainer>
            <TabButton
              active={activeTab === "hospital"}
              onClick={() => setActiveTab("hospital")}
            >
              병원
            </TabButton>
            <TabButton
              active={activeTab === "pharmacy"}
              onClick={() => setActiveTab("pharmacy")}
            >
              약국
            </TabButton>
          </TabContainer>
          {activeTab === "hospital" ? (
            <Form>
              <FormLayout>
                <Label>병원명</Label>
                <Input type="text" placeholder="병원명을 입력하세요" />
              </FormLayout>

              <FormLayout>
                <Label>진료일자</Label>
                <Input type="date" />
              </FormLayout>

              <FormLayout>
                <Label>의사 이름</Label>
                <Input type="text" placeholder="의사 이름을 입력하세요" />
              </FormLayout>

              <FormLayout>
                <Label>증상</Label>
                <Textarea placeholder="증상을 입력하세요"></Textarea>
              </FormLayout>

              <FormLayout>
                <Label>진단 내용</Label>
                <Textarea placeholder="진단 내용을 입력하세요"></Textarea>
              </FormLayout>

              <Label>처방전</Label>
              <FileInput>
                <label htmlFor="prescription-upload">
                  <img src="/path-to-icon.png" alt="icon" />
                  처방전 사진 선택하세요
                </label>
                <input id="prescription-upload" type="file" />
              </FileInput>

              <Label>후기</Label>
              <Textarea placeholder="후기를 입력하세요"></Textarea>

              <SubmitButton>저장하기</SubmitButton>
            </Form>
          ) : (
            <Form>
              <Label>약국명</Label>
              <Input type="text" placeholder="약국명을 입력하세요" />

              <Label>처방일자</Label>
              <Input type="date" />

              <Label>투약 횟수, 분량</Label>
              <Input type="text" placeholder="예: 하루 3회, 1알" />

              <Label>증상</Label>
              <Textarea placeholder="증상을 입력하세요"></Textarea>

              <Label>진단 내용</Label>
              <Textarea placeholder="진단 내용을 입력하세요"></Textarea>

              <Label>처방전</Label>
              <FileInput>
                <label htmlFor="prescription-upload">
                  <img src="/path-to-icon.png" alt="icon" />
                  처방전 사진 선택하세요
                </label>
                <input id="prescription-upload" type="file" />
              </FileInput>

              <Label>후기</Label>
              <Textarea placeholder="후기를 입력하세요"></Textarea>

              <SubmitButton>저장하기</SubmitButton>
            </Form>
          )}
        </AddModal>
      </AddButton>
    </Layout>
  );
};

export default MedicalHistory;
