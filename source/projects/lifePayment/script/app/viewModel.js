//与view层自动映射，连接view层和Model层的关键,视图模型层
define(function(){

    PINGAN.BvmEvent.indexVM = {};
    PINGAN.BvmEvent.addAccountVM = {};

    function selectPage () {
        PINGAN.BvmEvent.indexVM = new Bvm({
            //interFace: {func:PINGAN.interFace.indexInter, async:true},
            viewChain:PINGAN.view.indexPage,
            //modelChain:PINGAN.model.indexM,
            callBack:indexEvnt
        });
        PINGAN.BvmEvent.addAccountVM = new Bvm({
            //interFace: {func:PINGAN.interFace.indexInter, async:true},
            viewChain:PINGAN.view.addAccountPage,
            //modelChain:PINGAN.model.indexM,
            callBack:addAccountEvnt,
            autoRun:false
        });
        PINGAN.BvmEvent.payListVM = new Bvm({
            //interFace: {func:PINGAN.interFace.indexInter, async:true},
            viewChain:PINGAN.view.payListPage,
            //modelChain:PINGAN.model.indexM,
            callBack:payListEvnt,
            autoRun:false
        });
        PINGAN.BvmEvent.resultVM = new Bvm({
            //interFace: {func:PINGAN.interFace.indexInter, async:true},
            viewChain:PINGAN.view.resultPage,
            //modelChain:PINGAN.model.indexM,
            callBack:resultEvnt,
            autoRun:false
        });
        PINGAN.BvmEvent.serviceVM = new Bvm({
            viewChain:PINGAN.view.servicePage,
            autoRun:false
        })
    }

    function indexEvnt() {
        console.log("是否运行到这里");
        //首页事件
        var runTimeLine = setTimeout(function(){
            indexRunEvnt();
            clearTimeout(runTimeLine);
        },100); //100ms的延时绑定

    }
    function indexRunEvnt () {
        var $menuIcon = $(".menuIcon");
        $menuIcon.tap(function(e){
            var targetId = e.target.id;
            var className = e.target.className;
            var hasOp2 = className.indexOf("op2") > -1;
            if(!hasOp2) {
                //如果当前按钮可用
                //PINGAN.BvmEvent.addAccountVM.run(targetId);
                //PINGAN.BvmEvent.resultVM.run(targetId);
                //PINGAN.BvmEvent.serviceVM.run();
                PINGAN.BvmEvent.payListVM.run();
            }else{
                newAlert("此服务即将开通");
            }
        });
    }
    /**
     * 添加账号页面的回调事件
     * @参数 无
     * @返回 无
     */
    function addAccountEvnt () {
        var $checkBtn = $("#checkBtn");
        $checkBtn.tap(function(){
            showPopDrop("没有查到未缴账单<br>当前无欠费或最新账单未出","知道了");
        })
    }
    /**
     * 结果页的回调事件
     * @参数 无
     * @返回 无
     */
    function resultEvnt () {

    }
    /**
     * 缴费记录页的回调事件
     * @参数 无
     * @返回 无
     */
    function payListEvnt () {

    }
    return {
        selectPage:selectPage
    };
});