package com.startupsync.chat.controller;

import com.startupsync.chat.dto.ChatRoomDTO;
import com.startupsync.chat.dto.MessageDTO;
import com.startupsync.chat.service.ChatService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/chat")
public class ChatRestController {

    private static final Logger log = LoggerFactory.getLogger(ChatRestController.class);

    @Autowired
    private ChatService chatService;

    @GetMapping("/rooms")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<ChatRoomDTO>> getUserChatRooms(Authentication authentication) {

        log.info("Get user chat rooms endpoint called for user: {}", authentication.getName());

        String userId = authentication.getName();
        List<ChatRoomDTO> chatRooms = chatService.getUserChatRooms(userId);

        return ResponseEntity.ok(chatRooms);
    }

    @GetMapping("/{chatRoomId}/history")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Page<MessageDTO>> getChatHistory(
            @PathVariable String chatRoomId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size) {

        log.info("Get chat history endpoint called - Room: {}", chatRoomId);

        Pageable pageable = PageRequest.of(page, size);
        Page<MessageDTO> history = chatService.getChatHistory(chatRoomId, pageable);

        return ResponseEntity.ok(history);
    }

    @PostMapping("/{userId}/one-to-one")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<String> createOneToOneChat(
            @PathVariable String userId,
            Authentication authentication) {

        log.info("Create one-to-one chat endpoint called between: {} and {}", authentication.getName(), userId);

        String chatRoomId = chatService.getOrCreateOneToOneChatRoom(authentication.getName(), userId);

        return ResponseEntity.ok(chatRoomId);
    }

    @DeleteMapping("/{messageId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> deleteMessage(
            @PathVariable String messageId,
            Authentication authentication) {

        log.info("Delete message endpoint called - ID: {} by user: {}", messageId, authentication.getName());

        chatService.deleteMessage(messageId, authentication.getName());

        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{messageId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<MessageDTO> editMessage(
            @PathVariable String messageId,
            @RequestParam String content,
            Authentication authentication) {

        log.info("Edit message endpoint called - ID: {} by user: {}", messageId, authentication.getName());

        MessageDTO message = chatService.editMessage(messageId, authentication.getName(), content);

        return ResponseEntity.ok(message);
    }
}
