import express from 'express';
import path from 'path';
import fs from 'fs';
import cors from 'cors';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

// Dynamic date helpers (relative to current date)
const getRelativeDateFormatted = (offsetDays = 0) => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
};

const getRelativeDateISO = (offsetDays = 0) => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split('T')[0];
};

const getRelativeDateShort = (offsetDays = 0) => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

// Default seed jobs covering 1 month ago (August 2026) to current & upcoming dates across all 6 categories
const defaultJobsDataset = [
  // --- LATEST JOBS ---
  {
    id: 'job-1',
    title: 'UPSC Civil Services CSE / IFS Recruitment Online Form 2026',
    shortTitle: 'UPSC CSE 2026 Online Form (1056 Posts)',
    category: 'Latest Jobs',
    state: 'All India',
    department: 'Union Public Service Commission (UPSC)',
    postDate: getRelativeDateFormatted(-2),
    postedDate: getRelativeDateISO(-2),
    lastDate: getRelativeDateFormatted(28),
    shortInfo: 'Union Public Service Commission (UPSC) has issued notification for Civil Services IAS / IFS Recruitment. Apply online.',
    status: 'approved',
    isHot: true,
    totalPosts: '1056 Posts',
    importantDates: {
      applicationBegin: getRelativeDateShort(-2),
      lastDateApply: getRelativeDateShort(28),
    },
    applicationFee: { generalObcEws: '₹ 100/-', scStPh: '₹ 0/-' },
    ageLimit: { minAge: '21 Years', maxAge: '32 Years' },
    vacancyDetails: [{ postName: 'Civil Services IAS', totalPosts: '950', eligibility: 'Bachelor Degree in Any Stream.' }],
    links: { applyOnline: 'https://upsconline.nic.in', downloadNotification: 'https://upsc.gov.in', officialWebsite: 'https://upsc.gov.in' },
    createdAt: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
  },
  {
    id: 'job-2',
    title: 'UPPSC Samiksha Adhikari RO / ARO Recruitment 2026',
    shortTitle: 'UPPSC RO / ARO Recruitment (411 Posts)',
    category: 'Latest Jobs',
    state: 'UP',
    department: 'Uttar Pradesh Public Service Commission (UPPSC)',
    postDate: getRelativeDateFormatted(-7),
    postedDate: getRelativeDateISO(-7),
    lastDate: getRelativeDateFormatted(23),
    shortInfo: 'UPPSC is inviting online applications for Review Officer RO and Assistant Review Officer ARO.',
    status: 'approved',
    isHot: true,
    totalPosts: '411 Posts',
    importantDates: { applicationBegin: getRelativeDateShort(-7), lastDateApply: getRelativeDateShort(23) },
    applicationFee: { generalObcEws: '₹ 125/-', scStPh: '₹ 65/-' },
    ageLimit: { minAge: '21 Years', maxAge: '40 Years' },
    vacancyDetails: [{ postName: 'Review Officer (RO)', totalPosts: '334', eligibility: 'Bachelor Degree in Any Stream.' }],
    links: { applyOnline: 'https://uppsc.up.nic.in', downloadNotification: 'https://uppsc.up.nic.in', officialWebsite: 'https://uppsc.up.nic.in' },
    createdAt: new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString(),
  },
  {
    id: 'job-3',
    title: 'SSC Combined Graduate Level CGL Online Form 2026',
    shortTitle: 'SSC CGL 2026 Notification - Apply Online',
    category: 'Latest Jobs',
    state: 'All India',
    department: 'Staff Selection Commission (SSC)',
    postDate: getRelativeDateFormatted(-15),
    postedDate: getRelativeDateISO(-15),
    lastDate: getRelativeDateFormatted(15),
    shortInfo: 'SSC has released notification for Combined Graduate Level CGL exam for 14,000+ Group B & C posts.',
    status: 'approved',
    isHot: true,
    totalPosts: '14,000+ Posts',
    importantDates: { applicationBegin: getRelativeDateShort(-15), lastDateApply: getRelativeDateShort(15) },
    applicationFee: { generalObcEws: '₹ 100/-', scStPh: '₹ 0/-' },
    ageLimit: { minAge: '18 Years', maxAge: '32 Years' },
    vacancyDetails: [{ postName: 'Inspector / Auditor / Tax Assistant', totalPosts: '14000', eligibility: 'Bachelor Degree.' }],
    links: { applyOnline: 'https://ssc.gov.in', downloadNotification: 'https://ssc.gov.in', officialWebsite: 'https://ssc.gov.in' },
    createdAt: new Date(Date.now() - 15 * 24 * 3600 * 1000).toISOString(),
  },
  {
    id: 'job-4',
    title: 'Rajasthan RPSC School Lecturer Grade 1 Online Recruitment 2026',
    shortTitle: 'RPSC Grade 1 School Teacher (2202 Posts)',
    category: 'Latest Jobs',
    state: 'Rajasthan',
    department: 'Rajasthan Public Service Commission (RPSC)',
    postDate: getRelativeDateFormatted(-22),
    postedDate: getRelativeDateISO(-22),
    lastDate: getRelativeDateFormatted(8),
    shortInfo: 'RPSC invites online applications for Grade-1 School Lecturer in various subjects.',
    status: 'approved',
    isHot: false,
    totalPosts: '2202 Posts',
    importantDates: { applicationBegin: getRelativeDateShort(-22), lastDateApply: getRelativeDateShort(8) },
    applicationFee: { generalObcEws: '₹ 600/-', scStPh: '₹ 400/-' },
    ageLimit: { minAge: '21 Years', maxAge: '40 Years' },
    vacancyDetails: [{ postName: 'School Lecturer', totalPosts: '2202', eligibility: 'Post Graduate with B.Ed.' }],
    links: { applyOnline: 'https://rpsc.rajasthan.gov.in', downloadNotification: 'https://rpsc.rajasthan.gov.in', officialWebsite: 'https://rpsc.rajasthan.gov.in' },
    createdAt: new Date(Date.now() - 22 * 24 * 3600 * 1000).toISOString(),
  },
  {
    id: 'job-5',
    title: 'MPPEB MP Police Constable & Sub Inspector Recruitment 2026',
    shortTitle: 'MP Police Constable Online Form (7500 Posts)',
    category: 'Latest Jobs',
    state: 'MP',
    department: 'Madhya Pradesh Professional Examination Board (MPPEB)',
    postDate: getRelativeDateFormatted(-28),
    postedDate: getRelativeDateISO(-28),
    lastDate: getRelativeDateFormatted(2),
    shortInfo: 'MPESB invites online applications for Police Constable GD and Radio posts.',
    status: 'approved',
    isHot: false,
    totalPosts: '7500 Posts',
    importantDates: { applicationBegin: getRelativeDateShort(-28), lastDateApply: getRelativeDateShort(2) },
    applicationFee: { generalObcEws: '₹ 500/-', scStPh: '₹ 250/-' },
    ageLimit: { minAge: '18 Years', maxAge: '36 Years' },
    vacancyDetails: [{ postName: 'Constable GD', totalPosts: '7000', eligibility: '10th / 12th Pass.' }],
    links: { applyOnline: 'https://esb.mp.gov.in', downloadNotification: 'https://esb.mp.gov.in', officialWebsite: 'https://esb.mp.gov.in' },
    createdAt: new Date(Date.now() - 28 * 24 * 3600 * 1000).toISOString(),
  },

  // --- RESULT ---
  {
    id: 'job-res-1',
    title: 'BPSC Bihar 70th Combined Competitive Exam Final Result 2026',
    shortTitle: 'BPSC 70th Final Result Declared',
    category: 'Result',
    state: 'Bihar',
    department: 'Bihar Public Service Commission (BPSC)',
    postDate: getRelativeDateFormatted(-1),
    postedDate: getRelativeDateISO(-1),
    shortInfo: 'BPSC has declared the final merit list and cut-off marks for 70th CCE examination.',
    status: 'approved',
    isHot: true,
    importantDates: { resultDate: getRelativeDateShort(-1) },
    applicationFee: {},
    ageLimit: {},
    vacancyDetails: [],
    links: { downloadResult: 'https://bpsc.bih.nic.in', officialWebsite: 'https://bpsc.bih.nic.in' },
    createdAt: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString(),
  },
  {
    id: 'job-res-2',
    title: 'SSC Staff Selection Commission GD Constable Final Result 2026',
    shortTitle: 'SSC GD Constable Final Result & Cutoff Out',
    category: 'Result',
    state: 'All India',
    department: 'Staff Selection Commission (SSC)',
    postDate: getRelativeDateFormatted(-5),
    postedDate: getRelativeDateISO(-5),
    shortInfo: 'SSC has uploaded the final result and force allocation list for Constable GD in CAPFs.',
    status: 'approved',
    isHot: true,
    importantDates: { resultDate: getRelativeDateShort(-5) },
    applicationFee: {},
    ageLimit: {},
    vacancyDetails: [],
    links: { downloadResult: 'https://ssc.gov.in', officialWebsite: 'https://ssc.gov.in' },
    createdAt: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString(),
  },
  {
    id: 'job-res-3',
    title: 'UP Police Constable Recruitment Written Exam Result 2026',
    shortTitle: 'UP Police Constable Result & Cutoff PDF',
    category: 'Result',
    state: 'UP',
    department: 'Uttar Pradesh Police Recruitment Board (UPPRPB)',
    postDate: getRelativeDateFormatted(-12),
    postedDate: getRelativeDateISO(-12),
    shortInfo: 'UPPRPB has announced written exam results for 60,244 Police Constable posts.',
    status: 'approved',
    isHot: false,
    importantDates: { resultDate: getRelativeDateShort(-12) },
    applicationFee: {},
    ageLimit: {},
    vacancyDetails: [],
    links: { downloadResult: 'https://uppbpb.gov.in', officialWebsite: 'https://uppbpb.gov.in' },
    createdAt: new Date(Date.now() - 12 * 24 * 3600 * 1000).toISOString(),
  },

  // --- ADMIT CARD ---
  {
    id: 'job-adm-1',
    title: 'Railway RRB NTPC Non-Technical CBT 1 Hall Ticket / Admit Card 2026',
    shortTitle: 'RRB NTPC Admit Card Released - Download Here',
    category: 'Admit Card',
    state: 'All India',
    department: 'Railway Recruitment Boards (RRB)',
    postDate: getRelativeDateFormatted(-1),
    postedDate: getRelativeDateISO(-1),
    shortInfo: 'Railway Recruitment Boards enabled E-Call Letter download for CBT 1 examination.',
    status: 'approved',
    isHot: true,
    importantDates: { admitCardDate: getRelativeDateShort(-1) },
    applicationFee: {},
    ageLimit: {},
    vacancyDetails: [],
    links: { downloadAdmitCard: 'https://indianrailways.gov.in', officialWebsite: 'https://indianrailways.gov.in' },
    createdAt: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString(),
  },
  {
    id: 'job-adm-2',
    title: 'SSC CHSL 10+2 Tier 2 Examination Admit Card 2026',
    shortTitle: 'SSC CHSL Tier 2 Admit Card Out',
    category: 'Admit Card',
    state: 'All India',
    department: 'Staff Selection Commission (SSC)',
    postDate: getRelativeDateFormatted(-4),
    postedDate: getRelativeDateISO(-4),
    shortInfo: 'SSC CHSL Tier 2 region-wise hall tickets released. Download using registration number.',
    status: 'approved',
    isHot: true,
    importantDates: { admitCardDate: getRelativeDateShort(-4) },
    applicationFee: {},
    ageLimit: {},
    vacancyDetails: [],
    links: { downloadAdmitCard: 'https://ssc.gov.in', officialWebsite: 'https://ssc.gov.in' },
    createdAt: new Date(Date.now() - 4 * 24 * 3600 * 1000).toISOString(),
  },

  // --- ANSWER KEY ---
  {
    id: 'job-ak-1',
    title: 'SSC CGL Tier 1 Official Answer Key & Candidate Response Sheet 2026',
    shortTitle: 'SSC CGL Tier 1 Answer Key Out',
    category: 'Answer Key',
    state: 'All India',
    department: 'Staff Selection Commission (SSC)',
    postDate: getRelativeDateFormatted(-2),
    postedDate: getRelativeDateISO(-2),
    shortInfo: 'Staff Selection Commission uploaded provisional answer key for CGL Tier 1 exam.',
    status: 'approved',
    isHot: true,
    importantDates: { answerKeyDate: getRelativeDateShort(-2) },
    applicationFee: {},
    ageLimit: {},
    vacancyDetails: [],
    links: { downloadAnswerKey: 'https://ssc.gov.in', officialWebsite: 'https://ssc.gov.in' },
    createdAt: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
  },

  // --- SYLLABUS ---
  {
    id: 'job-syl-1',
    title: 'UP Police Sub Inspector SI New Exam Pattern & Detailed Syllabus PDF 2026',
    shortTitle: 'UP Police SI Syllabus & Exam Pattern PDF',
    category: 'Syllabus',
    state: 'UP',
    department: 'Uttar Pradesh Police Recruitment Board',
    postDate: getRelativeDateFormatted(-3),
    postedDate: getRelativeDateISO(-3),
    shortInfo: 'Download UP Police Sub Inspector topic-wise syllabus in Hindi and English.',
    status: 'approved',
    isHot: true,
    importantDates: {},
    applicationFee: {},
    ageLimit: {},
    vacancyDetails: [],
    links: { downloadSyllabus: 'https://uppbpb.gov.in', officialWebsite: 'https://uppbpb.gov.in' },
    createdAt: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(),
  },

  // --- ADMISSION ---
  {
    id: 'job-adm-app-1',
    title: 'NTA NEET UG 2026 Medical MBBS / BDS Online Counseling Admission Form',
    shortTitle: 'NEET UG 2026 Counseling & Choice Filling',
    category: 'Admission',
    state: 'All India',
    department: 'Medical Counselling Committee (MCC)',
    postDate: getRelativeDateFormatted(-3),
    postedDate: getRelativeDateISO(-3),
    lastDate: getRelativeDateFormatted(18),
    shortInfo: 'MCC invites qualified candidates for All India Quota AIQ 15% MBBS/BDS online registration.',
    status: 'approved',
    isHot: true,
    importantDates: { applicationBegin: getRelativeDateShort(-3), lastDateApply: getRelativeDateShort(18) },
    applicationFee: { generalObcEws: '₹ 1000/-', scStPh: '₹ 500/-' },
    ageLimit: {},
    vacancyDetails: [],
    links: { applyOnline: 'https://mcc.nic.in', officialWebsite: 'https://mcc.nic.in' },
    createdAt: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(),
  },
];

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Enable CORS & JSON Body Parser
  app.use(cors());
  app.use(express.json());

  // Initialize Gemini Client lazily inside handler
  function getGeminiClient() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is missing.');
    }
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }

  // Live in-memory job store (Initialized with active 1-month-old to current/upcoming jobs)
  let inMemoryJobs: any[] = [...defaultJobsDataset];

  // REST API Endpoint: GET /api/jobs
  app.get('/api/jobs', (req, res) => {
    try {
      const { category, state, status } = req.query;
      let result = [...inMemoryJobs];

      if (status) {
        result = result.filter((j) => j.status === status);
      }
      if (category && category !== 'All') {
        result = result.filter((j) => j.category === category);
      }
      if (state && state !== 'All') {
        result = result.filter((j) => !j.state || j.state === state || j.state === 'All India');
      }

      // Sort descending by creation timestamp
      result.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
      return res.json(result);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  });

  // REST API Endpoint: POST /api/jobs/clear
  app.post('/api/jobs/clear', (req, res) => {
    inMemoryJobs = [];
    return res.json({
      success: true,
      message: 'Database cleared completely.',
      count: 0,
      jobs: [],
    });
  });

  // REST API Endpoint: POST /api/jobs/seed-today
  app.post('/api/jobs/seed-today', (req, res) => {
    inMemoryJobs = [...defaultJobsDataset];
    return res.json({
      success: true,
      message: `Database populated with ${defaultJobsDataset.length} active jobs spanning 1 month ago to current & upcoming dates.`,
      count: inMemoryJobs.length,
      jobs: inMemoryJobs,
    });
  });

  // REST API Endpoint: POST /api/jobs (Add Live Scraped Job with current date)
  app.post('/api/jobs', (req, res) => {
    try {
      const {
        title,
        officialLink,
        pdf_link,
        apply_link,
        category,
        state,
        department,
        status,
        shortInfo,
        totalPosts,
      } = req.body;

      if (!title) {
        return res.status(400).json({ error: 'Job title is required' });
      }

      const todayISO = getRelativeDateISO(0);
      const todayFormatted = getRelativeDateFormatted(0);

      const newJob = {
        id: `job-${Date.now()}`,
        title: title,
        shortTitle: title.length > 55 ? title.substring(0, 55) + '...' : title,
        category: category || 'Latest Jobs',
        state: state || 'All India',
        department: department || `${state || 'Govt'} Department / Board`,
        postDate: todayFormatted,
        postedDate: todayISO,
        shortInfo: shortInfo || `Live recruitment update for ${title}. Official notification published today.`,
        status: status || 'approved',
        isHot: true,
        totalPosts: totalPosts || 'See Notification',
        importantDates: {
          applicationBegin: todayFormatted,
          lastDateApply: 'Check Notification',
        },
        applicationFee: {
          generalObcEws: 'As per Rules',
          scStPh: 'As per Rules',
        },
        ageLimit: { minAge: '18 Years' },
        vacancyDetails: [
          {
            postName: title,
            totalPosts: totalPosts || 'Multiple',
            eligibility: 'Check Official Notification',
          },
        ],
        links: {
          applyOnline: officialLink || apply_link || '#',
          downloadNotification: pdf_link || officialLink || '#',
          officialWebsite: officialLink || 'https://nic.in',
        },
        createdAt: new Date().toISOString(),
      };

      inMemoryJobs.unshift(newJob);

      return res.status(201).json({
        success: true,
        message: 'Live job ingested successfully with current date!',
        job: newJob,
      });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  });

  // --- ADMIN AUTHENTICATION SECURITY STATE ---
  let currentAdminPassword = process.env.ADMIN_PASSWORD || 'admin123';
  const activeAdminSessions = new Set<string>();

  // REST API Endpoint: POST /api/admin/login
  app.post('/api/admin/login', (req, res) => {
    const { password } = req.body;
    if (!password) {
      return res.status(400).json({ success: false, error: 'Password is required' });
    }

    if (password === currentAdminPassword) {
      const token = `token-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      activeAdminSessions.add(token);
      return res.json({
        success: true,
        token,
        message: 'Admin authentication successful',
      });
    }

    return res.status(401).json({
      success: false,
      error: 'Incorrect Admin Password. Access Denied!',
    });
  });

  // REST API Endpoint: POST /api/admin/verify
  app.post('/api/admin/verify', (req, res) => {
    const { token } = req.body;
    const isValid = Boolean(token && activeAdminSessions.has(token));
    return res.json({ authenticated: isValid });
  });

  // REST API Endpoint: POST /api/admin/logout
  app.post('/api/admin/logout', (req, res) => {
    const { token } = req.body;
    if (token) {
      activeAdminSessions.delete(token);
    }
    return res.json({ success: true, message: 'Logged out successfully' });
  });

  // REST API Endpoint: POST /api/admin/change-password
  app.post('/api/admin/change-password', (req, res) => {
    const { token, currentPassword, newPassword } = req.body;

    if (!token || !activeAdminSessions.has(token)) {
      return res.status(401).json({ success: false, error: 'Unauthorized admin session' });
    }

    if (currentPassword !== currentAdminPassword) {
      return res.status(400).json({ success: false, error: 'Current password is incorrect' });
    }

    if (!newPassword || newPassword.trim().length < 4) {
      return res.status(400).json({ success: false, error: 'New password must be at least 4 characters long' });
    }

    currentAdminPassword = newPassword.trim();
    return res.json({
      success: true,
      message: 'Admin password updated successfully! Please use your new password for future logins.',
    });
  });

  // REST API Endpoint: PUT /api/jobs/:id/status
  app.put('/api/jobs/:id/status', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const job = inMemoryJobs.find((j) => j.id === id);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }
    job.status = status;
    return res.json({ success: true, job });
  });

  // REST API Endpoint: DELETE /api/jobs/:id
  app.delete('/api/jobs/:id', (req, res) => {
    const { id } = req.params;
    inMemoryJobs = inMemoryJobs.filter((j) => j.id !== id);
    return res.json({ success: true, message: 'Job deleted successfully' });
  });

  // AI Endpoint to Auto-Generate or Structure a Sarkari Job Notification
  app.post('/api/generate-job', async (req, res) => {
    try {
      const { prompt } = req.body;
      if (!prompt) {
        return res.status(400).json({ error: 'Prompt or notification text is required' });
      }

      const ai = getGeminiClient();
      const todayISO = getRelativeDateISO(0);
      const todayFormatted = getRelativeDateFormatted(0);

      const systemInstruction = `You are a Sarkari Result notification parser for India's No 1 job portal.
Given a prompt or notification snippet, output a clean JSON object representing a complete JobPost.
Always set "postDate" to "${todayFormatted}" and "postedDate" to "${todayISO}".
Return ONLY valid JSON.`;

      let retries = 3;
      let response;

      while (retries > 0) {
        try {
          response = await ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: [
              { role: 'user', parts: [{ text: `${systemInstruction}\n\nParse/generate for this prompt: "${prompt}"` }] }
            ]
          });
          break;
        } catch (error: any) {
          if ((error.status === 503 || error.message?.includes('503')) && retries > 1) {
            retries--;
            console.warn(`Gemini API 503, retrying in 2 seconds. Retries left: ${retries}`);
            await new Promise((resolve) => setTimeout(resolve, 2000));
            continue;
          }
          throw error;
        }
      }

      const text = response?.text || '';
      const cleanJsonText = text.replace(/```json/gi, '').replace(/```/g, '').trim();
      const parsedData = JSON.parse(cleanJsonText);

      return res.json({ success: true, job: parsedData });
    } catch (error: any) {
      console.error('Error generating job:', error);
      return res.status(500).json({
        error: error.message || 'Failed to generate job using AI',
      });
    }
  });

  // Serve frontend in dev / prod with automatic dist detection
  const distPath = path.join(process.cwd(), 'dist');
  const indexHtmlPath = path.join(distPath, 'index.html');

  if (process.env.NODE_ENV === 'production' || fs.existsSync(indexHtmlPath)) {
    console.log(`Serving static production files from ${distPath}`);
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(indexHtmlPath);
    });
  } else {
    console.log('Starting Vite middleware for development mode');
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
