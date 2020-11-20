package com.scheduly.repository;

import com.scheduly.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {

    Optional<Task> findById(Long id);

    List<Task> findAllByUserUsername(String username);

    Task findFirstByUserUsernameOrderBySequenceDesc(String username);

    List<Task> findTop15ByUserUsernameOrderBySequenceDesc(String username);

    Task findBySequenceAndUserUsername(long sequenceId, String username);

    @Query(value = "from Task t left join t.user u where u.username = :username and t.sequence <= :sequenceId and t.sequence >= :sequenceId-3 order by t.sequence desc")
    List<Task> findFirstLowerElementThan(@Param("sequenceId") long sequenceId, @Param("username") String username);

    List<Task> findAllBySequenceGreaterThanAndUserUsername(long sequenceId, String username);

    @Query(value = "from Task t left join t.user u where u.username = :username and t.title like %:keyword%")
    List<Task> findAllTasksByKeyword(@Param("keyword") String keyword, @Param("username") String username);

}
