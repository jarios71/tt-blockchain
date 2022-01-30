const { TTBlock, TTBlockchain } = require('./tt-blockchain.js');

const MyChain = new TTBlockchain();

MyChain.add(new TTBlock(Date.now().toString(), {datos: 'aprendiendo blockchain'}));

console.log(MyChain.chain);
