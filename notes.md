# Full BlockChain Solidity Learning

## Chapter #1

### Calculate Transaction Fee

Transaction Fee = ( Block Base Fee Per Gas + MaxPriorityFee Per Gas ) \* Gas Used

- Base Fee: The minimum "gas price" to send your transaction

- 1 Eth = 1000000000 GWei = 1000000000000000000 Wei

### Consensus

Consensus is the mechanism used to agree on the state of a blockchain.

#### 1. Chain Selection Algorithm

#### 2. Sybil Resistance Mechanism

- Like PoW(Proof of Work) and PoS(Proof of Stake)

## Chapter #2

### First Contract in Remix

```sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

// This is a smart contract
contract SimpleStorage {
    // The basic types: boolean | unit | int | address | bytes
    // unit: POSITIVE number only

    bool hasFavoriteNumber = true;
    uint favoriteNumber = 123;
    string favoriteNumberInText = 'five';
    bytes favoriteBytes = 'cat';
}
```

> Default Value
> `uint favoriteNumber; // 0`

### Function

```sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

// Contract: 0xd9145CCE52D386f254917e481eB44e9943F39138
contract SimpleStorage {
    uint256 favoriteNumber;

    function store(uint256 _favoriteNumber) public {
        favoriteNumber = _favoriteNumber;
    }

    // getter function of favoriteNumber
    function retrieve() public view returns(uint256) {
        return favoriteNumber;
    }
}
```

> **Tips:**
>
> - Smart Contracts have addresses just like our wallet accounts do.
> - Any time you change something on-chain, including making a new contract, it happens in a transaction.(部署合约其实就是在发送一个交易；我们在区块链上做任何事情，修改任何状态，其实就是在发送一个交易)
> - `view, pure`: 标记上后不会花费 gas，因为这意味着我们只会读取这个合约的状态（除非你在要花费 gas 的 store 函数中调用它）
> - `view and pure` functions disallow modification of state.(我们不可以在这个函数里修改任何状态)

#### Function Visibility Specifiers

- public: it creates `getter()` automatically.
- private: only visible in current contract.(此合约可见)
- external: only visible externally.(合约外部可见，合约外的账户可以调用这个函数)
- internal(default visibility ): only visible internally.(合约内部可见，这有这个合约或者继承它的合约可以调取)
