package com.scheduly.web.rest;

import com.scheduly.enums.Priority;
import com.scheduly.enums.Status;
import com.scheduly.model.Project;
import com.scheduly.model.ProjectTask;
import com.scheduly.model.User;
import com.scheduly.pojo.ProjectPojo;
import com.scheduly.service.ProjectService;
import com.scheduly.service.ProjectTaskService;
import com.scheduly.service.UserService;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@RestController
@RequestMapping("/projects")
public class ProjectController {

    private final ProjectService projectService;

    private final UserService userService;

    private final ProjectTaskService projectTaskService;

    public ProjectController(ProjectService projectService, UserService userService, ProjectTaskService projectTaskService) {
        this.projectService = projectService;
        this.userService = userService;
        this.projectTaskService = projectTaskService;
    }

    @GetMapping("/get-all-projects")
    public List<Project> getAllProjects(Principal principal) {
        return projectService.findAllByOrderBySequence(principal.getName());
    }

    @PostMapping("/create-project")
    public List<Project> createProject(Principal principal) {
        Project project = new Project();
        Project highestSequenceProject = projectService.findFirstByUserUsernameOrderBySequenceDesc(principal.getName());
        User user = userService.findByUsername(principal.getName());
        user.addProject(project);
        project.setProjectTasks(new ArrayList<>());
        project.setTitle("Project Title");
        if (highestSequenceProject != null) {
            long highestSequence = highestSequenceProject.getSequence();
            project.setSequence(highestSequence + 1);
        } else
            project.setSequence(1);
        projectService.saveProject(project);
        List<Project> list = new ArrayList<>();
        list.add(project);
        return list;
    }

    @PostMapping("/add-task")
    public List<ProjectTask> createProjectTask(@RequestBody ProjectPojo projectPojo, Principal principal) {
        Project project = projectService.findBySequenceAndUserUsername(projectPojo.getTableId(), principal.getName());
        ProjectTask projectTask = new ProjectTask();
        long highestSequence;
        try {
            highestSequence = project.getProjectTasks()
                    .stream()
                    .max(Comparator.comparing(ProjectTask::getSequence))
                    .get()
                    .getSequence() + 1;
        } catch (Exception e) {
            highestSequence = 1;
        }
        projectTask.setSequence(highestSequence);
        projectTask.setTitle(projectPojo.getTaskTitle());
        projectTask.setPriority(Priority.LOW);
        projectTask.setStatus(Status.IN_PROGRESS);
        project.addProjectTask(projectTask);
        projectTaskService.saveProjectTask(projectTask);
        List<ProjectTask> list = new ArrayList<>();
        list.add(projectTask);
        return list;
    }

    @PatchMapping("/edit-task-title")
    public ProjectTask editTaskTitle(@RequestBody ProjectPojo projectPojo, Principal principal) {
        Project project = projectService.findBySequenceAndUserUsername(projectPojo.getTableId(), principal.getName());
        ProjectTask projectTask = project.getProjectTasks()
                .stream()
                .filter(projectTask2 -> projectTask2.getSequence() == projectPojo.getTableRowId())
                .findAny()
                .get();
        projectTask.setTitle(projectPojo.getTaskTitle());
        return projectTaskService.saveProjectTask(projectTask);
    }

    @PatchMapping("/edit-project-title")
    public Project editProjectTitle(@RequestBody ProjectPojo projectPojo, Principal principal) {
        Project project = projectService.findBySequenceAndUserUsername(projectPojo.getTableId(), principal.getName());
        project.setTitle(projectPojo.getProjectTitle());
        return projectService.saveProject(project);
    }

    /* Updates the dropdown and also sends back data for footer update */

