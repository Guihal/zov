<?php

/**
 *
 * The framework's functions and definitions
 */

function get_current_lang()
{
    return $_COOKIE['lang'];
}

if (isset($_SERVER['HTTP_REFERER'])) {
    if ($_SERVER['HTTP_REFERER'] != 'https://zuchelkueche.com' & $_SERVER['HTTP_REFERER'] != 'https://pl.zuchelkueche.com' & $_SERVER['HTTP_REFERER'] != 'https://de.zuchelkueche.com') {
        if (!isset($_COOKIE['redirecturl'])) {
            if (get_current_lang() == 'DE') {
                wp_redirect('https://de.zuchelkueche.com');
                setcookie('redirecturl', 'dezuc', strtotime('+1 day'));
                exit;
            } elseif (get_current_lang() == 'PL') {
                wp_redirect('https://pl.zuchelkueche.com');
                setcookie('redirecturl', 'plzuc', strtotime('+1 day'));
                exit;
            } else {
                wp_redirect('https://zuchelkueche.com');
                setcookie('redirecturl', 'zuc', strtotime('+1 day'));
                exit;
            }
        }
    }
} else {
    if (!isset($_COOKIE['redirecturl'])) {
        if (!isset($_COOKIE['redirecturl'])) {
            if (get_current_lang() == 'DE') {
                wp_redirect('https://de.zuchelkueche.com');
                setcookie('redirecturl', 'dezuc', strtotime('+1 day'));
                exit;
            } elseif (get_current_lang() == 'PL') {
                wp_redirect('https://pl.zuchelkueche.com');
                setcookie('redirecturl', 'plzuc', strtotime('+1 day'));
                exit;
            } else {
                wp_redirect('https://zuchelkueche.com');
                setcookie('redirecturl', 'zuc', strtotime('+1 day'));
                exit;
            }
        }
    }
}

define('WOODMART_THEME_DIR', get_template_directory_uri());
define('WOODMART_THEMEROOT', get_template_directory());
define('WOODMART_IMAGES', WOODMART_THEME_DIR . '/images');
define('WOODMART_SCRIPTS', WOODMART_THEME_DIR . '/js');
define('WOODMART_STYLES', WOODMART_THEME_DIR . '/css');
define('WOODMART_FRAMEWORK', '/inc');
define('WOODMART_DUMMY', WOODMART_THEME_DIR . '/inc/dummy-content');
define('WOODMART_CLASSES', WOODMART_THEMEROOT . '/inc/classes');
define('WOODMART_CONFIGS', WOODMART_THEMEROOT . '/inc/configs');
define('WOODMART_HEADER_BUILDER', WOODMART_THEME_DIR . '/inc/header-builder');
define('WOODMART_ASSETS', WOODMART_THEME_DIR . '/inc/admin/assets');
define('WOODMART_ASSETS_IMAGES', WOODMART_ASSETS . '/images');
define('WOODMART_API_URL', 'https://xtemos.com/wp-json/xts/v1/');
define('WOODMART_DEMO_URL', 'https://woodmart.xtemos.com/');
define('WOODMART_PLUGINS_URL', WOODMART_DEMO_URL . 'plugins/');
define('WOODMART_DUMMY_URL', WOODMART_DEMO_URL . 'dummy-content-new/');
define('WOODMART_TOOLTIP_URL', WOODMART_DEMO_URL . 'theme-settings-tooltips/');
define('WOODMART_SLUG', 'woodmart');
define('WOODMART_CORE_VERSION', '1.0.43');
define('WOODMART_WPB_CSS_VERSION', '1.0.2');

if (!function_exists('woodmart_load_classes')) {
    function woodmart_load_classes()
    {
        $classes = array(
            'class-singleton.php',
            'class-api.php',
            'class-config.php',
            'class-layout.php',
            'class-autoupdates.php',
            'class-activation.php',
            'class-notices.php',
            'class-theme.php',
            'class-registry.php',
        );

        foreach ($classes as $class) {
            require WOODMART_CLASSES . DIRECTORY_SEPARATOR . $class;
        }
    }
}

woodmart_load_classes();

new XTS\Theme();

define('WOODMART_VERSION', woodmart_get_theme_info('Version'));

function find_company_name()
{
    $user_id = get_current_user_id();
    if (!$user_id) return 'Company';
    $company_name = get_user_meta($user_id, 'company-name', true);
    if ($company_name == '') return 'Company';
    return $company_name;
}

add_filter(
    'woocommerce_save_account_details_required_fields',
    'smtl_edit_account_remove_required_names'
);
function smtl_edit_account_remove_required_names($fields)
{
    unset($fields['account_first_name']);
    unset($fields['account_last_name']);
    unset($fields['account_email']);
    unset($fields['account_display_name']);

    return $fields;
}

add_action('woocommerce_edit_account_form', 'add_favorite_color_to_edit_account_form', 1);
function add_favorite_color_to_edit_account_form()
{
    $user = wp_get_current_user();
    $user_id = get_current_user_id();
?>
    <div class="form-base form-registration" style='margin-top: 0;'>
        <input value="<?php echo get_user_meta($user_id, 'company-name', true); ?>" type="text" name="company" placeholder="Company" minlength="3">
        <input value="<?php echo get_user_meta($user_id, 'registration-number', true); ?>" class="mini-mrg" type="text" name="companynumber" placeholder="Company registration number" minlength="3">
        <div class="form-row">
            <input type="text" value="<?php echo $user->user_firstname; ?>" name="firstname" placeholder="First name" minlength="3">
            <input type="text" value="<?php echo $user->user_lastname; ?>" name="lastname" placeholder="Last name" minlength="3">
        </div>
        <input class="mini-mrg" value="<?php echo get_user_meta($user_id, 'user-position', true); ?>" type="text" name="position" placeholder="Position" minlength="3">

        <input type="text" value="<?php echo get_user_meta($user_id, 'address', true); ?>" name="address" placeholder="Adress" minlength="3">

        <input type="tel" name="telreg" placeholder="Phone number" minlength="11">
        <input type="email" name="mailreg" value="<?php echo $user->user_email; ?>" placeholder="E-mail" minlength="5">
        <input type="text" name="website" value="<?php echo get_user_meta($user_id, 'user-site', true); ?>" placeholder="Website" minlength="5" required>
        <div class="star"><input type="password" name="password-check" placeholder="Enter your current password" minlength="3" required></div>
        <div class="text">Change a password</div>
        <div class="form-row password-con">
            <input type="password" name="password" placeholder="Enter your password" minlength="3">
            <input type="password" name="repeatpassword" placeholder="Repeat password" minlength="3">
        </div>
        <div class="error">Passwords do not match</div>
    </div>
<?php
}

