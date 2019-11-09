## 一、本节引言：
本节给大家带来Socket的最后一节：基于UDP协议的Socket通信，在第一节中我们已经详细地 比较了两者的区别，TCP和UDP最大的区别在于是否需要客户端与服务端建立连接后才能进行 数据传输，如果你学了前两节TCP的，传输前先开服务端，accept，等客户端接入，然后获得 客户端socket然后进行IO操作，而UDP则不用，UDP以数据报作为数据的传输载体，在进行传输时 首先要把传输的数据定义成数据报(Datagram)，在数据报中指明数据要到达的Socket(主机地址 和端口号)，然后再将数据以数据报的形式发送出去，然后就没有然后了，服务端收不收到我就 不知道了，除非服务端收到后又给我回一段确认的数据报~时间关系就不另外写Android例子了 直接上Java代码~


## 二、服务端实现步骤：
- `Step 1`：创建DatagramSocket，指定端口号
- `Step 2`：创建DatagramPacket
- `Step 3`：接收客户端发送的数据信息
- `Step 4`：读取数据

示例代码：
```java
public class UPDServer {
    public static void main(String[] args) throws IOException {
        /*
         * 接收客户端发送的数据
         */
        // 1.创建服务器端DatagramSocket，指定端口
        DatagramSocket socket = new DatagramSocket(12345);
        // 2.创建数据报，用于接收客户端发送的数据
        byte[] data = new byte[1024];// 创建字节数组，指定接收的数据包的大小
        DatagramPacket packet = new DatagramPacket(data, data.length);
        // 3.接收客户端发送的数据
        System.out.println("****服务器端已经启动，等待客户端发送数据");
        socket.receive(packet);// 此方法在接收到数据报之前会一直阻塞
        // 4.读取数据
        String info = new String(data, 0, packet.getLength());
        System.out.println("我是服务器，客户端说：" + info);

        /*
         * 向客户端响应数据
         */
        // 1.定义客户端的地址、端口号、数据
        InetAddress address = packet.getAddress();
        int port = packet.getPort();
        byte[] data2 = "欢迎您!".getBytes();
        // 2.创建数据报，包含响应的数据信息
        DatagramPacket packet2 = new DatagramPacket(data2, data2.length, address, port);
        // 3.响应客户端
        socket.send(packet2);
        // 4.关闭资源
        socket.close();
    }
}
```


## 三、客户端实现步骤：
- `Step 1`：定义发送信息
- `Step 2`：创建DatagramPacket，包含将要发送的信息
- `Step 3`：创建DatagramSocket
- `Step 4`：发送数据
```java
public class UDPClient {
    public static void main(String[] args) throws IOException {
        /*
         * 向服务器端发送数据
         */
        // 1.定义服务器的地址、端口号、数据
        InetAddress address = InetAddress.getByName("localhost");
        int port = 8800;
        byte[] data = "用户名：admin;密码：123".getBytes();
        // 2.创建数据报，包含发送的数据信息
        DatagramPacket packet = new DatagramPacket(data, data.length, address, port);
        // 3.创建DatagramSocket对象
        DatagramSocket socket = new DatagramSocket();
        // 4.向服务器端发送数据报
        socket.send(packet);

        /*
         * 接收服务器端响应的数据
         */
        // 1.创建数据报，用于接收服务器端响应的数据
        byte[] data2 = new byte[1024];
        DatagramPacket packet2 = new DatagramPacket(data2, data2.length);
        // 2.接收服务器响应的数据
        socket.receive(packet2);
        // 3.读取数据
        String reply = new String(data2, 0, packet2.getLength());
        System.out.println("我是客户端，服务器说：" + reply);
        // 4.关闭资源
        socket.close();
    }
}
```


## 四、本节小结：
本节内容比较简单，无非就是将数据转换为字节，然后放到DatagramPacket(数据报包中)，发送的 时候带上接受者的IP地址和端口号，而接收时，用一个字节数组来缓存！发送的时候需要创建一个 DatagramSocket(端到端通信的类)对象，然后调用send方法给接受者发送数据报包~ 本节代码来源于慕客网上的一个JavaSocket教程~有兴趣的可以看看： [Java Socket应用---通信是这样练成的](http://www.imooc.com/learn/161)
