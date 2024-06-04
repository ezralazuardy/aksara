import type {
  Character,
  Consonant,
  Digit,
  Matra,
  Shift,
  SpecialSound,
  TranslateConfiguration,
} from "./types";
import {
  trim,
  find,
  isDigit,
  isPunct,
  isVowel,
  isConsonant,
  isHR,
  isCJ,
  formatShift,
  removeInvisibleChars,
} from "./utils";
import "./global";

/**
 * Default configuration
 */
const defaultConfig = {
  typeMode: true,
  withSpace: true,
  withMurda: false,
} as TranslateConfiguration;

/**
 * The map of Latin to Javanese Script
 */
const javaneseToLatin: Character = {
  "ꦀ": "", //? -- archaic
  "ꦁ": "ng", //cecak
  "ꦂ": "r", //layar
  "ꦃ": "h", //wignyan
  ꦄ: "A", //swara-A
  ꦅ: "I", //I-Kawi -- archaic
  ꦆ: "I", //I
  ꦇ: "Ii", //Ii -- archaic
  ꦈ: "U", //U
  ꦉ: "rê", //pa cêrêk
  ꦊ: "lê", //nga lêlêt
  ꦋ: "lêu", //nga lêlêt Raswadi -- archaic
  ꦌ: "E", //E
  ꦍ: "Ai", //Ai
  ꦎ: "O", //O

  ꦏ: "ka",
  ꦐ: "qa", //Ka Sasak
  ꦑ: "kʰa", //Murda
  ꦒ: "ga",
  ꦓ: "gʰa", //Murda
  ꦔ: "nga", //ṅa
  ꦕ: "ca",
  ꦖ: "cʰa", //Murda
  ꦗ: "ja",
  ꦘ: "Nya", //Ja Sasak, Nya Murda
  ꦙ: "jʰa", //Ja Mahaprana
  ꦚ: "nya", //ña
  ꦛ: "tha", //'ṭa',
  ꦜ: "ṭʰa", //Murda
  ꦝ: "dha", //'ḍa',
  ꦞ: "ḍʰa", //Murda
  ꦟ: "ṇa", //Murda
  ꦠ: "ta",
  ꦡ: "ṭa", //Murda
  ꦢ: "da",
  ꦣ: "ḍa", //Murda
  ꦤ: "na",
  ꦥ: "pa",
  ꦦ: "pʰa", //Murda
  ꦧ: "ba",
  ꦨ: "bʰa", //Murda
  ꦩ: "ma",
  ꦪ: "ya",
  ꦫ: "ra",
  ꦬ: "Ra", //Ra Agung
  ꦭ: "la",
  ꦮ: "wa",
  ꦯ: "śa", //Murda
  ꦰ: "ṣa", //Sa Mahaprana
  ꦱ: "sa",
  ꦲ: "ha", //could also be "a" or any sandhangan swara

  "꦳": "​", //cecak telu -- diganti zero-width joiner (tmp)
  "ꦺꦴ": "o", //taling tarung
  "ꦴ": "a",
  "ꦶ": "i",
  "ꦷ": "ii",
  "ꦸ": "u",
  "ꦹ": "uu",
  "ꦺ": "e",
  "ꦻ": "ai",
  "ꦼ": "ê",
  "ꦽ": "rê",
  "ꦾ": "ya",
  "ꦿ": "ra",

  "꧀": "​", //pangkon -- diganti zero-width joiner (tmp)

  "꧁": "—",
  "꧂": "—",
  "꧃": "–",
  "꧄": "–",
  "꧅": "–",
  "꧆": "",
  "꧇": "​", //titik dua -- diganti zero-width joiner (tmp)
  "꧈": ",",
  "꧉": ".",
  "꧊": "qqq",
  "꧋": "–",
  "꧌": "–",
  "꧍": "–",
  ꧏ: "²",
  "꧐": "0",
  "꧑": "1",
  "꧒": "2",
  "꧓": "3",
  "꧔": "4",
  "꧕": "5",
  "꧖": "6",
  "꧗": "7",
  "꧘": "8",
  "꧙": "9",
  "꧞": "—",
  "꧟": "—",
  "​": " ", //zero-width space
};

/**
 * Check the matra (sandhangan swara).
 * If the character is a vowel, return the matra (sandhangan swara).
 * @param {string} str
 * @param {TranslateConfiguration} config
 */
function getMatra(str: string, config: TranslateConfiguration) {
  let i = 0;

  if (str.length < 1) {
    return "꧀";
  }

  while (str[i] === "h") {
    i++;
    if (i >= str.length) {
      break;
    }
  }

  if (i < str.length) str = str.substring(i);

  const matramap1: Matra = {
    ā: "ꦴ",
    â: "ꦴ",
    e: "ꦺ",
    è: "ꦺ",
    é: "ꦺ",
    i: "ꦶ",
    ī: "ꦷ",
    o: "ꦺꦴ",
    u: "ꦸ",
    ū: "ꦹ",
    x: "ꦼ",
    ě: "ꦼ",
    ĕ: "ꦼ",
    ê: "ꦼ",
    ō: "ꦼꦴ",
    ô: "",
    A: "ꦄ",
    E: "ꦌ",
    È: "ꦌ",
    É: "ꦌ",
    I: "ꦆ",
    U: "ꦈ",
    O: "ꦎ",
    X: "ꦄꦼ",
    Ě: "ꦄꦼ",
    Ê: "ꦄꦼ",
    ṛ: "ꦽ",
    aa: "ꦴ",
    ai: "ꦻ",
    au: "ꦻꦴ",
    ii: "ꦷ",
    uu: "ꦹ",
  };

  const matramap2: Matra = {
    ā: "ꦴ",
    â: "ꦴ",
    e: "ꦼ",
    è: "ꦺ",
    é: "ꦺ",
    i: "ꦶ",
    ī: "ꦷ",
    u: "ꦸ",
    ū: "ꦹ",
    o: "ꦺꦴ",
    x: "ꦼ",
    ě: "ꦼ",
    ĕ: "ꦼ",
    ê: "ꦼ",
    ô: "",
    ō: "ꦼꦴ",
    A: "ꦄ",
    E: "ꦄꦼ",
    È: "ꦌ",
    É: "ꦌ",
    I: "ꦆ",
    U: "ꦈ",
    O: "ꦎ",
    X: "ꦄꦼ",
    Ě: "ꦄꦼ",
    Ê: "ꦄꦼ",
    ṛ: "ꦽ",
    aa: "ꦴ",
    ai: "ꦻ",
    au: "ꦻꦴ",
    ii: "ꦷ",
    uu: "ꦹ",
  };

  const matramap: Matra = config.typeMode ? matramap1 : matramap2;

  if (matramap[str] !== undefined) {
    return matramap[str];
  }

  return "";
}

/**
 * Get the consonant.
 * If the character is a consonant, return the consonant character.
 * @param {string} str
 * @param {TranslateConfiguration} config
 *
 * TOC:
 * 1. ends with 'h' -- th: thr, thl, thw, thy; dh: dhr, dhl, dhw, dhy; hy,hh, rh, kh, gh, ch, jh, ṭh, th: thr, thl; dh: dhr, dhl; hy,hh, rh, kh, gh, ch, jh, ṭh, ḍh, ph, bh, sh, h
 * 2. ends with 'g' -- ng: ngr, ngy, nggr, nggl, nggw, nggy, ngg, ngng, ngl, njr, ngw; rg, hg, gg, g
 * 3. ends with 'y' -- ny: nyr, nyl; ry, dhy, thy, y
 * 4. ends with 'r', panjingan 'l'/'w' -- hr, rr, nggr; ll, rl, hl; rw, hw, ngw
 * 5. ends with 'c', and 'j' -- nc: ncr, ncl; rc; nj: njr, njl; rj;
 * 6. ends with 'ñ' -- jñ: jny
 *
 * @TODO: still case sensitive, e.g. "RR" is still incorrect.
 */
