const abiTicket = [{
  "constant": false,
  "inputs": [{
    "name": "_uidkey",
    "type": "uint256"
  },
  {
    "name": "_buyer",
    "type": "address"
  }
  ],
  "name": "withdraw",
  "outputs": [],
  "payable": false,
  "stateMutability": "nonpayable",
  "type": "function"
},
{
  "constant": true,
  "inputs": [],
  "name": "ticketPrice",
  "outputs": [{
    "name": "",
    "type": "uint256"
  }],
  "payable": false,
  "stateMutability": "view",
  "type": "function"
},
{
  "constant": true,
  "inputs": [],
  "name": "getSummary",
  "outputs": [{
    "name": "",
    "type": "uint256"
  },
  {
    "name": "",
    "type": "uint256"
  },
  {
    "name": "",
    "type": "uint256"
  },
  {
    "name": "",
    "type": "address"
  }
  ],
  "payable": false,
  "stateMutability": "view",
  "type": "function"
},
{
  "constant": true,
  "inputs": [],
  "name": "manager",
  "outputs": [{
    "name": "",
    "type": "address"
  }],
  "payable": false,
  "stateMutability": "view",
  "type": "function"
},
{
  "constant": true,
  "inputs": [{
    "name": "",
    "type": "address"
  }],
  "name": "ticketOfOwner",
  "outputs": [{
    "name": "",
    "type": "uint256"
  }],
  "payable": false,
  "stateMutability": "view",
  "type": "function"
},
{
  "constant": true,
  "inputs": [],
  "name": "joinersCount",
  "outputs": [{
    "name": "",
    "type": "uint256"
  }],
  "payable": false,
  "stateMutability": "view",
  "type": "function"
},
{
  "constant": false,
  "inputs": [],
  "name": "getRefund",
  "outputs": [],
  "payable": false,
  "stateMutability": "nonpayable",
  "type": "function"
},
{
  "constant": false,
  "inputs": [{
    "name": "_days",
    "type": "uint256"
  },
  {
    "name": "_num",
    "type": "uint256"
  },
  {
    "name": "_uidkey",
    "type": "uint256"
  }
  ],
  "name": "join",
  "outputs": [],
  "payable": true,
  "stateMutability": "payable",
  "type": "function"
},
{
  "inputs": [{
    "name": "price",
    "type": "uint256"
  },
  {
    "name": "creater",
    "type": "address"
  }
  ],
  "payable": false,
  "stateMutability": "nonpayable",
  "type": "constructor"
}
]
export default abiTicket;