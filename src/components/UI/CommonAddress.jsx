import { Box, Typography } from '@mui/material';
import * as React from 'react';

const Address = ({ details = null }) => {
  if (!details) {
    return null;
  }
  const { name,
    phNo,
    email,
    address,
    city } = details;

  // let first = line_1;
  // if (line_2) first += first ? `, ${line_2}` : "";
  // if (line_3) first += first ? `, ${line_3}` : "";
  // if (district) first += first ? `, ${district} Dist` : "";
  // let second = state;
  // if (country) second += second ? `, ${country}` : "";

  // if (postalCode) second += second ? `, ${postalCode}` : "";
  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="body1" gutterBottom>
      <b> Name </b> : {name} <br />  <b> Mobile </b> :{phNo},<br /> <b> Email </b> :{email}<br /> <b> Address</b> :{address}<br /> <b> City</b> :{city}<br /> 
      </Typography>
      {/* <Typography variant="body2" gutterBottom>
        {second}
      </Typography> */}
    </Box>
  );
}

export default Address;
