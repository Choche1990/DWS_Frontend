/* @ds-bundle: {"format":4,"namespace":"InterbankDesignSystem_cbbb96","components":[{"name":"Badge","sourcePath":"components/display/Badge.jsx"},{"name":"Card","sourcePath":"components/display/Card.jsx"},{"name":"Tag","sourcePath":"components/display/Tag.jsx"},{"name":"Toast","sourcePath":"components/feedback/Toast.jsx"},{"name":"Tooltip","sourcePath":"components/feedback/Tooltip.jsx"},{"name":"Button","sourcePath":"components/forms/Button.jsx"},{"name":"Checkbox","sourcePath":"components/forms/Checkbox.jsx"},{"name":"IconButton","sourcePath":"components/forms/IconButton.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"Radio","sourcePath":"components/forms/Radio.jsx"},{"name":"Select","sourcePath":"components/forms/Select.jsx"},{"name":"Switch","sourcePath":"components/forms/Switch.jsx"},{"name":"Tabs","sourcePath":"components/navigation/Tabs.jsx"}],"sourceHashes":{"components/display/Badge.jsx":"d94124725bba","components/display/Card.jsx":"addba87736a5","components/display/Tag.jsx":"f64934f05a6a","components/feedback/Toast.jsx":"aeae5a107b7d","components/feedback/Tooltip.jsx":"91546d26d8ee","components/forms/Button.jsx":"c699b0bcfdfc","components/forms/Checkbox.jsx":"f0828b551866","components/forms/IconButton.jsx":"d4bbc5be6f37","components/forms/Input.jsx":"c94b4354ea8b","components/forms/Radio.jsx":"470b1f8d2d2d","components/forms/Select.jsx":"3f5320dad49c","components/forms/Switch.jsx":"258de07ac2c4","components/navigation/Tabs.jsx":"5d62a9f582b1","ui_kits/marketing-web/AgenteBanner.jsx":"2dd2a8766d80","ui_kits/marketing-web/Benefits.jsx":"6109c1ee8769","ui_kits/marketing-web/Footer.jsx":"1e9efd1bf04c","ui_kits/marketing-web/Header.jsx":"563e7072aa09","ui_kits/marketing-web/Hero.jsx":"6ae2206edc41","ui_kits/mobile-app/AgenteScreen.jsx":"4435365a3262","ui_kits/mobile-app/HomeScreen.jsx":"049b49c1d786","ui_kits/mobile-app/LoginScreen.jsx":"f2893fa0f0a2","ui_kits/mobile-app/PhoneShell.jsx":"6f3bb9196bd1","ui_kits/mobile-app/TransferScreen.jsx":"23d422494a10"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.InterbankDesignSystem_cbbb96 = window.InterbankDesignSystem_cbbb96 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/display/Badge.jsx
try { (() => {
function Badge({
  children,
  tone = "brand"
}) {
  const tones = {
    brand: {
      background: "var(--ibk-green)",
      color: "var(--text-on-brand)"
    },
    strong: {
      background: "var(--ibk-green-4)",
      color: "#fff"
    },
    blue: {
      background: "var(--ibk-blue)",
      color: "#fff"
    },
    neutral: {
      background: "var(--ibk-gray-05)",
      color: "var(--text-secondary)"
    }
  };
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      padding: "4px 12px",
      borderRadius: "var(--radius-pill)",
      font: "600 12px Poppins, sans-serif",
      letterSpacing: "0.02em",
      ...tones[tone]
    }
  }, children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/Badge.jsx", error: String((e && e.message) || e) }); }

// components/display/Card.jsx
try { (() => {
function Card({
  children,
  padding = 20,
  radius = "lg",
  elevated = false,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: "#fff",
      borderRadius: `var(--radius-${radius})`,
      padding,
      border: elevated ? "none" : "1px solid var(--border-default)",
      boxShadow: elevated ? "0 4px 20px rgba(0,0,0,0.08)" : "none",
      fontFamily: "Poppins, sans-serif",
      ...style
    }
  }, children);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/Card.jsx", error: String((e && e.message) || e) }); }

// components/display/Tag.jsx
try { (() => {
function Tag({
  children,
  selected = false,
  onClick
}) {
  return /*#__PURE__*/React.createElement("button", {
    onClick: onClick,
    style: {
      padding: "8px 16px",
      borderRadius: "var(--radius-pill)",
      border: `2px solid ${selected ? "var(--ibk-green)" : "var(--border-default)"}`,
      background: selected ? "var(--ibk-green)" : "#fff",
      color: selected ? "var(--text-on-brand)" : "var(--text-primary)",
      font: "600 14px Poppins, sans-serif",
      cursor: "pointer",
      minHeight: "var(--touch-min)"
    }
  }, children);
}
Object.assign(__ds_scope, { Tag });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/Tag.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Toast.jsx
try { (() => {
function Toast({
  tone = "success",
  message,
  onClose
}) {
  const tones = {
    success: {
      background: "var(--ibk-green-4)",
      color: "#fff"
    },
    info: {
      background: "var(--ibk-blue)",
      color: "#fff"
    },
    neutral: {
      background: "var(--ibk-gray-90)",
      color: "#fff"
    }
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      padding: "14px 18px",
      borderRadius: "var(--radius-md)",
      font: "400 15px Poppins, sans-serif",
      boxShadow: "0 6px 24px rgba(0,0,0,0.18)",
      ...tones[tone]
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1
    }
  }, message), onClose && /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    style: {
      background: "none",
      border: "none",
      color: "inherit",
      cursor: "pointer",
      fontSize: 16
    }
  }, "\u2715"));
}
Object.assign(__ds_scope, { Toast });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Toast.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Tooltip.jsx
try { (() => {
function Tooltip({
  label,
  children
}) {
  const [show, setShow] = React.useState(false);
  return /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      display: "inline-block"
    },
    onMouseEnter: () => setShow(true),
    onMouseLeave: () => setShow(false)
  }, children, show && /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      bottom: "calc(100% + 8px)",
      left: "50%",
      transform: "translateX(-50%)",
      background: "var(--ibk-gray-90)",
      color: "#fff",
      padding: "6px 10px",
      borderRadius: 8,
      font: "400 12px Poppins, sans-serif",
      whiteSpace: "nowrap",
      zIndex: 10
    }
  }, label));
}
Object.assign(__ds_scope, { Tooltip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Tooltip.jsx", error: String((e && e.message) || e) }); }

// components/forms/Button.jsx
try { (() => {
function Button({
  variant = "primary",
  size = "md",
  disabled = false,
  icon = null,
  children,
  onClick,
  style
}) {
  const sizes = {
    sm: {
      padding: "10px 18px",
      font: "600 14px Poppins, sans-serif"
    },
    md: {
      padding: "14px 24px",
      font: "600 16px Poppins, sans-serif"
    },
    lg: {
      padding: "17px 32px",
      font: "600 17px Poppins, sans-serif"
    }
  };
  const variants = {
    primary: {
      background: "var(--button-primary-bg)",
      color: "var(--button-primary-text)",
      border: "none"
    },
    secondary: {
      background: "var(--button-secondary-bg)",
      color: "var(--button-secondary-text)",
      border: "none"
    },
    ghost: {
      background: "transparent",
      color: "var(--ibk-green-4)",
      border: "2px solid var(--ibk-green)"
    }
  };
  const base = {
    fontFamily: "Poppins, sans-serif",
    borderRadius: "var(--radius-pill)",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.45 : 1,
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    justifyContent: "center",
    transition: "background 120ms ease, transform 80ms ease",
    minHeight: "var(--touch-min)"
  };
  return /*#__PURE__*/React.createElement("button", {
    disabled: disabled,
    onClick: onClick,
    style: {
      ...base,
      ...sizes[size],
      ...variants[variant],
      ...style
    },
    onMouseDown: e => {
      if (!disabled) e.currentTarget.style.transform = "scale(0.97)";
    },
    onMouseUp: e => {
      e.currentTarget.style.transform = "scale(1)";
    },
    onMouseLeave: e => {
      e.currentTarget.style.transform = "scale(1)";
    }
  }, icon, children);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Button.jsx", error: String((e && e.message) || e) }); }

// components/forms/Checkbox.jsx
try { (() => {
function Checkbox({
  label,
  checked,
  onChange,
  disabled
}) {
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 10,
      cursor: disabled ? "not-allowed" : "pointer",
      fontFamily: "Poppins, sans-serif",
      font: "400 16px Poppins, sans-serif",
      color: "var(--text-primary)",
      opacity: disabled ? 0.5 : 1,
      minHeight: "var(--touch-min)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 24,
      height: 24,
      borderRadius: 6,
      flexShrink: 0,
      border: `2px solid ${checked ? "var(--ibk-green)" : "var(--border-strong)"}`,
      background: checked ? "var(--ibk-green)" : "#fff",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, checked && /*#__PURE__*/React.createElement("span", {
    style: {
      color: "#000",
      fontSize: 14,
      fontWeight: 700
    }
  }, "\u2713")), /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: checked,
    disabled: disabled,
    onChange: onChange,
    style: {
      display: "none"
    }
  }), label);
}
Object.assign(__ds_scope, { Checkbox });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Checkbox.jsx", error: String((e && e.message) || e) }); }

// components/forms/IconButton.jsx
try { (() => {
function IconButton({
  icon,
  label,
  size = "md",
  variant = "ghost",
  onClick,
  style
}) {
  const dims = {
    sm: 40,
    md: 48,
    lg: 56
  };
  const d = dims[size];
  const variants = {
    filled: {
      background: "var(--ibk-green)",
      color: "var(--text-on-brand)"
    },
    ghost: {
      background: "var(--ibk-gray-05)",
      color: "var(--ibk-green-4)"
    },
    inverse: {
      background: "rgba(255,255,255,0.16)",
      color: "#fff"
    }
  };
  return /*#__PURE__*/React.createElement("button", {
    "aria-label": label,
    onClick: onClick,
    style: {
      width: Math.max(d, 44),
      height: Math.max(d, 44),
      borderRadius: "50%",
      border: "none",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: d * 0.42,
      cursor: "pointer",
      ...variants[variant],
      ...style
    }
  }, icon);
}
Object.assign(__ds_scope, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/IconButton.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function Input({
  label,
  placeholder,
  value,
  onChange,
  type = "text",
  error,
  helpText,
  disabled
}) {
  const [focused, setFocused] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "Poppins, sans-serif",
      width: "100%"
    }
  }, label && /*#__PURE__*/React.createElement("label", {
    style: {
      display: "block",
      font: "600 13px Poppins, sans-serif",
      color: "var(--text-primary)",
      marginBottom: 6
    }
  }, label), /*#__PURE__*/React.createElement("input", {
    type: type,
    placeholder: placeholder,
    value: value,
    disabled: disabled,
    onChange: onChange,
    onFocus: () => setFocused(true),
    onBlur: () => setFocused(false),
    style: {
      width: "100%",
      boxSizing: "border-box",
      minHeight: "var(--touch-min)",
      padding: "12px 16px",
      borderRadius: "var(--radius-sm)",
      border: `2px solid ${error ? "var(--danger)" : focused ? "var(--ibk-green)" : "var(--border-default)"}`,
      outline: focused ? "3px solid rgba(0,57,166,0.25)" : "none",
      font: "400 16px Poppins, sans-serif",
      color: "var(--text-primary)",
      background: disabled ? "var(--ibk-gray-05)" : "#fff"
    }
  }), (helpText || error) && /*#__PURE__*/React.createElement("div", {
    style: {
      font: "400 13px Poppins, sans-serif",
      color: error ? "var(--danger)" : "var(--text-secondary)",
      marginTop: 6
    }
  }, error || helpText));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/forms/Radio.jsx
try { (() => {
function Radio({
  label,
  checked,
  onChange,
  disabled
}) {
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 10,
      cursor: disabled ? "not-allowed" : "pointer",
      fontFamily: "Poppins, sans-serif",
      font: "400 16px Poppins, sans-serif",
      color: "var(--text-primary)",
      opacity: disabled ? 0.5 : 1,
      minHeight: "var(--touch-min)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 24,
      height: 24,
      borderRadius: "50%",
      flexShrink: 0,
      border: `2px solid ${checked ? "var(--ibk-green)" : "var(--border-strong)"}`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, checked && /*#__PURE__*/React.createElement("span", {
    style: {
      width: 12,
      height: 12,
      borderRadius: "50%",
      background: "var(--ibk-green)"
    }
  })), /*#__PURE__*/React.createElement("input", {
    type: "radio",
    checked: checked,
    disabled: disabled,
    onChange: onChange,
    style: {
      display: "none"
    }
  }), label);
}
Object.assign(__ds_scope, { Radio });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Radio.jsx", error: String((e && e.message) || e) }); }

// components/forms/Select.jsx
try { (() => {
function Select({
  label,
  options = [],
  value,
  onChange,
  placeholder = "Selecciona"
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "Poppins, sans-serif",
      width: "100%"
    }
  }, label && /*#__PURE__*/React.createElement("label", {
    style: {
      display: "block",
      font: "600 13px Poppins, sans-serif",
      color: "var(--text-primary)",
      marginBottom: 6
    }
  }, label), /*#__PURE__*/React.createElement("select", {
    value: value,
    onChange: onChange,
    style: {
      width: "100%",
      boxSizing: "border-box",
      minHeight: "var(--touch-min)",
      padding: "12px 16px",
      borderRadius: "var(--radius-sm)",
      border: "2px solid var(--border-default)",
      font: "400 16px Poppins, sans-serif",
      color: "var(--text-primary)",
      background: "#fff"
    }
  }, /*#__PURE__*/React.createElement("option", {
    value: "",
    disabled: true,
    hidden: true
  }, placeholder), options.map(o => /*#__PURE__*/React.createElement("option", {
    key: o.value ?? o,
    value: o.value ?? o
  }, o.label ?? o))));
}
Object.assign(__ds_scope, { Select });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Select.jsx", error: String((e && e.message) || e) }); }

// components/forms/Switch.jsx
try { (() => {
function Switch({
  checked,
  onChange,
  label,
  disabled
}) {
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 10,
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.5 : 1,
      fontFamily: "Poppins, sans-serif",
      font: "400 16px Poppins, sans-serif",
      color: "var(--text-primary)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 46,
      height: 28,
      borderRadius: 999,
      position: "relative",
      transition: "background 150ms ease",
      background: checked ? "var(--ibk-green)" : "var(--ibk-gray-30)",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      top: 3,
      left: checked ? 21 : 3,
      width: 22,
      height: 22,
      borderRadius: "50%",
      background: "#fff",
      transition: "left 150ms ease",
      boxShadow: "0 1px 2px rgba(0,0,0,0.25)"
    }
  })), /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: checked,
    disabled: disabled,
    onChange: onChange,
    style: {
      display: "none"
    }
  }), label);
}
Object.assign(__ds_scope, { Switch });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Switch.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Tabs.jsx
try { (() => {
function Tabs({
  tabs = [],
  active,
  onChange
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 4,
      borderBottom: "2px solid var(--border-default)",
      fontFamily: "Poppins, sans-serif"
    }
  }, tabs.map(t => {
    const isActive = t === active;
    return /*#__PURE__*/React.createElement("button", {
      key: t,
      onClick: () => onChange && onChange(t),
      style: {
        padding: "12px 18px",
        border: "none",
        background: "transparent",
        cursor: "pointer",
        font: isActive ? "600 15px Poppins, sans-serif" : "400 15px Poppins, sans-serif",
        color: isActive ? "var(--ibk-green-4)" : "var(--text-secondary)",
        borderBottom: isActive ? "3px solid var(--ibk-green)" : "3px solid transparent",
        marginBottom: -2,
        minHeight: "var(--touch-min)"
      }
    }, t);
  }));
}
Object.assign(__ds_scope, { Tabs });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Tabs.jsx", error: String((e && e.message) || e) }); }

// ui_kits/marketing-web/AgenteBanner.jsx
try { (() => {
function AgenteBanner() {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      padding: "0 64px 72px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      background: "var(--ibk-gray-05)",
      borderRadius: 28,
      padding: "40px 48px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 480
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: "600 26px Poppins"
    }
  }, "Retira y deposita sin ir al banco"), /*#__PURE__*/React.createElement("div", {
    style: {
      font: "400 16px Poppins",
      color: "var(--text-secondary)",
      marginTop: 10
    }
  }, "M\xE1s de 7,000 Agentes Interbank en bodegas, boticas y minimarkets cerca de ti.")), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 96,
      height: 96,
      borderRadius: 20,
      background: "var(--ibk-green)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 28,
      height: 28,
      background: "var(--ibk-blue)",
      borderRadius: 6
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      font: "600 12px Poppins",
      color: "#fff"
    }
  }, "agente"))));
}
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/marketing-web/AgenteBanner.jsx", error: String((e && e.message) || e) }); }

