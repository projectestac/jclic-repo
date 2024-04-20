<?php
/**
 * Amplia els resultats de la cerca de WordPress (search.php) amb coincidències de les paraules buscades en la base de dades de projectes JClic.
 * Veure: https://github.com/projectestac/jclic-repo/blob/main/misc/wp_hooks/search-activities.js
 */
add_action('wp_footer', function () {
  if (is_search()) {
    ?>
    <script>
      console.log('INFO: La cerca s\'ampliarà amb una consulta a la base de dades de projectes JClic.');
    </script>
    <script type="text/javascript" src="https://clic.xtec.cat/dist/repo/search-activities.js"></script>
  <?php
  }
});
