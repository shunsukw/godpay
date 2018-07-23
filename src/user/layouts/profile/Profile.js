import React, { Component } from 'react'
import {database} from "../../../index";
import {Link} from "react-router"
import QRCode from "qrcode.react"
// この画像は仮に置いているだけです。本来であれば、firebaseから取ってきます。

class Profile extends Component {
  constructor(props, { authData }) {
    super(props)
    authData = this.props
    this.state={
      joins: null
    }
  }

  componentWillMount() {
    database.ref(`/users/${this.props.authData.name}/joined`).once("value", snapshot => {
      const joins = snapshot.val()
      this.setState({
        joins
      })
    })
  }

  render() {
    console.log(this.state)

    return(
      <main className="container">
        <div className="pure-g">
          <div className="pure-u-1-1">
            <h1>Profile</h1>
            <div style={profileStyle}>
              <div>
                <div><img src={this.props.authData.avatar.uri} alt="avatar" style={imageStyle}/></div>
                <div style={textStyle}>
                  <div>Name: {this.props.authData.name} Rodorigues</div>
                  <div>Nationality: {this.props.authData.country}</div>
                  <div>Phone: {this.props.authData.phone}</div>
                </div>
              </div>
            </div>
            <div>
              {/*QRどもを表示*/}
              <div style={qrStyle}>
                {
                  this.state.joins &&
                  Object.keys(this.state.joins).map((join, index) => {
                    console.log(this.state.joins[join])
                    return (
                      <div style={qrcardStyle}>
                        <QRCode value={this.state.joins[join].code} />
                        <div>{this.state.joins[join].name}</div>
                        <p>{this.state.joins[join].id}</p>
                      </div>
                    )
                  })
                }
              </div>
            </div>
          </div>
        </div>
      </main>
    )
  }
}

export default Profile

const profileStyle = {
  width: 500,
  margin: "40px auto 40px auto",
  backgroundColor: "#6633FF",
  padding: "auto",
  borderRadius: 10
}

const textStyle = {
  margin: "auto"
}

const imageStyle = {
  borderRadius: 10,
  margin: "50px 100px 50px 100px",
  height: 300,
  width: 300
}

const qrStyle = {
  display: "flex",
  textAlign: "center"
}

const qrcardStyle = {
  margin: 10
}