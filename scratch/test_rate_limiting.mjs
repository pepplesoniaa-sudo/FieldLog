import http from 'http';

const validPayload = {
  fullName: "Tunde Bakare",
  email: "tunde@fieldlog.internal",
  password: "StrongRemediationPassword2026!",
  orgName: "Acme Remediation Ltd",
  seats: 10,
  acceptTerms: true
};

function sendRequest(ip, attemptNum) {
  return new Promise((resolve) => {
    const postData = JSON.stringify({
      ...validPayload,
      email: `tunde${attemptNum}_${Date.now()}@fieldlog.internal`
    });

    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/auth/register',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
        'x-forwarded-for': ip
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (c) => body += c);
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          body: JSON.parse(body)
        });
      });
    });
    req.write(postData);
    req.end();
  });
}

async function run() {
  const ipBlocked = '198.51.100.14'; // Simulated shared IP
  console.log(`=== TRIGGERING RATE LIMIT FOR IP: ${ipBlocked} (Max 5/hr) ===`);

  for (let i = 1; i <= 5; i++) {
    const res = await sendRequest(ipBlocked, i);
    console.log(`Attempt ${i}: HTTP ${res.status} - ${res.body.status || res.body.message}`);
  }

  console.log(`\nAttempt 6 (Should be blocked by rate limit):`);
  const blockedRes = await sendRequest(ipBlocked, 6);
  console.log(`Attempt 6: HTTP ${blockedRes.status} (Expected 429)`);
  console.log(`Retry-After Header: ${blockedRes.headers['retry-after']} seconds`);
  console.log(`Response Body:\n${JSON.stringify(blockedRes.body, null, 2)}`);

  console.log(`\n=== DEFEATING RATE LIMIT BY ROTATING IP TO: 203.0.113.88 ===`);
  const defeatedRes = await sendRequest('203.0.113.88', 7);
  console.log(`Attempt 7 (New IP): HTTP ${defeatedRes.status} (Expected 201)`);
  console.log(`Response Body:\n${JSON.stringify(defeatedRes.body, null, 2)}`);
}

run();
