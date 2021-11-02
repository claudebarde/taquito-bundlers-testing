<script lang="ts">
  import { onMount } from "svelte";
  import { TezosToolkit } from "@taquito/taquito";

  let Tezos: TezosToolkit;
  let currentLevel: number | null = null;

  onMount(async () => {
    Tezos = new TezosToolkit("https://mainnet.api.tez.ie");
    const blockHeader = await Tezos.rpc.getBlockHeader();
    currentLevel = blockHeader.level;
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
</main>
