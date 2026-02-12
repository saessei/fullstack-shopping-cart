const { supabase } = require('./supabaseClient');

const products = [
  {
    info: {
      name: 'Apple iPhone 8 Plus',
      dimensions: '158.4 x 78.1 x 7.5 mm',
      weight: '202 g',
      displayType: 'LED-backlit IPS LCD, capacitive touchscreen, 16M colors',
      displaySize: '5.5"',
      displayResolution: '1080 x 1920 pixels',
      os: 'iOS 11',
      cpu: 'Hexa-core (2x Monsoon + 4x Mistral)',
      internalMemory: '256 GB',
      ram: '3 GB',
      camera: 'Dual: 12 MP (f/1.8, 28mm, OIS) + 12 MP (f/2.8, 57mm)',
      batery: 'Non-removable Li-Ion 2691 mAh battery (10.28 Wh)',
      color: 'White',
      price: 700,
      photo: '/img/apple_iphone_8_plus.jpg'
    },
    tags: {
      priceRange: '500-750',
      brand: 'apple',
      color: 'white',
      os: 'ios',
      internalMemory: '256',
      ram: '3',
      displaySize: '5.5',
      displayResolution: '1080x1920',
      camera: '12',
      cpu: 'hexa_core'
    }
  },
  {
    info: {
      name: 'Apple iPhone X',
      dimensions: '143.6 x 70.9 x 7.7 mm',
      weight: '174 g',
      displayType: 'Super AMOLED capacitive touchscreen, 16M colors',
      displaySize: '5.8"',
      displayResolution: '1125 x 2436 pixels',
      os: 'iOS 11.1.1',
      cpu: 'Hexa-core 2.39 GHz (2x Monsoon + 4x Mistral)',
      internalMemory: '256 GB',
      ram: '3 GB',
      camera: 'Dual: 12 MP (f/1.8, 28mm) + 12 MP (f/2.4, 52mm)',
      batery: 'Non-removable Li-Ion 2716 mAh battery (10.35 Wh)',
      color: 'Black',
      price: 950,
      photo: '/img/apple_iphone_x.jpg'
    },
    tags: {
      priceRange: '750>',
      brand: 'apple',
      color: 'black',
      os: 'ios',
      internalMemory: '256',
      ram: '3',
      displaySize: '5.8',
      displayResolution: '1125x2436',
      camera: '12',
      cpu: 'hexa_core'
    }
  },
  // Add all remaining products here...
];

// Seed function
const seedProducts = async () => {
  try {
    // Optional: clear the table first
    await supabase.from('products').delete().neq('id', 0);
    console.log('PRODUCTS CLEARED');

    for (const product of products) {
      const { data, error } = await supabase
        .from('products')
        .insert([{ ...product }]);

      if (error) {
        console.log('ERROR CREATING PRODUCT:', error.message);
      } else {
        console.log('PRODUCT CREATED:', data[0].info.name);
      }
    }

    console.log('ALL PRODUCTS SEEDED');
  } catch (err) {
    console.log('SEED ERROR:', err.message);
  }
};

module.exports = seedProducts;
