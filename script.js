let currentUser = null;
let users = [];

document.addEventListener("DOMContentLoaded", function () {
  loadUsersFromJSON();
  setupEventListeners();
  checkLoggedIn();
});

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

function loadUsersFromJSON() {
  users = [
    {
      id: 1,
      fullName: "Kendrick Lamar",
      email: "kendrick@example.com",
      password: "password123",
      accountType: "teacher",
      subject: "Advanced Mathematics",
      bio: "Experienced teacher helping students master calculus, algebra, and advanced mathematical concepts.",
      profilePicture: "https://via.placeholder.com/200?text=Kendrick+Lamar",
      phone: "555-0101",
      location: "Compton, USA",
      registeredDate: "2025-01-01",
    },
    {
      id: 2,
      fullName: "Nicki Minaj",
      email: "nicki@example.com",
      password: "password456",
      accountType: "teacher",
      subject: "English Literature",
      bio: "Passionate about teaching classic and modern literature, essay writing, and critical analysis.",
      profilePicture: "https://via.placeholder.com/200?text=Nicki+Minaj",
      phone: "555-0102",
      location: "Los Angeles, USA",
      registeredDate: "2025-01-05",
    },
    {
      id: 3,
      fullName: "J. Cole",
      email: "jcole@example.com",
      password: "password789",
      accountType: "teacher",
      subject: "Physics",
      bio: "Physics expert teaching mechanics, thermodynamics, and quantum physics with real-world applications.",
      profilePicture: "https://via.placeholder.com/200?text=J+Cole",
      phone: "555-0103",
      location: "Durham, USA",
      registeredDate: "2025-01-10",
    },
    {
      id: 4,
      fullName: "Cardi B",
      email: "cardib@example.com",
      password: "password101",
      accountType: "student",
      subject: "Chemistry",
      bio: "Student eager to learn organic chemistry, molecular structure, and chemical reactions.",
      profilePicture: "https://via.placeholder.com/200?text=Cardi+B",
      phone: "555-0104",
      location: "New York, USA",
      registeredDate: "2025-01-12",
    },
    {
      id: 5,
      fullName: "Drake",
      email: "drake@example.com",
      password: "password202",
      accountType: "teacher",
      subject: "Biology",
      bio: "Biology teacher specializing in genetics, cellular biology, and ecology with hands-on lab experience.",
      profilePicture: "https://via.placeholder.com/200?text=Drake",
      phone: "555-0105",
      location: "Toronto, Canada",
      registeredDate: "2025-01-15",
    },
    {
      id: 6,
      fullName: "Megan Thee Stallion",
      email: "megan@example.com",
      password: "password303",
      accountType: "student",
      subject: "World History",
      bio: "Student interested in learning about world civilizations, historical events, and their impact today.",
      profilePicture:
        "https://via.placeholder.com/200?text=Megan+Thee+Stallion",
      phone: "555-0106",
      location: "Houston, USA",
      registeredDate: "2025-01-18",
    },
  ];

  const storedUsers = localStorage.getItem("educonnect_users");
  if (storedUsers) {
    users = JSON.parse(storedUsers);
  }
}

function saveUsersToJSON() {
  localStorage.setItem("educonnect_users", JSON.stringify(users));
}

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

  if (!fullName || !email || !password || !accountType || !subject) {
    showMessage("Please fill in all required fields", "error");
    return;
  }

  if (users.some((user) => user.email === email)) {
    showMessage(
      "Email already registered. Please use a different email.",
      "error",
    );
    return;
  }

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

  showMessage(`Registration successful! Welcome, ${fullName}.`, "success");

  setTimeout(() => {
    document.getElementById("registerForm").reset();
    currentUser = newUser;
    localStorage.setItem("educonnect_currentUser", JSON.stringify(newUser));
    updateNavbar();
    showSection("search");
  }, 1500);
}

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
    updateNavbar();
    showSection("search");
  }, 1000);
}

function showSection(sectionId) {
  const sections = document.querySelectorAll(".section");
  sections.forEach((section) => section.classList.remove("active"));

  const selectedSection = document.getElementById(sectionId);
  if (selectedSection) {
    selectedSection.classList.add("active");
  }

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

function displayAllUsers() {
  displaySearchResults(users);
}

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
                <div class="user-card-subject">🎤 ${user.subject}</div>
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

function contactUser(userId) {
  const user = users.find((u) => u.id === userId);
  if (user) {
    const message = `Contact ${user.fullName}?\n\nEmail: ${user.email}\nPhone: ${user.phone || "Not provided"}\n\nYou can send them an email or call them directly.`;
    alert(message);
  }
}

function showMessage(message, type) {
  const messageDiv = document.createElement("div");
  messageDiv.className = `${type}-message`;
  messageDiv.textContent = message;

  const activeSection = document.querySelector(".section.active");
  if (activeSection) {
    activeSection.insertBefore(messageDiv, activeSection.firstChild);
  }

  setTimeout(() => {
    messageDiv.remove();
  }, 5000);
}

function logout() {
  currentUser = null;
  localStorage.removeItem("educonnect_currentUser");
  showSection("home");
  updateNavbar();
  showMessage("Logged out successfully", "success");
}

function updateNavbar() {
  const logoutBtn = document.querySelector(".logout-btn");
  if (currentUser) {
    logoutBtn.style.display = "block";
  } else {
    logoutBtn.style.display = "none";
  }
}

function checkLoggedIn() {
  const storedUser = localStorage.getItem("educonnect_currentUser");
  if (storedUser) {
    currentUser = JSON.parse(storedUser);
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

function exportUsersJSON() {
  const dataStr = JSON.stringify(users, null, 2);
  const dataBlob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "educonnect_users.json";
  link.click();
}
