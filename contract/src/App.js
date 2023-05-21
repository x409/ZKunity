import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import './App.css'
import SwimLogo from './images/swim-logo.png'
import Signature from './images/signature.png'
// import Albums from './components/Albums'
// import WhitelistNetwork from './components/utils/WhitelistNetwork'
import Whitelist from './components/Whitelist'
import MintNetwork from './components/utils/MintNetwork'
import Mint from './components/Mint'
import Social from './components/Social'


function App() {
  const provider = new ethers.providers.Web3Provider(window.ethereum);

  let [accounts, setAccounts] = useState([])
  const [networkID, setNetworkID] = useState()

  const isConnected=Boolean(accounts[0])


  async function loadAccounts() {
    if(window.ethereum) {
      const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    })
    setAccounts(accounts[0])
    }
  }

  async function loadNetwork() {
    const { chainId } = await provider.getNetwork();
    setNetworkID(chainId)
  }
  
  useEffect(() => {
     loadAccounts()
     loadNetwork()
  })

  useEffect(()=> {

    const changeInChainListener = async () => {

    await window.ethereum.on('accountsChanged', function(account) {
      setAccounts(account);
      window.location.reload();
    })

    await window.ethereum.on('networkChanged', function (networkID) {
      setNetworkID(networkID);
      window.location.reload();
    })
  }

  changeInChainListener();

  }, [accounts, networkID])

  console.log("networkID: ", networkID)

  return (
    <div className="App">
      <img src={SwimLogo} alt="Swim Logo" className="swimLogo"/>
      <img src={Signature} alt="Bassy's Signature" className="bassyLogo"/>
      {/* <Albums className="albums"/> */}
      {isConnected ? (
        <>
          <p className="notification">You are Connected to MetaMask</p>
        </>
      ) : (
        <>
          <p className="notification">Please connect to MetaMask</p>
        </> 
        )}
      { accounts ? (
        <>
          <div id="network" >
            < MintNetwork networkID={ networkID }/>
          </div>
          {/* <Whitelist accounts={accounts} /> */}
          <Mint accounts={accounts} />
          </>
      ) : (null)}
      <Social />
    </div>
  );
}

export default App;
