<script lang="ts">
  import { onMount } from "svelte";
  import { TezosToolkit } from "@taquito/taquito";
  import { BeaconWallet } from "@taquito/beacon-wallet";
  import { NetworkType } from "@airgap/beacon-sdk";
  const contractAddress = "KT1T2gL26SwYMxpkR5SZT1pHRBF84knfw8Cg";
  const rpcUrl = "https://hangzhounet.api.tez.ie";
  let Tezos: TezosToolkit;
  let wallet: BeaconWallet;
  let userAddress = "";
  let simpleParam: null | number = null;

  const connectWallet = async () => {
    await wallet.requestPermissions({
      network: { type: NetworkType.HANGZHOUNET, rpcUrl }
    });
    userAddress = await wallet.getPKH();
    Tezos.setWalletProvider(wallet);
  };

  const disconnectWallet = async () => {
    wallet.client.destroy();
    wallet = undefined;
    userAddress = "";
  };

  onMount(async () => {
    Tezos = new TezosToolkit(rpcUrl);
    const contract = await Tezos.wallet.at(contractAddress);
    const storage: any = await contract.storage();
    simpleParam = storage.simple;

    wallet = new BeaconWallet({
      name: "Taquito Parcel Test",
      preferredNetwork: NetworkType.HANGZHOUNET
    });
    const activeAccount = await wallet.client.getActiveAccount();
    if (activeAccount) {
      userAddress = await wallet.getPKH();
      Tezos.setWalletProvider(wallet);
    }
  });
</script>

<style lang="scss">
  :global(body) {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  h1 {
    font: normal 24pt Lato, "Helvetica Neue", Arial, Helvetica, sans-serif;
    color: dimgray;
    cursor: default;
  }

  .container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    button {
      padding: 10px 20px;
      font: normal 20pt Lato, "Helvetica Neue", Arial, Helvetica, sans-serif;
      color: dimgray;
      border: none;
      border-radius: 10px;
      cursor: pointer;
    }
  }
</style>

<div>
  <h1>Svelte + TypeScript + Parcel + Taquito</h1>
  <div class="container">
    {#if userAddress}
      {userAddress}
    {:else}
      <button>Connect your wallet</button>
    {/if}
  </div>
</div>
