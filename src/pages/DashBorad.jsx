import { useParams } from "react-router-dom";
import Layout from "../components/common/Layout";
import MedicalHistory from "../components/medicalHistory/MedicalHistroy";
import VaccineDate from "../components/vaccine/VaccineDate";
import { child } from "../api/child";
import { useState, useEffect } from "react";

const DashBoard = () => {
  const params = useParams();
  const [information, setInformation] = useState({
    name: "",
    age: "",
    imgUrl: "",
  });

  useEffect(() => {
    const fetchChildData = async () => {
      try {
        const response = await child.return(params.id);

        if (response.data.isSuccess) {
          setInformation({
            name: response.data.result.name,
            age: response.data.result.birthDate,
            imgUrl: response.data.result.profile,
          });
        }
      } catch (error) {
        console.error("데이터 조회 실패:", error);
      }
    };

    if (params.id) {
      fetchChildData();
    }
  }, [params.id]); // params.id가 변경될 때만 실행

  return (
    <Layout
      name={information.name}
      age={information.age}
      imgUrl={information.imgUrl} // profile -> imgUrl로 수정
    >
      <VaccineDate />
      <MedicalHistory />
    </Layout>
  );
};

export default DashBoard;
