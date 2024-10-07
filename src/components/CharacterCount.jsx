import React from 'react';
import { useRecoilValue } from 'recoil';
import { charCountState } from '../recoil/selectors';

function CharacterCount() {
  const count = useRecoilValue(charCountState);

  return (
    <div>
      Character Count: {count}
    </div>
  );
}

export default CharacterCount;
