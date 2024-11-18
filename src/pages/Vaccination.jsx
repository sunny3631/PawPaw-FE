import React from 'react'
import styled from 'styled-components'
import Layout from "../components/common/Layout";
import Navigation from '../components/common/Navigation';
import { useState } from 'react';
import Check from "../assets/check.svg"
import Complete from "../assets/completebutton.svg"
import Uncomplete from '../assets/uncomplete.svg'
import {Link} from "react-router-dom"

const TabContainer = styled.div`
  display: flex;
  border-radius: 41px;
  width : 90%;
  height : 37px;
  margin-top : 30px;
  justify-content : center;
  align-items : center;
  //overflow: hidden;
 // max-width: 600px; /* 버튼 그룹의 최대 너비 */
  margin: 30px auto 0; /* 부모 안에서 가로 중앙 정렬 */
`;

const TabButton = styled.button`

  //height : 100%;
  /* /width : 90%; */
  flex: 1;
  padding: 10px;
  border: 0.5px solid #4A4343;
  outline: none;
  cursor: pointer;
  color: #4A4343;
font-family: Karla;
font-size: 16px;
font-style: normal;
font-weight: 700;
line-height: normal;
  background-color: ${(props) => (props.active ? '#FFCC80' : 'white')};

  //transition: background-color 0.3s ease;

  &:first-child {
    border-top-left-radius: 41px;
    border-bottom-left-radius: 41px;
  }
  
  &:last-child {
    border-top-right-radius: 41px;
    border-bottom-right-radius: 41px;
  }
`;
const Container = styled.div`
  //background-color: #fde4c6; /* 배경색 */
  //padding: 20px;
  width: 90%;
  //max-width: 500px;
  margin: 30px auto; /* 중앙 정렬 */

`;

const Category = styled.div`
  margin-bottom: 20px;

  & > h3 {
    color: #4A4343;
    font-family: Karla;
    font-size: 18px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
    //margin-bottom: 30px;
    border-bottom: 1px solid #4a4343;
    display: inline-block;
    //padding-left: 10px;
  }
`;

const VaccineItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #ADADAD;
  color: #4A4343;
  font-family: Karla;
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  position : relative;
  margin-left : 10px;

  /* &:last-child {
    border-bottom: none;
  } */

  .info {
    display: flex;
    align-items: center;
    position : relative;
    
    
    
  }

  .check img{
    margin-right: 10px;
    color: #4a4343;
    font-size: 16px;
    width : 21px;
    height : 21px;
  }

  .name {
    font-size: 16px;
    font-weight: bold;
    color: #4a4343;
  }
  a {
    display : flex;
    justify-content: space-between;
    text-decoration: none;
    align-items: center;
    width : 100%;
    //color: inherit;
  }

 
`;


const CompleteButton = styled.div`
width: 66px;
height: 32px;
flex-shrink: 0;
`
const Vaccination = ({ name, age, imgUrl }) => {
    const [activeTab, setActiveTab] = useState("completed");
  
    const completedData = [
        {
            category: "출생 ~ 1개월 이내",
            items: [
              { id: 1, name: "B형 간염 1차" },
              { id: 2, name: "결핵 1차" },
            ],
          },
          {
            category: "1개월",
            items: [{ id: 3, name: "폐렴구균 1차" }],
          },
          {
            category: "2개월",
            items: [{ id: 4, name: "디프테리아 1차" }],
          },
        ];
  
        const pendingData = [
            {
              category: "3개월",
              items: [
                { id: 5, name: "폴리오 1차", status: "예정" },
                { id: 6, name: "b형 헤모플로스인플루엔자 1차", status: "예정" },
              ],
            },
            {
              category: "4개월",
              items: [
                { id: 7, name: "디프테리아 2차", status: "예정" },
                { id: 8, name: "폴리오 2차", status: "예정" },
                { id: 9, name: "폐렴구균 2차", status: "예정" },
              ],
            },
          ];
  
    const dataToRender = activeTab === "completed" ? completedData : pendingData;
  
    return (
      <Layout name={name} age={age} imgUrl={imgUrl}>
        {/* 탭 버튼 */}
        <TabContainer>
          <TabButton
            active={activeTab === "completed"}
            onClick={() => setActiveTab("completed")}
          >
            접종 완료
          </TabButton>
          <TabButton
            active={activeTab === "pending"}
            onClick={() => setActiveTab("pending")}
          >
            접종 예정
          </TabButton>
        </TabContainer>
  
        {/* 리스트 렌더링 */}
        <Container>
        {dataToRender.map((group) => (
        <Category key={group.category}>
          <h3>{group.category}</h3>
          {group.items.map((item) => (
            <VaccineItem key={item.id}>
              <Link to={`/detail/${item.id}`}>
              <div className="info">
                <div className="check">
                <img src= {Check} alt = "checked" />   
                </div>
                <div className="name">{item.name}</div>
              </div>
               <CompleteButton activeTab={activeTab}>
                  {activeTab === "completed" ? (
                    <img src={Complete} alt="complete" />
                  ) : (
                    <img src={Uncomplete} alt="uncomplete" />
                  )}
                </CompleteButton>
                </Link>
            </VaccineItem>
          ))}
          </Category>
        ))}
        </Container>
     
      </Layout>
    );
  };
  export default Vaccination;