// ui_kits/marketing-web/Benefits.jsx
try { (() => {
const items = [{
  title: "Cuenta Sueldo",
  desc: "Sin comisión de mantenimiento y retiros en cualquier agente."
}, {
  title: "Tarjetas de crédito",
  desc: "Acumula millas y benefit en cada compra."
}, {
  title: "Créditos hipotecarios",
  desc: "Te acompañamos a comprar tu próximo depa."
}];
function Benefits() {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      padding: "72px 64px",
      background: "#fff"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: "600 32px Poppins",
      marginBottom: 40
    }
  }, "Productos pensados para ti"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 24
    }
  }, items.map((it, i) => /*#__PURE__*/React.createElement("div", {
    key: it.title,
    style: {
      flex: 1,
      borderRadius: 24,
      padding: 28,
      background: ["var(--ibk-green-1)", "var(--ibk-green)", "var(--ibk-green-4)"][i],
      color: i === 2 ? "#fff" : "#000"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: "600 20px Poppins"
    }
  }, it.title), /*#__PURE__*/React.createElement("div", {
    style: {
      font: "400 15px Poppins",
      marginTop: 10,
      opacity: 0.85
    }
  }, it.desc)))));
}
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/marketing-web/Benefits.jsx", error: String((e && e.message) || e) }); }

