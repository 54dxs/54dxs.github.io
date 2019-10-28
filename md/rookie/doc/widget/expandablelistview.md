## 一、本节引言：
本节要讲解的Adapter类控件是ExpandableListView，就是可折叠的列表，它是ListView的子类， 在ListView的基础上它把应用中的列表项分为几组，每组里又可包含多个列表项。至于样子， 类似于QQ联系人列表，他的用法与ListView非常相似，只是ExpandableListVivew显示的列表项 需由ExpandableAdapter提供。 下面我们来学习这个控件的基本使用！ 官方API：ExpandableListView


## 二、相关属性
- `android:childDivider`：指定各组内子类表项之间的分隔条，图片不会完全显示， 分离子列表项的是一条直线
- `android:childIndicator`：显示在子列表旁边的Drawable对象，可以是一个图像
- `android:childIndicatorEnd`：子列表项指示符的结束约束位置
- `android:childIndicatorLeft`：子列表项指示符的左边约束位置
- `android:childIndicatorRight`：子列表项指示符的右边约束位置
- `android:childIndicatorStart`：子列表项指示符的开始约束位置
- `android:groupIndicator`：显示在组列表旁边的Drawable对象，可以是一个图像
- `android:indicatorEnd`：组列表项指示器的结束约束位置
- `android:indicatorLeft`：组列表项指示器的左边约束位置
- `android:indicatorRight`：组列表项指示器的右边约束位置
- `android:indicatorStart`：组列表项指示器的开始约束位置


## 三、实现ExpandableAdapter的三种方式
1. 扩展`BaseExpandableListAdpter`实现ExpandableAdapter。

2. 使用`SimpleExpandableListAdpater`将两个List集合包装成ExpandableAdapter

3. 使用`simpleCursorTreeAdapter`将Cursor中的数据包装成SimpleCuroTreeAdapter 

本节示例使用的是第一个，扩展BaseExpandableListAdpter，我们需要重写该类中的相关方法， 下面我们通过一个代码示例来体验下！


## 四、代码示例
我们来看下实现的效果图：

![](../img/widget-133.jpg)

下面我们就来实现上图的这个效果：

核心是重写`BaseExpandableListAdpter`，其实和之前写的普通的BaseAdapter是类似的， 但是BaseExpandableListAdpter则分成了两部分：组和子列表，具体看代码你就知道了！

另外，有一点要注意的是，重写`isChildSelectable()`方法需要返回true，不然不会触发 子Item的点击事件！下面我们来写写：

首先是组和子列表的布局：

`item_exlist_group.xml：`
```xml
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:orientation="horizontal"
    android:padding="5dp">

    <TextView
        android:id="@+id/tv_group_name"
        android:layout_width="match_parent"
        android:layout_height="56dp"
        android:gravity="center_vertical"
        android:paddingLeft="30dp"
        android:text="AP"
        android:textStyle="bold"
        android:textSize="20sp" />

</LinearLayout>
```

`item_exlist_item.xml：`
```xml
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:orientation="horizontal"
    android:padding="5dp"
    android:background="#6BBA79">

    <ImageView
        android:id="@+id/img_icon"
        android:layout_width="48dp"
        android:layout_height="48dp"
        android:src="@mipmap/iv_lol_icon1"
        android:focusable="false"/>

    <TextView
        android:id="@+id/tv_name"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_marginLeft="15dp"
        android:layout_marginTop="15dp"
        android:focusable="false"
        android:text="提莫"
        android:textSize="18sp" />

</LinearLayout>
```

然后是自定义的Adapter类：

