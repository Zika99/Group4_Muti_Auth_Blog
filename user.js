const seeAll = document.querySelector('#see-all-cat')
const hideAll = document.querySelector('.hide')
const seeAllBtn = document.querySelector('#see-all')
function revealCat() {
    seeAll.style.display = 'block';
    seeAllBtn.style.display = 'none';
}

function hideCat(){
    seeAllBtn.style.display = 'block';
    seeAll.style.display = 'none';
}

document.getElementById('see-all').addEventListener('click', revealCat);
document.getElementById('hide').addEventListener('click', hideCat);