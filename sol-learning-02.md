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
