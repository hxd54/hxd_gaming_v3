export interface UserHardware {
  os?: string;
  cpu?: string;
  ramGb?: number;
  gpu?: string;
  storageGb?: number;
}

export type CompatibilityStatus =
  | 'recommended_met'
  | 'minimum_met'
  | 'not_met'
  | 'insufficient_info';

export interface CompatibilityResult {
  status: CompatibilityStatus;
  label: string;
  color: 'green' | 'amber' | 'red' | 'neutral';
  details: {
    os?: { status: 'pass' | 'fail' | 'unknown'; message: string };
    cpu?: { status: 'pass' | 'fail' | 'unknown'; message: string };
    ram?: { status: 'pass' | 'fail' | 'unknown'; message: string };
    gpu?: { status: 'pass' | 'fail' | 'unknown'; message: string };
    storage?: { status: 'pass' | 'fail' | 'unknown'; message: string };
  };
}

export function parseStorageGb(text?: string): number | null {
  if (!text) return null;
  const match = text.match(/(\d+)\s*(GB|TB)/i);
  if (!match) return null;
  const val = parseInt(match[1], 10);
  if (match[2].toUpperCase() === 'TB') return val * 1024;
  return val;
}

export function parseRamGb(text?: string): number | null {
  if (!text) return null;
  const match = text.match(/(\d+)\s*GB/i);
  return match ? parseInt(match[1], 10) : null;
}

export function checkGameCompatibility(
  user: UserHardware,
  requirements?: {
    minimum?: { os?: string; processor?: string; memory?: string; graphics?: string; storage?: string };
    recommended?: { os?: string; processor?: string; memory?: string; graphics?: string; storage?: string };
  }
): CompatibilityResult {
  if (!requirements?.minimum && !requirements?.recommended) {
    return {
      status: 'insufficient_info',
      label: 'Insufficient game specification data',
      color: 'neutral',
      details: {},
    };
  }

  const min = requirements.minimum || {};
  const rec = requirements.recommended || {};

  const minRam = parseRamGb(min.memory);
  const recRam = parseRamGb(rec.memory);
  const minStorage = parseStorageGb(min.storage);
  const recStorage = parseStorageGb(rec.storage);

  const details: CompatibilityResult['details'] = {};
  let passesMin = true;
  let passesRec = true;
  let evaluatedItems = 0;

  // 1. RAM Check
  if (user.ramGb && (minRam || recRam)) {
    evaluatedItems++;
    if (recRam && user.ramGb >= recRam) {
      details.ram = { status: 'pass', message: `${user.ramGb} GB installed (Exceeds recommended ${recRam} GB)` };
    } else if (minRam && user.ramGb >= minRam) {
      details.ram = { status: 'pass', message: `${user.ramGb} GB installed (Meets minimum ${minRam} GB)` };
      passesRec = false;
    } else if (minRam && user.ramGb < minRam) {
      details.ram = { status: 'fail', message: `${user.ramGb} GB installed (Requires minimum ${minRam} GB)` };
      passesMin = false;
      passesRec = false;
    }
  }

  // 2. Storage Check
  if (user.storageGb && (minStorage || recStorage)) {
    evaluatedItems++;
    if (recStorage && user.storageGb >= recStorage) {
      details.storage = { status: 'pass', message: `${user.storageGb} GB free (Recommended ${recStorage} GB met)` };
    } else if (minStorage && user.storageGb >= minStorage) {
      details.storage = { status: 'pass', message: `${user.storageGb} GB free (Minimum ${minStorage} GB met)` };
      passesRec = false;
    } else if (minStorage && user.storageGb < minStorage) {
      details.storage = { status: 'fail', message: `${user.storageGb} GB free (Requires ${minStorage} GB space)` };
      passesMin = false;
      passesRec = false;
    }
  }

  // 3. CPU Check
  if (user.cpu?.trim() && min.processor) {
    evaluatedItems++;
    details.cpu = {
      status: 'pass',
      message: `Specified: ${user.cpu.trim()} (Target: ${min.processor})`,
    };
  }

  // 4. GPU Check
  if (user.gpu?.trim() && min.graphics) {
    evaluatedItems++;
    details.gpu = {
      status: 'pass',
      message: `Specified: ${user.gpu.trim()} (Target: ${min.graphics})`,
    };
  }

  if (evaluatedItems === 0) {
    return {
      status: 'insufficient_info',
      label: 'Enter your hardware specifications above to compare',
      color: 'neutral',
      details,
    };
  }

  if (!passesMin) {
    return {
      status: 'not_met',
      label: 'Minimum requirements not met',
      color: 'red',
      details,
    };
  }

  if (passesRec && (recRam || recStorage)) {
    return {
      status: 'recommended_met',
      label: 'Your device meets recommended requirements',
      color: 'green',
      details,
    };
  }

  return {
    status: 'minimum_met',
    label: 'Your device meets minimum requirements',
    color: 'amber',
    details,
  };
}

