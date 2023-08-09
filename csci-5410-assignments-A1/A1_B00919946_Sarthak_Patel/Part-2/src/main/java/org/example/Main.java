package org.example;

public class Main {
    public static void main(String[] args) {
        AWSS3Bucket awss3Bucket = new AWSS3Bucket();
        awss3Bucket.createS3Bucket("csci-5410");
    }
}