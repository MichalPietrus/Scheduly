/* Displays Add Task Form after clicking the button*/

$(function () {
    let $addTaskButton = $('#addTaskButton');
    let $fadeinContainer = $('.fadein-container');
    let $login = $('#addTaskForm');
    let $overlay = $('#overlay');
    $addTaskButton.on('click', function (e) {
        $overlay.addClass('overlay');
        if (e.target.id === $addTaskButton.attr('id')) {
            $login.addClass('activate');
        } else {
            $login.removeClass('activate');
        }
        $fadeinContainer.stop(true, true).fadeTo(700, 1);
        $fadeinContainer.show();
    });
    $('body').on('click', function (e) {
        let $descriptionContainer = $('.description-container');
        let isAddTaskButton = e.target.id !== $addTaskButton.attr('id');
        let isFadeInContainer = e.target.id !== $fadeinContainer.attr('id');
        let hasParentFadeInContainer = $(e.target).parents().is('.fadein-container');
        let isNotDescriptionBox = $(e.target).parents().is($descriptionContainer);
        if (isAddTaskButton && isFadeInContainer && !hasParentFadeInContainer && !isNotDescriptionBox) {
            $fadeinContainer.stop(true, true).fadeTo(700, 0);
            $overlay.removeClass('overlay');
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

function dropdownSelection($dropdownButton,$dropdownToggle) {
    $($dropdownToggle).on('click', function(){
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

$(function () {

    /* Description box fadein */

    let $fadeinContainer = $('.fadein-container');
    let $descriptionContainer = $('.description-container')
    let $description = $('#description');
    $description.add('#descriptionBoxNavigation > button').on('click', function (e) {
        let $descriptionTextArea = $('#descriptionTextArea').val();
       let fadeInContainerHeight = $fadeinContainer.css('height');
       $descriptionContainer.css('height',fadeInContainerHeight);
       $descriptionContainer.toggle("slide",750);
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
    $('#createTaskButton').on('click submit',function (e){
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
                console.log(data)
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
