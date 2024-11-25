import { useEffect, useState, useCallback } from "react";
import styled from "styled-components";
import { decodeData } from "../../utils/cryption.js";
import { useNavigate, useParams } from "react-router-dom";

const MedicalHistory = ({ medicalHistory = [], address }) => {
  const params = useParams();
  const navigate = useNavigate();
  const [decodedHistory, setDecodedHistory] = useState([]);

  const safeDecodeData = useCallback((data, address) => {
    if (!data || !address) return "";
    try {
      const decoded = decodeData(data, address);
      return decoded || "";
    } catch (error) {
      console.error("Decoding error:", { data, error });
      return "";
    }
  }, []); // 빈 의존성 배열

  useEffect(() => {
    const decodeAndSetHistory = async () => {
      if (!medicalHistory?.length || !address) {
        setDecodedHistory([]);
        return;
      }

      try {
        const decoded = medicalHistory.map((record, index) => {
          // 각 필드별로 안전한 디코딩 시도
          const visitedName = safeDecodeData(record.visitedName, address);
          const doctorName = safeDecodeData(record.doctorName, address);
          const symptoms = safeDecodeData(record.symptoms, address);
          const diagnosis = safeDecodeData(record.diagnosisDetails, address);

          return {
            id: index,
            visitedName: visitedName || "정보가 없어요!",
            date: record.timestamp || "정보가 없어요!",
            doctorName: doctorName ? `${doctorName} 선생님` : "정보가 없어요!",
            symptoms: symptoms || "정보가 없어요!",
            diagnosis: diagnosis || "정보가 없어요!",
            medicalType: Number(record.medicaltype),
          };
        });

        setDecodedHistory(decoded);
      } catch (error) {
        console.error("Error processing medical history:", error);
        setDecodedHistory([]);
      }
    };

    decodeAndSetHistory();
  }, [medicalHistory, address, safeDecodeData]);

  return (
    <Container>
      {decodedHistory.length > 0 ? (
        <>
          <CardGrid>
            {decodedHistory.slice(0, 2).map((item) => (
              <HistoryCard key={item.id}>
                {/* 상단 헤더 영역 */}
                <CardHeader>
                  <HeaderLeft>
                    <TypeBadge $type={item.medicalType}>
                      {item.medicalType === 0 ? "병원" : "약국"}
                    </TypeBadge>
                    <HospitalName>{item.visitedName}</HospitalName>
                  </HeaderLeft>
                  <DateBadge>{item.date}</DateBadge>
                </CardHeader>

                {/* 주요 정보 영역 */}
                <CardContent>
                  <InfoRow>
                    <InfoLabel>담당의</InfoLabel>
                    <InfoValue>
                      <DoctorIcon>👨‍⚕️</DoctorIcon>
                      {item.doctorName}
                    </InfoValue>
                  </InfoRow>
                  <InfoRow>
                    <InfoLabel>증상</InfoLabel>
                    <InfoValue>{item.symptoms}</InfoValue>
                  </InfoRow>
                  <InfoRow>
                    <InfoLabel>진단</InfoLabel>
                    <InfoValue>{item.diagnosis}</InfoValue>
                  </InfoRow>
                </CardContent>
              </HistoryCard>
            ))}
          </CardGrid>
          <MoreButton
            onClick={() => {
              navigate(`/medicalhistory/${params.childAddress}/${params.id}`);
            }}
          >
            과거 진료 내역 더보기
          </MoreButton>
        </>
      ) : (
        <EmptyCard>
          <EmptyIcon>📋</EmptyIcon>
          <EmptyText>과거 진료 내역이 없습니다</EmptyText>
        </EmptyCard>
      )}
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  padding: 0px 16px;
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
  margin-bottom: 16px;
`;

const HistoryCard = styled.div`
  background: #ffeccf;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(159, 135, 114, 0.15);
  transition: transform 0.2s ease;
  border: 1px solid rgba(159, 135, 114, 0.1);

  &:hover {
    transform: translateY(-4px);
  }
`;

const CardHeader = styled.div`
  padding: 16px;
  background: rgba(255, 255, 255, 0.3);
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(79, 35, 4, 0.1);
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const TypeBadge = styled.span`
  padding: 4px 12px;
  background: ${(props) =>
    props.$type === 0 ? "rgba(79, 35, 4, 0.1)" : "rgba(128, 128, 128, 0.1)"};
  color: #4f2304;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  font-family: "Gmarket Sans TTF";
`;

const HospitalName = styled.h3`
  margin: 0;
  font-family: "Gmarket Sans TTF";
  font-size: 16px;
  font-weight: 600;
  color: #4f2304;
`;

const DateBadge = styled.span`
  padding: 4px 12px;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 8px;
  font-size: 14px;
  color: #4f2304;
  font-family: "Gmarket Sans TTF";
`;

const CardContent = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: rgba(255, 255, 255, 0.2);
`;

const InfoRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 8px;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 8px;
`;

const InfoLabel = styled.span`
  min-width: 60px;
  font-family: "Gmarket Sans TTF";
  font-size: 14px;
  color: #4f2304;
  opacity: 0.7;
`;

const InfoValue = styled.span`
  flex: 1;
  font-family: "Gmarket Sans TTF";
  font-size: 14px;
  color: #4f2304;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const DoctorIcon = styled.span`
  font-size: 16px;
`;

const MoreButton = styled.button`
  width: 100%;
  padding: 16px;
  background: #ffeccf;
  border: 1px solid rgba(79, 35, 4, 0.1);
  border-radius: 12px;
  font-family: "Gmarket Sans TTF";
  font-size: 14px;
  font-weight: 600;
  color: #4f2304;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #ffe4bd;
    transform: translateY(-2px);
  }
`;

const EmptyCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 40px;
  background: #ffeccf;
  border-radius: 16px;
  text-align: center;
`;

const EmptyIcon = styled.span`
  font-size: 32px;
`;

const EmptyText = styled.p`
  font-family: "Gmarket Sans TTF";
  font-size: 16px;
  color: #4f2304;
  margin: 0;
`;

export default MedicalHistory;
