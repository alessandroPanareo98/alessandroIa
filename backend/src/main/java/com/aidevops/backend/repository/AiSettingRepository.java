package com.aidevops.backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.aidevops.backend.auth.AiSetting;

@Repository
public interface AiSettingRepository extends JpaRepository<AiSetting, Long> {

    Optional<AiSetting> findByKeyName(String keyName);

}