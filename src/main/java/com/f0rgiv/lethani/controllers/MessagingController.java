package com.f0rgiv.lethani.controllers;

import com.f0rgiv.lethani.models.Message;
import com.f0rgiv.lethani.models.UserTexts;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.util.HtmlUtils;

import java.security.Principal;

@Controller
public class MessagingController {
    @MessageMapping("/userTexts")
    @SendTo("/game/messages")
    public UserTexts userTexts(Principal principal, Message message) throws Exception {

        System.out.println(message.getMessage());
        if(message.getMessage().contains("[SERVER]")) {
            return new UserTexts(HtmlUtils.htmlEscape(message.getMessage()));
        }
        String userTag = principal.getName();
        String returnText = String.format("%s:   %s", userTag, message.getMessage());
        return new UserTexts(HtmlUtils.htmlEscape(returnText));
    }
}
