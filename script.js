// Global state
let currentUser = null;
let users = [];

// Load data on page load
document.addEventListener("DOMContentLoaded", function () {
  loadUsersFromJSON();
  setupEventListeners();
  checkLoggedIn();
});

// Setup event listeners
function setupEventListeners() {
  const registerForm = document.getElementById("registerForm");
  const loginForm = document.getElementById("loginForm");

  if (registerForm) {
    registerForm.addEventListener("submit", handleRegister);
  }

  if (loginForm) {
    loginForm.addEventListener("submit", handleLogin);
  }
}

// Load users from JSON (simulated - in production this would be from a server)
function loadUsersFromJSON() {
  // Sample data - in a real application, this would come from a backend server
  users = [
    {
      id: 1,
      fullName: "John Smith",
      email: "john@example.com",
      password: "password123",
      accountType: "teacher",
      subject: "Mathematics",
      bio: "Experienced mathematics teacher with 10 years of expertise in algebra and calculus.",
      profilePicture: "https://via.placeholder.com/200?text=John+Smith",
      phone: "555-0101",
      location: "New York, USA",
      registeredDate: "2025-01-01",
    },
    {
      id: 2,
      fullName: "Emma Johnson",
      email: "emma@example.com",
      password: "password456",
      accountType: "teacher",
      subject: "English Literature",
      bio: "Passionate about teaching English literature and creative writing. Available for online tutoring.",
      profilePicture: "https://via.placeholder.com/200?text=Emma+Johnson",
      phone: "555-0102",
      location: "London, UK",
      registeredDate: "2025-01-05",
    },
    {
      id: 3,
      fullName: "Alex Chen",
      email: "alex@example.com",
      password: "password789",
      accountType: "student",
      subject: "Programming",
      bio: "Computer science student looking to learn web development and Python.",
      profilePicture: "https://via.placeholder.com/200?text=Alex+Chen",
      phone: "555-0103",
      location: "San Francisco, USA",
      registeredDate: "2025-01-10",
    },
    {
      id: 4,
      fullName: "Sofia Garcia",
      email: "sofia@example.com",
      password: "password101",
      accountType: "teacher",
      subject: "Spanish Language",
      bio: "Native Spanish speaker teaching Spanish language and culture. Beginner to advanced levels.",
      profilePicture: "https://via.placeholder.com/200?text=Sofia+Garcia",
      phone: "555-0104",
      location: "Madrid, Spain",
      registeredDate: "2025-01-12",
    },
  ];

  // Load from localStorage if available
  const storedUsers = localStorage.getItem("educonnect_users");
  if (storedUsers) {
    users = JSON.parse(storedUsers);
  }
}

// Save users to localStorage (simulating JSON storage)
function saveUsersToJSON() {
  localStorage.setItem("educonnect_users", JSON.stringify(users));
  // In production, this would send data to a backend server
}

// Register handler
function handleRegister(e) {
  e.preventDefault();

  const fullName = document.getElementById("fullName").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const accountType = document.getElementById("accountType").value;
  const subject = document.getElementById("subject").value.trim();
  const bio = document.getElementById("bio").value.trim();
  const profilePicture =
    document.getElementById("profilePicture").value.trim() ||
    "https://via.placeholder.com/200?text=" + encodeURIComponent(fullName);
  const phone = document.getElementById("phone").value.trim();
  const location = document.getElementById("location").value.trim();

  // Validation
  if (!fullName || !email || !password || !accountType || !subject) {
    showMessage("Please fill in all required fields", "error");
    return;
  }

  // Check if email already exists
  if (users.some((user) => user.email === email)) {
    showMessage(
      "Email already registered. Please use a different email.",
      "error",
    );
    return;
  }

  // Create new user
  const newUser = {
    id: users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1,
    fullName,
    email,
    password,
    accountType,
    subject,
    bio,
    profilePicture,
    phone,
    location,
    registeredDate: new Date().toISOString().split("T")[0],
  };

  users.push(newUser);
  saveUsersToJSON();

  showMessage(
    `Registration successful! Welcome, ${fullName}. Please login to your account.`,
    "success",
  );

  setTimeout(() => {
    document.getElementById("registerForm").reset();
    showSection("login");
  }, 2000);
}

