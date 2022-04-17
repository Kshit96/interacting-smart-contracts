// const fetch = require('node-fetch');
// const ethers = require("ethers");
import ethers from 'ethers';
import fetch from 'node-fetch';
import async from 'async';
import http from 'http';
import fs from 'fs';
import mysql from 'mysql';
var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'me',
    password : 'secret',
    database : 'my_db'
  });

  connection.connect();

async function main() {

    // make an API call to the ABIs endpoint 
    const response = await fetch('https://api.etherscan.io/api?module=contract&action=getabi&address=0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D&apikey=MSH2R5NI7YTF9PC747FSQEE89UB7FEGJR7');
    const data = await response.json();
    console.log(data);

    let abi = data.result;
    console.log(abi);
    console.log("===================================================================================");

    // creating a new Provider, and passing in our node URL
    const node = "wss://eth-mainnet.alchemyapi.io/v2/V5-StTr9mfFKxGHLBPE78P8_9K7B4IiZ";
    const provider = new ethers.providers.WebSocketProvider(node);

    // initiating a new Wallet, passing in our private key to sign transactions
    let privatekey = "5da54738444c04df91b361a7f8303ff19014d0c6aebaa3aece38270ee2708ef8";
    let wallet = new ethers.Wallet(privatekey, provider);

    // print the wallet address
    console.log("Using wallet address " + wallet.address);
    console.log("===================================================================================");

    // specifying the deployed contract address on Ropsten
    let contractaddress = "0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D";

    // initiating a new Contract
    let contract = new ethers.Contract(contractaddress, abi, wallet);

    // calling the "retrieve" function to read the stored value
    let totalSupply = await contract.totalSupply();
    console.log(totalSupply);
    let tokenURIs = [];
    for(let i=0;i<1000;i++){
        tokenURIs.push(contract.tokenURI(i))
    //     tokenURIs[i].then((result)=>{console.log(result)})
    }
    var errCount = 0;

    function resolvePromise(tokenURI, callback){
        tokenURI
        .then((result)=>{callback(null, result)})
        .catch((err)=>{errCount++; callback(err)})
    }

    // connection.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
    //     if (error) throw error;
    //     console.log('The solution is: ', results[0].solution);
    //   });

    async.map(tokenURIs, resolvePromise)
    .then( results => {
        console.log(results);
        fs.writeFile('/Users/kshitiz/interacting-smart-contracts/Output.txt', results, (err) => {
            // In case of a error throw err.
            if (err) console.log(err);
        })
        // results is now an array of the file size in bytes for each file, e.g.
        // [ 1000, 2000, 3000]
    }).catch( err => {
        console.log(errCount);
    });
    console.log(errCount);
    console.log("===================================================================================");


// your code

// var requests = [];
// // Build a large list of requests:
// for (i=0;i<2;i++) {
//     requests.push(function(callback){
//         http.request({
//            'method': 'GET',
//            'hostname': 'ipfs.io',
//            'path': 'ipfs/QmeSjSinHpPnmXmspMjwiXyN6zS4E9zccariGR3jxcaWtq/5'
//         },function(res){
//             callback(null,res);
//         }).end()
//     });
// }

// Make the requests, 100 at a time
// async.parallelLimit(requests, 100,function(err, results){
//     console.log(results);
// });


}

main();
connection.end();