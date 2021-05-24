package com.f0rgiv.lethani.controllers;

import com.f0rgiv.lethani.models.Message;
import com.f0rgiv.lethani.models.UserTexts;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.util.HtmlUtils;

@Controller
public class MessagingController {
    @MessageMapping("/userTexts")
    @SendTo("/game/messages")
    public UserTexts userTexts(Message message) {
        return new UserTexts(HtmlUtils.htmlEscape(message.getMessage()));
    }
}
