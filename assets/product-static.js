if (window.lucide) {
  window.lucide.createIcons({ attrs: { width: 16, height: 16, "stroke-width": 2 } });
}

const menuToggle = document.getElementById("menuToggle");
const mobileMenu = document.getElementById("mobileMenu");

if (menuToggle && mobileMenu) {
  menuToggle.addEventListener("click", () => {
    const isOpen = mobileMenu.classList.toggle("is-open");
    document.body.classList.toggle("menu-open", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

const navItems = [...document.querySelectorAll(".nav-item")];
const megaMenuCloseTimers = new WeakMap();
const hasPreciseHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

navItems.forEach((item) => {
  const trigger = item.querySelector(".nav-trigger");
  if (!trigger) return;

  if (hasPreciseHover) {
    item.addEventListener("pointerenter", () => {
      window.clearTimeout(megaMenuCloseTimers.get(item));
      item.classList.add("is-hover-open");
    });

    item.addEventListener("pointerleave", () => {
      window.clearTimeout(megaMenuCloseTimers.get(item));
      const timer = window.setTimeout(() => item.classList.remove("is-hover-open"), 240);
      megaMenuCloseTimers.set(item, timer);
    });
  }

  trigger.addEventListener("click", () => {
    const wasOpen = item.classList.contains("is-open");
    navItems.forEach((openItem) => {
      openItem.classList.remove("is-open");
      openItem.querySelector(".nav-trigger")?.setAttribute("aria-expanded", "false");
    });
    item.classList.toggle("is-open", !wasOpen);
    trigger.setAttribute("aria-expanded", String(!wasOpen));
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  navItems.forEach((item) => {
    item.classList.remove("is-open", "is-hover-open");
    item.querySelector(".nav-trigger")?.setAttribute("aria-expanded", "false");
  });
  mobileMenu?.classList.remove("is-open");
  menuToggle?.setAttribute("aria-expanded", "false");
  document.body.classList.remove("menu-open");
});
