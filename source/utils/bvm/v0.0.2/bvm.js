/**
 * Created by li-nan on 16/2/23
 * 版本:v0.0.2
 * 0.0.1的插件目标是解决js回调的问题
 * 更新0.0.2加入el(参考vue,选择dom元素),引入操控控制台的概念,重构当前
 * **/
(function(global){
    'use strict';
    var proto = {};
    var loki = create(proto);
    loki.version = "0.0.2"; //当前版本
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
    /**
     * 判断一个数组的参数是否是另外一个预定义参数数组中的指定项
     * @参数 {array} realParam    希望被检测的数组
     * @返回 {array} appointParam 预定义的数组
     */
    function isAppointParam (realParam, appointParam) {
        var i = 0,realParamName,flag=true;
        for(i;i<realParam.length;i++) {
            realParamName = realParam[i];
            if(!checkParam(realParamName,appointParam)){
                flag = false;
                break;
            }
        }
        return flag;
    }
    /**
     * 根据传入的参数选取一个dom树
     * @参数 {string} domName 传入的参数名
     */
    function selectDomFunc (domName) {
        if(typeof domName == "string"&& domName!=="") {
            return document.querySelectorAll(domName);
        }else{
            console.log("el赋值有误");
        }
    }
    /**
     * 根据传入的参数转存初始data到回调链的构造函数上
     * @参数 {Object} saveDataJson 需要保存的json对象
     */
    function saveDataFunc (saveDataJson) {
        if(saveDataJson.constructor == Object) {
            return saveDataJson;
        }else {
            console.log("data数据赋值有误");
        }
    }
    /**
     * 根据传入的参数转存初始template到回调链的构造函数上
     * @参数 {Object} templateJson 需要保存的模板
     */
    function saveTemplatesFunc (templateJson) {
        if(templateJson.constructor == Object) {
            return templateJson;
        }else {
            console.log("data数据赋值有误");
        }
    }
    /**
     * 根据传入的参数转存初始styles到回调链的构造函数上
     * @参数 {string} styleLink 需要调用的样式的地址
     */
    function saveStylesFunc (styleLink) {
        if(styleLink.constructor == Object) {
            return styleLink;
        }else{
            console.log("el赋值有误");
        }
    }
    /**
     * 根据传入的参数转存转存event的Json对象到回调链的构造函数上
     * @参数 {Object} eventJson 需要调用的样式的地址
     */
    function saveEventFunc (eventJson) {
        if(eventJson.constructor == Object) {
            return eventJson;
        }else {
            console.log("event数据赋值有误");
        }
    }
    /**
     * 根据传入的参数转存转存event的Json对象到回调链的构造函数上
     * @参数 {Object} eventJson 需要调用的样式的地址
     */
    function saveActionFunc (actionJson) {
        if(actionJson.constructor == Object) {
            return actionJson;
        }else {
            console.log("action数据赋值有误");
        }
    }
    /**
     * 根据传入的参数截取转换成属性
     * @参数 {string} attributeStr
     */
    function splitAttribute(attributeStr) {
        var attributeArr = attributeStr.split(",");
        var i = 0;
        var str = '';
        var singleStr = "";
        for(i;i<attributeArr.length;i++) {
            singleStr = attributeArr[i];
            str += singleStr.split("=")[0] + "=\"" + singleStr.split("=")[1] + "\" ";
        }
        return str;
    }
    /**
     * 根据传入的参数判断是不是模板中Data的关键字{{[a-zA-Z0-9]*.*[a-zA-Z0-9]*}}
     * @参数 {string} checkStr
     */
    function checkKeyWord(checkStr) {
        return checkStr.search(/{{[a-zA-Z0-9]*.*[a-zA-Z0-9]*}}/) > -1;
    }
    /**
     * 对是模板data关键字进行截取
     * @参数 {string} checkStr
     */
    function splitKeyWord(splitStr){
        return splitStr.split("{{")[1].split("}}")[0];
    }
    /**
     * 检测传入参数是否有nodeName
     * @参数 {Object} checkJson
     */
    function checkNodeName(checkJson){
        return splitStr.split("{{")[1].split("}}")[0];
    }
    /**
     * 用于控制回调链,解决回调问题和all in one的打包策略
     * @参数 {object} obj
     *
     * **/
    loki.callBackChain = function (obj) {
        /**
         * 该方法充当viewModel层功能,用于联系view层和model层,同时以事件驱动的方式,管理着所有的事件和事件响应
         * obj最多只接受六个参数设置:el,data,template,styles,event,action
         * el:表示要触发的整个事件的Dom元素
         * data:是当前回调链的数据存储层,
         * template:是当前回调链的模板,模板接受三种写法:纯html,纯html加混合数据,模板语言
         *  纯html:
         *      <div class="btn" id="new">
         *          这是一个按钮文字
         *          <p>提交</p>
         *      </div>
         * styles:回调链对应的样式
         * event:表示当前回调链可能触发事件(其中事件分成三大类,
         *  用户手势行为:top,sidleLeft,sidleRight,sidleUp,sidleDown;
         *  回调链自身行为:autoRun(回调链自动运行的函数,相当于是当前回调链的入口函数)
         *  用户自定义行为:fromPage(用户自定义的行为)
         * )
         * action:映射event的动作流
         *
         * interFace:表示当前的接口调用
         * viewChain:表示当前对象的视图操作
         * modelChain:表示当前对象的模型操作
         * callBack:回调函数
         * autoRun:表示回调链是否自动执行
         * 方法的执行会根据传参的顺序来执行
         * **/
        if(obj.constructor == Object) {
            //只接受对象形式传参
            var evNameArr = Object.keys(obj); //得到当前配置可执行的方法名的数组
            var evName = ""; //可执行方法的方法名
            var i = 0;
            var runArray = ["el","data","templates","styles","event","action"];//参数可接受的参数
            var objCanUse = ["func","async"]; //action配置项可接受参数
            var runFlag = true; //运行的标志
            var autoRun = true; //函数是否自动运行
            //判断参数是为空对象
            if(evNameArr.length>0) {
                //判断参数是否有重复的,并且是否是在预定义范围之内的参数
                if(!isRepeat(evNameArr)&&isAppointParam(evNameArr,runArray)) {
                    //遍历传入对象,把相关值传到回调链中
                    for(i;i<evNameArr.length;i++) {
                        evName = evNameArr[i];
                        switch (evName) {
                            case "el":
                                this.elDom = selectDomFunc(obj["el"]);
                                break;
                            case "data":
                                this.saveData = saveDataFunc(obj["data"]);
                                break;
                            case "templates":
                                this.templates = saveTemplatesFunc(obj["templates"]);
                                break;
                            case "styles":
                                this.styles = saveStylesFunc(obj["styles"]);
                                break;
                            case "event":
                                this.event = saveEventFunc(obj["event"]);
                                break;
                            case "action":
                                this.action = saveActionFunc(obj["action"]);
                                break;
                            default:
                                console.log("ok");
                        }
                    }
                    //遍历完成后,开始进行基本的初始化
                    this.toHtml(this.templates); //把template转换成html文档结构


                }else{
                  //判断出当前传入参数有重复的
                  console.log("当前配置参数有重复项,请参考Api重新编写")
                }
            }else{
                //判断出当前参数为空对象
                console.log("当前配置为空,方法不进行任何操作")
            }
        }else{
            //判断出当前参数不为对象
            console.log("传参有误,请参考Api编写");
        }
    };
    loki.callBackChain.prototype = {
        elDom:{},//当前回调链选择的Dom
        saveData: {}, //期望存储下来的数据
        templates: {}, //回调链的模板
        styles: {}, //回调链的模板
        event:{},   //回调链的响应事件
        action:{},  //回调链的动作池
        toHtml: function(templateJson) { //把模板转成html
            var temp = Object.keys(templateJson); //template中定义了几大类模板
            var i = 0;
            var tempName = ""; //当前模板的名称
            var tempJson = {};
            var acceptArg = ["nodeName","attribute","textNode","childNode","loopChildNum"]; //模板可接受的参数
            for(i;i<temp.length;i++) {
                tempName = temp[i];
                tempJson = templateJson[tempName];
                var j = 0;
                var domJson = null;
                for(j; j<tempJson.length; j++) {
                    domJson = tempJson[j];
                    var domJsonObject = Object.keys(domJson);
                    //判断当前参数是否在指定范围之内
                    if(!isAppointParam(domJsonObject,acceptArg)) {
                        console.log("参数配置有误,请参考Api对参数进行调整");
                        break;
                    }else{
                        //所有参数中只有nodeName是强制要有的
                        if(domJson["nodeName"]) {
                            var domName = domJson["nodeName"]; //构建的元素名
                            var attribute = ""; //属性
                            var textNode = "";
                            if(domJson["attribute"]) {
                                attribute = splitAttribute(domJson["attribute"]);
                                if(checkKeyWord(attribute)) {
                                    var keyWord = splitKeyWord(attribute);
                                    var tempNode = this.keyWordParse(attribute);
                                    attribute = attribute.replace("{{"+keyWord+"}}",tempNode);
                                }
                                console.log(attribute);
                            }
                            if(domJson["textNode"]) {
                                if(checkKeyWord(domJson["textNode"])){
                                    textNode = this.keyWordParse(domJson["textNode"]);
                                }else{
                                    textNode = domJson["textNode"];
                                }
                                console.log(textNode);
                            }
                            if(domJson["childNode"]) {
                                debugger;
                                //校验子节点的参数是否符合要求
                                if(compare(domJson["childNode"])){

                                }

                            }
                            if(domJson["loopChildNum"]) {
                                //循环属性只针对childNode

                            }
                            console.log("该Dom名称是"+domName+",相关属性是"+attribute+",对应文案是"+textNode)
                        }else{
                            console.log("模板中包含无nodeName的对象")
                        }

                    }
                }
            }
        },
        runEvent: {}, //可运行的函数
        deleteEvent: {}, //运行后被删除的函数
        keyWordParse:function(keyword){
            var textNode = "";
            var keyWord = splitKeyWord(keyword).split(".");
            //到这里逻辑的地方至少会有一个
            if(keyWord.length==1) {
                if(this.saveData[keyWord]) {
                    textNode = this.saveData[keyWord];
                }else{
                    textNode = "";
                }
            }else{
                var k = 0;
                for(k;k<keyWord.length;k++){
                    var word = keyWord[k];
                    if(k==0 && this.saveData[word]) {
                        textNode = this.saveData[word];
                    }else if(textNode[word]) {
                        textNode = textNode[word];
                    }
                }
            }
            return textNode;
        },
        pluginInfo: function() {
            return "您在使用的插件是:"+loki.pluginName+",当前的版本是"+loki.version;
        },
        run: function (response) {
            var obj = this.runEvent;
            var evNameArr = Object.keys(obj); //之所以会这么麻烦的重新获取,主要是引入暂停机制解决回调
            var evName = "";
            var i = 0;
            if(evNameArr.length>0){
                for(i;i<evNameArr.length;i++) {
                    evName = evNameArr[i];
                    if(typeof this.runEvent[evName] == "function") {
                        //如果是可执行参数就直接执行
                        if(response){
                            //如果有参数传入就把参数传入执行
                            this.runEvent[evName](response);
                        }else{
                            this.runEvent[evName]();
                        }
                        this.deleteEvent[evName] = this.runEvent[evName];//后面考虑设计一个容错机制,函数执行出错后可以继续执行
                        delete this.runEvent[evName]; //执行完成后就从待执行数组中删除

                    }else if(typeof this.runEvent[evName] == "object") {
                        //如果是对象就是有配置项的
                        var async = this.runEvent[evName].async;
                        if(response) {
                            this.runEvent[evName].func(response);
                        }else{
                            this.runEvent[evName].func();
                        }
                        this.deleteEvent[evName] = this.runEvent[evName];//后面考虑设计一个容错机制,函数执行出错后可以继续执行
                        delete this.runEvent[evName]; //执行完成后就从待执行数组中删除
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
        }
    };

    global.Bvm = loki.callBackChain;

})(this);