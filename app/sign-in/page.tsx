'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

type AuthMode = 'sign-in' | 'sign-up' | 'reset';

function SignInContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Mode resolution from URL query parameter
  const modeParam = searchParams.get('mode');
  const [mode, setMode] = useState<AuthMode>('sign-in');

  useEffect(() => {
    if (modeParam === 'sign-up' || modeParam === 'reset') {
      setMode(modeParam);
    } else {
      setMode('sign-in');
    }
  }, [modeParam]);

  // Form Fields State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [orgName, setOrgName] = useState('');
  const [seats, setSeats] = useState('5');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // For demonstration: number input vs text input comparison (Step 4)
  const [useAnnoyingNumberInput, setUseAnnoyingNumberInput] = useState(false);

  // For demonstration: hidden button vs disabled button comparison (Step 7)
  const [useHiddenButton, setUseHiddenButton] = useState(false);

  // Blur/Touch States
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Errors State
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [helperNotice, setHelperNotice] = useState<string | null>(null);
  const [submitFeedback, setSubmitFeedback] = useState<string | null>(null);

  // Helper to switch modes via URL without page reload
  const switchMode = (newMode: AuthMode) => {
    setTouched({});
    setErrors({});
    setHelperNotice(null);
    setSubmitFeedback(null);
    router.push(`/sign-in?mode=${newMode}`, { scroll: false });
  };

  // Validation Rules (Categories 1, 2, 3)
  const validateField = (field: string, value: string, isRealTime = false) => {
    let err = '';

    if (field === 'fullName') {
      if (!value.trim()) {
        err = 'Full name is required. Please enter your first and last name.';
      } else {
        const parts = value.trim().split(/\s+/);
        if (value.trim().length < 2) {
          err = 'Name must be at least 2 characters long.';
        } else if (parts.length < 2) {
          err = 'Please provide both your first and last name separated by a space.';
        }
      }
    }

    if (field === 'orgName') {
      if (!value.trim()) {
        err = 'Organisation name is required for registration.';
      } else if (value.trim().length < 3) {
        err = 'Organisation name must be at least 3 characters.';
      }
    }

    if (field === 'email') {
      if (!value.trim()) {
        err = 'Email address is required.';
      } else {
        // Category 3: Format check
        // Enforced in real time on sign-up; on submit for login
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (mode === 'sign-up' || !isRealTime) {
          if (!emailRegex.test(value.trim())) {
            err = 'Please enter a valid email address (e.g. name@remediation.co.uk).';
          }
        }
      }
    }

    if (field === 'password') {
      if (!value) {
        err = 'Password is required.';
      } else if (value.length < 10) {
        err = 'Password must be at least 10 characters long.';
      }
    }

    if (field === 'seats') {
      const num = parseInt(value, 10);
      if (isNaN(num) || num < 1 || num > 500) {
        err = 'Supervisor seats must be an integer between 1 and 500.';
      }
    }

    return err;
  };

  // Run validation whenever inputs change
  useEffect(() => {
    const newErrors: Record<string, string> = {};

    if (mode === 'sign-up') {
      if (touched.fullName) {
        const e = validateField('fullName', fullName);
        if (e) newErrors.fullName = e;
      }
      if (touched.orgName) {
        const e = validateField('orgName', orgName);
        if (e) newErrors.orgName = e;
      }
      if (touched.email) {
        const e = validateField('email', email, true);
        if (e) newErrors.email = e;
      }
      if (touched.password) {
        const e = validateField('password', password);
        if (e) newErrors.password = e;
      }
      if (touched.seats) {
        const e = validateField('seats', seats);
        if (e) newErrors.seats = e;
      }
      if (touched.acceptTerms && !acceptTerms) {
        newErrors.acceptTerms = 'You must accept the terms and conditions to register.';
      }
    } else if (mode === 'sign-in') {
      if (touched.email) {
        const e = validateField('email', email, false);
        if (e) newErrors.email = e;
      }
      if (touched.password) {
        const e = validateField('password', password);
        if (e) newErrors.password = e;
      }
    } else if (mode === 'reset') {
      if (touched.email) {
        const e = validateField('email', email, true);
        if (e) newErrors.email = e;
      }
    }

    setErrors(newErrors);
  }, [fullName, orgName, email, password, seats, acceptTerms, touched, mode]);

  // Overall form validity check
  const isFormValid = () => {
    if (mode === 'sign-up') {
      const fnErr = validateField('fullName', fullName);
      const onErr = validateField('orgName', orgName);
      const emErr = validateField('email', email, false);
      const pwErr = validateField('password', password);
      const stErr = validateField('seats', seats);
      return !fnErr && !onErr && !emErr && !pwErr && !stErr && acceptTerms;
    }
    if (mode === 'sign-in') {
      const emErr = validateField('email', email, false);
      const pwErr = validateField('password', password);
      return !emErr && !pwErr && email.trim() !== '' && password !== '';
    }
    if (mode === 'reset') {
      const emErr = validateField('email', email, false);
      return !emErr && email.trim() !== '';
    }
    return false;
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid()) {
      setHelperNotice('Please complete all required fields and accept terms to proceed.');
      return;
    }

    setHelperNotice(null);
    if (mode === 'sign-in') {
      setSubmitFeedback('Signing in securely... Redirecting to supervisor dashboard.');
    } else if (mode === 'sign-up') {
      setSubmitFeedback('Registration submitted! Verification code sent to ' + email);
    } else {
      setSubmitFeedback('If an account exists with this email, password reset instructions have been sent.');
    }
  };

  const handleDisabledClick = () => {
    if (!isFormValid()) {
      setHelperNotice('Action blocked: Please resolve highlighted errors and accept the terms to continue.');
    }
  };

  return (
    <div className="auth-wrapper" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', background: 'var(--color-surface)' }}>
      
      {/* Brand Header */}
      <header style={{ marginBottom: '28px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 700, color: 'var(--color-primary)', letterSpacing: '-0.02em', margin: '0 0 8px 0' }}>
          FieldLog
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--color-on-surface-variant)', margin: 0 }}>
          Environmental Remediation & Site Intelligence
        </p>
      </header>

      {/* Main Single Page Authentication Card */}
      <main
        style={{
          width: '100%',
          maxWidth: '460px',
          background: '#ffffff',
          borderRadius: '16px',
          border: '1px solid var(--color-outline-variant)',
          boxShadow: 'var(--elevation-soft)',
          padding: '32px'
        }}
      >
        {/* Navigation Tabs (SPA Conditional Routing) */}
        <nav aria-label="Authentication modes" style={{ display: 'flex', borderBottom: '1px solid var(--color-outline-variant)', marginBottom: '24px' }}>
          <button
            type="button"
            onClick={() => switchMode('sign-in')}
            style={{
              flex: 1,
              padding: '12px 0',
              background: 'none',
              border: 'none',
              borderBottom: mode === 'sign-in' ? '3px solid var(--color-primary)' : '3px solid transparent',
              color: mode === 'sign-in' ? 'var(--color-primary)' : 'var(--color-on-surface-variant)',
              fontWeight: mode === 'sign-in' ? 700 : 500,
              fontSize: '15px',
              cursor: 'pointer'
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => switchMode('sign-up')}
            style={{
              flex: 1,
              padding: '12px 0',
              background: 'none',
              border: 'none',
              borderBottom: mode === 'sign-up' ? '3px solid var(--color-primary)' : '3px solid transparent',
              color: mode === 'sign-up' ? 'var(--color-primary)' : 'var(--color-on-surface-variant)',
              fontWeight: mode === 'sign-up' ? 700 : 500,
              fontSize: '15px',
              cursor: 'pointer'
            }}
          >
            Create Organisation
          </button>
          <button
            type="button"
            onClick={() => switchMode('reset')}
            style={{
              flex: 1,
              padding: '12px 0',
              background: 'none',
              border: 'none',
              borderBottom: mode === 'reset' ? '3px solid var(--color-primary)' : '3px solid transparent',
              color: mode === 'reset' ? 'var(--color-primary)' : 'var(--color-on-surface-variant)',
              fontWeight: mode === 'reset' ? 700 : 500,
              fontSize: '15px',
              cursor: 'pointer'
            }}
          >
            Reset
          </button>
        </nav>

        {/* Informative Header per Mode */}
        <div style={{ marginBottom: '20px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--color-on-surface)', margin: '0 0 6px 0' }}>
            {mode === 'sign-in' && 'Supervisor & Reviewer Sign In'}
            {mode === 'sign-up' && 'Register New Organisation'}
            {mode === 'reset' && 'Reset Forgotten Password'}
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--color-on-surface-variant)', margin: 0 }}>
            {mode === 'sign-in' && 'Enter your credentials to access your assigned site entries and reports.'}
            {mode === 'sign-up' && 'Create your organisation tenant and admin account. Starts with a 14-day free trial.'}
            {mode === 'reset' && 'Enter your registered email address to receive a secure, single-use reset link.'}
          </p>
        </div>

        {/* Accessible Helper / Error Notice Banner */}
        {helperNotice && (
          <div
            role="alert"
            style={{
              padding: '12px 14px',
              background: 'var(--color-error-container)',
              color: 'var(--color-on-error-container)',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 500,
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <span aria-hidden="true" style={{ fontSize: '16px' }}>⚠️</span>
            <span>{helperNotice}</span>
          </div>
        )}

        {submitFeedback && (
          <div
            role="status"
            style={{
              padding: '12px 14px',
              background: 'var(--color-success-container)',
              color: 'var(--color-on-success-container)',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 500,
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <span aria-hidden="true" style={{ fontSize: '16px' }}>✅</span>
            <span>{submitFeedback}</span>
          </div>
        )}

        {/* The Form */}
        <form onSubmit={handleSubmit} noValidate>

          {/* SIGN UP ONLY: Full Name */}
          {mode === 'sign-up' && (
            <div style={{ marginBottom: '16px' }}>
              <label
                htmlFor="field-fullName"
                style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--color-on-surface)', marginBottom: '6px' }}
              >
                Lead Administrator Full Name <span aria-hidden="true" style={{ color: 'var(--color-error)' }}>*</span>
              </label>
              <input
                id="field-fullName"
                type="text"
                autoComplete="name"
                required
                aria-required="true"
                aria-invalid={errors.fullName ? 'true' : 'false'}
                aria-describedby={errors.fullName ? 'err-fullName' : undefined}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                onBlur={() => handleBlur('fullName')}
                placeholder="e.g. John Henderson"
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  border: errors.fullName ? '2px solid var(--color-error)' : '1px solid var(--color-outline)',
                  fontSize: '14px',
                  outline: 'none',
                  background: '#ffffff'
                }}
              />
              {errors.fullName && (
                <div id="err-fullName" role="alert" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-error)', fontSize: '12px', marginTop: '6px' }}>
                  <span aria-hidden="true">⚠️</span>
                  <span>{errors.fullName}</span>
                </div>
              )}
            </div>
          )}

          {/* SIGN UP ONLY: Organisation Name */}
          {mode === 'sign-up' && (
            <div style={{ marginBottom: '16px' }}>
              <label
                htmlFor="field-orgName"
                style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--color-on-surface)', marginBottom: '6px' }}
              >
                Organisation / Company Name <span aria-hidden="true" style={{ color: 'var(--color-error)' }}>*</span>
              </label>
              <input
                id="field-orgName"
                type="text"
                autoComplete="organization"
                required
                aria-required="true"
                aria-invalid={errors.orgName ? 'true' : 'false'}
                aria-describedby={errors.orgName ? 'err-orgName' : undefined}
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                onBlur={() => handleBlur('orgName')}
                placeholder="e.g. EnviroRemediation Ltd"
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  border: errors.orgName ? '2px solid var(--color-error)' : '1px solid var(--color-outline)',
                  fontSize: '14px',
                  outline: 'none',
                  background: '#ffffff'
                }}
              />
              {errors.orgName && (
                <div id="err-orgName" role="alert" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-error)', fontSize: '12px', marginTop: '6px' }}>
                  <span aria-hidden="true">⚠️</span>
                  <span>{errors.orgName}</span>
                </div>
              )}
            </div>
          )}

          {/* ALL MODES: Email Field */}
          <div style={{ marginBottom: '16px' }}>
            <label
              htmlFor="field-email"
              style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--color-on-surface)', marginBottom: '6px' }}
            >
              Work Email Address <span aria-hidden="true" style={{ color: 'var(--color-error)' }}>*</span>
            </label>
            <input
              id="field-email"
              type="email"
              autoComplete="email"
              required
              aria-required="true"
              aria-invalid={errors.email ? 'true' : 'false'}
              aria-describedby={errors.email ? 'err-email' : undefined}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => handleBlur('email')}
              placeholder="e.g. supervisor@company.com"
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '8px',
                border: errors.email ? '2px solid var(--color-error)' : '1px solid var(--color-outline)',
                fontSize: '14px',
                outline: 'none',
                background: '#ffffff'
              }}
            />
            {errors.email && (
              <div id="err-email" role="alert" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-error)', fontSize: '12px', marginTop: '6px' }}>
                <span aria-hidden="true">⚠️</span>
                <span>{errors.email}</span>
              </div>
            )}
          </div>

          {/* SIGN IN & SIGN UP: Password Field */}
          {mode !== 'reset' && (
            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label
                  htmlFor="field-password"
                  style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-on-surface)' }}
                >
                  Password <span aria-hidden="true" style={{ color: 'var(--color-error)' }}>*</span>
                </label>
                {mode === 'sign-in' && (
                  <button
                    type="button"
                    onClick={() => switchMode('reset')}
                    style={{ background: 'none', border: 'none', color: 'var(--color-primary)', fontSize: '12px', cursor: 'pointer', padding: 0 }}
                  >
                    Forgot password?
                  </button>
                )}
              </div>

              <div style={{ position: 'relative' }}>
                <input
                  id="field-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete={mode === 'sign-in' ? 'current-password' : 'new-password'}
                  required
                  aria-required="true"
                  aria-invalid={errors.password ? 'true' : 'false'}
                  aria-describedby={errors.password ? 'err-password' : (mode === 'sign-up' && password.length > 0 ? 'hint-password' : undefined)}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={() => handleBlur('password')}
                  placeholder={mode === 'sign-in' ? 'Enter your password' : 'Create strong password'}
                  style={{
                    width: '100%',
                    padding: '10px 42px 10px 14px',
                    borderRadius: '8px',
                    border: errors.password ? '2px solid var(--color-error)' : '1px solid var(--color-outline)',
                    fontSize: '14px',
                    outline: 'none',
                    background: '#ffffff'
                  }}
                />
                <button
                  type="button"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '14px',
                    color: 'var(--color-on-surface-variant)'
                  }}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>

              {/* Anti-enumeration requirement hint: ONLY shown once user begins typing */}
              {mode === 'sign-up' && password.length > 0 && !errors.password && (
                <p id="hint-password" style={{ fontSize: '12px', color: 'var(--color-on-surface-variant)', margin: '6px 0 0 0' }}>
                  Requirement: Minimum 10 characters length.
                </p>
              )}

              {errors.password && (
                <div id="err-password" role="alert" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-error)', fontSize: '12px', marginTop: '6px' }}>
                  <span aria-hidden="true">⚠️</span>
                  <span>{errors.password}</span>
                </div>
              )}
            </div>
          )}

          {/* SIGN UP ONLY: Supervisor Seats Field (Demonstrating Step 4 Input Type Selection) */}
          {mode === 'sign-up' && (
            <div style={{ marginBottom: '18px', padding: '12px', background: 'var(--color-surface-container-low)', borderRadius: '8px', border: '1px dashed var(--color-outline-variant)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label
                  htmlFor={useAnnoyingNumberInput ? 'field-seats-number' : 'field-seats-text'}
                  style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-on-surface)' }}
                >
                  Initial Supervisor Seats ({useAnnoyingNumberInput ? 'type="number" (annoying spinners)' : 'type="text" inputmode="numeric" (clean)'})
                </label>
                <button
                  type="button"
                  onClick={() => setUseAnnoyingNumberInput(!useAnnoyingNumberInput)}
                  style={{ fontSize: '11px', background: 'none', border: 'none', color: 'var(--color-primary)', textDecoration: 'underline', cursor: 'pointer', padding: 0 }}
                >
                  Switch to {useAnnoyingNumberInput ? 'clean text input' : 'annoying number input'}
                </button>
              </div>

              {useAnnoyingNumberInput ? (
                /* The Annoying Number Input: shows spinners, default zero, 0400 leading zero bug */
                <input
                  id="field-seats-number"
                  type="number"
                  min="1"
                  max="500"
                  value={seats}
                  onChange={(e) => setSeats(e.target.value)}
                  onBlur={() => handleBlur('seats')}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid var(--color-warning)',
                    fontSize: '14px'
                  }}
                />
              ) : (
                /* The Correct Clean Text Input with numeric pattern */
                <input
                  id="field-seats-text"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  autoComplete="off"
                  value={seats}
                  onChange={(e) => {
                    const clean = e.target.value.replace(/\D/g, '');
                    setSeats(clean);
                  }}
                  onBlur={() => handleBlur('seats')}
                  placeholder="5"
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid var(--color-outline)',
                    fontSize: '14px'
                  }}
                />
              )}
              <p style={{ fontSize: '11px', color: 'var(--color-on-surface-variant)', margin: '4px 0 0 0' }}>
                Fee: ₦7,300 per active supervisor per month in test mode after trial.
              </p>
            </div>
          )}

          {/* SIGN UP ONLY: Terms and Conditions Acceptance Checkbox */}
          {mode === 'sign-up' && (
            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <input
                  id="field-acceptTerms"
                  type="checkbox"
                  required
                  aria-required="true"
                  aria-invalid={errors.acceptTerms ? 'true' : 'false'}
                  aria-describedby={errors.acceptTerms ? 'err-terms' : undefined}
                  checked={acceptTerms}
                  onChange={(e) => {
                    setAcceptTerms(e.target.checked);
                    setTouched((prev) => ({ ...prev, acceptTerms: true }));
                  }}
                  style={{ marginTop: '3px', cursor: 'pointer', width: '16px', height: '16px' }}
                />
                <label
                  htmlFor="field-acceptTerms"
                  style={{ fontSize: '12px', color: 'var(--color-on-surface)', lineHeight: '1.4', cursor: 'pointer' }}
                >
                  I agree to the <Link href="/terms" target="_blank" style={{ color: 'var(--color-primary)', textDecoration: 'underline' }}>FieldLog Terms of Service</Link> and <Link href="/privacy" target="_blank" style={{ color: 'var(--color-primary)', textDecoration: 'underline' }}>Remediation Data Governance Policy</Link>.
                </label>
              </div>
              {errors.acceptTerms && (
                <div id="err-terms" role="alert" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-error)', fontSize: '12px', marginTop: '6px' }}>
                  <span aria-hidden="true">⚠️</span>
                  <span>{errors.acceptTerms}</span>
                </div>
              )}
            </div>
          )}

          {/* Demo toggle for Step 7: Hidden Button vs Disabled Button */}
          <div style={{ marginBottom: '14px', textAlign: 'right' }}>
            <button
              type="button"
              onClick={() => setUseHiddenButton(!useHiddenButton)}
              style={{ fontSize: '11px', background: 'none', border: 'none', color: 'var(--color-on-surface-variant)', textDecoration: 'underline', cursor: 'pointer', padding: 0 }}
            >
              Demo: {useHiddenButton ? 'show disabled button (good UX)' : 'hide button until valid (bad UX)'}
            </button>
          </div>

          {/* Submit Button (Hidden version vs Accessible Disabled version) */}
          {useHiddenButton ? (
            isFormValid() ? (
              <button
                type="submit"
                style={{
                  width: '100%',
                  padding: '12px 18px',
                  borderRadius: '8px',
                  background: 'var(--color-primary)',
                  color: 'var(--color-on-primary)',
                  border: 'none',
                  fontSize: '15px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                {mode === 'sign-in' && 'Sign In to FieldLog'}
                {mode === 'sign-up' && 'Start 14-Day Free Trial'}
                {mode === 'reset' && 'Send Reset Link'}
              </button>
            ) : null
          ) : (
            <div onClick={handleDisabledClick} style={{ width: '100%' }}>
              <button
                type="submit"
                disabled={!isFormValid()}
                aria-disabled={!isFormValid()}
                style={{
                  width: '100%',
                  padding: '12px 18px',
                  borderRadius: '8px',
                  background: isFormValid() ? 'var(--color-primary)' : 'var(--color-surface-container-highest)',
                  color: isFormValid() ? 'var(--color-on-primary)' : 'var(--color-outline)',
                  border: 'none',
                  fontSize: '15px',
                  fontWeight: 600,
                  cursor: isFormValid() ? 'pointer' : 'not-allowed',
                  transition: 'background 0.2s ease'
                }}
              >
                {mode === 'sign-in' && 'Sign In to FieldLog'}
                {mode === 'sign-up' && 'Start 14-Day Free Trial'}
                {mode === 'reset' && 'Send Reset Link'}
              </button>
            </div>
          )}

        </form>

        {/* Footer Navigation */}
        <footer style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--color-outline-variant)', textAlign: 'center' }}>
          <p style={{ fontSize: '13px', color: 'var(--color-on-surface-variant)', margin: 0 }}>
            {mode === 'sign-in' && (
              <>
                New organisation?{' '}
                <button
                  type="button"
                  onClick={() => switchMode('sign-up')}
                  style={{ background: 'none', border: 'none', color: 'var(--color-primary)', fontWeight: 600, cursor: 'pointer', padding: 0 }}
                >
                  Sign up here
                </button>
              </>
            )}
            {mode === 'sign-up' && (
              <>
                Already have an organisation?{' '}
                <button
                  type="button"
                  onClick={() => switchMode('sign-in')}
                  style={{ background: 'none', border: 'none', color: 'var(--color-primary)', fontWeight: 600, cursor: 'pointer', padding: 0 }}
                >
                  Sign in
                </button>
              </>
            )}
            {mode === 'reset' && (
              <>
                Remember your password?{' '}
                <button
                  type="button"
                  onClick={() => switchMode('sign-in')}
                  style={{ background: 'none', border: 'none', color: 'var(--color-primary)', fontWeight: 600, cursor: 'pointer', padding: 0 }}
                >
                  Back to Sign In
                </button>
              </>
            )}
          </p>
        </footer>
      </main>

      {/* Security Context Tag */}
      <footer style={{ marginTop: '20px', textAlign: 'center' }}>
        <p style={{ fontSize: '12px', color: 'var(--color-on-surface-variant)', margin: 0 }}>
          FieldLog V1 · UK & EU Data Region (A5) · TLS 1.3 Strict Security
        </p>
      </footer>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={<div style={{ padding: '40px', textAlign: 'center', color: '#1B5EAD' }}>Loading authentication interface...</div>}>
      <SignInContent />
    </Suspense>
  );
}
