$(function () {
    $('body').on('click', '.default-button', function () {
        let $dropdownButton = $(this);
        let $dropdownToggle = $($dropdownButton).next().children('button');
        swapClassesOnStatusOrPrioritySelect($dropdownButton, $dropdownToggle);
    })
});

function datediff(first, second) {
    return Math.round((second - first) / (1000 * 60 * 60 * 24));
}


function swapClassesOnStatusOrPrioritySelect($dropdownButton, $dropdownToggle) {
    $($dropdownToggle).on('click touchstart', function () {
        $dropdownButton.html($(this).html());
        if ($(this).parents('.dropdown').hasClass('status')) {
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

function swapClass($dropdownButton, $option, addClass, removeClass, removeClassTwo) {
    if ($option.hasClass(addClass)) {
        $dropdownButton.addClass(addClass);
        $dropdownButton.removeClass(removeClass);
        $dropdownButton.removeClass(removeClassTwo);
    }
}

function setStatusAndPriority(data, index) {
    let choosedPriorityClass;
    let choosedStatusClass;

    /* Sets the background color and text of status and priority */

    switch (data[index].priority) {
        case "LOW":
            choosedPriorityClass = "option-pink";
            data[index].priority = "Low";
            break;
        case "MEDIUM":
            choosedPriorityClass = "option-blue";
            data[index].priority = "Medium";
            break;
        case "HIGH":
            choosedPriorityClass = "option-purple";
            data[index].priority = "High";
            break;
    }
    switch (data[index].status) {
        case "DONE":
            choosedStatusClass = "option-green";
            data[index].status = "Done";
            break;
        case "IN_PROGRESS":
            choosedStatusClass = "option-orange";
            data[index].status = "In Progress";
            break;
        case "STUCK":
            choosedStatusClass = "option-red";
            data[index].status = "Stuck";
            break;
    }
    return {choosedPriorityClass, choosedStatusClass};
}