// Login handler
function handleLogin(e) {
  e.preventDefault();

  const loginEmail = document.getElementById("loginEmail").value.trim();
  const loginPassword = document.getElementById("loginPassword").value;

  const user = users.find(
    (u) => u.email === loginEmail && u.password === loginPassword,
  );

  if (!user) {
    showMessage("Invalid email or password", "error");
    return;
  }

  currentUser = user;
  localStorage.setItem("educonnect_currentUser", JSON.stringify(user));

  showMessage(`Welcome back, ${user.fullName}!`, "success");

  setTimeout(() => {
    document.getElementById("loginForm").reset();
    showSection("home");
    updateNavbar();
  }, 1500);
}

// Show section
function showSection(sectionId) {
  // Hide all sections
  const sections = document.querySelectorAll(".section");
  sections.forEach((section) => section.classList.remove("active"));

  // Show selected section
  const selectedSection = document.getElementById(sectionId);
  if (selectedSection) {
    selectedSection.classList.add("active");
  }

  // Handle specific section logic
  if (sectionId === "profile") {
    displayProfile();
  } else if (sectionId === "search") {
    displayAllUsers();
  }
}

// Display profile
function displayProfile() {
  const profileContent = document.getElementById("profileContent");

  if (!currentUser) {
    profileContent.innerHTML =
      '<p class="login-prompt">Please <a href="#" onclick="showSection(\'login\')">login</a> to view your profile</p>';
    return;
  }

  const profileHTML = `
        <div class="profile-card">
            <div class="profile-picture-section">
                <img src="${currentUser.profilePicture}" alt="${currentUser.fullName}" class="profile-picture">
            </div>
            <div class="profile-info">
                <h3>${currentUser.fullName}</h3>
                <span class="profile-type">${currentUser.accountType}</span>
                <div class="profile-detail">
                    <span class="profile-detail-label">Subject/Expertise:</span> ${currentUser.subject}
                </div>
                <div class="profile-detail">
                    <span class="profile-detail-label">Email:</span> ${currentUser.email}
                </div>
                <div class="profile-detail">
                    <span class="profile-detail-label">Phone:</span> ${currentUser.phone || "Not provided"}
                </div>
                <div class="profile-detail">
                    <span class="profile-detail-label">Location:</span> ${currentUser.location || "Not provided"}
                </div>
                <div class="profile-detail">
                    <span class="profile-detail-label">Bio:</span> ${currentUser.bio}
                </div>
                <div class="profile-detail">
                    <span class="profile-detail-label">Member Since:</span> ${currentUser.registeredDate}
                </div>
                <div class="profile-buttons">
                    <button class="edit-btn" onclick="editProfile()">Edit Profile</button>
                    <button class="delete-btn" onclick="deleteAccount()">Delete Account</button>
                </div>
            </div>
        </div>
    `;

  profileContent.innerHTML = profileHTML;
}

// Edit profile
function editProfile() {
  if (!currentUser) return;

  const newBio = prompt("Enter new bio:", currentUser.bio);
  if (newBio === null) return;

  const newPhone = prompt("Enter new phone:", currentUser.phone);
  if (newPhone === null) return;

  const newLocation = prompt("Enter new location:", currentUser.location);
  if (newLocation === null) return;

  const newProfilePicture = prompt(
    "Enter new profile picture URL:",
    currentUser.profilePicture,
  );
  if (newProfilePicture === null) return;

  // Update user
  const userIndex = users.findIndex((u) => u.id === currentUser.id);
  if (userIndex !== -1) {
    users[userIndex].bio = newBio;
    users[userIndex].phone = newPhone;
    users[userIndex].location = newLocation;
    users[userIndex].profilePicture = newProfilePicture;

    currentUser = users[userIndex];
    localStorage.setItem("educonnect_currentUser", JSON.stringify(currentUser));
    saveUsersToJSON();

    showMessage("Profile updated successfully!", "success");
    displayProfile();
  }
}

