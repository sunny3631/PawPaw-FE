import Layout from "../components/common/Layout";

const Survey = ({ name, age, imgUrl }) => {
  return (
    <Layout name={name} age={age} imgUrl={imgUrl}>
      <div>문진표 작성하는 곳입니다</div>
    </Layout>
  );
};

export default Survey;
