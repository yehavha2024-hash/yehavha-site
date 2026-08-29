(() => {
  'use strict';

  const DATA_BASE = 'https://raw.githubusercontent.com/bluesaurel/Korean-Bible-1961-KRV/main/data/';

  const bookFiles = {
    '창세기': 'Genesis.json',
    '출애굽기': 'Exodus.json',
    '신명기': 'Deuteronomy.json',
    '여호수아': 'Joshua.json',
    '사무엘상': '1Samuel.json',
    '시편': 'Psalms.json',
    '잠언': 'Proverbs.json',
    '전도서': 'Ecclesiastes.json',
    '이사야': 'Isaiah.json',
    '예레미야': 'Jeremiah.json',
    '예레미야애가': 'Lamentations.json',
    '미가': 'Micah.json',
    '하박국': 'Habakkuk.json',
    '마태복음': 'Matthew.json',
    '마가복음': 'Mark.json',
    '누가복음': 'Luke.json',
    '요한복음': 'John.json',
    '로마서': 'Romans.json',
    '고린도전서': '1Corinthians.json',
    '갈라디아서': 'Galatians.json',
    '빌립보서': 'Philippians.json',
    '히브리서': 'Hebrews.json',
    '요한계시록': 'Revelation.json'
  };

  const fallbackByMeta = {
    '요한복음 14장 1–3절 핵심 의미 요약': '너희는 마음에 근심하지 말라 하나님을 믿으니 또 나를 믿으라\n내 아버지 집에 거할 곳이 많도다 그렇지 않으면 너희에게 일렀으리라 내가 너희를 위하여 처소를 예비하러 가노니\n가서 너희를 위하여 처소를 예비하면 내가 다시 와서 너희를 내게로 영접하여 나 있는 곳에 너희도 있게 하리라'
  };

  const style = document.createElement('style');
  style.textContent = '.card-scripture{margin:10px 0 0;padding:10px 12px;border-top:1px solid rgba(0,0,0,.12);white-space:pre-line;font-size:.95rem;line-height:1.7;color:inherit}.card-scripture[hidden]{display:none}';
  document.head.append(style);

  const card = document.getElementById('card');
  const cardMeta = document.getElementById('cardMeta');
  if (!card || !cardMeta) return;

  const scripture = document.createElement('p');
  scripture.id = 'cardScripture';
  scripture.className = 'card-scripture';
  scripture.hidden = true;
  cardMeta.insertAdjacentElement('afterend', scripture);

  const bookCache = new Map();
  let requestSequence = 0;

  function cleanMeta(value) {
    return String(value || '').trim().replace(/^\(|\)$/g, '');
  }

  function parseReference(meta) {
    const match = meta.match(/^(.+?)\s+(\d+)(?:장|편)\s+(\d+)(?:[–-](\d+))?절\s+핵심 의미 요약$/);
    if (!match) return null;

    const [, book, chapter, firstVerse, lastVerse] = match;
    const file = bookFiles[book];
    if (!file) return null;

    return {
      book,
      file,
      chapter: Number(chapter),
      firstVerse: Number(firstVerse),
      lastVerse: Number(lastVerse || firstVerse)
    };
  }

  function hideScripture() {
    scripture.textContent = '';
    scripture.hidden = true;
  }

  function loadBook(file) {
    if (!bookCache.has(file)) {
      const promise = fetch(`${DATA_BASE}${file}`, { cache: 'force-cache' })
        .then((response) => {
          if (!response.ok) throw new Error(`Bible data HTTP ${response.status}`);
          return response.json();
        });
      bookCache.set(file, promise);
    }
    return bookCache.get(file);
  }

  function extractPassage(bookData, reference) {
    const chapter = Array.isArray(bookData?.chapters)
      ? bookData.chapters.find((item) => Number(item.chapter) === reference.chapter)
      : null;
    if (!chapter || !Array.isArray(chapter.verses)) return '';

    return chapter.verses
      .filter((item) => Number(item.verse) >= reference.firstVerse && Number(item.verse) <= reference.lastVerse)
      .map((item) => String(item.text || '').trim())
      .filter(Boolean)
      .join('\n');
  }

  async function updateScripture() {
    const sequence = ++requestSequence;
    const rawMeta = cleanMeta(cardMeta.textContent);
    const reference = parseReference(rawMeta);

    if (document.body.dataset.category !== 'bible' || !reference) {
      hideScripture();
      return;
    }

    const formattedMeta = `(${rawMeta})`;
    if (cardMeta.textContent !== formattedMeta) cardMeta.textContent = formattedMeta;

    scripture.textContent = '개역한글 본문을 불러오는 중입니다.';
    scripture.hidden = false;

    try {
      const bookData = await loadBook(reference.file);
      if (sequence !== requestSequence) return;

      const text = extractPassage(bookData, reference) || fallbackByMeta[rawMeta] || '';
      if (!text) {
        hideScripture();
        return;
      }

      scripture.textContent = text;
      scripture.hidden = false;
    } catch (error) {
      if (sequence !== requestSequence) return;
      console.warn('KRV scripture load failed:', error);

      const fallback = fallbackByMeta[rawMeta];
      if (fallback) {
        scripture.textContent = fallback;
        scripture.hidden = false;
      } else {
        scripture.textContent = '개역한글 본문을 불러오지 못했습니다.';
        scripture.hidden = false;
      }
    }
  }

  const observer = new MutationObserver(updateScripture);
  observer.observe(cardMeta, { childList: true, characterData: true, subtree: true });
  updateScripture();
})();