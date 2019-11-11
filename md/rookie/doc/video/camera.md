## 一、本节引言
本节给大家带来的是Android中Camera的使用，简单点说就是拍照咯，无非两种：

1. 调用系统自带相机拍照，然后获取拍照后的图片

2. 要么自己写个拍照页面

本节我们来写两个简单的例子体验下上面的这两种情况~


## 二、调用系统自带Carema
我们只需下面一席话语，即可调用系统相机，相机拍照后会返回一个intent给onActivityResult。 intent的extra部分包含一个编码过的Bitmap~
```java
Intent it = new Intent(MediaStore.ACTION_IMAGE_CAPTURE);
startActivityForResult(it,Activity.DEFAULT_KEYS_DIALER);

//重写onActivityResult方法
    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        if(requestCode == Activity.RESULT_OK){
            Bundle bundle = data.getExtras();
            Bitmap bitmap = (Bitmap) bundle.get("data");
            img_show.setImageBitmap(bitmap);
        }
} 
```

运行效果图：

![](../img/video-6.jpg)
![](../img/video-7.jpg) 

这模糊的AV画质...毕竟是编码过后的Bitmap，对了，拍完的图片是不会保存到本地的， 我们可以自己写代码把图片保存到我们的SD卡里，然后再显示，这样的图片会清晰很多， 嗯，我们写代码来试下~
```java
//定义一个保存图片的File变量
private File currentImageFile = null;

//在按钮点击事件处写上这些东西，这些是在SD卡创建图片文件的:
            @Override
            public void onClick(View v) {
                File dir = new File(Environment.getExternalStorageDirectory(),"pictures");
                if(dir.exists()){
                    dir.mkdirs();
                }
                currentImageFile = new File(dir,System.currentTimeMillis() + ".jpg");
                if(!currentImageFile.exists()){
                    try {
                        currentImageFile.createNewFile();
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                }

                Intent it = new Intent(MediaStore.ACTION_IMAGE_CAPTURE);
                it.putExtra(MediaStore.EXTRA_OUTPUT, Uri.fromFile(currentImageFile));
                startActivityForResult(it, Activity.DEFAULT_KEYS_DIALER);
            }

//onActivityResult：
 @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        if (requestCode == Activity.DEFAULT_KEYS_DIALER) {
        img_show.setImageURI(Uri.fromFile(currentImageFile));
        }
}
```

好的，非常简单，我们来看下运行结果：

![](../img/video-8.jpg)
![](../img/video-9.jpg)
![](../img/video-10.jpg)  

相比起上面那个清晰多了~调用系统自带Carema就是这么简单~


## 三、自己写一个拍照页面
这里我们需要用一个SurfaceView作为我们的预览界面，使用起来同一非常简单！

运行效果图：

![](../img/video-11.jpg)

代码实现：

布局代码：activity_main.xml：一个简单的surfaceView + Button
```xml
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:orientation="vertical">

    <SurfaceView
        android:id="@+id/sfv_preview"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:layout_weight="1" />

    <Button
        android:id="@+id/btn_take"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:text="调用系统照相机" />

</LinearLayout>
```

`MainActivity.java：`
```java
public class MainActivity extends AppCompatActivity {

    private SurfaceView sfv_preview;
    private Button btn_take;
    private Camera camera = null;
    private SurfaceHolder.Callback cpHolderCallback = new SurfaceHolder.Callback() {
        @Override
        public void surfaceCreated(SurfaceHolder holder) {
            startPreview();
        }

        @Override
        public void surfaceChanged(SurfaceHolder holder, int format, int width, int height) {

        }

        @Override
        public void surfaceDestroyed(SurfaceHolder holder) {
            stopPreview();
        }
    };

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        bindViews();
    }

    private void bindViews() {
        sfv_preview = (SurfaceView) findViewById(R.id.sfv_preview);
        btn_take = (Button) findViewById(R.id.btn_take);
        sfv_preview.getHolder().addCallback(cpHolderCallback);

        btn_take.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                camera.takePicture(null, null, new Camera.PictureCallback() {
                    @Override
                    public void onPictureTaken(byte[] data, Camera camera) {
                        String path = "";
                        if ((path = saveFile(data)) != null) {
                            Intent it = new Intent(MainActivity.this, PreviewActivity.class);
                            it.putExtra("path", path);
                            startActivity(it);
                        } else {
                            Toast.makeText(MainActivity.this, "保存照片失败", Toast.LENGTH_SHORT).show();
                        }
                    }
                });
            }
        });
    }

    //保存临时文件的方法
    private String saveFile(byte[] bytes){
        try {
            File file = File.createTempFile("img","");
            FileOutputStream fos = new FileOutputStream(file);
            fos.write(bytes);
            fos.flush();
            fos.close();
            return file.getAbsolutePath();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return "";
    }


    //开始预览
    private void startPreview(){
        camera = Camera.open();
        try {
            camera.setPreviewDisplay(sfv_preview.getHolder());
            camera.setDisplayOrientation(90);   //让相机旋转90度
            camera.startPreview();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    //停止预览
    private void stopPreview() {
        camera.stopPreview();
        camera.release();
        camera = null;
    }
}
```

最后是另外一个PreviewActivity.java，这里将图片显示到界面上而已~
```java
/**
 * Created by Jay on 2015/11/22 0022.
 */
public class PreviewActivity extends AppCompatActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        ImageView img = new ImageView(this);
        String path = getIntent().getStringExtra("path");
        if(path != null){
            img.setImageURI(Uri.fromFile(new File(path)));
        }
        setContentView(img);
    }
}
```

嗯，都非常简单哈，别忘了加上权限：
```xml
<uses-permission android:name="android.permission.CAMERA"/>
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE"/>
```

另外，有一点要说的就是假如carema没有释放掉的话，那么下次调用carema就会报错， 报错内容是：java.lang.RuntimeException:fail to connect to camera service 所以，需要对Carema进行release();假如一直报上面的错误，请重启手机~


## 四、本节示例代码下载
[CaremaDemo1.zip](../img/CaremaDemo1.zip)

[CaremaDemo2.zip](../img/CaremaDemo2.zip)


## 五、本节小结
好的，本节给大家讲解了如何去调用系统自带相机获取拍照后的图片，以及自己写Carema来 完成自定义相机，嘿嘿，在某些场合下我们不需要拍照预览界面，我们直接把弄一个悬浮框， 然后点击悬浮框，就触发拍照事件，这不就可以实现什么不知鬼不觉的拍摄了么？(偷拍) 嘿嘿，有点意思，要嗨自己动手写代码~