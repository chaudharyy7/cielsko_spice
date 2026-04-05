// ============================================================
// CIELSKO ADMIN — JAVASCRIPT
// ============================================================
document.addEventListener('DOMContentLoaded', () => {

  // ── SIDEBAR TOGGLE (mobile) ────────────────────────────────
  const toggle  = document.getElementById('sidebarToggle');
  const sidebar = document.getElementById('sidebar');
  if (toggle && sidebar) {
    toggle.addEventListener('click', () => sidebar.classList.toggle('open'));
    document.addEventListener('click', e => {
      if (!sidebar.contains(e.target) && !toggle.contains(e.target))
        sidebar.classList.remove('open');
    });
  }

  // ── AUTO-DISMISS FLASH ─────────────────────────────────────
  document.querySelectorAll('.admin-flash').forEach(el => {
    setTimeout(() => el.style.opacity = '0', 4000);
    setTimeout(() => el.remove(), 4500);
  });

  // ── MODAL ESCAPE KEY ──────────────────────────────────────
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal.open').forEach(m => m.classList.remove('open'));
    }
  });

  // ── IMAGE PREVIEW on file input ───────────────────────────
  document.querySelectorAll('input[type="file"]').forEach(input => {
    input.addEventListener('change', function() {
      const file = this.files[0];
      if (!file || !file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = e => {
        // Find a nearby .current-image img or cert/team preview
        const wrap = this.closest('.form-section') || this.closest('.modal__box');
        if (!wrap) return;
        let preview = wrap.querySelector('.current-image img, #editCertPreview, #editTeamPhoto');
        if (!preview) {
          const div = document.createElement('div');
          div.className = 'current-image';
          div.innerHTML = '<img src="" alt="Preview" />';
          this.closest('.form-group').insertAdjacentElement('beforebegin', div);
          preview = div.querySelector('img');
        }
        preview.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  });

  // ── STATUS SELECTS highlight ──────────────────────────────
  document.querySelectorAll('.status-select').forEach(sel => {
    const colorize = () => {
      sel.style.color = sel.value === 'new' ? '#C44E14' : sel.value === 'replied' || sel.value === 'closed' ? '#065F46' : '#1E40AF';
    };
    colorize();
    sel.addEventListener('change', colorize);
  });

});
