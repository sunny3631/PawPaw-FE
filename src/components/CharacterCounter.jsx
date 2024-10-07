import React from 'react';
import TextInput from './TextInput';
import CharacterCount from './CharacterCount';

function CharacterCounter() {
  return (
    <div>
      <h1>Character Counter</h1>
      <TextInput />
      <CharacterCount />
    </div>
  );
}

export default CharacterCounter;
