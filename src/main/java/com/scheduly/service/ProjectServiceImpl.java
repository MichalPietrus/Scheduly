package com.scheduly.service;

import com.scheduly.model.Project;
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

    @Override
    public void removeProject(Project project) {
        projectRepository.delete(project);
    }

    @Override
    public void updateSequenceAfterDelete(long sequenceId, String username) {
        List<Project> projects = projectRepository.findAllBySequenceGreaterThanAndUserUsername(sequenceId,username);
        for(Project project: projects) {
            project.setSequence(project.getSequence() - 1);
        }
        projectRepository.saveAll(projects);
    }


}
