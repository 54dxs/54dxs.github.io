# Android新手入门

## ![Android进化史](doc/img/Android进化史.png)

## 一、前言
* [1.1、介绍](README.md)

## 二、Android开发准备
* [2.0、Android基础入门教程](doc/ready/intro.md)
* [2.1、背景相关与系统架构分析](doc/ready/system-architecture-analysis.md)
* [2.2、开发环境搭建](doc/ready/development-environment-build.md)
    * [2.2.1、使用Eclipse + ADT + SDK开发Android APP](doc/ready/eclipse-adt-sdk-app.md)
    * [2.2.2、使用Android Studio开发Android APP](doc/ready/android-studio.md)
* [2.3、SDK更新不了问题解决](doc/ready/sdk-problem-solve.md)
* [2.4、Genymotion模拟器安装](doc/ready/genymotion-install.md)
* [2.5、Git](doc/ready/git.md)
    * [2.5.1、Git使用教程之本地仓库的基本操作](doc/ready/git-repo-operate.md)
    * [2.5.2、Git之使用GitHub搭建远程仓库](doc/ready/git-repo-create.md)
* [2.6、.9png图](doc/ready/9png.md)
* [2.7、界面原型设计](doc/ready/interface-design.md)
* [2.8、工程相关解析(各种文件，资源访问)](doc/ready/project-src-analysis.md)
* [2.9、Android程序签名打包](doc/ready/sign-package.md)
* [2.10、反编译APK获取代码&资源](doc/ready/decompile-apk-get-code-resources.md)

## 三、Android控件使用
* [3.1、View与ViewGroup的概念](doc/widget/view-viewgroup-intro.md)
* [3.2、布局](doc/widget/layout.md)
    * [3.2.1、LinearLayout(线性布局)](doc/widget/linearlayout.md)
    * [3.2.2、RelativeLayout(相对布局)](doc/widget/relativelayout.md)
    * [3.2.3、TableLayout(表格布局)](doc/widget/tablelayout.md)
    * [3.2.4、FrameLayout(帧布局)](doc/widget/framelayout.md)
    * [3.2.5、GridLayout(网格布局)](doc/widget/gridlayout.md)
    * [3.2.6、AbsoluteLayout(绝对布局)](doc/widget/absolutelayout.md)
* [3.3、基础控件](doc/widget/widget.md)
    * [3.3.1、TextView(文本框)详解](doc/widget/textview.md)
    * [3.3.2、EditText(输入框)详解](doc/widget/edittext.md)
    * [3.3.3、Button(按钮)与ImageButton(图像按钮)](doc/widget/button-imagebutton.md)
    * [3.3.4、ImageView(图像视图)](doc/widget/imageview.md)
    * [3.3.5、RadioButton(单选按钮)和Checkbox(复选框)](doc/widget/radiobutton-checkbox.md)
    * [3.3.6、开关按钮ToggleButton和开关Switch](doc/widget/togglebutton-switch.md)
    * [3.3.7、ProgressBar(进度条)](doc/widget/progressbar.md)
    * [3.3.8、SeekBar(拖动条)](doc/widget/seekbar.md)
    * [3.3.9、RatingBar(星级评分条)](doc/widget/ratingbar.md)
* [3.4、复杂控件](doc/widget/widget2.md)
    * [3.4.1、ScrollView(滚动条)](doc/widget/scrollview.md)
    * [3.4.2、Date和Time控件(1)](doc/widget/date-time-1.md)
    * [3.4.3、Date和Time控件(2)](doc/widget/date-time-2.md)
    * [3.4.4、Adapter基础讲解](doc/widget/adapter.md)
    * [3.4.5、ListView简单实用](doc/widget/listview.md)
    * [3.4.6、BaseAdapter优化](doc/widget/baseadapter.md)
    * [3.4.7、ListView的焦点问题](doc/widget/listview-focus.md)
    * [3.4.8、ListView之checkbox错位问题解决](doc/widget/listview-checkbox.md)
    * [3.4.9、ListView的数据更新问题](doc/widget/listview-update.md)
