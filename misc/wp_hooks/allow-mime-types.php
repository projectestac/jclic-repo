<?php

/**
 * Afegeix els tipus Mime "zip" i "gzip" a la llista de tipus admesos pel WordPress,
 * possibilitant així la pujada i publicació d'aquest tipus de fitxers requerits
 * per l'estàndard "sitemaps.org"
 * 
 * Basat en el connector Mime Types Plus de Katsushi Kawamori (https://wordpress.org/plugins/mime-types-plus/)
 * 
 * APIs de WordPress utilitzades:
 * https://developer.wordpress.org/reference/hooks/upload_mimes/
 * https://developer.wordpress.org/reference/hooks/ext2type/
 * https://developer.wordpress.org/reference/hooks/wp_check_filetype_and_ext/
 */

add_filter( 'upload_mimes', function ($mime_types) {
	$mime_types['zip'] = 'application/zip';
	$mime_types['gz'] = 'application/gzip';
	return $mime_types;
} );

add_filter( 'ext2type', function ($stack_ext2type) {
	$stack_ext2type[ 'archive' ][] = 'zip';
	$stack_ext2type[ 'archive' ][] = 'gz';
	return $stack_ext2type;
} );

add_filter( 'wp_check_filetype_and_ext', function ($data, $file, $filename, $mimes) {
	if ( ! empty( $data ) ) {
		$filetype = wp_check_filetype( $filename );
		$data['ext'] = $filetype['ext'];
		$data['type'] = $filetype['type'];
	}
	return $data;
}, 10, 4 );
