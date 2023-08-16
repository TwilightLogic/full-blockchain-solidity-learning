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

## 变量初始值

### `delete` 操作符

`delete a` 会让变量 `a` 的值变为初始值。

```sol
// delete操作符
bool public _bool2 = true;
function d() external {
    delete _bool2; // delete 会让_bool2变为默认值，false
}
```

## 常数 constant 和 immutable

状态变量声明`constant`（常量）或 `immutable`（不变量）后，不能在合约后更改数值；并且还可以节省 gas。另外，只有数值变量可以声明`constant`和`immutable`；`string`和`bytes`可以声明为`constant`，但不能为`immutable`。

## 构造函数和修饰器

修饰器（modifier）是 solidity 特有的语法，类似于面向对象编程中的 decorator，声明函数拥有的特性，并减少代码冗余。它就像钢铁侠的智能盔甲，穿上它的函数会带有某些特定的行为。modifier 的主要使用场景是运行函数前的检查，例如地址，变量，余额等。

这里做一个`onlyOwner`的 modifier：

```sol
   // 定义modifier
   modifier onlyOwner {
      require(msg.sender == owner); // 检查调用者是否为owner地址
      _; // 如果是的话，继续运行函数主体；否则报错并revert交易
   }

```

带有`onlyOwner`修饰符的函数只能被 owner 地址调用，比如下面这个例子：

```sol
   function changeOwner(address _newOwner) external onlyOwner{
      owner = _newOwner; // 只有owner地址运行这个函数，并改变owner
   }
```

我们定义了一个 changeOwner 函数，运行他可以改变合约的 owner，但是由于 onlyOwner 修饰符的存在，只有原先的 owner 可以调用，别人调用就会报错。这也是最常用的控制智能合约权限的方法。

## 事件 Event

Solidity 中的事件（event）是 EVM 上日志的抽象，它具有两个特点：

- 响应：应用程序（ethers.js）可以通过 RPC 接口订阅和监听这些事件，并在前端做响应。
- 经济：事件是 EVM 上比较经济的存储数据的方式，每个大概消耗 2,000 gas；相比之下，链上存储一个新变量至少需要 20,000 gas。

事件的 demo

```sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

contract Event {
    // 记录每个地址的持币数量
    mapping (address => uint256) public _balances;

    // 定义event，记录transfer交易的转账地址，接收地址和转账数量
    event Transfer(address indexed from, address indexed to, uint256 value);

    // 执行转账逻辑
    function _transfer (
        address from,
        address to,
        uint256 amount
    ) external {
        // 初始化一些代币
        // 转账地址的代币初始化为1000
        _balances[from] = 1000;

        // 1000 - 转出去的代币
        _balances[from] -= amount;
        _balances[to] += amount;

        // 释放事件
        emit Transfer(from, to, amount);
    }
}
```

详情的需要看 [wtf](https://www.wtf.academy/solidity-start/Event/) 的教程

## 继承 inheritance

继承是面向对象编程很重要的组成部分，可以显著减少重复代码。如果把合约看作是对象的话，solidity 也是面向对象的编程，也支持继承。

- `virtual`：父合约中的函数，如果希望子合约重写，需要加上 `virtual` 关键字。

- `override`：子合约重写了父合约中的函数，需要加上 `override` 关键字。

demo is here

```sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

contract Yeye {
    event Log(string msg);

    function hip() public virtual {
        emit Log("Yeye");
    }

    function pop() public virtual {
        emit Log("Yeye");
    }

    function yeye() public virtual {
        emit Log("Yeye");
    }
}

contract Baba is Yeye {
    function hip() public override {
        emit Log("Baba");
    }

    function pop() public override {
        emit Log("Baba");
    }

    function baba() public virtual  {
        emit Log("Baba");
    }
}
```

### 多重继承

`solidity` 的合约可以继承多个合约。规则：

继承时要按辈分最高到最低的顺序排。比如我们写一个 `Erzi` 合约，继承 Yeye 合约和 Baba 合约，那么就要写成 `contract Erzi is Yeye, Baba`，而不能写成 `contract Erzi is Baba, Yeye`，不然就会报错。

如果某一个函数在多个继承的合约里都存在，比如例子中的 `hip()`和 `pop()`，在子合约里必须重写，不然会报错。

重写在多个父合约中都重名的函数时，`override` 关键字后面要加上所有父合约名字，例如 `override(Yeye, Baba)`。

## 抽象合约

如果一个智能合约里至少有一个未实现的函数，即某个函数缺少主体{}中的内容，则必须将该合约标为 abstract，不然编译会报错；另外，未实现的函数需要加 virtual，以便子合约重写。

```sol
abstract contract InsertionSort{
    function insertionSort(uint[] memory a) public pure virtual returns(uint[] memory);
}
```

### 接口

接口类似于抽象合约，但它不实现任何功能。接口的规则：

1. 不能包含状态变量
2. 不能包含构造函数
3. 不能继承除接口外的其他合约
4. 所有函数都必须是 external 且不能有函数体
5. 继承接口的合约必须实现接口定义的所有功能

虽然接口不实现任何功能，但它非常重要。接口是智能合约的骨架，定义了合约的功能以及如何触发它们：如果智能合约实现了某种接口（比如 ERC20 或 ERC721），其他 Dapps 和智能合约就知道如何与它交互。因为接口提供了两个重要的信息：

1. 合约里每个函数的 bytes4 选择器以及函数签名函数名(每个参数类型）
2. 接口 id（更多信息见 EIP165）

另外，接口与合约 ABI（Application Binary Interface）等价，可以相互转换：编译接口可以得到合约的 ABI，利用 abi-to-sol 工具也可以将 ABI json 文件转换为接口 sol 文件。

### 什么时候使用接口？

如果我们知道一个合约实现了 IERC721 接口，我们不需要知道它具体代码实现，就可以与它交互。

无聊猿 BAYC 属于 ERC721 代币，实现了 IERC721 接口的功能。我们不需要知道它的源代码，只需知道它的合约地址，用 IERC721 接口就可以与它交互，比如用 balanceOf()来查询某个地址的 BAYC 余额，用 safeTransferFrom()来转账 BAYC。

```sol
contract interactBAYC {
    // 利用BAYC地址创建接口合约变量（ETH主网）
    IERC721 BAYC = IERC721(0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D);

    // 通过接口调用BAYC的balanceOf()查询持仓量
    function balanceOfBAYC(address owner) external view returns (uint256 balance){
        return BAYC.balanceOf(owner);
    }

    // 通过接口调用BAYC的safeTransferFrom()安全转账
    function safeTransferFromBAYC(address from, address to, uint256 tokenId) external{
        BAYC.safeTransferFrom(from, to, tokenId);
    }
}
```
