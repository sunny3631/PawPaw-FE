import React from 'react'
import { useEffect, useState } from "react";
import Layout from "../components/common/Layout"
import styled from 'styled-components'
import ImgPlay from '../assets/play.svg'
import { useNavigate, useParams } from 'react-router-dom'
import { child } from "../api/child";
import { api } from "../api/instance/userInstance";


const Title = styled.div`
color: #4F2304;
font-family: "KOTRA HOPE";
font-size: 24px;
font-style: normal;
font-weight: 400;
line-height: normal;
margin-top : 30px;
margin-left : 15px;
`

const Grid = styled.div`
  margin-top : 30px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 50px;
  margin-bottom: 20px;
  margin-left : 30px;
  margin-right : 30px;
`;

const Item = styled.div`
text-align: center;
&:hover {
    transform: scale(1.05); /* 마우스 호버 시 약간 확대 */
  }
`;
const Container=styled.div`
  width: 130px;
  height: 130px;
  background: white;
  border-radius: 50%; 
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin: 0 auto;
  
`

const Image = styled.img`
  width: 80px;
  height: 80px;
  margin-bottom: 10px;
`;

const Name = styled.div`
  font-size: 20px;
  color: #555;
  margin-top : 10px;
  color: #000;
font-family: "KOTRA HOPE";

font-style: normal;
font-weight: 400;
line-height: normal;
`;

const ButtonContainer= styled.div`
  display : flex;
  align-items : center;
  justify-content : center;
  margin-bottom : 30px;
`
const ViewAllButton = styled.button`
  background-color: #ffd27f;
  color: #fff;
  padding: 10px 20px;
  border: none;
  border-radius: 20px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s
  margin-bottom : 30px;

  &:hover {
    background-color: #ffbb57;
  
  }
`;

const Effect=styled.div`
`


const Play = () => {
  const params = useParams();
    const navigate = useNavigate();
    const childAddress = params.childAddress ? params.childAddress : "sumin_test";
    const childId = params.id ? params.id : 12;
    const [playItems, setPlayItems] = useState([]);

  const handleItemClick = (id) => {
    console.log("Clicked ID:", id); // 디버깅용 로그 추가

    navigate(`/playdetail/${id}`);
  };

  // const handleViewAllClick = () => {
  //   navigate(`/playlist/${childAddress}/${id}`); // 모든 놀이 페이지로 이동
  // };

//추천 놀이 조회
 // API Call to fetch recommended games
 const getRecommendedPlay = async () => {
  try {
    const { data } = await api.get(`/api/recommended-games`, {
      params: { childId },
    });
    if (data.isSuccess) {
      // Transform API response into the required format
      const games = data.result.games.map((game, index) => ({
        id: game.id,
        name: game.gameName,
        imgSrc: game.imageUrl,
      
      }));
      setPlayItems(games);
    } else {
      console.error(data.message || "API 호출 중 오류 발생");
    }
  } catch (error) {
    console.error("Error while fetching recommended games:", error);
  }
};

// Fetch games on component mount
useEffect(() => {
  getRecommendedPlay();
}, [childId]);

    // const playItems = [
    //     { id: 1, name: "공놀이", imgSrc: ImgPlay },
    //     { id: 2, name: "공놀이", imgSrc: ImgPlay },
    //     { id: 3, name: "공놀이", imgSrc: ImgPlay },
    //     { id: 4, name: "공놀이", imgSrc: ImgPlay },
    //   ];

  return (
    <Layout childID={childId} childAddress={childAddress}>
    <Title>우리 아이에게 적합한 놀이는? </Title>
    <Grid>
    {playItems.map((item) => (
          <Item key={item.id} onClick={() => handleItemClick(item.id)}>
            <Container>
            <Image src={item.imgSrc} alt={item.name} />
            </Container>
            <Name>{item.name}</Name>
          </Item>
        ))}
    </Grid>
    <ButtonContainer>
    <ViewAllButton onClick={() => navigate(`/playlist/${params.childAddress}/${params.id}`)}>
      놀이 전체 보기
      </ViewAllButton>
    </ButtonContainer>

    
    </Layout>
  )
}

export default Play;