// constants/mobileConstants.js

export const categories = [
    { id: 1, name: 'Apple', image: require('../assets/brands/apple.png') },
    { id: 2, name: 'Asus', image: require('../assets/brands/asus.png') },
    { id: 3, name: 'Samsung', image: require('../assets/brands/samsung.png') },
    { id: 4, name: 'Google', image: require('../assets/brands/google.png') },
    { id: 5, name: 'Poco', image: require('../assets/brands/poco.png') },
    { id: 6, name: 'OnePlus', image: require('../assets/brands/oneplus.png') },
    { id: 7, name: 'Motorola', image: require('../assets/brands/motorola.png') },
    { id: 8, name: 'Nokia', image: require('../assets/brands/nokia.png') },
  ];
  
  export const screenSizes = [
    '5.0 inch', '5.1 inch', '5.2 inch', '5.3 inch', '5.4 inch', '5.5 inch',
    '5.6 inch', '5.7 inch', '5.8 inch', '5.9 inch', '6.0 inch', '6.1 inch',
    '6.2 inch', '6.3 inch', '6.4 inch', '6.5 inch', '6.6 inch', '6.7 inch',
    '6.8 inch', '6.9 inch', '7.0 inch'
  ];
  
  export const batteryCapacities = [
    '2500mAh', '2700mAh', '2800mAh', '2900mAh', '3000mAh', '3200mAh', '3300mAh',
    '3500mAh', '3700mAh', '4000mAh', '4200mAh', '4500mAh', '5000mAh', '5500mAh',
    '6000mAh', '7000mAh'
  ];
  
  export const cameraQualities = [
    '2MP', '5MP', '8MP', '12MP', '13MP', '16MP', '20MP', '24MP', '32MP', '48MP',
    '50MP', '64MP', '108MP', '200MP', '400MP', '500MP'
  ];
  
  export const ramSizes = [
    '1GB', '2GB', '3GB', '4GB', '6GB', '8GB', '12GB', '16GB', '18GB', '24GB', 
    '32GB', '36GB', '48GB', '64GB'
  ];
  
  export const storageSizes = [
    '32GB', '64GB', '128GB', '256GB', '512GB', '1TB', '2TB', '4TB'
  ];
  
  export const conditions = [
    'New', 'Used', 'Refurbished'
  ];
  
  export const mobileConditions = [
    {
      id: 1,
      condition: 'Superb',
      description1: 'Overall - No Functional Issues',
      description2: 'Screen Glass - Minimal scratches that are not visible when the screen is on/off',
      description3: 'Display - No scratches or dead pixels',
      description4: 'Body - Minor signs of wear and light scratches. Invisible from a 20cm distance',
      image: null,
    },
    {
      id: 2,
      condition: 'Excellent',
      description1: 'Overall - No Functional Issues',
      description2: 'Screen Glass - Some minor scratches visible when screen is off',
      description3: 'Display - No dead pixels or burn-in',
      description4: 'Body - Some visible scratches or minor dents visible from 20cm distance',
      image: null,
    },
    {
      id: 3,
      condition: 'Good',
      description1: 'Overall - Fully Functional',
      description2: 'Screen Glass - Several visible scratches',
      description3: 'Display - Works perfectly but may have minor imperfections',
      description4: 'Body - Visible signs of use, multiple scratches or dents',
      image: null,
    },
    {
      id: 4,
      condition: 'Fair',
      description1: 'Overall - All essential functions work properly',
      description2: 'Screen Glass - Multiple scratches or minor cracks',
      description3: 'Display - May have minor defects that don\'t affect functionality',
      description4: 'Body - Heavy signs of use, multiple scratches, dents or discoloration',
      image: null,
    }
  ];