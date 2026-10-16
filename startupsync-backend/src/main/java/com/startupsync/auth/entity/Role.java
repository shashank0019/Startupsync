package com.startupsync.auth.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "roles")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Role {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(name = "name", nullable = false, unique = true, length = 50)
    private String name;

    @Column(name = "description", length = 255)
    private String description;

    @OneToMany(mappedBy = "role", cascade = CascadeType.REMOVE, orphanRemoval = true)
    @Builder.Default
    @lombok.ToString.Exclude
    @lombok.EqualsAndHashCode.Exclude
    private Set<User> users = new HashSet<>();
}
