function dropdownSelection($dropdownButton,$dropdownToggle) {
    $($dropdownToggle).on('click touchstart', function(){
        $dropdownButton.html($(this).html());
        if($(this).parents('.dropdown').hasClass('status')) {
            swapClass($dropdownButton, $(this), 'option-orange', 'option-green', 'option-red')
            swapClass($dropdownButton, $(this), 'option-green', 'option-orange', 'option-red')
            swapClass($dropdownButton, $(this), 'option-red', 'option-green', 'option-orange')
        } else {
            swapClass($dropdownButton, $(this), 'option-pink', 'option-blue', 'option-purple')
            swapClass($dropdownButton, $(this), 'option-blue', 'option-pink', 'option-purple')
            swapClass($dropdownButton, $(this), 'option-purple', 'option-blue', 'option-pink')
        }
    });
}

function swapClass($dropdownButton,$option,addClass, removeClass, removeClassTwo) {
    if($option.hasClass(addClass)){
        $dropdownButton.addClass(addClass);
        $dropdownButton.removeClass(removeClass);
        $dropdownButton.removeClass(removeClassTwo);
    }
}

function hideContainer() {
    let $descriptionContainer = $('.description-container');
    let $fadeinContainer = $('.fadein-container');
    let $overlay = $('#overlay');
    $fadeinContainer.stop(true, true).fadeTo(700, 0);
    $overlay.removeClass('overlay');
    $('body').removeClass('stop-scrolling')
    $fadeinContainer.hide();
    $descriptionContainer.animate({width: 'hide'}, 350);
}




/* Displays Add Task Form after clicking the button*/

$(function () {
    let $addTaskButton = $('#addTaskButton');
    let $fadeinContainer = $('.fadein-container');
    let $overlay = $('#overlay');
    $addTaskButton.on('click touchstart', function (e) {
        let $priorityDropdownButton =  $('#priorityDropdownButton');
        let $statusDropdownButton = $('#statusDropdownButton');
        $('#fromDate').val('');
        $('#toDate').val('');
        showAddTaskForm($priorityDropdownButton,$statusDropdownButton)
    });
    $('body').on('mousedown touchstart', function (e) {
        let $descriptionContainer = $('.description-container');
        let isAddTaskButton = e.target.id !== $addTaskButton.attr('id');
        let isFadeInContainer = e.target.id !== $fadeinContainer.attr('id');
        let hasParentFadeInContainer = $(e.target).parents().is('.fadein-container');
        let isNotDescriptionBox = $(e.target).parents().is($descriptionContainer);
        if (isAddTaskButton && isFadeInContainer && !hasParentFadeInContainer && !isNotDescriptionBox) {
            $fadeinContainer.stop(true, true).fadeTo(700, 0);
            $overlay.removeClass('overlay');
            $('body').removeClass('stop-scrolling')
            $fadeinContainer.hide();
            $descriptionContainer.animate({width:'hide'},350);
        }
    });
});

/* Changes colors of dropdown buttons */

$(function() {
    let $statusDropdownButton = $('#statusDropdownButton');
    let $priorityDropdownButton = $('#priorityDropdownButton');
    let $statusDropdownToggle = $('#statusDropdownMenu button');
    let $priorityDropdownToggle = $('#priorityDropdownMenu button');
    dropdownSelection($statusDropdownButton,$statusDropdownToggle);
    dropdownSelection($priorityDropdownButton,$priorityDropdownToggle);
});

$(function () {

    /* Description box fadein */

    let $fadeinContainer = $('.fadein-container');
    let $descriptionContainer = $('.description-container')
    let $description = $('#description');
    $description.add('#descriptionBoxNavigation > button').on('click', function (e) {
        let $descriptionTextArea = $('#descriptionTextArea').val();
       let fadeInContainerHeight = $fadeinContainer.css('height');
       $descriptionContainer.css('height',fadeInContainerHeight);
       $descriptionContainer.toggle("slide",500);
       $fadeinContainer.toggle();
       $description.text($descriptionTextArea)
   })

    /* On resize make copy the height of container which it is in */

    $(window).on('resize',function (){
       let fadeInContainerHeight = $fadeinContainer.css('height');
       $descriptionContainer.css('height',fadeInContainerHeight);
    });
});


/* After clicking submit button method checks if all required fields are there
   (also works for browsers without html5 required attr) then it sends the data to server
    which saved the data in database
*/

$(function () {
    $('.create-task-button-dashboard').on('click submit touchstart',function (e){
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
                hideContainer();
                console.log(data)
                if(e.target.classList.contains('dashboard')) {
                    showTableTasksElements(data, e)
                }
            }).fail(function (data){
               console.log(data)
            });
        }
    });
});

/* Changes the time of "From" Date if "To" Date is higher */

$(function () {

  let $FromDate = $('#fromDate');
  let $ToDate = $('#toDate');

  $ToDate.add($FromDate).on('change',function () {
      let parsedFromDate = new Date($FromDate.val());
      let parsedToDate = new Date($ToDate.val());
      if(parsedToDate.getTime() < parsedFromDate.getTime()){
          let newParsedFromDate = new Date(parsedToDate.setMinutes(parsedToDate.getMinutes() - 30))
          $FromDate.val(newParsedFromDate.toISOString().substring(0, 16));
      }
  });

});

function showAddTaskForm($priorityDropdownButton, $statusDropdownButton) {
    let $createTaskButtonForm = $('#createTaskButtonForm')
    let $deleteAndEditTaskButtonsForm = $('#delete-and-edit-task-buttons-form');
    let $fadeinContainer = $('.fadein-container');
    let $overlay = $('#overlay');
    $('#taskTitle').val('');
    $('#descriptionTextArea').val('');
    $priorityDropdownButton.removeClass("option-pink option-blue option-purple")
    $priorityDropdownButton.text('Priority');
    $statusDropdownButton.removeClass("option-green option-orange option-red")
    $statusDropdownButton.text('Status');
    $('#description').text('Add a Description >');
    $overlay.addClass('overlay');
    $('body').addClass('stop-scrolling')
    $fadeinContainer.stop(true, true).fadeTo(700, 1);
    $fadeinContainer.show();
    $createTaskButtonForm.show();
    $deleteAndEditTaskButtonsForm.hide();
}
