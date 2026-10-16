package com.startupsync.skill.service;

import com.startupsync.exception.BadRequestException;
import com.startupsync.exception.ResourceNotFoundException;
import com.startupsync.skill.dto.SkillCreateRequest;
import com.startupsync.skill.dto.SkillDTO;
import com.startupsync.skill.entity.Skill;
import com.startupsync.skill.repository.SkillRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
@Transactional
public class SkillServiceImpl implements SkillService {

    @Autowired
    private SkillRepository skillRepository;

    @Override
    @Transactional(readOnly = true)
    public SkillDTO getSkillById(String id) {
        log.debug("Fetching skill by ID: {}", id);

        Skill skill = skillRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Skill not found with ID: " + id));

        return mapToDTO(skill);
    }

    @Override
    @Transactional(readOnly = true)
    public SkillDTO getSkillByName(String name) {
        log.debug("Fetching skill by name: {}", name);

        Skill skill = skillRepository.findByName(name)
                .orElseThrow(() -> new ResourceNotFoundException("Skill not found with name: " + name));

        return mapToDTO(skill);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<SkillDTO> getAllSkills(Pageable pageable) {
        log.debug("Fetching all skills");

        return skillRepository.findAll(pageable)
                .map(this::mapToDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public List<SkillDTO> getSkillsByCategory(String category) {
        log.debug("Fetching skills by category: {}", category);

        return skillRepository.findByCategory(category)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<SkillDTO> searchSkills(String searchTerm) {
        log.debug("Searching skills with term: {}", searchTerm);

        if (searchTerm == null || searchTerm.trim().isEmpty()) {
            throw new BadRequestException("Search term cannot be empty");
        }

        return skillRepository.searchByName(searchTerm)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Page<SkillDTO> getTrendingSkills(Pageable pageable) {
        log.debug("Fetching trending skills");

        return skillRepository.findTrendingSkills(pageable)
                .map(this::mapToDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public List<SkillDTO> getTopSkillsByCategory(String category, int limit) {
        log.debug("Fetching top {} skills in category: {}", limit, category);

        Pageable pageable = org.springframework.data.domain.PageRequest.of(0, limit);
        return skillRepository.findTopSkillsByCategory(category, pageable)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public SkillDTO createSkill(SkillCreateRequest request) {
        log.info("Creating new skill: {}", request.getName());

        // Check if skill already exists
        if (skillRepository.existsByName(request.getName())) {
            throw new BadRequestException("Skill with name '" + request.getName() + "' already exists");
        }

        Skill skill = Skill.builder()
                .name(request.getName())
                .description(request.getDescription())
                .category(request.getCategory())
                .endorsementCount(0)
                .isVerified(false)
                .build();

        skill = skillRepository.save(skill);
        log.info("Skill created successfully: {}", skill.getId());

        return mapToDTO(skill);
    }

    @Override
    public SkillDTO updateSkill(String id, SkillCreateRequest request) {
        log.info("Updating skill: {}", id);

        Skill skill = skillRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Skill not found with ID: " + id));

        // Check if new name already exists (if name is being changed)
        if (!skill.getName().equals(request.getName()) && skillRepository.existsByName(request.getName())) {
            throw new BadRequestException("Skill with name '" + request.getName() + "' already exists");
        }

        skill.setName(request.getName());
        skill.setDescription(request.getDescription());
        skill.setCategory(request.getCategory());

        skill = skillRepository.save(skill);
        log.info("Skill updated successfully: {}", id);

        return mapToDTO(skill);
    }

    @Override
    public void deleteSkill(String id) {
        log.info("Deleting skill: {}", id);

        Skill skill = skillRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Skill not found with ID: " + id));

        skillRepository.delete(skill);
        log.info("Skill deleted successfully: {}", id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<SkillDTO> getSkillsByIds(List<String> skillIds) {
        log.debug("Fetching skills by IDs: {}", skillIds);

        if (skillIds == null || skillIds.isEmpty()) {
            return new ArrayList<>();
        }

        return skillRepository.findByIdIn(skillIds)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    private SkillDTO mapToDTO(Skill skill) {
        return SkillDTO.builder()
                .id(skill.getId())
                .name(skill.getName())
                .description(skill.getDescription())
                .category(skill.getCategory())
                .endorsementCount(skill.getEndorsementCount())
                .isVerified(skill.getIsVerified())
                .createdAt(skill.getCreatedAt())
                .build();
    }
}
