$(document).ready(function () {
    const username = localStorage.getItem("loggedInUser");
    const gender = localStorage.getItem("gender");
    if (gender==='Male'){
        $("#name").html("Welcome Mr. "+username);
        $("#name1").html("Mr. "+username);
    }else{
        $("#name").html("Welcome Ms. "+username);
        $("#name1").html("Ms. "+username);
    }

})