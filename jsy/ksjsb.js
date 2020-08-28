auto.waitFor();                                   // 判断和等待开启无障碍
app.launchApp('快手极速版');                        // 只有一个快手极速版所以直接Launch就可以，不用包名
sleep(5000);                                      // 等待splash时间
console.show();                                   // 开启日志（悬浮窗权限）
if (id("redFloat").exists()) {
    console.log("点击redFloat红包");
    let b = id("redFloat").findOne().bounds();
    click(b.centerX(), b.centerY());
    sleep(5000);
}
swipe(device.width/2, device.height-200, device.width/2, 500, 700);
sleep(2000);
if (className("android.widget.Button").text("去签到").exists()) {
    console.log("快手极速版去签到");
    let b = text("去签到").findOne().bounds();
    click(b.centerX(), b.centerY());
    // TODO 关闭按钮也是无ID 无desc的
    // back();
}
else {
    console.log('检测已完成签到')
}
sleep(1000);
console.log('检测是否可领取专属福利')
for (let i=1; i<11; i++) {
    let name = '福利';
    let exist = false;
    if (className('android.widget.Button').text(name).exists()) {
        exist = true;
    }
    if (!exist) {
        name = '福利 领金币';
        if (className('android.widget.Button').text(name).exists()) {
            exist = true;
        }
    }
    if (exist) {
        toastLog('领取专属福利第' + i + '次...');
        sleep(2000);
        let b = className("android.widget.Button").text(name).findOne().bounds();
        let clickResult = click(b.centerX(), b.centerY());
        sleep(16000);
        if (clickResult) {
            if (id("video_close_icon").exists()) {
                let b = id("video_close_icon").findOne().bounds();
                click(b.centerX(), b.centerY());
            }
            if (id("video_countdown").exists()) {
                let b = id("video_countdown").findOne().bounds();
                click(b.centerX(), b.centerY());
            }
        }
        sleep(1000);
    }
    else {
        toastLog('专属福利已领取');
        sleep(1000);
        break;
    }
}

back();

toastLog('滑动赚取金币');

for (let i=0; i<1000; i++)
{
    swipe(device.width/2, device.height-200, device.width/2, 500, 700);
    let delayTime = random(6000, 9000);
    sleep(delayTime);
}

toastLog('结束操作，准备退出');
sleep(1000);
stopApp('快手极速版');                              // 停止App
home();

/**
 * 强制停止App
 * @param {*} appName 
 */
function stopApp(appName) {
    openAppSetting(getPackageName(appName));
    console.show();
    sleep(3000);
    if (className("android.widget.Button").text("强行停止").exists()) {
        console.info("强行停止");
    }
    className("android.widget.Button").text("强行停止").findOne().click();
    try {
        sleep(3000);
        if (className("android.widget.Button").text("确定").exists()) {
            className("android.widget.Button").text("确定").findOne().click();
            toastLog(appName + "已经停止！");
        }
        else {
            let closeButton = className("android.widget.Button").text("强行停止").find();
            console.info(closeButton.length);
            console.info(closeButton[0].bounds());
            closeButton[0].click();
            toastLog(appName + "已经停止！");
        }
    }
    catch (e) {
        toastLog(e);
    }
}