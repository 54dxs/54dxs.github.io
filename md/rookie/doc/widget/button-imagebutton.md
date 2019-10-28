## 一、本节引言：
今天给大家介绍的Android基本控件中的两个按钮控件，Button普通按钮和ImageButton图像按钮； 其实ImageButton和Button的用法基本类似，至于与图片相关的则和后面ImageView相同，所以本节 只对Button进行讲解，另外Button是TextView的子类，所以TextView上很多属性也可以应用到Button 上！我们实际开发中对于Button的，无非是对按钮的几个状态做相应的操作，比如：按钮按下的时候 用一种颜色，弹起又一种颜色，或者按钮不可用的时候一种颜色这样！上述实现无非是通过 `StateListDrawable`这种Drawable资源来实现，即编写一个drawable的资源文件，就说这么多， 直接开始本节内容~


## 二、StateListDrawable简介：
StateListDrawable是Drawable资源的一种，可以根据不同的状态，设置不同的图片效果，关键节点 `< selector >`，我们只需要将Button的background属性设置为该drawable资源即可轻松实现，按下 按钮时不同的按钮颜色或背景！

我们可以设置的属性：

- `drawable`:引用的Drawable位图,我们可以把他放到最前面,就表示组件的正常状态~
- `state_focused`:是否获得焦点
- `state_window_focused`:是否获得窗口焦点
- `state_enabled`:控件是否可用
- `state_checkable`:控件可否被勾选,eg:checkbox
- `state_checked`:控件是否被勾选
- `state_selected`:控件是否被选择,针对有滚轮的情况
- `state_pressed`:控件是否被按下
- `state_active`:控件是否处于活动状态,eg:slidingTab
- `state_single`:控件包含多个子控件时,确定是否只显示一个子控件
- `state_first`:控件包含多个子控件时,确定第一个子控件是否处于显示状态
- `state_middle`:控件包含多个子控件时,确定中间一个子控件是否处于显示状态
- `state_last`:控件包含多个子控件时,确定最后一个子控件是否处于显示状态


## 三、实现按钮的按下效果：
好的，先准备三个图片背景，一般我们为了避免按钮拉伸变形都会使用.9.png作为按钮的drawable！ 先来看下 `运行效果图`：

![](../img/widget-55.jpg)

代码实现：

```xml
<?xml version="1.0" encoding="utf-8"?>
<selector xmlns:android="http://schemas.android.com/apk/res/android">
    <item android:state_pressed="true" android:drawable="@drawable/ic_course_bg_fen"/>
    <item android:state_enabled="false" android:drawable="@drawable/ic_course_bg_pressed"/>
    <item android:drawable="@drawable/ic_course_bg_cheng"/>
</selector>
```

布局文件:**activity_main.xml**

```xml
<Button
        android:id="@+id/btnOne"
        android:layout_width="match_parent"
        android:layout_height="64dp"
        android:background="@drawable/btn_bg1"
        android:text="按钮"/>
    
    
    <Button
        android:id="@+id/btnTwo"
        android:layout_width="match_parent"
        android:layout_height="64dp"
        android:text="按钮不可用"/>
```

**MainActivity.java：**

```java
public class MainActivity extends Activity {

    private Button btnOne,btnTwo;
    
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        btnOne = (Button) findViewById(R.id.btnOne);
        btnTwo = (Button) findViewById(R.id.btnTwo);
        btnTwo.setOnClickListener(new OnClickListener() {
            @Override
            public void onClick(View v) {
                if(btnTwo.getText().toString().equals("按钮不可用")){
                    btnOne.setEnabled(false);
                    btnTwo.setText("按钮可用");
                }else{
                    btnOne.setEnabled(true);
                    btnTwo.setText("按钮不可用");
                }
            }
        });
    }
}
```


