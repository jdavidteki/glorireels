import React, { Component } from "react";

import twitterIcon from "../../../static/img/twitter---negative-1@2x.png";
import instagramIcon from "../../../static/img/instagram---negative-1@2x.png";

import "./Footer.css";

class Footer extends Component {
  constructor(props){
    super(props);

    this.state = {
      catSelected: "glorireels",
      findMeIconHover: "#6c47db",
    }
  }

  render() {
    return (
      <div className={"Footer-default"}>
        <div className="frame-142">
          <div className="frame-140">
            <a href="https://www.twitter.com/glorireels/"  target="_blank"><img className="twitter-negative" src={twitterIcon} /></a>
            <a href="https://www.instagram.com/glorireels/"  target="_blank"><img className="instagram-negative" src={instagramIcon} /></a>
          </div>
        </div>
      </div>
    )
  };
}

export default Footer;
