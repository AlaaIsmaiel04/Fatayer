const people = [
  "علاء",
  "ليث",
  "الليث",
  "اسماعيل",
  "بدر",
  "محمد",
  "رامي",
  "اياد",
  "علي",
  "حسان",
  "يوسف",
  "رعد",
  "رنا",
  "مايا الحموي",
  "مايا ياغي",
  "يمار",
  "تيماء",
  "نور",
  "بشرى",
  "الاستاذ محمد فطوم",
  " الاستاذ محمد قاسم eng ",
  " الاستاذ محمد قاسم prog",
  "الاستاذ نوار حيصو ",
  "اللي بيشنغلو"
];
people.sort();
const rows = [
  ["لبنة", 6000, "فطاير"],
  ["جبنه", 6000, "فطاير"],
  ["جبنه وخضار", 7000, "فطاير"],
  ["محمره", 5000, "فطاير"],
  ["زعتر", 5000, "فطاير"],
  ["زعتر وخضار", 6000, "فطاير"],
  ["محمره وقشقوان", 8000, "فطاير"],
  ["زعتر وقشقوان", 8000, "فطاير"],
  ["ببيروني وقشقوان", 10000, "فطاير"],
  ["ببيروني وزيتون وفطر", 8000, "فطاير"],
  ["ببيروني وزيتون وقشقوان وفطر", 11000, "فطاير"],
  ["بيتزا ببيروني صغير", 12000, "بيتزا"],
  ["بيتزا ببيروني وسط", 45000, "بيتزا"],
  ["بيتزا ببيروني عائلي", 65000, "بيتزا"],
  ["بيتزا ١", 10000, "بيتزا"],
  ["بيتزا ٢", 15000, "بيتزا"],
  ["بيتزا ٣", 25000, "بيتزا"],
  ["بيتزا ٤", 32000, "بيتزا"],
  ["بيتزا ٥", 37000, "بيتزا"],
  ["بيتزا ٦", 45000, "بيتزا"],
  ["بيتزا ٧", 65000, "بيتزا"],
  ["سنفوره", 9000, "فطاير"],
  ["قشقوان", 8000, "فطاير"],
  ["مرتديلا وقشوان", 9000, "فطاير"],
  ["قشقوان وزيتون وفطر", 9000, "فطاير"],
  ["سجق", 11000, "فطاير"],
  ["توشكا", 14000, "فطاير"],
  ["فاهيتا", 13000, "فطاير"],
  ["منقوشه لحمه", 11000, "فطاير"],
  ["زيتون", 5000, "فطاير"],
  ["كيري", 6000, "فطاير"],
  ["كشك", 7000, "فطاير"],
  ["شوكلا", 8000, "فطاير"],
  ["منقوشه شوكلا وموز", 10000, "فطاير"],
  ["قريشه", 6000, "فطاير"],
  ["قشطه وعسل", 9000, "فطاير"],
  ["معجوقه غنم", 25000, "فطاير"],
  ["صفيحه غنم", 250000, "فطاير"],
  ["صفيحه بعلبكيه", 260000, "فطاير"],
  ["كاليزوني", 23000, "فطاير"],
].map((x, i) => ({ id: i, name: x[0], price: x[1], category: x[2] }));
const key = "fatayer-orders-v1";
const paidKey = "fatayer-paid-v1";

let orders = JSON.parse(localStorage.getItem(key) || "{}");
let paid = JSON.parse(localStorage.getItem(paidKey) || "{}"); // { personIndex: true }
let search = "",
  category = "الكل";

const money = (n) =>
  new Intl.NumberFormat("ar-SY").format(Math.round(n)) + " ل.س";
const get = (id) => rows.find((x) => x.id == id),
  save = () => {
    localStorage.setItem(key, JSON.stringify(orders));
    localStorage.setItem(paidKey, JSON.stringify(paid));
  };
const totalFor = (id) =>
  Object.entries(orders[id] || {}).reduce(
    (s, [item, q]) => s + (get(item)?.price || 0) * q,
    0,
  );

function toast(text) {
  const el = document.querySelector("#toast");
  el.textContent = text;
  el.classList.add("show");
  setTimeout(() => el.classList.remove("show"), 2200);
}

function renderFilters() {
  document.querySelector("#filters").innerHTML = ["الكل", "فطاير", "بيتزا"]
    .map(
      (x) =>
        `<button class="filter ${category === x ? "active" : ""}" data-cat="${x}">${x}</button>`,
    )
    .join("");
  document.querySelectorAll("[data-cat]").forEach(
    (b) =>
      (b.onclick = () => {
        category = b.dataset.cat;
        render();
      }),
  );
}

