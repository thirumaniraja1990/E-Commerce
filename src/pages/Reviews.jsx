import React from "react";
import CommonSection from "../components/UI/CommonSection";
import Helmet from "../components/Helmet/Helmet";

const Reviews = () => {
  return (
    <>
      <Helmet title="Reviews"></Helmet>
      <CommonSection title="Reviews" />
      <section>
        <script
          src="https://static.elfsight.com/platform/platform.js"
          data-use-service-core
          defer
        ></script>
        <div class="elfsight-app-8f1088ba-2565-4396-9c18-9ea8212abad6"></div>
      </section>
    </>
  );
};

export default Reviews;
