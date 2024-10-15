import Layout from "../components/common/Layout";

const MyPage = ({ name, imgUrl }) => {
  return (
    <Layout name={name} imgUrl={imgUrl}>
      <div>문진표 작성하는 곳입니다</div>
    </Layout>
  );
};

export default MyPage;
