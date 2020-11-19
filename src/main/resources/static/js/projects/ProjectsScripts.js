function formatDate(date) {
    let d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [year, month, day].join('-');
}



/* Creates and displays a task row */

function createTaskRow(data,index, choosedPriorityClass, choosedStatusClass) {

    let date = data[index].date;
    let formattedDate;
    if(date) {
        formattedDate = formatDate(date);
    }

    return `
                    <tr class="table-row" id="${'item_' + (data[index].sequence)}">
                                <td class="action-cell">
                                    <button type="button" class="bin-icon-button invisible">
                                        <img class="bin-icon invisible" src="img/trash-bin.svg" alt="bin"/>
                                    </button>
                                </td>
                                <td contenteditable="true" class="task-title">${(data[index]).title}
                                <button type="button" class="edit-icon-button">
                                    <img class="edit-icon" src="img/edit.svg" alt="edit"/>
                                </button>
                                </td>
                                <td class="option-select-cell">
                                <div class="priority dropdown">
                                        <button class="btn btn-secondary dropdown-toggle default-button ${(choosedPriorityClass)}" type="button"
                                        data-toggle="dropdown" aria-haspopup="true"
                                        aria-expanded="false">${(data[index].priority)}
                                        </button>

                                    <div class="table-dropdown-menu dropdown-menu" aria-labelledby="priorityDropdown">
                                        <button class="btn btn-secondary dropdown-toggle option-pink" type="button">Low</button>
                                        <button class="btn btn-secondary dropdown-toggle option-blue" type="button">Medium</button>
                                        <button class="btn btn-secondary dropdown-toggle option-purple" type="button">High</button>
                                    </div>
                                </div>
                                </td>
                                <td class="option-select-cell">
                                <div class="status dropdown">
                                    <button class="btn btn-secondary dropdown-toggle default-button ${(choosedStatusClass)}" type="button"
                                        data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">${(data[index].status)}
                                    </button>
                                    
                                    <div class="table-dropdown-menu dropdown-menu" aria-labelledby="statusDropdown">
                                        <button class="btn btn-secondary dropdown-toggle option-green" type="button">Done</button>
                                        <button class="btn btn-secondary dropdown-toggle option-orange" type="button">In Progress
                                        </button>
                                        <button class="btn btn-secondary dropdown-toggle option-red" type="button">Stuck</button>
                                    </div>
                                </div>
                                </td>
                                <td class="date-cell">
                                    <input type="date" value="${formattedDate}" class="date-task-input form-control"/>
                                </td>
                                <td class="time-estimated-cell">
                                    <i class="time-estimated-text">${(data[index].estimatedTime)}</i>
                                    <input type="number" class="time-estimated-input form-control"/>
                                </td>
                           </tr>
                    `;
}

