// React
import React, { useState, useEffect, useRef } from "react";

// Web3
import Web3Provider, { useWeb3Context } from "web3-react";
import { ethers } from "ethers";
import connectors from "./connectors";

// Material UI
import AppBar from '@material-ui/core/AppBar';
import Drawer from '@material-ui/core/Drawer';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import Toolbar from '@material-ui/core/Toolbar';
import CssBaseline from '@material-ui/core/CssBaseline';
import useScrollTrigger from '@material-ui/core/useScrollTrigger';
import Slide from '@material-ui/core/Slide';
import CircularProgress from '@material-ui/core/CircularProgress';

// Components
import MapContainer from "./Map.js";
import Geohash from 'latlon-geohash';

// Style
import "./index.css";

// Images
import Logo from "./images/logo.png";
import Logo2x from "./images/logo@2x.png";
import Logo3x from "./images/logo@3x.png";

import OsakaHero from "./images/osaka-hero.png";
import OsakaHero2x from "./images/osaka-hero@2x.png";
import OsakaHero3x from "./images/osaka-hero@3x.png";

import GoogleCloud from "./images/GoogleCloud.png";
import GoogleCloud2x from "./images/GoogleCloud@2x.png";
import GoogleCloud3x from "./images/GoogleCloud@3x.png";

import ChainLink from "./images/ChainLink.png";
import ChainLink2x from "./images/ChainLink@2x.png";
import ChainLink3x from "./images/ChainLink@3x.png";

import Blocklytics from "./images/Blocklytics.png";
import Blocklytics2x from "./images/Blocklytics@2x.png";
import Blocklytics3x from "./images/Blocklytics@3x.png";

import FOAM from "./images/FOAM.png";
import FOAM2x from "./images/FOAM@2x.png";
import FOAM3x from "./images/FOAM@3x.png";

import BuiltOnEth from "./images/builtOnEthereum.png";

const BALANCE_THRESHOLD = 0.005; // Kovan ETH balances under this value will result in Faucet links

function HideOnScroll(props) {
  const { children, window } = props;
  const trigger = useScrollTrigger({ target: window ? window() : undefined });

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

function App() {
  const metaMaskInstalled = window.ethereum !== undefined
  const [drawerIsOpen, setDrawerIsOpen] = React.useState( false );
  
  const toggleDrawer = (drawerIsOpen) => event => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setDrawerIsOpen(drawerIsOpen);
  };
  
  return (
    <>
      <Web3Provider connectors={connectors} libraryName="ethers.js">
        <div className="App">
					<CssBaseline />
					<MenuBar />
        	<Section0 />
        	<Section1 />
        	<Section2>
						{ !metaMaskInstalled && (<InstallMetaMask />) }
						{ metaMaskInstalled && (<Web3Component />) }
        	</Section2>
        	<Footer />
					<Drawer anchor="right" open={drawerIsOpen} onClose={toggleDrawer(false)}>
						XXX
					</Drawer>
        </div>
      </Web3Provider>
    </>
  );
}

function MenuBar() {
	return (
		<HideOnScroll>
			<AppBar className="menu">
				<Toolbar>
					<Grid container direction="row" justify="flex-start" alignItems="center" spacing={4}>
						<Grid item><p className="logo">IN&#x2014;<img src={Logo} srcSet={`${Logo2x} 2x, ${Logo3x} 3x`} alt=""/></p></Grid>
						<Grid item><a href="#play" className="menu-item">Play</a></Grid>
						<Grid item><a href="#claim" className="menu-item">Claim</a></Grid>
						<Grid item><a href="https://mapguide.foam.space/en/articles/3392057-osaka-mapathon-guide" target="_blank" rel="noopener noreferrer" className="menu-item">Rules &#x2197;</a></Grid>
					</Grid>
					<Hidden smDown>
					<Grid container direction="row" justify="flex-end" alignItems="center" spacing={4}>
						<Grid item><a href="https://uniswap.exchange/swap/0x4946fcea7c692606e8908002e55a582af44ac121" target="_blank" rel="noopener noreferrer" className="menu-item">FOAM Tokens &#x2197;</a></Grid>
						<Grid item><a href="https://map.foam.space/#/at/?lng=135.4446054&lat=34.6642222&zoom=12.00" target="_blank" rel="noopener noreferrer" className="menu-item">FOAM Map &#x2197;</a></Grid>
					</Grid>
					</Hidden>
				</Toolbar>
			</AppBar>
		</HideOnScroll>
	)
}

