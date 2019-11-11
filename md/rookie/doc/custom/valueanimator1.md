## 一、本节引言：
本节给带来的是Android动画中的第三种动画——属性动画(Property Animation)， 记得在上一节[9.4.2 Android动画合集之补间动画](../custom/tween.html)为Fragment 设置过渡动画的时候，说过，App包和V4包下的Fragment调用setCustomAnimations()对应的 动画类型是不一样的，v4包下的是Animation，而app包下的是Animator；

Animation一般动画就是我们前面学的帧动画和补间动画！Animator则是本节要讲的属性动画！

关于属性动画，大牛郭大叔已经写了三篇非常好的总结文，写得非常赞，就没必要重复造轮子了， 不过这里还是过一遍，大部分内容参考的下面三篇文章：

[Android属性动画完全解析(上)，初识属性动画的基本用法](http://blog.csdn.net/guolin_blog/article/details/43536355)

[Android属性动画完全解析(中)，ValueAnimator和ObjectAnimator的高级用法](http://blog.csdn.net/guolin_blog/article/details/43816093)

[Android属性动画完全解析(下)，Interpolator和ViewPropertyAnimator的用法](http://blog.csdn.net/guolin_blog/article/details/44171115)

写的非常好，或者说你可以直接跳过本文去看上面的三篇文章~

当然，你愿意看我叨叨逼的话，也很欢迎，好了，开始本节内容吧~


## 二、属性动画概念叨叨逼
不BB，直接上图，就是这么暴力~

![](../img/custom-156.jpg)


## 三、ValueAnimator简单使用
使用流程：

1. 调用ValueAnimator的ofInt()，ofFloat()或ofObject()静态方法创建ValueAnimator实例
2. 调用实例的setXxx方法设置动画持续时间，插值方式，重复次数等
3. 调用实例的addUpdateListener添加AnimatorUpdateListener监听器，在该监听器中 可以获得ValueAnimator计算出来的值，你可以值应用到指定对象上~
4. 调用实例的start()方法开启动画！ 另外我们可以看到ofInt和ofFloat都有个这样的参数：float/int... values代表可以多个值！

使用示例：

![](../img/custom-157.jpg)

代码实现：

布局文件：activity_main.xml，非常简单，四个按钮，一个ImageView
```xml
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:id="@+id/ly_root"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:orientation="vertical">

    <Button
        android:id="@+id/btn_one"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="动画1" />

    <Button
        android:id="@+id/btn_two"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="动画2" />

    <Button
        android:id="@+id/btn_three"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="动画3" />

    <Button
        android:id="@+id/btn_four"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="动画4" />

    <ImageView
        android:id="@+id/img_babi"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_gravity="center"
        android:background="@mipmap/img_babi" />

</LinearLayout>
```

接着到MainActivity.java， 首先需要一个修改View位置的方法，这里调用moveView()设置左边和上边的起始坐标以及宽高！

接着定义了四个动画，分别是：直线移动，缩放，旋转加透明，以及圆形旋转！

然后通过按钮触发对应的动画~
```java
public class MainActivity extends AppCompatActivity implements View.OnClickListener {

    private Button btn_one;
    private Button btn_two;
    private Button btn_three;
    private Button btn_four;
    private LinearLayout ly_root;
    private ImageView img_babi;
    private int width;
    private int height;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        bindViews();
    }

    private void bindViews() {
        ly_root = (LinearLayout) findViewById(R.id.ly_root);
        btn_one = (Button) findViewById(R.id.btn_one);
        btn_two = (Button) findViewById(R.id.btn_two);
        btn_three = (Button) findViewById(R.id.btn_three);
        btn_four = (Button) findViewById(R.id.btn_four);
        img_babi = (ImageView) findViewById(R.id.img_babi);

        btn_one.setOnClickListener(this);
        btn_two.setOnClickListener(this);
        btn_three.setOnClickListener(this);
        btn_four.setOnClickListener(this);
        img_babi.setOnClickListener(this);
    }

    @Override
    public void onClick(View v) {
        switch (v.getId()) {
            case R.id.btn_one:
                lineAnimator();
                break;
            case R.id.btn_two:
                scaleAnimator();
                break;
            case R.id.btn_three:
                raAnimator();
                break;
            case R.id.btn_four:
                circleAnimator();
                break;
            case R.id.img_babi:
                Toast.makeText(MainActivity.this, "不愧是coder-pig~", Toast.LENGTH_SHORT).show();
                break;
        }
    }


    //定义一个修改ImageView位置的方法
    private void moveView(View view, int rawX, int rawY) {
        int left = rawX - img_babi.getWidth() / 2;
        int top = rawY - img_babi.getHeight();
        int width = left + view.getWidth();
        int height = top + view.getHeight();
        view.layout(left, top, width, height);
    }


    //定义属性动画的方法：

    //按轨迹方程来运动
    private void lineAnimator() {
        width = ly_root.getWidth();
        height = ly_root.getHeight();
        ValueAnimator xValue = ValueAnimator.ofInt(height,0,height / 4,height / 2,height / 4 * 3 ,height);
        xValue.setDuration(3000L);
        xValue.addUpdateListener(new ValueAnimator.AnimatorUpdateListener() {
            @Override
            public void onAnimationUpdate(ValueAnimator animation) {
                // 轨迹方程 x = width / 2
                int y = (Integer) animation.getAnimatedValue();
                int x = width / 2;
                moveView(img_babi, x, y);
            }
        });
        xValue.setInterpolator(new LinearInterpolator());
        xValue.start();
    }

    //缩放效果
    private void scaleAnimator(){
    
        //这里故意用两个是想让大家体会下组合动画怎么用而已~
        final float scale = 0.5f;
        AnimatorSet scaleSet = new AnimatorSet();
        ValueAnimator valueAnimatorSmall = ValueAnimator.ofFloat(1.0f, scale);
        valueAnimatorSmall.setDuration(500);

        ValueAnimator valueAnimatorLarge = ValueAnimator.ofFloat(scale, 1.0f);
        valueAnimatorLarge.setDuration(500);

        valueAnimatorSmall.addUpdateListener(new ValueAnimator.AnimatorUpdateListener() {
            @Override
            public void onAnimationUpdate(ValueAnimator animation) {
                float scale = (Float) animation.getAnimatedValue();
                img_babi.setScaleX(scale);
                img_babi.setScaleY(scale);
            }
        });
        valueAnimatorLarge.addUpdateListener(new ValueAnimator.AnimatorUpdateListener() {
            @Override
            public void onAnimationUpdate(ValueAnimator animation) {
                float scale = (Float) animation.getAnimatedValue();
                img_babi.setScaleX(scale);
                img_babi.setScaleY(scale);
            }
        });

        scaleSet.play(valueAnimatorLarge).after(valueAnimatorSmall);
        scaleSet.start();

        //其实可以一个就搞定的
//        ValueAnimator vValue = ValueAnimator.ofFloat(1.0f, 0.6f, 1.2f, 1.0f, 0.6f, 1.2f, 1.0f);
//        vValue.setDuration(1000L);
//        vValue.addUpdateListener(new ValueAnimator.AnimatorUpdateListener() {
//            @Override
//            public void onAnimationUpdate(ValueAnimator animation) {
//                float scale = (Float) animation.getAnimatedValue();
//                img_babi.setScaleX(scale);
//                img_babi.setScaleY(scale);
//            }
//        });
//        vValue.setInterpolator(new LinearInterpolator());
//        vValue.start();
    }


    //旋转的同时透明度变化
    private void raAnimator(){
        ValueAnimator rValue = ValueAnimator.ofInt(0, 360);
        rValue.setDuration(1000L);
        rValue.addUpdateListener(new ValueAnimator.AnimatorUpdateListener() {
            @Override
            public void onAnimationUpdate(ValueAnimator animation) {
                int rotateValue = (Integer) animation.getAnimatedValue();
                img_babi.setRotation(rotateValue);
                float fractionValue = animation.getAnimatedFraction();
                img_babi.setAlpha(fractionValue);
            }
        });
        rValue.setInterpolator(new DecelerateInterpolator());
        rValue.start();
    }

    //圆形旋转
    protected void circleAnimator() {
        width = ly_root.getWidth();
        height = ly_root.getHeight();
        final int R = width / 4;
        ValueAnimator tValue = ValueAnimator.ofFloat(0,
                (float) (2.0f * Math.PI));
        tValue.setDuration(1000);
        tValue.addUpdateListener(new ValueAnimator.AnimatorUpdateListener() {
            @Override
            public void onAnimationUpdate(ValueAnimator animation) {
                // 圆的参数方程 x = R * sin(t) y = R * cos(t)
                float t = (Float) animation.getAnimatedValue();
                int x = (int) (R * Math.sin(t) + width / 2);
                int y = (int) (R * Math.cos(t) + height / 2);
                moveView(img_babi, x, y);
            }
        });
        tValue.setInterpolator(new DecelerateInterpolator());
        tValue.start();
    }
}
```

好的，使用的流程非常简单，先创建ValueAnimator对象，调用ValueAnimator.ofInt/ofFloat 获得，然后设置动画持续时间，addUpdateListener添加AnimatorUpdateListener事件监听， 然后使用参数animation的getAnimatedValue()获得当前的值，然后我们可以拿着这个值 来修改View的一些属性，从而形成所谓的动画效果，接着设置setInterpolator动画渲染模式， 最后调用start()开始动画的播放~

卧槽，直线方程，圆的参数方程，我都开始方了，这不是高数的东西么， 挂科学渣连三角函数都忘了...

例子参考自github：[MoveViewValueAnimator](https://github.com/nuptboyzhb/MoveViewValueAnimator)


## 四、ObjectAnimator简单使用
比起ValueAnimator，ObjectAnimator显得更为易用，通过该类我们可以直接 对任意对象的任意属性进行动画操作！没错，是任意对象，而不单单只是View对象， 不断地对对象中的某个属性值进行赋值，然后根据对象属性值的改变再来决定如何展现 出来！比如为TextView设置如下动画： ObjectAnimator.ofFloat(textview, "alpha", 1f, 0f);
这里就是不断改变alpha的值，从1f - 0f，然后对象根据属性值的变化来刷新界面显示，从而 展现出淡入淡出的效果，而在TextView类中并没有alpha这个属性，ObjectAnimator内部机制是： 寻找传输的属性名对应的get和set方法~，而非找这个属性值！ 不信的话你可以到TextView的源码里找找是否有alpha这个属性！ 好的，下面我们利用ObjectAnimator来实现四种补间动画的效果吧~

运行效果图：

![](../img/custom-158.jpg)

代码实现：

布局直接用的上面那个布局，加了个按钮，把ImageView换成了TextView，这里就不贴代码了， 直接上MainActivity.java部分的代码，其实都是大同小异的~
```java
public class MainActivity extends AppCompatActivity implements View.OnClickListener {
    private Button btn_one;
    private Button btn_two;
    private Button btn_three;
    private Button btn_four;
    private Button btn_five;
    private LinearLayout ly_root;
    private TextView tv_pig;
    private int height;
    private ObjectAnimator animator1;
    private ObjectAnimator animator2;
    private ObjectAnimator animator3;
    private ObjectAnimator animator4;
    private AnimatorSet animSet;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        bindViews();
        initAnimator();
    }

    private void bindViews() {
        ly_root = (LinearLayout) findViewById(R.id.ly_root);
        btn_one = (Button) findViewById(R.id.btn_one);
        btn_two = (Button) findViewById(R.id.btn_two);
        btn_three = (Button) findViewById(R.id.btn_three);
        btn_four = (Button) findViewById(R.id.btn_four);
        btn_five = (Button) findViewById(R.id.btn_five);
        tv_pig = (TextView) findViewById(R.id.tv_pig);

        height = ly_root.getHeight();
        btn_one.setOnClickListener(this);
        btn_two.setOnClickListener(this);
        btn_three.setOnClickListener(this);
        btn_four.setOnClickListener(this);
        btn_five.setOnClickListener(this);
        tv_pig.setOnClickListener(this);
    }

    //初始化动画
    private void initAnimator() {
        animator1 = ObjectAnimator.ofFloat(tv_pig, "alpha", 1f, 0f, 1f, 0f, 1f);
        animator2 = ObjectAnimator.ofFloat(tv_pig, "rotation", 0f, 360f, 0f);
        animator3 = ObjectAnimator.ofFloat(tv_pig, "scaleX", 2f, 4f, 1f, 0.5f, 1f);
        animator4 = ObjectAnimator.ofFloat(tv_pig, "translationY", height / 8, -100, height / 2);
    }

    @Override
    public void onClick(View v) {
        switch (v.getId()) {
            case R.id.btn_one:
                animator1.setDuration(3000l);
                animator1.start();
                break;
            case R.id.btn_two:
                animator2.setDuration(3000l);
                animator2.start();
                break;
            case R.id.btn_three:
                animator3.setDuration(3000l);
                animator3.start();
                break;
            case R.id.btn_four:
                animator4.setDuration(3000l);
                animator4.start();
                break;
            case R.id.btn_five:
                //将前面的动画集合到一起~
                animSet = new AnimatorSet();
                animSet.play(animator4).with(animator3).with(animator2).after(animator1);
                animSet.setDuration(5000l);
                animSet.start();
                break;
            case R.id.tv_pig:
                Toast.makeText(MainActivity.this, "不愧是coder-pig~", Toast.LENGTH_SHORT).show();
                break;
        }
    }
}
```

用法也非常简单，上面涉及到的组合动画我们下面讲~


## 五、组合动画与AnimatorListener
从上面两个例子中我们都体验了一把组合动画，用到了AnimatorSet这个类！

我们调用的play()方法，然后传入第一个开始执行的动画，此时他会返回一个Builder类给我们：

![](../img/custom-159.jpg)

接下来我们可以调用Builder给我们提供的四个方法，来组合其他的动画：

- after(Animator anim) 将现有动画插入到传入的动画之后执行
- after(long delay) 将现有动画延迟指定毫秒后执行
- before(Animator anim) 将现有动画插入到传入的动画之前执行
- with(Animator anim) 将现有动画和传入的动画同时执行

嗯，很简单，接下来要说下动画事件的监听，上面我们ValueAnimator的监听器是 AnimatorUpdateListener，当值状态发生改变时候会回调onAnimationUpdate方法！

除了这种事件外还有：动画进行状态的监听~ AnimatorListener，我们可以调用addListener方法 添加监听器，然后重写下面四个回调方法：

- onAnimationStart()：动画开始
- onAnimationRepeat()：动画重复执行
- onAnimationEnd()：动画结束
- onAnimationCancel()：动画取消

没错，加入你真的用AnimatorListener的话，四个方法你都要重写，当然和前面的手势那一节一样， Android已经给我们提供好一个适配器类：AnimatorListenerAdapter，该类中已经把每个接口 方法都实现好了，所以我们这里只写一个回调方法也可以额！


## 六、使用XML来编写动画
使用XML来编写动画，画的时间可能比Java代码长一点，但是重用起来就轻松很多！ 对应的XML标签分别为：<animator><objectAnimator><set> 相关的属性解释如下：

- android:ordering：指定动画的播放顺序：sequentially(顺序执行)，together(同时执行)
- android:duration：动画的持续时间
- android:propertyName="x"：这里的x，还记得上面的"alpha"吗？加载动画的那个对象里需要 定义getx和setx的方法，objectAnimator就是通过这里来修改对象里的值的！
- android:valueFrom="1" ：动画起始的初始值
- android:valueTo="0" ：动画结束的最终值
- android:valueType="floatType"：变化值的数据类型

使用例子如下：

①从0到100平滑过渡的动画：
```xml
<animator xmlns:android="http://schemas.android.com/apk/res/android"  
    android:valueFrom="0"  
    android:valueTo="100"  
    android:valueType="intType"/>
```

②将一个视图的alpha属性从1变成0：
```xml
<objectAnimator xmlns:android="http://schemas.android.com/apk/res/android"  
    android:valueFrom="1"  
    android:valueTo="0"  
    android:valueType="floatType"  
    android:propertyName="alpha"/>
```

③set动画使用演示：
```xml
<set android:ordering="sequentially" >
    <set>
        <objectAnimator
            android:duration="500"
            android:propertyName="x"
            android:valueTo="400"
            android:valueType="intType" />
        <objectAnimator
            android:duration="500"
            android:propertyName="y"
            android:valueTo="300"
            android:valueType="intType" />
    </set>
    <objectAnimator
        android:duration="500"
        android:propertyName="alpha"
        android:valueTo="1f" />
</set>
```

加载我们的动画文件：
```java
AnimatorSet set = (AnimatorSet)AnimatorInflater.loadAnimator(mContext, 
             R.animator.property_animator);  
animator.setTarget(view);  
animator.start();  
```


## 七、本节示例代码下载：
[AnimatorDemo1.zip](../img/AnimatorDemo1.zip)

[AnimatorDemo2.zip](../img/AnimatorDemo2.zip)


## 八、本节小结：
好的，本节给大家捋了一捋安卓中属性动画的基本用法，不知道你get了没，内容还是比较简单 的，而且例子比较有趣，相信大家会喜欢，嗯，就说这么多，谢谢~

感谢郭神的文章~

