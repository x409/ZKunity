const { zencode_exec } = require("zenroom");

const zenroom = require('zenroom')

const crypto = require('crypto');

function generateHash(data) {
    const hash = crypto.createHash('sha256');
    hash.update(data);
    return hash.digest('hex');
}

const data = 'I want to hash this dataa';
const hash = generateHash(data);


function generateRandomString(length) {
    var crypto = require('crypto');
    var randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    var result = '';
    var bytesNeeded = Math.ceil(length * 3 / 4); // Number of bytes needed to generate the requested length

    while (result.length < length) {
        var randomBytes = crypto.randomBytes(bytesNeeded);
        for (var i = 0; i < randomBytes.length && result.length < length; i++) {
            var randomByte = randomBytes[i];
            if (randomByte < 256 - (256 % randomChars.length)) {
                result += randomChars.charAt(randomByte % randomChars.length);
            }
        }
    }

    return result;
}

module.exports = {
    generateRandomString: generateRandomString,
    generateHash: generateHash
};


console.log(generateRandomString(88)); // You can adjust the length of the string here


// async function generateAndVerifyZKProof() {
//     const keypair = await zencode_exec.exec(`
//         rule check version 1.0.0
//         Scenario 'simple': Create the keypair
//         Given that I am known as 'Issuer'
//         When I create the keypair
//         Then print my data
//     `)

//     const credential = await zenrzencode_execoom.exec(`
//         rule check version 1.0.0
//         Scenario 'simple': Create a credential
//         Given that I am known as 'Holder'
//         and I have my keypair
//         and I have a 'keypair' from 'Issuer'
//         When I aggregate all the keypairs
//         and I create the credential signature
//         Then print the 'credential signature'
//     `, { 'Issuer': keypair })

//     const verification = await zencode_exec.exec(`
//         rule check version 1.0.0
//         Scenario 'simple': Verify the credential
//         Given that I am known as 'Verifier'
//         and I have a 'public key' from 'Issuer'
//         and I have a 'credential signature' from 'Holder'
//         When I verify the credential signature
//         Then print the string 'The credential is valid.'
//     `, { 'Issuer': keypair, 'Holder': credential })

//     console.log(verification)
// }



// generateAndVerifyZKProof().catch(console.error);


// const encrypt = async (message, password) => {
//   const keys = JSON.stringify({ password });
//   const data = JSON.stringify({ message });
//   const contract = `Scenario 'ecdh': Encrypt a message with a password/secret 
//     Given that I have a 'string' named 'password' 
//     and that I have a 'string' named 'message' 
//     When I encrypt the secret message 'message' with 'password' 
//     Then print the 'secret message'`;
//   const { result } = await zencode_exec(contract, { data, keys });
//   return result;
// };

// const decrypt = async (encryptedMessage, password) => {
//   const keys = JSON.stringify({ password });
//   const data = encryptedMessage;
//   const contract = `Scenario 'ecdh': Decrypt the message with the password 
//     Given that I have a valid 'secret message' 
//     Given that I have a 'string' named 'password' 
//     When I decrypt the text of 'secret message' with 'password' 
//     Then print the 'text' as 'string'`;
//   const { result } = await zencode_exec(contract, { data, keys });
//   const decrypted = JSON.parse(result).text;
//   return decrypted;
// };


// const zenroom = require('zenroom')

// const script = `
// hash = ECDH.hash('sha256', 'My Secret Data')
// print(hash)
// `

// zenroom.script(script).zenroom_exec().then(output => console.log(output))

// const message = "Dear Bob, your name is too short, goodbye - Alice.";
// const password = 0xBADA55;
// (async () => {
//   // encrypt the message
//   const encrypted = await encrypt(message, password);
// console.log("Encrypted Message:",encrypted);
//   const decrypted = await decrypt(encrypted, password);
//   // let's verify that the original message is the same as the decrypted one
//   if (message === decrypted) {
//     console.log("Decrypted Message:",decrypted);
//   }
// })();



