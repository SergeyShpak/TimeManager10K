var local_storage_tasks_key = "timer_tasks";
var tasks_table_selector = "#tasks-table";
var tasks_button_selector = "#tasks-expand-btn";
var btn_expandable_class = "expandable";
var btn_collapsable_class = "collapsable";
var tasks_table_body_selector = tasks_table_selector + " > tbody";
var collapsed_class = "collapsed";

var isCurrent;
var isTask;
var getTasks;
var getValidTasks;
var showTasksIfAny;
var printValidTasks;
var hideTable;
var addTasksToTable;
var getTaskName;
var getTaskDuration;
var getDate;
var getDateRepresentation;
var setTasks;
var collapseTable;
var toggleTasksButton;
var extractTasksFromTable;
var parseTaskRow;
var parceInaccurateTimeString;
var addToTable;
var addRowToTasksTable;
var isTasksTableCollapsed;
var showWholeTable;
var hideWholeTable;
var showTasksRows;
var hideTasksRows;
var changeTasksButtonToExpandable;
var changeTasksButtonToCollapsable;
var updateTasksTable;
var getTasksNotInTable;
var isTaskInArray;
var compareTasks;

/**
 * Clears the localStorage from the saved tasks and saves the the one passed
 * as the argument.
 * 
 * @param {Object[]} tasks - Array of tasks that are saved in the localStorage.
 */
setTasks = function(tasks) {
    localStorage[local_storage_tasks_key] = JSON.stringify(tasks);
}

/**
 * Prints the tasks returned by the function {@link getValidTasks} 
 * to the console.
 */
printValidTasks = function() {
    var valid_tasks = getValidTasks();
    if (0 == valid_tasks.length) {
        console.log("No tasks yet");
        return;
    }
    for (var i = 0; i < valid_tasks.length; i++) {
        console.log(JSON.stringify(valid_tasks[i]));
    }
}

/**
 * Returns tasks stored in the localStorage.
 */
getTasks = function() {
    var tasks_string = localStorage[local_storage_tasks_key];
    return JSON.parse(tasks_string);
}

/**
 * Gets the tasks from the localStorage with the use of the {@link getTasks}
 * function and filters them against {@link isTaks} and {@link isCurrent}.
 * Returns the filtering result. It also deletes the tasks, that were filtered 
 * out, from the localStorage.
 */
getValidTasks = function() {
    var tasks = getTasks();
    var valid_tasks = tasks.filter(isTask).filter(isCurrent);
    setTasks(valid_tasks);
    return valid_tasks;
}

/**
 * Predicate function that defines whether the passed object is a task or not.
 * Particularly, it checks if the passed object has all the properties 
 * of a task: name, interval, start date and end date -, and does not have
 * any other ones.
 * 
 * @param {Object} obj - Object that is checked to be a task.
 */
isTask = function(obj) {
    var props = Object.getOwnPropertyNames(obj).sort();
    var expected_props = ["e", "i", "n", "s"];
    if (4 != props.length) {
        return false;
    }
    for (var i = 0; i < props.length; i++) {
        if (props[i] != expected_props[i]) {
            return false;
        }
    }
    return true;
}

/**
 * Predicate function that checks if the given task is still fresh.
 * Particularly, it checks if the end date of the task is today.
 * 
 * @param {Object} obj - Task which end date is checked.
 */
isCurrent = function(obj) {
    var end_date = new Date(obj.e);
    var current_date = new Date();
    if (current_date.getFullYear() == end_date.getFullYear()
        && current_date.getMonth() == end_date.getMonth()
        && current_date.getDay() == end_date.getDay()) {
            return true;
        }
    return false;
}

/**
 * If there are no valid tasks in the localStorage, hides the tasks table.
 * If there are adds them to the tasks table, using the {@link addTasksToTable}
 * function. 
 */
showTasksIfAny = function() {
    var tasks = getValidTasks();
    if (0 == tasks.length) {
        hideTable();
        return;
    }
    addTasksToTable(tasks);
    return;
}

