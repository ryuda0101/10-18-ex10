        // 입력한 아이디 ~ 전화번호 전부 정규표현식으로 처리 후
        // 제대로 입력되었다면 전송!
        // 변수 세팅
        const allLine = document.querySelectorAll(".line");
        const line = document.querySelectorAll(".userch")
        const passch = document.querySelector(".userpassch")
        const pass = document.querySelector(".line #userpass")
        const joinBtn = document.querySelector(".joinBtn");
        let passLastCheck = false;
        
        // 객체로 세팅
        let check = [
            {
                // 아이디 확인 정규포현식
                checkinform:/^\w{3,12}$/,
                trueMessage:"아이디를 형식에 맞게 입력하셨습니다.",
                falseMessage:"아이디는 3글자에서 12글자 사이의 영문 대소문자, 숫자, 특수문자 _만 사용할 수 있습니다.",
                trueOrfalse:false
            },
            {
                // 비밀번호 확인 정규포현식
                checkinform:/^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,25}$/,
                trueMessage:"비밀번호를 형식에 맞게 입력하셨습니다.",
                falseMessage:"비밀번호는 8자리 이상 25자리 이하의 영문 대소문자, 숫자, 특수문자 !@#$%^*+=-_ 를 조합해서 기입해야 합니다. ",
                trueOrfalse:false
            },
            {
                // 이메일 확인 정규포현식
                checkinform:/^[\w]+\@+[a-z]+\.[a-z]{2,3}$/,
                trueMessage:"이메일을 형식에 맞게 입력하셨습니다.",
                falseMessage:"이메일을 다시한번 확인해 주세요",
                trueOrfalse:false
            },
            {
                // 전화번호 확인 정규포현식
                checkinform:/^(010|011|017)\-\d{4}\-\d{4}$/,
                trueMessage:"전화번호를 맞게 입력하셨습니다.",
                falseMessage:"전화번호를 다시한번 확인해 주세요.",
                trueOrfalse:false
            }
        ];

        let lastCheck = false;

        line.forEach(function(el,index){
            el.querySelector("input").addEventListener("keyup",function(){
                let joinvalue = el.querySelector("input").value;
                let finalcheck = check[index].checkinform.test(joinvalue);
                
                if (finalcheck) {
                    // 성공메세지 출력
                    el.querySelector("span").innerHTML = check[index].trueMessage;
                    el.querySelector("span").style.color = "green";
                    check[index].trueOrfalse = true;
                }
                else {
                    // 실패메세지 출력
                    el.querySelector("span").innerHTML = check[index].falseMessage;
                    el.querySelector("span").style.color = "red";
                    check[index].trueOrfalse = false;
                }
            });
        });
        
        passch.querySelector("#userpassch").addEventListener("keyup",function(){
            checkfunction();
        });

        pass.addEventListener("keyup",function(){
            checkfunction();
        });

        joinBtn.addEventListener("click",function(event){
            lastCheck = check.every(element => element.trueOrfalse == true);
            if(!lastCheck || !passLastCheck) {
                event.preventDefault();
                alert("필수체크사항을 다시한번 확인해 주세요")
            }
        });


        function checkfunction(){
            let passValue = pass.value;
            let passchValue = passch.querySelector("#userpassch").value;

            if(passchValue == passValue){
                passch.querySelector("span").innerHTML = "비밀번호가 동일합니다."
                passch.querySelector("span").style.color = "green";
                passLastCheck = true;
            }
            else {
                passch.querySelector("span").innerHTML = "비밀번호를 다시한번 확인해주세요"
                passch.querySelector("span").style.color = "red";
                passLastCheck = false;
            }
        }