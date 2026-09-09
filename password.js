
function checkPassword(){
  var password = prompt("ENTER PASSWORD")

if(password === "kyle00"){
  alert("You may enter")
}
else{
  checkPassword();
}
}

checkPassword()