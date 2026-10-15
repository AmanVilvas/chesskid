import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sourceCommit = 'ad760137cf9941cadd93126433695d6933209b0a';
const upstream = `https://raw.githubusercontent.com/lichess-org/lila/${sourceCommit}`;
const pieceFiles = ['rook', 'bishop', 'queen', 'king', 'knight', 'pawn'];

async function fetchSource(file) {
  const response = await fetch(`${upstream}/${file}`);
  if (!response.ok) throw new Error(`Could not fetch ${file}: HTTP ${response.status}`);
  return response.text();
}

function findBalanced(source, start, open, close) {
  let depth = 0;
  let quote = '';
  let escaped = false;
  let lineComment = false;
  let blockComment = false;

  for (let index = start; index < source.length; index += 1) {
    const char = source[index];
    const next = source[index + 1];

    if (lineComment) {
      if (char === '\n') lineComment = false;
      continue;
    }
    if (blockComment) {
      if (char === '*' && next === '/') {
        blockComment = false;
        index += 1;
      }
      continue;
    }
    if (quote) {
      if (escaped) escaped = false;
      else if (char === '\\') escaped = true;
      else if (char === quote) quote = '';
      continue;
    }
    if (char === '/' && next === '/') {
      lineComment = true;
      index += 1;
      continue;
    }
    if (char === '/' && next === '*') {
      blockComment = true;
      index += 1;
      continue;
    }
    if (char === "'" || char === '"' || char === '`') {
      quote = char;
      continue;
    }
    if (char === open) depth += 1;
    if (char === close && --depth === 0) return source.slice(start, index + 1);
  }

  throw new Error(`Unclosed ${open} in upstream source`);
}

function topLevelObjects(arrayLiteral) {
  const objects = [];
  let quote = '';
  let escaped = false;
  let lineComment = false;
  let blockComment = false;

  for (let index = 1; index < arrayLiteral.length - 1; index += 1) {
    const char = arrayLiteral[index];
    const next = arrayLiteral[index + 1];
    if (lineComment) {
      if (char === '\n') lineComment = false;
      continue;
    }
    if (blockComment) {
      if (char === '*' && next === '/') {
        blockComment = false;
        index += 1;
      }
      continue;
    }
    if (quote) {
      if (escaped) escaped = false;
      else if (char === '\\') escaped = true;
      else if (char === quote) quote = '';
      continue;
    }
    if (char === '/' && next === '/') {
      lineComment = true;
      index += 1;
      continue;
    }
    if (char === '/' && next === '*') {
      blockComment = true;
      index += 1;
      continue;
    }
    if (char === "'" || char === '"' || char === '`') {
      quote = char;
      continue;
    }
    if (char === '{') {
      const object = findBalanced(arrayLiteral, index, '{', '}');
      objects.push(object);
      index += object.length - 1;
    }
  }
  return objects;
}

function getString(object, key) {
  const expression = new RegExp(`\\b${key}\\s*:\\s*(['"])(.*?)\\1`, 's');
  const match = object.match(expression);
  return match?.[2];
}

function getNumber(object, key) {
  const match = object.match(new RegExp(`\\b${key}\\s*:\\s*(\\d+)`));
  return match ? Number(match[1]) : undefined;
}

function getI18nKey(source, property) {
  const match = source.match(new RegExp(`\\b${property}\\s*:\\s*i18n\\.learn\\.([A-Za-z0-9_]+)`));
  return match?.[1];
}

function readTranslations(xml) {
  const translations = new Map();
  for (const match of xml.matchAll(/<string\s+name="([^"]+)">([\s\S]*?)<\/string>/g)) {
    const value = match[2]
      .replace(/<[^>]*>/g, ' ')
      .replace(/\\'/g, "'")
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&apos;/g, "'")
      .replace(/\s+/g, ' ')
      .trim();
    translations.set(match[1], value);
  }
  return translations;
}

function translated(translations, key, context) {
  const value = translations.get(key);
  if (!value) throw new Error(`Missing English translation "${key}" (${context})`);
  return value;
}

function parseFailureRule(object) {
  const match = object.match(/failure\s*:\s*(noPieceOn|whitePawnOnAnyOf)\(['"]([^'"]+)['"]\)/);
  return match ? { type: match[1], squares: match[2].split(/\s+/).filter(Boolean) } : null;
}

