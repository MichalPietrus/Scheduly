package com.scheduly.web.rest;

import com.scheduly.model.Task;
import com.scheduly.pojo.TaskCalendarFormat;
import com.scheduly.pojo.TaskPojo;
import com.scheduly.service.TaskService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/calendar")
public class CalendarRestController {

    private final TaskService taskService;

    public CalendarRestController(TaskService taskService) {
        this.taskService = taskService;
    }

    @GetMapping("/get-all-events")
    public List<TaskCalendarFormat> getAllEvents(Principal principal) {

        List<TaskCalendarFormat> tasksCalendarFormatList = new ArrayList<>();
        List<Task> tasksFromDatabase = taskService.findAllByUserUsername(principal.getName());

        for (Task task : tasksFromDatabase) {
            TaskCalendarFormat taskCalendarFormat = new TaskCalendarFormat();
            taskCalendarFormat.setId(task.getId());
            taskCalendarFormat.setTitle(task.getTitle());
            taskCalendarFormat.setStart(task.getFromDate().toString());
            taskCalendarFormat.setEnd(task.getToDate().toString());
            switch (task.getPriority()) {
                case LOW:
                    taskCalendarFormat.setColor("rgb(255, 90, 196)");
                    break;
                case MEDIUM:
                    taskCalendarFormat.setColor("rgb(87,155,252)");
                    break;
                case HIGH:
                    taskCalendarFormat.setColor("rgb(120,75,209)");
                    break;
            }
            tasksCalendarFormatList.add(taskCalendarFormat);
        }

        return tasksCalendarFormatList;
    }

    @GetMapping("/get-task-by-id")
    public Task getTaskById(@RequestParam long elementId) {
        return taskService.findTaskById(elementId);
    }

    @DeleteMapping("/delete-task")
    @ResponseStatus(HttpStatus.OK)
    public void deleteTaskById(@RequestParam long elementId, Principal principal) {
        long tableRowId = taskService.findTaskById(elementId).getSequence();
        taskService.removeById(elementId);
        taskService.updateSequenceAfterDelete(tableRowId, principal.getName());
    }

    @PatchMapping("/edit")
    public Task editTask(@RequestBody TaskPojo taskPojo) {
        Task taskFromDatabase = taskService.findTaskById(taskPojo.getId());
        taskFromDatabase.setTitle(taskPojo.getTitle());
        taskFromDatabase.setDescription(taskPojo.getDescription());
        taskFromDatabase.setFromDate(taskPojo.getFromDate());
        taskFromDatabase.setToDate(taskPojo.getToDate());
        taskService.setStatus(taskPojo.getStatus(), taskFromDatabase);
        taskService.setPriority(taskPojo.getPriority(), taskFromDatabase);
        return taskService.saveTask(taskFromDatabase);
    }

    @PatchMapping("/save-position-on-drop")
    public Task savePositionOnDrop(@RequestBody TaskPojo taskPojo) {
        Task taskFromDatabase = taskService.findTaskById(taskPojo.getId());
        taskFromDatabase.setFromDate(taskPojo.getFromDate());
        taskFromDatabase.setToDate(taskPojo.getToDate());
        return taskService.saveTask(taskFromDatabase);
    }


}