`MyBaseExpandableListAdapter.java：`
```java
/**
 * Created by Jay on 2015/9/25 0025.
 */
public class MyBaseExpandableListAdapter extends BaseExpandableListAdapter {

    private ArrayList<Group> gData;
    private ArrayList<ArrayList<Item>> iData;
    private Context mContext;

    public MyBaseExpandableListAdapter(ArrayList<Group> gData,ArrayList<ArrayList<Item>> iData, Context mContext) {
        this.gData = gData;
        this.iData = iData;
        this.mContext = mContext;
    }

    @Override
    public int getGroupCount() {
        return gData.size();
    }

    @Override
    public int getChildrenCount(int groupPosition) {
        return iData.get(groupPosition).size();
    }

    @Override
    public Group getGroup(int groupPosition) {
        return gData.get(groupPosition);
    }

    @Override
    public Item getChild(int groupPosition, int childPosition) {
        return iData.get(groupPosition).get(childPosition);
    }

    @Override
    public long getGroupId(int groupPosition) {
        return groupPosition;
    }

    @Override
    public long getChildId(int groupPosition, int childPosition) {
        return childPosition;
    }

    @Override
    public boolean hasStableIds() {
        return false;
    }

    //取得用于显示给定分组的视图. 这个方法仅返回分组的视图对象
    @Override
    public View getGroupView(int groupPosition, boolean isExpanded, View convertView, ViewGroup parent) {

        ViewHolderGroup groupHolder;
        if(convertView == null){
            convertView = LayoutInflater.from(mContext).inflate(
                    R.layout.item_exlist_group, parent, false);
            groupHolder = new ViewHolderGroup();
            groupHolder.tv_group_name = (TextView) convertView.findViewById(R.id.tv_group_name);
            convertView.setTag(groupHolder);
        }else{
            groupHolder = (ViewHolderGroup) convertView.getTag();
        }
        groupHolder.tv_group_name.setText(gData.get(groupPosition).getgName());
        return convertView;
    }

    //取得显示给定分组给定子位置的数据用的视图
    @Override
    public View getChildView(int groupPosition, int childPosition, boolean isLastChild, View convertView, ViewGroup parent) {
        ViewHolderItem itemHolder;
        if(convertView == null){
            convertView = LayoutInflater.from(mContext).inflate(
                    R.layout.item_exlist_item, parent, false);
            itemHolder = new ViewHolderItem();
            itemHolder.img_icon = (ImageView) convertView.findViewById(R.id.img_icon);
            itemHolder.tv_name = (TextView) convertView.findViewById(R.id.tv_name);
            convertView.setTag(itemHolder);
        }else{
            itemHolder = (ViewHolderItem) convertView.getTag();
        }
        itemHolder.img_icon.setImageResource(iData.get(groupPosition).get(childPosition).getiId());
        itemHolder.tv_name.setText(iData.get(groupPosition).get(childPosition).getiName());
        return convertView;
    }

    //设置子列表是否可选中
    @Override
    public boolean isChildSelectable(int groupPosition, int childPosition) {
        return true;
    }


    private static class ViewHolderGroup{
        private TextView tv_group_name;
    }

    private static class ViewHolderItem{
        private ImageView img_icon;
        private TextView tv_name;
    }
}
```

PS：存储子列表的数据不一定要用ArrayList<ArrayList>这种，根据自己的需求 定义~

最后是MainActivity的布局以及Java代码：

布局文件:`activity_main.xml：`
```xml
<RelativeLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:padding="5dp"
    tools:context=".MainActivity">

    <ExpandableListView
        android:id="@+id/exlist_lol"
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        android:childDivider="#E02D2F"/>

</RelativeLayout>
```

`MainActivity.java：`
```java
public class MainActivity extends AppCompatActivity {

    private ArrayList<Group> gData = null;
    private ArrayList<ArrayList<Item>> iData = null;
    private ArrayList<Item> lData = null;
    private Context mContext;
    private ExpandableListView exlist_lol;
    private MyBaseExpandableListAdapter myAdapter = null;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        mContext = MainActivity.this;
        exlist_lol = (ExpandableListView) findViewById(R.id.exlist_lol);


        //数据准备
        gData = new ArrayList<Group>();
        iData = new ArrayList<ArrayList<Item>>();
        gData.add(new Group("AD"));
        gData.add(new Group("AP"));
        gData.add(new Group("TANK"));

        lData = new ArrayList<Item>();

        //AD组
        lData.add(new Item(R.mipmap.iv_lol_icon3,"剑圣"));
        lData.add(new Item(R.mipmap.iv_lol_icon4,"德莱文"));
        lData.add(new Item(R.mipmap.iv_lol_icon13,"男枪"));
        lData.add(new Item(R.mipmap.iv_lol_icon14,"韦鲁斯"));
        iData.add(lData);
        //AP组
        lData = new ArrayList<Item>();
        lData.add(new Item(R.mipmap.iv_lol_icon1, "提莫"));
        lData.add(new Item(R.mipmap.iv_lol_icon7, "安妮"));
        lData.add(new Item(R.mipmap.iv_lol_icon8, "天使"));
        lData.add(new Item(R.mipmap.iv_lol_icon9, "泽拉斯"));
        lData.add(new Item(R.mipmap.iv_lol_icon11, "狐狸"));
        iData.add(lData);
        //TANK组
        lData = new ArrayList<Item>();
        lData.add(new Item(R.mipmap.iv_lol_icon2, "诺手"));
        lData.add(new Item(R.mipmap.iv_lol_icon5, "德邦"));
        lData.add(new Item(R.mipmap.iv_lol_icon6, "奥拉夫"));
        lData.add(new Item(R.mipmap.iv_lol_icon10, "龙女"));
        lData.add(new Item(R.mipmap.iv_lol_icon12, "狗熊"));
        iData.add(lData);

        myAdapter = new MyBaseExpandableListAdapter(gData,iData,mContext);
        exlist_lol.setAdapter(myAdapter);

        //为列表设置点击事件
        exlist_lol.setOnChildClickListener(new ExpandableListView.OnChildClickListener() {
            @Override
            public boolean onChildClick(ExpandableListView parent, View v, int groupPosition, int childPosition, long id) {
                Toast.makeText(mContext, "你点击了：" + iData.get(groupPosition).get(childPosition).getiName(), Toast.LENGTH_SHORT).show();
                return true;
            }
        });
    }
}
```


## 五、代码下载：
[ExpandableListViewDemo.zip](../img/ExpandableListViewDemo.zip)


## 六、本节小结：
好的，本节给大家介绍了ExpandableListView的基本使用，嘿嘿，有点意思~ 这里只是一个示例，其他的根据自己的需求自行扩展~谢谢