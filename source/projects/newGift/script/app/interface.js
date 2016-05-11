//接口调用，用回调的方式构建起接口层和视口模式层直接的联系
define(function(){
    function backUserInfo (jsonDate) {
        //返回通用参数的
        jsonDate.pluginId = PINGAN.userInfo.pluginId;
        jsonDate.deviceId = PINGAN.userInfo.deviceId;
        jsonDate.deviceType = PINGAN.userInfo.deviceType;
        jsonDate.osVersion = PINGAN.userInfo.osVersion;
        jsonDate.appVersion = PINGAN.userInfo.appVersion;
        jsonDate.sdkVersion = PINGAN.userInfo.sdkVersion;
        jsonDate.appId = PINGAN.userInfo.appId;
        return jsonDate;
    }
    function indexInter () {
        //这是DEMO，函数名要和接口文档中的对应接口名一直
        //var getSummaryUrl = serverUrl+"/lottery/api/leftOrRight/getSummary.do";
        var getSummaryUrl = "./script/mock/getSummary.json";
        var data = {};
        data = backUserInfo(data);
        $.ajax({
            type : 'POST',
            url : getSummaryUrl,
            data:data,
            timeout:20000, //设定20秒为接口访问的超时时间
            dataType:"json",
            success : function(response) {
                //把相关返回传给相关数据方进行处理
                (function(){
                    //通过立即执行函数构建一个独立作用域
                    var code = response.code;
                    if(code=="1") {
                        //系统错误,具体code要按接口文档来
                        PINGAN.view.errorPage("1");
                    }else{
                        //其他情况就是正常状态
                        var state = response.body.state;
                        PINGAN.BvmEvent.indexVM.run();
                    }
                })();
            },
            error : function(xhr, errorType) {
                if(errorType=="timeout"){
                    //网络超时
                    PINGAN.view.errorPage("5");
                }else{
                    //把接口出错，都归结于网络问题，暂不细化
                    PINGAN.view.errorPage("0");
                }

            }
        });
    }
    function page_lottery (body) {
        //这是DEMO，函数名要和接口文档中的对应接口名一直
        //var getSummaryUrl = serverUrl+"/lottery/api/leftOrRight/getSummary.do";
        var getSummaryUrl = "./script/mock/rewardActivityInfoV2.json";
        var data = {};
        data = backUserInfo(data);
        $.ajax({
            type : 'get',
            url : getSummaryUrl,
            data:data,
            timeout:20000, //设定20秒为接口访问的超时时间
            dataType:"json",
            success : function(response) {
                //把相关返回传给相关数据方进行处理
                (function(){
                    //通过立即执行函数构建一个独立作用域
                    var code = response.code;
                    if(code=="1") {
                        //系统错误,具体code要按接口文档来
                        PINGAN.view.errorPage("1");
                    }else{
                        //其他情况就是正常状态
                        var state = response.body.drawNum;
                        alert("获得数据"+state);
                        PINGAN.BvmEvent.page_lotteryVM.run(state);
                    }
                })();
            },
            error : function(xhr, errorType) {
                if(errorType=="timeout"){
                    //网络超时
                    PINGAN.view.errorPage("5");
                }else{
                    //把接口出错，都归结于网络问题，暂不细化
                    PINGAN.view.errorPage("0");
                }

            }
        });
    }
    function acceptInter (ssoTickInfo) {
        //领取
        var acceptInterUrl = PINGAN.serverUrl+"/lottery/api/newUserReward/acceptReward.do";
        //var acceptInterUrl = "script/mock/acceptReward.json";
        var data = {};
        data = backUserInfo(data);
        if(sessionStorage.getItem("recomCode")) {
            data.recommendCode = sessionStorage.getItem("recomCode");
            sessionStorage.removeItem("recomCode");
        }
        if(ssoTickInfo) {
            data.ssoTicket = ssoTickInfo.SSOTicket;
            data.signature = ssoTickInfo.signature;
            data.timestamp = ssoTickInfo.timestamp;
        }
        $.ajax({
            type : 'POST',
            url : acceptInterUrl,
            data:data,
            timeout:20000, //设定20秒为接口访问的超时时间
            dataType:"json",
            success : function(response) {
                //把相关返回传给相关数据方进行处理
                (function(){
                    //通过立即执行函数构建一个独立作用域
                    var code = response.code;
                    if(code=="1") {
                        //系统错误,具体code要按接口文档来
                        PINGAN.view.errorPage("1");
                    }else if(code=="7201"||code=="7202"||code=="7204"){
                        //当前用户未登陆,直接登陆
                        var loginUrl = response.body.toaH5Url;
                        location.replace(loginUrl);
                        localStorage.setItem("userState",code); //标记下用户状态
                    }else if(code=="7207"){
                        var toaUpgradeUrl = response.body.toaUpgradeUrl;
                        location.replace(toaUpgradeUrl);
                        localStorage.setItem("userState",code); //标记下用户状态
                    }else{
                        //其他情况就是正常状态
                        var body = response.body;
                        PINGAN.BvmEvent.lotteryVM.run(body);
                    }
                })();
            },
            error : function(xhr, errorType) {
                if(errorType=="timeout"){
                    //网络超时
                    PINGAN.view.errorPage("5");
                }else{
                    //把接口出错，都归结于网络问题，暂不细化
                    PINGAN.view.errorPage("0");
                }

            }
        });
    }
    function checkUserRewardType (ssoTickInfo) {
        var checkUserRewardUrl = PINGAN.serverUrl+"/lottery/api/newUserReward/checkUserRewardType.do";
        //var checkUserRewardUrl = "script/mock/checkUserRewardType.json";
        var data = {};
        data = backUserInfo(data);
        if(ssoTickInfo) {
            data.ssoTicket = ssoTickInfo.SSOTicket;
            data.signature = ssoTickInfo.signature;
            data.timestamp = ssoTickInfo.timestamp;
        }
        $.ajax({
            type : 'POST',
            url : checkUserRewardUrl,
            data:data,
            timeout:20000, //设定20秒为接口访问的超时时间
            dataType:"json",
            success : function(response) {
                //把相关返回传给相关数据方进行处理
                (function(){
                    //通过立即执行函数构建一个独立作用域
                    console.log(response);
                    var code = response.code;
                    if(code=="1") {
                        //系统错误,具体code要按接口文档来
                        PINGAN.view.errorPage("1");
                    }else if(code=="7201"||code=="7202"||code=="7204"){
                        //当前用户未登陆,直接登陆
                        var loginUrl = response.body.toaH5Url;
                        location.replace(loginUrl);
                        localStorage.setItem("userState",code); //标记下用户状态
                    }else if(code=="7207"){
                        var toaUpgradeUrl = response.body.toaUpgradeUrl;
                        location.replace(toaUpgradeUrl);
                        localStorage.setItem("userState",code); //标记下用户状态
                    }else if(code=="0") {
                        //接口成功返回
                        PINGAN.BvmEvent.acceptVM.run(response.body);
                    }
                })();
            },
            error : function(xhr, errorType) {
                if(errorType=="timeout"){
                    //网络超时
                    PINGAN.view.errorPage("5");
                }else{
                    //把接口出错，都归结于网络问题，暂不细化
                    PINGAN.view.errorPage("0");
                }

            }
        });
    }
    function myRecordInter (ssoTickInfo) {
        var myRecordUrl = PINGAN.serverUrl+"/lottery/api/newUserReward/getRewardRecord.do";
        //var myRecordUrl = "script/mock/getRewardRecord.json";
        var data = {};
        data = backUserInfo(data);
        if(ssoTickInfo) {
            data.ssoTicket = ssoTickInfo.SSOTicket;
            data.signature = ssoTickInfo.signature;
            data.timestamp = ssoTickInfo.timestamp;
        }
        $.ajax({
            type : 'POST',
            url : myRecordUrl,
            data:data,
            timeout:20000, //设定20秒为接口访问的超时时间
            dataType:"json",
            success : function(response) {
                //把相关返回传给相关数据方进行处理
                (function(){
                    //通过立即执行函数构建一个独立作用域
                    console.log(response);
                    var code = response.code;
                    if(code=="1") {
                        //系统错误,具体code要按接口文档来
                        PINGAN.view.errorPage("1");
                    }else if(code=="7201"||code=="7202"||code=="7204"){
                        //当前用户未登陆,直接登陆
                        var loginUrl = response.body.toaH5Url;
                        location.replace(loginUrl);
                        localStorage.setItem("userState",code); //标记下用户状态
                    }else if(code=="7207"){
                        var toaUpgradeUrl = response.body.toaUpgradeUrl;
                        location.replace(toaUpgradeUrl);
                        localStorage.setItem("userState",code); //标记下用户状态
                    }else if(code=="0") {
                        //接口成功返回
                        PINGAN.BvmEvent.myRecord.run(response.body);
                    }
                })();
            },
            error : function(xhr, errorType) {
                if(errorType=="timeout"){
                    //网络超时
                    PINGAN.view.errorPage("5");
                }else{
                    //把接口出错，都归结于网络问题，暂不细化
                    PINGAN.view.errorPage("0");
                }

            }
        });
    }
    function getBannerList () {
        var bannerUrl = PINGAN.serverUrl+"/lottery/api/v2/getBannerList.do";
        //var myRecordUrl = "script/mock/getRewardRecord.json";
        var data = {};
        data = backUserInfo(data);
        data.location = "newUserReward";
        $.ajax({
            type : 'POST',
            url : bannerUrl,
            data:data,
            timeout:20000, //设定20秒为接口访问的超时时间
            dataType:"json",
            success : function(response) {
                //把相关返回传给相关数据方进行处理
                (function(){
                    //通过立即执行函数构建一个独立作用域
                    console.log(response);
                    var code = response.code;
                    if(code=="0") {
                        //接口成功返回
                        PINGAN.BvmEvent.bannerVm.run(response.body);
                    }
                })();
            },
            error : function(xhr, errorType) {
                if(errorType=="timeout"){
                    //网络超时
                    PINGAN.view.errorPage("5");
                }else{
                    //把接口出错，都归结于网络问题，暂不细化
                    PINGAN.view.errorPage("0");
                }

            }
        });
    }
    function getRecord(ssoTickInfo){
        var getMyRecordUrl = "script/mock/getRecord.json";//模拟数据
        var data = {};//请求接口数据
        data = backUserInfo(data);
        if(ssoTickInfo) {
            data.ssoTicket = ssoTickInfo.SSOTicket;
            data.signature = ssoTickInfo.signature;
            data.timestamp = ssoTickInfo.timestamp;
        }
        $.ajax({
            type : 'POST',
            url : getMyRecordUrl,
            data:data,
            dataType:"json",
            success : function(response) {
                var code = response.code;//获取请求接口返回值中code值
                var body = response.body;//获取请求数据中body
                var returnH5Url = '';//获取请求路径
                console.log(response);
                if(response.code == "1") {//判断请求接口是否成功


                    //遍历对象，设置属性
                    //body---需要遍历的数据
                    //key -- 下标
                    //value -- 循环遍历得到的对象
                    //$.each(body, function (key, value) {
                        //key --{0,1,2,.....}
                        //value--{
                        // "drawCode": "789458",
                        // "prizeImagePath": "http://pic.nipic.com/2008-01-05/200815142355195_2.jpg",
                        // "isPrize": "Y"
                        // }

                        //获取属性值  value.drawCode   对应得到789458

                    //})


                    //接口成功返回
                    PINGAN.BvmEvent.testRe.run(response.body);
                }
            },

        });

    }

    return {
        indexInter:indexInter,
        page_lottery:page_lottery,
        acceptInter:acceptInter,
        checkUserRewardType:checkUserRewardType,
        myRecordInter:myRecordInter,
        getBannerList:getBannerList,
        getRecord:getRecord
    };

});