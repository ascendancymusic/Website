window.addEventListener('load', function () {
  const preloader = document.getElementById('preloader');
  const fadeElements = document.querySelectorAll('.fade-in');

  const loaderCircle = document.createElement('div');
  loaderCircle.classList.add('loader-circle'); 

  preloader.appendChild(loaderCircle);

  
  setTimeout(() => {
    preloader.style.transition = 'opacity 0.5s ease';
    preloader.style.opacity = '0';
    setTimeout(() => {
      preloader.style.display = 'none';
      fadeElements.forEach(element => element.classList.add('show'));
    }, 500); 
  }, 2000);
});
