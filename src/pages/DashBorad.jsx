import Layout from "../components/common/Layout";
import MedicalHistory from "../components/medicalHistory/MedicalHistroy";
import VaccineDate from "../components/vaccine/VaccineDate";

const DashBoard = ({ name, age, imgUrl }) => {
  return (
    <Layout name={name} age={age} imgUrl={imgUrl}>
      <VaccineDate />
      <MedicalHistory />
    </Layout>
  );
};

export default DashBoard;
