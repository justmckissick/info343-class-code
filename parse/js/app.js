/*
    script for the index.html file
*/

Parse.initialize("EoQ6gXfjCy3uFflFdiQOr2vQLUeCyyHx7EPXjPTh", "e2MVQvVmkqmSSnPT92iKRR8bjQ6TR7iUOhsc1e2K");

$(function() {
    'use strict';

    //new Task class for Parse
    var Task = Parse.Object.extend('Task');
    //new query that will return all tasks ordered by createAt
    var tasksQuery = new Parse.Query(Task);
    tasksQuery.ascending('createdAt');

    //reference to the task list element
    var tasksList = $('#tasks-list');

    //reference to the error message alert
    var errorMessage = $('#error-message');

    //current set of tasks
    var tasks = [];

    function displayError(err) {
        errorMessage.text(err.message);
        errorMessage.fadeIn();
    }

    function clearError() {
        errorMessage.hide();
    }

    function fetchTasks() {
        tasksQuery.find().then(onData, displayError);
    }

    function onData(results) {
        tasks = results;
        renderTasks();
    }

    function renderTasks() {
        tasksList.empty();
        tasks.forEach(function(task) {
            $(document.createElement('li'))
                .text(task.get('title'))
                .appendTo(tasksList);
        });
    }
    
    //when the user submits the new task form...
    $('#new-task-form').submit(function(evt) {
        evt.preventDefault();
        
        var titleInput = $(this).find('[name="title"]');
        var title = titleInput.val();
        var task = new Task();
        task.set('title', title);
        task.save().then(fetchTasks, displayError);
        
        return false;
    });

    //go and fetch tasks from the server
    fetchTasks();
});