add_action('woocommerce_save_account_details', 'save_favorite_color_account_details', 1, 1);
function save_favorite_color_account_details($user_id)
{
    if (!isset($_POST['password-check'])) {
        wc_add_notice('Password required', 'error');
        return;
    }

    $user = get_user_by('id', $user_id);
    $user_data = get_userdata($user_id);

    $password = $_POST['password-check'];
    $hash = $user_data->data->user_pass;

    if (!wp_check_password($password, $hash)) {
        wc_add_notice('Password incorrect', 'error');
        return;
    }

    $userdata = [
        'ID' => $user_id,
    ];

    if (isset($_POST['company'])) {
        if ($_POST['company'] != '') {
            update_user_meta($user_id, 'company-name', $_POST["company"]);
        }
    }
    if (isset($_POST['mailreg'])) {
        if ($_POST['mailreg'] != '') {
            $userdata['user_email'] = $_POST['mailreg'];
        }
    }

    if (isset($_POST['position'])) {
        if ($_POST['position'] != '') {
            update_user_meta($user_id, 'user-position', $_POST["position"]);
        }
    }

    if (isset($_POST['companynumber'])) {
        if ($_POST['companynumber'] != '') {
            update_user_meta($user_id, 'registration-number', $_POST["companynumber"]);
        }
    }


    if (isset($_POST['address'])) {
        if ($_POST['address'] != '') {
            update_user_meta($user_id, 'address', $_POST['address']);
        }
    }

    if (isset($_POST['website'])) {
        if ($_POST['website'] != '') {
            update_user_meta($user_id, 'user-site', $_POST["website"]);
        }
    }
    if (isset($_POST['telreg'])) {
        if (strlen($_POST['telreg']) > 10) {
            update_user_meta($user_id, 'tel-number', $_POST["telreg"]);
        }
    }

    if (isset($_POST['firstname'])) {
        if ($_POST['firstname'] != '') {
            $userdata['first_name'] = $_POST['firstname'];
        }
    }

    if (isset($_POST['lastname'])) {
        if ($_POST['lastname'] != '') {
            $userdata['last_name'] = $_POST['lastname'];
        }
    }

    if (count($userdata) > 1) {
        wp_update_user($userdata);
    }
}

function object_for_reg_page()
{
    $custom_object_array = array(
        'company' => find_company_name(),
        'exit' => wp_logout_url(get_permalink()),
    );
?>
    <script>
        var registrtationInfo = <?php echo json_encode($custom_object_array, JSON_UNESCAPED_UNICODE); ?>;
    </script>
<?php
}

function custom_scripts()
{
    wp_register_script('swiper', 'https://cdnjs.cloudflare.com/ajax/libs/Swiper/11.0.5/swiper-bundle.min.js', null, null, true);
    wp_enqueue_script('swiper');
    wp_register_style('swiperstyle', 'https://cdnjs.cloudflare.com/ajax/libs/Swiper/11.0.5/swiper-bundle.min.css');
    wp_enqueue_style('swiperstyle');
    wp_register_script('imask', 'https://cdnjs.cloudflare.com/ajax/libs/imask/7.6.1/imask.min.js');
    wp_enqueue_script('imask');
    wp_register_script('intel', 'https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/23.5.0/js/intlTelInput.min.js');
    wp_enqueue_script('intel');
    wp_register_script('utilsin', 'https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js');
    wp_enqueue_script('utilsin');
    wp_register_style('inptel', 'https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/23.5.0/css/intlTelInput.css');
    wp_enqueue_style('inptel');
    wp_enqueue_style('custom-main-min', get_template_directory_uri() . '/css/custom-main/main.css');
    wp_enqueue_script('custom-main-min', get_template_directory_uri() . '/js/custom-main/main.js');
    wp_enqueue_script('popup', get_template_directory_uri() . '/js/popup.js');
    wp_localize_script(
        'custom-main-min',
        'registration',
        array(
            'url' => admin_url('admin-ajax.php'),
            'nonce' => wp_create_nonce('reg-nonce')
        )
    );
    wp_localize_script(
        'utilsin',
        'articles',
        array(
            'url' => admin_url('admin-ajax.php'),
            'nonce' => wp_create_nonce('articles-nonce')
        )
    );
}

add_action('wp_head', 'object_for_reg_page');
add_action('wp_enqueue_scripts', 'custom_scripts');

function callback_form_shortcode($atts, $content)
{
    $atts = shortcode_atts([
        'popup' => 'callback',
        'initbtn'  => 'callback',
        'title'  => 'Rückruf anfordern',
        'titlesuc'  => 'Ihre Rückrufbitte ist eingegangen!',
        'textsuc' => 'Unsere Spezialisten werden sich so schnell wie möglich mit Ihnen in Verbindung setzen, um Ihre Anfrage zu besprechen.'
    ], $atts);

    return '
	<div id="' . $atts['popup'] . '" class="popup">
		<div class="popup__wrapper form-base">
		<button class="popup__close">
			<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path fill-rule="evenodd" clip-rule="evenodd" d="M1.05141 0.556248C0.914723 0.419564 0.693115 0.419564 0.556431 0.556248C0.419748 0.692931 0.419748 0.91454 0.556431 1.05122L9.50506 9.99985L0.556431 18.9485C0.419748 19.0852 0.419748 19.3068 0.556431 19.4435C0.693115 19.5801 0.914722 19.5801 1.05141 19.4435L10 10.4948L18.9487 19.4435C19.0853 19.5801 19.3069 19.5801 19.4436 19.4435C19.5803 19.3068 19.5803 19.0852 19.4436 18.9485L10.495 9.99985L19.4436 1.05122C19.5803 0.91454 19.5803 0.692931 19.4436 0.556248C19.3069 0.419564 19.0853 0.419564 18.9487 0.556248L10 9.50487L1.05141 0.556248Z" fill="#595959" />
			</svg>
		</button>
		<h5 class="popup__title">' . $atts['title'] . '</h5>
		' . do_shortcode($content) . '
		<div class="hidden hidden-for">
			<div class="popup__title">' . $atts['titlesuc'] . '</div>
			<div class="popup__text">' . $atts['textsuc'] . '</div>
			<div class="popup__close white-btn">OK</div>
		</div>
		</div>
	</div>
    <script>
	document.addEventListener("DOMContentLoaded", ()=> {
		popupInit("#' . $atts['popup'] . '", "#' . $atts['popup'] . ' .popup__wrapper", `[href="#' . $atts['initbtn'] . '"]`, "#' . $atts['popup'] . ' .popup__close", 300, "block");
	});	</script>
	';
}

