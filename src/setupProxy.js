const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/api", // /api로 시작하는 요청은 아래의 서버로 프록시 처리
    createProxyMiddleware({
      target: "http://3.37.62.216:8080",
      changeOrigin: true,
    })
  );

  app.use(
    "/another-api", // 추가 서버와 통신할 경우
    createProxyMiddleware({
      target: "http://another-server.com",
      changeOrigin: true,
    })
  );
};