hideTable = function() {
    var tasks_table_el = $(tasks_table_selector);
    tasks_table_el.toggleClass(collapsed_class);
    tasks_table_el.find("tr").toggle(300);
    toggleTasksButton();
}

/**
 * Adds tasks in the given tasks array to the tasks table.
 * 
 * @param {Object[]} tasks - Array of tasks to be added to the tasks table.
 */
addTasksToTable = function(tasks) {
    var current_task;
    for (var i = 0; i < tasks.length; i++) {
        current_task = tasks[i];
        addToTable(current_task);
    }
}

isTasksTableCollapsed = function() {
    var tasks_table_el = $(tasks_table_selector);
    return tasks_table_el.hasClass(collapsed_class);
}

addToTable = function(task) {
    var task_name = getTaskName(task);
    var task_duration = getTaskDuration(task);
    var start_date = getDateRepresentation(task.s);
    var end_date = getDateRepresentation(task.e);
    addRowToTasksTable(task_name, task_duration, start_date, end_date);
}

addRowToTasksTable = function(task_name, task_duration, start_date, end_date) {
    var tbody = $(tasks_table_body_selector);
    var delete_button_el =
             "<span class='remove-task-btn glyphicon glyphicon-remove'></span>";
    var new_row = "<tr><td>" + task_name + "</td><td>" + task_duration + 
                    "</td><td>" + start_date + "</td><td>" + end_date + 
                    "</td><td>" + delete_button_el + "</td></tr>";
    tbody.append(new_row);
    if (isTasksTableCollapsed()) {
        tbody.find("tr").last().hide();
    }
}

/**
 * Given a task returns its name.
 * 
 * @param {Object} task - Task which name is returned.
 */
getTaskName = function(task) {
    var name = task.n;
    if (null == name) {
        return "Not specified";
    }
    return name;
}

/**
 * Given a task returns the time interval that corresponds to its duration.
 * 
 * @param {Object} task - Task which duration is returned.
 */
getTaskDuration = function(task) {
    var interval = task.i;
    var representation = generateTimerDisplay(interval);
    return representation;
}

/**
 * Given a time interval returns its readable representation.
 * 
 * @param {number} date_num - Time interval which representation is returned.
 */
getDateRepresentation = function(date_num) {
    var date =  new Date(date_num);
    var time_repr = date.toLocaleTimeString();
    var repr = time_repr;
    return repr;
}

collapseTable = function() {
    var tasks_table_el = $(tasks_table_selector);
    if (tasks_table_el.hasClass(collapsed_class)) {
        return;
    }
    tasks_table_el.addClass(collapsed_class);
    tasks_table_el.toggle();
    toggleTasksButton();
}

showTable = function() {
    var tasks_table_el = $(tasks_table_selector);
    if (!tasks_table_el.hasClass(collapsed_class)) {
        return;
    }
    tasks_table_el.toggleClass(collapsed_class);
    tasks_table_el.toggle();
    toggleTasksButton();
}

showWholeTable = function() {
    showTasksRows();
    changeTasksButtonToCollapsable();
}

hideWholeTable = function() {
    hideTasksRows();
    changeTasksButtonToExpandable();
}

showTasksRows = function() {
    var tasks_table_el = $(tasks_table_selector);
    if (!tasks_table_el.hasClass(collapsed_class)) {
        return;
    }
    tasks_table_el.toggleClass(collapsed_class);
    tasks_table_el.toggle();
}

changeTasksButtonToCollapsable = function() {
    var tasks_btn_el = $(tasks_button_selector);
    // If the table is already shown and the button folds it
    if (tasks_btn_el.hasClass(btn_collapsable_class)) {
        return;
    }
    toggleTasksButton();
}

hideTasksRows = function() {
    var tasks_table_el = $(tasks_table_selector);
    if (tasks_table_el.hasClass(collapsed_class)) {
        return;
    }
    tasks_table_el.toggleClass(collapsed_class);
    tasks_table_el.toggle();
}

