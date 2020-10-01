//const io = require('socket.io-client');
//import * as io from 'socket.io-client';
const socket = io('http://localhost:8888');

var jc_global = 0
//const button = document.getElementById('submit_btn');
//Add a connect listener
socket.on('connect',function() {
    console.log('Client has connected to the server!');
});

function show_user_detail(name,point,number,rank){
    document.getElementById("user_name").innerHTML=name;
    document.getElementById("user_cur_point").innerHTML=point;
    document.getElementById("user_num_of_play").innerHTML=number;
    document.getElementById("user_rank").innerHTML=rank;
}

socket.on('user-details', (details)=>{
    console.log(details);
    
    document.getElementById("login").style.display="none";
    document.getElementById("waiting").style.display="block";
    show_user_detail(details.user_name, details.point, details.turn, "--")
})

function sendFindMatch() {
    console.log("find-match")
    socket.emit('find-match');
}
socket.on('join-complete', (jc)=>{
    document.getElementById("waiting").style.display="none";
    document.getElementById("game").style.display="block";
    document.getElementById("user_name_game").innerHTML = document.getElementById("user_name").innerHTML;
    document.getElementById("competitor-choice").style.visibility = "hidden"
    document.getElementById("countdown").innerHTML = "--";
    if (jc == 1) {
        document.getElementById("competitor").innerHTML="ĐANG ĐỢI ĐỐI THỦ"
    }else {
        document.getElementById("competitor").innerHTML="ĐỐI THỦ"
        timeleft = 5
        document.getElementById("time").innerHTML= "BẮT ĐẦU TRONG: "
        var downloadTimer = setInterval(function(){

            if(timeleft <= 0){
            clearInterval(downloadTimer);
            document.getElementById("countdown").innerHTML = "0";
            } else {
            document.getElementById("countdown").innerHTML = timeleft ;
            }
            timeleft -= 1;
        }, 1000);

        timeleft = 3
        document.getElementById("time").innerHTML= "THỜI GIAN CÒN LẠI: "
        var downloadTimer = setInterval(function(){

            if(timeleft <= 0){
            clearInterval(downloadTimer);
            document.getElementById("countdown").innerHTML = "0";
            } else {
            document.getElementById("countdown").innerHTML = timeleft ;
            }
            timeleft -= 1;
        }, 1000);
        chosen_value = 0
        
        var ele = document.getElementsByName('gender');
        for(i = 0; i < ele.length; i++) { 
            if(ele[i].checked) {
                console.log(ele[i].value)
                chosen_value = ele[i].value;
            }
            
        } 

        socket.emit('result', chosen_value)
    }
    if (jc_global == 0){
        jc_global = jc
    }
})
socket.on('update-score', (message)=>{
    
    if (jc_global == 1){
        choice = message[1].currentchoice
        if (choice == 1){
            document.getElementById("competitor-choice-img").src = "./image/keo.jpg"
        } else if (choice == 2){
            document.getElementById("competitor-choice-img").src = "./image/bua.jpg"
        }else if (choice == 3){
            document.getElementById("competitor-choice-img").src = "./image/bao.jpg"
        } else  {
            document.getElementById("competitor-choice").innerHTML = "RA CHẬM"
        }
    } else {
        choice = message[0].currentchoice
        if (choice == 1){
            document.getElementById("competitor-choice-img").src = "./image/keo.jpg"
        } else if (choice == 2){
            document.getElementById("competitor-choice-img").src = "./image/bua.jpg"
        }else if (choice == 3){
            document.getElementById("competitor-choice-img").src = "./image/bao.jpg"
        } else  {
            document.getElementById("competitor-choice").innerHTML = "RA CHẬM"
        }
    }
    if (message[2] == 1){
        number = document.getElementById("user_2").innerHTML
        document.getElementById("user_2").innerHTML = parseInt(name) +1
    }
    if (message[2] == -1){
        number = document.getElementById("user_1").innerHTML
        document.getElementById("user_1").innerHTML = parseInt(name) +1
    }
    timeleft = 10
    document.getElementById("time").innerHTML= "BẮT ĐẦU TRONG: "
    var downloadTimer = setInterval(function(){

        if(timeleft <= 0){
          clearInterval(downloadTimer);
          document.getElementById("countdown").innerHTML = "0";
        } else {
          document.getElementById("countdown").innerHTML = timeleft ;
        }
        timeleft -= 1;
      }, 1000);

    timeleft = 5
    document.getElementById("time").innerHTML= "THỜI GIAN CÒN LẠI: "
    var downloadTimer = setInterval(function(){

        if(timeleft <= 0){
            clearInterval(downloadTimer);
            document.getElementById("countdown").innerHTML = "0";
        } else {
            document.getElementById("countdown").innerHTML = timeleft ;
        }
        timeleft -= 1;
    }, 1000);
    chosen_value = 0
    
    var ele = document.getElementsByName('gender');
    for(i = 0; i < ele.length; i++) { 
        if(ele[i].checked) {
            chosen_value = ele[i].value;
        }
        
    } 

    socket.emit('result', chosen_value)
})
socket.on('end-game', ()=>{
    jc_global = 0;
    socket.emit('get-update-user')
    document.getElementById("waiting").style.display="block";
    document.getElementById("game").style.display="none";
})

socket.on('top100', (top100)=>{
    console.log(top100);
    var table = document.createElement("table"); 
    var i     
    // Create table row tr element of a table 
    var tr = table.insertRow(-1); 
    trow = table.insertRow(-1); 
    var name = trow.insertCell(-1); 
    name.innerHTML = "Name"; 
    var point = trow.insertCell(-1); 
    point.innerHTML = "Point"; 
    var rank = trow.insertCell(-1); 
    rank.innerHTML = "Rank"; 
    // Adding the data to the table 
    for (var i = 0; i < top100.length; i++) { 
        // Create a new row 
        trow = table.insertRow(-1); 
        var name = trow.insertCell(-1); 
        name.innerHTML = top100[i].user_name; 
        var point = trow.insertCell(-1); 
        point.innerHTML = top100[i].point; 
        var rank = trow.insertCell(-1); 
        rank.innerHTML = i+1; 
    } 
        
    // Add the newely created table containing json data 
    var table_100 = document.getElementById("top100_table")
    table_100.innerHTML = ""; 
    table_100.appendChild(table); 

})
function sendLoginRequest() {
    const input = document.getElementById('input_name').value;
    socket.emit('login', input);
    console.log(input);
};

