import HomeIcon from "@mui/icons-material/Home";
import PollIcon from "@mui/icons-material/Poll";
import PeopleIcon from "@mui/icons-material/People";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { BottomNavigation, BottomNavigationAction } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";

const Navigation = ({ activate, setActivate }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // URL 경로와 활성 상태 동기화
  useEffect(() => {
    const pathToId = {
      "/": 1,
      "/survey": 2,
      "/mypage": 3,
      "/etc": 4,
    };
    setActivate(pathToId[location.pathname] || 1);
  }, [location, setActivate]);

  const menu = [
    {
      id: 1,
      menuNameKor: "홈",
      menuNameEng: "home",
      icon: <HomeIcon />,
      router: "/",
    },
    {
      id: 2,
      menuNameKor: "문진표",
      menuNameEng: "survey",
      icon: <PollIcon />,
      router: "/survey",
    },
    {
      id: 3,
      menuNameKor: "마이페이지",
      menuNameEng: "mypage",
      icon: <PeopleIcon />,
      router: "/mypage",
    },
    {
      id: 4,
      menuNameKor: "기타",
      menuNameEng: "etc",
      icon: <MoreHorizIcon />,
      router: "/etc",
    },
  ];

  return (
    <BottomNavigation
      value={activate}
      onChange={(event, newValue) => {
        setActivate(newValue);
        const selectedItem = menu.find((item) => item.id === newValue);
        if (selectedItem) navigate(selectedItem.path);
      }}
      sx={{
        width: "100%",
        position: "fixed",
        bottom: 0,
        backgroundColor: "#fff",
      }}
    >
      {menu.map((item) => (
        <BottomNavigationAction
          key={item.id}
          icon={item.icon}
          value={item.id}
          sx={{
            color: activate === item.id ? "#000" : "#D6D9DD",
            "&.Mui-selected": { color: "#000" },
          }}
          onClick={() => navigate(`${item.router}`)}
        />
      ))}
    </BottomNavigation>
  );
};

export default Navigation;
