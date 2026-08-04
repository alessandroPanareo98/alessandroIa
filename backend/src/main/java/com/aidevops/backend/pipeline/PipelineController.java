package com.aidevops.backend.pipeline;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/pipelines")
public class PipelineController {

    private final PipelineService pipelineService;

    public PipelineController(PipelineService pipelineService) {
        this.pipelineService = pipelineService;
    }

    @GetMapping
    public List<Pipeline> getAll(@RequestParam(required = false) Long projectId,
                                 @RequestParam(required = false) PipelineStatus status) {
        return pipelineService.findAll(projectId, status);
    }
}
