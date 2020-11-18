package com.scheduly.web.rest;

import com.scheduly.model.Project;
import com.scheduly.service.ProjectService;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;

@Controller
@RequestMapping("/project")
public class ProjectController {

    private final ProjectService projectService;

    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    @GetMapping("/get-all-projects")
    public List<Project> getAllProjects() {
        return projectService.findAllByOrderBySequenceDesc();
    }

    @PostMapping("/create-project")
    public Project createProject(Project project) {
        return projectService.createProject(project);
    }

}
