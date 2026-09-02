
package com.aidevops.backend.service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.aidevops.backend.auth.AiSetting;
import com.aidevops.backend.repository.AiSettingRepository;

@Service
public class AiSettingService {

    @Autowired
    private AiSettingRepository repository;

    public String getSetting(String key) {
        return repository.findByKeyName(key)
                .map(AiSetting::getValue)
                .orElse(null);
    }
}