function login_form_shortcode()
{
    return '
	<div id="login-form" class="popup">
		<div class="popup__wrapper form-base">
		<button class="popup__close">
			<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path fill-rule="evenodd" clip-rule="evenodd" d="M1.05141 0.556248C0.914723 0.419564 0.693115 0.419564 0.556431 0.556248C0.419748 0.692931 0.419748 0.91454 0.556431 1.05122L9.50506 9.99985L0.556431 18.9485C0.419748 19.0852 0.419748 19.3068 0.556431 19.4435C0.693115 19.5801 0.914722 19.5801 1.05141 19.4435L10 10.4948L18.9487 19.4435C19.0853 19.5801 19.3069 19.5801 19.4436 19.4435C19.5803 19.3068 19.5803 19.0852 19.4436 18.9485L10.495 9.99985L19.4436 1.05122C19.5803 0.91454 19.5803 0.692931 19.4436 0.556248C19.3069 0.419564 19.0853 0.419564 18.9487 0.556248L10 9.50487L1.05141 0.556248Z" fill="#595959" />
			</svg>
		</button>
		<h5 class="popup__title">Log in</h5>
		' . wp_login_form(
        array(
            'echo' => false,
            'label_username' => __('Your Username '),
            'label_password' => __('Your Password'),
            'label_remember' => __('Remember Me')
        )
    )  . '
		</div>
	</div>
	<script>
	document.addEventListener("DOMContentLoaded", ()=> {
        if(document.querySelector("body").classList.contains("logged-in")) return;
		popupInit("#login-form", "#login-form .popup__wrapper", `[href="/account"]`, "#login-form .popup__close", 300, "block");
	});	</script>
	';
}

function registration_popup_shortcode()
{
    return '
	<div id="registration_popup" class="popup">
		<div class="popup__wrapper form-base">
		<h5 class="popup__title">Vielen Dank für Ihre Anmeldung!</h5>
		<div class="popup__text">Sie werden von unserem Vertreter kontaktiert, um die Informationen zu bestätigen</div>
        <a href="/" class="white-btn">OK</a>
		</div>
        <div class="hidden"></div>
	</div>
	<script>
	document.addEventListener("DOMContentLoaded", ()=> {
		popupInit("#registration_popup", "#registration_popup .popup__wrapper", `#registration_popup .hidden`, "#registration_popup .popup__close", 300, "block");
	});	</script>
	';
}

function quiz_shortcode($attr)
{
    ob_start();
    get_template_part('quiz');
    return ob_get_clean();
}

add_shortcode('quiz', 'quiz_shortcode');
add_shortcode('callbackform', 'callback_form_shortcode');
add_shortcode('loginform', 'login_form_shortcode');
add_shortcode('registration-popup', 'registration_popup_shortcode');

add_action('wpcf7_mail_sent', 'your_wpcf7_mail_sent_function');
function your_wpcf7_mail_sent_function($contact_form)
{

    $title = $contact_form->title;
    $posted_data = $contact_form->posted_data;


    if ('Callback' == $title or 'Callback(de)' == $title or 'Callback(pl)' == $title or 'Request(de)' == $title or 'Request(eng)' == $title or 'Request(pl)' == $title) {

        $submission = WPCF7_Submission::get_instance();
        $posted_data = $submission->get_posted_data();


        $lidname = $posted_data['lidname'];
        $lidlastname = $posted_data['lidlastname'];
        $lidcointry = $posted_data['lidcointry'];
        $lidcity = $posted_data['lidcity'];
        $lidzip = $posted_data['lidzip'];
        $lidtel = $posted_data['lidtel'];
        $lidemail = $posted_data['lidemail'];
        $lidrequest = $posted_data['lidrequest'];
        $utm_and_referer = $posted_data['utm_and_referer'];
        $UTM_SOURCE = $posted_data['utm_source'];
        $UTM_MEDIUM = $posted_data['utm_medium'];
        $UTM_CAMPAIGN = $posted_data['utm_campaign'];
        $UTM_TERM = $posted_data['utm_term'];
        $UTM_CONTENT = $posted_data['utm_content'];

        $webhook_url = 'https://zovofficial.bitrix24.by/rest/1/lb0wf7j99vbg26li/crm.lead.add.json';

        $data = array(
            'fields' => array(
                'TITLE' => '' . $title . '',
                'NAME' => $lidname,
                'SOURCE_ID' => 8,
                'COMMENTS' => '' . $lidcointry . ' ' . $lidzip . ' ' . $lidrequest . ' ' . $utm_and_referer . '',
                'UF_CRM_1716032735413' => $lidcity,
                'UTM_SOURCE' => $UTM_SOURCE,
                'UTM_MEDIUM' => $UTM_MEDIUM,
                'UTM_CAMPAIGN' => $UTM_CAMPAIGN,
                'UTM_TERM' => $UTM_TERM,
                'UTM_CONTENT' => $UTM_CONTENT,
                'EMAIL' => array(
                    array(
                        'VALUE' => $lidemail,
                        'VALUE_TYPE' => 'WORK',
                    ),
                ),
                'PHONE' => array(
                    array(
                        'VALUE' => $lidtel,
                        'VALUE_TYPE' => 'WORK',
                    ),
                ),
            ),
            'params' => array("REGISTER_SONET_EVENT" => "Y")
        );

        $json_data = json_encode($data);

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $webhook_url);
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $json_data);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json'));

        $response = curl_exec($ch);
        $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);

        curl_close($ch);

        if ($http_code == 200) {
            $response_data = json_decode($response, true);
            if (isset($response_data['result'])) {
                //echo 'Lead added successfully. Lead ID: ' . $response_data['result'];
            } else {
                //echo 'Error when adding a lead: ' . $response_data['error_description'];
            }
        } else {
            //echo 'Error sending request. Response code: ' . $http_code;
        }
    }
}

function add_utm_tracking_script()
{
?>
    <script type="text/javascript">
        jQuery(document).ready(function($) {
            var urlParams = new URLSearchParams(window.location.search);

            var utmSource = urlParams.get('utm_source');
            var utmMedium = urlParams.get('utm_medium');
            var utmCampaign = urlParams.get('utm_campaign');
            var utmTerm = urlParams.get('utm_term');
            var utmContent = urlParams.get('utm_content');

            console.log('utm_source:', utmSource);
            console.log('utm_medium:', utmMedium);
            console.log('utm_campaign:', utmCampaign);
            console.log('utm_term:', utmTerm);
            console.log('utm_content:', utmContent);

            if (utmSource) {
                $('[name="utm_source"]').val(utmSource);
            }
            if (utmMedium) {
                $('[name="utm_medium"]').val(utmMedium);
            }
            if (utmCampaign) {
                $('[name="utm_campaign"]').val(utmCampaign);
            }
            if (utmTerm) {
                $('[name="utm_term"]').val(utmTerm);
            }
            if (utmContent) {
                $('[name="utm_content"]').val(utmContent);
            }
        });
    </script>
<?php
}
add_action('wp_footer', 'add_utm_tracking_script', 100);