function getShift(str: string, config: TranslateConfiguration): Shift {
  str = str.toLowerCase();

  if (str.indexOf("th") === 0) {
    // suku kata diawali 'th'
    if (str.indexOf("thr") === 0) {
      // cakra
      return formatShift({ CoreSound: "ꦛꦿ", len: 3 });
    } else if (str.indexOf("thl") === 0) {
      //thl
      return formatShift({ CoreSound: "ꦛ꧀ꦭ", len: 3 });
    } else if (str.indexOf("thy") === 0) {
      //thy -- ...
      return formatShift({
        CoreSound: "" + getCoreSound(str[0], config).CoreSound + "ꦛꦾ",
        len: 3,
      });
    } else if (str.indexOf("thw") === 0) {
      //thw -- ...
      return formatShift({
        CoreSound: "" + getCoreSound(str[0], config).CoreSound + "ꦛ꧀ꦮ",
        len: 3,
      });
    } else {
      return formatShift({ CoreSound: "ꦛ", len: 2 });
    }
  } else if (str.indexOf("dh") === 0) {
    // suku kata diawali 'dh'
    if (str.indexOf("dhr") === 0) {
      // cakra
      return formatShift({ CoreSound: "ꦝꦿ", len: 3 });
    } else if (str.indexOf("dhl") === 0) {
      //dhl
      return formatShift({ CoreSound: "ꦝ꧀ꦭ", len: 3 });
    } else if (str.indexOf("dhy") === 0) {
      //dhy -- dhyaksa
      return formatShift({
        CoreSound: "" + getCoreSound(str[0], config).CoreSound + "ꦝꦾ",
        len: 3,
      });
    } else if (str.indexOf("dhw") === 0) {
      //dhw -- dhwani
      return formatShift({
        CoreSound: "" + getCoreSound(str[0], config).CoreSound + "ꦝ꧀ꦮ",
        len: 3,
      });
    } else {
      return formatShift({ CoreSound: "ꦝ", len: 2 });
    }
  } else if (str.indexOf("hy") === 0) {
    //hyang
    return formatShift({
      CoreSound: "" + getCoreSound(str[0], config).CoreSound + "ꦲꦾ",
      len: 2,
    });
  } else if (str.indexOf("hh") === 0) {
    //hh
    return formatShift({
      CoreSound: "" + getCoreSound(str[0], config).CoreSound + "ꦃꦲ",
      len: 2,
    });
  } else if (str.indexOf("rh") === 0) {
    //rh (kata berakhiran r diikuti kata berawalan h
    return formatShift({
      CoreSound: "" + getCoreSound(str[0], config).CoreSound + "ꦂꦲ",
      len: 2,
    });
  } else if (str.indexOf("kh") === 0) {
    //kh (aksara murda)
    return formatShift({ CoreSound: "ꦑ", len: 2 });
  } else if (str.indexOf("gh") === 0) {
    //gh (aksara murda)
    return formatShift({ CoreSound: "ꦓ", len: 2 });
  } else if (str.indexOf("ch") === 0) {
    //ch (aksara murda)
    return formatShift({ CoreSound: "ꦖ", len: 2 });
  } else if (str.indexOf("jh") === 0) {
    //jh (aksara murda)
    return formatShift({ CoreSound: "ꦙ", len: 2 });
  } else if (str.indexOf("ṭh") === 0) {
    //ṭh (aksara murda)
    return formatShift({ CoreSound: "ꦜ", len: 2 });
  } else if (str.indexOf("ḍh") === 0) {
    //ḍh (aksara murda)
    return formatShift({ CoreSound: "ꦞ", len: 2 });
  } else if (str.indexOf("ph") === 0) {
    //ph (aksara murda)
    return formatShift({ CoreSound: "ꦦ", len: 2 });
  } else if (str.indexOf("bh") === 0) {
    //bh (aksara murda)
    return formatShift({ CoreSound: "ꦨ", len: 2 });
  } else if (str.indexOf("sh") === 0) {
    //sh (aksara murda)
    return formatShift({ CoreSound: "ꦯ", len: 2 });
  } else if (str.indexOf("h") === 1) {
    //h
    return formatShift({
      CoreSound: "" + getCoreSound(str[0], config).CoreSound + "꧀ꦲ",
      len: 2,
    });
  } else if (str.indexOf("h") > 1) {
    //suku kata memiliki konsonan 'h' yang tidak di awal suku
    let sound = "";
    let len = 0;
    for (let index = 0; index < str.length; index++) {
      const c = str[index];
      if (!isVowel(c)) {
        sound = sound + resolveCharacterSound(c, config);
        len++;
      } else {
        break;
      }
    }
    return formatShift({ CoreSound: sound, len: len });
  }

  //nga
  if (str.indexOf("ng") === 0) {
    //suku kata diawali 'ng'
    if (str.indexOf("ngr") === 0) {
      //cakra
      return formatShift({
        CoreSound: "" + getCoreSound(str[0], config).CoreSound + "ꦔꦿ",
        len: 3,
      });
    } else if (str.indexOf("ngy") === 0) {
      //pengkal
      return formatShift({
        CoreSound: "" + getCoreSound(str[0], config).CoreSound + "ꦔꦾ",
        len: 3,
      });
    } else if (str.indexOf("nggr") === 0) {
      //nggronjal
      return formatShift({
        CoreSound: "" + getCoreSound(str[0], config).CoreSound + "ꦔ꧀ꦒꦿ",
        len: 4,
      });
    } else if (str.indexOf("nggl") === 0) {
      //nggl-
      return formatShift({
        CoreSound: "" + getCoreSound(str[0], config).CoreSound + "ꦔ꧀ꦒ꧀ꦭ",
        len: 4,
      });
    } else if (str.indexOf("nggw") === 0) {
      //nggw-, munggwing
      return formatShift({
        CoreSound: "" + getCoreSound(str[0], config).CoreSound + "ꦔ꧀ꦒ꧀ꦮ",
        len: 4,
      });
    } else if (str.indexOf("nggy") === 0) {
      //nggy-, anggyat
      return formatShift({
        CoreSound: "" + getCoreSound(str[0], config).CoreSound + "ꦔ꧀ꦒꦾ",
        len: 4,
      });
    } else if (str.indexOf("ngg") === 0) {
      //ngg
      return formatShift({
        CoreSound: "" + getCoreSound(str[0], config).CoreSound + "ꦔ꧀ꦒ",
        len: 3,
      }); /*
        } else if (str.indexOf("ngng") === 0) { //ngng
        return formatShift({ CoreSound: "" + getCoreSound(str[0], config).CoreSound + "ꦔ꧀ꦔ", len: 4 });*/
    } else if (str.indexOf("ngl") === 0) {
      //ngl, e.g. ngluwari
      return formatShift({
        CoreSound: "" + getCoreSound(str[0], config).CoreSound + "ꦔ꧀ꦭ",
        len: 3,
      });
    } else if (str.indexOf("ngw") === 0) {
      //ngw, e.g. ngwiru
      return formatShift({
        CoreSound: "" + getCoreSound(str[0], config).CoreSound + "ꦔ꧀ꦮ",
        len: 3,
      });
    } else {
      return formatShift({ CoreSound: "ꦁ", len: 2 });
    }
  } else if (str.indexOf("rg") === 0) {
    //'rg', e.g. amarga
    return formatShift({ CoreSound: "ꦂꦒ", len: 2 });
  } else if (str.indexOf("hg") === 0) {
    //'hg', e.g. dahgene
    return formatShift({ CoreSound: "ꦃꦒ", len: 2 });
  } else if (str.indexOf("gg") === 0) {
    //'gg', e.g. root word ends with 'g' with suffix starts with vocal
    return formatShift({ CoreSound: "ꦒ꧀ꦒ", len: 2 });
  } else if (str.indexOf("g") === 1) {
    //g
    return formatShift({
      CoreSound: "" + getCoreSound(str[0], config).CoreSound + "꧀ꦒ",
      len: 2,
    });
  } else if (str.indexOf("g") > 1) {
    //suku kata memiliki konsonan 'g' yang tidak di awal suku
    let sound = "";
    let len = 0;
    for (let index = 0; index < str.length; index++) {
      const c = str[index];
      if (!isVowel(c)) {
        sound = sound + resolveCharacterSound(c, config);
        len++;
      } else {
        break;
      }
    }
    return formatShift({ CoreSound: sound, len: len });
  }

  if (str.indexOf("jñ") === 0) {
    //suku kata diawali 'jñ'
    return formatShift({ CoreSound: "ꦘ", len: 2 });
  }

  if (str.indexOf("jny") === 0) {
    //suku kata diawali 'jñ'
    return formatShift({ CoreSound: "ꦘ", len: 3 }); // still not working, 22 Jan 19
  }

  //nya
  if (str.indexOf("ny") === 0) {
    //suku kata diawali 'ny'
    if (str.indexOf("nyr") === 0) {
      //cakra
      return formatShift({ CoreSound: "ꦚꦿ", len: 3 });
    } else if (str.indexOf("nyl") === 0) {
      //nyl, e.g. nylonong
      return formatShift({ CoreSound: "ꦚ꧀ꦭ", len: 3 });
    } else {
      return formatShift({ CoreSound: "ꦚ", len: 2 });
    }
  } else if (str.indexOf("ry") === 0) {
    //'ry', e.g. Suryati, Wiryadi
    if (str.indexOf("ryy") === 0) {
      return formatShift({ CoreSound: "ꦂꦪꦾ", len: 3 });
    } else {
      return formatShift({ CoreSound: "ꦂꦪ", len: 2 });
    }
  } else if (str.indexOf("yy") === 0) {
    //'yy', e.g. Duryyodhana (Jawa Kuno)
    return formatShift({ CoreSound: "ꦪꦾ", len: 2 });
  } else if (str.indexOf("qy") === 0) {
    //qy -- only pengkal
    return formatShift({ CoreSound: "ꦾ", len: 1 });
  } else if (str.indexOf("y") === 1) {
    //pengkal
    return formatShift({
      CoreSound: "" + getCoreSound(str[0], config).CoreSound + "ꦾ",
      len: 2,
    });
  } else if (str.indexOf("y") > 1) {
    //suku kata memiliki konsonan 'y' yang tidak di awal suku
    let sound = "";
    let len = 0;
    for (let index = 0; index < str.length; index++) {
      const c = str[index];
      if (!isVowel(c)) {
        sound += resolveCharacterSound(c, config);
        len++;
      } else {
        break;
      }
    }
    return formatShift({ CoreSound: sound, len: len });
  }

  if (str.indexOf("hr") === 0) {
    //hr-
    return formatShift({
      CoreSound: "" + getCoreSound(str[0], config).CoreSound + "ꦃꦿ",
      len: 2,
    });
  } else if (str.indexOf("rr") === 0) {
    //rr -- no cakra
    return formatShift({
      CoreSound: "" + getCoreSound(str[0], config).CoreSound + "ꦂꦫ",
      len: 2,
    });
  } else if (str.indexOf("wr") === 0) {
    //wr -- panjingan + cakra
    return formatShift({ CoreSound: "" + "ꦮꦿ", len: 2 });
  } else if (str.indexOf("qr") === 0) {
    //qr -- only cakra
    return formatShift({ CoreSound: "ꦿ", len: 1 });
  } else if (str.indexOf("r") === 1) {
    //cakra
    return formatShift({
      CoreSound: "" + getCoreSound(str[0], config).CoreSound + "ꦿ",
      len: 2,
    });
  } else if (str.indexOf("r") > 1) {
    //suku kata memiliki konsonan 'r' yang tidak di awal suku
    let sound = "";
    let len = 0;
    for (let index = 0; index < str.length; index++) {
      const c = str[index];
      if (!isVowel(c)) {
        sound += resolveCharacterSound(c, config);
        len++;
      } else {
        break;
      }
    }
    return formatShift({ CoreSound: sound, len: len });
  }

  // panjingan -l
  if (str.indexOf("ll") === 0) {
    //ll
    return formatShift({
      CoreSound: "" + getCoreSound(str[0], config).CoreSound + "ꦭ꧀ꦭ",
      len: 2,
    });
  } else if (str.indexOf("rl") === 0) {
    //rl (kata berakhiran r diikuti kata berawalan l
    return formatShift({
      CoreSound: "" + getCoreSound(str[0], config).CoreSound + "ꦂꦭ",
      len: 2,
    });
  } else if (str.indexOf("hl") === 0) {
    //hl
    return formatShift({
      CoreSound: "" + getCoreSound(str[0], config).CoreSound + "ꦃꦭ",
      len: 2,
    });
  } else if (str.indexOf("ql") === 0) {
    //only panjingan
    return formatShift({ CoreSound: "꧀ꦭ", len: 2 });
  } else if (str.indexOf("l") === 1) {
    //l
    return formatShift({
      CoreSound: "" + getCoreSound(str[0], config).CoreSound + "꧀ꦭ",
      len: 2,
    });
  } else if (str.indexOf("l") > 1) {
    //suku kata memiliki konsonan 'l' yang tidak di awal suku//panjingan
    let sound = "";
    let len = 0;
    for (let index = 0; index < str.length; index++) {
      const c = str[index];
      if (!isVowel(c)) {
        sound = sound + resolveCharacterSound(c, config);
        len++;
      } else {
        break;
      }
    }
    return formatShift({ CoreSound: sound, len: len });
  }

  // panjingan -w
  if (str.indexOf("rw") === 0) {
    //rw
    return formatShift({
      CoreSound: "" + getCoreSound(str[0], config).CoreSound + "ꦂꦮ",
      len: 2,
    }); //error untuk 'rwi', 'rwab'
  } else if (str.indexOf("hw") === 0) {
    //hw
    return formatShift({
      CoreSound: "" + getCoreSound(str[0], config).CoreSound + "ꦃꦮ",
      len: 2,
    }); //ꦲ꧀ꦮ
  } else if (str.indexOf("qw") === 0) {
    //only panjingan
    return formatShift({ CoreSound: "꧀ꦮ", len: 2 });
  } else if (str.indexOf("w") === 1) {
    //w
    return formatShift({
      CoreSound: "" + getCoreSound(str[0], config).CoreSound + "꧀ꦮ",
      len: 2,
    });
  } else if (str.indexOf("w") > 1) {
    //suku kata memiliki konsonan 'w' yang tidak di awal suku//panjingan
    let sound = "";
    let len = 0;
    for (let index = 0; index < str.length; index++) {
      const c = str[index];
      if (!isVowel(c)) {
        sound = sound + resolveCharacterSound(c, config);
        len++;
      } else {
        break;
      }
    }
    return formatShift({ CoreSound: sound, len: len });
  }

  if (str.indexOf("nc") === 0) {
    //nc
    if (str.indexOf("ncr") === 0) {
      //ncr -- kencrung
      return formatShift({
        CoreSound: "" + getCoreSound(str[0], config).CoreSound + "ꦚ꧀ꦕꦿ",
        len: 3,
      });
    } else if (str.indexOf("ncl") === 0) {
      //ncl -- kinclong
      return formatShift({
        CoreSound: "" + getCoreSound(str[0], config).CoreSound + "ꦚ꧀ꦕ꧀ꦭ",
        len: 3,
      });
    } else {
      return formatShift({
        CoreSound: "" + getCoreSound(str[0], config).CoreSound + "ꦚ꧀ꦕ",
        len: 2,
      });
    }
  } else if (str.indexOf("rc") === 0) {
    //rc -- arca
    return formatShift({
      CoreSound: "" + getCoreSound(str[0], config).CoreSound + "ꦂꦕ",
      len: 2,
    });
  } else if (str.indexOf("c") === 1) {
    //c
    return formatShift({
      CoreSound: "" + getCoreSound(str[0], config).CoreSound + "꧀ꦕ",
      len: 2,
    });
  } else if (str.indexOf("c") > 1) {
    let sound = "";
    let len = 0;
    for (let index = 0; index < str.length; index++) {
      const c = str[index];
      if (!isVowel(c)) {
        sound = sound + resolveCharacterSound(c, config);
        len++;
      } else {
        break;
      }
    }
    return formatShift({ CoreSound: sound, len: len });
  }

  if (str.indexOf("nj") === 0) {
    //nj
    if (str.indexOf("njr") === 0) {
      //njr -- anjrah
      return formatShift({
        CoreSound: "" + getCoreSound(str[0], config).CoreSound + "ꦚ꧀ꦗꦿ",
        len: 3,
      });
    } else if (str.indexOf("njl") === 0) {
      //njl -- anjlog
      return formatShift({
        CoreSound: "" + getCoreSound(str[0], config).CoreSound + "ꦚ꧀ꦗ꧀ꦭ",
        len: 3,
      });
    } else {
      return formatShift({
        CoreSound: "" + getCoreSound(str[0], config).CoreSound + "ꦚ꧀ꦗ",
        len: 2,
      });
    }
  } else if (str.indexOf("rj") === 0) {
    //'rj'
    return formatShift({ CoreSound: "ꦂꦗ", len: 2 });
  } else if (str.indexOf("j") === 1) {
    //j
    return formatShift({
      CoreSound: "" + getCoreSound(str[0], config).CoreSound + "꧀ꦗ",
      len: 2,
    });
  } else if (str.indexOf("j") > 1) {
    let sound = "";
    let len = 0;
    for (let index = 0; index < str.length; index++) {
      const c = str[index];
      if (!isVowel(c)) {
        sound = sound + resolveCharacterSound(c, config);
        len++;
      } else {
        break;
      }
    }
    return formatShift({ CoreSound: sound, len: len });
  }

  return formatShift({ CoreSound: null, len: 1 });
}

