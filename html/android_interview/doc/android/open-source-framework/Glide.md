## 一、Glide

原文链接：[https://blog.csdn.net/sinyu890807/article/category/9268670](https://blog.csdn.net/sinyu890807/article/category/9268670)

现在Android上的图片加载框架非常成熟，从最早的老牌图片加载框架UniversalImageLoader，到后来Google推出的Volley，再到后来的新兴军Glide和Picasso，当然还有Facebook的Fresco。每一个都非常稳定，功能也都十分强大。但是它们的使用场景基本都是重合的，也就是说我们基本只需要选择其中一个来进行学习和使用就足够了，每一个框架都尝试去掌握的话则有些浪费时间。

在这几个框架当中，我对Volley和Glide研究得比较深入，对UniversalImageLoader、Picasso和Fresco都只是有一些基本的了解。从易用性上来讲，Glide和Picasso应该都是完胜其他框架的，这两个框架都实在是太简单好用了，大多数情况下加载图片都是一行代码就能解决的，而UniversalImageLoader和Fresco则在这方面略逊一些。

那么再拿Glide和Picasso对比呢，首先这两个框架的用法非常相似，但其实它们各有特色。Picasso比Glide更加简洁和轻量，Glide比Picasso功能更为丰富。之前已经有人对这两个框架进行过全方面的对比，大家如果想了解更多的话可以去参考一下 [这篇文章](http://www.jcodecraeer.com/a/anzhuokaifa/androidkaifa/2015/0327/2650.html) 。

总之，没有最好的框架，只有最适合自己的框架。经过多方面对比之后，我还是决定选择了Glide来进行研究，并且这也是Google官方推荐的图片加载框架。

说实话，关于Glide的文章我已经筹备了好久，去年这个时候本来就打算要写了，但是一直都没有动笔。因为去年我的大部分时间都放在了写[《第二行代码》](http://blog.csdn.net/guolin_blog/article/details/52032038)上面，只能用碎片时间来写写博客，但是Glide的难度远超出了我用碎片时间所能掌握的难度。当然，这里我说的是对它的源码进行解析的难度，不是使用上的难度，Glide的用法是很简单的。所以，我觉得去年我写不好Glide这个题材的文章，也就一直拖到了今年。

而现在，我花费了大量的精力去研究Glide的源码和各种用法，相信现在已经可以将它非常好地掌握了，因此我准备将我掌握的这些知识整理成一个新的系列，帮忙大家更好地学习Glide。这个Glide系列大概会有8篇左右文章，预计花半年时间写完，将会包括Glide的基本用法、源码解析、高级用法、功能扩展等内容，可能会是目前互联网上最详尽的Glide教程。


## 二、目录

- [Android图片加载框架最全解析（一），Glide的基本用法](glide/Glide-1.md)
- [Android图片加载框架最全解析（二），从源码的角度理解Glide的执行流程](glide/Glide-2.md)
- [Android图片加载框架最全解析（三），深入探究Glide的缓存机制](glide/Glide-3.md)
- [Android图片加载框架最全解析（四），玩转Glide的回调与监听](glide/Glide-4.md)
- [Android图片加载框架最全解析（五），Glide强大的图片变换功能](glide/Glide-5.md)
- [Android图片加载框架最全解析（六），探究Glide的自定义模块功能](glide/Glide-6.md)
- [Android图片加载框架最全解析（七），实现带进度的Glide图片加载功能](glide/Glide-7.md)
- [Android图片加载框架最全解析（八），带你全面了解Glide 4的用法](glide/Glide-8.md)

