# Solidity Learning

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

### Arrays and Structure

We want to store different people with different numbers here. So we are using `struct`.

```sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

// Contract: 0xd9145CCE52D386f254917e481eB44e9943F39138
contract SimpleStorage {
    uint256 public favoriteNumber;
    // Instantiate a person
    People public person = People({favoriteNumber: 12, name: 'Logic'});

    struct People {
        uint256 favoriteNumber;
        string name;
    }

    function store(uint256 _favoriteNumber) public {
        favoriteNumber = _favoriteNumber;
    }

    // getter function of favoriteNumber
    function retrieve() public view returns(uint256) {
        return favoriteNumber;
    }

}
```

We are storing the structures as an array here

```sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

// Contract: 0xd9145CCE52D386f254917e481eB44e9943F39138
contract SimpleStorage {
    uint256 public favoriteNumber;

    struct People {
        uint256 favoriteNumber;
        string name;
    }

    // 这里用people数组来存储多个`struct`的实例`People`
    People[] public people;

    // Add `people` function
    function addPerson(string memory _name, uint256 _favoriteNumber) public  {
        People memory newPerson = People({favoriteNumber: _favoriteNumber, name: _name});
        // People memory newPerson = People(_favoriteNumber, _name);
        people.push(newPerson);
    }

    function store(uint256 _favoriteNumber) public {
        favoriteNumber = _favoriteNumber;
    }

    // getter function of favoriteNumber
    function retrieve() public view returns(uint256) {
        return favoriteNumber;
    }

}
```

> - 创建了 people 数组，编制后会有一个`people`的按钮，这里可以输入`index`来找到对应的 structure；
> - 同时，这里还写了`addPerson`函数来添加 structure 到 array 中；
> - `memory`是一种 solidity 的存储方式，这里表示的是临时存储，函数执行完毕后数据会被清除。

### Memory, Storage and Calldata

EVM can access and store information in six places:

1. Stack
2. Memory: 可以被修改的临时变量
3. Storage: 可以被修改的永久变量
4. Calldata: 不能被修改的临时变量
5. Code
6. Logs

> Data location can only be specified for `array`, `struct` or `mapping` types
> `string` type actually is a `bytes` type

### Mappings

A mapping is a data structure where a key is "mapped" to a single value.

```sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

// Contract: 0xd9145CCE52D386f254917e481eB44e9943F39138
contract SimpleStorage {
    uint256 public favoriteNumber;

    mapping(string => uint256) public nameToFavoriteNumber;

    // Add `people` function
    function addPerson(string memory _name, uint256 _favoriteNumber) public  {
        nameToFavoriteNumber[_name] = _favoriteNumber;
    }

}
```

### Import from other Contracts

# Learn from WTF Academic

## 函数类型

### `pure` 关键字

`pure` 函数不能读也不能写，如果这样 ⬇️ 的代码加上`pure`关键字就会报错，如果这个`add()`在一个 contract 中，内部定义了 `uint256 public number = 5`；但这个`pure`函数既不能读也不能写，所以他不可能读取`number`变量，更加不能再改变`number`的变量

```sol
 // 默认
    function add() external {
        number = number + 1;
    }
```

但是我们可以这样 ⬇️

可以给函数传递一个参数 `_number`，然后让他返回 `_number+1`。

```sol
    // pure: 纯纯牛马
    function addPure(uint256 _number) external pure returns(uint256 new_number){
        new_number = _number+1;
    }
```

### `view`关键字

`view`那就是只能读，不能写了

```sol
    // view: 看客
    function addView() external view returns(uint256 new_number) {
        new_number = number + 1;
    }
```

### `internal` 和 `external`

`internal`函数（内部函数）是没有办法被直接调用的，意思是部署了一个合约，里面有个 internal 函数，但是我们在部署后在 remix 是找不到这个函数的 button 的

### payable

```sol
   // payable: 递钱，能给合约支付eth的函数
    function minusPayable() external payable returns(uint256 balance) {
        minus();
        balance = address(this).balance;
    }
```

## 函数输出

### 结构式赋值

```sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

contract Test {

    // It returns the variables automatically, we don't have to add `return` in function
    function returnNamed() public pure returns (uint256 _number, bool _bool, uint256[3] memory _array) {
        _number = 2;
        _bool = false;
        _array = [uint256(3), 2, 1];
    }

    // Destructuring assignments
    function readReturn() public pure {
        uint256 _number;
        bool _bool;
        uint256[3] memory _array;
        (_number, _bool, _array) = returnNamed();
    }
}
```

## 变量数据存储和作用域 storage/memory/calldata

### Solidity 中的引用类型

引用类型(Reference Type)：包括数组（array），结构体（struct）和映射（mapping），这类变量占空间大，赋值时候直接传递地址（类似指针）。由于这类变量比较复杂，占用存储空间大，我们在使用时必须要声明数据存储的位置。

### 数据位置

solidity 数据存储位置有三类：storage，memory 和 calldata。不同存储位置的 gas 成本不同。storage 类型的数据存在链上，类似计算机的硬盘，消耗 gas 多；memory 和 calldata 类型的临时存在内存里，消耗 gas 少。大致用法：

1. `storage`：合约里的状态变量默认都是`storage`，存储在链上。
2. `memory`：函数里的参数和临时变量一般用`memory`，存储在内存中，不上链。
3. `calldata`：和`memory`类似，存储在内存中，不上链。与`memory`的不同在于`calldata`变量不能修改(`immutable`)，一般用于函数的参数。

### 数值位置和赋值规则

1. 在不同存储类型相互赋值时候，有时会产生独立的副本（修改新变量不会影响原变量），有时会产生引用（修改新变量会影响原变量）。

⬇️ 此时的 `x[0]` 已经变成了 100

```sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

contract Test {
    uint[] x = [1, 2, 3];

    function fStorage() public {
        uint[] storage xStorage = x;
        xStorage[0] = 100;
    }
}
```

2. `storage` 赋值给 `memory`，会创建独立的复本，修改其中一个不会影响另一个；反之亦然。例子：

```sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

contract Test {
    uint[] x = [1, 2, 3];

    function fMemory() public view{
        //声明一个Memory的变量xMemory，复制x。修改xMemory不会影响x
        uint[] memory xMemory = x;
        xMemory[0] = 100;
        xMemory[1] = 200;
        uint[] memory xMemory2 = x;
        xMemory2[0] = 300;
    }
}
```

3. `memory` 赋值给 `memory`，会创建引用，改变新变量会影响原变量。

4. 其他情况，变量赋值给 `storage`，会创建独立的复本，修改其中一个不会影响另一个。

### 变量的作用域

Solidity 中变量按作用域划分有三种，分别是状态变量（state variable），局部变量（local variable）和全局变量(global variable)

状态变量是存储在链上的变量，所有合约内函数都可以访问，gas 耗费是最高的。

## 引用类型, array, struct

在可变长度数组中，`bytes`比较特殊，它是数组，但是不用加`[]`

```sol
    // 可变长度 Array
    uint[] array4;
    bytes1[] array5;
    address[] array6;
    bytes array7;
```

## 映射类型 Mapping

```sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

contract Test {
    // Learning Mapping
    mapping (uint => address) public idToAddress;

    function writeMap(uint _key, address _Value) public {
        idToAddress[_key] = _Value;
    }
}
```
