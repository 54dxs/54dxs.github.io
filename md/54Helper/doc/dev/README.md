# 插件使用说明
2.19. 警报
这两个警报插件类似，其中的图标文件有些可以共用
2.19.1. alerts 警报
这个GitBook插件将块引用转换为漂亮的警报。
插件地址
在book.json中添加以下内容。然后执行gitbook install，或者使用NPM安装npm install gitbook-plugin-flexible-alerts
{
    "plugins": ["alerts"]
}

用法样式：
信息样式
> **[info] For info**
>
> Use this for infomation messages.

警告造型
> **[warning] For warning**
>
> Use this for warning messages.

危险造型
> **[danger] For danger**
>
> Use this for danger messages.

成功造型
> **[success] For success**
>
> Use this for success messages.

2.19. flexible-alerts  警报
这个GitBook插件将块引用转换为漂亮的警报。可以在全局和警报特定级别配置外观，因此输出确实符合您的需求（如下图）。此外，您还可以提供自己的警报类型（比如最后的comment）。

插件地址
GitHub地址
这个看上面那个链接里的内容更丰富一点

在你的gitbook的book.json文件中，添加flexible-alerts到插件列表。
在pluginsConfig中，配置插件以满足您的需求。自定义设置不是必需的。

简单使用

在book.json中添加以下内容。然后执行gitbook install，或者使用NPM安装npm install gitbook-plugin-flexible-alerts，也可以从源码GitHub地址中下载，放到node_modules文件夹里（GitHub地址在进入插件地址右侧的GitHub链接）

{
  "plugins": [
      "flexible-alerts"
  ]
}


markdown文件中编辑
简单的markdown文件写法，效果见上图 19 的第一个图：

> [!NOTE]
> 这是一个简单的Note类型的使用，所有的属性都是默认值。

上面的[!NOTE]是行匹配模式，默认情况下支持类型NOTE，TIP，WARNING和DANGER。
可以通过提供有效配置来扩展可用类型（请参阅这一节最下面的示例COMMENT）

个性化使用：
在markdown中的个性化语法
> [!type|style:xx|label:xx|icon:xx|className:xx|labelVisibility:xx|iconVisibility:xx]
> 内容部分

字段介绍，如果不设置的表示选择默认，除了!type都不是必需

键
允许的值
说明




!type

NOTE，TIP，WARNING和DANGER

警告级别设置


style
以下值之一:  callout（默认）, flat

警告样式，见图19的左右不同


label
任何文字
警告块的标题位置，即Note这个字段位置（不支持中文）


icon
e.g. 'fa fa-info-circle'
一个有效的Font Awesome图标，那块小符号


className
CSS类的名称
指定css文件，用于指定外观


labelVisibility
以下值之一：visible（默认），hidden

标签是否可见


iconVisibility
以下值之一：visible（默认），hidden

图标是否可见



对比：
> [!NOTE]
> 这是一个简单的Note类型的使用，所有的属性都是默认值。

---

> [!NOTE|style:flat|lable:Mylable|iconVisibility:hidden]
> "!type":`NOTE`、"style":`flat`、"lable":`自定义标签`、图标不可见

效果：








json配置个性化
自定义一个COMMENT类型
在book.json中添加以下内容。然后执行gitbook install，或者使用NPM安装npm install gitbook-plugin-flexible-alerts，也可以从源码GitHub地址中下载，放到node_modules文件夹里（GitHub地址在进入插件地址右侧的GitHub链接）
{
    "plugins": [
      "flexible-alerts"
    ],
    "pluginsConfig": {
      "flexible-alerts": {
        "style": "callout",
        "comment": {
          "label": "Comment",
          "icon": "fa fa-comments",
          "className": "info"
        }
      }
    }
}

示例：
> [!COMMENT]
> An alert of type 'comment' using style 'callout' with default settings.
