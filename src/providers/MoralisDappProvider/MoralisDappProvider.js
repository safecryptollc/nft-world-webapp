import React, { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import MoralisDappContext from "./context";
import { config } from '../../config'

function MoralisDappProvider({ children }) {
  const { web3, Moralis, user } = useMoralis();
  const [walletAddress, setWalletAddress] = useState('');
  const [chainId, setChainId] = useState(43114);

  const [contractABI, setContractABI] = useState(config.abi); //Smart Contract ABI here
  const [marketAddress, setMarketAddress] = useState(config.marketAddress); //Smart Contract Address Here




  // useEffect(() => {
  //   Moralis.onChainChanged(function (chain) {
  //     setChainId(chain);
  //   });

  //   Moralis.onAccountsChanged(function (address) {
  //     console.log('accont changed');
  //     setWalletAddress(address[0]);
  //   });
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  // useEffect(() => setChainId(web3.givenProvider?.chainId));
  useEffect(() => setChainId('0xa86a'));
  useEffect(
    () => {

      setWalletAddress(user?.get("ethAddress") || '')
    },
    [web3, user]
  );
  return (
    <MoralisDappContext.Provider value={{ walletAddress, chainId, marketAddress, setMarketAddress, contractABI, setContractABI }}>
      {children}
    </MoralisDappContext.Provider>
  );
}

function useMoralisDapp() {
  const context = React.useContext(MoralisDappContext);
  if (context === undefined) {
    throw new Error("useMoralisDapp must be used within a MoralisDappProvider");
  }
  return context;
}

export { MoralisDappProvider, useMoralisDapp };
