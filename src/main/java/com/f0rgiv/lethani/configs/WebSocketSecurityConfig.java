package com.f0rgiv.lethani.configs;


import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.messaging.MessageSecurityMetadataSourceRegistry;
import org.springframework.security.config.annotation.web.socket.AbstractSecurityWebSocketMessageBrokerConfigurer;

//@Configuration
public class WebSocketSecurityConfig extends AbstractSecurityWebSocketMessageBrokerConfigurer {

    @Override
    protected boolean sameOriginDisabled() {
        return true;
    }

    @Override
    protected void configureInbound(MessageSecurityMetadataSourceRegistry messages) {
        System.out.println("configure websocket");
        messages
                .nullDestMatcher().authenticated()
                .simpDestMatchers("/**").permitAll()
                .simpSubscribeDestMatchers("/**").permitAll()
                .anyMessage().permitAll();
    }
}
