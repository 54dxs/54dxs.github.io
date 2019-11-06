## 一、本节引言：
在上一节中我们对Fragment进行了一个初步的了解，学习了概念，生命周期，Fragment管理与 Fragment事务，以及动态与静态加载Fragment。从本节开始我们会讲解一些Fragment在实际开发 中的一些实例！而本节给大家讲解的是底部导航栏的实现！而基本的底部导航栏方法有很多种， 比如全用TextView做，或者用RadioButton，又或者使用TabLayout + RadioButton，当然复杂 的情况还是得走外层套布局的方法！本节我们用TextView来做一个底部导航栏的效果，也熟悉 下Fragment的使用！好的，开始本节内容！


## 二、要实现的效果图以及工程目录结构：
先看看效果图吧：

![](../img/fragment-10.jpg)

接着看看我们的工程的目录结构：

![](../img/fragment-11.jpg)


## 三、实现流程：
### Step 1：写下底部选项的一些资源文件
我们从图上可以看到，我们底部的每一项点击的时候都有不同的效果是吧！ 我们是通过是否selected来判定的！我们要写的资源文件有：首先是图片，然后是文字，接着是背景！

图片Drawable资源：tab_menu_channel.xml
```xml
<?xml version="1.0" encoding="utf-8"?>
<selector xmlns:android="http://schemas.android.com/apk/res/android">
    <item android:drawable="@mipmap/tab_channel_pressed" android:state_selected="true" />
    <item android:drawable="@mipmap/tab_channel_normal" />
</selector>
```

其他三个照葫芦画瓢！

文字资源：tab_menu_text.xml
```xml
<?xml version="1.0" encoding="utf-8"?>
<selector xmlns:android="http://schemas.android.com/apk/res/android">
    <item android:color="@color/text_yellow" android:state_selected="true" />
    <item android:color="@color/text_gray" />
</selector>
```

背景资源：tab_menu_bg.xml
```xml
<?xml version="1.0" encoding="utf-8"?>
<selector xmlns:android="http://schemas.android.com/apk/res/android">
    <item android:state_selected="true">
        <shape>
            <solid android:color="#FFC4C4C4" />
        </shape>
    </item>
    <item>
        <shape>
            <solid android:color="@color/transparent" />
        </shape>
    </item>
</selector>
```

### Step 2：编写我们的Activity布局
activity_main.xml:
```xml
<RelativeLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    tools:context=".MainActivity">

    <RelativeLayout
        android:id="@+id/ly_top_bar"
        android:layout_width="match_parent"
        android:layout_height="48dp"
        android:background="@color/bg_topbar">

        <TextView
            android:id="@+id/txt_topbar"
            android:layout_width="match_parent"
            android:layout_height="match_parent"
            android:layout_centerInParent="true"
            android:gravity="center"
            android:textSize="18sp"
            android:textColor="@color/text_topbar"
            android:text="信息"/>


        <View
            android:layout_width="match_parent"
            android:layout_height="2px"
            android:background="@color/div_white"
            android:layout_alignParentBottom="true"/>

    </RelativeLayout>



    <LinearLayout
        android:id="@+id/ly_tab_bar"
        android:layout_width="match_parent"
        android:layout_height="56dp"
        android:layout_alignParentBottom="true"
        android:background="@color/bg_white"
        android:orientation="horizontal">

        <TextView
            android:id="@+id/txt_channel"
            android:layout_width="0dp"
            android:layout_height="match_parent"
            android:layout_weight="1"
            android:background="@drawable/tab_menu_bg"
            android:drawablePadding="3dp"
            android:drawableTop="@drawable/tab_menu_channel"
            android:gravity="center"
            android:padding="5dp"
            android:text="@string/tab_menu_alert"
            android:textColor="@drawable/tab_menu_text"
            android:textSize="16sp" />

        <TextView
            android:id="@+id/txt_message"
            android:layout_width="0dp"
            android:layout_height="match_parent"
            android:layout_weight="1"
            android:background="@drawable/tab_menu_bg"
            android:drawablePadding="3dp"
            android:drawableTop="@drawable/tab_menu_message"
            android:gravity="center"
            android:padding="5dp"
            android:text="@string/tab_menu_profile"
            android:textColor="@drawable/tab_menu_text"
            android:textSize="16sp" />

        <TextView
            android:id="@+id/txt_better"
            android:layout_width="0dp"
            android:layout_height="match_parent"
            android:layout_weight="1"
            android:background="@drawable/tab_menu_bg"
            android:drawablePadding="3dp"
            android:drawableTop="@drawable/tab_menu_better"
            android:gravity="center"
            android:padding="5dp"
            android:text="@string/tab_menu_pay"
            android:textColor="@drawable/tab_menu_text"
            android:textSize="16sp" />

        <TextView
            android:id="@+id/txt_setting"
            android:layout_width="0dp"
            android:layout_height="match_parent"
            android:layout_weight="1"
            android:background="@drawable/tab_menu_bg"
            android:drawablePadding="3dp"
            android:drawableTop="@drawable/tab_menu_setting"
            android:gravity="center"
            android:padding="5dp"
            android:text="@string/tab_menu_setting"
            android:textColor="@drawable/tab_menu_text"
            android:textSize="16sp"/>

    </LinearLayout>

    <View
        android:id="@+id/div_tab_bar"
        android:layout_width="match_parent"
        android:layout_height="2px"
        android:background="@color/div_white"
        android:layout_above="@id/ly_tab_bar"/>


    <FrameLayout
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        android:layout_below="@id/ly_top_bar"
        android:layout_above="@id/div_tab_bar"
        android:id="@+id/ly_content">

    </FrameLayout>

</RelativeLayout>
```

