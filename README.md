<h1 align="center">Boralabs - DAO Project</h1>
<p align="center">
<img alt="Version Badge" src="https://img.shields.io/badge/version-1.0-teal">
<img alt="Node Badge" src="https://img.shields.io/badge/node-%5E20.12-blue?logo=nodedotjs">
<img alt="Yarn Badge" src="https://img.shields.io/badge/yarn-1.22-blue?logo=yarn">
<img alt="License Badge" src="https://img.shields.io/badge/license-MIT-greenyellow">
<a href="https://medium.com/boraecosystem" target="_blank"><img alt="Medium Badge" src="https://img.shields.io/badge/read_more-gray?logo=medium"></a>
<a href="https://twitter.com/bora_ecosystem" target="_blank"><img alt="Twitter Badge" src="https://img.shields.io/badge/follow-white?logo=x&logoColor=black"></a>
</p>

## Introduction

[Boralabs DAO Project](https://dao.boralabs.com/) is built with reference to [OpenZeppelin's governance contracts]('https://docs.openzeppelin.com/contracts/5.x/governance') to create a decentralized autonomous organization (DAO). Users can easily experience the blockchain DAO service through three scenarios provided by the project after connecting Metamask and minting tokens.

[More info on DAO]('https://www.investopedia.com/tech/what-dao/')

## Installation

### System Requirement

- 🐳 **Docker Desktop** (latest with docker-compose)
- 🥮 **Ganache GUI** [download](https://trufflesuite.com/ganache/)
- 🟩 **Node v20.17**
- 🐱 **Yarn v1.22.22**
- 🌐 **Chrome Web Browser / with Metamask Extension** [🦊]('https://metamask.io/download/')
- 📝 **Visual Studio Code** (Or any text editors of your choice ❤️)
- **git**
- **WSL 2** (for windows only)

**Step 1. Create project directory and clone projects from github**</br>

```shell
mkdir dao-project
cd dao-project
git clone https://github.com/boraecosystem/boralabs-dao
git clone https://github.com/boraecosystem/boralabs-dao-contract
```

**Step 2. Open Ganache GUI** </br>

- Refer to 👉 [Ganache Quick Start](https://trufflesuite.com/docs/ganache/quickstart/)
- Open Ganache > Click Quick start
- Get the Private Key for the first account (Use it for Step 3 and import it to your Metamask)
- Import your private key to your Metamask (Latest version of Chrome Recommended)

[How to import a private key to
Metamask](https://support.metamask.io/hc/en-us/articles/360015489331-How-to-import-an-account)

**Step 3. Deploy Contracts** </br>

```shell
cd boralabs-dao-contract
yarn install
echo DEPLOYER_KEY=<your_private_key> > .env
yarn deploy
cp .env ../boralabs-dao/.env
```

**NOTE:** <your_private_key> is the private key you got from Ganache GUI (see step 2)

**Also NOTE:** By the end of step 3, you will have a .env file contains chain information, contract addresses, and api endpoint in
your "boralabs-dao" directory.

**Step 4. Install required packages via Yarn**</br>

```shell
cd ../boralabs-dao
yarn install
code . // open your text editor (optional)
```

**NOTE:** current directory is "dao-project/boralabs-dao."

**Step 5. Create API & Crawler**

<div align="center">
  <h1 style="font-size: 3em; color: #4CAF50;">🔧 Content Coming Soon 🔧</h1>
  <p style="font-size: 1.5em; color: #555555;">
    We are currently preparing some content for you. <br> Stay tuned for updates!
  </p>
  <p style="font-size: 1.2em; color: #888888;">
    Thank you for your patience.
  </p>
</div>

**NOTE:** Due to security concerns, DAO API is preparing to provide code in other forms without disclosing it.

**step 6. Run Application**

Check that current directory is "dao-project/boralabs-dao."

```shell
docker-compose up -d
```

- open [http://localhost:8080](http://localhost:8080) on Chrome
- Login with Metamask

## Licenses

**MIT** License, see [LICENSE](./LICENSE).

---

## References & Docs

- OpenZeppelin Governance: [https://docs.openzeppelin.com/contracts/5.x/governance](https://docs.openzeppelin.com/contracts/5.x/governance)
- OpenZeppelin Governor: [https://docs.openzeppelin.com/contracts/5.x/api/governance#governor](https://docs.openzeppelin.com/contracts/5.x/api/governance#governor)
- OpenZeppelin ERC20Votes: [https://docs.openzeppelin.com/contracts/5.x/api/token/erc20#ERC20Votes](https://docs.openzeppelin.com/contracts/5.x/api/token/erc20#ERC20Votes)
