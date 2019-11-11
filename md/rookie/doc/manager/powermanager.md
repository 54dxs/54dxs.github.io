## 一、本节引言：
本节要讲解的是Android为我们提供的系统服务中的——PowerManager(电源服务)，用于 管理CPU运行，键盘或屏幕亮起来；不过，除非迫不得已，否则进来别去使用这个类，假如 你使用以后，一定要及时释放！本节并不会太深入滴去讲解这B，因为这涉及到底层的一些 东西，以后需要用到在深入研究~本节主要介绍的是一些基本的概念，PowerManager，wakelock 锁的机制等！

官方API文档：PowerManager


## 二、PowerManager是什么
Android系统为我们提供的电源管理的一个API，其相关接口与设备电池的续航能力有很大的关联， 官方也说了，除非是迫不得已吧，不然的话，应该尽量避免使用这个类，并且使用完以后一定要及时释放!

所谓的电源管理包括:CPU运行，键盘或者屏幕亮起来!核心其实就是wakelock锁机制，只要我们拿着这个锁， 那么系统就无法进入休眠状态，可以给用户态程序或内核获取到！锁可以是:"有超时的"或者 "没有超时"，超时的锁到时间后会自动解锁，如果没有了锁或超时,内核会启动休眠机制来进入休眠!


## 三、wakelock锁介绍
PowerManager.WakeLock有加锁与解锁两种状态，而加锁的形式有两种:

①永久锁住，这种锁除非显式的放开，否则是不会解锁的，所以用起来需要非常小心！

②超时锁，到时间后就会解锁，而创建WakeLock后，有两种加锁机制: ①不计数锁机制，②计数锁机制(默认) 可通过setReferenceCounted(boolean value)来指定,区别在于: 前者无论acquire( )多少次，一次release( )就可以解开锁。 而后者则需要(--count == 0)的时候，同样当(count == 0)才会去申请锁 所以，WakeLock的计数机制并不是正真意义上对每次请求进行申请/释放一个锁; 只是对同一把锁被申请/释放的次数来进行统计，然后再去操作！

ps:关于更加深入的内容就涉及到底层的内容了，笔者水平有限，还没到那个level， 这里就不深入研究了，就说一些基本的吧，以后有需要的话，再另开一篇吧~


## 四、PowerManager怎么用
```java
PowerManager pm = (PowerManager) getSystemService(Context.POWER_SERVICE);
PowerManager.WakeLock w1 = pm.newWakeLock(PowerManager.SCREEN_DIM_WAKE_LOCK, "MyTag");
w1.acquire();
//在这个过程,屏幕会保持光亮!
w1.release();
```

上述newWakeLock( )的第一个flag标记，这些标记不同程度的影响系统电源.

这些标记都是独占的，并且每次只能指定其中一个。

- PARTIAL_WAKE_LOCK:保持CPU 运转，屏幕和键盘灯有可能是关闭的。

- SCREEN_DIM_WAKE_LOCK：保持CPU 运转，允许保持屏幕显示但有可能是灰的，允许关闭键盘灯

- SCREEN_BRIGHT_WAKE_LOCK：保持CPU 运转，允许保持屏幕高亮显示，允许关闭键盘灯

- FULL_WAKE_LOCK：保持CPU 运转，保持屏幕高亮显示，键盘灯也保持亮度

ps:如果你使用的是局部唤醒锁的话（使用PARTIAL_WAKE_LOCK标志），CPU会继续运行， 将忽略任何的计时器，甚至按下电源按钮。其他的唤醒锁话，CPU也会继续运转，但是使用者仍 然可以按电源按钮让设备睡眠。另外，你可以使用两个以上的标记，但是他只影响屏幕的行为。 和 PARTIAL_WAKE_LOCK 同时使用的话，没有任何影响。

屏幕解锁参数：

- ACQUIRE_CAUSES_WAKEUP：正常唤醒锁实际上并不打开照明。相反，一旦打开他们会一直仍然 保持(例如来世user的activity)。当获得wakelock，这个标志会使屏幕或/和键盘立即打开。

一个典型的使用就是可以立即看到那些对用户重要的通知。

- ON_AFTER_RELEASE：设置了这个标志，当wakelock释放时用户activity计时器会被重置，导致照明 持续一段时间。如果你在wacklock条件中循环，这个可以用来降低闪烁


## 五、需要的权限
要进行电源的操作需要在AndroidManifest.xml中声明该应用有设置电源管理的权限：
```xml
<uses-permission android:name="android.permission.WAKE_LOCK"/>
```

你可能还需要：
```xml
<uses-permission android:name="android.permission.DEVICE_POWER"/>
```

另外WakeLock的设置是Activity级别的，而不是针对整个Application应用的！


## 六、本节小结：
好的，本节介绍了PowerManager(电源服务)，不过仅仅是科普一下而已，内容也说了 不到迫不得已尽量别使用这个类~看懂了，或者没看懂都没关系，知道下即可！