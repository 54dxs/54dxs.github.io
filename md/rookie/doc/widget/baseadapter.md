## 一、本节引言：
上一节中我们学习了如何来使用一个ListView以及自定义一个简单的BaseAdapter，我们从代码 中可以看出比较重要的两个方法:getCount()和getView()，界面上有多少列就会调用多少次getView， 这个时候可能看出一些端倪，每次都是新inflate一个View，都要进行这个XML的解析，这样会 很浪费资源，当然，几十列或者几百列的列表并不能体现什么问题，但假如更多或者布局更加复杂？ 所以学习ListView的优化很重要，而本节针对的是BaseAdapter的优化，优化的两点有，复用convertView 以及使用ViewHolder重用组件，不用每次都findViewById，我们具体通过代码来体会吧！


## 二、复用ConvertView：
上面也说了，界面上有多少个Item，那么getView方法就会被调用多少次！ 我们来看看上一节我们写的getView()部分的代码：

```java
@Override
public View getView(int position, View convertView, ViewGroup parent) {
    convertView = LayoutInflater.from(mContext).inflate(R.layout.item_list_animal,parent,false);
    ImageView img_icon = (ImageView) convertView.findViewById(R.id.img_icon);
    TextView txt_aName = (TextView) convertView.findViewById(R.id.txt_aName);
    TextView txt_aSpeak = (TextView) convertView.findViewById(R.id.txt_aSpeak);

    img_icon.setBackgroundResource(mData.get(position).getaIcon());
    txt_aName.setText(mData.get(position).getaName());
    txt_aSpeak.setText(mData.get(position).getaSpeak());
    return convertView;
}
```

是吧，inflate()每次都要加载一次xml，其实这个convertView是系统提供给我们的可供复用的View 的缓存对象，那就做下判断咯，修改下，优化后的代码：

```java
@Override
public View getView(int position, View convertView, ViewGroup parent) {

    if(convertView == null){
        convertView = LayoutInflater.from(mContext).inflate(R.layout.item_list_animal,parent,false);
    }

    ImageView img_icon = (ImageView) convertView.findViewById(R.id.img_icon);
    TextView txt_aName = (TextView) convertView.findViewById(R.id.txt_aName);
    TextView txt_aSpeak = (TextView) convertView.findViewById(R.id.txt_aSpeak);

    img_icon.setBackgroundResource(mData.get(position).getaIcon());
    txt_aName.setText(mData.get(position).getaName());
    txt_aSpeak.setText(mData.get(position).getaSpeak());
    return convertView;
}
```


## 三、ViewHolder重用组件
嘿嘿，getView()会被调用多次，那么findViewById不一样得调用多次，而我们的ListView的Item 一般都是一样的布局，我们可以对这里再优化下，我们可以自己定义一个ViewHolder类来对这一部分 进行性能优化！修改后的代码如下：

```java
@Override
public View getView(int position, View convertView, ViewGroup parent) {
    ViewHolder holder = null;
    if(convertView == null){
        convertView = LayoutInflater.from(mContext).inflate(R.layout.item_list_animal,parent,false);
        holder = new ViewHolder();
        holder.img_icon = (ImageView) convertView.findViewById(R.id.img_icon);
        holder.txt_aName = (TextView) convertView.findViewById(R.id.txt_aName);
        holder.txt_aSpeak = (TextView) convertView.findViewById(R.id.txt_aSpeak);
        convertView.setTag(holder);   //将Holder存储到convertView中
    }else{
        holder = (ViewHolder) convertView.getTag();
    }
    holder.img_icon.setBackgroundResource(mData.get(position).getaIcon());
    holder.txt_aName.setText(mData.get(position).getaName());
    holder.txt_aSpeak.setText(mData.get(position).getaSpeak());
    return convertView;
}

static class ViewHolder{
    ImageView img_icon;
    TextView txt_aName;
    TextView txt_aSpeak;
}
```

没错就是这么简单，你以后BaseAdapter照着这个模板写就对了，哈哈，另外这个修饰ViewHolder的 static，关于是否定义成静态，跟里面的对象数目是没有关系的，加静态是为了在多个地方使用这个 Holder的时候，类只需加载一次，如果只是使用了一次，加不加也没所谓！——Berial(B神)原话~


## 四、本节小结：
好的，关于BaseAdapter的优化大概就上述的两种，非常简单，复用ConvertView以及自定义ViewHolder 减少findViewById()的调用~如果你有其他关于BaseAdapter优化的建议欢迎提出，谢谢~