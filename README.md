<div>
  <img alt="Build" src="https://github.com/ezralazuardy/aksara/actions/workflows/build.yml/badge.svg" />
  <img alt="CodeQL Analysis" src="https://github.com/ezralazuardy/aksara/actions/workflows/github-code-scanning/codeql/badge.svg" />
  <img alt="NPM License" src="https://img.shields.io/npm/l/%40ezralazuardy%2Faksara" />
  <img alt="NPM Unpacked Size" src="https://img.shields.io/npm/v/%40ezralazuardy%2Faksara" />
  <img alt="NPM Unpacked Size" src="https://img.shields.io/npm/unpacked-size/%40ezralazuardy%2Faksara" />
  <img alt="NPM Type Definitions" src="https://img.shields.io/npm/types/%40ezralazuardy%2Faksara" />
</div>

## ꦲ aksara

<br/>

<p align="center">
  <img width="480" alt="image" src="https://github.com/ezralazuardy/aksara/assets/24422019/fde5abec-3419-4ea6-a358-0a2a9ffb7c00"/>
  <p align="center">
    <i>
      There were (two) emissaries. They began to fight.<br/>
      Their valor was equal. They both fell dead.
    </i>
  </p>
</p>

<br/>

```typescript
translate("hana caraka"); // ꦲꦤ ꦕꦫꦏ
```

Aksara is a simple package that helps you to translate your text into Javanese Script or also known as _Aksara Jawa_, which is one of the most beautiful scripts in the world. You can translate a latin text into Javanese Script or vice-versa in just one line of code.

The translated text will be formatted as [Unicode](https://home.unicode.org) string of Javanese Script characters that can be used in any text editor or web browser, without any specific font requirement.

It's also typescript compatible, so you can use it in any javascript or typescript project.

> Demo App: https://aksara-demo.lazuardy.tech

> Reference: [Wikipedia](https://en.wikipedia.org/wiki/Javanese_script), [Matador Network](https://matadornetwork.com/read/5-beautiful-endangered-alphabets)

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

const result = translate("hana caraka"); // ꦲꦤ ꦕꦫꦏ
```

For advanced usage, please read the [documentation](#-documentation) below.

<br/>

### 🔄 Revert Translation

If you want to revert the translation, you can just use the `translate` function again.

```typescript
import { translate } from "@ezralazuardy/aksara";

const result = translate("ꦲꦤ ꦕꦫꦏ"); // hana caraka
```

No need to use other function. Simple, right?

<br/>

### 📖 Documentation

A proper documentation is still in progress 🥲

> Written in [Typescript](https://www.typescriptlang.org). Heavily inspired by [@bennylin](https://github.com/bennylin).
