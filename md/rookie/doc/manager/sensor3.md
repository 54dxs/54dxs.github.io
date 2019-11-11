## 一、本节引言：
本节继续来扣Android中的传感器，本节带来的是加速度传感器(Accelerometer sensor)以及 陀螺仪传感器(Gyroscope sensor)，和上一节的方向传感器一样有着x，y，z 三个轴， 还是要说一点：x，y轴的坐标要和绘图那里的x，y轴区分开来！传感器的是以左下角 为原点的！x向右，y向上！好的，带着我们的套路来学本节的传感器吧！

另外，想说一点的就是我们不是专门搞这个的，就写东西啊玩玩，见识下而已哈，很多东西 别太较真！

PS:方向传感器其实就是利用加速度传感器和磁场传感器来获取方位的，在2.2开始就被弃用了~


## 二、加速度传感器(Accelerometer sensor)
### 1）名词概念：
- 加速度传感器的单位：加速度(m/s^2)
- 方向传感器获取到的加速度是：手机运动的加速度与重力加速度(9.81m/s^2)的合加速度
- 另外重力加速度是垂直向下的！

关于这个不同方向合加速度的计算好像蛮复杂的，这里我们就不去纠结这个了！ 先来看看加速度的value数组中的三个数的值吧~依旧是上节的代码，改下传感器而已~

水平放置：

![](../img/manager-36.jpg)

 竖直平放：

![](../img/manager-37.jpg) 
 
  竖直横放：

![](../img/manager-38.jpg)

从上面我们知道value数组的三个值分别对应X，Y，Z轴上的加速度！ 好的，知道个大概，我们来写个简易计步器来熟悉下用法！


### 2）.简易计步器的实现
运行效果图：

![](../img/manager-39.jpg)

代码实现：

布局代码：activity_main.xml：
```xml
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:orientation="vertical"
    android:padding="5dp">

    <TextView
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_gravity="center_horizontal"
        android:layout_marginTop="30dp"
        android:text="简易计步器"
        android:textSize="25sp" />

    <TextView
        android:id="@+id/tv_step"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_gravity="center_horizontal"
        android:layout_marginTop="5dp"
        android:text="0"
        android:textColor="#DE5347"
        android:textSize="100sp"
        android:textStyle="bold" />

    <Button
        android:id="@+id/btn_start"
        android:layout_width="match_parent"
        android:layout_height="64dp"
        android:text="开始"
        android:textSize="25sp" />

</LinearLayout>
```

`MainActivity.java：`
```java
public class MainActivity extends AppCompatActivity implements View.OnClickListener, SensorEventListener {

    private SensorManager sManager;
    private Sensor mSensorAccelerometer;
    private TextView tv_step;
    private Button btn_start;
    private int step = 0;   //步数
    private double oriValue = 0;  //原始值
    private double lstValue = 0;  //上次的值
    private double curValue = 0;  //当前值
    private boolean motiveState = true;   //是否处于运动状态
    private boolean processState = false;   //标记当前是否已经在计步


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        sManager = (SensorManager) getSystemService(SENSOR_SERVICE);
        mSensorAccelerometer = sManager.getDefaultSensor(Sensor.TYPE_ACCELEROMETER);
        sManager.registerListener(this, mSensorAccelerometer, SensorManager.SENSOR_DELAY_UI);
        bindViews();
    }

    private void bindViews() {

        tv_step = (TextView) findViewById(R.id.tv_step);
        btn_start = (Button) findViewById(R.id.btn_start);
        btn_start.setOnClickListener(this);
    }


    @Override
    public void onSensorChanged(SensorEvent event) {
        double range = 1;   //设定一个精度范围
        float[] value = event.values;
        curValue = magnitude(value[0], value[1], value[2]);   //计算当前的模
        //向上加速的状态
        if (motiveState == true) {
            if (curValue >= lstValue) lstValue = curValue;
            else {
                //检测到一次峰值
                if (Math.abs(curValue - lstValue) > range) {
                    oriValue = curValue;
                    motiveState = false;
                }
            }
        }
        //向下加速的状态
        if (motiveState == false) {
            if (curValue <= lstValue) lstValue = curValue;
            else {
                if (Math.abs(curValue - lstValue) > range) {
                    //检测到一次峰值
                    oriValue = curValue;
                    if (processState == true) {
                        step++;  //步数 + 1
                        if (processState == true) {
                            tv_step.setText(step + "");    //读数更新
                        }
                    }
                    motiveState = true;
                }
            }
        }
    }

    @Override
    public void onAccuracyChanged(Sensor sensor, int accuracy) {}

    @Override
    public void onClick(View v) {
        step = 0;
        tv_step.setText("0");
        if (processState == true) {
            btn_start.setText("开始");
            processState = false;
        } else {
            btn_start.setText("停止");
            processState = true;
        }
    }

    //向量求模
    public double magnitude(float x, float y, float z) {
        double magnitude = 0;
        magnitude = Math.sqrt(x * x + y * y + z * z);
        return magnitude;
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        sManager.unregisterListener(this);
    }
}
```

好的，真的是非常简易的计步器...上面的步数是我坐着拿手撸出来的... ，毕竟写来玩玩而已~


## 三、陀螺仪传感器(Gyroscope sensor)
### 1）名词概念：
陀螺仪又叫角速度传感器，一般用来检测手机姿态的，好像手机中的陀螺仪传感器一般都是三轴的！ 体感游戏用得最多，手机拍照防抖，GPS惯性导航，还有为APP添加一些动作感应(比如轻轻晃动手机 关闭来电铃声)等等，具体的可以自己去百度下~

- 陀螺仪传感器的单位：角速度(弧度/秒)radians/second
- 获得传感器用的是：Sensor.TYPE_GYROSCOPE

他的三个值依次是沿着X轴，Y轴，Z轴旋转的角速度，手机逆时针旋转，角速度值为正，顺时针则为负值！ 经常用于计算手机已经转动的角度！这是网上的一段代码~
```java
private static final float NS2S = 1.0f / 1000000000.0f;
private float timestamp;

public void onSensorChanged(SensorEvent event)
{
    if (timestamp != 0)
    {
        // event.timesamp表示当前的时间，单位是纳秒（1百万分之一毫秒）
        final float dT = (event.timestamp - timestamp) * NS2S;
        angle[0] += event.values[0] * dT;
        angle[1] += event.values[1] * dT;
        angle[2] += event.values[2] * dT;
    }
    timestamp = event.timestamp;
}
```

通过陀螺仪传感器相邻两次获得数据的时间差（dT）来分别计算在这段时间内手机延X、 Y、Z轴旋转的角度，并将值分别累加到angle数组的不同元素上


## 四、本节示例代码下载：
[SensorDemo4.zip](../img/SensorDemo4.zip)


## 五、本节小结：
好的，本节给大家简单的跟大家介绍了下加速度传感器和陀螺仪，写了个简易计步器， 感觉传感器没怎么玩过，没什么好写，算了，下节就简单的把剩下的传感器介绍下 算了，就当科普科普，以后要用到再深入研究吧~ 