function Section0() {
	return (
		<div className="section-0">
			<h1 style={{display: "inline-block"}}>
				Map Osaka
				<span className="tooltip-text"><span className="arrow-left" />We are using open data to test a new mechanism for contributions towards hyperlocal hotspots</span>
			</h1>
			<h1>win Kovan tokens</h1>
			<img src={OsakaHero} srcSet={`${OsakaHero2x} 2x, ${OsakaHero3x} 3x`}
				alt="" className="hero-image"
			/>
			<h2>Getting started</h2>
			<p className="hero-emoji"><span role="img" aria-label="Scroll down">&#x1F447;</span></p>
		</div>
	)
}

function Section1() {
  const [points, setPoints] = useState([]);
  const limit = useRef(101);
  const offset = useRef(0);
  const fetchingData = useRef(true);
  
  useEffect(() => {
    const fetchData = async (limit, offset) => {
      const center = { lat: 34.6361063, lng: 135.4145468 }
			const { lat, lng } = center
	
			fetch(`https://map-api-direct.foam.space/poi/filtered?limit=${limit}&offset=${offset}&status=application&status=listing&neLat=${lat-1}&neLng=${lng-1}&swLat=${lat+1}&swLng=${lng+1}`)
				.then((r) => r.json())
				.then((d, description) => {
					const newPoints = d.map((point) => {
						const decodedPosition = Geohash.decode(point.geohash)
						
						return {
							name: point.name,
							position: {
								lat: decodedPosition.lat,
								lng: decodedPosition.lon,
							},
							listingHash: point.listingHash,
							tags: point.tags,
						}
					})
					
					setPoints(points.concat(newPoints))
				})
		};
		
		if (points.length > 0 && points.length % limit.current === 0) offset.current += limit.current
		else if (points.length > 0) fetchingData.current = false
		
		if (fetchingData.current) fetchData(limit.current, offset.current);
		
	}, [points]);
	
	return (
		<div className="section-1" id="play">
			<h2><span className="foam-pink">Step 1:</span> Find missing locations around<br />Osaka Convention Center</h2>
			<MapContainer			
				googleMapURL={ `https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,overlay&key=AIzaSyAcgT_pcRbAHmPsly_6Lwvwg79rAaMheRc` }
				loadingElement={<div style={{ height: `100%` }} />}
				containerElement={<div style={{ height: `73%` }} />}
				mapElement={<div style={{ height: `100%` }} />}
				points={points}
			/>
		</div>
	)
}

function Section2(props) {
	return (
		<div className="section-2">
			<h2 style={{marginBottom: 0}}><span className="foam-pink">Step 2:</span> Add locations to FOAM Map</h2>
			<p style={{marginTop: 0, marginBottom: 48}}>Points closer to the Osaka Convention Center earn more rewards</p>
			<GoToFoamMap />
			<h2 id="claim"><span className="foam-pink">Step 3:</span> Claim your rewards</h2>
			{props.children}
		</div>
	)
}

function Footer() {
	return (
		<div className="footer">
			<Grid container direction="column" spacing={7}>
				<Grid item container direction="row" justify="center" alignItems="flex-start" spacing={1}>
					<Grid item><img src={GoogleCloud} srcSet={`${GoogleCloud2x} 2x, ${GoogleCloud3x} 3x`} alt="Google Cloud" className="footer-logo" /></Grid>
					<Grid item><img src={ChainLink} srcSet={`${ChainLink2x} 2x, ${ChainLink3x} 3x`} alt="ChainLink" className="footer-logo" /></Grid>
					<Grid item><img src={Blocklytics} srcSet={`${Blocklytics2x} 2x, ${Blocklytics3x} 3x`} alt="Blocklytics" className="footer-logo" /></Grid>
					<Grid item><img src={FOAM} srcSet={`${FOAM2x} 2x, ${FOAM3x} 3x`} alt="FOAM" className="footer-logo" /></Grid>
				</Grid>
				<Grid item>
					<img src={BuiltOnEth} alt="Built on Ethereum" height={38} />
				</Grid>
			</Grid>
		</div>
	)
}

