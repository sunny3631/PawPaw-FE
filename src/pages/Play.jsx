import React from 'react'
import Layout from "../components/common/Layout"
import styled from 'styled-components'
import ImgPlay from '../assets/play.svg'
import { useNavigate } from 'react-router-dom'

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
`;

const Item = styled.div`
text-align: center;
  
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

const Name = styled.p`
  font-size: 1rem;
  color: #555;
  margin-top : 10px;
  color: #000;
font-family: "KOTRA HOPE";
font-size: 25px;
font-style: normal;
font-weight: 400;
line-height: normal;
`;

const ViewAllButton = styled.button`
  background-color: #ffd700;
  color: #fff;
  padding: 10px 20px;
  border: none;
  border-radius: 20px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #ffb700;
  }
`;


const Play = () => {
    const navigate = useNavigate();

  const handleItemClick = (id) => {
    navigate(`/playdetail/${id}`);
  };

    const playItems = [
        { id: 1, name: "공놀이", imgSrc: ImgPlay },
        { id: 2, name: "공놀이", imgSrc: ImgPlay },
        { id: 3, name: "공놀이", imgSrc: ImgPlay },
        { id: 4, name: "공놀이", imgSrc: ImgPlay },
      ];

  return (
    <Layout>
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


    
    </Layout>
  )
}

export default Play;