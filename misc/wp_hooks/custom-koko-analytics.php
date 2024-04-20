<?php
/**
 * Les estadístiques d'accessos a cada un dels projectes de la biblioteca d'activitats JClic es registren a Koko Analytics
 * com a "posts" amb un identificador numèric inventat que es calcula afegint 50.000 a l'identificador del projecte.
 * Aquest snippet es limita a injectar l'script 'patch-koko-api.js' a la consola de Koko Analytics. L'script intercepta
 * les crides AJAX que el client farà a l'API, substituïnt les referències a "post inexistent" pel títol real i l'enllaç
 * de cada projecte.
 * Veure: https://github.com/projectestac/jclic-repo/blob/main/misc/wp_hooks/patch-koko-api.js
 */
add_action('koko_analytics_show_dashboard_components', function () {
  ?>
  <script src="https://clic.xtec.cat/dist/repo/patch-koko-api.js"></script>
  <?php
});