package com.shoppyBag.Config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import lombok.Data;

@Configuration
@ConfigurationProperties(prefix = "file")
@Data
public class FileStorageProperties {
    
    private String uploadDir;
    private long maxSize;
    private String allowedExtensions;
    
    public String[] getAllowedExtensionsArray() {
        return allowedExtensions.split(",");
    }
}
