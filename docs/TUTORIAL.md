<h1 align="center">Plugin Tutorial</h1>

With this file, you will learn how to use this plugin.

## Installation and requirements

To start using this extension - you can install it from [atom package marketplace](https://atom.io/packages/substrate-plugin). For this extension to work properly, the following prerequisites are required:

1. Atom v1.0.0+
2. Installed [plugin dependencies](../README.md#plugin-dependencies)

To compile this plugin from sources you need the following:

1. Atom v1.0.0+
2. Installed [plugin dependencies](../README.md#plugin-dependencies)
3. Yarn v1.13.0+

To compile this plugin from sources:

```bash
$ git clone https://github.com/everstake/atom-plugin-substrate.git atom-substrate
$ cd atom-substrate
$ yarn install
$ apm install --dev
$ apm link --dev
```

![Install package](images/default/0.png "Install package")

To run `Atom` with an installed package in debug mode - press `View - Developer - Open In Dev Mode...` on top `Atom` navbar.

![Run package](images/default/1.png "Run package in dev mode")

## Default demo

Let’s go through the plugin main features and see what’s happening.

### Step 1: Toggle package

After installation or run from sources, you will see an icon on the left sidebar. To toggle package/show sidebar - click on the icon button at the bottom right corner.

![Toggle package](images/default/2.png "Show sidebar")

### Step 2: Add node

After package initialization let's add a new node connection. In panel `My node connections` by default package will add local node connection but if you want to create new one. Go to `My node connections` panel, click on the `...` button and select `Add node` option. Enter name of your connection and its endpoint.

![Add node connection](images/default/4.png "Add node connection")

### Step 3: Connect to node

Let's connect to our node through package. Go to `My node connections` panel, find node connection you want to connect and click on it. Select `Connect to node` option.

![Connect to node](images/default/5.png "Connect to node")

After a successful connection node icon should change its color to green. If error occured, icon will be red.

![Connected node](images/default/6.png "Connected node")

### Step 4: Add first account

After successful connection let's add an account. To add an account with it's mnemonic/seed/URI click in `My accounts` panel on the `...` button and select `Add account` option.

![Add account](images/default/7.png "Add account")

Let's copy recently created account address to use it later with click on the item in `My accounts` panel and select `Copy address` option.

![Copy account address](images/default/8.png "Copy account address")

### Step 5: Subscribe for chain state

To subscribe for chain state go to `Extrinsics | Chain state | Contracts` panel, click on the `...` button, then in the opened dropdown select `Subscribe for chain state`. Select module and storage you want to subscribe and click `Confirm`.

![Subscribe for chain data](images/default/9.png "Subscribe for chain state")

### Step 6: Execute extrinsic

To execute extrinsic go to `Extrinsics | Chain state | Contracts` panel, click on the `...` button, then in the opened dropdown select `Run extrinsics`. Select module `balances` and `transfer` extrinsic, enter necessary parameters, click `Confirm` to sign and send transaction.

![Run extrinsics](images/default/10.png "Run extrinsics")

### Step 7: Check updated balance

After a successful transfer, you will see the updated balance in chain state.

![Updated balance](images/default/11.png "Updated balance")

## Demo with smart contracts

To pass through this demo you need to have installed [ink!](https://substrate.dev/substrate-contracts-workshop/#/0/setup) and have substrate project with `contracts` [SRML](https://substrate.dev/docs/en/runtime/substrate-runtime-module-library) module.

### Step 1: Connect to node

Add your node and connect to it.

![Connect to node](images/contracts/1.png "Connect to node")

### Step 2: Compile your contract and ABI

Better to go through [this](https://substrate.dev/substrate-contracts-workshop/#/0/building-your-contract) workshop how to compile contract and ABI. In the end, you will get the next files in your target directory of the smart contract.

![Compile contract and ABI](images/contracts/2.png "Compile contract and ABI")

### Step 3: Upload WASM code to node

To upload WASM code go to `Extrinsics | Chain state | Contracts` panel, click on the `...` button and select `Upload WASM` option. Type in the inputs following data: file with wasm, name of the contract code, maximum gas amount, account which sign transaction, password to decrypt account.

![Upload WASM](images/contracts/3.png "Upload WASM")

After successful upload of code you will see similar result to this:

![Successful upload WASM](images/contracts/4.png "Successful upload WASM")

### Step 4: Deploy contract to node

To publish a contract go to `Extrinsics | Chain state | Contracts` panel, click on the `...` button and select `Deploy contract` option. Type in the inputs following data: code hash, contract name, file with abi, endowment, maximum gas amount, account which sign transaction, password to decrypt account.

![Deploy contract](images/contracts/5.png "Deploy contract")

After successful deploy of contract you will see similar result to this:

![Successful deploy contract](images/contracts/6.png "Successful deploy contract")

### Step 5: Call contract method

To execute contract extrinsics go to `Extrinsics | Chain state | Contracts` panel, click on the contract and select `Call contract` option. Select which method you want to execute, method arguments, endowment (balance you want to send to the smart contract), maximum gas amount, account which sign transaction, password to decrypt account.

![Call contract](images/contracts/7.png "Call contract")

After successful call of contract you will see similar result to this:

![Successful call contract](images/contracts/8.png "Successful call contract")

## Start local development

To start development of `substrate` you will need to install rust and substrate dependencies. But plugin can do it with one command.

### Step 1: Install substrate

After substrate plugin is installation, open sidebar and go to `My node connections` panel, click on che `...` button and select `Install substrate`.

![Install substrate](images/dev/1.png "Install substrate")

After installation completion you will see similar result to this:

![Installed substrate](images/dev/2.png "Installed substrate")

### Step 2: Start local node

To start local node in development mode go to `My node connections` panel, click on the `...` button and select `Start local node`.

![Start local node](images/dev/3.png "Start local node")

To stop local node go to `My node connections` panel, click on the `...` button and select `Stop local node`. This will kill spawned command.

![Stop local node](images/dev/4.png "Stop local node")

To clear local node chain data (in development mode) go to `My node connections` panel, click on the `...` button and select `Clear chain data`. This will run `purge-chain`.

![Clear chain data](images/dev/5.png "Clear chain data")

### Step 3: Development

Everything installed and you are ready for hacking!
