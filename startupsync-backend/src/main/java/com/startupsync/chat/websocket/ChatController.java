package com.startupsync.chat.websocket;

import com.startupsync.chat.dto.ChatMessageRequest;
import com.startupsync.chat.dto.MessageDTO;
import com.startupsync.chat.service.ChatService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.security.Principal;

@Controller
@Slf4j
@CrossOrigin
public class ChatController {

    @Autowired
    private ChatService chatService;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/chat/{chatRoomId}/send")
    public void sendMessage(
            @DestinationVariable String chatRoomId,
            @Payload ChatMessageRequest request,
            StompHeaderAccessor headerAccessor,
            Principal principal) {

        log.info("Received message for room: {} from user: {}", chatRoomId, principal.getName());

        try {
            MessageDTO messageDTO = chatService.sendMessage(chatRoomId, principal.getName(), request.getContent());

            // Broadcast message to all subscribers of this chat room
            messagingTemplate.convertAndSend(
                    "/topic/chat/" + chatRoomId,
                    messageDTO
            );

            log.info("Message broadcast successfully: {}", messageDTO.getId());
        } catch (Exception e) {
            log.error("Error sending message: {}", e.getMessage());
            messagingTemplate.convertAndSendToUser(
                    principal.getName(),
                    "/queue/errors",
                    "Error: " + e.getMessage()
            );
        }
    }

    @MessageMapping("/chat/{chatRoomId}/typing")
    public void userTyping(
            @DestinationVariable String chatRoomId,
            @Payload String userName,
            Principal principal) {

        log.debug("User {} is typing in room: {}", principal.getName(), chatRoomId);

        // Broadcast typing indicator
        messagingTemplate.convertAndSend(
                "/topic/chat/" + chatRoomId + "/typing",
                principal.getName()
        );
    }

    @MessageMapping("/chat/one-to-one")
    public void getOrCreateOneToOneChat(
            @Payload String otherUserId,
            Principal principal) {

        log.info("Creating one-to-one chat between: {} and {}", principal.getName(), otherUserId);

        try {
            String chatRoomId = chatService.getOrCreateOneToOneChatRoom(principal.getName(), otherUserId);

            messagingTemplate.convertAndSendToUser(
                    principal.getName(),
                    "/queue/chat-room",
                    chatRoomId
            );

            log.info("One-to-one chat room created: {}", chatRoomId);
        } catch (Exception e) {
            log.error("Error creating one-to-one chat: {}", e.getMessage());
            messagingTemplate.convertAndSendToUser(
                    principal.getName(),
                    "/queue/errors",
                    "Error: " + e.getMessage()
            );
        }
    }
}
