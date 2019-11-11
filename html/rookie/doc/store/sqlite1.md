## 一、本节引言：
本节我们继续来学习Android数据存储与访问的第三种方式：SQLite数据库，和其他的SQL数据库不同， 我们并不需要在手机上另外安装一个数据库软件，Android系统已经集成了这个数据库，我们无需像 使用其他数据库软件(Oracle，MSSQL，MySql等)又要安装，然后完成相关配置，又要改端口之类的！ 引言就说这么多，接下来我们来学习下这个东西~


## 二、基本概念
### 1）SQLite是什么？为什么要用SQLite？SQLite有什么特点？
答：下面请听小猪娓娓道来：

- ①SQLite是一个轻量级的关系型数据库，运算速度快，占用资源少，很适合在移动设备上使用， 不仅支持标准SQL语法，还遵循ACID(数据库事务)原则，无需账号，使用起来非常方便！

- ②前面我们学习了使用文件与SharedPreference来保存数据,但是在很多情况下， 文件并不一定是有效的,如多线程并发访问是相关的；app要处理可能变化的复杂数据结构等等！ 比如银行的存钱与取钱！使用前两者就会显得很无力或者繁琐，数据库的出现可以解决这种问题， 而Android又给我们提供了这样一个轻量级的SQLite，为何不用？

- ③SQLite支持五种数据类型:NULL,INTEGER,REAL(浮点数),TEXT(字符串文本)和BLOB(二进制对象) 虽然只有五种,但是对于varchar,char等其他数据类型都是可以保存的;因为SQLite有个最大的特点: 你可以各种数据类型的数据保存到任何字段中而不用关心字段声明的数据类型是什么,比如你 可以在Integer类型的字段中存放字符串,当然除了声明为主键INTEGER PRIMARY KEY的字段只能够存储64位整数！ 另外， SQLite 在解析CREATE TABLE 语句时， 会忽略 CREATE TABLE 语句中跟在字段名后面的数据类型信息如下面语句会忽略 name字段的类型信息： CREATE TABLE person (personid integer primary key autoincrement, name varchar(20))

**小结下特点：**

SQlite通过文件来保存数据库，一个文件就是一个数据库，数据库中又包含多个表格，表格里又有 多条记录，每个记录由多个字段构成，每个字段有对应的值，每个值我们可以指定类型，也可以不指定 类型(主键除外)

PS：对了，Android内置的SQLite是SQLite 3版本的~


### 2）几个相关的类：
嘿嘿，学习一些新东西的时候，最不喜欢的莫过于遇到一些新名词，是吧，我们先来说下几个 我们在使用数据库时用到的三个类：

- SQLiteOpenHelper：抽象类，我们通过继承该类，然后重写数据库创建以及更新的方法， 我们还可以通过该类的对象获得数据库实例，或者关闭数据库！
- SQLiteDatabase：数据库访问类：我们可以通过该类的对象来对数据库做一些增删改查的操作
- Cursor：游标，有点类似于JDBC里的resultset，结果集！可以简单理解为指向数据库中某 一个记录的指针！


## 三、使用SQLiteOpenHelper类创建数据库与版本管理
对于涉及数据库的app,我们不可能手动地去给他创建数据库文件,所以需要在第一次启用app 的时候就创建好数据库表;而当我们的应用进行升级需要修改数据库表的结构时,这个时候就需要 对数据库表进行更新了;对于这两个操作,安卓给我们提供了`SQLiteOpenHelper`的两个方法, `onCreate()`与`onUpgrade()`来实现

方法解析：

- onCreate(database):首次使用软件时生成数据库表
- onUpgrade(database,oldVersion,newVersion):在数据库的版本发生变化时会被调用， 一般在软件升级时才需改变版本号，而数据库的版本是由程序员控制的，假设数据库现在的 版本是1，由于业务的变更，修改了数据库表结构，这时候就需要升级软件，升级软件时希望 更新用户手机里的数据库表结构，为了实现这一目的，可以把原来的数据库版本设置为2 或者其他与旧版本号不同的数字即可！

