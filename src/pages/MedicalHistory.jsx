import React, {useState} from 'react'
import Layout from "../components/common/Layout";
import styled from 'styled-components';
import Check from "../assets/check.svg"
import {Link} from "react-router-dom"
import Addbutton from "../assets/addbutton.svg"
import AddModal from "../components/AddModal"
import Arrow from "../assets/arrow.svg"
import { useNavigate } from "react-router-dom"; // import 추가


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
        color: #6A5555;
        font-family: Karla;
        font-size: 25px;
        font-style: normal;
        font-weight: 700;
        line-height: normal;
        letter-spacing: 2px;
    }
  `;
  
  const SortButton = styled.button`
    background: #FFFCF5;
    border: 1px solid #adadad;
    border-radius: 5px;
    padding: 5px 10px;
    font-size: 14px;
    font-weight: bold;
    cursor: pointer;
    color: #4a4343;
    width : 100px;
  `;


  const Record = styled.div`
    //padding: 10px 0;
   
    color: #4A4343;
    font-family: Karla;
    font-size: 16px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
    margin-bottom : 50px;
   
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
    margin-left : 10px;
    border-bottom: 1px solid #adadad;
    padding-bottom : 5px;
    
    a {
    display : flex;
    justify-content: space-between;
    text-decoration: none !important; /* 우선순위 강제 */
    align-items: center;
    width : 100%;
    //color: inherit;
  }
  
    .symptoms {
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
background: #FFCC80;
    padding: 5px 10px;
    //font-size: 14px;
    font-weight: bold;
    text-align: center;
    color: #4a4343;
    //width: 70px;
height: 31px;
flex-shrink: 0;
color: #4A4343;
text-align: center;
font-family: Karla;
font-size: 12px;
font-style: normal;
font-weight: 600;
line-height: normal;
  `;

  const AddButton = styled.div`

  display : flex;
  justify-content : flex-end;
  margin-right : 13px;
`
const Button = styled.button`
 
    background : none;
    border : none;
    cursor : pointer;
  

  `

const ModalHeader = styled.h2`
color: #4A4343;
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
display : flex;
flex-direction : row;
justify-content: space-between;
align-items : center;
margin-bottom : 10px;
`
const Form = styled.form`
display: flex;
flex-direction: column;

`;

const Label = styled.label`
margin-left : 20px;
margin-bottom: 10px;
color: #4A4343;
font-family: Karla;
font-size: 16px;
font-style: normal;
font-weight: 700;
line-height: normal;
`;

const Input = styled.input`
padding: 10px;
margin-bottom: 10px;
border-radius: 7px;
border: 1px solid #B6B6B6;
background: #FFFCF5;
width: 150px;
height: 27px;
flex-shrink: 0;
margin-right : 20px;
color: #4A4343;
font-family: Karla;
font-size: 14px;
font-style: normal;
font-weight: 500;
line-height: normal;
`;

const Textarea = styled.textarea`
width: 150px;
margin-right : 20px;
//height: 47px;
flex-shrink: 0;
padding: 10px;
margin-bottom: 15px;
border-radius: 7px;
border: 1px solid #B6B6B6;
background: #FFFCF5;
resize: none;
color: #4A4343;
font-family: Karla;
font-size: 14px;
font-style: normal;
font-weight: 500;
line-height: normal;
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

const DropdownMenu = styled.div`
  position: absolute;
  font-family: Karla;
  top: 100%;
  right: 0;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-top: 5px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 100;
  width : 100px;
  text-align : center;
  background-color: #FFFCF5;

`;

const DropdownItem = styled.div`
  padding: 10px 15px;
  cursor: pointer;
  background-color: #FFFCF5;
    //border: 1px solid #adadad;
    border-radius: 5px;
    //padding: 5px 10px;
    font-size: 14px;
    font-weight: bold;
    cursor: pointer;
    color: #4a4343;
  &:hover {
    background-color: #f0f0f0;
  }
`;

const SortDropdown = styled.div`
  position: relative;
`;
const ArrowIcon = styled.img`
margin-left: 5px;
`;

const MedicalHistory = ({ name, age, imgUrl }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("hospital"); // 현재 선택된 탭 상태
  const navigate = useNavigate(); // useNavigate 훅 사용

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  const [formData, setFormData] = useState({
    hospitalName: "",
    date: "",
    doctor: "",
    symptoms: "",
    diagnosis: "",
    prescription: "",
    feedback: "",
    pharmacyName: "",
    prescriptionDate: "",
    dosage: "",
  });



   // const [isOpen, setIsOpen] = useState(false);
    const [sortOrder, setSortOrder] = useState("최신순");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
   // 드롭다운 열기/닫기
  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  // 정렬 기준 변경
  const handleSortChange = (order) => {
    setSortOrder(order);
    setIsDropdownOpen(false);
  };


  
    // 진료 내역 샘플 데이터
    const [historyData, setHistoryData] = useState([
      { id: 1, date: "2024년 10월 19일", symptoms: "고열, 두통", hospitalName: "행복한 내과",
        doctor: "이수민", diagnosis : "고열, 두통 증세가 보임, 3일 뒤에 병원 재방문 요망",
        prescription :  "1일 3회 식후 복용", feedback : "꼼꼼히 진료를 잘해주셨다." },
      { id: 2, date: "2024년 10월 15일", symptoms: "사랑니 발치", hospitalName: "미소 치과",
        doctor: "김세종", diagnosis : "사랑니 2개 발치함, 3일 뒤에 병원 재방문 요망",
          prescription :  "1일 2회 식전 복용", feedback : "꼼꼼히 진료를 잘해주셨다." },
      { id: 3, date: "2024년 9월 28일", symptoms: "급성 위염", hospitalName: "사랑 약국",
        doctor: "박진환", diagnosis : "급성 위염 증세가 보임, 3일 뒤에 병원 재방문 요망",
      prescription :  "1일 2회 식후 복용", feedback : "꼼꼼히 진료를 잘해주셨다." },
    ]);
  
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
  

        // 입력값 변경 핸들러
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // 저장하기 버튼 클릭 핸들러
  const handleSave = () => {
    let newRecord; // newRecord를 외부에 선언하여 모든 블록에서 접근 가능하게 설정

    if (activeTab === "hospital") {
      if (
        !formData.hospitalName ||
      !formData.date ||
      !formData.doctor ||
      !formData.symptoms ||
      !formData.diagnosis ||
      !formData.prescription ||
      !formData.feedback
      ) {
        alert("모든 항목을 입력해야 합니다.");
        return;
      }
      const newRecord = {
        id: historyData.length + 1,
        date: formData.date,
        symptoms: formData.symptoms,
        hospitalName: formData.hospitalName,
        doctor: formData.doctor,
        diagnosis: formData.diagnosis,
        prescription: formData.prescription,
        feedback: formData.feedback,
      };
      setHistoryData((prev) => [newRecord, ...prev]);
      // const newRecord = {
      //   id: historyData.length + 1,
      //   date: formData.date,
      //   symptoms: formData.symptoms,
      //   treatment: formData.hospitalName,
      // };
      // setHistoryData((prev) => [newRecord, ...prev]);
    } else {
      if (!formData.pharmacyName ||
        !formData.prescriptionDate ||
        !formData.dosage ||
        !formData.symptoms ||
        !formData.diagnosis ||
        !formData.prescription ||
        !formData.feedback) {
        alert("모든 항목을 입력해야 합니다.");
        return;
      }
      const newRecord = {
        id: historyData.length + 1,
        date: formData.prescriptionDate,
        symptoms: formData.symptoms,
        treatment: formData.pharmacyName,
      };
    setHistoryData((prev) => [newRecord, ...prev]);
  }
    // 입력값 초기화 및 모달 닫기
    setFormData({
      hospitalName: "",
      date: "",
      doctor: "",
      symptoms: "",
      diagnosis: "",
      prescription: "",
      feedback: "",
      pharmacyName: "",
      prescriptionDate: "",
      dosage: "",
    });
    closeModal();
    //navigate(`/details/${newRecord.id}`);
  };
    return (
      <Layout name={name} age={age} imgUrl={imgUrl}>
        <Container>
          <Header>
            <h1>진료내역</h1>
            <SortDropdown>
            <SortButton onClick={toggleDropdown}>
              {sortOrder}
              <ArrowIcon
              src={Arrow} // 화살표 아이콘 경로
              alt="arrow"
              isOpen={isDropdownOpen}
        />
              </SortButton>
              {isDropdownOpen && (
              <DropdownMenu>
                <DropdownItem onClick={() => handleSortChange("최신순")}>
                  최신순
                </DropdownItem>
                <DropdownItem onClick={() => handleSortChange("오래된순")}>
                  오래된순
                </DropdownItem>
              </DropdownMenu>
            )}
          </SortDropdown>
          </Header>
          {historyData.map((item) => (
            <Record key={item.id}>
                <Link to={`/details/${item.id}`}
                style={{ textDecoration: "none", color: "inherit" }}
                state={{ historyData }}>
              <Date>{item.date}</Date>
              <Info>
                <div className="symptoms">
                  <div className="check">
                    <img src={Check} alt="checked" />
                  </div>
                  <div className="content">{item.symptoms}</div>
                </div>
                <Treatment>{item.hospitalName}</Treatment>
              </Info>
              </Link>
            </Record>
          ))}
        </Container>
        <AddButton>
          <Button onClick = {openModal}>
          <img src={Addbutton} alt = "add" />
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
          <Input 
          type="text" 
          placeholder="병원명을 입력하세요" 
          value={formData.hospitalName}
          onChange={(e) => handleInputChange("hospitalName", e.target.value)}
          />
          </FormLayout>

          <FormLayout>
          <Label>진료일자</Label>
          <Input type="date" 
          value={formData.date}
          onChange={(e) => handleInputChange("date", e.target.value)}   
          />
          </FormLayout>

          <FormLayout>
          <Label>의사 이름</Label>
          <Input type="text" 
          placeholder="의사 이름을 입력하세요" 
          value={formData.doctor}
          onChange={(e) => handleInputChange("doctor", e.target.value)}
          />
          </FormLayout>

          <FormLayout>
          <Label>증상</Label>
          <Textarea 
          placeholder="증상을 입력하세요"
          value={formData.symptoms}
          onChange={(e) => handleInputChange("symptoms", e.target.value)}
          />
          </FormLayout>

          <FormLayout>
          <Label>진단 내용</Label>
          <Textarea 
          placeholder="진단 내용을 입력하세요"
          value={formData.diagnosis}
          onChange={(e) => handleInputChange("diagnosis", e.target.value)}
          />
          </FormLayout>
 
          <FormLayout>
          <Label>처방전</Label>
          <Textarea 
          placeholder="처방전 내용을 입력하세요"
          value={formData.prescription}
          onChange={(e) => handleInputChange("prescription", e.target.value)}
          ></Textarea>
          </FormLayout>

          <FormLayout>
          <Label>후기</Label>
          <Textarea placeholder="후기를 입력하세요"
          value={formData.feedback}
          onChange={(e) => handleInputChange("feedback", e.target.value)}
          ></Textarea>
          </FormLayout>
          <SubmitButton onClick={handleSave}>저장하기</SubmitButton>
        </Form> 
        ) : (
          <Form>
          <FormLayout>
          <Label>약국명</Label>
          <Input type="text" placeholder="약국명을 입력하세요"
          value={formData.pharmacyName}
          onChange={(e) => handleInputChange("pharmacyName", e.target.value)}
          />
          </FormLayout>

          <FormLayout>
          <Label>처방일자</Label>
          <Input type="date" 
          value={formData.prescriptionDate}
          onChange={(e) => handleInputChange("prescriptionDate", e.target.value)}
          />
          </FormLayout>

          <FormLayout>
          <Label>투약 횟수, 분량</Label>
          <Input type="text" placeholder="예: 하루 3회, 1알"
          value={formData.dosage}
          onChange={(e) => handleInputChange("dosage", e.target.value)}
          />
          </FormLayout>

          <FormLayout>
          <Label>증상</Label>
          <Textarea placeholder="증상을 입력하세요"
           value={formData.symptoms}
           onChange={(e) => handleInputChange("symptoms", e.target.value)}
            ></Textarea>
          </FormLayout>

          <FormLayout>
          <Label>진단 내용</Label>
          <Textarea placeholder="진단 내용을 입력하세요"
          value={formData.diagnosis}
          onChange={(e) => handleInputChange("diagnosis", e.target.value)}
          ></Textarea>
          </FormLayout>

          <FormLayout>
          <Label>처방전</Label>
          <Textarea placeholder="처방전 내용을 입력하세요"
           value={formData.prescription}
           onChange={(e) => handleInputChange("prescription", e.target.value)}
           ></Textarea>
          </FormLayout>

          <FormLayout>
          <Label>후기</Label>
          <Textarea placeholder="후기를 입력하세요"
           value={formData.feedback}
           onChange={(e) => handleInputChange("feedback", e.target.value)}
           ></Textarea>
          </FormLayout>

          <SubmitButton onClick={handleSave}>저장하기</SubmitButton>
        </Form>
      )}
      </AddModal>
        </AddButton>
      </Layout>
    );
  };
  
  export default MedicalHistory;