# AI Bug Bounty Automation System 

Sahyadri College Of Engineering and Management

A comprehensive AI bug bounty system integrated with inbuilt Headerless Kali Container, AI-powered chat assistance. The system uses a distributed architecture to provide intelligent command suggestions, automated tool execution, and report generation on the basis of different vulnerabilities that are present in websites.

## 📋 Table of Contents
- [System Overview](#-system-overview)
- [Architecture](#-architecture)
- [Components](#-components)
- [Setup & Installation](#-setup--installation)
- [Usage](#-usage)


## 🔍 System Overview

The AI Bug Bounty Automation System is designed to streamline and automate security testing processes by combining:
- AI-powered command suggestions
- Automated tool execution
- Intelligent result analysis
- reporting

## 🏗 Architecture
![image](https://github.com/user-attachments/assets/8dbece6a-3882-494a-ade7-1017ba0e0961)


The system consists of several key layers

## Tech Stacks included
- **Frontend**
   - React.js for an intuitive web dashboard
   - Typescript for type safety
- **Backend**
   - Python, Fast API for backend servers
   - Node.js, Express.js
   - Dockerized Kali Headless OS
   - Langchain 
  

## 🔧 Components

### 1. User Interface
- **Web Dashboard**: Modern web interface for:
  - Tool configuration
  - Report generation
- ** Real Time Kali Terminal**: Command-line interface for direct tool interaction

### 2. AI Engine
- **Command Suggestion Engine**
  - Intelligent tool selection
  - Context-aware suggestions
  - Vulnerability assessment

### 3. Tool Execution Layer
Dockerized security tools including:
- **Nikto**: Web server scanner
- **Subfinder**: Subdomain discovery
- **Amass**: Attack surface mapping
- **SQLMap**: SQL injection testing
- **Nmap**: Network scanning
- **Nuclei**: Vulnerability scanner
- Other kali tools..

### 4. Result Processing & Storage
- **Report Generator**: Creates detailed security reports
- **Log Processor**: Centralizes and analyzes tool outputs

## 📥 Setup & Installation

### Prerequisites
- Python 3.8+
- Docker & Docker Compose


### Local Setup

1. **Clone the Repository**
```bash
git clone 

```

2. **Install Dependencies**
```bash
pip install -r requirements.txt
```

3. **Start Docker Containers**
```bash
./start-kali.sh
```

3. **Start all servers**
```bash
./main.sh
```


### AI Engine Settings
```yaml
ai_engine:
  model: "codellama/CodeLlama-7b-Instruct-hf"
```

## 🔒 Security Considerations

- All tools run in isolated Docker containers
- Rate limiting implemented for API endpoints
- Authentication required for sensitive operations
- Results encrypted at rest


Built with ❤️ by Radiant Processor



