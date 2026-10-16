package com.startupsync.config;

import com.startupsync.activity.repository.ActivityRepository;
import com.startupsync.auth.entity.Role;
import com.startupsync.auth.entity.User;
import com.startupsync.auth.repository.RoleRepository;
import com.startupsync.auth.repository.UserRepository;
import com.startupsync.user.entity.UserProfile;
import com.startupsync.user.repository.UserProfileRepository;
import com.startupsync.startup.entity.Startup;
import com.startupsync.startup.repository.StartupRepository;
import com.startupsync.application.entity.Application;
import com.startupsync.application.repository.ApplicationRepository;
import com.startupsync.team.entity.Team;
import com.startupsync.team.entity.TeamMember;
import com.startupsync.team.repository.TeamRepository;
import com.startupsync.team.repository.TeamMemberRepository;
import com.startupsync.task.entity.Task;
import com.startupsync.task.repository.TaskRepository;
import com.startupsync.skill.entity.Skill;
import com.startupsync.skill.repository.SkillRepository;
import com.startupsync.notification.entity.Notification;
import com.startupsync.notification.repository.NotificationRepository;
import com.startupsync.chat.entity.ChatRoom;
import com.startupsync.chat.entity.Message;
import com.startupsync.chat.repository.ChatRoomRepository;
import com.startupsync.chat.repository.MessageRepository;
import com.startupsync.invitation.entity.Invitation;
import com.startupsync.invitation.repository.InvitationRepository;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;

@Component
@Slf4j
public class DataInitializer implements ApplicationRunner {

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserProfileRepository userProfileRepository;

    @Autowired
    private StartupRepository startupRepository;

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private TeamRepository teamRepository;

    @Autowired
    private TeamMemberRepository teamMemberRepository;

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private SkillRepository skillRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private ChatRoomRepository chatRoomRepository;

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private InvitationRepository invitationRepository;

    @Autowired
    private ActivityRepository activityRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(ApplicationArguments args) throws Exception {
        initializeRoles();
        seedData();
    }

    private void initializeRoles() {
        log.info("Initializing roles...");

        if (!roleRepository.existsByName("MEMBER")) {
            Role memberRole = Role.builder()
                    .name("MEMBER")
                    .description("Regular member of the platform")
                    .build();
            roleRepository.save(memberRole);
            log.info("Created MEMBER role");
        }

        if (!roleRepository.existsByName("ADMIN")) {
            Role adminRole = Role.builder()
                    .name("ADMIN")
                    .description("Administrator of the platform")
                    .build();
            roleRepository.save(adminRole);
            log.info("Created ADMIN role");
        }

        if (!roleRepository.existsByName("STARTUP_FOUNDER")) {
            Role founderRole = Role.builder()
                    .name("STARTUP_FOUNDER")
                    .description("Founder of a startup")
                    .build();
            roleRepository.save(founderRole);
            log.info("Created STARTUP_FOUNDER role");
        }

        log.info("Roles initialization completed");
    }

