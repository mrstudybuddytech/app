

if (localStorage.getItem("userData")) {
    const userElements = document.querySelectorAll(".userData"); // ✅ returns NodeList
    const data = JSON.parse(localStorage.getItem("userData"));

    if (userElements.length >= 2) { // Make sure there are at least 2 elements
        userElements[0].innerHTML = data.name + " 🖖";
        userElements[1].innerHTML = data.email;
    }
}

document.querySelector(".Logout").addEventListener("click",function(){
      localStorage.clear();
      window.location.reload();
});