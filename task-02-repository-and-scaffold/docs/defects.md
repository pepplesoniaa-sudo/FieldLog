# Task 2: Known Engineering Defects

## Defect 1: Optimistic State Resolution Without Response Status Code Check
* **File & Line**: `app/components/site-enquiry-form.tsx`, line 42
* **Code**:
  ```typescript
  const response = await fetch('/api/sites/enquiry', { method: 'POST', body: JSON.stringify(data) });
  setSuccess(true); // Bug: Fires without verifying response.ok or response.status === 201
  ```
* **The Problem**: The client code assumes that if `fetch()` completes without throwing a network exception, the operation succeeded. It completely ignores HTTP status codes like `500 Internal Server Error` or `400 Bad Request`.
* **Production Cost**: In production, if the database connection drops or a validation rule fails on the server, the user is presented with a triumphant "Saved Successfully" message. Field supervisors assume their shift notes are safely stored, while the backend recorded zero data, leading directly to irreversible loss of regulatory site observations.

---

## Defect 2: Missing `aria-live` Region on Form Feedback Banners
* **File & Line**: `app/components/site-enquiry-form.tsx`, line 78
* **Code**:
  ```tsx
  {error && <div className="alert-error">{error}</div>}
  ```
* **The Problem**: The alert container lacks `role="alert"` and `aria-live="assertive"` or `aria-live="polite"`.
* **Production Cost**: For a visually impaired or screen reader user, when submission fails, focus remains trapped on the submit button. The error message renders visually on the screen but assistive technologies do not announce it. The user continues pressing submit repeatedly with no programmatic indication of what went wrong.
