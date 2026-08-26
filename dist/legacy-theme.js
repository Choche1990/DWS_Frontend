(() => {
  const STYLE_ID = "digital-workspace-theme";
  const GANTT_DARK_CSS = `
    html { background:#0b1118!important; }
    body {
      background:#f4f6f8!important;
      filter:invert(0.92) hue-rotate(180deg) brightness(0.92) contrast(1.04);
    }
  `;
  const STANDARD_DARK_CSS = `
    :root, :host {
      --ibk-white:#17202b!important;--ibk-gray-05:#0f1720!important;
      --ibk-gray-15:#334155!important;--ibk-gray-30:#475569!important;
      --ibk-gray-50:#94a3b8!important;--ibk-gray-70:#cbd5e1!important;
      --ibk-gray-90:#e2e8f0!important;--ibk-black:#f1f5f9!important;
      --surface-primary:#17202b!important;--surface-secondary:#0f1720!important;
      --text-primary:#f1f5f9!important;--text-secondary:#aebdce!important;
      --border-default:#334155!important;--border-strong:#475569!important;
    }
    html,body{background:#0f1720!important;color:#f1f5f9!important}
    [style*="background:#fff"],[style*="background: #fff"],
    [style*="background:#FFFFFF"],[style*="background:var(--ibk-white)"]{background:#17202b!important}
    [style*="background:#F4F6F8"],[style*="background:#F2F2F2"],
    [style*="background:#F1F3F5"],[style*="background:var(--ibk-gray-05)"]{background:#0f1720!important}
    [style*="color:#1B2733"],[style*="color:#0A0A0A"],
    [style*="color:var(--ibk-black)"]{color:#f1f5f9!important}
    [style*="color:#6B7684"],[style*="color:#8A95A1"],
    [style*="color:var(--text-secondary)"]{color:#aebdce!important}
    input,select,textarea{background-color:#1e293b!important;color:#f1f5f9!important;border-color:#475569!important}
    table,th,td{border-color:#334155!important}
    .ib-th{background:#17202b!important;color:#aebdce!important}
    .ib-cell{color:#f1f5f9!important}.ib-cell:hover{background:#243244!important}
  `;
  let dark = false;
  let applying = false;

  function roots() {
    const found = [document];
    const visit = (root) => root.querySelectorAll("*").forEach((node) => {
      if (node.shadowRoot) {
        found.push(node.shadowRoot);
        visit(node.shadowRoot);
      }
    });
    visit(document);
    return found;
  }

  function apply() {
    if (applying) return;
    applying = true;
    roots().forEach((root) => {
      const current = root.getElementById?.(STYLE_ID);
      if (!dark) {
        current?.remove();
        return;
      }
      if (current) return;
      const style = document.createElement("style");
      style.id = STYLE_ID;
      style.textContent = location.pathname.toLowerCase().includes("/gantt/")
        ? GANTT_DARK_CSS
        : STANDARD_DARK_CSS;
      (root.head || root).appendChild(style);
    });
    applying = false;
  }

  addEventListener("message", (event) => {
    if (event.origin !== location.origin || event.data?.type !== "digital-workspace-theme") return;
    dark = event.data.theme === "dark";
    document.documentElement.classList.toggle("dw-dark", dark);
    apply();
  });

  try {
    dark = window.parent !== window && window.parent.document.documentElement.classList.contains("dark");
  } catch {
    dark = false;
  }
  document.documentElement.classList.toggle("dw-dark", dark);
  apply();

  new MutationObserver(() => dark && apply()).observe(document, { childList: true, subtree: true });
})();
