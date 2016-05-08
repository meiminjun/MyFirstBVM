//业务数据处理
define(function(){

function myPrizeto(){


}
    function modelRe(data){
        var phonecode=document.getElementById("cody-ph");
        var phonerie=document.getElementById("cody-rie");
        var phonebot = document.getElementById("p-bottom-phon");
        var wrongphone=document.getElementById("tel-tip");
        var phonname = document.getElementById("Name");
        var phonfeil = document.getElementById("feil");
        var phonmycody = document.getElementById("cody");
        var recordList = document.getElementById("recordList");
        var elementVar = "";

        //遍历中奖纪录
        $.each(data.recordList,function(index,obj){
            elementVar = elementVar + '\<div class="cen-draw-s">'+
                '\<div class="cen-draw-i"><img src="'+obj.prizeImagePath+'"/> </div>';
            if(obj.isPrize=='Y'){
                elementVar = elementVar + '\<div class="sibemit">领取奖品</div>';
            }

            elementVar = elementVar + '\<div class="cen-draw-text">'+
                '\<div class="cen-draw-code"><label class="p-feil">抽奖码</label> <label id="Idcody">'+obj.drawCode+'\</label></div>'+
                '\<div class="cen-draw-y-n"><label class="p-feil">是否中奖</label> <label id="NoweCody">';
            if(obj.isPrize=='Y'){
                elementVar = elementVar + '是';
            }else{
                elementVar = elementVar + '否';
            }
            elementVar = elementVar + '\</label></div></div>'+
                '\</div>';
        })

        recordList.innerHTML = elementVar;


    }


    function mainPageM (body) {
        //alert("model获得的入参数据");
        //alert(body);
    }
    function drawM () {

    }
    function myPrizeto(){

    }
    function acceptM(body) {
        var isNewUser = body.isNewUser;
        var isAccept = ""; //纪录用户是否领过奖
        var userAcceptInfo = {}; //纪录用户的推荐码和领取流量的纪录
        if(isNewUser=="Y") {
            //是新用户,在判断用户是否领过奖
            isAccept = body.isAccept;
            if(isAccept=="Y") {
                //如果用户已经领过奖,这样就把用户当作老用户处理
                localStorage.setItem("inviteCode",body.inviteCode);
                PINGAN.BvmEvent.guideVm.run();
                //userAcceptInfo.inviteCode = body.inviteCode;
                //userAcceptInfo.newReward = body.newReward;
                //PINGAN.BvmEvent.acceptVM.run(userAcceptInfo);
            }else{
                //弹出填写推荐码的弹窗
                PINGAN.BvmEvent.showOcr.run();
            }
        }else{
            //是老用户
            if(body.inviteCode){
                //如果有推荐码
                localStorage.setItem("inviteCode",body.inviteCode);
                PINGAN.BvmEvent.guideVm.run();
            }
        }
    }
    function lotteryM(body) {
        var isNewUser = body.isNewUser;
        var userAcceptInfo = {}; //纪录用户的推荐码和领取流量的纪录
        if(isNewUser=="Y") {
            //是新用户
            localStorage.setItem("inviteCode",body.inviteCode);
            userAcceptInfo.inviteCode = body.inviteCode;
            userAcceptInfo.newReward = body.newReward;
            PINGAN.BvmEvent.lotteryVM.run(userAcceptInfo);
            PINGAN.viewModel.hideReCode();
        }else{
            //是老用户
            if(body.inviteCode){
                //如果有推荐码
                localStorage.setItem("inviteCode",body.inviteCode);
                PINGAN.BvmEvent.guideVm.run();
                PINGAN.viewModel.hideReCode();
            }
        }
    }
    function checkUser(body) {
        var isAccept = body.isAccept;
        if(isAccept=="Y") {
            //表示当前用户已经填写过推荐码
            PINGAN.BvmEvent.acceptVM.run(); //继续acceptVM的回调链
        }else{
            //用户未填写过推荐码
            PINGAN.BvmEvent.showOcr.run(); //弹起填写Ocr的页面
        }
    }
    function testM () {
        console.log("testM");
        console.log(PINGAN.response);
        console.log("test模型链");
    }
    function myRecordM(body) {
        var main_pop_content = $(".main_pop_content");
        var recom = $(".recom");
        var recom_new = $(".recom_new");
        if(body.inviteCode) {
            //当前用户有推荐码
            localStorage.setItem("inviteCode",body.inviteCode);
            var newReward = body.newReward; //新人奖领了多少流量
            var recommendNo = body.recommendNo; //推荐了多少人
            var recommendReward = body.recommendReward; //推荐奖领了多少流量
            var inviteCode = body.inviteCode; //当前用户有推荐码
            var newAward = $("#newAward"); //新人领了多少流量
            var recomAward = $("#recomAward"); //推荐奖
            var recomNum = $("#recomNum"); //推荐了多少人
            var reCodeNo = $("#reCodeNo"); //推荐码
            newAward.html(newReward);
            recomAward.html(recommendReward);
            recomNum.html(recommendNo);
            reCodeNo.val(inviteCode);
            main_pop_content.show();
            recom.show();
            recom_new.hide();
            PINGAN.BvmEvent.myRecord.run();
        }else{
            //当前用户没有推荐码,认为是新用户
            main_pop_content.hide();
            recom.hide();
            recom_new.show();
            PINGAN.BvmEvent.myRecord.run();
        }
    }
    function guideM () {
        var reCodeNo = $("#guideReCodeNo"); //推荐码
        var inviteCode = localStorage.getItem("inviteCode");
        reCodeNo.val(inviteCode);
    }
    function bannerM () {
        var reCodeNo = $("#bannerReCodeNo"); //推荐码
        var inviteCode = localStorage.getItem("inviteCode");
        reCodeNo.val(inviteCode);
        closeWebView();
        MaiDian("0501-进入'业务加挂页面'");
    }

    return {
        mainPageM:mainPageM,
        testM:testM,
        acceptM:acceptM,
        checkUser:checkUser,
        myRecordM:myRecordM,
        guideM:guideM,
        bannerM:bannerM,
        lotteryM:lotteryM,
        drawM:drawM,
        modelRe:modelRe,
        myPrizeto:myPrizeto
    };
});