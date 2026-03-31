const templateUrl = new URL("./layout.html", import.meta.url);

let layoutTemplatesPromise;

function getBasePath() {
  const path = window.location.pathname;
  const parts = path.split("/").filter(Boolean);
  if (parts.length === 0) {
    return "./";
  }

  const lastPart = parts[parts.length - 1];
  const endsWithFile = lastPart.includes(".");
  const depth = endsWithFile ? parts.length - 1 : parts.length;

  return depth === 0 ? "./" : "../".repeat(depth);
}

async function loadLayoutTemplates() {
  if (!layoutTemplatesPromise) {
    layoutTemplatesPromise = fetch(templateUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to load layout template: ${response.status}`);
        }
        return response.text();
      })
      .then((html) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");
        return {
          header: doc.getElementById("site-header-template"),
          footer: doc.getElementById("site-footer-template"),
        };
      });
  }

  return layoutTemplatesPromise;
}

function renderTemplate(template, replacements) {
  let html = template?.innerHTML ?? "";
  for (const [token, value] of Object.entries(replacements)) {
    html = html.replaceAll(`{{${token}}}`, value);
  }
  return html;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function warnHeaderLinks(message) {
  console.warn(`[site-header] ${message}`);
}

function parseHeaderLinks(rawValue, base) {
  if (!rawValue) {
    warnHeaderLinks('Missing required "links" attribute. Pass a JSON array of { label, href }.');
    return [];
  }

  try {
    const parsed = JSON.parse(rawValue);
    if (!Array.isArray(parsed)) {
      warnHeaderLinks('Invalid "links" attribute. Expected a JSON array.');
      return [];
    }

    const links = parsed
      .map((item) => {
        if (!item || typeof item !== "object") {
          return null;
        }

        const label = typeof item.label === "string" ? item.label.trim() : "";
        const hrefRaw = typeof item.href === "string" ? item.href.trim() : "";
        if (!label || !hrefRaw) {
          return null;
        }

        return {
          label,
          href: hrefRaw.replaceAll("{{BASE}}", base),
        };
      })
      .filter(Boolean);

    if (links.length === 0) {
      warnHeaderLinks('No valid links found. Each item must include non-empty "label" and "href".');
    }

    return links;
  } catch {
    warnHeaderLinks('Failed to parse "links" JSON. Ensure valid JSON syntax.');
    return [];
  }
}

function linksToHtml(links) {
  return links
    .map((link) => {
      const label = escapeHtml(link.label);
      const href = escapeHtml(link.href);
      return `<a href="${href}">${label}</a>`;
    })
    .join("\n      ");
}

class SiteHeader extends HTMLElement {
  static get observedAttributes() {
    return ["links"];
  }

  async connectedCallback() {
    await this.render();
  }

  async attributeChangedCallback() {
    if (this.isConnected) {
      await this.render();
    }
  }

  async render() {
    const { header } = await loadLayoutTemplates();
    const base = getBasePath();
    const links = parseHeaderLinks(this.getAttribute("links"), base);
    const navLinks = linksToHtml(links);
    this.innerHTML = renderTemplate(header, { BASE: base, NAV_LINKS: navLinks });
  }
}

class SiteFooter extends HTMLElement {
  async connectedCallback() {
    const { footer } = await loadLayoutTemplates();
    const base = getBasePath();
    const year = String(new Date().getFullYear());
    this.innerHTML = renderTemplate(footer, { BASE: base, YEAR: year });
  }
}

customElements.define("site-header", SiteHeader);
customElements.define("site-footer", SiteFooter);
console.log('UMD Coffee website loaded.');
