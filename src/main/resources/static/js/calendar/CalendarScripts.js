$(document).ready(function () {

    let $deleteTaskButton = $('#delete-task-button')
    let $acceptDeleteButton = $('#accept-delete-button')
    let $priorityDropdownButton = $('#priorityDropdownButton');
    let $statusDropdownButton = $('#statusDropdownButton');
    let $editTaskButton = $('#edit-task-button')
    let $description = $('#description');
    let $taskTitle = $('#taskTitle');
    let $fromDate = $('#fromDate');
    let $toDate = $('#toDate');

    let calendarEl = document.getElementById('calendar');
    let calendar = new FullCalendar.Calendar(calendarEl, {
        themeSystem: 'bootstrap',
        expandRows: true,
        headerToolbar: {
            left: '',
            center: 'title',
            right: 'prev,next,today dayGridMonth,timeGridWeek,timeGridDay'
        },
        initialView: 'dayGridMonth',
        initialDate: new Date().toISOString(),
        navLinks: true, // can click day/week names to navigate views
        editable: true,
        selectable: true,
        nowIndicator: true,
        dayMaxEvents: true, // allow "more" link when too many events
        events: {
                url: '/calendar/get-all-events',
            },

        eventClick: function (info) {
            fillEditContainerWithData(info.event)
        },
        eventDrop: function (info){
            let parsedFromDate = moment(info.event.start).format(moment.HTML5_FMT.DATETIME_LOCAL);
            let parsedToDate = moment(info.event.end).format(moment.HTML5_FMT.DATETIME_LOCAL);
            let Task = {
                fromDate: parsedFromDate,
                toDate: parsedToDate,
                id: info.event.id
            }
            $.ajax({
                method: 'PATCH',
                url: "/calendar/save-position-on-drop",
                data: JSON.stringify(Task),
                contentType: 'application/json'
            })
        },
        select: function (info){
            let $priorityDropdownButton =  $('#priorityDropdownButton');
            let $statusDropdownButton = $('#statusDropdownButton');
            let parsedFromDate = moment(info.start).format(moment.HTML5_FMT.DATETIME_LOCAL);
            let parsedToDate = moment(info.end).subtract(1, 'seconds')._d;
            $('#fromDate').val(parsedFromDate);
            $('#toDate').val(moment(parsedToDate).format(moment.HTML5_FMT.DATETIME_LOCAL));
            showAddTaskForm($priorityDropdownButton,$statusDropdownButton)
        }
    });
    calendar.render();


    $('.fc-header-toolbar').addClass('row');
    let $buttonsRow = $('.fc-header-toolbar .fc-toolbar-chunk:last');
    $buttonsRow.addClass('row no-gutters justify-content-between')

    let $firstHeaderGroup = $('.fc-header-toolbar .fc-toolbar-chunk:last .btn-group:first')
    let $secondHeaderGroup = $('.fc-header-toolbar .fc-toolbar-chunk:last .btn-group:last')
    $firstHeaderGroup.css({
        'padding-left':'15px',
        'margin-top':'10px'
    })
    $secondHeaderGroup.css({
        'padding-right':'15px',
        'margin-top':'10px'
    })

    /* Edits task */

    $editTaskButton.on('click submit touchend', function (e) {
        let priorityChecked = $priorityDropdownButton.text().toString().trim().toUpperCase() === ('PRIORITY' || '');
        let statusChecked = $statusDropdownButton.text().toString().trim().toUpperCase() === ('STATUS' || '');
        let elementId = $('#addTaskForm').data('elementId');
        if($(this).closest('form')[0].checkValidity() && '' !== $taskTitle.val()
            && '' !== $fromDate.val()
            && '' !== $toDate.val()
            && !priorityChecked
            && !statusChecked) {
            e.preventDefault();
            let Task = {
                id: elementId,
                title: $taskTitle.val(),
                fromDate: $fromDate.val(),
                toDate: $toDate.val(),
                priority: $priorityDropdownButton.text().toString().trim().toUpperCase(),
                status: $statusDropdownButton.text().toString().trim().toUpperCase(),
                description: $description.text().toString().trim()
            }
            $.ajax({
                url: "/calendar/edit",
                method: "PATCH",
                contentType: "application/json",
                data: JSON.stringify(Task)
            }).done(function (data) {
                let color;
                switch (data.priority) {
                    case 'LOW':
                        color = "rgb(255, 90, 196)";
                        break;
                    case 'MEDIUM':
                        color = "rgb(87,155,252)";
                        break;
                    case 'HIGH':
                        color = "rgb(120,75,209)";
                        break;
                }
                hideContainer();
                calendar.getEventById(elementId).setProp('title',data.title);
                calendar.getEventById(elementId).setProp('backgroundColor',color);
                calendar.getEventById(elementId).setProp('borderColor',color);
                calendar.getEventById(elementId).setStart(data.fromDate)
                calendar.getEventById(elementId).setEnd(data.toDate);
            }).fail(function (data){
                console.log(data)
            });
        }
    })

    /* Shows delete modal confirmation container */

    $deleteTaskButton.on('click submit touchend', function (e) {
        $('#delete-task-modal').modal();
        e.preventDefault();
    });

    /* Deletes task */

    $acceptDeleteButton.on('click submit touchend', function () {
        let elementId = $('#addTaskForm').data('elementId');
        $.ajax({
            url: "/calendar/delete-task",
            method: "DELETE",
            data: {
                elementId: elementId
            }
        }).done(function () {
            /* hides container */
            hideContainer();
            $('#delete-task-modal').modal('toggle');
            calendar.getEventById(elementId).remove();
        }).fail(function (data) {
            console.log(data)
        });
    });

    /* Add task */

    $('.create-task-button-calendar').on('click submit touchstart',function (e){
        let $taskTitle = $('#taskTitle').val();
        let $fromDate = $('#fromDate').val();
        let $toDate = $('#toDate').val()
        let $priority = $('#priorityDropdownButton').text().toString().trim().toUpperCase();
        let $status = $('#statusDropdownButton').text().toString().trim().toUpperCase();
        let $description = $('#description').text().toString().trim();
        let priorityChecked = $priority === ('PRIORITY' || '');
        let statusChecked = $status === ('STATUS' || '');
        if($(this).closest('form')[0].checkValidity() && '' !== $taskTitle
            && '' !== $fromDate
            && '' !== $toDate
            && !priorityChecked
            && !statusChecked) {
            e.preventDefault();
            let Task = {
                title: $taskTitle,
                fromDate: $fromDate,
                toDate: $toDate,
                priority: $priority,
                status: $status,
                description: $description
            }
            $.post({
                url: "/task/save",
                contentType: "application/json",
                data: JSON.stringify(Task)
            }).done(function (data) {
                let color;
                switch ($priority) {
                    case 'LOW':
                        color = "rgb(255, 90, 196)";
                        break;
                    case 'MEDIUM':
                        color = "rgb(87,155,252)";
                        break;
                    case 'HIGH':
                        color = "rgb(120,75,209)";
                        break;
                }
                hideContainer();
                calendar.addEvent({
                    id: data[0].id,
                    title: $taskTitle,
                    start: $fromDate,
                    end: $toDate,
                    color: color
                })
            }).fail(function (data){
                console.log(data)
            });
        }
    });

})

