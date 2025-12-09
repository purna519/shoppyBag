package com.shoppyBag.Service;

import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

public interface FileStorageService {
    
    String storeFile(MultipartFile file, String category, String customName);
    
    boolean deleteFile(String fileName, String category);
    
    Resource loadFileAsResource(String fileName, String category);
    
    void validateFile(MultipartFile file);
    
    String sanitizeFilename(String filename);
}
