import http from 'http';

function verify(email, code) {
  return new Promise((resolve) => {
    const postData = JSON.stringify({ email, code });
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/auth/verify',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (c) => body += c);
      res.on('end', () => {
        resolve({ status: res.statusCode, body: JSON.parse(body) });
      });
    });
    req.write(postData);
    req.end();
  });
}

async function run() {
  console.log('=== TEST 1: SUCCESSFUL VERIFICATION ===');
  const res1 = await verify('valid@fieldlog.internal', '849201');
  console.log(`Status: HTTP ${res1.status}\nBody:`, res1.body);

  console.log('\n=== TEST 2: EXPIRED CODE ===');
  const res2 = await verify('expired@fieldlog.internal', '112233');
  console.log(`Status: HTTP ${res2.status}\nBody:`, res2.body);

  console.log('\n=== TEST 3: WRONG CODE ===');
  const res3 = await verify('valid@fieldlog.internal', '999999');
  console.log(`Status: HTTP ${res3.status}\nBody:`, res3.body);

  console.log('\n=== TEST 4: CODE REUSED ===');
  const res4 = await verify('reused@fieldlog.internal', '445566');
  console.log(`Status: HTTP ${res4.status}\nBody:`, res4.body);
}

run();
