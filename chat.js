(function () {
  var LEADS_KEY = "fohow_leads";

  var toggle = document.getElementById("bot-toggle");
  var panel = document.getElementById("bot-panel");
  var closeBtn = document.getElementById("bot-close");
  var messages = document.getElementById("bot-messages");
  var form = document.getElementById("bot-form");
  var input = document.getElementById("bot-input");

  if (!toggle || !panel || !form || !messages || !input) return;

  var state = {
    step: "name",
    name: "",
    phone: "",
  };

  function openChat() {
    panel.hidden = false;
    toggle.setAttribute("aria-expanded", "true");
    toggle.classList.add("is-open");
    if (!messages.dataset.started) {
      messages.dataset.started = "1";
      addBot(
        "Здравствуйте! Я помощник Валентины по FOHOW. Чтобы начать, напишите, пожалуйста, ваше имя."
      );
    }
    input.focus();
  }

  function closeChat() {
    panel.hidden = true;
    toggle.setAttribute("aria-expanded", "false");
    toggle.classList.remove("is-open");
  }

  function addBot(text) {
    var bubble = document.createElement("div");
    bubble.className = "bot-msg bot-msg-bot";
    bubble.textContent = text;
    messages.appendChild(bubble);
    messages.scrollTop = messages.scrollHeight;
  }

  function addUser(text) {
    var bubble = document.createElement("div");
    bubble.className = "bot-msg bot-msg-user";
    bubble.textContent = text;
    messages.appendChild(bubble);
    messages.scrollTop = messages.scrollHeight;
  }

  function saveLead(source) {
    var leads = [];
    try {
      leads = JSON.parse(localStorage.getItem(LEADS_KEY) || "[]");
    } catch (err) {
      leads = [];
    }
    leads.unshift({
      id: Date.now(),
      name: state.name,
      contact: state.phone,
      format: "Через чат-бота",
      source: source || "Чат-бот",
      createdAt: new Date().toISOString(),
    });
    localStorage.setItem(LEADS_KEY, JSON.stringify(leads));
  }

  function answerQuestion(text) {
    var q = text.toLowerCase();

    if (/консульт|запис|встреч|созвон|связ/.test(q)) {
      saveLead("Чат-бот · запись");
      return (
        state.name +
        ", отлично! Я передала заявку Валентине. Она свяжется с вами по номеру " +
        state.phone +
        ". Также можно сразу перейти к форме на сайте или написать/позвонить: 8 (913) 893-20-88."
      );
    }

    if (/сетев|млм|пирамид/.test(q)) {
      return "Да, FOHOW работает по партнёрской модели сетевого маркетинга. Валентина открыто рассказывает об этом на консультации — без давления и обещаний лёгкого заработка.";
    }

    if (/стоим|цен|сколько.*(стоит|влож|нужн)|пакет|solo|plus|vip|старт/.test(q)) {
      return "Есть несколько вариантов старта: SOLO (~43 845 ₽), PLUS (~87 690 ₽) и VIP (~249 750 ₽). Точную сумму и состав набора лучше разобрать на консультации — курс и условия нужно подтверждать.";
    }

    if (/заработ|доход|деньг|прибыл/.test(q)) {
      return "Единой суммы заработка нет. Вознаграждения зависят от выполнения условий маркетинг-плана. Валентина не обещает конкретный доход — на встрече покажет, как устроены этапы и расчёты.";
    }

    if (/найм|работ|совмещ|увольн/.test(q)) {
      return "Да, FOHOW можно совмещать с основной работой. Валентина как раз рекомендует начинать постепенно, без резкого увольнения.";
    }

    if (/продук|товар|оборуд|эликс|здоров/.test(q)) {
      return "В ассортименте FOHOW — wellness-продукция, уход, товары для дома и оборудование. Валентина сама работает с продукцией и была на заводе и в НИИ компании в Китае — может показать и рассказать подробнее.";
    }

    if (/кита|чжух|завод|институт/.test(q)) {
      return "Валентина лично ездила в Китай: посетила завод FOHOW в Чжухае и научно-исследовательский институт. Это помогает ей рассказывать о компании не только по презентациям.";
    }

    if (/адрес|где|новосибир|связ/.test(q)) {
      return "Валентина принимает в Новосибирске по адресу: ул. Связистов, 17. Консультации бывают и онлайн.";
    }

    if (/телефон|номер|связ|whatsapp|телеграм/.test(q)) {
      return "Телефон Валентины: 8 (913) 893-20-88. Могу также оформить заявку на консультацию прямо здесь — напишите «записаться».";
    }

    if (/привет|здравств|добр/.test(q)) {
      return "Здравствуйте, " + state.name + "! Спрашивайте про FOHOW, продукцию, старт или запись на консультацию.";
    }

    return (
      "Я могу рассказать про FOHOW, варианты старта, продукцию, совмещение с работой и запись к Валентине. " +
      "Напишите вопрос или слово «записаться», чтобы оставить заявку на консультацию."
    );
  }

  toggle.addEventListener("click", function () {
    if (panel.hidden) openChat();
    else closeChat();
  });

  closeBtn.addEventListener("click", closeChat);

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    var text = input.value.trim();
    if (!text) return;

    addUser(text);
    input.value = "";

    if (state.step === "name") {
      state.name = text;
      state.step = "phone";
      addBot("Приятно познакомиться, " + state.name + "! Теперь укажите номер телефона для связи.");
      return;
    }

    if (state.step === "phone") {
      state.phone = text;
      state.step = "chat";
      saveLead("Чат-бот · контакты");
      addBot(
        "Спасибо! Контакты сохранены. Задавайте вопросы о FOHOW или напишите «записаться», если хотите консультацию с Валентиной."
      );
      return;
    }

    addBot(answerQuestion(text));
  });
})();
