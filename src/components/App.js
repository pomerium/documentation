import React, { useContext, useState } from 'react';
import { ProductContext } from './ProductVersions';

export default function App(props) {
  const [defaultProduct, _] = useContext(ProductContext);
  const productState = useState(defaultProduct);
  return (
    <ProductContext.Provider value={productState}>
      {props.children}
    </ProductContext.Provider>
  );
}
