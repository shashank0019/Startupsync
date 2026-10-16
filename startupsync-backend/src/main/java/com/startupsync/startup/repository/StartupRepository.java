package com.startupsync.startup.repository;

import com.startupsync.startup.entity.Startup;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.UUID;
import java.util.List;

@Repository
public interface StartupRepository extends JpaRepository<Startup, String> {
    
    Page<Startup> findByFounderId(String founderId, Pageable pageable);
    List<Startup> findByFounderId(String founderId);
    
    @Query("SELECT s FROM Startup s WHERE " +
           "(:industry IS NULL OR s.industry = :industry) AND " +
           "(:fundingStage IS NULL OR s.fundingStage = :fundingStage) AND " +
           "(:isRemote IS NULL OR s.isRemote = :isRemote) AND " +
           "(LOWER(s.name) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(s.description) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Startup> searchAndFilterStartups(@Param("search") String search, @Param("industry") String industry, @Param("fundingStage") String fundingStage, @Param("isRemote") Boolean isRemote, Pageable pageable);

    Page<Startup> findByIndustry(String industry, Pageable pageable);
    Page<Startup> findByLocation(String location, Pageable pageable);
    Page<Startup> findByFundingStage(String fundingStage, Pageable pageable);
    
    @Query("SELECT s FROM Startup s WHERE s.visibility = 'PUBLIC' AND s.status = 'ACTIVE'")
    Page<Startup> findActivePublicStartups(Pageable pageable);
    
    @Query("SELECT s FROM Startup s WHERE LOWER(s.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR LOWER(s.description) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    Page<Startup> searchStartups(@Param("searchTerm") String searchTerm, Pageable pageable);
    
    @Query("SELECT s FROM Startup s ORDER BY s.viewCount DESC")
    Page<Startup> findTrendingStartups(Pageable pageable);
}