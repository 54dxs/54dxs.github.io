## 一、本节引言：
上一节的SeekBar是不是很轻松咧，本节我们学的这个RatingBar(星级评分条)也非常简单，相信在某宝， 买过东西的对这个应该不陌生，收到卖家的包裹，里面很多时候会有个小纸片，五星好评返还多少元这样， 而评分的时候就可以用到我们这个星级评分条了~先来瞅瞅官方文档 官方文档：RatingBar 我们可以看到，这玩意和SeekBar的类结构是一样的，也是ProgressBar的子类：

![](../img/widget-88.jpg)

也就是说他同样有用ProgressBar的相关属性，接下来我们来探究RatingBar特有的属性！


## 二、RatingBar基本使用：
先来看看5.0的原生SeekBar长什么样：

![](../img/widget-89.jpg)

——相关属性：

`android:isIndicator`：是否用作指示，用户无法更改，默认false
`android:numStars`：显示多少个星星，必须为整数
`android:rating`：默认评分值，必须为浮点数
`android:stepSize`： 评分每次增加的值，必须为浮点数

除了上面这些，还有两种样式供我们选择咧，但是不建议使用，因为这两种样式都好丑... 他们分别是：

`style="?android:attr/ratingBarStyleSmall"`
`style="?android:attr/ratingBarStyleIndicator"`

——事件处理： 只需为RatingBar设置`OnRatingBarChangeListener`事件，然后重写下`onRatingChanged()`方法即可！

实现代码如下：

```java
public class MainActivity extends AppCompatActivity {
    private RatingBar rb_normal;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        rb_normal = (RatingBar) findViewById(R.id.rb_normal);
        rb_normal.setOnRatingBarChangeListener(new RatingBar.OnRatingBarChangeListener() {
            @Override
            public void onRatingChanged(RatingBar ratingBar, float rating, boolean fromUser) {
                Toast.makeText(MainActivity.this, "rating:" + String.valueOf(rating),
                        Toast.LENGTH_LONG).show();
            }
        });
    }
}
```


## 三、定制环节：
嘿嘿，我们很多时候不会用星星作为评分标准的，我们来改改呗~ 把星星改成其他的，比如笑脸，两个素材：

![](../img/widget-90.jpg)
![](../img/widget-91.jpg)

接下来和前面的SeekBar一样编写一个layer-list的文件：

**ratingbar_full.xml:**

```xml
<?xml version="1.0" encoding="utf-8"?>
<layer-list xmlns:android="http://schemas.android.com/apk/res/android">
    <item android:id="@android:id/background"
        android:drawable="@mipmap/ic_rating_off1" />
    <item android:id="@android:id/secondaryProgress"
        android:drawable="@mipmap/ic_rating_off1" />
    <item android:id="@android:id/progress"
        android:drawable="@mipmap/ic_rating_on1" />
</layer-list>  
```

接着在style.xml中自定义下RatingBar Style，在`style.xml`加上这个：

```xml
<style name="roomRatingBar" parent="@android:style/Widget.RatingBar">
        <item name="android:progressDrawable">@drawable/ratingbar_full</item>
        <item name="android:minHeight">24dip</item>
        <item name="android:maxHeight">24dip</item>
    </style>
```

最后在布局中的Ratingbar组件设置下：

```xml
<RatingBar
        android:id="@+id/rb_normal"
        style="@style/roomRatingBar"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content" />
```

运行效果图：

![](../img/widget-92.jpg)

好的，效果还可以哈，至于间距问题，就需要对图片做下处理了，就是需要切图的时候在图片左右预留点空格~!


## 四、本节小结：
好的，关于RatingBar的使用就到这里，和前面的SeekBar其实大同小异，蛮轻松的~嗯，谢谢~