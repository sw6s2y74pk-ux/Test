/* ==========================================================================
   PROJECT IRONMAN — data snapshot
   Generated from Finn's Coros account on 2026-09-01.

   HOW TO UPDATE
   -------------
   This file is a static snapshot, not a live feed — the site has no backend.
   To refresh it, pull fresh numbers from Coros (or any source you like) and
   edit the objects below. Nothing else in the site needs to change.

   TO ACTIVATE THE RACE COUNTDOWN
   -------------------------------
   Set CONFIG.raceDate to an ISO date ("YYYY-MM-DD"). Until it's set, the
   hero shows the athlete snapshot without a countdown.
   ========================================================================== */

const CONFIG = {
  raceName: "IRONMAN",
  raceDate: "2027-04-18", // e.g. "2027-07-04" — set this to switch on the countdown
  raceLocation: null,    // e.g. "Frankfurt, Germany"
  generatedAt: "2026-09-01",
};

const ATHLETE = {
  name: "Finn",
  age: 17,
  heightCm: 186,
  weightKg: 80,
  gender: "Male",
};

const FITNESS = {
  vo2max: 60,
  runningLevel: 75,
  thresholdPace: "4:59",
  predictions: {
    "5k": "23:56",
    "10k": "49:55",
    "half": "1:52:50",
    "marathon": "4:00:41",
  },
};

const RECOVERY = {
  percent: 100,
  level: "Heavy training allowed",
  etaHours: 0,
};

// Last 30 days of training-load assessment, oldest first.
const LOAD = [
  { date: "2026-08-03", comment: "Decreasing", shortTerm: 14, longTerm: 42, ratio: 0.33 },
  { date: "2026-08-04", comment: "Decreasing", shortTerm: 12, longTerm: 42, ratio: 0.28 },
  { date: "2026-08-05", comment: "Decreasing", shortTerm: 10, longTerm: 42, ratio: 0.23 },
  { date: "2026-08-06", comment: "Decreasing", shortTerm: 9, longTerm: 42, ratio: 0.21 },
  { date: "2026-08-07", comment: "Decreasing", shortTerm: 7, longTerm: 42, ratio: 0.16 },
  { date: "2026-08-08", comment: "Decreasing", shortTerm: 7, longTerm: 42, ratio: 0.16 },
  { date: "2026-08-09", comment: "Decreasing", shortTerm: 6, longTerm: 42, ratio: 0.14 },
  { date: "2026-08-10", comment: "Decreasing", shortTerm: 5, longTerm: 42, ratio: 0.11 },
  { date: "2026-08-11", comment: "Decreasing", shortTerm: 5, longTerm: 42, ratio: 0.11 },
  { date: "2026-08-12", comment: "Decreasing", shortTerm: 4, longTerm: 42, ratio: 0.09 },
  { date: "2026-08-13", comment: "Decreasing", shortTerm: 5, longTerm: 42, ratio: 0.11 },
  { date: "2026-08-14", comment: "Decreasing", shortTerm: 5, longTerm: 42, ratio: 0.11 },
  { date: "2026-08-15", comment: "Decreasing", shortTerm: 4, longTerm: 42, ratio: 0.09 },
  { date: "2026-08-16", comment: "Decreasing", shortTerm: 4, longTerm: 42, ratio: 0.09 },
  { date: "2026-08-17", comment: "Decreasing", shortTerm: 6, longTerm: 42, ratio: 0.14 },
  { date: "2026-08-18", comment: "Decreasing", shortTerm: 5, longTerm: 42, ratio: 0.11 },
  { date: "2026-08-19", comment: "Decreasing", shortTerm: 21, longTerm: 46, ratio: 0.45 },
  { date: "2026-08-20", comment: "Decreasing", shortTerm: 18, longTerm: 44, ratio: 0.40 },
  { date: "2026-08-21", comment: "Decreasing", shortTerm: 15, longTerm: 43, ratio: 0.34 },
  { date: "2026-08-22", comment: "Decreasing", shortTerm: 13, longTerm: 42, ratio: 0.30 },
  { date: "2026-08-23", comment: "Decreasing", shortTerm: 11, longTerm: 42, ratio: 0.26 },
  { date: "2026-08-24", comment: "Resuming", shortTerm: 27, longTerm: 46, ratio: 0.58 },
  { date: "2026-08-25", comment: "Resuming", shortTerm: 23, longTerm: 45, ratio: 0.51 },
  { date: "2026-08-26", comment: "Decreasing", shortTerm: 21, longTerm: 44, ratio: 0.47 },
  { date: "2026-08-27", comment: "Decreasing", shortTerm: 18, longTerm: 43, ratio: 0.41 },
  { date: "2026-08-28", comment: "Decreasing", shortTerm: 15, longTerm: 42, ratio: 0.35 },
  { date: "2026-08-29", comment: "Decreasing", shortTerm: 13, longTerm: 42, ratio: 0.30 },
  { date: "2026-08-30", comment: "Decreasing", shortTerm: 11, longTerm: 42, ratio: 0.26 },
  { date: "2026-08-31", comment: "Decreasing", shortTerm: 10, longTerm: 42, ratio: 0.23 },
  { date: "2026-09-01", comment: "Decreasing", shortTerm: 8, longTerm: 42, ratio: 0.19 },
];

