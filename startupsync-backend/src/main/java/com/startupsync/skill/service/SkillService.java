package com.startupsync.skill.service;

import com.startupsync.skill.dto.SkillCreateRequest;
import com.startupsync.skill.dto.SkillDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface SkillService {

    /**
     * Get skill by ID
     */
    SkillDTO getSkillById(String id);

    /**
     * Get skill by name
     */
    SkillDTO getSkillByName(String name);

    /**
     * Get all skills
     */
    Page<SkillDTO> getAllSkills(Pageable pageable);

    /**
     * Get skills by category
     */
    List<SkillDTO> getSkillsByCategory(String category);

    /**
     * Search skills by name
     */
    List<SkillDTO> searchSkills(String searchTerm);

    /**
     * Get trending skills
     */
    Page<SkillDTO> getTrendingSkills(Pageable pageable);

    /**
     * Get top skills in a category
     */
    List<SkillDTO> getTopSkillsByCategory(String category, int limit);

    /**
     * Create new skill (Admin only)
     */
    SkillDTO createSkill(SkillCreateRequest request);

    /**
     * Update skill (Admin only)
     */
    SkillDTO updateSkill(String id, SkillCreateRequest request);

    /**
     * Delete skill (Admin only)
     */
    void deleteSkill(String id);

    /**
     * Get multiple skills by IDs
     */
    List<SkillDTO> getSkillsByIds(List<String> skillIds);
}
