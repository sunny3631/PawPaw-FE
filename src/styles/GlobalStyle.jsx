import { createGlobalStyle } from "styled-components";
const GlobalStyles = createGlobalStyle`
*, *::before, *::after {
  box-sizing : border-box;
}

@font-face {
  font-family: 'KOTRAHOPE';
  src: url('https://fastly.jsdelivr.net/gh/projectnoonnu/noonfonts_2110@1.0/KOTRAHOPE.woff2') format('woff2');
  font-weight: normal;
  font-style: normal;
}
    
body {
  margin: 0;
  font-family: 'KOTRAHOPE', sans-serif;
}
`;
export default GlobalStyles;
