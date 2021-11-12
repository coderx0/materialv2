import React, { useContext, useState } from "react";
import Navbar from "@material-tailwind/react/Navbar";
import NavbarContainer from "@material-tailwind/react/NavbarContainer";
import NavbarWrapper from "@material-tailwind/react/NavbarWrapper";
import NavbarBrand from "@material-tailwind/react/NavbarBrand";
import NavbarToggler from "@material-tailwind/react/NavbarToggler";
import NavbarCollapse from "@material-tailwind/react/NavbarCollapse";
import Nav from "@material-tailwind/react/Nav";
import NavItem from "@material-tailwind/react/NavItem";
import "@material-tailwind/react/tailwind.css";
import { Link } from "react-router-dom";
import AuthContext from "../Store/AuthContext";
import Box from '@mui/material/Box';

export default function Navigationbar() {
    const [openNavbar, setOpenNavbar] = useState(false);
    const authCtx = useContext(AuthContext);
    const show = authCtx.user ? authCtx.userName? true : false : false;
  return (
      <Box sx={{
          position: "sticky",
          top: 0,
          zIndex:10
      }}>
          <Navbar color="teal" navbar>
    <NavbarContainer>
        <NavbarWrapper>
                  <NavbarBrand>
                      <Link to="/">
                      ImageDash
                      </Link>
                      </NavbarBrand>
            <NavbarToggler
                color="white"
                onClick={() => setOpenNavbar(!openNavbar)}
                ripple="light"
            />
        </NavbarWrapper>

        <NavbarCollapse open={openNavbar}>
            <Nav>
                          {show && <Link to="/upload">
                              <NavItem active="light" ripple="light">
                          Upload Image
                              </NavItem></Link>}
                          
                          {show && <Link to="/profile">
                              <NavItem ripple="light">
                                  Profile</NavItem></Link>}
                          
                          {show &&
                              <NavItem ripple="light" onClick={() => { authCtx.logout() }}>
                                Logout       
                              </NavItem>}
                          
                      {!authCtx.isLoggedIn && <Link to="/authentication">
                      <NavItem ripple="light">
                        Signin   
                      </NavItem></Link>}
            </Nav>
        </NavbarCollapse>
    </NavbarContainer>
</Navbar>
    </Box>
  );
}