/**
 * Get the core sound of a character.
 * Return 'aksara nglegana' or 'aksara istimewa' (f/v/z/pangkon).
 * @param {string} str
 * @param {TranslateConfiguration} config
 */
function getCoreSound(str: string, config: TranslateConfiguration): Shift {
  const consonantMap1: Consonant = {
    A: "ꦄ", //A
    B: "ꦧ", //B
    C: "ꦕ", //C
    D: "ꦢ", //D
    E: "ꦌ", //E
    F: "ꦥ꦳", //F
    G: "ꦒ", //G
    H: "ꦲ", //H
    I: "ꦆ", //I
    J: "ꦗ", //J
    K: "ꦏ", //K
    L: "ꦭ", //L
    M: "ꦩ", //M
    N: "ꦤ", //N
    O: "ꦎ", //O
    P: "ꦥ", //P
    Q: "꧀", //Q
    R: "ꦂ", //R
    S: "ꦱ", //S
    T: "ꦠ", //T
    U: "ꦈ", //U
    V: "ꦮ꦳", //V
    W: "ꦮ", //W
    X: "ꦼ", //X
    Y: "ꦪ", //Y
    Z: "ꦗ꦳", //Z
    a: "ꦲ", //a
    b: "ꦧ", //b
    c: "ꦕ", //c
    d: "ꦢ", //d
    e: "ꦲꦺ", //e
    f: "ꦥ꦳", //f
    g: "ꦒ", //g
    h: "ꦃ", //h
    i: "ꦲꦶ", //i
    j: "ꦗ", //j
    k: "ꦏ", //k
    l: "ꦭ", //l
    m: "ꦩ", //m
    n: "ꦤ", //n
    o: "ꦲꦺꦴ", //o
    p: "ꦥ", //p
    q: "꧀", //q
    r: "ꦂ", //r
    s: "ꦱ", //s
    ś: "ꦯ", //ś
    t: "ꦠ", //t
    u: "ꦲꦸ", //u
    v: "ꦮ꦳", //v
    w: "ꦮ", //w
    x: "ꦲꦼ", //x
    y: "ꦪ", //y
    z: "ꦗ꦳", //z
    È: "ꦌ", //È
    É: "ꦌ", //É
    Ê: "ꦄꦼ", //Ê
    Ě: "ꦄꦼ", //Ě
    è: "ꦲꦺ", //è
    é: "ꦲꦺ", //é
    ê: "ꦲꦼ", //ê
    ě: "ꦲꦼ", //ě
    ô: "ꦲ", //ô
    ñ: "ꦚ", //enye
    ṇ: "ꦟ",
    ḍ: "ꦝ",
    ṭ: "ꦛ",
    ṣ: "ꦰ",
    ṛ: "ꦽ",
  };

  const consonantMap2: Consonant = {
    A: "ꦄ", //A
    B: "ꦨ", //B
    C: "ꦖ", //C
    D: "ꦣ", //D
    E: "ꦌ", //E
    F: "ꦦ꦳", //F
    G: "ꦓ", //G
    H: "ꦲ꦳", //H
    I: "ꦆ", //I
    J: "ꦙ", //J
    K: "ꦑ", //K
    L: "ꦭ", //L
    M: "ꦩ", //M
    N: "ꦟ", //N
    O: "ꦎ", //O
    P: "ꦦ", //P
    Q: "꧀", //Q
    R: "ꦬ", //R
    ś: "ꦯ", //ś
    S: "ꦯ", //S
    T: "ꦡ", //T
    U: "ꦈ", //U
    V: "ꦮ꦳", //V
    W: "ꦮ", //W
    X: "ꦼ", //X
    Y: "ꦪ", //Y
    Z: "ꦗ꦳", //Z
    a: "ꦄ", //a
    b: "ꦧ", //b
    c: "ꦕ", //c
    d: "ꦢ", //d
    e: "ꦌ", //e
    f: "ꦥ꦳", //f
    g: "ꦒ", //g
    h: "ꦃ", //h
    i: "ꦆ", //i
    j: "ꦗ", //j
    k: "ꦏ", //k
    l: "ꦭ", //l
    m: "ꦩ", //m
    n: "ꦤ", //n
    o: "ꦎ", //o
    p: "ꦥ", //p
    q: "꧀", //q
    r: "ꦂ", //r
    s: "ꦱ", //s
    t: "ꦠ", //t
    u: "ꦈ", //u
    v: "ꦮ꦳", //v
    w: "ꦮ", //w
    x: "ꦼ", //x
    ĕ: "ꦼ", //ĕ
    ě: "ꦼ", //ě
    ê: "ꦼ", //ê
    ū: "ꦹ", //ū
    y: "ꦪ", //y
    z: "ꦗ꦳", //z
    È: "ꦌ", //È
    É: "ꦌ", //É
    Ê: "ꦄꦼ", //Ê
    Ě: "ꦄꦼ", //Ě
    è: "ꦌ", //è
    é: "ꦌ", //é
    ṇ: "ꦟ",
    ḍ: "ꦝ",
    ṭ: "ꦛ",
    ṣ: "ꦰ",
    ṛ: "ꦽ",
  };

  const consonantMap: Consonant = config.withMurda
    ? consonantMap2
    : consonantMap1;
  const h_shift: Shift = getShift(str, config);
  let core = str;

  if (h_shift.CoreSound === null) {
    if (consonantMap[str.charAt(0)]) core = consonantMap[str.charAt(0)];
    return formatShift({ CoreSound: core, len: 1 });
  }

  return h_shift;
}

