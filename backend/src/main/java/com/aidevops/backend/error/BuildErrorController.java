package com.aidevops.backend.error;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/errors")
public class BuildErrorController {

    private final BuildErrorService buildErrorService;

    public BuildErrorController(BuildErrorService buildErrorService) {
        this.buildErrorService = buildErrorService;
    }

    @GetMapping
    public List<BuildError> getRecent(@RequestParam(required = false) Severity severity) {
        return buildErrorService.findRecent(severity);
    }
}
