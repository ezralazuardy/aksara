declare global {
  interface String {
    capitalize(): string;
    replaceChar1(index: number, character: string): string;
    replaceChar2(index: number, character: string): string;
    replaceChar3(index: number, character: string): string;
  }
}

if (!String.prototype.capitalize) {
  String.prototype.capitalize = function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
  };
}

if (!String.prototype.replaceChar1) {
  String.prototype.replaceChar1 = function (index: number, character: string) {
    return this.substring(0, 0 + index) + character;
  };
}

if (!String.prototype.replaceChar2) {
  String.prototype.replaceChar2 = function (index: number, character: string) {
    return this.substring(0, 0 + index - 1) + character;
  };
}

if (!String.prototype.replaceChar3) {
  String.prototype.replaceChar3 = function (index: number, character: string) {
    return this.substring(0, 0 + index - 2) + character;
  };
}
