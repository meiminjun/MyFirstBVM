//配置路径
require.config({
    baseUrl:"script/",
    shim: {
        "zepto": {
            exports: "$"
        }
    },
    paths: {
        "interface": "app/interface",
        "zepto": "libs/zepto/v1.1.6/zepto.min",
        "nativeJS":"utils/native",
        "model": "app/model",
        "view": "app/view",
        "viewModel": "app/viewModel",
        "bvm":"utils/bvm/v0.0.1/bvm",
        "text": "libs/require/require-plugin/text"
    }
});

//定义一个全局变量，如果需要用到全局变量，可扩展属性添加到该对象上
var PINGAN = {};
PINGAN.alertTime = 0; //用户等待信息加载的标识
PINGAN.userInfo = {}; //存储用户设备信息
PINGAN.serverUrl = ""; //接口地址
PINGAN.timeLine = {};   //时间轴，用来存放相关动画的定时器，统一管理
PINGAN.mask = document.getElementById("mask-color-opacity-black");
PINGAN.loading = document.getElementById("mask-loading");
PINGAN.maskNoBg = document.getElementById("mask-no-color");
PINGAN.newAlert = document.getElementById("newAlert"); //上面几个变量应该是比较长用的，取一次就存下来，节省时间
PINGAN.interFace = {}; //接口对应的返回
PINGAN.model = {}; //model对应的返回
PINGAN.view = {};  //view对应的返回
PINGAN.viewModel = {}; //viewModel对应的返回
PINGAN.response = [];  //把接口返回数据暴露到全局，供相关回调链进行操作，要注意对该变量的清空处理，避免取到就数据
PINGAN.respThread = {}; //存储回调的线程相关的字段
PINGAN.oneIdLink = ""; //一账通宝的注册地址
PINGAN.pluginId = "PA02100000000_02_XRLD"; //当前的插件Id
PINGAN.pluginName = "RYM_XRLD 新人有礼"; //当前的插件名称
PINGAN.BvmEvent = {}; //回调链控制台
PINGAN.appDownUrl = "http://m.pingan.com/c2/sys/tuiguang/weixin/index.html?app=yzt-wtg18"; //一账通下载地址
//PINGAN.temporary={};

if(location.href.indexOf("localhost")>-1){
    PINGAN.serverUrl = "https://maam-dmzstg3.pingan.com.cn:56443";
}else{
    PINGAN.serverUrl = "";
    PINGAN.oneIdLink = "http://toa-sa-dmzstg3.pingan.com.cn:12380/toasa/fund/tonglian/login/fourLogin.screen?activity=60007&activityUrl="
    //PINGAN.oneIdLink = "http://toa-sa.pingan.com.cn/toasa/fund/tonglian/login/fourLogin.screen?activity=60007&activityUrl="
}
PINGAN.oneIdLink = PINGAN.oneIdLink + location.origin + location.pathname; //一账通宝的地址

function showLoading () {
    //加载页面
    PINGAN.maskNoBg.style.display = "block";
    PINGAN.mask.style.display = "block";
    PINGAN.loading.style.display = "block";
}
function hideLoading () {
    //隐藏加载页面
    PINGAN.mask.style.display = "none";
    PINGAN.loading.style.display = "none";
    PINGAN.maskNoBg.style.display = "none";
}

