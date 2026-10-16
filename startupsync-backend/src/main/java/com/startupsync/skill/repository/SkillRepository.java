package com.startupsync.skill.repository;

import com.startupsync.skill.entity.Skill;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SkillRepository extends JpaRepository<Skill, String> {

    Optional<Skill> findByName(String name);

    boolean existsByName(String name);

    List<Skill> findByCategory(String category);

    @Query("SELECT s FROM Skill s WHERE LOWER(s.name) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    List<Skill> searchByName(@Param("searchTerm") String searchTerm);

    @Query("SELECT s FROM Skill s WHERE s.category = :category ORDER BY s.endorsementCount DESC")
    List<Skill> findTopSkillsByCategory(@Param("category") String category, Pageable pageable);

    @Query("SELECT s FROM Skill s ORDER BY s.endorsementCount DESC")
    Page<Skill> findTrendingSkills(Pageable pageable);

    List<Skill> findByIdIn(List<String> skillIds);

    List<Skill> findAllByOrderByEndorsementCountDesc();
}
