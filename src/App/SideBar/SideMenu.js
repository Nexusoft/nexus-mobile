import React from 'react';

import Divider from 'components/Divider';
import TokenIcon from 'icons/token.svg';
import NameIcon from 'icons/abc.svg';
import NamespaceIcon from 'icons/abc-cube.svg';
import AssetIcon from 'icons/asset.svg';
import WalletIcon from 'icons/wallet.svg';
import CoreIcon from 'icons/core.svg';
import NexusIcon from 'icons/nexus.svg';
import MenuItem from './MenuItem';

export default function SideMenu() {
  return (
    <>
      <MenuItem linkTo="Accounts" icon={WalletIcon} label="Accounts" />
      <MenuItem linkTo="Tokens" icon={TokenIcon} label="Tokens" />
      <MenuItem linkTo="Assets" icon={AssetIcon} label="Assets" />
      <MenuItem linkTo="Names" icon={NameIcon} label="Names" />
      <MenuItem linkTo="Namespaces" icon={NamespaceIcon} label="Namespaces" />
      <Divider spacing={5} />

      <MenuItem icon={CoreIcon} label="Core information" />
      <MenuItem icon={NexusIcon} label="About Nexus Wallet" />
    </>
  );
}
