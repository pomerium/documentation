import ComponentTypes from '@theme-original/NavbarItem/ComponentTypes';
import DefaultNavbarItem from '@theme-original/NavbarItem/DefaultNavbarItem';
import DropdownNavbarItem from '@theme-original/NavbarItem/DropdownNavbarItem';
import { useContext } from 'react';
import { Products, ProductContext } from '../../components/ProductVersions';

const ProductDropdown = (props) => {
  const items = Products.map((p) => ({
      type: 'custom-productDropdownItem', label: p,
  }));
  const [version, _] = useContext(ProductContext);
  return <DropdownNavbarItem {...props} items={items} label={version} />;
}

const ProductDropdownItem = (props) => {
  const [version, setVersion] = useContext(ProductContext);
  const click = () => {
    setVersion(props.label);
  };
  const isActive = () => {
    // this doesn't work
    return version === props.label;
  };
  return <DefaultNavbarItem {...props} isActive={isActive} onClick={click}/>;
}

export default {
  ...ComponentTypes,
  'custom-productDropdown': ProductDropdown,
  'custom-productDropdownItem': ProductDropdownItem,
};
