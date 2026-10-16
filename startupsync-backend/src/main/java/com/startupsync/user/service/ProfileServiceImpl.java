package com.startupsync.user.service;

import com.startupsync.auth.entity.User;
import com.startupsync.auth.repository.UserRepository;
import com.startupsync.exception.BadRequestException;
import com.startupsync.exception.ResourceNotFoundException;
import com.startupsync.user.dto.ProfileResponse;
import com.startupsync.user.dto.ProfileUpdateRequest;
import com.startupsync.user.entity.Education;
import com.startupsync.user.entity.Experience;
import com.startupsync.user.entity.UserProfile;
import com.startupsync.user.repository.UserProfileRepository;
import com.startupsync.activity.service.ActivityService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@Slf4j
@Transactional
public class ProfileServiceImpl implements ProfileService {

    @Autowired
    private UserProfileRepository userProfileRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ActivityService activityService;

    @Value("${file.upload.dir:./uploads}")
    private String uploadDir;

    @Override
    public String uploadProfilePhoto(String userId, MultipartFile file) {
        log.info("Uploading profile photo for user: {}", userId);

        if (file.isEmpty()) {
            throw new BadRequestException("File is empty");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));

        UserProfile profile = userProfileRepository.findByUserId(userId)
                .orElseGet(() -> createNewProfile(user));

