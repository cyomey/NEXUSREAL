// ════════════════════════════════════════════════════════════════
// SECTION 1: CORE ENGINE
// ════════════════════════════════════════════════════════════════
const $ = id => document.getElementById(id);
const G = {};

// ── Save/Load (robusto) ──
const SAVE_KEY = 'nexus6_state';
const SLOTS_KEY = 'nexus6_slots';
const MURAL_KEY = 'nexus6_mural';
const API_BASE = window.NEXUS_CONFIG?.apiBase || '';

