<?php
/**
 * WooCommerce Customer effort score tracks
 *
 * @package WooCommerce\Admin\Features
 */

namespace Automattic\WooCommerce\Admin\Features;

defined( 'ABSPATH' ) || exit;

/**
 * Triggers customer effort score on several different actions.
 */
class CustomerEffortScoreTracks {
	/**
	 * Class instance.
	 *
	 * @var CustomerEffortScoreTracks instance
	 */
	protected static $instance = null;

	/**
	 * Option name for the set of actions that have been shown.
	 */
	const SHOWN_FOR_ACTIONS_OPTION_NAME = 'wcadmin_ces_shown_for_actions';

	/**
	 * Action name for produce add/publish.
	 */
	const PRODUCT_ADD_PUBLISH_ACTION_NAME = 'product_add_publish';

	/**
	 * Get class instance.
	 */
	public static function get_instance() {
		if ( ! self::$instance ) {
			self::$instance = new self();
		}

		return self::$instance;
	}

	/**
	 * Constructor. Sets up filters to hook into WooCommerce.
	 */
	public function __construct() {
		add_filter( 'add_meta_boxes_product', array( $this, 'add_meta_boxes_product' ) );
	}

	/**
	 * Hook into the Publish button for products, to trigger the customer
	 * effort score widget after save.
	 *
	 * @param WP_Post $post The post, not used.
	 */
	public function add_meta_boxes_product( $post ) {
		// Only add the JS if tracking is allowed.
		$allow_tracking = 'yes' === get_option( 'woocommerce_allow_tracking', 'no' );
		if ( ! $allow_tracking ) {
			return;
		}

		// Only add the JS if this modal hasn't been dismissed or actioned yet
		// for this action.
		$shown_for_features = get_option( self::SHOWN_FOR_ACTIONS_OPTION_NAME, array() );
		$has_been_shown     = in_array(
			self::PRODUCT_ADD_PUBLISH_ACTION_NAME,
			$shown_for_features,
			true
		);
		if ( $has_been_shown ) {
			return;
		}

		wc_enqueue_js(
			"
			(function() {
				if ( $( 'h1.wp-heading-inline' ).text().trim() !== '" . __( 'Add new product', 'woocommerce-admin' ) . "' ) {
					return;
				}

				$( '#publish' ).click( function() {
					var json = JSON.stringify( [ {
						action: '" . self::PRODUCT_ADD_PUBLISH_ACTION_NAME . "',
						label: '" . __( 'Provide effort for adding a new product', 'woocommerce-admin' ) . "',					
					} ] );
					localStorage.setItem( 'customerEffortScoreTracks', json );
				} );
			})();
			"
		);
	}
}
