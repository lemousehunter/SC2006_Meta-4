# SC2006_Meta-4
## Contributors
<br />*Nanyang Technological University, A43 Team Meta-4*
* Bernard Chiang 
* Cheong Jia Rong
* Guo Yuan Lin
* Wang Jie Rui, Jerome
* Rodmond Tan

# Tech Stack
## MERN
[![My Tech Stack](https://github-readme-tech-stack.vercel.app/api/cards?title=Tech%20Stack&fontFamily=Quicksand&lineCount=4&theme=github_dark_green&line1=mongodb,MongoDB,47A248;&line2=express,ExpressJS,000000;&line3=react,React-Native,61DAFB;&line4=nodedotjs,NodeJS,339933;)](https://github-readme-tech-stack.vercel.app/api/cards?title=Tech%20Stack&fontFamily=Quicksand&lineCount=4&theme=github_dark_green&line1=mongodb,MongoDB,47A248;&line2=express,ExpressJS,000000;&line3=react,React-Native,61DAFB;&line4=nodedotjs,NodeJS,339933;)

# API Used
## OneMap API
More information can be found here: https://www.onemap.gov.sg/docs/


# Introduction
## Purpose 
The purpose of this document is to build a mobile application for people to exchange information about lost items.

## Intended Audience and Reading Suggestions
This project is a prototype of a lost and found system and it’s intended to be used within NTU’s premises. This has been implemented under the tutelage of Lab assistants and professors. This project will be useful for all users who uses the system, particularly people to tend to lose things.
Product Scope
The Lost & Found mobile application is created and designed to be a one stop place for people who have lost items or found items can go to exchange information, and acts as a social media platform for the facilitation of lost and found items.

Lost items can be posted for users to help with the search or update people who have found said lost item. Found items can be posted for owners to come and identify their ownership.


# Overall Description
## Product Perspective
Lost&Found is a novel app that helps users find their beloved lost items. The app is designed for anyone who has lost or found an item, and who wants to report the item or connect with others who may have information about the item. It also uses interactive map display with precise pins to indicate the location of the reported lost/found items to ease the lost and found process. Users are also able to search for users/posts/category based on a filter system. The introduction of reputation scores and reports will increase the credibility of the users, enhancing the credibility of Lost&Found. Lost&Found aims to simplify the process of finding lost items and to increase the chances of reuniting lost items with their owners.
Product Functions

* Users can create account and log into their accounts.
* Users can create posts for either lost/found items.
* Users can view all the unresolved posts on the main page.
* Users can view all the unresolved posts on the map page.
* Users can search for posts via user/category/items.
* Users can view other users profile.
* Users can make a request to a post (either I found it/ I lost it).
* Post owners can receive the requests.
* Post owners can verify the request via an approve/reject button.
* Users can report fake posts.
* Reported users will have reputation decreased.
* Verified lost/found requests will increase the finder’s reputation score.

# User Classes and Characteristics
## User
*Owners of Lost Items:*
These are individuals who have lost an item and are using the app to report the item as lost and to search for it among items that have been found and reported by others.

*Finders of Lost Items:*
These are individuals who have found a lost item and are using the app to report the item as found and to search for the rightful owner of the item among items that have been reported as lost by others.

*Regular Users:*
These are individuals who use the app to browse lost and found items, search for specific items, and communicate with owners or finders of items.

# Operating Environment
## Development Environment
*Description*
**Front-end**: React Native for Mobile Application
React Native is a User Interface(UI) Software Development Library that is created by Facebook. It allows the development of native apps. Hence, the same codebase could be used to run in both Android and iOS phones
**Backend**: Node.js,Express.js, MongoDB
Authentication is handled by JsonWebToken
All data is stored in MongoDB


## Design and Implementation Constraints
* This application uses local storage for file storage which may be limited.
* This application uses Mongo Atlas for database storage, which is limited at 512MB.
* Security Constraints: Data privacy needs to be protected, hence passwords must be stored as hashes.
* Authentication and Authorization Constraints: The app must be designed to ensure that only authorized users can access sensitive information about lost and found items, such as contact information for the owners.
* Reporting Constraints: The app must be designed to allow users to report lost or found items, including the ability to attach photos and provide detailed descriptions of the items.
* User Interface Constraints: The app must be designed with a user-friendly interface that allows users to easily report lost or found items, search for items, and view the status of their reports.

# User Documentation
No user documentation needed as our app is interactive and intuitive to use, with good labelling to guide users around our app.

# Assumptions and Dependencies
## Dependencies: 
OneMap API

## Assumptions:
* Data obtained from OneMap API are accurate.
* Users have strong internet connection as most data are delivered by the server.
* External Interface Requirements
* User Interfaces
* Login/Sign up Page


# Images of app GUI

## Login Page 
<img src="https://github.com/lemousehunter/SC2006_Meta-4/blob/main/UI%20Images/loginScreen.jpg" height="500">

## Registration Page
<img src="https://github.com/lemousehunter/SC2006_Meta-4/blob/main/UI%20Images/registerScreen.png" height="500">

## HomePage
<img src="https://github.com/lemousehunter/SC2006_Meta-4/blob/main/UI%20Images/homeScreen.png" height="500">

## Create post page
<img src="https://github.com/lemousehunter/SC2006_Meta-4/blob/main/UI%20Images/createEditPost1.png" height="500">
<img src="https://github.com/lemousehunter/SC2006_Meta-4/blob/main/UI%20Images/createEditPost2.png" height="500">

## Post view page
<img src="https://github.com/lemousehunter/SC2006_Meta-4/blob/main/UI%20Images/postView.png" height="500">

## Report page
<img src="https://github.com/lemousehunter/SC2006_Meta-4/blob/main/UI%20Images/report.png" height="500">

## Map page
<img src="https://github.com/lemousehunter/SC2006_Meta-4/blob/main/UI%20Images/mapView.png" height="500">

## Accounts page
<img src="https://github.com/lemousehunter/SC2006_Meta-4/blob/main/UI%20Images/accounts.png" height="500">

## Activity page
<img src="https://github.com/lemousehunter/SC2006_Meta-4/blob/main/UI%20Images/activityScreen.png" height="500">


# Hardware Interfaces
## Mobile Device Interface

**Logical Characteristics**: Lost & Found is designed to run on both Android and iOS devices.
The app will interact with the device's camera and GPS functions to allow users to report and search for lost and found items based on location and visual identification.

**Physical Characteristics**: Lost & Found will be installed and run on the user's mobile device.
The app will utilize the device's camera and GPS hardware to capture images and location data.

## OneMap API Interface

**Logical Characteristics**: Lost & Found utilizes OneMap APIs to display the item locations for a pictorial image of the locations hence increasing the chances of finding lost items.

**Physical Characteristics**: The app will communicate with the OneMapAPI through REST APIs, using JSON data. 


# Software Interfaces
**MongoDB - Version 4.0 or higher**
MongoDB is a NoSQL document database used to store and manage data about lost and found items. The app will communicate with the MongoDB database using the Mongoose ODM library.


**Node.js - Version 12 or higher**
Node.js is an open-source, cross-platform JavaScript runtime environment that allows developers to build scalable, high-performance web applications. The app will use Node.js as the server-side runtime environment.

**Express.js - Version 4.17 or higher**
Express.js is a fast, minimalist web framework for Node.js that provides a set of robust features for web and mobile applications. The app will use Express.js to build the RESTful API endpoints for data communication between the server and client.

**React Native - Version 0.64 or higher**
React Native is an open-source mobile application framework created by Facebook that allows developers to build native mobile apps for iOS and Android using JavaScript and React. The app will use React Native to build the mobile user interface and logic for the app.

# Data items and messages coming into the system and going out include:

## User authentication and authorization data
Lost and found item data, including item descriptions, location data, and contact information for owners and finders
Media files related to lost and found items, such as images 
The purpose of each of these data items and requests is to provide users with the ability to report and search for lost and found items, as well as to manage the ownership and recovery process of these items.

# Services needed include:
## User authentication and authorization services
Database management services for storing and retrieving lost and found item data
Media storage and retrieval services for storing and retrieving media files related to lost and found items
Location-based services for determining the location of lost and found items and users

The nature of communications between these services is RESTful API communication over HTTP or HTTPS protocols.

Data that will be shared across software components includes user authentication data, lost and found item data, and image files related to lost and found items. The data sharing mechanism will be implemented using MongoDB as the database management system and REST APIs for data communication.


## Communications Interfaces
* The communication between frontend and backend will be following HTTPS protocol and TCP/IP network protocol.
* User authentication and authorization will be implemented using token authentication, which will be securely transmitted in the HTTP request header.


