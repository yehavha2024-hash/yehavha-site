const AI_NOTICE = 'AI 활용 안내: 일부 기술·법률 연구자료의 탐색·구조화·초안 작성에 생성형 AI를 활용했으며, 사실과 전망의 구분, 법적 분석, 출처 검토와 최종 편집은 운영자가 관리합니다.';

class RemoveExistingDisclosure {
  element(element) {
    element.remove();
  }
}

class InsertDisclosureBeforeTopLink {
  element(element) {
    element.before(`<p class="ai-disclosure" data-ai-disclosure="server">${AI_NOTICE}</p>`, { html: true });
  }
}

export default {
  async fetch(request, env) {
    const response = await env.ASSETS.fetch(request);
    const contentType = response.headers.get('content-type') || '';

    if (!contentType.includes('text/html')) {
      return response;
    }

    const transformed = new HTMLRewriter()
      .on('.site-footer .footer-meta .ai-disclosure', new RemoveExistingDisclosure())
      .on('.site-footer .footer-meta .top-link', new InsertDisclosureBeforeTopLink())
      .transform(response);

    const headers = new Headers(transformed.headers);
    headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
    headers.set('Pragma', 'no-cache');
    headers.set('Expires', '0');
    headers.set('X-Yehavha-Build', 'foresight-ai-disclosure-worker-v1');

    return new Response(transformed.body, {
      status: transformed.status,
      statusText: transformed.statusText,
      headers
    });
  }
};
