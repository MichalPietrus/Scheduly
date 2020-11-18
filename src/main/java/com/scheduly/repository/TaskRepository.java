package com.scheduly.repository;

import com.scheduly.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;
import java.util.List;
import java.util.Optional;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {

    Optional<Task> findById(Long id);

    Task findFirstByOrderBySequenceDesc();

    List<Task> findTop15ByOrderBySequenceDesc();

    Task findBySequence(long sequenceId);

    @Query(value = "from Task t where t.sequence <= :sequenceId and t.sequence >= :sequenceId-3 order by t.sequence desc")
    List<Task> findFirstLowerElementThan(@Param("sequenceId") long sequenceId);

    @Modifying(flushAutomatically = true, clearAutomatically = true)
    @Transactional
    @Query(value = "update Task t set t.sequence = CASE when t.sequence > :sequenceId then (t.sequence - 1) else t.sequence end")
    void updateSequenceAfterDelete(@Param("sequenceId") long sequenceId);

    @Query(value = "from Task t where t.title like %:keyword%")
    List<Task> findAllTasksByKeyword(@Param("keyword") String keyword);

}
