/*
    script for the index.html file
*/

Parse.initialize("EoQ6gXfjCy3uFflFdiQOr2vQLUeCyyHx7EPXjPTh", "e2MVQvVmkqmSSnPT92iKRR8bjQ6TR7iUOhsc1e2K");
/* Parse.initialize("HwGkNK09YRPy3ZajicPwpZMfX9vqCyc4ghFl2eh7", "14BQF3zAPvaOR1sh6aEzXX5Wk1LTnBFQopjr1Rbj"); */
$(function() {
    'use strict';

    //new Task class for Parse
    var Task = Parse.Object.extend('Task');
    //new query that will return all tasks ordered by createAt
    var tasksQuery = new Parse.Query(Task);
    tasksQuery.ascending('createdAt');
    tasksQuery.notEqualTo('done', true);

    //reference to the task list element
    var tasksList = $('#tasks-list');

    //reference to the error message alert
    var errorMessage = $('#error-message');

    //current set of tasks
    var tasks = [];
    
    //Reference to our rating element
    var ratingElem = $('#rating');

    function displayError(err) {
        errorMessage.text(err.message);
        errorMessage.fadeIn();
    }

    function clearError() {
        errorMessage.hide();
    }

    function showSpinner() {
        $('.fa-spin').show();
    }

    function hideSpinner() {
        $('.fa-spin').hide();
    }

    function fetchTasks() {
        showSpinner();
        tasksQuery.find()
            .then(onData, displayError)
            .always(hideSpinner);
    }

    function onData(results) {
        tasks = results;
        renderTasks();
    }

    function renderTasks() {
        tasksList.empty();
        tasks.forEach(function(task) {
            var li = $(document.createElement('li'))
                .text(task.get('title'))
                .addClass(task.get('done') ? 'completed-task' : '')
                .appendTo(tasksList)
                .click(function() {
                    task.set('done', !task.get('done'));
                    task.save().then(renderTasks, displayError);
                });
            $(document.createElement('span'))
                .raty({readOnly: true, 
                    score: (task.get('rating') || 0),
                    hints: ['crap', 'awful', 'ok', 'nice', 'awesome']})    
                .appendTo(li);
        });
    }
    
    function showMessage(message) {
        message = message || '1';
        alert(message);
    }
    
    // just for fun showMessage('World');
    
    //when the user submits the new task form...
    $('#new-task-form').submit(function(evt) {
        evt.preventDefault();
        
        var titleInput = $(this).find('[name="title"]');
        var title = titleInput.val();
        var task = new Task();
        task.set('title', title);
        task.set('rating', ratingElem.raty('score'));
        task.save().then(fetchTasks, displayError).then(function() {
            titleInput.val('');
            ratingElem.raty('set', true);
        });
        
        return false;
    });

    //go and fetch tasks from the server
    fetchTasks();
    
    ratingElem.raty();

    window.setInterval(fetchTasks, 3000)
});