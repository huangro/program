auto.waitFor();
console.show();                                 // 显示调试日志输出面板
runMap('环境2');
// console.clear();
// console.hide();
// home();


// if (className('android.widget.LinearLayout').depth(11).indexInParent(0)) {
//     console.log('在xx抹机中点击光.遇');
//     let b = className('android.widget.LinearLayout').depth(11).indexInParent(0).findOne().bounds();
//     console.log(b);
//     click(b.centerX(), b.centerY());
//     sleep(3000);
//     className('android.widget.ListView').findOne().children().forEach(child => {
//         var target = child.findOne(className('android.widget.RelativeLayout'));
//         console.log(target);
//     });
// }

/**
 * 跑图流程
 * xx抹机神器：[zpp.wjy.xxsq]
 */
function runMap(envName) {
    let step = 0;
    let appName = 'xx抹机神器';
    console.log('清除['+appName+']后台进程');
    stopApp(appName);
    // switchFlightMode();
    console.log('打开['+appName+']');
    app.launchApp(appName);
    sleep(5000);
    if (id("iv_envlist").exists()) {
        console.log('选择沙盒环境');
        id("iv_envlist").findOne().click();
        sleep(3000);
        id('recycler_envs').findOne().children().some(child => {
            var target = child.findOne(id('tv_name'));
            if (target.text() == envName) {
                console.log('找到匹配的沙盒环境：' + envName);
                target.parent().click();
                sleep(3000);
                let c = id('layout_use').findOne();
                c.click();
                console.log('切换到新沙盒环境：' + envName);
                sleep(10000);
                step = 1;
                return true;
            }
        });
    }
    if (step == 1) {
        console.log('开始准备光.遇环境');
        className('android.widget.HorizontalScrollView').findOne().children().some(child => {
            let t = child.child(0).child(0).bounds();
            console.log(t.centerX() + '--' + t.centerY());
            click(t.centerX(), t.centerY());
            sleep(3000);
        });
    }
}

/**
 * 切换飞行模式，使网络刷新
 */
function switchFlightMode() {
    var intent = new Intent();
    intent.setAction('android.settings.AIRPLANE_MODE_SETTINGS');
    app.startActivity(intent);
    sleep(2000);
    openMode();
    sleep(3000);
    closeMode();
    sleep(6000);
    back();

    function openMode() {
        console.log('飞行模式开启...');
        if (className('android.widget.TextView').text('飞行模式').exists()) {
            let b = className('android.widget.TextView').text('飞行模式').findOne().parent().parent();
            b.click();
        }
    }

    function closeMode() {
        console.log('飞行模式关闭...');
        if (className('android.widget.TextView').text('飞行模式').exists()) {
            let b = className('android.widget.TextView').text('飞行模式').findOne().parent().parent();
            b.click();
        }
    }
}

/**
 * 强制停止App
 * @param {*} appName
 */
function stopApp(appName) {
    openAppSetting(getPackageName(appName));
    console.show();
    sleep(3000);
    if (className("android.widget.Button").text("结束运行").exists()) {
        console.info("结束运行");
    }
    className("android.widget.Button").text("结束运行").findOne().click();
    try {
        sleep(3000);
        if (className("android.widget.Button").text("确定").exists()) {
            className("android.widget.Button").text("确定").findOne().click();
            toastLog(appName + "已经停止！");
        } else {
            let closeButton = className("android.widget.Button").text("结束运行").find();
            if (closeButton) {
                console.info(closeButton.length);
                console.info(closeButton[0].bounds());
                closeButton[0].click();
                toastLog('已停止['+appName + "]后台进程！");
            }
        }
    } catch (e) {
        toastLog(e);
    }
}

function killApp(packageName) {
    var sh = new Shell(true);
    sh.exec('am force-stop ' + packageName);
    sleep(1000);
    sh.exit;
}
