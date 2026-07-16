package com.example.demo.repository;

import com.example.demo.model.Phase;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PhaseRepository extends JpaRepository <Phase, Long> {
}
