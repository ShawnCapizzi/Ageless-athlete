"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import type { CSSProperties } from "react";
import { storage } from "@/lib/storage";

/* ---------------- Embedded textures (optimized base64) ---------------- */
const LEATHER = "data:image/jpeg;base64,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";
const METAL = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAA0JCgsKCA0LCgsODg0PEyAVExISEyccHhcgLikxMC4pLSwzOko+MzZGNywtQFdBRkxOUlNSMj5aYVpQYEpRUk//2wBDAQ4ODhMREyYVFSZPNS01T09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0//wAARCAEEAEADASIAAhEBAxEB/8QAGwAAAgMBAQEAAAAAAAAAAAAAAwQBAgUABgf/xAAxEAACAQQBAwMDAgYCAwAAAAABAhEAAxIhMQRBURMiYTJxkYHBI0JSodHhBbFi8PH/xAAVAQEBAAAAAAAAAAAAAAAAAAAAAf/EABURAQEAAAAAAAAAAAAAAAAAAAAB/9oADAMBAAIRAxEAPwD5wKsBUCrCgmKkCpAFWC0HKJoqp8iuCkcUW3vtQSi4niaPbXyN1a1aDHn80yvTOAIEmqjzgFXArkX4mjKB3n8VFVVauqHsBRURG2Dz8UVLORkcDvFAJVI2N03ZQsJgwfioWyMxjkfsK1Og6INbVg++ToigDYstoqrT4py1aJO7c/amrPSqVJJUwPqjirpYmQGIPHwKI8Im+9MKo7Mf1oSLHNGtaYe6I5oqIZSZUa8d6NYf+HrIMTsVZjABBYEkwavZvQ5zGRPjZoJAuSqt7Z0CdVtf8ct3Di5jHZu9L27SdTbtlXcT51Wn0tvCLbAR2IY6HigPZe5n9DACY/8ARTgU3AofS/zGYZZ71RLThtLJI0Y2f2otyVtKbwZF1tQNfaiPm4iSDwKat2oxBA3B2aXwJIEEHwaYtIV2yklR3FFMraYDamG76iqjp2C3JUgqdfP2otm21wr6Z3HE9qM9u5cEBxIMA9o+9BHQIVePeUgaiYNbKJcNxFEsRMRqs7pj6LqGYjIQIb5rVtG7rEDKO5mRQP2PYU9Ukk7gmP0ppEFxmVmaVPAc6oFtnJAwMck+KZ6Z/Uh0UAtqSBqg+aLcbMzsH+WeKfs3rcOmdwAjhhM0FbNlVUbLSRBgU7b6QFA2Uq3Opg0BbDW1aQgjj2fI71Krg4JAWeZXigG2tthbYkE9ho01090AH+OtxAPpdCaAzOgPuRcTx7Tv5pnpbqM5UASv0k9gKAq2g+EKBGyjll/uKdsdNaa6ri6gAMb0aBqzfdWhVTFhyex7cmtTp7g9IBFQGPpjvSFuzcS2NqVGpGwBTthGI1iJGzurEr57ZzGIxJgkgETTthlXRBBbgjyfikenW5aKtkCp787pz1ENrL0pYAg49jUUZQjuRcIvY7UusFe3fmipZ9O3cDBg0AA4g8H4P2oCKyrbut6qYRk2X4ph7ZLlbKH2ncRv4g0Da2Xu2Q+KsQAJ4P6gGj2enY3PfaK6GMHx8VmreS+mSi6kmIIEH9KZslrVvFhko37eAaDZsIpEy6gLsQPNMdO1y2AoIiZrK6XqIOg/J7A/pWh05XIjIT8iKI8FYGwp2J2ppi0j277sPcr6NL9Mc+otoOSeKOLkOcwYmYoo14XLV0pjJbtrdWtxblT7GnICfq+dUEdR6jFXtjjRxnVGS2JBS2hcca/xQMkOcQDbPgEirq7WrjKVKk9wNHfzQghDLku4Mn9qNbGN1GAYY7HOp4+9Bo9MbZd3JbW4ImtGwVZpc888isuzeW49wi1gGYkKBIE8/wB60+jYPbdbgUgGNSIoPBiYFwaca1XOHuoYcDyO5oLAqAQdgzTat6toe6CCJHmgr0lsFit5oUNGzv8A3TtoKpKodcR3FCtwUZiTrc+f91a0+VosYLLyGHJnW6BpSWXPLyDujKLgUXVuCJgid0uhGUlMPJn6viKKijHIACREz280D3Rtm7sT9KkyTzV0uoA6ut5MRIxbt5qli0bcghXVlAVvA801bsg2wSWhSZX4oPGKcSJWQKs6jDHEnvrtQrehORj+nxTGK4hlcgg/mgJbaQW0SIB3EUe0yNZKtoneXNVtyzJMpEyQeaMUX01AwLAASRFBy2nNuTiY4pq3bdJUg4sZG9CptLmgGG/AOvvTiWzdubthCsA4nWqA3So+OOBPwDTFoBWx2siYOteat09sMjYsJIpkJlEgxHcaoPnInmPcQatYHvmZ85cV1thhwGUdp2BUu5tqGQQJ4nigm5fZb5BT01mfOqaFwEDIQZkHtFLBUuBi6gyPaSdimekRAoxJkkHnX+qB5L6KiRcYE8yojX7070990uL71bLkjXHaKywAZxgrvU/vR7bmzbBJIg9jIFBr2upu2r5UKSGMj8bp4dQgtgAx4msS3ea6fVWQAJEj2nzRXvvbBW5lHbGg8koYNNuQe4o1u4GGRAmYntQrXtG28bPb5o6WSS6wAwPAPNAb2wC6Ke+jzRFTNDCn/wARQ5h/drejFEtXASxLkHHsnNBfp3dYS4jBzsQeBV2NoOVwkXBrz/ap6c+1LgcHGSo+fmrspuBWK6QgA0E2CLVsWwxCngNxTIu/w8MWMfr/APK7qVt3wq4BCzZIFO1Ef5oQdrdpAHuFSYYQNjz+ag8/buCRKxHMCmhJXIOjzwZ2PilrKqyti33BG6IvOCgDfn/NUOopBRcSVJ2pqXsqyg2y2Ib3CdHdAtMrs3tlge1FS2W1LKYnVAzb6ZQkKhGTDj5qbNu4T71WMzG+YqgJu2hkVbDudE0dUi0JvsG7SPyZoIWcix3AOJnj9KtdAvBFI5+rZ2QaEyPZAYkYE45RINX9QMArKAwXldTQYCOVJEc/NHt30CY3BIJmSJigLB9i4zz8VdAQ3vWVHIGjQO27aK2QgqQSCvejoUIAVSdb80paJz4MDtHb96YslSFIYzMHWqAjC0twlSY42R5pki0pY2nR0nvqZ+KXKn0lJYiT3WJqoyFvGeTsxsfFAS2v8V1XYgtgTof7ooZbjYssjHcLHFDVTAPJmdjf/VXGYSC5jt7aDzq4kgxEHgEiaMoliDto2PNL2mWDlIJHY0a06ByWzigatOACZYQOwmKKjFUIVNfahWyGtkhiAYGxzRkVMM2aAD/egZVpVVeSg1H9NdbwNxsmuBUGjEQfmaFbWbkeouP1TswPNHa673He43uY7JOpoK2mEFciRwD8GjqFa3isyfaT9qHbKs2TLP8AKTEx96KZtP6bMsfXPIig8lbBKFypI4mj2ULNGP7UC3Ee7kUZZL5E7PzqgatGREfimRiywSZjkcigW5jIdu1FGQWVVt/igMgf1AXZQUGQlTv4oqhjJdSZMg5cCgrcdbUFFKlvHeiOrIwVrA1vZGqCbL5H08SoO4HNGQZKHFsgxBmg2rot3GlFh9E6YwfFFW86sIZceYOpoPLIxJ3xTPTkq4MZaPHalFMHLz5phSCBGP370DNq4QMSW8GmQbRB2w8AbpBbjTGWqZt3yYOSkjYI7UDYCPcUq4ZSZPtg/MVK2wtyJITLW6D6sMQ0L34qZUAkNjrW/wDugMzjITIjXANXyxVcRIG9nVL+qwuEMZjWhRbXWPlhIJjEyO1B5tGOuN6q6OwfR711dQNAZASTs1NuUVsWIgEaNdXUF82uOC5JJ1+KLkYcV1dQdPB7k0cAFwB7REe3U11dQf/Z";
const NOISE = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPScxNDAnIGhlaWdodD0nMTQwJz48ZmlsdGVyIGlkPSduJz48ZmVUdXJidWxlbmNlIHR5cGU9J2ZyYWN0YWxOb2lzZScgYmFzZUZyZXF1ZW5jeT0nMC44JyBudW1PY3RhdmVzPScyJyBzdGl0Y2hUaWxlcz0nc3RpdGNoJy8+PGZlQ29sb3JNYXRyaXggdHlwZT0nc2F0dXJhdGUnIHZhbHVlcz0nMCcvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPScxNDAnIGhlaWdodD0nMTQwJyBmaWx0ZXI9J3VybCgjbiknLz48L3N2Zz4=";

