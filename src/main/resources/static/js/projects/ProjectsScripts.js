$(function () {

    let $addProjectButton = $('#addProjectButton');

    $addProjectButton.on('click touchend', function () {

        let table = `        
        <table role="table" class="table table-sm table-borderless table-responsive-lg">
            <thead>
            <tr class="table-row">
                <th class="action-column" scope="col">
                    <button type="button" class="bin-icon-button invisible">
                        <img class="bin-icon invisible" src="img/trash-bin.svg" alt="bin"/>
                    </button>
                </th>
                <th class="title-column" scope="col">Project Title</th> 
                <th class="priority-column" scope="col">Priority</th> 
                <th class="status-column" scope="col">Status</th>
                <th class="date-column" scope="col">Date</th>
                <th class="time-column" scope="col">Time Est.</th>
            </tr>
            </thead>
            <tbody class="gray">
                <tr>
                    <td></td> <!-- Action Delete -->
                    <td class="add-task-row" colspan="5">
                        <input class="add-task-row-input form-control" minlength="1" maxlength="35" type="text" placeholder="+ Add Task">
                    </td>
                </tr>
            </tbody>
        </table>`;

        $('#mainContentHeader').after(table);

    })

    function showProjects(data, e) {
        $.each(data, function (index) {

            let table = `        
                <table role="table" class="table table-sm table-borderless table-responsive-lg">
                    <thead>
                         <tr class="table-row">
                            <th class="action-column" scope="col">
                                <button type="button" class="bin-icon-button invisible">
                                    <img class="bin-icon invisible" src="img/trash-bin.svg" alt="bin"/>
                                </button>
                            </th>
                            <th class="title-column" scope="col">Project Title</th> 
                            <th class="priority-column" scope="col">Priority</th> 
                            <th class="status-column" scope="col">Status</th>
                            <th class="date-column" scope="col">Date</th>
                            <th class="time-column" scope="col">Time Est.</th>
                        </tr>
                    </thead>
                     <tbody class="gray">
                        <tr class="table-row">
                            <td></td> <!-- Action Delete -->
                            <td class="add-task-row" colspan="5">
                                <input class="add-task-row-input form-control" minlength="1" maxlength="35" type="text" placeholder="+ Add Task">
                            </td>
                        </tr>
                     </tbody>
                </table>
            `;
            $('#mainContentHeader').after(table);

            let projectTasks = data[index].projectTasks;

            if (projectTasks) {
                $.each(projectTasks, function (index) {
                    let row = `
                    <tr class="table-row" id="${'item-' + (projectTasks[index].sequence)}">
                                <td class="action-cell">
                                    <button type="button" class="bin-icon-button invisible">
                                        <img class="bin-icon invisible" src="img/trash-bin.svg" alt="bin"/>
                                    </button>
                                </td>
                                <td class="task-title">${(projectTasks[index]).title}
                                <button type="button" class="edit-icon-button">
                                    <img class="edit-icon" src="img/edit.svg" alt="edit"/>
                                </button>
                                </td>
                                <td class="option-select-cell">
                                <div class="priority dropdown">
                                        <button class="btn btn-secondary dropdown-toggle default-button ${(choosedPriorityClass)}" type="button"
                                        data-toggle="dropdown" aria-haspopup="true"
                                        aria-expanded="false">${(projectTasks[index].priority)}
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
                                        data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">${(projectTasks[index].status)}
                                    </button>
                                    
                                    <div class="table-dropdown-menu dropdown-menu" aria-labelledby="statusDropdown">
                                        <button class="btn btn-secondary dropdown-toggle option-green" type="button">Done</button>
                                        <button class="btn btn-secondary dropdown-toggle option-orange" type="button">In Progress
                                        </button>
                                        <button class="btn btn-secondary dropdown-toggle option-red" type="button">Stuck</button>
                                    </div>
                                </div>
                                </td>
                                <td>
                                      <!-- Date row -->
                                </td>
                                <td>
                                       <!-- Time estimated row -->
                                </td>
                           </tr>
                    `
                })
            }
        })
    }

    /* On row hover show delete action / bin */

    let $tbody = $('tbody');
    let $thead = $('thead');

    $tbody.add($thead).on('mouseenter', '.table-row', function () {
        let $binIconButton = $(this).find('.bin-icon-button');
        let $binIcon = $binIconButton.children('.bin-icon');
        $binIconButton.removeClass('invisible');
        $binIcon.removeClass('invisible');
    })

    $tbody.add($thead).on('mouseleave', '.table-row', function () {
        let $binIconButton = $(this).find('.bin-icon-button');
        let $binIcon = $binIconButton.children('.bin-icon');
        $binIconButton.addClass('invisible');
        $binIcon.addClass('invisible');
    })

    /* Focus and on hover style of add Task */

    let $tfoot = $('tfoot')

    $tfoot.on('mouseenter', '.add-task-row-input, .add-task-button', function () {
        let $addTaskRow = $(this).parents('.add-task-row');
        $addTaskRow.addClass('black-border')
    })

    $tfoot.on('focus', '.add-task-row-input', function () {
        let $addTaskRow = $(this).parents('.add-task-row');
        $addTaskRow.addClass('blue-border')
    })

    $tfoot.on('mouseout', '.add-task-row-input', function () {
        let $addTaskRow = $(this).parents('.add-task-row');
        $addTaskRow.removeClass('black-border')
    })

    $tfoot.on('focusout', '.add-task-row-input', function () {
        let $addTaskRow = $(this).parents('.add-task-row');
        $addTaskRow.removeClass('blue-border')
    })


    $('tbody:not(tr:last)').sortable();

    $tbody.on('click', '.task-title, .date-cell', function () {
        $(this).focus();
    })

    let $timeSum = $('.estimated-time-sum');
    let $table = $timeSum.parents('table')
    $table.find('.time-estimated-input');
    $timeSum.text($timeSum.parents('table').find('.'))


    // $(window).on('load', function (e) {
    //     $.get({
    //         url: "/project/get-all-projects",
    //         contentType: "application/json"
    //     }).done(function (data) {
    //         showProjects(data, e)
    //     }).fail(function (data) {
    //         console.log(data)
    //     })
    // })

})