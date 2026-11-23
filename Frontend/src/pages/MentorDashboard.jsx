import {useEffect, useState} from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import "./MentorDashboard.css";
import formatTime from "../utils/formatTime";

function MentorDashboard() {
    const [date, setDate] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState(""); 
    const [slots, setSlots] = useState([]);
    const [loadingSlots, setLoadingSlots] = useState(true);
    const [bookings, setBookings] = useState([]);
    const [loadingBookings, setLoadingBookings] = useState(true);
    const [showEditProfile, setShowEditProfile] = useState(false);
    const [chats, setChats] = useState([]);
    const [loadingChats, setLoadingChats] = useState(true);

    const [profile, setProfile] = useState({
      name: "",
      bio: "",
      skills: "",
      company: "",
      designation: "",
      college: "",
      linkedInProfile: "",
      githubProfile: ""
    });

    const navigate = useNavigate();
    
    const handleCreateSlot = async (e) => {
    e.preventDefault();

    if (startTime >= endTime) {
    alert("End time must be later than start time.");
    return;
}

// Check if date is selected
if (!date) {
  alert("Please select a date.");
  return;
}

// Get today's date in local time
const now = new Date();

const today =
  now.getFullYear() +
  "-" +
  String(now.getMonth() + 1).padStart(2, "0") +
  "-" +
  String(now.getDate()).padStart(2, "0");

// Prevent past dates
if (date < today) {
  alert("You cannot create a slot for a past date.");
  return;
}

// Prevent past times for today
const currentTime =
  String(now.getHours()).padStart(2, "0") +
  ":" +
  String(now.getMinutes()).padStart(2, "0");

if (date === today && startTime <= currentTime) {
  alert("Please select a future start time.");
  return;
}

// Validate start and end time
if (startTime >= endTime) {
  alert("End time must be later than start time.");
  return;
}

   try {
    const response = await api.post("/slots", {
      date,
      startTime,
      endTime
    });

    console.log("Create Slot:", response.data);

    alert("Interview slot created successfully!");

    setDate("");
    setStartTime("");
    setEndTime("");

    await fetchMySlots();

   } catch (error) {
    console.log("Create Slot Error:", error.response?.data);

    alert(
      error.response?.data?.message || "Failed to create slot"
    );
   }
  };

  const fetchMySlots = async () => {
  try {
    const response = await api.get("/slots/my-slots");

    console.log("My Slots:", response.data);

    setSlots(response.data.data);
  } catch (error) {
    console.log("My Slots Error:", error.response?.data);
  } finally {
    setLoadingSlots(false);
  }
};

const handleDeleteSlot = async (slotId) => {  
  
  api.delete(`/slots/${slotId}`)
    .then((response) => {
      console.log("Delete Slot:", response.data);
      fetchMySlots(); // Refresh the slots list
    })
    .catch((error) => {
      console.log("Delete Slot Error:", error.response?.data);
    });
};

const fetchMentorBookings = async () => {
  try {
    const response = await api.get("/bookings/mentor-bookings");

    console.log("Mentor Bookings:", response.data);

    setBookings(response.data.data);
  } catch (error) {
    console.log("Mentor Bookings Error:", error.response?.data);
  } finally {
    setLoadingBookings(false);
  }
};

const fetchMyChats = async () => {
  try {
    const response = await api.get("/chats");
    setChats(response.data.data || []);
  } catch (error) {
    console.log("My Chats Error:", error.response?.data);
  } finally {
    setLoadingChats(false);
  }
};

const fetchProfile = async () => {
  try {
    const response = await api.get("/auth/profile");
    const user = response.data.data;

    setProfile({
      name: user.name || "",
      bio: user.bio || "",
      skills: user.skills?.join(", ") || "",
      company: user.company || "",
      designation: user.designation || "",
      college: user.college || "",
      linkedInProfile: user.linkedInProfile || "",
      githubProfile: user.githubProfile || ""
    });

  } catch (error) {
    console.log("Profile Error:", error.response?.data);
  }
};
const handleProfileChange = (e) => {
  const { name, value } = e.target;

  setProfile((prev) => ({
    ...prev,
    [name]: value
  }));
};

// Save updated profile
const handleUpdateProfile = async (e) => {
  e.preventDefault();

  try {
    const response = await api.put("/auth/profile", {
      name: profile.name,
      bio: profile.bio,
      skills: profile.skills
        .split(",")
        .map((skill) => skill.trim())
        .filter((skill) => skill !== ""),
      company: profile.company,
      designation: profile.designation,
      college: profile.college,
      linkedInProfile: profile.linkedInProfile,
      githubProfile: profile.githubProfile
    });
    console.log("Updated Profile:", response.data);

    alert("Profile updated successfully!");

    setShowEditProfile(false);
    fetchProfile();

  } catch (error) {
    console.log("Update Profile Error:", error.response?.data);

    alert(
      error.response?.data?.message ||
      "Failed to update profile"
    );
  }
};

const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  localStorage.removeItem("user");  
 navigate("/login");
};

