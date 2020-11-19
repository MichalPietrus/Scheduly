package com.scheduly.web.rest;

import com.scheduly.model.Task;
import com.scheduly.model.User;
import com.scheduly.pojo.SequenceTablePojo;
import com.scheduly.pojo.TaskPojo;
import com.scheduly.service.TaskService;
import com.scheduly.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

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
    public List<Task> saveTask(@RequestBody TaskPojo task, Principal principal) {
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
        Task highestSequenceTask = taskService.findTaskByHighestSequence(principal.getName());
        if (highestSequenceTask != null)
            taskModel.setSequence(taskService.findTaskByHighestSequence(principal.getName()).getSequence() + 1);
        else
            taskModel.setSequence(1);
        taskService.saveTask(taskModel);
        List<Task> list = new ArrayList<>();
        list.add(taskModel);
        return list;
    }

    @PatchMapping("/update-dropdown-selected-data")
    public Task updateDropdown(@RequestBody TaskPojo dropdownSelectedData,Principal principal) {
        String selectedOption = dropdownSelectedData.getChoosedOption().toUpperCase();
        long tableRowId = dropdownSelectedData.getSequence();
        Task taskToUpdate = taskService.findBySequence(tableRowId, principal.getName());

        if (selectedOption.equals("LOW") || selectedOption.equals("MEDIUM") || selectedOption.equals("HIGH"))
            taskService.setPriority(selectedOption, taskToUpdate);
        else
            taskService.setStatus(selectedOption, taskToUpdate);

        return taskService.saveTask(taskToUpdate);
    }

    @GetMapping("/get-first-15")
    public List<Task> findFirst15Tasks(Principal principal) {
        return taskService.findTop15ByUserUsernameOrderBySequenceDesc(principal.getName());
    }

    @GetMapping("/get-on-scroll")
    public List<Task> findTasksOnScroll(@RequestParam String lastRowSequence,Principal principal) {
        return taskService.findFirstLowerElementThan(Long.parseLong(lastRowSequence), principal.getName());
    }

    @GetMapping("/get-task-by-sequence")
    public Task findTaskById(@RequestParam String tableRowId,Principal principal) {
        return taskService.findBySequence(Long.parseLong(tableRowId), principal.getName());
    }

    @DeleteMapping("/delete-task")
    @ResponseStatus(HttpStatus.OK)
    public void deleteTaskBySequence(@RequestParam String tableRowId,Principal principal) {
        taskService.removeBySequence(Long.parseLong(tableRowId),principal.getName());
        taskService.updateSequenceAfterDelete(Long.parseLong(tableRowId),principal.getName());
    }

    @PatchMapping("/edit")
    public List<Task> editTask(@RequestBody TaskPojo task,Principal principal) {
        Task taskFromDatabase = taskService.findBySequence(task.getSequence(),principal.getName());
        taskFromDatabase.setTitle(task.getTitle());
        taskFromDatabase.setFromDate(task.getFromDate());
        taskFromDatabase.setToDate(task.getToDate());
        taskService.setPriority(task.getPriority(), taskFromDatabase);
        taskService.setStatus(task.getStatus(), taskFromDatabase);
        taskFromDatabase.setDescription(task.getDescription());
        taskService.saveTask(taskFromDatabase);
        List<Task> list = new ArrayList<>();
        list.add(taskFromDatabase);
        return list;
    }

    @GetMapping("/search")
    public List<Task> findTaskByKeyword(@RequestParam String keyword, Principal principal) {
        return taskService.findAllTasksByKeyword(keyword, principal.getName());
    }

    @PostMapping("/save-sequence")
    public List<Task> saveTasksSequenceAfterDropdown(@RequestBody SequenceTablePojo test,Principal principal) {
        List<Long> sequenceTable = Arrays.stream(test.getSequenceTable()).map(Long::parseLong).collect(Collectors.toList());
        List<Task> tasksList = new ArrayList<>();
        List<Long> sortedTable = new ArrayList<>(sequenceTable);
        for (Long item : sequenceTable) {
            tasksList.add(taskService.findBySequence(item, principal.getName()));
        }
        sortedTable.sort(Collections.reverseOrder());
        for (int i = 0; i < tasksList.size(); i++) {
            tasksList.get(i).setSequence(sortedTable.get(i));
            taskService.saveTask(tasksList.get(i));
        }
        return tasksList;
    }


}


