const hamBurger = document.querySelector(".fa-bars");
const navList = document.querySelector(".nav-list");

hamBurger.addEventListener("click",()=>{
    navList.classList.toggle("active");
})
