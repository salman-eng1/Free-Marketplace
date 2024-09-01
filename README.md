# Marketplace Service Platform

## Overview

This project is a **Marketplace for Selling Services** built using a microservices architecture. The platform allows users to list, buy, and communicate regarding services in real-time. The system is highly scalable, resilient, and optimized for modern cloud infrastructure.

## Features

- **Microservices Architecture**: Ensures scalability and maintainability.
- **Event-Driven Communication**: Services communicate asynchronously via RabbitMQ.
- **Real-Time Chat & Notifications**: Powered by Socket.IO.
- **API Gateway**: Handles requests and routes them to the appropriate services.
- **CI/CD Pipeline**: Automated builds and deployments using Jenkins.
- **Cloud Deployment**: Managed on AWS EKS with Terraform, Helm, and eksctl.
- **Database Management**: Uses RDS for relational data, MongoDB Cloud for NoSQL, and Elasticsearch Cloud for logging.
- **DNS & Load Balancing**: Managed using Ingress, Route 53, and External DNS on Namecheap.

## Services

- **API Gateway**: Handles requests from external clients and routes them to the appropriate services.
- **Notification Emails**: Sends email notifications to users.
- **Auth Service**: Manages user authentication and authorization.
- **User Service**: Handles user-related data and functionalities.
- **Gigs Service**: Manages service listings and related operations.
- **Chat Service**: Provides real-time messaging between users.
- **Order Service**: Manages orders and transactions.
- **Review Service**: Allows users to leave reviews on services.


## Technologies Used

- **Language**: TypeScript
- **Containerization**: Docker
- **CI/CD**: Jenkins
- **Development Environment**: Minikube
- **Production Environment**: AWS EKS, Terraform, Helm, eksctl
- **Load Balancing & DNS**: Ingress, Route 53, External DNS
- **Databases**: RDS (PostgreSQL, MySQL), MongoDB Cloud, Elasticsearch Cloud

## Infrastructure Diagram

![AWS Infrastructure Diagram](production_infrastructure.png)

*(Attach your infrastructure diagram here)*

## Installation & Setup

### Prerequisites

- Docker
- Minikube
- Kubernetes CLI (kubectl)
- Terraform
- Helm
- AWS CLI
- Jenkins

### Development

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/marketplace-service-platform.git
   cd marketplace-service-platform
