### V0.0.2更新日志

    基本思路是引入事件驱动,是事件去驱动所有的行为.
    
1. 增加el属性(参考Vue:用来获取某个元素,document.querySelectorAll),event(定义手势对应的执行事件,目前只支持常用手势:参加2,除条目2中支持的
    事件,另外还有一个自动运行事件autoRun,这个相当于是整个事件流的初始化方法,除此之外的方法都属于用户自定义方法),data属性(参考vue:用来存储整个
    控制流需要传输的数据,相当于是存放当前控制流的存储空间,以对象形式存在)和action(动作流:定义某一次控制流可能具备的操作列表,操作列表之间是按定
    义的顺序执行,如果需要并发执行,可以写到一个操作列),templates(模板,使回调链具备组件的dom能力),styles(样式,使回调链具备组件的样式能力)
2. 封装常用手势(点击:tap,从左往右滑:sidleRight,从右往左滑:sidleLeft,从上往下:sidleDown,从下往上:sidleUp)
3. 动作流有自己的运行逻辑,会按照定义的顺序自动执行,运行逻辑的字段可以是预设的字段,也可以是自定义的字段,推荐的预设字段有:
    interFace(接口层)
    viewChain(视图层)
    modelChain(模型层)
    viewModel(模型视图层)
    eventName+Back(事件名 回调)
4. 引入templates和styles是希望回调链具备基础的组件能力,templates中定义dom结构,styles中定义配套组件用到的样式.event中可以定义组件常用的事件
   响应,data中又可以当作组件的中间存储层,action可以理解成是动作库,定义不同事件的响应动作.

   允许的事件(event)主要包括:常用手势封装(tap,sidleRight,sidleLeft,sidleTop,sidleDown),自动运行方法(人口方法:autoRun),其他可接受
   用户自定义方法.预定方法会直接和存在对相关手势发生事件绑定.
    
   action映射到event,event定义触发动作的方法,方法可以从外部直接调用,action支持单操作列定义多个事件方法,这些事件会按定义的前后顺序同步执行,
   不会去等待一个函数的执行后的回调.但操作列直接存在等待回调的情况,存在上一个操作列的结果是下一个操作列的数据来源(需要使用时可以到当前对象的
   data中去取自己在上一个回调完成时写入到data的数据).action对外不暴露,无法直接访问到,访问action,需要通过event中定义的事件.但event对应某
   个事件的执行函数,可以是action中定义的值,也可以是直接写好的匿名函数.
    
    新的调用方式如下:
        var backChain = new backChain({
          el:"#loading",
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
                   "textNode":"{{text}}",
                   "childNode":[
                       {
                           "nodeName":"p",
                           "textNode":"{{btn.submit}}"
                       }
                   ]
               },
               {
                   "nodeName":"img",
                   "attribute":"src={{imgSrc.logo}}"
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
            index:"
             .btn{
                background:#F00;
                color:#00F
             }
            ",
            list:"link(href=http:xxx.css;rel=stylesheet;type=text/css)"
          },
          event:{
            autoRun:interFace,
            sidleRight:viewChain,
            tap:function(){console.log("发生列点击")},
            sidleLeft:function(){console.log("用户发生左滑操作")}
          },
          action:{
            interFace:[{
            
            }]indexInter,
            viewChain:{func:function(){indexPage("这是首页视图层的操作")},async:true},
            modelChain:{func:indexM,async:true},
            callBack:callBackFun,
          }
        });
### v0.0.2的模板系统
    模板系统是一个符合json格式的参考Dom数构建的系统,通过解析,可以得到一段Html文件,这样后端就可以通过这个模板给前端输出页面
    div(class=btn,id=new,style=padding:0px;)
    {{text}} //这里如果不加任何前缀就是取data.text的参数
    

ps:...貌似开启了写轮眼模式,看到好的功能就能直接山寨了

### v0.0.3预估功能
1. 增加控制台的概念,在控制台管理多个动作流