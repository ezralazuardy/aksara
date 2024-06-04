import { expect } from "chai";
import { translate, hasAksara } from "../src/core";

// set the latin text
const latin = "aksara jawa";

// set the javanese script text (ꦲꦏ꧀ꦱꦫ ꦗꦮ)
const aksara = translate(latin);

// test the translation
describe("Translation", () => {
  it("hasAksara should return true if aksara exist", () => {
    expect(hasAksara(aksara)).to.be.true;
  });

  it("should translate latin to javanese script correctly", () => {
    expect(translate(latin)).to.equal(aksara);
  });

  it("should translate javanese script to latin correctly", () => {
    expect(translate(aksara)).to.equal(latin);
  });
});
