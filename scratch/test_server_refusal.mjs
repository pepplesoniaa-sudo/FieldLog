import http from 'http';

const attackPayload = {
  fullName: "a",
  email: "bot-attack-no-at-sign",
  password: "short",
  orgName: "x",
  seats: -999,
  acceptTerms: false
};

const postData = JSON.stringify(attackPayload);

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/auth/register',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData),
    'x-forwarded-for': '192.168.1.50'
  }
};

const req = http.request(options, (res) => {
  let responseData = '';
  res.on('data', (chunk) => {
    responseData += chunk;
  });
  res.on('end', () => {
    console.log(`HTTP STATUS: ${res.statusCode} ${res.statusMessage}`);
    console.log(`RESPONSE BODY:\n${JSON.stringify(JSON.parse(responseData), null, 2)}`);
  });
});

req.on('error', (e) => {
  console.error(`Request problem: ${e.message}`);
});

req.write(postData);
req.end();
