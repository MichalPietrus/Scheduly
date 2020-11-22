$(function () {


    let $deleteTaskButton = $('#delete-task-button')
    let $acceptDeleteButton = $('#accept-delete-button')
    let $priorityDropdownButton = $('#priorityDropdownButton');
    let $statusDropdownButton = $('#statusDropdownButton');
    let $editTaskButton = $('#edit-task-button')
    let $descriptionTextArea = $('#descriptionTextArea');
    let $description = $('#description');
    let $taskTitle = $('#taskTitle');
    let $fromDate = $('#fromDate');
    let $toDate = $('#toDate');
    let tableRowId;
    let $tbody = $('tbody');

    /* On title-column hover show edit task icon */

    $tbody.on('mouseenter', '.task-title', function () {
        let $editIconButton = $(this).children('.edit-icon-button');
        let $editIcon = $editIconButton.children('.edit-icon');
        $editIconButton.show();
        $editIcon.show();
    })
    $tbody.on('mouseleave', '.task-title', function () {
        let $editIconButton = $(this).children('.edit-icon-button');
        let $editIcon = $editIconButton.children('.edit-icon');
        $editIconButton.hide();
        $editIcon.hide();
    })

    /* On edit fills the field with data from database and displays the edit task container */

    $tbody.on('click', '.edit-icon-button', function () {
        tableRowId = $(this).parents('tr').attr('id').toString().split('_')[1];
        let $fadeinContainer = $('.fadein-container');
        let $overlay = $('#overlay');
        let $createTaskButtonForm = $('#createTaskButtonForm')
        let $deleteAndEditTaskButtonsForm = $('#delete-and-edit-task-buttons-form');
        $.get({
            url: "/task/get-task-by-sequence",
            contentType: "application/json",
            data: {
                tableRowId: tableRowId
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
    });


    $editTaskButton.on('click submit', function (e) {
        let priorityChecked = $priorityDropdownButton.text().toString().trim().toUpperCase() === ('PRIORITY' || '');
        let statusChecked = $statusDropdownButton.text().toString().trim().toUpperCase() === ('STATUS' || '');
        if ($(this).closest('form')[0].checkValidity() && '' !== $taskTitle.val()
            && '' !== $fromDate.val()
            && '' !== $toDate.val()
            && !priorityChecked
            && !statusChecked) {
            e.preventDefault();
            let Task = {
                sequence: tableRowId, /* For calendar edit change it to */
                title: $taskTitle.val(),
                fromDate: $fromDate.val(),
                toDate: $toDate.val(),
                priority: $priorityDropdownButton.text().toString().trim().toUpperCase(),
                status: $statusDropdownButton.text().toString().trim().toUpperCase(),
                description: $description.text().toString().trim()
            }
            $.ajax({
                url: "/task/edit",
                method: "PATCH",
                contentType: "application/json",
                data: JSON.stringify(Task)
            }).done(function (data) {
                showTableTasksElements(data, e)
                hideContainer();
            }).fail(function (data) {
                console.log(data)
            });
        }
    })

    $deleteTaskButton.on('click submit', function (e) {
        $('#delete-task-modal').modal();
        e.preventDefault();
    });

    $acceptDeleteButton.on('click submit', function () {
        $.ajax({
            url: "/task/delete-task",
            method: "DELETE",
            data: {
                tableRowId: tableRowId
            }
        }).done(function () {

            /* Removes the table row and then changes id of all elements that had higher id than it, and then hides container */

            $('#item_' + tableRowId).remove();
            $('tr').each(function () {
                if ($(this).attr('id')) {
                    if (parseInt($(this).attr('id').toString().split("_")[1]) > tableRowId) {
                        let thisRowId = parseInt($(this).attr('id').toString().split("_")[1]) - 1;
                        $(this).attr('id', 'item_' + thisRowId);
                    }
                }
            })
            hideContainer();
            $('#delete-task-modal').modal('toggle');
        }).fail(function (data) {
            console.log(data)
        });
    });
});