$(function () {

    let $addProjectButton = $('#addProjectButton');


    /* On add Project button click creates new table for tasks */

    $addProjectButton.on('click touchend', function () {

        $.post({
            url: "/projects/create-project",
            contentType: "application/json"
        }).done(function (data) {
            let table = `        
        <table id="${'item_' + (data.sequence)}" role="table" class="table table-sm table-borderless table-responsive-lg">
            <thead>
                <tr class="table-row">
                    <th class="action-column" scope="col">
                        <button type="button" class="bin-icon-button invisible">
                            <img class="bin-icon invisible" src="img/trash-bin.svg" alt="bin"/>
                        </button>
                    </th>
                    <th contenteditable="true" class="title-column" scope="col">Project Title</th>
                    <th class="priority-column" scope="col">Priority</th>
                    <th class="status-column" scope="col">Status</th>
                    <th class="date-column" scope="col">Date</th>
                    <th class="time-column" scope="col">Time Est.</th>
                </tr>
            </thead>
            <tbody class="gray">
            </tbody>
            <tfoot>
                <tr class="table-row">
                    <td></td>
                    <td class="add-task-row" colspan="4">
                        <input class="add-task-row-input form-control" minlength="1" maxlength="35" type="text"
                           placeholder="+ Add Task">
                    </td>
                    <td class="add-task-button-cell">
                        <button class="btn btn-primary add-task-button" type="button">+ Add</button>
                    </td>
                </tr>
                <tr>
                    <td colspan="5"></td>
                    <td class="estimated-time-sum">
                    </td>
                </tr>
            </tfoot>
        </table>
            `;

            $('#mainContentHeader').after(table);
        }).fail(function (data) {
            console.log(data)
        });

    })

    /* Shows all projects */

    function showProjects(data, e) {
        $.each(data, function (index) {

            let table = `        
        <table id="${'item_' + (data[index].sequence)}" role="table" class="table table-sm table-borderless table-responsive-lg">
            <thead>
                <tr class="table-row">
                    <th class="action-column" scope="col">
                        <button type="button" class="bin-icon-button invisible">
                            <img class="bin-icon invisible" src="img/trash-bin.svg" alt="bin"/>
                        </button>
                    </th>
                    <th contenteditable="true" class="title-column" scope="col">${data[index].title}</th>
                    <th class="priority-column" scope="col">Priority</th>
                    <th class="status-column" scope="col">Status</th>
                    <th class="date-column" scope="col">Date</th>
                    <th class="time-column" scope="col">Time Est.</th>
                </tr>
            </thead>
            <tbody class="gray">
            </tbody>
            <tfoot>
                <tr class="table-row">
                    <td></td>
                    <td class="add-task-row" colspan="4">
                        <input class="add-task-row-input form-control" minlength="1" maxlength="35" type="text"
                           placeholder="+ Add Task">
                    </td>
                    <td class="add-task-button-cell">
                        <button class="btn btn-primary add-task-button" type="button">+ Add</button>
                    </td>
                </tr>
                <tr>
                    <td colspan="5"></td>
                    <td class="estimated-time-sum">
                    </td>
                </tr>
            </tfoot>
        </table>
            `;

            $('#mainContentHeader').after(table);

            if (data[index].projectTasks) {
                let projectTasks = data[index].projectTasks;
                projectTasks.sort(compareSequence)
                console.log(projectTasks)
                $.each(projectTasks, function (taskIndex) {
                    let {choosedPriorityClass, choosedStatusClass} = setStatusAndPriority(projectTasks, taskIndex);
                    let row = createTaskRow(projectTasks,taskIndex, choosedPriorityClass, choosedStatusClass);
                    $('#item_' + data[index].sequence + ' tbody').append(row)

                }) /* End of projectTasks Foreach */

            }

        }) /* End of Project Foreach */

    } /* End of show projects function */

    let $body = $('body');

    /* Adds and displays task on add task button click */

    $body.on('click touchend', '.add-task-button', function () {
        let $table = $(this).parents('table');
        let taskTitle = $table.find('.add-task-row-input').val();
        if(taskTitle.length >= 1) {
            let tableId = $table.attr('id').toString().split('_')[1];
            let ProjectPojo = {
                taskTitle: taskTitle,
                tableId: tableId
            }
            $.post({
                url: "/projects/add-task",
                contentType: "application/json",
                data: JSON.stringify(ProjectPojo)
            }).done(function (data) {
                let {choosedPriorityClass, choosedStatusClass} = setStatusAndPriority(data, 0);
                let taskRow = createTaskRow(data, 0, choosedPriorityClass, choosedStatusClass);
                $('#item_' + tableId + ' tbody').append(taskRow)
            }).fail(function (data) {
                console.log(data)
            })
        }
    });

    /* On row hover show delete action / bin */

    $body.on('mouseenter', '.table-row', function () {
        let $binIconButton = $(this).find('.bin-icon-button');
        let $binIcon = $binIconButton.children('.bin-icon');
        $binIconButton.removeClass('invisible');
        $binIcon.removeClass('invisible');
    })

    $body.on('mouseleave', '.table-row', function () {
        let $binIconButton = $(this).find('.bin-icon-button');
        let $binIcon = $binIconButton.children('.bin-icon');
        $binIconButton.addClass('invisible');
        $binIcon.addClass('invisible');
    })

    /* Focus and on hover style of add Task */


    $body.on('mouseenter', '.add-task-row-input, .add-task-button', function () {
        let $addTaskRow = $(this).parents('.add-task-row');
        $addTaskRow.addClass('black-border')
    })

    $body.on('focus', '.add-task-row-input', function () {
        let $addTaskRow = $(this).parents('.add-task-row');
        $addTaskRow.addClass('blue-border')
    })

    $body.on('mouseout', '.add-task-row-input', function () {
        let $addTaskRow = $(this).parents('.add-task-row');
        $addTaskRow.removeClass('black-border')
    })

    $body.on('focusout', '.add-task-row-input', function () {
        let $addTaskRow = $(this).parents('.add-task-row');
        $addTaskRow.removeClass('blue-border')
    })


    $('tbody:not(tr:last)').sortable();

    /* Task title changes and saves to database on click */

    $body.on('click', '.task-title, .date-cell', function () {
        $(this).focus();
    })

    $body.on('focusout','.task-title', function () {
        let tableRowId = $(this).parent('.table-row').attr('id').split('_')[1];
        let tableId = $(this).parents('table').attr('id').split('_')[1];
        $.ajax({
            url: "projects/edit-task-title",
            method: "PATCH",
            contentType: "application/json",
            data: JSON.stringify({
                taskTitle: $(this).text().toString().trim(),
                tableRowId: tableRowId,
                tableId: tableId
            })
        })
    });

    /* Hides text with hours and shows the input on Time est. cell click */

    $body.on('click', '.time-estimated-cell', function () {
        $(this).children('.time-estimated-text').hide();
        $(this).find('.time-estimated-input').show();
    })

    /* On focusout saves the data to database, hides the input and also changes the time est. sum */

    $body.on('focusout', '.time-estimated-input', function () {
        let $timeEstimatedInput = $(this);
        let $timeEstimatedText = $timeEstimatedInput.prev('.time-estimated-text');
        $timeEstimatedText.show()
        if($timeEstimatedInput.val() !== '')
            $timeEstimatedText.text($timeEstimatedInput.val() + 'h')
        $timeEstimatedInput.hide()
        console.log($timeEstimatedInput.val())
    })

    function compareSequence(a, b) {
        if (a.sequence < b.sequence) {
            return -1;
        }
        if (a.sequence > b.sequence) {
            return 1;
        }
        return 0;
    }

    /* Disable linebreak in contenteditable */

    $body.on('keypress','.task-title[contenteditable], .title-column[contenteditable]',function (evt) {
        let keycode = evt.charCode || evt.keyCode;
        if (keycode  === 13) { //Enter key's keycode
            return false;
        }
    })

    /* Saves project title change into the database */

    $body.on('focusout','.title-column', function () {
        let tableId = $(this).parents('table').attr('id').split('_')[1];
        $.ajax({
            url: "projects/edit-project-title",
            method: "PATCH",
            contentType: "application/json",
            data: JSON.stringify({
                projectTitle: $(this).text().toString().trim(),
                tableId: tableId
            })
        })
    });

    /* On Status/Priority select saves the selected option to database */

    $body.on('click touchend', '.table-dropdown-menu button', function () {
        let tableId = $(this).parents('table').attr('id').split('_')[1];
        let tableRowId = $(this).parents('.table-row').attr('id').split('_')[1];
        $.ajax({
            url: "projects/updated-project-task-dropdown-selected-data",
            method: "PATCH",
            contentType: "application/json",
            data: JSON.stringify({
                choosedOption: $(this).text().toString().trim().toUpperCase(),
                tableId: tableId,
                tableRowId: tableRowId
            })
        })
    })

    /* On date change saves it to database*/

    $body.on('change', '.date-task-input', function () {
        let tableId = $(this).parents('table').attr('id').split('_')[1];
        let tableRowId = $(this).parents('.table-row').attr('id').split('_')[1];
        let selectedDate = $(this).val();
        $.ajax({
            url: "projects/update-project-task-date",
            method: "PATCH",
            contentType: "application/json",
            data: JSON.stringify({
                date: selectedDate,
                tableId: tableId,
                tableRowId: tableRowId
            })
        })
    });


    /* Loads and shows projects from database */

    $(window).on('load', function (e) {
        $.get({
            url: "/projects/get-all-projects",
            contentType: "application/json"
        }).done(function (data) {
            showProjects(data, e)
        }).fail(function (data) {
            console.log(data)
        })
    })


})