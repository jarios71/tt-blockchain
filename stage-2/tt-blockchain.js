const crypto = require('crypto');
const toSHA256 = (message) => {
  return crypto.createHash('sha256').update(message).digest('hex');
}

class TTBlockchain {

  constructor() {
    this.chain = [new TTBlock(Date.now().toString())]; // Creamos nuestro bloque genesis!
    this.dificultad = 1;
    this.pendingTransactions = [];
    this.miningReward = 100;
  }

  getNewest() {
    return this.chain[this.chain.length - 1];
  }

  add(blk) {
    blk.hashPrev = this.getNewest().hash;
    blk.hash = blk.calcHash();
    blk.mine(this.dificultad);
    const freezed = Object.freeze(blk);
    this.chain.push(freezed);
  }

  validated() {
    for (let i = 1, l = this.chain.length; i < l; i++) {
      const blk = this.chain[i];
      const prev = this.chain[i - 1];
      if (blk.hash !== blk.calcHash()) {
        return false;
      }
      if (blk.hashPrev !== prev.hash) {
        return false;
      }
    }
  }

  addTransaction(transaction) {
    if (!this.validated()) {
      throw new Error('La Blockchain no es válida!!! :(');
    }
    this.pendingTransactions.push(transaction);
  }

  minePendingTransactions(miningRewardAddress) {
    // Añadimos una transacción más con la recompensa de la minería
    this.pendingTransactions.push(new TTTransaction(null, miningRewardAddress, this.miningReward, 'recompensa minería'));
    // Creamos un bloque con todas las transacciones pendientes
    this.add(Date.now().toString(), this.pendingTransactions);
    // Limpiamos las transacciones pendientes
    this.pendingTransactions = [];
  }

}

class TTBlock {

  constructor(timestamp = '', datos = []) {
    this.datos = datos;
    if (timestamp === '') {
      this.timestamp = Date.now().toString();
    } else {
      this.timestamp = timestamp;
    }
    this.hash = this.calcHash();
    this.hashPrev = '';
    this.nonce = 0;
  }

  calcHash() {
    const datos = JSON.stringify(this.datos);
    return toSHA256(this.hashPrev + this.timestamp + datos + this.nonce);
  }

  mine(dificultad) {

    // Aquí lo que hacemos es repetir el bucle hasta que la cadena tenga tantos 0 como la longitud de la dificultad
    while (this.hash.substring(0, dificultad) !== Array(dificultad + 1).join('0')) {
      this.nonce++;
      this.hash = this.calcHash();
    }
  }

}

class TTTransaction {

  constructor(from, to, amount, notes = '') {
    this.from = from;
    this.to = to;
    this.amount = amount;
    this.notes = notes;
  }

}

module.exports = { TTBlockchain, TTBlock, TTTransaction };
