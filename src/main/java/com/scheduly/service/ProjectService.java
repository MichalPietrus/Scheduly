package com.scheduly.service;

import com.scheduly.model.Project;

import java.util.List;

public interface ProjectService {

    List<Project> findAllByOrderBySequence(String username);

    Project saveProject(Project project);

    Project findFirstByUserUsernameOrderBySequenceDesc(String username);

    Project findProjectById(long id);

    Project findBySequenceAndUserUsername(long sequence, String username);

    void removeProject(Project project);

    void updateSequenceAfterDelete(long sequenceId, String username);

}
