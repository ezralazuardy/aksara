<div>
  <img alt="Build" src="https://github.com/ezralazuardy/aksara/actions/workflows/build.yml/badge.svg" />
  <img alt="CodeQL Analysis" src="https://github.com/ezralazuardy/aksara/actions/workflows/github-code-scanning/codeql/badge.svg" />
  <img alt="NPM License" src="https://img.shields.io/npm/l/%40ezralazuardy%2Faksara" />
  <img alt="NPM Unpacked Size" src="https://img.shields.io/npm/v/%40ezralazuardy%2Faksara" />
  <img alt="NPM Unpacked Size" src="https://img.shields.io/npm/unpacked-size/%40ezralazuardy%2Faksara" />
  <img alt="NPM Type Definitions" src="https://img.shields.io/npm/types/%40ezralazuardy%2Faksara" />
</div>

## ꦲ aksara

Translate a text into Javanese Script in one line of code.

```typescript
translate("aksara jawa"); // ꦲꦏ꧀ꦱꦫ​ꦗꦮ
```

Aksara is a simple package that helps you to translate your text into Javanese Script or also known as _Aksara Jawa_, which is one of the most beautiful scripts in the world.

The translated text will be formatted as [Unicode](https://home.unicode.org) string of Javanese Script characters that can be used in any text editor or web browser, without any specific font requirement.

It's also typescript compatible, so you can use it in any javascript or typescript project.

> Reference: [Wikipedia](https://en.wikipedia.org/wiki/Javanese_script)

<br/>

### 🚀 Getting Started

It's only require 2 simple steps to get started.

Install the package

```bash
npm install @ezralazuardy/aksara
```

And use it!

```typescript
import { translate } from "@ezralazuardy/aksara";

const result = translate("aksara jawa"); // ꦲꦏ꧀ꦱꦫ​ꦗꦮ
```

For advanced usage, please read the [documentation](#-documentation) below.

<br/>

### 🔄 Revert Translation

If you want to revert the translation, you can just use the `translate` function again.

```typescript
import { translate } from "@ezralazuardy/aksara";

const result = translate("ꦲꦏ꧀ꦱꦫ​ꦗꦮ"); // aksara jawa
```

No need to use other function. Simple, right?

<br/>

### 📖 Documentation

A proper documentation is still in progress 🥲

> Written in [Typescript](https://www.typescriptlang.org). Heavily inspired by [@bennylin](https://github.com/bennylin).
