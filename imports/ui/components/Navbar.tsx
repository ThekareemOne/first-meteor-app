import React from "react";
import useAuth from "../hooks/useAuth";
import { Meteor } from "meteor/meteor";
import { Button, Navbar } from "flowbite-react";
import { useNavigate, Link } from "react-router-dom";

//TODO: Show Navbar for unauthenticated users
const NavBar = () => {
  const isAuthenticated = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    Meteor.logout();
    navigate("/login");
  };

  return isAuthenticated ? (
    <Navbar className="bg-sky-50 mb-4">
      <Navbar.Brand>
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
          {Meteor.user().profile.name}
        </span>
      </Navbar.Brand>
      <div className="flex md:order-2">
        <Button onClick={handleLogout}>Logout</Button>
      </div>
      <Navbar.Collapse>
        <Link to="/">Home</Link>
        <Link to="/article/add">Add Article</Link>
        <Link to="/article/mine">My Articles</Link>
      </Navbar.Collapse>
    </Navbar>
  ) : (
    <></>
  );
};

export default NavBar;
