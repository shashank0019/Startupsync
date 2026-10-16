package com.startupsync.user.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProfileUpdateRequest {

    private String firstName;
    private String lastName;
    private String availabilityStatus;

    @Size(min = 10, max = 1000, message = "Bio must be between 10 and 1000 characters")
    private String bio;

    @Size(max = 255, message = "Headline must not exceed 255 characters")
    private String headline;

    @Size(max = 100, message = "Location must not exceed 100 characters")
    private String location;

    @Size(max = 20, message = "Phone number must not exceed 20 characters")
    private String phoneNumber;

    @Size(max = 255, message = "GitHub URL must not exceed 255 characters")
    private String githubUrl;

    @Size(max = 255, message = "LinkedIn URL must not exceed 255 characters")
    private String linkedinUrl;

    @Size(max = 255, message = "Portfolio URL must not exceed 255 characters")
    private String portfolioUrl;

    @Size(max = 255, message = "Website URL must not exceed 255 characters")
    private String websiteUrl;

    @Size(max = 255, message = "Twitter URL must not exceed 255 characters")
    private String twitterUrl;

    @Min(value = 0, message = "Years of experience cannot be negative")
    @Max(value = 80, message = "Years of experience cannot exceed 80")
    private Integer yearsOfExperience;

    @Size(max = 150, message = "Current job title must not exceed 150 characters")
    private String currentJobTitle;

    @Size(max = 150, message = "Current company must not exceed 150 characters")
    private String currentCompany;

    @Valid
    private List<ExperienceDTO> experiences;

    @Valid
    private List<EducationDTO> educations;

    @Size(max = 20, message = "Visibility must be either PUBLIC or PRIVATE")
    private String visibility;

    // Getters and Setters explicitly added to bypass Lombok compilation issues
    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }

    public String getHeadline() { return headline; }
    public void setHeadline(String headline) { this.headline = headline; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }

    public String getGithubUrl() { return githubUrl; }
    public void setGithubUrl(String githubUrl) { this.githubUrl = githubUrl; }

    public String getLinkedinUrl() { return linkedinUrl; }
    public void setLinkedinUrl(String linkedinUrl) { this.linkedinUrl = linkedinUrl; }

    public String getPortfolioUrl() { return portfolioUrl; }
    public void setPortfolioUrl(String portfolioUrl) { this.portfolioUrl = portfolioUrl; }

    public String getWebsiteUrl() { return websiteUrl; }
    public void setWebsiteUrl(String websiteUrl) { this.websiteUrl = websiteUrl; }

    public String getTwitterUrl() { return twitterUrl; }
    public void setTwitterUrl(String twitterUrl) { this.twitterUrl = twitterUrl; }

    public Integer getYearsOfExperience() { return yearsOfExperience; }
    public void setYearsOfExperience(Integer yearsOfExperience) { this.yearsOfExperience = yearsOfExperience; }

    public String getCurrentJobTitle() { return currentJobTitle; }
    public void setCurrentJobTitle(String currentJobTitle) { this.currentJobTitle = currentJobTitle; }

    public String getCurrentCompany() { return currentCompany; }
    public void setCurrentCompany(String currentCompany) { this.currentCompany = currentCompany; }

    public List<ExperienceDTO> getExperiences() { return experiences; }
    public void setExperiences(List<ExperienceDTO> experiences) { this.experiences = experiences; }

    public List<EducationDTO> getEducations() { return educations; }
    public void setEducations(List<EducationDTO> educations) { this.educations = educations; }

    public String getVisibility() { return visibility; }
    public void setVisibility(String visibility) { this.visibility = visibility; }

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }
    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }
    public String getAvailabilityStatus() { return availabilityStatus; }
    public void setAvailabilityStatus(String availabilityStatus) { this.availabilityStatus = availabilityStatus; }
}
