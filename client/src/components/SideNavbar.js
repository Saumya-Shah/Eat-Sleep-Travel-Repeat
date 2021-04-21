import React from "react";
import * as FaIcon from "react-icons/fa";
import * as AiIcon from "react-icons/ai";
import { Link } from "react-router-dom";
import { SidebarData } from "./SidebarData";
import "../style/SideNavbar.css";
import { IconContext } from "react-icons";

export default class SideNavbar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      sidebar: false,
    };
    this.showSidebar = this.showSidebar.bind(this);
  }

  showSidebar() {
    this.setState({ sidebar: !this.state.sidebar });
  }

  render() {
    return (
      <>
        <IconContext.Provider value={{ color: "f5f5f5" }}>
          <div className="sideNavbar">
            <Link to="#" className="menu-bars">
              <FaIcon.FaBars onClick={this.showSidebar} />
            </Link>
          </div>
          <nav className={this.state.sidebar ? "nav-menu active" : "nav-menu"}>
            <ul className="navbar-menu-items" onClick={this.showSidebar}>
              <li className="navbar-toggle">
                <Link to="#" className="menu-bars">
                  <AiIcon.AiOutlineClose />
                </Link>
              </li>
              {SidebarData.map((item, index) => {
                return (
                  <li key={index} className={item.cName}>
                    <Link to={item.path}>
                      {item.icon}
                      <span>{item.title}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </IconContext.Provider>
      </>
    );
  }
}
