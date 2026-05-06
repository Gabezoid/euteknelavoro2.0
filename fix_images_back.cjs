const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf-8');

const imports = `
import EutLavLogo from './assets/EutLav-logo.svg';
import womanImg from './assets/woman.png';
import CervelloImg from './assets/cards/Cervello.png';
import EutekneAIImg from './assets/cards/EutekneAI.png';
import bannerFDLImg from './assets/banner_FDL.jpg';
import logoFDLImg from './assets/logoFDL.png';
import eutekneinfo_screen from './assets/cards/eutekneinfo_screen.png';
import circolari from './assets/cards/circolari-per-la-cilentela-sile_card.png';
import lavoce from './assets/cards/lavoce_card.png';
import sil from './assets/cards/sil_card.png';
import omnikit from './assets/cards/omnikit_card.jpg';
import guide from './assets/cards/guide_card.jpg';
import werte from './assets/cards/werte_card.png';
import scadenzario from './assets/cards/scadenzario_card.jpg';
import masterlavoro from './assets/cards/masterlavoro_card.jpg';
import collaboratoridipendenti from './assets/cards/collaboratoridipendenti_card.jpg';
import formazionesumisura from './assets/cards/formazionesumisura_card.jpg';
import centrostudi from './assets/cards/centrostudi_card.jpg';
import euteknecare from './assets/cards/euteknecare_screen.png';
`;

content = content.replace(/import \{ motion, useScroll, useTransform \} from 'motion\/react';\n/g, "import { motion, useScroll, useTransform } from 'motion/react';\n" + imports);

const replacements = {
  '"/cards/eutekneinfo_screen.png"': 'eutekneinfo_screen',
  '"/cards/circolari-per-la-cilentela-sile_card.png"': 'circolari',
  '"/cards/lavoce_card.png"': 'lavoce',
  '"/cards/sil_card.png"': 'sil',
  '"/cards/omnikit_card.jpg"': 'omnikit',
  '"/cards/guide_card.jpg"': 'guide',
  '"/cards/werte_card.png"': 'werte',
  '"/cards/scadenzario_card.jpg"': 'scadenzario',
  '"/cards/masterlavoro_card.jpg"': 'masterlavoro',
  '"/cards/collaboratoridipendenti_card.jpg"': 'collaboratoridipendenti',
  '"/cards/formazionesumisura_card.jpg"': 'formazionesumisura',
  '"/cards/centrostudi_card.jpg"': 'centrostudi',
  '"/cards/euteknecare_screen.png"': 'euteknecare',
  '"/EutLav-logo.svg"': '{EutLavLogo}',
  '"/woman.png"': '{womanImg}',
  '"/cards/Cervello.png"': '{CervelloImg}',
  '"/cards/EutekneAI.png"': '{EutekneAIImg}',
  '"/banner_FDL.jpg"': '{bannerFDLImg}',
  '"/logoFDL.png"': '{logoFDLImg}'
};

for (const [key, value] of Object.entries(replacements)) {
  const regex = new RegExp(key.replace(/\//g, '\\/').replace(/\./g, '\\.'), 'g');
  content = content.replace(regex, value);
}

fs.writeFileSync('src/App.tsx', content);

let svgContent = fs.readFileSync('src/components/EutekneCirclesBackground.tsx', 'utf-8');
svgContent = svgContent.replace(/import \{ useEffect, useState \} from 'react';/, "import { useEffect, useState } from 'react';\nimport cerchiSvg from '../assets/cerchi.svg?raw';");
svgContent = svgContent.replace(/fetch\('\/cerchi\.svg'\)\.then\(res => res\.text\(\)\)\.then\(text => setSvgContent\(text\)\)\.catch\(err => console\.error\(err\)\);/g, "setSvgContent(cerchiSvg);");

fs.writeFileSync('src/components/EutekneCirclesBackground.tsx', svgContent);
console.log('Restored imports');
