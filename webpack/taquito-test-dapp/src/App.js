import { TezosToolkit } from "@taquito/taquito";
import { BeaconWallet } from "@taquito/beacon-wallet";
import { defaultEventCallbacks } from "../node_modules/@airgap/beacon-sdk/dist/walletbeacon.min";
import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [Tezos, setTezos] = useState(undefined);
  const [userAddress, setUserAddress] = useState("");
  const [userBalance, setUserBalance] = useState(0);

  const rpcUrl = "https://api.tez.ie/rpc/edonet";
  const contractAddress = "KT19wM6rCppyBZCraQKfVz94PjbZxGkssa2N";

  const connectWallet = async () => {
    try {
      const wallet = new BeaconWallet({
        name: "Taquito Test Dapp",
        preferredNetwork: "custom",
        disableDefaultEvents: true, // Disable all events / UI. This also disables the pairing alert.
        eventHandlers: {
          // To keep the pairing alert, we have to add the following default event handlers back
          pair_init: {
            handler: defaultEventCallbacks.PAIR_INIT
          },
          pair_success: {
            handler: defaultEventCallbacks.PAIR_SUCCESS
          }
        }
      });
      await wallet.requestPermissions({
        network: { type: "custom", rpcUrl }
      });
      Tezos.setWalletProvider(wallet);
      const userAddress = await wallet.getPKH();
      const balance = await Tezos.tz.getBalance(userAddress);
      setUserAddress(userAddress);
      setUserBalance(balance.toNumber());
    } catch (err) {
      console.error(err);
    }
  };

  const sendTez = async () => {
    try {
      const op = await Tezos.wallet
        .transfer({ to: "tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb", amount: 1 })
        .send();
      console.log(op.opHash);
      await op.confirmation();
    } catch (error) {
      console.log(error);
    }
  };

  const updateContract = async () => {
    try {
      const contract = await Tezos.wallet.at(contractAddress);
      const op = await contract.methods.simple_param(2).send();
      console.log(op.opHash);
      await op.confirmation();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const tezos = new TezosToolkit(rpcUrl);
    setTezos(tezos);
  }, []);

  return (
    <main>
      <section>
        <h1>Taquito Test Dapp</h1>
        <h3>with Webpack</h3>
        <p>Taquito version: 8.0.4-beta.0</p>
        <br />
        <br />
        <br />
        {!userAddress ? (
          <p>
            <button onClick={connectWallet}>Connect your wallet</button>
          </p>
        ) : (
          <>
            <p>Your address: {userAddress}</p>
            <p>Your balance: {userBalance / 1000000} tez</p>
            <p>
              <button onClick={sendTez}>Send 1 tez to Alice</button>
            </p>
            <p>
              <button onClick={updateContract}>Update contract storage</button>
            </p>
          </>
        )}
      </section>
    </main>
  );
}

export default App;
