import http from 'http';

const breachPayload = {
  fullName: "Tunde Bakare",
  email: "tunde.breach@fieldlog.internal",
  password: "password123", // Known breached password
  orgName: "Acme Remediation Ltd",
  seats: 5,
  acceptTerms: true
};

const postData = JSON.stringify(breachPayload);

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/auth/register',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData),
    'x-forwarded-for': '203.0.113.99'
  }
};

const req = http.request(options, (res) => {
  let body = '';
  res.on('data', (c) => body += c);
  res.on('end', () => {
    console.log(`HTTP STATUS: ${res.statusCode} ${res.statusMessage}`);
    console.log(`RESPONSE BODY:\n${JSON.stringify(JSON.parse(body), null, 2)}`);
  });
});

req.write(postData);
req.end();
