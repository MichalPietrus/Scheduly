package com.scheduly.service;

import com.scheduly.model.Project;

import java.util.List;

public interface ProjectService {

    List<Project> findAllByOrderBySequenceDesc();

    Project createProject(Project project);

}
