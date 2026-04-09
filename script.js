const DATA = {
  caseNumber: "001",
  officer: { last: "Эскеров", first: "Усман", middle: "Халилович" },
  bride:   { last: "Садовская", first: "Дарья", middle: "Сергеевна" },

  weddingDate: "14 АВГУСТА 2026 Г.",
  venueName: "РЕСТОРАН-ШАТЕР «ВЕРСАЛЬ»",

  schedule: [
    { time: "12:30", text: "Сбор понятых" },
    { time: "13:00", text: "Процедура условно-добровольного освобождения задержанной (выкуп) по адресу: г. Канаш, ул. Садовая д.25" },
    { time: "15:00", text: "Подтверждение задержания и обмен вещественными доказательствами — кольца, 2 шт." },
    { time: "16:00", text: "Банкет в честь успешного завершения операции, далее — свободные манёвры до полной капитуляции усталости." },
  ],

  palette: ["#633F33"],

  rules: [
    "Понятым рекомендуется прибыть вовремя, в установленном дресс-кодом виде и в полной готовности к активному участию в праздничных процессуальных действиях.",
    "В целях архивирования материалов дела участникам предписывается содействовать фото- и видеосъемке на протяжении всего мероприятия."
  ],

  rsvpDeadline: "30 ИЮЛЯ 2026 Г.",
  rsvpNote:
    "Настоящим подтверждается готовность лично присутствовать при приведении приговора в исполнение и разделить один из важнейших моментов в жизни сторон. Неявка рассматривается как уклонение от участия в историческом событии.",

  // ============================================
  // НАСТРОЙКА GOOGLE FORM
  // ============================================
  // Подробная инструкция в файле: ИНСТРУКЦИЯ_GOOGLE_FORM.md
  //
  // 1. Создай форму в Google Forms с 3 полями:
  //    - ФИО ПОНЯТОГО (короткий ответ)
  //    - АЛКОГОЛЬ (короткий ответ)
  //    - КОММЕНТАРИЙ (абзац)
  //
  // 2. Получи Entry IDs полей (см. инструкцию)
  //
  // 3. Заполни данные ниже:
  
  googleFormUrl: "https://docs.google.com/forms/d/e/1FAIpQLSe-wPMfbVJYqQcbSrdAGeYzJnSG72NL7DFXAi0XHl0tyvCNrg/viewform",
  
  googleFormEntries: {
    fio: "entry.1529995614",     // Entry ID для поля "ФИО ПОНЯТОГО"
    alc: "entry.1005664008",     // Entry ID для поля "АЛКОГОЛЬ"
    comment: "entry.291616257"   // Entry ID для поля "КОММЕНТАРИЙ"
  }
};

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value ?? "";
}

// заполнение
setText("caseNumber", (DATA.caseNumber || "").toUpperCase());
setText("officerLast", (DATA.officer.last || "").toUpperCase());
setText("officerFirst", (DATA.officer.first || "").toUpperCase());
setText("officerMiddle", (DATA.officer.middle || "").toUpperCase());
setText("brideLast", (DATA.bride.last || "").toUpperCase());
setText("brideFirst", (DATA.bride.first || "").toUpperCase());
setText("brideMiddle", (DATA.bride.middle || "").toUpperCase());

setText("weddingDate", (DATA.weddingDate || "").toUpperCase());
setText("venueName", (DATA.venueName || "").toUpperCase());
setText("rsvpDeadline", (DATA.rsvpDeadline || "").toUpperCase());
setText("rsvpNote", DATA.rsvpNote);

setText("rule1", DATA.rules?.[0] || "");
setText("rule2", DATA.rules?.[1] || "");

// программа
const schedule = document.getElementById("schedule");
if (schedule) {
  schedule.innerHTML = "";
  DATA.schedule.forEach(item => {
    const row = document.createElement("div");
    row.className = "row anim";
    row.innerHTML = `<div class="time">${item.time}</div><div class="task">${item.text}</div>`;
    schedule.appendChild(row);
  });
}

// палитра
const pal = document.getElementById("palette");
if (pal) {
  pal.innerHTML = "";
  DATA.palette.forEach(c => {
    const b = document.createElement("div");
    b.style.flex = "1";
    b.style.background = c;
    pal.appendChild(b);
  });
}

