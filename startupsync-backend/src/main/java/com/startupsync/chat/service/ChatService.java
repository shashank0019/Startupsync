package com.startupsync.chat.service;

import com.startupsync.chat.dto.MessageDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.startupsync.chat.dto.ChatRoomDTO;

import java.util.List;

public interface ChatService {

    /**
     * Send a message
     */
    MessageDTO sendMessage(String chatRoomId, String userId, String content);

    /**
     * Get chat history for a room
     */
    Page<MessageDTO> getChatHistory(String chatRoomId, Pageable pageable);

    /**
     * Get all messages in a chat room
     */
    List<MessageDTO> getAllChatHistory(String chatRoomId);

    /**
     * Get or create one-to-one chat room
     */
    String getOrCreateOneToOneChatRoom(String userId1, String userId2);

    /**
     * Get user's chat rooms
     */
    List<ChatRoomDTO> getUserChatRooms(String userId);

    /**
     * Edit message
     */
    MessageDTO editMessage(String messageId, String userId, String newContent);

    /**
     * Delete message
     */
    void deleteMessage(String messageId, String userId);

    /**
     * Get message count
     */
    long getMessageCount(String chatRoomId);
}
