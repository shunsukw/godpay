import Web3 from 'web3';

var web3;
if (typeof window.web3 !== 'undefined') {
  // Use Mist/MetaMask's provider
  web3 = new Web3(window.web3.currentProvider);
} else {
  console.log('No web3? You should consider trying MetaMask!');
  // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
  web3 = undefined;
}

export default web3;
