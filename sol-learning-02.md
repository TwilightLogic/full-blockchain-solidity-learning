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
