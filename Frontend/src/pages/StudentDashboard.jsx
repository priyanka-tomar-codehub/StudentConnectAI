import { useEffect, useState } from "react";
import api from "../services/api";

function StudentDashboard() {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(true);

  const fetchAvailableSlots = async () => {
    try {
      const response = await api.get("/slots/available");

      console.log("Available Slots:", response.data);

      setSlots(response.data.data);
    } catch (error) {
      console.log("Error:", error.response?.data);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyBookings = async () => {
    try {
      const response = await api.get("/bookings/my-bookings");
      console.log("My Bookings:", response.data);

      setBookings(response.data.data);

    } catch (error) {
      console.log("Error:", error.response?.data);
    } finally {
       setLoadingBookings(false);
    }
  };

  useEffect(() => {
    fetchAvailableSlots();
    fetchMyBookings();
  }, []);
  
  const handleBookSlot = async (slotId) => {
  try {
    const response = await api.post("/bookings", {
      slotId: slotId
    });

    console.log("Booking response:", response.data);

    alert("Slot booked successfully!");

    // Remove booked slot from available slots
    setSlots((prevSlots) =>
      prevSlots.filter((slot) => slot._id !== slotId)
    );

  } catch (error) {
    console.log("Booking error:", error.response?.data);

    alert(
      error.response?.data?.message || "Failed to book slot"
    );
  }
};

  const handleCancelBooking = async (bookingId) => {
    try {
      const response = await api.patch(
        `/bookings/cancel/${bookingId}`);

      console.log("Cancel Booking response:", response.data);
      alert("Booking canceled successfully!");

      fetchMyBookings();

      fetchAvailableSlots();
    } catch (error) {
      console.log("Cancel Booking error:", error.response?.data);
      alert(
        error.response?.data?.message || "Failed to cancel booking"
      );
    }
  };

  return (
    <div>
      <h1>Student Dashboard</h1>

      <h2>Available Interview Slots</h2>

      {loading ? (
        <p>Loading...</p>
      ) : slots.length === 0 ? (
        <p>No available slots.</p>
      ) : (
        slots.map((slot) => (
          <div key={slot._id}>
            <p>Date: {slot.date}</p>
            <p>
              Time: {slot.startTime} - {slot.endTime}
            </p>
            <p>Status: {slot.status}</p>

            <button onClick={() => handleBookSlot(slot._id)}>Book Slot</button>

            <hr />
          </div>
        ))
      )}

      <h2>My Bookings</h2>

      {loadingBookings ? (
        <p>Loading bookings...</p>
      ) : bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        bookings.map((booking) => (
          <div key={booking._id}>
            <p>Mentor: {booking.mentor.name}</p>

           <p>
           Date: {new Date(booking.slot.date).toLocaleDateString()}
           </p>

           <p>
           Time: {booking.slot.startTime} - {booking.slot.endTime}
          </p>

         <p>Status: {booking.status}</p>

        <button onClick={() => handleCancelBooking(booking._id)}>Cancel Booking</button>

        <hr />
   </div>
  ))
  )}
  </div>

    
  );
}

export default StudentDashboard;