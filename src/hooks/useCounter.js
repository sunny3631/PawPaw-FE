import { useState } from 'react';
// 예시용 커스텀 카운터 훅
export const useCounter = () => {
  const [count, setCount] = useState(0);
  return {
    count,
    setCount,
  };
};