function newAlert (str,timeState) {
    PINGAN.newAlert.innerHTML = str;
    PINGAN.maskNoBg.style.display = "block";
    PINGAN.newAlert.style.display = "block";
    if(timeState) {
        PINGAN.alertTime = setTimeout(function(){
            PINGAN.newAlert.innerHTML = "您已经等待超过15秒，建议您检查网络连接后重新尝试";
        },15000)
    }else{
        PINGAN.alertTime = setTimeout(function(){
            //1.5秒后自动隐藏
            hideAlert();
        },1500);
    }
}
function hideAlert(){
    PINGAN.maskNoBg.style.display = "none";
    PINGAN.newAlert.style.display = "none";
    if(PINGAN.alertTime) {
        clearTimeout(PINGAN.alertTime);
        PINGAN.alertTime = 0; //重置保证hideAlert逻辑正常
    }
}
function hideClose() {
    //隐藏关闭按钮
    App.call(["webCloseButtonShowOrHidden"],function(data){
        console.log(data)
    },function(error){
        console.log(error)
    },{isShow:"N"},{returnType:"JSON"});
}
function hideWebView() {
    App.call(["closeNativeWebview"],function(data){
        console.log(data);
    },function(error){
        console.log(error);
    },{});
}
function closeWebView () {
    var $guide_close = $(".guide_close");
    var $guide_back = $(".guide_back");
    $guide_close.tap(function(){
        hideWebView();
    });
    $guide_back.tap(function(){
        console.log("点击了返回");
        history.back();
    })
}
function callBackZero () {
    //所有回调链归零重置
    PINGAN.BvmEvent.indexVM.backZero();
    PINGAN.BvmEvent.acceptVM.backZero();
    PINGAN.BvmEvent.lotteryVM.backZero();
    PINGAN.BvmEvent.guideVm.backZero();
    PINGAN.BvmEvent.bannerVm.backZero();
    PINGAN.BvmEvent.checkUser.backZero();
    PINGAN.BvmEvent.showOcr.backZero();
    PINGAN.BvmEvent.myRecord.backZero();
    //PINGAN.BvmEvent.page_lotteryVM.backZero();
    //PINGAN.BvmEvent.drawVM.backZero();
}
function getScreenInfo () {
    var width = window.screen.width;
    var height = window.screen.height;
    var dpr = window.devicePixelRatio;
    newAlert("width:"+width+";height:"+height+";dpr:"+dpr);
}
//埋点方法，依赖native.js，不进行埋点可删除
function MaiDian(lableStr){
    var _pluginid = PINGAN.pluginId;
    var _lableStr = lableStr;
    var _eventStr = PINGAN.pluginName;
    App.call(["saveTalkingData"],function(result){
        //do something success
        console.log(result);
    },function(error){
        //do something error
        console.log(error);
    },{
        label:_lableStr,//标签
        event:_eventStr,//事件
        pluginId:PINGAN.pluginId,
        map:{
            timestamp:new Date().getTime(),
            sourceId:_pluginid
        } //自定义参数
    });
}

define(function(require){
    require("zepto");
    require("nativeJS");
    require("bvm");

    PINGAN.interFace = require("interface");
    PINGAN.model = require("model");
    PINGAN.view = require("view");
    PINGAN.viewModel = require("viewModel");

    var ssoTickInfo = "";
    if(location.href.indexOf("localhost")>-1){
        success(JSON.stringify({
            deviceId:"deviceId00010134"+Math.random()*100,
            deviceType:"android_xxx",
            osVersion:"8.2",
            anyDoorSdkVersion:"2.2.1",
            appId:"SZDBK00000000_01_KDYH",
            appVersion:"4.4.0.0",
            pluginId:"PA02100000000_02_XRLD"
        }))
    }else{
        App.call(["sendMessage"],function(ticketInfo){
            ssoTickInfo = JSON.parse(ticketInfo);
            App.call(["sendMessage"],success,function(e){},["getDeviceInfo"]);
        },function(){},["getSSOTicket"]);
    }
    function success (r) {
        var deviceInfo = JSON.parse(r);
        PINGAN.userInfo.pluginId = "PA02100000000_02_XRLD";
        PINGAN.userInfo.deviceId = deviceInfo.deviceId||"";
        PINGAN.userInfo.deviceType = deviceInfo.deviceType||"";
        PINGAN.userInfo.osVersion = deviceInfo.osVersion||"";
        PINGAN.userInfo.appVersion = deviceInfo.appVersion||"";
        PINGAN.userInfo.sdkVersion = deviceInfo.anyDoorSdkVersion||"";
        PINGAN.userInfo.appId = deviceInfo.appId||"";
        if(ssoTickInfo) {
            PINGAN.userInfo.ssoTicket = ssoTickInfo.SSOTicket;
            PINGAN.userInfo.signature = ssoTickInfo.signature;
            PINGAN.userInfo.timestamp = ssoTickInfo.timestamp;
        }
        PINGAN.viewModel.selectPage();
        //getScreenInfo();
        MaiDian("0101-进入'新人有礼活动主页'");
    }

});