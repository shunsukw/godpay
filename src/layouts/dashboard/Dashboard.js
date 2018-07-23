import React, {
  Component
} from 'react'

// Ethreum
import web3 from '../web3'
import TicketFactoryContract from '../../deploy/contract_factory'
import abi from '../../deploy/contract_ticket'

// Images and Fonts
import Background from '../../img/sensouji.jpg';
import { injectGlobal } from 'styled-components';
import selima from '../../fonts/selima/selima_.otf';
import use from '../../img/use.png';

// Firebase 
import firebase from 'firebase';

class Dashboard extends Component {
  constructor(props, { authData }) {
    super(props)
    authData = this.props
    this.state = {}
  }

  async componentWillMount() {
    const addresses = await TicketFactoryContract.methods.getDeployedTickets().call()
    const accounts = await web3.eth.getAccounts()
    const account = accounts[0]
    let contracts = []
    console.log(
      addresses
    )
    if (addresses.length !== 0) {
      await addresses.map(async (address) => {
        let contract = await new web3.eth.Contract(abi, address)
        // let uid_test = await contract.methods.requests[0].call()
        console.log(contract.methods)
        console.log({
          contract
        })
        contracts.push(contract)
      })
      this.setState({
        contracts,
      })
    }
    this.setState({
      account,
    })
    console.log(this.state)
  }

  implementRefundFunc = async () => {
    let account = this.state.account
    let id = this.state.id
    let TicketContracts = this.state.contracts
    let TicketContract = TicketContracts[id]
    await TicketContract.methods.getRefund().send({
      from: account,
      gas: 4700000
    }).then(async () => {
      console.log("happen: getRefund")
    })
  }

  render() {
    console.log(this.props.authData)
    return (
      <main className="container" style={backgroundStyle}>
        <div className="pure-g">
          <div className="pure-u-1-1">
            <div>
              <section>
                <div>
                  <div className="title" style={titleStyle}>Welcome Home {this.props.authData.name}!!</div>
                </div>
              </section>
              <div style={boxStyle}>
                <img src={use} style={useStyle}/>
              </div>
            </div>
          </div>
        </div>
      </main>
    )
  }
}

export default Dashboard

const homeStyle = {
  width: "50vw",
  height: "1vh",
  margin: "200px auto auto auto",
  textAlign: "center",
  backgroundColor: "rgba(128,128,128,0.3)",
  borderRadius: 30,
  display: "table"
}

const useStyle = {
  width: "70vw",
  height: "60vh",
  margin: "auto" 
  
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
  height: "30vh",
  width: "100vw",
  textAlign: "center",
  display: "table-cell",
  fontSize: "750%",
  verticalAlign: "middle",
  fontFamily: "selima",
  color: "white"
}

const boxStyle = {
  margin : "auto",
  height: "30vh",
  width: "100vw",
  textAlign: "center",
  
}

