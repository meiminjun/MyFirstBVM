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
        "zepto": "../../../libs/zepto/v1.1.6/zepto.min",
        "nativeJS":"../../../utils/native",
        "model": "app/model",
        "view": "app/view",
        "viewModel": "app/viewModel",
        "bvm":"../../../utils/bvm/v0.0.2/bvm",
        "text": "../../../libs/require/require-plugin/text"
    }
});

//定义一个全局变量，如果需要用到全局变量，可扩展属性添加到该对象上
var PINGAN = {};
PINGAN.alertTime = 0; //用户等待信息加载的标识
PINGAN.userInfo = {}; //存储用户设备信息
PINGAN.serverUrl = ""; //接口地址
PINGAN.timeLine = {};   //时间轴，用来存放相关动画的定时器，统一管理
PINGAN.mask = document.getElementById("mask");
PINGAN.loading = document.getElementById("loading");
PINGAN.maskNoBg = document.getElementById("maskNoBg");
PINGAN.newAlert = document.getElementById("newAlert"); //上面几个变量应该是比较长用的，取一次就存下来，节省时间
PINGAN.interFace = {}; //接口对应的返回
PINGAN.model = {}; //model对应的返回
PINGAN.view = {};  //view对应的返回
PINGAN.viewModel = {}; //viewModel对应的返回
PINGAN.response = [];  //把接口返回数据暴露到全局，供相关回调链进行操作，要注意对该变量的清空处理，避免取到就数据
PINGAN.respThread = {}; //存储回调的线程相关的字段
PINGAN.pluginId = "PA01100000000_02_HHC"; //当前的插件Id
PINGAN.pluginName = "RYM_ZYH 划横财"; //当前的插件名称
PINGAN.BvmEvent = {}; //回调链控制台

if(location.href.indexOf("localhost")>-1){
    PINGAN.serverUrl = "https://maam-dmzstg3.pingan.com.cn:56443";
}else{
    PINGAN.serverUrl = ""
}

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
            pluginId:"PA01100000000_02_HHC"
        }))
    }else{
        App.call(["sendMessage"],function(ticketInfo){
            ssoTickInfo = JSON.parse(ticketInfo);
            App.call(["sendMessage"],success,function(e){},["getDeviceInfo"]);
        },function(){},["getSSOTicket"]);
    }
    function success (r) {
        var deviceInfo = JSON.parse(r);
        PINGAN.userInfo.pluginId = "PA01100000000_02_HHC";
        PINGAN.userInfo.deviceId = deviceInfo.deviceId||"";
        PINGAN.userInfo.deviceType = deviceInfo.deviceType||""
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
    }
});