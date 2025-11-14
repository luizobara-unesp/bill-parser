package com.billparser.backend.client;

import com.billparser.backend.config.FeignMultipartConfig;
import com.billparser.backend.dto.extractor.AnalysisCompletaConta;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.multipart.MultipartFile;

@FeignClient(
        name = "extractor-service",
        url = "${application.client.extractor.url}",
        configuration = FeignMultipartConfig.class
)

public interface ExtractorClient {
    @PostMapping(value = "/extract/full-analysis", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    AnalysisCompletaConta extractData(@RequestPart("file") MultipartFile file);
}