function renderMenu() {
  document.querySelector("#menuCount").textContent = `${rows.length} صنف متاح`;
  document.querySelector("#menuList").innerHTML = rows
    .map(
      (x) =>
        `<div class="menu-item"><span>${x.name}</span><b>${money(x.price)}</b></div>`,
    )
    .join("");
}

function add(id, item) {
  orders[id] ??= {};
  orders[id][item] = (orders[id][item] || 0) + 1;
  save();
  render();
}

function change(id, item, delta) {
  orders[id][item] = (orders[id][item] || 0) + delta;
  if (orders[id][item] <= 0) delete orders[id][item];
  save();
  render();
}

function togglePaid(index) {
  paid[index] = !paid[index];
  if (!paid[index]) delete paid[index];
  save();
  render();
}

function renderPeople() {
  const list = document.querySelector("#peopleList"),
    visible = people
      .map((name, i) => ({ name, id: i }))
      .filter(
        (x) =>
          x.name.includes(search) &&
          (!category ||
            category === "الكل" ||
            Object.keys(orders[x.id] || {}).some(
              (id) => get(id)?.category === category,
            )),
      );
  if (!visible.length) {
    list.innerHTML = '<div class="empty">ما لقينا اسم بهذا البحث</div>';
    return;
  }
  list.innerHTML = visible
    .map((p) => {
      const selected = Object.entries(orders[p.id] || {}).filter(
        ([, q]) => q > 0,
      );
      const opts = rows
        .filter((x) => category === "الكل" || x.category === category)
        .map(
          (x) =>
            `<option value="${x.id}">${x.name} — ${money(x.price)}</option>`,
        )
        .join("");
      return `<article class="person"><div class="person-top"><div><span class="avatar">${p.name[0]}</span><span class="person-name">${p.name}</span><div class="person-total">${selected.length ? money(totalFor(p.id)) + " • " + Object.values(orders[p.id]).reduce((a, b) => a + b, 0) + " أصناف" : "لم يختَر بعد"}</div></div></div><div class="add-row"><select id="select-${p.id}"><option value="">اختاروا صنفاً لإضافته</option>${opts}</select><button class="add-btn" data-add="${p.id}">+ إضافة</button></div><div class="chips">${selected
        .map(([item, q]) => {
          const x = get(item);
          return `<div class="chip"><span>${x.name}</span><div class="qty"><button data-change="${p.id},${item},-1">−</button><b>${q}</b><button data-change="${p.id},${item},1">+</button></div><button class="remove" data-change="${p.id},${item},-${q}">حذف</button></div>`;
        })
        .join("")}</div></article>`;
    })
    .join("");
  document.querySelectorAll("[data-add]").forEach(
    (b) =>
      (b.onclick = () => {
        const select = document.querySelector("#select-" + b.dataset.add);
        if (!select.value) return toast("اختاروا صنفاً أولاً");
        add(b.dataset.add, select.value);
        toast("تمت إضافة الصنف");
      }),
  );
  document.querySelectorAll("[data-change]").forEach(
    (b) =>
      (b.onclick = () => {
        const [id, item, delta] = b.dataset.change.split(",").map(Number);
        change(id, item, delta);
      }),
  );
}

function renderPaidSummary() {
  const container = document.querySelector("#paidList");
  if (!container) return;
  // show all people who have orders or are marked paid
  const activePaid = people
    .map((name, i) => ({
      name,
      i,
      hasOrder: Object.keys(orders[i] || {}).length > 0,
    }))
    .filter((p) => p.hasOrder || paid[p.i]);
  container.innerHTML = activePaid
    .map((p) => {
      const checked = paid[p.i] ? "checked" : "";
      return `<div class="paid-chip"><input type="checkbox" id="paid-${p.i}" ${checked} data-idx="${p.i}" /><label for="paid-${p.i}">${p.name}</label></div>`;
    })
    .join("");
  // attach events
  container.querySelectorAll('input[type="checkbox"]').forEach((cb) => {
    cb.onchange = (e) => {
      const idx = parseInt(e.target.dataset.idx);
      togglePaid(idx);
    };
  });
  // counts
  const paidCount = Object.keys(paid).filter((k) => paid[k] === true).length;
  document.querySelector("#paidCount").textContent = `${paidCount} شخص`;
  // totals
  let totalFull = 0;
  const totalPerPerson = people.map((_, i) => totalFor(i));
  totalFull = totalPerPerson.reduce((a, b) => a + b, 0);
  let totalAfterPaid = 0;
  people.forEach((_, i) => {
    if (!paid[i]) totalAfterPaid += totalFor(i);
  });
  document.querySelector("#totalFull").textContent = money(totalFull);
  document.querySelector("#totalAdjusted").textContent = money(totalAfterPaid);
}

