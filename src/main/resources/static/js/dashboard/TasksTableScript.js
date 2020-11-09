function updateDropdownSelectedData() {
    $('.table-dropdown-menu button').on('click', function () {
        let tableRowId = $(this).parents('tr').attr('id');
        let Task = {
            choosedOption: $(this).text().toString().trim(),
            sequence: tableRowId.toString().split("_")[1]
        }
        $.ajax({
            url: "/task/update-dropdown-selected-data",
            method: "PATCH",
            contentType: "application/json",
            data: JSON.stringify(Task)
        })
    });
}

function changePriorityOrStatus() {
    $('tbody .default-button').on('click', function () {
        let $dropdownButton = $(this);
        let $dropdownToggle = $($dropdownButton).next().children('button');
        dropdownSelection($dropdownButton, $dropdownToggle);
    })
}

function datediff(first, second) {
    return Math.round((second - first)/(1000*60*60*24));
}

$(function () {
    $(window).on('load', function () {
        $.get({
            url: "/task/get-all",
            contentType: "application/json",
        }).done(function (data) {
            let $tableBody = $('tbody');
            $.each(data, function (index) {
                let choosedPriorityClass;
                let choosedStatusClass;
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
                let fromDate = new Date(data[index].fromDate);
                let toDate = new Date(data[index].toDate);
                let today = new Date();
                let formattedFromDate = new Intl.DateTimeFormat("en-US", {
                    month: "short",
                    day: "numeric",
                    hour: 'numeric',
                    minute: 'numeric',
                    second: 'numeric'
                }).format(new Date(fromDate));
                let formattedToDate = new Intl.DateTimeFormat("en-US", {
                    month: "short",
                    day: "numeric",
                    hour: 'numeric',
                    minute: 'numeric',
                    second: 'numeric'
                }).format(new Date(toDate));
                let timelineTooltip;
                let timelineColor;
                let totalNumberOfDays = datediff(fromDate,toDate);
                if (data[index].status === "Done") {
                    timelineTooltip = "Done";
                    timelineColor = "option-green";
                } else {
                    let sum = datediff(today,toDate);
                    switch (true) {
                        case sum === 0 :
                            timelineTooltip = "Today";
                            timelineColor = "option-blue";
                            break;
                        case sum < 1 :
                            timelineTooltip = -sum + " days overdue"
                            timelineColor = "option-red";
                            break;
                        case sum > 1 :
                            timelineTooltip = sum + " days left"
                            timelineColor = "option-orange";
                            break;
                    }
                }

                let row = `<tr id="${'item_' + (data[index].sequence)}">
                                <td>${(data[index]).title}</td>
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
                                <td>
                                      <button class="timeline-button btn btn-secondary ${(timelineColor)}" data-number-of-days="${(totalNumberOfDays)}"  data-toggle="tooltip" title="${(timelineTooltip)}"
                                      type="button" data-from-year="${fromDate.getFullYear()}" data-to-year="${toDate.getFullYear()}" data-from-date="${formattedFromDate}" data-to-date="${formattedToDate}">${((formattedFromDate) + " - " + (formattedToDate))}
                                      </button>
                                </td>
                           </tr>`
                $tableBody.html(function () {
                    return $(this).html() + row;
                });
            })
            changePriorityOrStatus();
            updateDropdownSelectedData();
            $('[data-toggle="tooltip"]').tooltip({
                position: 'top',
            })
            let $timelineButton = $('.timeline-button')
            $timelineButton.on('mouseenter', function () {
                $(this).text($(this).data('numberOfDays') + ' days');
            })
            $timelineButton.on('mouseleave', function () {
                $(this).text($(this).data('fromDate') + ' - ' + $(this).data('toDate'));
            })
            $('.table-dropdown-menu button').on('click', function () {
                let rowId = $(this).parents('tr').attr('id');
                let $button = $('#' + rowId + ' > td > .timeline-button');
                let toDateData = $button.data('toDate').toString();
                let today = new Date();
                let toDate = new Date(toDateData);
                toDate.setFullYear($button.data('toYear'));
                let status = $(this).text();
                let timelineTooltip;
                let timelineColor;
                if (status === "Done") {
                    timelineTooltip = "Done";
                    timelineColor = "option-green";
                } else {
                    let sum;
                    sum = datediff(today, toDate);
                    switch (true) {
                        case sum === 0 :
                            timelineTooltip = "Today";
                            timelineColor = "option-blue";
                            break;
                        case sum < 1 :
                            timelineTooltip = -sum + " days overdue"
                            timelineColor = "option-red";
                            break;
                        case sum > 1 :
                            timelineTooltip = sum + " days left"
                            timelineColor = "option-orange";
                            break;
                    }
                }
                $button.removeClass('option-blue');
                $button.removeClass('option-red');
                $button.removeClass('option-orange');
                $button.removeClass('option-green');
                $button.addClass(timelineColor);
                $button.attr('title',timelineTooltip);
            });
        }).fail(function (data) {
            console.log(data)
        })
    })
});

$(function (){
    let win = $(window);

    // Each time the user scrolls

    win.scroll(function() {

        // End of the document reached?

        if ($(document).height() - win.height() === win.scrollTop()) {
            $.ajax({
                url: 'get-post.php',
                dataType: 'html',
            }).done(function(html) {
                $('#posts').append(html);
                $('#loading').hide();
            }).fail(function (data) {
                console.log(data)
            });
        }
    });
})