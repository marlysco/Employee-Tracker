DROP DATABASE IF EXISTS employee_dashboard;
CREATE DATABASE employee_dashboard;

USE employee_dashboard;

CREATE TABLE departments (
 id INT PRIMARY KEY NOT NULL,
 name VARCHAR(30) NOT NULL,


CREATE TABLE roles (
 id INT PRIMARY KEY NOT NULL,
 title VARCHAR(30) NOT NULL,
 salary DECIMAL NOT NULL,
 department_id INT  NOT NULL);
 
 CREATE TABLE employees (
 id INT PRIMARY KEY NOT NULL,
 first_name VARCHAR(30) NOT NULL,
 last_name VARCHAR(30) NOT NULL,
 role_id INT  NOT NULL,
 manager_id INT  NOT NULL)

