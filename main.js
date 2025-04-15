let allUsers = [];
function getCookie(name) {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : null;
}

const storedEmail = getCookie("userEmail");
const storedName = getCookie("userName") || "Anonymous";

let callSocket;
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

function waitForSocketConnection(socket, callback) {
  const maxWait = 3000; // Max 3s to wait
  const interval = 100;
  let waited = 0;

  const check = () => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      callback();
    } else if (waited >= maxWait) {
      alert("⚠️ WebSocket not ready. Try again.");
    } else {
      waited += interval;
      setTimeout(check, interval);
    }
  };
  check();
}
// https://bite-monsters-lifetime-xhtml.trycloudflare.com/
// 📞 Setup WebSocket for direct calls
if (storedEmail) {
  callSocket = new WebSocket(`wss://deployed-backend-url/ws-user/${storedEmail}`); // ✅ no const here

  callSocket.onopen = () => {
    console.log("✅ WebSocket connected for direct calls");
    console.log("Socket readyState:", callSocket.readyState);  };

  callSocket.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    // console.log("📞 Incoming message:", msg);
    console.log("📨 Message from WS:", msg.type);


    if (msg.type === "call-request") {
      const accept = confirm(`📞 ${msg.from} is calling you. Accept?`);

      if (accept) {
        callSocket.send(JSON.stringify({
          type: "call-accepted",
          to: msg.from,
          room: msg.room
        }));
        window.location.href = `friendcall.html?room=${msg.room}`;
      } else {
        callSocket.send(JSON.stringify({
          type: "call-rejected",
          to: msg.from
        }));
      }
    }

    if (msg.type === "call-rejected") {
      alert("🚫 Call rejected by your friend.");
    }

    if (msg.type === "call-accepted") {
      window.location.href = `friendcall.html?room=${msg.room}`;
    }
  };

  callSocket.onclose = () => {
    console.warn("🔌 WebSocket closed");
  };
}
// 🔁 Fetch all users (except current one)
async function fetchAllUsers() {
  try {
    const res = await fetch("aws-api-gateway-url/allusers");
    const data = await res.json();
    allUsers = (data.users || []).filter(user => user.email !== storedEmail);
  } catch (err) {
    console.error("Error fetching users:", err);
  }
}

// 👥 Render search results
function renderSearchResults(results) {
  const container = document.getElementById("search-results");
  container.innerHTML = "";

  if (results.length === 0) {
    container.innerHTML = `<p style="text-align: center; color: red;">No matching users found</p>`;
    return;
  }

  results.forEach(user => {
    const row = document.createElement("div");
    row.style = `
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #f9f9f9;
      padding: 10px 15px;
      margin-bottom: 5px;
      border-radius: 8px;
      box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
    `;

    row.innerHTML = `
      <div>
        <strong>${user.name}</strong><br/>
        <small>${user.email}</small>
      </div>
      <button style="border: none; background: none; font-size: 20px; cursor: pointer;" title="Send Friend Request">📤</button>
    `;

    row.querySelector("button").addEventListener("click", async () => {
      try {
        const res = await fetch("aws api gateway url /send-friend-request", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fromEmail: storedEmail,
            toEmail: user.email
          })
        });

        const result = await res.json();

        if (res.ok) {
          alert(`✅ Friend request sent to ${user.name}`);
        } else {
          alert(`❌ Failed: ${result.error || 'Request failed'}`);
        }
      } catch (err) {
        console.error("Error sending request:", err);
        alert("Something went wrong while sending the request.");
      }
    });

    container.appendChild(row);
  });
}

