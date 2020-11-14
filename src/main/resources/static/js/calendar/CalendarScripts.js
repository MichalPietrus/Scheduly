$(document).ready(function () {

    // $.get({
    //     url: '/calendar/get-all-events',
    //     contentType: 'application/json'
    // }).done(function (){
    //
    // }).fail(function (){
    //     console.log(data)
    // })

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
        eventSources: [
            {
                url: '/calendar/get-all-events',
            },
        ],
        eventClick: function (info) {
            let elementId = info.event.id;
            console.log(info)
            fillEditContainerWithData(elementId)

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





})


