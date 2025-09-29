import S3_ASSETS from '../config/s3-assets';
import ImageLoader from './ImageLoader';

const ElementalLogo = ({ className = "w-16 h-16" }) => {
  return (
    <ImageLoader 
      src={S3_ASSETS.logos.elemental} 
      alt="Gardenia 2025 Elemental Logo" 
      className={`${className} logo-image`}
    />
  );
};

export default ElementalLogo;
