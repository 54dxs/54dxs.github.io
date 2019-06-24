# 2.13. sectionx 将页面分块显示

<!--sec data-title="示例一：百度搜索结果过滤器" data-id="section0" data-show=true data-collapse=true ces-->
**示例一：**  
*网页精灵名称：*`百度搜索结果过滤器`  
*网址匹配规则：*`https://www.baidu.com/`  
*网页特效设定：*`（可选）`  
*网页自动刷新：*`（可选）`  
*精灵注入脚本：*（Tips：可以注入任意JS代码，甚至编写一个智能机器人也是可以的，比如网页定制、自动抢票啥的！）  
```javascript
// 以下代码将会红框标识百度推广广告（注：网址匹配规则填写为https://www.baidu.com/）
function adFun() {
	document.querySelectorAll("div[cmatchid]").forEach((item) => {
		item.parentNode.removeChild(item);
	});
	document.querySelectorAll(".result").forEach((item) => {
		item.querySelectorAll("span").forEach((itemSpan) => {
			if (itemSpan.innerHTML.indexOf("广告") != -1) {
				item.parentNode.removeChild(item);
			}
		})
	})
	setTimeout(adFun, 2000);
};
adFun();
```
<!--endsec-->

<!--sec data-title="示例二：CSDN广告屏蔽" data-id="section2" data-show=true data-collapse=true ces-->
**示例二：**  
*网页精灵名称：*`CSDN广告屏蔽`  
*网址匹配规则：*`https://blog.csdn.net/`  
*网页特效设定：*`（可选）`  
*网页自动刷新：*`（可选）`  
*精灵注入脚本：*`（Tips：可以注入任意JS代码，甚至编写一个智能机器人也是可以的，比如网页定制、自动抢票啥的！）  `
```javascript
document.querySelectorAll("aside,.recommend-right,#dmp_ad_58,#commentBox,.comment-box,.recommend-box,iframe").forEach((item) => {item.parentNode.removeChild(item)});
document.querySelectorAll("main").forEach((item) => {item.style.cssText="margin:0 auto; float: none;"});
```
<!--endsec-->
