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


## **Technical Implementation**

##### Fronted/Backend: 
* <img src="https://reactjs.org/favicon.ico" width="16px" height="16px"> [React](https://reactjs.org/) - A widely recognized JavaScript library for building user interfaces,

* <img src="https://nodejs.org/static/logos/jsIconGreen.svg" width="16px" height="16px"> [Node.js](https://nodejs.org/) - Versatile JavaScript runtime known for its non-blocking, event-driven architecture. This provided an integrated environment for both the front-end and back-end of our application, enabling features like live stock updates, real-time trade executions, and instant notifications.

* <img src="https://spring.io/img/favicon.ico" width="16px" height="16px"> [Spring Boot](https://spring.io/projects/spring-boot) - Open-source Java framework used to create microservices, chosen for its ability to rapidly build production-grade Spring-based applications.

* <img src="https://kafka.apache.org/favicon.ico" width="16px" height="16px"> [Kafka](https://kafka.apache.org/) - An open-source distributed event streaming platform, employed to ensure high-performance data pipelines, streaming analytics, and seamless data integration across the platform.

* <img src="https://www.java.com/favicon.ico" width="16px" height="16px"> [Java](https://www.java.com/) - A widely-used programming language selected for its familiarity to our team and its proven track record in web application development, reducing development time.

* <img src="https://www.mongodb.com/assets/images/global/favicon.ico" width="16px" height="16px"> [MongoDB](https://www.mongodb.com/) (Database) - NoSQL database chosen for its scalability, high performance, and flexible schema-less data model, perfectly suited to the adaptable nature of the trading platform.

##### Design:

* [Event Sourcing (Architectural Pattern)](https://learn.microsoft.com/en-us/azure/architecture/patterns/event-sourcing) - Logs all system state changes, facilitating data analysis, system state replays, and a comprehensive audit trail. This approach enhances scalability, reliability, and the ability to rewind system states in case of errors.

* [CQRS (Architectural Pattern)](https://learn.microsoft.com/en-us/azure/architecture/patterns/cqrs) - Separates read and write operations for improved performance and scalability. This enabled us to optimize data handling and efficiently manage the high volume of database requests inherent to a trading platform.

* <img src="https://cdn4.iconfinder.com/data/icons/logos-brands-in-colors/3000/figma-logo-512.png" width="16px" height="16px"> [Figma](https://www.figma.com/) - A collaborative design tool used for creating, sharing, and testing designs, facilitating seamless communication and faster decision-making among our team.

* <img src="https://getbootstrap.com/docs/5.0/assets/img/favicons/favicon.ico" width="16px" height="16px"> [Bootstrap](https://getbootstrap.com/) - Free, open-source CSS framework employed for responsive, mobile-first front-end development, providing pre-built components for rapid prototyping and efficient UI creation.

* <img src="https://www.adobe.com/favicon.ico" width="16px" height="16px"> [Adobe Illustrator](https://www.adobe.com/products/illustrator.html) - Vector graphics editor used to create scalable illustrations and logos, ensuring a professional and visually appealing design for the platform.

* <img src="https://sass-lang.com/favicon.ico" width="16px" height="16px"> [SASS](https://sass-lang.com/) - CSS preprocessor leveraged for maintaining well-organized stylesheets, making it easier to share and reuse design elements across the project.

##### Documentation:

* <img src="https://plantuml.com/favicon.ico" width="16px" height="16px"> [PlantUml](https://plantuml.com/) - Tool for generating diagrams from a simple textual description, streamlining the creation of various types of diagrams for documentation purposes.

* <img src="https://app.diagrams.net/favicon.ico" width="16px" height="16px"> [Draw.io](https://app.diagrams.net/) - A free online diagram software utilized to create flowcharts, process diagrams, and other visualizations to aid in understanding the system's architecture and workflows.

* <img src="https://www.markdownguide.org/favicon.ico" width="16px" height="16px"> [Markdown](https://www.markdownguide.org/) - Lightweight markup language used to format the project documentation, ensuring clear and easily readable content.

**Learn More**

For a detailed look at our project, please see the [complete documentation on our GitHub website](https://ud-cps491-24s-team.github.io/Team02-FinancialExchange-Public/).

If you would like more details regarding further documentation or how this project was created, please reach out to me or any of my team members directly via our LinkedIns visible on the link above.