代码解析：

首先定义顶部标题栏的样式，48dp的LinearLayout中间加上一个TextView作为标题！
接着定义一个大小为56dp的LinerLayout对其底部，在这个里面加入四个TextView，比例1:1:1:1， 并且设置相关属性，接着在这个LinearLayout上加一条线段！
最后以标题栏和底部导航栏为边界，写一个FrameLayout，宽高match_parent，用做Fragment的容器！

PS：这里四个TextView属性是重复的，你也可以自行抽取出来，编写一个style，设置下~

### Step 3：隐藏顶部导航栏
意外发现以前的在Activity中调用`requestWindowFeature(Window.FEATURE_NO_TITLE)`;可以隐藏手机 自带顶部导航栏，但是写demo时候发现会报错，即使这句话写在了setContentView()之前！可能是因为 继承的是AppCompatActivity而非Activity类！
当然以前的getSupportActionbar().hide()隐藏掉Actionbar，但是他还是会在界面上！ 最后还有一种方法就是自己编写一个style，然后在AndroidManifest.xml中为Application设置这个Theme：

注： 把 requestWindowFeature(Window.FEATURE_NO_TITLE);放在super.onCreate(savedInstanceState);前面就可以隐藏ActionBar而不报错。

接着`AndroidManifest.xml`设置下theme属性：
```xml
android:theme="@style/Theme.AppCompat.NoActionBar"
```

PS：上述"良心代码"由好程序员曹神赞助~


### Step 4：创建一个Fragment的简单布局与类：
**fg_content.xml:**
```xml
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:orientation="vertical" android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:background="@color/bg_white">
    
    <TextView
        android:id="@+id/txt_content"
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        android:gravity="center"
        android:text="呵呵"
        android:textColor="@color/text_yellow"
        android:textSize="20sp"/>

</LinearLayout>
```

**MyFragment.java:**
```java
/**
 * Created by Coder-pig on 2015/8/28 0028.
 */
public class MyFragment extends Fragment {

    private String content;
    public MyFragment(String content) {
        this.content = content;
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fg_content,container,false);
        TextView txt_content = (TextView) view.findViewById(R.id.txt_content);
        txt_content.setText(content);
        return view;
    }
}
```

代码解析：

就是简单的重写了一个onCreateView()方法，其他方法可以按需重写!


### Step 5：编写MainActivity.java
先说说我们要考虑的一些关键问题：

- Fragment什么时候初始化和add到容器中？什么时候hide和show？
- 如何让TextView被选中？选中一个TextView后，要做一些什么操作？
- 刚进入MainActivity怎么样让一个TextView处于Selected的状态？

嗯，接下来一一解答上面这些问题：

- 我们选中TextView后对对应的Fragment进行判空，如果为空，初始化，并添加到容器中； 而hide的话，我们定义一个方法hide所有的Fragment，每次触发点击事件就先调用这个hideAll方法， 讲所有Fragment隐藏起来，然后如果TextView对应的Fragment不为空，我们就将这个Fragment显示出来；
- 这个我们通过点击事件来实现，点击TextView后先重置所有TextView的选中状态为false，然后设置点击的 TextView的选中状态为true；
- 这个更简单，我们是通过点击事件来设置选中的，那么在onCreate()方法里加个触发点击事件的 方法不就可以了嘛~ `txt_channel.performClick()`;

