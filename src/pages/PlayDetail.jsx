import React, { useEffect, useState } from 'react'
import ImgPlay from '../assets/play.svg'
import styled from 'styled-components'
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../api/instance/userInstance";

const Layout = styled.div`
`


const Header = styled.div`
  display: flex;
  align-items: center;
  //margin-bottom: 20px;
  background: #F9D49B;
  height : 84px;
  text-align : center;
  justify-content : center;
`;

const BackButton = styled.button`
  position : absolute;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  left : 10px;
  width : 30px;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  color: #333;
  margin-left: 10px;
  text-align : center;
  display : flex;
  align-items : center;
`;

const Content = styled.div`
  background: #ffffff;
  padding: 20px;

  background: #FFF2DB;
`;

const Section = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.div`
  color: #4F2304;
font-family: "KOTRA HOPE";
font-size: 20px;
font-style: normal;
font-weight: 400;
line-height: normal;
  border-radius: 10px;
background: #D4E3CC;
height: 45px;
display : flex;
align-items : center;
padding : 15px;
`;

const Value = styled.div`
  color: #000;
font-family: "KOTRA HOPE";
font-size: 15px;
font-style: normal;
font-weight: 400;
line-height: 18px; /* 120% */
margin-top: 17px;
padding : 10px;
`;
const EffectSection = styled.div`
  margin-bottom: 20px;
`;

const Effect = styled.div`
color: #4F2304;
font-family: "KOTRA HOPE";
font-size: 20px;
font-style: normal;
font-weight: 400;
line-height: normal;
`
const EffectButton = styled.div`
  //display: inline-block;
  border-radius: 10px;
background: #FFCC80;
color: #000;
font-family: "KOTRA HOPE";
font-size: 15px;
font-style: normal;
font-weight: 400;
line-height: normal;
  padding: 5px 10px;
  border-radius: 10px;
  margin-top: 17px;
  width: 112px;
height: 40px;
flex-shrink: 0;
text-align : center;
display : flex;
justify-content: center;
align-items: center;

`;

const PlayCard = styled.div`
  display: flex;
  align-items: center;
  border-radius: 10px;
background: #FFFCF5;
  padding: 15px;
  margin-bottom : 33px;
  
`;

const PlayText = styled.p`
  color: #6A5555;
font-family: "KOTRA HOPE";
font-size: 24px;
font-style: normal;
font-weight: 400;
line-height: normal;
letter-spacing: 1.92px;
`;

const PlayImage = styled.img`
  width: 132.606px;
height: 83px;
flex-shrink: 0;
  margin-left: auto;
`;
// const playDetails = {
//     1: {
//       title: "누가 누가 높이 쌓나",
//       effect : "소근육 운동",
//       expectation: "손의 전반적인 소근육을 사용하여 탑을 쌓습니다. 입체감각의 이해도가 상승하고 소근육과의 협응이 발달합니다.",
//       method: "블록을 이용해 높은 탑을 쌓고 무너지지 않도록 유지해 보도록 합니다.",
//       materials: "블록",
//       age: "36~53개월",
//       description: "손가락의 힘과 조작 능력을 발달시키며, 아이가 다양한 방식으로 문제를 해결하도록 돕는 놀이입니다. 부모가 도와주는 과정에서 칭찬을 아끼지 말아주세요.",
//     },
//     2: { /* ... 다른 데이터 */ },
//   };

const PlayDetail = () => {
    const { gameId } = useParams();
    console.log("Fetched gameId from URL:", gameId); // URL에서 gameId 확인
    const navigate = useNavigate();
    const [detail, setDetail] = useState(null);
    const [loading, setLoading] = useState(true);


     // API Call to fetch play details
  const fetchPlayDetail = async () => {
    try {
      console.log("Fetching details for gameId:", gameId);
      const { data } = await api.get(`/api/games/${gameId}`,
         );
      if (data.isSuccess) {
        setDetail(data.result);
      } else {
        console.error(data.message || "Failed to fetch game details.");
      }
    } catch (error) {
      console.error("Error while fetching game details:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlayDetail();
  }, [gameId]);

    if (!detail) {
        return <div>존재하지 않는 놀이입니다.</div>;
      }
    
    if (loading) {
        return <div>로딩 중...</div>;
      }

  return (
    <Layout>
     <Header>
        <BackButton onClick={() => navigate(-1)}>&larr;</BackButton>
        <Title>{detail.name}</Title>
      </Header>
      <Content>
      <EffectSection>
        <Effect>발달 효과</Effect>
        <EffectButton>{detail.developmentalEffect}</EffectButton>
      </EffectSection>
      <PlayCard>
        <PlayText>{detail.name}</PlayText>
        <PlayImage src={detail.imageUrl} alt={detail.name} />
      </PlayCard>
        <Section>
          <Label>기대 효과</Label>
          <Value>{detail.effects}</Value>
        </Section>
        <Section>
          <Label>놀이 방법</Label>
          <Value>{detail.steps}</Value>
        </Section>
        <Section>
          <Label>필요 재료</Label>
          <Value>{detail.materials}</Value>
        </Section>
        <Section>
          <Label>대상 연령</Label>
          <Value> {detail.minAgeMonths}~{detail.maxAgeMonths}개월</Value>
        </Section>
        <Section>
          <Label>놀이 설명</Label>
          <Value>{detail.description}</Value>
        </Section>
      </Content>
    

    
    </Layout>
  )
}

export default PlayDetail;