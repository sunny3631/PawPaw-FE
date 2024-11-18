const toUnixTimestamp = (dataStr) => {
  const date = new Date(
    `${dataStr.slice(0, 4)}-${dataStr.slice(4, 6)}-${dataStr.slice(6, 8)}`
  );
  return Math.floor(date.getTime() / 1000);
};

export default toUnixTimestamp;