function GoToFoamMap() {
	return (
		<>
			<p style={{ marginBottom: 36 }}><a href="https://map.foam.space/#/at/?lng=135.4393906&lat=34.6630923&zoom=11.35" className="button" target="_blank" rel="noopener noreferrer">Go to FOAM Map &#x2197;</a></p>
			<p><a href="https://map.foam.space/" target="_blank" rel="noopener noreferrer">How to place a POI &#x2197;</a></p>
		</>
	)
}

function InstallMetaMask() {
	return (
		<>
			<p style={{ marginBottom: 36 }}><a href="https://metamask.io/" className="button" style={{ backgroundColor: "#F9AD9E" }} target="_blank" rel="noopener noreferrer">Install MetaMask &#x2197;</a></p>
			<p><a href="https://metamask.io/" target="_blank" rel="noopener noreferrer">Please install MetaMask to continue</a></p>
		</>
	)
}

function Web3Component() {
  const context = useWeb3Context();
  const [transactionHash, setTransactionHash] = useState(undefined);
  const [balance, setBalance] = useState(undefined);
  const [prize, setPrize] = useState(undefined);
  const [checkAgain, setCheckAgain] = useState(false);
  
  const onKovanTestNetwork = context.networkId ? context.networkId === 42 : false
  
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
	
	const checkPrize = (
		<>
			<button
				onClick={ () => {
					setPrize(undefined)
					setCheckAgain(!checkAgain)
				}}
			>
				Check again
			</button>
		</>
	);
	
	function PrizeMessage(props) {
		const { prize, context } = props

		if (!context.active && !context.account) return null;
		
		if (prize === 0) return <p>You are not eligible for a prize.</p>;
		else if (prize > 0) return <p>You are eligible to claim {prize} Kovan FOAM!</p>;
		else return <p><CircularProgress size="2rem" /></p>;
	};
  
  var promptSwitchNetwork = false;
	var buttonObject, errorMessage;
  if (!context.active && !context.account) {
  	buttonObject = loginWithMetaMaskButton
    errorMessage = <p>Please login with MetaMask to continue.</p>;
  } else {
  	buttonObject = claimReward
  	if (parseFloat(prize) === 0) {
  		buttonObject = checkPrize;
  	} else if (parseFloat(prize) > 0) {
  		buttonObject = claimReward;
  		promptSwitchNetwork = true;
  	} else {
  		buttonObject = null;
  	}
  	
		if (promptSwitchNetwork && !onKovanTestNetwork) {
			errorMessage = <p>Switch to the Kovan Test Network to continue.</p>;
		} else if (promptSwitchNetwork && onKovanTestNetwork && balance < BALANCE_THRESHOLD) {
    	errorMessage = (
    		<>
					<p>You need some Kovan ETH to continue.</p>
					<p style={{ marginBottom: 0 }}><a href="https://faucet.kovan.network/" target="_blank" rel="noopener noreferrer">Free Kovan: Faucet 1 &#x2197;</a></p>
					<p style={{ marginTop: 0 }}><a href="https://gitter.im/kovan-testnet/faucet" target="_blank" rel="noopener noreferrer">Free Kovan: Faucet 2 &#x2197;</a></p>
    		</>
    	);
  	}
  }
  
  useEffect(() => {
		async function getPrize() {
			if (!context.account) return undefined;
			const result = await fetch(`https://api.blocklytics.org/foam/v0/link/${context.account}?key=AIzaSyAZEiIHyKB7qxKa4MfkUMaUJOy5PkFJKU4`)
			const json = await result.json()
			try { 
				setPrize(ethers.utils.formatUnits(String(json[0]), 18))
			}
			catch {
				console.log("Err")
			}
		}
	
		async function getBalance() {
			if (!context.library) return
			const result = await context.library.getSigner().getBalance()
			const format = ethers.utils.formatEther(result);
	  	setBalance(format)
		}
		
		getPrize()
		getBalance()
  }, [context.account, context.library, checkAgain])
  
  function sendTransaction() {
    const signer = context.library.getSigner();

    signer
      .sendTransaction({
				to: "0xba55cc5dae9d8df3ed4938880db062c9998bccce",
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
      
      { !transactionHash && (
      	<PrizeMessage prize={parseFloat(prize)} context={context} />
      )}
      { buttonObject }
      { errorMessage }
      {transactionHash && (
      	<p><a href={`https://kovan.etherscan.io/tx/${ transactionHash }`} target="_blank" rel="noopener noreferrer">Transaction sent. View on Etherscan &#x2197;</a></p>
      )}
    </React.Fragment>
  );
}

export default App;