* [3.5、高阶控件](doc/widget/widget3.md)
    * [3.5.1、构建一个可复用的自定义BaseAdapter](doc/widget/customer-baseadapter.md)
    * [3.5.2、ListView Item多布局的实现](doc/widget/listview-item.md)
    * [3.5.3、GridView(网格视图)的基本使用](doc/widget/gridview.md)
    * [3.5.4、Spinner(列表选项框)的基本使用](doc/widget/spinner.md)
    * [3.5.5、AutoCompleteTextView(自动完成文本框)的基本使用](doc/widget/autocompletetextview.md)
    * [3.5.6、ExpandableListView(可折叠列表)的基本使用](doc/widget/expandablelistview.md)
    * [3.5.7、ViewFlipper(翻转视图)的基本使用](doc/widget/viewflipper.md)
    * [3.5.8、Toast(吐司)的基本使用](doc/widget/toast.md)
    * [3.5.9、Notification(状态栏通知)详解](doc/widget/notification.md)
    * [3.5.10、AlertDialog(对话框)详解](doc/widget/alertdialog.md)
* [3.6、窗体控件](doc/widget/widget4.md)
    * [3.6.1、其他几种常用对话框基本使用](doc/widget/dialog.md)
    * [3.6.2、PopupWindow(悬浮框)的基本使用](doc/widget/popupwindow.md)
    * [3.6.3、菜单(Menu)](doc/widget/menu.md)
    * [3.6.4、ViewPager的简单使用](doc/widget/viewpager.md)
    * [3.6.5、DrawerLayout(官方侧滑菜单)的简单使用](doc/widget/drawerlayout.md)

## 四、Android事件浅析
* [4.1、基于监听的事件处理机制](doc/event/listen-event-handle.md)
* [4.2、基于回调的事件处理机制](doc/event/callback-event-handle.md)
* [4.3、Handler消息传递机制浅析](doc/event/handler-message.md)
* [4.4、TouchListener PK OnTouchEvent + 多点触碰](doc/event/touchlistener-ontouchevent.md)
* [4.5、监听EditText的内容变化](doc/event/listener-edittext-change.md)
* [4.6、响应系统设置的事件(Configuration类)](doc/event/configuration.md)
* [4.7、AnsyncTask异步任务](doc/event/ansynctask.md)
* [4.8、Gestures(手势)](doc/event/gestures.md)

## 五、Android四大组件
* [5.1、Activity](doc/component/activity.md)
    * [5.1.1、Activity初学乍练](doc/component/activity2.md)
    * [5.1.2、Activity初窥门径](doc/component/activity-start.md)
    * [5.1.3、Activity登堂入室](doc/component/activity-intro.md)
* [5.2、Service](doc/component/service.md)
    * [5.2.1、Service初涉](doc/component/service1.md)
    * [5.2.2、Service进阶](doc/component/service2.md)
    * [5.2.3、Service精通](doc/component/service3.md)
* [5.3、BroadcastReceiver](doc/component/broadcastreceiver.md)
    * [5.3.1、BroadcastReceiver牛刀小试](doc/component/broadcastreceiver1.md)
    * [5.3.2、BroadcastReceiver庖丁解牛](doc/component/broadcastreceiver2.md)
* [5.4、ContentProvider](doc/component/contentprovider.md)
    * [5.4.1、ContentProvider初探](doc/component/contentprovider1.md)
    * [5.4.2、ContentProvider再探——Document Provider](doc/component/contentprovider2.md)
* [5.5、Intent](doc/component/intent.md)
    * [5.5.1、Intent的基本使用](doc/component/intent-base.md)
    * [5.5.2、Intent之复杂数据的传递](doc/component/intent-pass-data.md)

## 六、Android之Fragment
* [6.1、Fragment基本概述](doc/fragment/fragment-base.md)
* [6.2、Fragment实例精讲](doc/fragment/fragment-demo.md)
    * [6.2.1、底部导航栏的实现(方法1)](doc/fragment/fragment-demo1.md)
    * [6.2.2、底部导航栏的实现(方法2)](doc/fragment/fragment-demo2.md)
    * [6.2.3、底部导航栏的实现(方法3)](doc/fragment/fragment-demo3.md)
    * [6.2.4、底部导航栏+ViewPager滑动切换页面](doc/fragment/fragment-demo4.md)
    * [6.2.5、新闻(购物)类App列表Fragment的简单实现](doc/fragment/fragment-demo5.md)