/**
 * Get the special sound of a character.
 * @param {string} str
 */
function getSpecialSound(str: string): string | null {
  const specialsoundMap: SpecialSound = {
    f: "ꦥ꦳꧀",
    v: "ꦮ꦳꧀",
    z: "ꦗ꦳꧀",
    ś: "ꦯ",
    q: "꧀" /*pangkon*/,
  };

  if (specialsoundMap[str] !== undefined) {
    return specialsoundMap[str];
  }

  return null;
}

/**
 * Resolve the core sound of a character.
 * Return punctuation, digits, vowels, or nglegana + pangkon.
 * @param {string} c
 * @param {TranslateConfiguration} config
 */
function resolveCharacterSound(
  c: string,
  config: TranslateConfiguration,
): string {
  const str = "" + c;
  if (isDigit(c)) {
    return "" + ("꧇" + parseInt(c));
  } else if (isHR(str[0])) {
    return "" + getCoreSound(str, config).CoreSound; //layar dan wignyan
  } else if (isCJ(str[1])) {
    return "" + getCoreSound(str, config).CoreSound + "꧀"; //anuswara
  } else if (isConsonant(str[0])) {
    return "" + getCoreSound(str, config).CoreSound + "꧀";
  } else {
    return "" + getCoreSound(str, config).CoreSound;
  }
}

