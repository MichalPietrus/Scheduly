package com.scheduly.web;

import com.scheduly.model.User;
import com.scheduly.service.UserService;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.handler.SimpleMappingExceptionResolver;

import javax.validation.Valid;

@Controller
@RequestMapping("/registration")
public class RegistrationController {

    private final UserService userService;

    public RegistrationController(UserService userService) {
        this.userService = userService;
    }


    @PostMapping
    public String registerUserAccount(@ModelAttribute("user") @Valid User user,
                                      BindingResult result) {
        User existingByUserNameOrEmail = userService.findByUsernameOrEmail(user.getUsername(), user.getEmail());
        if (existingByUserNameOrEmail != null)
            result.rejectValue("username", null, "There is already an account registered with that username or email");

        if (result.hasErrors())
            return "welcome-page";
        userService.registerUser(user);
        return "redirect:/?success";
    }
}