## 七、Android数据存储
* [7.1、文件存储读写](doc/store/file.md)
* [7.2、SharedPreferences保存用户偏好参数](doc/store/sharedpreferences.md)
* [7.3、SQLite数据库](doc/store/sqlite.md)
    * [7.3.1、初见SQLite数据库](doc/store/sqlite1.md)
    * [7.3.2、又见SQLite数据库](doc/store/sqlite2.md)

## 八、Android网络通信
* [8.1、Http](doc/network/http.md)
    * [8.1.1、Http协议](doc/network/http-protocol.md)
    * [8.1.2、Http请求头与响应头](doc/network/http-response-header.md)
    * [8.1.3、HttpURLConnection](doc/network/httpurlconnection.md)
    * [8.1.4、HttpClient](doc/network/httpclient.md)
* [8.2、数据解析](doc/network/dataparser.md)
    * [8.2.1、XML数据解析](doc/network/xml.md)
    * [8.2.2、JSON数据解析](doc/network/json.md)
* [8.3、文件上传下载](doc/network/upload-download.md)
    * [8.3.1、文件上传](doc/network/upload-file.md)
    * [8.3.2、文件下载(1)](doc/network/download1.md)
    * [8.3.3、文件下载(2)](doc/network/download2.md)
* [8.4、调用WebService](doc/network/webservice.md)
* [8.5、WebView](doc/network/webview.md)
    * [8.5.1、基本用法](doc/network/webview-base.md)
    * [8.5.2、WebView和JavaScrip交互基础](doc/network/webview-javascrip.md)
    * [8.5.3、Android4.4后WebView的一些注意事项](doc/network/webview-attention.md)
    * [8.5.4、WebView文件下载](doc/network/webview-download-file.md)
    * [8.5.5、WebView缓存问题](doc/network/webview-cache.md)
    * [8.5.6、WebView处理网页返回的错误码信息](doc/network/webview-error-code.md)
* [8.6、Socket](doc/network/socket.md)
    * [8.6.1、Socket学习网络基础准备](doc/network/socket-intro.md)
    * [8.6.2、基于TCP协议的Socket通信(1)](doc/network/tcp1.md)
    * [8.6.3、基于TCP协议的Socket通信(2)](doc/network/tcp2.md)
    * [8.6.4、基于UDP协议的Socket通信](doc/network/udp.md)

## 九、Android自定义控件
* [9.1、Android中的13种Drawable小结](doc/custom/drawable.md)
    * [9.1.1、Part 1](doc/custom/drawable1.md)
    * [9.1.2、Part 2](doc/custom/drawable2.md)
    * [9.1.3、Part 3](doc/custom/drawable3.md)
* [9.2、Bitmap(位图)](doc/custom/bitmap.md)
    * [9.2.1、Bitmap(位图)全解析](doc/custom/bitmap1.md)
    * [9.2.2、Bitmap引起的OOM问题](doc/custom/bitmap2.md)
