import { useParams } from "react-router-dom";
import Layout from "../components/common/Layout";

const Survey = () => {
  const params = useParams();

  // 데이터 정보가 져고 익
  const name = "";
  const age = "";
  const imgUrl = "";
  return (
    <Layout name={name} age={age} imgUrl={imgUrl}>
      <div>문진표 작성하는 곳입니다</div>
    </Layout>
  );
};

export default Survey;
