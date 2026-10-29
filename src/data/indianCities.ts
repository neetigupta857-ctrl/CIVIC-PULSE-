export interface CityItem {
  name: string;
  state: string;
  lat: number;
  lng: number;
  zoom: number;
}

export const ALL_INDIAN_CITIES: CityItem[] = [
  // National Overview
  { name: 'All India (National)', state: 'National', lat: 20.5937, lng: 78.9629, zoom: 5 },

  // Tier 1 Megacities & NCR
  { name: 'New Delhi (NCR)', state: 'Delhi', lat: 28.6139, lng: 77.2090, zoom: 12 },
  { name: 'Noida', state: 'Uttar Pradesh', lat: 28.5355, lng: 77.3910, zoom: 12 },
  { name: 'Greater Noida', state: 'Uttar Pradesh', lat: 28.4744, lng: 77.5040, zoom: 12 },
  { name: 'Gurugram (Gurgaon)', state: 'Haryana', lat: 28.4595, lng: 77.0266, zoom: 12 },
  { name: 'Faridabad', state: 'Haryana', lat: 28.4089, lng: 77.3178, zoom: 12 },
  { name: 'Ghaziabad', state: 'Uttar Pradesh', lat: 28.6692, lng: 77.4538, zoom: 12 },
  { name: 'Mumbai', state: 'Maharashtra', lat: 19.0760, lng: 72.8777, zoom: 12 },
  { name: 'Navi Mumbai', state: 'Maharashtra', lat: 19.0330, lng: 73.0297, zoom: 12 },
  { name: 'Thane', state: 'Maharashtra', lat: 19.2183, lng: 72.9781, zoom: 12 },
  { name: 'Bengaluru (Bangalore)', state: 'Karnataka', lat: 12.9716, lng: 77.5946, zoom: 12 },
  { name: 'Hyderabad', state: 'Telangana', lat: 17.3850, lng: 78.4867, zoom: 12 },
  { name: 'Chennai', state: 'Tamil Nadu', lat: 13.0827, lng: 80.2707, zoom: 12 },
  { name: 'Kolkata', state: 'West Bengal', lat: 22.5726, lng: 88.3639, zoom: 12 },
  { name: 'Pune', state: 'Maharashtra', lat: 18.5204, lng: 73.8567, zoom: 12 },
  { name: 'Ahmedabad', state: 'Gujarat', lat: 23.0225, lng: 72.5714, zoom: 12 },

  // Uttar Pradesh
  { name: 'Lucknow', state: 'Uttar Pradesh', lat: 26.8467, lng: 80.9462, zoom: 12 },
  { name: 'Kanpur', state: 'Uttar Pradesh', lat: 26.4499, lng: 80.3319, zoom: 12 },
  { name: 'Varanasi (Banaras)', state: 'Uttar Pradesh', lat: 25.3176, lng: 82.9739, zoom: 12 },
  { name: 'Prayagraj (Allahabad)', state: 'Uttar Pradesh', lat: 25.4358, lng: 81.8463, zoom: 12 },
  { name: 'Agra', state: 'Uttar Pradesh', lat: 27.1767, lng: 78.0081, zoom: 12 },
  { name: 'Meerut', state: 'Uttar Pradesh', lat: 28.9845, lng: 77.7064, zoom: 12 },
  { name: 'Bareilly', state: 'Uttar Pradesh', lat: 28.3670, lng: 79.4304, zoom: 12 },
  { name: 'Aligarh', state: 'Uttar Pradesh', lat: 27.8974, lng: 78.0880, zoom: 12 },
  { name: 'Moradabad', state: 'Uttar Pradesh', lat: 28.8351, lng: 78.7733, zoom: 12 },
  { name: 'Saharanpur', state: 'Uttar Pradesh', lat: 29.9679, lng: 77.5510, zoom: 12 },
  { name: 'Gorakhpur', state: 'Uttar Pradesh', lat: 26.7606, lng: 83.3732, zoom: 12 },
  { name: 'Ayodhya', state: 'Uttar Pradesh', lat: 26.7922, lng: 82.1998, zoom: 12 },
  { name: 'Jhansi', state: 'Uttar Pradesh', lat: 25.4484, lng: 78.5685, zoom: 12 },
  { name: 'Mathura', state: 'Uttar Pradesh', lat: 27.4924, lng: 77.6737, zoom: 12 },

  // Rajasthan
  { name: 'Jaipur', state: 'Rajasthan', lat: 26.9124, lng: 75.7873, zoom: 12 },
  { name: 'Jodhpur', state: 'Rajasthan', lat: 26.2389, lng: 73.0243, zoom: 12 },
  { name: 'Kota', state: 'Rajasthan', lat: 25.2138, lng: 75.8648, zoom: 12 },
  { name: 'Bikaner', state: 'Rajasthan', lat: 28.0229, lng: 73.3119, zoom: 12 },
  { name: 'Ajmer', state: 'Rajasthan', lat: 26.4499, lng: 74.6399, zoom: 12 },
  { name: 'Udaipur', state: 'Rajasthan', lat: 24.5854, lng: 73.7125, zoom: 12 },
  { name: 'Bhilwara', state: 'Rajasthan', lat: 25.3407, lng: 74.6313, zoom: 12 },
  { name: 'Alwar', state: 'Rajasthan', lat: 27.5530, lng: 76.6346, zoom: 12 },

  // Maharashtra
  { name: 'Nagpur', state: 'Maharashtra', lat: 21.1458, lng: 79.0882, zoom: 12 },
  { name: 'Nashik', state: 'Maharashtra', lat: 19.9975, lng: 73.7898, zoom: 12 },
  { name: 'Chhatrapati Sambhajinagar (Aurangabad)', state: 'Maharashtra', lat: 19.8762, lng: 75.3433, zoom: 12 },
  { name: 'Solapur', state: 'Maharashtra', lat: 17.6599, lng: 75.9064, zoom: 12 },
  { name: 'Amravati', state: 'Maharashtra', lat: 20.9374, lng: 77.7796, zoom: 12 },
  { name: 'Kolhapur', state: 'Maharashtra', lat: 16.7050, lng: 74.2433, zoom: 12 },
  { name: 'Nanded', state: 'Maharashtra', lat: 19.1383, lng: 77.3210, zoom: 12 },

  // Gujarat
  { name: 'Surat', state: 'Gujarat', lat: 21.1702, lng: 72.8311, zoom: 12 },
  { name: 'Vadodara (Baroda)', state: 'Gujarat', lat: 22.3072, lng: 73.1812, zoom: 12 },
  { name: 'Rajkot', state: 'Gujarat', lat: 22.3039, lng: 70.8022, zoom: 12 },
  { name: 'Bhavnagar', state: 'Gujarat', lat: 21.7645, lng: 72.1519, zoom: 12 },
  { name: 'Jamnagar', state: 'Gujarat', lat: 22.4707, lng: 70.0577, zoom: 12 },
  { name: 'Gandhinagar', state: 'Gujarat', lat: 23.2156, lng: 72.6369, zoom: 12 },

  // Madhya Pradesh
  { name: 'Indore', state: 'Madhya Pradesh', lat: 22.7196, lng: 75.8577, zoom: 12 },
  { name: 'Bhopal', state: 'Madhya Pradesh', lat: 23.2599, lng: 77.4126, zoom: 12 },
  { name: 'Jabalpur', state: 'Madhya Pradesh', lat: 23.1815, lng: 79.9864, zoom: 12 },
  { name: 'Gwalior', state: 'Madhya Pradesh', lat: 26.2183, lng: 78.1828, zoom: 12 },
  { name: 'Ujjain', state: 'Madhya Pradesh', lat: 23.1765, lng: 75.7885, zoom: 12 },
  { name: 'Sagar', state: 'Madhya Pradesh', lat: 23.8388, lng: 78.7378, zoom: 12 },

  // Punjab & Haryana & Chandigarh
  { name: 'Chandigarh', state: 'Chandigarh', lat: 30.7333, lng: 76.7794, zoom: 12 },
  { name: 'Ludhiana', state: 'Punjab', lat: 30.9010, lng: 75.8573, zoom: 12 },
  { name: 'Amritsar', state: 'Punjab', lat: 31.6340, lng: 74.8723, zoom: 12 },
  { name: 'Jalandhar', state: 'Punjab', lat: 31.3260, lng: 75.5762, zoom: 12 },
  { name: 'Patiala', state: 'Punjab', lat: 30.3398, lng: 76.3869, zoom: 12 },
  { name: 'Bathinda', state: 'Punjab', lat: 30.2110, lng: 74.9455, zoom: 12 },
  { name: 'Panipat', state: 'Haryana', lat: 29.3909, lng: 76.9635, zoom: 12 },
  { name: 'Ambala', state: 'Haryana', lat: 30.3782, lng: 76.7767, zoom: 12 },
  { name: 'Rohtak', state: 'Haryana', lat: 28.8955, lng: 76.6066, zoom: 12 },
  { name: 'Hisar', state: 'Haryana', lat: 29.1492, lng: 75.7217, zoom: 12 },
  { name: 'Karnal', state: 'Haryana', lat: 29.6857, lng: 76.9905, zoom: 12 },

  // Bihar & Jharkhand
  { name: 'Patna', state: 'Bihar', lat: 25.5941, lng: 85.1376, zoom: 12 },
  { name: 'Gaya', state: 'Bihar', lat: 24.7914, lng: 85.0002, zoom: 12 },
  { name: 'Bhagalpur', state: 'Bihar', lat: 25.2425, lng: 86.9842, zoom: 12 },
  { name: 'Muzaffarpur', state: 'Bihar', lat: 26.1209, lng: 85.3647, zoom: 12 },
  { name: 'Ranchi', state: 'Jharkhand', lat: 23.3441, lng: 85.3096, zoom: 12 },
  { name: 'Jamshedpur', state: 'Jharkhand', lat: 22.8046, lng: 86.2029, zoom: 12 },
  { name: 'Dhanbad', state: 'Jharkhand', lat: 23.7957, lng: 86.4304, zoom: 12 },
  { name: 'Bokaro', state: 'Jharkhand', lat: 23.6693, lng: 86.1511, zoom: 12 },

  // West Bengal & Odisha
  { name: 'Howrah', state: 'West Bengal', lat: 22.5958, lng: 88.2636, zoom: 12 },
  { name: 'Asansol', state: 'West Bengal', lat: 23.6739, lng: 86.9524, zoom: 12 },
  { name: 'Siliguri', state: 'West Bengal', lat: 26.7271, lng: 88.3953, zoom: 12 },
  { name: 'Durgapur', state: 'West Bengal', lat: 23.5204, lng: 87.3119, zoom: 12 },
  { name: 'Bhubaneswar', state: 'Odisha', lat: 20.2961, lng: 85.8245, zoom: 12 },
  { name: 'Cuttack', state: 'Odisha', lat: 20.4625, lng: 85.8828, zoom: 12 },
  { name: 'Rourkela', state: 'Odisha', lat: 22.2604, lng: 84.8536, zoom: 12 },
  { name: 'Puri', state: 'Odisha', lat: 19.8135, lng: 85.8312, zoom: 12 },

  // Andhra Pradesh & Telangana
  { name: 'Visakhapatnam (Vizag)', state: 'Andhra Pradesh', lat: 17.6868, lng: 83.2185, zoom: 12 },
  { name: 'Vijayawada', state: 'Andhra Pradesh', lat: 16.5062, lng: 80.6480, zoom: 12 },
  { name: 'Guntur', state: 'Andhra Pradesh', lat: 16.3067, lng: 80.4365, zoom: 12 },
  { name: 'Nellore', state: 'Andhra Pradesh', lat: 14.4426, lng: 79.9865, zoom: 12 },
  { name: 'Kurnool', state: 'Andhra Pradesh', lat: 15.8281, lng: 78.0373, zoom: 12 },
  { name: 'Tirupati', state: 'Andhra Pradesh', lat: 13.6288, lng: 79.4192, zoom: 12 },
  { name: 'Warangal', state: 'Telangana', lat: 17.9689, lng: 79.5941, zoom: 12 },
  { name: 'Nizamabad', state: 'Telangana', lat: 18.6725, lng: 78.0941, zoom: 12 },

  // Karnataka & Kerala & Tamil Nadu
  { name: 'Mysuru (Mysore)', state: 'Karnataka', lat: 12.2958, lng: 76.6394, zoom: 12 },
  { name: 'Hubballi-Dharwad', state: 'Karnataka', lat: 15.3647, lng: 75.1240, zoom: 12 },
  { name: 'Mangaluru (Mangalore)', state: 'Karnataka', lat: 12.9141, lng: 74.8560, zoom: 12 },
  { name: 'Belagavi (Belgaum)', state: 'Karnataka', lat: 15.8497, lng: 74.4977, zoom: 12 },
  { name: 'Coimbatore', state: 'Tamil Nadu', lat: 11.0168, lng: 76.9558, zoom: 12 },
  { name: 'Madurai', state: 'Tamil Nadu', lat: 9.9252, lng: 78.1198, zoom: 12 },
  { name: 'Tiruchirappalli (Trichy)', state: 'Tamil Nadu', lat: 10.7905, lng: 78.7047, zoom: 12 },
  { name: 'Salem', state: 'Tamil Nadu', lat: 11.6643, lng: 78.1460, zoom: 12 },
  { name: 'Tirunelveli', state: 'Tamil Nadu', lat: 8.7139, lng: 77.7567, zoom: 12 },
  { name: 'Thiruvananthapuram (Trivandrum)', state: 'Kerala', lat: 8.5241, lng: 76.9366, zoom: 12 },
  { name: 'Kochi (Cochin)', state: 'Kerala', lat: 9.9312, lng: 76.2673, zoom: 12 },
  { name: 'Kozhikode (Calicut)', state: 'Kerala', lat: 11.2588, lng: 75.7804, zoom: 12 },
  { name: 'Thrissur', state: 'Kerala', lat: 10.5276, lng: 76.2144, zoom: 12 },

  // Uttarakhand & Himachal Pradesh & J&K
  { name: 'Dehradun', state: 'Uttarakhand', lat: 30.3165, lng: 78.0322, zoom: 12 },
  { name: 'Haridwar', state: 'Uttarakhand', lat: 29.9457, lng: 78.1642, zoom: 12 },
  { name: 'Rishikesh', state: 'Uttarakhand', lat: 30.0869, lng: 78.2676, zoom: 12 },
  { name: 'Shimla', state: 'Himachal Pradesh', lat: 31.1048, lng: 77.1734, zoom: 12 },
  { name: 'Dharamshala', state: 'Himachal Pradesh', lat: 32.2190, lng: 76.3234, zoom: 12 },
  { name: 'Srinagar', state: 'Jammu & Kashmir', lat: 34.0837, lng: 74.7973, zoom: 12 },
  { name: 'Jammu', state: 'Jammu & Kashmir', lat: 32.7266, lng: 74.8570, zoom: 12 },

  // Assam & North-East
  { name: 'Guwahati', state: 'Assam', lat: 26.1445, lng: 91.7362, zoom: 12 },
  { name: 'Silchar', state: 'Assam', lat: 24.8333, lng: 92.7789, zoom: 12 },
  { name: 'Shillong', state: 'Meghalaya', lat: 25.5788, lng: 91.8933, zoom: 12 },
  { name: 'Agartala', state: 'Tripura', lat: 23.8315, lng: 91.2868, zoom: 12 },
  { name: 'Imphal', state: 'Manipur', lat: 24.8170, lng: 93.9368, zoom: 12 },
  { name: 'Aizawl', state: 'Mizoram', lat: 23.7271, lng: 92.7176, zoom: 12 },
  { name: 'Kohima', state: 'Nagaland', lat: 25.6751, lng: 94.1086, zoom: 12 },
  { name: 'Gangtok', state: 'Sikkim', lat: 27.3389, lng: 88.6065, zoom: 12 },

  // Goa & Chhattisgarh
  { name: 'Panaji (Goa)', state: 'Goa', lat: 15.4909, lng: 73.8278, zoom: 12 },
  { name: 'Raipur', state: 'Chhattisgarh', lat: 21.2514, lng: 81.6296, zoom: 12 },
  { name: 'Bhilai', state: 'Chhattisgarh', lat: 21.1938, lng: 81.3509, zoom: 12 },
  { name: 'Bilaspur', state: 'Chhattisgarh', lat: 22.0797, lng: 82.1409, zoom: 12 }
];

export const MAJOR_INDIAN_CITIES = ALL_INDIAN_CITIES;

