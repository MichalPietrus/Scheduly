package com.scheduly.service;

import com.scheduly.model.Task;

import java.util.List;

public interface TaskService {

    List<Task> findAllByUserUsername(String username);

    Task findTaskById(Long id);

    Task saveTask(Task task);

    Task findTaskByHighestSequence(String username);

    void setPriority(String priority, Task taskModel);

    void setStatus(String status, Task taskModel);

    Task findBySequence(long sequenceId,String username);

    List<Task> findTop15ByUserUsernameOrderBySequenceDesc(String username);

    List<Task> findFirstLowerElementThan(long sequenceId,String username);

    void removeBySequence(long id,String username);

    void updateSequenceAfterDelete(long sequenceId,String username);

    List<Task> findAllTasksByKeyword(String keyword, String username);

    void removeById(long id);


}
