const crypto = require('crypto');
const toSHA256 = (message) => {
  return crypto.createHash('sha256').update(message).digest('hex');
}

class TTBlockchain {

  constructor() {
    this.chain = [new TTBlock(Date.now().toString())]; // Creamos nuestro bloque genesis!
    this.dificultad = 1;
  }

  getNewest() {
    return this.chain[this.chain.length - 1];
  }

  add(blk) {
    // Obtenemos el hash previo
    blk.hashPrev = this.getNewest().hash;
    // Generamos el hash actual
    blk.hash = blk.calcHash();
    // Minamos
    blk.mine(this.dificultad);
    // Bloqueamos el objeto "TTBlock" para su modificación, la blockchain debe ser inmutable
    const freezed = Object.freeze(blk);
    // Añadimos el bloque a nuestra blockchain
    this.chain.push(freezed);
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

module.exports = { TTBlock, TTBlockchain };
