import React from "react";
import * as FaIcon from "react-icons/fa";
import * as GiIcon from "react-icons/gi";

export const SidebarData = [
  {
    title: "Login",
    path: "/login",
    icon: <FaIcon.FaArrowAltCircleRight />,
    cName: "nav-text",
  },
  {
    title: "Nearby",
    path: "/cityaroundme",
    icon: <FaIcon.FaCity />,
    cName: "nav-text",
  },
  {
    title: "Flight",
    path: "/FlightSearch",
    icon: <FaIcon.FaPlaneDeparture />,
    cName: "nav-text",
  },
  {
    title: "Personals",
    path: "/personals",
    icon: <FaIcon.FaBookReader />,
    cName: "nav-text",
  },
  {
    title: "Restaurants",
    path: "/recommendations",
    icon: <GiIcon.GiKnifeFork />,
    cName: "nav-text",
  },
];