function enqueue_utm_script()
{
?>
    <script>
        (function() {
            function getParameterByName(name, url) {
                if (!url) url = window.location.href;
                name = name.replace(/[\[\]]/g, '\\$&');
                var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
                    results = regex.exec(url);
                if (!results) return null;
                if (!results[2]) return '';
                return decodeURIComponent(results[2].replace(/\+/g, ' '));
            }

            function saveUTMParameters() {
                var utmParams = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
                var utmData = {};

                utmParams.forEach(function(param) {
                    var value = getParameterByName(param);
                    if (value) {
                        utmData[param] = value;
                    }
                });

                if (Object.keys(utmData).length > 0) {
                    localStorage.setItem('utm_data', JSON.stringify(utmData));
                }
            }

            function appendUTMParametersToLinks() {
                var utmData = localStorage.getItem('utm_data');
                if (!utmData) return;

                utmData = JSON.parse(utmData);
                var utmString = Object.keys(utmData).map(function(key) {
                    return key + '=' + utmData[key];
                }).join('&');

                document.querySelectorAll('a').forEach(function(anchor) {
                    appendUTMParametersToLink(anchor, utmString);
                });
            }

            function monitorDOMChanges() {
                var observer = new MutationObserver(function(mutations) {
                    mutations.forEach(function(mutation) {
                        if (mutation.addedNodes.length) {
                            mutation.addedNodes.forEach(function(node) {
                                if (node.nodeType === 1 && node.tagName === 'A') {
                                    appendUTMParametersToLink(node);
                                }
                                if (node.nodeType === 1 && node.querySelectorAll) {
                                    node.querySelectorAll('a').forEach(function(anchor) {
                                        appendUTMParametersToLink(anchor);
                                    });
                                }
                            });
                        }
                    });
                });

                observer.observe(document.body, {
                    childList: true,
                    subtree: true
                });
            }

            function appendUTMParametersToLink(anchor, utmString) {
                var href = anchor.getAttribute('href');
                if (href) {
                    if (href.indexOf('http') !== 0) {
                        // Relative URL
                        href = location.origin + href;
                    }
                    if (href.indexOf('?') > -1) {
                        anchor.setAttribute('href', href + '&' + utmString);
                    } else {
                        anchor.setAttribute('href', href + '?' + utmString);
                    }
                }
            }

            document.addEventListener('DOMContentLoaded', function() {
                saveUTMParameters();
                appendUTMParametersToLinks();
                monitorDOMChanges();
            });
        })();
    </script>
<?php
}
add_action('wp_head', 'enqueue_utm_script');

if (function_exists('acf_add_options_page')) {

    acf_add_options_page([
        'page_title' => 'Quiz settings',
        'menu_title' => 'Quiz settings',
        'menu_slug'  => 'Quiz settings',
        'capability' => 'edit_posts',
        'redirect'   => false,
        'position'   => 2,
    ]);

    acf_add_options_page([
        'page_title' => 'Find-store settings',
        'menu_title' => 'Find-store settings',
        'menu_slug'  => 'Find-store settings',
        'capability' => 'edit_posts',
        'redirect'   => false,
        'position'   => 3,
    ]);
}

function registration_validation($email, $username)
{
    $reg_errors = new WP_Error;
    $errors = '';
    if (email_exists($email)) {
        $reg_errors->add('email', 'Email Already in use');
        $errors .= '
         Email Already in use';
        return $errors;
    }

    if (username_exists($username)) {
        $reg_errors->add('user_name', 'Sorry, that username already exists!');
        $errors .= '
         Sorry, that company already exists!';
        return $errors;
    }

    return '';
}

function complete_registration($username, $password, $email, $website, $first_name, $last_name, $nickname, $bio, $company)
{

    $userdata = array(
        'user_login'    =>   $username,
        'user_email'    =>   $email,
        'user_pass'     =>   $password,
        'user_url'      =>   $website,
        'first_name'    =>   $first_name,
        'last_name'     =>   $last_name,
        'nickname'      =>   $nickname,
        'description'   =>   $bio,
    );

    $user = wp_insert_user($userdata);
    echo "Создан юзер";

    return $user;
}