/* ---------------- Program data (Ageless Athlete Protocol) ---------------- */

const MORNING = [
  { id: "sun", label: "10 min sunlight (before 9 AM)" },
  { id: "water", label: "Tall glass of water" },
  { id: "feet", label: "Foot activation — toe yoga + short-foot (2 min)" },
  { id: "creatine", label: "Creatine 3g" },
  { id: "amstack", label: "AM stack — D3+K2 · Omega-3 · Boron · L-Carnitine" },
];
const EVENING = [
  { id: "mag", label: "Magnesium glycinate 200–400 mg" },
  { id: "ashwa", label: "Ashwagandha 600 mg" },
  { id: "nofood", label: "No food within 2 hrs of bed" },
  { id: "room", label: "Room cool + dark" },
  { id: "breath", label: "3 min slow nasal breathing" },
];
const STRENGTH_CIRCUIT = [
  { id: "warm", label: "Warm-up — ankle circles, hip openers, shadowbox (3 min)" },
  { id: "squat", label: "Chair squats × 12 — 2 rounds" },
  { id: "lunge", label: "Step-back lunges × 8/leg — 2 rounds" },
  { id: "push", label: "Push-ups × 10" },
  { id: "pull", label: "Pull-ups × 10 (broken sets OK)" },
  { id: "bridge", label: "Glute bridges × 15" },
  { id: "calf", label: "Calf raises, 3-sec lowering × 12–15" },
  { id: "core", label: "Standing knee-lift march — 20 sec" },
];
const MOBILITY_FLOW = [
  { id: "toe", label: "Toe yoga — 1 min" },
  { id: "shortfoot", label: "Short foot holds — 1 min" },
  { id: "calfst", label: "Calf stretch — 1 min" },
  { id: "hipflex", label: "Hip flexor stretch — 1 min/side" },
  { id: "ham", label: "Hamstring stretch — 1 min/side" },
  { id: "fig4", label: "Figure-4 stretch — 1 min/side" },
  { id: "balance", label: "Single-leg balance — 45 sec/side" },
];
const FOOT_HIP = [
  { id: "wall", label: "Knee-to-wall ankle mobility — 1 min/side" },
  { id: "hipfl2", label: "Hip flexor stretch — 1 min/side" },
  { id: "fig42", label: "Figure-4 stretch — 1 min/side" },
];

const PLAN = {
  1: { type: "STRENGTH + BAG POWER", round: "ROUND 1", blocks: [
      { title: "Strength circuit", items: STRENGTH_CIRCUIT },
      { title: "Heavy bag — power round", items: [{ id: "bag", label: "30 sec hard punches / 30 sec rest × 5" }] },
      { title: "Foot + hip stability", items: FOOT_HIP },
  ]},
  2: { type: "MOBILITY + WALK", round: "ROUND 2", blocks: [
      { title: "Mobility flow", items: MOBILITY_FLOW },
      { title: "Light strength", items: [{ id: "apull", label: "Assisted pull-ups × 5" }, { id: "ipush", label: "Incline push-ups × 8" }] },
      { title: "Walk", items: [{ id: "walk", label: "Walk or stairs — 10–20 min" }] },
  ]},
  3: { type: "STRENGTH + SPRINTS", round: "ROUND 3", blocks: [
      { title: "Strength circuit", items: STRENGTH_CIRCUIT },
      { title: "Sprint protocol", items: [{ id: "sprint", label: "20–30 sec fast / 90 sec rest × 5 (hill or bike)" }] },
      { title: "Cooldown", items: [{ id: "cool", label: "Mobility cooldown — 5 min" }] },
  ]},
  4: { type: "MOBILITY + LIGHT BAG", round: "ROUND 4", blocks: [
      { title: "Mobility flow", items: MOBILITY_FLOW },
      { title: "Light bag work", items: [{ id: "lbag", label: "Shadowbox + light taps — footwork, balance, hips (5 min)" }] },
      { title: "Walk", items: [{ id: "walk4", label: "Walk — 10 min" }] },
  ]},
  5: { type: "STRENGTH + BAG ROUNDS", round: "ROUND 5", blocks: [
      { title: "Strength circuit", items: STRENGTH_CIRCUIT },
      { title: "Heavy bag — 3 × 3 min rounds", items: [
        { id: "r1", label: "Round 1 — jab–cross technique" },
        { id: "r2", label: "Round 2 — power hooks" },
        { id: "r3", label: "Round 3 — combinations + body shots" },
      ]},
      { title: "Cooldown", items: [{ id: "cool5", label: "Hip, knee, ankle mobility" }] },
  ]},
  6: { type: "MOBILITY + TECHNICAL BAG", round: "ROUND 6", blocks: [
      { title: "Mobility flow", items: MOBILITY_FLOW },
      { title: "Technical bag (optional)", items: [{ id: "tech", label: "Slow combos, footwork circles, angles — no power (10–15 min)" }] },
  ]},
  0: { type: "RECOVERY DAY", round: "REST", blocks: [
      { title: "Recovery", items: [
        { id: "stretch", label: "Light stretch" },
        { id: "rwalk", label: "Gentle walk" },
        { id: "rbreath", label: "Deep breathing — 5 min" },
        { id: "hydrate", label: "Hydrate well" },
      ]},
  ]},
};

const DAY_NAMES = ["SUNDAY","MONDAY","TUESDAY","WEDNESDAY","THURSDAY","FRIDAY","SATURDAY"];
const DAY_ABBR = ["SUN","MON","TUE","WED","THU","FRI","SAT"];
const CREW_PREFIX = "crew:member:";

/* ---------------- Helpers ---------------- */
const dateKey = (d) => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
function dayItems(dow) { return [...MORNING, ...PLAN[dow].blocks.flatMap((b) => b.items), ...EVENING]; }
function pctFor(dow, done) {
  const all = dayItems(dow);
  if (!all.length) return 0;
  return Math.round((all.filter((i) => done && done[i.id]).length / all.length) * 100);
}
function fmtTime(ms) {
  if (ms == null) return "";
  const s = Math.max(0, Math.round(ms / 1000));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}
function splitsFor(checks) {
  const byId = {};
  for (let i = 0; i < checks.length; i++) {
    byId[checks[i].id] = i === 0 ? { start: true } : { split: checks[i].t - checks[i - 1].t };
  }
  const total = checks.length >= 2 ? checks[checks.length - 1].t - checks[0].t : null;
  return { byId, total };
}
function streakFrom(logs, today, todayPct) {
  let s = 0;
  const d = new Date(today);
  if (todayPct >= 70) s++;
  d.setDate(d.getDate() - 1);
  for (let i = 0; i < 365; i++) {
    const p = pctFor(d.getDay(), logs[dateKey(d)]?.done);
    if (p >= 70) { s++; d.setDate(d.getDate() - 1); } else break;
  }
  return s;
}
const newId = () => "u" + Math.random().toString(36).slice(2, 9);

/* ---------------- App ---------------- */
const EMPTY = { logs: {}, weights: [], records: {}, profile: null };

/*
 * Design — "1994 SI × iPod", Apple-UI body type. Contrast verified WCAG 2.1:
 *   ink #111 on #FFF 18.9:1 AAA · muted #4A5560 7.62:1 AAA · red #CC0A0A 5.81:1 AA (display)
 *   ink on hl #FFE100 15.6:1 AAA · #FFF on red 5.81:1 AA · gold #B8860B on #FFF 3.6:1 (display only)
 * Layout tuned to iPhone 13 Pro Max (428pt).
 */

