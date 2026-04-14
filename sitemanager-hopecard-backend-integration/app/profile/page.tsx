"use client";

import React from "react";
import { useRouter } from "next/navigation";
import SharedLayout from "../../components/SharedLayout";
import {
  User,
  BadgeCheck,
  History,
  Receipt,
  CreditCard,
  Settings,
  KeyRound,
  Monitor,
  Laptop,
  Smartphone,
  LogOut,
} from "lucide-react";

// Design Tokens
const colors = {
  primary: "#97453e",
  primaryContainer: "#f28d83",
  primaryFixed: "#ffdad6",
  primaryFixedDim: "#ffb4ab",
  onPrimary: "#ffffff",
  onPrimaryContainer: "#6e2621",
  onPrimaryFixed: "#3f0304",
  secondary: "#a8372c",
  secondaryContainer: "#ff7766",
  onSecondary: "#ffffff",
  onSecondaryContainer: "#710d09",
  tertiary: "#775a00",
  tertiaryContainer: "#cda336",
  onTertiary: "#ffffff",
  surface: "#fcf9f8",
  surfaceContainer: "#f0edec",
  surfaceContainerLow: "#f6f3f2",
  surfaceContainerHigh: "#eae7e7",
  surfaceContainerLowest: "#ffffff",
  surfaceDim: "#dcd9d8",
  onSurface: "#1b1c1b",
  onSurfaceVariant: "#554240",
  outline: "#877270",
  outlineVariant: "#dac1be",
  background: "#fcf9f8",
  inverseSurface: "#303030",
  inversePrimary: "#ffb4ab",
  error: "#ba1a1a",
  errorContainer: "#ffdad6",
} as const;

// Types
interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  href?: string;
  active?: boolean;
  onClick?: () => void;
}

interface FormFieldProps {
  label: string;
  type?: string;
  value?: string;
  placeholder?: string;
  colSpan2?: boolean;
}

interface SessionCardProps {
  icon: React.ReactNode;
  deviceName: string;
  lastActive: string;
  location: string;
  isCurrent?: boolean;
}

// Sub-Components
const SideNavItem = React.memo<NavItemProps>(
  ({ icon, label, href = "#", active = false, onClick }) => (
    <a
      href={href}
      onClick={(e) => {
        if (onClick) {
          e.preventDefault();
          onClick();
        }
      }}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "1rem",
        padding: "1rem 1.5rem",
        borderRadius: "1rem",
        fontWeight: active ? 700 : 500,
        color: active ? colors.primary : colors.onSurfaceVariant,
        background: active ? `${colors.primaryContainer}1a` : "transparent",
        borderLeft: active ? `4px solid ${colors.primary}` : "4px solid transparent",
        textDecoration: "none",
        transition: "background 0.15s",
        fontFamily: "Manrope, sans-serif",
        fontSize: "0.95rem",
        cursor: "pointer",
      }}
    >
      {icon}
      {label}
    </a>
  )
);
SideNavItem.displayName = "SideNavItem";

const FormField = React.memo<FormFieldProps>(
  ({ label, type = "text", value, placeholder, colSpan2 = false }) => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
        gridColumn: colSpan2 ? "1 / -1" : undefined,
      }}
    >
      <label
        style={{
          fontSize: "0.7rem",
          fontWeight: 700,
          color: colors.onSurfaceVariant,
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          padding: "0 0.25rem",
          fontFamily: "Manrope, sans-serif",
        }}
      >
        {label}
      </label>
      <input
        type={type}
        defaultValue={value}
        placeholder={placeholder}
        style={{
          width: "100%",
          padding: "1rem 1.5rem",
          borderRadius: "1rem",
          background: colors.surfaceContainerLow,
          border: "none",
          outline: "none",
          fontFamily: "Manrope, sans-serif",
          fontWeight: 500,
          fontSize: "0.95rem",
          color: colors.onSurface,
          boxSizing: "border-box",
        }}
        onFocus={(e: React.FocusEvent<HTMLInputElement>) => {
          e.currentTarget.style.boxShadow = `0 0 0 2px ${colors.primaryContainer}80`;
        }}
        onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
          e.currentTarget.style.boxShadow = "none";
        }}
      />
    </div>
  )
);
FormField.displayName = "FormField";

