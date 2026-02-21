-- Create Database for Attendance System
-- Run this script in phpMyAdmin SQL tab or MySQL command line

CREATE DATABASE IF NOT EXISTS `attendance_system` 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE `attendance_system`;

-- Note: Tables will be created automatically by SQLAlchemy when you run the FastAPI application
-- This script only creates the database

-- Optional: Create a dedicated user for the application
-- CREATE USER IF NOT EXISTS 'attendance_user'@'localhost' IDENTIFIED BY 'your_secure_password';
-- GRANT ALL PRIVILEGES ON attendance_system.* TO 'attendance_user'@'localhost';
-- FLUSH PRIVILEGES;
