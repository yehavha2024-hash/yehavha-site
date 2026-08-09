const AI_NOTICE = 'AI 활용 안내: 일부 기술·법률 연구자료의 탐색·구조화·초안 작성에 생성형 AI를 활용했으며, 사실과 전망의 구분, 법적 분석, 출처 검토와 최종 편집은 운영자가 관리합니다.';

function injectMainDisclosure(html) {
  if (html.includes(AI_NOTICE)) return html;
  const contactPattern = /(<p>\s*문의\s*<a[^>]+href=["']mailto:kimbrighth@gmail\.com["'][^>]*>[^<]*<\/a>\s*<\/p>)/i;
  if (contactPattern.test(html)) {
    return html.replace(contactPattern, `$1<p class="ai-disclosure">${AI_NOTICE}</p>`);
  }
  return html;
}

function injectRuntimeEnforcer(html) {
  if (html.includes('data-server-ai-disclosure')) return html;
  const script = `<script data-server-ai-disclosure>(()=>{const t=${JSON.stringify(AI_NOTICE)};function e(){document.querySelectorAll('.footer-meta,.document-footer-copy').forEach(b=>{let n=b.querySelector('.ai-disclosure');if(!n){const c=b.querySelector('a[href^="mailto:"]')?.closest('p');n=document.createElement('p');n.className='ai-disclosure';n.textContent=t;c?c.insertAdjacentElement('afterend',n):b.appendChild(n)}else if(!n.textContent.trim())n.textContent=t})}document.readyState==='loading'?document.addEventListener('DOMContentLoaded',e,{once:true}):e();window.addEventListener('load',e,{once:true});new MutationObserver(e).observe(document.documentElement,{childList:true,subtree:true})})();</script>`;
  return html.includes('</body>') ? html.replace('</body>', `${script}</body>`) : `${html}${script}`;
}

export async function onRequest({ next }) {
  const response = await next();
  const headers = new Headers(response.headers);
  headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
  headers.set('Pragma', 'no-cache');
  headers.set('Expires', '0');

  const contentType = headers.get('content-type') || '';
  if (!contentType.includes('text/html')) {
    return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
  }

  let html = await response.text();
  html = injectMainDisclosure(html);
  html = injectRuntimeEnforcer(html);

  headers.delete('content-length');
  headers.delete('etag');
  return new Response(html, { status: response.status, statusText: response.statusText, headers });
}
