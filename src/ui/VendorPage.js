import React, { Component } from 'react';
import OrderSelector from './OrderSelector';
const classes = require('./VendorPage.module.css');

export default class VendorPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newName: props.plugin.name,
      setName: props.plugin.name,
    };
  }

  render() {
    const { burnerComponents, plugin, match, accounts, actions } = this.props;
    const { Page, AccountBalance } = burnerComponents;
    const selectedVendor = match.params.vendorName ? plugin.getVendor(match.params.vendorName) : null;
    const { newName, setName } = this.state;
    const asset = plugin.getAsset();

    return (
      <Page title="Vendors">
        <input value={newName} onChange={e => this.setState({ newName: e.target.value })} />
        <button
          onClick={() => {
            plugin.setName(newName);
            this.setState({ setName: newName });
          }}
          disabled={newName === setName}
        >
          Set Name
        </button>

        <div>Select Vendor</div>
        <div className={classes.vendorList}>
          {plugin.getVendors().map(vendor => (
            <button
              key={vendor.id}
              onClick={() => actions.navigateTo(`/vendors/${vendor.id}`)}
              disabled={selectedVendor && vendor.id === selectedVendor.id}
            >
              {vendor.name}
            </button>
          ))}
        </div>

        <div>Order</div>
        {!selectedVendor && <div>Select a vendor</div>}
        {selectedVendor && accounts.length > 0 && (
          <AccountBalance
            asset={asset.id}
            account={accounts[0]}
            render={(err, balance) => balance ? (
              <OrderSelector
                items={selectedVendor.items}
                balance={balance}
                onSend={(amount, message) => {
                  actions.send({
                    asset: asset.id,
                    ether: amount.toString(),
                    message: `[${plugin.name}] ${message}`,
                    to: selectedVendor.address,
                  });
                }}
              />
           ) : 'Loading...'}
          />
        )}
      </Page>
    );
  }
}