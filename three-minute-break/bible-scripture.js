(() => {
  'use strict';

  const scriptureByMeta = {
    '요한복음 14장 1–3절 핵심 의미 요약': '너희는 마음에 근심하지 말라 하나님을 믿으니 또 나를 믿으라\n내 아버지 집에 거할 곳이 많도다 그렇지 않으면 너희에게 일렀으리라 내가 너희를 위하여 처소를 예비하러 가노니\n가서 너희를 위하여 처소를 예비하면 내가 다시 와서 너희를 내게로 영접하여 나 있는 곳에 너희도 있게 하리라'
  };

  const card = document.getElementById('card');
  const cardMeta = document.getElementById('cardMeta');
  if (!card || !cardMeta) return;

  const scripture = document.createElement('p');
  scripture.id = 'cardScripture';
  scripture.className = 'card-scripture';
  scripture.hidden = true;
  cardMeta.insertAdjacentElement('afterend', scripture);

  function updateScripture() {
    const rawMeta = cardMeta.textContent.trim().replace(/^\(|\)$/g, '');
    const text = scriptureByMeta[rawMeta];
    const isBible = Boolean(text);

    if (isBible) {
      cardMeta.textContent = `(${rawMeta})`;
      scripture.textContent = text;
      scripture.hidden = false;
    } else {
      scripture.textContent = '';
      scripture.hidden = true;
    }
  }

  const observer = new MutationObserver(updateScripture);
  observer.observe(cardMeta, { childList: true, characterData: true, subtree: true });
  updateScripture();
})();
