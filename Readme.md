<h1 align="center">📹 PeerSync Video</h1>
<h3 align="center">A Scalable Peer-to-Peer Video Chatting Solution Powered by AWS</h3>

---

## 📖 Introduction

**PeerSync** is a peer-to-peer video calling web application built using HTML, CSS, JavaScript, and various AWS services. This guide outlines the full architecture, setup, and functionality of the application — from authentication to real-time video communication.

---

## 📄 Abstract

PeerSync delivers seamless peer-to-peer video calling via **WebRTC** and leverages AWS for scalability, performance, and security. Key features include:

- 🔑 Passwordless login with magic links
- 👤 Anonymous or authenticated video chats
- 🌍 Fast and secure global access via AWS
- 📡 Direct P2P video via WebRTC + EC2 signaling
- 📬 Email-based interactions using Gmail & EmailJS

---

## 🚀 Overview

PeerSync enables direct browser-to-browser video communication using WebRTC. AWS services manage backend operations like user management, authentication, and messaging.

---

## 🛠️ Technologies Used

<table>
  <tr><th>Frontend</th><td>HTML, CSS, JavaScript, WebRTC</td></tr>
  <tr><th>Backend</th><td>AWS Lambda, API Gateway, DynamoDB</td></tr>
  <tr><th>Infra</th><td>AWS S3, CloudFront, EC2 (WebSocket + FastAPI)</td></tr>
  <tr><th>Other</th><td>EmailJS, Gmail SMTP, Cloudflare (tunneling)</td></tr>
</table>

---

## 🧱 Architecture

<h4>🔹 Frontend</h4>
<ul>
  <li><b>S3 Bucket:</b> <code>cloudfrontendbysai</code></li>
  <li><b>CloudFront:</b> e.g., <code>https://dscvcxccsc.cloudfront.net</code></li>
</ul>

<h4>🔹 Backend API</h4>
<ul>
  <li>Lambda Functions: Signup, Login, Friend Requests</li>
  <li>API Gateway: `/signup`, `/login`, `/send-friend-request`, etc.</li>
</ul>

<h4>🔹 WebRTC Signaling</h4>
<ul>
  <li>EC2 + FastAPI WebSocket Server</li>
  <li>Cloudflare Tunnel: <code>wss://jjnjnjnjnxjzc.trycloudflare.com</code></li>
</ul>

<h4>🔹 DynamoDB Tables</h4>

<table>
  <tr><th colspan="2">Users</th></tr>
  <tr><td><code>email</code></td><td>String (Partition Key)</td></tr>
  <tr><td><code>name</code></td><td>String</td></tr>
  <tr><td><code>createdAt</code></td><td>String</td></tr>
</table>

<br/>

<table>
  <tr><th colspan="2">UserConnections</th></tr>
  <tr><td><code>userEmail</code></td><td>String (Partition Key)</td></tr>
  <tr><td><code>targetEmail</code></td><td>String (Sort Key)</td></tr>
  <tr><td><code>status</code></td><td>String</td></tr>
  <tr><td><code>timestamp</code></td><td>String</td></tr>
</table>

---

## 🔄 Workflow

### ✅ Signup
- Frontend → API Gateway → Lambda → DynamoDB

### 🔐 Login
- Request → Lambda generates magic link
- Frontend uses EmailJS to email:

### 👥 Friend Management
- Friend requests stored in DynamoDB via Lambda
- SMTP (Gmail) sends request notification
- Recipient accepts/rejects via frontend
- Status updated in `UserConnections`

### 📹 Video Calling
- Signaling via WebSocket server on EC2 (FastAPI)
- SDP/ICE exchanged
- Direct WebRTC stream between users

---

## ⚙️ Setup Instructions

<h4>🧰 S3 + CloudFront</h4>

1. Create bucket `cloudfrontendbysai`
2. Upload:
friendcall.html, friendre1.html, home.html, index.html, login.html, main.js, sailbeach.png, signup.html, style.css3. Configure permissions
4. Create CloudFront distribution
- Set default root: `index.html`
- Enable HTTPS

<h4>🗃️ DynamoDB Tables</h4>
(See table structure above)

<h4>⚙️ Lambda & API Gateway</h4>

- Use Python 3.x
- Set ENV vars:
- `SMTP_USER`, `SMTP_PASS`, `API_BASE_URL`
- Create endpoints `/signup`, `/login`, etc.
- Enable CORS
- Attach DynamoDB permissions

<h4>💬 WebSocket Server on EC2</h4>

- Launch EC2 (Amazon Linux 2)
- Install dependencies:
```bash
sudo yum install python3 -y
pip3 install fastapi[all] websockets
Deploy FastAPI WebSocket server
```
Use Tmux to run persistently

Open port 443 in Security Group
<h4>🌐 Cloudflare Tunnel</h4>
Add your domain to Cloudflare

Create a tunnel:

arduino
Copy
Edit
wss://bite-monsters-lifetime-xhtml.trycloudflare.com
Point DNS to the tunnel

<h4>📧 Email</h4>
SMTP via Gmail: App password

EmailJS: For login link (from frontend)

🧰 Key AWS Services Summary
<table> <tr><th>Service</th><th>Purpose</th></tr> <tr><td>S3</td><td>Frontend hosting</td></tr> <tr><td>CloudFront</td><td>HTTPS & CDN</td></tr> <tr><td>DynamoDB</td><td>User & friend data</td></tr> <tr><td>Lambda</td><td>API logic</td></tr> <tr><td>API Gateway</td><td>HTTP routing</td></tr> <tr><td>EC2</td><td>WebSocket signaling</td></tr> <tr><td>Cloudflare</td><td>Tunneling & HTTPS</td></tr> <tr><td>CloudWatch</td><td>Logs and monitoring</td></tr> </table>
<br>
<h1>Access the backend repo here : https://github.com/saimahendra282/solution_architech_py_microservice.git</h1>
<h1> I WILL DELETE ALL THE RESOURCES CREATED ON MAY 3rd and until that date you can use this <a href="You can use it "> link</a> For actual working web</h1>
<h4>Thanks for reading till the end , i will write the medium aritcle about the process soon.. so stay tuned..</h4>
