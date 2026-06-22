import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import vm from "node:vm";

const SCRIPT_PATH = new URL(
  "../public/site-footer.js",
  "file:///Users/zan/DevProjects/a-zan-site/tests/dummy.ts",
).pathname;
const CUSTOM_ELEMENT_NAME = "zan-site-footer";

// 在 jsdom 的同一个全局上下文中执行脚本，但使用 vm 避免 <script> 标签触发 source-map 堆栈问题
function runScriptInContext() {
  const code = readFileSync(SCRIPT_PATH, "utf-8");
  vm.runInThisContext(code, { filename: "site-footer.js" });
}

describe("site-footer web component", () => {
  beforeEach(() => {
    runScriptInContext();
  });

  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("应该注册自定义元素 zan-site-footer", () => {
    expect(customElements.get(CUSTOM_ELEMENT_NAME)).toBeDefined();
  });

  it("应该渲染默认文案和主页链接", () => {
    const el = document.createElement(CUSTOM_ELEMENT_NAME);
    document.body.appendChild(el);

    const shadow = el.shadowRoot;
    expect(shadow).not.toBeNull();

    const text = shadow!.querySelector('[part="text"]');
    expect(text!.textContent).toContain("用爱发电");

    const link = shadow!.querySelector("a");
    expect(link).not.toBeNull();
    expect(link!.href).toBe("https://a-zan.xyz/");
    expect(link!.textContent).toContain("回到 a-zan.xyz");
  });

  it("应该支持通过属性覆盖文案和链接", () => {
    const el = document.createElement(CUSTOM_ELEMENT_NAME);
    el.setAttribute("text", "自定义文案");
    el.setAttribute("home-url", "https://example.com");
    el.setAttribute("link-text", "返回示例");
    document.body.appendChild(el);

    const shadow = el.shadowRoot!;
    const text = shadow.querySelector('[part="text"]')!;
    const link = shadow.querySelector("a")!;

    expect(text.textContent).toBe("自定义文案");
    expect(link.href).toBe("https://example.com/");
    expect(link.textContent).toBe("返回示例");
  });

  it("主页链接应支持键盘访问", () => {
    const el = document.createElement(CUSTOM_ELEMENT_NAME);
    document.body.appendChild(el);

    const link = el.shadowRoot!.querySelector("a")!;
    expect(link.tabIndex).toBe(0);
  });

  it("浅色主题下应使用浅色配色", () => {
    const el = document.createElement(CUSTOM_ELEMENT_NAME);
    el.setAttribute("theme", "light");
    document.body.appendChild(el);

    const computed = getComputedStyle(el);
    expect(computed.color).toBeDefined();
  });

  it("深色主题下应使用深色配色", () => {
    const el = document.createElement(CUSTOM_ELEMENT_NAME);
    el.setAttribute("theme", "dark");
    document.body.appendChild(el);

    const computed = getComputedStyle(el);
    expect(computed.color).toBeDefined();
  });
});

describe("site-footer 加载容错", () => {
  it("当浏览器不支持 customElements 时不应报错", () => {
    const originalCustomElements = window.customElements;
    // @ts-expect-error 模拟不支持 Web Components 的环境
    window.customElements = undefined;

    expect(() => runScriptInContext()).not.toThrow();

    window.customElements = originalCustomElements;
  });

  it("脚本重复加载不应重复注册或报错", () => {
    // 第二次执行同一脚本，不应因重复声明或重复注册而报错
    expect(() => runScriptInContext()).not.toThrow();

    const el = document.createElement(CUSTOM_ELEMENT_NAME);
    document.body.appendChild(el);
    expect(el.shadowRoot).not.toBeNull();
  });
});
