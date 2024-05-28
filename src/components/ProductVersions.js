import { createContext, useContext } from 'react';

export const Products = ['Core', 'Zero', 'Enterprise', 'Ingress Controller'];

/*const products = [
  { tag: 'zero', label: 'Pomerium Zero' },
  { tag: 'core', label: 'Pomerium (Open Source)' },
  { tag: 'enterprise', label: 'Pomerium Enterprise' },
  { tag: 'ic', label: 'Ingress Controller' },
];*/

export const ProductContext = createContext([Products[0], function() {}]);


