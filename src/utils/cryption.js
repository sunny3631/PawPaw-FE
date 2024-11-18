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
  const salt = encodedData.substring(0, 32);
  const encryptedData = encodedData.substring(32);

  const combineString = metaMaskAddress + process.env.REACT_APP_CUSTOM_MESSAGE;
  const encryptionKey = CryptoJS.PBKDF2(combineString, salt, {
    keySize: 256 / 32,
    iterations: 1000,
  }).toString();

  const decryptedBytes = CryptoJS.AES.decrypt(encryptedData, encryptionKey);
  const decryptedData = decryptedBytes.toString(CryptoJS.enc.Utf8);

  return decryptedData;
};