// Google Form link
const formLink = document.getElementById("googleFormLink");
if (formLink) {
  if (DATA.googleFormUrl) {
    formLink.href = DATA.googleFormUrl;
  } else {
    formLink.addEventListener("click", (e) => {
      e.preventDefault();
      alert("Сначала вставь ссылку на Google Form в script.js → DATA.googleFormUrl");
    });
  }
}

function enforceAlcoholRules(scope = document) {
  const groups = scope.querySelectorAll(".alc-grid");
  groups.forEach((group) => {
    const checkboxes = Array.from(group.querySelectorAll('input[type="checkbox"]'));
    checkboxes.forEach((cb) => {
      if (cb.dataset.alcBound === "1") return;
      cb.dataset.alcBound = "1";
      cb.addEventListener("change", () => {
        const isNoDrink = cb.value === "Без алкоголя";
        if (isNoDrink && cb.checked) {
          checkboxes.forEach((other) => {
            if (other !== cb) other.checked = false;
          });
        } else if (!isNoDrink && cb.checked) {
          const noDrink = checkboxes.find((x) => x.value === "Без алкоголя");
          if (noDrink) noDrink.checked = false;
        }
      });
    });
  });
}

function renderCompanionsRows(count) {
  const section = document.getElementById("companionsSection");
  const host = document.getElementById("companionsList");
  if (!section || !host) return;

  const safeCount = Math.max(0, Math.min(5, Number(count) || 0));
  section.style.display = safeCount > 0 ? "" : "none";

  const prevState = [];
  host.querySelectorAll('[data-companion-row="1"]').forEach((row, i) => {
    const fioInput = row.querySelector('input[type="text"]');
    const alcoholValues = Array.from(
      row.querySelectorAll('.alc-grid input[type="checkbox"]:checked')
    ).map((el) => el.value);
    prevState[i] = {
      fio: fioInput?.value || "",
      alc: alcoholValues,
    };
  });

  host.innerHTML = "";

  for (let i = 0; i < safeCount; i++) {
    const row = document.createElement("div");
    row.className = "proto-field companion-row";
    row.setAttribute("data-companion-row", "1");
    row.innerHTML = `
      <input class="proto-input" type="text" name="companionFio_${i}" placeholder="ФИО понятого №${i + 1}" required>
      <div class="alc-grid" style="margin-top:8px;">
        <label class="pill"><input type="checkbox" name="companionAlc_${i}" value="Вино"><span>Вино</span></label>
        <label class="pill"><input type="checkbox" name="companionAlc_${i}" value="Шампанское"><span>Шампанское</span></label>
        <label class="pill"><input type="checkbox" name="companionAlc_${i}" value="Крепкое"><span>Крепкое</span></label>
        <label class="pill"><input type="checkbox" name="companionAlc_${i}" value="Без алкоголя"><span>Без алкоголя</span></label>
      </div>
    `;
    const saved = prevState[i];
    if (saved) {
      const fioInput = row.querySelector(`input[name="companionFio_${i}"]`);
      if (fioInput) fioInput.value = saved.fio || "";
      const alcInputs = row.querySelectorAll(`input[name="companionAlc_${i}"]`);
      alcInputs.forEach((input) => {
        input.checked = saved.alc?.includes(input.value) || false;
      });
    }
    host.appendChild(row);
  }

  enforceAlcoholRules(section);
}

const companionsCountInput = document.getElementById("companionsCount");
companionsCountInput?.addEventListener("input", (e) => {
  const value = Math.max(0, Math.min(5, Number(e.target.value) || 0));
  e.target.value = String(value);
  renderCompanionsRows(value);
});
if (companionsCountInput) {
  renderCompanionsRows(companionsCountInput.value);
}
enforceAlcoholRules(document);

function validateAlcoholSelection(values) {
  if (!values || values.length === 0) {
    return "Выберите вариант алкоголя.";
  }
  if (values.includes("Без алкоголя") && values.length > 1) {
    return "Нельзя выбрать одновременно «Без алкоголя» и алкоголь.";
  }
  return "";
}

const cancelSubmitBtn = document.getElementById("cancelSubmitBtn");
let pendingSubmitState = null;

function submitWithBeaconOrKeepalive(requestData) {
  if (!requestData?.submitUrl || !requestData?.params) return false;
  const body = requestData.params.toString();

  if (navigator.sendBeacon) {
    const blob = new Blob([body], {
      type: "application/x-www-form-urlencoded;charset=UTF-8",
    });
    return navigator.sendBeacon(requestData.submitUrl, blob);
  }

  fetch(requestData.submitUrl, {
    method: "POST",
    mode: "no-cors",
    keepalive: true,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  }).catch(() => {});
  return true;
}

