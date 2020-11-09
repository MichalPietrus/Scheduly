package com.scheduly.service;

import com.scheduly.enums.Priority;
import com.scheduly.enums.Status;
import com.scheduly.model.Task;
import com.scheduly.pojo.TaskPojo;
import com.scheduly.repository.TaskRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TaskServiceImpl implements TaskService {

    private final TaskRepository taskRepository;

    public TaskServiceImpl(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    @Override
    public List<Task> findAllTasks() {
        return taskRepository.findAll();
    }

    @Override
    public Task findTaskById(Long id) {
        return taskRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Invalid task Id: " + id));
    }

    @Override
    public Task saveTask(Task task) {
        return taskRepository.save(task);
    }

    @Override
    public Task findTaskByHighestSequence() {
        return taskRepository.findFirstByOrderBySequenceDesc();
    }

    @Override
    public void setPriority(String priority, Task taskModel) {
        switch (priority){
            case "LOW" : taskModel.setPriority(Priority.LOW);break;
            case "MEDIUM" : taskModel.setPriority(Priority.MEDIUM);break;
            case "HIGH" : taskModel.setPriority(Priority.HIGH);break;
        }
    }

    @Override
    public void setStatus(String status, Task taskModel) {
        switch (status) {
            case "IN PROGRESS": taskModel.setStatus(Status.IN_PROGRESS);break;
            case "DONE": taskModel.setStatus(Status.DONE);break;
            case "STUCK": taskModel.setStatus(Status.STUCK);break;
        }
    }

    @Override
    public Task findBySequence(long sequenceId){
        return taskRepository.findBySequence(sequenceId);
    }


}