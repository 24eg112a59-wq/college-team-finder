package com.example.teamfinder.repository;

import com.example.teamfinder.entity.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import jakarta.persistence.LockModeType;
import java.util.Optional;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {
	@Lock(LockModeType.PESSIMISTIC_WRITE)
	@Query("select p from Project p where p.id = :id")
	Optional<Project> findByIdForUpdate(@Param("id") Long id);
}