逻辑都弄懂了，直接上代码咯：

**MainActivity.java:**
```java
/**
 * Created by Coder-pig on 2015/8/28 0028.
 */
public class MainActivity extends AppCompatActivity implements View.OnClickListener{

    //UI Object
    private TextView txt_topbar;
    private TextView txt_channel;
    private TextView txt_message;
    private TextView txt_better;
    private TextView txt_setting;
    private FrameLayout ly_content;

    //Fragment Object
    private MyFragment fg1,fg2,fg3,fg4;
    private FragmentManager fManager;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        requestWindowFeature(Window.FEATURE_NO_TITLE);
        setContentView(R.layout.activity_main);
        fManager = getFragmentManager();
        bindViews();
        txt_channel.performClick();   //模拟一次点击，既进去后选择第一项
    }

    //UI组件初始化与事件绑定
    private void bindViews() {
        txt_topbar = (TextView) findViewById(R.id.txt_topbar);
        txt_channel = (TextView) findViewById(R.id.txt_channel);
        txt_message = (TextView) findViewById(R.id.txt_message);
        txt_better = (TextView) findViewById(R.id.txt_better);
        txt_setting = (TextView) findViewById(R.id.txt_setting);
        ly_content = (FrameLayout) findViewById(R.id.ly_content);

        txt_channel.setOnClickListener(this);
        txt_message.setOnClickListener(this);
        txt_better.setOnClickListener(this);
        txt_setting.setOnClickListener(this);
    }

    //重置所有文本的选中状态
    private void setSelected(){
        txt_channel.setSelected(false);
        txt_message.setSelected(false);
        txt_better.setSelected(false);
        txt_setting.setSelected(false);
    }

    //隐藏所有Fragment
    private void hideAllFragment(FragmentTransaction fragmentTransaction){
        if(fg1 != null)fragmentTransaction.hide(fg1);
        if(fg2 != null)fragmentTransaction.hide(fg2);
        if(fg3 != null)fragmentTransaction.hide(fg3);
        if(fg4 != null)fragmentTransaction.hide(fg4);
    }


    @Override
    public void onClick(View v) {
        FragmentTransaction fTransaction = fManager.beginTransaction();
        hideAllFragment(fTransaction);
        switch (v.getId()){
            case R.id.txt_channel:
                setSelected();
                txt_channel.setSelected(true);
                if(fg1 == null){
                    fg1 = new MyFragment("第一个Fragment");
                    fTransaction.add(R.id.ly_content,fg1);
                }else{
                    fTransaction.show(fg1);
                }
                break;
            case R.id.txt_message:
                setSelected();
                txt_message.setSelected(true);
                if(fg2 == null){
                    fg2 = new MyFragment("第二个Fragment");
                    fTransaction.add(R.id.ly_content,fg2);
                }else{
                    fTransaction.show(fg2);
                }
                break;
            case R.id.txt_better:
                setSelected();
                txt_better.setSelected(true);
                if(fg3 == null){
                    fg3 = new MyFragment("第三个Fragment");
                    fTransaction.add(R.id.ly_content,fg3);
                }else{
                    fTransaction.show(fg3);
                }
                break;
            case R.id.txt_setting:
                setSelected();
                txt_setting.setSelected(true);
                if(fg4 == null){
                    fg4 = new MyFragment("第四个Fragment");
                    fTransaction.add(R.id.ly_content,fg4);
                }else{
                    fTransaction.show(fg4);
                }
                break;
        }
        fTransaction.commit();
    }
}
```


## 四、代码下载：
**FragmentDemo.zip**：[FragmentDemo.zip 下载](../img/FragmentDemo.zip)**声明**：图片素材来自App：**better**，本代码只做演示，并无用于商业用途！


## 五、本节小结
本节给大家讲解了如何使用一个LinarLayout + 四个TextView 实现一个底部导航栏以及 Fragment add，hide，show的逻辑~还是蛮简单的，最后要感谢小猪秘密基地的基神，B神， 还有好程序员曹神给我的一些指点！万分感谢，仅以此篇纪念小猪重返装逼界，嗯，重 返应用层，嘿嘿，本节就到这里，谢谢~