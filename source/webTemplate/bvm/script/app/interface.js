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
                        PINGAN.BvmEvent.indexVM.run(state);
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

    return {
        indexInter:indexInter
    };

});