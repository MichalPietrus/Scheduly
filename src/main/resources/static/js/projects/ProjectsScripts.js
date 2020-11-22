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

/* Creates or updates date icon and tooltip */

function createOrUpdateDateIconAndDateIconTooltip(data, index, isUpdate, tableId, taskId, isDropdownSelect) {
    let dateIconTooltip;
    let dateIcon;
    let today = new Date();
    let taskDate;
    let status;
    if (!isUpdate) {
        taskDate = new Date(data[index].date);
        status = data[index].status;
    } else if (isDropdownSelect) {
        taskDate = new Date(data.date);
        switch (data.status) {
            case "DONE":
                status = "Done";
                break;
            case "IN_PROGRESS":
                status = "In Progress";
                break;
            case "STUCK":
                status = "Stuck";
                break;
        }
    } else
        taskDate = new Date(data)

    if (status === "Done") {
        dateIconTooltip = "Done";
        dateIcon = "icon-option-green fa-check-circle";
    } else {
        let sum = datediff(today, taskDate);
        switch (true) {
            case sum < -1 :
                dateIconTooltip = -sum + " days overdue"
                dateIcon = "icon-option-red fa-exclamation-circle";
                break;
            case sum > 1 :
                dateIconTooltip = sum + " days left"
                dateIcon = "icon-option-orange fa-exclamation-circle";
                break;
            case sum === 1 || sum >= 0  :
                dateIconTooltip = sum + " day left"
                dateIcon = "icon-option-orange fa-exclamation-circle";
                break;
            default :
                dateIconTooltip = "Today";
                dateIcon = "icon-option-blue fa-check-circle";
                break;
        }
    }

    if (isUpdate) {
        let $dateIcon = $('#table_' + tableId + ' #item_' + taskId + ' .fas');
        $dateIcon.attr('data-original-title', dateIconTooltip)
        $dateIcon.removeClass()
        $dateIcon.addClass('fas ' + dateIcon)
    }

    return {dateIconTooltip, dateIcon};
}

/* Creates and displays a task row */

