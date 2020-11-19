package com.scheduly.service;

import com.scheduly.enums.Priority;
import com.scheduly.enums.Status;
import com.scheduly.model.Task;
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
    public List<Task> findAllByUserUsername(String username) {
        return taskRepository.findAllByUserUsername(username);
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
    public Task findTaskByHighestSequence(String username) {
        return taskRepository.findFirstByUserUsernameOrderBySequenceDesc(username);
    }

    @Override
    public void setPriority(String priority, Task taskModel) {
        switch (priority) {
            case "LOW":
                taskModel.setPriority(Priority.LOW);
                break;
            case "MEDIUM":
                taskModel.setPriority(Priority.MEDIUM);
                break;
            case "HIGH":
                taskModel.setPriority(Priority.HIGH);
                break;
        }
    }

    @Override
    public void setStatus(String status, Task taskModel) {
        switch (status) {
            case "IN PROGRESS":
                taskModel.setStatus(Status.IN_PROGRESS);
                break;
            case "DONE":
                taskModel.setStatus(Status.DONE);
                break;
            case "STUCK":
                taskModel.setStatus(Status.STUCK);
                break;
        }
    }

    @Override
    public Task findBySequence(long sequenceId,String username) {
        return taskRepository.findBySequenceAndUserUsername(sequenceId,username);
    }

    @Override
    public List<Task> findTop15ByUserUsernameOrderBySequenceDesc(String username) {
        return taskRepository.findTop15ByUserUsernameOrderBySequenceDesc(username);
    }

    @Override
    public List<Task> findFirstLowerElementThan(long sequenceId, String username) {
        sequenceId = sequenceId - 1;
        return taskRepository.findFirstLowerElementThan(sequenceId,username);
    }

    @Override
    public void removeBySequence(long id,String username) {
        taskRepository.delete(taskRepository.findBySequenceAndUserUsername(id,username));
    }

    @Override
    public void updateSequenceAfterDelete(long sequenceId,String username) {
        taskRepository.updateSequenceAfterDelete(sequenceId,username);
    }

    @Override
    public List<Task> findAllTasksByKeyword(String keyword, String username) {
        return taskRepository.findAllTasksByKeyword(keyword, username);
    }

    @Override
    public void removeById(long id) {
        taskRepository.deleteById(id);
    }


}
