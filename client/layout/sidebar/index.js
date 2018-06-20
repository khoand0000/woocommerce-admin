/** @format */
/**
 * External dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import classnames from 'classnames';
import { Component } from '@wordpress/element';
import { IconButton, TabPanel } from '@wordpress/components';
import { uniqueId } from 'lodash';

/**
 * Internal dependencies
 */
import './style.scss';
import ActivityList from 'components/activity-list';
import Count from 'components/count';
import { H, Section } from 'layout/section';

class Sidebar extends Component {
	getTabs() {
		return [
			{
				name: 'orders',
				title: (
					<span>
						{ __( 'Orders', 'woo-dash' ) }{' '}
						<Count count={ 1 } label={ sprintf( __( '%d Unfulfilled', 'woo-dash' ), 3 ) } />
					</span>
				),
				className: 'woocommerce-layout__sidebar-tab',
			},
			{
				name: 'reviews',
				title: (
					<span>
						{ __( 'Reviews', 'woo-dash' ) } <Count count={ 7 } />
					</span>
				),
				className: 'woocommerce-layout__sidebar-tab',
			},
			{
				name: 'stock',
				title: <span>{ __( 'Stock', 'woo-dash' ) }</span>,
				className: 'woocommerce-layout__sidebar-tab',
			},
		];
	}

	render() {
		const { isOpen, onToggle } = this.props;
		const className = classnames( 'woocommerce-layout__secondary', {
			'is-opened': isOpen,
		} );
		const headerId = uniqueId( 'sidebar-header_' );
		const tabs = this.getTabs();

		return (
			<aside className={ className } aria-labelledby={ headerId }>
				<header className="woocommerce-layout__sidebar-top">
					<H className="woocommerce-layout__sidebar-title screen-reader-text" id={ headerId }>
						{ __( 'Store Activity', 'woo-dash' ) }
					</H>
					<div className="woocommerce-layout__sidebar-toggle">
						<IconButton
							className="woocommerce-layout__sidebar-button"
							onClick={ onToggle }
							icon="no-alt"
							label={ __( 'Close Sidebar', 'woo-dash' ) }
						/>
					</div>
				</header>
				<TabPanel
					className="woocommerce-layout__sidebar-tabs"
					activeClass="is-active"
					tabs={ tabs }
				>
					{ selectedTabName => {
						return (
							<Section component={ false }>
								<H>Section: { selectedTabName }</H>
								<ActivityList section={ selectedTabName } />
							</Section>
						);
					} }
				</TabPanel>
			</aside>
		);
	}
}

export default Sidebar;
