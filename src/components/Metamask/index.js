import React, { useState } from "react";
import BridgeAbi from '../../abi/Bridge.json'
import BcxAbi from '../../abi/MockBcx.json'

import { ethers } from "ethers";

const Metamask = () => {
  const [address, setAddresss] = useState('');

  const connectToMetamask = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const accounts = await provider.send("eth_requestAccounts", []);
    setAddresss(accounts[0]);
    
    const bcxContractAddr = process.env.REACT_APP_BCX_CONTRACT_ADDR;
    const bridgeContractAddr = process.env.REACT_APP_BRIDGE_CONTRACT_ADDR;

    const bcxContract = new ethers.Contract(bcxContractAddr, BcxAbi, signer);

    const name = await bcxContract.name()

    await bcxContract.approve(bridgeContractAddr, 10000);
    
    const bridgeContract = new ethers.Contract(bridgeContractAddr, BridgeAbi, signer);
  
    await bridgeContract.sendToCosmos(bcxContractAddr, 'cosmos123', 10000)
  };

  const renderMetamask = () => {
    if (!address) {
      return (
        <button onClick={() => connectToMetamask()}>Connect to Metamask</button>
      )
    } else {
      return (
        <div>
          <p>Welcome {address}</p>
        </div>
      );
    }
  }
  return <div>{renderMetamask()}</div>;
};

export default Metamask;
