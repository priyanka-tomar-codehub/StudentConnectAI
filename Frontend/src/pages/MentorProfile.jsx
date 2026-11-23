import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import "./MentorProfile.css";
import formatTime from "../utils/formatTime";

function MentorProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [mentor, setMentor] = useState(null);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingSlot, setBookingSlot] = useState(null);
const [chatLoading, setChatLoading] = useState(false);

  const fetchMentorProfile = async () => {
    try {
      const response = await api.get(`/mentors/${id}`);
      setMentor(response.data.data);
    } catch (error) {
      console.error("Error fetching mentor:", error);
    }
  };

  const fetchMentorSlots = async () => {
    try {
      const response = await api.get(`/slots/mentor/${id}`);
      setSlots(response.data.data || []);
    } catch (error) {
      console.error("Error fetching slots:", error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      await Promise.all([
        fetchMentorProfile(),
        fetchMentorSlots(),
      ]);

      setLoading(false);
    };

    loadData();
  }, [id]);

  const handleBookSlot = async (slotId) => {
    try {
      setBookingSlot(slotId);

      await api.post("/bookings", { slotId });

      alert("Slot booked successfully!");

      setSlots((prevSlots) =>
        prevSlots.filter((slot) => slot._id !== slotId)
      );
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to book slot"
      );
    } finally {
      setBookingSlot(null);
    }
  };

  const handleStartChat = async () => {
  try {
    setChatLoading(true);

    const response = await api.post("/chats/create", {
      userId: mentor._id
    });

    const chat = response.data.data;

    navigate(`/chat/${chat._id}`);

  } catch (error) {
    alert(
      error.response?.data?.message ||
      "Unable to start chat. Please try again."
    );
  } finally {
    setChatLoading(false);
  }
};

  if (loading) {
    return (
      <div className="profile-loading-page">
        <h2>Loading Mentor Profile...</h2>
        <p>Please wait while we fetch the mentor's details.</p>
      </div>
    );
  }

  if (!mentor) {
    return (
      <div className="profile-not-found">
        <h2>Mentor Not Found</h2>
        <p>We couldn't load this mentor's profile.</p>

        <button onClick={() => navigate(-1)}>
          ← Go Back
        </button>
      </div>
    );
  }

  const mentorInitial = mentor.name
    ? mentor.name.charAt(0).toUpperCase()
    : "M";

  return (
    <div className="mentor-profile-page">

      {/* Navbar */}
      <nav className="profile-navbar">
        <h2 className="profile-logo">
          SeniorConnect AI
        </h2>

        <button
          className="profile-back-button"
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>
      </nav>

      <main className="profile-container">

        {/* Mentor Hero */}
        <section className="profile-hero">

          <div className="profile-avatar">
            {mentorInitial}
          </div>

          <div>
            <h1>{mentor.name}</h1>

            <p className="profile-designation">
              {mentor.designation || "Mentor"}
            </p>

            <p className="profile-company">
              {mentor.company || "Company not provided"}
            </p>

            <span className="verified-badge">
              ✓ Verified Alumni
            </span>
          </div>

          <button
            className="profile-chat-button"
            onClick={handleStartChat}
            disabled={chatLoading}
          >
            {chatLoading ? "Opening Chat..." : "💬 Start Chat"}
          </button>

        </section>

        {/* Mentor Information */}
        <section className="profile-info-grid">

          <div className="profile-info-card">
            <h2>👤 About Mentor</h2>

            <p>
              {mentor.bio || "No bio available yet."}
            </p>

            <p>
              <strong>College:</strong>{" "}
              {mentor.college || "Not provided"}
            </p>

            <p>
              <strong>Company:</strong>{" "}
              {mentor.company || "Not provided"}
            </p>

            <p>
              <strong>Designation:</strong>{" "}
              {mentor.designation || "Not provided"}
            </p>
          </div>

          <div className="profile-info-card">
            <h2>💡 Skills & Expertise</h2>

            {mentor.skills?.length ? (
              <div className="profile-skills">
                {mentor.skills.map((skill, index) => (
                  <span
                    className="profile-skill-tag"
                    key={`${skill}-${index}`}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p>No skills provided yet.</p>
            )}
          </div>

        </section>

        {/* Available Slots */}
        <section className="profile-slots-section">

          <h2 className="profile-slots-heading">
            📅 Available Interview Slots
          </h2>

          <p className="profile-slots-description">
            Choose a convenient time to connect with this mentor
            for guidance and interview preparation.
          </p>

          {slots.length === 0 ? (
            <div className="profile-message">
              <h3>No Available Slots</h3>
              <p>
                This mentor currently has no available sessions.
                Please check again later.
              </p>
            </div>
          ) : (
            <div className="profile-slots-grid">

              {slots.map((slot) => (
                <div
                  className="profile-slot-card"
                  key={slot._id}
                >
                  <h3>Mentorship Session</h3>

                  <p>
                    <strong>Date:</strong>{" "}
                    {new Date(slot.date).toLocaleDateString(
                      "en-IN",
                      {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      }
                    )}
                  </p>

                  
          
                  <p>
                    <strong>Time:</strong>{" "}
                    {formatTime(slot.startTime)} – {formatTime(slot.endTime)}
                  </p>


                  

                  <button
                    className="profile-book-button"
                    onClick={() => handleBookSlot(slot._id)}
                    disabled={bookingSlot === slot._id}
                  >
                    {bookingSlot === slot._id
                      ? "Booking..."
                      : "Book Mentorship Session"}
                  </button>
                </div>
              ))}

            </div>
          )}

        </section>

      </main>
    </div>
  );
}

export default MentorProfile;