## 四、使用颜色值绘制圆角按钮
很多时候我们不一定会有美工是吧，或者我们不会PS或毁图秀秀，又或者我们懒，不想自己去做图， 这个时候我们可以自己写代码来作为按钮背景，想要什么颜色就什么颜色，下面我们来定制个圆角的 的按钮背景~，这里涉及到另一个drawable资源:ShapeDrawable，这里不详细讲，后面会详细介绍每一个 drawable~这里会用就好，只是EditText修改下Background属性而已，这里只贴drawable资源！

先看下效果图：

![](../img/widget-56.jpg)

**bbuton_danger_rounded.xml：**

```xml
<?xml version="1.0" encoding="utf-8"?>
<selector xmlns:android="http://schemas.android.com/apk/res/android">

    <item android:state_pressed="true"><shape>
            <solid android:color="@color/bbutton_danger_pressed" />
            <stroke android:width="1dp" android:color="@color/bbutton_danger_edge" />
            <corners android:radius="@dimen/bbuton_rounded_corner_radius"/>
        </shape></item>
        
    
    <item android:state_enabled="false"><shape>
        <solid android:color="@color/bbutton_danger_disabled" />
            <stroke android:width="1dp" android:color="@color/bbutton_danger_disabled_edge" />
            <corners android:radius="@dimen/bbuton_rounded_corner_radius"/>
        </shape></item>
        

    <item><shape>
            <solid android:color="@color/bbutton_danger" />
            <stroke android:width="1dp" android:color="@color/bbutton_danger_edge" />
            <corners android:radius="@dimen/bbuton_rounded_corner_radius"/>
        </shape></item>
    
        
</selector>
```

**color.xml:**

```xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="bbutton_danger_pressed">#ffd2322d</color>
    <color name="bbutton_danger_edge">#ffd43f3a</color>
    <color name="bbutton_danger_disabled">#a5d9534f</color>
    <color name="bbutton_danger_disabled_edge">#a5d43f3a</color>
    <color name="bbutton_danger">#ffd9534f</color>
    <color name="text_font_white">#FFFFFF</color>
</resources>
```

**dimens.xml:**

```xml
<dimen name="bbuton_rounded_corner_radius">5dp</dimen>
```


## 五、实现Material Design水波效果的Button
如果你的Android手机是5.0以上的系统，相信对下面这种按钮点击效果并不会陌生：

**实现效果图：**

![](../img/widget-57.jpg)

快的那个是按下后的效果，慢的是长按后的效果！

**实现逻辑：**

1.我们继承ImageButton，当然你可以换成Button或者View,这里笔者想把龟放到中间才继承ImageButton

2.首先，创建两个Paint(画笔)对象，一个绘制底部背景颜色，一个绘制波纹扩散的

3.接着计算最大半径，开始半径每隔一段时间递增一次，直到等于最大半径，然后重置状态！

PS:大概的核心，刚学可能对自定义View感到陌生，没事，这里了解下即可，以后我们会讲，当然 你可以自己扣扣，注释还是蛮详细的~

**实现代码：**

自定义ImageButton：**MyButton.java**

