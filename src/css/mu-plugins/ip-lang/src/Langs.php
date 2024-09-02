<?php

/**
 * @property-read array  $langs_data
 * @property-read string $langs_regex
 * @property-read string $lang
 */
class Langs {

	/**
	 * All active  langs data.
	 * @var array[]
	 */
	private static array $langs_data;

	/**
	 * Regular for ru|en, to simplify.
	 */
	private static string $langs_regex = '';

	/**
	 * Current language ru|en|... Default is empty string - not defined.
	 */
	private static string $lang = '';

	/**
	 * @return self
	 */
	public static function instance(): self {
		static $instance;
		$instance || $instance = new self();

		return $instance;
	}

	public function __isset( $name ){
		return false;
	}

	public function __set( $name, $val ){
		return null;
	}

	public function __get( $name ){

		if( property_exists( __CLASS__, $name ) ){
			return self::${$name};
		}

		return null;
	}

	private function __construct(){
	}

	public function run(): void {

		$this->init();
	}

	public function init(): void {

    $this->set_cookie();
	}

	/**
	 * Sets the language cookie.
	 */
	public static function set_cookie(): void {

    $ip = $_SERVER['REMOTE_ADDR'];

		$ip_lang_code = get_ip()->country($ip);

		if( empty( $_COOKIE['lang'] ) || $_COOKIE['lang'] !== $ip_lang_code ){

			setcookie( 'lang', $ip_lang_code, ( time() + DAY_IN_SECONDS * 365 ) );
			$_COOKIE['lang'] = $ip_lang_code;
		}
	}

}
