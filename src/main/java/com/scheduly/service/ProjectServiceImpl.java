package com.scheduly.service;

import com.scheduly.enums.Priority;
import com.scheduly.enums.Status;
import com.scheduly.model.Project;
import com.scheduly.model.ProjectTask;
import com.scheduly.model.Task;
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
    public List<Project> findAllByOrderBySequence(String username) {
        return projectRepository.findAllByUserUsernameOrderBySequence(username);
    }

    @Override
    public Project saveProject(Project project) {
        return projectRepository.save(project);
    }

    @Override
    public Project findFirstByUserUsernameOrderBySequenceDesc(String username) {
        return projectRepository.findFirstByUserUsernameOrderBySequenceDesc(username);
    }

    @Override
    public Project findProjectById(long id) {
        return projectRepository.findById(id).get();
    }

    @Override
    public Project findBySequenceAndUserUsername(long sequence, String username) {
        return projectRepository.findBySequenceAndUserUsername(sequence, username);
    }


}
