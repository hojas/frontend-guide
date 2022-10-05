---
title: HTTP 协议
---

# HTTP 协议

## HTTP 缓存

### Cache-Control

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

### ETag 和 If-None-Match

ETag 是资源的特定版本的标识符，就像一个指纹，资源变化则 ETag 变化。浏览器发起请求时请求头会带上 If-None-Match
字段，其值为上一次请求响应的 ETag 的值。服务器收到请求会对比最新 ETag 和 If-None-Match 是否相同，相同则返回
304，否则返回新的资源，状态码为 200。

### Last-Modified 和 If-Modified-Since

和 ETag/If-None-Match 类似，只是值为资源最后一次修改的时间。优先级比 ETag/If-None-Match 低。
