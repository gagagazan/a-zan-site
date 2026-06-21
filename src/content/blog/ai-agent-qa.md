---
title: AI Agent 与质量保障的一些想法
description: 在 AI Agent 快速落地的背景下，质量保障需要新的方法论和评测体系。
pubDate: 2026-06-15
tags: ["ai-agent", "qa", "evaluation"]
draft: false
---

AI Agent 正在从 demo 走向生产。与传统软件不同，Agent 的输出具有不确定性，这给质量保障带来了新挑战。

## 传统测试 vs AI 评测

- 传统测试：输入固定，期望输出固定。
- AI 评测：输入固定，输出可变，需要用**评分模型**或**人工标注**判断质量。

## 关键问题

1. 如何设计可复现的评测集？
2. 如何量化 Agent 的稳定性？
3. 如何在 CI 中集成模型评测？

这些问题值得持续探索。
