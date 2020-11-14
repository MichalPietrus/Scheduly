package com.scheduly.web.rest;

import com.scheduly.model.Task;
import com.scheduly.pojo.TaskCalendarFormat;
import com.scheduly.service.TaskService;
import com.scheduly.service.UserService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/calendar")
public class CalendarRestController {

    private final TaskService taskService;

    private final UserService userService;

    public CalendarRestController(TaskService taskService, UserService userService) {
        this.taskService = taskService;
        this.userService = userService;
    }

    @GetMapping("/get-all-events")
    public List<TaskCalendarFormat> getAllEvents() {

        List<TaskCalendarFormat> tasksCalendarFormatList = new ArrayList<>();
        List<Task> tasksFromDatabase = taskService.findAllTasks();

        for (Task task:tasksFromDatabase) {
            TaskCalendarFormat taskCalendarFormat = new TaskCalendarFormat();
            taskCalendarFormat.setId(task.getId());
            taskCalendarFormat.setTitle(task.getTitle());
            taskCalendarFormat.setStart(task.getFromDate().toString());
            taskCalendarFormat.setEnd(task.getToDate().toString());
            tasksCalendarFormatList.add(taskCalendarFormat);
        }

        return tasksCalendarFormatList;
    }


}
