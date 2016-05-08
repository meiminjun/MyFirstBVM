//与viewModel自动映射，视图展示层
define(function(require){
    //现在的模版策略有问题，这个地方一定要改，先暂时用require插件text库来处理
    //路由
    function route (pageName,state) {
        var hash = location.href;
        var hisState = {"pageName":pageName};
        var hisTitle = "";
        var hisUrl = hash + "#pageName=" + pageName;
        var hisPageName = "";
        if(hash.indexOf("pageName")>-1) {
            //如果url中带pageName认为是已经是有路由页，要分别处理
            hisUrl = hisUrl.split("#pageName")[0] +  "#pageName=" + pageName;
            hisPageName = hash.split("pageName=")[1];
            if(hisPageName!=pageName) {
                if(state==0) {
                    //不插入历史记录
                    history.replaceState(hisState,hisTitle,hisUrl);
                }else if(state==1) {
                    //插入历史记录
                    history.pushState(hisState,hisTitle,hisUrl);
                }
            }
            //goPageRouter(hisPageName,state);
        }else{
            //如果url中不带pageName认为暂时没插入路由先根据情况插入
            if(state==0) {
                //不插入历史记录
                history.replaceState(hisState,hisTitle,hisUrl);
            }else if(state==1) {
                //插入历史记录
                history.pushState(hisState,hisTitle,hisUrl);
            }
        }
    }
    window.addEventListener("popstate",function(evnt){
        if(evnt.state.pageName) {
            var pageName = evnt.state.pageName;
            showHisPage(pageName);
        }else{
            //如果是首页刷新，不做任何跳转,直接显示某个页面
            showAptPage("page_main",0,0);
        }
    });

    function showHisPage (pageName) {
        var pageMode = $(".pageMode");
        pageMode.css("display","none");
        var pageDom = document.getElementById(pageName);
        if(pageDom.innerHTML == "") {
            //如果是跳出返回后的页面
            if(pageName=="page_main") {
                PINGAN.viewModel.indexVM(); //跳到首页
            }else if(pageName=="page_list") {
                PINGAN.viewModel.listVM(); //跳到列表页
            }
        }else{
            //如果是正常加载进入的页面
            var showPageDom=setTimeout(function(){//加载的延时
                pageDom.style.display = "block";
                clearTimeout(showPageDom);
            },100);
        }

    }

    function showAptPage (pageName,state,loadState) {
        //展示某一页面,pageName是对应page的ID
        //对历史记录的操控写到这里
        var pageMode = $(".pageMode");
        pageMode.css("display","none");
        var pageDom = document.getElementById(pageName);
        var showPageDom=setTimeout(function(){//等待滚动条加载完成再显示
            pageDom.style.display = "block";
            clearTimeout(showPageDom);
        },600);
        route(pageName,state);
        if(loadState) {
            //是否要立刻隐藏loading页，参数是0或者1，1表示立即隐藏，0反之，如果为0需要在对应
            //的model回调中写入相关隐藏逻辑
            var showPageTime = setTimeout(function(){
                hideLoading();
                clearTimeout(showPageTime);
            },100); //加上100毫秒的延时加载
        }
    }

    function indexPage () {
        //主界面
        showLoading();
        var pageHtml = require("text!template/main.html");
        var pageDom = document.getElementById("page_main");
        pageDom.innerHTML = pageHtml;
        showAptPage("page_main",0,1); //首页不纪录游戏纪录
    }
    function addAccountPage (targetId) {
        //添加账户页
        showLoading();
        var pageHtml = require("text!template/addAccount.html");
        var pageDom = document.getElementById("page_addAccount");
        pageDom.innerHTML = pageHtml;
        var $paymentType = $("#paymentType");
        var $payType = $("#payType");
        $paymentType.attr("class",targetId);
        var payString = "";
        if(targetId=="sIcon"){
            //水费
            payString = "水费";
        }else if(targetId=="dIcon"){
            //电费
            payString = "电费";
        }else if(targetId=="qIcon"){
            //气
            payString = "燃气费";
        }else if(targetId=="fIcon"){
            //手机充值
            payString = "手机充值";
        }else if(targetId=="yIcon"){
            //有线电视
            payString = "有线电视";
        }else if(targetId=="hIcon"){
            //固话
            payString = "固话";
        }
        $payType.html(payString);
        showAptPage("page_addAccount",0,1); //首页不纪录游戏纪录
    }
    function resultPage (targetId) {
        //添加账户页
        showLoading();
        var pageHtml = require("text!template/result.html");
        var pageDom = document.getElementById("page_result");
        pageDom.innerHTML = pageHtml;
        var $resultType = $("#resultType");
        $resultType.attr("class",targetId);
        showAptPage("page_result",0,1); //首页不纪录游戏纪录
    }
    function servicePage () {
        //服务协议页
        showLoading();
        var pageHtml = require("text!template/service.html");
        var pageDom = document.getElementById("page_service");
        pageDom.innerHTML = pageHtml;
        showAptPage("page_service",0,1); //首页不纪录游戏纪录
    }
    function payListPage () {
        //缴费记录页议页
        showLoading();
        var pageHtml = require("text!template/payList.html");
        var pageDom = document.getElementById("page_payList");
        pageDom.innerHTML = pageHtml;
        showAptPage("page_payList",0,1); //首页不纪录游戏纪录
    }

    function errorPage (state) {
        showLoading();
        var pageHtml = "";
        if(state=="0"){
            //接口出错或者长时间不返回数据
            pageHtml = "<p class='errorP'>亲，网络连接出错，请检测网络后，稍后访问</p>"
        }else if(state=="1"){
            //接口返回code为1的错误
            pageHtml = "<p class='errorP'>亲，由于不可预知的错误，系统出现异常，勤劳的程序猿正在修复，请稍后访问</p>"
        }else if(state=="3") {
            //游戏未开始
            pageHtml = "<p class='errorP'>亲，您来早了，游戏还未开始</p>"
        }else if(state=="4") {
            //游戏积分用完
            pageHtml = "<p class='errorP'>当日积分已领完，明天再来吧</p>"
        }else if(state=="5") {
            //网络超时
            pageHtml = "<p class='errorP'>亲，你的网络连接超时，请确认网络后请重新尝试</p>"
        }
        var pageDom = document.getElementById("page_error");
        pageDom.innerHTML = pageHtml;
        showAptPage("page_error",0,1);
        hideAlert();
    }

    return {
        indexPage: indexPage,
        addAccountPage:addAccountPage,
        resultPage:resultPage,
        servicePage:servicePage,
        payListPage:payListPage,
        errorPage:errorPage
    };
});