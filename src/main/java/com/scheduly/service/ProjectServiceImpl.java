package com.scheduly.service;

import com.scheduly.model.Project;
import com.scheduly.repository.ProjectRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProjectServiceImpl implements ProjectService {

    private final ProjectRepository projectRepository;

    public ProjectServiceImpl(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }


    @Override
    public List<Project> findAllByOrderBySequenceDesc() {
        return projectRepository.findAllByOrderBySequenceDesc();
    }

    @Override
    public Project createProject(Project project) {
        return projectRepository.save(project);
    }
}
