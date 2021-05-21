package com.f0rgiv.lethani.controllers;

import org.springframework.web.bind.annotation.GetMapping;

public class ClassController {
    @GetMapping("/class")
    public String GetClasses() {
        return null;
    }

    @GetMapping("/class/{id}")
    public String GetClass() {
        return null;
    }
}
