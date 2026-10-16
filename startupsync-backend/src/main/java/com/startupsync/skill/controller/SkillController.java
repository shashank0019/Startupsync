package com.startupsync.skill.controller;

import com.startupsync.skill.dto.SkillCreateRequest;
import com.startupsync.skill.dto.SkillDTO;
import com.startupsync.skill.service.SkillService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/skills")
@Slf4j
public class SkillController {

    @Autowired
    private SkillService skillService;

    @GetMapping
    public ResponseEntity<Page<SkillDTO>> getAllSkills(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        log.info("Get all skills endpoint called - page: {}, size: {}", page, size);

        Pageable pageable = PageRequest.of(page, size);
        Page<SkillDTO> skills = skillService.getAllSkills(pageable);

        return ResponseEntity.ok(skills);
    }

    @GetMapping("/{id}")
    public ResponseEntity<SkillDTO> getSkillById(@PathVariable String id) {
        log.info("Get skill by ID endpoint called - ID: {}", id);

        SkillDTO skill = skillService.getSkillById(id);

        return ResponseEntity.ok(skill);
    }

    @GetMapping("/by-name/{name}")
    public ResponseEntity<SkillDTO> getSkillByName(@PathVariable String name) {
        log.info("Get skill by name endpoint called - Name: {}", name);

        SkillDTO skill = skillService.getSkillByName(name);

        return ResponseEntity.ok(skill);
    }

    @GetMapping("/search")
    public ResponseEntity<List<SkillDTO>> searchSkills(@RequestParam String query) {
        log.info("Search skills endpoint called - Query: {}", query);

        List<SkillDTO> skills = skillService.searchSkills(query);

        return ResponseEntity.ok(skills);
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<SkillDTO>> getSkillsByCategory(@PathVariable String category) {
        log.info("Get skills by category endpoint called - Category: {}", category);

        List<SkillDTO> skills = skillService.getSkillsByCategory(category);

        return ResponseEntity.ok(skills);
    }

    @GetMapping("/trending")
    public ResponseEntity<Page<SkillDTO>> getTrendingSkills(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        log.info("Get trending skills endpoint called");

        Pageable pageable = PageRequest.of(page, size);
        Page<SkillDTO> skills = skillService.getTrendingSkills(pageable);

        return ResponseEntity.ok(skills);
    }

    @GetMapping("/top/{category}")
    public ResponseEntity<List<SkillDTO>> getTopSkillsByCategory(
            @PathVariable String category,
            @RequestParam(defaultValue = "10") int limit) {

        log.info("Get top skills by category endpoint called - Category: {}", category);

        List<SkillDTO> skills = skillService.getTopSkillsByCategory(category, limit);

        return ResponseEntity.ok(skills);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SkillDTO> createSkill(@Valid @RequestBody SkillCreateRequest request) {
        log.info("Create skill endpoint called - Name: {}", request.getName());

        SkillDTO skill = skillService.createSkill(request);

        return ResponseEntity.status(HttpStatus.CREATED).body(skill);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SkillDTO> updateSkill(
            @PathVariable String id,
            @Valid @RequestBody SkillCreateRequest request) {

        log.info("Update skill endpoint called - ID: {}", id);

        SkillDTO skill = skillService.updateSkill(id, request);

        return ResponseEntity.ok(skill);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteSkill(@PathVariable String id) {
        log.info("Delete skill endpoint called - ID: {}", id);

        skillService.deleteSkill(id);

        return ResponseEntity.noContent().build();
    }
}