// ui_kits/marketing-web/Footer.jsx
try { (() => {
function Footer() {
  return /*#__PURE__*/React.createElement("footer", {
    style: {
      background: "var(--ibk-green-4)",
      color: "#fff",
      padding: "48px 64px",
      display: "flex",
      justifyContent: "space-between"
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/logos/interbank-logo-white.png",
    style: {
      height: 26
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      font: "400 14px Poppins",
      opacity: 0.8
    }
  }, "\xA9 2026 Interbank. Todos los derechos reservados."));
}
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/marketing-web/Footer.jsx", error: String((e && e.message) || e) }); }

// ui_kits/marketing-web/Header.jsx
try { (() => {
function Header() {
  return /*#__PURE__*/React.createElement("header", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "18px 64px",
      background: "#fff"
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/logos/interbank-logo-color.png",
    style: {
      height: 30
    }
  }), /*#__PURE__*/React.createElement("nav", {
    style: {
      display: "flex",
      gap: 32,
      font: "600 15px Poppins",
      color: "var(--text-primary)"
    }
  }, /*#__PURE__*/React.createElement("span", null, "Cuentas"), /*#__PURE__*/React.createElement("span", null, "Tarjetas"), /*#__PURE__*/React.createElement("span", null, "Pr\xE9stamos"), /*#__PURE__*/React.createElement("span", null, "Agentes")), /*#__PURE__*/React.createElement("button", {
    style: {
      background: "var(--ibk-green)",
      color: "#000",
      border: "none",
      borderRadius: 999,
      padding: "12px 26px",
      font: "600 15px Poppins",
      cursor: "pointer",
      minHeight: 44
    }
  }, "Banca por Internet"));
}
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/marketing-web/Header.jsx", error: String((e && e.message) || e) }); }

// ui_kits/marketing-web/Hero.jsx
try { (() => {
function Hero() {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      position: "relative",
      background: "var(--ibk-green)",
      padding: "80px 64px",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 620
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: "700 56px/1.08 Poppins",
      color: "#000"
    }
  }, "Acompa\xF1amos a los peruanos a alcanzar sus sue\xF1os, hoy."), /*#__PURE__*/React.createElement("div", {
    style: {
      font: "400 19px Poppins",
      color: "#00431B",
      marginTop: 20,
      maxWidth: 480
    }
  }, "Una experiencia cercana, \xE1gil y segura \u2014 con beneficios que valoran tu lealtad, 24/7."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 16,
      marginTop: 32
    }
  }, /*#__PURE__*/React.createElement("button", {
    style: {
      background: "var(--ibk-blue)",
      color: "#fff",
      border: "none",
      borderRadius: 999,
      padding: "16px 32px",
      font: "600 16px Poppins",
      cursor: "pointer"
    }
  }, "Abre tu cuenta gratis"), /*#__PURE__*/React.createElement("button", {
    style: {
      background: "transparent",
      color: "#000",
      border: "2px solid #000",
      borderRadius: 999,
      padding: "14px 30px",
      font: "600 16px Poppins",
      cursor: "pointer"
    }
  }, "Descarga la app"))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      right: 64,
      top: "50%",
      transform: "translateY(-50%)",
      width: 300,
      height: 380,
      background: "#fff",
      clipPath: "polygon(12% 0%, 100% 4%, 88% 100%, 0% 96%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/logos/interbank-isotipo.png",
    style: {
      width: 80
    }
  })));
}
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/marketing-web/Hero.jsx", error: String((e && e.message) || e) }); }

