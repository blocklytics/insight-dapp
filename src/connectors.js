import { Connectors } from "web3-react";
// import TrezorApi from "trezor-connect";
// import WalletConnectApi from "@walletconnect/web3-subprovider";
// import FortmaticApi from "fortmatic";
// import PortisApi from "@portis/web3";

const {
  InjectedConnector,
//   NetworkOnlyConnector,
//   TrezorConnector,
//   LedgerConnector,
//   WalletConnectConnector,
//   FortmaticConnector,
//   PortisConnector
} = Connectors;

// const supportedNetworkURLs = {
//   1: "https://mainnet.infura.io/v3/3b3d85b922944414be87e831faf2f99f",
//   4: "https://rinkeby.infura.io/v3/3b3d85b922944414be87e831faf2f99f",
//   42: "https://kovan.infura.io/v3/3b3d85b922944414be87e831faf2f99f",
// };

// const defaultNetwork = 42;

const Injected = new InjectedConnector({
//   supportedNetworks: [42]
});

// const Network = new NetworkOnlyConnector({
//   providerURL: supportedNetworkURLs[42]
// });

// const Trezor = new TrezorConnector({
//   api: TrezorApi,
//   supportedNetworkURLs,
//   defaultNetwork,
//   manifestEmail: "noahwz@gmail.com",
//   manifestAppUrl: "https://codesandbox.io/s/6v5nrq2nqw"
// });

// const Ledger = new LedgerConnector({
//   supportedNetworkURLs,
//   defaultNetwork
// });

// const WalletConnect = new WalletConnectConnector({
//   api: WalletConnectApi,
//   bridge: "https://bridge.walletconnect.org",
//   supportedNetworkURLs,
//   defaultNetwork
// });

// const Fortmatic = new FortmaticConnector({
//   api: FortmaticApi,
//   apiKey: "pk_live_F95FEECB1BE324B5",
//   logoutOnDeactivation: false
// });

// const Portis = new PortisConnector({
//   api: PortisApi,
//   dAppId: "211b48db-e8cc-4b68-82ad-bf781727ea9e",
//   network: "mainnet"
// });

export default {
  Injected,
//   Network,
//   Trezor,
//   Ledger,
//   WalletConnect,
//   Fortmatic,
//   Portis
};
