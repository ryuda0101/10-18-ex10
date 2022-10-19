// npm init
// npm install ejs express mongodb moment
// npm install express-session passport passport-local

// 설치한것을 불러들여 그 안의 함수 명령어들을 쓰기위해 변수로 세팅
const express = require("express");
// 데이터베이스의 데이터 입력, 출력을 위한 함수명령어 불러들이는 작업
const MongoClient = require("mongodb").MongoClient;
// 시간 관련된 데이터 받아오기위한 moment라이브러리 사용(함수)
const moment = require("moment");
// 로그인 관련 데이터 받아오기위한 작업
// 로그인 검증을 위해 passport 라이브러리 불러들임
const passport = require('passport');
// Strategy(전략) → 로그인 검증을 하기 위한 방법을 쓰기 위해 함수를 불러들이는 작업
const LocalStrategy = require('passport-local').Strategy;
// 사용자의 로그인 데이터 관리를 위한 세션 생성에 관련된 함수 명령어 사용
const session = require('express-session');
const { syncBuiltinESMExports } = require("module");

const app = express();

// 포트번호 변수로 세팅
const port = process.env.PORT || 8000;


// ejs 태그를 사용하기 위한 세팅
app.set("view engine","ejs");
// 사용자가 입력한 데이터값을 주소로 통해서 전달되는 것을 변환(parsing)
app.use(express.urlencoded({extended: true}));
// css나 img, js와 같은 정적인 파일 사용하려면 ↓ 하단의 코드를 작성해야한다.
app.use(express.static('public'));


// 로그인 관련 작언을 하기 위한 세팅
// 로그인 관련 작업시 세션을 생성하고 데이터를 기록할 때 세션 이름의 접두사 / 세션 변경시 자동저장 유무 설정
app.use(session({secret : '비밀코드', resave : true, saveUninitialized: false}));
// passport라이브러리 실행
app.use(passport.initialize());
// 로그인 검증시 세션데이터를 이용해서 검증하겠다.
app.use(passport.session());


// Mongodb 데이터 베이스 연결작업
// 데이터베이스 연결을 위한 변수 세팅 (변수의 이름은 자유롭게 지어도 ok)
let db;
// Mongodb에서 데이터베이스를 만들고 데이터베이스 클릭 → connect → Connect your application → 주소 복사, password에는 데이터베이스 만들때 썼었던 비밀번호를 입력해 준다.
MongoClient.connect("mongodb+srv://admin:qwer1234@testdb.g2xxxrk.mongodb.net/?retryWrites=true&w=majority",function(err,result){
    // 에러가 발생했을 경우 메세지 출력 (선택사항임. 안쓴다고 해서 문제가 되지는 않는다.)
    if(err){ return console.log(err);}

    // 위에서 만든 db변수에 최종적으로 연결 / ()안에는 mongodb atlas에서 생성한 데이터 베이스 이름 집어넣기
    db = result.db("testdb");

    // db연결이 제대로 되었다면 서버 실행
    app.listen(port,function(){
        console.log("서버연결 성공");
    });
});



// 메인페이지 get요청
app.get("/",function(req,res){
    res.render("index",{userData:req.user});    // 로그인시 회원정보 데이터 ejs파일로 전달
    // res.send("메인페이지 /join 또는 /login으로 가시오")
});

// 기업소개 페이지 get 요청
app.get("/introduce",function(req,res){
    res.render("introduce",{userData:req.user});    // 로그인시 회원정보 데이터 ejs파일로 전달
});

// 게시글 목록 get 요청
app.get("/brdlist",function(req,res){
    // db안의 게시글 컬렉션 찾아서 데이터 전부 꺼내오고 ejs파일로 응답
    db.collection("ex10_board").find().toArray(function(err,result){
        res.render("brdlist", {brdData:result, userData:req.user});
    });
});

// 게시글 작성 페이지 get 요청
app.get("/brdinsert",function(req,res){
    // 게시글 작성 페이지 ejs 파일 응답
    res.render("brdinsert",{userData:req.user});
});

// 게시글 작성 후 데이터베이스에 넣는 작업 요청
// 주소창에 입력하면 안되는 데이터를 작업한다? → post 방식으로 요청
app.post("/add",function(req,res){
    // db베이스에 접근해서 게시글 입력 처리
    db.collection("ex10_count").findOne({name:"게시판"},function(err,result){
        db.collection("ex10_board").insertOne({
            brdid:result.totalBoard + 1,
            brdtitle:req.body.title,
            brdcontext:req.body.context,
            // ↓ 아래에서 serializeUser 쓸 때 썻었던 매게 변수
            brdauther:req.user.joinnick,
            // moment로 작성시간 넣기
            brddate:moment().format("YYYY-MM-DD HH:mm") 
        },function(err,result){
            db.collection("ex10_count").updateOne({name:"게시판"},{$inc:{totalBoard:1}},function(){
                // 게시글 작성 후 게시글 목록 경로로 요청
                res.redirect("/brdlist");
            });
        });
    });
    // 게시글 목록페이지로 이동
});

