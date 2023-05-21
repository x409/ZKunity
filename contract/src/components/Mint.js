import React, { useState, useRef } from 'react'
import { ethers, BigNumber } from 'ethers'
import mebNFT from "../contract/mugstars.json"
import Button from 'react-bootstrap/Button'
import 'bootstrap/dist/css/bootstrap.min.css'

const mebNFTAddress = process.env.REACT_APP_CONTRACT_ADDRESS
console.log(mebNFTAddress)

const Mint = ({ accounts }) => {

    const [mintAmount, setMintAmount] = useState(1)
    const isConnected = Boolean(accounts[0]);

    async function handleMint() {
        console.log("click")
        if(window.ethereum){
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer= provider.getSigner()
            const contract = new ethers.Contract(
                mebNFTAddress,
                mebNFT.abi,
                signer
            );
            try {
                const response = await contract.mintNFT(BigNumber.from(mintAmount), {
                    value: ethers.utils.parseEther((0.02 * mintAmount).toString())
                });
                console.log("response : ", response)
                console.log(`Button clicked, account number ${accounts} wants to mint ${mintAmount} NFT's`);     
                setMintAmount(1);
            } catch (err) {
                console.log("error: ", err)
            }
        }
    }

    const form = useRef()

  return (
    <div className="mint"> 
       <div className="container col-xs-12">
           <div className="row m-auto">
               <h1>MEB NFTs</h1>
               <form ref={form} action="submit" className="m-auto col-lg-5 col-md-8  col-lg-10w-100">
                   <div className="card p-5 text-center" id="wallet-address">
                        {isConnected ? (
                        <>
                        <div className="mintLine">
                            <input className="py-1 ps-1 m-auto" type="number" name="amount"  value={mintAmount} min="1" max="5" onInput={e => setMintAmount(e.target.value)}/>

                            <Button onClick={ handleMint } className="mintBtn "> Mint / Buy </Button>
                        </div>
                        <label htmlFor=""> 0.02 ETH each </label>
                        </>
                        ): (
                        <div> Please connect to MetaMask in order to mint </div>
                        )}
                    </div>
               </form>
           </div>
       </div>
    </div>
  )
}

export default Mint