$(document).ready(function() {
  // Listen to authentication changes
  firebase.auth().onAuthStateChanged(function(user) {
    // If the user is not logged in
    if (!user)
      // Then redirect to the login page
      window.location = "index.html";
    // Otherwise
    else {
      // Set username
      $('#username').text(user.displayName);
      // Get and show tasks
      loadTasks();
      // Display page content
      $("body").fadeIn(1000);

      console.log('You are logged in '+user.email);
    }
  });
});

// New task text content
var todoText = $('textarea');
// Area where tasks are displayed
var todotasks = $('#todo-tasks');

// Displays a todo-task element
function showTask(id, task) {
  todotasks.prepend(
    `<div id="${id}" class="todo-task">
      <div class="content">
        <div class="header">
          <h3>${task.username}</h3>
          <p>${task.datetime.toDate().toLocaleString()}</p>
        </div>
        
        <hr>
        <p>${task.text}</p>  
      </div>

      <button onclick="complete('${id}')">
        <img class="check" src="./img/checkmark.png"/>
      </button>
    </div>`
  );

  if(task.completed) scrapTask(id);
}

// Updates the task to be completed and and checks it
function complete(taskId) {
  firebase.firestore().collection('tasks').doc(taskId).update({ completed: true })
  .then(function() { scrapTask(taskId); })
}

// Checks a task by adding done done
function scrapTask(taskId) { $(`#${taskId}`).addClass("completed"); }

// Creates a new task
function createTask() {
  if (todoText.val().trim()) {
    var taskDoc = {
      username: firebase.auth().currentUser.displayName,
      datetime: firebase.firestore.Timestamp.fromDate(new Date()),
      text: todoText.val(),
      completed: false
    };

    // Add to collection
    firebase.firestore().collection('tasks').add(taskDoc)
      // Success: append task
      .then(function(docRef) { showTask(docRef.id, taskDoc); })
      // Failure: alert user
      .catch(function(error) { alert('لم نستطع انشاء مهمتك '+error); });
  }
  todoText.val('');
}

// Loads all tasks from the database and shows them
function loadTasks() {
  // Get documents
  firebase.firestore().collection("tasks").get()
    // We have the tasks
    .then(function(tasks) {
      // For each task
      tasks.forEach(function(doc) {
          // Show it
          showTask(doc.id, doc.data());
      });
    })
}