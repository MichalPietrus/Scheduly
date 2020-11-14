function datediff(first, second) {
    return Math.round((second - first) / (1000 * 60 * 60 * 24));
}

function showTableTasksElements(data, e) {
    let $tableBody = $('tbody');
    $.each(data, function (index) {
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

        /* Parses data and update timeline data,color and tooltip*/

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
        let totalNumberOfDays = datediff(fromDate, toDate);
        if (data[index].status === "Done") {
            timelineTooltip = "Done";
            timelineColor = "option-green";
        } else {
            let sum = datediff(today, toDate);
            switch (true) {
                case sum < -1 :
                    timelineTooltip = -sum + " days overdue"
                    timelineColor = "option-red";
                    break;
                case sum === -1 :
                    timelineTooltip = -sum + " day overdue"
                    timelineColor = "option-red";
                    break;
                case sum > 1 :
                    timelineTooltip = sum + " days left"
                    timelineColor = "option-orange";
                    break;
                case sum === 1 :
                    timelineTooltip = sum + " day left"
                    timelineColor = "option-orange";
                    break;
                default :
                    timelineTooltip = "Today";
                    timelineColor = "option-blue";
                    break;
            }
        }

        /* Creates row for each element from database */

        let row = `<tr class="table-row" id="${'item_' + (data[index].sequence)}">
                                <td class="task-title">${(data[index]).title}
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
                                <td>
                                      <button class="timeline-button btn btn-secondary ${(timelineColor)}" data-number-of-days="${(totalNumberOfDays)}"  data-toggle="tooltip" title="${(timelineTooltip)}"
                                      type="button" data-from-year="${fromDate.getFullYear()}" data-to-year="${toDate.getFullYear()}" data-from-date="${formattedFromDate}" data-to-date="${formattedToDate}">${((formattedFromDate) + " - " + (formattedToDate))}
                                      </button>
                                </td>
                           </tr>`

        /* If the element is added from add task give it to the start of the table */

        let $tableRow = $('#item_' + data[index].sequence);

        if(e.target.id === 'createTaskButton') {
            $tableBody.html(function () {
                return row + $(this).html();
            });
        } else if(e.target.id === 'edit-task-button'){
            $tableRow.html(function (){
               return row;
            });
            let content = $tableRow.contents();
            $tableRow.replaceWith(content);
        } else {
            $tableBody.html(function () {
                return $(this).html() + row;
            });
        }
    });
    $('[data-toggle="tooltip"]').tooltip({
        position: 'top',
    })

}

$(function() {
    $('tbody').on('click','.table-dropdown-menu button',function () {
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
});

$(function() {
    $('tbody').on('click','.default-button',function () {
        let $dropdownButton = $(this);
        let $dropdownToggle = $($dropdownButton).next().children('button');
        dropdownSelection($dropdownButton, $dropdownToggle);
    })
});

$(function () {

    /* On timeline hover show how many days the event last */

    let $tbody = $('tbody');

    $tbody.on('mouseenter','.timeline-button',function () {
        $(this).text($(this).data('numberOfDays') + ' days');
    })

    $tbody.on('mouseleave','.timeline-button',function () {
        $(this).text($(this).data('fromDate') + ' - ' + $(this).data('toDate'));
    })
});

/* On status change, changes timeline color and tooltip*/

$(function() {
    $('tbody').on('click','.status .table-dropdown-menu button',function () {
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
        $button.attr('title', timelineTooltip);
    })
});

/* On load, loads 15 tasks from database */

$(function () {

    $(window).on('load', function (e) {
        $.get({
            url: "/task/get-first-15",
            contentType: "application/json",
        }).done(function (data) {
            showTableTasksElements(data, e)
        }).fail(function (data) {
            console.log(data)
        })
    })
});

/* On scroll load next tasks */

$(function () {
    let win = $(window);

    // Each time the user scrolls

    win.scroll(function (e) {

        // End of the document reached?

        if ($(document).height() - win.height() === win.scrollTop()) {
            let lastRowSequence = $('tbody tr:last').attr('id').toString().split('_')[1];
            if (lastRowSequence > 1) {
                $.get({
                    url: '/task/get-on-scroll',
                    contentType: "application/json",
                    data: {
                        lastRowSequence: lastRowSequence
                    },
                }).done(function (data) {
                    let filteredData = [];
                    $.each(data,function (index) {
                        let condition = false;
                        let $tbody = $('tbody tr');
                        $tbody.each(function () {
                            if($('#item_' + data[index].sequence).length) {
                                condition = true;
                                return false;
                            }
                        })
                        if(!condition) {
                            filteredData.push(data[index]);
                        }
                    })
                    showTableTasksElements(filteredData,e);
                }).fail(function (data) {
                    console.log(data)
                });
            }
        }
    });
});

$(function () {

    /* Search Engine */

    let $search = $('#txtSearch');
    let $searchSubmitButton = $('#search-button');
    $search.on('keyup',searchEngine);
    $searchSubmitButton.on('click submit touchend',searchEngine);

    /* Searches for the element in database by title and also have the autocomplete feature */

    function searchEngine(e) {
        e.preventDefault();
        $.get({
            url: "/task/search",
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
            let value = $('#txtSearch').val().toLowerCase();
            let filteredArray = [];
            $.each(data,function (index) {
                let firstCondition = (data[index].title.toLowerCase().indexOf(value) > -1);
                let $tbody = $('tbody tr');
                let secondCondition = false;
                let thirdCondition = false;
                $tbody.each(function () {
                    let $taskTitle = $('#' + $(this).attr('id') + ' .task-title');
                    if($taskTitle.text().toLowerCase() !== data[index].title.toLowerCase()) {
                        secondCondition = true;
                        return false;
                    }
                })
                $tbody.each(function () {
                    if($('#item_' + data[index].sequence).length) {
                        thirdCondition = true;
                        return false;
                    }
                })
                if(firstCondition && secondCondition && !thirdCondition)
                   filteredArray.push(data[index])
            });
            showTableTasksElements(filteredArray,e);
            $("tbody tr").filter(function() {
                let $taskTitle = $('#' + $(this).attr('id') + ' .task-title');
                $(this).toggle(($taskTitle).text().toLowerCase().indexOf(value) > -1)
            });
            if(value === ''){
                $('tbody').html(function () {
                  return '';
                });
                $.get({
                    url: "/task/get-first-15",
                    contentType: "application/json",
                }).done(function (data) {
                    showTableTasksElements(data, e)
                }).fail(function (data) {
                    console.log(data)
                })
            }
        }).fail(function (data) {
            console.log(data)
        });
    }

})

$(function () {
    $('tbody').sortable({
        axis: 'y',
        update: function () {
            let data = $(this).sortable('serialize');
            let sequenceTable = [];
            let splitData = data.split('&');
            $.each(splitData,function (index) {
                sequenceTable.push(splitData[index].toString().split('=')[1])
            })
            console.log(sequenceTable)
            let Test = {
                sequenceTable : sequenceTable
            }
            $.ajax({
                url: 'task/save-sequence',
                method: 'POST',
                contentType: "application/json",
                data: JSON.stringify(Test)
            }).done(function (data) {
                console.log(data)
            }).fail(function (data){
                console.log(data)
            });
        }
    });
});