changeTasksButtonToExpandable = function() {
    var tasks_btn_el = $(tasks_button_selector);
    if (tasks_btn_el.hasClass(btn_expandable_class)) {
        return;
    }
    toggleTasksButton();
}

extractTasksFromTable = function() {
    var tasks = [];
    $(tasks_table_body_selector + " > tr").each(function(index) {
        var task = parseTaskRow(this);
        tasks.push(task);
    });
    return tasks;
}

parseTaskRow = function(row_el) {
    var cells = $(row_el).children().filter(function() {
        return $(this).is("td");
    });
    var task = {
        n: null,
        i: null,
        s: null,
        e: null
    };
    var task_times = [];
    var time_cells = cells.slice(1);
    var inaccurate_time;
    task.n = cells[0].textContent;
    for (var i = 0; i < time_cells.length; i++) {
        inaccurate_time = parceInaccurateTimeString(time_cells[i].textContent);
        task_times.push(inaccurate_time);
    }
    task.i = task_times[0];
    task.s = task_times[1];
    task.e = task_times[2];
    return task;
}

parceInaccurateTimeString = function(time_str) {
    var time_parts = time_str.split(":").map(function(time_part_str) {
        return parseInt(time_part_str);
    });
    var time_obj = {};
    time_obj.h = time_parts[0];
    time_obj.m = time_parts[1];
    time_obj.s = time_parts[2];
    return getMsFromTimeObject(time_obj);
}

toggleTasksButton = function() {
    var tasks_expand_btn_el = $("#tasks-expand-btn");
    tasks_expand_btn_el.toggleClass(btn_collapsable_class);
    tasks_expand_btn_el.toggleClass(btn_expandable_class);
    tasks_expand_btn_el.toggleClass("btn-success");
    tasks_expand_btn_el.toggleClass("glyphicon-plus");
    tasks_expand_btn_el.toggleClass("btn-danger");
    tasks_expand_btn_el.toggleClass("glyphicon-minus");
}

updateTasksTable = function() {
    var tasks_in_table = extractTasksFromTable();
    var tasks_in_storage = getTasks();
    var tasks_not_in_table = 
            getTasksNotInTable(tasks_in_table, tasks_in_storage);
    for (var i = 0; i < tasks_not_in_table.length; i++) {
        addToTable(tasks_not_in_table[i]);
    }
}

getTasksNotInTable = function(tasks_in_table, tasks_in_storage) {
    var is_in_table;
    var current_task;
    if (0 == tasks_in_table.length) {
        return tasks_in_storage;
    }
    var not_in_table = [];
    for (var i = 0; i < tasks_in_storage.length; i++) {
        current_task = tasks_in_storage[i];
        is_in_table = isTaskInArray(current_task, tasks_in_table);
        if (!is_in_table) {
            not_in_table.push(current_task);
        }
    }
    return not_in_table;
}

isTaskInArray = function(task, tasks_array) {
    var compare_result;
    var current_task_in_memory;
    for (var i = 0; i < tasks_array.length; i++) {
        current_task_in_memory = normalizeTask(tasks_array[i]);
        compare_result = compareTasks(task, current_task_in_memory);
        if (!compare_result) {
            return true;
        }
    }
    return false;
}

//TODO: change to usage of the task object
normalizeTask = function(task) {
    var normalized_task = {
        n: null,
        i: null,
        s: null,
        e: null
    };
    var inaccurate_interval = getInaccurateTimeObject(task.i);
    var inaccurate_start = getInaccurateTimeObject(task.s);
    var inaccurate_end = getInaccurateTimeObject(task.e);
    normalized_task.n = task.n;
    
}

compareTasks = function(first, second) {

}

$(document).ready(function() {
    hideWholeTable();
    updateTasksTable();

    $("#tasks-expand-btn").click(function() {
        hideTable();
    });

});