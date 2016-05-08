//与view层自动映射，连接view层和Model层的关键,视图模型层
define(function(){

    PINGAN.BvmEvent.mainPageVM = {}; //首页的回调链
    PINGAN.BvmEvent.acceptVM = {}; //领奖的回调链
    PINGAN.BvmEvent.bannerVm = {}; //业务加挂页
    PINGAN.BvmEvent.checkUser = {}; //检测用户是否领取过奖励
    PINGAN.BvmEvent.myRecord = {}; //我的战绩回调链
    PINGAN.BvmEvent.drawVM = {};//
    PINGAN.BvmEvent.taskVM = {};
    PINGAN.BvmEvent.testVm = {};
    PINGAN.BvmEvent.myPrize = {};


    function selectPage () {
        //定义多个回调链,async:true表示是异步,false表示是同步
        PINGAN.BvmEvent.testRe = new Bvm({
            interFace: {func:PINGAN.interFace.getRecord, async:true},
            viewChain:PINGAN.view.myRecordPage,
            modelChain:PINGAN.model.modelRe,
            callBack:myRepage,
            autoRun:false
        });
        PINGAN.BvmEvent.testVm = new Bvm({
            viewChain:PINGAN.view.myPagePrize,
            autoRun:false
        });
        PINGAN.BvmEvent.mainPageVM = new Bvm({
            interFace: {func:PINGAN.interFace.indexInter, async:true},
            viewChain:PINGAN.view.mainPage,
            modelChain:PINGAN.model.mainPageM,
            callBack:mainPageEvnt,
            autoRun:true
        });
        PINGAN.BvmEvent.drawVM = new Bvm({
            //interFace: {func:PINGAN.interFace.indexInter, async:true},
            viewChain:PINGAN.view.drawPage,
            modelChain:PINGAN.model.drawM,
            callBack:drawEvnt,
            autoRun:false
        });


        //领取接口的逻辑,先判断当前用户的状态,是否为新用户,是否领过奖
        PINGAN.BvmEvent.acceptVM = new Bvm({
            interFace: {func:PINGAN.interFace.checkUserRewardType, async:true},
            modelChain:{func:PINGAN.model.acceptM, async:true},
            viewChain:PINGAN.view.acceptPage,
            callBack:acceptEvnt,
            autoRun:false
        });
        PINGAN.BvmEvent.lotteryVM = new Bvm({
            interFace: {func:PINGAN.interFace.acceptInter, async:true},
            modelChain:{func:PINGAN.model.lotteryM, async:true},
            viewChain:PINGAN.view.lotteryPage,
            callBack:lotteryEvnt,
            autoRun:false
        });
        PINGAN.BvmEvent.guideVm = new Bvm({
            viewChain:PINGAN.view.guidePage,
            modelChain:PINGAN.model.guideM,
            callBack:goBannerEvnt,
            autoRun:false
        });
        PINGAN.BvmEvent.bannerVm = new Bvm({
            interFace:{func:PINGAN.interFace.getBannerList, async:true},
            viewChain:PINGAN.view.bannerPage,
            modelChain:PINGAN.model.bannerM,
            autoRun:false
        });
        PINGAN.BvmEvent.checkUser = new Bvm({
            interFace: {func:PINGAN.interFace.checkUserRewardType, async:true},
            modelChain: PINGAN.model.checkUser,
            autoRun:false
        });
        PINGAN.BvmEvent.showOcr = new Bvm({
            callBack:showReCode,
            autoRun:false
        });
        PINGAN.BvmEvent.myRecord = new Bvm({
            interFace: {func:PINGAN.interFace.myRecordInter, async:true},
            modelChain:{func:PINGAN.model.myRecordM, async:true},
            callBack:showMyRecord,
            autoRun:false
        })
        //做任务赢大奖
        PINGAN.BvmEvent.myPrize = new Bvm({
           // interFace:{func:PINGAN.interFace.PagePrize, async:true},
            viewChain:PINGAN.view.myPagePrize,
            modelChain:PINGAN.model.myPrizeto,
            callBack:showmyPze,
            autoRun:false

        })
}


    function myRepage(){
        $('.sibemit').on("click",function(){
            $('.p-main').show();
            $('#p-sim').css('display','block');
        });
        $('#x-hide').on("click",function(){
            $('#p-sim').hide();
        });

        //姓名失去焦点事件
        $("#Name").on('blur',function(){
            validateName();
        })
        //收货地址不能为空
        $("#feil").on('blur',function(){
            validatefeil();
        })
        //身份证不能为空
       // $("#cody-rie").on('blur',function(){
       //     validaterie();
       // })
        //手机不能为空
       // $("#cody-ph").on('blur',function(){
          //  validatephon();
       // })
        //验证码不能为空
        $("#verification-cody").on('blur',function(){
            validateVerifi();
        })

        //身份证失去焦点时间
        $("#cody-rie").on('blur',function(){
            validateIdCard();
        })
        //手机号码失去焦点事件
        $("#cody-ph").on('blur',function(){
            validateMabble();
        })

        //提交按钮点击事件
        $(".p-page-sibmit").on('click',function(){
            submitConvertPrize();
        })

    }

    //验证身份证号码
    function validateIdCard(){
        var idCard = $('#cody-rie').val();
        if(idCard==null||idCard=='') {
            //提示身份证号码不能为空
            $('.p-bottom-null-rie').show();
            $('.sim-color').css('display','none');
            return false;
        }
        //15位数身份证正则表达式
        var arg1 =/^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$/;
        //18位数身份证正则表达式
        var arg2 =/^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[A-Z])$/;
        if (arg1.test(idCard) || arg2.test(idCard)) {
            $('.sim-color').css('display','none');
            $('.p-bottom-null-rie').hide();
            return true;
        }else {
            $('.sim-color').css('display','block');
            $('.p-bottom-null-rie').show();
            return false;
        }
    }

    //验证手机号码
    function validateMabble(){
        var mobileNo = $('#cody-ph').val();
        if(mobileNo==null||mobileNo=='') {
            //提示身份证号码不能为空
            $('.p-bottom-null-phon').show();
            $('.sim-colorph').css('display','none');
            return false;
        }
        var str = /^1[3|4|5|6|7|8]\d{9}$/;
        if (str.test(mobileNo)) {
            $('.sim-colorph').css('display','none');
            $('.p-bottom-null-phon').hide();
            //return true;
        } else {
            $('.sim-colorph').css('display','block');
            $('.p-bottom-null-phon').show();
            //return false;
        }
    }

    //姓名不能为空
    function validateName(){
        var name = $('#Name').val();
        if(name == null || name ==''){
            $('.p-bottom-null-name').show();
        }else if(name.length > 1 || name.length < 16){
            $('.p-bottom-null-name').hide();
        }
    }
    //收货地址不能为空
    function validatefeil(){
        var code = $('#feil').val();
        if(code == null || code ==''){
            $('.p-bottom-null-code').show();
        }else if(code.length > 1 || code.length < 16){
            $('.p-bottom-null-code').hide();
        }
    }
    //身份证不能为空
    function validaterie(){
        var rie = $('#cody-rie').val();
        if(rie == null || rie ==''){
            $('.p-bottom-null-rie').show();
        }else if(rie.length > 1){
            $('.p-bottom-null-rie').hide();
        }
    }
    //手机不能为空
    function validatephon(){
        var phon = $('#cody-ph').val();
        if(phon == null || phon ==''){
            $('.p-bottom-null-phon').show();
            $('.sim-colorph').css('display','none');
        }else if(phon.length > 1){
            $('.p-bottom-null-phon').hide();
            $('.sim-colorph').css('display','block');
        }
    }
    //验证码不能为空
    function validateVerifi(){
        var $sim = $('#p-page-sibmit');
        var verification =$('#verification-cody').val();
        if(verification == null || verification ==''){
            $('.p-bottom-null-verif').show();
        }else if(verification.length > 1 || verification.length < 6){
            $('.p-bottom-null-verif').hide();
        }
    }


    //提交表单数据
    function submitConvertPrize(){

        if(validateName() & validatefeil() & validateVerifi() & validateIdCard() & validateMabble()){

        }
            var submitUrl = "script/mock/submitRecord.json";
            $.ajax({
                type:"POST",
                url:submitUrl,
                dataType:'json',
                success:function(responseData){

                    alert(responseData.body.resultCode);
                    alert("提交成功");
                   $('#p-sim').hide();
                }

            })  ;



       // sibmitsle();
       // window.location.href = PINGAN.BvmEvent;
    }




    function  showmyPrize() {
        var $mask = $("#mask-color-opacity-black");
        var $popScene = $("#pop-scene");
        var $myPrize = $("#myPrize");
        var $myprizeClose = $("#myprizeClose");
        $mask.show();
        $popScene.show();
        $myPrize.show();
        myprizeClose.one("click",function(){
            console.log("事件发生了绑定");
            hideMyPrize();
            PINGAN.BvmEvent.myRecord.reset(); //重置当前回调链
        });
    }
    function hideMyPrize() {
        var $mask = $("#mask-color-opacity-black");
        var $popScene = $("#pop-scene");
        var $myPrize = $("#myPrize");
        $mask.hide();
        $popScene.hide();
        $myPrize.hide();
    }
    function showmyPze(){

        var $simbot = $(".p-pop-bt-popup");

        $simbot.tap(function(){
            PINGAN.BvmEvent.mainPageVM.run();
        })
        $('.p-pop-bt-reward').on("click",function(){
            $('.p-Popup').hide();
            $('.x-hide-option').hide();
        })

    }
    function mainPageEvnt () {

        var $recordBtn = $("#recordBtn");//我的战绩
        var $drawcode = $("#drawcode"); //领取抽奖码
        var $rightbtn = $("#rightbtn"); //我要领取
        var $taskbtn2 = $("#taskbtn2");//做任务页面
        var $backmain = $("#backmain");//关闭弹出框,回到主页面
        var $mytaskbtn = $("#mytaskbtn");//从弹出框单击到做任务页面
        var $myrecordbtn = $("#myrecordbtn");//从弹出框单击到我的战绩

        $recordBtn.tap(function(){
            //我的战绩
            PINGAN.BvmEvent.testRe.run();
        });

        //单机领取抽奖码的两种情况
        //1 弹出框,表示机会用完
        $rightbtn.tap(function(){
            $('.continueTask').show();
            $('.mainHideOption').show();
            $('.mainHideOption').css('position','fixed');
        });
        //关闭弹出框,回到主页面
        $backmain.tap(function(){
            $('.continueTask').hide();
            $('.mainHideOption').hide();
        });
        //2 跳转到领取抽奖码页面
        $drawcode.tap(function(){
            PINGAN.BvmEvent.drawVM.run();
        });

        //做任务页面
        $taskbtn2.tap(function(){
            PINGAN.BvmEvent.testVm.run();
        })
        ////从弹出框单击到做任务页面
        $mytaskbtn.tap(function(){
            PINGAN.BvmEvent.myPrize.run();
        })
        ////从弹出框单击到我的战绩
        $myrecordbtn.tap(function(){
            PINGAN.BvmEvent.testRe.run();
        })



        //
        //$main_record.tap(function(){
        //    //显示我的战绩
        //    App.call(["sendMessage"],function(ticketInfo){
        //        var ssoTickInfo = JSON.parse(ticketInfo);
        //        PINGAN.BvmEvent.myRecord.run(ssoTickInfo);
        //    },function(){},["getSSOTicket"]);
        //    MaiDian("0104-点击'我的战绩'按钮");
        //});
        //$main_accBtn.tap(function(){
        //   //我要领取
        //    App.call(["sendMessage"],function(ticketInfo){
        //        var ssoTickInfo = JSON.parse(ticketInfo);
        //        PINGAN.BvmEvent.acceptVM.run(ssoTickInfo);
        //    },function(){},["getSSOTicket"]);
        //    MaiDian("0103-点击'我要领取'按钮");
        //    PINGAN.BvmEvent.mainPageVM.run(date);
        //});
    }

    function drawEvnt(){
        var $recordBotton = $("#recordBotton");//我的战绩
        var $task1 = $("#task1");//继续做任务
        var $closedraw = $("#closedraw");//返回mainPage页面

        $recordBotton.tap(function(){
            PINGAN.BvmEvent.testRe.run();
        })
        $task1.tap(function(){
            PINGAN.BvmEvent.myPrize.run();
        })

        $closedraw.tap(function(){
            //单机领取抽奖码的两种情况
            PINGAN.BvmEvent.mainPageVM.run();
        });

    }


    function showActiveRule () {
        MaiDian("0102-点击'活动规则'按钮");
        var $mask = $("#mask-color-opacity-black");
        var $popScene = $("#pop-scene");
        var $activeRule = $("#activeRule");
        var $activeRuleClose = $("#activeRuleClose");
        var $rule_desc = $(".rule_desc");//监听的滑动区域
        var $rule_font_block = $(".rule_font_block"); //实际滑动区域
        var $drop_block = $(".drop_block"); //跟随连动的区域
        $mask.show();
        $popScene.show();
        $activeRule.show();
        $activeRuleClose.tap(function(){
            hideActiveRule();
        });
        scrollBar($rule_desc,$rule_font_block,$drop_block); //添加滚动条监听
    }
    function hideActiveRule() {
        var $mask = $("#mask-color-opacity-black");
        var $popScene = $("#pop-scene");
        var $activeRule = $("#activeRule");
        $mask.hide();
        $popScene.hide();
        $activeRule.hide();
    }
    function scrollBar(scrollBlock, scrollCont, dropBlock) {
        var dpr = 1;
        if(document.querySelectorAll("html")[0].getAttribute("data-dpr")){
            dpr = document.querySelectorAll("html")[0].getAttribute("data-dpr");
        }
        var startX = 0;
        var startY = 0;
        var scrollY = 0; //当前可滑动部分的高度
        var maxHeight = scrollCont.height() - scrollBlock.height(); //下拉最大高度
        scrollBlock.on("touchstart", function(e) {
            if(scrollCont[0].style.cssText!=="") {
                scrollY = parseFloat(scrollCont[0].style.cssText.split(",")[1]);
            }
            if(e.touches.length > 0) {
                startX = e.touches[0].clientX;
                startY = e.touches[0].clientY;
            }else{
                startX = e.changedTouches[0].clientX;
                startY = e.changedTouches[0].clientY;
            }
        });
        scrollBlock.on("touchmove", function(e) {
            var moveX = e.touches[0].clientX;
            var moveY = e.touches[0].clientY;
            var absX = moveX - startX;
            var absY = moveY - startY;
            var moveScrollY = scrollY + absY;
            scrollCont.attr("style","-webkit-transform:translate3d(0,"+moveScrollY+"px,0)");
            e.preventDefault(); //修复android低版本的touchemove只触发一次的bug
        });
        scrollBlock.on("touchend", function(e) {
            var endX = 0;
            var endY = 0;
            if(e.touches.length > 0) {
                endX = e.touches[0].clientX;
                endY = e.touches[0].clientY;
            }else{
                endX = e.changedTouches[0].clientX;
                endY = e.changedTouches[0].clientY;
            }
            console.log(endY - startY);
            if(endY -startY > 0) {
                //上拉的边界
                if(endY - startY + scrollY > 0) {
                    scrollCont.attr("style","-webkit-transform:translate3d(0,0,0)");
                }
            }else if(endY - startY < 0) {
                //下拉的边界
                if(Math.abs(endY - startY) > maxHeight || (Math.abs(endY - startY) + Math.abs(scrollY) > maxHeight)) {
                    scrollCont.attr("style","-webkit-transform:translate3d(0,-"+maxHeight+"px,0)");
                }
            }
        });

    }
    function  showMyRecord() {
        var $mask = $("#mask-color-opacity-black");
        var $popScene = $("#pop-scene");
        var $myRecord = $("#myRecord");
        var $myRecordClose = $("#myRecordClose");
        $mask.show();
        $popScene.show();
        $myRecord.show();
        $myRecordClose.one("click",function(){
            console.log("事件发生了绑定");
            hideMyRecord();
            PINGAN.BvmEvent.myRecord.reset(); //重置当前回调链
        });
    }
    function hideMyRecord() {
        var $mask = $("#mask-color-opacity-black");
        var $popScene = $("#pop-scene");
        var $myRecord = $("#myRecord");
        $mask.hide();
        $popScene.hide();
        $myRecord.hide();
    }
    function showReCode() {
        MaiDian("0201-进入'推荐码填写页面'");
        var $mask = $("#mask-color-opacity-black");
        var $popScene = $("#pop-scene");
        var $reCode = $("#reCode");
        var $reCodeClose = $("#reCodeClose");
        var $recom_code = $(".recom_code");
        var $recom_submit = $(".recom_submit");
        var $recom_no_code = $(".recom_no_code");
        $mask.show();
        $popScene.show();
        $reCode.show();
        $recom_submit.tap(function(){
            if($recom_code.val()=="") {
                newAlert("提交时,推荐码不能为空");
            }else{
                var recomCode = $recom_code.val();
                 App.call(["sendMessage"],function(ticketInfo){
                     var ssoTickInfo = JSON.parse(ticketInfo);
                     sessionStorage.setItem("recomCode",recomCode);
                     PINGAN.BvmEvent.lotteryVM.run(ssoTickInfo);
                 },function(){},["getSSOTicket"]);
                MaiDian("0202-点击'提交'按钮");
                //PINGAN.BvmEvent.lotteryVM.run();
            }
        });
        $recom_no_code.tap(function(){
            hideReCode();
            App.call(["sendMessage"],function(ticketInfo){
                var ssoTickInfo = JSON.parse(ticketInfo);
                PINGAN.BvmEvent.lotteryVM.run(ssoTickInfo,"");
            },function(){},["getSSOTicket"]);
            //PINGAN.BvmEvent.guideVm.run();
            MaiDian("0203-点击'没有推荐码'按钮");
        });
        $reCodeClose.tap(function(){
            hideReCode();
        });
    }
    function hideReCode() {
        var $mask = $("#mask-color-opacity-black");
        var $popScene = $("#pop-scene");
        var $reCode = $("#reCode");
        $mask.hide();
        $popScene.hide();
        $reCode.hide();
    }

    //function hidePrize() {
    //    var $mask = $("#mask-color-opacity-black");
    //    var $popScene = $("#pop-scene");
    //    var $reCode = $("#reCode");
    //    $mask.hide();
    //    $popScene.hide();
    //    $reCode.hide();
    //}



    function copyText () {
        var $copy_recode = $(".copy_recode");

        console.log("这是列表页的数据行为");
    }
    function acceptEvnt() {
        var $accept_submit = $(".accept_submit"); //点击立即下载
        var $guide_skip_span = $(".guide_skip_span"); //跳过一账通宝页面逻辑
        $accept_submit.tap(function(){
            location.href = PINGAN.appDownUrl;
        });
        $guide_skip_span.tap(function(){
            PINGAN.BvmEvent.bannerVm.run();
        });
        closeWebView();
        MaiDian("0301-进入'流量领取页面'");
    }
    function lotteryEvnt () {
        var $accept_submit = $(".accept_submit"); //点击立即下载
        var $guide_skip_span = $(".guide_skip_span"); //跳过一账通宝页面逻辑
        $accept_submit.tap(function(){
            MaiDian("0302-点击'立即开通'按钮");
            location.href = PINGAN.appDownUrl;
        });
        $guide_skip_span.tap(function(){
            PINGAN.BvmEvent.bannerVm.run();
            MaiDian("0303-点击'请点击直接跳过'按钮");
        });
        closeWebView();
    }
    function goBannerEvnt () {
        var $guide_submit = $(".guide_submit"); //点击立即开通
        var $guide_skip_span = $(".guide_skip_span"); //跳过一账通宝页面逻辑
        $guide_submit.tap(function(){
            MaiDian("0402-点击'立即开通'按钮");
            location.href = PINGAN.appDownUrl;
        });
        $guide_skip_span.tap(function(){
            PINGAN.BvmEvent.bannerVm.run();
            MaiDian("0403-点击'请点击直接跳过'按钮");
        });
        closeWebView();
        MaiDian("0401-进入'一账通宝引导页面'");
    }

    return {
        selectPage:selectPage,
        hideReCode:hideReCode,
        hideMyPrize:hideMyPrize
    };
});