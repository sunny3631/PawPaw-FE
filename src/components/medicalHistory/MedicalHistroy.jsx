import styled from "styled-components";

const MedicalHistory = ({ medicalHistory }) => {
  return (
    <SubContainer>
      {medicalHistory && medicalHistory.length > 0 ? (
        <>
          <HospitalList>
            {medicalHistory.slice(0, 2).map((item, index) => (
              <HospitalItem key={index}>
                <Date>{item.timestamp}</Date>
                <HospitalName>{item.visitedName}</HospitalName>
                <MedicalHistoryDetail>
                  · &nbsp; &nbsp; &nbsp;{item.symptoms}
                </MedicalHistoryDetail>
                <Doctor>{item.doctorName}의사</Doctor>
              </HospitalItem>
            ))}
          </HospitalList>
          <MoreButton>
            <ButtonText>과거 진료 내역 더보기</ButtonText>
          </MoreButton>
        </>
      ) : (
        <EmptyMessage>과거 진료 내역이 없습니다</EmptyMessage>
      )}
    </SubContainer>
  );
};

const SubContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  background-color: #c8dbbe;
  padding: 20px;
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

const EmptyMessage = styled.div`
  font-family: Karla;
  font-size: 16px;
  font-weight: 500;
  text-align: center;
  color: #666666;
  padding: 20px;
`;

export default MedicalHistory;
