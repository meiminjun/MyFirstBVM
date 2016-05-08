/**
 * Created by li-nan on 16/2/23
 * 版本:v0.0.1
 * 插件目标是解决js回调的问题
 * **/
(function(global){
    'use strict';
    var proto = {};
    var loki = create(proto);
    loki.version = "0.0.1"; //当前版本
    loki.pluginName = "Bvm"; //当前插件的名称

    /**
     * 创建一个原型
     * @参数 {string} proto
     * @返回 {function} Dummy
     */
    function create(proto) {
        function Dummy() {}
        Dummy.prototype = proto;
        return new Dummy();
    }
    /**
     * 判断某一个数组是否有重复元素
     * @参数 {array} arr
     * @返回 {boolean}
     */
    function isRepeat(arr) {
        var hash = {};
        for(var i in arr) {
            if(hash[arr[i]]){
                return true;
            }
            // 不存在该元素，则赋值为true，可以赋任意值，相应的修改if判断条件即可
            hash[arr[i]] = true;
        }
        return false;
    }
    /**
     * 判断某一个参数是否存在于某个参数数组中
     * @参数 {string} paramName
     * @返回 {array} paramList
     */
    function checkParam (paramName, paramList) {
        var flag = false,i = 0;
        for(i; i<paramList.length; i++) {
            if(paramName == paramList[i]) {
                flag = true;
                break;
            }
        }
        return flag;
    }
    function extend (obj1,obj2) {
        for(var p in obj2){
            if(obj2.hasOwnProperty(p) && (!obj1.hasOwnProperty(p))){
                obj1[p]=obj2[p];
            }
        }
        return obj1;
    }

    /**
     * 用于控制回调链,解决回调问题和all in one的打包策略
     * @参数 {object} obj
     *
     * **/
    loki.callBackChain = function (obj) {
        /**
         * 该方法充当viewModel层功能,用于联系view层和model层
         * obj最多只接受五个参数设置
         * interFace:表示当前的接口调用
         * viewChain:表示当前对象的视图操作
         * modelChain:表示当前对象的模型操作
         * callBack:回调函数
         * autoRun:表示回调链是否自动执行
         * 方法的执行会根据传参的顺序来执行
         * **/
        this.init();
        if(obj.constructor == Object) {
            //只接受对象形式传参
            var evNameArr = Object.keys(obj); //得到当前配置可执行的方法名的数组
            var evName = "";
            var i = 0;
            var runArray = ["interFace","viewChain","modelChain","callBack","autoRun"];//参数可接受的参数
            var objCanUse = ["func","async"]; //配置项可接受参数
            var runFlag = true;
            var autoRun = true; //函数是否自动运行
            if(evNameArr.length>0) {
                if(!isRepeat(evNameArr)) {
                    //判断参数是否有重复的
                    for(i;i<evNameArr.length;i++){
                        evName = evNameArr[i];
                        if(checkParam(evName,runArray)){
                            //判断当前参数是否在可接受的参数范围
                            if(typeof obj[evName] == "function") {
                                this.runEvent[evName] = obj[evName];
                            }else if(typeof obj[evName] == "object") {
                                var objArr = obj[evName];
                                var objNameArr = Object.keys(objArr);
                                if(objNameArr.length==2){
                                    if(checkParam(objNameArr[0],objCanUse)&&checkParam(objNameArr[1],objCanUse)&&objNameArr[0]!=objNameArr[1]) {
                                        this.runEvent[evName] = obj[evName];
                                    }else{
                                        runFlag = false;
                                    }
                                }else{
                                    runFlag = false;
                                }
                            }else if(typeof obj[evName] == "boolean"&&evName=="autoRun") {
                                autoRun = obj[evName];
                            }
                        }else{
                            runFlag = false;
                        }
                    }
                    if(runFlag) {
                        if(autoRun) {
                            this.run(); //运行可运行函数
                        }
                    }else{
                        console.log("参数配置出错")
                    }
                }else{
                    console.log("当前配置参数有重复项,请参考Api重新编写")
                }
            }else{
                console.log("当前配置为空,方法不进行任何操作")
            }
        }else{
            console.log("传参有误,请参考Api编写");
        }
    };
    loki.callBackChain.prototype = {
        init:function(){
            //初始化,重置runEvent和deleteEvent
            this.runEvent = {};
            this.deleteEvent = {};
        },
        runEvent:{},         //可运行函数
        deleteEvent:{},      //运行后被删除的函数
        run:function(response) {
            var obj = this.runEvent;
            var evNameArr = Object.keys(obj); //之所以会这么麻烦的重新获取,主要是引入暂停机制解决回调
            var evName = "";
            var i = 0;
            if(evNameArr.length>0){
                for(i;i<evNameArr.length;i++) {
                    evName = evNameArr[i];
                    if(typeof this.runEvent[evName] == "function") {
                        //如果是可执行参数就直接执行
                        this.deleteEvent[evName] = this.runEvent[evName];//后面考虑设计一个容错机制,函数执行出错后可以继续执行
                        delete this.runEvent[evName]; //执行完成后就从待执行数组中删除
                        if(response){
                            //如果有参数传入就把参数传入执行
                            this.deleteEvent[evName](response);
                        }else{
                            this.deleteEvent[evName]();
                        }

                    }else if(typeof this.runEvent[evName] == "object") {
                        //如果是对象就是有配置项的
                        var async = this.runEvent[evName].async;
                        this.deleteEvent[evName] = this.runEvent[evName];//后面考虑设计一个容错机制,函数执行出错后可以继续执行
                        delete this.runEvent[evName]; //执行完成后就从待执行数组中删除
                        //上面实时删除回调链的代码,但会把删除的回调链代码放到已删除事件中,下面直接调用已删除事件链中的对应事件
                        if(response) {
                            this.deleteEvent[evName].func(response);
                        }else{
                            this.deleteEvent[evName].func();
                        }
                        if(async) {
                            //false表示是异步,如果是异步,代码会先暂停下,等待再次调用
                            break;
                        }
                    }else{
                        console.log("参数有误,请参考Api编写");
                        break;
                    }
                }
            }else{
                console.log("当前回调链不存在可执行函数");
            }
        },
        reset:function () {
            //重置
            this.runEvent = this.deleteEvent;
            this.deleteEvent = {};
        },
        backZero:function () {
            //归零
            var middleEvent = {};
            var i = 0,j = 0;
            var delArr = Object.keys(this.deleteEvent);
            var runArr = Object.keys(this.runEvent);
            if(delArr.length!=0) {
                //回调链可运行的条件是回调链有运行过
                if(runArr.length==0) {
                    //如果回调链可运行部分为空,证明该回调链,无可运行部分,直接重置
                    this.reset();
                }else{
                    middleEvent = extend(this.deleteEvent,this.runEvent);
                    this.runEvent = middleEvent;
                    this.deleteEvent = {};
                }
            }
        },
        removeEvent:function () {
            var obj = this.runEvent;
            var evNameArr = Object.keys(obj); //之所以会这么麻烦的重新获取,主要是引入暂停机制解决回调
            var evName = "";
            var i = 0;
            if(evNameArr.length>0){
                for(i;i<evNameArr.length;i++) {
                    evName = evNameArr[i];
                    if(typeof this.runEvent[evName] == "function"||typeof this.runEvent[evName] == "object") {
                        //删除当前回调链的后续执行方法,但把其保存在已删除事件中
                        this.deleteEvent[evName] = this.runEvent[evName];//后面考虑设计一个容错机制,函数执行出错后可以继续执行
                        delete this.runEvent[evName]; //执行完成后就从待执行数组中删除
                    }else{
                        console.log("参数有误,请参考Api编写");
                        break;
                    }
                }
            }else{
                console.log("当前回调链已清空");
            }
        },
        pluginInfo: function() {
            return "您在使用的插件是:"+loki.pluginName+",当前的版本是"+loki.version;
        }
    };

    global.Bvm = loki.callBackChain;

})(this);