//业务数据处理
define(function(){

    function indexM () {
        console.log("indexM");
        console.log(PINGAN.response);
    }
    function testM () {
        console.log("testM");
        console.log(PINGAN.response);
        console.log("test模型链");
    }
    return {
        indexM:indexM,
        testM:testM
    };
});