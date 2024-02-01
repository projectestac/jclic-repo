<?php
/**
 * En un conjunt d'elements correctament etiquetats amb classes de tipus "lang_xx", els amaga tots
 * excepte el corresponent a l'idioma actiu segons el PolyLang.
 * Això permet, per exemple, ficar en un mateix widget el mateix element (paràgraf, div, o el que sigui...)
 * repetit en diferents idiomes, garantint que a l'usuari final se li mostrarà només el corresponent a
 * l'idioma actiu.
 * 
 * Per tal que funcioni cal assignar a cada element la classe "lang_xx", on "xx" és el seu codi d'idioma ('ca', 'es' o 'en').
 * 
 * Com que Astra acostuma a ficar els elements visuals dins d'un element "section", s'amaguen també aquests
 * darrers elements quan el primer fill és d'un idioma que no és l'actual.
 * 
 * L'idioma actual s'agafa directament del PolyLang amb la funció "pll_current_language". Per a més info, veure:
 * https://polylang.pro/doc/function-reference/
 * 
 * Actualment implementat per a català, espanyol i anglès. Es pot modificar fàcilment per a contemplar altres idiomes.
 */
add_action('wp_head', function () {
  // Comprova que PolyLang s'hagi carregat
  if (function_exists('pll_current_language')) {

    // Llegeix l'idioma actual
    $currentLang = pll_current_language('slug');

    // Configura les classes a amagar en funció de l'idioma actual:
    if ($currentLang == 'ca')
      $hideLangs = '.lang_en, .lang_es, section:has(> .lang_en), section:has(> .lang_es)';
    else if ($currentLang == 'es')
      $hideLangs = '.lang_en, .lang_ca, section:has(> .lang_en), section:has(> .lang_ca)';
    else
      $hideLangs = '.lang_ca, .lang_es, section:has(> .lang_ca), section:has(> .lang_es)';

    // Emet el codi CSS amagant les classes indicades a $hideLangs
    ?>
    <style id="amaga_altres_idiomes">
      <?= $hideLangs ?> { 
        display: none;
      }
    </style>
    <?php
  }
});
