package com.scheduly.web;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/projects")
public class ProjectsController {


    @GetMapping
    public String showProjectsFrom() {
        return "projects-page";
    }


}
