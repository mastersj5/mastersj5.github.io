---
layout: page
title: Iceberg - Financial Exchange
description: A Robust, Secure Trading Platform
img: assets/img/finexchlanding.png
importance: 1
category: work
related_publications: false
---

### Iceberg Landing Page

<img src="/assets/img/icebergLandingPage.png" alt="Iceberg Financial Exchange Landing Page" width="400">

### Iceberg Logo

![Iceberg Logo](/assets/img/iceberglogo.png){:width="200"}

## Project Overview

Iceberg is a Financial Exchange platform that allows users to create an account, place bids and offers, and view their order history and status. The Iceberg monolith consists of seven microservices which consists of a front-end website, a Start of Day Data Loader, a Client Port, an Event Sequencer, a Matching Engine, an Event Logger, and a Database Writer.


## Project Context and Scope

The goal of the project is to create a simple stock trading interface, similar to that of Robinhood. Features in the initial draft of the project include: registering as a user, viewing stocks on the market, creating and canceling orders, viewing their current positions, and viewing their order history and status. This will be accomplished via communication between the website and a Client Port. This Client Port will then send private commands to a sequencer which will generate public events for the rest of the Iceberg monolith. The information in the events will be used to update the system in various aspects, including but not limited to: updating user positions, updating an order book, and updating user account information.

#### Client Side

- On the client side: The website is serving as the frontend interface for users. This is where users are able to interact with the system, which incudes submitting orders and viewing positions. The user interface is built using React.

#### Server Side

- The server side contains several microservices that process commands and events within the system. 

   - **Exchange Client Port:** Acting as a gateway between the website and the rest of the monolith. Translating request bodies from the website to commands for the exchange. Additionally, the client exchange provides the website with real time data from the aggregate database.

   - **Event Stream Sequencer:** Receives commands and generates corresponding events, assigning unique identifiers in the process. For order commands it will perform the necessary validation for them. 

   - **Matching Engine:** Acting as the core component that matches buy and sell orders in a trading system. It is critical for exchange, ensuring that trades are executed according to the rules of the market.


   - **Database Writer:** Reads from the event stream and updates the aggregate database with the current data.

   - **Event Logger:** Reads from the event stream and logs events as they occur to a human readable text file.


**Technical Implementation**

##### Fronted/Backend: 
* <img src="https://reactjs.org/favicon.ico" width="16px" height="16px"> [React](https://reactjs.org/) - React is a widely recognized JavaScript library in developing UI systems, changing the way web applications are built because it offers efficiency and flexibility.

* <img src="https://nodejs.org/static/logos/jsIconGreen.svg" width="16px" height="16px"> [Node.js](https://nodejs.org/) - Node.js, is a flexible JavaScript runtime that is very well known for the non-blocking, event-driven architecture that it features. This is an integrated environment for our application's frontend and backend. It therefore makes for the ideal support to live stock updates, trade executions, instant user notifications and prepares the robust and scalable basis that our platform's complex features demand.

* <img src="https://spring.io/img/favicon.ico" width="16px" height="16px"> [Spring Boot](https://spring.io/projects/spring-boot) - Spring Boot is an open-source Java framework used to create a microservice. Spring Boot is used for programming standalone, production-grade Spring-based applications with minimal effort.

* <img src="https://kafka.apache.org/favicon.ico" width="16px" height="16px"> [Kafka](https://kafka.apache.org/) - Apache Kafka is an open-source distributed event streaming platform used by thousands of companies for high-performance data pipelines, streaming analytics, data integration, and mission-critical applications.

* <img src="https://www.java.com/favicon.ico" width="16px" height="16px"> [Java](https://www.java.com/) - Java is a widely-used programming language for coding web applications. It has been a popular choice among developers for over two decades, with millions of Java applications in use today. We chose to use Java due to our team having previous experience working in Java, which in turn reduced the development time.

* <img src="https://www.mongodb.com/assets/images/global/favicon.ico" width="16px" height="16px"> [MongoDB](https://www.mongodb.com/) (Database) - We chose a MongoDB-based NoSQL database, among other things, owing to its high performance, availability, and scalability. This schemaless feature enables the storage of data in a flexible, adaptable format, basically with the adaptability the trading platform required.

##### Design:

* [Event Sourcing (Architectural Pattern)](https://learn.microsoft.com/en-us/azure/architecture/patterns/event-sourcing) - Event sourcing enables our system to scale and persistently interact with complex data. It logs all state changes that occur in the system, facilitating comprehensive data analysis and enabling microservices to replay system states. This design approach ensures an accurate audit trail across our system, making it easier to find issues in the system. The approach also empowers system-wide state rewinding, which is useful in case of a system malfunction.

* [CQRS (Architectural Pattern)](https://learn.microsoft.com/en-us/azure/architecture/patterns/cqrs) - Command and Query Responsibility Segregation (CQRS) separates the read from the write operations in our application, optimally implementing performance and scalability. The division allows one to develop specifically tailored models for read and write operations separately, which speeds up and enhances the insertion and updating process. CQRS is especially suitable for our trading platform needs, as it is powerful for managing a large quantity of database requests.

* <img src="https://cdn4.iconfinder.com/data/icons/logos-brands-in-colors/3000/figma-logo-512.png" width="16px" height="16px"> [Figma](https://www.figma.com/) - Figma is a design tool for creating, sharing, and testing designs for websites, mobile apps, and other digital products and experiences. It is a popular tool for designers, product managers, writers, and developers, and helps anyone involved in the design process contribute, give feedback, and make better decisions, faster.

* <img src="https://getbootstrap.com/docs/5.0/assets/img/favicons/favicon.ico" width="16px" height="16px"> [Bootstrap](https://getbootstrap.com/) - Bootstrap is a free and open-source CSS framework directed at responsive, mobile-first front-end web development. It contains HTML, CSS, and JavaScript-based design templates for typography, forms, buttons, navigation, and other interface components.

* <img src="https://www.adobe.com/favicon.ico" width="16px" height="16px"> [Adobe Illustrator](https://www.adobe.com/products/illustrator.html) - Adobe Illustrator is a vector graphics editor by Adobe Inc., used for creating scalable illustrations, logos, and graphics. It offers precise drawing tools and integrates well with other Adobe applications, making it a favorite among designers.

* <img src="https://sass-lang.com/favicon.ico" width="16px" height="16px"> [SASS](https://sass-lang.com/) - Sass is a stylesheet language that’s compiled to CSS. It allows you to use variables, nested rules, mixins, functions, and more, all with a fully CSS-compatible syntax. Sass helps keep large stylesheets well-organized and makes it easy to share design within and across projects.

##### Documentation:

* <img src="https://plantuml.com/favicon.ico" width="16px" height="16px"> [PlantUml](https://plantuml.com/) - It is a versatile component that enables swift and straightforward diagram creation. Users can draft a variety of diagrams using a simple and intuitive language.

* <img src="https://app.diagrams.net/favicon.ico" width="16px" height="16px"> [Draw.io](https://app.diagrams.net/) - It is free online diagram software for making flowcharts, process diagrams, org charts, UML, ER and network diagrams.

* <img src="https://www.markdownguide.org/favicon.ico" width="16px" height="16px"> [Markdown](https://www.markdownguide.org/) - Markdown is a lightweight markup language that you can use to add formatting elements to plaintext text documents.

**Learn More**

For a detailed look at our project, please see the [complete documentation on our GitHub website](https://ud-cps491-24s-team.github.io/Team02-FinancialExchange-Public/).

If you would like more details regarding further documentation or how this project was created, please reach out to me or any of my team members directly via our LinkedIns visible on the link above.
