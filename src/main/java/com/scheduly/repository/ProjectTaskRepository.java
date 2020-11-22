package com.scheduly.repository;

import com.scheduly.model.ProjectTask;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectTaskRepository extends JpaRepository<ProjectTask, Long> {

    List<ProjectTask> findAllBySequenceGreaterThanAndProjectId(long sequenceId, long projectId);


}
