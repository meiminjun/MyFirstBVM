Bvm.js基础语法
========================

### Bvm的设计初衷就是为了解决函数回调和引入回调链的概念(引入函数暂停的概念),主要适用于SPA(单页应用),分层管理页面的相关资源,在整体设计中,页面JS资源分成,四大部分:
#### 这里对参数进行了限制,其实现的本质是对promise的一种简单实现
- interFace(接口层)
- viewChain(视图层)
- modelChain(模型层)
- viewModel(视图模型层)

### 起步

#### 先引入bvm.js

基本例子:

    var backChain = new backChain({
      interFace:indexInter,
      viewChain:{func:function(){indexPage("这是首页视图层的操作")},async:true},
      modelChain:{func:indexM,async:true},
      callBack:callBackFun,
      autoRun:true
    });
    function indexInter (arr) {
      if(arr) {
          console.log(arr);
      }else{
          console.log("这是计划中的接口调用方法");
      }
    }
    function indexPage (arr) {
      if(arr) {
          console.log(arr);
      }else{
          console.log("这是计划中view层的调用方法");
      }
    }
    function indexM (arr) {
      if(arr) {
          console.log(arr);
      }else{
          console.log("这是计划中model层的调用方法");
      }
    }
    function callBackFun (arr) {
      if(arr) {
          console.log(arr);
      }else{
          console.log("这是计划中的回调函数");
      }
    }
        
参数说明:
  interFace:表示接口调用的方法定义
  viewChain:表示视图层执行的方法
  modelChain:表示模型层执行的方法
  callBack:表示当前对象执行完成后的回调函数
  autoRun:表示定义的当前对象的方法是否自动执行
  
回调链方法的执行顺序是按照从上向下的定义顺序开始,但对谁前谁后没有任何限制,但对方法定义只接受这四个参数.autoRun的参数默认是true,可以不添加.
  
接受参数的形式主要有下面三种:

1.匿名函数
> interFace:function(){console.log("这是一个接口调用")}
    
2.函数名
> interFace:indexInter
    
3.匿名函数加已定义函数
> interFace:function(){indexInter("这是一个接口调用")}
    
4.有配置项(是否异步)
> **func后接的函数,接受1,2,3的函数形式,async表示该方法是否异步,false表示同步,回调链不会等待该函数有返回再执行,
   true表示异步,回调链会等待函数执行完再进行下面操作**

> interFace:{func:indexInter,async:true}

通过backChain,初始化后的对象有主要有一个方法:

### run

    例如事例中方法的设置,如果设置autoRun为false
    var chain = new backChain({
          interFace:indexInter,
          viewChain:{func:function(){indexPage("这是首页视图层的操作")},async:true},
          modelChain:{func:indexM,async:true},
          callBack:callBackFun,
          autoRun:false
    });
    那么当前定义好的对象,就不会继续向下执行,这时可以通过run方法,触发方法的执行,比如这时如果调用chain.run();回调链就会继续执行.
    
    如果设置某一个方法的async属性为true,那么回调链也会在运行到该方法时,暂停执行.等待再次调用chain.run()方法,回调链才会继续执行.利用这一特性
    可以轻松处理回调的异步执行问题,在需要异步执行的方法中设置async属性为true,然后在成功回调中调用chain.run()方法.
    
    run方法可以接受相关参数,是向链条当前要执行方法传递的参数.
    比如:chain.run("这是首页的接口方法");(假定当前方法可以接受参数,同时会做相关处理)
    同时也可以用run方法传递回调链上一个方法的处理结果到下一个方法中,只需要在调用时,在run方法中以参数的形式传递.
    
#### runEvent
    返回当前对象回调链的可执行方法有那些
    var chain = new backChain({
          interFace:indexInter,
          viewChain:{func:function(){indexPage("这是首页视图层的操作")},async:true},
          modelChain:{func:indexM,async:true},
          callBack:callBackFun,
          autoRun:false
    });
    chain.runEvent();

#### pluginInfo
    返回当前的插件信息和版本
    var chain = new backChain({
          interFace:indexInter,
          viewChain:{func:function(){indexPage("这是首页视图层的操作")},async:true},
          modelChain:{func:indexM,async:true},
          callBack:callBackFun,
          autoRun:false
    });
    chain.pluginInfo();    


    
