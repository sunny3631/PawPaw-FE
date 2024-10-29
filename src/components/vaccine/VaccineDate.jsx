import styled from "styled-components";

const VaccineDate = () => {
  const vaccineDate = [
    {
      name: "수두 예방 접종",
      day: 88,
    },
    {
      name: "다가오는 예방 접종",
      day: 88,
    },
  ];

  return (
    <Container>
      <Title>예방 접종 예정일</Title>
      <VaccineList>
        {vaccineDate.map((vaccine, index) => {
          return (
            <VaccineItem key={index}>
              <DayPrefix>D-{vaccine.day}</DayPrefix>
              <VaccineName>{vaccine.name}</VaccineName>
            </VaccineItem>
          );
        })}
      </VaccineList>
    </Container>
  );
};

const Container = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
`;

const Title = styled.p`
  font-family: Karla;
  font-size: 13px;
  font-weight: 700;
  line-height: 15.2px;
  text-align: left;
  margin-left: 15px;
`;

const VaccineList = styled.div`
  display: flex;
  flex-direction: column;
  height: 134px;
  justify-content: space-between;
  border-radius: 15px;
  padding: 20px;
  background: #dbdee6;
`;

const VaccineItem = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  justify-content: space-between;
`;

const DayPrefix = styled.span`
  font-family: Karla;
  font-size: 32px;
  font-weight: 700;
  line-height: 37.41px;
  letter-spacing: -14%;
  text-align: left;
  color: #413f3b;
`;

const VaccineName = styled.span`
  font-family: Karla;
  font-size: 18px;
  font-weight: 400;
  line-height: 21.04px;
  letter-spacing: -0.02em;
  text-align: left;
`;

export default VaccineDate;