代码示例：
```java
public class MyDBOpenHelper extends SQLiteOpenHelper {
    public MyDBOpenHelper(Context context, String name, CursorFactory factory,
            int version) {super(context, "my.db", null, 1); }
    @Override
    //数据库第一次创建时被调用
    public void onCreate(SQLiteDatabase db) {
        db.execSQL("CREATE TABLE person(personid INTEGER PRIMARY KEY AUTOINCREMENT,name VARCHAR(20))");
        
    }
    //软件版本号发生改变时调用
    @Override
    public void onUpgrade(SQLiteDatabase db, int oldVersion, int newVersion) {
        db.execSQL("ALTER TABLE person ADD phone VARCHAR(12) NULL");
    }
}
```

代码解析：

>上述代码第一次启动应用，我们会创建这个my.db的文件，并且会执行onCreate()里的方法， 创建一个Person的表，他又两个字段，主键personId和name字段；接着如我我们修改db的版本 号，那么下次启动就会调用onUpgrade()里的方法，往表中再插入一个字段！另外这里是插入 一个字段，所以数据不会丢失，如果是重建表的话，表中的数据会全部丢失，下一节我们会 来教大家如何解决这个问题！

流程小结：

- Step 1：自定义一个类继承SQLiteOpenHelper类
- Step 2：在该类的构造方法的super中设置好要创建的数据库名,版本号
- Step 3：重写onCreate( )方法创建表结构
- Step 4：重写onUpgrade( )方法定义版本号发生改变后执行的操作


## 四、如何查看我们生成的db文件
当我们调用上面的MyDBOpenhelper的对象的getWritableDatabase()就会在下述目录下创建我们的db 数据库文件：

![](../img/store-29.jpg)

我们发现数据库有两个，前者是我们创建的数据库，而后者则是为了能让数据库支持事务而产生的 临时的日志文件！一般的大小是0字节！ 而在File Explorer里我们确是打不开文件的，连txt都打不开，何况是.db！ 所以下面给大家两条路选：

1. 先导出来，然后用SQLite的图形化工具查看
2. 配置adb环境变量后，通过adb shell来查看(命令行，装比利器)！

嗯，接着给大家演示上述两种方法，选自己喜欢的一种就可以了~~

