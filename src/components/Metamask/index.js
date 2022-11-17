import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Spinner from "react-bootstrap/Spinner";

import { ethers } from "ethers";

import BridgeAbi from "../../abi/Bridge.json";
import BcxAbi from "../../abi/MockBcx.json";

const BCX_CONTRACT_ADDR = process.env.REACT_APP_BCX_CONTRACT_ADDR;

const BRIDGE_CONTRACT_ADDR = process.env.REACT_APP_BRIDGE_CONTRACT_ADDR;

const Metamask = () => {
  const [address, setAddresss] = useState("");
  const [provider, setProvider] = useState(null);
  const [formData, setFormData] = useState({
    addr: "",
    amount: 0,
  });
  const [loadingMsg, setLoadingMsg] = useState("");

  const shortAddr = (fullAddr) => {
    return fullAddr.slice(0, 10) + "...";
  };

  const connectToMetamask = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      setAddresss(accounts[0]);
      setProvider(provider);
    } catch (e) {
      console.log(e);
      alert("MetaMask not installed");
    }
  };

  const handleTransfer = async (e) => {
    e.preventDefault();
    try {
      const signer = provider.getSigner();
      const bcxContract = new ethers.Contract(
        BCX_CONTRACT_ADDR,
        BcxAbi,
        signer
      );

      setLoadingMsg("Approving BCX Token transfer...");
      await bcxContract.approve(BRIDGE_CONTRACT_ADDR, formData.amount);

      setLoadingMsg("");

      const bridgeContract = new ethers.Contract(
        BRIDGE_CONTRACT_ADDR,
        BridgeAbi,
        signer
      );

      setLoadingMsg("Bridging BCX Token to Blockx...");

      await bridgeContract.sendToCosmos(
        BCX_CONTRACT_ADDR,
        formData.addr,
        formData.amount
      );

      setLoadingMsg("");
    } catch (e) {
      console.log(e);
      setLoadingMsg("");
      alert("MetaMask not installed");
    }
  };

  const connectMetamask = () => {
    if (!address) {
      return (
        <Button className="w-100" onClick={() => connectToMetamask()}>
          Connect to Metamask
        </Button>
      );
    } else {
      return <div className="text-center">{shortAddr(address)}</div>;
    }
  };

  const handleChange = (e) => {
    setFormData((formData) => ({ ...formData, [e.target.id]: e.target.value }));
  };

  return (
    <Container>
      <Row className="my-5">
        <Col md={{ span: 10 }}>
          <h1 className="text-center">
            BCX Token from Polygon Mumbai to Blockx
          </h1>
        </Col>
        <Col md={{ span: 2 }}>{connectMetamask()}</Col>
      </Row>
      <Row>
        <Col md={{ span: 10, offset: 1 }}>
          {address !== "" && (
            <Form>
              <Form.Group className="mb-3" controlId="addr">
                <Form.Label>
                  Recipient Blockx Account (e.g.
                  blockx14gct2nk2d9f6rs0edsyg4nuavkng8t8u0qf6dw)
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Blockx Address"
                  value={formData.addr}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="amount">
                <Form.Label>Amount to transfer (in abcx, NOT bcx)</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Amount in abcx"
                  value={formData.amount}
                  onChange={handleChange}
                />
              </Form.Group>

              <Row className="mt-5">
                <Col md={{ span: 4, offset: 4 }}>
                  <Button
                    variant="primary"
                    className="w-100"
                    disabled={loadingMsg !== ""}
                    onClick={handleTransfer}
                  >
                    {loadingMsg !== "" && (
                      <Spinner
                        as="span"
                        animation="grow"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                      />
                    )}
                    <span className="ml-3">{loadingMsg || "Transfer"}</span>
                  </Button>
                  {/* <Button
                    variant="primary"
                    className="w-100"
                    onClick={handleTransfer}
                  >
                    Transfer
                  </Button> */}
                </Col>
              </Row>
            </Form>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Metamask;
