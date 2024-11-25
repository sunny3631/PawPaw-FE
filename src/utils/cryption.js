import CryptoJS from "crypto-js";

// 암호화
export const encodeData = (data, metaMaskAddress) => {
  const salt = CryptoJS.lib.WordArray.random(128 / 8).toString();

  const combineString = metaMaskAddress + process.env.REACT_APP_CUSTOM_MESSAGE;
  const encryptionKey = CryptoJS.PBKDF2(combineString, salt, {
    keySize: 256 / 32,
    iterations: 1000,
  }).toString();

  const encryptedData = CryptoJS.AES.encrypt(data, encryptionKey).toString();

  return salt + encryptedData;
};

// 복호화
export const decodeData = (encodedData, metaMaskAddress) => {
  try {
    // 입력값 유효성 검사
    if (!encodedData || !metaMaskAddress) {
      console.error("Missing required parameters:", {
        encodedData,
        metaMaskAddress,
      });
      return "";
    }

    // encodedData가 최소 길이를 만족하는지 확인
    if (encodedData.length < 32) {
      console.error("Encoded data is too short:", encodedData);
      return "";
    }

    const salt = encodedData.substring(0, 32);
    const encryptedData = encodedData.substring(32);

    // 환경변수 확인
    if (!process.env.REACT_APP_CUSTOM_MESSAGE) {
      console.error("Missing REACT_APP_CUSTOM_MESSAGE environment variable");
      return "";
    }

    const combineString =
      metaMaskAddress + process.env.REACT_APP_CUSTOM_MESSAGE;

    // PBKDF2 키 생성
    const encryptionKey = CryptoJS.PBKDF2(combineString, salt, {
      keySize: 256 / 32,
      iterations: 1000,
    }).toString();

    // 복호화 시도
    const decryptedBytes = CryptoJS.AES.decrypt(encryptedData, encryptionKey);

    // UTF-8 디코딩 시도
    const decryptedData = decryptedBytes.toString(CryptoJS.enc.Utf8);

    // 디코딩된 데이터 유효성 검사
    if (!decryptedData) {
      console.error("Failed to decrypt data");
      return "";
    }

    return decryptedData;
  } catch (error) {
    console.error("Error in decodeData:", error);
    return "";
  }
};