function init_custom_reg()
{
    check_ajax_referer('reg-nonce', 'registr-nonce');
    if (
        isset($_POST["company"])
        & isset($_POST["companynumber"])
        & isset($_POST["firstname"])
        & isset($_POST["lastname"])
        & isset($_POST["position"])
        & isset($_POST["country"])
        & isset($_POST["city"])
        & isset($_POST["address"])
        & isset($_POST["zipcode"])
        & isset($_POST["telreg"])
        & isset($_POST["mailreg"])
        & isset($_POST["website"])
        & isset($_POST["password"])
    ) {
        $company =  sanitize_text_field($_POST["company"]);
        $companynumber =  sanitize_text_field($_POST["companynumber"]);
        $country =  sanitize_text_field($_POST["country"]);
        $city =  sanitize_text_field($_POST["city"]);
        $address =  sanitize_text_field($_POST["address"]);
        $zipcode =  sanitize_text_field($_POST["zipcode"]);
        $position =  sanitize_text_field($_POST["position"]);
        $descr = implode("
        ", array($company, $companynumber, $country, $city, $address, $zipcode, $position));
        $username   =   sanitize_user($_POST['company']);
        $password   =   esc_attr($_POST['password']);
        $email      =   sanitize_email($_POST['mailreg']);
        $website    =   esc_url($_POST['website']);
        $first_name =   sanitize_text_field($_POST['firstname']);
        $last_name  =   sanitize_text_field($_POST['lastname']);
        $nickname   =   sanitize_text_field($_POST['company']);
        $bio        =   esc_textarea($descr);

        $validation = registration_validation($email, $username);

        if ($validation != '') {
            echo $validation;
            wp_die();
        }

        $user = complete_registration(
            $username,
            $password,
            $email,
            $website,
            $first_name,
            $last_name,
            $nickname,
            $bio,
            $company
        );

        add_user_meta($user, 'company-name', $company, true);
        add_user_meta($user, 'user-position', $_POST["position"], true);
        add_user_meta($user, 'registration-number', $_POST["companynumber"], true);
        add_user_meta($user, 'address', implode(" ", array($_POST["country"], $_POST["city"], $_POST["address"])), true);
        add_user_meta($user, 'user-site', $_POST["website"], true);
        add_user_meta($user, 'tel-number', $_POST["telreg"], true);

        // $headers = array(
        //     'From: <zk.biurobialystok@gmail.com>',
        // );
        // wp_mail($email, "Your registration data from the site Zuchelkueche.com", 'Login:' . $email . '%0D%0A Password:' . $password, $headers);

        wp_mail(
            $email,
            "Your registration data from the site Zuchelkueche.com",
            'Login: ' . $email . '
Password: ' . $password
        );


        wp_die();
    }
}

function main_block_account()
{
    $id = get_current_user_id();
    $user = get_userdata($id);
?>
    <div class="account__main">
        <div class="account__title">Welcome, <?php echo $user->first_name . ' ' . $user->last_name  ?>!</div>
        <div class="account__company"><?php echo get_user_meta($id, 'company-name', true); ?></div>
        <div class="account__text account__position"><?php echo get_user_meta($id, 'user-position', true); ?></div>
        <div class="account__text account__number-title">Company registration number</div>
        <div class="account__text account__number"><?php echo get_user_meta($id, 'registration-number', true); ?></div>
    </div>
    <div class="account__icons-details">
        <div class="account__item">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.0002 21.3337C12.0002 21.3337 5.3335 12.8123 5.3335 9.20033C5.3335 8.34236 5.50593 7.49279 5.84097 6.70013C6.176 5.90747 6.66706 5.18724 7.28612 4.58056C7.90517 3.97389 8.6401 3.49264 9.44894 3.16431C10.2578 2.83598 11.1247 2.66699 12.0002 2.66699C12.8756 2.66699 13.7425 2.83598 14.5514 3.16431C15.3602 3.49264 16.0951 3.97389 16.7142 4.58056C17.3333 5.18724 17.8243 5.90747 18.1594 6.70013C18.4944 7.49279 18.6668 8.34236 18.6668 9.20033C18.6668 12.8123 12.0002 21.3337 12.0002 21.3337ZM12.0002 11.067C12.5053 11.067 12.9898 10.8703 13.347 10.5203C13.7042 10.1702 13.9049 9.6954 13.9049 9.20033C13.9049 8.70526 13.7042 8.23046 13.347 7.88039C12.9898 7.53033 12.5053 7.33366 12.0002 7.33366C11.495 7.33366 11.0105 7.53033 10.6533 7.88039C10.2961 8.23046 10.0954 8.70526 10.0954 9.20033C10.0954 9.6954 10.2961 10.1702 10.6533 10.5203C11.0105 10.8703 11.495 11.067 12.0002 11.067Z" fill="#333333" />
            </svg>
            <div class="account__text"><?php echo get_user_meta($id, 'address', true); ?></div>
        </div>
        <a href="tel:<?php echo  str_replace(')', '', str_replace('(', '', str_replace(' ', '', get_user_meta($id, 'tel-number', true)))); ?>" class="account__item">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M18.6649 17.6791C19.3946 17.0406 19.867 16.1583 19.9938 15.197C20.017 15.0014 19.9766 14.8034 19.8785 14.6325C19.7804 14.4616 19.6298 14.3269 19.4491 14.2483L15.8419 12.6319C15.7019 12.5716 15.5491 12.5471 15.3974 12.5607C15.2456 12.5743 15.0996 12.6256 14.9726 12.7098C14.9624 12.7162 14.9527 12.7234 14.9435 12.7312L13.0437 14.3445C13.0015 14.3702 12.9537 14.3852 12.9044 14.388C12.8551 14.3908 12.8058 14.3813 12.761 14.3606C11.5204 13.7617 10.2363 12.4875 9.63739 11.2614C9.6162 11.217 9.60637 11.168 9.60877 11.1188C9.61117 11.0696 9.62573 11.0217 9.65114 10.9796L11.2706 9.05377C11.2783 9.04461 11.2852 9.03467 11.292 9.02474C11.3757 8.89779 11.4266 8.75199 11.4399 8.6005C11.4532 8.44901 11.4287 8.29659 11.3684 8.15696L9.75656 4.55594C9.67849 4.37356 9.54335 4.22143 9.37144 4.12239C9.19954 4.02335 9.00014 3.98276 8.8032 4.0067C7.84187 4.13345 6.95955 4.6058 6.32104 5.33553C5.68253 6.06526 5.33149 7.00246 5.3335 7.97209C5.3335 13.8694 10.1309 18.6667 16.0283 18.6667C16.9979 18.6687 17.9352 18.3176 18.6649 17.6791Z" fill="#333333" />
            </svg>
            <div class="account__text"><?php echo get_user_meta($id, 'tel-number', true); ?> </div>
        </a>
        <a href="<?php echo get_user_meta($id, 'user-site', true); ?>" class="account__item">
            <svg class='overflow-vis' width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15.488 13.6C15.552 13.072 15.6 12.544 15.6 12C15.6 11.456 15.552 10.928 15.488 10.4H18.192C18.32 10.912 18.4 11.448 18.4 12C18.4 12.552 18.32 13.088 18.192 13.6M14.072 18.048C14.552 17.16 14.92 16.2 15.176 15.2H17.536C16.7609 16.5346 15.5313 17.5456 14.072 18.048ZM13.872 13.6H10.128C10.048 13.072 10 12.544 10 12C10 11.456 10.048 10.92 10.128 10.4H13.872C13.944 10.92 14 11.456 14 12C14 12.544 13.944 13.072 13.872 13.6ZM12 18.368C11.336 17.408 10.8 16.344 10.472 15.2H13.528C13.2 16.344 12.664 17.408 12 18.368ZM8.8 8.8H6.464C7.23108 7.46177 8.45984 6.44919 9.92 5.952C9.44 6.84 9.08 7.8 8.8 8.8ZM6.464 15.2H8.8C9.08 16.2 9.44 17.16 9.92 18.048C8.4629 17.5453 7.23588 16.5342 6.464 15.2ZM5.808 13.6C5.68 13.088 5.6 12.552 5.6 12C5.6 11.448 5.68 10.912 5.808 10.4H8.512C8.448 10.928 8.4 11.456 8.4 12C8.4 12.544 8.448 13.072 8.512 13.6M12 5.624C12.664 6.584 13.2 7.656 13.528 8.8H10.472C10.8 7.656 11.336 6.584 12 5.624ZM17.536 8.8H15.176C14.9256 7.80917 14.5549 6.85272 14.072 5.952C15.544 6.456 16.768 7.472 17.536 8.8ZM12 4C7.576 4 4 7.6 4 12C4 14.1217 4.84285 16.1566 6.34315 17.6569C7.08601 18.3997 7.96793 18.989 8.93853 19.391C9.90914 19.7931 10.9494 20 12 20C14.1217 20 16.1566 19.1571 17.6569 17.6569C19.1571 16.1566 20 14.1217 20 12C20 10.9494 19.7931 9.90914 19.391 8.93853C18.989 7.96793 18.3997 7.08601 17.6569 6.34315C16.914 5.60028 16.0321 5.011 15.0615 4.60896C14.0909 4.20693 13.0506 4 12 4Z" fill="#333333" />
            </svg>
            <div class="account__text"><?php echo get_user_meta($id, 'user-site', true); ?> </div>
        </a>
        <a href="mailto:<?php echo $user->user_email; ?>" class="account__item">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2.66663 6.49339L11.9998 14.4058L21.333 6.49339C21.333 6.49339 21.3332 14.9664 21.3332 18.6663C15.1115 18.6663 8.88865 18.6663 2.66652 18.6663C2.66646 14.7412 2.66663 6.49339 2.66663 6.49339ZM19.9565 5.33468L12.0046 12.465L4.04982 5.33301L19.9565 5.33468Z" fill="#333333" />
            </svg>
            <div class="account__text"><?php echo $user->user_email; ?> </div>
        </a>
    </div>

    <div class="account__btns">
        <a href="https://zuchelkueche.com/account/edit-account/" class="edit-btn">Edit info
            <svg width="19" height="18" viewBox="0 0 19 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.75 2.75H2.5V15H14.75V9.75M13.4375 1.4375L6 8.875V11.5H8.625L16.5 3.625L13.875 1L13.4375 1.4375Z" stroke="#333333" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
        </a>
        <a href="https://zuchelkueche.com/account/edit-account/" class="change-pass">Change password</a>
    </div>

<?php
}
add_action('woocommerce_account_dashboard', 'main_block_account', 999);

add_shortcode('registration-page', function () {
    $company = '';
    $companynumber = '';
    $firstname = '';
    $lastname = '';
    $position = '';
    $country = '';
    $town = '';
    $adress = '';
    $zipcode = '';
    $phone = '';
    $email = '';
    $website = '';
    ob_start();
?>
    <div class="registration">
        <div class="container">
            <h1 class="title">Sign up</h1>
            <div class="text text--mrgbtm">To register on our website, you need to fill out a form. Your data will be sent to the site administrator. You will receive an email confirming your registration.</div>
            <form action="<?= admin_url('admin-post.php'); ?>" method="post" class="form form-registration form-base">
                <input type="hidden" name="action" value="custom_registration" />
                <input type="hidden" name="redirect" value="/registration-success" />
                <div class="star"><input value="<?php echo $company; ?>" type="text" name="company" placeholder="Company" minlength="3" required></div>
                <div class="star"><input value="<?php echo $companynumber; ?>" class="mini-mrg" type="text" name="companynumber" placeholder="Company registration number" minlength="3" required></div>
                <div class="form-row">
                    <input type="text" value="<?php echo $firstname; ?>" name="firstname" placeholder="First name" minlength="3" required>
                    <input type="text" value="<?php echo $lastname; ?>" name="lastname" placeholder="Last name" minlength="3" required>
                </div>
                <input class="mini-mrg" value="<?php echo $position; ?>" type="text" name="position" placeholder="Position" minlength="3" required>
                <div class="form-row">
                    <input type="text" value="<?php echo $country; ?>" name="country" placeholder="Country" minlength="3" required>
                    <input type="text" value="<?php echo $town; ?>" name="city" placeholder="Town / City" minlength="3" required>
                </div>
                <div class="form-row mini-mrg">
                    <input type="text" value="<?php echo $adress; ?>" name="address" placeholder="Address" minlength="3" required>
                    <input type="number" value="<?php echo $zipcode; ?>" name="zipcode" placeholder="ZIP code" min="5" required>
                </div>
                <input type="tel" name="telreg" placeholder="Phone number" minlength="11" required>
                <input type="email" name="mailreg" value="<?php echo $email; ?>" placeholder="E-mail" minlength="5" required>
                <input type="text" name="website" value="<?php echo $website; ?>" placeholder="Website" minlength="5" required>
                <div class="text">Create a password</div>
                <div class="form-row password-con">
                    <input type="password" name="password" placeholder="Enter your password" minlength="3" required>
                    <input type="password" name="repeatpassword" placeholder="Repeat password" minlength="3" required>
                </div>
                <div class="error">Passwords do not match</div>
                <div class="registration__checkbox-con">
                    <label class="registration__checkbox">
                        <input type="radio">
                        <svg width="12" height="9" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M15.5 1.13353L6.61443 12L0.5 4.52245L1.64432 3.38892L6.61443 9.46704L14.3557 0L15.5 1.13353Z" fill="#404040" />
                        </svg>
                    </label>
                    <div class="text-mini">Ich habe die Politik bezüglich der <span><a href="/policy">Verarbeitung der Personendaten</a></span> zur Kenntnis genommen und stimme der Verarbeitung meiner oben angegebenen personenbezogenen Daten zu.</div>
                </div>
                <div class="error-form text-mini"></div>
                <button type="submit" class="very-black-btn">SIGN UP</button>
            </form>
        </div>
    </div>
<?php
    return ob_get_clean();
});

add_shortcode('latest-posts', function () {
    $args = array(
        'numberposts' => 7,
        'post_status' => 'publish',
    );
    $latest_posts = wp_get_recent_posts($args);
    ob_start();
?>
    <div class="swiper latest-post" id="latest-posts">
        <div class="swiper-wrapper">
            <?php foreach ($latest_posts as $p) { ?>
                <a href="<?php echo get_permalink($p['ID']); ?>" class="swiper-slide">
                    <div class="img-wrapper">
                        <img decoding="sync" alt="<?php echo $p['post_title'] ?> image" width="320" height="289" loading="lazy" src="<?php echo get_the_post_thumbnail_url($p['ID'], array(316, 289)); ?>" />
                    </div>
                    <div class="latest-post__text-wrapper">
                        <div class="post-title"><?php echo $p['post_title'] ?></div>
                        <div class="post-description"><?php echo $p['post_excerpt'] ?></div>
                        <?php $postData = explode('-', explode(' ', $p['post_date'])[0]);  ?>
                        <div class="post-data"><?php echo $postData[2] . '/' . $postData[1] . '/' . $postData[0]; ?></div>
                    </div>
                </a>
            <?php } ?>
        </div>
    </div>
    <div class="latest-posts__pag-nav">
        <div class="latest-posts__pag">

        </div>
        <div class="latest-posts__nav">
            <svg class="custom-left-arrow" width="21" height="24" viewBox="0 0 21 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5.24537e-07 12L20.4444 24L20.4444 -8.93655e-07L5.24537e-07 12Z" fill="#CCCCCC"></path>
            </svg>
            <svg class="custom-right-arrow" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M24 12L3.55556 24L3.55556 -8.93655e-07L24 12Z" fill="#CCCCCC"></path>
            </svg>
        </div>
    </div>
<?php
    return ob_get_clean();
});


function art_woo_add_custom_fields()
{

    global $product, $post;

    echo '<div class="options_group">'; // Группировка полей.

    // текстовое поле.
    woocommerce_wp_text_input(
        [
            'id'                => 'short_materials',
            'label'             => __('Краткое описание материалов', 'woocommerce'),
            'placeholder'       => 'Материалы',
            'desc_tip'          => 'true',
            'custom_attributes' => [],
            'description'       => __('Введите здесь перечисление материалов в том виде, который вы хотите увидеть на карточке товара', 'woocommerce'),
        ]
    );
    echo '</div>'; // Закрывающий тег Группировки полей
}

add_action('woocommerce_product_options_general_product_data', 'art_woo_add_custom_fields');


function art_woo_custom_fields_save($post_id)
{
    // Сохранение текстового поля.
    $woocommerce_text_field = $_POST['short_materials'];
    if (!empty($woocommerce_text_field)) {
        update_post_meta($post_id, 'short_materials', esc_attr($woocommerce_text_field));
    }
}

add_action('woocommerce_process_product_meta', 'art_woo_custom_fields_save', 10);

add_shortcode('burger-custom', function ($atts, $content) {
    $get_categories_product = get_terms('product_cat', [
        'orderby' => 'name',
        'order' => 'ASC',
        'hide_empty' => 0,
        'parent' => 0,
    ]);
    ob_start();
?>

    <div class="burger">
        <div class="burger__container">
            <div class="burger__wrapper" id="burger-wrapper">
                <div class="burger__left">
                    <a href="#" id="catalog-links">
                        CATALOG
                        <svg width="6" height="8" viewBox="0 0 6 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1.20002 0.800781L4.40002 4.00078L1.20002 7.20078" stroke="#7F7D58" stroke-linecap="round" />
                        </svg>
                    </a>
                    <a href="/find-store">Find store</a>
                    <a href="#" id="about-links">
                        About us
                        <svg width="6" height="8" viewBox="0 0 6 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1.20002 0.800781L4.40002 4.00078L1.20002 7.20078" stroke="#7F7D58" stroke-linecap="round" />
                        </svg>
                    </a>
                    <a href="/faqs">FAQ</a>
                    <a href="#">for partners</a>
                    <a href="/blog">Blog</a>
                    <?php echo do_shortcode($content); ?>
                </div>
                <div class="burger__right">
                    <div class="burger__links" id="catalog-links-right">
                        <?php foreach ($get_categories_product as $categories_item) { ?>
                            <a class="burger__link" href=" <?php echo esc_url(get_term_link((int)$categories_item->term_id)); ?>"> <?php echo esc_html($categories_item->name); ?></a>
                        <?php } ?>
                    </div>
                    <div class="burger__links" id="about-links-right">
                        <a href="#" class="burger__link">ZUCHEL Küche GmbH</a>
                        <a href="#" class="burger__link">Work process</a>
                        <a href="#" class="burger__link">Warranty</a>
                        <a href="/feedback" class="burger__link">Feedback</a>
                    </div>
                </div>
            </div>
            <a id="btn-in-burger" href="#callback" class="very-black-btn">GET CONSULTATION</a>
        </div>
    </div>
<?php
    return ob_get_clean();
});

add_shortcode('find-store', function () {
    ob_start();
?>
    <div class="findstore__section">
        <div class="findstore__wrapper--small">
            <div class="findstore__con">
                <div class="findstore__choice ">
                    <div class="findstore__title" id="country-title"><span>COUNTRY</span></div>
                    <div class="findstore__wrapper" id="country"></div>
                </div>
                <div class="findstore__choice ">
                    <div class="findstore__title" id="city-title"><span>TOWN / CITY</span></div>
                    <div class="findstore__wrapper" id="city"></div>
                </div>
                <div class="findstore__choice">
                    <div class="findstore__title" id="street-title"><span>STREET</span></div>
                    <div class="findstore__wrapper" id="street"></div>
                </div>
                <div class="findstore__brand">
                    <button class="findstore__brand-btn" data-brand="MONOBRAND">MONOBRAND</button>
                    <button class="findstore__brand-btn" data-brand="MULTIBRAND">MULTIBRAND</button>
                </div>
            </div>
            <div class="findstore__stores">
                <?php if (have_rows('find_store', 'option')) :
                    while (have_rows('find_store', 'option')) : the_row(); ?>
                        <a href="<?php the_sub_field('page_url', 'option');  ?>" class="findstore" data-country="<?php the_sub_field('store_country', 'option');  ?>" data-city="<?php the_sub_field('store_city', 'option');  ?>" data-street="<?php the_sub_field('store_street', 'option');  ?>" data-brand="<?php the_sub_field('store_brand', 'option');  ?>">
                            <div class="findstore__stars" data-stars="<?php the_sub_field('stars', 'option');  ?>"></div>
                            <div class="findstore__name"><?php the_sub_field('store_name', 'option');  ?></div>
                            <div class="findstore__adress"><?php echo get_sub_field('store_country', 'option') . ' ' . get_sub_field('store_city', 'option') . ' ' . get_sub_field('store_street', 'option')  . ' ' . get_sub_field('store_street_number', 'option'); ?></div>
                            <div class="findstore__descr"><?php the_sub_field('store_description', 'option');  ?></div>
                            <div class="findstore__more-info">
                                More info
                                <svg width="18" height="9" viewBox="0 0 18 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M16.6999 4.39744L17.0831 4.03446L16.6999 3.67149L12.9691 0.137025C12.7686 -0.0528906 12.4522 -0.0443375 12.2623 0.156129C12.0723 0.356595 12.0809 0.673062 12.2814 0.862978L15.1009 3.53413H0.5C0.223858 3.53413 0 3.75799 0 4.03413C0 4.31027 0.223858 4.53413 0.5 4.53413H15.1016L12.2814 7.20595C12.0809 7.39586 12.0723 7.71233 12.2623 7.91279C12.4522 8.11326 12.7686 8.12181 12.9691 7.9319L16.6999 4.39744Z" fill="#595959" />
                                </svg>
                            </div>
                        </a>
                <?php endwhile;
                endif; ?>
            </div>
        </div>
        <div class="findstore__wrapper--big">
            <iframe src="https://www.google.com/maps/d/u/0/embed?mid=1HD1_nUjYQnrerIorLW2XolZOZcSU1j0&ehbc=2E312F&noprof=1" width="640" height="480"></iframe>
        </div>
    </div>

<?php
    return ob_get_clean();
});

add_shortcode('latest-posts-all', function ($atts) {
    $args = array(
        'numberposts' => 7,
        'post_status' => 'publish',
    );
    $atts = shortcode_atts([
        'title' => 'Keep up on latest news, important events and innovative furniture solutions',
        'text-btn'  => 'TO THE BLOG PAGE',
        'href'  => '/blog',
    ], $atts);
    $latest_posts = wp_get_recent_posts($args);
    ob_start();
?>
    <section class="latest-news-all">
        <div class="latest-news__info">
            <div class="latest-news__title"><?php echo $atts['title'] ?></div>
            <a href=" <?php echo $atts['href'] ?>" class="very-black-btn"><?php echo $atts['text-btn'] ?></a>
        </div>
        <div class="dark-nav">
            <div class="swiper latest-post" id="latest-posts">
                <div class="swiper-wrapper">
                    <?php foreach ($latest_posts as $p) { ?>
                        <a href="<?php echo get_permalink($p['ID']); ?>" class="swiper-slide">
                            <div class="img-wrapper">
                                <img decoding="sync" alt="<?php echo $p['post_title'] ?> image" width="320" height="289" loading="lazy" src="<?php echo get_the_post_thumbnail_url($p['ID'], array(316, 289)); ?>" />
                            </div>
                            <div class="latest-post__text-wrapper">
                                <div class="post-title"><?php echo $p['post_title'] ?></div>
                                <div class="post-description"><?php echo $p['post_excerpt'] ?></div>
                                <div class="post-data"><?php echo str_replace('-', '/', explode(' ', $p['post_date'])[0]); ?></div>
                            </div>
                        </a>
                    <?php } ?>
                </div>
            </div>
            <div class="latest-posts__pag-nav">
                <div class="latest-posts__pag">

                </div>
                <div class="latest-posts__nav">
                    <svg class="custom-left-arrow" width="21" height="24" viewBox="0 0 21 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5.24537e-07 12L20.4444 24L20.4444 -8.93655e-07L5.24537e-07 12Z" fill="#CCCCCC"></path>
                    </svg>
                    <svg class="custom-right-arrow" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M24 12L3.55556 24L3.55556 -8.93655e-07L24 12Z" fill="#CCCCCC"></path>
                    </svg>
                </div>
            </div>
        </div>
    </section>


<?php
    return ob_get_clean();
});


function latest_post_account()
{

    $args = array(
        'numberposts' => 7,
        'post_status' => 'publish',
    );
    $latest_posts = wp_get_recent_posts($args);
?>
    <div class="dark-pag">
        <div class="latest-post__title">Actual news</div>
        <div class="swiper latest-post latest-post-account" id="latest-posts-account">
            <div class="swiper-wrapper">
                <?php foreach ($latest_posts as $p) { ?>
                    <a href="<?php echo get_permalink($p['ID']); ?>" class="swiper-slide">
                        <div class="img-wrapper">
                            <img decoding="sync" alt="<?php echo $p['post_title'] ?> image" width="320" height="289" loading="lazy" src="<?php echo get_the_post_thumbnail_url($p['ID'], array(316, 289)); ?>" />
                        </div>
                        <div class="latest-post__text-wrapper">
                            <div class="post-title"><?php echo $p['post_title'] ?></div>
                            <div class="post-description"><?php echo $p['post_excerpt'] ?></div>
                            <div class="post-data"><?php echo str_replace('-', '/', explode(' ', $p['post_date'])[0]); ?></div>
                        </div>
                    </a>
                <?php } ?>
            </div>
        </div>
        <div class="latest-posts__pag-nav">
            <div class="latest-posts__pag">

            </div>
        </div>
    </div>
<?php
}



add_action('woocommerce_account_dashboard', 'latest_post_account', 1000);

add_action('save_post', 'my_extra_fields_save_on_update', 0);

function my_extra_fields_save_on_update($post_id)
{
    // базовая проверка
    if (wp_is_post_autosave($post_id) || wp_is_post_revision($post_id)) return false;

    if (count(get_post_meta($post_id, 'estimate_custom')) == 0) {
        add_post_meta($post_id, 'estimate_custom', 0, true);
    }

    return $post_id;
}

function articles_add()
{
    check_ajax_referer('articles-nonce', 'articles-nonce');

    if (!isset($_POST['estimation']) & !isset($_POST['post_id'])) return;

    $est = $_POST['estimation'];
    $post_id = (int) $_POST['post_id'];

    if (get_post_meta($post_id, 'estimate_custom', true) == '') {
        add_post_meta($post_id, 'estimate_custom', 0, true);
    }

    $number = get_post_meta($post_id, 'estimate_custom', true);

    if ($est == 'yes') {
        update_post_meta($post_id, 'estimate_custom', $number + 1);
        echo get_post_meta($post_id, 'estimate_custom', true);
    } else {
        update_post_meta($post_id, 'estimate_custom', $number - 1);
        echo get_post_meta($post_id, 'estimate_custom', true);
    }

    wp_die();
}

if (wp_doing_ajax()) {
    add_action('wp_ajax_registration_action', 'init_custom_reg');
    add_action('wp_ajax_nopriv_registration_action', 'init_custom_reg');

    add_action('wp_ajax_articles_action', 'articles_add');
    add_action('wp_ajax_nopriv_articles_action', 'articles_add');
}


add_action('add_meta_boxes', 'myplugin_add_custom_box', 1);

function myplugin_add_custom_box()
{
    $screens = array('post');
    add_meta_box('myplugin_sectionid', 'Оценка поста', 'myplugin_meta_box_callback', $screens);
}

// HTML код блока
function myplugin_meta_box_callback($post, $meta)
{
    $value = get_post_meta($post->ID, 'estimate_custom', true);

    if ($value == '') {
        add_post_meta($post->ID, 'estimate_custom', 0, true);
        $value = 0;
    }

    echo '<div>Оценка у этой записи составляет ' . $value . '</div>';
}

?>
