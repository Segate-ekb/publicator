import React from "react";
import { Typography, Link } from "@mui/material";
import CopyrightIcon from "@mui/icons-material/Copyright";

function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary" align="center">
      <CopyrightIcon fontSize="small" sx={{ verticalAlign: "middle", mr: 0.5 }} />
      <Link color="inherit" href="https://1cDevelopers.ru/">
        1cDevelopers.ru
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

export default Copyright;