---
title: HTTP 协议
---

# HTTP 协议

HTTP 是超文本传输协议，也就是 HyperText Transfer Protocol。

## HTTP 状态码

1xx 类状态码属于提示信息，是协议处理中的一种中间状态，实际用到的比较少。

2xx 类状态码表示服务器成功处理了客户端的请求，也是我们最愿意看到的状态。

3xx 类状态码表示客户端请求的资源发生了变动，需要客户端用新的 URL 重新发送请求获取资源，也就是重定向。

4xx 类状态码表示客户端发送的报文有误，服务器无法处理，也就是错误码的含义。

5xx 类状态码表示客户端请求报文正确，但是服务器处理时内部发生了错误，属于服务器端的错误码。

## HTTP 缓存

HTTP 缓存有两种实现方式，分别是强制缓存和协商缓存。

## 强制缓存

强缓存指的是只要浏览器判断缓存没有过期，则直接使用浏览器的本地缓存，决定是否使用缓存的主动性在于浏览器这边。

强缓存是利用 **Cache-Control** 和 **Expires** 实现的，它们都用来表示资源在客户端缓存的有效期。

如果 HTTP 响应头部同时有 Cache-Control 和 Expires 字段的话，Cache-Control 的优先级高于 Expires。实际应用中建议使用 Cache-Control。

### Cache-Control

缓存请求指令，客户端可以在 HTTP 请求中使用的标准指令：

```txt
Cache-Control: max-age=<seconds>
Cache-Control: max-stale[=<seconds>]
Cache-Control: min-fresh=<seconds>
Cache-control: no-cache
Cache-control: no-store
Cache-control: no-transform
Cache-control: only-if-cached
```

缓存响应指令，服务器可以在响应中使用的标准指令：

```txt
Cache-control: must-revalidate
Cache-control: no-cache
Cache-control: no-store
Cache-control: no-transform
Cache-control: public
Cache-control: private
Cache-control: proxy-revalidate
Cache-Control: max-age=<seconds>
Cache-control: s-maxage=<seconds>
```

**可缓存性**

- `public`：表明响应可以被任何对象缓存，比如：客户端、代理服务器等
- `private`：表明响应只能被单个用户缓存，代理服务器不能缓存
- `no-cache`：强制要求缓存把请求提交给原始服务器进行验证
- `no-store`：不使用任何缓存

**到期**

- `max-age=<seconds>`：设置缓存存储的最大周期，超过这个时间缓存被认为过期 (单位秒)
- `s-maxage=<seconds>`：设置共享缓存过期时间(比如代理服务器)
- `max-stale[=<seconds>]`：表明客户端愿意接收一个已经过期的资源。可以设置一个可选的秒数，表示响应不能已经过时超过该给定的时间
- `min-fresh=<seconds>`：表示客户端希望获取一个能在指定的秒数内保持其最新状态的响应

**重新验证和重新加载**

- `must-revalidate`：一旦资源过期（比如已经超过 max-age），在成功向原始服务器验证之前，缓存不能用该资源响应后续请求
- `proxy-revalidate`：与 must-revalidate 作用相同，但它仅适用于共享缓存（例如代理）
- `immutable`：表示响应正文不会随时间而改变。资源（如果未过期）在服务器上不发生改变，因此客户端不应发送重新验证请求头（例如
  If-None-Match 或
  If-Modified-Since）来检查更新，即使用户显式地刷新页面

**其他**

- `no-transform`：不得对资源进行转换或转变。Content-Encoding、Content-Range、Content-Type 等 HTTP 头不能由代理修改
- `only-if-cached`：表明客户端只接受已缓存的响应，并且不要向原始服务器检查是否有更新的拷贝

### Expires

Expires 响应头包含日期/时间，即在此时候之后，响应过期。

无效的日期，比如 0，代表着过去的日期，即该资源已经过期。

如果在Cache-Control响应头设置了 "max-age" 或者 "s-max-age" 指令，那么 Expires 头会被忽略。

## 协商缓存

当我们在浏览器使用开发者工具的时候，你可能会看到过某些请求的响应码是 304，这个是告诉浏览器可以使用本地缓存的资源，通常这种通过服务端告知客户端是否可以使用缓存的方式被称为协商缓存。

协商缓存就是浏览器与服务端协商之后，通过协商结果来判断是否使用本地缓存。

协商缓存基于 `If-None-Match` 或者 `If-Modified-Since` 请求头来实现的，对应的响应头分别为 `ETag` 和 `Last-Modified`。If-None-Match 和 ETag 的优先级更高，也能更准确的判断内容是否变化，推荐使用。

**注意，协商缓存这两个字段都需要配合强制缓存中 Cache-Control 字段来使用，只有在未能命中强制缓存的时候，才能发起带有协商缓存字段的请求。**

### If-None-Match 和 ETag

ETag 是资源的特定版本的标识符，就像一个指纹，资源变化则 ETag 变化。浏览器发起请求时请求头会带上 If-None-Match
字段，其值为上一次请求响应的 ETag 的值。服务器收到请求会对比最新 ETag 和 If-None-Match 是否相同，相同则返回
304，否则返回新的资源，状态码为 200。

### If-Modified-Since 和 Last-Modified

和 ETag/If-None-Match 类似，只是值为资源最后一次修改的时间。优先级比 If-None-Match/ETag 低。

## 参考：

1. https://xiaolincoding.com/network/2_http/http_interview.html
2. https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Cache-Control
