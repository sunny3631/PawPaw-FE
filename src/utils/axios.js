import axios from 'axios';
import { useEffect, useState } from 'react';
// axios를 활용해 서버에서 사용자 데이터를 가져오는 예시 함수
export const useFetchUsers = () => {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    axios.get("/api/users").then((response) => {
      setUsers(response.data);
    });
  }, []);
  return users;
};