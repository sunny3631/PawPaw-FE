import React from "react";
import styled from "styled-components";


/* 스타일 컴포넌트 */
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: #FFECCF;
  border-radius: 10px;
  border: 15px #F9D49B solid;
  padding: 20px;
  width: 400px;
  position: relative;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  color: #4a4343;
  cursor: pointer;
  position: absolute;
  top: 10px;
  right: 10px;

  &:hover {
    color: #ff6b6b;
  }
`;

const AddModal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}>&times;</CloseButton>
        {children}
      </ModalContent>
    </ModalOverlay>
  );
};

export default AddModal;
