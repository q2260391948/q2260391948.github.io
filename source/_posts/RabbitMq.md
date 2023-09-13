---
title: RabbitMQ
date: "2023-7-24 10:29:58"
description: "RabbitMQ"
categories:
  - RabbitMQ
tags:
  - java
---

# MQ 架构设计原理

## 消息队列

存储消息的队列。
关键词：存储、队列、队列
存储:存储数据
消息：某种数据结构，比如字符串、对象、二进制数据、json 等等
队列：先进先出的数据结构

应用场景：在多个不同的系统、应用之间实现消息的传输，不需要考虑传输应用的编程语言、系统、框架等等。

具体实例：异步发送短信、异步发送优惠卷、处理比较耗时的操作

可以让 java 开发的应用发消息，让 php 开发的应用收消息，这样就不用把所有的代码写到一个项目中（应用解耦）。

## 消息队列的模型

生产者：Producer，类比为快递员，发送消息的人（客户端）
消费者：Consumer，类比为取快递的人，接受读取消息的人（客户端）
消息：Message，类比为快递，就是生产者要传输给消费者的数据
消息队列：Queue

为什么不接传输，要用消息队列？生产者不用关心你的消费者要不要消费、什么时候消费，我只需要把东西给消息队列，我的工作就算完成了。
生产者和消费者实现了解耦，互不影响。

