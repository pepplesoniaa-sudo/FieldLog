# The False Success Investigation

## 1. What the User Saw
When submitting the site enquiry form with the database connection severed, the supervisor saw a smooth, polished green checkmark banner reading:
> *"Success! Your site enquiry has been logged successfully."*

The form inputs cleared, the submit button transitioned from a loading spinner back to quiescent state, and the UI gave every cosmetic appearance of complete success.

---

## 2. What Actually Happened
On the server, the database initialization threw a fatal connection error (`P1001: Can't reach database server at localhost:5433`). 
The HTTP request aborted after a 3,000 ms timeout and returned a `500 Internal Server Error`.
Zero rows were inserted. The supervisor's critical site entry was completely dropped into the void.

---

## 3. How a Demo Reviewer Would Have Been Fooled
In a typical product walkthrough or executive demo:
1. The presenter fills out the form with sample data.
2. The UI smoothly transitions to a green confirmation screen.
3. The demo moves on to the next screen.

Without verifying the database table directly or checking server status codes in the network inspector, an observer (or founder) assumes the entire full-stack pipeline works. This is the single most common failure in AI-generated software: agents write optimistic frontend handlers that catch network errors, swallow the rejection, and fire the success UI state regardless of server persistence.

---

## 4. The 30-Second Check That Catches It
Open browser DevTools Network tab. Check the HTTP response status code for the form POST request.
If the status is not **201 Created** (or at minimum 200 with an explicit payload containing the server-generated primary key ID), the data was **not stored**, no matter what the rendered UI displays.
