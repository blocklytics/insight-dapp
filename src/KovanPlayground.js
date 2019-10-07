import React, { useState, useEffect } from "react";
// import WalletConnectQRCodeModal from "@walletconnect/qrcode-modal";
import Web3Provider, { useWeb3Context } from "web3-react";
import { ethers } from "ethers";

import connectors from "./connectors";
import "./index.css";

const BALANCE_THRESHOLD = 0.05; // Kovan ETH balances under this value will result in Faucet links

function App() {
  const metaMaskInstalled = window.ethereum !== undefined
  
  return (
    <>
      <Web3Provider connectors={connectors} libraryName="ethers.js">
        <div className="App">
        	<IntroMessage />
					<div className="playground">
						<h2><span className="foam-pink">Step 2:</span> Claim your rewards</h2>
						{ !metaMaskInstalled && (<InstallMetaMask />) }
						{ metaMaskInstalled && (<MyComponent />) }
					</div>
        </div>
      </Web3Provider>
    </>
  );
}

function IntroMessage() {
	return (	
		<>
			<h1>FOAM GCP Playground</h1>
			<h3>Purpose</h3>
			<p>Test MetaMask login & send transactions on Kovan network.</p>
			<h3>Pass criteria</h3>
			<ul>
				<li>MetaMask is not installed -> "Install MetaMask"
					<ul>
						<li>Test using Incognito mode</li>
					</ul>
				</li>
				<li>MetaMask is installed && no account found -> "Login with MetaMask"
					<ul>
						<li>Test using MetaMask > Settings > Connections > Remove all sites</li>
						<li>First run - allow request</li>
						<li style={{ color: "#FF6666" }}>First run - cancel request, second run - allow request (fails)</li>
					</ul>
				</li>
				<li>MetaMask is installed && account found && wrong network -> "Change to Kovan"
					<ul>
						<li>Test using MetaMask > Network selector</li>
					</ul>
				</li>
				<li>MetaMask is installed && account found && Kovan network && no ETH -> "Get Kovan ETH from Faucet"
					<ul>
						<li>Test using fresh account</li>
					</ul>
				</li>
				<li>MetaMask is installed && account found && Kovan network && ETH -> "Claim rewards"</li>
				<li>"Claim rewards" -> Link to view transaction on Etherscan</li>
			</ul>
			<h3>Playground area</h3>
		</>
	)
}

function InstallMetaMask() {
	return (
		<>
			<p style={{ marginBottom: 36 }}><a href="https://metamask.io/" className="button" style={{ backgroundColor: "#F9AD9E" }} target="_blank" rel="noopener noreferrer">Install MetaMask ↗</a></p>
			<p><a href="https://metamask.io/" target="_blank" rel="noopener noreferrer">Please install MetaMask to continue</a></p>
		</>
	)
}

function MyComponent() {
  const context = useWeb3Context();
  const [transactionHash, setTransactionHash] = useState(undefined);
  const [balance, setBalance] = useState(undefined);
  
  const onKovanTestNetwork = context.networkId ? context.networkId === 42 : false
  context.account && console.log("Account: ", context.account)
  
  const loginWithMetaMaskButton = (
  	<button
  		style={{ backgroundColor: "#F9AD9E" }}
  		onClick={() => {
  			context.setConnector("Injected", { suppressAndThrowErrors: false })
  		}}
  	>
  		Login with MetaMask
  	</button>
  );
  
	const claimReward = (
		<>
			<button
				disabled={ transactionHash || !onKovanTestNetwork || !balance || balance < BALANCE_THRESHOLD }
				onClick={ sendTransaction }
			>
				Claim Reward
			</button>
		</>
	);
  
  var prizeMessage;
	var buttonObject, errorMessage;
  if (!context.active && !context.account) {
  	buttonObject = loginWithMetaMaskButton
    errorMessage = <p>Please login with MetaMask to continue.</p>;
  } else {
  	buttonObject = claimReward
    prizeMessage = <p>You are eligible for a 50 FOAM prize!</p>;
  	
		if (!onKovanTestNetwork) {
			errorMessage = <p>Please switch to the Kovan Test Network.</p>;
		} else if (onKovanTestNetwork && balance < BALANCE_THRESHOLD) {
    	errorMessage = (
    		<>
					<p>Please add Kovan ETH to your account.</p>
					<p style={{ marginBottom: 0 }}><a href="https://faucet.kovan.network/" target="_blank" rel="noopener noreferrer">Free Kovan: Faucet 1 ↗</a></p>
					<p style={{ marginTop: 0 }}><a href="https://gitter.im/kovan-testnet/faucet" target="_blank" rel="noopener noreferrer">Free Kovan: Faucet 2 ↗</a></p>
    		</>
    	);
  	}
  }
  
  async function getBalance() {
  	if (!context.library) return
  	const result = await context.library.getSigner().getBalance()
  	const format = ethers.utils.formatEther(result);
  	setBalance(format)
  }
  
  useEffect(() => {
  	getBalance()
  })
  
  function sendTransaction() {
    const signer = context.library.getSigner();

    signer
      .sendTransaction({
//         to: ethers.constants.AddressZero,
				to: "0x65f9bbb200cdc065d0120471a66b48d9a51603fd",
        value: ethers.utils.bigNumberify("0"),
        gasLimit: ethers.utils.bigNumberify("250000"),
        data: "0xee4be288",
        chainId: 42,
      })
      .then(({ hash }) => {
        setTransactionHash(hash);
      });
  }

  return (
    <React.Fragment>
      
      { buttonObject }
      { errorMessage }
      { !transactionHash && prizeMessage && (
      	prizeMessage
      )}
      {transactionHash && (
      	<p>Transaction sent. <a href={`https://kovan.etherscan.io/tx/${ transactionHash }`} target="_blank" rel="noopener noreferrer">View on Etherscan ↗</a></p>
      )}
    </React.Fragment>
  );
}

export default App;
