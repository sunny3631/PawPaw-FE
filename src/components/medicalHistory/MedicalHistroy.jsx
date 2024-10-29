import styled from "styled-components";

const MedicalHistory = () => {
  const data = [
    {
      date: "2024.10.14",
      hospitalName: "미소 진 산부인과",
      medicalHistory: "회복 경과 확인",
      doctor: "김성진",
    },
    {
      date: "2024.10.14",
      hospitalName: "경 이비인후과",
      medicalHistory: "급성위염",
      doctor: "박지현",
    },
  ];

  return (
    <Container>
      <Title>과거 진료 내역</Title>
      <SubContainer>
        <HospitalList>
          {data.map((item, index) => (
            <HospitalItem key={index}>
              <Date>{item.date}</Date>
              <HospitalName>{item.hospitalName}</HospitalName>
              <MedicalHistoryDetail>
                · &nbsp; &nbsp; &nbsp;{item.medicalHistory}
              </MedicalHistoryDetail>
              <Doctor>{item.doctor}의사</Doctor>
            </HospitalItem>
          ))}
        </HospitalList>
        <MoreButton>
          <ButtonText>과거 진료 내역 더보기</ButtonText>
        </MoreButton>
      </SubContainer>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 20px;
`;

const Title = styled.p`
  font-family: Karla;
  font-size: 13px;
  font-weight: 700;
  line-height: 15.2px;
  text-align: left;
  margin-left: 15px;
`;

const SubContainer = styled.div`
  min-width: 330px;
  display: flex;
  flex-direction: column;
  background-color: #c8dbbe;
  padding: 20px;
  border-radius: 10px;
`;

const HospitalList = styled.div`
  display: flex;
  justify-content: space-between;
`;

const HospitalItem = styled.div`
  width: 140px;
  padding: 20px;
  background-color: #fffcf5;
  border-radius: 10px;
`;

const Date = styled.p`
  font-family: Karla;
  font-size: 11px;
  font-weight: 400;
  line-height: 12.86px;
  letter-spacing: -0.07em;
  text-align: left;
  color: #3b3c41;
`;

const HospitalName = styled.h3`
  font-family: Koh Santepheap;
  font-size: 15px;
  font-weight: 900;
  line-height: 21.58px;
  text-align: left;
`;

const MedicalHistoryDetail = styled.p`
  font-family: Karla;
  font-size: 13px;
  font-weight: 500;
  line-height: 15.2px;
  letter-spacing: -0.14em;
  text-align: left;
`;

const Doctor = styled.p`
  font-family: Karla;
  font-size: 13px;
  font-weight: 500;
  line-height: 15.2px;
  letter-spacing: -0.14em;
  text-align: left;
`;

const MoreButton = styled.button`
  margin-top: 20px;
  padding: 10px;
  background-color: #fffcf5;
  border: none;
  font-weight: bold;
  cursor: pointer;
  border-radius: 10px;
`;

const ButtonText = styled.span`
  font-family: Koh Santepheap;
  font-size: 11px;
  font-weight: 900;
  line-height: 13.96px;
  letter-spacing: -0.13em;
  text-align: left;
`;

export default MedicalHistory;