function parseStage(source, piece, stageId, translations) {
  const levelsStart = source.indexOf('levels: [');
  if (levelsStart < 0) throw new Error(`${piece}: no levels array found`);
  const openIndex = source.indexOf('[', levelsStart);
  const levelArray = findBalanced(source, openIndex, '[', ']');
  const levelObjects = topLevelObjects(levelArray);
  if (!levelObjects.length) throw new Error(`${piece}: no levels extracted`);

  const stageTitleKey = getI18nKey(source, 'title');
  const stageSubtitleKey = getI18nKey(source, 'subtitle');
  const introKey = getI18nKey(source, 'intro');
  const completeKey = getI18nKey(source, 'complete');

  const exercises = levelObjects.map((object, index) => {
    const goalKey = getI18nKey(object, 'goal');
    const fen = getString(object, 'fen');
    const applesSource = getString(object, 'apples');
    const nbMoves = getNumber(object, 'nbMoves');
    if (!goalKey || !fen || applesSource === undefined || nbMoves === undefined) {
      throw new Error(`${piece} exercise ${index + 1}: missing goal, FEN, apples, or move target`);
    }
    const hintMoves = [...(object.match(/\bshapes\s*:\s*\[([\s\S]*?)\]/)?.[1] || '').matchAll(/arrow\(['"]([a-h][1-8][a-h][1-8][qrbn]?)['"]\)/g)]
      .map((match) => match[1]);
    const fenFields = fen.split(/\s+/);
    if (fenFields.length < 4) throw new Error(`${piece} exercise ${index + 1}: invalid source FEN`);
    const apples = applesSource.split(/\s+/).filter(Boolean);
    const targetId = `${piece}-${index + 1}`;

    return {
      id: targetId,
      originalExerciseId: index + 1,
      goalKey,
      goal: translated(translations, goalKey, targetId),
      sourceFen: fen,
      fen: fenFields.length === 4 ? `${fen} 0 1` : fen,
      sideToMove: fenFields[1],
      apples,
      nbMoves,
      hintMoves,
      emptyApples: /\bemptyApples\s*:\s*true/.test(object),
      explainPromotion: /\bexplainPromotion\s*:\s*true/.test(object),
      failureRule: parseFailureRule(object),
      cssClass: getString(object, 'cssClass') || null,
    };
  });

  const ids = exercises.map((exercise) => exercise.id);
  if (new Set(ids).size !== ids.length) throw new Error(`${piece}: duplicate exercise ids`);

  return {
    id: piece,
    originalStageId: stageId,
    piece,
    pieceCode: piece[0],
    title: translated(translations, stageTitleKey, piece),
    subtitle: translated(translations, stageSubtitleKey, piece),
    intro: translated(translations, introKey, piece),
    complete: translated(translations, completeKey, piece),
    exercises,
  };
}

const [stageListSource, translationSource, ...stageSources] = await Promise.all([
  fetchSource('ui/learn/src/stage/list.ts'),
  fetchSource('translation/dest/learn/en-US.xml'),
  ...pieceFiles.map((piece) => fetchSource(`ui/learn/src/stage/${piece}.ts`)),
]);

const piecesInSource = stageListSource.match(/key:\s*'chess-pieces',[\s\S]*?stages:\s*\[([^\]]+)\]/)?.[1]
  .match(/[a-zA-Z]+/g);
if (!piecesInSource) throw new Error('Could not read the original chess-pieces category order');
if (piecesInSource.join(',') !== pieceFiles.join(',')) {
  throw new Error(`Unexpected upstream piece order: ${piecesInSource.join(',')}`);
}

const translations = readTranslations(translationSource);
const categories = stageSources.map((source, index) => parseStage(source, pieceFiles[index], index + 1, translations));
const counts = categories.map(({ id, exercises }) => `${id}: ${exercises.length}`).join(', ');
if (categories.length !== 6 || categories.some(({ exercises }) => !exercises.length)) {
  throw new Error('Expected six non-empty piece categories');
}

const output = {
  source: {
    repository: 'https://github.com/lichess-org/lila',
    commit: sourceCommit,
    stageListPath: 'ui/learn/src/stage/list.ts',
    stagePath: 'ui/learn/src/stage/{rook,bishop,queen,king,knight,pawn}.ts',
    translationsPath: 'translation/dest/learn/en-US.xml',
    license: 'AGPL-3.0-or-later; see upstream COPYING.md',
  },
  categories,
  extractionReport: {
    categoriesProcessed: categories.length,
    exercisesByCategory: Object.fromEntries(categories.map(({ id, exercises }) => [id, exercises.length])),
    totalExercises: categories.reduce((sum, { exercises }) => sum + exercises.length, 0),
  },
};

const outputPath = path.join(repoRoot, 'src/data/lichessLearnExercises.json');
await mkdir(path.dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${JSON.stringify(output, null, 2)}\n`, 'utf8');
console.log(`Extracted ${output.extractionReport.totalExercises} exercises (${counts}) to src/data/lichessLearnExercises.json`);
