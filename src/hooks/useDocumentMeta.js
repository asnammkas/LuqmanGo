import { useEffect } from 'react';

const SITE_NAME = 'LuqmanGo';
const DEFAULT_DESCRIPTION = 'Shop curated, premium essentials at LuqmanGo. Discover electronics, fashion, groceries, furniture and more — sustainably sourced and delivered to your doorstep.';

/**
 * Sets the document title and meta description for the current page.
 * Automatically appends the site name.
 * 
 * @param {string} title - Page-specific title (e.g. "About Us")
 * @param {string} [description] - Optional meta description override
 */
const useDocumentMeta = (title, description) => {
  useEffect(() => {
    // Set document title
    document.title = title ? `${title} | ${SITE_NAME}` : SITE_NAME;

    // Set meta description
    const desc = description || DEFAULT_DESCRIPTION;
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', desc);

    // Cleanup: reset to defaults when component unmounts
    return () => {
      document.title = SITE_NAME;
      if (metaDesc) {
        metaDesc.setAttribute('content', DEFAULT_DESCRIPTION);
      }
    };
  }, [title, description]);
};

export default useDocumentMeta;