function createTaskRow(data, index, choosedPriorityClass, choosedStatusClass) {

    let date = data[index].date;
    let formattedDate;
    if (date) {
        formattedDate = formatDate(date);
    }
    let {dateIconTooltip, dateIcon} = createOrUpdateDateIconAndDateIconTooltip(data, index, false, 0, 0, false);

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
                                    <span class="icon-span">
                                        <i data-toggle="tooltip" title="${(dateIconTooltip)}" class='fas ${(dateIcon)}'></i>
                                    </span>
                                    <input type="date" value="${formattedDate}" class="date-task-input form-control"/>
                                </td>
                                <td class="time-estimated-cell">
                                    <i class="time-estimated-text">${(data[index].estimatedTime) + 'h'}</i>
                                    <input type="number" value="${(data[index].estimatedTime)}" class="time-estimated-input form-control"/>
                                </td>
                           </tr>
                    `;
}

function createTable(data, index) {
    return `        
        <table id="${'table_' + (data[index].sequence)}" role="table" class="table table-sm table-borderless table-responsive-lg">
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
                    <td colspan="2"></td>
                    <td class="priority-footer-cell"></td>
                    <td class="status-footer-cell"></td>
                    <td></td>
                    <td class="estimated-time-sum">
                    </td>
                </tr>
            </tfoot>
        </table>
            `;
}

function showPriorityAndStatusFooter(LowCounter, MediumCounter, HighCounter, DoneCounter, InProgressCounter, StuckCounter, tableSequence, isUpdate) {
    let totalPriorityCounter = LowCounter + MediumCounter + HighCounter;
    let totalStatusCounter = DoneCounter + InProgressCounter + StuckCounter;
    LowCounter = LowCounter / totalPriorityCounter * 100;
    MediumCounter = MediumCounter / totalPriorityCounter * 100;
    HighCounter = HighCounter / totalPriorityCounter * 100;
    DoneCounter = DoneCounter / totalStatusCounter * 100;
    InProgressCounter = InProgressCounter / totalStatusCounter * 100;
    StuckCounter = StuckCounter / totalStatusCounter * 100;
    let priorityFooterDiv = `
                        <div style="height: 100%;width: 80%;margin: 0 auto">
                            <div class="option-pink footer-cell" title="${(LowCounter.toFixed())}%" data-toggle="tooltip" style="width: ${(LowCounter)}%"></div>
                            <div class="option-blue footer-cell" title="${(MediumCounter.toFixed())}%" data-toggle="tooltip" style="width: ${(MediumCounter)}%"></div>
                            <div class="option-purple footer-cell" title="${(HighCounter.toFixed())}%" data-toggle="tooltip" style="width: ${(HighCounter)}%"></div>
                        </div>
        `
    if (!isUpdate)
        $('#table_' + tableSequence + ' tfoot tr .priority-footer-cell').append(priorityFooterDiv)
    else
        $('#table_' + tableSequence + ' tfoot tr .priority-footer-cell').html(priorityFooterDiv);


    let statusFooterDiv = `
                        <div style="height: 100%;width: 80%;margin: 0 auto">
                            <div class="option-green footer-cell" title="${(DoneCounter.toFixed())}%" data-toggle="tooltip" style="width: ${(DoneCounter)}%"></div>
                            <div class="option-orange footer-cell" title="${(InProgressCounter.toFixed())}%" data-toggle="tooltip" style="width: ${(InProgressCounter)}%"></div>
                            <div class="option-red footer-cell" title="${(StuckCounter.toFixed())}%" data-toggle="tooltip" style="width: ${(StuckCounter)}%"></div>
                        </div>
        `

    if (!isUpdate)
        $('#table_' + tableSequence + ' tfoot tr .status-footer-cell').append(statusFooterDiv)
    else
        $('#table_' + tableSequence + ' tfoot tr .status-footer-cell').html(statusFooterDiv);


    $('[data-toggle="tooltip"]').tooltip({
        position: 'top',
    })
}


$(function () {

    let $addProjectButton = $('#addProjectButton');


    /* On add Project button click creates new table for tasks */

    $addProjectButton.on('click', function () {
        $.post({
            url: "/projects/create-project",
            contentType: "application/json"
        }).done(function (data) {
            let table = createTable(data, 0)
            $('#mainContentHeader').after(table);
        }).fail(function (data) {
            console.log(data)
        });
    })

    /* Shows all projects */

    function showProjects(data, e) {

        $.each(data, function (index) {

            let table = createTable(data, index);

            $('#mainContentHeader').after(table);

            let timeEstimatedSum = 0;
            let LowCounter = 0, MediumCounter = 0, HighCounter = 0, DoneCounter = 0, InProgressCounter = 0,
                StuckCounter = 0;

            if (data[index].projectTasks) {
                let projectTasks = data[index].projectTasks;
                projectTasks.sort(compareSequence)
                $.each(projectTasks, function (taskIndex) {
                    let {choosedPriorityClass, choosedStatusClass} = setStatusAndPriority(projectTasks, taskIndex);
                    let row = createTaskRow(projectTasks, taskIndex, choosedPriorityClass, choosedStatusClass);
                    $('#table_' + data[index].sequence + ' tbody').append(row)
                    timeEstimatedSum += projectTasks[taskIndex].estimatedTime;
                    switch (projectTasks[taskIndex].priority) {
                        case "Low":
                            LowCounter++;
                            break;
                        case "Medium":
                            MediumCounter++;
                            break;
                        case "High":
                            HighCounter++;
                            break;
                    }
                    switch (projectTasks[taskIndex].status) {
                        case "Done":
                            DoneCounter++;
                            break;
                        case "In Progress":
                            InProgressCounter++;
                            break;
                        case "Stuck":
                            StuckCounter++;
                            break;
                    }
                }) /* End of projectTasks Foreach */

            }

            showPriorityAndStatusFooter(LowCounter, MediumCounter, HighCounter, DoneCounter, InProgressCounter, StuckCounter, data[index].sequence, false);

            if (timeEstimatedSum !== 0)
                $('#table_' + data[index].sequence + ' .estimated-time-sum').text(timeEstimatedSum + 'h')


        }) /* End of Project Foreach */

    } /* End of show projects function */

    let $body = $('body');

    /* Adds and displays task on add task button click */

    $body.on('click', '.add-task-button', function () {
        let $table = $(this).parents('table');
        let $taskTitle = $table.find('.add-task-row-input');
        let taskTitle = $taskTitle.val();
        if (taskTitle.length >= 1) {
            let tableId = $table.attr('id').toString().split('_')[1];
            $taskTitle.val('');
            let ProjectPojo = {
                taskTitle: taskTitle,
                tableId: tableId
            }
            $.post({
                url: "/projects/add-task",
                contentType: "application/json",
                data: JSON.stringify(ProjectPojo)
            }).done(function (data) {
                $.each(data, function (index) {
                    if (index === 0) {
                        let {choosedPriorityClass, choosedStatusClass} = setStatusAndPriority(data, 0);
                        let taskRow = createTaskRow(data, 0, choosedPriorityClass, choosedStatusClass);
                        $('#table_' + tableId + ' tbody').append(taskRow)
                    } else {
                        showPriorityAndStatusFooter(data[index][0], data[index][1], data[index][2], data[index][3], data[index][4], data[index][5], data[index][6], true);
                    }
                })
            }).fail(function (data) {
                console.log(data)
            })
        }
    });

    /* On add task input 'enter' submit it */

    $body.on('keypress', '.add-task-row-input', function (e) {
        if (e.keyCode === 13) {
            e.preventDefault();
            let $tableRow = $(this).parent().parent();
            let $addButton = $tableRow.children('.add-task-button-cell').children()
            $addButton.click();
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

    /* Task title changes and saves to database on click */

    $body.on('click', '.task-title, .date-cell', function () {
        $(this).focus();
    })

    $body.on('focusout', '.task-title', function () {
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
        if ($timeEstimatedInput.val() !== '')
            $timeEstimatedText.text($timeEstimatedInput.val() + 'h')
        $timeEstimatedInput.hide()
        let taskEstimatedTime = $timeEstimatedInput.val();
        let tableRowId = $(this).parents('.table-row').attr('id').split('_')[1];
        let $table = $(this).parents('table');
        let tableId = $table.attr('id').split('_')[1];
        let $estimatedTimeSum = $table.find('.estimated-time-sum');
        $.ajax({
            url: "projects/edit-project-task-estimated-time",
            method: "PATCH",
            contentType: "application/json",
            data: JSON.stringify({
                estimatedTime: taskEstimatedTime,
                tableRowId: tableRowId,
                tableId: tableId
            })
        }).done(function (data) {
            $estimatedTimeSum.text(data + 'h')
        }).fail(function (data) {
            console.log(data)
        })
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

    $body.on('keypress', '.task-title[contenteditable], .title-column[contenteditable]', function (evt) {
        let keycode = evt.charCode || evt.keyCode;
        if (keycode === 13) { //Enter key's keycode
            return false;
        }
    })

    /* Saves project title change into the database */

    $body.on('focusout', '.title-column', function () {
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

    /* On Status/Priority select saves the selected option to database, and also updates the footer data */

    $body.on('click', '.table-dropdown-menu button', function () {
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
        }).done(function (data) {
            $.each(data, function (index) {
                if (index === 0)
                    showPriorityAndStatusFooter(data[index][0], data[index][1], data[index][2], data[index][3], data[index][4], data[index][5], data[index][6], true)
                else
                    createOrUpdateDateIconAndDateIconTooltip(data[index], 0, true, tableId, tableRowId, true)
            })
        }).fail(function (data) {
            console.log(data)
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
        }).done(function () {
            createOrUpdateDateIconAndDateIconTooltip(selectedDate, 0, true, tableId, tableRowId, false)
        }).fail(function (data) {
            console.log(data)
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

    let $tableBin;
    let $tableRowBinId;
    let tableBinId;
    let tableRowBinId;
    let isProjectBin = false;

    /* Prints modal for delete task */

    $body.on('click', 'table tbody .bin-icon-button', function () {
        $tableRowBinId = $(this).parent().parent();
        $tableBin = $tableRowBinId.parent().parent();
        tableRowBinId = $tableRowBinId.attr('id').split('_')[1];
        tableBinId = $tableBin.attr('id').split('_')[1];
        isProjectBin = false;
        $('#delete-modal').modal();
    });

    /* Prints modal for delete table */

    $body.on('click', 'table thead .bin-icon-button', function () {
        $tableBin = $(this).parent().parent().parent().parent();
        tableBinId = $tableBin.attr('id').split('_')[1];
        isProjectBin = true;
        $('#delete-modal').modal();
    });


    /* Deletes the task/project and then lowers the sequence of all items that had higher sequence than deleted item by 1*/

    $('#accept-delete-button').on('click', function () {
        if (isProjectBin) {
            $.ajax({
                url: "projects/delete-project",
                method: "DELETE",
                contentType: "application/json",
                data: JSON.stringify({
                    tableId: tableBinId
                })
            }).done(function () {
                $('#delete-modal').modal('toggle');
                $tableBin.remove();
                $('table').each(function () {
                    if ($(this).attr('id')) {
                        if (parseInt($(this).attr('id').toString().split("_")[1]) > tableBinId) {
                            let thisTableId = parseInt($(this).attr('id').toString().split("_")[1]) - 1;
                            $(this).attr('id', 'item_' + thisTableId);
                        }
                    }
                })
            }).fail(function () {
                console.log("fail")
            })
        } else {
            $.ajax({
                url: "projects/delete-project-task",
                method: "DELETE",
                contentType: "application/json",
                data: JSON.stringify({
                    tableId: tableBinId,
                    tableRowId: tableRowBinId
                })
            }).done(function () {
                $('#delete-modal').modal('toggle');
                $tableRowBinId.remove();
                $('#table_' + tableBinId + ' tbody tr').each(function () {
                    if ($(this).attr('id')) {
                        if (parseInt($(this).attr('id').toString().split("_")[1]) > tableRowBinId) {
                            let thisRowId = parseInt($(this).attr('id').toString().split("_")[1]) - 1;
                            $(this).attr('id', 'item_' + thisRowId);
                        }
                    }
                })
            }).fail(function () {
                console.log("fail")
            })
        }
    });


    /* Search engine */

    let $search = $('#txtSearch');
    let $searchSubmitButton = $('#search-button');
    $search.on('keyup', searchEngine);
    $searchSubmitButton.on('click submit', searchEngine);

    /* Searches for the element in database by title and also have the autocomplete feature */

    function searchEngine(e) {
        e.preventDefault();
        $.get({
            url: "/projects/search",
            contentType: "application/json",
            data: {
                keyword: $search.val().toString()
            }
        }).done(function (data) {
            let titlesArray = [];
            $.each(data, function (index) {
                titlesArray.push(data[index].title)
            })
            $search.autocomplete({
                source: titlesArray
            });
            let value = $search.val().toLowerCase();
            $('body table').each(function () {
                let projectTitle = $(this).children('thead').children().children('.title-column').text().toLowerCase();
                if (value === '') {
                    $(this).show()
                } else if (projectTitle.toLowerCase().indexOf(value) > -1) {
                    $(this).show()
                } else {
                    $(this).hide()
                }
            })
        });
    }

})