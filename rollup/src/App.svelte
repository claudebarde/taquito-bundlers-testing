<script lang="ts">
  import { onMount } from "svelte";
  import { TezosToolkit } from "@taquito/taquito";
  import { BeaconWallet } from "@taquito/beacon-wallet";
  import { NetworkType } from "@airgap/beacon-sdk";

  const rpcUrl = "https://mainnet.api.tez.ie";
  let Tezos: TezosToolkit;
  let currentLevel: number | null = null;
  let wallet: BeaconWallet;
  let userAddress = "";

  const connectWallet = async () => {
    await wallet.requestPermissions({
      network: {
        type: NetworkType.MAINNET,
        rpcUrl
      }
    });
    Tezos.setWalletProvider(wallet);
    userAddress = await wallet.getPKH();
  };

  const disconnectWallet = () => {
    wallet.client.destroy();
    wallet = undefined;
    userAddress = "";
  };

  onMount(async () => {
    Tezos = new TezosToolkit(rpcUrl);
    const blockHeader = await Tezos.rpc.getBlockHeader();
    currentLevel = blockHeader.level;
    try {
      wallet = new BeaconWallet({
        name: "Taquito Testing with Rollup",
        preferredNetwork: NetworkType.MAINNET
      });
      const activeAccount = await wallet.client.getActiveAccount();
      if (activeAccount) {
        userAddress = await wallet.getPKH();
      }
    } catch (error) {
      console.error(error);
    }
  });
</script>

<style>
  main {
    text-align: center;
    padding: 1em;
    max-width: 240px;
    margin: 0 auto;
  }

  h1 {
    color: #ff3e00;
    text-transform: uppercase;
    font-size: 4em;
    font-weight: 100;
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style>

<main>
  <h1>Hello Taquito!</h1>
  <p>Current level: {currentLevel ?? "Loading..."}</p>
  <div>
    {#if userAddress}
      <button on:click={disconnectWallet}>Disconnect wallet</button>
    {:else}
      <button on:click={connectWallet}>Connect wallet</button>
    {/if}
  </div>
</main>
