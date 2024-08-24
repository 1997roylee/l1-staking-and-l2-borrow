# Contracts

## Deploying

To deploy the contracts, you need to have a `.env` file in the root of the project with the following content:

```env
PRIVATE_KEY=<private_key>
SCROLL_TESTNET_URL=<scroll_testnet_url>
```

Then you can run the following commands:

Install dependencies

```bash
pnpm install
```

Compile contracts

```bash
pnpm hardhat compile

```

Deploy contracts on eth testnet

```bash
pnpm hardhat run scripts/deploy-eth.ts --network sepolia
```

Deploy contracts on scroll testnet

you have to replace the L1 address in the `deploy-scroll.ts` file with the address of the deployed contract on eth testnet
```bash
pnpm hardhat run scripts/deploy-scroll.ts --network scrollSepolia
```

## Testing
