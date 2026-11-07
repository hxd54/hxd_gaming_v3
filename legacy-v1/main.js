

let menu = document.querySelector('.menu-icon');
let navbar = document.querySelector('.menu');

menu.onclick = () => {
    navbar.classList.toggle('active');
    menu.classList.toggle('move');
}

window.onscroll = function() {mufunction()};

function mufunction() {
  var winscroll = document.body.scrolltop || document.documentElement.scrollTop;
  var height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  var scrolled = (winscroll / height) * 100;
  document.getElementById('scroll-bar').style.width = scrolled + '%';
}