// 게시글 상세 화면 get 요청
app.get("/brddetail/:no",function(req,res){
    // db안에 해당 게시글 번호에 맞는 데이터만 꺼내오고 ejs파일로 응답
    db.collection("ex10_board").findOne({brdid:Number(req.params.no)},function(err,result){
        res.render("brddetail.ejs", {brdData:result, userData:req.user})
    });
});

// 게시글 수정 페이지 get 요청
app.get("/brdupt/:no",function(req,res){
    // db안에 해당 게시글 번호에 맞는 데이터만 꺼내오고 ejs파일로 응답
    db.collection("ex10_board").findOne({brdid:Number(req.params.no)},function(err,result){
        // input, textarea에다가 작성내용 미리 보여줌
        res.render("brdupdate.ejs", {brdData:result, userData:req.user})
    });
});

// 수정페이지에서 입력한 데이터를 db에 수정 요청
app.post("/update",function(req,res){
    // 해당 게시글 번호에 맞는 게시글 수정 처리
   
    db.collection("ex10_board").updateOne({brdid:Number(req.body.id)},{$set:{
        brdtitle:req.body.title,
        brdcontext:req.body.context
    }},function(err,result){
    // 해당 게시글 상세 화면 페이지로 이동
    res.redirect("/brddetail/" + req.body.id);
    });
});

// 게시글 삭제 처리 get 요청
app.get("/delete/:no",function(req,res){
    // db안의 해당 게시글 번호에 맞는 데이터만 삭제처리
    db.collection("ex10_board").deleteOne({brdid:Number(req.params.no)},function(err,result){
        // 삭제 후 강제이동될 경로((/brdlist)목록페이지로 이동)
        res.redirect("/brdlist");
    });
});

// 회원가입 페이지 get 요청
app.get("/join",function(req,res){
    res.render("join");
});

// 회원가입 페이지에서 보내준 데이터를 db에 저장요청
app.post("/joindb",function(req,res){
    db.collection("ex10_count").findOne({name:"회원정보"},function(err,result){
        db.collection("ex10_join").insertOne({
            joinno:result.joinCount + 1,
            joinid:req.body.userid,
            joinpass:req.body.userpass,
            joinnick:req.body.usernick,
            joinemail:req.body.useremail,
            joinphone:req.body.userphone
        },function(err,result){
            // joinCount를 +1 해준다.
            db.collection("ex10_count").updateOne({name:"회원정보"},{$inc:{joinCount:1}},function(err,result){
                // 회원가입 후 로그인페이지 경로로 이동
                res.redirect("/login");
            });
        });
    });
});

// 로그인 페이지 get 요청
app.get("/login",function(req,res){
    res.render("login");
});

// 로그아웃 경로 get 요청
app.get("/logout",function(req,res){
    req.session.destroy(function(err,result){   // 요청 → 세션제거
        res.clearCookie("connect.sid");     // 응답 → 본인접속 웹브라우저 쿠키 제거
        res.redirect("/");      // 메인페이지 이동
    });
});


// 로그인 페이지에서 입력한 아이디, 비밀번호 검증처리 요청
// app.post("/경로",여기 사이에 ↓ 입력,function(req,res){});
// passport.authenticate('local', {failureRedirect : '/fail'})
app.post("/loginresult",passport.authenticate('local', {failureRedirect : '/fail'}),function(req,res){
    //                                                   ↑ 실패시 위의 경로로 요청
    // ↓ 로그인 성공시 메인페이지로 이동
    res.redirect("/")
});

// /loginresult 경로 요청시 passport.autenticate() 함수 구간이 아이디, 비밀번호 로그인 검증 구간
passport.use(new LocalStrategy({
    usernameField: 'userid',
    passwordField: 'userpass',
    session: true,
    passReqToCallback: false,
  }, function (userid, userpass, done) {
    // console.log(userid, userpass);
    db.collection('ex10_join').findOne({joinid:userid}, function (err, result) {
      if (err) return done(err)
  
      if (!result) return done(null, false, { message: '존재하지않는 아이디 입니다.' })
      if (userpass == result.joinpass) {
        return done(null, result)
      } else {
        return done(null, false, { message: '비밀번호를 다시한번 확인해 주세요.'})
      }
    })
}));

// ↓ 최초의 로그인시 한번 실행
// serializeUser    →   처음 로그인 했을 시 해당 사용자의 아이디를 기반으로 세션을 생성함
// ↓ 여기서 생성된 매게변수 user로 req.user~~를 쓸 수 있다.
passport.serializeUser(function (user, done) {
    // console.log(user.joinid);
    // ↓ 서버에는 세션을 만들고 / 사용자 웹 브라우저에는 쿠키를 만들어준다. 
    done(null, user.joinid)
});
  
// ↓ 로그인 할 때마다 실행
// deserializeUser  →   로그인을 한 후 다른 페이지들을 접근할 시 생성된 세션에 담겨있는 회원정보 데이터를 보내주는 처리
passport.deserializeUser(function (id, done) {
    // deserializeUser 작업 전에 데이터 베이스에 있는 아이디와 세션에 있는 회원정보중에 아이디랑 매칭되는지 찾아주는 작업
    db.collection('ex10_join').findOne({ joinid: id }, function (err, result) {
        done(null, result);
    });
});

