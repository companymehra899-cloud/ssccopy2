import { JobPost, MarqueeUpdate } from '../types';
import { INITIAL_JOBS, INITIAL_MARQUEE } from '../data/initialData';

const LOCAL_STORAGE_JOBS_KEY = 'sarkari_portal_jobs_v1';
const LOCAL_STORAGE_MARQUEE_KEY = 'sarkari_portal_marquee_v1';

export function getStoredJobs(): JobPost[] {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_JOBS_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Failed to read stored jobs', e);
  }
  return INITIAL_JOBS;
}

export function saveStoredJobs(jobs: JobPost[]) {
  try {
    localStorage.setItem(LOCAL_STORAGE_JOBS_KEY, JSON.stringify(jobs));
  } catch (e) {
    console.error('Failed to save stored jobs', e);
  }
}

export function getStoredMarquee(): MarqueeUpdate[] {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_MARQUEE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Failed to read marquee data', e);
  }
  return INITIAL_MARQUEE;
}

export function saveStoredMarquee(marquee: MarqueeUpdate[]) {
  try {
    localStorage.setItem(LOCAL_STORAGE_MARQUEE_KEY, JSON.stringify(marquee));
  } catch (e) {
    console.error('Failed to save marquee data', e);
  }
}

export function calculateAge(dobStr: string, cutoffStr: string): { years: number; months: number; days: number } | null {
  if (!dobStr || !cutoffStr) return null;
  const dob = new Date(dobStr);
  const cutoff = new Date(cutoffStr);

  if (isNaN(dob.getTime()) || isNaN(cutoff.getTime())) return null;

  let years = cutoff.getFullYear() - dob.getFullYear();
  let months = cutoff.getMonth() - dob.getMonth();
  let days = cutoff.getDate() - dob.getDate();

  if (days < 0) {
    months--;
    const prevMonthLastDay = new Date(cutoff.getFullYear(), cutoff.getMonth(), 0).getDate();
    days += prevMonthLastDay;
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  return { years, months, days };
}
