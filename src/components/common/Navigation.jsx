import HomeIcon from "@mui/icons-material/Home";
import PollIcon from "@mui/icons-material/Poll";
import PeopleIcon from "@mui/icons-material/People";
import { BottomNavigation, BottomNavigationAction } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import styled from "styled-components";

// 커스텀 스타일드 컴포넌트로 BottomNavigation 래핑
const StyledBottomNavigation = styled(BottomNavigation)`
  && {
    background: linear-gradient(to top, #fff6e9, #ffffff);
    border-top: 1px solid rgba(210, 165, 125, 0.2);
    box-shadow: 0 -4px 12px rgba(210, 165, 125, 0.1);
  }
`;

// 커스텀 스타일드 컴포넌트로 BottomNavigationAction 래핑
const StyledBottomNavigationAction = styled(BottomNavigationAction)`
  && {
    color: rgba(79, 35, 4, 0.4);
    padding: 12px 0;
    min-width: 80px;
    transition: all 0.3s ease;

    &.Mui-selected {
      color: #4f2304;
    }

    .MuiSvgIcon-root {
      transition: all 0.3s ease;
    }

    &:hover {
      color: #4f2304;
      background: rgba(255, 231, 204, 0.3);

      .MuiSvgIcon-root {
        transform: translateY(-2px);
      }
    }
  }
`;

const Navigation = ({ activate, setActivate, childAddress, childID }) => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname.includes("/dashboard")) {
      setActivate(1);
    } else if (location.pathname.includes("/survey")) {
      setActivate(2);
    } else if (location.pathname.includes("/mypage")) {
      setActivate(3);
    }
  }, [location.pathname, setActivate]);

  const menu = [
    {
      id: 1,
      menuNameKor: "홈",
      menuNameEng: "home",
      icon: <HomeIcon />,
      router: `/dashboard/${childAddress}/${childID}`,
    },
    {
      id: 2,
      menuNameKor: "문진표",
      menuNameEng: "survey",
      icon: <PollIcon />,
      router: `/survey/${childAddress}/${childID}`,
    },
    {
      id: 3,
      menuNameKor: "마이페이지",
      menuNameEng: "mypage",
      icon: <PeopleIcon />,
      router: `/mypage/${childAddress}/${childID}`,
    },
  ];

  const handleChange = (event, newValue) => {
    const selectedMenu = menu.find((item) => item.id === newValue);
    if (selectedMenu) {
      setActivate(newValue);
      navigate(selectedMenu.router);
    }
  };

  return (
    <StyledBottomNavigation
      value={activate}
      onChange={handleChange}
      sx={{
        width: "100%",
        position: "fixed",
        bottom: 0,
        height: "64px", // 네비게이션 높이 조정
      }}
    >
      {menu.map((item) => (
        <StyledBottomNavigationAction
          key={item.id}
          icon={item.icon}
          value={item.id}
          onClick={() => navigate(`${item.router}`)}
          label={item.menuNameKor} // 메뉴 이름 표시 추가
        />
      ))}
    </StyledBottomNavigation>
  );
};

export default Navigation;