/* On edit fills the field with data from database and displays the edit task container */

function fillEditContainerWithData(event) {

    let $priorityDropdownButton = $('#priorityDropdownButton');
    let $statusDropdownButton = $('#statusDropdownButton');
    let $descriptionTextArea = $('#descriptionTextArea');
    let $description = $('#description');
    let $taskTitle = $('#taskTitle');
    let $fromDate = $('#fromDate');
    let $toDate = $('#toDate');
    let $fadeinContainer = $('.fadein-container');
    let $overlay = $('#overlay');
    let $createTaskButtonForm = $('#createTaskButtonForm')
    let $deleteAndEditTaskButtonsForm = $('#delete-and-edit-task-buttons-form');


    $.get({
        url: "/calendar/get-task-by-id",
        contentType: "application/json",
        data: {
            elementId: event.id
        }
    }).done(function (data) {
        $overlay.addClass('overlay');
        $('body').addClass('stop-scrolling')
        $fadeinContainer.stop(true, true).fadeTo(700, 1);
        $fadeinContainer.show();
        $createTaskButtonForm.hide();
        $deleteAndEditTaskButtonsForm.show();
        switch (data.priority) {
            case "LOW":
                $priorityDropdownButton.removeClass("option-purple option-blue")
                $priorityDropdownButton.addClass("option-pink");
                data.priority = "Low";
                break;
            case "MEDIUM":
                $priorityDropdownButton.removeClass("option-purple option-pink")
                $priorityDropdownButton.addClass("option-blue");
                data.priority = "Medium";
                break;
            case "HIGH":
                $priorityDropdownButton.removeClass("option-pink option-blue")
                $priorityDropdownButton.addClass("option-purple");
                data.priority = "High";
                break;
        }
        switch (data.status) {
            case "DONE":
                $statusDropdownButton.removeClass("option-orange option-red")
                $statusDropdownButton.addClass("option-green");
                data.status = "Done";
                break;
            case "IN_PROGRESS":
                $statusDropdownButton.removeClass("option-green option-red")
                $statusDropdownButton.addClass("option-orange");
                data.status = "In Progress";
                break;
            case "STUCK":
                $statusDropdownButton.removeClass("option-orange option-green")
                $statusDropdownButton.addClass("option-red");
                data.status = "Stuck";
                break;
        }
        $('#addTaskForm').data('elementId',data.id);
        $taskTitle.val(data.title);
        $fromDate.val(data.fromDate);
        $toDate.val(data.toDate);
        $priorityDropdownButton.text(data.priority);
        $statusDropdownButton.text(data.status);
        $description.text(data.description);
        $descriptionTextArea.val(data.description);
    }).fail(function (data) {
        console.log(data);
    })
}


