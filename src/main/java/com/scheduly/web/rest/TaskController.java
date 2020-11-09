package com.scheduly.web.rest;

import com.scheduly.model.Task;
import com.scheduly.model.User;
import com.scheduly.pojo.DropdownSelectedData;
import com.scheduly.pojo.TaskPojo;
import com.scheduly.service.TaskService;
import com.scheduly.service.UserService;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/task")
public class TaskController {

    private final TaskService taskService;

    private final UserService userService;

    public TaskController(TaskService taskService, UserService userService) {
        this.taskService = taskService;
        this.userService = userService;
    }

    @PostMapping("/save")
    public Task saveTask(@RequestBody TaskPojo task, Principal principal) {
        User user = userService.findByUsername(principal.getName());
        Task taskModel = new Task();
        taskModel.setTitle(task.getTitle());
        taskModel.setDescription(task.getDescription());
        String priority = task.getPriority();
        String status = task.getStatus();
        taskService.setStatus(status, taskModel);
        taskService.setPriority(priority, taskModel);
        taskModel.setFromDate(task.getFromDate());
        taskModel.setToDate(task.getToDate());
        taskModel.setUser(user);
        Task highestSequenceTask = taskService.findTaskByHighestSequence();
        if(highestSequenceTask != null)
            taskModel.setSequence(taskService.findTaskByHighestSequence().getSequence() + 1);
        else
            taskModel.setSequence(1);
        return taskService.saveTask(taskModel);
    }

    @PatchMapping("/update-dropdown-selected-data")
    public Task updateDropdown(@RequestBody TaskPojo dropdownSelectedData) {
        String selectedOption = dropdownSelectedData.getChoosedOption().toUpperCase();
        long tableRowId = dropdownSelectedData.getSequence();
        Task taskToUpdate = taskService.findBySequence(tableRowId);

        if(selectedOption.equals("LOW") || selectedOption.equals("MEDIUM") || selectedOption.equals("HIGH"))
            taskService.setPriority(selectedOption,taskToUpdate);
        else
            taskService.setStatus(selectedOption,taskToUpdate);

        return taskService.saveTask(taskToUpdate);
    }

    @GetMapping("/get-all")
    public List<Task> findAllTasks() {
        return taskService.findAllTasks();
    }

}


