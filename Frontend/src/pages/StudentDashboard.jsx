import { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import "./StudentDashboard.css";
import formatTime from "../utils/formatTime";

function StudentDashboard() {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);

  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(true);

  const [mentors, setMentors] = useState([]);
  const [loadingMentors, setLoadingMentors] = useState(true);

  const [chats, setChats] = useState([]);
  const [loadingChats, setLoadingChats] = useState(true);

  const navigate = useNavigate();

  const fetchAvailableSlots = async () => {
    try {
      const response = await api.get("/slots/available");
      setSlots(response.data.data || []);
    } catch (error) {
      console.log("Available Slots Error:", error.response?.data);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyBookings = async () => {
    try {
      const response = await api.get("/bookings/my-bookings");
      setBookings(response.data.data || []);
    } catch (error) {
      console.log("My Bookings Error:", error.response?.data);
    } finally {
      setLoadingBookings(false);
    }
  };

  const fetchMentors = async () => {
    try {
      const response = await api.get("/mentors");
      setMentors(response.data.data || []);
    } catch (error) {
      console.log("Mentors Error:", error.response?.data);
    } finally {
      setLoadingMentors(false);
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

  useEffect(() => {
    fetchAvailableSlots();
    fetchMyBookings();
    fetchMentors();
    fetchMyChats();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");

    navigate("/login");
  };

  const handleBookSlot = async (slotId) => {
    try {
      await api.post("/bookings", { slotId });

      alert("Slot booked successfully!");

      await Promise.all([
        fetchAvailableSlots(),
        fetchMyBookings(),
      ]);
    } catch (error) {
      console.log("Booking Error:", error.response?.data);

      alert(
        error.response?.data?.message || "Failed to book slot"
      );
    }
  };

  const handleCancelBooking = async (bookingId) => {
    try {
      await api.patch(`/bookings/cancel/${bookingId}`);

      alert("Booking cancelled successfully!");

      await Promise.all([
        fetchMyBookings(),
        fetchAvailableSlots(),
      ]);
    } catch (error) {
      console.log("Cancel Booking Error:", error.response?.data);

      alert(
        error.response?.data?.message ||
          "Failed to cancel booking"
      );
    }
  };

  const formatDate = (date) => {
    if (!date) return "Date unavailable";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="student-dashboard">
      {/* Navbar */}
      <nav className="student-navbar">
        <div className="student-logo">
          SeniorConnect AI
        </div>

        <button onClick={handleLogout}>
          Logout
        </button>
      </nav>

      <main className="student-content">
        {/* Welcome Section */}
        <section className="student-welcome">
          <h1>Welcome to SeniorConnect AI 👋</h1>

          <p>
            Connect with experienced alumni, book mentorship sessions,
            and prepare for your next interview with AI.
          </p>
        </section>

        {/* Find Alumni */}
        <section className="dashboard-section">
          <h2>🎓 Find Alumni</h2>

          {loadingMentors ? (
            <p>Loading mentors...</p>
          ) : mentors.length === 0 ? (
            <p className="empty-message">
              No verified alumni available right now.
            </p>
          ) : (
            <div className="dashboard-grid">
              {mentors.map((mentor) => (
                <div className="dashboard-card" key={mentor._id}>
                  <h3>{mentor.name}</h3>

                  <p>
                    <strong>Company:</strong>{" "}
                    {mentor.company || "Not provided"}
                  </p>

                  <p>
                    <strong>Designation:</strong>{" "}
                    {mentor.designation || "Not provided"}
                  </p>

                  <p>
                    <strong>College:</strong>{" "}
                    {mentor.college || "Not provided"}
                  </p>

                  <button
                    className="primary-button"
                    onClick={() => navigate(`/mentor/${mentor._id}`)}
                  >
                    View Profile →
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

          
        {/* My Chats */}
<section className="dashboard-section">
  <h2>💬 My Chats</h2>

  {loadingChats ? (
    <p>Loading chats...</p>
  ) : chats.length === 0 ? (
    <p className="empty-message">
      No conversations yet. Connect with an alumni to start chatting.
    </p>
  ) : (
    <div className="dashboard-grid">
      {chats.map((chat) => {
        const currentUser = JSON.parse(
          localStorage.getItem("user")
        );

        const alumni = chat.participants.find(
          (participant) =>
            participant._id !== currentUser?._id &&
            participant.role === "alumni"
        );

        if (!alumni) return null;

        return (
          <div className="dashboard-card" key={chat._id}>
            <h3>{alumni.name}</h3>

            <p>
              <strong>Role:</strong> Alumni
            </p>

            <p>
              <strong>Last Message:</strong>{" "}
              {chat.lastMessage?.content || "No messages yet"}
            </p>

            <button
              className="primary-button"
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

        {/* Available Slots */}
        <section className="dashboard-section">
          <h2>📅 Available Interview Slots</h2>

          {loading ? (
            <p>Loading available slots...</p>
          ) : slots.length === 0 ? (
            <p className="empty-message">
              No available slots at the moment.
            </p>
          ) : (
            <div className="dashboard-grid">
              {slots.map((slot) => (
                <div className="dashboard-card" key={slot._id}>
                  <h3>Mentorship Session</h3>

                  <p>
                    <strong>Date:</strong> {formatDate(slot.date)}
                  </p>

                  <p>
                    <strong>Time:</strong>{" "}
                    {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                  </p>

                  <p>
                    <strong>Status:</strong>{" "}
                    <span className="status-badge">
                      {slot.status}
                    </span>
                  </p>

                  <button
                    className="primary-button"
                    onClick={() => handleBookSlot(slot._id)}
                  >
                    Book Slot
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* My Bookings */}
        <section className="dashboard-section">
          <h2>📋 My Bookings</h2>

          {loadingBookings ? (
            <p>Loading bookings...</p>
          ) : bookings.length === 0 ? (
            <p className="empty-message">
              You haven't booked any sessions yet.
            </p>
          ) : (
            <div className="dashboard-grid">
              {bookings.map((booking) => (
                <div className="dashboard-card" key={booking._id}>
                  <h3>
                    {booking.mentor?.name || "Mentor"}
                  </h3>

                  {booking.slot ? (
                    <>
                      <p>
                        <strong>Date:</strong>{" "}
                        {formatDate(booking.slot.date)}
                      </p>


                      <p>
                        <strong>Time:</strong>{" "}
                        {formatTime(booking.slot.startTime)} –{" "}
                        {formatTime(booking.slot.endTime)}
                      </p>
                    </>
                  ) : (
                    <p>Slot details are no longer available.</p>
                  )}

                  <p>
                    <strong>Status:</strong>{" "}
                    <span
                      className={`status-badge ${
                        booking.status === "cancelled"
                          ? "cancelled"
                          : booking.status === "completed"
                          ? "completed"
                          : ""
                      }`}
                    >
                      {booking.status}
                    </span>
                  </p>

                  {booking.status === "confirmed" && (
                    <button
                      className="danger-button"
                      onClick={() => handleCancelBooking(booking._id)}
                    >
                      Cancel Booking
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* AI Mock Interview */}
        <section className="ai-card">
          <h2>🤖 AI Mock Interview</h2>

          <p>
            Practice interview questions, evaluate your answers,
            and improve your interview skills with AI.
          </p>

          <button
            className="primary-button"
            onClick={() => navigate("/mock-interview")}
          >
            Start Mock Interview →
          </button>
        </section>
       </main>
     
      
    </div>
  );
}

export default StudentDashboard;