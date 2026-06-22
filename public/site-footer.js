/**
 * Zan Site Footer — 原生 Web Component
 *
 * 设计约束：
 * - Shadow DOM 隔离样式，不污染宿主页面。
 * - 仅读取 prefers-color-scheme 或 theme 属性；不改写 body。
 * - 支持属性覆盖默认文案和链接。
 * - 重复加载、重复注册均安全。
 */

// 使用 var 而非 const，避免在极端情况下（例如同一页面内嵌脚本被重复执行）
// 触发重复声明异常，同时保持脚本体积最小。
var ZAN_SITE_FOOTER_NAME = 'zan-site-footer';

function defineFooter() {
  if (customElements.get(ZAN_SITE_FOOTER_NAME)) return;

  const template = document.createElement('template');
  template.innerHTML = `
    <style>
      :host {
        --zf-text: #666666;
        --zf-link: #2563eb;
        --zf-link-hover: #1d4ed8;
        --zf-focus: #2563eb;
        --zf-border: rgba(0, 0, 0, 0.08);
        --zf-font: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans SC', sans-serif;
        --zf-padding: 1rem;
        --zf-max-width: 720px;

        display: block;
        width: 100%;
        font-family: var(--zf-font);
        font-size: 0.875rem;
        line-height: 1.5;
        color: var(--zf-text);
      }

      :host([theme="dark"]) {
        --zf-text: #a3a3a3;
        --zf-link: #60a5fa;
        --zf-link-hover: #93c5fd;
        --zf-focus: #60a5fa;
        --zf-border: rgba(255, 255, 255, 0.08);
      }

      @media (prefers-color-scheme: dark) {
        :host(:not([theme="light"])) {
          --zf-text: #a3a3a3;
          --zf-link: #60a5fa;
          --zf-link-hover: #93c5fd;
          --zf-focus: #60a5fa;
          --zf-border: rgba(255, 255, 255, 0.08);
        }
      }

      .footer {
        width: 100%;
        border-top: 1px solid var(--zf-border);
        padding: var(--zf-padding) 0;
      }

      .footer__inner {
        box-sizing: border-box;
        width: 100%;
        max-width: var(--zf-max-width);
        margin: 0 auto;
        padding: 0 var(--zf-padding);
      }

      .footer__content {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: center;
        gap: 0.5rem 0.75rem;
      }

      .footer__text {
        margin: 0;
      }

      .footer__sep {
        user-select: none;
        opacity: 0.6;
      }

      a {
        color: var(--zf-link);
        text-decoration: none;
        border-radius: 2px;
        outline: none;
      }

      a:hover {
        color: var(--zf-link-hover);
        text-decoration: underline;
        text-underline-offset: 2px;
      }

      a:focus-visible {
        outline: 2px solid var(--zf-focus);
        outline-offset: 2px;
      }
    </style>
    <footer class="footer" part="footer">
      <div class="footer__inner">
        <p class="footer__content">
          <span class="footer__text" part="text"></span>
          <span class="footer__sep" aria-hidden="true">·</span>
          <a class="footer__link" part="link"></a>
        </p>
      </div>
    </footer>
  `;

  class ZanSiteFooter extends HTMLElement {
    static get observedAttributes() {
      return ['text', 'home-url', 'link-text', 'theme'];
    }

    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this.shadowRoot.appendChild(template.content.cloneNode(true));
      this._textNode = this.shadowRoot.querySelector('[part="text"]');
      this._linkNode = this.shadowRoot.querySelector('[part="link"]');
    }

    connectedCallback() {
      this._render();
    }

    attributeChangedCallback() {
      this._render();
    }

    _render() {
      const defaultText = ` Zan 用爱发电的小工具`;
      const text = this.getAttribute('text') || defaultText;
      const homeUrl = this.getAttribute('home-url') || 'https://a-zan.xyz';
      const linkText = this.getAttribute('link-text') || `回到 a-zan.xyz`;

      this._textNode.textContent = text;
      this._linkNode.href = homeUrl;
      this._linkNode.textContent = linkText;
      this._linkNode.title = `回到 ${homeUrl}`;

      // 更新 aria-label，让 footer 作为地标时更明确
      this.setAttribute('aria-label', `${text} · ${linkText}`);

      // 可选：通过外部 CSS 变量覆盖样式时，这些 part 属性允许宿主页面 ::part 命中
      this.setAttribute('exportparts', 'footer, text, link');
    }
  }

  customElements.define(ZAN_SITE_FOOTER_NAME, ZanSiteFooter);
}

(function init() {
  if (typeof customElements === 'undefined') {
    // 降级：如果浏览器不支持 Web Components，不注册，页面仍可正常使用
    return;
  }
  defineFooter();
})();
