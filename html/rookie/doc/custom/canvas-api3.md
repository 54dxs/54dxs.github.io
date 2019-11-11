## 一、本节引言：
在Canvas的API文档中，我们看到这样一个方法：drawBitmap(Bitmap bitmap, Matrix matrix, Paint paint)

这个Matrix可是有大文章的，前面我们在学Paint的API中的ColorFilter中曾讲过ColorMatrix 颜色矩阵，一个4 * 5 的矩阵，我们可以通过修改矩阵值来修改色调，饱和度等！ 而今天讲的这个Matrix可以结合其他API来控制图形，组件的变换。比如Canvas就提供了上面的 这个drawBitmap来实现矩阵变换的效果！下面我们来慢慢研究这个东东~

官方API文档：Matrix


## 二、Matrix中的几个常用的变换方法
- setTranslate(float dx, float dy)：控制Matrix进行平移
- setRotate(float degrees, float px, float py)：旋转，参数依次是:旋转角度，轴心(x,y)
- setScale(float sx, float sy, float px, float py):缩放， 参数依次是：X，Y轴上的缩放比例；缩放的轴心
- setSkew(float kx, float ky)：倾斜(扭曲)，参数依次是：X，Y轴上的缩放比例

其实和Canvas变换的方法基本一致，在为Matrix设置了上面的变换后，调用Canvas的 drawBitmap()方法调用矩阵就好~


## 三、Matrix使用示例：
运行效果图：

![](../img/custom-145.jpg)

代码实现：

`MyView.java：`
```java
/**
 * Created by Jay on 2015/11/11 0011.
 */
public class MyView extends View {

    private Bitmap mBitmap;
    private Matrix matrix = new Matrix();
    private float sx = 0.0f;          //设置倾斜度
    private int width,height;         //位图宽高
    private float scale = 1.0f;       //缩放比例
    private int method = 0;

    public MyView(Context context) {
        this(context, null);
    }

    public MyView(Context context, AttributeSet attrs) {
        super(context, attrs);
        init();
    }

    public MyView(Context context, AttributeSet attrs, int defStyleAttr) {
        super(context, attrs, defStyleAttr);
    }

    private void init() {
        mBitmap = BitmapFactory.decodeResource(getResources(), R.mipmap.img_meizi);
        width = mBitmap.getWidth();
        height = mBitmap.getHeight();
    }

    @Override
    protected void onDraw(Canvas canvas) {
        super.onDraw(canvas);
        switch (method){
            case 0:
                matrix.reset();
                break;
            case 1:
                sx += 0.1;
                matrix.setSkew(sx,0);
                break;
            case 2:
                sx -= 0.1;
                matrix.setSkew(sx,0);
                break;
            case 3:
                if(scale < 2.0){
                    scale += 0.1;
                }
                matrix.setScale(scale,scale);
                break;
            case 4:
                if(scale > 0.5){
                    scale -= 0.1;
                }
                matrix.setScale(scale,scale);
                break;
        }
        //根据原始位图与Matrix创建新图片
        Bitmap bitmap = Bitmap.createBitmap(mBitmap,0,0,width,height,matrix,true);
        canvas.drawBitmap(bitmap,matrix,null);    //绘制新位图
    }

    public void setMethod(int i){
        method = i;
        postInvalidate();
    }
}
```

布局代码:activity_main.xml：
```xml
<RelativeLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent">

    <LinearLayout
        android:id="@+id/ly_bar"
        android:layout_width="match_parent"
        android:layout_height="64dp"
        android:layout_alignParentBottom="true">

        <Button
            android:id="@+id/btn_reset"
            android:layout_width="0dp"
            android:layout_height="match_parent"
            android:layout_weight="1"
            android:text="重置" />

        <Button
            android:id="@+id/btn_left"
            android:layout_width="0dp"
            android:layout_height="match_parent"
            android:layout_weight="1"
            android:text="左倾" />

        <Button
            android:id="@+id/btn_right"
            android:layout_width="0dp"
            android:layout_height="match_parent"
            android:layout_weight="1"
            android:text="右倾" />

        <Button
            android:id="@+id/btn_zoomin"
            android:layout_width="0dp"
            android:layout_height="match_parent"
            android:layout_weight="1"
            android:text="放大" />

        <Button
            android:id="@+id/btn_zoomout"
            android:layout_width="0dp"
            android:layout_height="match_parent"
            android:layout_weight="1"
            android:text="缩小" />
    </LinearLayout>


    <com.jay.canvasdemo3.MyView
        android:id="@+id/myView"
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        android:layout_above="@id/ly_bar" />

</RelativeLayout>
```

`MainActivity.java：`
```java
public class MainActivity extends AppCompatActivity implements View.OnClickListener{

    private Button btn_reset;
    private Button btn_left;
    private Button btn_right;
    private Button btn_zoomin;
    private Button btn_zoomout;
    private MyView myView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        bindViews();
    }

    private void bindViews() {
        btn_reset = (Button) findViewById(R.id.btn_reset);
        btn_left = (Button) findViewById(R.id.btn_left);
        btn_right = (Button) findViewById(R.id.btn_right);
        btn_zoomin = (Button) findViewById(R.id.btn_zoomin);
        btn_zoomout = (Button) findViewById(R.id.btn_zoomout);
        myView = (MyView) findViewById(R.id.myView);


        btn_reset.setOnClickListener(this);
        btn_left.setOnClickListener(this);
        btn_right.setOnClickListener(this);
        btn_zoomin.setOnClickListener(this);
        btn_zoomout.setOnClickListener(this);

    }

    @Override
    public void onClick(View v) {
        switch (v.getId()){
            case R.id.btn_reset:
                myView.setMethod(0);
                break;
            case R.id.btn_left:
                myView.setMethod(1);
                break;
            case R.id.btn_right:
                myView.setMethod(2);
                break;
            case R.id.btn_zoomin:
                myView.setMethod(3);
                break;
            case R.id.btn_zoomout:
                myView.setMethod(4);
                break;
        }
    }
}
```

