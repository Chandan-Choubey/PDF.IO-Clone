<<<<<<< HEAD
import React from "react";
import CompressPDF from "./CompressPDF";
import SecurePdf from "./SecurePdf";

const Utilities = ({ selectedComponent }) => {
  return (
    <>
      {selectedComponent === "fileCompressor" && <CompressPDF />}
      {selectedComponent === "securePdf" && <SecurePdf />}
    </>
  );
};

export default Utilities;
=======
import React from 'react';
import CompressPDF from './CompressPDF';
import SecurePdf from './SecurePdf';

const Utilities = ({ selectedComponent }) => {
  return (
    <>
      {selectedComponent === 'fileCompressor' && <CompressPDF />}
      {selectedComponent === 'securePdf' && <SecurePdf />}
    </>
  );
};

export default Utilities;
>>>>>>> friend-repo/main
