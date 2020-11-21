package com.scheduly.repository;

import com.scheduly.model.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {

    List<Project> findAllByUserUsernameOrderBySequence(String username);

    Project findFirstByUserUsernameOrderBySequenceDesc(String username);

    Project findBySequenceAndUserUsername(long sequence, String username);

    List<Project> findAllBySequenceGreaterThanAndUserUsername(long sequenceId, String username);

    @Query(value = "from Project p left join p.user u where u.username = :username and p.title like %:keyword%")
    List<Project> findAllProjectsByKeyword(@Param("keyword") String keyword, @Param("username") String username);

}