// ui_kits/mobile-app/AgenteScreen.jsx
try { (() => {
function AgenteScreen({
  onBack
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "20px 24px",
      boxSizing: "border-box"
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onBack,
    style: {
      background: "none",
      border: "none",
      font: "600 20px Poppins",
      cursor: "pointer",
      padding: 0
    }
  }, "\u2190"), /*#__PURE__*/React.createElement("div", {
    style: {
      font: "700 24px Poppins",
      marginTop: 16
    }
  }, "Agentes cercanos"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 16,
      height: 160,
      borderRadius: 20,
      background: "var(--ibk-gray-05)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      font: "400 13px Poppins",
      color: "var(--text-secondary)"
    }
  }, "Mapa de agentes"), [["Bodega Milagritos", "200m · Depósitos, retiros"], ["Botica Farmaclub", "450m · Pago de servicios"], ["Minimarket El Sol", "600m · Recaudaciones"]].map(([name, sub]) => /*#__PURE__*/React.createElement("div", {
    key: name,
    style: {
      display: "flex",
      alignItems: "center",
      gap: 14,
      padding: "14px 0",
      borderBottom: "1px solid var(--border-default)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 44,
      height: 44,
      borderRadius: 10,
      background: "var(--ibk-green)",
      flexShrink: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 16,
      height: 16,
      background: "var(--ibk-blue)",
      borderRadius: 4
    }
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      font: "600 15px Poppins"
    }
  }, name), /*#__PURE__*/React.createElement("div", {
    style: {
      font: "400 13px Poppins",
      color: "var(--text-secondary)"
    }
  }, sub)))));
}
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/mobile-app/AgenteScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/mobile-app/HomeScreen.jsx
try { (() => {
function HomeScreen({
  onTransfer,
  onAgente
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      boxSizing: "border-box"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--ibk-green)",
      padding: "20px 24px 28px",
      borderBottomLeftRadius: 28,
      borderBottomRightRadius: 28
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: "600 16px Poppins",
      color: "#000"
    }
  }, "Hola, Marco"), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 36,
      height: 36,
      borderRadius: "50%",
      background: "rgba(0,0,0,0.12)"
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 22,
      font: "400 13px Poppins",
      color: "#00431B"
    }
  }, "Cuenta Sueldo"), /*#__PURE__*/React.createElement("div", {
    style: {
      font: "700 34px Poppins",
      color: "#000",
      marginTop: 2
    }
  }, "S/ 4,230.00")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-around",
      padding: "20px 16px 8px"
    }
  }, [["↑", "Transferir"], ["↓", "Depositar"], ["💳", "Tarjetas"], ["⋯", "Más"]].map(([icon, label]) => /*#__PURE__*/React.createElement("button", {
    key: label,
    onClick: label === "Transferir" ? onTransfer : undefined,
    style: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 6,
      background: "none",
      border: "none",
      cursor: "pointer"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 48,
      height: 48,
      borderRadius: "50%",
      background: "var(--ibk-gray-05)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 18,
      color: "var(--ibk-green-4)"
    }
  }, icon), /*#__PURE__*/React.createElement("span", {
    style: {
      font: "400 12px Poppins",
      color: "var(--text-primary)"
    }
  }, label)))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "12px 20px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: "600 16px Poppins",
      marginBottom: 10
    }
  }, "Movimientos recientes"), [["Netflix.com", "-S/ 34.90"], ["Transferencia recibida", "+S/ 500.00"], ["Plaza Vea", "-S/ 128.30"]].map(([name, amt]) => /*#__PURE__*/React.createElement("div", {
    key: name,
    style: {
      display: "flex",
      justifyContent: "space-between",
      padding: "12px 0",
      borderBottom: "1px solid var(--border-default)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: "400 15px Poppins"
    }
  }, name), /*#__PURE__*/React.createElement("span", {
    style: {
      font: "600 15px Poppins",
      color: amt[0] === "+" ? "var(--ibk-green-4)" : "var(--text-primary)"
    }
  }, amt)))), /*#__PURE__*/React.createElement("button", {
    onClick: onAgente,
    style: {
      margin: "8px 20px 24px",
      padding: 16,
      borderRadius: 20,
      border: "none",
      cursor: "pointer",
      background: "var(--ibk-green-4)",
      color: "#fff",
      display: "flex",
      alignItems: "center",
      gap: 14,
      width: "calc(100% - 40px)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 40,
      height: 40,
      borderRadius: 10,
      background: "var(--ibk-blue)",
      flexShrink: 0
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      textAlign: "left"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: "600 15px Poppins"
    }
  }, "Agente Interbank cercano"), /*#__PURE__*/React.createElement("div", {
    style: {
      font: "400 13px Poppins",
      opacity: 0.85
    }
  }, "Retira sin tarjeta a 200m"))));
}
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/mobile-app/HomeScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/mobile-app/LoginScreen.jsx
try { (() => {
function LoginScreen({
  onLogin
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "32px 24px",
      display: "flex",
      flexDirection: "column",
      height: "100%",
      boxSizing: "border-box"
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/logos/interbank-isotipo.png",
    style: {
      width: 56,
      height: 56
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      font: "700 28px Poppins",
      marginTop: 24,
      color: "#000"
    }
  }, "Bienvenido de", /*#__PURE__*/React.createElement("br", null), "vuelta"), /*#__PURE__*/React.createElement("div", {
    style: {
      font: "400 15px Poppins",
      color: "var(--text-secondary)",
      marginTop: 8
    }
  }, "Te acompa\xF1amos a alcanzar tus sue\xF1os, hoy."), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 32,
      display: "flex",
      flexDirection: "column",
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("input", {
    placeholder: "DNI o usuario",
    style: inputStyle
  }), /*#__PURE__*/React.createElement("input", {
    placeholder: "Clave",
    type: "password",
    style: inputStyle
  })), /*#__PURE__*/React.createElement("button", {
    onClick: onLogin,
    style: btnStyle
  }, "Ingresar"), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      marginTop: 16,
      font: "600 14px Poppins",
      color: "var(--ibk-blue)"
    }
  }, "\xBFOlvidaste tu clave?"), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      font: "400 13px Poppins",
      color: "var(--text-secondary)"
    }
  }, "Banca 100% segura \xB7 24/7"));
}
const inputStyle = {
  minHeight: 48,
  borderRadius: 8,
  border: "2px solid var(--border-default)",
  padding: "0 16px",
  font: "400 16px Poppins",
  boxSizing: "border-box"
};
const btnStyle = {
  marginTop: 28,
  minHeight: 52,
  borderRadius: 999,
  border: "none",
  background: "var(--ibk-green)",
  color: "#000",
  font: "600 16px Poppins",
  cursor: "pointer"
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/mobile-app/LoginScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/mobile-app/PhoneShell.jsx
try { (() => {
function PhoneShell({
  children
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: 390,
      height: 844,
      borderRadius: 44,
      background: "#000",
      padding: 12,
      boxShadow: "0 30px 60px rgba(0,0,0,0.35)",
      fontFamily: "Poppins, sans-serif"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: "100%",
      height: "100%",
      borderRadius: 34,
      background: "#fff",
      overflow: "hidden",
      position: "relative"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: 44,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 24px",
      font: "600 14px Poppins"
    }
  }, /*#__PURE__*/React.createElement("span", null, "9:41"), /*#__PURE__*/React.createElement("span", null, "\u25CF\u25CF\u25CF 100%")), /*#__PURE__*/React.createElement("div", {
    style: {
      height: "calc(100% - 44px)",
      overflowY: "auto"
    }
  }, children)));
}
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/mobile-app/PhoneShell.jsx", error: String((e && e.message) || e) }); }