function renderFooter() {
  const container = document.querySelector("#footerList");
  if (!container) return;

  const hasOrders = people.some(
    (_, i) => Object.keys(orders[i] || {}).length > 0,
  );
  if (!hasOrders) {
    container.innerHTML =
      '<div class="footer-empty">لا يوجد طلبات حتى الآن</div>';
    return;
  }

  container.innerHTML = people
    .map((name, i) => {
      const orderItems = Object.entries(orders[i] || {});
      if (orderItems.length === 0) return null;
      const itemsText = orderItems
        .map(([id, qty]) => `${get(parseInt(id))?.name} × ${qty}`)
        .join("، ");
      const total = totalFor(i);
      const paidMark = paid[i] ? "✅" : "";
      return `<div class="footer-person">
        <div>
          <div class="name">${name} <span class="paid-badge">${paidMark}</span></div>
          <div class="items">${itemsText}</div>
        </div>
        <div class="amount">${money(total)}</div>
      </div>`;
    })
    .filter(Boolean)
    .join("");
}

function render() {
  renderFilters();
  renderPeople();
  renderMenu();
  renderFooter();
  let active = people.filter((_, i) => Object.keys(orders[i] || {}).length);
  let count = people.reduce(
      (s, _, i) =>
        s + Object.values(orders[i] || {}).reduce((a, b) => a + b, 0),
      0,
    ),
    total = people.reduce((s, _, i) => s + totalFor(i), 0);
  document.querySelector("#itemCount").textContent = count;
  document.querySelector("#summaryItems").textContent = count;
  document.querySelector("#peopleProgress").textContent =
    `${active.length} / ${people.length}`;
  document.querySelector("#activePeople").textContent =
    `${active.length} / ${people.length}`;
  document.querySelector("#total").textContent = money(total);
  document.querySelector("#average").textContent = money(
    active.length ? total / active.length : 0,
  );
  renderPaidSummary();
}

function fullSummary() {
  let lines = ["طلب فطاير الأصدقاء", "────────────────"];
  people.forEach((name, i) => {
    const items = Object.entries(orders[i] || {})
      .map(([id, q]) => `${get(id)?.name} × ${q}`)
      .join("، ");
    if (items) {
      const paidMark = paid[i] ? "✅" : "❌";
      lines.push(`${name} ${paidMark}: ${items} — ${money(totalFor(i))}`);
    }
  });
  const totalFull = people.reduce((s, _, i) => s + totalFor(i), 0);
  const totalAdjusted = people.reduce(
    (s, _, i) => (paid[i] ? s : s + totalFor(i)),
    0,
  );
  lines.push("────────────────");
  lines.push(`المجموع الكلي: ${money(totalFull)}`);
  lines.push(`المجموع بعد الدفع: ${money(totalAdjusted)}`);
  return lines.join("\n");
}

function itemsOnlySummary() {
  // Collect all items with quantities across all people
  const allItems = {};
  people.forEach((_, i) => {
    Object.entries(orders[i] || {}).forEach(([itemId, qty]) => {
      const item = get(parseInt(itemId));
      if (item) {
        allItems[item.name] = (allItems[item.name] || 0) + qty;
      }
    });
  });
  const lines = ["الأصناف المطلوبة", "────────────────"];
  Object.entries(allItems)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .forEach(([name, qty]) => {
      lines.push(`${name} × ${qty}`);
    });
  const totalItems = Object.values(allItems).reduce((a, b) => a + b, 0);
  lines.push("────────────────");
  lines.push(`مجموع الأصناف: ${totalItems}`);
  return lines.join("\n");
}

document.querySelector("#searchInput").oninput = (e) => {
  search = e.target.value.trim();
  renderPeople();
};
document.querySelector("#resetBtn").onclick = () => {
  if (confirm("هل تريدون مسح كل الطلبات؟")) {
    orders = {};
    paid = {};
    save();
    render();
    toast("تم تصفير الطلب والدفع");
  }
};
document.querySelector("#copyBtn").onclick = async () => {
  if (!Object.keys(orders).length)
    return toast("أضيفوا صنفاً واحداً على الأقل");
  await navigator.clipboard.writeText(fullSummary());
  toast("تم نسخ الملخص الكامل");
};
document.querySelector("#copyItemsBtn").onclick = async () => {
  if (!Object.keys(orders).length)
    return toast("أضيفوا صنفاً واحداً على الأقل");
  await navigator.clipboard.writeText(itemsOnlySummary());
  toast("تم نسخ الأصناف فقط");
};
render();
