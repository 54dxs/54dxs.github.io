## 一、本节引言
告别了第一章，迎来第二章——Android中的UI（User Interface）组件的详解， 而本节我们要学习的是所有控件的父类View和ViewGroup类！突发奇想，直接翻译官方文档对 这两个东西的介绍吧，对了，天朝原因，google上不去，Android developer上不去，我们可以 改hosts或者用科学上网，当然也可以像笔者一样使用国内的API镜像，这里分享个吧： http://androiddoc.qiniudn.com/guide/topics/ui/overview.html 这个镜像是5.0的API！


## 二、UI Overview
在Android APP中，所有的用户界面元素都是由View和ViewGroup的对象构成的。View是绘制在屏幕上的用户能与之交互的一个对象。而ViewGroup则是一个用于存放其他View（和ViewGroup）对象的布局容器！ Android为我们提供了一个View和ViewGroup子类的集合，集合中提供了一些常用的输入控件(比如按钮和文本域)和各种各样的布局模式（比如线性或相对布局）


## 三、User Interface Layout
你的APP的用户界面上的每一个组件都是使用View和ViewGroup对象的层次结构来构成的，比如 图 1。每个ViewGroup都是要给看不见的用于组织子View的容器，而它的子View可能是输入控件 或者在UI上绘制了某块区域的小部件。有了层次树，你就可以根据自己的需要，设计简单或者复 杂的布局了(布局越简单性能越好)

![](../img/widget-1.jpg)

 图 1.一个UI布局的层次结构的插图

定义你的布局，你可以在代码中实例化View对象并且开始构建你的树，但最容易和最高效的方式来定义你的布局则是使用一个XML文件，用XML来构成布局更加符合人的阅读习惯，而XML类似与HTML 使用XML元素的名称代表一个View。所以< TextView >元素会在你的界面中创建一个TextView控件，而一个< LinearLayout >则会创建一个LinearLayout的容器！ 举个例子，一个简单简单的垂直布局上面有一个文本视图和一个按钮，就像下面这样：

```xml
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
              android:layout_width="fill_parent" 
              android:layout_height="fill_parent"
              android:orientation="vertical" >
    <TextView android:id="@+id/text"
              android:layout_width="wrap_content"
              android:layout_height="wrap_content"
              android:text="I am a TextView" />
    <Button android:id="@+id/button"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:text="I am a Button" />
</LinearLayout>
```

当你的App加载上述的布局资源的时候，Android会将布局中的每个节点进行实例化成一个个对象，然后你可以为这些定义一些额外的行为，查询对象的状态，或者修改布局。 完整创建UI布局的引导，请参考XML Layouts


## 四、User Interface Components
你无需全部用View和ViewGroup对象来创建你的UI布局。Android给我们提供了一些app控件，标准的UI布局，你只需要定义内容。这些UI组件都有其属性介绍的API文档，比如操作栏，对话框和状态通知栏等。


## 五、本节小结
好吧，翻译可能比较拗口，哎，英语盲尽力了，简单归纳下上述内容：

> Android里的图形界面都是由View和ViewGroup以及他们的子类构成的： View：所有可视化控件的父类,提供组件描绘和时间处理方法 ViewGroup： View类的子类，可以拥有子控件,可以看作是容器 Android UI中的控件都是按照这种层次树的结构堆叠得，而创建UI布局的方式有两种， 自己在Java里写代码或者通过XML定义布局，后者显得更加方便和容易理解！ 也是我们最常用的手段！另外我们一般很少直接用View和ViewGroup来写布局，更多的 时候使用它们的子类控件或容器来构建布局！

恩呢，对View和ViewGroup有个大概了解即可，平时我们是不会直接用的，一般是自定义View的时候 才会使用这两个东西！