/**
 * Seed Script — AI Recruiter
 * Creates: 10 Recruiters, 10 Candidates, 20 Jobs (2 per recruiter),
 *          200 Applications (all 10 candidates apply to all 20 jobs)
 *
 * Usage:
 *   node seed.js
 *   API_URL=https://your-render-url.onrender.com node seed.js
 */

const API_URL = process.env.API_URL || 'http://localhost:3001';

// ── helpers ───────────────────────────────────────────────────────────────────

async function post(path, body, cookie = '') {
  const res = await fetch(`${API_URL}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(cookie ? { Cookie: cookie } : {}),
    },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  let data;
  try { data = JSON.parse(text); } catch { data = text; }
  return { status: res.status, data, cookie: res.headers.get('set-cookie') };
}

function log(emoji, msg) { console.log(`${emoji}  ${msg}`); }
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// ── data ─────────────────────────────────────────────────────────────────────

const RECRUITER_DATA = [
  { name: 'Alice Johnson',  email: 'alice@techcorp.com',   password: 'password123', company: 'TechCorp' },
  { name: 'Bob Smith',      email: 'bob@innovate.io',      password: 'password123', company: 'Innovate IO' },
  { name: 'Carol White',    email: 'carol@nexusai.com',    password: 'password123', company: 'NexusAI' },
  { name: 'David Lee',      email: 'david@cloudnine.dev',  password: 'password123', company: 'CloudNine' },
  { name: 'Eva Martinez',   email: 'eva@stackworks.co',    password: 'password123', company: 'StackWorks' },
  { name: 'Frank Chen',     email: 'frank@devbridge.net',  password: 'password123', company: 'DevBridge' },
  { name: 'Grace Kim',      email: 'grace@launchpad.ai',   password: 'password123', company: 'LaunchPad AI' },
  { name: 'Henry Brown',    email: 'henry@corehire.com',   password: 'password123', company: 'CoreHire' },
  { name: 'Isabel Torres',  email: 'isabel@pivotlabs.io',  password: 'password123', company: 'PivotLabs' },
  { name: 'James Wilson',   email: 'james@scaleweb.co',    password: 'password123', company: 'ScaleWeb' },
];

const CANDIDATE_DATA = [
  { name: 'Liam Anderson',  email: 'liam@dev.com',     password: 'password123' },
  { name: 'Mia Thompson',   email: 'mia@code.io',      password: 'password123' },
  { name: 'Noah Garcia',    email: 'noah@build.net',   password: 'password123' },
  { name: 'Olivia Harris',  email: 'olivia@hack.dev',  password: 'password123' },
  { name: 'Parker Davis',   email: 'parker@eng.co',    password: 'password123' },
  { name: 'Quinn Martinez', email: 'quinn@stack.io',   password: 'password123' },
  { name: 'Riley Wilson',   email: 'riley@script.dev', password: 'password123' },
  { name: 'Sofia Brown',    email: 'sofia@tech.net',   password: 'password123' },
  { name: 'Tyler Moore',    email: 'tyler@push.co',    password: 'password123' },
  { name: 'Uma Patel',      email: 'uma@syntax.ai',    password: 'password123' },
];

const JOB_TEMPLATES = [
  { title: 'Senior React Developer',         domain: 'Frontend',   salary: '$120,000-$150,000', description: 'Build high-performance React applications with TypeScript, Redux Toolkit, and modern CSS-in-JS.' },
  { title: 'Node.js Backend Engineer',       domain: 'Backend',    salary: '$110,000-$140,000', description: 'Design scalable RESTful APIs using Node.js, Express, and PostgreSQL. Microservices experience a plus.' },
  { title: 'DevOps / SRE Engineer',          domain: 'DevOps',     salary: '$130,000-$160,000', description: 'Manage CI/CD pipelines, Kubernetes clusters on GCP/AWS, and ensure 99.99% platform uptime.' },
  { title: 'Machine Learning Engineer',      domain: 'ML',         salary: '$140,000-$180,000', description: 'Develop and deploy NLP and computer vision models using Python, PyTorch, and Hugging Face.' },
  { title: 'Full Stack Engineer',            domain: 'General CS', salary: '$100,000-$130,000', description: 'Work across the stack: Next.js frontend, FastAPI backend, PostgreSQL, and Redis caching.' },
  { title: 'Vue.js Frontend Developer',      domain: 'Frontend',   salary: '$95,000-$120,000',  description: 'Create stunning UIs with Vue 3, Pinia, and Vite. Collaborate closely with design and product.' },
  { title: 'Golang Microservices Engineer',  domain: 'Backend',    salary: '$125,000-$155,000', description: 'Write high-throughput services in Go, working with gRPC, Kafka, and Prometheus observability.' },
  { title: 'Kubernetes Platform Engineer',   domain: 'DevOps',     salary: '$135,000-$165,000', description: 'Own container orchestration, manage Helm charts, build internal developer tooling.' },
  { title: 'Data Scientist (LLMs)',          domain: 'ML',         salary: '$145,000-$185,000', description: 'Fine-tune large language models, build RAG pipelines, and ship production ML on AWS SageMaker.' },
  { title: 'Software Engineer (Generalist)', domain: 'General CS', salary: '$90,000-$115,000',  description: 'Solve engineering challenges across distributed systems, tooling, and data pipelines.' },
  { title: 'React Native Mobile Developer',  domain: 'Frontend',   salary: '$105,000-$135,000', description: 'Build cross-platform iOS/Android apps using React Native, Expo, and React Navigation.' },
  { title: 'Python Backend Developer',       domain: 'Backend',    salary: '$100,000-$130,000', description: 'Develop Python services using Django REST Framework, Celery, and PostgreSQL. TDD required.' },
  { title: 'Cloud Infrastructure Engineer',  domain: 'DevOps',     salary: '$120,000-$150,000', description: 'Provision and manage AWS infrastructure using Terraform, CloudFormation, and AWS CDK.' },
  { title: 'NLP Research Engineer',          domain: 'ML',         salary: '$150,000-$190,000', description: 'Conduct applied research on large-scale NLP problems and implement state-of-the-art models.' },
  { title: 'Backend Systems Engineer',       domain: 'Backend',    salary: '$115,000-$145,000', description: 'Build high-availability Java (Spring Boot) systems, manage PostgreSQL, and optimize performance.' },
  { title: 'UI/UX Engineer (Design Eng.)',   domain: 'Frontend',   salary: '$110,000-$140,000', description: 'Bridge design and engineering: implement pixel-perfect UIs from Figma, own the design system.' },
  { title: 'Site Reliability Engineer',      domain: 'DevOps',     salary: '$130,000-$160,000', description: 'Embed with product teams to improve reliability and run chaos engineering experiments.' },
  { title: 'Computer Vision Engineer',       domain: 'ML',         salary: '$135,000-$175,000', description: 'Develop real-time CV pipelines for defect detection using PyTorch, OpenCV, and TensorRT.' },
  { title: 'Junior Software Developer',      domain: 'General CS', salary: '$70,000-$90,000',   description: 'Join a fast-growing team and learn professional software development across our entire codebase.' },
  { title: 'API Integration Engineer',       domain: 'Backend',    salary: '$95,000-$125,000',  description: 'Build and maintain third-party API integrations. Experience with Webhooks and OAuth 2.0 required.' },
];

// ── main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log('\n🌱 AI Recruiter Seed Script');
  console.log(`📡 Target: ${API_URL}\n`);

  // ── 1. Create / Login Recruiters ─────────────────────────────────────────
  log('👔', 'Creating 10 recruiters...');
  const recruiters = [];
  for (const r of RECRUITER_DATA) {
    let res = await post('/api/recruiter/register', r);
    if (res.status === 409) {
      res = await post('/api/recruiter/login', { email: r.email, password: r.password });
      log('  ⚠️ ', `Already exists: ${r.name} — logging in`);
    } else if (res.status === 201) {
      log('  ✅', `Recruiter: ${r.name} (${r.email})`);
    } else {
      log('  ❌', `Failed: ${r.name} — ${res.status}: ${JSON.stringify(res.data)}`);
    }
    const id = res.data && res.data.id;
    const cookie = res.cookie;
    if (id) recruiters.push({ id, name: r.name, email: r.email, company: r.company, cookie });
    await sleep(150);
  }
  log('  📊', `${recruiters.length} recruiter(s) ready`);

  // ── 2. Create / Login Candidates ─────────────────────────────────────────
  log('\n🧑‍💻', 'Creating 10 candidates...');
  const candidates = [];
  for (const c of CANDIDATE_DATA) {
    // Candidate register uses multipart/form-data
    const form = new FormData();
    form.append('name', c.name);
    form.append('email', c.email);
    form.append('password', c.password);
    const regRes = await fetch(`${API_URL}/api/candidate/register`, { method: 'POST', body: form });
    let status = regRes.status;
    let data = await regRes.json().catch(() => ({}));
    let cookie = regRes.headers.get('set-cookie');

    if (status === 409) {
      const loginRes = await post('/api/candidate/login', { email: c.email, password: c.password });
      log('  ⚠️ ', `Already exists: ${c.name} — logging in`);
      status = loginRes.status;
      data = loginRes.data;
      cookie = loginRes.cookie;
    } else if (status === 201) {
      log('  ✅', `Candidate: ${c.name} (${c.email})`);
    } else {
      log('  ❌', `Failed: ${c.name} — ${status}: ${JSON.stringify(data)}`);
    }
    const id = data && data.id;
    if (id) candidates.push({ id, name: c.name, email: c.email, cookie });
    await sleep(150);
  }
  log('  📊', `${candidates.length} candidate(s) ready`);

  // ── 3. Create 20 Jobs (2 per recruiter) ──────────────────────────────────
  log('\n💼', 'Creating 20 jobs (2 per recruiter)...');
  const jobs = [];
  for (let i = 0; i < recruiters.length; i++) {
    const recruiter = recruiters[i];
    const jobSlice = JOB_TEMPLATES.slice(i * 2, i * 2 + 2);
    for (const template of jobSlice) {
      const res = await post('/api/jobs', {
        ...template,
        companyName: recruiter.company,
        recruiterId: recruiter.id,
      }, recruiter.cookie);
      if (res.status === 201) {
        log('  ✅', `"${template.title}" @ ${recruiter.company}`);
        jobs.push(res.data.job);
      } else {
        log('  ❌', `Failed: "${template.title}" — ${res.status}: ${JSON.stringify(res.data)}`);
      }
      await sleep(100);
    }
  }
  log('  📊', `${jobs.length} job(s) created`);

  // ── 4. All candidates apply to all jobs ───────────────────────────────────
  const total = candidates.length * jobs.length;
  log(`\n📝`, `Submitting ${total} applications (${candidates.length} candidates x ${jobs.length} jobs)...`);
  let appCount = 0, skipCount = 0, failCount = 0;
  for (const candidate of candidates) {
    for (const job of jobs) {
      if (!job || !job.id) { failCount++; continue; }
      const res = await post(`/api/jobs/${job.id}/apply`, { candidateId: candidate.id }, candidate.cookie);
      if (res.status === 201)      appCount++;
      else if (res.status === 200) skipCount++;
      else {
        failCount++;
        if (failCount <= 5) log('  ❌', `${candidate.name} -> ${job.title}: ${res.status} ${JSON.stringify(res.data)}`);
      }
      await sleep(40);
    }
    log('  ✓', `${candidate.name} applied to all jobs`);
  }

  // ── Summary ───────────────────────────────────────────────────────────────
  console.log('\n' + '='.repeat(55));
  console.log('🌿 Seed Complete!');
  console.log(`   👔  Recruiters : ${recruiters.length} / ${RECRUITER_DATA.length}`);
  console.log(`   🧑  Candidates : ${candidates.length} / ${CANDIDATE_DATA.length}`);
  console.log(`   💼  Jobs       : ${jobs.length} / ${JOB_TEMPLATES.length}`);
  console.log(`   📝  Applied    : ${appCount} new | ${skipCount} skipped | ${failCount} failed`);
  console.log('='.repeat(55) + '\n');
}

main().catch(err => {
  console.error('❌ Seed script crashed:', err);
  process.exit(1);
});
