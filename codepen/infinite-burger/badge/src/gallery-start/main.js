document.addEventListener("DOMContentLoaded", function() {
    const imageFilenames = ['dsc_0066-edit.jpg', 'dsc_0032.jpg', 'dsc_0046.jpg', 'dsc_0059.jpg', 'dsc_0065-edit.jpg'];
    const thumbBar = document.querySelector('.thumb-bar');
    const displayedImg = document.querySelector('.displayed-img');
    const btn = document.querySelector('button');
    const overlay = document.querySelector('.overlay');

    // Looping through images
    imageFilenames.forEach(filename => {
        const newImage = document.createElement('img');
        newImage.src = `./images/${filename}`;
        newImage.alt = `Image ${filename}`;
        thumbBar.appendChild(newImage);

       
        newImage.addEventListener('click', function() {
            displayedImg.src = newImage.src;
            displayedImg.alt = newImage.alt;
        });
    });

   
    btn.addEventListener('click', function() {
        const currentClass = btn.getAttribute('class');
        if (currentClass === 'dark') {
            btn.setAttribute('class', 'light');
            btn.textContent = 'Lighten';
            overlay.style.backgroundColor = 'rgb(0 0 0 / 50%)';
        } else {
            btn.setAttribute('class', 'dark');
            btn.textContent = 'Darken';
            overlay.style.backgroundColor = 'rgb(0 0 0 / 0%)';
        }
    });
});
