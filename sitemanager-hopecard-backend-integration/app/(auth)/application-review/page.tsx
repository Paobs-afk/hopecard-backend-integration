"use client";

import React, { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle, Mail } from "lucide-react";
import { C, AuthShell, MobileLogo } from "../../../components/auth-shared";

function ApplicationReviewForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';

  const maskedEmail = email ? email.replace(/(.{2})(.*)(@.*)/, '$1***$3') : 'your email';

  return (
    <AuthShell>
      {/* Form Panel */}
      <div
        style={{
          padding: "clamp(2rem, 5vw, 5rem)",
          background: C.surfaceContainerLowest,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        {/* Mobile logo */}
        <MobileLogo />

        {/* Header */}
        <div style={{ marginBottom: "2.5rem", textAlign: "center" }}>
          {/* Check icon */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: "4rem",
              height: "4rem",
              background: C.surfaceContainerLow,
              borderRadius: "1rem",
              marginBottom: "1.5rem",
              color: C.primary,
            }}
          >
            <CheckCircle size={32} />
          </div>

          <h2 style={{ 
            fontFamily: "Plus Jakarta Sans, sans-serif", 
            fontSize: "1.875rem", 
            fontWeight: 700, 
            color: C.onPrimaryFixed, 
            margin: "0 0 0.5rem",
            textAlign: "center"
          }}>
            Email Confirmed!
          </h2>
          
          <p style={{ 
            color: C.onSurfaceVariant, 
            margin: "0 0 2rem", 
            lineHeight: 1.6, 
            fontFamily: "Manrope, sans-serif",
            fontSize: "1rem"
          }}>
            Your email has been verified successfully
          </p>

          {/* Application Review Box */}
          <div style={{
            padding: "2rem",
            background: C.surfaceContainerLow,
            borderRadius: "1rem",
            marginBottom: "2rem",
            border: `2px solid ${C.outlineVariant}33`,
          }}>
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: "3rem",
              height: "3rem",
              background: "#fef3c7",
              borderRadius: "0.75rem",
              marginBottom: "1rem",
              color: "#92400e",
            }}>
              <Mail size={20} />
            </div>

            <h3 style={{
              fontFamily: "Plus Jakarta Sans, sans-serif",
              fontSize: "1.125rem",
              fontWeight: 600,
              color: C.onPrimaryFixed,
              margin: "0 0 0.75rem",
              textAlign: "center"
            }}>
              Application Under Review
            </h3>

            <p style={{
              margin: 0,
              fontFamily: "Manrope, sans-serif",
              fontSize: "0.875rem",
              color: C.onSurfaceVariant,
              lineHeight: 1.8,
              textAlign: "center"
            }}>
              Thank you for signing up! Your donor application has been submitted for review. 
              Our team will verify your information and contact you at{" "}
              <span style={{ color: C.onPrimaryFixed, fontWeight: 600 }}>
                {maskedEmail}
              </span>{" "}
              once your account is approved.
            </p>
          </div>

          {/* Next Steps */}
          <div style={{
            padding: "1.5rem",
            background: C.surfaceContainerHighest,
            borderRadius: "1rem",
            marginBottom: "2rem",
            textAlign: "left"
          }}>
            <h4 style={{
              fontFamily: "Plus Jakarta Sans, sans-serif",
              fontSize: "0.875rem",
              fontWeight: 600,
              color: C.onSurfaceVariant,
              margin: "0 0 1rem",
              textTransform: "uppercase",
              letterSpacing: "0.5px"
            }}>
              What Happens Next?
            </h4>
            <ol style={{
              margin: 0,
              paddingLeft: "1.5rem",
              fontFamily: "Manrope, sans-serif",
              fontSize: "0.875rem",
              color: C.onSurfaceVariant,
              lineHeight: 2
            }}>
              <li>
                <span style={{ fontWeight: 600, color: C.onSurface }}>Verification:</span> Our team reviews your submitted information and ID
              </li>
              <li>
                <span style={{ fontWeight: 600, color: C.onSurface }}>Approval:</span> Once verified, you'll receive an approval email
              </li>
              <li>
                <span style={{ fontWeight: 600, color: C.onSurface }}>Access:</span> Log in with your credentials to start donating
              </li>
            </ol>
          </div>

          <p style={{ 
            color: C.onSurfaceVariant, 
            margin: "0 0 1.5rem", 
            fontFamily: "Manrope, sans-serif",
            fontSize: "0.75rem",
            fontStyle: "italic"
          }}>
            This usually takes 1-2 business days. Thank you for your patience!
          </p>
        </div>

        {/* Action Buttons */}
        <div style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem"
        }}>
          <button
            type="button"
            onClick={() => router.push('/login')}
            style={{
              width: "100%",
              padding: "1.25rem",
              borderRadius: "1rem",
              background: C.coralRose,
              color: C.onPrimary,
              fontFamily: "Plus Jakarta Sans, sans-serif",
              fontWeight: 700,
              fontSize: "1.125rem",
              border: "none",
              cursor: "pointer",
              boxShadow: "0 8px 24px rgba(242,141,131,0.3)",
              transition: "box-shadow 0.3s, transform 0.3s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = "0 12px 32px rgba(242,141,131,0.4)";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = "0 8px 24px rgba(242,141,131,0.3)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            Go to Login
          </button>

          <p style={{
            textAlign: "center",
            color: C.onSurfaceVariant,
            fontFamily: "Manrope, sans-serif",
            fontSize: "0.75rem",
            margin: "0.5rem 0 0"
          }}>
            You'll be able to log in once your account is approved
          </p>
        </div>
      </div>
    </AuthShell>
  );
}

export default function ApplicationReviewScreen() {
  return (
    <Suspense fallback={
      <AuthShell>
        <div style={{
          padding: "clamp(2rem, 5vw, 5rem)",
          background: "transparent",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh"
        }}>
          <p style={{ color: "#666", fontFamily: "Manrope, sans-serif" }}>Loading...</p>
        </div>
      </AuthShell>
    }>
      <ApplicationReviewForm />
    </Suspense>
  );
}
