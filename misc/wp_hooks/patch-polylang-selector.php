<?php
/**
 * El selector d'idiomes del Polylang no funciona quan el lloc es visualitza en un mòbil o en pantalles estretes.
 * En realitat hi ha dues llistes desplegables (elements de tipus 'select') per a seleccionar els idiomes: una per a la
 * vista de pantalla gran (dins de la secció #ast-desktop-header) i l'altra per als dispositius mòbils (dins de #ast-mobile-header),
 * però només s'inicialitza el "handler" de l'event "change" de la primera.
 * Aquest script, que s'executa quan s'ha acabat de carregar la pàgina, inicialitza també l'event "change" de la llista desplegable
 * de la secció per a mòbils.
 */
add_action('wp_footer', function () { ?>
  <script>
    jq(() => {
      document
        .querySelector('#ast-mobile-header select')
        ?.addEventListener(
          'change',
          (event) => { location.href = event.currentTarget.value; }
        );
    });
  </script>
<?php });