* [9.3、Canvas(绘图)](doc/custom/canvas.md)
    * [9.3.1、三个绘图工具类详解](doc/custom/drawable-tool.md)
    * [9.3.2、绘图类实战示例](doc/custom/bitmap-demo.md)
    * [9.3.3、Paint API之MaskFilter(面具)](doc/custom/maskfilter.md)
    * [9.3.4、Paint API之Xfermode与PorterDuff详解(1)](doc/custom/xfermode-porterduff1.md)
    * [9.3.5、Paint API之Xfermode与PorterDuff详解(2)](doc/custom/xfermode-porterduff2.md)
    * [9.3.6、Paint API之Xfermode与PorterDuff详解(3)](doc/custom/xfermode-porterduff3.md)
    * [9.3.7、Paint API之Xfermode与PorterDuff详解(4)](doc/custom/xfermode-porterduff4.md)
    * [9.3.8、Paint API之Xfermode与PorterDuff详解(5)](doc/custom/xfermode-porterduff5.md)
    * [9.3.9、Paint API之ColorFilter(颜色过滤器)(1)](doc/custom/colorfilter1.md)
    * [9.3.10、Paint API之ColorFilter(颜色过滤器)(2)](doc/custom/colorfilter2.md)
    * [9.3.11、Paint API之ColorFilter(颜色过滤器)(3)](doc/custom/colorfilter3.md)
    * [9.3.12、Paint API之PathEffect(路径效果)](doc/custom/patheffect.md)
    * [9.3.13、Paint API之Shader(图像渲染)](doc/custom/shader.md)
    * [9.3.14、Paint几个枚举常量值以及ShadowLayer阴影效果](doc/custom/shadowlayer.md)
    * [9.3.15、Paint API之Typeface(字型)](doc/custom/typeface.md)
    * [9.3.16、Canvas API详解(1)](doc/custom/canvas-api1.md)
    * [9.3.17、Canvas API详解(2)剪切方法合集](doc/custom/canvas-api2.md)
    * [9.3.18、Canvas API详解(3)Matrix和drawBitmapMash](doc/custom/canvas-api3.md)
* [9.4、Android动画](doc/custom/animation.md)
    * [9.4.1、帧动画](doc/custom/frameanimation.md)
    * [9.4.2、补间动画](doc/custom/tween.md)
    * [9.4.3、属性动画-初见](doc/custom/valueanimator1.md)
    * [9.4.4、属性动画-又见](doc/custom/valueanimator2.md)

## 十、Android音视频
* [10.1、使用SoundPool播放音效(Duang~)](doc/video/soundpool.md)
* [10.2、MediaPlayer播放音频与视频](doc/video/mediaplayer.md)
* [10.3、使用Camera拍照](doc/video/camera.md)
* [10.4、使用MediaRecord录音](doc/video/mediarecord.md)

## 十一、Android服务管理器
* [11.1、TelephonyManager(电话管理器)](doc/manager/telephonymanager.md)
* [11.2、SmsManager(短信管理器)](doc/manager/smsmanager.md)
* [11.3、AudioManager(音频管理器)](doc/manager/audiomanager.md)
* [11.4、Vibrator(振动器)](doc/manager/vibrator.md)
* [11.5、AlarmManager(闹钟服务)](doc/manager/alarmmanager.md)
* [11.6、PowerManager(电源服务)](doc/manager/powermanager.md)
* [11.7、WindowManager(窗口管理服务)](doc/manager/windowmanager.md)
* [11.8、LayoutInflater(布局服务)](doc/manager/layoutinflater.md)
* [11.9、WallpaperManager(壁纸管理器)](doc/manager/wallpapermanager.md)
* [11.10、传感器专题(1)——相关介绍](doc/manager/sensor1.md)
* [11.11、传感器专题(2)——方向传感器](doc/manager/sensor2.md)
* [11.12、传感器专题(3)——加速度/陀螺仪传感器](doc/manager/sensor3.md)
* [11.13、传感器专题(4)——其他传感器了解](doc/manager/sensor4.md)
* [11.14、Android GPS初涉](doc/manager/gps.md)

## 十二、Android项目实战(看妹子APP)
* [12.1、项目搭建与简单实现](doc/looksister/looksister1.md)
* [12.2、解析后台数据](doc/looksister/looksister2.md)
* [12.3、图片加载优化(写个图片缓存小框架)](doc/looksister/looksister3.md)
* [12.4、添加数据缓存(加入SQLite)](doc/looksister/looksister4.md)
* [12.5、代码回顾，调整与日志类编写](doc/looksister/looksister5.md)
* [12.6、图标制作，混淆，签名打包，APK瘦身，应用发布](doc/looksister/looksister6.md)

## 致谢

| 贡献者                     | 贡献内容               |
| ------------ | ----------- |
| 深情小建                 | 面试指南               |
| 小猪                         | 新手入门              |
| 深情小建                 | 进阶之光               |
| 深情小建                 | 项目实战               |

持续更新，仍有更多内容尚未完善，欢迎大家投稿。