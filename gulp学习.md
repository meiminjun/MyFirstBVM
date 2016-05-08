gulp借鉴了unix的管道的思想(pipe),使用起来更加直观方便

### src方法
    gulp.src(globs[, options])
    说明:指定需要处理的源文件的路径
    globs:(必填 String or Array) 文件匹配模式(类似正则表达式),用来匹配文件路径,也可以直接指定某个具体文件路径,当有多个匹配模式时,该参数
    可以为一个数值.
    options:(可选 Object) 可选参数
    options.buffer：是否返回buffer，默认是true。
    options.read：设置为false，返回的file.content为null，就是不会读取该文件。默认为true。
    options.base：指glob开始匹配的前面的任何东西
    
    Gulp内部使用了node-glob模块来实现其文件匹配功能。我们可以使用下面这些特殊的字符来匹配我们想要的文件:
    * 匹配文件路径中的0个或多个字符，但不会匹配路径分隔符，除非路径分隔符出现在末尾
    ** 匹配路径中的0个或多个目录及其子目录,需要单独出现，即它左右不能有其他东西了。如果出现在末尾，也能匹配文件。
    ? 匹配文件路径中的一个字符(不会匹配路径分隔符)
    [...] 匹配方括号中出现的字符中的任意一个，当方括号中第一个字符为^或!时，则表示不匹配方括号中出现的其他字符中的任意一个，类似js正则表达式中的用法
    !(pattern|pattern|pattern) 匹配任何与括号中给定的任一模式都不匹配的
    ?(pattern|pattern|pattern) 匹配括号中给定的任一模式0次或1次，类似于js正则中的(pattern|pattern|pattern)?
    +(pattern|pattern|pattern) 匹配括号中给定的任一模式至少1次，类似于js正则中的(pattern|pattern|pattern)+
    *(pattern|pattern|pattern) 匹配括号中给定的任一模式0次或多次，类似于js正则中的(pattern|pattern|pattern)*
    @(pattern|pattern|pattern) 匹配括号中给定的任一模式1次，类似于js正则中的(pattern|pattern|pattern)
    下面以一系列例子来加深理解
    
    * 能匹配 a.js,x.y,abc,abc/,但不能匹配a/b.js
    *.* 能匹配 a.js,style.css,a.b,x.y
    */*/*.js 能匹配 a/b/c.js,x/y/z.js,不能匹配a/b.js,a/b/c/d.js
    ** 能匹配 abc,a/b.js,a/b/c.js,x/y/z,x/y/z/a.b,能用来匹配所有的目录和文件
    **/*.js 能匹配 foo.js,a/foo.js,a/b/foo.js,a/b/c/foo.js
    a/**/z 能匹配 a/z,a/b/z,a/b/c/z,a/d/g/h/j/k/z
    a/**b/z 能匹配 a/b/z,a/sb/z,但不能匹配a/x/sb/z,因为只有单**单独出现才能匹配多级目录
    ?.js 能匹配 a.js,b.js,c.js
    a?? 能匹配 a.b,abc,但不能匹配ab/,因为它不会匹配路径分隔符
    [xyz].js 只能匹配 x.js,y.js,z.js,不会匹配xy.js,xyz.js等,整个中括号只代表一个字符
    [^xyz].js 能匹配 a.js,b.js,c.js等,不能匹配x.js,y.js,z.js

    当有多种匹配模式时可以使用数组
    
    //使用数组的方式来匹配多种文件
    gulp.src(['js/*.js','css/*.css','*.html'])
    使用数组的方式还有一个好处就是可以很方便的使用排除模式，在数组中的单个匹配模式前加上!即是排除模式，它会在匹配的结果中排除这个匹配，要注意一点的是不能在数组中的第一个元素中使用排除模式
    
    gulp.src([*.js,'!b*.js']) //匹配所有js文件，但排除掉以b开头的js文件
    gulp.src(['!b*.js',*.js]) //不会排除任何文件，因为排除模式不能出现在数组的第一个元素中
    此外，还可以使用展开模式。展开模式以花括号作为定界符，根据它里面的内容，会展开为多个模式，最后匹配的结果为所有展开的模式相加起来得到的结果。展开的例子如下：
    
    a{b,c}d 会展开为 abd,acd
    a{b,}c 会展开为 abc,ac
    a{0..3}d 会展开为 a0d,a1d,a2d,a3d
    a{b,c{d,e}f}g 会展开为 abg,acdfg,acefg
    a{b,c}d{e,f}g 会展开为 abdeg,acdeg,abdeg,abdfg
    
    
    
    gulp.src()方法正是用来获取流的，但要注意这个流里的内容不是原始的文件流，而是一个虚拟文件对象流(Vinyl files)，这个虚拟文件对象中
    存储着原始文件的路径、文件名、内容等信息

### task方法
    gulp.task(name[,deps,fn]) 
    说明:定义一个gulp任务
    name:(必填 String) 指定任务的名称
    deps:(选填 StringArray) 在任务执行前要执行和完成的任务的数组。
    fn:  (选填 Function) 任务函数

    gulp.task('testLess', function () {
       return gulp.src(['less/style.less'])
              .pipe(less())
              .pipe(gulp.dest('./css'))
    })
    gulp.task('minicss', ['testLess'], function () { //minicss依赖于testLess任务,minicss一定会在testLess任务后再运行
       gulp.src(['css/*.css'])
            .pipe(minifyCss())
            .pipe(gulp.dest(./dist/css'));
    })
    
    gulp.task('build', ['css', 'js', 'img']);
    上面代码先指定build任务，它由css、js、imgs三个任务所组成，task build方法会并发执行这三个任务。每个任务都是异步调用,没办法保证
    js的执行时间一定是在css任务之后.
    
    PS:这个方法最主要是如何指定任务的执行顺序

### dest方法
    gulp.dest(path[,options])
    说明:dest方法是指定处理后文件输出写入文件,如果目录不存在,将会被新建
    path:(必填 string or function) 指定文件输出路径，或者定义函数返回文件输出路径亦可；
    options:(选填 Object) 有2个属性cwd,mode
      options.cwd:(string) 指定写入路径的基准目录,默认是当前目录
      options.mode:(string) 指定写入文件的权限,默认是0777
      
    PS:这个方法最主要是理解好它传入的路径参数与最终生成的文件关系.
      生成的文件名是由导入到它的文件流决定的,即使传入一个带有文件名的路径参数,也会把这个文件名当作是目录名.
      gulp.dest(path)生成的文件路径是我们传入的path参数后面再加上gulp.src()中有通配符开始出现的那部分路径
      
    var gulp = require('gulp');
    gulp.src('script/jquery.js')
        .pipe(gulp.dest('dist/foo.js'));
    //最终生成的文件路径为 dist/foo.js/jquery.js,而不是dist/foo.js
    
    gulp.src('script/avalon/avalon.js') //没有通配符出现的情况
        .pipe(gulp.dest('dist')); //最后生成的文件路径为 dist/avalon.js
    
    //有通配符开始出现的那部分路径为 **/underscore.js
    gulp.src('script/**/underscore.js')
        //假设匹配到的文件为script/util/underscore.js
        .pipe(gulp.dest('dist')); //则最后生成的文件路径为 dist/util/underscore.js
    
    gulp.src('script/*') //有通配符出现的那部分路径为 *
        //假设匹配到的文件为script/zepto.js    
        .pipe(gulp.dest('dist')); //则最后生成的文件路径为 dist/zepto.js
        
    通过指定gulp.src()方法配置参数中的base属性，我们可以更灵活的来改变gulp.dest()生成的文件路径。
    当我们没有在gulp.src()方法中配置base属性时，base的默认值为通配符开始出现之前那部分路径，例如：
    
    gulp.src('app/src/**/*.css') //此时base的值为 app/src
    上面我们说的gulp.dest()所生成的文件路径的规则，其实也可以理解成，用我们给gulp.dest()传入的路径替换掉gulp.src()中的base路径，最终得到生成文件的路径。
    
    gulp.src('app/src/**/*.css') //此时base的值为app/src,也就是说它的base路径为app/src
         //设该模式匹配到了文件 app/src/css/normal.css
        .pipe(gulp.dest('dist')) //用dist替换掉base路径，最终得到 dist/css/normal.css
    所以改变base路径后，gulp.dest()生成的文件路径也会改变
    
    gulp.src(script/lib/*.js) //没有配置base参数，此时默认的base路径为script/lib
        //假设匹配到的文件为script/lib/jquery.js
        .pipe(gulp.dest('build')) //生成的文件路径为 build/jquery.js
    
    gulp.src(script/lib/*.js, {base:'script'}) //配置了base参数，此时base路径为script
        //假设匹配到的文件为script/lib/jquery.js
        .pipe(gulp.dest('build')) //此时生成的文件路径为 build/lib/jquery.js    
    

### watch方法
    gulp.watch(glob[, opts], tasks) or gulp.watch(glob [, opts, cb])
    说明:watch方法用于指定需要监视的文件,一旦这些文件发生变化,
    glob:(必填 String or Array) 需要处理的源文件匹配符路径
    opts:(选填 Object) 可选的配置对象,通常不需要用到
    tasks:(必填 Array) 文件变化后要执行的任务
    gulp.task('uglify',function(){
      //do something
    });
    gulp.task('reload',function(){
      //do something
    });
    gulp.watch('js/**/*.js', ['uglify','reload']);
    cb:(选填 Function) 回调函数，代替指定的任务(其中回调函数包含一些基本信息:type为变化类型,path为变化文件路径)
    gulp.watch('js/**/*.js', function(event){
        console.log(event.type); //变化类型 added为新增,deleted为删除，changed为改变 
        console.log(event.path); //变化的文件的路径
    }); 
    
### 常用插件

    gulp-uglify 压缩js代码
    安装:npm install --save-dev gulp-uglify
    gulp-minify-css 压缩css代码
    安装:npm install --save-dev gulp-minify-css
    gulp-minify-html 压缩html文件
    安装:npm install --save-dev gulp-minify-html
    gulp-jshint 用来检查js代码
    安装:npm install --save-dev gulp-jshint
    gulp-concat 把多个文件合并为一个文件,我们可以用它来合并js或css文件等，这样就能减少页面的http请求数了
    安装:npm install --save-dev gulp-concat
    gulp-less 编译less
    安装:npm install --save-dev gulp-less
    gulp-sass 编译sass
    安装:npm install --save-dev gulp-sass
    gulp-imagemin 图片压缩
    安装:npm install --save-dev gulp-imagemin
    gulp-load-plugins 按package.json加载文件
    安装:npm install --save-dev gulp-load-plugins
    gulp-rename 用来重命名文件流中的文件
    安装:npm install --save-dev gulp-rename
    gulp-minify-css 要压缩css文件时可以使用该插件
    安装:npm install --save-dev gulp-minify-css
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    