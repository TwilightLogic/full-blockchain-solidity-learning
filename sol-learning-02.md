# Solidity 102 进阶

## 接收 ETH

### 接收 ETH 函数 receive

`receive()`可以用来接收 ETH，一个合约里最多只有一个`receive()`，这个函数不需要写`function`关键字前缀，也不没有参数和返回值，而且还得加上`payable`和`external`

```sol
// 定义事件
event Received(address Sender, uint Value);
// 接收ETH时释放Received事件
receive() external payable {
    emit Received(msg.sender, msg.value);
}
```

### 回退函数 fallback

`fallback()`函数会在调用合约不存在的函数时被触发。跟`receive()`差不多，但`payable`这个关键字是可选的

### receive 和 fallback 的区别

```sol
触发fallback() 还是 receive()?
           接收ETH
              |
         msg.data是空？
            /  \
          是    否
          /      \
receive()存在?   fallback()
        / \
       是  否
      /     \
receive()   fallback()
```

## 发送 ETH

`transfer()`, `send()`和`call()`都是可以发送 ETH 的。但`call()`是被普遍认为推荐的

### transfer

- 其实就是`接收方.transfer(发送ETH数额)`
- `transfer()`如果转账失败，会自动`revert`（回滚交易）

```sol
// 用transfer()发送ETH
function transferETH(address payable _to, uint256 amount) external payable{
    _to.transfer(amount);
}
```

### send

- 其实也是`接收方.transfer(发送ETH数额)`
- `send()`转账失败的话，也不会`revert`
- `send()`的返回值是`bool`，成功或失败

```sol
// send()发送ETH
function sendETH(address payable _to, uint256 amount) external payable{
    // 处理下send的返回值，如果失败，revert交易并发送error
    bool success = _to.send(amount);
    if(!success){
        revert SendFailed();
    }
}
```

### call

- 用法是`接收方地址.call{value: 发送ETH数额}("")`
- `call()`没有`gas`限制，可以支持对方合约`fallback()`或`receive()`函数的复杂逻辑
- `call()`如果转账失败，也不会`revert`
- `call()`的返回值是(bool, data)，需要额外的逻辑来处理

```sol
// call()发送ETH
function callETH(address payable _to, uint256 amount) external payable{
    // 处理下call的返回值，如果失败，revert交易并发送error
    (bool success,) = _to.call{value: amount}("");
    if(!success){
        revert CallFailed();
    }
}
```

## 调用其他合约

```sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

contract OtherContract {
    uint256 private _x = 0; // 状态变量_x
    // 收到eth的事件，记录amount和gas
    event Log(uint amount, uint gas);

    // 返回合约ETH余额
    function getBalance() view public returns(uint) {
        return address(this).balance;
    }

    // 可以调整状态变量_x的函数，并且可以往合约转ETH (payable)
    function setX(uint256 x) external payable{
        _x = x;
        // 如果转入ETH，则释放Log事件
        if(msg.value > 0){
            emit Log(msg.value, gasleft());
        }
    }

    // 读取_x
    function getX() external view returns(uint x){
        x = _x;
    }
}

contract CallContract {
    // 我们可以在函数里传入目标合约地址，生成目标合约的引用，然后调用目标函数
    function callSetX(address _Address, uint256 x) external {
        OtherContract(_Address).setX(x);
    }

    // 我们可以直接在函数里传入合约的引用，只需要把上面参数的`address`类型改为目标合约名，比如`OtherContract`
    function callGetX(OtherContract _Address) external view returns(uint x) {
        x = _Address.getX();
    }

    function callGetX2(address _Address) external view returns(uint x) {
        OtherContract oc = OtherContract(_Address);
        x = oc.getX();
    }
}
```
