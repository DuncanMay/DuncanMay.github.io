
    const displayedImage = document.querySelector('.displayed-img');
    const thumbBar = document.querySelector('.thumb-bar');
    
    const btn = document.querySelector('button');
    const overlay = document.querySelector('.overlay');
    
    /* Declaring the array of image filenames */
    
    const images = ['dsc_0066-edit.jpg', 'dsc_0032.jpg', 'dsc_0046.jpg', 'dsc_0059.jpg', 'dsc_0065-edit.jpg'];
    const alts = {
      'dsc_0066-edit.jpg' : 'pipe clearner',
      'dsc_0032.jpg' : 'Rock that looks like a wave',
      'dsc_0046.jpg' : 'Purple and white pansies',
      'dsc_0059.jpg' : 'Section of wall from a pharoah\'s tomb',
      'dsc_0065-edit.jpg' : 'Large moth on a leaf'
    }
    
    /* Looping through images */
    
    for (const image of images) {
      const newImage = document.createElement('img');
      newImage.setAttribute('src', `images/${image}`);
      newImage.setAttribute('alt', alts[image]);
      thumbBar.appendChild(newImage);
      newImage.addEventListener('click', e => {
        displayedImage.src = e.target.src;
        displayedImage.alt = e.target.alt;
      });
    }
    
    /* Wiring up the Darken/Lighten button */
    
    btn.addEventListener('click', () => {
      const btnClass = btn.getAttribute('class');
      if (btnClass === 'dark') {
        btn.setAttribute('class','light');
        btn.textContent = 'Lighten';
        overlay.style.backgroundColor = 'rgba(0,0,0,0.5)';
      } else {
        btn.setAttribute('class','dark');
        btn.textContent = 'Darken';
        overlay.style.backgroundColor = 'rgba(0,0,0,0)';
      }
    });
    