const SessionCard = React.memo<SessionCardProps>(
  ({ icon, deviceName, lastActive, location, isCurrent = false }) => (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "1.5rem",
        borderRadius: "1rem",
        background: colors.surfaceContainerLow,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
        <div
          style={{
            width: "3rem",
            height: "3rem",
            borderRadius: "0.75rem",
            background: colors.surfaceContainerLowest,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: colors.primary,
          }}
        >
          {icon}
        </div>
        <div>
          <h4
            style={{
              fontWeight: 700,
              color: colors.onSurface,
              fontFamily: "Manrope, sans-serif",
              margin: 0,
            }}
          >
            {deviceName}
          </h4>
          <p
            style={{
              fontSize: "0.85rem",
              color: colors.onSurfaceVariant,
              fontFamily: "Manrope, sans-serif",
              margin: 0,
            }}
          >
            Last active: {lastActive} • {location}
          </p>
        </div>
      </div>
      {isCurrent ? (
        <span
          style={{
            padding: "0.25rem 0.75rem",
            background: `${colors.secondaryContainer}33`,
            color: colors.onSecondaryContainer,
            fontSize: "0.7rem",
            fontWeight: 700,
            borderRadius: "999px",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            fontFamily: "Manrope, sans-serif",
          }}
        >
          Current Device
        </span>
      ) : (
        <button
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: "0.875rem",
            fontWeight: 700,
            color: colors.secondary,
            fontFamily: "Manrope, sans-serif",
            textDecoration: "underline",
            textUnderlineOffset: "4px",
          }}
        >
          Sign Out
        </button>
      )}
    </div>
  )
);
SessionCard.displayName = "SessionCard";

