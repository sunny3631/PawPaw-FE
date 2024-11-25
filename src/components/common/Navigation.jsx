import HomeIcon from "@mui/icons-material/Home";
import PollIcon from "@mui/icons-material/Poll";
import PeopleIcon from "@mui/icons-material/People";
import { BottomNavigation, BottomNavigationAction } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";

const Navigation = ({ activate, setActivate, childAddress, childID }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // URL 경로와 활성 상태 동기화
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
    <BottomNavigation
      value={activate}
      onChange={handleChange}
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
