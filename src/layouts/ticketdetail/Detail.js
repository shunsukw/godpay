import React, { Component } from 'react'
import { Card, CardMedia } from "material-ui/Card";
import DatePicker from 'react-datepicker';
import moment from 'moment';
import "react-datepicker/dist/react-datepicker.css";
import createKeccakHash from "keccak";
import Mnemonic from "bitcore-mnemonic"
// ここの画像は仮です
import {Link} from "react-router"
import Sensouji from "../../img/sensouji.jpg"
// ethereum
import web3 from "../web3";
import TicketFactoryContract from "../../deploy/contract_factory";
import abi from "../../deploy/contract_ticket";
import { db, database } from '../../index'

class Detail extends Component {
    constructor(props, {authData}) {
        super(props);
        authData = this.props;

        this.state = {
            toDate: moment(),
            number: 1
        };

        this.handleChangeDate = this.handleChangeDate.bind(this);
        this.handleChangeNumber = this.handleChangeNumber.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.implementJoin = this.implementJoin.bind(this)
    }

    handleChangeDate(date) {
        console.log(date)
        this.setState({
            toDate: date
        });
    }

    handleChangeNumber(e) {
        e.preventDefault();
        this.setState({
            number: e.target.value
        })
    }

    handleSubmit(e) {
        e.preventDefault()
        // daysを計算
        const fromDate = moment();
        const toDate = this.state.toDate;
        const days = toDate.diff(fromDate, "days") + 1;
        // uidKey
        var code = new Mnemonic(Mnemonic.Words.ENGLISH).phrase;
        const uidKey = createKeccakHash('keccak256').update(code).digest('hex')
        // num
        const num = this.state.number;

        console.log("handle submit")

        // Solidity処理は未実
        this.implementJoin(days, num, uidKey, code)        // 渡すのはmnimonicなのかそれともkecchackしたmnimonicなのか
        this.setState({
            done: true
        })
    }

    async componentWillMount() {
        console.log(this.props.location.pathname)

        const path = this.props.location.pathname;
        const id = path.split("/")[2]
        console.log("id:", id)

        const names = ["Shinagawa aquarium",
            "giburi",            
            "Kabukiza",
            "The National Museum of Modern Art",
            "Ikebukuro Planetarium",
            "sensouji",
            "Tokyo sky tree",
            "The Ueno Zoo"
        ]
        console.log("name", names[parseInt(id)])
        // idに対応する情報取る
        db.collection(`tickets`).doc(`${names[parseInt(id)]}`).get().then(doc => {
            const data = doc.data()
            console.log("data" ,data)
            this.setState({
                id: data.id,
                name: data.name,
                place: data.place,
                price: data.price,
                text: data.text,
                storageID: data.strageID
            })
        });
        
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

    async implementJoin(days, num, uidKey, code) {
        let account = this.state.account
        let id = this.state.id
        let TicketContracts = this.state.contracts
        let TicketContract = TicketContracts[id]
        let price = this.state.price
        let value = web3.utils.toWei(String(price * num), "ether")

        const names = ["Shinagawa aquarium",
            "giburi",
            "Kabukiza",
            "The National Museum of Modern Art",
            "Ikebukuro Planetarium",
            "sensouji",
            "Tokyo sky tree",
            "The Ueno Zoo"
        ]
        
        // firebase のuserにmnimoniicを保存
        database.ref(`users/${this.props.authData.name}/joined`).push({
            id: id,
            name: names[id],
            code: code
        })


        TicketContract.methods.join(days, num, uidKey).send({
            from: account,
            value: 1000,
            gas: 7000000
        })
    }

    render() {
        console.log("detail componentのstate⬇️");
        return (
            <main className="container" style={backgroundStyle} >
                <div className="pure-g" >
                    <div className="pure-u-1-1">
                        <div style={containerStyle}>
                            <section style={leftStyle}>
                                <Card style={cardStyle}>
                                    <CardMedia>
                                        <img src={this.state.storageID} alt="sensouji" />
                                    </CardMedia>
                                </Card>
                                <div style={titleStyle}>{this.state.name}</div>
                                <div style={explanationStyle}>
                                    {this.state.text}
                                </div>
                            </section>

                            <section style={rightStyle}>
                                <div style={rightTopStyle}>
                                    <div style={labelStyle}>Choose the day</div>
                                    <DatePicker
                                        inline
                                        selected={this.state.toDate}
                                        onChange={this.handleChangeDate}
                                    />
                                </div>
                                <div>
                                    <div style={labelStyle}>{this.state.place}</div>
                                    <div style={labelStyle}>{this.state.price} Eth per a person</div>
                                    <div style={labelStyle}>How many ticket you buy?</div>
                                    <div>
                                        <form onSubmit={this.handleSubmit} style={formStyle}>
                                            {/*何人参加するか*/}
                                            <input type="number" min="1" step="1" value={this.state.number} onChange={this.handleChangeNumber} />
                                            <button type="submit" style={submitStyle}>Join!</button>
                                        </form>
                                    </div>
                                    {this.state.done === true ?
                                        <Link to="/profile"><button>See QRs</button></Link> :
                                        null
                                    }
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </main>
            
        );
    }
}

export default Detail;

const backgroundStyle = {
    width: "100vw",
    height: "100vh",
    background: `url(${Sensouji})`,
    backgroundPosition: "center",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat"
};

const containerStyle = {
    top:"10%",
    left:"7%",
    display: "flex",
    width: "80vw",
    height: "75vh",
    margin: "auto",
    padding: "50px 50px 0px 50px",
    justifyContent: "space-between",
    borderRadius: 10,
    backgroundColor: "white",
    position:"fixed",
    textAlign: "center"
};

const leftStyle = {
    width: 750
};

const rightStyle = {
    width: 350
};

const cardStyle = {
    width: 750
};

const titleStyle = {
    fontSize: 30
}

const explanationStyle = {
    width: 750,
    height: 300,
    fontSize: 20,
    wordWrap: "break-word",
    margin: "auto"
};

const rightTopStyle = {
    marginBottom: 100
}

const labelStyle = {
    fontSize: 20
}

const formStyle = {
    marginTop: 50,
    borderRadius: 5
}

const submitStyle = {
    background: "linear-gradient(-135deg, #CC00CC, #E3165B)",
    color: "white"
}