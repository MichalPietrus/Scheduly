package com.scheduly.web;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/settings")
public class SettingsController {

    /* Future Feature */

    @GetMapping
    public String showSettingsForm() {
        return "settings-page";
    }

}
