package com.scheduly.web;

import com.scheduly.model.User;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/")
public class WelcomePageController {

    @ModelAttribute("user")
    public User userRegistrationModel() {
        return new User();
    }

    @GetMapping
    public String showWelcomePageForm() {
        return "welcome-page";
    }

}
