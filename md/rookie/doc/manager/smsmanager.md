## 一、本节引言：
本节带来的是Android中的SmsManager(短息管理器)，见名知意，就是用来管理手机短信的， 而该类的应用场景并不多，一般是我们发短信的时候才会用到这个API，当然这种短信是 文字短信，对于彩信过于复杂，而且在QQ微信各种社交APP横行的年代，你会去发1块钱一条的 彩信吗？所以本节我们只讨论发送普通文字短信！ 官方文档：SmsManager


## 二、调用系统发送短信功能：
就是把写好的收信人和内容发送到系统的发送短信的界面，用户验证收件人内容是否真正确再点击发送! 说白了就是调用系统发短信的窗口,这样做有一定的好处:

这样发短信,app安装的时候就可以少写一条发短信的权限，那么诸如360这类安全软件在安装的时候 就不会提醒用户："这个APP有短信权限，可能会偷偷滴发短信喔"，而用户对于偷偷发短信的行为是十分 厌恶的，当然有些人不看直接安装，而有些人可能会觉得会偷偷发短信喔，好恶心的应用，我才不装咧， 又或者直接禁止我们的APP发送短信，那么当我们APP在发送短信的时候就可能会出现一些异常，或者 应用直接崩溃等！所以如果你的应用需要发送短信进行验证或者付费这些东西的话,建议使用这种方式!

核心代码：
```java
public void SendSMSTo(String phoneNumber,String message){    
    //判断输入的phoneNumber是否为合法电话号码  
    if(PhoneNumberUtils.isGlobalPhoneNumber(phoneNumber)){  
        //Uri.parse("smsto") 这里是转换为指定Uri,固定写法  
        Intent intent = new Intent(Intent.ACTION_SENDTO, Uri.parse("smsto:"+phoneNumber));        
        intent.putExtra("sms_body", message);              
        startActivity(intent);    
    }    
}    
```


## 三、调用系统提供的短信接口发送短信
这个就需要发短信的权限啦

`uses-permission android:name="android.permission.SEND_SMS"/>`

我们直接调用SmsManager为我们提供的短信接口发送短信：

`sendTextMessage(destinationAddress, scAddress, text, sentIntent, deliverIntent);`

参数依次是：

- destinationAddress：收信人的电话号码
- scAddress：短信中心的号码,null的话使用当前默认的短信服务中心
- text：短信内容
- sentIntent：短信发送状态的信息:(发送状态的Intent) 如果不为null，当消息成功发送或失败这个PendingIntent就广播。结果代码是Activity.RESULT_OK 表示成功，或RESULT_ERROR_GENERIC_FAILURE、RESULT_ERROR_RADIO_OFF、RESULT_ERROR_NULL_PDU 之一表示错误。对应RESULT_ERROR_GENERIC_FAILURE，sentIntent可能包括额外的"错误代码"包含一 个无线电广播技术特定的值，通常只在修复故障时有用。每一个基于SMS的应用程序控制检测sentIntent。 如果sentIntent是空，调用者将检测所有未知的应用程序，这将导致在检测的时候发送较小数量的SMS。
- deliverIntent：短信是否被对方收到的状态信息:(接收状态的Intent) 如果不为null，当这个短信发送到接收者那里，这个PendtingIntent会被广播， 状态报告生成的pdu（指对等层次之间传递的数据单位）会拓展到数据（"pdu"）
...那么复杂，pdu是什么卵？好吧，别纠结，简单知道这些参数是：

电话号码，信息中心，短信内容，是否发送成功的监听，以及收信人是否接受的监听就好了！

核心代码：
```java
public void sendSMS(String phoneNumber,String message){  
    //获取短信管理器   
    android.telephony.SmsManager smsManager = android.telephony.SmsManager.getDefault();  
    //拆分短信内容（手机短信长度限制）,貌似长度限制为140个字符,就是
    //只能发送70个汉字,多了要拆分成多条短信发送
    //第四五个参数,如果没有需要监听发送状态与接收状态的话可以写null    
    List<String> divideContents = smsManager.divideMessage(message);   
    for (String text : divideContents) {    
        smsManager.sendTextMessage(phoneNumber, null, text, sentPI, deliverPI);    
    }  
} 
```

可能你还需要监听短信是否发送成功，或者收信人是否接收到信息，就把下面的加上吧：


### 1）处理返回发送状态的sentIntent
```java
//处理返回的发送状态   
String SENT_SMS_ACTION = "SENT_SMS_ACTION";  
Intent sentIntent = new Intent(SENT_SMS_ACTION);  
PendingIntent sentPI = PendingIntent.getBroadcast(context, 0, sentIntent,  0);  
//注册发送信息的广播接收者
context.registerReceiver(new BroadcastReceiver() {  
    @Override  
    public void onReceive(Context _context, Intent _intent) {  
        switch (getResultCode()) {  
        case Activity.RESULT_OK:
            Toast.makeText(context, "短信发送成功", Toast.LENGTH_SHORT).show();  
            break;  
        case SmsManager.RESULT_ERROR_GENERIC_FAILURE:    //普通错误
            break;
        case SmsManager.RESULT_ERROR_RADIO_OFF:         //无线广播被明确地关闭
            break;          
        case SmsManager.RESULT_ERROR_NULL_PDU:          //没有提供pdu
            break;      
        case SmsManager.RESULT_ERROR_NO_SERVICE:         //服务当前不可用
            break;              
        }  
    }  
}, new IntentFilter(SENT_SMS_ACTION)); 
```


### 2）处理返回接收状态的deliverIntent：
```java
//处理返回的接收状态   
String DELIVERED_SMS_ACTION = "DELIVERED_SMS_ACTION";  
//创建接收返回的接收状态的Intent  
Intent deliverIntent = new Intent(DELIVERED_SMS_ACTION);  
PendingIntent deliverPI = PendingIntent.getBroadcast(context, 0,deliverIntent, 0);  
context.registerReceiver(new BroadcastReceiver() {  
   @Override  
   public void onReceive(Context _context, Intent _intent) {  
       Toast.makeText(context,"收信人已经成功接收", Toast.LENGTH_SHORT).show();  
   }  
}, new IntentFilter(DELIVERED_SMS_ACTION)); 
```

另外这里涉及到了广播的知识，如果你对广播不怎么了解的话，可以看下：

[5.3.1、BroadcastReceiver牛刀小试](../component/broadcastreceiver1.html)

[5.3.2、BroadcastReceiver庖丁解牛](../component/broadcastreceiver2.html)


## 四、本节小结：
好的，本节介绍了SmsManager发送文字短信的两种方式~非常简单~建议还是使用 第一种方案吧，起码用户体验好一点...