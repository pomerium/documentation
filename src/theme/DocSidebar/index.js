import React, { useContext } from 'react';
import DocSidebar from '@theme-original/DocSidebar';
import { ProductContext } from '../../components/ProductVersions';

export default function DocSidebarWrapper(props) {
  const [product, _] = useContext(ProductContext);
  props = {...props, sidebar: filterItemsByProduct(props.sidebar, product)};
  return <DocSidebar {...props} />;
}

function filterItemsByProduct(items, product) {
  const byProduct = (item) => {
    if (item.customProps === undefined) {
      return true;
    }
    const products = item.customProps.products;
    return products === undefined || products.includes(product);
  };
  return filterRecursive(items, byProduct)
}

function filterRecursive(items, f) {
  const filtered = items.filter(f);
  for (const item of filtered) {
    if (item.items !== undefined) {
      item.items = filterRecursive(item.items, f)
    }
  }
  return filtered;
}
