## ETHTokyo 2024 Project

## Team 
- Roy Lei (1997roylee)
- John Ku (johnku2011)
- James (kohshiba)
- Yuji Yamaguchi (yujiym)


## What it does
The project creates a novel DeFi system that bridges the gap between Layer 1 (L1) and Layer 2 (L2) blockchain solutions. It allows users to stake their assets on L1, which then serve as collateral for borrowing or lending activities on L2. This system leverages the security and established nature of L1 while taking advantage of the speed and lower transaction costs of L2.



## The problem it solves
1. L1 networks, especially Ethereum, are known for high gas fees during peak usage times. By enabling L2 activities based on L1 assets, users can avoid frequent L1 transactions and their associated high costs.

2. Traditional methods of using L1 assets in L2 involve bridging, which can be costly and introduces security risks (e.g., bridge hacks). This solution allows users to keep their assets in L1 while still utilizing their value in L2, eliminating bridging risks and costs.



## Challenges we ran into
L1Sload is a relatively new technology that allows L2 contracts to read L1 state. Implementing this correctly to read token information from L1 was challenging, likely due to its novelty and the complexity of cross-layer interactions. The team overcame this through persistent testing and iteration, which suggests a strong commitment to getting the core functionality right.



## Technologies I used
1. Scroll Devnet: A Layer 2 solution that aims to create a native zkrollup solution for Ethereum

Smart Contract address:

L1 sepolia: 0xf1571F6cF090BDD2f87368098CBbaDFe00682fd0

L2 scroll devnet: 0x46ce04B4358De3105c322b4658072aD093A7440F

MockErc20 scroll devnet: 0xa8Cfd89Aea99e370c802FaC1c4BBDAF939838545



2. L1Sload: A feature allowing L2 contracts to read L1 state, crucial for this project's functionality.

3. DeFi principles: Implementing lending and collateralization mechanisms.

4. Modern web development stack (NextJS + ReactJS) for a responsive and efficient frontend.

5. Solidity for writing smart contracts, the standard for Ethereum-based blockchain development.



## How we built it
1. Developed L1 smart contract to handle staking, lending, and repayment logic

2. Implemented L2 smart contract L1Sload functionality to read L1 asset information from L2

3. Deployed and tested the contracts on the Scroll Devnet

4. Created a user interface using NextJS and ReactJS to interact with the smart contracts



## What we learned
1. Gained practical experience in implementing cross-layer functionality using L1Sload

2. Deepened understanding of the challenges and opportunities in creating L1-L2 integrated DeFi solutions

3. Learned to optimize gas usage and user experience in a multi-layer blockchain environment

4. Improved skills in testing and iterating on novel blockchain technologies



## What's next for
1. Implemented signature verification for repayment processes

2. Expand the project to other networks as L1Sload becomes available beyond the Scroll Devnet

2. Develop a reward mechanism based on staked L1 assets, potentially increasing the incentives for users to participate in the ecosystem

3. Further optimize the gas efficiency and user experience of the cross-layer interactions

4. Explore additional DeFi use cases that can benefit from this L1-L2 integration model