// Delete account
function deleteAccount() {
  if (!currentUser) return;

  if (
    confirm(
      "Are you sure you want to delete your account? This action cannot be undone.",
    )
  ) {
    users = users.filter((u) => u.id !== currentUser.id);
    saveUsersToJSON();
    logout();
    showMessage("Account deleted successfully", "success");
  }
}

// Search users
function searchUsers() {
  const searchInput = document
    .getElementById("searchInput")
    .value.toLowerCase();
  const filterType = document.getElementById("filterType").value;

  const filtered = users.filter((user) => {
    const matchesSearch =
      user.fullName.toLowerCase().includes(searchInput) ||
      user.subject.toLowerCase().includes(searchInput);
    const matchesType = !filterType || user.accountType === filterType;
    return matchesSearch && matchesType;
  });

  displaySearchResults(filtered);
}

// Display all users
function displayAllUsers() {
  displaySearchResults(users);
}

// Display search results
function displaySearchResults(results) {
  const searchResults = document.getElementById("searchResults");

  if (results.length === 0) {
    searchResults.innerHTML =
      '<div class="no-results">No users found matching your search criteria.</div>';
    return;
  }

  const cardsHTML = results
    .map(
      (user) => `
        <div class="user-card">
            <div class="user-card-header">
                <img src="${user.profilePicture}" alt="${user.fullName}" class="user-card-image">
            </div>
            <div class="user-card-body">
                <div class="user-card-name">${user.fullName}</div>
                <span class="user-card-type">${user.accountType}</span>
                <div class="user-card-subject">📚 ${user.subject}</div>
                <div class="user-card-bio">${user.bio}</div>
                <div class="user-card-details">📍 ${user.location || "Location not provided"}</div>
                <div class="user-card-details">📞 ${user.phone || "Phone not provided"}</div>
                <div class="user-card-footer">
                    <button class="contact-btn" onclick="contactUser(${user.id})">Contact User</button>
                </div>
            </div>
        </div>
    `,
    )
    .join("");

  searchResults.innerHTML = cardsHTML;
}

// Contact user
function contactUser(userId) {
  const user = users.find((u) => u.id === userId);
  if (user) {
    const message = `Contact ${user.fullName}?\n\nEmail: ${user.email}\nPhone: ${user.phone || "Not provided"}\n\nYou can send them an email or call them directly.`;
    alert(message);
  }
}

// Show message
function showMessage(message, type) {
  const messageDiv = document.createElement("div");
  messageDiv.className = `${type}-message`;
  messageDiv.textContent = message;

  // Insert at the top of the current active section
  const activeSection = document.querySelector(".section.active");
  if (activeSection) {
    activeSection.insertBefore(messageDiv, activeSection.firstChild);
  }

  // Remove message after 5 seconds
  setTimeout(() => {
    messageDiv.remove();
  }, 5000);
}

// Logout
function logout() {
  currentUser = null;
  localStorage.removeItem("educonnect_currentUser");
  showSection("home");
  updateNavbar();
  showMessage("Logged out successfully", "success");
}

// Update navbar based on login status
function updateNavbar() {
  const logoutBtn = document.querySelector(".logout-btn");
  if (currentUser) {
    logoutBtn.style.display = "block";
  } else {
    logoutBtn.style.display = "none";
  }
}

// Check if user is logged in on page load
function checkLoggedIn() {
  const storedUser = localStorage.getItem("educonnect_currentUser");
  if (storedUser) {
    currentUser = JSON.parse(storedUser);
    // Verify user still exists in users array
    const userExists = users.find((u) => u.id === currentUser.id);
    if (userExists) {
      updateNavbar();
    } else {
      localStorage.removeItem("educonnect_currentUser");
      currentUser = null;
    }
  }
  updateNavbar();
}

// Export users as JSON (for backup purposes)
function exportUsersJSON() {
  const dataStr = JSON.stringify(users, null, 2);
  const dataBlob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "educonnect_users.json";
  link.click();
}