### 方法1：使用SQLite图形化工具查看db文件
这类软件有很多，笔者用的是SQLite Expert Professional，当然你也可以使用其他工具 有需要的可以下载：[SQLiteExpert.zip](https://pan.baidu.com/s/1gvhyVllIwuHVkbc8athZOA)

把我们的db文件导出到电脑桌面，打开SQLiteExpert，界面如下：

![](../img/store-30.jpg)

别问我怎么玩，导入db后自己慢慢玩，用法很简单，不懂百度~

至于方法二，本来是想试试的，后来发现sqlite命令找不到，试了几次就算了， 后面用到在细扣，有兴趣可以找下郭霖的《第一行代码——Android》按着流程图试试！ 这里只贴前面的一部分，命令部分自己看书！


### 方法2：adb shell命令行带你装逼带你飞
1.配置SDK环境变量：

右键我的电脑 ——> 高级系统设置 -> 环境变量 -> 新建系统变量 -> 把SDK的platform-tools路径拷贝下： 比如笔者的：C:\Software\Coding\android-sdks-as\platform-tools

![](../img/store-31.jpg)

确定，然后再找到Path的环境变量，编辑，然后在结尾加上：`%SDK_HOME%`;

![](../img/store-32.jpg)

然后打开命令行，输入adb，唰唰唰一堆东西，就说明配置成功了！

——————重点——————： 在执行后续命令行指令之前，针对你的测试的机器可能有几种： 1.原生模拟器：那行，你跳过这里，继续往下 2.Genymotion模拟器：没戏，Genymotion Shell执行不了下述命令 3.真机(已root)：那么你打开File Explorer看看data/data/目录下有东西没？没么？ 下面提供一个方法，就是先装个RE文件管理器，然后授予RE Root权限，接着来到根目录： 然后长按data目录，会弹出这样的对话框：

![](../img/store-33.jpg)
![](../img/store-34.jpg)

接着等他慢慢修改权限，修改完毕后，我们再次打开DDMS的File Explorer，我们可以看到：

![](../img/store-35.jpg)

好的，可以看到data/data里的东西了！ ——————————————————————

2.进入adb shell，接着键入下述指令，来到我们app的databases目录下：

![](../img/store-36.jpg)

接着依次输入下述指令：

- `sqlite3 my.db` ：打开数据库文件
- `.table` 查看数据库中有哪些表 接着你直接输入数据库语句就可以了，比如查询：Select * from person
- `.schema`：查看建表语句
- `.quit`：退出数据库的编辑
- `.exit`：退出设备控制台

...因为system/bin/sh sqlite3: not found，这个问题，后面Sqlite命令的都用不了， 要看效果图就自行查询郭大侠的书吧~而下面我们还是先导出db文件，然后用图形化的 数据库工具来查看！


## 五、使用Android提供的API操作SQLite
假如你没学过数据库相关的语法，或者你懒，不想写数据库语法，就可以使用Android给我们 提供的操作数据库的一些API方法，下面我们写个简单的例子来掩饰下这些API的用法！

代码示例：
运行效果图：

![](../img/store-37.jpg)

实现代码：

布局过于简单，就四个Button，就不贴了，直接贴`MainActivity.java`的代码：
```java
public class MainActivity extends AppCompatActivity implements View.OnClickListener {

    private Context mContext;
    private Button btn_insert;
    private Button btn_query;
    private Button btn_update;
    private Button btn_delete;
    private SQLiteDatabase db;
    private MyDBOpenHelper myDBHelper;
    private StringBuilder sb;
    private int i = 1;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        mContext = MainActivity.this;
        myDBHelper = new MyDBOpenHelper(mContext, "my.db", null, 1);
        bindViews();
    }

    private void bindViews() {
        btn_insert = (Button) findViewById(R.id.btn_insert);
        btn_query = (Button) findViewById(R.id.btn_query);
        btn_update = (Button) findViewById(R.id.btn_update);
        btn_delete = (Button) findViewById(R.id.btn_delete);

        btn_query.setOnClickListener(this);
        btn_insert.setOnClickListener(this);
        btn_update.setOnClickListener(this);
        btn_delete.setOnClickListener(this);
    }

    @Override
    public void onClick(View v) {
        db = myDBHelper.getWritableDatabase();
        switch (v.getId()) {
            case R.id.btn_insert:
                ContentValues values1 = new ContentValues();
                values1.put("name", "呵呵~" + i);
                i++;
                //参数依次是：表名，强行插入null值得数据列的列名，一行记录的数据
                db.insert("person", null, values1);
                Toast.makeText(mContext, "插入完毕~", Toast.LENGTH_SHORT).show();
                break;
            case R.id.btn_query:
                sb = new StringBuilder();
                //参数依次是:表名，列名，where约束条件，where中占位符提供具体的值，指定group by的列，进一步约束
                //指定查询结果的排序方式
                Cursor cursor = db.query("person", null, null, null, null, null, null);
                if (cursor.moveToFirst()) {
                    do {
                        int pid = cursor.getInt(cursor.getColumnIndex("personid"));
                        String name = cursor.getString(cursor.getColumnIndex("name"));
                        sb.append("id：" + pid + "：" + name + "\n");
                    } while (cursor.moveToNext());
                }
                cursor.close();
                Toast.makeText(mContext, sb.toString(), Toast.LENGTH_SHORT).show();
                break;
            case R.id.btn_update:
                ContentValues values2 = new ContentValues();
                values2.put("name", "嘻嘻~");
                //参数依次是表名，修改后的值，where条件，以及约束，如果不指定三四两个参数，会更改所有行
                db.update("person", values2, "name = ?", new String[]{"呵呵~2"});
                break;
            case R.id.btn_delete:
                //参数依次是表名，以及where条件与约束
                db.delete("person", "personid = ?", new String[]{"3"});
                break;
        }
    }
}
```


## 六、使用SQL语句操作数据库
当然，你可能已经学过SQL，会写相关的SQL语句，而且不想用Android提供的这些API， 你可以直接使用SQLiteDatabase给我们提供的相关方法：

- execSQL(SQL,Object[]):使用带占位符的SQL语句,这个是执行修改数据库内容的sql语句用的
- rawQuery(SQL,Object[]):使用带占位符的SQL查询操作 另外前面忘了介绍下Curosr这个东西以及相关属性，这里补充下： ——Cursor对象有点类似于JDBC中的ResultSet,结果集!使用差不多,提供一下方法移动查询结果的记录指针:
- move(offset):指定向上或者向下移动的行数,整数表示向下移动;负数表示向上移动！
- moveToFirst():指针移动到第一行,成功返回true,也说明有数据
- moveToLast():指针移动到最后一样,成功返回true;
- moveToNext():指针移动到下一行,成功返回true,表明还有元素！
- moveToPrevious():移动到上一条记录
- getCount( )获得总得数据条数
- isFirst():是否为第一条记录
- isLast():是否为最后一项
- moveToPosition(int):移动到指定行

使用代码示例：

### 1.插入数据：
```java
public void save(Person p){
    SQLiteDatabase db = dbOpenHelper.getWritableDatabase();
    db.execSQL("INSERT INTO person(name,phone) values(?,?)",
                new String[]{p.getName(),p.getPhone()});
}
```


### 2.删除数据：
```java
public void delete(Integer id) {
    SQLiteDatabase db = dbOpenHelper.getWritableDatabase();
    db.execSQL("DELETE FROM person WHERE personid = ?",
                new String[]{id});
}
```


### 3.修改数据：
```java
public void update(Person p){
    SQLiteDatabase db = dbOpenHelper.getWritableDatabase();
    db.execSQL("UPDATE person SET name = ?,phone = ? WHERE personid = ?",
        new String[]{p.getName(),p.getPhone(),p.getId()});
}
```


### 4.查询数据：
```java
public Person find(Integer id){
    SQLiteDatabase db = dbOpenHelper.getReadableDatabase();
    Cursor cursor =  db.rawQuery("SELECT * FROM person WHERE personid = ?",
            new String[]{id.toString()});
    //存在数据才返回true
    if(cursor.moveToFirst()){
        int personid = cursor.getInt(cursor.getColumnIndex("personid"));
        String name = cursor.getString(cursor.getColumnIndex("name"));
        String phone = cursor.getString(cursor.getColumnIndex("phone"));
        return new Person(personid,name,phone);
    }
    cursor.close();
    return null;
}
```


### 5.数据分页：
```java
public List<Person> getScrollData(int offset,int maxResult){
    List<Person> person = new ArrayList<Person>();
    SQLiteDatabase db = dbOpenHelper.getReadableDatabase();
    Cursor cursor =  db.rawQuery("SELECT * FROM person ORDER BY personid ASC LIMIT= ?,?",
        new String[]{String.valueOf(offset),String.valueOf(maxResult)});
    while(cursor.moveToNext()){
        int personid = cursor.getInt(cursor.getColumnIndex("personid"));
        String name = cursor.getString(cursor.getColumnIndex("name"));
        String phone = cursor.getString(cursor.getColumnIndex("phone"));
        person.add(new Person(personid,name,phone)) ;
    }
    cursor.close();
    return person;
}
```


### 6.查询记录数：
```java
public long getCount(){
    SQLiteDatabase db = dbOpenHelper.getReadableDatabase();
    Cursor cursor =  db.rawQuery("SELECT COUNT (*) FROM person",null);
    cursor.moveToFirst();
    long result = cursor.getLong(0);
    cursor.close();
    return result;      
}   
```


PS：除了上面获取条数的方法外还可以使用cursor.getCount()方法获得数据的条数, 但是SQL语句要改改！比如SELECT * FROM person;


## 七、本节小结：
本节给大家介绍了Android内置SQLite的基本用法，还是比较简单的，下一节再来研究点稍微 高级一点的东西，SQLite事务，应用更新数据库里数据怎么处理，以及数据库存储大二进制文件 的方法！好的，本节就到这里~