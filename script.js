const menuButton = document.querySelector('.menu-button');
const navigation = document.querySelector('#main-nav');

menuButton?.addEventListener('click', () => {
  const isOpen = navigation.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(isOpen));
});

navigation?.addEventListener('click', (event) => {
  if (event.target.closest('a')) {
    navigation.classList.remove('open');
    menuButton?.setAttribute('aria-expanded', 'false');
  }
});

document.querySelector('#year').textContent = new Date().getFullYear();

document.querySelector('#contact-form')?.addEventListener('submit', (event) => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  const subject = encodeURIComponent(`[AI 법률연구소 문의] ${data.get('type')}`);
  const body = encodeURIComponent(`이름 / 기관: ${data.get('name')}\n이메일: ${data.get('email')}\n문의 유형: ${data.get('type')}\n\n${data.get('message')}`);
  window.location.href = `mailto:contact@ailawri.org?subject=${subject}&body=${body}`;
});
