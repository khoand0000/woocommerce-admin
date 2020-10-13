/**
 * External dependencies
 */
import { useState } from '@wordpress/element';
import PropTypes from 'prop-types';
import { recordEvent } from '@woocommerce/tracks';
import { compose } from '@wordpress/compose';
import { withSelect, withDispatch } from '@wordpress/data';
import { OPTIONS_STORE_NAME } from '@woocommerce/data';

/**
 * Internal dependencies
 */
import CustomerEffortScore from './customer-effort-score';

const SHOWN_FOR_ACTIONS_OPTION_NAME = 'wcadmin_ces_shown_for_actions';

/**
 * A CustomerEffortScore wrapper that uses tracks to track the selected
 * customer effort score.
 *
 * @param {Object}   props                              Component props.
 * @param {boolean}  props.initiallyVisible             Whether or not the tracks modal is initially visible.
 * @param {string}   props.action                       The action name sent to Tracks.
 * @param {string}   props.label                        The label displayed in the modal.
 * @param {Array}    props.cesShownForActions           The array of actions that the CES modal has been shown for.
 * @param {boolean}  props.requestingCesShownForActions Whether cesShownForActions is still being requested.
 * @param {Function} props.updateOptions                Function to update options.
 */
function CustomerEffortScoreTracks( {
	initiallyVisible,
	action,
	label,
	cesShownForActions,
	requestingCesShownForActions,
	updateOptions,
} ) {
	const [ visible, setVisible ] = useState( initiallyVisible );
	const [ shown, setShown ] = useState( false );

	if ( requestingCesShownForActions ) {
		return null;
	}

	if ( cesShownForActions.indexOf( action ) !== -1 && ! shown ) {
		return null;
	}

	// Use the `shown` state value to only update the shown_for_actions option
	// once.
	if ( ! requestingCesShownForActions && visible && ! shown ) {
		setShown( true );
		updateOptions( {
			[ SHOWN_FOR_ACTIONS_OPTION_NAME ]: [
				action,
				...cesShownForActions,
			],
		} );
	}

	const trackCallback = ( score ) => {
		recordEvent( 'wcadmin_ces_feedback', {
			action,
			score,
		} );
	};

	return (
		<CustomerEffortScore
			trackCallback={ trackCallback }
			visible={ visible }
			toggleVisible={ () => setVisible( ! visible ) }
			label={ label }
		/>
	);
}

CustomerEffortScoreTracks.propTypes = {
	/**
	 * Whether or not the tracks is initially visible. True is used for when
	 * this is loaded on page load (in client/index.js). False is used if the
	 * tracks modal is loaded as part of the layout and displayed
	 * programmatically.
	 */
	initiallyVisible: PropTypes.bool,
	/**
	 * The action name sent to Tracks.
	 */
	action: PropTypes.string.isRequired,
	/**
	 * The label displayed in the modal.
	 */
	label: PropTypes.string.isRequired,
	/**
	 * The array of actions that the CES modal has been shown for.
	 */
	cesShownForActions: PropTypes.arrayOf( PropTypes.string ).isRequired,
	/**
	 * Whether cesShownForActions is still being requested.
	 */
	requestingCesShownForActions: PropTypes.bool,
	/**
	 * Function to update options.
	 */
	updateOptions: PropTypes.func,
};

export default compose(
	withSelect( ( select ) => {
		const { getOption, isResolving } = select( OPTIONS_STORE_NAME );
		const cesShownForActions =
			getOption( SHOWN_FOR_ACTIONS_OPTION_NAME ) || [];
		const requestingCesShownForActions = isResolving( 'getOption', [
			SHOWN_FOR_ACTIONS_OPTION_NAME,
		] );

		return {
			cesShownForActions,
			requestingCesShownForActions,
		};
	} ),
	withDispatch( ( dispatch ) => {
		const { updateOptions } = dispatch( OPTIONS_STORE_NAME );

		return {
			updateOptions,
		};
	} )
)( CustomerEffortScoreTracks );
