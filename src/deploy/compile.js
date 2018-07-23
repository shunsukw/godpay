const path = require('path');
const fs = require('fs');
const solc = require('solc');

const inboxPath = path.resolve(__dirname, '../../contracts', 'godPay.sol');
const source = fs.readFileSync(inboxPath, 'utf8');
console.log(source);
console.log(solc.compile(source, 1))
module.exports = solc.compile(source, 1).contracts[':TicketFactory'];