/**
 * Translate each syllable.
 * @param {string} str
 * @param {TranslateConfiguration} config
 * @param {boolean} vowelPrev
 */
function getSound(
  str: string,
  config: TranslateConfiguration,
  vowelPrev: boolean,
) {
  str = trim(str);

  if (str === null || str === "") return "";

  const specialSound = getSpecialSound(str);

  if (specialSound !== null && str.length === 1) return specialSound;

  if (str.length === 1) return resolveCharacterSound(str[0], config);

  const core_sound: Shift = getCoreSound(str, config);
  let konsonan = "";
  let matra = "";

  // aeiou (suku, wulu, pepet, taling, taling tarung, dll.)
  if (core_sound.len >= 1)
    matra = getMatra(str.substring(core_sound.len), config);

  if (str.indexOf("nggr") === 0) {
    //nggr-
    if (vowelPrev)
      konsonan = "ꦁꦒꦿ"; //<vowel>nggr-, e.g. panggrahita
    else konsonan = "ꦔ꧀ꦒꦿ"; //<nonvowel>nggr-, i.e. nggronjal
  } else if (str.indexOf("nggl") === 0) {
    //nggl-
    konsonan = "ꦔ꧀ꦒ꧀ꦭ";
  } else if (str.indexOf("nggw") === 0) {
    //nggw-
    konsonan = "ꦔ꧀ꦒ꧀ꦮ";
  } else if (str.indexOf("nggy") === 0) {
    //nggy-
    konsonan = "ꦔ꧀ꦒꦾ";
  } else if (str.indexOf("ngg") === 0) {
    //ngg-
    if (vowelPrev)
      konsonan = "ꦁꦒ"; //<vowel>ngg-, e.g. tunggal
    else konsonan = "ꦔ꧀ꦒ"; //<nonvowel>ngg-, i.e. nggambar
  } else if (str.indexOf("ngl") === 0) {
    //ngl-
    konsonan = "ꦔ꧀ꦭ";
  } else if (str.indexOf("ngw") === 0) {
    //ngw-
    konsonan = "ꦔ꧀ꦮ";
  } else if (str.indexOf("ncl") === 0) {
    //ncl-
    konsonan = "ꦚ꧀ꦕ꧀ꦭ";
  } else if (str.indexOf("ncr") === 0) {
    //ncr-
    konsonan = "ꦚ꧀ꦕꦿ";
  } else if (str.indexOf("njl") === 0) {
    //njl-
    konsonan = "ꦚ꧀ꦗ꧀ꦭ";
  } else if (str.indexOf("njr") === 0) {
    //njr-
    konsonan = "ꦚ꧀ꦗꦿ";
  } else if (core_sound.CoreSound === "ꦤꦚ꧀ꦕ꧀ꦭ") {
    // -ncl-
    konsonan = "ꦚ꧀ꦕ꧀ꦭ"; //-ncl-
  } else if (core_sound.CoreSound === "ꦤꦚ꧀ꦕꦿ") {
    // -ncr-
    konsonan = "ꦚ꧀ꦕꦿ"; //-ncr-*/
  } else if (core_sound.CoreSound === "ꦤꦚ꧀ꦕ") {
    // -nc-
    konsonan = "ꦚ꧀ꦕ"; //-nyc-/*
  } else if (core_sound.CoreSound === "ꦤꦚ꧀ꦗ꧀ꦭ") {
    // -njl-
    konsonan = "ꦚ꧀ꦗ꧀ꦭ"; //-njl-
  } else if (core_sound.CoreSound === "ꦤꦚ꧀ꦗꦿ") {
    // -njr-
    konsonan = "ꦚ꧀ꦗꦿ"; //-njr-*/
  } else if (core_sound.CoreSound === "ꦤꦚ꧀ꦗ") {
    // -nj-
    konsonan = "ꦚ꧀ꦗ"; //-nyj-
  } else if (core_sound.CoreSound === "ꦢꦝ꧀ꦮ") {
    // -dhw-
    konsonan = "ꦝ꧀ꦮ"; //-dhw-
  } else if (core_sound.CoreSound === "ꦢꦝꦾ") {
    // -dhy-
    konsonan = "ꦝꦾ"; //-dhy-
  } else if (core_sound.CoreSound === "ꦠꦛ꧀ꦮ") {
    // -thw-
    konsonan = "ꦛ꧀ꦮ"; //-dhw-
  } else if (core_sound.CoreSound === "ꦠꦛꦾ") {
    // -thy-
    konsonan = "ꦛꦾ"; //-dhy-
  } else if (find(core_sound.CoreSound, "ꦾ") && matra === "꧀") {
    // pengkal
    konsonan = core_sound.CoreSound;
    matra = ""; //-y-
  } else if (find(core_sound.CoreSound, "ꦿ") && matra === "꧀") {
    // cakra
    konsonan = core_sound.CoreSound;
    matra = ""; //-r-
  } else if (find(core_sound.CoreSound, "ꦿ") && matra === "ꦼ") {
    // cakra keret
    if (
      (str[0] === "n" && str[1] === "y") ||
      ((str[0] === "t" || str[0] === "d") && str[1] === "h")
    ) {
      konsonan = getCoreSound(str[0] + str[1], config).CoreSound + "ꦽ";
      matra = ""; //nyrê-, thrê-, dhrê-
    } else if (str[0] === "n" && str[1] === "g") {
      if (str[2] === "g") konsonan = "ꦔ꧀ꦒꦽ";
      else konsonan = "ꦔꦽ";
      matra = ""; //nggrê-/ngrê-
    } else {
      konsonan = getCoreSound(str[0], config).CoreSound + "ꦽ";
      matra = ""; //-rê-
    }
  } else if (find(core_sound.CoreSound, "ꦭ") && matra === "ꦼ") {
    // nga lelet
    if (
      (str[0] === "n" && str[1] === "y") ||
      ((str[0] === "t" || str[0] === "d") && str[1] === "h")
    ) {
      konsonan = getCoreSound(str[0] + str[1], config).CoreSound + "꧀ꦭꦼ";
      matra = ""; //nylê-, thlê-, dhlê-
    } else if (str[0] === "n" && str[1] === "g") {
      if (str[2] === "g") konsonan = "ꦔ꧀ꦒ꧀ꦭꦼ";
      else konsonan = "ꦔ꧀ꦭꦼ";
      matra = ""; //ngglê-/nglê-
    } else if (str[0] === "l") {
      konsonan = "ꦊ";
      matra = ""; //-lê-
    } else {
      konsonan = getCoreSound(str[0], config).CoreSound + "꧀ꦭꦼ";
      matra = ""; //-lê-
    }
  } else if (
    core_sound.CoreSound === "ꦛꦿ" ||
    core_sound.CoreSound === "ꦝꦿ" ||
    core_sound.CoreSound === "ꦔꦿ" ||
    core_sound.CoreSound === "ꦚꦿ"
  ) {
    // i.e. nyruput
    konsonan = core_sound.CoreSound;
    if (matra === "꧀") matra = "";
  } else if (core_sound.CoreSound === "ꦭꦭ꧀ꦭ") {
    // -ll-
    konsonan = "ꦭ꧀ꦭ"; //double -l-
  } else if (core_sound.CoreSound === "ꦂꦂꦫ") {
    // -rr-
    konsonan = "ꦂꦫ"; //double -r-
  } else if (core_sound.CoreSound === "ꦂꦂꦲ") {
    // -rh-
    konsonan = "ꦂꦲ"; //-rh-
  } else if (core_sound.CoreSound === "ꦂꦂꦭ") {
    // -rl-
    konsonan = "ꦂꦭ"; //-rl-
  } else if (core_sound.CoreSound === "ꦂꦂꦮ") {
    // -rw-
    if (vowelPrev)
      konsonan = "ꦂꦮ"; //-rw- -- arwana
    else konsonan = "ꦫ꧀ꦮ"; //rw- -- rwa/rwi/rwab
  } else if (core_sound.CoreSound === "ꦂꦂꦕ") {
    // -rc-
    konsonan = "ꦂꦕ"; //-rc-
  } else if (core_sound.CoreSound === "ꦃꦃꦲ") {
    // -hh-
    konsonan = "ꦃꦲ"; //double -h-
  } else if (core_sound.CoreSound === "ꦃꦃꦭ") {
    // -hl-
    if (vowelPrev)
      konsonan = "ꦃꦭ"; //-hl-
    else konsonan = "ꦲ꧀ꦭ"; //hlam
  } else if (core_sound.CoreSound === "ꦃꦃꦮ") {
    // -hw-
    if (vowelPrev)
      konsonan = "ꦃꦮ"; //-hw-
    else konsonan = "ꦲ꧀ꦮ"; //hwab,hwan
  } else if (core_sound.CoreSound === "ꦃꦲꦾ") {
    // -hy-
    if (vowelPrev)
      konsonan = "ꦃꦪ"; //sembahyang
    else konsonan = "ꦲꦾ"; //hyang/*
  } else if (core_sound.CoreSound === "ꦃꦃꦽ") {
    // hrx-
    konsonan = "ꦲꦿ"; //hrx-
  } else if (core_sound.CoreSound === "ꦃꦃꦿ") {
    // hr-
    if (matra === "ꦼ")
      konsonan = "ꦲꦽ"; //hr-
    else konsonan = "ꦲꦿ"; //hr-
  } else if (core_sound.CoreSound === "ꦃꦲꦿ") {
    // hr-
    if (matra === "ꦼ")
      konsonan = "ꦲꦽ"; //hr-
    else konsonan = "ꦲꦿ"; //hr-
  } else if (core_sound.CoreSound === "ꦃ" && matra === "꧀") {
    // wignyan - 12 April
    konsonan = "ꦲ"; //ha
  } else if (core_sound.CoreSound === "ꦃ" && matra !== "꧀") {
    // wignyan
    konsonan = "ꦲ"; //ha
  } else if (core_sound.CoreSound === "ꦂ" && matra === "ꦼ") {
    // pa cerek
    konsonan = "ꦉ";
    matra = ""; //rê
  } else if (core_sound.CoreSound === "ꦂ" && matra !== "꧀") {
    // layar
    konsonan = "ꦫ"; //ra
  } else if (core_sound.CoreSound === "ꦁ" && matra !== "꧀") {
    // cecak
    konsonan = "ꦔ"; //nga
  } else if (core_sound.CoreSound === "ꦁ" && matra === "꧀") {
    // cecak
    konsonan = "ꦁ";
    matra = ""; //cecak
  } else {
    konsonan = core_sound.CoreSound;
  }
  return "" + konsonan + matra;
}

