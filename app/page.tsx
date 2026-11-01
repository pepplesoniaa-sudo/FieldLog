import Link from 'next/link';

export default function HomePage() {
  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--color-surface)',
        color: 'var(--color-on-surface)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* ====================================================================
          1. NAVIGATION HEADER
          ==================================================================== */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          backgroundColor: 'rgba(249, 249, 252, 0.92)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          borderBottom: '1px solid var(--color-outline-variant)',
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0.875rem 1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* Logo & Brand Identity */}
          <Link
            href="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              textDecoration: 'none',
              color: 'inherit',
            }}
          >
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                backgroundColor: 'var(--color-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'var(--shadow-soft)',
                overflow: 'hidden',
              }}
            >
              <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
                <rect x="6" y="6" width="4.5" height="20" rx="2" fill="#FFFFFF" />
                <rect x="10.5" y="6" width="15" height="4.5" rx="2" fill="#FFFFFF" />
                <rect x="10.5" y="13.5" width="10.5" height="4" rx="2" fill="#D6E3FF" />
                <circle cx="23" cy="22.5" r="3" fill="#10B981" />
              </svg>
            </div>
            <div>
              <span
                className="type-title-large"
                style={{
                  fontWeight: 700,
                  color: 'var(--color-primary)',
                  letterSpacing: '-0.3px',
                  display: 'block',
                  lineHeight: '1.2',
                }}
              >
                FieldLog
              </span>
              <span
                className="type-label-small"
                style={{
                  color: 'var(--color-on-surface-variant)',
                  fontSize: '0.625rem',
                  letterSpacing: '0.5px',
                  textTransform: 'uppercase',
                }}
              >
                Site Reporting
              </span>
            </div>
          </Link>

          {/* Quick Access Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Link
              href="/sign-in?mode=sign-in"
              className="type-label-large"
              style={{
                color: 'var(--color-primary)',
                textDecoration: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                border: '1px solid var(--color-outline-variant)',
                backgroundColor: 'var(--color-surface)',
                transition: 'all 0.15s ease',
              }}
            >
              Supervisor Sign In
            </Link>
            <Link
              href="/sign-in?mode=sign-up"
              className="type-label-large"
              style={{
                color: 'var(--color-on-primary)',
                backgroundColor: 'var(--color-primary)',
                textDecoration: 'none',
                padding: '0.5rem 1.25rem',
                borderRadius: '6px',
                boxShadow: 'var(--shadow-soft)',
                fontWeight: 600,
                transition: 'all 0.15s ease',
              }}
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* ====================================================================
          2. HERO SECTION
          ==================================================================== */}
      <section
        style={{
          padding: '4.5rem 1.5rem 3.5rem',
          maxWidth: '1200px',
          margin: '0 auto',
          width: '100%',
          textAlign: 'center',
        }}
      >
        {/* Compliance / Status Pill */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            backgroundColor: 'var(--color-primary-container)',
            color: 'var(--color-on-primary-container)',
            padding: '0.375rem 1rem',
            borderRadius: '9999px',
            marginBottom: '1.5rem',
            boxShadow: 'var(--shadow-soft)',
          }}
          className="type-label-small"
        >
          <span
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#066E28',
              display: 'inline-block',
            }}
          />
          <span style={{ fontWeight: 700 }}>OFFLINE-FIRST PWA</span>
          <span>•</span>
          <span>ZERO DATA LOSS GUARANTEE</span>
        </div>

        {/* Hero Title */}
        <h1
          className="type-display-large"
          style={{
            color: 'var(--color-on-surface)',
            maxWidth: '22ch',
            margin: '0 auto 1.25rem',
            lineHeight: 1.15,
          }}
        >
          Environmental Site Reporting.{' '}
          <span style={{ color: 'var(--color-primary)' }}>Field-Proven.</span>
        </h1>

        {/* Hero Subtitle */}
        <p
          className="type-body-large"
          style={{
            maxWidth: '720px',
            margin: '0 auto 2.5rem',
            color: 'var(--color-on-surface-variant)',
            fontSize: '1.125rem',
            lineHeight: 1.6,
          }}
        >
          Built for supervisors on remediation and restoration sites. Capture high-resolution
          photos, coordinates, and structured notes once—even with zero cellular reception.
          Automatically compiles verified daily site reports with tamper-evident audit trails.
        </p>

        {/* Call to Actions */}
        <div
          style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center',
            flexWrap: 'wrap',
            marginBottom: '3.5rem',
          }}
        >
          <Link
            href="/sign-in?mode=sign-up"
            className="type-title-medium"
            style={{
              backgroundColor: 'var(--color-primary)',
              color: 'var(--color-on-primary)',
              padding: '0.875rem 2rem',
              borderRadius: '8px',
              textDecoration: 'none',
              boxShadow: 'var(--shadow-medium)',
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <span>Start 14-Day Free Trial</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </Link>

          <Link
            href="/sign-in?mode=sign-in"
            className="type-title-medium"
            style={{
              backgroundColor: 'var(--color-surface-container-low)',
              color: 'var(--color-on-surface)',
              border: '1px solid var(--color-outline-variant)',
              padding: '0.875rem 1.75rem',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: 600,
            }}
          >
            Sign In to FieldLog
          </Link>
        </div>

        {/* Value Proposition Metrics Strip */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1.25rem',
            maxWidth: '1080px',
            margin: '0 auto',
            textAlign: 'left',
          }}
        >
          <div
            style={{
              padding: '1.5rem',
              backgroundColor: 'var(--color-surface-container-low)',
              borderRadius: '12px',
              border: '1px solid var(--color-outline-variant)',
            }}
          >
            <div className="type-headline-medium" style={{ color: 'var(--color-primary)', marginBottom: '0.25rem' }}>
              100%
            </div>
            <div className="type-title-small" style={{ color: 'var(--color-on-surface)', marginBottom: '0.25rem' }}>
              Offline Autonomy
            </div>
            <p className="type-body-small" style={{ color: 'var(--color-on-surface-variant)', margin: 0 }}>
              Full capture & report compilation locally via IndexedDB without cellular connectivity.
            </p>
          </div>

          <div
            style={{
              padding: '1.5rem',
              backgroundColor: 'var(--color-surface-container-low)',
              borderRadius: '12px',
              border: '1px solid var(--color-outline-variant)',
            }}
          >
            <div className="type-headline-medium" style={{ color: 'var(--color-primary)', marginBottom: '0.25rem' }}>
              &lt; 2.0 s
            </div>
            <div className="type-title-small" style={{ color: 'var(--color-on-surface)', marginBottom: '0.25rem' }}>
              P95 Save Latency
            </div>
            <p className="type-body-small" style={{ color: 'var(--color-on-surface-variant)', margin: 0 }}>
              Instant single-transaction commit for entry text, coordinates, and photo assets.
            </p>
          </div>

          <div
            style={{
              padding: '1.5rem',
              backgroundColor: 'var(--color-surface-container-low)',
              borderRadius: '12px',
              border: '1px solid var(--color-outline-variant)',
            }}
          >
            <div className="type-headline-medium" style={{ color: 'var(--color-primary)', marginBottom: '0.25rem' }}>
              SHA-256
            </div>
            <div className="type-title-small" style={{ color: 'var(--color-on-surface)', marginBottom: '0.25rem' }}>
              Cryptographic Integrity
            </div>
            <p className="type-body-small" style={{ color: 'var(--color-on-surface-variant)', margin: 0 }}>
              Device-to-cloud photo hashing prevents tampering; submitted reports are permanently frozen.
            </p>
          </div>

          <div
            style={{
              padding: '1.5rem',
              backgroundColor: 'var(--color-surface-container-low)',
              borderRadius: '12px',
              border: '1px solid var(--color-outline-variant)',
            }}
          >
            <div className="type-headline-medium" style={{ color: 'var(--color-primary)', marginBottom: '0.25rem' }}>
              7 Years
            </div>
            <div className="type-title-small" style={{ color: 'var(--color-on-surface)', marginBottom: '0.25rem' }}>
              Statutory Retention
            </div>
            <p className="type-body-small" style={{ color: 'var(--color-on-surface-variant)', margin: 0 }}>
              Full audit logging and immutable EntryVersion history compliant with environmental regulators.
            </p>
          </div>
        </div>
      </section>

      {/* ====================================================================
          3. CORE ARCHITECTURAL PILLARS
          ==================================================================== */}
      <section
        style={{
          padding: '4rem 1.5rem',
          backgroundColor: 'var(--color-surface-container-low)',
          borderTop: '1px solid var(--color-outline-variant)',
          borderBottom: '1px solid var(--color-outline-variant)',
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 className="type-headline-large" style={{ color: 'var(--color-on-surface)', marginBottom: '0.5rem' }}>
              Engineered for Extreme Field Reliability
            </h2>
            <p className="type-body-large" style={{ color: 'var(--color-on-surface-variant)', maxWidth: '640px', margin: '0 auto' }}>
              Three foundational capabilities ensure supervisors never lose work and reviewers never receive incomplete drafts.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '2rem',
            }}
          >
            {/* Pillar 1 */}
            <div
              style={{
                backgroundColor: 'var(--color-surface)',
                borderRadius: '12px',
                padding: '2rem',
                border: '1px solid var(--color-outline-variant)',
                boxShadow: 'var(--shadow-soft)',
              }}
            >
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--color-primary-container)',
                  color: 'var(--color-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.25rem',
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <h3 className="type-title-large" style={{ color: 'var(--color-on-surface)', marginBottom: '0.5rem' }}>
                1. Rigorous Location & Capture
              </h3>
              <p className="type-body-medium" style={{ color: 'var(--color-on-surface-variant)', lineHeight: 1.6 }}>
                Quad-stage location fallback chain: Browser GPS (&lt;100m) &rarr; Photo EXIF &rarr; Manual Map Pin &rarr; None.
                Automatic flags catch out-of-site captures (&gt;500m), clock drift (&gt;10 min), and delayed gallery additions.
              </p>
            </div>

            {/* Pillar 2 */}
            <div
              style={{
                backgroundColor: 'var(--color-surface)',
                borderRadius: '12px',
                padding: '2rem',
                border: '1px solid var(--color-outline-variant)',
                boxShadow: 'var(--shadow-soft)',
              }}
            >
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--color-primary-container)',
                  color: 'var(--color-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.25rem',
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
              </div>
              <h3 className="type-title-large" style={{ color: 'var(--color-on-surface)', marginBottom: '0.5rem' }}>
                2. Automated Draft Assembly
              </h3>
              <p className="type-body-medium" style={{ color: 'var(--color-on-surface-variant)', lineHeight: 1.6 }}>
                Zero re-typing. Entries are grouped by Visit date and site into standardized reporting sections:
                Header, Weather, Work Summary, Entry Log, Observations, Flags, and Supervisor Certification.
              </p>
            </div>

            {/* Pillar 3 */}
            <div
              style={{
                backgroundColor: 'var(--color-surface)',
                borderRadius: '12px',
                padding: '2rem',
                border: '1px solid var(--color-outline-variant)',
                boxShadow: 'var(--shadow-soft)',
              }}
            >
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--color-primary-container)',
                  color: 'var(--color-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.25rem',
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>
              <h3 className="type-title-large" style={{ color: 'var(--color-on-surface)', marginBottom: '0.5rem' }}>
                3. Certified Review & PDF Export
              </h3>
              <p className="type-body-medium" style={{ color: 'var(--color-on-surface-variant)', lineHeight: 1.6 }}>
                Assigned reviewers certify reports or request changes with mandatory feedback.
                Approved revisions are locked with immutable snapshots and exported to certified PDF reports.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          4. WORKFLOW PROGRESSION
          ==================================================================== */}
      <section style={{ padding: '4.5rem 1.5rem', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <h2 className="type-headline-large" style={{ color: 'var(--color-on-surface)', marginBottom: '0.5rem' }}>
            From Muddy Boots to Approved Report
          </h2>
          <p className="type-body-large" style={{ color: 'var(--color-on-surface-variant)' }}>
            Designed specifically for remediation teams to end daily re-typing and transcription errors.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem',
            position: 'relative',
          }}
        >
          {/* Step 1 */}
          <div
            style={{
              padding: '1.75rem',
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-outline-variant)',
              borderRadius: '12px',
              boxShadow: 'var(--shadow-soft)',
            }}
          >
            <div
              className="type-title-medium"
              style={{
                color: 'var(--color-primary)',
                marginBottom: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <span
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-primary-container)',
                  color: 'var(--color-primary)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.875rem',
                  fontWeight: 700,
                }}
              >
                1
              </span>
              <span>Capture on Site (Offline)</span>
            </div>
            <p className="type-body-medium" style={{ color: 'var(--color-on-surface-variant)', lineHeight: 1.6 }}>
              Supervisors take photos and log activity types, units, and notes on mobile.
              Assets compress instantly (1,600px edge, &le;450KB) and write to local IndexedDB.
            </p>
          </div>

          {/* Step 2 */}
          <div
            style={{
              padding: '1.75rem',
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-outline-variant)',
              borderRadius: '12px',
              boxShadow: 'var(--shadow-soft)',
            }}
          >
            <div
              className="type-title-medium"
              style={{
                color: 'var(--color-primary)',
                marginBottom: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <span
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-primary-container)',
                  color: 'var(--color-primary)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.875rem',
                  fontWeight: 700,
                }}
              >
                2
              </span>
              <span>Add-Only Cloud Sync</span>
            </div>
            <p className="type-body-medium" style={{ color: 'var(--color-on-surface-variant)', lineHeight: 1.6 }}>
              When connectivity returns, operations stream via an add-only log. The server verifies
              photo SHA-256 checksums and locks revisions against unauthorized edits.
            </p>
          </div>

          {/* Step 3 */}
          <div
            style={{
              padding: '1.75rem',
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-outline-variant)',
              borderRadius: '12px',
              boxShadow: 'var(--shadow-soft)',
            }}
          >
            <div
              className="type-title-medium"
              style={{
                color: 'var(--color-primary)',
                marginBottom: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <span
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-primary-container)',
                  color: 'var(--color-primary)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.875rem',
                  fontWeight: 700,
                }}
              >
                3
              </span>
              <span>Review & Export PDF</span>
            </div>
            <p className="type-body-medium" style={{ color: 'var(--color-on-surface-variant)', lineHeight: 1.6 }}>
              Project reviewers review completeness on desktop, approve or request revisions, and
              instantly export the final signed report as an environmental compliance PDF.
            </p>
          </div>
        </div>
      </section>

      {/* ====================================================================
          5. CTA CONVERSION BANNER
          ==================================================================== */}
      <section
        style={{
          backgroundColor: 'var(--color-primary)',
          color: 'var(--color-on-primary)',
          padding: '4rem 1.5rem',
          textAlign: 'center',
        }}
      >
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 className="type-headline-large" style={{ color: '#FFFFFF', marginBottom: '1rem' }}>
            Ready to Modernise Site Operations?
          </h2>
          <p
            className="type-body-large"
            style={{
              color: 'var(--palette-primary-90)',
              marginBottom: '2rem',
              fontSize: '1.125rem',
            }}
          >
            Create an organisation account today. Includes a 14-day free trial with full offline capture,
            unlimited reviewers, and standard environmental reporting templates.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              href="/sign-in?mode=sign-up"
              className="type-title-medium"
              style={{
                backgroundColor: '#FFFFFF',
                color: 'var(--color-primary)',
                padding: '0.875rem 2.25rem',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: 700,
                boxShadow: '0 4px 14px rgba(0,0,0,0.2)',
              }}
            >
              Register Organisation
            </Link>
            <Link
              href="/sign-in?mode=sign-in"
              className="type-title-medium"
              style={{
                backgroundColor: 'transparent',
                color: '#FFFFFF',
                border: '1.5px solid #FFFFFF',
                padding: '0.875rem 2rem',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: 600,
              }}
            >
              Supervisor Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* ====================================================================
          6. STATUTORY & ARCHITECTURAL FOOTER
          ==================================================================== */}
      <footer
        style={{
          backgroundColor: 'var(--palette-neutral-10)',
          color: 'var(--palette-neutral-80)',
          padding: '3rem 1.5rem 2rem',
          borderTop: '1px solid var(--palette-neutral-20)',
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '2.5rem',
            marginBottom: '2.5rem',
          }}
        >
          {/* Col 1: Brand & Standards */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '6px',
                  backgroundColor: 'var(--color-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <svg width="18" height="18" viewBox="0 0 32 32" fill="none">
                  <rect x="6" y="6" width="4.5" height="20" rx="2" fill="#FFFFFF" />
                  <rect x="10.5" y="6" width="15" height="4.5" rx="2" fill="#FFFFFF" />
                  <circle cx="23" cy="22.5" r="3" fill="#10B981" />
                </svg>
              </div>
              <span className="type-title-medium" style={{ color: '#FFFFFF', fontWeight: 700 }}>
                FieldLog
              </span>
            </div>
            <p className="type-body-small" style={{ color: 'var(--palette-neutral-80)', lineHeight: 1.5 }}>
              The canonical environmental remediation daily site reporting platform.
              Guaranteed offline capture, zero data loss, and immutable audit trails.
            </p>
          </div>

          {/* Col 2: Core Platform Routes */}
          <div>
            <div className="type-label-large" style={{ color: '#FFFFFF', marginBottom: '0.75rem', textTransform: 'uppercase' }}>
              Platform Zones
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li>
                <Link href="/sign-in?mode=sign-in" className="type-body-small" style={{ color: 'var(--palette-neutral-80)', textDecoration: 'none' }}>
                  Field Capture & Today
                </Link>
              </li>
              <li>
                <Link href="/sign-in?mode=sign-in" className="type-body-small" style={{ color: 'var(--palette-neutral-80)', textDecoration: 'none' }}>
                  Review Queue & Reports
                </Link>
              </li>
              <li>
                <Link href="/sign-in?mode=sign-in" className="type-body-small" style={{ color: 'var(--palette-neutral-80)', textDecoration: 'none' }}>
                  Organisation Administration
                </Link>
              </li>
              <li>
                <Link href="/sign-in?mode=sign-up" className="type-body-small" style={{ color: 'var(--palette-neutral-80)', textDecoration: 'none' }}>
                  Organisation Registration
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Specifications & Compliance */}
          <div>
            <div className="type-label-large" style={{ color: '#FFFFFF', marginBottom: '0.75rem', textTransform: 'uppercase' }}>
              Compliance Standards
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li className="type-body-small" style={{ color: 'var(--palette-neutral-80)' }}>
                7-Year Statutory Audit Retention
              </li>
              <li className="type-body-small" style={{ color: 'var(--palette-neutral-80)' }}>
                Immutable EntryVersion History
              </li>
              <li className="type-body-small" style={{ color: 'var(--palette-neutral-80)' }}>
                SHA-256 Photo Hash Verification
              </li>
              <li className="type-body-small" style={{ color: 'var(--palette-neutral-80)' }}>
                WCAG 2.2 AA Accessibility
              </li>
            </ul>
          </div>

          {/* Col 4: Diagnostics & Liveness */}
          <div>
            <div className="type-label-large" style={{ color: '#FFFFFF', marginBottom: '0.75rem', textTransform: 'uppercase' }}>
              System Health
            </div>
            <p className="type-body-small" style={{ color: 'var(--palette-neutral-80)', marginBottom: '0.75rem' }}>
              Engineered with Next.js App Router, Dexie local store, and Serwist PWA service worker.
            </p>
            <Link
              href="/api/health"
              className="type-label-small"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                backgroundColor: 'rgba(16, 185, 129, 0.15)',
                color: '#34D399',
                padding: '0.375rem 0.75rem',
                borderRadius: '6px',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                textDecoration: 'none',
              }}
            >
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10B981' }} />
              <span>Verify Health Endpoint</span>
            </Link>
          </div>
        </div>

        {/* Copyright & Disclaimer */}
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            borderTop: '1px solid var(--palette-neutral-20)',
            paddingTop: '1.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <p className="type-body-small" style={{ color: 'var(--palette-neutral-80)', margin: 0 }}>
            &copy; 2026 FieldLog. All rights reserved. Environmental remediation daily site reporting platform.
          </p>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <span className="type-label-small" style={{ color: 'var(--palette-neutral-80)' }}>
              PRD v2.4 Specification Conformance
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
