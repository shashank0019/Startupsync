package com.startupsync.chat.service;

import com.startupsync.auth.entity.User;
import com.startupsync.auth.repository.UserRepository;
import com.startupsync.chat.dto.MessageDTO;
import com.startupsync.chat.entity.ChatRoom;
import com.startupsync.chat.entity.Message;
import com.startupsync.chat.repository.ChatRoomRepository;
import com.startupsync.chat.repository.MessageRepository;
import com.startupsync.exception.ResourceNotFoundException;
import com.startupsync.exception.UnauthorizedException;
import com.startupsync.activity.service.ActivityService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.startupsync.chat.dto.ChatRoomDTO;
import org.springframework.data.domain.PageRequest;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ChatServiceImpl implements ChatService {

    private static final Logger log = LoggerFactory.getLogger(ChatServiceImpl.class);

    @Autowired
    private ChatRoomRepository chatRoomRepository;

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ActivityService activityService;

    @Override
    public MessageDTO sendMessage(String chatRoomId, String userId, String content) {
        log.info("Sending message in chat room: {} by user: {}", chatRoomId, userId);

        ChatRoom chatRoom = chatRoomRepository.findByIdActive(chatRoomId)
                .orElseThrow(() -> new ResourceNotFoundException("Chat room not found with ID: " + chatRoomId));

        // Verify user is a participant
        if (!chatRoom.getParticipants().stream().anyMatch(u -> u.getId().equals(userId))) {
            throw new UnauthorizedException("You are not a participant in this chat room");
        }

        User sender = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Message message = Message.builder()
                .chatRoom(chatRoom)
                .sender(sender)
                .content(content)
                .messageType("TEXT")
                .isEdited(false)
                .build();

        message = messageRepository.save(message);
        log.info("Message sent successfully: {}", message.getId());
        activityService.recordActivity(userId, "Chat Message", "Sent message: " + (content.length() > 30 ? content.substring(0, 30) + "..." : content), "CHAT_MESSAGE", "CHAT_ROOM", chatRoomId);

        return mapToMessageDTO(message);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<MessageDTO> getChatHistory(String chatRoomId, Pageable pageable) {
        log.debug("Fetching chat history for room: {}", chatRoomId);

        return messageRepository.findByChatRoomId(chatRoomId, pageable)
                .map(this::mapToMessageDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public List<MessageDTO> getAllChatHistory(String chatRoomId) {
        log.debug("Fetching all chat history for room: {}", chatRoomId);

        return messageRepository.findAllByChatRoomId(chatRoomId)
                .stream()
                .map(this::mapToMessageDTO)
                .collect(Collectors.toList());
    }

    @Override
    public String getOrCreateOneToOneChatRoom(String userId1, String userId2) {
        log.info("Getting or creating one-to-one chat room between: {} and {}", userId1, userId2);

        // Check if chat room already exists
        var existingRoom = chatRoomRepository.findOneToOneChatRoom(userId1, userId2);
        if (existingRoom.isPresent()) {
            return existingRoom.get().getId();
        }

        User user1 = userRepository.findById(userId1)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        User user2 = userRepository.findById(userId2)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        ChatRoom chatRoom = ChatRoom.builder()
                .name(user1.getFirstName() + " & " + user2.getFirstName())
                .roomType("ONE_TO_ONE")
                .participants(new HashSet<>())
                .createdBy(user1)
                .isActive(true)
                .build();

        chatRoom.getParticipants().add(user1);
        chatRoom.getParticipants().add(user2);

        chatRoom = chatRoomRepository.save(chatRoom);
        log.info("One-to-one chat room created: {}", chatRoom.getId());

        return chatRoom.getId();
    }

    @Override
    @Transactional(readOnly = true)
    public List<ChatRoomDTO> getUserChatRooms(String userId) {
        log.debug("Fetching chat rooms for user: {}", userId);

        return chatRoomRepository.findByParticipantId(userId)
                .stream()
                .map(this::mapToChatRoomDTO)
                .collect(Collectors.toList());
    }

    @Override
    public MessageDTO editMessage(String messageId, String userId, String newContent) {
        log.info("Editing message: {} by user: {}", messageId, userId);

        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> new ResourceNotFoundException("Message not found"));

        // Verify user is the sender
        if (!message.getSender().getId().equals(userId)) {
            throw new UnauthorizedException("You can only edit your own messages");
        }

        message.setContent(newContent);
        message.setIsEdited(true);
        message.setEditedAt(LocalDateTime.now());

        message = messageRepository.save(message);
        log.info("Message edited successfully: {}", messageId);

        return mapToMessageDTO(message);
    }

    @Override
    public void deleteMessage(String messageId, String userId) {
        log.info("Deleting message: {} by user: {}", messageId, userId);

        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> new ResourceNotFoundException("Message not found"));

        // Verify user is the sender
        if (!message.getSender().getId().equals(userId)) {
            throw new UnauthorizedException("You can only delete your own messages");
        }

        messageRepository.deleteById(messageId);
        log.info("Message deleted: {}", messageId);
    }

    @Override
    @Transactional(readOnly = true)
    public long getMessageCount(String chatRoomId) {
        return messageRepository.countByChatRoomId(chatRoomId);
    }

    private MessageDTO mapToMessageDTO(Message message) {
        return MessageDTO.builder()
                .id(message.getId())
                .chatRoomId(message.getChatRoom().getId())
                .sender(MessageDTO.SenderDTO.builder()
                        .id(message.getSender().getId())
                        .firstName(message.getSender().getFirstName())
                        .lastName(message.getSender().getLastName())
                        .profilePhotoUrl(message.getSender().getProfilePhotoUrl())
                        .build())
                .content(message.getContent())
                .messageType(message.getMessageType())
                .createdAt(message.getCreatedAt())
                .editedAt(message.getEditedAt())
                .isEdited(message.getIsEdited())
                .build();
    }

    private ChatRoomDTO mapToChatRoomDTO(ChatRoom chatRoom) {
        Page<Message> lastMessagePage = messageRepository.findByChatRoomId(chatRoom.getId(), PageRequest.of(0, 1));
        MessageDTO lastMessageDto = lastMessagePage.hasContent() ? mapToMessageDTO(lastMessagePage.getContent().get(0)) : null;

        return ChatRoomDTO.builder()
                .id(chatRoom.getId())
                .name(chatRoom.getName())
                .description(chatRoom.getDescription())
                .roomType(chatRoom.getRoomType())
                .members(new ArrayList<>(chatRoom.getParticipants()))
                .lastMessage(lastMessageDto)
                .createdAt(chatRoom.getCreatedAt())
                .updatedAt(chatRoom.getUpdatedAt())
                .build();
    }
}
