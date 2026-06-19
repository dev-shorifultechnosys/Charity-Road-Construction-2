(() => {
  const html = document.documentElement;
  const body = document.body;
  const langToggle = document.getElementById('langToggle');
  const langCurrent = document.querySelector('.lang-current');
  const navLinks = document.getElementById('navLinks');
  const menuBtn = document.querySelector('.menu-button');
  const amountButtons = document.querySelectorAll('.amount-btn');
  const selectedAmount = document.getElementById('selectedAmount');
  const donationForm = document.getElementById('donationForm');
  const receiptModal = document.getElementById('receiptModal');
  const receiptText = document.getElementById('receiptText');
  const receiptBox = document.getElementById('receiptBox');
  const downloadReceiptBtn = document.getElementById('downloadReceiptBtn');
  const exportBtn = document.getElementById('exportBtn');

  const state = {
    lang: localStorage.getItem('masaratLang') || 'ar',
    amount: 50,
    lastReceipt: null,
    donations: JSON.parse(localStorage.getItem('masaratDemoDonations') || '[]')
  };

  function money(value) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
  }

  function setLanguage(lang) {
    state.lang = lang;
    localStorage.setItem('masaratLang', lang);
    html.lang = lang;
    html.dir = lang === 'ar' ? 'rtl' : 'ltr';
    body.dir = html.dir;

    document.querySelectorAll('[data-ar][data-en]').forEach((el) => {
      el.textContent = el.dataset[lang] || el.textContent;
    });

    document.querySelectorAll('[data-placeholder-ar][data-placeholder-en]').forEach((el) => {
      el.placeholder = lang === 'ar' ? el.dataset.placeholderAr : el.dataset.placeholderEn;
    });

    langCurrent.textContent = lang === 'ar' ? 'EN' : 'AR';
    document.title = lang === 'ar'
      ? 'مسارات الخير | مبادرة إنشاء وصيانة الطرق'
      : 'Masarat Al Khair | Road Construction & Care';
  }

  function openModal() {
    receiptModal.classList.add('active');
    receiptModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    receiptModal.classList.remove('active');
    receiptModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function downloadText(filename, text) {
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  amountButtons.forEach((button) => {
    button.addEventListener('click', () => {
      amountButtons.forEach((btn) => btn.classList.remove('active'));
      button.classList.add('active');
      const amount = Number(button.dataset.amount);
      if (amount === 0) {
        const custom = prompt(state.lang === 'ar' ? 'اكتب المبلغ بالدولار' : 'Enter amount in USD');
        const clean = Number(custom || 50);
        state.amount = clean > 0 ? clean : 50;
      } else {
        state.amount = amount;
      }
      selectedAmount.textContent = state.amount;
    });
  });

  donationForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(donationForm);
    const donation = {
      receiptId: `MSR-${Date.now().toString().slice(-8)}`,
      date: new Date().toISOString(),
      name: String(data.get('donorName')).trim(),
      email: String(data.get('donorEmail')).trim(),
      amount: state.amount,
      recurring: document.getElementById('monthlyToggle')?.checked || false
    };

    state.lastReceipt = donation;
    state.donations.push(donation);
    localStorage.setItem('masaratDemoDonations', JSON.stringify(state.donations));

    const labels = state.lang === 'ar'
      ? { thanks: 'شكرًا لك. تم تسجيل تبرع تجريبي بقيمة', receipt: 'رقم الإيصال', donor: 'المتبرع', email: 'البريد', amount: 'المبلغ', type: 'نوع التبرع', once: 'مرة واحدة', monthly: 'شهري' }
      : { thanks: 'Thank you. A demo donation was recorded for', receipt: 'Receipt ID', donor: 'Donor', email: 'Email', amount: 'Amount', type: 'Donation type', once: 'One-time', monthly: 'Monthly' };

    receiptText.textContent = `${labels.thanks} ${money(donation.amount)}.`;
    receiptBox.innerHTML = `
      <div><strong>${labels.receipt}:</strong> ${donation.receiptId}</div>
      <div><strong>${labels.donor}:</strong> ${donation.name}</div>
      <div><strong>${labels.email}:</strong> ${donation.email}</div>
      <div><strong>${labels.amount}:</strong> ${money(donation.amount)}</div>
      <div><strong>${labels.type}:</strong> ${donation.recurring ? labels.monthly : labels.once}</div>
    `;
    donationForm.reset();
    openModal();
  });

  downloadReceiptBtn?.addEventListener('click', () => {
    if (!state.lastReceipt) return;
    const d = state.lastReceipt;
    const text = `Masarat Al Khair Demo Receipt
Receipt ID: ${d.receiptId}
Date: ${d.date}
Donor: ${d.name}
Email: ${d.email}
Amount: ${money(d.amount)}
Type: ${d.recurring ? 'Monthly' : 'One-time'}

Production note: issue official receipts only after payment gateway confirmation.`;
    downloadText(`${d.receiptId}.txt`, text);
  });

  exportBtn?.addEventListener('click', () => {
    const rows = [
      ['receipt_id', 'date', 'name', 'email', 'amount', 'recurring'],
      ...state.donations.map((d) => [d.receiptId, d.date, d.name, d.email, d.amount, d.recurring])
    ];
    const csv = rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n');
    downloadText('masarat-donation-demo-report.csv', csv);
  });

  document.querySelectorAll('[data-close-modal]').forEach((el) => el.addEventListener('click', closeModal));
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeModal(); });

  langToggle?.addEventListener('click', () => setLanguage(state.lang === 'ar' ? 'en' : 'ar'));

  menuBtn?.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', String(isOpen));
  });

  navLinks?.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      menuBtn?.setAttribute('aria-expanded', 'false');
    });
  });

  document.getElementById('newsletterForm')?.addEventListener('submit', (event) => {
    event.preventDefault();
    alert(state.lang === 'ar' ? 'تم الاشتراك تجريبيًا.' : 'Demo subscription saved.');
    event.target.reset();
  });

  document.getElementById('impactVideoBtn')?.addEventListener('click', () => {
    alert(state.lang === 'ar' ? 'هنا يمكن ربط فيديو تعريفي لاحقًا.' : 'An impact video can be connected here later.');
  });

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

  document.getElementById('year').textContent = new Date().getFullYear();
  setLanguage(state.lang);
})();
