> 现在主流的Android开发环境有: ①Eclipse + ADT + SDK ②Android Studio + SDK ③IntelliJ IDEA + SDK 现在国内大部分开发人员还是使用的Eclipse，而谷歌宣布不再更新ADT后，并且官网也去掉了集成Android开发环境的Eclipse下载链接，各种现象都表示开发者最后都终将过渡到Android Studio，当然这段过渡时间会很长，但如果你是刚学Android的话建议直接冲Android Studio着手；而且很多优秀的开源项目都是基于Android Studio！当然，在本教程中对两种开发环境都会进行一个介绍，用哪个取决与你自己~ 还有一个IntelliJ，和Android Studio差不多的，并不对此进行讲解！


## 一、JDK安装与配置
**Step 1:下载JDK** 可以到官网进行下载： [Jdk官方下载](https://www.oracle.com/technetwork/java/javase/downloads/index-jsp-138363.html) 也可到笔者网盘下载： [笔者网盘]() PS:这个随便下一个都可以，关系不大，32位的只能下32位哦！

**Step 2:JDK安装** 傻瓜式的下一步即可！

**Step 3:环境变量的配置** 配置环境变量是为了方便我们一些命令行的操作，后续会用到！ 
**右键我的电脑——>高级——>环境变量**

![Java环境变量配置1](../img/ready-5.jpg) 

**新建JAVA_HOME**

![新建JAVA_HOME](../img/ready-6.jpg) 

**修改PATH变量，别把原本的东西删掉！！！！** 

![修改PATH变量 新建CLASSPATH](../img/ready-7.jpg)

**新建CLASSPATH**

![](../img/ready-8.jpg)

**验证环境是否配置完成** 打开电脑的cmd(命令行)，win键 + R输入cmd，然后在命令行依次javac和java，出现如图效果表示配置完成： 

![此处输入图片的描述](../img/ready-9.jpg)


## 二、开发工具二选一
一开始也说了开发环境IDE的现状，另外前面忘记说一点:Android Studio是比较吃配置的，如果电脑不怎么好，建议还是先使用Eclipse进行Android开发，下面先说下我们熟悉IDE开发APP的流程，按照下述流程来熟悉IDE的使用：

![熟悉IDE开发APP的流程](../img/ready-10.jpg)

然后下面两个选一个，开始我们的Android开发之路吧！

**Eclipse + ADT + SDK： Android Studio + SDK：**


## 三、相关术语的解析
1. **Dalvik：** Android特有的虚拟机,和JVM不同,Dalvik虚拟机非常适合在移动终端上使用!
2. **AVD：** (android virtual machine):安卓虚拟设备,就是安卓的模拟器
3. **ADT：** (android development tools)安卓开发工具
4. **SDK：** (software development kit)软件开发工具包,就是安卓系统,平台架构等的工具集合,如adb.exe
5. **DDMS：** (dalvik debug monitor service)安卓调试工具
6. **adb：** 安卓调试桥,在sdk的platform-tools目录下,功能很多,命令行必备
7. **DX工具：** 将.class转换成.dex文件
8. **AAPT：** (android asset packing tool),安卓资源打包工具
9. **R.java文件：** 由aapt工具根据App中的资源文件自动生成,可以理解为资源字典
10. **AndroidManifest.xml：** app包名 + 组件声明 + 程序兼容的最低版本 + 所需权限等程序的配置文件

后续内容对于初学者的你可能有点难度，但后面回头，你会发现这些东西很有用~ 看不懂的话，可以先跳过


## 四、.ADB命令行的一些指令
执行ADB指令之前我们还需要为我们的SDK配置一下环境变量
**Step 1:** 新建一个ANDROID_HOME的环境变量，把sdk根目录地址贴上去：

![](../img/ready-11.jpg)

**Step 2:** 更新Path环境变量，在Paht开头加上： **%ANDROID_HOME%\tools;** 即可 配置完了，接下来就来学习指令了： 常用ADB指令

![](../img/ready-12.jpg)


## 五、APP程序打包与安装的流程：

![APP程序打包与安装的流程](../img/ready-13.jpg)


## 六、APP的安装过程：
![APP的安装过程](../img/ready-14.jpg)


## 七、本节小结
本节我们对Android开发IDE的现状进行了分析，建议初学者硬件条件允许的话，使用Android Studio来进行Android APP的开发，讲述了JDK的安装与配置，以及熟悉IDE的流程，一些关键名称的解析，ADB命令行的常用指令，最后还有程序的打包安装和安装过程的解析！经过这章相信大家对Android开发有了个简单了解，了解开发一个程序的流程，以及对应的项目目录结构！相信大家会抱怨模拟器AVD跑得很慢，下节会给大家介绍一个比真机还快的Android模拟器——Genymotion的安装使用！