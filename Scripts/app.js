
function usermail() {
    var emailurl = window.location.href;
    var useremailid = emailurl.substring(emailurl.indexOf("?") + 1);
    document.getElementById("useremailtxt").innerHTML = useremailid;
    document.getElementById("firebase1a").setAttribute("href", "../Pages/chatroom.html?"+useremailid)
    document.getElementById("firebase2a").setAttribute("href", "../Servers/firebase2.html?"+useremailid)
    document.getElementById("firebase3a").setAttribute("href", "../Servers/firebase3.html?"+useremailid)
    document.getElementById("firebase4a").setAttribute("href", "../Servers/firebase4.html?"+useremailid)
    document.getElementById("firebase5a").setAttribute("href", "../Servers/firebase5.html?"+useremailid)
    document.getElementById("firebase6a").setAttribute("href", "../Servers/firebase6.html?"+useremailid)

}

function signup(){
    var email = document.getElementById("emailsignup")
    var password = document.getElementById("passwordsignup")
    firebase.auth().createUserWithEmailAndPassword(email.value, password.value)
    .then((user) => {
    alert("You are now signed up! You will now be redirected to the login page.")
    window.location.href = "../index.html"
    })
    .catch((error) => {
    var errorMessage = error.message;
    alert(errorMessage)
    });
}

function login(){
    var email = document.getElementById("emaillogin")
    var password = document.getElementById("passwordlogin")
    firebase.auth().signInWithEmailAndPassword(email.value, password.value)
    .then((user) => {
        alert("You are now logged in.")
        window.location.href = "../Pages/chatroom.html?" + email.value
    })
    .catch((error) => {
    var errorMessage = error.message;
    alert(errorMessage)
    });
}

function sendMessage() {
    var name = document.getElementById("useremailtxt").innerText //User display name
    var message = document.getElementById("message").value  //User message
    console.log(message)
    firebase.database().ref("messages").push().set({ //Save user name and message in reference "messages" in firebase database
        "sender": name,
        "message": message
    });
    return false;
}

//Identify which message is yours and which message is others
    firebase.database().ref("messages").on("child_added", function(snapshot){
        var name = document.getElementById("useremailtxt").innerText
        var li = document.createElement("li")
        li.setAttribute("class", "him")
        if(snapshot.val().sender == name){
            li.setAttribute("class", "me")
            li.innerHTML = snapshot.val().sender + ": " + snapshot.val().message;
            document.getElementById("messages").appendChild(li)
        }else{
            li.setAttribute("class", "him")
            li.innerHTML = snapshot.val().sender + ": " + snapshot.val().message;
            document.getElementById("messages").appendChild(li)
        }
     });

//Update/get messages after every second
setInterval(function(){
    firebase.database().ref("messages").limitToLast(1).on('child_added', function(childSnapshot) {  //Get the last reference node
        var snap = childSnapshot.val();
        var finalsnap = snap.sender + ": " + snap.message
        var lastnode = document.getElementById("messages").lastChild.innerHTML; //Get the last message
        //console.log(finalsnap)
        if(finalsnap == lastnode){}else{    //If a new message is added in the database, it will automattically update on the frontend
            var li = document.createElement("li")
            li.setAttribute("class", "him")
            li.innerHTML = finalsnap;
            document.getElementById("messages").appendChild(li)
        }
   })}, 1000);
