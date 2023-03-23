import React, { useState, useContext } from "react";
import {
  Box,
  Container,
  Typography,
  Link
} from "@mui/material";

import AppBarMenu from "./components/appBarMenu/AppBarMenu";
import BasesMenu from "./components/basesMenu/BasesMenu"
import PublicationsInfo from "./components/PublicationsInfo/PublicationsInfo"
import Copyright from "./components/Copyright";

export default function App() {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <>
      <Box sx={{ display: "flex", height: "100vh", flexDirection: "column" }}>
        <AppBarMenu handleDrawerToggle={handleDrawerToggle} position="fixed" />
        <Box sx={{ display: "flex", flexGrow: 1 }}>
          <BasesMenu handleDrawerToggle={handleDrawerToggle} mobileOpen={mobileOpen} />
          <Box component="main" sx={{ flexGrow: 1, p: 3, display: "flex", flexDirection: "column" }}> 
            <Container maxWidth="lg">
              <PublicationsInfo />
              <Copyright sx={{ marginTop: "auto" }} />
            </Container>
          </Box>
        </Box>
      </Box>
    </>
  );
}