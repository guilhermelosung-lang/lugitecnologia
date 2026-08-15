(function () {
  'use strict';

  var header = document.getElementById('header');
  var nav = document.getElementById('nav');
  var navToggle = document.getElementById('navToggle');
  var navLinks = document.querySelectorAll('.nav-link');
  var yearEl = document.getElementById('year');

  if (yearEl) yearEl.textContent = new Date().getFullYear();

  navToggle.addEventListener('click', function () {
    var isOpen = nav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', isOpen);
    navToggle.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
  });

  navLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      nav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  window.addEventListener('scroll', function () {
    header.style.background = window.scrollY > 20
      ? 'rgba(23, 9, 54, 0.92)'
      : 'rgba(23, 9, 54, 0.72)';
  });

  var sections = document.querySelectorAll('main section[id]');
  var onScrollSpy = function () {
    var scrollPos = window.scrollY + 120;
    sections.forEach(function (section) {
      var top = section.offsetTop;
      var bottom = top + section.offsetHeight;
      var link = document.querySelector('.nav-link[href="#' + section.id + '"]');
      if (!link) return;
      if (scrollPos >= top && scrollPos < bottom) {
        navLinks.forEach(function (l) { l.classList.remove('active'); });
        link.classList.add('active');
      }
    });
  };
  window.addEventListener('scroll', onScrollSpy);
  onScrollSpy();

  var WHATSAPP_NUMBER = '5500000000000';

  var form = document.getElementById('contactForm');
  var formHint = document.getElementById('formHint');

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var name = form.name.value.trim();
    var email = form.email.value.trim();
    var phone = form.phone.value.trim();
    var message = form.message.value.trim();

    var fields = [form.name, form.email, form.phone, form.message];
    var valid = true;
    fields.forEach(function (field) {
      field.classList.add('touched');
      if (!field.checkValidity()) valid = false;
    });

    if (!valid) {
      formHint.textContent = 'Preencha todos os campos corretamente antes de enviar.';
      formHint.style.color = '#E5484D';
      return;
    }

    var text =
      'Olá, Lugi Tecnologia! Meu nome é ' + name + '.\n' +
      'E-mail: ' + email + '\n' +
      'Telefone: ' + phone + '\n\n' +
      'Mensagem: ' + message;

    var url = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(text);
    window.open(url, '_blank', 'noopener');

    formHint.textContent = 'Mensagem pronta! Enviamos você para o WhatsApp para concluir o contato.';
    formHint.style.color = 'var(--color-accent-dark)';
    form.reset();
    fields.forEach(function (field) { field.classList.remove('touched'); });
  });
})();
