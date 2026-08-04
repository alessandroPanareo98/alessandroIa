package com.aidevops.backend.auth;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserSettingRepository extends JpaRepository<UserSetting, Long> {
    List<UserSetting> findByUserId(Long userId);
}