用法非常简单，就不解释了~


## 四、drawBitmapMesh扭曲图像
在API文档中还有这样一个方法： drawBitmapMesh(Bitmap bitmap, int meshWidth, int meshHeight, float[] verts, int vertOffset, int[] colors, int colorOffset, Paint paint)

参数依次是：

- bitmap：需要扭曲的原位图

- meshWidth/meshHeight：在横/纵向上把原位图划分为多少格

- verts：长度为(meshWidth+1)*(meshHeight+2)的数组，他记录了扭曲后的位图各顶点(网格线交点) 位置，虽然他是一个一维数组，但是实际上它记录的数据是形如(x0,y0)，(x1,y1)..(xN,Yn)格式的数据， 这些数组元素控制对bitmap位图的扭曲效果

- vertOffset：控制verts数组从第几个数组元素开始对bitmap进行扭曲(忽略verOffset之前数据 的扭曲效果)

![](../img/custom-146.jpg)

代码示例：

运行效果图：

![](../img/custom-147.jpg)

代码实现：
```java
/**
 * Created by Jay on 2015/11/11 0011.
 */
public class MyView extends View {

    //将水平和竖直方向上都划分为20格
    private final int WIDTH = 20;
    private final int HEIGHT = 20;
    private final int COUNT = (WIDTH + 1) * (HEIGHT + 1);  //记录该图片包含21*21个点
    private final float[] verts = new float[COUNT * 2];    //扭曲前21*21个点的坐标
    private final float[] orig = new float[COUNT * 2];    //扭曲后21*21个点的坐标
    private Bitmap mBitmap;
    private float bH,bW;


    public MyView(Context context) {
        this(context, null);
    }

    public MyView(Context context, AttributeSet attrs) {
        super(context, attrs);
        init();
    }

    public MyView(Context context, AttributeSet attrs, int defStyleAttr) {
        super(context, attrs, defStyleAttr);
    }

    private void init() {
        mBitmap = BitmapFactory.decodeResource(getResources(), R.mipmap.img_wuliao);
        bH = mBitmap.getWidth();
        bW = mBitmap.getHeight();
        int index = 0;
        //初始化orig和verts数组。
        for (int y = 0; y <= HEIGHT; y++)
        {
            float fy = bH * y / HEIGHT;
            for (int x = 0; x <= WIDTH; x++)
            {
                float fx = bW * x / WIDTH;
                orig[index * 2 + 0] = verts[index * 2 + 0] = fx;
                orig[index * 2 + 1] = verts[index * 2 + 1] = fy;
                index += 1;
            }
        }
        //设置背景色
        setBackgroundColor(Color.WHITE);
    }

    @Override
    protected void onDraw(Canvas canvas) {
        canvas.drawBitmapMesh(mBitmap, WIDTH, HEIGHT, verts
                , 0, null, 0, null);
    }

    //工具方法，用于根据触摸事件的位置计算verts数组里各元素的值
    private void warp(float cx, float cy)
    {
        for (int i = 0; i < COUNT * 2; i += 2)
        {
            float dx = cx - orig[i + 0];
            float dy = cy - orig[i + 1];
            float dd = dx * dx + dy * dy;
            //计算每个座标点与当前点（cx、cy）之间的距离
            float d = (float)Math.sqrt(dd);
            //计算扭曲度，距离当前点（cx、cy）越远，扭曲度越小
            float pull = 80000 / ((float) (dd * d));
            //对verts数组（保存bitmap上21 * 21个点经过扭曲后的座标）重新赋值
            if (pull >= 1)
            {
                verts[i + 0] = cx;
                verts[i + 1] = cy;
            }
            else
            {
                //控制各顶点向触摸事件发生点偏移
                verts[i + 0] = orig[i + 0] + dx * pull;
                verts[i + 1] = orig[i + 1] + dy * pull;
            }
        }
        //通知View组件重绘
        invalidate();
    }

    @Override
    public boolean onTouchEvent(MotionEvent event)
    {
        //调用warp方法根据触摸屏事件的座标点来扭曲verts数组
        warp(event.getX(), event.getY());
        return true;
    }
}
```

实现流程分析：

首先你要弄清楚，这个verts数组存储的是什么？比如 verts[0]和verts1，这两个相邻的元素其实表示的就是我们第一个点的x坐标和y坐标！ 知道这一点，你就知道为什么有21 * 21个点，以及为什么数组长度等于这个值 * 2！ 初始化部分也就懂了！

接着我们再来看看根据触摸事件计算verts数组元素的值的实现： 获得触摸点的x,y坐标，拿这个值去减对应点的x,y只，计算出触摸点和每个坐标点的距离 然后计算所谓的扭曲度：80000 / ((float) (dd * d))；扭曲度 >= 1的，直接让该坐标 点指向这个触摸点，< 1的，则让各个顶点向触摸点发生偏移，然后再调用invalidate()重绘~ 大概就这样~多思考思考，如果还是不理解就算了~知道有这东西就好！


## 五、本节示例下载：
[CanvasDemo3.zip](../img/CanvasDemo3.zip)

[CanvasDemo4.zip](../img/CanvasDemo4.zip)


## 六、本节小结：
本节内容大部分摘自——李刚《Android》疯狂讲义，可能稍微容易理解一点吧~ Matrix应该大部分的童鞋都能看懂，而drawBitmapMesh扭曲图像则可能需要一点 时间消化消化，看不懂也没什么哈~嗯，本节就到这里，谢谢 