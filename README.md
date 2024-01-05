# WatchTower - Shift Tracking System

## Overview
This project, developed within the scope of the Ankara University Computer Engineering graduation project, is a "Shift Tracking System." It has been created through collaborative efforts by [Ayhan Allahverdiyev](https://github.com/AyhanAllahverdiyev) and [Filiz Salnur](https://github.com/filizsalnur). The mobile code repository can be found at [WatchTower-Mobile](https://github.com/filizsalnur/WatchTower-Mobile).

---

## Description
WatchTower is a comprehensive Shift Tracking System designed to streamline and enhance shift management using NFC technology. The system provides real-time tracking of security guards' activities, evaluates performance, records shift passage times, and allows quick communication through an emergency alarm button. Managers can add/update shift tracking points, and the system ensures effective user authorization management.

## Features
- Utilizing NFC technology for streamlined updates and efficient tracking within the system.
- Enabling real-time performance assessment of security guards, providing insights for effective management.
- Recording passage times at shift tracking points, ensuring accurate and detailed monitoring of activities.


## Contributors
- [Ayhan Allahverdiyev](https://github.com/AyhanAllahverdiyev)
- [Filiz Salnur](https://github.com/filizsalnur)


## Programming Language Choice
Node.js has been chosen as the programming language for the backend of the project due to several advantages it provides:
- Planned use of JavaScript-based technologies like React or Angular for website development in later stages, ensuring compatibility with Node.js. This maintains consistency by keeping the entire project on a single language foundation.
- The existing expertise of the development team in Node.js contributes to the rapid development and smooth management of the project.
- Integration with MongoDB is straightforward, enhancing the efficiency and smoothness of database operations.
- Node.js utilizes the V8 engine within Chrome for server-side processing, leading to faster execution and improved project performance.
- Node.js, being lightweight and fast, aligns with the project's overarching goal of effective operation on mobile devices.

## Database Choice
MongoDB is preferred over SQL-based database systems for the following reasons:
- MongoDB's document-based structure allows storing data with JSON-like documents, providing a more suitable and organized data modeling for the project's requirements.
- The flexible schema design of MongoDB facilitates a dynamic and variable database schema, adapting quickly to needs during the development process.
- The document-based structure of MongoDB enables quick and simple database operations.
- MongoDB being open-source contributes to cost-effectiveness, and its scalable nature provides a suitable solution as the project grows and data volume increases.
- Focused on mobile application development, MongoDB's lightweight and fast capabilities better meet the project's requirements.

## Data Modeling
The database structure used in the project is illustrated in Figure 2.1. Data models and some of their functions are listed in this section.

![image](https://github.com/filizsalnur/WatchTower-Backend/assets/92436947/62a14b6f-8f88-49e4-bc9d-5d02780a4634)

**Figure 2.1 Database Schematic Diagram**

### Tag_Order (Tag Order)
The Tag_Order collection stores data for each card reading operation, providing an essential data storage unit to facilitate data analysis and learning processes for artificial intelligence in later stages of the project. Each Tag_Order document includes the reading status of a tag in a specific order. For instance, each card reading during a security guard's tour is recorded in this collection. This enables the system to perform a detailed analysis of the security guard's tour and make predictions for future events.

### Session
The Session collection represents sessions initiated by each user to cover multiple tours. The `isActive` boolean variable allows determining whether a user has an active session. This feature enables the system to monitor and manage the real-time status more effectively. Additionally, starting and finishing tour operations by users are recorded in this collection, ensuring traceability of past tours.

### User
The User collection includes basic information about registered users. The `auth_level` field, in particular, determines the user's role. There are three different role levels: admin, super_admin, and user. This structure is used to track and manage users with different authorization levels in the system. Users with admin authorization can manage security guards and sessions in the system, while users with super_admin authorization can manage the general system configuration and the authorization levels of other users. Users with user authorization can view and start/finish their own tours.

### Tag Order and Session Relationship
The Tag_Order collection keeps track of each tag individually and specifies the order of read-write operations. This information is also stored as an updated tag order array in the `tagOrderIsRead` field within the Session collection. This relationship determines the status and order of tags within each session, allowing security guards to track which tag they read and its sequence. This provides the system with more information for analyzing past sessions and planning future tours.

## NFC Card Reading Process Flowchart
Figure 4.1 presents a simplified process flowchart for the NFC card reading process. The flowchart illustrates the basic functioning of the card reading process, which can be utilized to understand fundamental processes related to card management in the project.

![image](https://github.com/filizsalnur/WatchTower-Backend/assets/92436947/67d1b7b0-2c48-478a-8397-80c11a3219e3)


**Figure 4.1 Simplified process flowchart for the reading feature**
