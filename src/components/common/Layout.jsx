import { useState } from "react";

import Header from "./Header";
import Navigation from "./Navigation";
import styled from "styled-components";

const Layout = ({ children, type = "not", childAddress, childID }) => {
  const [activate, setActivate] = useState();
  return (
    <LayoutContainer>
      {type !== "mypage" && (
        <>
          <Header childID={childID} />
        </>
      )}
      <Content>{children}</Content>
      <NavigationWrapper>
        <Navigation
          activate={activate}
          setActivate={setActivate}
          childAddress={childAddress}
          childID={childID}
        />
      </NavigationWrapper>
    </LayoutContainer>
  );
};

const LayoutContainer = styled.div`
  background-color: #FFECCF;
  height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Content = styled.div`
  flex: 1; /* children의 내용을 화면의 대부분을 차지하게 만듭니다 */
  overflow-y: auto; /* 내용이 많을 경우 스크롤이 가능하도록 설정 */
  padding-bottom: 60px; /* 하단의 Navigation 공간을 확보하기 위해 여백 추가 */
`;

const NavigationWrapper = styled.div`
  position: fixed;
  bottom: 0;
  width: 100%;
  background-color: #fff;
`;

export default Layout;
