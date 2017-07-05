#!/usr/bin/env node

var fs = require("fs")
var EthUtil = require("ethereumjs-util")
var Web3 = require("web3")
var web3 = new Web3()

var program = require('commander');

var hexToBytes = function(hex) {
  for (var bytes = [], c = 0; c < hex.length; c+=2)
  bytes.push(parseInt(hex.substr(c, 2), 16));
  return bytes;
}

var privateKeyToAddress = function(privateKey) {
  return `0x${EthUtil.privateToAddress(hexToBytes(privateKey)).toString('hex')}`
}

var createWalletFromFile = function(file) {
  var content = fs.readFileSync(file, 'hex');
  var privateKey = web3.sha3(content);
  privateKey = privateKey.split('0x')[1];

  var address = privateKeyToAddress(privateKey);
  return [address, privateKey];
}


 program
  .arguments('<file>')
  .option('-s, --sha3 <sha3count>', 'The number of times the file is hashed. Default 1')
  .action(function(file) {
    try {
    var wallet = createWalletFromFile(file);
    console.log('Public Address: %s\nPrivate Key: %s',
        wallet[0], wallet[1]);
  } catch(err) {
    console.log("%s file doesn't exist", file);
  }


  })
  .parse(process.argv);