useEffect(() => {
  fetchMySlots();
  fetchMentorBookings();
   fetchProfile();
   fetchMyChats();
}, []);

 return (
  <div className="mentor-dashboard">

    {/* Navbar */}
    <nav className="mentor-navbar">
      <h2 className="mentor-logo">SeniorConnect AI</h2>

      <button
        className="mentor-logout"
        onClick={handleLogout}
      >
        Logout
      </button>
    </nav>

    <main className="mentor-content">

      {/* Welcome Banner */}
      <section className="mentor-welcome">
        <h1>Welcome, Mentor! 👋</h1>
        <p>
          Share your experience, guide students, and help them
          prepare for their careers.
        </p>
      </section>

      {/* Edit Profile */}
      <section className="mentor-section">

        <div className="mentor-section-header">
          <h2>My Profile</h2>

          <button
            className="mentor-secondary-button"
            onClick={() => setShowEditProfile(!showEditProfile)}
          >
            {showEditProfile ? "Close Edit Profile" : "✏️ Edit Profile"}
          </button>
        </div>

        {showEditProfile && (
          <form
            className="mentor-form"
            onSubmit={handleUpdateProfile}
          >
            <div className="mentor-form-grid">

              <div className="mentor-form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter your name"
                  value={profile.name}
                  onChange={handleProfileChange}
                  required
                />
              </div>

              <div className="mentor-form-group">
                <label>Company</label>
                <input
                  type="text"
                  name="company"
                  placeholder="Your company"
                  value={profile.company}
                  onChange={handleProfileChange}
                />
              </div>

              <div className="mentor-form-group">
                <label>Designation</label>
                <input
                  type="text"
                  name="designation"
                  placeholder="e.g. Software Engineer"
                  value={profile.designation}
                  onChange={handleProfileChange}
                />
              </div>

              <div className="mentor-form-group">
                <label>College</label>
                <input
                  type="text"
                  name="college"
                  placeholder="Your college"
                  value={profile.college}
                  onChange={handleProfileChange}
                />
              </div>

              <div className="mentor-form-group">
                <label>Skills</label>
                <input
                  type="text"
                  name="skills"
                  placeholder="React, Node.js, MongoDB"
                  value={profile.skills}
                  onChange={handleProfileChange}
                />
              </div>

              <div className="mentor-form-group">
                <label>LinkedIn Profile</label>
                <input
                  type="url"
                  name="linkedInProfile"
                  placeholder="https://linkedin.com/in/..."
                  value={profile.linkedInProfile}
                  onChange={handleProfileChange}
                />
              </div>

              <div className="mentor-form-group">
                <label>GitHub Profile</label>
                <input
                  type="url"
                  name="githubProfile"
                  placeholder="https://github.com/..."
                  value={profile.githubProfile}
                  onChange={handleProfileChange}
                />
              </div>

            </div>

            <div className="mentor-form-group">
              <label>About Me</label>
              <textarea
                name="bio"
                placeholder="Tell students about your experience..."
                value={profile.bio}
                onChange={handleProfileChange}
              />
            </div>

            <button
              type="submit"
              className="mentor-primary-button"
            >
              Save Changes
            </button>
          </form>
        )}
      </section>

      {/* My Chats */}
<section className="mentor-section">
  <h2>💬 My Chats</h2>

  {loadingChats ? (
    <p className="mentor-empty-message">Loading chats...</p>
  ) : chats.length === 0 ? (
    <p className="mentor-empty-message">
      No conversations yet. Students can connect with you through your profile.
    </p>
  ) : (
    <div className="mentor-grid">
      {chats.map((chat) => {
        const currentUser = JSON.parse(localStorage.getItem("user"));

        const student = chat.participants.find(
          (participant) =>
            participant._id !== currentUser?._id &&
            participant.role === "student"
        );

        if (!student) return null;

        return (
          <div className="mentor-card" key={chat._id}>
            <h3>{student.name}</h3>

            <p>
              <strong>Email:</strong> {student.email}
            </p>

            <p>
              <strong>Last Message:</strong>{" "}
              {chat.lastMessage?.content || "No messages yet"}
            </p>

            <button
              className="mentor-primary-button"
              onClick={() => navigate(`/chat/${chat._id}`)}
            >
              Open Chat →
            </button>
          </div>
        );
      })}
    </div>
  )}
</section>

      {/* Create Interview Slot */}
      <section className="mentor-section">
        <h2>📅 Create Interview Slot</h2>

        <form
          className="mentor-form"
          onSubmit={handleCreateSlot}
        >
          <div className="mentor-form-grid">

            <div className="mentor-form-group">
              <label>Select Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={new Date().toLocaleDateString("en-CA")}
                required
              />
            </div>

            <div className="mentor-form-group">
              <label>Start Time</label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
              />
            </div>

            <div className="mentor-form-group">
              <label>End Time</label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
              />
            </div>

          </div>

          <button
            type="submit"
            className="mentor-primary-button"
          >
            + Create Interview Slot
          </button>
        </form>
      </section>

      {/* My Slots */}
      <section className="mentor-section">
        <h2>🗓️ My Interview Slots</h2>

        {loadingSlots ? (
          <p className="mentor-empty-message">Loading slots...</p>
        ) : slots.length === 0 ? (
          <p className="mentor-empty-message">
            You haven't created any interview slots yet.
          </p>
        ) : (
          <div className="mentor-grid">
            {slots.map((slot) => (
              <div className="mentor-card" key={slot._id}>

                <h3>Interview Session</h3>

                <p>
                  <strong>Date:</strong>{" "}
                  {new Date(slot.date).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric"
                  })}
                </p>

                <p>
                  <strong>Time:</strong>{" "}
                  {formatTime(slot.startTime)} – {formatTime(slot.endTime)}
                </p>

                <p>
                  <strong>Status:</strong>{" "}
                  <span className={`mentor-status ${slot.status}`}>
                    {slot.status}
                  </span>
                </p>

                {slot.status !== "booked" && (
                  <div className="mentor-card-actions">
                    <button
                      className="mentor-danger-button"
                      onClick={() => handleDeleteSlot(slot._id)}
                    >
                      Delete Slot
                    </button>
                  </div>
                )}

              </div>
            ))}
          </div>
        )}
      </section>

      {/* My Bookings */}
      <section className="mentor-section">
        <h2>👥 Student Bookings</h2>

        {loadingBookings ? (
          <p className="mentor-empty-message">Loading bookings...</p>
        ) : bookings.length === 0 ? (
          <p className="mentor-empty-message">
            No students have booked a session yet.
          </p>
        ) : (
          <div className="mentor-grid">
            {bookings.map((booking) => (
              <div className="mentor-card" key={booking._id}>

                <h3>
                  {booking.student?.name || "Student"}
                </h3>

                <p>
                  <strong>Email:</strong>{" "}
                  {booking.student?.email || "Not available"}
                </p>

                {booking.slot ? (
                  <>
                    <p>
                      <strong>Date:</strong>{" "}
                      {new Date(booking.slot.date).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric"
                      })}
                    </p>

                    <p>
                      <strong>Time:</strong>{" "}
                      {formatTime(booking.slot.startTime)} – {formatTime(booking.slot.endTime)}
                    </p>
                  </>
                ) : (
                  <p>Slot details are no longer available.</p>
                )}

                <p>
                  <strong>Booking Status:</strong>{" "}
                  <span className={`mentor-status ${booking.status}`}>
                    {booking.status}
                  </span>
                </p>

              </div>
            ))}
          </div>
        )}
      </section>

    </main>
    
  </div>
);
}

export default MentorDashboard;