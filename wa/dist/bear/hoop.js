function shootBall() {
    const ball = document.querySelector('.ball');
    ball.style.transition = 'transform 0.4s ease-in';
    ball.style.transform = 'translate(-50%, -250px)';
    setTimeout(() => {
      ball.style.transform = 'translateX(-50%)';
    }, 800);
  }
  