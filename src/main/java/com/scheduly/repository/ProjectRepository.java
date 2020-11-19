package com.scheduly.repository;

import com.scheduly.model.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {

    List<Project> findAllByUserUsernameOrderBySequence(String username);

    Project findFirstByUserUsernameOrderBySequenceDesc(String username);

    Project findBySequenceAndUserUsername(long sequence, String username);

}