import S3_ASSETS from '../config/s3-assets';

const ElementalLogo = ({ className = "w-16 h-16" }) => {
  return (
    <img 
      src={S3_ASSETS.logos.elemental} 
      alt="Gardenia 2025 Elemental Logo" 
      className={`${className} object-contain`}
    />
  );
};

export default ElementalLogo;