```java
package demo.com.jay.buttondemo;

import android.content.Context;
import android.graphics.Canvas;
import android.graphics.Paint;
import android.os.SystemClock;
import android.util.AttributeSet;
import android.view.MotionEvent;
import android.view.ViewConfiguration;
import android.widget.ImageButton;

/**
 * Created by coder-pig on 2015/7/16 0016.
 */
public class MyButton extends ImageButton {


    private static final int INVALIDATE_DURATION = 15;     //每次刷新的时间间隔
    private static int DIFFUSE_GAP = 10;                  //扩散半径增量
    private static int TAP_TIMEOUT;                         //判断点击和长按的时间

    private int viewWidth, viewHeight;                   //控件宽高
    private int pointX, pointY;                          //控件原点坐标（左上角）
    private int maxRadio;                             //扩散的最大半径
    private int shaderRadio;                        //扩散的半径

    private Paint bottomPaint, colorPaint;          //画笔:背景和水波纹
    private boolean isPushButton;                 //记录是否按钮被按下

    private int eventX, eventY;                  //触摸位置的X,Y坐标
    private long downTime = 0;                 //按下的时间


    public MyButton(Context context, AttributeSet attrs) {
        super(context, attrs);
        initPaint();
        TAP_TIMEOUT = ViewConfiguration.getLongPressTimeout();
    }


    /*
    * 初始化画笔
    * */
    private void initPaint() {
        colorPaint = new Paint();
        bottomPaint = new Paint();
        colorPaint.setColor(getResources().getColor(R.color.reveal_color));
        bottomPaint.setColor(getResources().getColor(R.color.bottom_color));
    }


    @Override
    public boolean onTouchEvent(MotionEvent event) {
        switch (event.getAction()) {
            case MotionEvent.ACTION_DOWN:
                if (downTime == 0) downTime = SystemClock.elapsedRealtime();
                eventX = (int) event.getX();
                eventY = (int) event.getY();
                //计算最大半径：
                countMaxRadio();
                isPushButton = true;
                postInvalidateDelayed(INVALIDATE_DURATION);
                break;
            case MotionEvent.ACTION_UP:
            case MotionEvent.ACTION_CANCEL:
                if(SystemClock.elapsedRealtime() - downTime < TAP_TIMEOUT){
                    DIFFUSE_GAP = 30;
                    postInvalidate();
                }else{
                    clearData();
                }
                break;
        }
        return super.onTouchEvent(event);
    }


    @Override
    protected void dispatchDraw(Canvas canvas) {
        super.dispatchDraw(canvas);
        if(!isPushButton) return; //如果按钮没有被按下则返回
        //绘制按下后的整个背景
        canvas.drawRect(pointX, pointY, pointX + viewWidth, pointY + viewHeight, bottomPaint);
        canvas.save();
        //绘制扩散圆形背景
        canvas.clipRect(pointX, pointY, pointX + viewWidth, pointY + viewHeight);
        canvas.drawCircle(eventX, eventY, shaderRadio, colorPaint);
        canvas.restore();
        //直到半径等于最大半径
        if(shaderRadio < maxRadio){
            postInvalidateDelayed(INVALIDATE_DURATION,
                    pointX, pointY, pointX + viewWidth, pointY + viewHeight);
            shaderRadio += DIFFUSE_GAP;
        }else{
            clearData();
        }
    }

    /*
        * 计算最大半径的方法
        * */
    private void countMaxRadio() {
        if (viewWidth > viewHeight) {
            if (eventX < viewWidth / 2) {
                maxRadio = viewWidth - eventX;
            } else {
                maxRadio = viewWidth / 2 + eventX;
            }
        } else {
            if (eventY < viewHeight / 2) {
                maxRadio = viewHeight - eventY;
            } else {
                maxRadio = viewHeight / 2 + eventY;
            }
        }
    }


    /*
    * 重置数据的方法
    * */
    private void clearData(){
        downTime = 0;
        DIFFUSE_GAP = 10;
        isPushButton = false;
        shaderRadio = 0;
        postInvalidate();
    }

    @Override
    protected void onSizeChanged(int w, int h, int oldw, int oldh) {
        super.onSizeChanged(w, h, oldw, oldh);
        this.viewWidth = w;
        this.viewHeight = h;
    }
}
```
**color.xml：**

```xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="reveal_color">#FFFFFF</color>
    <color name="bottom_color">#3086E4</color>
    <color name="bottom_bg">#40BAF8</color>
</resources>
```

**activity_main.xml：**

```xml
<RelativeLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    tools:context=".MainActivity">

    <demo.com.jay.buttondemo.MyButton
        android:id="@+id/myBtn"
        android:layout_width="match_parent"
        android:layout_height="64dp"
        android:src="@mipmap/ic_tur_icon"
        android:background="@color/bottom_bg"
        android:scaleType="center"/>

</RelativeLayout>
```

源码下载(AS工程的哦)：[ButtonDemo.zip](../img/ButtonDemo.zip)


## 六、本节小结：
本节给大家介绍了Button在实际开发中的一些用法，可能有些东西我们还没学，这里 知道下即可，后面学到自然会深入讲解，谢谢~