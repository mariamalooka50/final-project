async function load(url, target) {
  const html = await fetch(url).then((r) => r.text());
  document.getElementById(target).innerHTML += html;
}

const loadAll = async () => {
  await Promise.all([
    load("/html-parts/menu-partial.html", "main-content"),
    load("/html-parts/sticky-wall.partial.html", "main-content"),
  ]);
  await import("/js-parts/logic.js");
};

loadAll();
