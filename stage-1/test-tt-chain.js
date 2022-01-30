const { TTBlock, TTBlockchain } = require('./tt-blockchain.js');

const MyTTChain = new TTBlockchain();

MyTTChain.add(
  new TTBlock(Date.now().toString(), 
    {
      from: 'crypto-tonterias',
      to: 'my-friend',
      amount: 100,
      notes: 'present'
    }
  )
);

console.log(MyTTChain.chain);