function submitBatchWithBeaconOrKeepalive(requestDataList) {
  if (!Array.isArray(requestDataList) || requestDataList.length === 0) return false;
  let sentAny = false;
  requestDataList.forEach((requestData) => {
    const sent = submitWithBeaconOrKeepalive(requestData);
    sentAny = sentAny || sent;
  });
  return sentAny;
}

function resetPendingSubmitUi(submitBtn, originalText) {
  if (pendingSubmitState?.countdownTimer) {
    clearInterval(pendingSubmitState.countdownTimer);
  }
  pendingSubmitState = null;
  if (submitBtn) {
    submitBtn.disabled = false;
    submitBtn.textContent = originalText;
  }
  if (cancelSubmitBtn) {
    cancelSubmitBtn.style.display = "none";
    cancelSubmitBtn.textContent = "ОТМЕНИТЬ ОТПРАВКУ";
  }
}

function waitWithUndo(seconds, submitBtn, originalText, requestDataList) {
  return new Promise((resolve, reject) => {
    if (!cancelSubmitBtn) {
      resolve();
      return;
    }

    let timeLeft = seconds;
    cancelSubmitBtn.style.display = "";
    cancelSubmitBtn.textContent = `ОТМЕНИТЬ ОТПРАВКУ (${timeLeft})`;
    if (submitBtn) {
      submitBtn.textContent = `ОТПРАВКА ЧЕРЕЗ ${timeLeft}...`;
    }

    const countdownTimer = setInterval(() => {
      timeLeft -= 1;
      if (timeLeft <= 0) {
        clearInterval(countdownTimer);
        resolve();
        return;
      }
      cancelSubmitBtn.textContent = `ОТМЕНИТЬ ОТПРАВКУ (${timeLeft})`;
      if (submitBtn) {
        submitBtn.textContent = `ОТПРАВКА ЧЕРЕЗ ${timeLeft}...`;
      }
    }, 1000);

    pendingSubmitState = { countdownTimer, requestDataList, sentOnLeave: false };
    cancelSubmitBtn.onclick = () => {
      clearInterval(countdownTimer);
      reject(new Error("Отправка отменена пользователем."));
    };
  });
}

window.addEventListener("pagehide", () => {
  if (!pendingSubmitState || pendingSubmitState.sentOnLeave) return;
  const sent = submitBatchWithBeaconOrKeepalive(pendingSubmitState.requestDataList);
  if (sent) {
    pendingSubmitState.sentOnLeave = true;
  }
});

// Анимации: с защитой от дрожания через буферную зону и debounce
const appearEls = document.querySelectorAll(".anim, .anim-x");
let visibilityStates = new Map(); // храним состояние видимости для debounce

const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    const wasVisible = visibilityStates.get(e.target) || false;
    const isNowVisible = e.isIntersecting;
    
    // Обновляем состояние только если оно действительно изменилось
    if (isNowVisible !== wasVisible) {
      visibilityStates.set(e.target, isNowVisible);
      
      if (isNowVisible) {
        e.target.classList.add("is-visible");
      } else {
        e.target.classList.remove("is-visible");
      }
    }
  });
}, { 
  threshold: 0.2, // порог видимости
  rootMargin: '-30px 0px -30px 0px' // буферная зона для стабильности (уменьшает дрожание)
});

appearEls.forEach(el => {
  io.observe(el);
  visibilityStates.set(el, false);
});

// Кнопка “Открыть”
document.getElementById("openBtn")?.addEventListener("click", () => {
  window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
});

// Музыка
const audio = document.getElementById("bgAudio");
const playBtn = document.getElementById("playBtn");
playBtn?.addEventListener("click", async () => {
  try {
    if (!audio) return;
    if (audio.paused) {
      await audio.play();
      playBtn.textContent = "❚❚";
    } else {
      audio.pause();
      playBtn.textContent = "▶";
    }
  } catch (err) {
    console.log(err);
  }
});

// Функция для извлечения FORM_ID из URL Google Form
function extractFormId(url) {
  if (!url) return null;
  const match = url.match(/\/forms\/d\/(?:e\/)?([a-zA-Z0-9_-]+)/);
  return match ? match[1] : null;
}

function normalizeEntryId(value) {
  const raw = (value || "").toString().trim();
  if (!raw) return "";
  if (/^entry\.\d+$/.test(raw)) return raw;
  if (/^\d+$/.test(raw)) return `entry.${raw}`;
  return raw;
}

