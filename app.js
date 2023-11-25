const enter = document.getElementById("enter");

enter.onclick = () =>{
  location.href = "user-input.html";
};

const audio = document.getElementById('audio');
const controlMusic = document.getElementById('mic');

controlMusic.addEventListener('click', () => {
    if (audio.paused) {
        audio.play();
        controlMusic.textContent = 'Turn Off';
    } else {
        audio.pause();
        controlMusic.textContent = 'Turn On';
    }
});