// ui_kits/mobile-app/TransferScreen.jsx
try { (() => {
function TransferScreen({
  onBack
}) {
  const [amount, setAmount] = React.useState("500");
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "20px 24px",
      boxSizing: "border-box"
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onBack,
    style: {
      background: "none",
      border: "none",
      font: "600 20px Poppins",
      cursor: "pointer",
      padding: 0
    }
  }, "\u2190"), /*#__PURE__*/React.createElement("div", {
    style: {
      font: "700 24px Poppins",
      marginTop: 16
    }
  }, "Transferir"), /*#__PURE__*/React.createElement("div", {
    style: {
      font: "400 14px Poppins",
      color: "var(--text-secondary)",
      marginTop: 4
    }
  }, "A otra cuenta Interbank"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 28,
      background: "var(--ibk-gray-05)",
      borderRadius: 20,
      padding: 20,
      textAlign: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: "400 13px Poppins",
      color: "var(--text-secondary)"
    }
  }, "Monto a transferir"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 4,
      marginTop: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: "600 28px Poppins"
    }
  }, "S/"), /*#__PURE__*/React.createElement("input", {
    value: amount,
    onChange: e => setAmount(e.target.value),
    style: {
      font: "700 40px Poppins",
      border: "none",
      background: "none",
      width: 140,
      textAlign: "center",
      outline: "none"
    }
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: "600 13px Poppins",
      marginBottom: 6
    }
  }, "Destinatario"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      padding: 14,
      border: "2px solid var(--border-default)",
      borderRadius: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 40,
      height: 40,
      borderRadius: "50%",
      background: "var(--ibk-green-1)"
    }
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      font: "600 15px Poppins"
    }
  }, "Ana G\xF3mez"), /*#__PURE__*/React.createElement("div", {
    style: {
      font: "400 13px Poppins",
      color: "var(--text-secondary)"
    }
  }, "Cuenta Ahorros ****4821")))), /*#__PURE__*/React.createElement("button", {
    style: {
      marginTop: 32,
      width: "100%",
      minHeight: 52,
      borderRadius: 999,
      border: "none",
      background: "var(--ibk-green)",
      color: "#000",
      font: "600 16px Poppins",
      cursor: "pointer"
    }
  }, "Confirmar transferencia"));
}
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/mobile-app/TransferScreen.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.Tag = __ds_scope.Tag;

__ds_ns.Toast = __ds_scope.Toast;

__ds_ns.Tooltip = __ds_scope.Tooltip;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Checkbox = __ds_scope.Checkbox;

__ds_ns.IconButton = __ds_scope.IconButton;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Radio = __ds_scope.Radio;

__ds_ns.Select = __ds_scope.Select;

__ds_ns.Switch = __ds_scope.Switch;

__ds_ns.Tabs = __ds_scope.Tabs;

})();