// Discipline totals across all logged sessions.
const TOTALS = {
  swim: { distKm: 6.5, timeHours: 2.3, count: 12, calories: 1739 },
  bike: { distKm: 137.4, timeHours: 7.6, count: 13, calories: 4346 },
  run:  { distKm: 401.6, timeHours: 39.7, count: 68, calories: 31798 },
};

// Weekly training volume in hours by discipline, ISO week, oldest first.
const WEEKLY = [
  { week: "2025-W52", run: 0.19, bike: 0,    swim: 0 },
  { week: "2026-W01", run: 4.16, bike: 0,    swim: 0 },
  { week: "2026-W02", run: 3.08, bike: 0.11, swim: 0 },
  { week: "2026-W03", run: 5.59, bike: 0,    swim: 0 },
  { week: "2026-W04", run: 2.74, bike: 0,    swim: 0 },
  { week: "2026-W05", run: 3.10, bike: 0,    swim: 0 },
  { week: "2026-W06", run: 2.04, bike: 0,    swim: 0.44 },
  { week: "2026-W07", run: 2.49, bike: 0,    swim: 0.24 },
  { week: "2026-W08", run: 1.90, bike: 0,    swim: 0 },
  { week: "2026-W09", run: 1.00, bike: 0,    swim: 0 },
  { week: "2026-W10", run: 2.05, bike: 2.24, swim: 0 },
  { week: "2026-W11", run: 1.40, bike: 0,    swim: 0 },
  { week: "2026-W13", run: 0.22, bike: 0,    swim: 0 },
  { week: "2026-W14", run: 0.38, bike: 0,    swim: 0 },
  { week: "2026-W15", run: 0.44, bike: 0,    swim: 0 },
  { week: "2026-W17", run: 2.68, bike: 0,    swim: 0 },
  { week: "2026-W20", run: 2.45, bike: 0.73, swim: 0 },
  { week: "2026-W21", run: 0,    bike: 0.67, swim: 0.22 },
  { week: "2026-W22", run: 1.18, bike: 0,    swim: 0.73 },
  { week: "2026-W23", run: 0.30, bike: 0.18, swim: 0 },
  { week: "2026-W24", run: 0.07, bike: 0.10, swim: 0 },
  { week: "2026-W26", run: 0,    bike: 0,    swim: 0.56 },
  { week: "2026-W28", run: 0.37, bike: 0,    swim: 0 },
  { week: "2026-W30", run: 0,    bike: 3.14, swim: 0 },
  { week: "2026-W31", run: 0,    bike: 0.41, swim: 0 },
  { week: "2026-W34", run: 0.79, bike: 0,    swim: 0.10 },
  { week: "2026-W35", run: 1.07, bike: 0,    swim: 0 },
];

// Most recent sessions, newest first. No place names on purpose — this file
// is public, keep it that way in future edits too.
const RECENT = [
  { date: "2026-08-24", discipline: "run",  label: "Outdoor Run",     durationSec: 3851, distanceM: 10160, avgHr: 149, calories: 953 },
  { date: "2026-08-22", discipline: "swim", label: "Open Water Swim", durationSec: 219,  distanceM: 92,    avgHr: 99,  calories: 38 },
  { date: "2026-08-19", discipline: "run",  label: "Trail Run",       durationSec: 2644, distanceM: 6560,  avgHr: 159, calories: 573 },
  { date: "2026-08-18", discipline: "swim", label: "Open Water Swim", durationSec: 135,  distanceM: 80,    avgHr: 113, calories: 23 },
  { date: "2026-08-17", discipline: "run",  label: "Outdoor Run",     durationSec: 207,  distanceM: 644,   avgHr: 144, calories: 55 },
  { date: "2026-07-31", discipline: "bike", label: "Road Bike",       durationSec: 1468, distanceM: 8890,  avgHr: 134, calories: 246 },
  { date: "2026-07-26", discipline: "bike", label: "Road Bike",       durationSec: 5971, distanceM: 41780, avgHr: 145, calories: 1129 },
  { date: "2026-07-25", discipline: "bike", label: "Road Bike",       durationSec: 5324, distanceM: 31790, avgHr: 141, calories: 957 },
];

// Upcoming planned sessions (from Coros training plan), on or after generatedAt.
const SCHEDULE = [
  { date: "2026-09-01", label: "Planned session", distanceKm: 12.00, estimatedTime: "1:28:06", loadTL: 121 },
  { date: "2026-09-01", label: "Planned session", distanceKm: null,  estimatedTime: "34:00",   loadTL: null },
  { date: "2026-09-02", label: "Planned session", distanceKm: 10.53, estimatedTime: "1:22:32", loadTL: 212 },
  { date: "2026-09-03", label: "Planned session", distanceKm: 6.00,  estimatedTime: "49:03",   loadTL: 60 },
  { date: "2026-09-03", label: "Planned session", distanceKm: null,  estimatedTime: "58:40",   loadTL: null },
  { date: "2026-09-05", label: "Planned session", distanceKm: 13.36, estimatedTime: "1:36:06", loadTL: 142 },
  { date: "2026-09-06", label: "Planned session", distanceKm: 30.00, estimatedTime: "3:25:15", loadTL: 302 },
];
