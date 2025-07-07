document.addEventListener('DOMContentLoaded', function() {
  var btn = document.getElementById('backBtn');
  if (btn) btn.addEventListener('click', function() {
    window.location.href = 'index.html';
  });
}); 