// 👥 Fetch & Render Friends
async function fetchAndRenderFriends() {
  try {
    const res = await fetch("aws api gateway url/get-friends", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: storedEmail })
    });

    const data = await res.json();
    const friends = data.friends || [];

    const container = document.getElementById("friendCards");
    container.innerHTML = "";

    if (friends.length === 0) {
      container.innerHTML = "<p>No friends yet. Send some requests!</p>";
      return;
    }

    friends.forEach(friend => {
      const card = document.createElement("div");
card.className = "user-card";
card.style.cssText = `
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 10px;
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  margin-bottom: 10px;
`;

card.innerHTML = `
  <div style="display: flex; flex-direction: column;">
    <span style="font-weight: 600; font-size: 16px; color: #2c3e50;">${friend.name}</span>
    <span style="font-size: 14px; color: #666;">${friend.email}</span>
  </div>
  <button
    class="call-btn"
    data-email="${friend.email}"
    style="
      background-color:rgb(80, 95, 119);
      color: white;
      border: none;
      padding: 8px 12px;
      font-size: 16px;
      border-radius: 8px;
      cursor: pointer;
    "
  >📞 Call</button>
`;


      card.querySelector(".call-btn").addEventListener("click", () => {
        const roomId = generateUUID();

        fetch("https://backend deployed domain here/create-room", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ room_id: roomId, name: storedName })
        })
          .then(res => res.json())
          .then(() => {
            waitForSocketConnection(callSocket, () => {
              callSocket.send(JSON.stringify({
                type: "call-request",
                from: storedEmail,
                to: friend.email,
                room: roomId
              }));
              alert(`📞 Calling ${friend.name}...`);
            });
            
          })
          .catch(err => {
            console.error("Error creating call room:", err);
          });
      });

      container.appendChild(card);
    });
  } catch (err) {
    console.error("❌ Error fetching friends:", err);
  }
}

// 🔍 Setup live search bar
function setupLiveUserSearch() {
  const searchInput = document.getElementById("user-search");
  searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase();
    if (!query) {
      renderSearchResults([]);
      return;
    }

    const filtered = allUsers.filter(user =>
      user.name.toLowerCase().includes(query) || user.email.toLowerCase().includes(query)
    );

    renderSearchResults(filtered);
  });
}

// ✅ EmailJS Login + Signup Setup
function setupEmailJS() {
  emailjs.init("email js service id"); // ✅ Your public key

  const signupBtn = document.querySelector(".submit-btn");
  if (signupBtn) {
    signupBtn.addEventListener("click", async () => {
      const name = document.querySelectorAll(".input-field")[0].value.trim();
      const email = document.querySelectorAll(".input-field")[1].value.trim();

      if (!name || !email) {
        alert("Please fill out both name and email.");
        return;
      }

      try {
        const res = await fetch("aws-api-gateway-url/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email })
        });

        const data = await res.json();
        if (res.ok) {
          alert("Signup successful! 🎉");
          window.location.href = "login.html";
        } else {
          alert(data.error || "Signup failed.");
        }
      } catch (err) {
        console.error("Signup error:", err);
        alert("Something went wrong.");
      }
    });
  }

  const loginBtn = document.querySelector(".login-btn");
  if (loginBtn) {
    loginBtn.addEventListener("click", async () => {
      const email = document.querySelector(".login-input").value.trim();
      if (!email) {
        alert("Please enter your email.");
        return;
      }

      try {
        const res = await fetch("aws-api-gateway-url/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email })
        });

        const data = await res.json();

        if (!res.ok) {
          alert(data.error || "Login failed.");
          return;
        }

        const magicLink = data.magic_link;

        await emailjs.send("email js srevice id", "email js template id", {
          to_email: email,
          name: "User",
          magic_link: magicLink
        });

        alert("✅ Plese check your inbox to login");
      } catch (err) {
        console.error("Login error:", err);
        alert("Something went wrong during login.");
      }
    });
  }
}

// ✅ DOM Content Loaded
document.addEventListener("DOMContentLoaded", async () => {
  setupEmailJS();

  // Only run these if on home.html (where the elements exist)
  const onHomePage = !!document.getElementById("friendCards");

  if (onHomePage) {
    await fetchAllUsers();
    await fetchAndRenderFriends();
    setupLiveUserSearch();
  }
});

