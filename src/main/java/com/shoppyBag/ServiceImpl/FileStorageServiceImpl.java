package com.shoppyBag.ServiceImpl;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Arrays;

import org.apache.commons.io.FilenameUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import com.shoppyBag.Config.FileStorageProperties;
import com.shoppyBag.Service.FileStorageService;

import jakarta.annotation.PostConstruct;

@Service
public class FileStorageServiceImpl implements FileStorageService {

    private final Path fileStorageLocation;
    private final FileStorageProperties fileStorageProperties;

    @Autowired
    public FileStorageServiceImpl(FileStorageProperties fileStorageProperties) {
        this.fileStorageProperties = fileStorageProperties;
        this.fileStorageLocation = Paths.get(fileStorageProperties.getUploadDir())
                .toAbsolutePath().normalize();
    }

    @PostConstruct
    public void init() {
        try {
            Files.createDirectories(this.fileStorageLocation);
            
            Files.createDirectories(this.fileStorageLocation.resolve("profiles"));
            Files.createDirectories(this.fileStorageLocation.resolve("products"));
            Files.createDirectories(this.fileStorageLocation.resolve("temp"));
            
            System.out.println("File storage directories created at: " + this.fileStorageLocation);
        } catch (Exception ex) {
            throw new RuntimeException("Could not create the directory where the uploaded files will be stored.", ex);
        }
    }

    @Override
    public String storeFile(MultipartFile file, String category, String customName) {
        validateFile(file);

        String originalFilename = StringUtils.cleanPath(file.getOriginalFilename());
        String extension = FilenameUtils.getExtension(originalFilename);
        
        String fileName = sanitizeFilename(customName) + "." + extension;

        try {
            if(fileName.contains("..")) {
                throw new RuntimeException("Sorry! Filename contains invalid path sequence " + fileName);
            }

            Path targetLocation = this.fileStorageLocation.resolve(category).resolve(fileName);

            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            return fileName;
        } catch (IOException ex) {
            throw new RuntimeException("Could not store file " + fileName + ". Please try again!", ex);
        }
    }

    @Override
    public boolean deleteFile(String fileName, String category) {
        try {
            Path filePath = this.fileStorageLocation.resolve(category).resolve(fileName).normalize();
            return Files.deleteIfExists(filePath);
        } catch (IOException ex) {
            throw new RuntimeException("Could not delete file " + fileName, ex);
        }
    }

    @Override
    public Resource loadFileAsResource(String fileName, String category) {
        try {
            Path filePath = this.fileStorageLocation.resolve(category).resolve(fileName).normalize();
            Resource resource = new UrlResource(filePath.toUri());
            
            if(resource.exists()) {
                return resource;
            } else {
                throw new RuntimeException("File not found " + fileName);
            }
        } catch (MalformedURLException ex) {
            throw new RuntimeException("File not found " + fileName, ex);
        }
    }

    @Override
    public void validateFile(MultipartFile file) {
        if (file.isEmpty()) {
            throw new RuntimeException("Failed to store empty file");
        }

        if (file.getSize() > fileStorageProperties.getMaxSize()) {
            throw new RuntimeException("File size exceeds maximum limit of " + 
                (fileStorageProperties.getMaxSize() / (1024 * 1024)) + "MB");
        }

        String originalFilename = file.getOriginalFilename();
        String extension = FilenameUtils.getExtension(originalFilename);
        
        if (!Arrays.asList(fileStorageProperties.getAllowedExtensionsArray()).contains(extension.toLowerCase())) {
            throw new RuntimeException("File type not allowed. Allowed types: " + 
                fileStorageProperties.getAllowedExtensions());
        }
    }

    @Override
    public String sanitizeFilename(String filename) {
        String sanitized = filename.replaceAll("[^a-zA-Z0-9@._-]", "_");
        
        sanitized = sanitized.replaceAll("_{2,}", "_");
        
        sanitized = sanitized.replaceAll("^_+|_+$", "");
        
        return sanitized;
    }
}
