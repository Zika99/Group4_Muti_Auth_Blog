
const hamBurger = document.querySelector(".fa-bars");
const navList = document.querySelector(".nav-list");
// const leftUl = document.querySelector(".left")

hamBurger.addEventListener("click",()=>{
    navList.classList.toggle("active");
})

// hamBurger.addEventListener("click",()=>{
//     leftUl.classList.toggle("active");
// })