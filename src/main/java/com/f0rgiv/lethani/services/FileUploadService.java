package com.f0rgiv.lethani.services;

import com.amazonaws.AmazonServiceException;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.ObjectMetadata;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.InputStream;

//@Service
public class FileUploadService {
    @Autowired
    private AmazonS3 amazonS3;

    @Value("${aws.bucketName}") private String bucketName;


    public void upload(String path,
                       InputStream stream
    ) {
        upload(path, stream, null, 0);
    }

    public void upload(String path, InputStream stream, String contentType, long size) {
        ObjectMetadata objectMetadata = new ObjectMetadata();
        if (contentType != null) objectMetadata.setContentType(contentType);
        if (size != 0) objectMetadata.setContentLength(size);

        try {
            amazonS3.putObject(bucketName, path, stream, objectMetadata);
        } catch (AmazonServiceException e) {
            throw new IllegalStateException("Failed to upload the file");
        }
    }

    public String getURL(String key) {
        return amazonS3.getUrl(bucketName, key).toString();
    }

    public void delete(String key) {
        amazonS3.deleteObject(bucketName, key);
    }
}