// Функция для автоматического получения Entry IDs из формы (для отладки)
// Откройте форму в браузере, откройте консоль (F12) и выполните эту функцию
function getEntryIdsFromForm() {
  const inputs = document.querySelectorAll('input[name^="entry."], textarea[name^="entry."]');
  const entryIds = {};
  inputs.forEach((input, index) => {
    const fieldName = input.closest('.Qr7Oae')?.querySelector('.M7eMe')?.textContent || `Поле ${index + 1}`;
    entryIds[input.name] = fieldName;
    console.log(`${input.name} - ${fieldName}`);
  });
  return entryIds;
}

function submitViaHiddenForm(submitUrl, params) {
  return new Promise((resolve, reject) => {
    try {
      const iframeName = `gf_iframe_${Date.now()}`;
      const iframe = document.createElement("iframe");
      iframe.name = iframeName;
      iframe.style.display = "none";
      document.body.appendChild(iframe);

      const form = document.createElement("form");
      form.method = "POST";
      form.action = submitUrl;
      form.target = iframeName;
      form.style.display = "none";

      params.forEach((value, key) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = value;
        form.appendChild(input);
      });

      document.body.appendChild(form);

      // На некоторых устройствах onload может не сработать; добавляем таймаут-резолв.
      let done = false;
      const cleanup = () => {
        form.remove();
        iframe.remove();
      };

      const finish = (fn) => {
        if (done) return;
        done = true;
        cleanup();
        fn();
      };

      iframe.onload = () => finish(resolve);
      form.submit();
      setTimeout(() => finish(resolve), 1200);
    } catch (err) {
      reject(err);
    }
  });
}

function buildGoogleFormRequest(formData) {
  const formId = extractFormId(DATA.googleFormUrl);
  if (!formId) {
    throw new Error("Не удалось извлечь ID формы из URL");
  }

  const entries = DATA.googleFormEntries;
  const fioEntry = normalizeEntryId(entries.fio);
  const alcEntry = normalizeEntryId(entries.alc);
  const commentEntry = normalizeEntryId(entries.comment);

  if (!fioEntry || !alcEntry || !commentEntry) {
    throw new Error("Не заполнены entry IDs полей в DATA.googleFormEntries");
  }
  if (![fioEntry, alcEntry, commentEntry].every((id) => /^entry\.\d+$/.test(id))) {
    throw new Error("Неверные настройки полей формы.");
  }

  // Формируем URL для отправки
  const submitUrl = `https://docs.google.com/forms/d/e/${formId}/formResponse`;
  
  // Формируем данные для отправки
  const params = new URLSearchParams();
  params.append(fioEntry, formData.fio);
  if (Array.isArray(formData.alc)) {
    if (formData.alc.length === 0) {
      params.append(alcEntry, "Не указано");
    } else {
      formData.alc.forEach((item) => params.append(alcEntry, item));
    }
  } else {
    params.append(alcEntry, formData.alc);
  }
  params.append(commentEntry, formData.comment);
  
  // Отладка: выводим URL и параметры
  console.log("URL отправки:", submitUrl);
  console.log("Параметры:", params.toString());
  
  return { submitUrl, params };
}

// Функция для отправки данных в Google Form
async function submitRequestData(requestData) {
  try {
    await submitViaHiddenForm(requestData.submitUrl, requestData.params);
    return true;
  } catch (hiddenFormError) {
    console.warn("Hidden form submit failed, fallback to fetch:", hiddenFormError);

    await fetch(requestData.submitUrl, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: requestData.params.toString(),
    });
    return true;
  }
}

async function submitToGoogleForm(formData, prebuiltRequestData = null) {
  const requestData = prebuiltRequestData || buildGoogleFormRequest(formData);
  return submitRequestData(requestData);
}

async function submitBatchToGoogleForm(requestDataList) {
  for (const requestData of requestDataList) {
    await submitRequestData(requestData);
  }
  return true;
}

