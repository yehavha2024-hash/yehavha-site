(() => {
  'use strict';

  const DATA_BASE = 'https://raw.githubusercontent.com/bluesaurel/Korean-Bible-1961-KRV/main/data/';

  const bookFiles = {
    '창세기': 'Genesis.json',
    '출애굽기': 'Exodus.json',
    '레위기': 'Leviticus.json',
    '민수기': 'Numbers.json',
    '신명기': 'Deuteronomy.json',
    '여호수아': 'Joshua.json',
    '사사기': 'Judges.json',
    '룻기': 'Ruth.json',
    '사무엘상': '1Samuel.json',
    '사무엘하': '2Samuel.json',
    '열왕기상': '1Kings.json',
    '열왕기하': '2Kings.json',
    '역대상': '1Chronicles.json',
    '역대하': '2Chronicles.json',
    '에스라': 'Ezra.json',
    '느헤미야': 'Nehemiah.json',
    '에스더': 'Esther.json',
    '욥기': 'Job.json',
    '시편': 'Psalms.json',
    '잠언': 'Proverbs.json',
    '전도서': 'Ecclesiastes.json',
    '아가': 'SongofSolomon.json',
    '이사야': 'Isaiah.json',
    '예레미야': 'Jeremiah.json',
    '예레미야애가': 'Lamentations.json',
    '에스겔': 'Ezekiel.json',
    '다니엘': 'Daniel.json',
    '호세아': 'Hosea.json',
    '요엘': 'Joel.json',
    '아모스': 'Amos.json',
    '오바댜': 'Obadiah.json',
    '요나': 'Jonah.json',
    '미가': 'Micah.json',
    '나훔': 'Nahum.json',
    '하박국': 'Habakkuk.json',
    '스바냐': 'Zephaniah.json',
    '학개': 'Haggai.json',
    '스가랴': 'Zechariah.json',
    '말라기': 'Malachi.json',
    '마태복음': 'Matthew.json',
    '마가복음': 'Mark.json',
    '누가복음': 'Luke.json',
    '요한복음': 'John.json',
    '사도행전': 'Acts.json',
    '로마서': 'Romans.json',
    '고린도전서': '1Corinthians.json',
    '고린도후서': '2Corinthians.json',
    '갈라디아서': 'Galatians.json',
    '에베소서': 'Ephesians.json',
    '빌립보서': 'Philippians.json',
    '골로새서': 'Colossians.json',
    '데살로니가전서': '1Thessalonians.json',
    '데살로니가후서': '2Thessalonians.json',
    '디모데전서': '1Timothy.json',
    '디모데후서': '2Timothy.json',
    '디도서': 'Titus.json',
    '빌레몬서': 'Philemon.json',
    '히브리서': 'Hebrews.json',
    '야고보서': 'James.json',
    '베드로전서': '1Peter.json',
    '베드로후서': '2Peter.json',
    '요한일서': '1John.json',
    '요한이서': '2John.json',
    '요한삼서': '3John.json',
    '유다서': 'Jude.json',
    '요한계시록': 'Revelation.json'
  };

  const fallbackByMeta = {
    '요한복음 14장 1–3절 핵심 의미 요약': '너희는 마음에 근심하지 말라 하나님을 믿으니 또 나를 믿으라\n내 아버지 집에 거할 곳이 많도다 그렇지 않으면 너희에게 일렀으리라 내가 너희를 위하여 처소를 예비하러 가노니\n가서 너희를 위하여 처소를 예비하면 내가 다시 와서 너희를 내게로 영접하여 나 있는 곳에 너희도 있게 하리라'
  };

  const style = document.createElement('style');
  style.textContent = '.card-scripture{margin:10px 0 0;padding:10px 12px;border-top:1px solid rgba(0,0,0,.12);white-space:pre-line;font-size:.95rem;line-height:1.7;color:inherit}.card-scripture-note{margin:6px 12px 0;font-size:.78rem;line-height:1.5;opacity:.72}.card-scripture[hidden],.card-scripture-note[hidden]{display:none}';
  document.head.append(style);

  const card = document.getElementById('card');
  const cardMeta = document.getElementById('cardMeta');
  if (!card || !cardMeta) return;

  const scripture = document.createElement('p');
  scripture.id = 'cardScripture';
  scripture.className = 'card-scripture';
  scripture.hidden = true;
  cardMeta.insertAdjacentElement('afterend', scripture);

  const scriptureNote = document.createElement('p');
  scriptureNote.id = 'cardScriptureNote';
  scriptureNote.className = 'card-scripture-note';
  scriptureNote.textContent = '표기 안내: 개역한글 본문의 ‘예수’는 히브리어 원래 이름인 ‘예슈아’로 표기했습니다.';
  scriptureNote.hidden = true;
  scripture.insertAdjacentElement('afterend', scriptureNote);

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
    scriptureNote.hidden = true;
  }

  function normalizeNames(text) {
    return String(text || '')
      .replaceAll('예수', '예슈아')
      .replaceAll('여호와', '야훼');
  }

  function showPassage(originalText) {
    const source = String(originalText || '');
    scripture.textContent = normalizeNames(source);
    scripture.hidden = false;
    scriptureNote.hidden = !source.includes('예수');
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
    scriptureNote.hidden = true;

    try {
      const bookData = await loadBook(reference.file);
      if (sequence !== requestSequence) return;

      const text = extractPassage(bookData, reference) || fallbackByMeta[rawMeta] || '';
      if (!text) {
        hideScripture();
        return;
      }

      showPassage(text);
    } catch (error) {
      if (sequence !== requestSequence) return;
      console.warn('KRV scripture load failed:', error);

      const fallback = fallbackByMeta[rawMeta];
      if (fallback) {
        showPassage(fallback);
      } else {
        scripture.textContent = '개역한글 본문을 불러오지 못했습니다.';
        scripture.hidden = false;
        scriptureNote.hidden = true;
      }
    }
  }

  const observer = new MutationObserver(updateScripture);
  observer.observe(cardMeta, { childList: true, characterData: true, subtree: true });
  updateScripture();
})();