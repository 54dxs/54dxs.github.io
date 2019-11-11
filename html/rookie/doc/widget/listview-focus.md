## 一、本节引言
如果你往ListView的Item中添加了Button，CheckBox，EditText等控件的话，你可能需要考虑 到一个问题：ListView的一个焦点问题！本节我们就来学习下解决这个问题的几个方法！

我们可以写个简答的listView，上面有一个Button，CheckBox，EditText，但是当我们点击发现， ListView的item点击不了，触发不了onItemClick的方法，也触发不了onItemLongClick方法， 这个就是ListView的一个焦点问题了！就是ListView的焦点被其他控件抢了，下面我们来看看如何 解决这个问题？


## 二、方法1：为抢占了控件的组件设置:android:focusable="false"
如题，只需为抢占了ListView Item焦点的控件设置android:focusable="false"即可解决这个问题 或者在代码中获得控件后调用：setFocusable(false) !!另外，EditText却不行，如果我们设置了android:focusable="false"，这B可以获取焦点但是一下子 又失去了焦点，而且也不会弹出小键盘，暂不知道如何解决，听别人说是ListView的一个bug，如果 有知道解决方法的欢迎告知下，谢谢~


## 三、方法2：item根节点设置android:descendantFocusability="blocksDescendants"
如题，在Item布局的根节点添加上述属性，android:descendantFocusability="blocksDescendants" 即可，另外该属性有三个可供选择的值：

- `beforeDescendants：viewgroup`会优先其子类控件而获取到焦点
- `afterDescendants：viewgroup`只有当其子类控件不需要获取焦点时才获取焦点
- `blocksDescendants：viewgroup`会覆盖子类控件而直接获得焦点


## 四、本节小结：
好的，以上就是解决ListView焦点问题的两个方法，非常简单，如果有关于EditText 焦点问题解决方案的欢迎提出，谢谢~