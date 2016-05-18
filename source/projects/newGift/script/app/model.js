//业务数据处理
define(function(){

    function indexM () {

    }


    function modelRe(response){

        var phonecode=document.getElementById("cody-ph");
        var phonerie=document.getElementById("cody-rie");
        var phonebot = document.getElementById("p-bottom-phon");
        var wrongphone=document.getElementById("tel-tip");
        var phonname = document.getElementById("Name");
        var phonfeil = document.getElementById("feil");
        var phonmycody = document.getElementById("cody");

        var recordList = document.getElementById("recordList");
        var elementVar = "";
        //var newReward = response.body.newReward;
        //$("#newReward").html(newReward);

        //遍历中奖纪录
        $.each(response.recordList,function(index,obj){
            elementVar = elementVar + '\<div class="cen-draw-s">'+
                '\<div class="cen-draw-i"><img src="'+obj.prizeImagePath+'"/> </div>';
            if(obj.isPrize=='3' && obj.Recprid == 'Y'){
                elementVar = elementVar + '\<div class="sibemit">领取奖品</div><input name="prizeId" type="hidden" value="'+obj.prizeId+'" >';
            }else if( obj.isPrize=='3' && obj.Recprid == 'N'){
                elementVar = elementVar + '\<div class="sibemitNo">已领取</div><input name="prizeId" type="hidden" value="'+obj.prizeId+'" >';
            }

            elementVar = elementVar + '\<div class="cen-draw-text">'+
                '\<div class="cen-draw-code"><label class="p-feil">抽奖码</label> <label id="Idcody">'+obj.drawCode+'\</label></div>'+
                '\<div class="cen-draw-y-n"><label class="p-feil">是否中奖</label> <label id="NoweCody">';
            if(obj.isPrize=='1'){
                elementVar = elementVar + '等待开奖';
            }else if(obj.isPrize=='2'){
                elementVar = elementVar + '未中奖';
            }else if(obj.isPrize=='3'){
                elementVar = elementVar + '中奖';
            }
            elementVar = elementVar + '\</label></div></div>'+
                '\</div>';
        })
        recordList.innerHTML = elementVar;


    }

    function page_lotteryM (response) {
        var rewardActivityInfo = response.body.rewardActivityInfo;
        var result = "";
        for(var i = 0;i < rewardActivityInfo.length;i++) {
            var item = rewardActivityInfo[i];
            var activityNum = item.activityNum,
                backPic = item.backPic,
                prizeCode = item.prizeCode,
                prizeNum = item.prizeNum,
                winnerCode = item.winnerCode;

            var date = new Date();
            var endDate = item.lotteryTime;

            // 获取现在和开奖时间格式的时间戳

            var timestamp = Date.parse(new Date(endDate));
                timestamp = timestamp / 1000;

            console.log(endDate + "的时间戳为：" + timestamp);


            result += '<div class="Content"><div class="Content_Pic"></div><div class="Mid"><div class="midleft"><p>已参与的人数:'+activityNum+'</p><p>库存数量:'+prizeNum+'</p><p class="countdown" endTime='+timestamp+'>剩余时间:'+str+'</p></div></div><div class="Bottom">中奖号码<span id="leftBottom">'+winnerCode+'</span></div><div class="draw_btn"><span class="draw_btn_code">领取抽奖码</span></div></div>';

        }

        $("#midContent").append(result);
        debugger;
        expire_time();
        var str = "";

    }

    /**
     * 批量倒计时方法
     */
    //倒计时
    function counterClock(left_time) {

        var left_time = parseInt(left_time);
        var days_second = 86400; //每天時間
        var hours_second = days_second / 24;
        var minute_second = hours_second / 60;
        var str = '';
        if(left_time > 0) {
            var days = parseInt(left_time / days_second);
            str += (days > 0) ? days + '天' : '';
            var hours = parseInt((left_time - days * days_second) / hours_second);
            str += hours > 0 ? hours + '時' : '';
            var minutes = parseInt((left_time - days * days_second - hours_second * hours) / minute_second);
            str += minutes > 0 ? minutes + '分' : '';
            second = left_time - days * days_second - hours_second * hours - minutes * minute_second;
            str += second + '秒';
        }
        return str;
    }

    function expire_time() {

        $('#midContent').each(function() {
            var time_obj = $(this).find('.midleft');
            var endTime = time_obj.attr('endTime');
            if(endTime) {
                var time_string = counterClock(endTime);
                if(time_string == '')
                    time_obj.html('<span class="pngfix">&nbsp;</span>已失效');
                else {
                    time_obj.html('<span class="pngfix">&nbsp;</span>' + time_string);
                    time_obj.attr('endTime', endTime - 1);
                }
            }
        });
        window.setTimeout(function() {
            expire_time();
        }, 1000);
    }

    function drawM (response) {
        var drawCode = response.body.drawCode;
        $("#dramCode").html(drawCode);


        var drawNum = response.body.drawNum;
        $("#residueDegree").html(drawNum);



    }
    function overTimeM () {

        var b = /1\d{10}$/;
        var phoneinput = document.getElementById("phoneInput");
        var wrongphone = document.getElementById("phoneNumErr");
        var messageInput = document.getElementById("messageInput");
        var mes_formatErr = document.getElementById("mes_formatErr");
        wrongphone.style.visibility = "hidden";
        mes_formatErr.style.visibility = "hidden";

        //手机输入框失去聚焦事件
        phoneinput.onblur = function () {
            if (this.value == "") {
                wrongphone.innerHTML = "手机号码不能为空";
                wrongphone.style.visibility = "visible";
            } else if (!b.test(this.value)) {
                wrongphone.innerHTML = "手机号输入不符合规范";
                wrongphone.style.visibility = "visible";
            } else {
                wrongphone.style.visibility = "hidden";
                mes_formatErr.style.visibility = "hidden";
            }
        };
        //手机号输入框输入完成自动跳入验证码输入框
        phoneinput.onkeyup = function () {
            if (this.value.length == "11" && b.test(this.value)) {
                messageInput.focus();
            }
        };
        //短信验证码
        var wait=60;
        document.getElementById("ot_obtain").disabled = false;
        function time(o) {
            if (wait === 0) {
                o.removeAttribute("disabled");
                o.value="重新获取验证码";
                wait = 60;
            } else {
                o.setAttribute("disabled", true);
                o.value="重新发送(" + wait + ")";
                wait--;
                setTimeout(function() {
                        time(o);
                    },
                    1000);
            }
        }
        $("#ot_obtain").tap(function(){
            time(this);
        });
    }

        function myPrizeto() {

        }

        function acceptM(body) {
            var isNewUser = body.isNewUser;
            var isAccept = ""; //纪录用户是否领过奖
            var userAcceptInfo = {}; //纪录用户的推荐码和领取流量的纪录
            if (isNewUser == "Y") {
                //是新用户,在判断用户是否领过奖
                isAccept = body.isAccept;
                if (isAccept == "Y") {
                    //如果用户已经领过奖,这样就把用户当作老用户处理
                    localStorage.setItem("inviteCode", body.inviteCode);
                    PINGAN.BvmEvent.guideVm.run();
                    //userAcceptInfo.inviteCode = body.inviteCode;
                    //userAcceptInfo.newReward = body.newReward;
                    //PINGAN.BvmEvent.acceptVM.run(userAcceptInfo);
                } else {
                    //弹出填写推荐码的弹窗
                    PINGAN.BvmEvent.showOcr.run();
                }
            } else {
                //是老用户
                if (body.inviteCode) {
                    //如果有推荐码
                    localStorage.setItem("inviteCode", body.inviteCode);
                    PINGAN.BvmEvent.guideVm.run();
                }
            }
        }

        function lotteryM(body) {
            var isNewUser = body.isNewUser;
            var userAcceptInfo = {}; //纪录用户的推荐码和领取流量的纪录
            if (isNewUser == "Y") {
                //是新用户
                localStorage.setItem("inviteCode", body.inviteCode);
                userAcceptInfo.inviteCode = body.inviteCode;
                userAcceptInfo.newReward = body.newReward;
                PINGAN.BvmEvent.lotteryVM.run(userAcceptInfo);
                PINGAN.viewModel.hideReCode();
            } else {
                //是老用户
                if (body.inviteCode) {
                    //如果有推荐码
                    localStorage.setItem("inviteCode", body.inviteCode);
                    PINGAN.BvmEvent.guideVm.run();
                    PINGAN.viewModel.hideReCode();
                }
            }
        }

        function checkUser(body) {
            var isAccept = body.isAccept;
            if (isAccept == "Y") {
                //表示当前用户已经填写过推荐码
                PINGAN.BvmEvent.acceptVM.run(); //继续acceptVM的回调链
            } else {
                //用户未填写过推荐码
                PINGAN.BvmEvent.showOcr.run(); //弹起填写Ocr的页面
            }
        }

        function testM() {
            console.log("testM");
            console.log(PINGAN.response);
            console.log("test模型链");
        }

        function myRecordM(body) {
            var main_pop_content = $(".main_pop_content");
            var recom = $(".recom");
            var recom_new = $(".recom_new");
            if (body.inviteCode) {
                //当前用户有推荐码
                localStorage.setItem("inviteCode", body.inviteCode);
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
            } else {
                //当前用户没有推荐码,认为是新用户
                main_pop_content.hide();
                recom.hide();
                recom_new.show();
                PINGAN.BvmEvent.myRecord.run();
            }
        }

        function guideM() {
            var reCodeNo = $("#guideReCodeNo"); //推荐码
            var inviteCode = localStorage.getItem("inviteCode");
            reCodeNo.val(inviteCode);
        }

        function bannerM() {
            var reCodeNo = $("#bannerReCodeNo"); //推荐码
            var inviteCode = localStorage.getItem("inviteCode");
            reCodeNo.val(inviteCode);
            closeWebView();
            MaiDian("0501-进入'业务加挂页面'");
        }

        return {
            indexM: indexM,
            page_lotteryM: page_lotteryM,
            testM: testM,
            acceptM: acceptM,
            checkUser: checkUser,
            myRecordM: myRecordM,
            guideM: guideM,
            bannerM: bannerM,
            lotteryM: lotteryM,
            drawM: drawM,
            modelRe: modelRe,
            overTimeM: overTimeM,
            myPrizeto: myPrizeto
        };

});


