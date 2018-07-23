import React, {Component} from "react"
import QRCode from "qrcode.react"

class QR extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <div style={qrStyle}>
                    {/*ここにpropsとして渡したものが入る*/}
                    <QRCode value="fasdaaaafsadfsa" />
                </div>
            </div>
        )
    }
}

export default QR

const qrStyle = {
    marginTop: 100
}