    private void seedData() {
        log.info("Cleaning up existing database records before seeding...");
        
        try {
            activityRepository.deleteAllInBatch();
            notificationRepository.deleteAllInBatch();
            taskRepository.deleteAllInBatch();
            teamMemberRepository.deleteAllInBatch();
            teamRepository.deleteAllInBatch();
            applicationRepository.deleteAllInBatch();
            invitationRepository.deleteAllInBatch();
            messageRepository.deleteAllInBatch();
            chatRoomRepository.deleteAllInBatch();
            userProfileRepository.deleteAllInBatch();
            startupRepository.deleteAllInBatch();
            userRepository.deleteAllInBatch();
            log.info("Database wipe completed successfully.");
        } catch (Exception e) {
            log.error("Error wiping database tables: ", e);
        }

        log.info("Starting database seeding...");

        // 1. Seed Skills
        log.info("Seeding skills...");
        Skill react = getOrCreateSkill("React", "Frontend");
        Skill typescript = getOrCreateSkill("TypeScript", "Frontend");
        Skill htmlCss = getOrCreateSkill("HTML/CSS", "Frontend");
        Skill java = getOrCreateSkill("Java", "Backend");
        Skill springBoot = getOrCreateSkill("Spring Boot", "Backend");
        Skill python = getOrCreateSkill("Python", "Backend");
        Skill nodejs = getOrCreateSkill("Node.js", "Backend");
        Skill postgres = getOrCreateSkill("PostgreSQL", "Database");
        Skill uiux = getOrCreateSkill("UI/UX Design", "Design");
        Skill pm = getOrCreateSkill("Product Management", "Product");

        // 2. Fetch Roles
        Role memberRole = roleRepository.findByName("MEMBER").orElseThrow();
        Role founderRole = roleRepository.findByName("STARTUP_FOUNDER").orElseThrow();

        String encodedPassword = passwordEncoder.encode("Test@123!");

        // 3. Seed Alice, Bob, Charlie, Diana (Mock entities)
        log.info("Seeding mock partners...");
        User alice = User.builder()
                .firstName("Alice")
                .lastName("Smith")
                .email("founder1@example.com")
                .password(encodedPassword)
                .role(founderRole)
                .isEmailVerified(true)
                .isActive(true)
                .availabilityStatus("AVAILABLE")
                .profileCompletionPercentage(90)
                .build();
        alice = userRepository.save(alice);

        UserProfile aliceProfile = UserProfile.builder()
                .user(alice)
                .headline("Founder & CEO at EcoSphere | GreenTech Advocate")
                .bio("Building tools to combat climate change. Ex-Google Product Manager with 10+ years experience leading sustainability projects.")
                .location("San Francisco, CA")
                .yearsOfExperience(10)
                .currentJobTitle("Founder & CEO")
                .currentCompany("EcoSphere")
                .skills(List.of(pm, uiux))
                .completionPercentage(90)
                .build();
        userProfileRepository.save(aliceProfile);

        User bob = User.builder()
                .firstName("Bob")
                .lastName("Jones")
                .email("founder2@example.com")
                .password(encodedPassword)
                .role(founderRole)
                .isEmailVerified(true)
                .isActive(true)
                .availabilityStatus("AVAILABLE")
                .profileCompletionPercentage(75)
                .build();
        bob = userRepository.save(bob);

        UserProfile bobProfile = UserProfile.builder()
                .user(bob)
                .headline("Co-Founder at AuraAI | Machine Learning Lead")
                .bio("PhD in Computer Science. Building next-gen generative AI platforms for B2B enterprise automation.")
                .location("Seattle, WA")
                .yearsOfExperience(8)
                .currentJobTitle("Co-Founder")
                .currentCompany("AuraAI")
                .skills(List.of(python, java))
                .completionPercentage(75)
                .build();
        userProfileRepository.save(bobProfile);

        User charlie = User.builder()
                .firstName("Charlie")
                .lastName("Brown")
                .email("candidate1@example.com")
                .password(encodedPassword)
                .role(memberRole)
                .isEmailVerified(true)
                .isActive(true)
                .availabilityStatus("LOOKING")
                .profileCompletionPercentage(80)
                .build();
        charlie = userRepository.save(charlie);

        UserProfile charlieProfile = UserProfile.builder()
                .user(charlie)
                .headline("Full Stack Web Developer")
                .bio("Recent Bootcamp graduate eager to join an early-stage SaaS startup. Strong foundation in JavaScript/TypeScript and React.")
                .location("New York, NY")
                .yearsOfExperience(2)
                .currentJobTitle("Software Engineer Intern")
                .currentCompany("WebAgencies")
                .skills(List.of(react, typescript, htmlCss, nodejs))
                .completionPercentage(80)
                .build();
        userProfileRepository.save(charlieProfile);

        User diana = User.builder()
                .firstName("Diana")
                .lastName("Prince")
                .email("candidate2@example.com")
                .password(encodedPassword)
                .role(memberRole)
                .isEmailVerified(true)
                .isActive(true)
                .availabilityStatus("AVAILABLE")
                .profileCompletionPercentage(95)
                .build();
        diana = userRepository.save(diana);

        UserProfile dianaProfile = UserProfile.builder()
                .user(diana)
                .headline("Lead UI/UX Designer & Product Lead")
                .bio("Designing products with empathy. Over 5 years designing responsive web applications and mobile apps.")
                .location("Los Angeles, CA")
                .yearsOfExperience(5)
                .currentJobTitle("Lead Product Designer")
                .currentCompany("DesignCo")
                .skills(List.of(uiux, htmlCss))
                .completionPercentage(95)
                .build();
        userProfileRepository.save(dianaProfile);

        // 4. Seed Startups founded by Alice & Bob
        Startup ecoSphere = Startup.builder()
                .name("EcoSphere")
                .tagline("Connecting communities for a sustainable future")
                .description("EcoSphere is a decentralized green technology platform that enables neighborhoods to trade renewable energy credits, coordinate local compost programs, and track carbon offsets in real-time.")
                .industry("GreenTech")
                .fundingStage("Seed")
                .location("San Francisco, CA")
                .isRemote(true)
                .founder(alice)
                .teamSize(3)
                .teamSizeNeeded(2)
                .skills(List.of(react, typescript, pm, uiux))
                .requiredSkills(List.of("React", "TypeScript", "UI/UX Design"))
                .requiredSkillIds(List.of(react.getId(), typescript.getId(), uiux.getId()))
                .mission("Empower localized community actions to drive global environmental impact.")
                .vision("A zero-emission world sustained by community-driven green technology solutions.")
                .status("ACTIVE")
                .visibility("PUBLIC")
                .viewCount(154)
                .applicationCount(8)
                .websiteUrl("https://ecosphere.example.com")
                .build();
        ecoSphere = startupRepository.save(ecoSphere);

        Startup auraAi = Startup.builder()
                .name("AuraAI")
                .tagline("Next-gen generative AI solutions for enterprises")
                .description("AuraAI builds security-first, fine-tuned LLM agents that integrate directly into enterprise document flows to automate repetitive compliance auditing and financial planning tasks.")
                .industry("AI/ML")
                .fundingStage("Series A")
                .location("Seattle, WA")
                .isRemote(true)
                .founder(bob)
                .teamSize(8)
                .teamSizeNeeded(3)
                .skills(List.of(python, java, springBoot))
                .requiredSkills(List.of("Python", "Java", "Spring Boot"))
                .requiredSkillIds(List.of(python.getId(), java.getId(), springBoot.getId()))
                .mission("Bridge the gap between raw generative AI power and enterprise security compliance.")
                .vision("To be the trusted AI-agent infrastructure for Fortune 500 financial and legal workflows.")
                .status("ACTIVE")
                .visibility("PUBLIC")
                .viewCount(320)
                .applicationCount(15)
                .websiteUrl("https://auraai.example.com")
                .build();
        auraAi = startupRepository.save(auraAi);

        Startup finFlow = Startup.builder()
                .name("FinFlow")
                .tagline("Simplified micro-payments platform for freelancers")
                .description("FinFlow integrates with local clearing houses to offer instantaneous, zero-fee payment settlements and multi-currency invoicing for international contractors and creators.")
                .industry("FinTech")
                .fundingStage("Seed")
                .location("Austin, TX")
                .isRemote(true)
                .founder(alice)
                .teamSize(4)
                .teamSizeNeeded(1)
                .skills(List.of(java, springBoot, react))
                .requiredSkills(List.of("Java", "Spring Boot", "React"))
                .requiredSkillIds(List.of(java.getId(), springBoot.getId(), react.getId()))
                .mission("Empower independent creators with instant, global payments infrastructure.")
                .status("ACTIVE")
                .visibility("PUBLIC")
                .viewCount(98)
                .applicationCount(4)
                .build();
        finFlow = startupRepository.save(finFlow);

        // 5. Seed Test Users
        log.info("Seeding user and workspace data for: test@example.com");
        
        User testUser = User.builder()
                .id("fcea9c82-2752-440b-b5c5-330730d1ed90")
                .firstName("Test")
                .lastName("User")
                .email("test@example.com")
                .password(encodedPassword)
                .role(founderRole)
                .isEmailVerified(true)
                .isActive(true)
                .availabilityStatus("AVAILABLE")
                .profileCompletionPercentage(85)
                .build();
        testUser = userRepository.save(testUser);

        UserProfile testProfile = UserProfile.builder()
                .user(testUser)
                .headline("Senior Software Engineer & Tech Innovator")
                .bio("Experienced full-stack engineer passionate about scalable architectures, clean code, and mentoring early-stage startup teams.")
                .location("San Francisco, CA")
                .phoneNumber("+1 (555) 123-4567")
                .githubUrl("https://github.com/testuser")
                .linkedinUrl("https://linkedin.com/in/testuser")
                .portfolioUrl("https://testuser.dev")
                .yearsOfExperience(6)
                .currentJobTitle("Senior Software Engineer")
                .currentCompany("TechCorp")
                .skills(List.of(react, typescript, java, springBoot, postgres))
                .completionPercentage(85)
                .isVerified(true)
                .build();
        userProfileRepository.save(testProfile);

        // Startup owned by the Test User
        Startup devSync = Startup.builder()
                .name("DevSync")
                .tagline("Collaborative developer matching and workflow sync")
                .description("DevSync uses advanced competency mapping and real-time Stomp socket synchronizers to pair software engineers with early stage startup founders and organize micro-tasks on dynamic kanbans.")
                .industry("SaaS")
                .fundingStage("Pre-seed")
                .location("San Francisco, CA")
                .isRemote(true)
                .founder(testUser)
                .teamSize(1)
                .teamSizeNeeded(4)
                .skills(List.of(react, springBoot, postgres, typescript))
                .requiredSkills(List.of("React", "Spring Boot", "PostgreSQL"))
                .requiredSkillIds(List.of(react.getId(), springBoot.getId(), postgres.getId()))
                .mission("Help developers find their ideal co-founders and team workspaces effortlessly.")
                .vision("A borderless workspace where engineering passion meets entrepreneurial vision.")
                .status("ACTIVE")
                .visibility("PUBLIC")
                .viewCount(75)
                .applicationCount(3)
                .websiteUrl("https://devsync.example.com")
                .build();
        devSync = startupRepository.save(devSync);

        // Applications
        // Test User applies to EcoSphere (Pending)
        Application app1 = Application.builder()
                .applicant(testUser)
                .startup(ecoSphere)
                .status("PENDING")
                .coverLetter("I am super excited about EcoSphere's mission to drive local sustainability. With my frontend skills in React and TypeScript, I can help build an incredibly intuitive dashboard for composting and credit trading.")
                .appliedAt(LocalDateTime.now().minusDays(3))
                .createdAt(LocalDateTime.now().minusDays(3))
                .build();
        applicationRepository.save(app1);

        // Test User applies to AuraAI (Accepted)
        Application app2 = Application.builder()
                .applicant(testUser)
                .startup(auraAi)
                .status("APPROVED")
                .coverLetter("As a senior engineer, I've spent years building Java/Spring Boot systems. I'm eager to help integrate the fine-tuned LLM agents securely with Spring Boot backend services at AuraAI.")
                .appliedAt(LocalDateTime.now().minusDays(5))
                .reviewedAt(LocalDateTime.now().minusDays(4))
                .reviewedBy(bob.getId())
                .createdAt(LocalDateTime.now().minusDays(5))
                .build();
        applicationRepository.save(app2);

        // Charlie applies to Test User's startup (Pending)
        Application app3 = Application.builder()
                .applicant(charlie)
                .startup(devSync)
                .status("PENDING")
                .coverLetter("I am eager to contribute to DevSync. I recently built a Kanban task manager in React and TypeScript. I think my skills align perfectly with the frontend requirements you need.")
                .appliedAt(LocalDateTime.now().minusDays(1))
                .createdAt(LocalDateTime.now().minusDays(1))
                .build();
        applicationRepository.save(app3);

        // Diana applies to Test User's startup (Accepted)
        Application app4 = Application.builder()
                .applicant(diana)
                .startup(devSync)
                .status("APPROVED")
                .coverLetter("DevSync's developer pairing matching tool needs a high-end, premium aesthetic. With my 5+ years of experience as a lead designer, I'd love to craft the design language and structure the UI/UX components.")
                .appliedAt(LocalDateTime.now().minusDays(4))
                .reviewedAt(LocalDateTime.now().minusDays(2))
                .reviewedBy(testUser.getId())
                .createdAt(LocalDateTime.now().minusDays(4))
                .build();
        applicationRepository.save(app4);

        // Seed Teams & Team Memberships
        Team devSyncTeam = Team.builder()
                .startup(devSync)
                .name("DevSync Core Team")
                .description("Core product development and design group working on launching DevSync.")
                .memberCount(2)
                .createdBy(testUser.getId())
                .build();
        devSyncTeam = teamRepository.save(devSyncTeam);

        TeamMember testUserMembership = TeamMember.builder()
                .team(devSyncTeam)
                .user(testUser)
                .role("FOUNDER")
                .position("Chief Executive Officer & Architect")
                .build();
        teamMemberRepository.save(testUserMembership);

        TeamMember dianaMembership = TeamMember.builder()
                .team(devSyncTeam)
                .user(diana)
                .role("MEMBER")
                .position("Lead Product Designer")
                .build();
        teamMemberRepository.save(dianaMembership);

        // Seed Tasks
        Task task1 = Task.builder()
                .startup(devSync)
                .title("Design DevSync Figma Mockups")
                .description("Draft high-fidelity mockups for the dashboard, startup search workspace, and matching sections. Make sure to use modern, clean typography and smooth, rounded containers.")
                .assignedTo(diana)
                .status("IN_PROGRESS")
                .priority("HIGH")
                .dueDate(LocalDateTime.now().plusDays(4))
                .completionPercentage(40)
                .sprintName("Sprint 1")
                .createdBy(testUser.getId())
                .build();
        taskRepository.save(task1);

        Task task2 = Task.builder()
                .startup(devSync)
                .title("Setup JPA Entity Schemas")
                .description("Map user, startup, application, chat, and notification entities to their relative PostgreSQL tables. Set up appropriate index paths for email and timestamps.")
                .assignedTo(testUser)
                .status("COMPLETED")
                .priority("MEDIUM")
                .dueDate(LocalDateTime.now().minusDays(1))
                .completedAt(LocalDateTime.now().minusDays(2))
                .completionPercentage(100)
                .sprintName("Sprint 1")
                .createdBy(testUser.getId())
                .build();
        taskRepository.save(task2);

        // Seed Chat Rooms and Messages
        ChatRoom room1 = ChatRoom.builder()
                .name("Alice & Test")
                .description("One-to-one conversation")
                .roomType("ONE_TO_ONE")
                .participants(new HashSet<>(List.of(testUser, alice)))
                .createdBy(alice)
                .build();
        room1 = chatRoomRepository.save(room1);

        Message msg1 = Message.builder()
                .chatRoom(room1)
                .sender(alice)
                .content("Hi Test! Thanks for showing interest in EcoSphere. I reviewed your profile and experience in Spring Boot and React, and they look very impressive.")
                .createdAt(LocalDateTime.now().minusDays(3).plusHours(2))
                .build();
        messageRepository.save(msg1);

        Message msg2 = Message.builder()
                .chatRoom(room1)
                .sender(testUser)
                .content("Hi Alice! Thanks for reaching out. I'm really excited about EcoSphere's focus on local green communities. I'd love to connect and discuss how I can help.")
                .createdAt(LocalDateTime.now().minusDays(3).plusHours(3))
                .build();
        messageRepository.save(msg2);

        ChatRoom room2 = ChatRoom.builder()
                .name("DevSync Team Sync")
                .description("General channel for core DevSync updates")
                .roomType("GROUP")
                .participants(new HashSet<>(List.of(testUser, diana)))
                .createdBy(testUser)
                .build();
        room2 = chatRoomRepository.save(room2);

        Message msg3 = Message.builder()
                .chatRoom(room2)
                .sender(testUser)
                .content("Hey Diana! Welcome to the DevSync workspace. Let's start sketching the component design tokens.")
                .createdAt(LocalDateTime.now().minusDays(2))
                .build();
        messageRepository.save(msg3);

        Message msg4 = Message.builder()
                .chatRoom(room2)
                .sender(diana)
                .content("Thanks Test! Glad to be here. I've already drafted some initial guidelines using standard Outfit typography and dark glassmorphic styling. I'll share the link shortly!")
                .createdAt(LocalDateTime.now().minusDays(2).plusMinutes(15))
                .build();
        messageRepository.save(msg4);

        // Seed Notifications
        Notification notif1 = Notification.builder()
                .user(testUser)
                .title("Application Accepted!")
                .message("Your application to AuraAI has been accepted by Bob Jones.")
                .notificationType("APPLICATION")
                .relatedEntityId(auraAi.getId())
                .relatedEntityType("STARTUP")
                .isRead(false)
                .createdAt(LocalDateTime.now().minusHours(4))
                .build();
        notificationRepository.save(notif1);

        Notification notif2 = Notification.builder()
                .user(testUser)
                .title("New Message from Alice")
                .message("Alice Smith sent you a message: 'Hi Test! Thanks for showing interest...'")
                .notificationType("MESSAGE")
                .relatedEntityId(room1.getId())
                .relatedEntityType("CHAT_ROOM")
                .isRead(false)
                .createdAt(LocalDateTime.now().minusHours(1))
                .build();
        notificationRepository.save(notif2);

        // Seed Invitations (to Test User)
        Invitation inv1 = Invitation.builder()
                .startup(ecoSphere)
                .invitedUser(testUser)
                .invitedBy(alice)
                .status("PENDING")
                .message("Hi Test! We were extremely impressed by your profile. We would love to invite you to join EcoSphere as our Lead Frontend Developer.")
                .position("Lead Frontend Developer")
                .createdAt(LocalDateTime.now().minusDays(2))
                .build();
        invitationRepository.save(inv1);

        // Seed Invitations (sent by Test User)
        Invitation inv2 = Invitation.builder()
                .startup(devSync)
                .invitedUser(charlie)
                .invitedBy(testUser)
                .status("PENDING")
                .message("Hey Charlie! I saw your portfolio and react experience. I think you'd be a perfect fit to join our dev workspace.")
                .position("Software Engineer")
                .createdAt(LocalDateTime.now().minusDays(1))
                .build();
        invitationRepository.save(inv2);

        log.info("Database seeding successfully completed!");
    }

    private Skill getOrCreateSkill(String name, String category) {
        return skillRepository.findByName(name).orElseGet(() -> {
            Skill skill = Skill.builder()
                    .name(name)
                    .category(category)
                    .description("Core skills related to " + name)
                    .endorsementCount(new Random().nextInt(50) + 10)
                    .isVerified(true)
                    .build();
            return skillRepository.save(skill);
        });
    }
}


