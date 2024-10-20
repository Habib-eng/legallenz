import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  SvgIcon,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { NavLink, useNavigate } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import HomeIcon from "@mui/icons-material/Home";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import DescriptionIcon from "@mui/icons-material/Description";
import PersonIcon from "@mui/icons-material/Person";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import LoginIcon from "@mui/icons-material/Login";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import { Image } from "@mui/icons-material";

const activeStyle = {
  borderBottom: "3px solid #f57c00",
  borderRadius: "12px 12px 0 0",
  paddingBottom: "4px",
};

const Navbar = ({ theme, onThemeToggle, onLogout }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkLoggedInStatus = () => {
      const userId = localStorage.getItem("userId");
      setIsLoggedIn(!!userId);
    };

    checkLoggedInStatus();

    const interval = setInterval(checkLoggedInStatus, 1000);

    return () => clearInterval(interval);
  }, []);

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setDrawerOpen(open);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    onLogout();
    navigate("/login");
    setIsLoggedIn(false);
  };

  const renderNavLinks = (
    <>
      <Button
        component={NavLink}
        to="/home"
        style={({ isActive }) => (isActive ? activeStyle : undefined)}
        sx={{
          color: theme === "dark" ? "white" : "black",
          marginRight: 2,
          font: "inherit",
          textTransform: "none",
          display: "flex",
          alignItems: "center",
        }}
      >
        <HomeIcon sx={{ marginRight: 1 }} /> Home
      </Button>
      <Button
        component={NavLink}
        to="/how-to-use"
        style={({ isActive }) => (isActive ? activeStyle : undefined)}
        sx={{
          color: theme === "dark" ? "white" : "black",
          marginRight: 2,
          font: "inherit",
          textTransform: "none",
          display: "flex",
          alignItems: "center",
        }}
      >
        <HelpOutlineIcon sx={{ marginRight: 1 }} /> How to Use
      </Button>
      <Button
        component={NavLink}
        to="/documents"
        style={({ isActive }) => (isActive ? activeStyle : undefined)}
        sx={{
          color: theme === "dark" ? "white" : "black",
          marginRight: 2,
          font: "inherit",
          textTransform: "none",
          display: "flex",
          alignItems: "center",
        }}
      >
        <DescriptionIcon sx={{ marginRight: 1 }} /> Documents
      </Button>
      <Button
        component={NavLink}
        to="/profile"
        style={({ isActive }) => (isActive ? activeStyle : undefined)}
        sx={{
          color: theme === "dark" ? "white" : "black",
          marginRight: 2,
          font: "inherit",
          textTransform: "none",
          display: "flex",
          alignItems: "center",
        }}
      >
        <PersonIcon sx={{ marginRight: 1 }} /> Profile
      </Button>

      {isLoggedIn ? (
        <Button
          onClick={handleLogout}
          sx={{
            color: "red",
            "&:hover": { color: "white" },
            marginRight: 2,
            font: "inherit",
            textTransform: "none",
            display: "flex",
            alignItems: "center",
          }}
        >
          <ExitToAppIcon sx={{ marginRight: 1 }} /> Logout
        </Button>
      ) : (
        <Button
          component={NavLink}
          to="/login"
          style={({ isActive }) => (isActive ? activeStyle : undefined)}
          sx={{
            color: theme === "dark" ? "white" : "black",
            marginRight: 2,
            font: "inherit",
            textTransform: "none",
            display: "flex",
            alignItems: "center",
          }}
        >
          <LoginIcon sx={{ marginRight: 1 }} /> Login
        </Button>
      )}

      <Button
        component={NavLink}
        to="/register"
        style={({ isActive }) => (isActive ? activeStyle : undefined)}
        sx={{
          color: theme === "dark" ? "white" : "black",
          font: "inherit",
          textTransform: "none",
          display: "flex",
          alignItems: "center",
        }}
      >
        <AppRegistrationIcon sx={{ marginRight: 1 }} /> Register
      </Button>
    </>
  );

  return (
    <AppBar
      position="static"
      sx={{
        bgcolor: theme === "dark" ? "#333" : "white",
        zIndex: 1000,
        padding: 1,
        transition: "background-color 0.3s ease, color 0.3s ease",
      }}
    >
      <Toolbar>
        <Typography
          variant="h1"
          component={NavLink}
          to="/"
          sx={{
            flexGrow: 1,
            color: "#f57c00",
            font: "inherit",
            fontWeight: "bold",
            fontSize: "2rem",
            textDecoration: "none",
          }}
        >
          <SvgIcon>
            <svg width="100vh" height="50vh" id="Layer_2" data-name="Layer 2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 244.87 204.41">
              <g id="Layer_1-2" data-name="Layer 1">
                <g id="Layer_2-2" data-name="Layer 2">
                  <g>
                    <path d="m166.87,111.81c.52-.83,1.05-1.64,1.54-2.48.79-1.35,1.55-2.72,2.32-4.08,1.48-2.62,4.96-3.02,7.19-1.74,8.2,4.73,16.41,9.44,24.62,14.16,4.29,2.46,8.58,4.93,12.87,7.38,2.99,1.71,3.71,4.5,1.97,7.46-2.79,4.74-5.57,9.49-8.27,14.27-1.44,2.55-4.63,3.41-7.21,1.92-4.77-2.75-9.52-5.53-14.3-8.27-4.27-2.45-8.56-4.86-12.83-7.31-3.49-2.01-6.97-4.04-10.44-6.08-1.5-.88-2.59-2.11-2.68-3.93-.04-.67.11-1.37.27-2.03.24-.95.2-1.03-.65-1.51-2.33-1.33-4.65-2.69-6.97-4.04-1.09-.64-.82-.62-1.61.25-.37.41-.69.87-1.15,1.48-.03-.39-.07-.61-.07-.83,0-5.55,0-11.09-.02-16.64,0-.52.16-.7.69-.7,2.89.02,5.78,0,8.68.02.41,0,.83.13,1.37.22-.56.68-.06.87.34,1.11,2.21,1.27,4.42,2.54,6.64,3.8.4.22.45.46.26.87-.87,1.86-1.72,3.73-2.55,5.61-.14.31-.18.67-.27,1.01.08.03.16.07.24.1Zm40.24,31.39c.09.07.17.15.26.22.04-.1.06-.22.12-.31.82-1.28,1.7-2.52,2.46-3.83,1.5-2.59,2.86-5.27,4.42-7.83,1.17-1.91.93-2.73-1.01-3.84-5.36-3.07-10.68-6.21-16.01-9.32-.34-.2-.7-.36-1.05-.55-.06.08-.11.16-.17.23.11.07.23.13.33.2,2.24,1.64,4.47,3.29,6.71,4.92,2.88,2.09,5.77,4.16,8.65,6.26.73.53.87,1.11.51,1.93-1.03,2.31-2.08,4.6-3.1,6.92-.73,1.65-1.41,3.33-2.12,4.99Z" />
                    <path d="m99.26,0C60.21,0,28.56,31.65,28.56,70.7s31.65,70.7,70.7,70.7,70.7-31.65,70.7-70.7S138.31,0,99.26,0Zm0,122.35c-28.52,0-51.64-23.12-51.64-51.65s23.12-51.64,51.64-51.64,51.65,23.12,51.65,51.64-23.12,51.65-51.65,51.65Z" />
                  </g>
                  <path class="cls-1" d="m107.97,70.53c-.93.45-1.81,1.02-2.66,1.59-.07.04-.13.09-.19.13-.64.51-1.3.99-1.91,1.55-.39.36-.77.74-1.15,1.12-.8.79-1.44,1.71-2.13,2.58-.48.69-.9,1.4-1.31,2.13-.45.88-.88,1.77-1.25,2.67-.34.89-.76,1.72-1.14,2.57-.18.5-.41.96-.61,1.44-.22.39-.31.88-.61,1.23l-.16.16c-.39.48-.92.73-1.52.8-.99.13-1.84-.16-2.48-.95-.16-.19-.26-.39-.36-.61-.31-.7-.6-1.4-.93-2.09-.25-.53-.44-1.06-.67-1.6-.38-.83-.73-1.65-1.11-2.48-.77-1.69-1.78-3.25-2.96-4.7-.01-.01-.03-.04-.04-.06-.35-.39-.71-.8-1.08-1.18-.45-.48-.93-.93-1.44-1.36-.06-.06-.13-.13-.19-.19-.25-.19-.5-.39-.74-.58-.66-.53-1.39-.95-2.09-1.43-.57-.31-1.15-.61-1.74-.92-.98-.44-1.96-.88-2.93-1.33-.47-.19-.93-.38-1.39-.63-.54-.15-1.02-.45-1.55-.66-.42-.16-.83-.39-1.25-.55-.79-.31-1.34-.86-1.68-1.63q-.04-.09-.13-.15v-.1h.03s-.03-.03-.03-.04v-1.44c.16-.06.15-.23.2-.36.25-.69.76-1.12,1.4-1.42,1.09-.51,2.2-.98,3.3-1.47.04-.01.09-.01.12-.03.64-.32,1.3-.61,1.95-.88.76-.36,1.53-.66,2.26-1.07.31-.16.61-.32.92-.48.73-.44,1.43-.89,2.12-1.39l.04-.04s.03-.01.04-.03c.74-.55,1.44-1.18,2.12-1.82.76-.73,1.43-1.53,2.09-2.36.82-1.07,1.53-2.2,2.14-3.41.41-.79.73-1.62,1.09-2.44.32-.77.64-1.55.95-2.32.18-.42.36-.85.54-1.27.19-.48.38-.96.58-1.44.23-.55.6-1.02,1.12-1.34.16-.1.39-.07.51-.25.41-.07.83-.06,1.24-.1.12.18.31.13.47.15.42.12.79.34,1.08.67.42.45.64,1.01.83,1.56.18.41.36.79.48,1.2.1.36.36.67.44,1.05.2.39.38.8.51,1.23.09.36.36.64.44,1.02.19.47.39.93.58,1.4.25.55.54,1.09.83,1.63.12.22.25.44.36.64.44.76.95,1.46,1.47,2.14.01.01.01.06.01.07.44.51.89,1.02,1.33,1.53.28.31.63.55.88.89,1.17,1.05,2.41,2,3.75,2.82.07.04.13.09.2.13-.01.15.06.15.16.09,1.05.58,2.13,1.08,3.24,1.56.83.36,1.66.74,2.49,1.12.71.29,1.42.6,2.1.93.19.09.39.16.6.25.98.42,1.56,1.14,1.68,2.22.12,1.05-.19,1.91-1.02,2.58-.07.04-.16.09-.23.13-.45.26-.95.45-1.43.66-.45.2-.9.42-1.37.63-.47.19-.9.44-1.39.6-1.28.58-2.55,1.14-3.82,1.74Z" />
                  <path class="cls-1" d="m129.91,90.94s-.06.03-.06.04c-.18.57-.66.76-1.14.98-1.24.55-2.49,1.04-3.62,1.81-.8.55-1.52,1.21-2.2,1.91-.53.53-.93,1.14-1.34,1.75-.58.98-1.02,2.01-1.46,3.05-.16.39-.41.71-.8.92-.04.03-.13.03-.06.12h-.98c.04-.09-.04-.09-.09-.1-.41-.19-.67-.5-.83-.92-.19-.48-.41-.96-.63-1.44-.28-.6-.61-1.17-.92-1.74-.42-.58-.85-1.18-1.33-1.71-.74-.8-1.58-1.49-2.48-2.07-.58-.35-1.2-.61-1.79-.93-.64-.28-1.3-.55-1.94-.86-.45-.22-.71-.6-.77-1.11-.06-.88.29-1.39,1.18-1.71.74-.35,1.52-.64,2.26-1.02.69-.36,1.34-.76,1.96-1.25.03-.03.06-.03.09-.04.66-.57,1.3-1.15,1.84-1.84.77-.96,1.43-2,1.88-3.15.04-.12.12-.23.18-.35.19-.5.36-.99.6-1.47.34-.7,1.36-.96,1.98-.54.09.06.15.15.2.22.16.09.28.2.34.36.36.83.71,1.68,1.06,2.51.25.45.5.9.76,1.34.1.18.2.34.32.51.04,0,.09.03.12.07.45.66.98,1.24,1.58,1.78.31.25.58.55.92.77.47.34.96.66,1.47.93.25.15.53.26.79.39l1.88.83c.06.03.12.07.18.1.28.18.58.32.73.66.01.06.06.1.13.12.07.36.09.71,0,1.08Z" />
                  <path d="m107.13,58.11c-.1.06-.18.06-.16-.09.06.03.1.06.16.09Z" />
                  <text class="cls-2" transform="translate(0 192.22)"><tspan x="0" y="0">LegalLens</tspan></text>
                </g>
              </g>
            </svg>
          </SvgIcon>LegalLens
        </Typography>
          
        <Box sx={{ display: { xs: "none", md: "flex" } }}>{renderNavLinks}</Box>

        <IconButton
          onClick={onThemeToggle}
          sx={{ marginLeft: 2, color: theme === "dark" ? "white" : "black" }}
        >
          {theme === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>

        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ display: { xs: "flex", md: "none", marginLeft: "4px" } }}
          onClick={toggleDrawer(true)}
        >
          <MenuIcon sx={{ color: theme === "dark" ? "white" : "black" }} />
        </IconButton>
      </Toolbar>

      <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
        <Box
          sx={{
            width: 250,
            padding: 2,
            height: "100%",
            bgcolor: theme === "dark" ? "#333" : "white",
          }}
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          <List sx={{ bgcolor: theme === "dark" ? "#333" : "white" }}>
            <ListItem
              button
              component={NavLink}
              to="/home"
              sx={{
                color: theme === "dark" ? "white" : "black",
                "&:hover": { color: theme === "dark" ? "white" : "black" },
                borderRadius: "8px",
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: "40px",
                  color: theme === "dark" ? "white" : "black",
                }}
              >
                <HomeIcon />
              </ListItemIcon>
              <ListItemText disableTypography primary="Home" />
            </ListItem>

            <ListItem
              button
              component={NavLink}
              to="/how-to-use"
              sx={{
                color: theme === "dark" ? "white" : "black",
                "&:hover": { color: theme === "dark" ? "white" : "black" },
                borderRadius: "8px",
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: "40px",
                  color: theme === "dark" ? "white" : "black",
                }}
              >
                <HelpOutlineIcon />
              </ListItemIcon>
              <ListItemText disableTypography primary="How to Use" />
            </ListItem>

            <ListItem
              button
              component={NavLink}
              to="/documents"
              sx={{
                color: theme === "dark" ? "white" : "black",
                "&:hover": { color: theme === "dark" ? "white" : "black" },
                borderRadius: "8px",
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: "40px",
                  color: theme === "dark" ? "white" : "black",
                }}
              >
                <DescriptionIcon />
              </ListItemIcon>
              <ListItemText disableTypography primary="Documents" />
            </ListItem>

            <ListItem
              button
              component={NavLink}
              to="/profile"
              sx={{
                color: theme === "dark" ? "white" : "black",
                "&:hover": { color: theme === "dark" ? "white" : "black" },
                borderRadius: "8px",
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: "40px",
                  color: theme === "dark" ? "white" : "black",
                }}
              >
                <PersonIcon />
              </ListItemIcon>
              <ListItemText disableTypography primary="Profile" />
            </ListItem>
            {isLoggedIn ? (
              <ListItem
                button
                onClick={handleLogout}
                sx={{
                  color: "red",
                  "&:hover": { color: "red" },
                  borderRadius: "8px",
                }}
              >
                <ListItemIcon sx={{ minWidth: "40px", color: "red" }}>
                  <ExitToAppIcon />
                </ListItemIcon>
                <ListItemText disableTypography primary="Logout" />
              </ListItem>
            ) : (
              <ListItem
                button
                component={NavLink}
                to="/login"
                sx={{
                  color: theme === "dark" ? "white" : "black",
                  "&:hover": { color: theme === "dark" ? "white" : "black" },
                  borderRadius: "8px",
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: "40px",
                    color: theme === "dark" ? "white" : "black",
                  }}
                >
                  <LoginIcon />
                </ListItemIcon>
                <ListItemText disableTypography primary="Login" />
              </ListItem>
            )}

            <ListItem
              button
              component={NavLink}
              to="/register"
              sx={{
                color: theme === "dark" ? "white" : "black",
                "&:hover": { color: theme === "dark" ? "white" : "black" },
                borderRadius: "8px",
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: "40px",
                  color: theme === "dark" ? "white" : "black",
                }}
              >
                <AppRegistrationIcon />
              </ListItemIcon>
              <ListItemText disableTypography primary="Register" />
            </ListItem>

            <ListItem
              button
              onClick={toggleDrawer(false)}
              sx={{
                color: theme === "dark" ? "white" : "black",
                "&:hover": { color: theme === "dark" ? "white" : "black" },
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: "40px",
                  color: theme === "dark" ? "white" : "black",
                }}
              >
                <CloseIcon />
              </ListItemIcon>
              <ListItemText disableTypography primary="Close" />
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </AppBar>
  );
};

export default Navbar;
