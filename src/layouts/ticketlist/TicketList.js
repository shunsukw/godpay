// React dependency
import TicketCard from '../components/TicketCard';
import React, {
    Component
} from 'react'
import { Card, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import { Link } from "react-router";

import { FirestoreDocument } from 'react-firestore';
import {db} from '../../index'

// etherum
import web3 from "../web3";
import TicketFactoryContract from "../../deploy/contract_factory";
import abi from "../../deploy/contract_ticket";

// Fonts and Images
import { injectGlobal } from 'styled-components';
import selima from '../../fonts/selima/selima_.otf';
import Sensouji from "../../img/sensouji.jpg";
import Kyoto from "../../img/kyoto.jpg";

// Firebase 
import firebase from 'firebase';

class TicketList extends Component {
    constructor(props, { authData }) {
        super(props);

        authData = this.props
        this.state = {
            names: [ 
                "Shinagawa Aquarium",
                "Ghiburi Museum",
                "Kabukiza",
                "National Museum",        
                "Pranetalium",
                "Sensouji",
                "Tokyo Sky-tree",
                "Ueno Zoo"
            ],
            url: []
        }
    }

    onPriceChange = async (e) => {
        e.preventEvent()
        let price = e.target.value
        this.setState({price})

    }

    // QR codeを読んだ時発火
    withdrawByManager = async () => {
        let account = this.state.account
        let id = this.state.id
        let TicketContracts = this.state.contracts
        let TicketContract = TicketContracts[id]
        // get hash from QR code
        let uid;
        let buyer;
        TicketContract.methods.withdraw(uid, buyer).send({
            from: account,
            gas: 4700000
        }).then(async () => {
            console.log("happen: withdraw")
        })
    }

    createTicketContract = async () => {

        let price = 0.1
        let stringPrice = String(price)
        let account = this.state.account
        TicketFactoryContract.methods.createTicket(web3.utils.toWei(stringPrice, 'ether')).send({

            from: account,
            gas: 4700000
        }).then(async () => {
            //firebase で情報を保存する。
            console.log("happen: createTicket")
        })
    }

    implementJoinFunc = async () => {
        let account = this.state.account
        let day = this.state.day
        let number = this.state.number
        let id = this.state.id
        let TicketContracts = this.state.contracts
        let TicketContract = TicketContracts[id]
        let value = await TicketContract.methods.getSummary().ticketPrice
        TicketContract.methods.join(day, number).send({
            from: account,
            value: value,
            gas: 4700000
        }).then(async () => {
            console.log("happen: getSummary")
        })
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

        
        let storage = firebase.storage();
        let storageRef = storage.ref();

        let allImages = [
            storageRef.child('images/sensouji.jpg'),
            storageRef.child('images/ghiburi.jpg'),
            storageRef.child('images/kabuki.jpg'),
            storageRef.child('images/nationalmuseum.jpg'),
            storageRef.child('images/praneta.jpg'),
            storageRef.child('images/skytree.jpg'),
            storageRef.child('images/ueno.jpg'),
            storageRef.child('images/aquarium.jpg')
        ];

        
        allImages.map((imgRef) => {
            this.getUrl(imgRef);
            console.log("imgRef", imgRef);

        });

        db.collection("tickets").get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                console.log(`${doc.id} => ${doc.data()}`);
            });
        });

    }

    getUrl(imgRef) {
        let setUrl = undefined;

        imgRef.getDownloadURL().then((url) => {
            setUrl = url;

            let newArray = this.state.url.slice();
            newArray.push(setUrl);
            newArray.sort();
            console.log(newArray);
            this.setState({
                url: newArray,
            })

        }).catch(function (error) {
            console.error(error);
        });

    }

    render() {
        return (
            <main className="container" style={backgroundStyle}>
                <div className="pure-g">
                    <div className="pure-u-1-1">
                        <div style={{textAlign:"center"}}>
                            <h1 style={titleStyle}>Tickets</h1>
                            <h2 style={titleStyle}>1. Choose the place where you want to go</h2>
                            <h2 style={titleStyle}>2. Buy ticket! </h2>
                        </div>
                        <ul style={listStyle}>
                            {
                                [...this.state.url].map((value, index, array) =>{

                                    return (
                                        <li>
                                            <Link to={`/detail/${index}`}>
                                                <div>
                                                    <Card style={cardStyle}>
                                                        <CardMedia overlay={<CardTitle title={this.state.names[index]} />}>
                                                            <img src={value} alt="project-image" />
                                                        </CardMedia>
                                                        <CardText>
                                                            very cool place. You should visit!!!
                                                        </CardText>
                                                    </Card>
                                                </div>
                                            </Link>
                                        </li>
                                    )

                                })
                            }
                        </ul>
                    </div>
                </div>
            <input
                type="button"
                onClick={this.createTicketContract}
                value="create"
            />
            </main>
        )
    }
}

export default TicketList


const cardStyle = {
    width: 312.5,
    marginTop: 50
}



const listStyle = {
    display: "flex",
    flexWrap: "wrap",
    marginTop: 0,
    marginBottom: 20,
    marginLeft: "auto",
    marginRight: "auto",
    width: "75vw",
    justifyContent: "space-between",
    listStyle: "none",
    textAlign: "center",
    padding: 0
}

const carouselStyle = {
    textAlign: "center",
    margin: 0,
    padding: 40,
    zIndex: -100
}

const imgStyle = {
    width: "auto",
    height: "70%"
}

const textStyle = {
    textAlign: "center",
    display: "table-cell",
    fontSize: "550%",
    verticalAlign: "middle",
    fontFamily: "selima",
    marginTop: 0,
    marginBottom: 0,
    margin: "auto"
}

const backgroundStyle = {
    width: "100vw",
    height: "100vh",
    background: `url(${Kyoto})`,
    backgroundPosition: "center",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundAttachment: "fixed"
}

const titleStyle = {
    fontSize: "300%",
    fontFamily: "selima",
    color: "white"
}

