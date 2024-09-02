<?php

/**
 * Wrapper functions for use in themes and plugins.
 */

function Langs(): Langs {
	return Langs::instance();
}

function get_ip(): IP_Country {
	return IP_Country::instance();
}
