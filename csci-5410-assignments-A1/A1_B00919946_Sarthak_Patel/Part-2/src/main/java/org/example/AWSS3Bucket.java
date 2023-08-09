package org.example;

import com.amazonaws.auth.AWSCredentials;
import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.regions.Regions;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import com.amazonaws.services.s3.model.*;

import java.io.File;

public class AWSS3Bucket {
    AWSCredentials credentials = new BasicAWSCredentials(
            "AKIAU74NYJ2MNPXEA74X",
            "l9Zv2wpvtGeKG2jtonn19kLHEJOAxIv2jr1uEwmA"
    );
    AmazonS3 s3 = AmazonS3ClientBuilder
            .standard()
            .withCredentials(new AWSStaticCredentialsProvider(credentials))
            .withRegion(Regions.US_EAST_1)
            .build();

    // Creating the S3 Bucket if not exists
    public void createS3Bucket(String bucketName) {
        if(s3.doesBucketExist(bucketName)) {
            System.out.println("Bucket Name Already In Use");
        }
        else {
            s3.createBucket(bucketName);
            System.out.println("Bucket Created!");
        }

        String filePath = "/Users/sarthakpatel/Documents/Serverless Programming/Part 2/S3Bucket/index.html";
        File file = new File(filePath);
        uploadFile(bucketName, "index.html", file);

        // Enabling Hosting a Static Website
        BucketWebsiteConfiguration websiteConfig = new BucketWebsiteConfiguration("index.html");
        SetBucketWebsiteConfigurationRequest websiteConfigRequest =
                new SetBucketWebsiteConfigurationRequest(bucketName, websiteConfig);
        s3.setBucketWebsiteConfiguration(websiteConfigRequest);
    }

    // Upload the index.html file
    public void uploadFile(String bucketName, String key, File index) {
        try{
            PutObjectRequest putObjectRequest = new PutObjectRequest(bucketName, key, index);
            //putObjectRequest.withCannedAcl(CannedAccessControlList.PublicRead);
            s3.putObject(putObjectRequest);
            System.out.println("File added in Bucket!");
        }
        catch(Exception e){
            System.out.println("Error While Uploading file in Bucket!");
        }
    }
}
