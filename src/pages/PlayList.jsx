import React, { useEffect, useState } from 'react'
import ImgPlay from '../assets/play.svg'
import styled from 'styled-components'
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../api/instance/userInstance";
import Layout from "../components/common/Layout"


// const Layout = styled.div`
// `

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
  margin-left : 20px;
  margin-right : 20px;
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
  color: #555;
  margin-top : 10px;
  color: #000;
font-family: "KOTRA HOPE";
font-size: 20px;
font-style: normal;
font-weight: 400;
line-height: normal;
`;



const PlayList = () => {
  const params = useParams();
    const navigate = useNavigate();
    const childAddress = params.childAddress ? params.childAddress : "sumin_test";
    const childId = params.id ? params.id : 12;
    const [allplayItems, setallPlayItems] = useState([]);

    //  const playItems = [
    //     { id: 1, name: "공놀이", imgSrc: ImgPlay },
    //     { id: 2, name: "공놀이", imgSrc: ImgPlay },
    //     { id: 3, name: "공놀이", imgSrc: ImgPlay },
    //     { id: 4, name: "공놀이", imgSrc: ImgPlay },
    //   ];
      
    const handleItemClick = (id) => {
      console.log("Clicked ID:", id); // 디버깅용 로그 추가
  
      navigate(`/playdetail/${id}`);
    };
const fetchGames = async () => {
    try {
        console.log("Fetching games for childId:", childId);
      const { data } = await api.get(`/api/games`, {
        params: { childId },
      });
      console.log("Response Data:", data); // 서버 응답 확인
     

      if (data.isSuccess) {
        console.log("Games Data:", data.result.games);
        // Transform API response into the required format
        const games = data.result.games.map((game, index) => ({
          id: game.id,
          name: game.gameName,
          imgSrc: game.imageUrl,
        }));
        setallPlayItems(games);
      } else {
        console.error(data.message || "API 호출 중 오류 발생");
       
      }
    } catch (error) {
        if (error.response) {
            console.error("Server Error Response:", error.response.data);
            
          } else {
            console.error("Error:", error.message);
          }
    }
  };
  
  // Fetch games on component mount
  useEffect(() => {
    fetchGames();
  }, [childId]);



    
  return (
    <Layout childID={childId} childAddress={childAddress}>
         <Title>전체 놀이 목록 조회</Title>
         <Grid>
    {allplayItems.map((item) => (
          <Item key={item.id} onClick={() => handleItemClick(item.id)}>
            <Container>
            <Image src={item.imgSrc} alt={item.name} />
            </Container>
            <Name>{item.name}</Name>
          </Item>
        ))}
    </Grid>
    
   

    
    </Layout>
  )
}

export default PlayList;