![测试照片](https://cdn.jsdelivr.net/gh/keependeavour/picgo/img/211I61aL8.jpg)

## 为什么使用消息队列

- 1）异步处理
  生产者发送完消息可以去忙别的事情，消费者想什么时候去取都可以，不会阻塞
- 2）削峰填谷
  先把用户请求放到消息队列中，消费者可以按照自己的需求慢慢去取
  原本：12 点来了十万个请求，原本情况下，十万个请求都在系统内部处理，很快系统压力过大就好宕机
  现在：把十万个请求放到消息队列中，处理系统可以以自己恒定的速率慢慢执行，保护系统、稳定处理
- 3）可持久性、可靠性
  大多数消息队列系统提供持久化功能，确保即使在系统故障或重启后，消息不会丢失。这可以提高系统的可靠性，并确保消息的可靠传递。
- 4）可拓展性、灵活性
  通过使用消息队列，可以轻松地添加新的组件或服务，而无需更改现有的系统架构。新的组件可以订阅感兴趣的消息，从而扩展系统的功能和业务流程。

## 分布式消息队列的优势

1）数据持久化:可以把消息持久化到硬盘，服务器重启不会丢失数据
2）可扩展性：可以根据需求，随时增减节点，继续保持稳定的服务
3）应用解耦：可以连接各个不同的语言、框架开发的系统，让这些系统能够灵活传输读取数据

应用解耦的优点：

以前，把功能放到一个项目中，调用多个子功能时，要给环节出错，系统就整体出错
![2~F3M8$}8CT@H7VFWZ85NTU.png](https://cdn.nlark.com/yuque/0/2023/png/33551426/1687920054171-7eb680e2-25da-4f1a-ac41-e576a332e534.png#averageHue=%23fefdfd&clientId=u8e95eaa8-7658-4&from=paste&height=270&id=u423efd77&originHeight=338&originWidth=924&originalType=binary&ratio=1.25&rotation=0&showTitle=false&size=17788&status=done&style=none&taskId=uc6cc6d6f-10d0-4047-ad7c-48d86de67a7&title=&width=739.2)

使用消息队列进行解耦：

1. 一个系统挂了，不影响另外的系统
2. 系统挂了并恢复后，仍然可以取出消息，继续执行业务逻辑
3. 只要发送消息到消息队列，就可以立即返回，不用同步调用所有的系统。

![CCDJO%40}E7191ZEDV5_3%9.png](https://cdn.nlark.com/yuque/0/2023/png/33551426/1687920168751-0ea0b35d-2dfe-4a33-9aa4-8cfdaa8cb5f0.png#averageHue=%23fdfdfc&clientId=u8e95eaa8-7658-4&from=paste&height=326&id=u1cbde273&originHeight=407&originWidth=914&originalType=binary&ratio=1.25&rotation=0&showTitle=false&size=28414&status=done&style=none&taskId=ue3ab7742-2791-482c-9c93-3d6ee1af88a&title=&width=731.2)
4）发布订阅
如果一个非常大的系统要给其他子系统发送通知，最简单直接的方式是大系统依次调用小系统
问题:

1. 每次发通知都要调用很多系统、很麻烦、很可能失败
2. 新出现的项目（或者说大项目感知不到的项目）无法得到通知

![ICBFGE74T~PTR3P]F@}XW5C.png](https://cdn.nlark.com/yuque/0/2023/png/33551426/1687920548775-de4493f7-2ffe-4ee4-a977-a1e96b881002.png#averageHue=%23fefdfd&clientId=u8e95eaa8-7658-4&from=paste&height=574&id=ua58bdae9&originHeight=717&originWidth=931&originalType=binary&ratio=1.25&rotation=0&showTitle=false&size=42693&status=done&style=none&taskId=u1a1a6f91-fb5a-445b-8eb2-ee471e0d3f1&title=&width=744.8)
解决方案：大的核心系统始终往一个地方发送消息，其它系统都去订阅这个消息队列（读取队列中的消息）
![GM`9OT`H]T{$M%V}87(A(NO.png](https://cdn.nlark.com/yuque/0/2023/png/33551426/1687920680994-9455d00a-fe1c-4b6c-a41b-7abe3df913ad.png#averageHue=%23fdfdfd&clientId=u8e95eaa8-7658-4&from=paste&height=518&id=ua45c28c1&originHeight=647&originWidth=815&originalType=binary&ratio=1.25&rotation=0&showTitle=false&size=39740&status=done&style=none&taskId=ua11d7701-598c-4023-a44b-b7ea888bfaa&title=&width=652)

## 应用场景

1. 耗时的场景（异步）
2. 高并发场景（异步、削峰填谷）
3. 分布式系统协作（跨团队、跨业务、应用解耦）

比如 QQ 是一个系统，用 c++写的，微信用\*\* **java 写的** \*\*，qq 的消息可以通过消息队列传送给微信

4. 强稳定性的场景（金融业务、持久化、可靠性、削峰填谷）

支付、转账

## 消息队列的缺点

要给系统引入额外的中间件，系统会更复杂、额外维护中间件、额外的费用（部署）成本
消息队列：消息丢失、顺序性、重复消费、数据的一致性（分布式系统就要考虑）

> 也可以叫分布式场景下需要考虑的问题)

## 传统的 http 请求存在那些缺点

1.Http 请求基于请求与响应的模型，在高并发的情况下，客户端发送大量的请求达到
服务器端有可能会导致我们服务器端处理请求堆积。
2.Tomcat 服务器处理每个请求都有自己独立的线程，如果超过最大线程数会将该请求缓存到队列中，如果请求堆积过多的情况下，有可能会导致 tomcat 服务器崩溃的问题。
所以一般都会在 nginx 入口实现限流，整合服务保护框架。

3.        http请求处理业务逻辑如果比较耗时的情况下，容易造成客户端一直等待，阻塞等待
    过程中会导致客户端超时发生重试策略，有可能会引发幂等性问题。

注意事项：接口是为 http 协议的情况下，最好不要处理比较耗时的业务逻辑，耗时的业务逻辑应该单独交给多线程或者是 mq 处理。

### 同步发送 http 请求

客户端发送请求到达服务器端，服务器端实现会员注册业务逻辑，
1.insertMember() --插入会员数据 1s
2.sendSms()----发送登陆短信提醒 3s
3.sendCoupons()----发送新人优惠券 3s
总共响应需要 6s 时间，可能会导致客户端阻塞 6s 时间，对用户体验
不是很好。

多线程与 MQ 方式实现异步？

互联网项目:
客户端安卓/IOS

服务器端：php/java
最好使用 mq 实现异步

### 多线程处理业务逻辑

用户向数据库中插入一条数据之后，在单独开启一个线程异步发送短信和优惠操作。
客户端只需要等待 1s 时间
优点：适合于小项目实现异步
缺点：有可能会消耗服务器 cpu 资源资源

### Mq 处理业务逻辑

先向数据库中插入一条会员数据，让后再向 MQ 中投递一个消息，MQ 服务器端在将消息推送给消费者异步解耦处理发送短信和优惠券。

## Mq 与多线程之间区别

多线程也可以实现异步，但是消耗到 cpu 资源，没有实现解耦。
多线程异步去实现发送短信以及领取优惠卷会导致过度消耗 cpu 资源，cpu 上下文竞争关系，可能导致会员服务以及其他服务降低，因此多线程适合于小项目；而 MQ 可以实现异步/解耦/流量削峰问题，因此适合于大型项目。

## Mq 消息中间件名词

Producer 生产者：投递消息到 MQ 服务器端；
Consumer 消费者：从 MQ 服务器端获取消息处理业务逻辑；
Broker MQ 服务器端
Topic 主题：分类业务逻辑发送短信主题、发送优惠券主题
Queue 存放消息模型队列先进先出后进后出原则数组/链表
Message 生产者投递消息报文：json

## 主流 mq 区别对比

**技术对比**
技术选型指标：
● 吞吐量：IO、并发
● 时效性：类似延迟，消息的发送、到达时间
● 可用性：系统可用的比率（比如 1 年 365 天宕机 1s，可用率大概 X 个 9）
● 可靠性：消息不丢失（比如不丢失订单）、功能正常完成

| 特性       | ActiveMQ                                                       | RabbitMQ                                                               | RocketMQ                                                                              | kafka                                                                                                    |
| ---------- | -------------------------------------------------------------- | ---------------------------------------------------------------------- | ------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| 开发语言   | java                                                           | erlang                                                                 | java                                                                                  | scala                                                                                                    |
| 单机吞吐量 | 万级                                                           | 万级                                                                   | 10 万级                                                                               | 10 万级                                                                                                  |
| 时效性     | ms 级                                                          | us 级                                                                  | ms 级                                                                                 | ms 级以内                                                                                                |
| 可用性     | 高（主从架构）                                                 | 高（主从架构）                                                         | 非常高（分布式架构）                                                                  | 非常高（分布式架构）                                                                                     |
| 功能特性   | 成熟的产品，在很多公司得到应用；有较多的文档；各种协议支持较好 | 基于 erlang 开发，所以并发能力很强，性能极其好，延时很低管理界面较丰富 | MQ 功能比较完备，扩展性佳                                                             | 只支持主要的 MQ 功能，像一些消息查询，消息回溯等功能没有提供，毕竟是为大数据准备的，在大数据领域应用广。 |
| 应用场景   | 中小型企业、项目                                               | 适合绝大多数分布式的应用，这也是先学他的原因                           | 适用于 **大规模**处理数据的场景，比如构建日志收集系统、实时数据流传输、事件流收集传输 | 适用于 **金融 **、电商等对可靠性要求较高的场景，适合 **大规模 **的消息处理。                             |

## RabbitMQ 入门实战

特点：生态好，好学习、易于理解，时效性强，支持很多不同语言的客户端，扩展性、可用性都很不错。
学习性价比非常高的消息队列，适用于绝大多数中小规模分布式系统。

官方网站：[https://www.rabbitmq.com](https://www.rabbitmq.com/getstarted.html)

### 基本概念

AMQP 协议：[https://www.rabbitmq.com/tutorials/amqp-concepts.html](https://www.rabbitmq.com/tutorials/amqp-concepts.html)
AMQP 是一种消息传递协议，让符合要求的客户端应用程序能够与符合要求的消息中间件进行通信
高级消息队列协议（Advanced Message Queue Protocol）

生产者：发消息到某个交换机
消费者：从某个队列中取消息
交换机（Exchange）：负责把消息 转发 到对应的队列
队列（Queue）：存储消息的
路由（Routes）：转发，就是怎么把消息从一个地方转到另一个地方（比如从生产者转发到某个队列）
![](https://cdn.nlark.com/yuque/0/2023/png/398476/1686835103366-bdb220cd-b177-4f41-982d-8451e5f6ebfe.png?x-oss-process=image%2Fresize%2Cw_700%2Climit_0#averageHue=%23f9f2ee&from=url&id=Evvsx&originHeight=328&originWidth=700&originalType=binary&ratio=1.25&rotation=0&showTitle=false&status=done&style=none&title=)

访问：[http://localhost:15672](http://localhost:15672/#/)，用户名密码都是 guest：

![](https://cdn.nlark.com/yuque/0/2023/png/398476/1686836097799-5f76d0cf-466c-41f7-9400-c7b31513ce48.png#averageHue=%23f9f9f8&from=url&id=QDJgA&originHeight=1105&originWidth=1848&originalType=binary&ratio=1.25&rotation=0&showTitle=false&status=done&style=none&title=)

如果想要在远程服务器安装访问 rabbitmq 管理面板，你要自己创建一个管理员账号，不能用默认的 guest，否则会被拦截（官方出于安全考虑）。

如果被拦截，可以自己创建管理员用户：
参考文档的 Adding a User：[https://www.rabbitmq.com/access-control.html](https://www.rabbitmq.com/access-control.html)

![](https://cdn.nlark.com/yuque/0/2023/png/398476/1686836238966-daf0d8b4-ae0f-4451-bbb5-89693eb064b8.png?x-oss-process=image%2Fresize%2Cw_831%2Climit_0#averageHue=%23767574&from=url&id=WIQkF&originHeight=493&originWidth=831&originalType=binary&ratio=1.25&rotation=0&showTitle=false&status=done&style=none&title=)

rabbitmq 端口占用：
5672：程序连接的端口
15672：webUI

![](https://cdn.nlark.com/yuque/0/2023/png/398476/1686836349584-8ec4cef9-d45a-4d02-8417-6739b7624a8e.png?x-oss-process=image%2Fresize%2Cw_825%2Climit_0#averageHue=%23f3f1ef&from=url&id=C7jLp&originHeight=534&originWidth=825&originalType=binary&ratio=1.25&rotation=0&showTitle=false&status=done&style=none&title=)

###

快速入门

MQ 官方教程：[https://www.rabbitmq.com/getstarted.html](https://www.rabbitmq.com/getstarted.html)

单向发送
Hello World
文档：[https://www.rabbitmq.com/tutorials/tutorial-one-java.html](https://www.rabbitmq.com/tutorials/tutorial-one-java.html)

一个生产者给一个队列发消息，一个消费者从这个队列取消息。1 对 1。

![](https://cdn.nlark.com/yuque/0/2023/png/398476/1686836521822-053f7420-498d-4539-9721-ae0bc6e5b012.png#averageHue=%23f4dbd6&from=url&id=IdUgY&originHeight=244&originWidth=1027&originalType=binary&ratio=1.25&rotation=0&showTitle=false&status=done&style=none&title=)

引入消息队列 java 客户端

```xml
<!-- https://mvnrepository.com/artifact/com.rabbitmq/amqp-client -->
<dependency>
    <groupId>com.rabbitmq</groupId>
    <artifactId>amqp-client</artifactId>
    <version>5.16.0</version>
</dependency>

```

生产者代码：

```java
package com.xiaozhang.QI_BI.mq;

import com.rabbitmq.client.ConnectionFactory;
import com.rabbitmq.client.Connection;
import com.rabbitmq.client.Channel;

public class Send {
    private final static String QUEUE_NAME = "hello";

    public static void main(String[] argv) throws Exception {
//        创建工厂
        ConnectionFactory factory = new ConnectionFactory();
        factory.setHost("localhost");
//        创建连接
        try (Connection connection = factory.newConnection();
//             创建Channel 频道（可以理解为客户端）
             Channel channel = connection.createChannel()) {
//            创建队列
            channel.queueDeclare(QUEUE_NAME, false, false, false, null);
            String message = "Hello World!";
//            发送消息
            channel.basicPublish("", QUEUE_NAME, null, message.getBytes());
            System.out.println(" [x] Sent '" + message + "'");
        }
    }
}
```

![1687944045356.png](https://cdn.nlark.com/yuque/0/2023/png/33551426/1687944063317-2996bc0e-6d7b-4a2c-9206-0412a962d979.png#averageHue=%23ebeae9&clientId=u8e95eaa8-7658-4&from=paste&height=110&id=u022db1f9&originHeight=110&originWidth=1060&originalType=binary&ratio=1.25&rotation=0&showTitle=false&size=11950&status=done&style=none&taskId=u00abceb2-39c1-4871-b373-bfcef629f89&title=&width=1060)

消费者代码:

```java
package com.xiaozhang.QI_BI.mq;

import com.rabbitmq.client.Channel;
import com.rabbitmq.client.Connection;
import com.rabbitmq.client.ConnectionFactory;
import com.rabbitmq.client.DeliverCallback;

public class Recv {

    private final static String QUEUE_NAME = "hello";

    public static void main(String[] argv) throws Exception {
//        创建工厂
        ConnectionFactory factory = new ConnectionFactory();
        factory.setHost("localhost");
        Connection connection = factory.newConnection();
//        创建Channel 频道（可以理解为客户端）
        Channel channel = connection.createChannel();
//      注意这里的配置要和创建的配置一样
        channel.queueDeclare(QUEUE_NAME, false, false, false, null);
        System.out.println(" [*] Waiting for messages. To exit press CTRL+C");
//        定义如何处理消息
        DeliverCallback deliverCallback = (consumerTag, delivery) -> {
            String message = new String(delivery.getBody(), "UTF-8");
            System.out.println(" [x] Received '" + message + "'");
        };
//        消费消息，会持续阻塞
        channel.basicConsume(QUEUE_NAME, true, deliverCallback, consumerTag -> {
        });
    }
}
```

Channel 频道：理解为操作消息队列的 client（比如 jdbcClient、redisClient），提供了和消息队列 server 建立通信的传输方法（为了复用连接，提高传输效率）。程序通过 channel 操作 rabbitmq（收发消息）

```java
    @Override
    public Queue.DeclareOk queueDeclare(String queue, boolean durable, boolean exclusive,
                                        boolean autoDelete, Map<String, Object> arguments)
```

创建消息队列：
参数：
queue：消息队列名称（注意，同名称的消息队列，只能用同样的参数创建一次）
durable：消息队列重启后，消息是否丢失
exclusive：是否只允许当前这个创建消息队列的连接操作消息队列
autoDelete：没有人 用队列后，是否要删除队列

消费示例：
![1687944821005.png](https://cdn.nlark.com/yuque/0/2023/png/33551426/1687944852554-33ad90fd-9830-4f78-ae56-cf709a0b3666.png#averageHue=%23f0efef&clientId=u8e95eaa8-7658-4&from=paste&height=368&id=u3ec41d11&originHeight=368&originWidth=1231&originalType=binary&ratio=1.25&rotation=0&showTitle=false&size=23173&status=done&style=none&taskId=u72ecb416-9b43-4f58-930d-62be4f5106b&title=&width=1231)

**多消费者**
官方教程：[https://www.rabbitmq.com/tutorials/tutorial-two-java.html](https://www.rabbitmq.com/tutorials/tutorial-two-java.html)
场景：多个机器同时去接受并处理任务（尤其是每个机器的处理能力有限）
一个生产者给一个队列发消息，**多个消费者 **从这个队列取消息。1 对多。

![](https://cdn.nlark.com/yuque/0/2023/png/398476/1686837446793-34600b8b-907d-4c0a-8200-f077b3175c32.png#averageHue=%23f7e5e1&from=url&id=xMCTx&originHeight=294&originWidth=870&originalType=binary&ratio=1.25&rotation=0&showTitle=false&status=done&style=none&title=)

1）队列持久化
durable 参数设置为 true，服务器重启后队列不丢失：

```java
channel.queueDeclare(TASK_QUEUE_NAME, true, false, false, null);
```

2）消息持久化
指定 MessageProperties.PERSISTENT_TEXT_PLAIN 参数：

```java
channel.basicPublish("", TASK_QUEUE_NAME,
        MessageProperties.PERSISTENT_TEXT_PLAIN,
        message.getBytes("UTF-8"));
```

生产者代码：
使用 Scanner 接受用户输入，便于发送多条消息

```java
package com.xiaozhang.QI_BI.mq;

import com.rabbitmq.client.Channel;
import com.rabbitmq.client.Connection;
import com.rabbitmq.client.ConnectionFactory;
import com.rabbitmq.client.MessageProperties;

import java.util.Scanner;

public class MultiProducer {

  private static final String TASK_QUEUE_NAME = "multi_queue";

  public static void main(String[] argv) throws Exception {
    ConnectionFactory factory = new ConnectionFactory();
    factory.setHost("localhost");
    try (Connection connection = factory.newConnection();
         Channel channel = connection.createChannel()) {
        channel.queueDeclare(TASK_QUEUE_NAME, true, false, false, null);

        Scanner scanner = new Scanner(System.in);
        while (scanner.hasNext()) {
            String message = scanner.nextLine();
            channel.basicPublish("", TASK_QUEUE_NAME,
                    MessageProperties.PERSISTENT_TEXT_PLAIN,
                    message.getBytes("UTF-8"));
            System.out.println(" [x] Sent '" + message + "'");
        }
    }
  }

}
```

控制单个消费者的处理任务积压数：
每个消费者最多同时处理 1 个任务

消息确认机制：
为了保证消息成功被消费（快递成功被取走），rabbitmq 提供了消息确认机制，当消费者接收到消息后，比如要给一个反馈：
●ack：消费成功
●nack：消费失败
●reject：拒绝
如果告诉 rabbitmq 服务器消费成功，服务器才会放心地移除消息。
支持配置 autoack，会自动执行 ack 命令，接收到消息立刻就成功了。

```java
      channel.basicConsume(TASK_QUEUE_NAME, false, deliverCallback, consumerTag -> {
            });
```

**autoack 为 true 表示自动确认，建议 autoack 改为 false，根据实际情况，去手动确认。**
指定确认某条消息：

```java
channel.basicAck(delivery.getEnvelope().getDeliveryTag(), false);
```

默认情况第二个参数为 false，表示只确认当前消息，改为 true 则自动确认在此之前所有未确认的消息
指定拒绝某条消息：

```java
channel.basicNack(delivery.getEnvelope().getDeliveryTag(), false, false);
```

第三个参数 false 是指 requeue 参数，用于指定当消息被拒绝（nack）后是否重新将消息放回队列。在该代码中，设置为 false 表示不将消息重新放回队列，即消息被拒绝后将被丢弃。

消费者代码:

```java
package com.xiaozhang.QI_BI.mq;

import com.rabbitmq.client.Channel;
import com.rabbitmq.client.Connection;
import com.rabbitmq.client.ConnectionFactory;
import com.rabbitmq.client.DeliverCallback;

public class MultiConsumer {

    private static final String TASK_QUEUE_NAME = "multi_queue";

    public static void main(String[] argv) throws Exception {
        // 建立连接
        ConnectionFactory factory = new ConnectionFactory();
        factory.setHost("localhost");
        final Connection connection = factory.newConnection();
//        for循环模拟创建两个消费者
        for (int i = 0; i < 2; i++) {
            final Channel channel = connection.createChannel();
            channel.queueDeclare(TASK_QUEUE_NAME, true, false, false, null);
            System.out.println(" [*] Waiting for messages. To exit press CTRL+C");
//          指定每个消费者最多同时消费的消息数
            channel.basicQos(1);
            // 定义了如何处理消息
            int finalI = i;
            DeliverCallback deliverCallback = (consumerTag, delivery) -> {
                String message = new String(delivery.getBody(), "UTF-8");
                try {
                    // 处理工作
                    System.out.println(" [x] Received '" + "编号:" + finalI + ":" + message + "'");
                    // 消费消息后手动确认消息
                    channel.basicAck(delivery.getEnvelope().getDeliveryTag(), false);
                    // 停 20 秒，模拟机器处理能力有限
                    Thread.sleep(20000);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                    //消费异常，
                    channel.basicNack(delivery.getEnvelope().getDeliveryTag(), false, false);
                } finally {
                    System.out.println(" [x] Done");
                    channel.basicAck(delivery.getEnvelope().getDeliveryTag(), false);
                }
            };
            // 开启消费监听
            channel.basicConsume(TASK_QUEUE_NAME, false, deliverCallback, consumerTag -> {
            });
        }
    }
}
```

2 个小技巧： 1. 使用 Scanner 接受用户输入，便于快速发送多条消息 2. 使用 for 循环创建多个消费者，便于快速验证队列模型工作机制

### 交换机

一个生产者给 多个 队列发消息，1 个生产者对多个队列。
交换机的作用：提供消息转发功能，类似于网络路由器
要解决的问题：怎么把消息转发到不同的队列上，好让消费者从不同的队列消费。

绑定：交换机和队列关联起来，也可以叫路由，算是一个算法或转发策略
绑定代码：

```java
channel.queueBind(queueName,EXCHANGE_NAME,"绑定规则");
```

教程：[https://www.rabbitmq.com/tutorials/tutorial-three-java.html](https://www.rabbitmq.com/tutorials/tutorial-three-java.html)

交换机有多种类别：fanout、direct, topic, headers

#### Fanout 交换机

扇出、广播
特点：消息会被转发到所有绑定到该交换机的队列
场景：很适用于发布订阅的场景。比如写日志，可以多个系统间共享

![](https://cdn.nlark.com/yuque/0/2023/png/398476/1686839285368-841c3ded-965b-4ed7-8214-091ac7f2c922.png#averageHue=%23ecb9af&from=url&id=FQ8wi&originHeight=247&originWidth=745&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

示例场景：
![7K)]8JE8I`IBQ5$W$IS20R1.png](https://cdn.nlark.com/yuque/0/2023/png/33551426/1687948681364-80cd61ee-59a9-439e-a383-1508632217a8.png#averageHue=%23fefefd&clientId=u1d2592de-0cbf-4&from=paste&height=386&id=u93f7459a&originHeight=386&originWidth=785&originalType=binary&ratio=1&rotation=0&showTitle=false&size=22715&status=done&style=none&taskId=uf5a03041-8aa6-4e4b-ba21-448e52f4d75&title=&width=785)

生产者代码：

```java
public class FanoutProducer {

  private static final String EXCHANGE_NAME = "fanout-exchange";

  public static void main(String[] argv) throws Exception {
    ConnectionFactory factory = new ConnectionFactory();
    factory.setHost("localhost");
    try (Connection connection = factory.newConnection();
         Channel channel = connection.createChannel()) {
        // 创建交换机
        channel.exchangeDeclare(EXCHANGE_NAME, "fanout");
        Scanner scanner = new Scanner(System.in);
        while (scanner.hasNext()) {
            String message = scanner.nextLine();
            channel.basicPublish(EXCHANGE_NAME, "", null, message.getBytes("UTF-8"));
            System.out.println(" [x] Sent '" + message + "'");
        }
    }
  }
}
```

消费者代码：
注意：
1 消费者和生产者要绑定同一个交换机
2 要先有队列，才能绑定

消费者代码：

```java
package com.xiaozhang.QI_BI.mq;

import com.rabbitmq.client.Channel;
import com.rabbitmq.client.Connection;
import com.rabbitmq.client.ConnectionFactory;
import com.rabbitmq.client.DeliverCallback;

public class MultiConsumer {

    private static final String TASK_QUEUE_NAME = "multi_queue";

    public static void main(String[] argv) throws Exception {
        // 建立连接
        ConnectionFactory factory = new ConnectionFactory();
        factory.setHost("localhost");
        final Connection connection = factory.newConnection();
        //        for循环模拟创建两个消费者
        for (int i = 0; i < 2; i++) {
            final Channel channel = connection.createChannel();
            channel.queueDeclare(TASK_QUEUE_NAME, true, false, false, null);
            System.out.println(" [*] Waiting for messages. To exit press CTRL+C");
            //          指定每个消费者最多同时消费的消息数
            channel.basicQos(1);
            // 定义了如何处理消息
            int finalI = i;
            DeliverCallback deliverCallback = (consumerTag, delivery) -> {
                String message = new String(delivery.getBody(), "UTF-8");
                try {
                    // 处理工作
                    System.out.println(" [x] Received '" + "编号:" + finalI + ":" + message + "'");
                    // 消费消息后手动确认消息
                    channel.basicAck(delivery.getEnvelope().getDeliveryTag(), false);
                    // 停 20 秒，模拟机器处理能力有限
                    Thread.sleep(20000);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                    //消费异常，
                    channel.basicNack(delivery.getEnvelope().getDeliveryTag(), false, false);
                } finally {
                    System.out.println(" [x] Done");
                    channel.basicAck(delivery.getEnvelope().getDeliveryTag(), false);
                }
            };
            // 开启消费监听
            channel.basicConsume(TASK_QUEUE_NAME, false, deliverCallback, consumerTag -> {
            });
        }
    }
}
```

#### Direct 交换机

官方教程：[https://www.rabbitmq.com/tutorials/tutorial-four-java.html](https://www.rabbitmq.com/tutorials/tutorial-four-java.html)
绑定：可以让交换机和队列进行关联，可以指定让交互机把什么样的消息发送给哪个队列（类似于计算机网络中，两个路由器，或者网络设备相互连接，也可以理解为网线）
routingKey：路由键，控制消息要转发给哪个队列的（IP 地址）

特点：消息会根据路由键转发到指定的队列
场景：特定的消息只交给特定的系统（程序）来处理
绑定关系：完全匹配字符串

![](https://cdn.nlark.com/yuque/0/2023/png/398476/1687007686788-76df21d6-428d-4d2d-abb7-4da819faf775.png?x-oss-process=image%2Fresize%2Cw_408%2Climit_0#averageHue=%23150000&from=url&id=zHKr5&originHeight=171&originWidth=408&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

一个路由键可以给多个队列
交换机里存放着所有的路由键
比如发日志的场景
![](https://cdn.nlark.com/yuque/0/2023/png/398476/1687007976055-a38c33d2-490f-4582-b9ea-36b881c2101e.png?x-oss-process=image%2Fresize%2Cw_423%2Climit_0#averageHue=%23140000&from=url&id=Mjcsv&originHeight=171&originWidth=423&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

示例场景：
![7V`W[UCM7CDP0@(_G0MY2]B.png](https://cdn.nlark.com/yuque/0/2023/png/33551426/1687955344132-80370d91-734f-4a15-b26c-fb1db9bf78a4.png#averageHue=%23fefdfd&clientId=ucd6a0eb8-2a30-4&from=paste&height=379&id=uf244fd0e&originHeight=379&originWidth=790&originalType=binary&ratio=1&rotation=0&showTitle=false&size=23995&status=done&style=none&taskId=u01e2c8e7-77d8-4da2-b389-25f312add09&title=&width=790)

消费者代码：

```java
public class DirectConsumer {

    private static final String EXCHANGE_NAME = "direct-exchange";

    public static void main(String[] argv) throws Exception {
        ConnectionFactory factory = new ConnectionFactory();
        factory.setHost("localhost");
        Connection connection = factory.newConnection();
        Channel channel = connection.createChannel();
        channel.exchangeDeclare(EXCHANGE_NAME, "direct");

        // 创建队列，随机分配一个队列名称
        String queueName = "xiaoyu_queue";
        channel.queueDeclare(queueName, true, false, false, null);
        channel.queueBind(queueName, EXCHANGE_NAME, "xiaoyu");

        // 创建队列，随机分配一个队列名称
        String queueName2 = "xiaopi_queue";
        channel.queueDeclare(queueName2, true, false, false, null);
        channel.queueBind(queueName2, EXCHANGE_NAME, "xiaopi");

        System.out.println(" [*] Waiting for messages. To exit press CTRL+C");

        DeliverCallback xiaoyuDeliverCallback = (consumerTag, delivery) -> {
            String message = new String(delivery.getBody(), "UTF-8");
            System.out.println(" [xiaoyu] Received '" +
                    delivery.getEnvelope().getRoutingKey() + "':'" + message + "'");
        };

        DeliverCallback xiaopiDeliverCallback = (consumerTag, delivery) -> {
            String message = new String(delivery.getBody(), "UTF-8");
            System.out.println(" [xiaopi] Received '" +
                    delivery.getEnvelope().getRoutingKey() + "':'" + message + "'");
        };

        channel.basicConsume(queueName, true, xiaoyuDeliverCallback, consumerTag -> {
        });
        channel.basicConsume(queueName2, true, xiaopiDeliverCallback, consumerTag -> {
        });
    }
}
```

生产者代码：

```java
public class DirectProducer {

  private static final String EXCHANGE_NAME = "direct-exchange";

  public static void main(String[] argv) throws Exception {
    ConnectionFactory factory = new ConnectionFactory();
    factory.setHost("localhost");
    try (Connection connection = factory.newConnection();
         Channel channel = connection.createChannel()) {
        channel.exchangeDeclare(EXCHANGE_NAME, "direct");

        Scanner scanner = new Scanner(System.in);
        while (scanner.hasNext()) {
            String userInput = scanner.nextLine();
            String[] strings = userInput.split(" ");
            if (strings.length < 1) {
                continue;
            }
            String message = strings[0];
            String routingKey = strings[1];

            channel.basicPublish(EXCHANGE_NAME, routingKey, null, message.getBytes("UTF-8"));
            System.out.println(" [x] Sent '" + message + " with routing:" + routingKey + "'");
        }

    }
  }
  //..
}
```

#### Topic 交换机

官方教程：[https://www.rabbitmq.com/tutorials/tutorial-five-java.html](https://www.rabbitmq.com/tutorials/tutorial-five-java.html)

特点：消息会根据模糊的路由键转发给指定的队列
场景：特定的一类消息可以交给特定的一类系统来处理
绑定关系：可以模糊匹配多个绑定

- - 匹配一个单词，比如\*.orange，那么 a.orange、b.orange 都能匹配
- #：匹配 0 个或者多个单词，比如 a.#，那么 a.a、a.b、a.a.a 都能匹配

注意：这里的匹配和 mysql 的 like 的%不一样，只能按照单词来匹配，每个‘.’分隔单词，如果是'#.'，其实可以忽略，匹配 0 个也 ok
![](https://cdn.nlark.com/yuque/0/2023/png/398476/1687009111794-08bd54bb-234d-4280-a604-852e2b01840c.png#averageHue=%23f8ecea&from=url&id=XUeMy&originHeight=622&originWidth=1479&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

应用场景：
老板要下发一个任务，让多个组来处理
![M01_LSD@J@6GLGNYQ1@C_1W.png](https://cdn.nlark.com/yuque/0/2023/png/33551426/1687955866934-02d32e8e-3ff3-41b9-811d-eb0d2ea4d925.png#averageHue=%23fefdfd&clientId=ucd6a0eb8-2a30-4&from=paste&height=622&id=u16876434&originHeight=622&originWidth=760&originalType=binary&ratio=1&rotation=0&showTitle=false&size=36630&status=done&style=none&taskId=uc426ae3a-ba42-45aa-a211-c9b9675ca44&title=&width=760)

生产者代码：

```java
public class TopicProducer {

  private static final String EXCHANGE_NAME = "topic-exchange";

  public static void main(String[] argv) throws Exception {
    ConnectionFactory factory = new ConnectionFactory();
    factory.setHost("localhost");
    try (Connection connection = factory.newConnection();
         Channel channel = connection.createChannel()) {

        channel.exchangeDeclare(EXCHANGE_NAME, "topic");

        Scanner scanner = new Scanner(System.in);
        while (scanner.hasNext()) {
            String userInput = scanner.nextLine();
            String[] strings = userInput.split(" ");
            if (strings.length < 1) {
                continue;
            }
            String message = strings[0];
            String routingKey = strings[1];

            channel.basicPublish(EXCHANGE_NAME, routingKey, null, message.getBytes("UTF-8"));
            System.out.println(" [x] Sent '" + message + " with routing:" + routingKey + "'");
        }
    }
  }
  //..
}
```

消费者代码：

```java
public class TopicConsumer {

  private static final String EXCHANGE_NAME = "topic-exchange";

  public static void main(String[] argv) throws Exception {
    ConnectionFactory factory = new ConnectionFactory();
    factory.setHost("localhost");
    Connection connection = factory.newConnection();
    Channel channel = connection.createChannel();

    channel.exchangeDeclare(EXCHANGE_NAME, "topic");

      // 创建队列
      String queueName = "frontend_queue";
      channel.queueDeclare(queueName, true, false, false, null);
      channel.queueBind(queueName, EXCHANGE_NAME, "#.前端.#");

      // 创建队列
      String queueName2 = "backend_queue";
      channel.queueDeclare(queueName2, true, false, false, null);
      channel.queueBind(queueName2, EXCHANGE_NAME, "#.后端.#");

      // 创建队列
      String queueName3 = "product_queue";
      channel.queueDeclare(queueName3, true, false, false, null);
      channel.queueBind(queueName3, EXCHANGE_NAME, "#.产品.#");

      System.out.println(" [*] Waiting for messages. To exit press CTRL+C");

      DeliverCallback xiaoaDeliverCallback = (consumerTag, delivery) -> {
          String message = new String(delivery.getBody(), "UTF-8");
          System.out.println(" [xiaoa] Received '" +
                  delivery.getEnvelope().getRoutingKey() + "':'" + message + "'");
      };

      DeliverCallback xiaobDeliverCallback = (consumerTag, delivery) -> {
          String message = new String(delivery.getBody(), "UTF-8");
          System.out.println(" [xiaob] Received '" +
                  delivery.getEnvelope().getRoutingKey() + "':'" + message + "'");
      };

      DeliverCallback xiaocDeliverCallback = (consumerTag, delivery) -> {
          String message = new String(delivery.getBody(), "UTF-8");
          System.out.println(" [xiaoc] Received '" +
                  delivery.getEnvelope().getRoutingKey() + "':'" + message + "'");
      };

      channel.basicConsume(queueName, true, xiaoaDeliverCallback, consumerTag -> {
      });
      channel.basicConsume(queueName2, true, xiaobDeliverCallback, consumerTag -> {
      });
      channel.basicConsume(queueName3, true, xiaocDeliverCallback, consumerTag -> {
      });
  }
}
```

#### Headers 交换机

类似主题和直接交换机，可以根据 headers 中的内容来指定发送到哪个队列
由于性能差、比较复杂，一般不推荐使用。

> AI 学习连环问：是什么？有什么用？什么场景下会用？有什么优缺点？有没有示例代码？

![](https://cdn.nlark.com/yuque/0/2023/png/398476/1687011466810-28a7cdc5-e42c-45f5-aa8c-2635c41e0a89.png?x-oss-process=image%2Fresize%2Cw_400%2Climit_0#averageHue=%23ccdbf3&from=url&id=Og523&originHeight=1235&originWidth=400&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

#### RPC

支持用消息队列来模拟 RPC 的调用，但是一般没必要，直接用 Dubbo、GRPC 等 RPC 框架就好了。

### 核心特性

#### 消息过期机制

官方文档：[https://www.rabbitmq.com/ttl.html](https://www.rabbitmq.com/ttl.html)

可以给每个消息指定一个有效期，一段时间内未处理，就过期
示例场景：消费者（库存系统）挂了，一个订单 15 分钟还没有被库存清理，这个订单其实已经失效了，哪怕库存系统恢复，也不扣库存
试用场景：
订单系统中顾客下单、模拟延迟队列的实现（区分 vip 和普通用户）、专门让某个程序处理过期的请求
1）给队列中的所有消息指定过期时间

```java
// 创建队列，指定消息过期参数
Map<String, Object> args = new HashMap<String, Object>();
args.put("x-message-ttl", 5000);
// args 指定参数
channel.queueDeclare(QUEUE_NAME, false, false, false, args);
```

![](https://cdn.nlark.com/yuque/0/2023/png/398476/1687012172430-53fff46b-6383-40c9-99ae-bc96667f71d4.png#averageHue=%23ebe6e5&from=url&id=mBQr0&originHeight=468&originWidth=1010&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

如果在过期时间内，还没有消费者取消息，消息才会过期。
注意，如果消息已经收到，但是没有确认，是不会过期的

> 如果消息处于代消费状态并且过期时间到达后，消息将被标记为过期。但是，如果消息已经处于正在处理的过程，即将过期，消息仍然会被正常处理，不会过期

消费者代码：

```java

public class TtlConsumer {

    private final static String QUEUE_NAME = "ttl_queue";

    public static void main(String[] argv) throws Exception {
        // 创建连接
        ConnectionFactory factory = new ConnectionFactory();
        factory.setHost("localhost");
        Connection connection = factory.newConnection();
        Channel channel = connection.createChannel();

        // 创建队列，指定消息过期参数
        Map<String, Object> args = new HashMap<String, Object>();
        args.put("x-message-ttl", 5000);
        // args 指定参数
        channel.queueDeclare(QUEUE_NAME, false, false, false, args);

        System.out.println(" [*] Waiting for messages. To exit press CTRL+C");
        // 定义了如何处理消息
        DeliverCallback deliverCallback = (consumerTag, delivery) -> {
            String message = new String(delivery.getBody(), StandardCharsets.UTF_8);
            System.out.println(" [x] Received '" + message + "'");
        };
        // 消费消息，会持续阻塞
        channel.basicConsume(QUEUE_NAME, false, deliverCallback, consumerTag -> { });
    }
}
```

生产者示例代码:

```java
public class TtlProducer {

    private final static String QUEUE_NAME = "ttl_queue";

    public static void main(String[] argv) throws Exception {
        // 创建连接工厂
        ConnectionFactory factory = new ConnectionFactory();
        factory.setHost("localhost");
//        factory.setUsername();
//        factory.setPassword();
//        factory.setPort();

        // 建立连接、创建频道
        try (Connection connection = factory.newConnection();
             Channel channel = connection.createChannel()) {
            // 发送消息
            String message = "Hello World!";
            channel.basicPublish("", QUEUE_NAME, null, message.getBytes(StandardCharsets.UTF_8));
            System.out.println(" [x] Sent '" + message + "'");
        }
    }
}
```

2)给某条消息指定过期时间
语法：

```java
// 给消息指定过期时间
AMQP.BasicProperties properties = new AMQP.BasicProperties.Builder()
        .expiration("1000")
        .build();
channel.basicPublish("my-exchange", "routing-key", properties, message.getBytes(StandardCharsets.UTF_8));
```

示例代码：

```java
public class TtlProducer {

    private final static String QUEUE_NAME = "ttl_queue";

    public static void main(String[] argv) throws Exception {
        // 创建连接工厂
        ConnectionFactory factory = new ConnectionFactory();
        factory.setHost("localhost");
//        factory.setUsername();
//        factory.setPassword();
//        factory.setPort();

        // 建立连接、创建频道
        try (Connection connection = factory.newConnection();
             Channel channel = connection.createChannel()) {
            // 发送消息
            String message = "Hello World!";

            // 给消息指定过期时间
            AMQP.BasicProperties properties = new AMQP.BasicProperties.Builder()
                    .expiration("1000")
                    .build();
            channel.basicPublish("my-exchange", "routing-key", properties, message.getBytes(StandardCharsets.UTF_8));
            System.out.println(" [x] Sent '" + message + "'");
        }
    }
}
```

#### 消息确认机制

官方文档：[https://www.rabbitmq.com/confirms.html](https://www.rabbitmq.com/confirms.html)
为了保证消息被正常消费（快递员取走），rabbitMQ 提供了消息确认机制，当消费者收到消息后，要给一个反馈。

- ack 消费成功
- nack 消费失败
- reject 拒绝

如果告诉 rabbitMQ 服务器消费成功，服务器才会放心移除消息。
支持配置 autoack，会自动执行 ack 命令，接到消息立刻就成功了。

```java
 channel.basicConsume(TASK_QUEUE_NAME, false, deliverCallback, consumerTag -> {
            });
```

一般情况，建议 autoack 改为 false，根据实际情况，去手动确认。

指定确认某条消息：

```java
channel.basicAck(delivery.getEnvelope().getDeliveryTag(), );
```

第二个参数 multiple 批量确认；是指是否要一次性确认所有的历史消息直到当前这一条

拒绝某条消息：

```java
channel.basicNack(delivery.getEnvelope().getDeliveryTag(), false, false);
```

第二个 参数指示是否拒绝多条消息，如果为 true，则拒绝所有比给定 deliveryTag 小或等于它的未确认消息；如果为 false，则只拒绝指定 deliveryTag 的消息。
第三个参数表示是否重新入队，用于重试

与之相反，**basicReject** 方法是另一种拒绝消息的方式，它只能拒绝单个消息，并且只能将消息重新放回队列。如果您需要拒绝多条消息或选择性地将消息重新放回队列或直接丢弃，那么您应该使用 basicNack 方法。

#### 死信队列

官方文档：[https://www.rabbitmq.com/dlx.html](https://www.rabbitmq.com/dlx.html)

为了保证消息的可靠性，比如每条消息都成功消费，需要提供一个容错机制，即：失败的消息怎么处理？
死信：过期的消息、拒收的消息、消息队列满了、处理失败的消息的统称
死信队列：专门处理死信的队列（注意，它就是一个普通队列，只不过是专门用来处理死信的，你甚至可以理解这个队列的名称叫 “死信队列”）

死信交换机：专门给死信队列转发消息的交换机（注意，它就是一个普通交换机，只不过是专门给死信队列发消息而已，理解为这个交换机的名称就叫 “死信交换机”）。也存在路由绑定
死信可以通过死信交换机绑定到死信队列。

示例场景：
![1687964679285.png](https://cdn.nlark.com/yuque/0/2023/png/33551426/1687964741456-462605ae-f905-4fbd-ae73-327dbf685706.png#averageHue=%23fdfdfd&clientId=ucd6a0eb8-2a30-4&from=paste&height=597&id=ud8150982&originHeight=597&originWidth=748&originalType=binary&ratio=1&rotation=0&showTitle=false&size=27670&status=done&style=none&taskId=uc97c0fe9-d41a-4306-af3f-9c3cb997c43&title=&width=748)

实现：
1）创建死信交换机和死信队列，并且绑定关系
![](https://cdn.nlark.com/yuque/0/2023/png/398476/1687013888188-1bde4fc6-73c1-48e4-b9c8-7d231a4e5a72.png#averageHue=%23fcfcfc&from=url&id=ZZ33J&originHeight=418&originWidth=772&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

2）给失败之后需要容错处理的队列绑定死信交换机

```java
// 指定死信队列参数
Map<String, Object> args = new HashMap<>();
// 要绑定到哪个交换机
args.put("x-dead-letter-exchange", DEAD_EXCHANGE_NAME);
// 指定死信要转发到哪个死信队列
args.put("x-dead-letter-routing-key", "waibao");

// 创建队列，随机分配一个队列名称
String queueName = "xiaodog_queue";
channel.queueDeclare(queueName, true, false, false, args);
channel.queueBind(queueName, EXCHANGE_NAME, "xiaodog");
```

3）可以给要容错的队列指定死信之后的转发规则，死信应该再转发到哪个死信队列

```java
// 指定死信要转发到哪个死信队列
args.put("x-dead-letter-routing-key", "waibao");
```

4）可以通过程序来读取死信队列中的消息，从而进行处理

```java

// 创建队列，随机分配一个队列名称
String queueName = "laoban_dlx_queue";
channel.queueDeclare(queueName, true, false, false, null);
channel.queueBind(queueName, DEAD_EXCHANGE_NAME, "laoban");

String queueName2 = "waibao_dlx_queue";
channel.queueDeclare(queueName2, true, false, false, null);
channel.queueBind(queueName2, DEAD_EXCHANGE_NAME, "waibao");

DeliverCallback laobanDeliverCallback = (consumerTag, delivery) -> {
    String message = new String(delivery.getBody(), "UTF-8");
    // 拒绝消息
    channel.basicNack(delivery.getEnvelope().getDeliveryTag(), false, false);
    System.out.println(" [laoban] Received '" +
            delivery.getEnvelope().getRoutingKey() + "':'" + message + "'");
};

DeliverCallback waibaoDeliverCallback = (consumerTag, delivery) -> {
    String message = new String(delivery.getBody(), "UTF-8");
    // 拒绝消息
    channel.basicNack(delivery.getEnvelope().getDeliveryTag(), false, false);
    System.out.println(" [waibao] Received '" +
            delivery.getEnvelope().getRoutingKey() + "':'" + message + "'");
};

channel.basicConsume(queueName, false, laobanDeliverCallback, consumerTag -> {
});
channel.basicConsume(queueName2, false, waibaoDeliverCallback, consumerTag -> {
});
```

完整生产者代码：

```java

public class DlxDirectProducer {

    private static final String DEAD_EXCHANGE_NAME = "dlx-direct-exchange";
    private static final String WORK_EXCHANGE_NAME = "direct2-exchange";


    public static void main(String[] argv) throws Exception {
        ConnectionFactory factory = new ConnectionFactory();
        factory.setHost("localhost");
        try (Connection connection = factory.newConnection();
             Channel channel = connection.createChannel()) {
            // 声明死信交换机
            channel.exchangeDeclare(DEAD_EXCHANGE_NAME, "direct");

            // 创建队列，随机分配一个队列名称
            String queueName = "laoban_dlx_queue";
            channel.queueDeclare(queueName, true, false, false, null);
            channel.queueBind(queueName, DEAD_EXCHANGE_NAME, "laoban");

            String queueName2 = "waibao_dlx_queue";
            channel.queueDeclare(queueName2, true, false, false, null);
            channel.queueBind(queueName2, DEAD_EXCHANGE_NAME, "waibao");

            DeliverCallback laobanDeliverCallback = (consumerTag, delivery) -> {
                String message = new String(delivery.getBody(), "UTF-8");
                // 拒绝消息
                channel.basicNack(delivery.getEnvelope().getDeliveryTag(), false, false);
                System.out.println(" [laoban] Received '" +
                        delivery.getEnvelope().getRoutingKey() + "':'" + message + "'");
            };

            DeliverCallback waibaoDeliverCallback = (consumerTag, delivery) -> {
                String message = new String(delivery.getBody(), "UTF-8");
                // 拒绝消息
                channel.basicNack(delivery.getEnvelope().getDeliveryTag(), false, false);
                System.out.println(" [waibao] Received '" +
                        delivery.getEnvelope().getRoutingKey() + "':'" + message + "'");
            };

            channel.basicConsume(queueName, false, laobanDeliverCallback, consumerTag -> {
            });
            channel.basicConsume(queueName2, false, waibaoDeliverCallback, consumerTag -> {
            });


            Scanner scanner = new Scanner(System.in);
            while (scanner.hasNext()) {
                String userInput = scanner.nextLine();
                String[] strings = userInput.split(" ");
                if (strings.length < 1) {
                    continue;
                }
                String message = strings[0];
                String routingKey = strings[1];

                channel.basicPublish(WORK_EXCHANGE_NAME, routingKey, null, message.getBytes("UTF-8"));
                System.out.println(" [x] Sent '" + message + " with routing:" + routingKey + "'");
            }

        }
    }
    //..
}
```

消费者完整代码：

```java
public class DlxDirectConsumer {

    private static final String DEAD_EXCHANGE_NAME = "dlx-direct-exchange";

    private static final String WORK_EXCHANGE_NAME = "direct2-exchange";

    public static void main(String[] argv) throws Exception {
        ConnectionFactory factory = new ConnectionFactory();
        factory.setHost("localhost");
        Connection connection = factory.newConnection();
        Channel channel = connection.createChannel();
        channel.exchangeDeclare(WORK_EXCHANGE_NAME, "direct");

        // 指定死信队列参数
        Map<String, Object> args = new HashMap<>();
        // 要绑定到哪个交换机
        args.put("x-dead-letter-exchange", DEAD_EXCHANGE_NAME);
        // 指定死信要转发到哪个死信队列
        args.put("x-dead-letter-routing-key", "waibao");

        // 创建队列，随机分配一个队列名称
        String queueName = "xiaodog_queue";
        channel.queueDeclare(queueName, true, false, false, args);
        channel.queueBind(queueName, WORK_EXCHANGE_NAME, "xiaodog");

        Map<String, Object> args2 = new HashMap<>();
        args2.put("x-dead-letter-exchange", DEAD_EXCHANGE_NAME);
        args2.put("x-dead-letter-routing-key", "laoban");

        // 创建队列，随机分配一个队列名称
        String queueName2 = "xiaocat_queue";
        channel.queueDeclare(queueName2, true, false, false, args2);
        channel.queueBind(queueName2, WORK_EXCHANGE_NAME, "xiaocat");

        System.out.println(" [*] Waiting for messages. To exit press CTRL+C");

        DeliverCallback xiaoyuDeliverCallback = (consumerTag, delivery) -> {
            String message = new String(delivery.getBody(), "UTF-8");
            // 拒绝消息
            channel.basicNack(delivery.getEnvelope().getDeliveryTag(), false, false);
            System.out.println(" [xiaodog] Received '" +
                    delivery.getEnvelope().getRoutingKey() + "':'" + message + "'");
        };

        DeliverCallback xiaopiDeliverCallback = (consumerTag, delivery) -> {
            String message = new String(delivery.getBody(), "UTF-8");
            // 拒绝消息
            channel.basicNack(delivery.getEnvelope().getDeliveryTag(), false, false);
            System.out.println(" [xiaocat] Received '" +
                    delivery.getEnvelope().getRoutingKey() + "':'" + message + "'");
        };

        channel.basicConsume(queueName, false, xiaoyuDeliverCallback, consumerTag -> {
        });
        channel.basicConsume(queueName2, false, xiaopiDeliverCallback, consumerTag -> {
        });
    }
}
```

### RabbitMQ 重要知识

> 也是面试考点

1. 消息队列的概念、模型、应用场景

概念:
消息队列就是存储消息的队列。
模型：
生产者：Producer，类比为快递员，发送消息的人（客户端）
消费者：Consumer，类比为取快递的人，接受读取消息的人（客户端）
消息：Message，类比为快递，就是生产者要传输给消费者的数据
消息队列：Queue 为什么不接传输，要用消息队列？生产者不用关心你的消费者要不要消费、什么时候消费，我只需要把东西给消息队列，我的工作就算完成了。 生产者和消费者实现了解耦，互不影响。
应用场景: 1.耗时的场景（异步） 2.高并发场景（异步、削峰填谷） 3.分布式系统协作（跨团队、跨业务、应用解耦）
比如 QQ 是一个系统，用 c++写的，微信用 java 写的，qq 的消息可以通过消息队列传送给微信 4.强稳定性的场景（金融业务、持久化、可靠性、削峰填谷）
支付、转账

2. 交换机的类别、路由绑定的关系
   1. Fanout
   2. Direct
   3. Topic
   4. Headers
   5. RPC

扇形交换机（Fanout Exchange）：在扇形交换机中，绑定不需要指定路由键。交换机会将消息广播到所有与之绑定的队列，忽略消息的路由键。
直连交换机（Direct Exchange）：在直连交换机中，绑定需要指定一个特定的路由键。当消息的路由键与绑定的路由键完全匹配时，消息将被路由到与之绑定的队列。
主题交换机（Topic Exchange）：在主题交换机中，绑定使用模式匹配的路由键。路由键可以包含通配符 _ 和 #。_ 匹配一个单词，# 匹配零个或多个单词。交换机将消息根据路由键与绑定的模式进行匹配，然后路由到相应的队列。
标头交换机（Headers Exchange）：在标头交换机中，绑定使用消息的标头信息进行匹配。绑定时可以指定一组键值对，当消息的标头信息与绑定的键值对匹配时，消息将被路由到相应的队列。

3. 消息可靠性
   a 消息确认机制（ack、nack、reject）
   b 消息持久化（durable）
   首先，您需要确保队列本身是持久化的，以防止在 RabbitMQ 服务器重启或崩溃时丢失队列的定义和消息。其次，您需要确保消息本身是持久化的，以便在服务器重启或崩溃后仍然保留消息。在发布消息时，可以通过设置 deliveryMode 参数为 2 来使消息持久化。

c 消息过期机制
d 死信队列
消费过程中可能存在消息消费失败、消息过期、消息达到最大重试次数、消息被拒绝等情况，死信队列为消息处理提供了一种容错机制，确保系统能够对异常情况进行适当的处理，并提高消息系统的可靠性和稳定性

4. 延迟队列（类似死信队列）
5. 顺序消费、消费幂等性（本次不讲）
6. 可扩展性（仅作了解）
   a 集群
   b 故障的恢复机制
   c 镜像
7. 运维监控告警（仅作了解）

## Mq 设计基础知识

**多线程版本 mq；**
**基于网络通讯版本 mq netty 实现**

### 基于多线程队列简单实现 mq

```java
package com.example.demo1;

import com.alibaba.fastjson.JSONObject;

import java.util.concurrent.LinkedBlockingDeque;

/**
* @author:22603
* @Date:2023/3/3 15:23
*/
public class ThreadMQ {

    private static LinkedBlockingDeque<JSONObject>linkedBlockingDeque=new LinkedBlockingDeque<>();

    public static void main(String[] args) {
        Thread producer = new Thread(new Runnable() {
            @Override
            public void run() {
                while (true) {
                    try {
                        Thread.sleep(1000);
                        JSONObject jsonObject = new JSONObject();
                        jsonObject.put("phone", "18790034997");
                        System.out.println(Thread.currentThread().getName() + ",获取到数据:" + jsonObject.toJSONString());
                        linkedBlockingDeque.offer(jsonObject);
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    }
                }
            }
        }, "生产额");
        Thread customer = new Thread(new Runnable() {
            @Override
            public void run() {
                while (true) {
                    JSONObject poll = linkedBlockingDeque.poll();
                    while (poll != null) {
                        System.out.println(Thread.currentThread().getName() + ",获取到数据:" + poll.toJSONString());
                    }
                }
            }
        }, "消费者");
        producer.start();
        customer.start();
    }
}
```

### 基于 netty 实现 mq

消费者 netty 客户端与 nettyServer 端 MQ 服务器端保持长连接，MQ 服务器端保存
消费者连接。
生产者 netty 客户端发送请求给 nettyServer 端 MQ 服务器端，MQ 服务器端在将该
消息内容发送给消费者。

body:{"msg":{"userId":"123456","age":"23"},"type":"producer"，”topic”:””}
[NettyMQServer.java](https://www.yuque.com/attachments/yuque/0/2023/java/33551426/1677922569697-19813871-c904-431a-bbf5-ce353198fc3e.java?_lake_card=%7B%22src%22%3A%22https%3A%2F%2Fwww.yuque.com%2Fattachments%2Fyuque%2F0%2F2023%2Fjava%2F33551426%2F1677922569697-19813871-c904-431a-bbf5-ce353198fc3e.java%22%2C%22name%22%3A%22NettyMQServer.java%22%2C%22size%22%3A7210%2C%22ext%22%3A%22java%22%2C%22source%22%3A%22%22%2C%22status%22%3A%22done%22%2C%22download%22%3Atrue%2C%22taskId%22%3A%22u0ca88953-3f38-4e45-984b-3635444ee04%22%2C%22taskType%22%3A%22upload%22%2C%22type%22%3A%22%22%2C%22__spacing%22%3A%22both%22%2C%22mode%22%3A%22title%22%2C%22id%22%3A%22uc92a400b%22%2C%22margin%22%3A%7B%22top%22%3Atrue%2C%22bottom%22%3Atrue%7D%2C%22card%22%3A%22file%22%7D)[NettyMQConsumer.java](https://www.yuque.com/attachments/yuque/0/2023/java/33551426/1677922569698-50ef2ac6-6029-45a6-affa-91b513fd2597.java?_lake_card=%7B%22src%22%3A%22https%3A%2F%2Fwww.yuque.com%2Fattachments%2Fyuque%2F0%2F2023%2Fjava%2F33551426%2F1677922569698-50ef2ac6-6029-45a6-affa-91b513fd2597.java%22%2C%22name%22%3A%22NettyMQConsumer.java%22%2C%22size%22%3A4182%2C%22ext%22%3A%22java%22%2C%22source%22%3A%22%22%2C%22status%22%3A%22done%22%2C%22download%22%3Atrue%2C%22taskId%22%3A%22u495980a7-67b8-4244-93e9-43d7a4a2073%22%2C%22taskType%22%3A%22upload%22%2C%22type%22%3A%22%22%2C%22__spacing%22%3A%22both%22%2C%22mode%22%3A%22title%22%2C%22id%22%3A%22u57358565%22%2C%22margin%22%3A%7B%22top%22%3Atrue%2C%22bottom%22%3Atrue%7D%2C%22card%22%3A%22file%22%7D)[NettyMQProduce.java](https://www.yuque.com/attachments/yuque/0/2023/java/33551426/1677922569722-760c8e69-dd07-46c2-a6d3-e1cdb34fb5be.java?_lake_card=%7B%22src%22%3A%22https%3A%2F%2Fwww.yuque.com%2Fattachments%2Fyuque%2F0%2F2023%2Fjava%2F33551426%2F1677922569722-760c8e69-dd07-46c2-a6d3-e1cdb34fb5be.java%22%2C%22name%22%3A%22NettyMQProduce.java%22%2C%22size%22%3A4579%2C%22ext%22%3A%22java%22%2C%22source%22%3A%22%22%2C%22status%22%3A%22done%22%2C%22download%22%3Atrue%2C%22taskId%22%3A%22u9a7a267a-f4c8-4d80-a791-f4129711153%22%2C%22taskType%22%3A%22upload%22%2C%22type%22%3A%22%22%2C%22__spacing%22%3A%22both%22%2C%22mode%22%3A%22title%22%2C%22id%22%3A%22ud6e420a2%22%2C%22margin%22%3A%7B%22top%22%3Atrue%2C%22bottom%22%3Atrue%7D%2C%22card%22%3A%22file%22%7D)

### 面试问题

生产者投递消息给 MQ 服务器端，MQ 服务器端需要缓存该消息
如果 mq 服务器端宕机之后，消息如何保证不丢失

1.        持久化机制
    ① 生产者投递消息给消费者，消息不只是放在内存里，他也会持久化到我们的硬盘中
    ② 消息支持持久化到 Commitlog 里面，即使宕机后重启，未消费的消息也是可以加载出来的

2、如果 mq 接收到生产者投递消息，如果消费者不在的情况下，该消息是否会丢失？
不会丢失，消息确认机制必须要消费者消费该消息成功之后，在通知给 mq 服务器端
删除该消息。

3、冗余部署：采用冗余部署的架构，使用多个 MQ 服务器组成集群或者使用主从复制机制。当主服务器宕机时，备份服务器可以接管服务，并保证消息的持久化和可靠传递。

4、数据备份与恢复：定期备份 MQ 服务器上的消息数据，并确保备份数据的完整性和可靠性。在服务器宕机后，可以通过恢复备份数据来恢复消息队列的状态。

5、监控与报警：建立监控系统，实时监测 MQ 服务器的状态。一旦服务器发生故障或宕机，及时触发报警机制，以便管理员能够尽快采取措施来保护消息不丢失。

**Mq 服务器端将该消息推送消费者和费者主动拉取消息的区别？**

**Mq 服务器端将该消息推送消费者：**
消费者已经和 mq 服务器保持长连接。

**消费者主动拉取消息：**
消费者第一次刚启动的时候

**两者区别：生产者将消息推送给 mq 服务器端，mq 服务器端发现消费者不在的情况下，就会将消息缓存起来，随后消费者上线与 mq 服务器建立连接，拉取消息的过程属于消费者主动拉取消息，消费者消费消息后，会通知 mq 服务器端删除该消息，随后生产者将消息推送给 mq 服务器端，mq 服务器在已经与消费者建立连接的情况下，主动将消息推送给消费者。**

**Mq 如何实现抗高并发思想？**

1. 异步处理：将业务逻辑解耦并异步化，通过将请求转化为消息并发送到消息队列中，而不是直接同步处理请求。这样可以将高并发的请求转化为消息并发放到消息队列中，让消费者以适合的速率进行处理，从而实现系统的高并发能力。
2. 消息并发消费：通过增加消费者的数量，实现消息的并发消费能力。通过水平扩展消费者，可以增加系统的处理能力和并发处理的吞吐量。
3. 消费者负载均衡：在有多个消费者的情况下，可以使用负载均衡策略来平均分配消息的处理负载。常见的负载均衡策略包括轮询、随机、最少连接等，确保消息能够平均地分发给多个消费者进行处理。
4. 消息预取（Prefetch）：消息队列通常支持设置消费者的预取数量，即一次从队列中预取的消息数量。通过适当调整预取数量，可以提高消费者的处理效率和系统的吞吐量。
5. 限流和流量控制：通过设置适当的限流策略和流量控制机制，控制消息的发送速率和消费速率。这可以避免系统被过多的请求压垮，保持系统的稳定性和可靠性。
6. 消息批量处理：对于大量的小消息，可以进行批量处理，将多个消息打包成一个批次进行处理，减少系统的开销和通信成本。
7. 消息重试和幂等性：在高并发场景下，可能会出现消息处理失败的情况。通过实现消息的重试机制和保证消息处理的幂等性，可以避免因为重复消息或消息处理失败而引发的问题。
8. 高可用和故障恢复：通过使用多个消息队列节点和复制机制，实现高可用性和故障恢复能力。当某个节点发生故障时，其他节点可以接替其工作，确保系统的稳定性和可用性。

缺点：存在延迟的问题

**如何避免 mq 消息堆积问题？**

需要考虑 mq 消费者提高速率的问题：
如何消费者提高速率：**消费者实现集群、消费者批量获取消息即可。**
提供多个消费者，每个消费者每次取一百或者十条，从而提高效率

#### Maven 依赖

| ```
<dependencies>

     <dependency>

         <groupId>com.alibaba</groupId>

         <artifactId>fastjson</artifactId>

         <version>1.2.62</version>

     </dependency>



     <dependency>

         <groupId>io.netty</groupId>

         <artifactId>netty-all</artifactId>

         <version>4.0.23.Final</version>

     </dependency>

     <dependency>

         <groupId>com.alibaba</groupId>

         <artifactId>fastjson</artifactId>

         <version>1.2.62</version>

     </dependency>

     <dependency>

         <groupId>org.apache.commons</groupId>

         <artifactId>commons-lang3</artifactId>

         <version>3.11</version>

     </dependency>

   </dependencies>
```

| |
| |

# RabbitMQ

## RabbitMQ 基本介绍

RabbitMQ 是实现了高级消息队列协议（AMQP）的开源消息代理软件（亦称面向消息的中间件），RabbitMQ 服务器是用 Erlang 语言编写的。
RabitMQ 官方网站:
[https://www.rabbitmq.com/](https://www.rabbitmq.com/) 1.点对点(简单)的队列 2.工作(公平性)队列模式 3.发布订阅模式 4.路由模式 Routing 5.通配符模式 Topics
6.RPC
https://www.rabbitmq.com/getstarted.html

## RabbitMQ 环境的基本安装

1.下载并安装 erlang,下载地址：http://www.erlang.org/download 2.配置 erlang 环境变量信息
新增环境变量 ERLANG_HOME=erlang 的安装地址
将%ERLANG_HOME%\bin 加入到 path 中 3.下载并安装 RabbitMQ，下载地址：http://www.rabbitmq.com/download.html
注意: RabbitMQ 它依赖于 Erlang,需要先安装 Erlang。
[https://www.rabbitmq.com/install-windows.html](https://www.rabbitmq.com/install-windows.html)

安装教程：[https://blog.csdn.net/tirster/article/details/121938987](https://blog.csdn.net/tirster/article/details/121938987)

### 安装 RabbitMQ 环境步骤

配置 Erlang 环境变量：

### 如何启动 Rabbitmq

net start RabbitMQ

### 启动 Rabbitmq 常见问题

如果 rabbitmq 启动成功无法访问管理平台页面

进入到 F:\path\rabbitmq\rabbitmq\rabbitmq_server-3.6.9\sbin>
执行
rabbitmq-plugins enable rabbitmq_management
rabbitmqctl start_app

### Rabbitmq 管理平台中心

RabbitMQ 管理平台地址 http://127.0.0.1:15672
默认账号:guest/guest 用户可以自己创建新的账号

Virtual Hosts:
像 mysql 有数据库的概念并且可以指定用户对库和表等操作的权限。那 RabbitMQ 呢？
RabbitMQ 也有类似的权限管理。在 RabbitMQ 中可以虚拟消息服务器 VirtualHost，每
个 VirtualHost 相当月一个相对独立的 RabbitMQ 服务器，每个 VirtualHost 之间是相互
隔离的。exchange、queue、message 不能互通。

默认的端口 15672：rabbitmq 管理平台端口号
默认的端口 5672： rabbitmq 消息中间内部通讯的端口
默认的端口号 25672 rabbitmq 集群的端口号

### RabbitMQ 常见名词

/Virtual Hosts---分类
/队列存放我们消息
Exchange 分派我们消息在那个队列存放起来类似于 nginx

15672---rabbitmq 控制台管理平台 http 协议
25672rabbitmq 集群通信端口号
Amqp 5672 rabbitmq 内部通信的一个端口号

### RabbitMQ 创建账户

### RabbitMQ 平台创建 Virtual Hosts

### RabbitMQ 平台创建消息队列

## 快速入门 RabbitMQ 简单队列

首先需要再 RabbitMQ 平台创建 Virtual Hosts 和队列。
/meiteVirtualHosts
----订单队列
----支付队列

1.        在RabbitMQ平台创建一个队列；
2.        在编写生产者代码
3.        在编写消费者代码

### RabbitMQ 如何保证消息不丢失

先来看看消息都有可能再哪些环节丢失
![JZ9O8F]IZ$ND00NCWW[R2(D.png](https://cdn.nlark.com/yuque/0/2023/png/33551426/1678063490365-7adcdad9-0f2b-4208-9a45-51079bbc7de8.png#averageHue=%23f8f8f8&clientId=ub4a67b8a-2261-4&from=paste&height=200&id=u467660a7&originHeight=200&originWidth=677&originalType=binary&ratio=1&rotation=0&showTitle=false&size=11164&status=done&style=none&taskId=u30c0e8f7-b810-48b6-b612-f69425b7ca3&title=&width=677)
Mq 如何保证消息不丢失：

1.        生产者角色

    由于网络波动导致消息发送失败
    确保生产者投递消息到 MQ 服务器端成功。
    解决:Ack 消息确认机制
    存在同步或者异步的形式，同步会存在生产者将消息发送给 MQ 服务器端，MQ 服务器端未能及时响应给生产者，就会导致生产者服务延迟阻塞，响应给客户端。异步是在生产者和 MQ 服务第端之间会有一个观察者进行事件监听，只要 MQ 服务器端将消息持久化到硬盘，MQ 服务器端再给监听方法发通知，说明消息发送成功了。如果消息多久时间内一直未给响应结果的情况下，我们可以人为进行重试。
    方式 1：Confirms 方式 2：事务消息

2.        消费者角色
    消费者在消费完消息之前宕机，MQ 服务器端认为认为消息消费成功，并把存储在内存中的消息删除，导致消息丢失
    解决:
    在 rabbitmq 情况下引入了消息应答机制：
    必须要将消息消费成功之后，才会将该消息从 mq 服务器端中移除。
    在 kafka 中的情况下：
    不管是消费成功还是消费失败，该消息都不会立即从 mq 服务器端移除。
    在 kafka 中，消费者宕机，MQ 服务器端如何判断这个消息消费了多少呢，kafka 中引入了分区 off、set，他会记录消费者消费了这个消息的哪个偏移量，消费者知道该从哪开始消费，消息清理，一般会有定时器在几天后定时把消费成功的消息进行清理
3.        MQ服务器端把消息发送给消费者前宕机

    Mq 服务器端在默认的情况下都会对队列中的消息实现持久化
    持久化硬盘。

4.  使用消息确认机制+持久技术
    A.消费者确认收到消息机制
    channel.basicConsume(QUEUE_NAME, false, defaultConsumer);
    注：第二个参数值为 false 代表关闭 RabbitMQ 的自动应答机制，改为手动应答。
    在处理完消息时，返回应答状态，true 表示为自动应答模式。
    channel.basicAck(envelope.getDeliveryTag(), false);
    B.生产者确认投递消息成功 使用 Confirm 机制 或者事务消息

Confirm 机制：
生产者将 Channel 设置成 confirm 模式，一旦 Channel 进入 confirm 模式，所有在该 Channel 上面发布的消息都将会被指派一个唯一的 ID(从 1 开始)，一旦消息被投递到所有匹配的队列之后，broker 就会发送一个确认给生产者(包含消息的唯一 ID)，这就使得生产者知道消息已经正确到达目的队列了，如果消息和队列是可持久化的，那么确认消息会在将消息写入磁盘之后发出，broker 回传给生产者的确认消息中 delivery-tag 域包含了确认消息的序列号，此外 broker 也可以设置 basic.ack 的 multiple 域，表示到这个序列号之前的所有消息都已经得到了处理；
confirm 模式最大的好处在于他是异步的，一旦发布一条消息，生产者应用程序就可以在等 Channel 返回确认的同时继续发送下一条消息，当消息最终得到确认之后，生产者应用便可以通过回调方法来处理该确认消息，如果 RabbitMQ 因为自身内部错误导致消息丢失，就会发送一条 nack 消息，生产者应用程序同样可以在回调方法中处理该 nack 消息；
事务模式： channel.txSelect(); _//开启事务_
channel.txCommit(); _//提交事务_
channel.txRollback(); _//回滚_
在通过 txSelect 开启事务之后，我们便可以发布消息给 broker 服务器了，如果 txCommit 提交成功了，则消息一定到达了 broker 了，如果在 txCommit 执行之前 broker 异常崩溃或者由于其他原因抛出异常，这个时候我们便可以捕获异常通过 txRollback 回滚事务了。

这里注意一下：txSelect 与 Confirm 模式不能共存。
Confirm 模式的三种编程方式：

1. 串行 confirm 模式：peoducer 每发送一条消息后，调用 waitForConfirms()方法，等待 broker 端 confirm。
2. 批量 confirm 模式：producer 每发送一批消息后，调用 waitForConfirms()方法，等待 broker 端 confirm。
3. 异步 confirm 模式：提供一个回调方法，broker confirm 了一条或者多条消息后 producer 端会回调这个方法。

2.RabbitMQ 默认创建是持久化的

代码中设置 durable 为 true

参数名称详解：
durable 是否持久化 durable 为持久化、 Transient 不持久化
autoDelete 是否自动删除，当最后一个消费者断开连接之后队列是否自动被删除，可以通过 RabbitMQ Management，查看某个队列的消费者数量，当 consumers = 0 时队列就会自动删除 2. 使用 rabbitmq 事务消息；

| ```java
channel.txSelect();

channel.basicPublish("", QUEUE_NAME, null, msg.getBytes());

// int i = 1 / 0;

channel.txCommit();

````

 |
| --- |


#### 相关核心代码
##### 生产者
| ```java
package com.example.demo1.RabbitMQ;

import com.rabbitmq.client.Channel;
import com.rabbitmq.client.Connection;

import java.io.IOException;
import java.util.concurrent.TimeoutException;

/**
* @author:22603
* @Date:2023/3/6 0:39
*/
public class ProduceMQ {

    public static final String QUEUE_NAME="StudyingQueues";

    public static void main(String[] args) throws IOException, TimeoutException {
        Connection connection=ConnectionMQ.getConnect();
        Channel channel = connection.createChannel();
        String msg="MQ你好呀啊222";
        channel.basicPublish("",QUEUE_NAME,null,msg.getBytes());
        //       关闭通道和连接
        channel.close();
        connection.close();

    }
}

````

channel.confirmSelect();```java
package com.example.demo1.RabbitMQ;
import com.rabbitmq.client.Connection;
import com.rabbitmq.client.ConnectionFactory;

import java.io.IOException;
import java.util.concurrent.TimeoutException;

/\*\*

- @author:22603
- @Date:2023/3/6 0:29
  \*/
  public class ConnectionMQ {

      public static Connection getConnect() throws IOException, TimeoutException {
          ConnectionFactory connectionFactory=new ConnectionFactory();
          //        设置连接的virtualhost
          connectionFactory.setVirtualHost("/Study");
          //        设置用户名密码
          connectionFactory.setUsername("guest");
          connectionFactory.setPassword("guest");
          //        设置端口号和地址
          connectionFactory.setPort(5672);
          connectionFactory.setHost("127.0.0.1");
          return connectionFactory.newConnection();
      }

}

````

 |
| --- |


##### 消费者
| ```java
package com.example.demo1.RabbitMQ;

import com.rabbitmq.client.*;

import java.io.IOException;
import java.util.concurrent.TimeoutException;

/**
* @author:22603
* @Date:2023/3/6 0:39
*/
public class CustomMQ {

    public static final String QUEUE_NAME="StudyingQueues";

    public static void main(String[] args) throws IOException, TimeoutException {
        Connection connection=ConnectionMQ.getConnect();
        Channel channel = connection.createChannel();
        DefaultConsumer consumer=new DefaultConsumer(channel){
            @Override
            public void handleDelivery(String consumerTag, Envelope envelope, AMQP.BasicProperties properties, byte[] body) throws IOException {
                String msg=new String(body,"utf-8");
                System.out.println(msg);
            }
        };
        //        监听队列
        //        autoAck true 自动签收 false 手动签收
        channel.basicConsume(QUEUE_NAME,true,consumer);
    }
}

````

| |
| |

## RabbitMQ 五种消息模式

### RabitMQ 工作队列

默认的传统队列是为均摊消费，存在不公平性；如果每个消费者速度不一样的情况下，均摊消费是不公平的，应该是能者多劳。
采用工作队列
在通道中只需要设置 basicQos 为 1 即可，表示 MQ 服务器每次只会给消费者推送 1 条消息必须手动 ack 确认之后才会继续发送。
channel.basicQos(1);

### RabbitMQ 交换机类型

Direct exchange（直连交换机）
Fanout exchange（扇型交换机）
Topic exchange（主题交换机）
Headers exchange（头交换机）
/Virtual Hosts---区分不同的团队
----队列存放消息
----交换机路由消息存放在那个队列中类似于 nginx
---路由 key 分发规则

## Direct Exchange

直连交换机，根据 Routing Key(路由键)进行投递到不同队列。
单个绑定，一个路由键对应一个队列。如下所示：

![](https://cdn.nlark.com/yuque/0/2023/png/33551426/1678158420140-54852ce3-04e7-40d7-a60b-7340d21e1fb0.png#averageHue=%23150000&clientId=uf635b9a6-f378-4&from=paste&id=u8ea614a2&originHeight=171&originWidth=408&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ucefd7391-ea58-4e8e-898d-9d475721ba1&title=)
多个绑定，一个路由键对应多个队列，则消息会分别投递到两个队列中，如下所示：
![](https://cdn.nlark.com/yuque/0/2023/png/33551426/1678158420167-b0448137-666c-453a-9c1b-4275e5cbcfe5.png#averageHue=%23160000&clientId=uf635b9a6-f378-4&from=paste&id=u1783ecdb&originHeight=171&originWidth=398&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u90472250-3f5e-48e2-971f-27fe37d1d41&title=)

## Fanout Exchange

扇形交换机，采用广播模式，根据绑定的交换机，路由到与之对应的所有队列。一个发送到交换机的消息都会被转发到与该交换机绑定的所有队列上。很像子网广播，每台子网内的主机都获得了一份复制的消息。Fanout 交换机转发消息是最快的。
![](https://cdn.nlark.com/yuque/0/2023/png/33551426/1678158420143-c9df29e5-deac-494d-bdce-35b50551b85c.png#averageHue=%231b0000&clientId=uf635b9a6-f378-4&from=paste&id=u12903de6&originHeight=160&originWidth=329&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=uec131518-b681-4fb7-b89a-759e4c379e8&title=)

## Topic Exchange

主题交换机，对路由键进行模式匹配后进行投递，符号#表示一个或多个词，_表示一个词。因此“abc.#”能够匹配到“abc.def.ghi”，但是“abc._” 只会匹配到“abc.def”。如下所示：
![](https://cdn.nlark.com/yuque/0/2023/png/33551426/1678158420143-c434869a-5462-4175-a76e-bb0b78b216f0.png#averageHue=%23140000&clientId=uf635b9a6-f378-4&from=paste&id=u41779bab&originHeight=171&originWidth=424&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=uecf232e1-a9fb-4854-956c-62a3dca002e&title=)

## Header Exchange

头交换机，不处理路由键。而是根据发送的消息内容中的 headers 属性进行匹配。在绑定 Queue 与 Exchange 时指定一组键值对；当消息发送到 RabbitMQ 时会取到该消息的 headers 与 Exchange 绑定时指定的键值对进行匹配；如果完全匹配则消息会路由到该队列，否则不会路由到该队列。headers 属性是一个键值对，可以是 Hashtable，键值对的值可以是任何类型。而 fanout，direct，topic 的路由键都需要要字符串形式的。
匹配规则 x-match 有下列两种类型：
x-match = all ：表示所有的键值对都匹配才能接受到消息
x-match = any ：表示只要有键值对匹配就能接受到消息
消息头交换机，如下图所示：
![](https://cdn.nlark.com/yuque/0/2023/png/33551426/1678158420156-98a6b621-2b38-4b60-a6bf-91a5de07480e.png#averageHue=%23fdf3f2&clientId=uf635b9a6-f378-4&from=paste&id=u17ba6b1d&originHeight=225&originWidth=587&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u2c67e31b-0cec-47bb-86d8-01d37832700&title=)
以上就是 RabbitMQ 常见的四种交换机模式。

#### RabbitMQ Fanout 发布订阅

生产者发送一条消息，经过交换机转发到多个不同的队列，多个不同的队列就多个不同的消费者。

原理：

1.        需要创建两个队列，每个队列对应一个消费者；
2.        队列需要绑定我们交换机
3.        生产者投递消息到交换机中，交换机在将消息分配给两个队列中都存放起来；
4.        消费者从队列中获取这个消息。

##### 生产者代码

| ```
import com.mayikt.rabbitmq.RabbitMQConnection;

import com.rabbitmq.client.Channel;

import com.rabbitmq.client.Connection;

import java.io.IOException;

import java.util.concurrent.TimeoutException;

public class ProducerFanout {

     /**

      * 定义交换机的名称

      */

     private static final String EXCHANGE_NAME = "fanout_exchange";



     public static void main(String[] args) throws IOException, TimeoutException {

         //  创建Connection

         Connection connection = RabbitMQConnection.getConnection();

         // 创建Channel

         Channel channel = connection.createChannel();

         // 通道关联交换机

         channel.exchangeDeclare(EXCHANGE_NAME, "fanout", true);

         String msg = "每特教育6666";

         channel.basicPublish(EXCHANGE_NAME, "", null, msg.getBytes());

         channel.close();

         connection.close();

     }

}

````

 |
| --- |


##### 消费者代码
###### 邮件消费者
| ```
import com.mayikt.rabbitmq.RabbitMQConnection;

   import com.rabbitmq.client.*;



   import java.io.IOException;

   import java.util.concurrent.TimeoutException;



   public class MailConsumer {

     /**

      * 定义邮件队列

      */

     private static final String QUEUE_NAME = "fanout_email_queue";

     /**

      * 定义交换机的名称

      */

     private static final String EXCHANGE_NAME = "fanout_exchange";



     public static void main(String[] args) throws IOException, TimeoutException {

         System.out.println("邮件消费者...");

         // 创建我们的连接

         Connection connection = RabbitMQConnection.getConnection();

         // 创建我们通道

         final Channel channel = connection.createChannel();

         // 关联队列消费者关联队列

         channel.queueBind(QUEUE_NAME, EXCHANGE_NAME, "");

         DefaultConsumer defaultConsumer = new DefaultConsumer(channel) {

             @Override

             public void handleDelivery(String consumerTag, Envelope envelope, AMQP.BasicProperties properties, byte[] body) throws IOException {

                 String msg = new String(body, "UTF-8");

                 System.out.println("邮件消费者获取消息:" + msg);

             }

         };

         // 开始监听消息 自动签收

         channel.basicConsume(QUEUE_NAME, true, defaultConsumer);



     }

 }
````

| |
| |

###### 短信消费者

| ```
public class SmsConsumer {

     /**

      * 定义短信队列

      */

     private static final String QUEUE_NAME = "fanout_email_sms";

     /**

      * 定义交换机的名称

      */

     private static final String EXCHANGE_NAME = "fanout_exchange";



     public static void main(String[] args) throws IOException, TimeoutException {

         System.out.println("短信消费者...");

         // 创建我们的连接

         Connection connection = RabbitMQConnection.getConnection();

         // 创建我们通道

         final Channel channel = connection.createChannel();

         // 关联队列消费者关联队列

         channel.queueBind(QUEUE_NAME, EXCHANGE_NAME, "");

         DefaultConsumer defaultConsumer = new DefaultConsumer(channel) {

             @Override

             public void handleDelivery(String consumerTag, Envelope envelope, AMQP.BasicProperties properties, byte[] body) throws IOException {

                 String msg = new String(body, "UTF-8");

                 System.out.println("短信消费者获取消息:" + msg);

             }

         };

         // 开始监听消息 自动签收

         channel.basicConsume(QUEUE_NAME, true, defaultConsumer);



     }

}

````

 |
| --- |



#### Direct路由模式
当交换机类型为direct类型时，根据队列绑定的路由建转发到具体的队列中存放消息

##### 生产者
##### 消费者

#### Topic主题模式
当交换机类型为topic类型时，根据队列绑定的路由建模糊转发到具体的队列中存放。
#号表示支持匹配多个词；
*号表示只能匹配一个词



## SpringBoot整合RabbitMQ


### Maven依赖
| ```java
<parent>

    <groupId>org.springframework.boot</groupId>

    <artifactId>spring-boot-starter-parent</artifactId>

    <version>2.0.0.RELEASE</version>

    </parent>

    <dependencies>



    <!-- springboot-web组件 -->

    <dependency>

    <groupId>org.springframework.boot</groupId>

    <artifactId>spring-boot-starter-web</artifactId>

    </dependency>

    <!-- 添加springboot对amqp的支持 -->

    <dependency>

    <groupId>org.springframework.boot</groupId>

    <artifactId>spring-boot-starter-amqp</artifactId>

    </dependency>

    <dependency>

    <groupId>org.apache.commons</groupId>

    <artifactId>commons-lang3</artifactId>

    </dependency>

    <!--fastjson -->

    <dependency>

    <groupId>com.alibaba</groupId>

    <artifactId>fastjson</artifactId>

    <version>1.2.49</version>

    </dependency>



    <dependency>

    <groupId>org.projectlombok</groupId>

    <artifactId>lombok</artifactId>

    </dependency>

    </dependencies>
````

| |
| |

### 配置类

| ```java
package com.example.demo1.config;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.FanoutExchange;
import org.springframework.amqp.core.Queue;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;

/\*\*

- @author:22603
- @Date:2023/3/7 15:59
  \*/
  @Component
  public class RabbitMQConfig {

          /**

- 定义交换机
  \*/

          private String EXCHANGE_SPRINGBOOT_NAME = "/SpringBoot";


          /**

- 短信队列
  \*/

          private String FANOUT_SMS_QUEUE = "fanout_sms_queue";

          /**

- 邮件队列
  \*/
  private String FANOUT_EMAIL_QUEUE = "fanout_email_queue";

          @Bean
          public Queue sms() {
              return new Queue(FANOUT_SMS_QUEUE);
          }

          /**

- 配置 emailQueue
-
- @return
  \*/

          @Bean

          public Queue emailQueue() {

              return new Queue(FANOUT_EMAIL_QUEUE);

          }


          /**

- 配置 fanoutExchange
-
- @return
  \*/

          @Bean
          public FanoutExchange fanoutExchange() {
              return new FanoutExchange(EXCHANGE_SPRINGBOOT_NAME);
          }

          @Bean
          public Binding bindingSmsFanoutExchange(Queue sms,FanoutExchange fanoutExchange){
              return BindingBuilder.bind(sms).to(fanoutExchange);
          }

          @Bean
          public Binding bindingEmailFanoutExchange(Queue emailQueue,FanoutExchange fanoutExchange){
              return BindingBuilder.bind(emailQueue).to(fanoutExchange);
          }

      }

````
 
 |
| --- |


### 配置文件
application.yml

| ```yaml
spring:
  rabbitmq:
    ####连接地址
    host: 127.0.0.1

    ####端口号

    port: 5672

    ####账号

    username: guest

    ####密码

    password: guest

    ### 地址

    virtual-host: /Study
    listener:
      simple:
        acknowledge-mode: manual # 手动应答
        prefetch: 1 #每次从队列中取一个,轮询分发，默认是公平分发
        retry:
          max-attempts: 5 # 重试次数
          enabled: true # 开启重试


````

| |
| |

### 生产者

| ```java
package com.example.demo1.controller;

import com.example.demo1.eneity.MsgEneity;
import org.springframework.amqp.core.AmqpTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;
import java.util.UUID;

/\*\*

- @author:22603
- @Date:2023/3/7 17:07
  \*/
  @RestController
  public class fanoutController {

          @Resource
          private AmqpTemplate amqpTemplate;

          @RequestMapping("/sendMsg")
          public String sendMsg(){
              MsgEneity msgEneity=new MsgEneity(UUID.randomUUID().toString(),"1",
                                                "18790034997","2260391948@qq.com");
              amqpTemplate.convertAndSend("/SpringBoot","",msgEneity);
              return "消息投递成功:"+msgEneity;
          }
      }

````

 |
| --- |



### 消费者
| ```java
package com.example.demo1.Customer;

import com.example.demo1.eneity.MsgEneity;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitHandler;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

/**
* @author:22603
* @Date:2023/3/7 17:29
*/
@Slf4j
    @Component
    @RabbitListener(queues = "fanout_email_queue")
    public class EmailMsg {

        @RabbitHandler
        public void process(MsgEneity msgEneity){
            log.info("EmailMsg:"+msgEneity);
        }
    }

````

| |
| |

| ```java
package com.example.demo1.Customer;

import com.example.demo1.eneity.MsgEneity;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitHandler;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

/\*\*

- @author:22603
- @Date:2023/3/7 17:29
  \*/

@Slf4j
@Component
@RabbitListener(queues = "fanout_sms_queue")
public class MsgCustom {

        @RabbitHandler
        public void process(MsgEneity msgEneity){
            log.info("MsgCustom:"+msgEneity);
        }


    }

```

 |
| --- |


## MQ异步发送短信发邮件
生产者：
[RabbitMQConfig.java](https://www.yuque.com/attachments/yuque/0/2023/java/33551426/1678204154156-3fb8e446-6388-4ea7-86ca-f376ba44d973.java?_lake_card=%7B%22src%22%3A%22https%3A%2F%2Fwww.yuque.com%2Fattachments%2Fyuque%2F0%2F2023%2Fjava%2F33551426%2F1678204154156-3fb8e446-6388-4ea7-86ca-f376ba44d973.java%22%2C%22name%22%3A%22RabbitMQConfig.java%22%2C%22size%22%3A1595%2C%22ext%22%3A%22java%22%2C%22source%22%3A%22%22%2C%22status%22%3A%22done%22%2C%22download%22%3Atrue%2C%22taskId%22%3A%22u2a0fd865-e26e-486a-b61d-7a11a67e31f%22%2C%22taskType%22%3A%22upload%22%2C%22type%22%3A%22%22%2C%22__spacing%22%3A%22both%22%2C%22mode%22%3A%22title%22%2C%22id%22%3A%22ucf5824fa%22%2C%22margin%22%3A%7B%22top%22%3Atrue%2C%22bottom%22%3Atrue%7D%2C%22card%22%3A%22file%22%7D)[UserController.java](https://www.yuque.com/attachments/yuque/0/2023/java/33551426/1678204154169-a08ad0ad-575b-444a-a583-71c42fb06aee.java?_lake_card=%7B%22src%22%3A%22https%3A%2F%2Fwww.yuque.com%2Fattachments%2Fyuque%2F0%2F2023%2Fjava%2F33551426%2F1678204154169-a08ad0ad-575b-444a-a583-71c42fb06aee.java%22%2C%22name%22%3A%22UserController.java%22%2C%22size%22%3A935%2C%22ext%22%3A%22java%22%2C%22source%22%3A%22%22%2C%22status%22%3A%22done%22%2C%22download%22%3Atrue%2C%22taskId%22%3A%22ue9765300-6f17-4cb5-b6c6-240b5644961%22%2C%22taskType%22%3A%22upload%22%2C%22type%22%3A%22%22%2C%22__spacing%22%3A%22both%22%2C%22mode%22%3A%22title%22%2C%22id%22%3A%22u91e9ed2a%22%2C%22margin%22%3A%7B%22top%22%3Atrue%2C%22bottom%22%3Atrue%7D%2C%22card%22%3A%22file%22%7D)
消费者：
[MsgCustom.java](https://www.yuque.com/attachments/yuque/0/2023/java/33551426/1678204178501-023b7911-3796-4e3b-924c-4d42e44c5051.java?_lake_card=%7B%22src%22%3A%22https%3A%2F%2Fwww.yuque.com%2Fattachments%2Fyuque%2F0%2F2023%2Fjava%2F33551426%2F1678204178501-023b7911-3796-4e3b-924c-4d42e44c5051.java%22%2C%22name%22%3A%22MsgCustom.java%22%2C%22size%22%3A584%2C%22ext%22%3A%22java%22%2C%22source%22%3A%22%22%2C%22status%22%3A%22done%22%2C%22download%22%3Atrue%2C%22taskId%22%3A%22u8a49c97b-53f2-479f-9f89-32e02d987ce%22%2C%22taskType%22%3A%22upload%22%2C%22type%22%3A%22%22%2C%22__spacing%22%3A%22both%22%2C%22mode%22%3A%22title%22%2C%22id%22%3A%22u98be3257%22%2C%22margin%22%3A%7B%22top%22%3Atrue%2C%22bottom%22%3Atrue%7D%2C%22card%22%3A%22file%22%7D)[EmailMsg.java](https://www.yuque.com/attachments/yuque/0/2023/java/33551426/1678204178518-0b08e124-b312-47e6-a91b-87ed415a11b2.java?_lake_card=%7B%22src%22%3A%22https%3A%2F%2Fwww.yuque.com%2Fattachments%2Fyuque%2F0%2F2023%2Fjava%2F33551426%2F1678204178518-0b08e124-b312-47e6-a91b-87ed415a11b2.java%22%2C%22name%22%3A%22EmailMsg.java%22%2C%22size%22%3A571%2C%22ext%22%3A%22java%22%2C%22source%22%3A%22%22%2C%22status%22%3A%22done%22%2C%22download%22%3Atrue%2C%22taskId%22%3A%22u77599c3e-f1e0-4025-8f3a-3f4d1269c7b%22%2C%22taskType%22%3A%22upload%22%2C%22type%22%3A%22%22%2C%22__spacing%22%3A%22both%22%2C%22mode%22%3A%22title%22%2C%22id%22%3A%22u36bcfe16%22%2C%22margin%22%3A%7B%22top%22%3Atrue%2C%22bottom%22%3Atrue%7D%2C%22card%22%3A%22file%22%7D)

## 生产者如何获取消费结果


**1.     根据业务来定**
**消费者消费成功结果：**
**1.能够在数据库中插入一条数据**

**2.     Rocketmq 自带全局消息id，能够根据该全局消息获取消费结果**
**原理：生产者投递消息到mq服务器，mq服务器端在这时候返回一个全局的消息id，**
**当我们消费者消费该消息成功之后，消费者会给我们mq服务器端发送通知标记该消息**
**消费成功。**
**生产者获取到该消息全局id，每隔2s时间调用mq服务器端接口查询该消息是否**
**有被消费成功。**

1.     异步返回一个全局id，前端使用ajax定时主动查询；
2.     在rocketmq中，自带根据消息id查询是否消费成功

## RabbitMQ实战解决方案

#### RabbitMQ死信队列
#### 死信队列产生的背景
RabbitMQ死信队列俗称，备胎队列；消息中间件因为某种原因拒收该消息后，可以转移到死信队列中存放，死信队列也可以有交换机和路由key等。
#### 产生死信队列的原因
1.   消息投递到MQ中存放 消息已经过期  消费者没有及时的获取到我们消息，消息如果存放到mq服务器中过期之后，会转移到备胎死信队列存放。
2.   队列达到最大的长度 （队列容器已经满了）
**3.       **消费者消费多次消息失败，就会转移存放到死信队列中
代码整合参考 mayikt-springboot-rabbitmq|#中order-dead-letter-queue项目

#### 死信队列的架构原理
死信队列和普通队列区别不是很大
普通与死信队列都有自己独立的交换机和路由key、队列和消费者。
区别：
1.生产者投递消息先投递到我们普通交换机中，普通交换机在将该消息投到
普通队列中缓存起来，普通队列对应有自己独立普通消费者。
2.如果生产者投递消息到普通队列中，普通队列发现该消息一直没有被消费者消费
的情况下，在这时候会将该消息转移到死信（备胎）交换机中，死信（备胎）交换机
对应有自己独立的死信（备胎）队列对应独立死信（备胎）消费者。





#### 死信队列应用场景
1.30分钟订单超时设计
A.    Redis过期key ：
B.    死信延迟队列实现：
采用死信队列，创建一个普通队列没有对应的消费者消费消息，在30分钟过后
就会将该消息转移到死信备胎消费者实现消费。
备胎死信消费者会根据该订单号码查询是否已经支付过，如果没有支付的情况下
则会开始回滚库存操作。



### RabbitMQ消息幂等问题
#### RabbitMQ消息自动重试机制
1.     当我们消费者处理执行我们业务代码的时候，如果抛出异常的情况下
在这时候mq会自动触发重试机制，默认的情况下rabbitmq是无限次数的重试。
需要人为指定重试次数限制问题
2.     在什么情况下消费者需要实现重试策略？

A.消费者获取消息后，调用第三方接口，但是调用第三方接口失败呢？是否需要重试？
该情况下需要实现重试策略，网络延迟只是暂时调用不通，重试多次有可能会调用通。
还有数据库连接超时，也可以进行重试，重试多次有可能会调用通。
B.
消费者获取消息后，因为代码问题抛出数据异常，是否需要重试？
该情况下是不需要实现重试策略，就算重试多次，最终还是失败的。
可以将日志存放起来，后期通过定时任务或者人工补偿形式。
如果是重试多次还是失败消息，需要重新发布消费者版本实现消费
可以使用死信队列



Mq在重试的过程中，有可能会引发消费者重复消费的问题。
Mq消费者需要解决幂等性问题
幂等性保证数据唯一




方式1：
生产者在投递消息的时候，生成一个全局唯一id，放在我们消息中。
Msg id=123456

Msg id=123456
Msg id=123456

消费者获取到我们该消息，可以根据该全局唯一id实现去重复。
全局唯一id 根据业务来定的  订单号码作为全局的id
实际上还是需要再db层面解决数据防重复。
业务逻辑是在做insert操作使用唯一主键约束
业务逻辑是在做update操作使用乐观锁






1.  当消费者业务逻辑代码中，抛出异常自动实现重试 （默认是无数次重试）
2.  应该对RabbitMQ重试次数实现限制，比如最多重试5次，每次间隔3s；重试多次还是失败的情况下，存放到死信队列或者存放到数据库表中记录后期人工补偿
#### 如何合理选择消息重试
1.  消费者获取消息后，调用第三方接口，但是调用第三方接口失败呢？是否需要重试 ？
2.  消费者获取消息后，应该代码问题抛出数据异常，是否需要重试？

总结：如果消费者处理消息时，因为代码原因抛出异常是需要从新发布版本才能解决的，那么就不需要重试，重试也解决不了该问题的。存放到死信队列或者是数据库表记录、后期人工实现补偿。

#### Rabbitmq如何开启重试策略



| **spring**:
  **rabbitmq**:
    _####连接地址_    _**host**: 127.0.0.1
    _####端口号_    _**port**: 5672
    _####账号_    _**username**: guest
    _####密码_    _**password**: guest
    _### 地址_    _**virtual-host**: /meite_rabbitmq
    **listener**:
      **simple**:
        **retry**:
          _####开启消费者（程序出现异常的情况下会）进行重试_          _**enabled**: **true
          **_####最大重试次数_          _**max-attempts**: 5
          _####重试间隔次数_          _**initial-interval**: 3000
 |
| --- |




#### 消费者重试过程中，如何避免幂等性问题


**重试的过程中，为了避免业务逻辑重复执行，建议提前全局id提前查询，如果存在**
**的情况下，就无需再继续做该流程。**
**重试的次数最好有一定间隔次数，在数据库底层层面保证数据唯一性，比如加上唯一id。**

#### SpringBoot开启消MQ架构设计原理

什么是消息中间件
消息中间件基于队列模型实现异步/同步传输数据
作用：可以实现支撑高并发、异步解耦、流量削峰、降低耦合度。
传统的http请求存在那些缺点

1.Http请求基于请求与响应的模型，在高并发的情况下，客户端发送大量的请求达到
服务器端有可能会导致我们服务器端处理请求堆积。
2.Tomcat服务器处理每个请求都有自己独立的线程，如果超过最大线程数会将该请求缓存到队列中，如果请求堆积过多的情况下，有可能会导致tomcat服务器崩溃的问题。
所以一般都会在nginx入口实现限流，整合服务保护框架。

3. http请求处理业务逻辑如果比较耗时的情况下，容易造成客户端一直等待，阻塞等待
过程中会导致客户端超时发生重试策略，有可能会引发幂等性问题。

注意事项：接口是为http协议的情况下，最好不要处理比较耗时的业务逻辑，耗时的业务逻辑应该单独交给多线程或者是mq处理。

Mq应用场景有那些

1.  异步发送短信
2.  异步发送新人优惠券
3.  处理一些比较耗时的操作
4.  异步发送短信
5.  异步发送优惠券
6.  比较耗时操作

为什么需要使用mq
可以实现支撑高并发、异步解耦、流量削峰、降低耦合度。

同步发送http请求

客户端发送请求到达服务器端，服务器端实现会员注册业务逻辑，
1.insertMember() --插入会员数据  1s
2.sendSms()----发送登陆短信提醒 3s
3.sendCoupons()----发送新人优惠券  3s
总共响应需要6s时间，可能会导致客户端阻塞6s时间，对用户体验
不是很好。

多线程与MQ方式实现异步？

互联网项目:
客户端 安卓/IOS

服务器端：php/java
最好使用mq实现异步

多线程处理业务逻辑

用户向数据库中插入一条数据之后，在单独开启一个线程异步发送短信和优惠操作。
客户端只需要等待1s时间
优点：适合于小项目 实现异步
缺点：有可能会消耗服务器cpu资源资源
Mq处理业务逻辑

先向数据库中插入一条会员数据，让后再向MQ中投递一个消息，MQ服务器端在将消息推送给消费者异步解耦处理发送短信和优惠券。
Mq与多线程之间区别

MQ可以实现异步/解耦/流量削峰问题；
多线程也可以实现异步，但是消耗到cpu资源，没有实现解耦。

Mq消息中间件名词

Producer 生产者：投递消息到MQ服务器端；
Consumer  消费者：从MQ服务器端获取消息处理业务逻辑；
Broker   MQ服务器端
Topic 主题：分类业务逻辑发送短信主题、发送优惠券主题
Queue 存放消息模型 队列 先进先出 后进后出原则 数组/链表
Message 生产者投递消息报文：json

主流mq区别对比比

特性	ActiveMQ	RabbitMQ	RocketMQ	kafka
开发语言	java	erlang	java	scala
单机吞吐量	万级	万级	10万级	10万级
时效性	ms级	us级	ms级	ms级以内
可用性	高（主从架构）	高（主从架构）	非常高（分布式架构）	非常高（分布式架构）
功能特性	成熟的产品，在很多公司得到应用；有较多的文档；各种协议支持较好	基于erlang开发，所以并发能力很强，性能极其好，延时很低管理界面较丰富	MQ功能比较完备，扩展性佳	只支持主要的MQ功能，像一些消息查询，消息回溯等功能没有提供，毕竟是为大数据准备的，在大数据领域应用广。

Mq设计基础知识

多线程版本mq；
基于网络通讯版本mq netty实现

基于多线程队列简单实现mq
public class MayiktThreadMQ {
/**
* Broker
*/
private static LinkedBlockingDeque broker = new LinkedBlockingDeque();

```

public static void main(String[] args) {
// 创建生产者线程
Thread producer = new Thread(new Runnable() {
@Override
public void run() {
while (true) {
try {
Thread.sleep(1000);
JSONObject data = new JSONObject();
data.put("phone", "18611111111");
broker.offer(data);
} catch (Exception e) {

                }

            }
        }
    }, "生产者");
    producer.start();
    Thread consumer = new Thread(new Runnable() {
        @Override
        public void run() {
            while (true) {
                try {
                    JSONObject data = broker.poll();
                    if (data != null) {
                        System.out.println(Thread.currentThread().getName() + ",获取到数据:" + data.toJSONString());
                    }
                } catch (Exception e) {

                }
            }
        }
    }, "消费者");
    consumer.start();

}

```

}

基于netty实现mq
消费者netty客户端与nettyServer端MQ服务器端保持长连接，MQ服务器端保存
消费者连接。
生产者netty客户端发送请求给nettyServer端MQ服务器端，MQ服务器端在将该
消息内容发送给消费者。

body:{"msg":{"userId":"123456","age":"23"},"type":"producer"，”topic”:””}

生产者投递消息给MQ服务器端，MQ服务器端需要缓存该消息
如果mq服务器端宕机之后，消息如何保证不丢失

1. 持久化机制
如果mq接收到生产者投递消息，如果消费者不在的情况下，该消息是否会丢失？
不会丢失，消息确认机制 必须要消费者消费该消息成功之后，在通知给mq服务器端
删除该消息。
Mq服务器端将该消息推送消费者：
消费者已经和mq服务器保持长连接。
消费者主动拉取消息：
消费者第一次刚启动的时候

Mq如何实现抗高并发思想

Mq消费者根据自身能力情况 ，拉取mq服务器端消息消费。
默认的情况下是取出一条消息。

缺点：存在延迟的问题

需要考虑mq消费者提高速率的问题：

如何消费者提高速率：消费者实现集群、消费者批量获取消息即可。

Maven依赖

com.alibaba
fastjson
1.2.62

```

<dependency>
    <groupId>io.netty</groupId>
    <artifactId>netty-all</artifactId>
    <version>4.0.23.Final</version>
</dependency>
<dependency>
    <groupId>com.alibaba</groupId>
    <artifactId>fastjson</artifactId>
    <version>1.2.62</version>
</dependency>
<dependency>
    <groupId>org.apache.commons</groupId>
    <artifactId>commons-lang3</artifactId>
    <version>3.11</version>
</dependency>
```
RabbitMQ
RabbitMQ基本介绍
RabbitMQ是实现了高级消息队列协议（AMQP）的开源消息代理软件（亦称面向消息的中间件），RabbitMQ服务器是用Erlang语言编写的。
RabitMQ官方网站:
[https://www.rabbitmq.com/](https://www.rabbitmq.com/)

1.点对点(简单)的队列 2.工作(公平性)队列模式 3.发布订阅模式 4.路由模式 Routing 5.通配符模式 Topics
6.RPC
[https://www.rabbitmq.com/getstarted.html](https://www.rabbitmq.com/getstarted.html)
RabbitMQ 环境的基本安装

1.下载并安装 erlang,下载地址：[http://www.erlang.org/download](http://www.erlang.org/download) 2.配置 erlang 环境变量信息
新增环境变量 ERLANG_HOME=erlang 的安装地址
将%ERLANG_HOME%\bin 加入到 path 中 3.下载并安装 RabbitMQ，下载地址：[http://www.rabbitmq.com/download.html](http://www.rabbitmq.com/download.html)
注意: RabbitMQ 它依赖于 Erlang,需要先安装 Erlang。
[https://www.rabbitmq.com/install-windows.html](https://www.rabbitmq.com/install-windows.html)

Java
安装 RabbitMQ 环境步骤

配置 Erlang 环境变量：

如何启动 Rabbitmq

net start RabbitMQ

启动 Rabbitmq 常见问题
如果 rabbitmq 启动成功无法访问 管理平台页面

进入到 F:\path\rabbitmq\rabbitmq\rabbitmq_server-3.6.9\sbin>
执行
rabbitmq-plugins enable rabbitmq_management
rabbitmqctl start_app

Rabbitmq 管理平台中心

RabbitMQ 管理平台地址 [http://127.0.0.1:15672](http://127.0.0.1:15672)
默认账号:guest/guest   用户可以自己创建新的账号

Virtual Hosts:
像 mysql 有数据库的概念并且可以指定用户对库和表等操作的权限。那 RabbitMQ 呢？
RabbitMQ 也有类似的权限管理。在 RabbitMQ 中可以虚拟消息服务器 VirtualHost，每
个 VirtualHost 相当月一个相对独立的 RabbitMQ 服务器，每个 VirtualHost 之间是相互
隔离的。exchange、queue、message 不能互通。

默认的端口 15672：rabbitmq 管理平台端口号
默认的端口 5672： rabbitmq 消息中间内部通讯的端口
默认的端口号 25672  rabbitmq 集群的端口号

RabbitMQ 常见名词
/Virtual Hosts---分类
/队列 存放我们消息
Exchange 分派我们消息在那个队列存放起来 类似于 nginx

15672---rabbitmq 控制台管理平台 http 协议
25672rabbitmq 集群通信端口号
Amqp 5672 rabbitmq 内部通信的一个端口号

RabbitMQ 创建账户
RabbitMQ 平台创建 Virtual Hosts
RabbitMQ 平台创建消息队列

快速入门 RabbitMQ 简单队列

首先需要再 RabbitMQ 平台创建 Virtual Hosts 和队列。
/meiteVirtualHosts
----订单队列
----支付队列

1. 在 RabbitMQ 平台创建一个队列；
2. 在编写生产者代码
3. 在编写消费者代码

生产者
public class RabbitMQConnection {

```
/**
 * 获取连接
 *
 * @return
 */
public static Connection getConnection() throws IOException, TimeoutException {
    // 1.创建连接
    ConnectionFactory connectionFactory = new ConnectionFactory();
    // 2.设置连接地址
    connectionFactory.setHost("127.0.0.1");
    // 3.设置端口号:
    connectionFactory.setPort(5672);
    // 4.设置账号和密码
    connectionFactory.setUsername("yushengjun");
    connectionFactory.setPassword("123456");
    // 5.设置VirtualHost
    connectionFactory.setVirtualHost("/mayikt");
    return connectionFactory.newConnection();
}
```

}

public class Producer {
private static final String QUEUE_NAME = "mayikt";

```
public static void main(String[] args) throws IOException, TimeoutException {
    // 1.创建连接
    Connection connection = RabitMQConnection.getConnection();
    // 2.设置通道
    Channel channel = connection.createChannel();
    // 3.设置消息
    String msg = "每特教育第六期平均就业薪资破3万";
    System.out.println("msg:" + msg);
    channel.basicPublish("", QUEUE_NAME, null, msg.getBytes());
    channel.close();
    connection.close();
}
```

}

Maven 依赖

com.rabbitmq
amqp-client
3.6.5

消费者

public class Consumer {
private static final String QUEUE_NAME = "mayikt";

```
public static void main(String[] args) throws IOException, TimeoutException {
    // 1.创建连接
    Connection connection = RabitMQConnection.getConnection();
    // 2.设置通道
    Channel channel = connection.createChannel();
    DefaultConsumer defaultConsumer = new DefaultConsumer(channel) {
        @Override
        public void handleDelivery(String consumerTag, Envelope envelope, AMQP.BasicProperties properties, byte[] body) throws IOException {
            String msg = new String(body, "UTF-8");
            System.out.println("消费者获取消息:" + msg);
        }
    };
    // 3.监听队列
    channel.basicConsume(QUEUE_NAME, true, defaultConsumer);

}
```

}

RabbitMQ 如何保证消息不丢失

Mq 如何保证消息不丢失：

1.  生产者角色
    确保生产者投递消息到 MQ 服务器端成功。
    Ack 消息确认机制
    同步或者异步的形式
    方式 1：Confirms
    方式 2：事务消息
2.  消费者角色
    在 rabbitmq 情况下：
    必须要将消息消费成功之后，才会将该消息从 mq 服务器端中移除。
    在 kafka 中的情况下：
    不管是消费成功还是消费失败，该消息都不会立即从 mq 服务器端移除。
3.  Mq 服务器端 在默认的情况下 都会对队列中的消息实现持久化
    持久化硬盘。
4.  使用消息确认机制+持久技术
    A.消费者确认收到消息机制
    channel.basicConsume(QUEUE_NAME, false, defaultConsumer);
    注：第二个参数值为 false 代表关闭 RabbitMQ 的自动应答机制，改为手动应答。
    在处理完消息时，返回应答状态，true 表示为自动应答模式。
    channel.basicAck(envelope.getDeliveryTag(), false);
    B.生产者确认投递消息成功 使用 Confirm 机制 或者事务消息

Confirm 机制 同步或者是异步的形式

2.RabbitMQ 默认创建是持久化的

代码中设置 durable 为 true

参数名称详解：
durable 是否持久化 durable 为持久化、 Transient 不持久化
autoDelete 是否自动删除，当最后一个消费者断开连接之后队列是否自动被删除，可以通过 RabbitMQ Management，查看某个队列的消费者数量，当 consumers = 0 时队列就会自动删除 2. 使用 rabbitmq 事务消息；
channel.txSelect();
channel.basicPublish("", QUEUE_NAME, null, msg.getBytes());
//            int i = 1 / 0;
channel.txCommit();

相关核心代码
生产者
public class Producer {
private static final String QUEUE_NAME = "mayikt-queue";

```
public static void main(String[] args) throws IOException, TimeoutException, InterruptedException {
    //1.创建一个新连接
    Connection connection = RabbitMQConnection.getConnection();
    //2.设置channel
    Channel channel = connection.createChannel();
    //3.发送消息
    String msg = "每特教育6666";
```

channel.confirmSelect();

```
    channel.basicPublish("", QUEUE_NAME, null, msg.getBytes());
    boolean result = channel.waitForConfirms();
    if (result) {
        System.out.println("消息投递成功");
    } else {
        System.out.println("消息投递失败");
    }
    channel.close();
    connection.close();
}
```

}

消费者
public class Consumer {
private static final String QUEUE_NAME = "mayikt-queue";

```
public static void main(String[] args) throws IOException, TimeoutException, IOException, TimeoutException {
    // 1.创建连接
    Connection connection = RabbitMQConnection.getConnection();
    // 2.设置通道
    Channel channel = connection.createChannel();
    DefaultConsumer defaultConsumer = new DefaultConsumer(channel) {
        @Override
        public void handleDelivery(String consumerTag, Envelope envelope, AMQP.BasicProperties properties, byte[] body) throws IOException {
            String msg = new String(body, "UTF-8");
            System.out.println("消费者获取消息:" + msg);
            // 消费者完成 消费该消息
            channel.basicAck(envelope.getDeliveryTag(), false);
        }
    };
    // 3.监听队列
    channel.basicConsume(QUEUE_NAME, false, defaultConsumer);

}
```

}

RabbitMQ 五种消息模式

RabitMQ 工作队列
默认的传统队列是为均摊消费，存在不公平性；如果每个消费者速度不一样的情况下，均摊消费是不公平的，应该是能者多劳。

采用工作队列
在通道中只需要设置 basicQos 为 1 即可，表示 MQ 服务器每次只会给消费者推送 1 条消息必须手动 ack 确认之后才会继续发送。
channel.basicQos(1);
RabbitMQ 交换机类型

Direct exchange（直连交换机）
Fanout exchange（扇型交换机）
Topic exchange（主题交换机）
Headers exchange（头交换机）
/Virtual Hosts---区分不同的团队
----队列 存放消息
----交换机 路由消息存放在那个队列中 类似于 nginx
---路由 key 分发规则

RabbitMQ Fanout 发布订阅
生产者发送一条消息，经过交换机转发到多个不同的队列，多个不同的队列就多个不同的消费者。

原理：

1. 需要创建两个队列 ，每个队列对应一个消费者；
2. 队列需要绑定我们交换机
3. 生产者投递消息到交换机中，交换机在将消息分配给两个队列中都存放起来；
4. 消费者从队列中获取这个消息。

生产者代码
import com.mayikt.rabbitmq.RabbitMQConnection;
import com.rabbitmq.client.Channel;
import com.rabbitmq.client.Connection;

import java.io.IOException;
import java.util.concurrent.TimeoutException;

public class ProducerFanout {

```
/**
 * 定义交换机的名称
 */
private static final String EXCHANGE_NAME = "fanout_exchange";

public static void main(String[] args) throws IOException, TimeoutException {
    //  创建Connection
    Connection connection = RabbitMQConnection.getConnection();
    // 创建Channel
    Channel channel = connection.createChannel();
    // 通道关联交换机
    channel.exchangeDeclare(EXCHANGE_NAME, "fanout", true);
    String msg = "每特教育6666";
    channel.basicPublish(EXCHANGE_NAME, "", null, msg.getBytes());
    channel.close();
    connection.close();
}
```

}

消费者代码
邮件消费者
import com.mayikt.rabbitmq.RabbitMQConnection;
import com.rabbitmq.client.\*;

import java.io.IOException;
import java.util.concurrent.TimeoutException;

public class MailConsumer {
/\*\*

- 定义邮件队列
  \*/
  private static final String QUEUE_NAME = "fanout_email_queue";
  /\*\*
- 定义交换机的名称
  \*/
  private static final String EXCHANGE_NAME = "fanout_exchange";

```
public static void main(String[] args) throws IOException, TimeoutException {
    System.out.println("邮件消费者...");
    // 创建我们的连接
    Connection connection = RabbitMQConnection.getConnection();
    // 创建我们通道
    final Channel channel = connection.createChannel();
    // 关联队列消费者关联队列
    channel.queueBind(QUEUE_NAME, EXCHANGE_NAME, "");
    DefaultConsumer defaultConsumer = new DefaultConsumer(channel) {
        @Override
        public void handleDelivery(String consumerTag, Envelope envelope, AMQP.BasicProperties properties, byte[] body) throws IOException {
            String msg = new String(body, "UTF-8");
            System.out.println("邮件消费者获取消息:" + msg);
        }
    };
    // 开始监听消息 自动签收
    channel.basicConsume(QUEUE_NAME, true, defaultConsumer);

}
```

}

短信消费者

public class SmsConsumer {
/\*\*

- 定义短信队列
  \*/
  private static final String QUEUE_NAME = "fanout_email_sms";
  /\*\*
- 定义交换机的名称
  \*/
  private static final String EXCHANGE_NAME = "fanout_exchange";

```
public static void main(String[] args) throws IOException, TimeoutException {
    System.out.println("短信消费者...");
    // 创建我们的连接
    Connection connection = RabbitMQConnection.getConnection();
    // 创建我们通道
    final Channel channel = connection.createChannel();
    // 关联队列消费者关联队列
    channel.queueBind(QUEUE_NAME, EXCHANGE_NAME, "");
    DefaultConsumer defaultConsumer = new DefaultConsumer(channel) {
        @Override
        public void handleDelivery(String consumerTag, Envelope envelope, AMQP.BasicProperties properties, byte[] body) throws IOException {
            String msg = new String(body, "UTF-8");
            System.out.println("短信消费者获取消息:" + msg);
        }
    };
    // 开始监听消息 自动签收
    channel.basicConsume(QUEUE_NAME, true, defaultConsumer);

}
```

}

Direct 路由模式
当交换机类型为 direct 类型时，根据队列绑定的路由建转发到具体的队列中存放消息

生产者
消费者

Topic 主题模式
当交换机类型为 topic 类型时，根据队列绑定的路由建模糊转发到具体的队列中存放。 #号表示支持匹配多个词； \*号表示只能匹配一个词

SpringBoot 整合 RabbitMQ

Maven 依赖

org.springframework.boot
spring-boot-starter-parent
2.0.0.RELEASE

```
<!-- springboot-web组件 -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>
<!-- 添加springboot对amqp的支持 -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-amqp</artifactId>
</dependency>
<dependency>
    <groupId>org.apache.commons</groupId>
    <artifactId>commons-lang3</artifactId>
</dependency>
<!--fastjson -->
<dependency>
    <groupId>com.alibaba</groupId>
    <artifactId>fastjson</artifactId>
    <version>1.2.49</version>
</dependency>

<dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
</dependency>
```

配置类

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.FanoutExchange;
import org.springframework.amqp.core.Queue;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;

/\*\*

- [@ClassName ](/ClassName) RabbitMQConfig
- [@Author ](/Author) 蚂蚁课堂余胜军 QQ644064779 www.mayikt.com
- [@Version ](/Version) V1.0
  **/
  [@Component ](/Component)
  public class RabbitMQConfig {
  /**
  - 定义交换机
    \*/
    private String EXCHANGE_SPRINGBOOT_NAME = "/mayikt_ex";

/\*\*

- 短信队列
  \*/
  private String FANOUT_SMS_QUEUE = "fanout_sms_queue";
  /\*\*
- 邮件队列
  \*/
  private String FANOUT_EMAIL_QUEUE = "fanout_email_queue";

/\*\*

- 配置 smsQueue
-

- [@return ](/return)
  \*/
  [@Bean ](/Bean)
  public Queue smsQueue() {
  return new Queue(FANOUT_SMS_QUEUE);
  }

/\*\*

- 配置 emailQueue
-

- [@return ](/return)
  \*/
  [@Bean ](/Bean)
  public Queue emailQueue() {
  return new Queue(FANOUT_EMAIL_QUEUE);
  }

/\*\*

- 配置 fanoutExchange
-

- [@return ](/return)
  \*/
  [@Bean ](/Bean)
  public FanoutExchange fanoutExchange() {
  return new FanoutExchange(EXCHANGE_SPRINGBOOT_NAME);
  }

// 绑定交换机 sms
[@Bean ](/Bean)public Binding bindingSmsFanoutExchange(Queue smsQueue, FanoutExchange fanoutExchange) {
return BindingBuilder.bind(smsQueue).to(fanoutExchange);
}
// 绑定交换机 email
[@Bean ](/Bean)public Binding bindingEmailFanoutExchange(Queue emailQueue, FanoutExchange fanoutExchange) {
return BindingBuilder.bind(emailQueue).to(fanoutExchange);
}
}

配置文件
application.yml
spring:
rabbitmq: ####连接地址
host: 127.0.0.1 ####端口号
port: 5672 ####账号
username: guest ####密码
password: guest

### 地址

virtual-host: /meiteVirtualHosts

生产者
import org.springframework.amqp.core.AmqpTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/\*\*

- [@ClassName ](/ClassName) FanoutProducer
- [@Author ](/Author) 蚂蚁课堂余胜军 QQ644064779 www.mayikt.com
- [@Version ](/Version) V1.0
  **/
  [@RestController ](/RestController)
  public class FanoutProducer {
  [@Autowired ](/Autowired)
  private AmqpTemplate amqpTemplate;
  /**

  - 发送消息
  -

  - [@return ](/return)
    _/
    @RequestMapping("/sendMsg")
    public String sendMsg(String msg) {
    /\*\* - 1.交换机名称 - 2.路由 key 名称 - 3.发送内容
    _/
    amqpTemplate.convertAndSend("/mayikt_ex", "", msg);
    return "success";
    }
    }

消费者

import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitHandler;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

/\*\*

- [@ClassName ](/ClassName) FanoutEmailConsumer
- [@Author ](/Author) 蚂蚁课堂余胜军 QQ644064779 www.mayikt.com
- [@Version ](/Version) V1.0
  \*\*/
  [@Slf4j ](/Slf4j)
  [@Component ](/Component)
  [@RabbitListener(queues ](/RabbitListener(queues) = "fanout_email_queue")
  public class FanoutEmailConsumer {
  [@RabbitHandler ](/RabbitHandler)
  public void process(String msg) {
  log.info(">>邮件消费者消息 msg:{}<<", msg);
  }
  }

import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitHandler;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

/\*\*

- [@ClassName ](/ClassName) fanout_sms_queue
- [@Author ](/Author) 蚂蚁课堂余胜军 QQ644064779 www.mayikt.com
- [@Version ](/Version) V1.0
  \*\*/
  [@Slf4j ](/Slf4j)
  [@Component ](/Component)
  [@RabbitListener(queues ](/RabbitListener(queues) = "fanout_sms_queue")
  public class FanoutSmsConsumer {
  [@RabbitHandler ](/RabbitHandler)
  public void process(String msg) {
  log.info(">>短信消费者消息 msg:{}<<", msg);
  }
  }

生产者如何获取消费结果

1.  根据业务来定
    消费者消费成功结果： 1.能够在数据库中插入一条数据
2.  Rocketmq 自带全局消息 id，能够根据该全局消息获取消费结果
    原理： 生产者投递消息到 mq 服务器，mq 服务器端在这时候返回一个全局的消息 id，
    当我们消费者消费该消息成功之后，消费者会给我们 mq 服务器端发送通知标记该消息
    消费成功。
    生产者获取到该消息全局 id，每隔 2s 时间调用 mq 服务器端接口查询该消息是否
    有被消费成功。
3.  异步返回一个全局 id，前端使用 ajax 定时主动查询；
4.  在 rocketmq 中，自带根据消息 id 查询是否消费成功

RabbitMQ 实战解决方案

RabbitMQ 死信队列
死信队列产生的背景
RabbitMQ 死信队列俗称，备胎队列；消息中间件因为某种原因拒收该消息后，可以转移到死信队列中存放，死信队列也可以有交换机和路由 key 等。
产生死信队列的原因

1. 消息投递到 MQ 中存放 消息已经过期   消费者没有及时的获取到我们消息，消息如果存放到 mq 服务器中过期之后，会转移到备胎死信队列存放。
2. 队列达到最大的长度 （队列容器已经满了）
3. 消费者消费多次消息失败，就会转移存放到死信队列中

代码整合 参考 mayikt-springboot-rabbitmq|#中 order-dead-letter-queue 项目

死信队列的架构原理
死信队列和普通队列区别不是很大
普通与死信队列都有自己独立的交换机和路由 key、队列和消费者。
区别： 1.生产者投递消息先投递到我们普通交换机中，普通交换机在将该消息投到
普通队列中缓存起来，普通队列对应有自己独立普通消费者。 2.如果生产者投递消息到普通队列中，普通队列发现该消息一直没有被消费者消费
的情况下，在这时候会将该消息转移到死信（备胎）交换机中，死信（备胎）交换机
对应有自己独立的 死信（备胎）队列 对应独立死信（备胎）消费者。

死信队列应用场景
1.30 分钟订单超时设计
A. Redis 过期 key ：
B. 死信延迟队列实现：
采用死信队列，创建一个普通队列没有对应的消费者消费消息，在 30 分钟过后
就会将该消息转移到死信备胎消费者实现消费。
备胎死信消费者会根据该订单号码查询是否已经支付过，如果没有支付的情况下
则会开始回滚库存操作。

RabbitMQ 消息幂等问题
RabbitMQ 消息自动重试机制

1. 当我们消费者处理执行我们业务代码的时候，如果抛出异常的情况下
   在这时候 mq 会自动触发重试机制，默认的情况下 rabbitmq 是无限次数的重试。
   需要人为指定重试次数限制问题
2. 在什么情况下消费者需要实现重试策略？

A.消费者获取消息后，调用第三方接口，但是调用第三方接口失败呢？是否需要重试？
该情况下需要实现重试策略，网络延迟只是暂时调用不通，重试多次有可能会调用通。
数据库连接超时，可以进行重试，重试多次有可能会调用通。
B.
消费者获取消息后，因为代码问题抛出数据异常，是否需要重试？
该情况下是不需要实现重试策略，就算重试多次，最终还是失败的。
可以将日志存放起来，后期通过定时任务或者人工补偿形式。
如果是重试多次还是失败消息，需要重新发布消费者版本实现消费
可以使用死信队列

Mq 在重试的过程中，有可能会引发消费者重复消费的问题。
Mq 消费者需要解决 幂等性问题
幂等性 保证数据唯一

方式 1：
生产者在投递消息的时候，生成一个全局唯一 id，放在我们消息中。
Msg id=123456

Msg id=123456
Msg id=123456

消费者获取到我们该消息，可以根据该全局唯一 id 实现去重复。
全局唯一 id 根据业务来定的   订单号码作为全局的 id
实际上还是需要再 db 层面解决数据防重复。
业务逻辑是在做 insert 操作 使用唯一主键约束
业务逻辑是在做 update 操作 使用乐观锁

1. 当消费者业务逻辑代码中，抛出异常自动实现重试 （默认是无数次重试）
2. 应该对 RabbitMQ 重试次数实现限制，比如最多重试 5 次，每次间隔 3s；重试多次还是失败的情况下，存放到死信队列或者存放到数据库表中记录后期人工补偿
   如何合理选择消息重试
3. 消费者获取消息后，调用第三方接口，但是调用第三方接口失败呢？是否需要重试 ？
4. 消费者获取消息后，应该代码问题抛出数据异常，是否需要重试？

总结：如果消费者处理消息时，因为代码原因抛出异常是需要从新发布版本才能解决的，那么就不需要重试，重试也解决不了该问题的。存放到死信队列或者是数据库表记录、后期人工实现补偿。

Rabbitmq 如何开启重试策略

spring:
rabbitmq: ####连接地址
host: 127.0.0.1 ####端口号
port: 5672 ####账号
username: guest ####密码
password: guest

### 地址

virtual-host: /meite_rabbitmq
listener:
simple:
retry: ####开启消费者（程序出现异常的情况下会）进行重试
enabled: true ####最大重试次数
max-attempts: 5 ####重试间隔次数
initial-interval: 3000

消费者重试过程中，如何避免幂等性问题

重试的过程中，为了避免业务逻辑重复执行，建议提前全局 id 提前查询，如果存在
的情况下，就无需再继续做该流程。
重试的次数最好有一定间隔次数，在数据库底层层面保证数据唯一性，比如加上唯一 id。

SpringBoot 开启消息确认机制

配置文件新增
spring:
rabbitmq: ####连接地址
host: 127.0.0.1 ####端口号
port: 5672 ####账号
username: guest ####密码
password: guest

### 地址

virtual-host: /meiteVirtualHosts
listener:
simple:
retry: ####开启消费者（程序出现异常的情况下会）进行重试
enabled: true ####最大重试次数
max-attempts: 5 ####重试间隔次数
initial-interval: 3000
acknowledge-mode: manual
datasource:
url: jdbc:mysql://localhost:3306/test?useUnicode=true&characterEncoding=UTF-8
username: root
password: root
driver-class-name: com.mysql.jdbc.Driver

消费者 ack 代码

[@Slf4j ](/Slf4j)
[@Component ](/Component)
[@RabbitListener(queues ](/RabbitListener(queues) = "fanout_order_queue")
public class FanoutOrderConsumer {

```
@Autowired
private OrderManager orderManager;
@Autowired
private OrderMapper orderMapper;

@RabbitHandler
public void process(OrderEntity orderEntity, Message message, Channel channel) throws IOException {
```

//        try {
log.info(">>orderEntity:{}<<", orderEntity.toString());
String orderId = orderEntity.getOrderId();
if (StringUtils.isEmpty(orderId)) {
log.error(">>orderId is null<<");
return;
}
OrderEntity dbOrderEntity = orderMapper.getOrder(orderId);
if (dbOrderEntity != null) {
log.info(">>该订单已经被消费过，无需重复消费!<<");
// 无需继续重试
channel.basicAck(message.getMessageProperties().getDeliveryTag(), false);
return;
}
int result = orderManager.addOrder(orderEntity);

```
    log.info(">>插入数据库中数据成功<<");
    if (result >= 0) {
        // 开启消息确认机制
        channel.basicAck(message.getMessageProperties().getDeliveryTag(), false);
    }
```

//        int i = 1 / 0;
//        } catch (Exception e) {
//            // 将失败的消息记录下来，后期采用人工补偿的形式
//        }
}
}

#### 息确认机制

##### 配置文件新增

| ```xml
spring:

rabbitmq:

####连接地址

host: 127.0.0.1

    ####端口号

    port: 5672

    ####账号

    username: guest

    ####密码

    password: guest

    ### 地址

    virtual-host: /meiteVirtualHosts

    listener:

simple:

retry:

####开启消费者（程序出现异常的情况下会）进行重试

enabled: true

    ####最大重试次数

    max-attempts: 5

    ####重试间隔次数

    initial-interval: 3000

    acknowledge-mode: manual

    datasource:

    url: jdbc:mysql://localhost:3306/test?useUnicode=true&characterEncoding=UTF-8

username: root

    password: root

    driver-class-name: com.mysql.jdbc.Driver

````

 |
| --- |

##### 消费者ack代码

| ```java
@Slf4j

    @Component

    @RabbitListener(queues = "fanout_order_queue")

    public class FanoutOrderConsumer {



        @Autowired

        private OrderManager orderManager;

        @Autowired

        private OrderMapper orderMapper;



        @RabbitHandler

        public void process(OrderEntity orderEntity, Message message, Channel channel) throws IOException {

            //        try {

            log.info(">>orderEntity:{}<<", orderEntity.toString());

            String orderId = orderEntity.getOrderId();

            if (StringUtils.isEmpty(orderId)) {

                log.error(">>orderId is null<<");

                return;

            }

            OrderEntity dbOrderEntity = orderMapper.getOrder(orderId);

            if (dbOrderEntity != null) {

                log.info(">>该订单已经被消费过，无需重复消费!<<");

                // 无需继续重试

                channel.basicAck(message.getMessageProperties().getDeliveryTag(), false);

                return;

            }

            int result = orderManager.addOrder(orderEntity);



            log.info(">>插入数据库中数据成功<<");

            if (result >= 0) {

                // 开启消息确认机制

                channel.basicAck(message.getMessageProperties().getDeliveryTag(), false);

            }

            //        int i = 1 / 0;

            //        } catch (Exception e) {

            //            // 将失败的消息记录下来，后期采用人工补偿的形式

            //        }

        }

    }
````

| |
| |