        try {
            // Ensure directory exists
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // Generate unique filename
            String originalFileName = file.getOriginalFilename();
            String extension = "png"; // default
            if (originalFileName != null && originalFileName.contains(".")) {
                extension = originalFileName.substring(originalFileName.lastIndexOf(".") + 1);
            }
            
            String fileName = userId + "_" + System.currentTimeMillis() + "." + extension;
            Path filePath = uploadPath.resolve(fileName);

            // Copy file
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            // URL path to be returned
            String photoUrl = "/api/uploads/" + fileName;

            // Update user and profile photo url
            profile.setProfilePictureUrl(photoUrl);
            userProfileRepository.save(profile);

            log.info("Profile photo uploaded successfully for user: {} -> {}", userId, photoUrl);
            return photoUrl;

        } catch (IOException e) {
            log.error("Failed to store file", e);
            throw new RuntimeException("Could not store the file. Error: " + e.getMessage());
        }
    }

    @Override
    public ProfileResponse getProfile(String userId) {
        log.info("Fetching profile for user: {}", userId);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));

        UserProfile profile = userProfileRepository.findByUserId(userId)
                .orElseGet(() -> createNewProfile(user));

        return mapToProfileResponse(profile);
    }

    @Override
    public ProfileResponse createProfile(String userId, ProfileUpdateRequest createRequest) {
        log.info("Creating profile for user: {}", userId);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));

        // Check if profile already exists
        if (userProfileRepository.findByUserId(userId).isPresent()) {
            throw new BadRequestException("Profile already exists for user: " + userId);
        }

        UserProfile profile = createNewProfile(user);

        // Update with provided data
        if (StringUtils.hasText(createRequest.getAvailabilityStatus())) {
            user.setAvailabilityStatus(createRequest.getAvailabilityStatus());
        }

        if (createRequest.getYearsOfExperience() != null && createRequest.getYearsOfExperience() >= 0) {
            profile.setYearsOfExperience(createRequest.getYearsOfExperience());
        }

        if (StringUtils.hasText(createRequest.getCurrentJobTitle())) {
            profile.setCurrentJobTitle(createRequest.getCurrentJobTitle());
        }

        if (StringUtils.hasText(createRequest.getCurrentCompany())) {
            profile.setCurrentCompany(createRequest.getCurrentCompany());
        }

        if (createRequest.getExperiences() != null && !createRequest.getExperiences().isEmpty()) {
            profile.setExperiences(mapToExperiences(createRequest.getExperiences()));
        }

        if (createRequest.getEducations() != null && !createRequest.getEducations().isEmpty()) {
            profile.setEducations(mapToEducations(createRequest.getEducations()));
        }

        // Calculate completion percentage
        int completionPercentage = calculateCompletionPercentage(profile);
        profile.setCompletionPercentage(completionPercentage);
        user.setProfileCompletionPercentage(completionPercentage);

        userRepository.save(user);
        profile = userProfileRepository.save(profile);

        log.info("Profile created successfully for user: {} (Completion: {}%)", userId, completionPercentage);
        activityService.recordActivity(userId, "Profile Updated", "Created your user profile details", "PROFILE_UPDATED", "USER", userId);
        return mapToProfileResponse(profile);
    }

    @Override
    public void deleteProfile(String userId) {
        log.info("Deleting profile for user: {}", userId);

        UserProfile profile = userProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Profile not found for user: " + userId));

        userProfileRepository.delete(profile);
        log.info("Profile deleted successfully for user: {}", userId);
    }

    @Override
    public ProfileResponse updateProfile(String userId, ProfileUpdateRequest updateRequest) {
        log.info("Updating profile for user: {}", userId);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));

        UserProfile profile = userProfileRepository.findByUserId(userId)
                .orElseGet(() -> createNewProfile(user));

        // Update user names and availability
        if (StringUtils.hasText(updateRequest.getFirstName())) {
            user.setFirstName(updateRequest.getFirstName());
        }
        if (StringUtils.hasText(updateRequest.getLastName())) {
            user.setLastName(updateRequest.getLastName());
        }
        if (StringUtils.hasText(updateRequest.getAvailabilityStatus())) {
            user.setAvailabilityStatus(updateRequest.getAvailabilityStatus());
        }

        // Update basic fields
        if (StringUtils.hasText(updateRequest.getWebsiteUrl())) {
            profile.setWebsiteUrl(updateRequest.getWebsiteUrl());
        }

        if (StringUtils.hasText(updateRequest.getTwitterUrl())) {
            profile.setTwitterUrl(updateRequest.getTwitterUrl());
        }

        if (updateRequest.getYearsOfExperience() != null && updateRequest.getYearsOfExperience() >= 0) {
            profile.setYearsOfExperience(updateRequest.getYearsOfExperience());
        }

        if (StringUtils.hasText(updateRequest.getCurrentJobTitle())) {
            profile.setCurrentJobTitle(updateRequest.getCurrentJobTitle());
        }

        if (StringUtils.hasText(updateRequest.getCurrentCompany())) {
            profile.setCurrentCompany(updateRequest.getCurrentCompany());
        }

        if (updateRequest.getExperiences() != null && !updateRequest.getExperiences().isEmpty()) {
            profile.setExperiences(mapToExperiences(updateRequest.getExperiences()));
        }

        if (updateRequest.getEducations() != null && !updateRequest.getEducations().isEmpty()) {
            profile.setEducations(mapToEducations(updateRequest.getEducations()));
        }

        if (StringUtils.hasText(updateRequest.getVisibility())) {
            profile.setVisibility(updateRequest.getVisibility());
        }

        // Calculate completion percentage
        int completionPercentage = calculateCompletionPercentage(profile);
        profile.setCompletionPercentage(completionPercentage);

        // Update user profile completion percentage
        user.setProfileCompletionPercentage(completionPercentage);
        userRepository.save(user);

        profile = userProfileRepository.save(profile);
        log.info("Profile updated successfully for user: {} (Completion: {}%)", userId, completionPercentage);
        activityService.recordActivity(userId, "Profile Updated", "Updated your profile details", "PROFILE_UPDATED", "USER", userId);

        return mapToProfileResponse(profile);
    }

    @Override
    public int calculateCompletionPercentage(String userId) {
        log.debug("Calculating profile completion for user: {}", userId);

        UserProfile profile = userProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Profile not found for user: " + userId));

        return calculateCompletionPercentage(profile);
    }

    private int calculateCompletionPercentage(UserProfile profile) {
        int score = 0;
        int maxScore = 10;

        // Bio (10%)
        if (StringUtils.hasText(profile.getBio())) score++;

        // Headline (10%)
        if (StringUtils.hasText(profile.getHeadline())) score++;

        // Location (10%)
        if (StringUtils.hasText(profile.getLocation())) score++;

        // Phone (5%)
        if (StringUtils.hasText(profile.getPhoneNumber())) score += 0.5;

        // Social Links (10%)
        if (StringUtils.hasText(profile.getGithubUrl())
                || StringUtils.hasText(profile.getLinkedinUrl())
                || StringUtils.hasText(profile.getPortfolioUrl())) {
            score += 0.5;
        }

        // Experience (20%)
        if (profile.getExperiences() != null && !profile.getExperiences().isEmpty()) {
            score += 2;
        }

        // Education (15%)
        if (profile.getEducations() != null && !profile.getEducations().isEmpty()) {
            score += 1.5;
        }

        // Profile Picture (10%)
        if (StringUtils.hasText(profile.getProfilePictureUrl())) {
            score += 1;
        }

        // Years of Experience (10%)
        if (profile.getYearsOfExperience() != null && profile.getYearsOfExperience() > 0) {
            score += 1;
        }

        return Math.min((int) (score / maxScore * 100), 100);
    }

    @Override
    public ProfileResponse updateProfilePicture(String userId, String picturUrl) {
        log.info("Updating profile picture for user: {}", userId);

        if (!StringUtils.hasText(picturUrl)) {
            throw new BadRequestException("Picture URL cannot be empty");
        }

        UserProfile profile = userProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Profile not found for user: " + userId));

        profile.setProfilePictureUrl(picturUrl);

        // Recalculate completion percentage
        int completionPercentage = calculateCompletionPercentage(profile);
        profile.setCompletionPercentage(completionPercentage);

        profile = userProfileRepository.save(profile);
        log.info("Profile picture updated for user: {}", userId);

        return mapToProfileResponse(profile);
    }

    private UserProfile createNewProfile(User user) {
        log.debug("Creating new profile for user: {}", user.getId());

        UserProfile profile = UserProfile.builder()
                .user(user)
                .completionPercentage(0)
                .isVerified(false)
                .visibility("PUBLIC")
                .experiences(new ArrayList<>())
                .educations(new ArrayList<>())
                .build();

        return userProfileRepository.save(profile);
    }

    private List<Experience> mapToExperiences(List<com.startupsync.user.dto.ExperienceDTO> dtoList) {
        List<Experience> experiences = new ArrayList<>();

        for (com.startupsync.user.dto.ExperienceDTO dto : dtoList) {
            Experience experience = Experience.builder()
                    .companyName(dto.getCompanyName())
                    .jobTitle(dto.getJobTitle())
                    .employmentType(dto.getEmploymentType())
                    .location(dto.getLocation())
                    .startDate(dto.getStartDate())
                    .endDate(dto.getEndDate())
                    .isCurrent(dto.getIsCurrent())
                    .description(dto.getDescription())
                    .build();

            experiences.add(experience);
        }

        return experiences;
    }

    private List<Education> mapToEducations(List<com.startupsync.user.dto.EducationDTO> dtoList) {
        List<Education> educations = new ArrayList<>();

        for (com.startupsync.user.dto.EducationDTO dto : dtoList) {
            Education education = Education.builder()
                    .schoolName(dto.getSchoolName())
                    .degree(dto.getDegree())
                    .fieldOfStudy(dto.getFieldOfStudy())
                    .startDate(dto.getStartDate())
                    .endDate(dto.getEndDate())
                    .grade(dto.getGrade())
                    .description(dto.getDescription())
                    .build();

            educations.add(education);
        }

        return educations;
    }

    private ProfileResponse mapToProfileResponse(UserProfile profile) {
        return ProfileResponse.builder()
                .id(profile.getId())
                .user(ProfileResponse.UserBasicDTO.builder()
                        .id(profile.getUser().getId())
                        .firstName(profile.getUser().getFirstName())
                        .lastName(profile.getUser().getLastName())
                        .email(profile.getUser().getEmail()) 
                        .role(profile.getUser().getRole().getName())
                        .build())
                .bio(profile.getBio())
                .headline(profile.getHeadline())
                .location(profile.getLocation())
                .phoneNumber(profile.getPhoneNumber())
                .githubUrl(profile.getGithubUrl())
                .linkedinUrl(profile.getLinkedinUrl())
                .portfolioUrl(profile.getPortfolioUrl())
                .websiteUrl(profile.getWebsiteUrl())
                .twitterUrl(profile.getTwitterUrl())
                .profilePictureUrl(profile.getProfilePictureUrl())
                .availabilityStatus(profile.getUser().getAvailabilityStatus())
                .yearsOfExperience(profile.getYearsOfExperience())
                .currentJobTitle(profile.getCurrentJobTitle())
                .currentCompany(profile.getCurrentCompany())
                .experiences(mapExperiencesToDTOs(profile.getExperiences()))
                .educations(mapEducationsToDTOs(profile.getEducations()))
                .completionPercentage(profile.getCompletionPercentage())
                .isVerified(profile.getIsVerified())
                .visibility(profile.getVisibility())
                .createdAt(profile.getCreatedAt())
                .updatedAt(profile.getUpdatedAt())
                .build();
    }

    private List<com.startupsync.user.dto.ExperienceDTO> mapExperiencesToDTOs(List<Experience> experiences) {
        List<com.startupsync.user.dto.ExperienceDTO> dtos = new ArrayList<>();

        if (experiences != null) {
            for (Experience experience : experiences) {
                com.startupsync.user.dto.ExperienceDTO dto = com.startupsync.user.dto.ExperienceDTO.builder()
                        .companyName(experience.getCompanyName())
                        .jobTitle(experience.getJobTitle())
                        .employmentType(experience.getEmploymentType())
                        .location(experience.getLocation())
                        .startDate(experience.getStartDate())
                        .endDate(experience.getEndDate())
                        .isCurrent(experience.getIsCurrent())
                        .description(experience.getDescription())
                        .build();

                dtos.add(dto);
            }
        }

        return dtos;
    }

    private List<com.startupsync.user.dto.EducationDTO> mapEducationsToDTOs(List<Education> educations) {
        List<com.startupsync.user.dto.EducationDTO> dtos = new ArrayList<>();

        if (educations != null) {
            for (Education education : educations) {
                com.startupsync.user.dto.EducationDTO dto = com.startupsync.user.dto.EducationDTO.builder()
                        .schoolName(education.getSchoolName())
                        .degree(education.getDegree())
                        .fieldOfStudy(education.getFieldOfStudy())
                        .startDate(education.getStartDate())
                        .endDate(education.getEndDate())
                        .grade(education.getGrade())
                        .description(education.getDescription())
                        .build();

                dtos.add(dto);
            }
        }

        return dtos;
    }
}
