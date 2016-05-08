//与view层自动映射，连接view层和Model层的关键,视图模型层
define(function(){

    PINGAN.BvmEvent.indexVM = {};

    function selectPage () {
        PINGAN.BvmEvent.indexVM = new Bvm({
            el:"#loadings",
            data:{
                text:"这是一个参考handlebars的写法",
                btn:{
                    submit:"确定",
                    cancel:"取消"
                },
                imgSrc:{
                    logo:"https://www.baidu.com/img/bd_logo1.png"
                }
            },
            templates:{
                "index":[
                    {
                        "nodeName":"div",
                        "attribute":"class=btn,id=new",
                        "textNode":"{{btn.submit}}",
                        "childNode":[
                            {
                                "nodeName":"p",
                                "textNode":"{{btn.submit}}"
                            }
                        ]
                    },
                    {
                        "nodeName":"img",
                        "attribute":"class=newImg,src={{imgSrc.logo}}" //暂时只支持一个变量的替换
                    }
                ],
                "list":[{
                    "nodeName":"ul",
                    "loopChildNum":"4",
                    "childNode":[
                        {
                            "nodeName":"li",
                            "attribute":"class=list-@loop",
                            "textNode":"@loop. 新的列表"
                        }
                    ]
                }]
            },
            styles:{
                index:"link(href=http:xxx.css;rel=stylesheet;type=text/css)"
            },
            event:{
                tap:loadTap
            },
            action:{
                clickLoad:[{func:loadTap,async:false},loadSidleLeft,loadSidleRight],
                newAction:indexEvnt
            }

        });
        //PINGAN.BvmEvent.indexVM = new Bvm({
        //    interFace: {func:PINGAN.interFace.indexInter, async:true},
        //    viewChain:PINGAN.view.indexPage,
        //    modelChain:PINGAN.model.indexM,
        //    callBack:indexEvnt,
        //    autoRun:false
        //});
    }

    function loadTap () {
        console.log("loading发生了点击");
    }
    function loadSidleLeft () {
        console.log("loading发生左滑");
    }
    function loadSidleRight () {
        console.log("loading发生右滑");
    }

    function indexEvnt () {
        //回调链，最后重新回到VM层
        var $pageList = $("#pageList");
        $pageList.tap(function(){
            //绑定跳转到列表页
            listVM();
        });
    }
    function listVM () {
        console.log("这是列表页的数据行为");
    }

    return {
        selectPage:selectPage
    };
});