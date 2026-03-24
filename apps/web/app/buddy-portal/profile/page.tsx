 "use client";

import Link from "next/link";
import { useState } from "react";

export default function BuddyProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "John Doe",
    email: "john@example.com",
    phone: "+254 700 000000",
    skills: ["cooking", "packaging"],
    location: "Westlands, Nairobi",
    radius: 10,
    idNumber: "12345678",
    profilePhoto: "https://example.com/photo.jpg",
  });

  const handleSave = () => {
    // TODO: Save to backend
    setIsEditing(false);
    alert("Profile saved!");
  };

  return (
    <main className="buddy-profile-page">
      <div className="profile-header">
        <div className="profile-avatar">
          <img src={formData.profilePhoto} alt="Profile" />
        </div>
        <div className="profile-info">
          <h1>{formData.name}</h1>
          <p className="profile-status">Active Buddy</p>
          <div className="profile-actions">
            <button className="ghost" onClick={() => setIsEditing(true)}>
              Edit Profile
            </button>
          </div>
        </div>
      </div>

      <div className="profile-stats">
        <div className="stat-card">
          <h3>Earnings (Today)</h3>
          <p className="stat-value">KES 1,200</p>
        </div>
        <div className="stat-card">
          <h3>Rating</h3>
          <p className="stat-value">4.8 ⭐</p>
        </div>
        <div className="stat-card">
          <h3>Jobs Completed</h3>
          <p className="stat-value">24</p>
        </div>
        <div className="stat-card">
          <h3>Response Time</h3>
          <p className="stat-value">15 min</p>
        </div>
      </div>

      <section className="profile-section">
        <h2>Personal Information</h2>
        <div className="profile-fields">
          <div className="field">
            <label>Full Name</label>
            <p>{isEditing ? (
              <input
                defaultValue={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            ) : (
              formData.name
            )}</p>
          </div>
          <div className="field">
            <label>Email</label>
            <p>{isEditing ? (
              <input
                type="email"
                defaultValue={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            ) : (
              formData.email
            )}</p>
          </div>
          <div className="field">
            <label>Phone Number</label>
            <p>{isEditing ? (
              <input
                type="tel"
                defaultValue={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            ) : (
              formData.phone
            )}</p>
          </div>
          <div className="field">
            <label>ID Number</label>
            <p>{isEditing ? (
              <input
                defaultValue={formData.idNumber}
                onChange={(e) => setFormData({ ...formData, idNumber: e.target.value })}
              />
            ) : (
              formData.idNumber
            )}</p>
          </div>
        </div>
      </section>

      <section className="profile-section">
        <h2>Skills & Availability</h2>
        <div className="profile-fields">
          <div className="field">
            <label>Skills</label>
            <div className="skills-tags">
              {formData.skills.map((skill) => (
                <span key={skill} className="skill-tag">
                  {skill}
                </span>
              ))}
            </div>
            {isEditing && (
              <div className="skill-edit">
                <button className="ghost small">Add Skill</button>
              </div>
            )}
          </div>
          <div className="field">
            <label>Preferred Location</label>
            <p>{isEditing ? (
              <input
                defaultValue={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            ) : (
              formData.location
            )}</p>
          </div>
          <div className="field">
            <label>Service Radius (km)</label>
            <p>{isEditing ? (
              <input
                type="number"
                defaultValue={formData.radius}
                onChange={(e) => setFormData({ ...formData, radius: Number(e.target.value) })}
              />
            ) : (
              `${formData.radius} km`
            )}</p>
          </div>
        </div>
      </section>

      {isEditing && (
        <div className="profile-edit-actions">
          <button className="ghost" onClick={() => setIsEditing(false)}>
            Cancel
          </button>
          <button className="primary" onClick={handleSave}>
            Save Changes
          </button>
        </div>
      )}
    </main>
  );
}
