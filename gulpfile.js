var gulp = require('gulp');
var uglify = require('gulp-uglify'); //js压缩模块
var chalk = require('chalk'); //控制台彩色输出模块
var minimist = require('minimist'); //命令行参数处理模块
var fs = require('fs'); //文件管理模块
var requirejsOptimize = require('gulp-requirejs-optimize'); //gulp的requirejs优化工具
var amdOptimize = require("amd-optimize");           //require优化
var concat = require('gulp-concat');           //合并
var gulpZip = require('gulp-zip'); //压缩

gulp.task('bvmZip',function(){
   var argv = minimist(process.argv.slice(2));
   console.log(argv);
   zipProject(argv);
});

gulp.task('bvm',function(){
   var argv = minimist(process.argv.slice(2));
   console.log(argv);
   buildProject(argv);
});
/**
 * @{object} path 通过命令行解析出的相关参数
 * return B
 * **/
function zipProject (path) {
   var proName = ""; //项目名称
   var env = ""; //发布环境
   var proPath = "";
   var proZip = "";
   var proDest = "";
   if(path&&path.name&&path.env) {
      proName = path.name;
      env = path.env;
      proPath = 'source/projects/'+proName+'/build/**';
      proZip = proName+'.zip';
      proDest = 'release/'+env;
      gulp.src(proPath)
          .pipe(gulpZip(proZip))
          .pipe(gulp.dest(proDest));
   }else {
      //参数不对的情况
      console.log(chalk.red("请输入需要压缩的项目的名称和发布环境: gulp build --name=proName --env=dev"));
      return false;
   }

}

/**
 * @{object} proInfo 通过命令行解析出的相关参数
 * return B
 * **/
function buildProject(proInfo) {
   var proName = ""; //项目名称
   var proVer = 0;   //项目版本
   var flag = false; //参数是否完整
   if(proInfo) {
      if(proInfo.name) {
         proName = proInfo.name;
      }else {
         //这里只检测项目名是否存在,不检测版本
         console.log(chalk.red("请输入构建项目的名称[版本号]: gulp build --name=proName [--ver=0.0.1]"));
         return false;
      }
      if(proInfo.ver) {
         proVer = proInfo.ver
      }
      if(proName!=="") {
         console.log(chalk.red("Build project name:"+proName));
         if(proVer!=0) {
            console.log(chalk.red("Build project version:"+proVer));
         }
      }
      buildCatalog(proName,proVer); //构建相关目录
   }else {
      //参数为空的时候...似乎不大可能
      console.log(chalk.red("请输入构建项目的名称[版本号]: gulp build --name=proName [--ver=0.0.1]"));
      return false;
   }
}

function buildCatalog(proName,proVer) {
   var path = "source/projects/";
   path = path + proName;
   fs.exists(path,function(flag){
      if(flag) {
         console.log(chalk.green("File create error,the file already exists! "));
      }else{
         fs.mkdir(path,function(err){
            if(err) {
               console.log(chalk.blue("File create error! "+err.code));
            }else{
               if(proVer!==0) {
                  fs.mkdir(path+"/v"+proVer,function(err){
                     if(err){
                        console.log(chalk.yellow("File create error! "+err.code));
                     }else{
                        console.log(chalk.red("File create success!"));
                        //创建相关目录
                        createBaseCatalog(path+"/v"+proVer);
                     }
                  })
               }else{
                  //创建相关目录
                  createBaseCatalog(path);
               }
            }
         });
      }
   });
}

var proPath = "";

function createBaseCatalog(path) {
   proPath = path;
   var scriptPath = path + "/script",
       buildPath = path + "/build",
       appPath = scriptPath + "/app",
       mockPath = scriptPath + "/mock",
       templatePath = scriptPath + "/template",
       stylePath = path + "/style",
       catalogArr = [scriptPath,buildPath,appPath,mockPath,templatePath,stylePath];
   mkBaseCatalog(catalogArr); //采用递归解决多层回调创建文件夹
}
function mkBaseCatalog(pathArr) {
   var _path = "";
   if(pathArr.length>0) {
      _path = pathArr.shift(); //把地址栏第一个地址导出
      fs.exists(_path,function(flag) {
         if(flag) {
            console.log(chalk.green("File "+ _path +" create error,the file already exists!"));
         }else{
            fs.mkdir(_path,function(err){
               if(err) {
                  console.log(chalk.yellow("File " +_path+ " create error! "+err.code));
               }else{
                  console.log(chalk.red("File " +_path+ " create success!"));
                  mkBaseCatalog(pathArr); //递归回调
               }
            })
         }
      })
   }else {
      //如果目录创建完毕,开始拷贝文件到指定目录
      mkBaseFiles();
   }
}
function mkBaseFiles() {
   var bvmPath = "source/webTemplate/bvm",
       interPath = bvmPath + "/script/app/interface.js",
       modelPath = bvmPath + '/script/app/model.js',
       viewPath = bvmPath + "/script/app/view.js",
       vmPath = bvmPath + "/script/app/viewModel.js",
       mainPath = bvmPath + "/script/main.js",
       mockData = bvmPath + "/script/mock/getSummary.json",
       mainHtml = bvmPath + "/script/template/main.html",
       indexCss = bvmPath + "/style/index.css",
       mainCss = bvmPath + "/style/main.css",
       buildPath = bvmPath + "/build.js",
       //rjsPath = bvmPath + "/r.js",
       indexHtml = bvmPath + "/index.html",
       fileArr = [indexHtml,interPath,modelPath,viewPath,vmPath,mainPath,mockData,mainHtml,indexCss,mainCss,buildPath];
   recMkFiles(fileArr);
}

function recMkFiles(fileArr) {
   var _path = "";
   if(fileArr.length>0) {
      _path = fileArr.shift();

      if(_path.indexOf("/app/")>0) {
         gulp.src(_path).pipe(gulp.dest(proPath+"/script/app/"));
      }else if(_path.indexOf("main.js")>0) {
         gulp.src(_path).pipe(gulp.dest(proPath+"/script/"));
      }else if(_path.indexOf("build.js")>0||_path.indexOf("r.js")>0) {
         gulp.src(_path).pipe(gulp.dest(proPath));
      }else if(_path.indexOf("/mock/")>0) {
         gulp.src(_path).pipe(gulp.dest(proPath+"/script/mock/"));
      }else if(_path.indexOf("/template/")>0) {
         gulp.src(_path).pipe(gulp.dest(proPath+"/script/template/"));
      }else if(_path.indexOf("/style/")>0) {
         gulp.src(_path).pipe(gulp.dest(proPath+"/style/"));
      }else if(_path.indexOf("/index.html")>0) {
         gulp.src(_path).pipe(gulp.dest(proPath));
      }

      recMkFiles(fileArr);

   }
}