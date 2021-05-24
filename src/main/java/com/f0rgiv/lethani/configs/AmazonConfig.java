package com.f0rgiv.lethani.configs;

import com.amazonaws.auth.AWSCredentials;
import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "aws")
public class AmazonConfig {
    private String accessKey;
    private String secretKey;
    private String region;

    @Bean
    public AmazonS3 s3() {
        AWSCredentials awsCredentials =
                new BasicAWSCredentials(accessKey, secretKey);
        System.out.println("=============DEBUG============");
        System.out.println("AWS creds access key: "+ awsCredentials.getAWSAccessKeyId());
        System.out.println("=============DEBUG============");
        return AmazonS3ClientBuilder
                .standard()
                .withRegion(region)
                .withCredentials(new AWSStaticCredentialsProvider(awsCredentials))
                .build();
    }

    public void setAccessKey(String accessKey) { this.accessKey = accessKey; }

    public void setSecretKey(String secretKey) { this.secretKey = secretKey; }

    public void setRegion(String region) { this.region = region; }
}
