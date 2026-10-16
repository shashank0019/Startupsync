package com.startupsync.chat.websocket;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;
import org.springframework.context.event.EventListener;

import java.util.HashSet;
import java.util.Set;

@Component
@Slf4j
public class WebSocketEventListener {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    private final Set<String> connectedUsers = new HashSet<>();

    @EventListener
    public void handleWebSocketConnectListener(SessionConnectEvent event) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        String userId = headerAccessor.getUser() != null ? headerAccessor.getUser().getName() : null;

        if (userId != null) {
            connectedUsers.add(userId);
            log.info("User connected: {}", userId);

            // Broadcast user online status
            messagingTemplate.convertAndSend(
                    "/topic/user-status",
                    userId + " is online"
            );
        }
    }

    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        String userId = headerAccessor.getUser() != null ? headerAccessor.getUser().getName() : null;

        if (userId != null) {
            connectedUsers.remove(userId);
            log.info("User disconnected: {}", userId);

            // Broadcast user offline status
            messagingTemplate.convertAndSend(
                    "/topic/user-status",
                    userId + " is offline"
            );
        }
    }

    public boolean isUserOnline(String userId) {
        return connectedUsers.contains(userId);
    }

    public Set<String> getConnectedUsers() {
        return new HashSet<>(connectedUsers);
    }
}
