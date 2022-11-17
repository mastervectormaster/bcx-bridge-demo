import React, { useState } from "react";

import { ethers } from "ethers";

const Metamask = () => {
  const [address, setAddresss] = useState('');

  const connectToMetamask = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const accounts = await provider.send("eth_requestAccounts", []);
    setAddresss(accounts[0]);
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
