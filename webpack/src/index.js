const { TezosToolkit } = require("@taquito/taquito");

window.addEventListener("load", async () => {
  const app = document.getElementById("app");
  const wrapper = document.createElement("div");
  wrapper.id = "content-wrapper";
  const title = document.createElement("h1");
  title.textContent = "Taquito Webpack Test";
  wrapper.appendChild(title);
  // initializes TezosToolkit
  const Tezos = new TezosToolkit("https://mainnet.api.tez.ie");
  // fetches Alice's balance
  const aliceBalance = await Tezos.tz.getBalance(
    "tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb"
  );
  const balance = document.createElement("div");
  if (aliceBalance) {
    balance.textContent = `Alice's balance on mainnet: ${
      aliceBalance.toNumber() / 10 ** 6
    } tez`;
  } else {
    balance.textContent = "Unable to fetch Alice's balance";
  }
  wrapper.appendChild(balance);
  app.appendChild(wrapper);
});