export default function AgelessAthlete() {
  const [state, setState] = useState(EMPTY);
  const [crew, setCrew] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [weightInput, setWeightInput] = useState("");
  const [openBlocks, setOpenBlocks] = useState({ morning: true, t0: true });
  const [showShare, setShowShare] = useState(false);
  const [shareMsg, setShareMsg] = useState("");
  // splash form
  const [fName, setFName] = useState("");
  const [fStart, setFStart] = useState("");
  const [fGoal, setFGoal] = useState("");
  const [joinCrew, setJoinCrew] = useState(true);
  // settings
  const [showSettings, setShowSettings] = useState(false);
  const [sName, setSName] = useState("");
  const [sStart, setSStart] = useState("");
  const [sGoal, setSGoal] = useState("");
  const [confirmReset, setConfirmReset] = useState(false);

  const today = new Date();
  const tKey = dateKey(today);
  const dow = today.getDay();
  const plan = PLAN[dow];
  const profile = state.profile;
  const todayLog = state.logs[tKey] || {};
  const todayDone = todayLog.done || {};
  const todayChecks = todayLog.checks || {};
  const records = state.records || {};

  const loadCrew = useCallback(async () => {
    try {
      const listed = await storage.list(CREW_PREFIX, true);
      const keys = listed?.keys || [];
      const rows = [];
      for (const k of keys) {
        try { const r = await storage.get(k, true); if (r?.value) rows.push(JSON.parse(r.value)); } catch (e) {}
      }
      setCrew(rows);
    } catch (e) { /* shared storage unavailable */ }
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const r = await storage.get("aap:v1");
        if (r?.value) {
          const parsed = JSON.parse(r.value);
          // migrate old shape (startWeight at top level, no profile)
          if (!parsed.profile && parsed.startWeight != null) {
            parsed.profile = { id: newId(), name: "", startWeight: parsed.startWeight, goalWeight: parsed.startWeight - 20, published: false };
          }
          setState({ ...EMPTY, ...parsed });
        }
      } catch (e) { /* first run */ }
      setLoaded(true);
    })();
    loadCrew();
  }, [loadCrew]);

  const persist = useCallback(async (next) => {
    setState(next);
    try { await storage.set("aap:v1", JSON.stringify(next)); } catch (e) { console.error(e); }
  }, []);

  /* ----- derived ----- */
  const pct = pctFor(dow, todayDone);
  const streak = useMemo(() => streakFrom(state.logs, today, pct), [state.logs, pct]);
  const week = useMemo(() => {
    const start = new Date(today); start.setDate(start.getDate() - dow);
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start); d.setDate(start.getDate() + i);
      const k = dateKey(d);
      return { dow: i, key: k, isToday: k === tKey, isFuture: d > today, pct: pctFor(i, state.logs[k]?.done) };
    });
  }, [state.logs, tKey]);

  const startW = profile?.startWeight ?? null;
  const goalW = profile?.goalWeight ?? null;
  const cutTarget = startW != null && goalW != null ? +(startW - goalW).toFixed(1) : 20;
  const latest = state.weights[state.weights.length - 1]?.w ?? startW;
  const lost = startW != null && latest != null ? +(startW - latest).toFixed(1) : null;
  const lbsCut = lost != null && lost > 0 ? lost : 0;
  const goalPct = lost != null && cutTarget > 0 ? Math.max(0, Math.min(100, (lost / cutTarget) * 100)) : 0;
  const goalMet = latest != null && goalW != null && latest <= goalW;
  const toGo = latest != null && goalW != null ? Math.max(0, +(latest - goalW).toFixed(1)) : null;

  /* ----- crew publish ----- */
  const publishCrew = useCallback(async (prof, curLatest, curStreak, curLost) => {
    if (!prof || !prof.published) return;
    const cut = +(prof.startWeight - prof.goalWeight).toFixed(1);
    const entry = {
      id: prof.id, name: prof.name || "Athlete",
      startWeight: prof.startWeight, goalWeight: prof.goalWeight,
      currentW: curLatest, lbsCut: curLost > 0 ? curLost : 0,
      pct: cut > 0 ? Math.max(0, Math.min(100, Math.round(((curLost > 0 ? curLost : 0) / cut) * 100))) : 0,
      streak: curStreak, updated: Date.now(),
    };
    try { await storage.set(CREW_PREFIX + prof.id, JSON.stringify(entry), true); await loadCrew(); } catch (e) {}
  }, [loadCrew]);

  /* ----- actions ----- */
  const toggle = (id, sid, title, sectionItems) => {
    const wasOn = !!todayDone[id];
    const done = { ...todayDone, [id]: !wasOn };
    const dayChecks = { ...todayChecks };
    let arr = dayChecks[sid] ? [...dayChecks[sid]] : [];
    if (!wasOn) { if (!arr.some((c) => c.id === id)) arr.push({ id, t: Date.now() }); }
    else { arr = arr.filter((c) => c.id !== id); }
    dayChecks[sid] = arr;

    const recs = { ...records };
    if (sectionItems.every((it) => done[it.id]) && arr.length >= 2) {
      const total = arr[arr.length - 1].t - arr[0].t;
      const prev = recs[title] || { best: null, history: [] };
      recs[title] = { best: prev.best == null ? total : Math.min(prev.best, total), history: [...prev.history, { ms: total, date: tKey }].slice(-30) };
    }
    const nextLogs = { ...state.logs, [tKey]: { done, checks: dayChecks } };
    const next = { ...state, logs: nextLogs, records: recs };
    persist(next);
    publishCrew(profile, latest, streakFrom(nextLogs, today, pctFor(dow, done)), lost);
  };

  const logWeight = () => {
    const w = parseFloat(weightInput);
    if (!w || w <= 0) return;
    const weights = [...state.weights.filter((x) => x.d !== tKey), { d: tKey, w }].sort((a, b) => a.d.localeCompare(b.d));
    const next = { ...state, weights };
    setWeightInput("");
    persist(next);
    const newLost = startW != null ? +(startW - w).toFixed(1) : 0;
    publishCrew(profile, w, streak, newLost);
  };

  const joinFromSplash = () => {
    const s = parseFloat(fStart), g = parseFloat(fGoal);
    if (!fName.trim() || !s || s <= 0 || !g || g <= 0 || g >= s) return;
    const prof = { id: newId(), name: fName.trim(), startWeight: s, goalWeight: g, published: joinCrew };
    const weights = [{ d: tKey, w: s }];
    const next = { ...EMPTY, profile: prof, weights, logs: {}, records: {} };
    persist(next);
    if (joinCrew) publishCrew(prof, s, 0, 0);
  };

  const togglePublish = () => {
    if (!profile) return;
    const nextProf = { ...profile, published: !profile.published };
    persist({ ...state, profile: nextProf });
    if (nextProf.published) publishCrew(nextProf, latest, streak, lost);
    else { storage.delete(CREW_PREFIX + profile.id, true).then(loadCrew).catch(() => {}); }
  };

  /* ----- settings ----- */
  const openSettings = () => {
    setSName(profile?.name || "");
    setSStart(profile ? String(profile.startWeight) : "");
    setSGoal(profile ? String(profile.goalWeight) : "");
    setConfirmReset(false);
    setShowSettings(true);
  };
  const settingsValid = (() => {
    const st = parseFloat(sStart), gl = parseFloat(sGoal);
    return !!sName.trim() && st > 0 && gl > 0 && gl < st;
  })();
  const saveSettings = () => {
    if (!settingsValid || !profile) return;
    const nm = sName.trim(), st = parseFloat(sStart), gl = parseFloat(sGoal);
    const oldStart = profile.startWeight;
    let weights = state.weights;
    // if the only/last entry is the untouched seed, move it with the new start
    if (weights.length && weights[weights.length - 1].w === oldStart) {
      weights = weights.map((x, i) => (i === weights.length - 1 ? { ...x, w: st } : x));
    }
    const prof = { ...profile, name: nm, startWeight: st, goalWeight: gl };
    persist({ ...state, profile: prof, weights });
    const newLatest = weights[weights.length - 1]?.w ?? st;
    publishCrew(prof, newLatest, streak, +(st - newLatest).toFixed(1));
    setShowSettings(false);
  };
  const resetAll = async () => {
    if (!confirmReset) { setConfirmReset(true); return; }
    try { if (profile?.published) await storage.delete(CREW_PREFIX + profile.id, true); } catch (e) {}
    try { await storage.delete("aap:v1", false); } catch (e) {}
    setState(EMPTY);
    setShowSettings(false); setConfirmReset(false);
    setFName(""); setFStart(""); setFGoal(""); setJoinCrew(true);
    loadCrew();
  };

  /* ----- share ----- */
  const shareText = profile
    ? `${profile.name} — Day ${streak} of the Ageless Athlete cut. ${lbsCut} lbs down, ${toGo ?? "?"} to go. Chasing a ${cutTarget} lb cut. 💪 #agelessathlete`
    : "";

  // Draw the progress card to a 1080×1350 PNG (feed/story friendly)
  const buildBlob = useCallback(async () => {
    const W = 1080, H = 1350;
    const canvas = document.createElement("canvas");
    canvas.width = W; canvas.height = H;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    try { await document.fonts.load('700 120px "Anton"'); await document.fonts.ready; } catch (e) {}
    const disp = 'Anton, "Arial Narrow", Impact, sans-serif';
    const sf = '700 40px -apple-system, "Helvetica Neue", Arial, sans-serif';

    ctx.fillStyle = "#111111"; ctx.fillRect(0, 0, W, H);
    // leather wash
    await new Promise<void>((res) => {
      const im = new Image();
      im.onload = () => { const s = 300; for (let y = 0; y < H; y += s) for (let x = 0; x < W; x += s) ctx.drawImage(im, x, y, s, s); ctx.fillStyle = "rgba(17,17,17,0.80)"; ctx.fillRect(0, 0, W, H); res(); };
      im.onerror = () => res();
      im.src = LEATHER;
    });

    // red masthead
    ctx.fillStyle = "#CC0A0A"; ctx.fillRect(0, 0, W, 132);
    ctx.textBaseline = "middle"; ctx.textAlign = "left";
    ctx.fillStyle = "#FFFFFF"; ctx.font = "700 62px " + disp;
    ctx.fillText("AGELESS ATHLETE", 56, 70);

    // name eyebrow
    ctx.fillStyle = "#FFE100"; ctx.font = "800 34px -apple-system, Arial, sans-serif";
    ctx.fillText((profile.name || "ATHLETE").toUpperCase(), 56, 236);

    // big number
    ctx.fillStyle = "#FFFFFF"; ctx.font = "700 340px " + disp;
    ctx.fillText(String(lbsCut), 44, 470);
    // LBS DOWN
    ctx.fillStyle = "#FFE100"; ctx.font = "700 72px " + disp;
    const numW = ctx.measureText(String(lbsCut)).width; // not used for layout but keeps parity
    ctx.fillText("LBS", 56, 690); ctx.fillText("DOWN", 56, 764);

    // red divider
    ctx.fillStyle = "#CC0A0A"; ctx.fillRect(56, 830, W - 112, 8);

    // three stats
    const stats = [["STREAK", String(streak)], ["TO GO", goalMet ? "DONE" : String(toGo ?? "?")], ["THE CUT", String(cutTarget)]];
    const colW = (W - 112) / 3;
    stats.forEach(([label, val], i) => {
      const cx = 56 + colW * i + 8;
      ctx.fillStyle = "#8A93A3"; ctx.font = "800 30px -apple-system, Arial, sans-serif";
      ctx.fillText(label, cx, 918);
      ctx.fillStyle = i === 1 && goalMet ? "#FFE85C" : "#FFFFFF"; ctx.font = "700 128px " + disp;
      ctx.fillText(val, cx, 1020);
    });

    // footer strip
    ctx.fillStyle = "#CC0A0A"; ctx.fillRect(0, H - 96, W, 96);
    ctx.fillStyle = "#FFFFFF"; ctx.font = "800 30px -apple-system, Arial, sans-serif";
    ctx.fillText("TRAIN SMART · MOVE DAILY · RECOVER HARD", 56, H - 48);

    return await new Promise((res) => canvas.toBlob((b) => res(b), "image/png"));
  }, [profile, lbsCut, streak, toGo, cutTarget, goalMet]);

  // Copy the caption text (used alongside the image on IG/FB)
  const copyCaption = async () => {
    try { if (navigator.clipboard) { await navigator.clipboard.writeText(shareText); setShareMsg("Caption copied — paste it when you post"); return; } } catch (e) {}
    setShareMsg("Select the caption below to copy it");
  };

  // Share/save the image. `platform` only tunes the guidance copy.
  const shareImage = async (platform) => {
    setShareMsg("Building your card…");
    let blob = null;
    try { blob = await buildBlob(); } catch (e) {}
    if (!blob) { setShareMsg("Couldn't render here — screenshot the card and post to " + platform); return; }
    const file = new File([blob], "ageless-cut.png", { type: "image/png" });

    // 1) native share sheet (Instagram, Facebook, Stories, Messages all appear on iOS)
    try {
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], text: shareText });
        setShareMsg("Share sheet open — choose " + platform);
        return;
      }
    } catch (e) { if (e && e.name === "AbortError") { setShareMsg(""); return; } }

    // 2) download the PNG + copy caption, then post manually
    try {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = "ageless-cut.png";
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 5000);
      try { if (navigator.clipboard) await navigator.clipboard.writeText(shareText); } catch (e) {}
      setShareMsg("Card saved + caption copied. Open " + platform + " and post it.");
      return;
    } catch (e) {}

    // 3) open the image in a new tab to long-press save
    try { const url = URL.createObjectURL(blob); window.open(url, "_blank"); setShareMsg("Card opened — long-press to save, then post to " + platform); return; } catch (e) {}

    setShareMsg("Screenshot the card and post to " + platform);
  };

  const R = 62, C = 2 * Math.PI * R;
  const kicker = { fontFamily: "var(--sf)", fontWeight: 800, fontSize: 11, letterSpacing: "0.14em", color: "var(--ink)" };
  const mono = { fontFamily: "var(--mono)", fontVariantNumeric: "tabular-nums", fontSize: 12.5, letterSpacing: "0.02em" };
  const redGrad = "linear-gradient(180deg,#DE1616 0%,#C40B0B 52%,#A70808 100%)";
  const redBtn = { background: redGrad, color: "#FFFFFF", border: "none", fontFamily: "var(--display)", letterSpacing: "0.04em", cursor: "pointer", borderRadius: 10, boxShadow: "0 2px 0 rgba(120,4,4,0.5), 0 5px 12px rgba(204,10,10,0.26), inset 0 1px 0 rgba(255,255,255,0.28)" };
  const ghostBtn = { background: "linear-gradient(180deg,#FFFFFF,#F0EFEC)", color: "var(--ink)", border: "2px solid var(--ink)", borderRadius: 10, cursor: "pointer", boxShadow: "0 2px 0 rgba(17,17,17,0.14), 0 4px 10px rgba(17,17,17,0.08)" };
  const inputStyle = { background: "#FFFFFF", border: "2px solid var(--ink)", color: "var(--ink)", fontSize: 16, fontWeight: 600, borderRadius: 10, width: "100%", minWidth: 0 };
  const moonRock = {
    background: "radial-gradient(115% 85% at 26% 12%, rgba(255,255,255,0.95), rgba(255,255,255,0) 52%), radial-gradient(95% 82% at 84% 98%, rgba(22,27,38,0.119), rgba(0,0,0,0) 58%), linear-gradient(158deg, #EFF1F3 0%, #E5E8EB 52%, #DBDFE4 100%)",
    boxShadow: "0 1px 0 rgba(255,255,255,0.85) inset, 0 10px 26px rgba(17,17,17,0.13), 0 2px 6px rgba(17,17,17,0.08)",
    border: "1px solid #CDD1D8",
  };

  const rootVars = {
    "--ink": "#111111", "--muted": "#4A5560", "--red": "#CC0A0A", "--navy": "#0A2A5C",
    "--hl": "#FFE100", "--page": "#F2F2F0", "--card": "#FFFFFF", "--rule": "#C9CBC8",
    "--display": "'Anton', 'Arial Narrow', Impact, sans-serif",
    "--sf": "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif",
    "--mono": "ui-monospace, 'SF Mono', Menlo, monospace",
    minHeight: "100vh", color: "var(--ink)", fontFamily: "var(--sf)",
    background: "linear-gradient(to top, #FAFAF8 0%, #F1F0ED 46%, #E7E7E4 100%)",
  } as CSSProperties;
  const glow = (
    <div aria-hidden style={{
      position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
      background: "radial-gradient(135% 66% at 50% 100%, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.4) 30%, rgba(255,255,255,0) 62%)",
    }} />
  );
  const styleTag = (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Anton&display=swap');
      * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
      input:focus, button:focus-visible { outline: 3px solid var(--navy); outline-offset: 2px; }
      input:focus { outline-offset: 0; }
      @media (prefers-reduced-motion: reduce) { * { transition: none !important; } }
      .chrome { background: var(--card); border: 1px solid var(--rule); border-radius: 16px; box-shadow: 0 1px 0 rgba(255,255,255,0.9) inset, 0 8px 22px rgba(17,17,17,0.09), 0 2px 5px rgba(17,17,17,0.05); }
      .depth { box-shadow: 0 6px 18px rgba(17,17,17,0.10), 0 1px 3px rgba(17,17,17,0.06); }
      .btn3d { transition: transform 60ms ease, box-shadow 120ms ease, filter 120ms ease; }
      .btn3d:hover { filter: brightness(1.04); }
      .btn3d:active { transform: translateY(2px); box-shadow: 0 0 0 rgba(0,0,0,0), inset 0 2px 5px rgba(0,0,0,0.22) !important; }
      .btn3d:disabled { filter: none; box-shadow: none; transform: none; cursor: default; }
    `}</style>
  );

  if (!loaded) return <div style={{ minHeight: "100vh", background: "#F2F2F0" }} />;

  /* ================= SPLASH / ONBOARDING ================= */
  if (!profile || !profile.name) {
    const s = parseFloat(fStart), g = parseFloat(fGoal);
    const cut = s && g && g < s ? +(s - g).toFixed(1) : null;
    const valid = fName.trim() && s > 0 && g > 0 && g < s;
    // prefill start if migrating
    if (profile && profile.startWeight && !fStart) setTimeout(() => setFStart(String(profile.startWeight)), 0);
    return (
      <div style={rootVars}>
        {styleTag}
        {glow}
        <div className="mx-auto px-4 pb-16" style={{ maxWidth: 430, position: "relative", zIndex: 1 }}>
          {/* hero — moon-rock slab */}
          <div className="mt-6" style={{ ...moonRock, borderRadius: 16, overflow: "hidden", position: "relative" }}>
            <div aria-hidden style={{ position: "absolute", inset: 0, backgroundImage: `url(${NOISE})`, backgroundSize: "140px", opacity: 0.4, mixBlendMode: "soft-light", pointerEvents: "none" }} />
            <div className="flex items-stretch" style={{ position: "relative", background: "var(--red)" }}>
              <div className="px-4 py-2.5 flex-1">
                <div style={{ fontFamily: "var(--display)", color: "#FFFFFF", fontSize: 24, lineHeight: 1, transform: "skewX(-6deg)" }}>AGELESS ATHLETE</div>
              </div>
            </div>
            {/* slim leather accent */}
            <div style={{ position: "relative", height: 10, backgroundImage: `url(${LEATHER})`, backgroundSize: "180px", boxShadow: "inset 0 -1px 3px rgba(0,0,0,0.35)" }} />
            <div className="px-5 pt-5 pb-2" style={{ position: "relative" }}>
              <h1 style={{ fontFamily: "var(--display)", fontSize: 44, lineHeight: 1, margin: 0, transform: "skewX(-6deg)", transformOrigin: "left", whiteSpace: "nowrap", textShadow: "0 1px 0 rgba(255,255,255,0.5)" }}>
                PICK YOUR CUT.
              </h1>
              <p style={{ fontSize: 15, fontWeight: 600, color: "var(--ink)", marginTop: 12, lineHeight: 1.45 }}>
                A daily strength, mobility and recovery program with a scoreboard. Set your number, log your weight, keep the streak alive.
              </p>
              <ul style={{ listStyle: "none", padding: 0, margin: "16px 0 8px" }}>
                {["Daily card with split-timer training", "Streak that ties straight to pounds cut", "A crew board so nobody trains alone"].map((t) => (
                  <li key={t} className="flex items-center gap-2.5" style={{ marginBottom: 10 }}>
                    <span style={{ width: 19, height: 19, background: "var(--red)", display: "grid", placeItems: "center", flexShrink: 0, borderRadius: 3, boxShadow: "0 1px 2px rgba(204,10,10,0.4), inset 0 1px 0 rgba(255,255,255,0.3)" }}>
                      <svg width="11" height="11" viewBox="0 0 12 12"><path d="M2 6.5L4.8 9.2 10 3.5" fill="none" stroke="#FFF" strokeWidth="2.5" strokeLinecap="round"/></svg>
                    </span>
                    <span style={{ fontSize: 14, fontWeight: 600 }}>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* form */}
          <div className="chrome p-4 mt-4">
            <span style={{ ...kicker, color: "var(--red)" }}>SET YOUR GOAL</span>
            <div className="mt-3" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <input value={fName} placeholder="Your name" onChange={(e) => setFName(e.target.value)}
                className="px-3 py-3" style={inputStyle} />
              <div className="flex gap-2">
                <input inputMode="decimal" value={fStart} placeholder="Start weight (lbs)" onChange={(e) => setFStart(e.target.value)}
                  className="flex-1 px-3 py-3" style={inputStyle} />
                <input inputMode="decimal" value={fGoal} placeholder="Goal weight (lbs)" onChange={(e) => setFGoal(e.target.value)}
                  className="flex-1 px-3 py-3" style={inputStyle} />
              </div>
              {s > 0 && g > 0 && g >= s && (
                <span style={{ ...mono, color: "var(--red)" }}>Goal must be below your start weight.</span>
              )}
              {cut && (
                <div style={{ ...kicker, background: "var(--hl)", padding: "6px 8px", alignSelf: "flex-start" }}>
                  THAT'S A {cut} LB CUT
                </div>
              )}
              <button onClick={() => setJoinCrew(!joinCrew)} className="flex items-center gap-2.5 text-left"
                style={{ background: "none", border: "none", cursor: "pointer", padding: "4px 0" }}>
                <span style={{ width: 22, height: 22, flexShrink: 0, border: `2px solid ${joinCrew ? "var(--red)" : "var(--ink)"}`, background: joinCrew ? "var(--red)" : "#FFF", display: "grid", placeItems: "center" }}>
                  {joinCrew && <svg width="12" height="12" viewBox="0 0 12 12"><path d="M2 6.5L4.8 9.2 10 3.5" fill="none" stroke="#FFF" strokeWidth="2.5" strokeLinecap="round"/></svg>}
                </span>
                <span style={{ fontSize: 14, fontWeight: 600 }}>Post me to the crew board</span>
              </button>
              {joinCrew && (
                <span style={{ ...mono, color: "var(--muted)", lineHeight: 1.4 }}>
                  Your name, streak and pounds cut become visible to everyone with this app link. You can turn this off anytime.
                </span>
              )}
              <button onClick={joinFromSplash} disabled={!valid} className="btn3d px-4 py-3 mt-1"
                style={{ ...redBtn, fontSize: 18, opacity: valid ? 1 : 0.45 }}>
                START THE CUT
              </button>
            </div>
          </div>

          {crew.length > 0 && (
            <div className="mt-4 depth" style={{ border: "2px solid var(--ink)", background: "var(--card)" }}>
              <div className="px-2 py-1" style={{ background: "var(--ink)" }}>
                <span style={{ ...kicker, color: "#FFF" }}>CREW ALREADY IN — {crew.length}</span>
              </div>
              <div className="px-3 py-2" style={{ ...mono, color: "var(--muted)" }}>
                {crew.slice(0, 5).map((m) => m.name).join(" · ")}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  /* ================= MAIN APP ================= */
  const todaySections = [
    { sid: "morning", title: "Morning — 5 min", items: MORNING, defaultOpen: true },
    ...plan.blocks.map((b, i) => ({ sid: "t" + i, title: b.title, items: b.items, defaultOpen: i === 0 })),
    { sid: "evening", title: "Evening — recovery", items: EVENING, defaultOpen: false },
  ];

  const Section = ({ sid, eyebrow, items, defaultOpen }) => {
    const open = openBlocks[sid] ?? defaultOpen;
    const n = items.filter((i) => todayDone[i.id]).length;
    const complete = n === items.length;
    const checks = todayChecks[sid] || [];
    const { byId, total } = splitsFor(checks);
    const rec = records[eyebrow];
    const best = rec?.best ?? null;
    const isPR = complete && total != null && best != null && total <= best;
    let fasterNudge = false;
    if (complete && rec && rec.history.length >= 4 && total != null && total * 1.25 < rec.history[0].ms) fasterNudge = true;
    return (
      <div style={{ borderTop: "2px solid var(--ink)" }}>
        <button onClick={() => setOpenBlocks((o) => ({ ...o, [sid]: !open }))} className="w-full flex items-center justify-between py-3.5 text-left" style={{ background: "none", border: "none", cursor: "pointer" }}>
          <span style={kicker}><span style={{ background: complete ? "var(--hl)" : "transparent", padding: complete ? "2px 6px" : 0 }}>{eyebrow.toUpperCase()}</span></span>
          <span className="flex items-center gap-2.5">
            {total != null && <span style={{ ...mono, color: isPR ? "var(--red)" : "var(--muted)", fontWeight: isPR ? 700 : 500 }}>{isPR && "★ "}{fmtTime(total)}</span>}
            <span style={{ ...kicker, color: complete ? "var(--red)" : "var(--muted)" }}>{n}/{items.length} {open ? "▾" : "▸"}</span>
          </span>
        </button>
        {open && (best != null || fasterNudge) && (
          <div className="pb-1" style={{ marginTop: -4 }}>
            {best != null && !isPR && <span style={{ ...mono, color: "var(--muted)" }}>best {fmtTime(best)}</span>}
            {fasterNudge && <div style={{ ...mono, color: "var(--navy)", fontWeight: 700, marginTop: 4 }}>↑ way faster than day one — time to add a step</div>}
          </div>
        )}
        {open && (
          <div className="pb-3">
            {items.map((it) => {
              const on = !!todayDone[it.id]; const sp = byId[it.id];
              return (
                <button key={it.id} onClick={() => toggle(it.id, sid, eyebrow, items)} className="w-full flex items-center gap-3 text-left" style={{ background: "none", border: "none", cursor: "pointer", minHeight: 46, paddingTop: 6, paddingBottom: 6 }}>
                  <span aria-hidden style={{ width: 22, height: 22, flexShrink: 0, border: `2px solid ${on ? "var(--red)" : "var(--ink)"}`, background: on ? "var(--red)" : "#FFFFFF", display: "grid", placeItems: "center", transition: "all 140ms ease" }}>
                    {on && <svg width="12" height="12" viewBox="0 0 12 12"><path d="M2 6.5L4.8 9.2 10 3.5" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" /></svg>}
                  </span>
                  <span className="flex-1" style={{ fontFamily: "var(--sf)", fontSize: 17, lineHeight: 1.32, fontWeight: 600, letterSpacing: "-0.01em", color: on ? "var(--muted)" : "var(--ink)", textDecoration: on ? "line-through" : "none" }}>{it.label}</span>
                  {on && sp && <span style={{ ...mono, color: "var(--muted)", flexShrink: 0 }}>{sp.start ? "▶" : fmtTime(sp.split)}</span>}
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  const sortedCrew = [...crew].sort((a, b) => (b.lbsCut ?? 0) - (a.lbsCut ?? 0) || (b.streak ?? 0) - (a.streak ?? 0));

  return (
    <div style={rootVars}>
      {styleTag}
      {glow}
      <div className="mx-auto px-4 pb-14" style={{ maxWidth: 430, position: "relative", zIndex: 1 }}>

        {/* Masthead */}
        <header className="pt-6">
          <div className="flex items-stretch" style={{ background: "var(--red)" }}>
            <div className="px-3 py-2 flex-1">
              <div style={{ fontFamily: "var(--display)", color: "#FFFFFF", fontSize: 26, lineHeight: 1, transform: "skewX(-6deg)" }}>AGELESS ATHLETE</div>
            </div>
            <button onClick={openSettings} className="btn3d px-3 flex items-center" style={{ background: "var(--ink)", border: "none", borderRight: "1px solid rgba(255,255,255,0.12)", cursor: "pointer" }} aria-label="Settings">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#D4D4D4" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
              </svg>
            </button>
            <button onClick={() => { setShowShare(true); setShareMsg(""); }} className="px-3 flex items-center" style={{ background: "var(--ink)", border: "none", cursor: "pointer" }} aria-label="Share progress">
              <span style={{ fontFamily: "var(--display)", color: "#FFFFFF", fontSize: 13, letterSpacing: "0.05em" }}>SHARE ↗</span>
            </button>
          </div>
          <div className="mt-4 mb-1"><span style={{ ...kicker, background: "var(--hl)", padding: "3px 8px" }}>{plan.round} · {plan.type}</span></div>
          <h1 style={{ fontFamily: "var(--display)", fontSize: 58, lineHeight: 0.95, margin: "6px 0 0", transform: "skewX(-6deg)", transformOrigin: "left" }}>{DAY_NAMES[dow]}</h1>
          <div style={{ height: 4, background: "var(--ink)", margin: "12px 0 0" }} />
          <div style={{ height: 2, background: "var(--red)", margin: "3px 0 18px" }} />
        </header>

        {/* Week box score */}
        <div className="mb-4 depth" style={{ border: "2px solid var(--ink)", background: "var(--card)" }}>
          <div className="px-2 py-1" style={{ background: "var(--ink)" }}><span style={{ ...kicker, color: "#FFFFFF" }}>THIS WEEK</span></div>
          <div className="flex">
            {week.map((d, i) => (
              <div key={d.key} className="flex-1 text-center py-2" style={{ borderLeft: i > 0 ? "1px solid var(--rule)" : "none", background: d.isToday ? "var(--hl)" : d.pct >= 70 ? "#FBEAEA" : "var(--card)" }}>
                <div style={{ ...kicker, fontSize: 10 }}>{DAY_ABBR[d.dow]}</div>
                <div style={{ fontFamily: "var(--display)", fontSize: 15, marginTop: 2, color: d.isFuture ? "var(--muted)" : d.pct >= 70 ? "var(--red)" : "var(--ink)" }}>{d.isFuture ? "–" : `${d.pct}`}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Click wheel — moon-rock instrument slab */}
        <div className="flex items-center gap-5 mb-4 p-5" style={{ ...moonRock, borderRadius: 16, position: "relative", overflow: "hidden" }}>
          <div aria-hidden style={{ position: "absolute", inset: 0, backgroundImage: `url(${NOISE})`, backgroundSize: "140px", opacity: 0.4, mixBlendMode: "soft-light", pointerEvents: "none" }} />
          <div style={{ position: "relative", width: 148, height: 148, flexShrink: 0 }}>
            <svg width="148" height="148" viewBox="0 0 148 148" role="img" aria-label={`Today ${pct}% complete`}>
              <defs>
                <radialGradient id="wheel" cx="42%" cy="34%" r="72%"><stop offset="0" stopColor="#F1F1EF" /><stop offset="0.55" stopColor="#DFDFDC" /><stop offset="1" stopColor="#C6C6C2" /></radialGradient>
                <radialGradient id="btn" cx="42%" cy="34%" r="70%"><stop offset="0" stopColor="#FFFFFF" /><stop offset="1" stopColor="#E4E4E1" /></radialGradient>
              </defs>
              <circle cx="74" cy="74" r="70" fill="url(#wheel)" stroke="#B7B7B3" strokeWidth="1" />
              <circle cx="74" cy="74" r={R} fill="none" stroke="var(--red)" strokeWidth="9" strokeDasharray={C} strokeDashoffset={C - (C * pct) / 100} transform="rotate(-90 74 74)" style={{ transition: "stroke-dashoffset 420ms ease" }} />
              <circle cx="74" cy="74" r="42" fill="url(#btn)" stroke="#C6C6C3" strokeWidth="1" />
              <text x="74" y="72" textAnchor="middle" fill="var(--ink)" style={{ fontFamily: "var(--display)", fontSize: 30 }}>{pct}</text>
              <text x="74" y="92" textAnchor="middle" fill="var(--muted)" style={{ fontFamily: "var(--sf)", fontWeight: 800, fontSize: 9, letterSpacing: "0.16em" }}>PCT DONE</text>
            </svg>
          </div>
          <div style={{ position: "relative" }}>
            <div style={{ fontFamily: "var(--display)", fontSize: 56, lineHeight: 1, color: "var(--red)", transform: "skewX(-6deg)", textShadow: "0 1px 0 rgba(255,255,255,0.5)" }}>{streak}</div>
            <div style={{ ...kicker, marginTop: 2 }}>DAY STREAK</div>
            <p style={{ fontSize: 13, color: "var(--muted)", marginTop: 8, lineHeight: 1.45, fontWeight: 600 }}>Hit 70 to keep the streak. Consistency beats hero workouts.</p>
          </div>
        </div>

        {/* Scoreboard streak → lbs — moon rock */}
        <div className="mb-4 flex items-stretch" style={{ ...moonRock, border: "2px solid var(--ink)", borderRadius: 4, position: "relative", overflow: "hidden" }}>
          <div aria-hidden style={{ position: "absolute", inset: 0, backgroundImage: `url(${NOISE})`, backgroundSize: "140px", opacity: 0.4, mixBlendMode: "soft-light", pointerEvents: "none" }} />
          <div className="flex-1 text-center py-2.5" style={{ position: "relative" }}>
            <div style={{ ...kicker, fontSize: 10, color: "var(--muted)" }}>DAY STREAK</div>
            <div style={{ fontFamily: "var(--display)", fontSize: 34, lineHeight: 1, marginTop: 2, textShadow: "0 1px 0 rgba(255,255,255,0.5)" }}>{streak}</div>
          </div>
          <div className="flex items-center px-2" style={{ position: "relative", backgroundImage: `linear-gradient(rgba(17,17,17,0.35),rgba(17,17,17,0.35)), url(${METAL})`, backgroundSize: "cover" }}>
            <span style={{ fontFamily: "var(--display)", color: "#FFFFFF", fontSize: 20, textShadow: "0 1px 2px rgba(0,0,0,0.6)" }}>→</span>
          </div>
          <div className="flex-1 text-center py-2.5" style={{ position: "relative" }}>
            <div style={{ ...kicker, fontSize: 10, color: "var(--muted)" }}>LBS CUT</div>
            <div style={{ fontFamily: "var(--display)", fontSize: 34, lineHeight: 1, marginTop: 2, color: "var(--red)", textShadow: "0 1px 0 rgba(255,255,255,0.5)" }}>{lbsCut > 0 ? lbsCut : "0"}</div>
          </div>
        </div>

        {/* Checklists */}
        <div className="chrome px-4 mb-4">
          <div className="pt-4 pb-1"><span style={{ ...kicker, color: "var(--red)" }}>TODAY'S CARD</span></div>
          {todaySections.map((s) => <Section key={s.sid} sid={s.sid} eyebrow={s.title} items={s.items} defaultOpen={s.defaultOpen} />)}
        </div>

        {/* Weight — leather mat */}
        <div style={{ backgroundImage: `url(${LEATHER})`, backgroundSize: "220px", padding: 10, borderRadius: 18, boxShadow: "0 2px 10px rgba(17,17,17,0.22), 0 1px 0 rgba(255,255,255,0.25) inset" }}>
          <div className="p-4" style={{ background: "var(--card)", borderRadius: 11, boxShadow: "0 1px 3px rgba(0,0,0,0.28)" }}>
            <div className="flex items-baseline justify-between mb-3" style={{ borderBottom: "2px solid var(--ink)", paddingBottom: 8 }}>
              <span style={{ fontFamily: "var(--display)", fontSize: 22, transform: "skewX(-6deg)", display: "inline-block" }}>THE {cutTarget} LB CUT</span>
              {lost != null && (goalMet ? (
                <span style={{ ...kicker, color: "#3A2E00", background: "linear-gradient(180deg,#FFE85C,#E8B800)", padding: "3px 9px", borderRadius: 3, boxShadow: "0 1px 0 rgba(255,255,255,0.6) inset, 0 1px 2px rgba(0,0,0,0.25)" }}>★ GOAL MET</span>
              ) : (
                <span style={{ ...kicker, background: lost > 0 ? "var(--hl)" : "transparent", padding: "2px 6px" }}>{lost > 0 ? `DOWN ${lost} LBS` : "AT BASELINE"}</span>
              ))}
            </div>

            {goalMet && (
              <div className="mb-4 px-4 py-3" style={{ backgroundImage: `linear-gradient(rgba(17,17,17,0.72),rgba(17,17,17,0.72)), url(${LEATHER})`, backgroundSize: "cover", borderRadius: 8, border: "2px solid #E8B800" }}>
                <div style={{ fontFamily: "var(--display)", fontSize: 30, lineHeight: 1, color: "#FFE85C", transform: "skewX(-6deg)" }}>GOAL MET</div>
                <div style={{ fontFamily: "var(--sf)", fontSize: 14, fontWeight: 700, color: "#FFFFFF", marginTop: 4, letterSpacing: "-0.01em" }}>{lost} lbs down from {startW}. You cleared the line — set a new one when you're ready.</div>
              </div>
            )}

            <div className="flex items-baseline gap-3 mb-2">
              <span style={{ fontFamily: "var(--display)", fontSize: 44, lineHeight: 1, color: goalMet ? "#B8860B" : "var(--ink)" }}>{latest ?? startW}</span>
              <span style={{ ...kicker, color: "var(--muted)" }}>START {startW} · GOAL {goalW}{!goalMet && toGo != null && toGo > 0 && toGo <= 3 && <span style={{ color: "var(--red)" }}> · {toGo} TO GO</span>}</span>
            </div>
            <div style={{ height: 12, background: "#E4E4E1", border: "1px solid var(--rule)", overflow: "hidden", marginBottom: 14 }}>
              <div style={{ height: "100%", width: `${goalPct}%`, transition: "width 400ms ease", background: goalMet ? "linear-gradient(90deg,#E8B800,#FFE85C)" : "var(--red)" }} />
            </div>

            {state.weights.length >= 2 && (() => {
              const ws = state.weights.slice(-14);
              const min = Math.min(...ws.map((x) => x.w), goalW);
              const max = Math.max(...ws.map((x) => x.w), startW);
              const span = Math.max(max - min, 1);
              const pts = ws.map((x, i) => `${(i / (ws.length - 1)) * 300},${44 - ((x.w - min) / span) * 40}`).join(" ");
              const goalY = 44 - ((goalW - min) / span) * 40;
              return (
                <svg width="100%" height="48" viewBox="0 0 300 48" preserveAspectRatio="none" style={{ marginBottom: 14 }}>
                  <line x1="0" x2="300" y1={goalY} y2={goalY} stroke="var(--navy)" strokeWidth="1.5" strokeDasharray="4 4" />
                  <polyline points={pts} fill="none" stroke="var(--red)" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
                </svg>
              );
            })()}

            <div className="flex gap-2">
              <input inputMode="decimal" value={weightInput} placeholder="Today's weight (lbs)" onChange={(e) => setWeightInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && logWeight()} className="flex-1 px-3 py-3" style={inputStyle} />
              <button onClick={logWeight} className="btn3d px-4" style={{ ...redBtn, fontSize: 15 }}>LOG WEIGHT</button>
            </div>
          </div>
        </div>

        {/* Crew — deliberately quiet / secondary */}
        <div className="mt-5" style={{ background: "#F4F3F0", borderRadius: 14, border: "1px solid var(--rule)", boxShadow: "inset 0 1px 3px rgba(17,17,17,0.05)", overflow: "hidden" }}>
          <div className="px-3.5 pt-3 pb-2 flex items-center justify-between">
            <span style={{ fontFamily: "var(--sf)", fontWeight: 700, fontSize: 11.5, letterSpacing: "0.12em", color: "var(--muted)" }}>THE CREW · {crew.length}</span>
            <button onClick={loadCrew} className="btn3d" style={{ fontFamily: "var(--sf)", fontWeight: 700, fontSize: 11, letterSpacing: "0.08em", color: "var(--muted)", background: "none", border: "none", cursor: "pointer" }}>REFRESH ↻</button>
          </div>
          {sortedCrew.length === 0 ? (
            <div className="px-3.5 pb-4" style={{ fontSize: 13.5, fontWeight: 500, color: "var(--muted)", lineHeight: 1.5 }}>
              Nobody here yet. Post yourself below, then share the app so your people can join and set their own cut.
            </div>
          ) : (
            <div className="px-2 pb-1">
              {sortedCrew.map((m, i) => {
                const me = profile && m.id === profile.id;
                return (
                  <div key={m.id} className="flex items-center px-2 py-2" style={{ borderTop: i > 0 ? "1px solid rgba(17,17,17,0.06)" : "none", background: me ? "rgba(204,10,10,0.05)" : "transparent", borderRadius: me ? 8 : 0 }}>
                    <span style={{ fontFamily: "var(--sf)", fontWeight: 700, fontSize: 13, width: 22, color: "var(--muted)", fontVariantNumeric: "tabular-nums" }}>{i + 1}</span>
                    <div className="flex-1" style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 14.5, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", color: "var(--ink)" }}>{m.name}{me && <span style={{ ...mono, color: "var(--muted)" }}>  · you</span>}</div>
                      <div style={{ ...mono, color: "var(--muted)", fontSize: 11.5 }}>{m.streak || 0}-day streak · {m.pct || 0}% to goal</div>
                    </div>
                    <span style={{ fontFamily: "var(--sf)", fontWeight: 800, fontSize: 15, color: "var(--ink)", fontVariantNumeric: "tabular-nums" }}>{(m.lbsCut ?? 0) > 0 ? `-${m.lbsCut}` : "0"}</span>
                    <span style={{ ...mono, color: "var(--muted)", marginLeft: 3, fontSize: 11 }}>lbs</span>
                  </div>
                );
              })}
            </div>
          )}
          <div className="px-3.5 pt-2 pb-3.5" style={{ borderTop: "1px solid rgba(17,17,17,0.07)" }}>
            <button onClick={togglePublish} className="btn3d w-full px-4 py-2.5" style={{
              fontFamily: "var(--sf)", fontWeight: 700, fontSize: 13.5, letterSpacing: "0.02em", cursor: "pointer", borderRadius: 9,
              color: profile.published ? "var(--muted)" : "var(--red)",
              background: profile.published ? "#EDECE8" : "#FFFFFF",
              border: `1.5px solid ${profile.published ? "var(--rule)" : "rgba(204,10,10,0.4)"}`,
              boxShadow: "0 1px 2px rgba(17,17,17,0.06)",
            }}>
              {profile.published ? "Remove me from the crew" : "Post me to the crew"}
            </button>
            <p style={{ ...mono, color: "var(--muted)", marginTop: 8, lineHeight: 1.4, fontSize: 10.5 }}>
              {profile.published
                ? "You're on the shared board — name, streak and pounds cut are visible to anyone with this app link."
                : "Posting makes your name, streak and pounds cut visible to everyone with this app link."}
            </p>
          </div>
        </div>

        <p style={{ ...kicker, textAlign: "center", marginTop: 22, color: "var(--muted)" }}>TRAIN SMART · MOVE DAILY · RECOVER HARD</p>
      </div>

      {/* ---------- Share overlay ---------- */}
      {showShare && (
        <div onClick={() => setShowShare(false)} style={{ position: "fixed", inset: 0, background: "rgba(17,17,17,0.66)", display: "grid", placeItems: "center", padding: 20, zIndex: 50 }}>
          <div onClick={(e) => e.stopPropagation()} style={{ width: "100%", maxWidth: 380 }}>
            {/* SHARE CARD (screenshot-friendly) */}
            <div style={{ backgroundImage: `url(${LEATHER})`, backgroundSize: "260px", padding: 12, borderRadius: 18, boxShadow: "0 10px 40px rgba(0,0,0,0.5)" }}>
              <div style={{ background: "var(--ink)", borderRadius: 10, overflow: "hidden" }}>
                <div className="flex items-stretch" style={{ background: "var(--red)" }}>
                  <div className="px-3 py-2 flex-1"><div style={{ fontFamily: "var(--display)", color: "#FFF", fontSize: 20, transform: "skewX(-6deg)" }}>AGELESS ATHLETE</div></div>
                </div>
                <div className="px-5 py-5" style={{ color: "#FFF" }}>
                  <div style={{ ...kicker, color: "#FFE100" }}>{profile.name.toUpperCase()}</div>
                  <div className="flex items-end gap-3 mt-2">
                    <span style={{ fontFamily: "var(--display)", fontSize: 76, lineHeight: 0.85, color: "#FFF" }}>{lbsCut}</span>
                    <span style={{ fontFamily: "var(--display)", fontSize: 20, color: "#FFE100", marginBottom: 10, transform: "skewX(-6deg)" }}>LBS DOWN</span>
                  </div>
                  <div style={{ height: 2, background: "var(--red)", margin: "12px 0" }} />
                  <div className="flex justify-between">
                    <div><div style={{ ...kicker, color: "#8A93A3", fontSize: 10 }}>STREAK</div><div style={{ fontFamily: "var(--display)", fontSize: 30 }}>{streak}</div></div>
                    <div><div style={{ ...kicker, color: "#8A93A3", fontSize: 10 }}>TO GO</div><div style={{ fontFamily: "var(--display)", fontSize: 30, color: goalMet ? "#FFE85C" : "#FFF" }}>{goalMet ? "DONE" : (toGo ?? "?")}</div></div>
                    <div><div style={{ ...kicker, color: "#8A93A3", fontSize: 10 }}>THE CUT</div><div style={{ fontFamily: "var(--display)", fontSize: 30 }}>{cutTarget}</div></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-2 mt-3">
              <button onClick={() => shareImage("Instagram")} className="btn3d flex-1 px-3 py-3" aria-label="Share to Instagram"
                style={{ border: "none", borderRadius: 10, cursor: "pointer", color: "#FFF", fontFamily: "var(--display)", fontSize: 16, letterSpacing: "0.03em",
                  background: "linear-gradient(70deg,#F58529,#DD2A7B 55%,#8134AF 90%)", boxShadow: "0 2px 0 rgba(90,20,80,0.45), 0 5px 12px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.25)" }}>
                INSTAGRAM
              </button>
              <button onClick={() => shareImage("Facebook")} className="btn3d flex-1 px-3 py-3" aria-label="Share to Facebook"
                style={{ border: "none", borderRadius: 10, cursor: "pointer", color: "#FFF", fontFamily: "var(--display)", fontSize: 16, letterSpacing: "0.03em", background: "linear-gradient(180deg,#2B8BFF,#1877F2 55%,#1361C9)", boxShadow: "0 2px 0 rgba(10,60,140,0.5), 0 5px 12px rgba(24,119,242,0.3), inset 0 1px 0 rgba(255,255,255,0.28)" }}>
                FACEBOOK
              </button>
            </div>
            <div className="flex gap-2 mt-2">
              <button onClick={() => shareImage("your feed")} className="btn3d flex-1 px-3 py-3" style={{ ...ghostBtn, fontFamily: "var(--display)", fontSize: 15 }}>SAVE IMAGE</button>
              <button onClick={copyCaption} className="btn3d flex-1 px-3 py-3" style={{ ...ghostBtn, fontFamily: "var(--display)", fontSize: 15 }}>COPY CAPTION</button>
              <button onClick={() => setShowShare(false)} className="btn3d px-3 py-3" style={{ fontFamily: "var(--display)", fontSize: 15, background: "linear-gradient(180deg,#2A2A2A,#111111)", color: "#FFF", border: "none", borderRadius: 10, cursor: "pointer", boxShadow: "0 2px 0 rgba(0,0,0,0.5), 0 4px 10px rgba(0,0,0,0.3)" }}>CLOSE</button>
            </div>
            <p style={{ ...mono, color: "#EDE8DD", textAlign: "center", marginTop: 10, lineHeight: 1.5 }}>
              {shareMsg || "Builds a real image. On iPhone the share sheet opens straight into Instagram, Facebook or Stories."}
            </p>
            <p style={{ ...mono, color: "#8A93A3", textAlign: "center", marginTop: 6, fontSize: 10.5, lineHeight: 1.5 }}>
              Instagram has no direct web posting, so the card is handed to your phone to post — one tap on iPhone, or saved to your camera roll as backup.
            </p>
          </div>
        </div>
      )}

      {/* ---------- Settings overlay ---------- */}
      {showSettings && (
        <div onClick={() => setShowSettings(false)} style={{ position: "fixed", inset: 0, background: "rgba(17,17,17,0.66)", display: "grid", placeItems: "center", padding: 20, zIndex: 50 }}>
          <div onClick={(e) => e.stopPropagation()} className="chrome" style={{ width: "100%", maxWidth: 380, padding: 18 }}>
            <div className="flex items-center justify-between" style={{ borderBottom: "2px solid var(--ink)", paddingBottom: 10, marginBottom: 14 }}>
              <span style={{ fontFamily: "var(--display)", fontSize: 24, transform: "skewX(-6deg)", display: "inline-block" }}>SETTINGS</span>
              <button onClick={() => setShowSettings(false)} aria-label="Close settings" style={{ background: "none", border: "none", cursor: "pointer", fontSize: 22, lineHeight: 1, color: "var(--muted)" }}>✕</button>
            </div>

            <label style={{ fontFamily: "var(--sf)", fontWeight: 700, fontSize: 11, letterSpacing: "0.12em", color: "var(--muted)" }}>NAME</label>
            <input value={sName} onChange={(e) => setSName(e.target.value)} className="px-3 py-3 mt-1.5" style={{ ...inputStyle, width: "100%" }} placeholder="Your name" />

            <div className="flex gap-2 mt-3">
              <div className="flex-1">
                <label style={{ fontFamily: "var(--sf)", fontWeight: 700, fontSize: 11, letterSpacing: "0.12em", color: "var(--muted)" }}>START (LBS)</label>
                <input inputMode="decimal" value={sStart} onChange={(e) => setSStart(e.target.value)} className="px-3 py-3 mt-1.5" style={{ ...inputStyle, width: "100%" }} />
              </div>
              <div className="flex-1">
                <label style={{ fontFamily: "var(--sf)", fontWeight: 700, fontSize: 11, letterSpacing: "0.12em", color: "var(--muted)" }}>GOAL (LBS)</label>
                <input inputMode="decimal" value={sGoal} onChange={(e) => setSGoal(e.target.value)} className="px-3 py-3 mt-1.5" style={{ ...inputStyle, width: "100%" }} />
              </div>
            </div>

            {(() => {
              const st = parseFloat(sStart), gl = parseFloat(sGoal);
              if (st > 0 && gl > 0 && gl >= st) return <p style={{ ...mono, color: "var(--red)", marginTop: 10 }}>Goal must be below your start weight.</p>;
              if (st > 0 && gl > 0) return <div style={{ ...kicker, background: "var(--hl)", padding: "5px 8px", marginTop: 12, display: "inline-block" }}>THAT'S A {(+(st - gl).toFixed(1))} LB CUT</div>;
              return null;
            })()}

            <button onClick={saveSettings} disabled={!settingsValid} className="btn3d w-full px-4 py-3 mt-4" style={{ ...redBtn, fontSize: 16, opacity: settingsValid ? 1 : 0.45 }}>
              SAVE CHANGES
            </button>

            {/* danger zone */}
            <div className="mt-4 pt-3" style={{ borderTop: "1px solid var(--rule)" }}>
              <span style={{ fontFamily: "var(--sf)", fontWeight: 700, fontSize: 11, letterSpacing: "0.12em", color: "var(--muted)" }}>START OVER</span>
              <p style={{ ...mono, color: "var(--muted)", margin: "6px 0 10px", lineHeight: 1.45 }}>
                Erases your profile, streak, weight log and crew entry on this device and returns to the start screen. This can't be undone.
              </p>
              <div className="flex gap-2">
                <button onClick={resetAll} className="btn3d flex-1 px-4 py-2.5" style={{
                  fontFamily: "var(--sf)", fontWeight: 700, fontSize: 13.5, cursor: "pointer", borderRadius: 9,
                  color: confirmReset ? "#FFFFFF" : "var(--red)",
                  background: confirmReset ? "var(--red)" : "#FFFFFF",
                  border: "1.5px solid rgba(204,10,10,0.5)",
                  boxShadow: confirmReset ? "0 2px 0 rgba(120,4,4,0.5)" : "0 1px 2px rgba(17,17,17,0.06)",
                }}>
                  {confirmReset ? "Tap again to erase everything" : "Reset everything"}
                </button>
                {confirmReset && (
                  <button onClick={() => setConfirmReset(false)} className="btn3d px-4 py-2.5" style={{ ...ghostBtn, fontFamily: "var(--sf)", fontWeight: 700, fontSize: 13.5, borderWidth: 1.5 }}>
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
