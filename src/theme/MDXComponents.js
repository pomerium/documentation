import Since from '@site/src/components/Since';
import MDXComponents from '@theme-original/MDXComponents';

// Make <Since/> available in MDX without a per-file import.
export default {
  ...MDXComponents,
  Since,
};
