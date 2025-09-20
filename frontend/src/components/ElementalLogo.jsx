import GITHUB_ASSETS from '../config/github-assets';

const ElementalLogo = ({ className = "w-16 h-16" }) => {
  return (
    <img 
      src={GITHUB_ASSETS.logos.elemental} 
      alt="Gardenia 2025 Elemental Logo" 
      className={`${className} object-contain`}
    />
  );
};

export default ElementalLogo;
