import React from 'react';
import { LinkPreview } from './ui/link-preview';

const Credits = () => {
  return (
    <div className="flex flex-wrap gap-1 fixed bottom-6">
      <p>Design & Developed By</p>
      <LinkPreview
        url="https://www.linkedin.com/in/subodhpalayekar/"
        className="font-bold bg-clip-text text-transparent bg-gradient-to-br from-purple-500 to-pink-500"
      >
        Subodh Palayekar ❤️
      </LinkPreview>{' '}
    </div>
  );
};

export default Credits;
