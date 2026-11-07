import fs from 'fs';
import path from 'path';
import { Game, Developer, Submission } from '@/types';
import initialGames from '@/data/initial-games.json';
import initialDevelopers from '@/data/initial-developers.json';

const DATA_DIR = path.join(process.cwd(), 'data-storage');
const GAMES_FILE = path.join(DATA_DIR, 'games.json');
const DEVELOPERS_FILE = path.join(DATA_DIR, 'developers.json');
const SUBMISSIONS_FILE = path.join(DATA_DIR, 'submissions.json');

function ensureDataStorage() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(GAMES_FILE)) {
    fs.writeFileSync(GAMES_FILE, JSON.stringify(initialGames, null, 2), 'utf-8');
  }

  if (!fs.existsSync(DEVELOPERS_FILE)) {
    fs.writeFileSync(DEVELOPERS_FILE, JSON.stringify(initialDevelopers, null, 2), 'utf-8');
  }

  if (!fs.existsSync(SUBMISSIONS_FILE)) {
    fs.writeFileSync(SUBMISSIONS_FILE, JSON.stringify([], null, 2), 'utf-8');
  }
}

export async function getGames(): Promise<Game[]> {
  try {
    ensureDataStorage();
    const raw = fs.readFileSync(GAMES_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (error) {
    console.error('Error reading games storage, falling back to initial data:', error);
    return initialGames as unknown as Game[];
  }
}

export async function getGameBySlug(slug: string): Promise<Game | null> {
  const games = await getGames();
  const normalized = slug.toLowerCase().trim();
  return games.find((g) => g.slug?.toLowerCase() === normalized || g.id === slug) || null;
}

export async function getGameById(id: string): Promise<Game | null> {
  const games = await getGames();
  return games.find((g) => g.id === id) || null;
}

export async function saveGame(game: Game): Promise<Game> {
  ensureDataStorage();
  const games = await getGames();
  const index = games.findIndex((g) => g.id === game.id);

  const updatedGame: Game = {
    ...game,
    updatedAt: new Date().toISOString(),
    createdAt: index >= 0 ? games[index].createdAt : new Date().toISOString(),
  };

  if (index >= 0) {
    games[index] = updatedGame;
  } else {
    games.unshift(updatedGame);
  }

  fs.writeFileSync(GAMES_FILE, JSON.stringify(games, null, 2), 'utf-8');
  return updatedGame;
}

export async function deleteGame(id: string): Promise<boolean> {
  ensureDataStorage();
  const games = await getGames();
  const filtered = games.filter((g) => g.id !== id);

  if (filtered.length === games.length) {
    return false;
  }

  fs.writeFileSync(GAMES_FILE, JSON.stringify(filtered, null, 2), 'utf-8');
  return true;
}

export async function getDevelopers(): Promise<Developer[]> {
  try {
    ensureDataStorage();
    const raw = fs.readFileSync(DEVELOPERS_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (error) {
    console.error('Error reading developers storage:', error);
    return initialDevelopers as unknown as Developer[];
  }
}

export async function getDeveloperBySlug(slug: string): Promise<Developer | null> {
  const devs = await getDevelopers();
  const normalized = slug.toLowerCase().trim();
  return devs.find((d) => d.slug?.toLowerCase() === normalized || d.id === slug) || null;
}

export async function saveDeveloper(dev: Developer): Promise<Developer> {
  ensureDataStorage();
  const devs = await getDevelopers();
  const index = devs.findIndex((d) => d.id === dev.id);

  if (index >= 0) {
    devs[index] = dev;
  } else {
    devs.unshift(dev);
  }

  fs.writeFileSync(DEVELOPERS_FILE, JSON.stringify(devs, null, 2), 'utf-8');
  return dev;
}

export async function getSubmissions(): Promise<Submission[]> {
  try {
    ensureDataStorage();
    const raw = fs.readFileSync(SUBMISSIONS_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (error) {
    console.error('Error reading submissions storage:', error);
    return [];
  }
}

export async function saveSubmission(submission: Submission): Promise<Submission> {
  ensureDataStorage();
  const submissions = await getSubmissions();
  submissions.unshift(submission);
  fs.writeFileSync(SUBMISSIONS_FILE, JSON.stringify(submissions, null, 2), 'utf-8');
  return submission;
}

export async function updateSubmissionStatus(
  id: string,
  status: 'approved' | 'rejected',
  adminNotes?: string
): Promise<Submission | null> {
  ensureDataStorage();
  const submissions = await getSubmissions();
  const sub = submissions.find((s) => s.id === id);

  if (!sub) return null;

  sub.status = status;
  sub.reviewedAt = new Date().toISOString();
  if (adminNotes !== undefined) {
    sub.adminNotes = adminNotes;
  }

  // If approved, automatically convert and save into public games library
  if (status === 'approved') {
    const slug = sub.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const newGame: Game = {
      id: sub.id,
      title: sub.title,
      slug: slug,
      description: sub.description,
      shortDescription: sub.shortDescription || sub.description.slice(0, 160),
      imageUrl: sub.imageUrl,
      screenshots: sub.screenshots || [],
      developer: sub.developer,
      developerSlug: sub.developer.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
      releaseDate: sub.releaseDate || new Date().toISOString().split('T')[0],
      categories: sub.categories || ['Indie'],
      platforms: (sub.platforms as any) || ['PC'],
      gameplayModes: ['Single-player'],
      systemRequirements: sub.systemRequirements,
      officialWebsite: sub.officialWebsite,
      authorizedLinks: sub.authorizedLinks || [],
      accessibilityFeatures: sub.accessibilityFeatures || [],
      isRwandanOrAfrican: !!sub.isAfricanDeveloper,
      editorialCollections: ['best-indie'],
      verificationStatus: 'verified',
      featured: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await saveGame(newGame);
  }

  fs.writeFileSync(SUBMISSIONS_FILE, JSON.stringify(submissions, null, 2), 'utf-8');
  return sub;
}
