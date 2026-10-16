package com.startupsync.settings.entity;

import com.startupsync.auth.entity.User;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "user_settings")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserSettings {

    @Id
    @Column(name = "id", nullable = false, length = 36)
    private String id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(name = "email_notifications", nullable = false)
    @Builder.Default
    private Boolean emailNotifications = true;

    @Column(name = "application_updates", nullable = false)
    @Builder.Default
    private Boolean applicationUpdates = true;

    @Column(name = "message_notifications", nullable = false)
    @Builder.Default
    private Boolean messageNotifications = true;

    @Column(name = "profile_visible", nullable = false)
    @Builder.Default
    private Boolean profileVisible = true;

    @Column(name = "show_location", nullable = false)
    @Builder.Default
    private Boolean showLocation = true;

    @Column(name = "allow_messaging", nullable = false)
    @Builder.Default
    private Boolean allowMessaging = true;

    @Column(name = "theme", nullable = false, length = 20)
    @Builder.Default
    private String theme = "light";

    @Column(name = "language", nullable = false, length = 10)
    @Builder.Default
    private String language = "en";

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        if (this.id == null) {
            this.id = UUID.randomUUID().toString();
        }
    }
}
