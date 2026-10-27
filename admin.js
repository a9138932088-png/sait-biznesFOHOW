(function () {
  var ADMIN = {
    email: "admin@admin.com",
    password: "Admin123",
  };

  var LEADS_KEY = "fohow_leads";
  var SESSION_KEY = "fohow_admin_session";

  var loginView = document.getElementById("login-view");
  var dashboardView = document.getElementById("dashboard-view");
  var loginForm = document.getElementById("login-form");
  var loginError = document.getElementById("login-error");
  var leadsBody = document.getElementById("leads-body");
  var logoutBtn = document.getElementById("logout-btn");
  var refreshBtn = document.getElementById("refresh-btn");
  var clearBtn = document.getElementById("clear-btn");

  function isLoggedIn() {
    return sessionStorage.getItem(SESSION_KEY) === ADMIN.email;
  }

  function showLogin() {
    loginView.hidden = false;
    dashboardView.hidden = true;
  }

  function showDashboard() {
    loginView.hidden = true;
    dashboardView.hidden = false;
    renderLeads();
  }

  function getLeads() {
    try {
      return JSON.parse(localStorage.getItem(LEADS_KEY) || "[]");
    } catch (err) {
      return [];
    }
  }

  function formatDate(iso) {
    try {
      return new Date(iso).toLocaleString("ru-RU", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (err) {
      return iso;
    }
  }

  function renderLeads() {
    var leads = getLeads();
    if (!leads.length) {
      leadsBody.innerHTML = '<tr><td colspan="5">Заявок пока нет.</td></tr>';
      return;
    }

    leadsBody.innerHTML = leads
      .map(function (lead) {
        return (
          "<tr>" +
          "<td>" +
          formatDate(lead.createdAt) +
          "</td>" +
          "<td>" +
          escapeHtml(lead.name) +
          "</td>" +
          "<td>" +
          escapeHtml(lead.contact) +
          "</td>" +
          "<td>" +
          escapeHtml(lead.format) +
          "</td>" +
          "<td>" +
          escapeHtml(lead.source || "Сайт") +
          "</td>" +
          "</tr>"
        );
      })
      .join("");
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  loginForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var data = new FormData(loginForm);
    var email = String(data.get("email") || "")
      .trim()
      .toLowerCase();
    var password = String(data.get("password") || "");

    if (email === ADMIN.email && password === ADMIN.password) {
      sessionStorage.setItem(SESSION_KEY, ADMIN.email);
      loginError.hidden = true;
      showDashboard();
      return;
    }

    loginError.hidden = false;
    loginError.textContent = "Неверный логин или пароль.";
  });

  logoutBtn.addEventListener("click", function () {
    sessionStorage.removeItem(SESSION_KEY);
    loginForm.reset();
    showLogin();
  });

  refreshBtn.addEventListener("click", renderLeads);

  clearBtn.addEventListener("click", function () {
    if (!confirm("Удалить все заявки из этого браузера?")) return;
    localStorage.removeItem(LEADS_KEY);
    renderLeads();
  });

  if (isLoggedIn()) {
    showDashboard();
  } else {
    showLogin();
  }
})();
