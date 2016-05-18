(function(win){
    var doc = win.document;
    var head = doc.head;
    var docEl = doc.documentElement;
    var devicePixelRatio = win.devicePixelRatio;//获取设备的密度
    var dpr = 0;
    var scale = 0; //屏幕的缩放比例
    var baseSize = 32*dpr;

    var isAndroid = win.navigator.appVersion.match(/android/gi);
    var isIPhone = win.navigator.appVersion.match(/iphone/gi);
    if (isIPhone) {
        // iOS下，对于密度为2和3的屏，用2倍的方案，其余的用1倍方案
        if (devicePixelRatio >= 3 && (!dpr || dpr >= 3)) {
            dpr = 3;
        } else if (devicePixelRatio >= 2 && (!dpr || dpr >= 2)){
            dpr = 2;
        } else {
            dpr = 1;
        }
    } else {
        // 其他设备下，仍旧使用1倍的方案
        dpr = 1;
    }
    scale = 1 / dpr;
    docEl.setAttribute('data-dpr', dpr);

    var metaContent = "width:device-width,initial-scale="+scale+",maximum-scale="+scale+",minimum-scale="+scale+"user-scalable=no";
    var metaElem = document.createElement("meta");
    metaElem.name = "viewport";
    metaElem.content = metaContent;
    head.appendChild(metaElem); //向html中添加针对当前屏幕的viewport设定

    var doElWidth = docEl.getBoundingClientRect().width;
    if (doElWidth / dpr > 540) {
        doElWidth = 540 * dpr;
    }
    var rem = doElWidth / 12; //12栅格,以1栅格为1rem
    docEl.style.fontSize = rem + 'px'; //设定html基本字体大小
    docEl.style.width = "100%";
    docEl.style.height = "100%";
    docEl.style.overflowx = "hidden";

})(window);