/**
 * Check if a text contains Javanese Script.
 * @param {string} text
 * @returns {boolean}
 */
export const hasAksara = (text: string): boolean => {
  const aksaras = Object.keys(javaneseToLatin);
  for (let i = 0; i < aksaras.length; i++)
    if (text.includes(aksaras[i])) return true;
  return false;
};

/**
 * Translate Latin to Javanese Script.
 * @param {string} latin
 * @param {TranslateConfiguration} config
 * @returns {string}
 */
export const translate = (
  latin: string,
  config: TranslateConfiguration | null = null,
): string => {
  if (hasAksara(latin)) return translateAksara(latin);

  let i = 0;
  let pi = 0; // offset
  let vowelFlag = false;
  let angkaFlag = false;
  let cecakFlag = false;
  let vowelPrev = false;
  let str = latin;
  let ret = "";
  const angka: Digit = {
    "0": "꧐",
    "1": "꧑",
    "2": "꧒",
    "3": "꧓",
    "4": "꧔",
    "5": "꧕",
    "6": "꧖",
    "7": "꧗",
    "8": "꧘",
    "9": "꧙",
  };

  str = trim(str);

  if (!config) config = defaultConfig;

  while (i < str.length) {
    if (i > 0 && isVowel(str[i]) && isVowel(str[i - 1])) {
      //deal with words that start with multiple vocals
      if (
        (str[i - 1] === "a" && str[i] === "a") ||
        (str[i - 1] === "i" && str[i] === "i") ||
        (str[i - 1] === "u" && str[i] === "u") ||
        (str[i - 1] === "a" && str[i] === "i") ||
        (str[i - 1] === "a" && str[i] === "u")
      ) {
        //specials
        if (i > 1 && !isConsonant(str[i - 2])) {
          //for example if starts with 'ai-'
          str = str.substring(0, i) + "h" + str.substring(i, str.length);
        }
        //else, do nothing, look in matramap table
      } else if (
        (str[i - 1] === "e" || str[i - 1] === "è" || str[i - 1] === "é") &&
        (str[i] === "a" || str[i] === "o")
      ) {
        //-y-
        str = str.substring(0, i) + "y" + str.substring(i, str.length);
      } else if (
        str[i - 1] === "i" &&
        (str[i] === "a" ||
          str[i] === "e" ||
          str[i] === "è" ||
          str[i] === "é" ||
          str[i] === "o" ||
          str[i] === "u")
      ) {
        //-y-
        str = str.substring(0, i) + "y" + str.substring(i, str.length);
      } else if (
        str[i - 1] === "o" &&
        (str[i] === "a" || str[i] === "e" || str[i] === "è" || str[i] === "é")
      ) {
        //-w-
        str = str.substring(0, i) + "w" + str.substring(i, str.length);
      } else if (
        str[i - 1] === "u" &&
        (str[i] === "a" ||
          str[i] === "e" ||
          str[i] === "è" ||
          str[i] === "é" ||
          str[i] === "i" ||
          str[i] === "o")
      ) {
        //-y-
        str = str.substring(0, i) + "w" + str.substring(i, str.length);
      } else {
        str = str.substring(0, i) + "h" + str.substring(i, str.length);
      }
    }
    if (
      (str[i] === "h" && vowelFlag) ||
      (!isVowel(str[i]) && i > 0) ||
      str[i] === " " ||
      isPunct(str[i]) ||
      isDigit(str[i]) ||
      i - pi > 5
    ) {
      if (!isDigit(str[i]) && angkaFlag) {
        //turn off the flag
        ret += "꧇​"; // with zws
        angkaFlag = false;
      }
      if (pi < i) {
        if (
          cecakFlag &&
          getSound(str.substring(pi, i), config, vowelPrev) === "ꦁ"
        ) {
          cecakFlag = false;
          ret += "ꦔ꧀ꦔ";
        } else if (
          !cecakFlag &&
          getSound(str.substring(pi, i), config, vowelPrev) === "ꦁ"
        ) {
          cecakFlag = true;
          ret += "ꦁ";
        } else {
          cecakFlag = false;
          ret += getSound(str.substring(pi, i), config, vowelPrev);
        }
      }
      if (str[i] === " ") {
        ret += config.withSpace ? " " : "";
      }
      if (isPunct(str[i])) {
        if (str[i] === ".") {
          ret += "꧉​"; //titik+zero-width space
          pi = i + 1;
        } else if (str[i] === ",") {
          ret += "꧈​"; //koma+zero-width space
          pi = i + 1;
        } else if (str[i] === "|") {
          ret += "꧋";
          pi = i + 1;
        } else if (str[i] === "(") {
          ret += "꧌";
          pi = i + 1;
        } else if (str[i] === ")") {
          ret += "꧍​";
          pi = i + 1; // with zws
        } else if (str[i] === "-") {
          //tanda hubung
          ret += "​";
          pi = i + 1;
        } else if (
          str[i] === "?" ||
          str[i] === "!" ||
          str[i] === '"' ||
          str[i] === "'"
        ) {
          //tanda tanya/seru/petik
          ret += "​"; //zero-width space
          pi = i + 1;
        } else {
          ret += str[i];
          pi = i + 1;
        }
      } else if (isDigit(str[i])) {
        if (!angkaFlag) ret += "꧇";
        ret += angka[str[i]];
        angkaFlag = true;
        pi = i + 1;
      } else {
        pi = i;
      }
      vowelFlag = false;
    } else if (isVowel(str[i]) && str[i] !== "h") {
      if (!isDigit(str[i]) && angkaFlag) {
        //turn off the flag
        ret += "꧇​"; //with zws
        angkaFlag = false;
      }
      vowelFlag = true;
    }
    if (pi > 0 && isVowel(str[pi - 1])) {
      //<vowel>ngg
      vowelPrev = true;
    } else vowelPrev = false;
    i++;
  }

  if (pi < i) {
    ret += getSound(str.substring(pi, i), config, vowelPrev);
  }
  return trim(ret);
};