export default function ProfilePage() {
  const router = useRouter();

  // TODO: Replace with actual user data from database/session
  const userData = {
    name: "Alex Rivera",
    profileImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuAdnEsN3hi4C0joKKnhz1O1oeh3UpXyAX7dEgr7Q81U-7a-JEWGxotqwmyV1KBluq9yp1x55RH_k1l1iRFw03ZgBjcauMs1F2LMD2D4lRdoTrL32GLXrRyK7Boio93vLcVVKS2hQ2a603XboUgDh-kuSfdf1IjQKu04E0j57ow4E7m8RxfA5PgeDpb4fyHJ3rx8MqO3GChPNhSypAhJZBuFYPVixVlC2dYEndjr6d4uklYd7pkfGZlp855CHfgKeZCMc0MiAzWdFH3D",
    isVerified: true,
    lifetimeImpact: 12450.00,
    joinedDate: "January 2022",
    email: "alex.rivera@impact.org",
    phone: "+1 (555) 123-4567",
    address: "123 Compassion Lane, San Francisco, CA 94102",
  };

  return (
    <SharedLayout currentPage="profile">
      <div style={{ maxWidth: "1440px", margin: "0 auto", padding: "0 3rem 2rem" }}>
        {/* Hero Profile Section */}
        <section
          style={{
            position: "relative",
            width: "100%",
            borderRadius: "2rem",
            overflow: "hidden",
            marginBottom: "4rem",
            background: colors.surfaceContainerLow,
          }}
        >
          {/* BG gradient overlay */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: `linear-gradient(to right, ${colors.primary}33, transparent)`,
              zIndex: 0,
            }}
          />
          {/* BG image */}
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuB3aM9DZCsiXcpWZJY_FEhGc8CCSE7P9Vq9Qjje96ViFRPmjMgS2P76H0L5w2d6X-SRc5rSOyjfN_d0_N5glYtbh9DOkP1f0RbzO7-l4QtgjMEAQlaCATJ5Miz5jU-9eRl3vpj4B2Fee3fVym8VZs1ookYjfxDUOS_AZWAMpRcpQotUyscZYWN0ZIbvAE4xIQ8mrux6nnZGu-8b66Zgm4cgEumew7IVLj_1s9V1PPI0MJiOydrLbDZZDbyz8crvBLylmQQmqhHa2Sf_"
            alt="Hero background"
            style={{ width: "100%", height: "300px", objectFit: "cover", opacity: 0.6 }}
          />

          {/* Profile Info Row */}
          <div
            style={{
              position: "relative",
              zIndex: 10,
              padding: "0 3rem 2.5rem",
              marginTop: "-5.5rem",
              display: "flex",
              flexWrap: "wrap",
              alignItems: "flex-end",
              gap: "2rem",
            }}
          >
            {/* Avatar */}
            <div
              style={{
                width: "11rem",
                height: "11rem",
                borderRadius: "1.75rem",
                overflow: "hidden",
                border: `6px solid ${colors.surface}`,
                boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
                flexShrink: 0,
              }}
            >
              <img
                src={userData.profileImage}
                alt={`${userData.name} profile`}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>

            {/* Name + Stats */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "0.875rem", paddingBottom: "0.5rem" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  flexWrap: "wrap",
                }}
              >
                <h1
                  style={{
                    fontSize: "2.25rem",
                    fontWeight: 800,
                    fontFamily: "Plus Jakarta Sans, sans-serif",
                    color: colors.onSurface,
                    letterSpacing: "-0.03em",
                    margin: 0,
                    lineHeight: 1,
                  }}
                >
                  {userData.name}
                </h1>
                {userData.isVerified && (
                  <span
                    style={{
                      padding: "0.375rem 0.875rem",
                      background: `${colors.secondaryContainer}33`,
                      color: colors.onSecondaryContainer,
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      borderRadius: "999px",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.375rem",
                      fontFamily: "Manrope, sans-serif",
                    }}
                  >
                    <BadgeCheck size={16} fill="currentColor" />
                    Verified Donor
                  </span>
                )}
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "2rem", flexWrap: "wrap" }}>
                <p
                  style={{
                    color: colors.primary,
                    fontFamily: "Plus Jakarta Sans, sans-serif",
                    fontWeight: 700,
                    fontSize: "1.125rem",
                    margin: 0,
                  }}
                >
                  Lifetime Impact: ${userData.lifetimeImpact.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                <span
                  style={{
                    width: "1px",
                    height: "1.5rem",
                    background: `${colors.outlineVariant}4d`,
                    display: "inline-block",
                  }}
                />
                <p
                  style={{
                    color: colors.onSurfaceVariant,
                    fontSize: "0.9375rem",
                    fontWeight: 500,
                    margin: 0,
                  }}
                >
                  Joined {userData.joinedDate}
                </p>
              </div>
            </div>

            {/* Edit Button */}
            <div style={{ paddingBottom: "0.5rem" }}>
              <button
                style={{
                  background: colors.primaryContainer,
                  color: colors.onPrimaryContainer,
                  padding: "0.875rem 2.25rem",
                  borderRadius: "1rem",
                  fontWeight: 700,
                  border: "none",
                  cursor: "pointer",
                  boxShadow: `0 8px 20px ${colors.primaryContainer}33`,
                  fontFamily: "Manrope, sans-serif",
                  fontSize: "0.95rem",
                }}
              >
                Edit Profile
              </button>
            </div>
          </div>
        </section>

        {/* Two-Column Layout */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 3fr", gap: "3rem" }}>
          {/* Sidebar */}
          <aside>
            <nav style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <SideNavItem icon={<User size={20} />} label="Profile & Security" active />
              <SideNavItem 
                icon={<History size={20} />} 
                label="Donation History" 
                onClick={() => router.push('/transactions')}
              />
              <SideNavItem 
                icon={<Receipt size={20} />} 
                label="Tax Receipts" 
                onClick={() => router.push('/transactions')}
              />
              <SideNavItem 
                icon={<CreditCard size={20} />} 
                label="Payment Methods" 
                onClick={() => router.push('/profile')}
              />
              <SideNavItem 
                icon={<Settings size={20} />} 
                label="Settings" 
                onClick={() => router.push('/settings')}
              />
            </nav>

            {/* Help Card */}
            <div
              style={{
                marginTop: "3rem",
                padding: "1.5rem",
                borderRadius: "1rem",
                background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                color: colors.onPrimary,
                boxShadow: `0 12px 30px ${colors.primary}33`,
              }}
            >
              <h3
                style={{
                  fontFamily: "Plus Jakarta Sans, sans-serif",
                  fontWeight: 700,
                  marginBottom: "0.5rem",
                  margin: "0 0 0.5rem",
                }}
              >
                Need Help?
              </h3>
              <p
                style={{
                  fontSize: "0.875rem",
                  opacity: 0.9,
                  marginBottom: "1rem",
                  margin: "0 0 1rem",
                  lineHeight: 1.5,
                }}
              >
                Our donor support team is here to help you maximize your impact.
              </p>
              <button
                style={{
                  width: "100%",
                  background: colors.surfaceContainerLowest,
                  color: colors.primary,
                  padding: "0.5rem",
                  borderRadius: "0.75rem",
                  fontWeight: 700,
                  fontSize: "0.875rem",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "Manrope, sans-serif",
                }}
              >
                Contact Support
              </button>
            </div>
          </aside>

          {/* Main Content */}
          <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            {/* Personal Information */}
            <div
              style={{
                background: colors.surfaceContainerLowest,
                borderRadius: "1rem",
                padding: "2rem",
                boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "2rem",
                }}
              >
                <h2
                  style={{
                    fontSize: "1.5rem",
                    fontFamily: "Plus Jakarta Sans, sans-serif",
                    fontWeight: 700,
                    color: colors.onSurface,
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    margin: 0,
                  }}
                >
                  <BadgeCheck size={24} color={colors.primary} />
                  Personal Information
                </h2>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "2rem",
                }}
              >
                <FormField label="Full Name" value="Alex Rivera" />
                <FormField label="Mobile Number" value="+1 (555) 123-4567" />
                <FormField
                  label="Email Address"
                  type="email"
                  value="alex.rivera@impact.org"
                  colSpan2
                />
              </div>

              <div
                style={{
                  marginTop: "2rem",
                  paddingTop: "2rem",
                  borderTop: `1px solid ${colors.outlineVariant}33`,
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                <button
                  style={{
                    background: colors.surfaceContainer,
                    color: colors.onSurface,
                    padding: "0.75rem 2rem",
                    borderRadius: "1rem",
                    fontWeight: 700,
                    border: "none",
                    cursor: "pointer",
                    fontFamily: "Manrope, sans-serif",
                    fontSize: "0.95rem",
                  }}
                >
                  Update Info
                </button>
              </div>
            </div>

            {/* Change Password */}
            <div
              style={{
                background: colors.surfaceContainerLowest,
                borderRadius: "1rem",
                padding: "2rem",
                boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
              }}
            >
              <h2
                style={{
                  fontSize: "1.5rem",
                  fontFamily: "Plus Jakarta Sans, sans-serif",
                  fontWeight: 700,
                  color: colors.onSurface,
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  marginBottom: "2rem",
                }}
              >
                <KeyRound size={24} color={colors.primary} />
                Change Password
              </h2>

              <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
                <FormField label="Current Password" type="password" value="••••••••••••" />

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "2rem",
                  }}
                >
                  <FormField
                    label="New Password"
                    type="password"
                    placeholder="Min. 8 characters"
                  />
                  <FormField
                    label="Confirm New Password"
                    type="password"
                    placeholder="Repeat password"
                  />
                </div>

                {/* Password Strength */}
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "0 0.25rem",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        color: colors.onSurfaceVariant,
                        fontFamily: "Manrope, sans-serif",
                      }}
                    >
                      Password Strength
                    </span>
                    <span
                      style={{
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        color: colors.primary,
                        fontFamily: "Manrope, sans-serif",
                      }}
                    >
                      Strong
                    </span>
                  </div>
                  <div
                    style={{
                      height: "0.5rem",
                      width: "100%",
                      background: colors.surfaceContainer,
                      borderRadius: "999px",
                      display: "flex",
                      overflow: "hidden",
                    }}
                  >
                    {[1, 1, 1, 0].map((active, i) => (
                      <div
                        key={i}
                        style={{
                          flex: 1,
                          height: "100%",
                          background: colors.primaryContainer,
                          opacity: active ? 1 : 0.3,
                          borderRight: i < 3 ? `1px solid ${colors.surface}` : "none",
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Active Sessions */}
            <div
              style={{
                background: colors.surfaceContainerLowest,
                borderRadius: "1rem",
                padding: "2rem",
                boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
              }}
            >
              <h2
                style={{
                  fontSize: "1.5rem",
                  fontFamily: "Plus Jakarta Sans, sans-serif",
                  fontWeight: 700,
                  color: colors.onSurface,
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  marginBottom: "2rem",
                }}
              >
                <Monitor size={24} color={colors.primary} />
                Active Sessions
              </h2>

              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <SessionCard
                  icon={<Laptop size={24} />}
                  deviceName="Chrome on MacOS"
                  lastActive="Just now"
                  location="San Francisco, USA"
                  isCurrent
                />
                <SessionCard
                  icon={<Smartphone size={24} />}
                  deviceName="HOPECARD iOS App"
                  lastActive="2 hours ago"
                  location="San Francisco, USA"
                />
              </div>

              <div
                style={{
                  marginTop: "2rem",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <button
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: colors.onSurfaceVariant,
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    fontFamily: "Manrope, sans-serif",
                    borderBottom: `1px solid ${colors.outlineVariant}4d`,
                    paddingBottom: "0.25rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.4rem",
                  }}
                >
                  <LogOut size={14} />
                  Sign out from all other devices
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SharedLayout>
  );
}
