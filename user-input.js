//creating a function hthat navigates the user to go back to the main page if they want to quit the process of loging in 
document.getElementById('go-back-btn').addEventListener('click', function () {
  window.location.href = "index.html"; 
});
//creating a function that allows the user to pay the game if they have filled the required details 
document.getElementById('play-btn').addEventListener('click', function () {

  //storing the name of the user in a constant called username
  const username = document.getElementById('username').value;

  //storing the name given to the warrior in a constant called warriorname
  const warriorname = document.getElementById('warriorname').value;
  
  //storing the given details in the local storage 
  if (username && warriorname) {
      localStorage.setItem('username', username);
      localStorage.setItem('warriorname', warriorname);
      window.location.href = "instruction-page.html"; 
  } else {
      alert('Please fill in all the details below');
  }
});
