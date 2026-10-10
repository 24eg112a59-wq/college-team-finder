package com.example.teamfinder.repository;

import com.example.teamfinder.entity.TeamRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Collection;
import java.util.List;

@Repository
public interface TeamRequestRepository extends JpaRepository<TeamRequest, Long> {
	boolean existsByProject_IdAndReceiver_IdAndStatusIn(Long projectId, Long receiverId, Collection<TeamRequest.RequestStatus> statuses);
	List<TeamRequest> findByReceiver_IdOrderByCreatedAtDesc(Long receiverId);
	List<TeamRequest> findBySender_IdOrderByCreatedAtDesc(Long senderId);
}