    @PatchMapping("/updated-project-task-dropdown-selected-data")
    public long[] editStatusOrPriority(@RequestBody ProjectPojo projectPojo, Principal principal) {
        Project project = projectService.findBySequenceAndUserUsername(projectPojo.getTableId(), principal.getName());
        String selectedOption = projectPojo.getChoosedOption();
        ProjectTask projectTask = project.getProjectTasks()
                .stream()
                .filter(projectTask2 -> projectTask2.getSequence() == projectPojo.getTableRowId())
                .findAny()
                .get();
        if (selectedOption.equals("LOW") || selectedOption.equals("MEDIUM") || selectedOption.equals("HIGH"))
            projectTaskService.setProjectTaskPriority(selectedOption, projectTask);
        else
            projectTaskService.setProjectTaskStatus(selectedOption, projectTask);
        projectTaskService.saveProjectTask(projectTask);
        long LowCounter = 0, MediumCounter = 0, HighCounter = 0, DoneCounter = 0, InProgressCounter = 0, StuckCounter = 0;
        for (ProjectTask task : project.getProjectTasks()) {
            switch (task.getPriority()) {
                case LOW:
                    LowCounter++;
                    break;
                case MEDIUM:
                    MediumCounter++;
                    break;
                case HIGH:
                    HighCounter++;
                    break;
            }
            switch (task.getStatus()) {
                case DONE:
                    DoneCounter++;
                    break;
                case IN_PROGRESS:
                    InProgressCounter++;
                    break;
                case STUCK:
                    StuckCounter++;
                    break;
            }
        }
        return new long[]{LowCounter, MediumCounter, HighCounter, DoneCounter, InProgressCounter, StuckCounter, project.getSequence()};
    }

    @PatchMapping("/update-project-task-date")
    public ProjectTask updateProjectTaskDate(@RequestBody ProjectPojo projectPojo, Principal principal) {
        Project project = projectService.findBySequenceAndUserUsername(projectPojo.getTableId(), principal.getName());
        ProjectTask projectTask = project.getProjectTasks()
                .stream()
                .filter(projectTask2 -> projectTask2.getSequence() == projectPojo.getTableRowId())
                .findAny()
                .get();
        projectTask.setDate(projectPojo.getDate());
        return projectTaskService.saveProjectTask(projectTask);
    }

    @PatchMapping("/edit-project-task-estimated-time")
    public Integer editProjectTaskEstimatedTime(@RequestBody ProjectPojo projectPojo, Principal principal) {
        Project project = projectService.findBySequenceAndUserUsername(projectPojo.getTableId(), principal.getName());
        ProjectTask projectTask = project.getProjectTasks()
                .stream()
                .filter(projectTask2 -> projectTask2.getSequence() == projectPojo.getTableRowId())
                .findAny()
                .get();
        projectTask.setEstimatedTime(projectPojo.getEstimatedTime());
        projectTaskService.saveProjectTask(projectTask);
        return project.getProjectTasks()
                .stream()
                .filter(projectTask1 -> projectTask1.getSequence() != projectPojo.getTableRowId())
                .mapToInt(ProjectTask::getEstimatedTime)
                .sum() + projectTask.getEstimatedTime();
    }

    @DeleteMapping("/delete-project")
    public void deleteProject(@RequestBody ProjectPojo projectPojo, Principal principal) {
        Project project = projectService.findBySequenceAndUserUsername(projectPojo.getTableId(), principal.getName());
        projectService.removeProject(project);
        projectService.updateSequenceAfterDelete(projectPojo.getTableId(), principal.getName());
    }

    @DeleteMapping("/delete-project-task")
    public void deleteProjectTask(@RequestBody ProjectPojo projectPojo, Principal principal) {
        Project project = projectService.findBySequenceAndUserUsername(projectPojo.getTableId(), principal.getName());
        ProjectTask projectTask = project.getProjectTasks()
                .stream()
                .filter(projectTask2 -> projectTask2.getSequence() == projectPojo.getTableRowId())
                .findAny()
                .get();
        project.getProjectTasks().remove(projectTask);
        projectTaskService.removeProjectTaskById(projectTask.getId());
        projectTaskService.updateSequenceAfterDelete(projectTask.getSequence(), project.getId());
    }

}
