package com.f0rgiv.lethani.controllers;

import org.springframework.web.bind.annotation.GetMapping;

public class MobController {
    @GetMapping("/mob")
    public String GetClasses() {
        return null;
    }

    @GetMapping("/mob/{id}")
    public String GetClass() {
        return null;
    }
}
