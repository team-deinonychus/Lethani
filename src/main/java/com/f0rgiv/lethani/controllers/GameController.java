package com.f0rgiv.lethani.controllers;

import com.f0rgiv.lethani.models.Message;
import com.f0rgiv.lethani.models.UserTexts;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.util.HtmlUtils;

import java.security.Principal;

@Controller
public class GameController {
    @MessageMapping("/gameLogic/1")
    @SendTo("/game/zone/1")
    public UserTexts userTexts(Principal principal, Message message) throws Exception {
        String userTag = principal.getName();
        String returnText = String.format("%s: %s", userTag, message.getMessage());
        return new UserTexts(HtmlUtils.htmlEscape(returnText));
    }
}