/**
 * Translate Aksara Jawa to Latin.
 * @param {stirng} aksara
 * @returns string
 */
export const translateAksara = (aksara: string): string => {
  const regexp_file = javaneseToLatin;
  const str = aksara;
  let trans: string = str;
  for (let i = 0, j = 0; i < str.length; i++) {
    if (!regexp_file[str[i]]) {
      //not Aksara Jawa
      trans = trans.replaceChar1(j, str[i]);
      j++;
    } else {
      if (i > 0 && str[i] == "ꦫ" && str[i - 1] == "ꦂ") {
        trans = trans.replaceChar1(j, "a");
        j++;
      } else if (i > 0 && str[i] == "ꦔ" && str[i - 1] == "ꦁ") {
        //double ngng
        trans = trans.replaceChar1(j, "a");
        j++;
      } else if (
        str[i] == "ꦴ" ||
        str[i] == "ꦶ" ||
        str[i] == "ꦸ" ||
        str[i] == "ꦺ" ||
        str[i] == "ꦼ"
      ) {
        if (i > 2 && str[i - 1] == "ꦲ" && str[i - 2] == "ꦲ") {
          //-hah-
          if (str[i] == "ꦴ") trans = trans.replaceChar3(j, "ā");
          else if (str[i] == "ꦶ") trans = trans.replaceChar3(j, "ai");
          else if (str[i] == "ꦸ") trans = trans.replaceChar3(j, "au");
          else if (str[i] == "ꦺ") trans = trans.replaceChar3(j, "ae");
          else if (str[i] == "ꦼ") trans = trans.replaceChar3(j, "aě");
        } else if (i > 2 && str[i - 1] == "ꦲ") {
          //-h-
          if (str[i] == "ꦴ") trans = trans.replaceChar2(j, "ā");
          else if (str[i] == "ꦶ") trans = trans.replaceChar2(j, "i");
          else if (str[i] == "ꦸ") trans = trans.replaceChar2(j, "u");
          else if (str[i] == "ꦺ") trans = trans.replaceChar2(j, "e");
          else if (str[i] == "ꦼ") trans = trans.replaceChar2(j, "ě");
        } /**/ else if (i > 0 && str[i] == "ꦴ" && str[i - 1] == "ꦺ") {
          //-o //2 aksara -> 1 huruf
          trans = trans.replaceChar2(j, "o");
        } else if (i > 0 && str[i] == "ꦴ" && str[i - 1] == "ꦻ") {
          //-au //2 aksara -> 2 huruf
          trans = trans.replaceChar3(j, "au");
        } else if (str[i] == "ꦴ") {
          //-aa
          trans = trans.replaceChar1(j, "aa");
          j++;
        } else if (
          i > 0 &&
          (str[i] == "ꦶ" || str[i] == "ꦸ" || str[i] == "ꦺ" || str[i] == "ꦼ") &&
          (str[i - 1] == "ꦄ" ||
            str[i - 1] == "ꦌ" ||
            str[i - 1] == "ꦆ" ||
            str[i - 1] == "ꦎ" ||
            str[i - 1] == "ꦈ")
        ) {
          trans = trans.replaceChar1(j, regexp_file[str[i]]);
          j++;
        } else {
          trans = trans.replaceChar2(j, regexp_file[str[i]]);
        }
      } else if (
        str[i] == "ꦽ" ||
        str[i] == "ꦾ" ||
        str[i] == "ꦿ" ||
        str[i] == "ꦷ" ||
        str[i] == "ꦹ" ||
        str[i] == "ꦻ" ||
        str[i] == "ꦇ" ||
        str[i] == "ꦍ"
      ) {
        //1 aksara -> 2 huruf
        trans = trans.replaceChar2(j, regexp_file[str[i]]);
        j++;
      } else if (str[i] == "꦳") {
        //2 aksara -> 2 huruf
        if (i > 0 && str[i - 1] == "ꦗ") {
          if (i > 1 && str[i - 2] == "꧊") {
            trans = trans.replaceChar3(j, "Za");
          } else {
            trans = trans.replaceChar3(j, "za");
          }
        } else if (i > 0 && str[i - 1] == "ꦥ") {
          if (i > 1 && str[i - 2] == "꧊") {
            trans = trans.replaceChar3(j, "Fa");
          } else {
            trans = trans.replaceChar3(j, "fa");
          }
        } else if (i > 0 && str[i - 1] == "ꦮ") {
          if (i > 1 && str[i - 2] == "꧊") {
            trans = trans.replaceChar3(j, "Va");
          } else {
            trans = trans.replaceChar3(j, "va");
          }
        } // catatan, "va" biasanya ditulis sama dengan "fa" (dengan pa+cecak telu), variannya adalah wa+cecak telu.
        else {
          trans = trans.replaceChar2(j, regexp_file[str[i]]);
        }
      } else if (str[i] == "꧀") {
        trans = trans.replaceChar2(j, regexp_file[str[i]]);
      } else if (
        i > 1 &&
        str[i] == "ꦕ" &&
        str[i - 1] == "꧀" &&
        str[i - 2] == "ꦚ"
      ) {
        //nyj & nyc
        trans = trans.replaceChar2(j - 2, "nc");
      } else if (
        i > 1 &&
        str[i] == "ꦗ" &&
        str[i - 1] == "꧀" &&
        str[i - 2] == "ꦚ"
      ) {
        //nyj & nyc
        trans = trans.replaceChar2(j - 2, "nj");
      } else if (
        str[i] == "ꦏ" ||
        str[i] == "ꦐ" ||
        str[i] == "ꦑ" ||
        str[i] == "ꦒ" ||
        str[i] == "ꦓ" ||
        str[i] == "ꦕ" ||
        str[i] == "ꦖ" ||
        str[i] == "ꦗ" ||
        str[i] == "ꦙ" ||
        str[i] == "ꦟ" ||
        str[i] == "ꦠ" ||
        str[i] == "ꦡ" ||
        str[i] == "ꦢ" ||
        str[i] == "ꦣ" ||
        str[i] == "ꦤ" ||
        str[i] == "ꦥ" ||
        str[i] == "ꦦ" ||
        str[i] == "ꦧ" ||
        str[i] == "ꦨ" ||
        str[i] == "ꦩ" ||
        str[i] == "ꦪ" ||
        str[i] == "ꦫ" ||
        str[i] == "ꦬ" ||
        str[i] == "ꦭ" ||
        str[i] == "ꦮ" ||
        str[i] == "ꦯ" ||
        str[i] == "ꦱ" ||
        str[i] == "ꦉ" ||
        str[i] == "ꦊ" ||
        str[i] == "ꦁ" ||
        str[i] == "ꦲ"
      ) {
        if (i > 0 && str[i - 1] == "꧊") {
          if (str[i] == "ꦐ") {
            trans = trans.replaceChar1(j, "Qa");
            j += 2;
          } else if (str[i] == "ꦧ" || str[i] == "ꦨ") {
            trans = trans.replaceChar1(j, "Ba");
            j += 2;
          } else if (str[i] == "ꦕ" || str[i] == "ꦖ") {
            trans = trans.replaceChar1(j, "Ca");
            j += 2;
          } else if (str[i] == "ꦢ" || str[i] == "ꦣ") {
            trans = trans.replaceChar1(j, "Da");
            j += 2;
          } else if (str[i] == "ꦒ" || str[i] == "ꦓ") {
            trans = trans.replaceChar1(j, "Ga");
            j += 2;
          } else if (str[i] == "ꦲ") {
            if (
              i > 0 &&
              (str[i - 1] == "ꦼ" ||
                str[i - 1] == "ꦺ" ||
                str[i - 1] == "ꦶ" ||
                str[i - 1] == "ꦴ" ||
                str[i - 1] == "ꦸ" ||
                str[i - 1] == "ꦄ" ||
                str[i - 1] == "ꦌ" ||
                str[i - 1] == "ꦆ" ||
                str[i - 1] == "ꦎ" ||
                str[i - 1] == "ꦈ" ||
                str[i - 1] == "ꦿ" ||
                str[i - 1] == "ꦾ" ||
                str[i - 1] == "ꦽ")
            ) {
              trans = trans.replaceChar1(j, "h" + regexp_file[str[i]]);
              j += 2;
            }
            if (i > 0 && str[i - 1] == "꧊") {
              trans = trans.replaceChar1(j, "H" + regexp_file[str[i]]);
              j += 2;
            } else {
              trans = trans.replaceChar1(j, "@" + regexp_file[str[i]]);
              j += 2;
            }
          } else if (str[i] == "ꦗ" || str[i] == "ꦙ") {
            trans = trans.replaceChar1(j, "Ja");
            j += 2;
          } else if (str[i] == "ꦏ" || str[i] == "ꦑ") {
            trans = trans.replaceChar1(j, "Ka");
            j += 2;
          } else if (str[i] == "ꦭ") {
            trans = trans.replaceChar1(j, "La");
            j += 2;
          } else if (str[i] == "ꦩ") {
            trans = trans.replaceChar1(j, "Ma");
            j += 2;
          } else if (str[i] == "ꦤ" || str[i] == "ꦟ") {
            trans = trans.replaceChar1(j, "Na");
            j += 2;
          } else if (str[i] == "ꦥ" || str[i] == "ꦦ") {
            trans = trans.replaceChar1(j, "Pa");
            j += 2;
          } else if (str[i] == "ꦫ" || str[i] == "ꦬ") {
            trans = trans.replaceChar1(j, "Ra");
            j += 2;
          } else if (str[i] == "ꦱ" || str[i] == "ꦯ") {
            trans = trans.replaceChar1(j, "Sa");
            j += 2;
          } else if (str[i] == "ꦠ" || str[i] == "ꦡ") {
            trans = trans.replaceChar1(j, "Ta");
            j += 2;
          } else if (str[i] == "ꦮ") {
            trans = trans.replaceChar1(j, "Wa");
            j += 2;
          } else if (str[i] == "ꦪ") {
            trans = trans.replaceChar1(j, "Ya");
            j += 2;
          } else {
            trans.replaceChar1(j, regexp_file[str[i]]);
            j += 3;
          }
        } else if (
          str[i] == "ꦑ" ||
          str[i] == "ꦓ" ||
          str[i] == "ꦖ" ||
          str[i] == "ꦙ" ||
          str[i] == "ꦡ" ||
          str[i] == "ꦣ" ||
          str[i] == "ꦦ" ||
          str[i] == "ꦨ" ||
          str[i] == "ꦯ"
        ) {
          //bha, cha, dha, dll.
          trans = trans.replaceChar1(j, regexp_file[str[i]]);
          j += 3;
        } else if (
          str[i] == "ꦲ" &&
          (i == 0 ||
            [
              " ",
              "​",
              "꧀",
              "꦳",
              "ꦴ",
              "ꦶ",
              "ꦷ",
              "ꦸ",
              "ꦹ",
              "ꦺ",
              "ꦻ",
              "ꦼ",
              "ꦽ",
              "ꦾ",
              "ꦿ",
            ].indexOf(str[i - 1]) >= 0)
        ) {
          //ha, preceeded by space or zws or open vowel
          trans = trans.replaceChar1(j, "_a");
          j += 2;
        } else {
          //ba, ca, da, dll.
          trans = trans.replaceChar1(j, regexp_file[str[i]]);
          j += 2;
        }
      } else if (str[i] == "ꦰ") {
        //ṣa
        trans = trans.replaceChar1(j, regexp_file[str[i]]);
        j += 2;
      } else if (
        str[i] == "ꦔ" ||
        str[i] == "ꦘ" ||
        str[i] == "ꦚ" ||
        str[i] == "ꦛ" ||
        str[i] == "ꦜ" ||
        str[i] == "ꦝ" ||
        str[i] == "ꦞ" ||
        str[i] == "ꦋ"
      ) {
        if (i > 0 && str[i - 1] == "꧊") {
          if (str[i] == "ꦔ") {
            trans = trans.replaceChar1(j, "Nga");
            j += 3;
          } else if (str[i] == "ꦚ" || str[i] == "ꦘ") {
            trans = trans.replaceChar1(j, "Nya");
            j += 3;
          } else if (str[i] == "ꦛ" || str[i] == "ꦜ") {
            trans = trans.replaceChar1(j, "Tha");
            j += 3;
          } else if (str[i] == "ꦝ" || str[i] == "ꦞ") {
            trans = trans.replaceChar1(j, "Dha");
            j += 3;
          } else {
            trans.replaceChar1(j, regexp_file[str[i]]);
            j += 3;
          }
        } else {
          trans = trans.replaceChar1(j, regexp_file[str[i]]);
          j += 3;
        }
      } else if (str[i] == "꧊") {
        // penanda nama diri -- made up for Latin back-compat
        trans = trans.replaceChar1(j, "");
      } else if (str[i] == " ") {
        trans = trans.replaceChar1(j, " ");
        j++;
      } else {
        trans = trans.replaceChar1(j, regexp_file[str[i]]);
        j++;
      }
    }
  }

  let sentence = trans.split(" ");
  sentence = sentence.map((word) =>
    removeInvisibleChars(word.trim().replace("_", "")),
  );

  return sentence.join(" ");
};
