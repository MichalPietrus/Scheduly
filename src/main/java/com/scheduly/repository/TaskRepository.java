package com.scheduly.repository;

import com.scheduly.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {

    Optional<Task> findById(Long id);

    Task findFirstByOrderBySequenceDesc();

    Task findBySequence(long sequenceId);

}