// RSVP форма - отправка в Google Form
document.getElementById("rsvpForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.target;
  const submitBtn = form.querySelector('button[type="submit"]');
  const originalText = submitBtn?.textContent;
  
  // Блокируем повторную отправку
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = "ПОДГОТОВКА...";
  }

  const fd = new FormData(form);
  const fio = (fd.get("fio") || "").toString().trim();
  const alc = fd.getAll("alc");
  const companionsCount = Math.max(0, Math.min(5, Number(fd.get("companionsCount")) || 0));
  const comment = (fd.get("comment") || "").toString().trim();

  // Проверяем наличие настроек
  if (!DATA.googleFormUrl) {
    alert("Форма пока не настроена. Напиши мне, и я помогу быстро подключить.");
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
    return;
  }

  try {
    if (!fio) {
      throw new Error("Заполни ФИО понятого.");
    }

    const mainAlcoholError = validateAlcoholSelection(alc);
    if (mainAlcoholError) {
      throw new Error(mainAlcoholError);
    }

    const companions = [];
    for (let i = 0; i < companionsCount; i++) {
      const companionFio = (fd.get(`companionFio_${i}`) || "").toString().trim();
      const companionAlc = fd.getAll(`companionAlc_${i}`);

      if (!companionFio) {
        throw new Error(`Заполни ФИО для понятого №${i + 1}.`);
      }
      const companionAlcoholError = validateAlcoholSelection(companionAlc);
      if (companionAlcoholError) {
        throw new Error(`Понятой №${i + 1}: ${companionAlcoholError}`);
      }

      companions.push({
        fio: companionFio,
        alc: companionAlc
      });
    }

    const groupId = `G${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`.toUpperCase();
    const mainComment = [
      comment || "—",
      `Сопровождающих: ${companions.length}`
    ].join("\n");

    const requests = [];

    // Главная строка заявки
    requests.push(buildGoogleFormRequest({
      fio: fio,
      alc: alc,
      comment: mainComment
    }));

    // Отдельная строка на каждого сопровождающего
    companions.forEach((c, i) => {
      const companionComment = [
        `Сопровождающий для: ${fio}`
      ].join("\n");

      requests.push(buildGoogleFormRequest({
        fio: c.fio,
        alc: c.alc,
        comment: companionComment
      }));
    });

    // Отладка: выводим данные в консоль
    console.log("Отправка данных (пакет):", { groupId, rows: requests.length });
    console.log("Entry IDs:", DATA.googleFormEntries);

    // Небольшое окно для отмены случайной отправки
    await waitWithUndo(8, submitBtn, originalText, requests);
    if (!pendingSubmitState?.sentOnLeave) {
      await submitBatchToGoogleForm(requests);
    }

    // Показываем успешное сообщение
    const noteEl = document.getElementById("rsvpNote");
    if (noteEl) {
      noteEl.textContent = "✓ Данные успешно отправлены! Спасибо за подтверждение.";
      noteEl.style.color = "#4caf50";
    }
    
    // Очищаем форму
    form.reset();
    if (companionsCountInput) {
      companionsCountInput.value = "0";
      renderCompanionsRows(0);
    }
    
    // Через 3 секунды возвращаем обычный текст
    setTimeout(() => {
      if (noteEl) {
        noteEl.textContent = DATA.rsvpNote || "";
        noteEl.style.color = "";
      }
    }, 3000);

  } catch (error) {
    console.error("Ошибка отправки:", error);
    const noteEl = document.getElementById("rsvpNote");
    const isCancelled = error?.message === "Отправка отменена пользователем.";
    if (noteEl) {
      if (isCancelled) {
        noteEl.textContent = "Отправка отменена. Проверь данные и отправь еще раз, когда будешь готов(а).";
        noteEl.style.color = "#ff9800";
      } else {
        noteEl.textContent = `Ошибка: ${error.message}`;
        noteEl.style.color = "#f44336";
      }
    }
    if (!isCancelled) {
      alert(`Не удалось отправить: ${error.message}`);
    }
  } finally {
    resetPendingSubmitUi(submitBtn, originalText);
  }
});
function renderCellsFromHidden(id, minCells = 14) {
  const hidden = document.getElementById(id);
  if (!hidden) return;

  const text = (hidden.textContent || "").toUpperCase();
  const host = document.querySelector(`.cells[data-cells="${id}"]`);
  if (!host) return;

  host.innerHTML = "";

  const chars = [...text];
  const total = Math.max(minCells, chars.length);

  for (let i = 0; i < total; i++) {
    const ch = chars[i] || "";
    const cell = document.createElement("span");
    cell.className = "cell" + (ch === " " || ch === "" ? " cell--empty" : "");
    cell.textContent = ch === " " ? "" : ch;
    host.appendChild(cell);
  }
}

["officerLast","officerFirst","officerMiddle","brideLast","brideFirst","brideMiddle"].forEach(id => {
  renderCellsFromHidden(id, 14);
});
