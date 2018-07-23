import React, { Component } from 'react';
import { connect } from "react-redux";
import { loginUser } from "../../user/ui/loginbutton/LoginButtonActions";
import { HiddenOnlyAuth, VisibleOnlyAuth } from '../../util/wrappers.js'
import Background from '../../img/top_pic.jpg';
import "../../css/fonts.css"
import { injectGlobal } from 'styled-components';
import selima from '../../fonts/selima/selima_.otf';

class Home extends Component {

  render() {

    const OnlyGuestLinks = HiddenOnlyAuth(() =>
      <section>
        <div style={homeStyle} onClick={(event) => this.props.onLoginUserClick(event)}>
          <div className="title" style={titleStyle}>Start your own journey</div>
        </div>
      </section>
    )

    const OnlyAuthLinks = VisibleOnlyAuth(() =>
      <section>
        <div style={homeStyle} >
          <div className="title" style={titleStyle}>Start your own journey</div>
        </div>
      </section>
    )

    return (
      <main className="container" style={backgroundStyle} >
        <div className="pure-g" >
          <div className="pure-u-1-1">
            <OnlyGuestLinks />
            <OnlyAuthLinks />
          </div>
        </div>
      </main>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {}
}

const mapDispatchToProps = (dispatch) => {
  return {
    onLoginUserClick: (event) => {
      event.preventDefault();

      dispatch(loginUser())
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);


const homeStyle = {
  width: "50vw",
  height: "10vh",
  margin: "200px auto auto auto",
  textAlign: "center",
  backgroundColor: "rgba(128,128,128,0.0)",
  cursor: "pointer",
  borderRadius: 30,
  display: "table"
}

const backgroundStyle = {
  width: "100vw",
  height: "100vh",
  background: `url(${Background})`,
  backgroundPosition: "center",
  backgroundSize: "cover",
  backgroundRepeat: "no-repeat"
}

const titleStyle = {
  textAlign: "center",
  display: "table-cell",
  fontSize: "550%",
  verticalAlign: "middle",
  fontFamily: "selima"
}

injectGlobal`
    @font-face {
        font-family: 'selima';
        src: url(${selima}) format('opentype');
        font-weight: normal;
        font-style: normal;
    }

    .title {
        font-family: 'selima', sans-serif;
        c-webkit-transform: scale(1);
        transform: scale(1);
        -webkit-transition: .3s ease-in-out;
        transition: .3s ease-in-out;
    }

    .title:hover {
        font-family: 'selima', sans-serif;
        -webkit-transform: scale(1.2);
        transform: scale(1.2);
    }
`;
