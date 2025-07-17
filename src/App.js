import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';

// Simulated user database (replace with Firebase in production)
let userDatabase = {
  users: {
    'demo@example.com': {
      id: 'demo-user',
      email: 'demo@example.com',
      password: 'demo123', // In real app, this would be hashed
      passwordResetToken: null,
      profile: {
        name: 'Demo User',
        locations: [
          {
            id: 'home',
            name: 'Home',
            city: 'Benoni',
            province: 'Gauteng',
            country: 'South Africa',
            coordinates: { lat: -26.1889, lng: 28.3119 },
            isActive: true,
            isPrimary: true
          },
          {
            id: 'work',
            name: 'Work',
            city: 'Johannesburg',
            province: 'Gauteng',
            country: 'South Africa',
            coordinates: { lat: -26.2041, lng: 28.0473 },
            isActive: false,
            isPrimary: false
          }
        ],
        activeLocationId: 'home'
      },
      config: {
        salary: 25000,
        people: 4,
        savingsGoal: 3000,
        categories: {
          rent: 8000, electricity: 800, water: 400, gas: 200, internet: 599,
          food: 6000, cleaning: 400, medication: 600, petcare: 300,
          transport: 1500, fuel: 1200, entertainment: 600, clothing: 500, other: 800
        },
        usualItems: [
          { id: '1', name: 'Bread Brown', brand: 'Sasko', category: 'food', currentPrice: 18.99 },
          { id: '2', name: 'Milk 2L', brand: 'Clover', category: 'food', currentPrice: 24.99 }
        ],
        foodPreferences: {
          proteins: ['chicken', 'eggs'],
          vegetables: ['potatoes', 'onions'],
          grains: ['rice', 'pap']
        },
        medications: ['Panado', 'Allergex'],
        pets: ['Dog']
      },
      shoppingCart: []
    }
  }
};

// Simulated auth service
const authService = {
  currentUser: null,
  
  signIn: async (email, password) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const user = userDatabase.users[email.toLowerCase()];
    if (!user || user.password !== password) {
      throw new Error('Invalid email or password');
    }
    
    authService.currentUser = {
      id: user.id,
      email: user.email,
      profile: user.profile
    };
    
    return authService.currentUser;
  },
  
  signUp: async (email, password, name) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (userDatabase.users[email.toLowerCase()]) {
      throw new Error('User already exists');
    }
    
    const userId = `user-${Date.now()}`;
    const newUser = {
      id: userId,
      email: email.toLowerCase(),
      password: password,
      passwordResetToken: null,
      profile: {
        name: name || 'New User',
        locations: [
          {
            id: 'home',
            name: 'Home',
            city: 'Benoni',
            province: 'Gauteng',
            country: 'South Africa',
            coordinates: { lat: -26.1889, lng: 28.3119 },
            isActive: true,
            isPrimary: true
          }
        ],
        activeLocationId: 'home'
      },
      config: {
        salary: 20000,
        people: 1,
        savingsGoal: 2000,
        categories: {
          rent: 6000, electricity: 600, water: 300, gas: 150, internet: 599,
          food: 4000, cleaning: 300, medication: 400, petcare: 0,
          transport: 1000, fuel: 800, entertainment: 400, clothing: 300, other: 500
        },
        usualItems: [],
        foodPreferences: {
          proteins: ['chicken', 'eggs'],
          vegetables: ['potatoes', 'onions'],
          grains: ['rice', 'pap']
        },
        medications: [],
        pets: []
      },
      shoppingCart: []
    };
    
    userDatabase.users[email.toLowerCase()] = newUser;
    
    authService.currentUser = {
      id: newUser.id,
      email: newUser.email,
      profile: newUser.profile
    };
    
    return authService.currentUser;
  },
  
  sendPasswordReset: async (email) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const user = userDatabase.users[email.toLowerCase()];
    if (!user) {
      throw new Error('No user found with this email address');
    }
    
    const resetToken = Math.random().toString(36).substring(2, 15);
    user.passwordResetToken = resetToken;
    
    console.log(`Password reset token for ${email}: ${resetToken}`);
    return { message: 'Password reset email sent successfully' };
  },
  
  resetPassword: async (email, token, newPassword) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const user = userDatabase.users[email.toLowerCase()];
    if (!user || user.passwordResetToken !== token) {
      throw new Error('Invalid or expired reset token');
    }
    
    user.password = newPassword;
    user.passwordResetToken = null;
    
    return { message: 'Password reset successfully' };
  },
  
  signOut: async () => {
    authService.currentUser = null;
    return Promise.resolve();
  }
};

// Database service for user data
const dbService = {
  getUserConfig: async (userId) => {
    const user = Object.values(userDatabase.users).find(u => u.id === userId);
    return user ? user.config : null;
  },
  
  saveUserConfig: async (userId, config) => {
    const user = Object.values(userDatabase.users).find(u => u.id === userId);
    if (user) {
      user.config = { ...user.config, ...config };
      console.log('Config saved:', user.config);
    }
  },
  
  getUserProfile: async (userId) => {
    const user = Object.values(userDatabase.users).find(u => u.id === userId);
    return user ? user.profile : null;
  },
  
  saveUserProfile: async (userId, profile) => {
    const user = Object.values(userDatabase.users).find(u => u.id === userId);
    if (user) {
      user.profile = { ...user.profile, ...profile };
      console.log('Profile saved:', user.profile);
    }
  },

  getShoppingCart: async (userId) => {
    const user = Object.values(userDatabase.users).find(u => u.id === userId);
    return user ? (user.shoppingCart || []) : [];
  },

  saveShoppingCart: async (userId, cart) => {
    const user = Object.values(userDatabase.users).find(u => u.id === userId);
    if (user) {
      user.shoppingCart = cart;
      console.log('Shopping cart saved:', user.shoppingCart);
    }
  }
};

// Fixed input component that prevents re-render issues
const StableInput = ({ value, onChange, onBlur, onKeyPress, ...props }) => {
  const [localValue, setLocalValue] = useState(value || '');
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (!isFocused) {
      setLocalValue(value || '');
    }
  }, [value, isFocused]);

  const handleChange = (e) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    if (onChange) {
      onChange({
        ...e,
        target: { ...e.target, value: newValue }
      });
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = (e) => {
    setIsFocused(false);
    if (onBlur) onBlur(e);
  };

  const handleKeyPress = (e) => {
    if (onKeyPress) onKeyPress(e);
  };

  return (
    <input
      {...props}
      value={localValue}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onKeyPress={handleKeyPress}
    />
  );
};

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetMessage, setResetMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      const result = await authService.signIn(email, password);
      setUser(result);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!email || !password || !name) {
      setError('Please fill in all fields');
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      const result = await authService.signUp(email, password, name);
      setUser(result);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!resetEmail) {
      setError('Please enter your email address');
      return;
    }
    
    setIsLoading(true);
    setError('');
    setResetMessage('');
    
    try {
      await authService.sendPasswordReset(resetEmail);
      setResetMessage('Password reset instructions sent to your email! Check your inbox.');
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await authService.signOut();
    setUser(null);
    setEmail('');
    setPassword('');
    setName('');
  };

  const handleKeyPress = (e, action) => {
    if (e.key === 'Enter') {
      action();
    }
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh', 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
        color: 'white' 
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '24px', marginBottom: '20px' }}>🤖 AI Loading...</div>
          <div style={{ fontSize: '16px' }}>Personalizing Your Budget Experience</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '20px'
      }}>
        <div style={{ 
          width: '400px', 
          maxWidth: '100%', 
          background: 'white', 
          padding: '30px', 
          borderRadius: '10px', 
          boxShadow: '0 10px 25px rgba(0,0,0,0.2)' 
        }}>
          <h1 style={{ textAlign: 'center', marginBottom: '10px', color: '#333' }}>
            🏠 Personal Budget AI
          </h1>
          <p style={{ textAlign: 'center', marginBottom: '30px', color: '#666', fontSize: '14px' }}>
            Smart Budget Management with Multi-Location Support
          </p>
          
          {error && (
            <div style={{ 
              background: '#fee', 
              border: '1px solid #fcc', 
              color: '#c33', 
              padding: '10px', 
              borderRadius: '5px', 
              marginBottom: '20px',
              fontSize: '14px'
            }}>
              {error}
            </div>
          )}

          {resetMessage && (
            <div style={{ 
              background: '#f0fdf4', 
              border: '1px solid #bbf7d0', 
              color: '#166534', 
              padding: '10px', 
              borderRadius: '5px', 
              marginBottom: '20px',
              fontSize: '14px'
            }}>
              {resetMessage}
            </div>
          )}

          {showForgotPassword ? (
            <div>
              <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#333', fontSize: '20px' }}>
                🔑 Reset Your Password
              </h2>
              
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Email Address</label>
                <StableInput 
                  type="email" 
                  value={resetEmail} 
                  onChange={(e) => setResetEmail(e.target.value)} 
                  onKeyPress={(e) => handleKeyPress(e, handleForgotPassword)}
                  placeholder="Enter your email address"
                  disabled={isLoading}
                  style={{ 
                    width: '100%', 
                    padding: '12px', 
                    border: '1px solid #ddd', 
                    borderRadius: '5px',
                    fontSize: '16px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
              
              <button 
                onClick={handleForgotPassword}
                disabled={isLoading}
                style={{ 
                  width: '100%', 
                  padding: '12px', 
                  background: isLoading ? '#ccc' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '5px', 
                  fontSize: '16px', 
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  marginBottom: '20px'
                }}
              >
                {isLoading ? '📧 Sending...' : '📧 Send Reset Email'}
              </button>

              <div style={{ textAlign: 'center' }}>
                <button
                  onClick={() => {
                    setShowForgotPassword(false);
                    setError('');
                    setResetMessage('');
                    setResetEmail('');
                  }}
                  style={{ 
                    background: 'none', 
                    border: 'none', 
                    color: '#3b82f6', 
                    cursor: 'pointer', 
                    textDecoration: 'underline',
                    fontSize: '14px'
                  }}
                >
                  ← Back to Login
                </button>
              </div>
            </div>
          ) : (
            <div>
              {isRegister && (
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Full Name</label>
                  <StableInput 
                    type="text" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    placeholder="Enter your full name"
                    disabled={isLoading}
                    style={{ 
                      width: '100%', 
                      padding: '12px', 
                      border: '1px solid #ddd', 
                      borderRadius: '5px',
                      fontSize: '16px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              )}

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Email</label>
                <StableInput 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  placeholder="Enter your email"
                  disabled={isLoading}
                  style={{ 
                    width: '100%', 
                    padding: '12px', 
                    border: '1px solid #ddd', 
                    borderRadius: '5px',
                    fontSize: '16px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
              
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Password</label>
                <StableInput 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  onKeyPress={(e) => handleKeyPress(e, isRegister ? handleRegister : handleLogin)}
                  placeholder="Enter your password"
                  disabled={isLoading}
                  style={{ 
                    width: '100%', 
                    padding: '12px', 
                    border: '1px solid #ddd', 
                    borderRadius: '5px',
                    fontSize: '16px',
                    boxSizing: 'border-box'
                  }}
                />
                {isRegister && (
                  <div style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
                    Password must be at least 6 characters
                  </div>
                )}
              </div>
              
              <button 
                onClick={isRegister ? handleRegister : handleLogin}
                disabled={isLoading}
                style={{ 
                  width: '100%', 
                  padding: '12px', 
                  background: isLoading ? '#ccc' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '5px', 
                  fontSize: '16px', 
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  marginBottom: '20px'
                }}
              >
                {isLoading ? (isRegister ? '🚀 Creating Account...' : '🔑 Signing In...') : 
                 (isRegister ? '🚀 Create Account' : '🔑 Sign In')}
              </button>

              {!isRegister && (
                <div style={{ textAlign: 'center', marginBottom: '15px' }}>
                  <button
                    onClick={() => setShowForgotPassword(true)}
                    style={{ 
                      background: 'none', 
                      border: 'none', 
                      color: '#ef4444', 
                      cursor: 'pointer', 
                      textDecoration: 'underline',
                      fontSize: '14px'
                    }}
                  >
                    🔒 Forgot Password?
                  </button>
                </div>
              )}

              <div style={{ textAlign: 'center' }}>
                <button
                  onClick={() => {
                    setIsRegister(!isRegister);
                    setError('');
                    setResetMessage('');
                  }}
                  style={{ 
                    background: 'none', 
                    border: 'none', 
                    color: '#3b82f6', 
                    cursor: 'pointer', 
                    textDecoration: 'underline',
                    fontSize: '14px'
                  }}
                >
                  {isRegister ? 'Already have an account? Sign In' : "Don't have an account? Create One"}
                </button>
              </div>
            </div>
          )}

          <div style={{ 
            marginTop: '20px', 
            padding: '10px', 
            background: '#f0f9ff', 
            borderRadius: '5px', 
            fontSize: '12px', 
            color: '#0369a1' 
          }}>
            <strong>Demo Account:</strong> demo@example.com / demo123
          </div>
        </div>
      </div>
    );
  }

  return <PersonalizedBudgetApp user={user} onLogout={handleLogout} />;
}

const PersonalizedBudgetApp = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [userConfig, setUserConfig] = useState({});
  const [userProfile, setUserProfile] = useState(user.profile || {});
  const [shoppingCart, setShoppingCart] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search states
  const [medicationSearch, setMedicationSearch] = useState('');
  const [medicationResults, setMedicationResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // Location management
  const [editingLocation, setEditingLocation] = useState(null);
  const [locationForm, setLocationForm] = useState({
    name: '',
    city: '',
    province: '',
    country: 'South Africa'
  });

  // Get current active location
  const getActiveLocation = useCallback(() => {
    const locations = userProfile?.locations || [];
    if (locations.length === 0) return null;
    
    const activeLocation = locations.find(loc => loc?.id === userProfile?.activeLocationId);
    return activeLocation || locations[0] || null;
  }, [userProfile]);

  // Load user data on mount
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const config = await dbService.getUserConfig(user.id);
        const profile = await dbService.getUserProfile(user.id);
        const cart = await dbService.getShoppingCart(user.id);
        
        if (config) setUserConfig(config);
        if (profile) setUserProfile(profile);
        if (cart) setShoppingCart(cart);
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadUserData();
  }, [user.id]);

  // Save user config with proper state management
  const saveUserConfig = useCallback(async (newConfig) => {
    try {
      await dbService.saveUserConfig(user.id, newConfig);
      setUserConfig(prev => ({ ...prev, ...newConfig }));
    } catch (error) {
      console.error('Error saving config:', error);
    }
  }, [user.id]);

  // Save user profile with proper state management
  const saveUserProfile = useCallback(async (newProfile) => {
    try {
      await dbService.saveUserProfile(user.id, newProfile);
      setUserProfile(prev => ({ ...prev, ...newProfile }));
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  }, [user.id]);

  // Save shopping cart
  const saveShoppingCart = useCallback(async (newCart) => {
    try {
      await dbService.saveShoppingCart(user.id, newCart);
      setShoppingCart(newCart);
    } catch (error) {
      console.error('Error saving cart:', error);
    }
  }, [user.id]);

  // Location management functions
  const addLocation = useCallback(() => {
    if (!locationForm.name || !locationForm.city || !locationForm.province) {
      alert('Please fill in all required fields');
      return;
    }

    const locationId = `loc-${Date.now()}`;
    const newLoc = {
      id: locationId,
      name: locationForm.name,
      city: locationForm.city,
      province: locationForm.province,
      country: locationForm.country,
      coordinates: { lat: 0, lng: 0 },
      isActive: false,
      isPrimary: false
    };

    const updatedProfile = {
      ...userProfile,
      locations: [...(userProfile.locations || []), newLoc]
    };

    saveUserProfile(updatedProfile);
    setEditingLocation(null);
    setLocationForm({ name: '', city: '', province: '', country: 'South Africa' });
  }, [locationForm, userProfile, saveUserProfile]);

  const updateLocation = useCallback((locationId) => {
    if (!locationForm.name || !locationForm.city || !locationForm.province) {
      alert('Please fill in all required fields');
      return;
    }

    const updatedProfile = {
      ...userProfile,
      locations: (userProfile.locations || []).map(loc => 
        loc.id === locationId 
          ? {
              ...loc,
              name: locationForm.name,
              city: locationForm.city,
              province: locationForm.province,
              country: locationForm.country
            }
          : loc
      )
    };

    saveUserProfile(updatedProfile);
    setEditingLocation(null);
    setLocationForm({ name: '', city: '', province: '', country: 'South Africa' });
  }, [locationForm, userProfile, saveUserProfile]);

  const deleteLocation = useCallback((locationId) => {
    const locations = userProfile.locations || [];
    if (locations.length <= 1) {
      alert('You must have at least one location');
      return;
    }

    const locationToDelete = locations.find(loc => loc.id === locationId);
    if (locationToDelete?.isPrimary) {
      alert('Cannot delete your primary location. Set another location as primary first.');
      return;
    }

    let updatedProfile = {
      ...userProfile,
      locations: locations.filter(loc => loc.id !== locationId)
    };

    if (userProfile.activeLocationId === locationId) {
      const primaryLocation = updatedProfile.locations.find(loc => loc.isPrimary);
      updatedProfile.activeLocationId = primaryLocation?.id || updatedProfile.locations[0]?.id;
    }

    saveUserProfile(updatedProfile);
  }, [userProfile, saveUserProfile]);

  const switchActiveLocation = useCallback((locationId) => {
    const updatedProfile = {
      ...userProfile,
      activeLocationId: locationId
    };
    saveUserProfile(updatedProfile);
  }, [userProfile, saveUserProfile]);

  const setPrimaryLocation = useCallback((locationId) => {
    const updatedProfile = {
      ...userProfile,
      locations: (userProfile.locations || []).map(loc => ({
        ...loc,
        isPrimary: loc.id === locationId
      }))
    };
    saveUserProfile(updatedProfile);
  }, [userProfile, saveUserProfile]);

  // Enhanced multi-location medication search
  const searchMedication = useCallback(async (searchTerm) => {
    if (!searchTerm?.trim()) return;
    
    setIsSearching(true);
    
    setTimeout(() => {
      const basePrice = Math.random() * 50 + 20;
      const locations = userProfile?.locations || [];
      const activeLocation = getActiveLocation();
      
      if (locations.length === 0) {
        setMedicationResults([]);
        setIsSearching(false);
        return;
      }
      
      const allResults = [];
      
      locations.forEach((location) => {
        if (!location) return;
        
        const isActiveLocation = location.id === activeLocation?.id;
        const cityMultiplier = 1 + (Math.random() * 0.2 - 0.1); // ±10% price variation by city
        const locationMultiplier = isActiveLocation ? 0.95 : cityMultiplier; // Active location gets slight advantage
        
        // Generate multiple pharmacies per location with realistic names for SA
        const pharmacyChains = [
          { name: 'Dis-Chem', multiplier: 0.95, phone: '011-421-0000' },
          { name: 'Clicks', multiplier: 1.0, phone: '011-425-0000' },
          { name: 'Alpha Pharm', multiplier: 0.92, phone: '011-422-0000' },
          { name: 'Medirite', multiplier: 1.05, phone: '011-427-0000' },
          { name: 'Pick n Pay Pharmacy', multiplier: 1.08, phone: '011-423-0000' },
          { name: 'Wellness Warehouse', multiplier: 1.12, phone: '011-428-0000' }
        ];

        pharmacyChains.forEach((pharmacy, index) => {
          const distance = isActiveLocation ? 
            (2 + Math.random() * 3).toFixed(1) : 
            (8 + Math.random() * 25).toFixed(1);
          
          const locationSuffix = ['Mall', 'Shopping Centre', 'Main Street', 'City Centre', 'Square'][index % 5];
          
          allResults.push({
            name: searchTerm,
            store: pharmacy.name,
            price: (basePrice * pharmacy.multiplier * locationMultiplier).toFixed(2),
            location: `${location.city} ${locationSuffix}`,
            distance: `${distance}km`,
            stock: Math.random() > 0.2 ? 'In Stock' : 'Limited Stock',
            phone: pharmacy.phone,
            locationName: location.name,
            city: location.city,
            province: location.province,
            isActiveLocation,
            coordinates: location.coordinates
          });
        });
      });
      
      // Sort by price (best deals first), but prioritize stock availability
      const sortedResults = allResults.sort((a, b) => {
        if (a.stock === 'In Stock' && b.stock !== 'In Stock') return -1;
        if (b.stock === 'In Stock' && a.stock !== 'In Stock') return 1;
        return parseFloat(a.price) - parseFloat(b.price);
      });
      
      setMedicationResults(sortedResults);
      setIsSearching(false);
    }, 1500);
  }, [userProfile, getActiveLocation]);

  // Shopping cart functions
  const addToCart = useCallback((item) => {
    const cartItem = {
      id: Date.now().toString(),
      name: item.name || item.item,
      price: parseFloat(item.price) || 0,
      store: item.store || '',
      location: item.location || '',
      quantity: 1,
      checked: false,
      category: item.category || 'other'
    };
    
    const newCart = [...shoppingCart, cartItem];
    saveShoppingCart(newCart);
  }, [shoppingCart, saveShoppingCart]);

  const updateCartItem = useCallback((itemId, updates) => {
    const newCart = shoppingCart.map(item => 
      item.id === itemId ? { ...item, ...updates } : item
    );
    saveShoppingCart(newCart);
  }, [shoppingCart, saveShoppingCart]);

  const removeFromCart = useCallback((itemId) => {
    const newCart = shoppingCart.filter(item => item.id !== itemId);
    saveShoppingCart(newCart);
  }, [shoppingCart, saveShoppingCart]);

  const clearCart = useCallback(() => {
    saveShoppingCart([]);
  }, [saveShoppingCart]);

  // Calculate cart totals
  const cartTotals = useMemo(() => {
    const total = shoppingCart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const checkedTotal = shoppingCart
      .filter(item => item.checked)
      .reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const itemCount = shoppingCart.length;
    const checkedCount = shoppingCart.filter(item => item.checked).length;
    
    return { total, checkedTotal, itemCount, checkedCount };
  }, [shoppingCart]);

  // Generate personalized deals with cart integration
  const personalizedDeals = useMemo(() => {
    const usualItems = userConfig.usualItems || [];
    return usualItems.map((item, index) => ({
      id: `deal-${index}`,
      item: `${item.name} ${item.brand}`,
      name: item.name,
      price: (item.currentPrice * 0.85).toFixed(2),
      originalPrice: item.currentPrice,
      store: ['Spar', 'Shoprite', 'Pick n Pay', 'Checkers'][index % 4],
      savings: (item.currentPrice * 0.15).toFixed(2),
      category: item.category,
      isUsualItem: true,
      expires: new Date(Date.now() + (3 + index) * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    }));
  }, [userConfig.usualItems]);

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh', 
        background: '#f5f5f5' 
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '24px', marginBottom: '20px' }}>📊 Loading Your Data...</div>
          <div style={{ fontSize: '16px', color: '#666' }}>Setting up your personalized budget</div>
        </div>
      </div>
    );
  }

  const DashboardTab = () => {
    const totalAllocated = Object.values(userConfig.categories || {}).reduce((sum, val) => sum + (val || 0), 0);
    const remaining = (userConfig.salary || 0) - totalAllocated - (userConfig.savingsGoal || 0);
    const activeLocation = getActiveLocation();
    
    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2>🏠 Welcome back, {userProfile?.name || user?.email || 'User'}!</h2>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '14px', color: '#666' }}>
              📍 {activeLocation?.city || 'Unknown'}, {activeLocation?.province || 'Unknown'}
            </div>
            <div style={{ fontSize: '12px', color: '#888' }}>
              {activeLocation?.name || 'No location'} • <button 
                onClick={() => setActiveTab('profile')}
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  color: '#3b82f6', 
                  cursor: 'pointer', 
                  textDecoration: 'underline',
                  fontSize: '12px'
                }}
              >
                Switch Location
              </button>
            </div>
          </div>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '20px', 
          marginBottom: '30px' 
        }}>
          <div style={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
            color: 'white',
            padding: '20px',
            borderRadius: '10px'
          }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '5px' }}>
              R{(userConfig.salary || 0).toLocaleString()}
            </div>
            <div style={{ fontSize: '14px', opacity: 0.9 }}>Monthly Income</div>
            <div style={{ fontSize: '12px', marginTop: '10px', opacity: 0.8 }}>
              Supporting {userConfig.people || 1} people
            </div>
          </div>
          
          <div style={{ 
            background: remaining >= 0 ? '#10b981' : '#ef4444', 
            color: 'white',
            padding: '20px',
            borderRadius: '10px'
          }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '5px' }}>
              R{Math.abs(remaining || 0).toLocaleString()}
            </div>
            <div style={{ fontSize: '14px', opacity: 0.9 }}>
              {remaining >= 0 ? 'Available Budget' : 'Over Budget'}
            </div>
          </div>
          
          <div style={{ 
            background: '#f59e0b', 
            color: 'white',
            padding: '20px',
            borderRadius: '10px'
          }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '5px' }}>
              {personalizedDeals.length}
            </div>
            <div style={{ fontSize: '14px', opacity: 0.9 }}>AI-Found Deals</div>
            <div style={{ fontSize: '12px', marginTop: '10px', opacity: 0.8 }}>
              Save R{personalizedDeals.reduce((sum, d) => sum + parseFloat(d.savings || 0), 0).toFixed(2)} this week
            </div>
          </div>

          <div style={{ 
            background: '#8b5cf6', 
            color: 'white',
            padding: '20px',
            borderRadius: '10px',
            cursor: 'pointer'
          }}
          onClick={() => setActiveTab('cart')}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '5px' }}>
              {cartTotals.itemCount}
            </div>
            <div style={{ fontSize: '14px', opacity: 0.9 }}>Shopping List Items</div>
            <div style={{ fontSize: '12px', marginTop: '10px', opacity: 0.8 }}>
              Total: R{cartTotals.total.toFixed(2)}
            </div>
          </div>
        </div>

        <div style={{ 
          background: 'white', 
          padding: '20px', 
          borderRadius: '10px', 
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)' 
        }}>
          <h3 style={{ marginBottom: '20px' }}>🤖 AI Recommendations</h3>
          
          {personalizedDeals.length > 0 && (
            <div style={{
              display: 'flex', 
              alignItems: 'center', 
              gap: '15px', 
              padding: '15px',
              background: '#f0fdf4', 
              borderRadius: '8px', 
              border: '1px solid #bbf7d0',
              marginBottom: '15px'
            }}>
              <div style={{ fontSize: '24px' }}>🛒</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                  AI Found {personalizedDeals.length} Deals on Your Items!
                </div>
                <div style={{ fontSize: '14px', color: '#666' }}>
                  Smart price comparison across all your locations
                </div>
              </div>
              <button 
                style={{ 
                  background: '#10b981', 
                  color: 'white', 
                  border: 'none', 
                  padding: '8px 16px', 
                  borderRadius: '5px',
                  cursor: 'pointer'
                }}
                onClick={() => setActiveTab('deals')}
              >
                View Deals
              </button>
            </div>
          )}

          <div style={{
            display: 'flex', 
            alignItems: 'center', 
            gap: '15px', 
            padding: '15px',
            background: '#fef3c7', 
            borderRadius: '8px', 
            border: '1px solid #fbbf24',
            marginBottom: '15px'
          }}>
            <div style={{ fontSize: '24px' }}>💊</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                Multi-Location Medicine Search
              </div>
              <div style={{ fontSize: '14px', color: '#666' }}>
                Find best prices across all your saved areas
              </div>
            </div>
            <button 
              style={{ 
                background: '#f59e0b', 
                color: 'white', 
                border: 'none', 
                padding: '8px 16px', 
                borderRadius: '5px',
                cursor: 'pointer'
              }}
              onClick={() => setActiveTab('search')}
            >
              Search Medicine
            </button>
          </div>

          <div style={{
            display: 'flex', 
            alignItems: 'center', 
            gap: '15px', 
            padding: '15px',
            background: '#f3e8ff', 
            borderRadius: '8px', 
            border: '1px solid #c4b5fd'
          }}>
            <div style={{ fontSize: '24px' }}>📋</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                Smart Shopping List ({cartTotals.itemCount} items)
              </div>
              <div style={{ fontSize: '14px', color: '#666' }}>
                Track purchases and manage your grocery budget
              </div>
            </div>
            <button 
              style={{ 
                background: '#8b5cf6', 
                color: 'white', 
                border: 'none', 
                padding: '8px 16px', 
                borderRadius: '5px',
                cursor: 'pointer'
              }}
              onClick={() => setActiveTab('cart')}
            >
              View List
            </button>
          </div>
        </div>
      </div>
    );
  };

  const ProfileTab = () => {
    const activeLocation = getActiveLocation();
    const locations = userProfile?.locations || [];

    return (
      <div>
        <h2 style={{ marginBottom: '20px' }}>👤 Profile & Locations</h2>
        
        <div style={{ 
          background: 'white', 
          padding: '20px', 
          borderRadius: '10px', 
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          marginBottom: '20px'
        }}>
          <h3 style={{ marginBottom: '20px', color: '#3b82f6' }}>Personal Information</h3>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
            gap: '20px'
          }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Name</label>
              <StableInput
                type="text"
                value={userProfile.name || ''}
                onChange={(e) => {
                  const newProfile = {...userProfile, name: e.target.value};
                  saveUserProfile(newProfile);
                }}
                style={{ 
                  width: '100%', 
                  padding: '12px', 
                  border: '1px solid #ccc', 
                  borderRadius: '5px',
                  fontSize: '16px',
                  boxSizing: 'border-box'
                }}
              />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Email</label>
              <input
                type="email"
                value={user.email}
                disabled
                style={{ 
                  width: '100%', 
                  padding: '12px', 
                  border: '1px solid #ccc', 
                  borderRadius: '5px',
                  fontSize: '16px',
                  boxSizing: 'border-box',
                  background: '#f5f5f5',
                  color: '#666'
                }}
              />
            </div>
          </div>
        </div>

        {/* Active Location Display */}
        <div style={{ 
          background: 'white', 
          padding: '20px', 
          borderRadius: '10px', 
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          marginBottom: '20px'
        }}>
          <h3 style={{ marginBottom: '20px', color: '#10b981' }}>📍 Current Active Location</h3>
          
          <div style={{ 
            padding: '15px', 
            background: '#f0fdf4', 
            borderRadius: '8px',
            border: '2px solid #22c55e',
            marginBottom: '20px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 'bold', fontSize: '16px' }}>
                  📍 {activeLocation?.name} 
                  {activeLocation?.isPrimary && <span style={{ color: '#f59e0b', marginLeft: '10px' }}>⭐ Primary</span>}
                </div>
                <div style={{ color: '#666', fontSize: '14px' }}>
                  {activeLocation?.city}, {activeLocation?.province}, {activeLocation?.country}
                </div>
                <div style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
                  Used for AI searches and local price comparisons
                </div>
              </div>
              <div style={{ fontSize: '24px' }}>🎯</div>
            </div>
          </div>

          {locations.length > 1 && (
            <div>
              <div style={{ fontWeight: 'bold', marginBottom: '10px' }}>Quick Switch:</div>
              <div style={{ display: 'grid', gap: '10px' }}>
                {locations.filter(loc => loc.id !== activeLocation?.id).map(location => (
                  <div key={location.id} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '10px',
                    background: '#f8fafc',
                    borderRadius: '5px',
                    border: '1px solid #e2e8f0'
                  }}>
                    <div>
                      <div style={{ fontWeight: 'bold' }}>
                        {location.name} 
                        {location.isPrimary && <span style={{ color: '#f59e0b', marginLeft: '10px' }}>⭐</span>}
                      </div>
                      <div style={{ fontSize: '14px', color: '#666' }}>
                        {location.city}, {location.province}
                      </div>
                    </div>
                    <button
                      onClick={() => switchActiveLocation(location.id)}
                      style={{
                        background: '#3b82f6',
                        color: 'white',
                        border: 'none',
                        padding: '5px 10px',
                        borderRadius: '3px',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      Switch Here
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Manage All Locations */}
        <div style={{ 
          background: 'white', 
          padding: '20px', 
          borderRadius: '10px', 
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          marginBottom: '20px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ color: '#8b5cf6' }}>🗺️ Manage All Locations</h3>
            <button
              onClick={() => {
                setEditingLocation('new');
                setLocationForm({ name: '', city: '', province: '', country: 'South Africa' });
              }}
              style={{
                background: '#10b981',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              ➕ Add New Location
            </button>
          </div>

          {/* Location List */}
          <div style={{ display: 'grid', gap: '10px', marginBottom: '20px' }}>
            {locations.map(location => (
              <div key={location.id} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '15px',
                background: location.id === activeLocation?.id ? '#eff6ff' : '#f8fafc',
                borderRadius: '8px',
                border: location.id === activeLocation?.id ? '2px solid #3b82f6' : '1px solid #e2e8f0'
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {location.name}
                    {location.isPrimary && <span style={{ color: '#f59e0b' }}>⭐ Primary</span>}
                    {location.id === activeLocation?.id && <span style={{ color: '#3b82f6' }}>🎯 Active</span>}
                  </div>
                  <div style={{ fontSize: '14px', color: '#666' }}>
                    {location.city}, {location.province}, {location.country}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '5px' }}>
                  {!location.isPrimary && (
                    <button
                      onClick={() => setPrimaryLocation(location.id)}
                      style={{
                        background: '#f59e0b',
                        color: 'white',
                        border: 'none',
                        padding: '5px 8px',
                        borderRadius: '3px',
                        cursor: 'pointer',
                        fontSize: '11px'
                      }}
                      title="Set as primary location"
                    >
                      ⭐ Primary
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setEditingLocation(location.id);
                      setLocationForm({
                        name: location.name,
                        city: location.city,
                        province: location.province,
                        country: location.country
                      });
                    }}
                    style={{
                      background: '#6b7280',
                      color: 'white',
                      border: 'none',
                      padding: '5px 8px',
                      borderRadius: '3px',
                      cursor: 'pointer',
                      fontSize: '11px'
                    }}
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => deleteLocation(location.id)}
                    disabled={location.isPrimary || locations.length <= 1}
                    style={{
                      background: location.isPrimary || locations.length <= 1 ? '#ccc' : '#ef4444',
                      color: 'white',
                      border: 'none',
                      padding: '5px 8px',
                      borderRadius: '3px',
                      cursor: location.isPrimary || locations.length <= 1 ? 'not-allowed' : 'pointer',
                      fontSize: '11px'
                    }}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Add/Edit Location Form */}
          {editingLocation && (
            <div style={{ 
              padding: '20px', 
              background: '#f8fafc', 
              borderRadius: '8px',
              border: '1px solid #e2e8f0' 
            }}>
              <h4 style={{ marginBottom: '15px' }}>
                {editingLocation === 'new' ? '➕ Add New Location' : '✏️ Edit Location'}
              </h4>
              
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                gap: '15px',
                marginBottom: '15px'
              }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Location Name</label>
                  <StableInput
                    type="text"
                    value={locationForm.name}
                    onChange={(e) => setLocationForm(prev => ({...prev, name: e.target.value}))}
                    placeholder="e.g. Home, Work, Parents"
                    style={{ 
                      width: '100%', 
                      padding: '10px', 
                      border: '1px solid #ccc', 
                      borderRadius: '5px',
                      fontSize: '14px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>City</label>
                  <StableInput
                    type="text"
                    value={locationForm.city}
                    onChange={(e) => setLocationForm(prev => ({...prev, city: e.target.value}))}
                    placeholder="e.g. Benoni"
                    style={{ 
                      width: '100%', 
                      padding: '10px', 
                      border: '1px solid #ccc', 
                      borderRadius: '5px',
                      fontSize: '14px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Province</label>
                  <select
                    value={locationForm.province}
                    onChange={(e) => setLocationForm(prev => ({...prev, province: e.target.value}))}
                    style={{ 
                      width: '100%', 
                      padding: '10px', 
                      border: '1px solid #ccc', 
                      borderRadius: '5px',
                      fontSize: '14px',
                      boxSizing: 'border-box'
                    }}
                  >
                    <option value="">Select Province</option>
                    <option value="Gauteng">Gauteng</option>
                    <option value="Western Cape">Western Cape</option>
                    <option value="KwaZulu-Natal">KwaZulu-Natal</option>
                    <option value="Eastern Cape">Eastern Cape</option>
                    <option value="Free State">Free State</option>
                    <option value="Limpopo">Limpopo</option>
                    <option value="Mpumalanga">Mpumalanga</option>
                    <option value="Northern Cape">Northern Cape</option>
                    <option value="North West">North West</option>
                  </select>
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Country</label>
                  <StableInput
                    type="text"
                    value={locationForm.country}
                    onChange={(e) => setLocationForm(prev => ({...prev, country: e.target.value}))}
                    style={{ 
                      width: '100%', 
                      padding: '10px', 
                      border: '1px solid #ccc', 
                      borderRadius: '5px',
                      fontSize: '14px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => editingLocation === 'new' ? addLocation() : updateLocation(editingLocation)}
                  style={{
                    background: '#10b981',
                    color: 'white',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '5px',
                    cursor: 'pointer'
                  }}
                >
                  {editingLocation === 'new' ? '✅ Add Location' : '✅ Save Changes'}
                </button>
                <button
                  onClick={() => {
                    setEditingLocation(null);
                    setLocationForm({ name: '', city: '', province: '', country: 'South Africa' });
                  }}
                  style={{
                    background: '#6b7280',
                    color: 'white',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '5px',
                    cursor: 'pointer'
                  }}
                >
                  ❌ Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const ConfigTab = () => {
    const handleConfigUpdate = useCallback((field, value) => {
      const newConfig = { ...userConfig, [field]: value };
      saveUserConfig(newConfig);
    }, [userConfig, saveUserConfig]);

    const handleCategoryUpdate = useCallback((category, value) => {
      const newCategories = { ...userConfig.categories, [category]: parseInt(value) || 0 };
      const newConfig = { ...userConfig, categories: newCategories };
      saveUserConfig(newConfig);
    }, [userConfig, saveUserConfig]);

    const handleUsualItemUpdate = useCallback((index, field, value) => {
      const newItems = [...(userConfig.usualItems || [])];
      newItems[index] = { ...newItems[index], [field]: value };
      const newConfig = { ...userConfig, usualItems: newItems };
      saveUserConfig(newConfig);
    }, [userConfig, saveUserConfig]);

    const addUsualItem = useCallback(() => {
      const newItems = [...(userConfig.usualItems || []), {
        id: Date.now().toString(),
        name: '', 
        brand: '', 
        category: 'food', 
        currentPrice: 0
      }];
      const newConfig = { ...userConfig, usualItems: newItems };
      saveUserConfig(newConfig);
    }, [userConfig, saveUserConfig]);

    const removeUsualItem = useCallback((index) => {
      const newItems = (userConfig.usualItems || []).filter((_, i) => i !== index);
      const newConfig = { ...userConfig, usualItems: newItems };
      saveUserConfig(newConfig);
    }, [userConfig, saveUserConfig]);

    return (
      <div>
        <h2 style={{ marginBottom: '20px' }}>⚙️ Budget Configuration</h2>
        
        <div style={{ 
          background: 'white', 
          padding: '20px', 
          borderRadius: '10px', 
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          marginBottom: '20px'
        }}>
          <h3 style={{ marginBottom: '20px', color: '#3b82f6' }}>💰 Basic Information</h3>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
            gap: '20px'
          }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>💵 Monthly Salary (R)</label>
              <StableInput
                type="number"
                value={userConfig.salary || ''}
                onChange={(e) => handleConfigUpdate('salary', parseInt(e.target.value) || 0)}
                style={{ 
                  width: '100%', 
                  padding: '12px', 
                  border: '1px solid #ccc', 
                  borderRadius: '5px',
                  fontSize: '16px',
                  boxSizing: 'border-box'
                }}
              />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>👥 Household Size</label>
              <StableInput
                type="number"
                value={userConfig.people || ''}
                onChange={(e) => handleConfigUpdate('people', parseInt(e.target.value) || 1)}
                style={{ 
                  width: '100%', 
                  padding: '12px', 
                  border: '1px solid #ccc', 
                  borderRadius: '5px',
                  fontSize: '16px',
                  boxSizing: 'border-box'
                }}
              />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>🎯 Savings Goal (R)</label>
              <StableInput
                type="number"
                value={userConfig.savingsGoal || ''}
                onChange={(e) => handleConfigUpdate('savingsGoal', parseInt(e.target.value) || 0)}
                style={{ 
                  width: '100%', 
                  padding: '12px', 
                  border: '1px solid #ccc', 
                  borderRadius: '5px',
                  fontSize: '16px',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>
        </div>

        {/* Budget Categories */}
        <div style={{ 
          background: 'white', 
          padding: '20px', 
          borderRadius: '10px', 
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          marginBottom: '20px'
        }}>
          <h3 style={{ marginBottom: '20px', color: '#10b981' }}>📊 Budget Categories</h3>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
            gap: '15px'
          }}>
            {Object.entries(userConfig.categories || {}).map(([category, amount]) => (
              <div key={category}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', textTransform: 'capitalize' }}>
                  {category.replace(/([A-Z])/g, ' $1')}
                </label>
                <StableInput
                  type="number"
                  value={amount || ''}
                  onChange={(e) => handleCategoryUpdate(category, e.target.value)}
                  placeholder="0"
                  style={{ 
                    width: '100%', 
                    padding: '10px', 
                    border: '1px solid #ccc', 
                    borderRadius: '5px',
                    fontSize: '14px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Usual Items */}
        <div style={{ 
          background: 'white', 
          padding: '20px', 
          borderRadius: '10px', 
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          marginBottom: '20px'
        }}>
          <h3 style={{ marginBottom: '20px', color: '#f59e0b' }}>🛒 My Usual Items</h3>
          <p style={{ color: '#666', marginBottom: '20px' }}>
            Add items you regularly buy so AI can find better prices across all your locations
          </p>
          
          <div style={{ marginBottom: '15px', fontWeight: 'bold', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr auto', gap: '10px' }}>
            <div>Item Name</div>
            <div>Brand</div>
            <div>Category</div>
            <div>Current Price</div>
            <div>Actions</div>
          </div>
          
          {(userConfig.usualItems || []).map((item, index) => (
            <div key={`item-${index}`} style={{ 
              display: 'grid', 
              gridTemplateColumns: '2fr 1fr 1fr 1fr auto', 
              gap: '10px', 
              alignItems: 'center',
              marginBottom: '10px',
              padding: '10px',
              background: '#f8fafc',
              borderRadius: '5px'
            }}>
              <StableInput
                type="text"
                placeholder="Item name"
                value={item.name || ''}
                onChange={(e) => handleUsualItemUpdate(index, 'name', e.target.value)}
                style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '3px' }}
              />
              <StableInput
                type="text"
                placeholder="Brand"
                value={item.brand || ''}
                onChange={(e) => handleUsualItemUpdate(index, 'brand', e.target.value)}
                style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '3px' }}
              />
              <select
                value={item.category || 'food'}
                onChange={(e) => handleUsualItemUpdate(index, 'category', e.target.value)}
                style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '3px' }}
              >
                <option value="food">Food</option>
                <option value="cleaning">Cleaning</option>
                <option value="medication">Medication</option>
                <option value="petcare">Pet Care</option>
                <option value="other">Other</option>
              </select>
              <StableInput
                type="number"
                placeholder="Price"
                value={item.currentPrice || ''}
                onChange={(e) => handleUsualItemUpdate(index, 'currentPrice', parseFloat(e.target.value) || 0)}
                style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '3px' }}
              />
              <button 
                onClick={() => removeUsualItem(index)}
                style={{ 
                  background: '#ef4444', 
                  color: 'white', 
                  border: 'none', 
                  padding: '8px 12px', 
                  borderRadius: '3px',
                  cursor: 'pointer'
                }}
              >
                ✕
              </button>
            </div>
          ))}
          
          <button
            onClick={addUsualItem}
            style={{ 
              background: '#10b981', 
              color: 'white', 
              border: 'none', 
              padding: '10px 20px', 
              borderRadius: '5px',
              cursor: 'pointer',
              marginTop: '10px'
            }}
          >
            ➕ Add Item
          </button>
        </div>
      </div>
    );
  };

  const SearchTab = () => {
    const [localSearch, setLocalSearch] = useState('');
    const activeLocation = getActiveLocation();
    const locations = userProfile.locations || [];

    const handleSearch = () => {
      setMedicationSearch(localSearch);
      searchMedication(localSearch);
    };

    const handleKeyPress = (e) => {
      if (e.key === 'Enter') {
        handleSearch();
      }
    };

    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2>💊 AI Multi-Location Medicine Search</h2>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '14px', color: '#666' }}>
              🔍 Searching across {locations.length} location{locations.length !== 1 ? 's' : ''}
            </div>
            <div style={{ fontSize: '12px', color: '#888' }}>
              {locations.map(loc => `${loc.name} (${loc.city})`).join(', ')}
            </div>
          </div>
        </div>
        
        <div style={{ 
          background: 'white', 
          padding: '20px', 
          borderRadius: '10px', 
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          marginBottom: '20px'
        }}>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
            <StableInput
              type="text"
              placeholder="Search for medication (e.g., Panado, Allergex, Grandpa)"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              onKeyPress={handleKeyPress}
              style={{ 
                flex: 1, 
                padding: '12px', 
                fontSize: '16px', 
                borderRadius: '5px', 
                border: '1px solid #ccc' 
              }}
            />
            <button
              onClick={handleSearch}
              disabled={isSearching}
              style={{ 
                background: '#3b82f6', 
                color: 'white', 
                border: 'none', 
                padding: '12px 20px', 
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              {isSearching ? '🔍 Searching...' : '🔍 Search All Areas'}
            </button>
          </div>
          
          <div style={{ fontSize: '14px', color: '#666', marginBottom: '10px' }}>
            🤖 AI searches ALL your saved locations simultaneously for the best prices!
          </div>
          
          {locations.length > 1 && (
            <div style={{ 
              padding: '10px', 
              background: '#f0f9ff', 
              borderRadius: '5px',
              fontSize: '12px'
            }}>
              <strong>Multi-Location Search Coverage:</strong> {locations.map(loc => 
                `${loc?.name || 'Unknown'} (${loc?.city || 'Unknown'}, ${loc?.province || 'Unknown'})`
              ).join(' • ')}
            </div>
          )}
        </div>

        {medicationResults.length > 0 && (
          <div style={{ 
            background: 'white', 
            padding: '20px', 
            borderRadius: '10px', 
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)' 
          }}>
            <h3 style={{ marginBottom: '20px' }}>
              📊 Best Prices for "{medicationSearch}" Across All Your Locations
            </h3>
            
            {/* Summary Stats */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
              gap: '15px', 
              marginBottom: '20px' 
            }}>
              <div style={{ 
                background: '#f0fdf4', 
                padding: '15px', 
                borderRadius: '8px',
                textAlign: 'center',
                border: '1px solid #bbf7d0'
              }}>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#22c55e' }}>
                  R{medicationResults[0]?.price || '0.00'}
                </div>
                <div style={{ fontSize: '12px', color: '#666' }}>Best Price Found</div>
              </div>
              
              <div style={{ 
                background: '#fef3c7', 
                padding: '15px', 
                borderRadius: '8px',
                textAlign: 'center',
                border: '1px solid #fbbf24'
              }}>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#f59e0b' }}>
                  R{medicationResults.length > 1 ? (parseFloat(medicationResults[medicationResults.length - 1]?.price || 0) - parseFloat(medicationResults[0]?.price || 0)).toFixed(2) : '0.00'}
                </div>
                <div style={{ fontSize: '12px', color: '#666' }}>Max Savings</div>
              </div>
              
              <div style={{ 
                background: '#eff6ff', 
                padding: '15px', 
                borderRadius: '8px',
                textAlign: 'center',
                border: '1px solid #dbeafe'
              }}>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#3b82f6' }}>
                  {new Set(medicationResults.map(r => r?.city || 'Unknown')).size}
                </div>
                <div style={{ fontSize: '12px', color: '#666' }}>Cities Searched</div>
              </div>
            </div>
            
            <div style={{ display: 'grid', gap: '15px' }}>
              {medicationResults.map((result, index) => (
                <div key={`${result.store}-${result.city}-${index}`} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '15px',
                  background: index === 0 ? '#f0fdf4' : result.isActiveLocation ? '#eff6ff' : '#f8fafc',
                  borderRadius: '8px',
                  border: index === 0 ? '2px solid #22c55e' : result.isActiveLocation ? '2px solid #3b82f6' : '1px solid #e2e8f0',
                  position: 'relative'
                }}>
                  {index === 0 && (
                    <div style={{
                      position: 'absolute',
                      top: '-10px',
                      left: '15px',
                      background: '#22c55e',
                      color: 'white',
                      padding: '2px 8px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}>
                      🏆 BEST PRICE
                    </div>
                  )}
                  
                  {result.isActiveLocation && index !== 0 && (
                    <div style={{
                      position: 'absolute',
                      top: '-10px',
                      left: '15px',
                      background: '#3b82f6',
                      color: 'white',
                      padding: '2px 8px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}>
                      📍 NEAR YOU
                    </div>
                  )}
                  
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '2px' }}>
                      {result.store}
                    </div>
                    <div style={{ fontSize: '14px', color: '#666', marginBottom: '2px' }}>
                      📍 {result.location}
                    </div>
                    <div style={{ fontSize: '12px', color: '#888' }}>
                      🗺️ {result.locationName} ({result.city}, {result.province}) • {result.distance} away
                    </div>
                  </div>
                  
                  <div style={{ textAlign: 'center', margin: '0 20px' }}>
                    <div style={{ 
                      fontSize: '20px', 
                      fontWeight: 'bold', 
                      color: index === 0 ? '#22c55e' : '#374151' 
                    }}>
                      R{result.price}
                    </div>
                    {index > 0 && (
                      <div style={{ fontSize: '12px', color: '#ef4444' }}>
                        +R{(parseFloat(result.price) - parseFloat(medicationResults[0].price)).toFixed(2)}
                      </div>
                    )}
                    <div style={{
                      fontSize: '11px',
                      padding: '2px 6px',
                      borderRadius: '10px',
                      marginTop: '3px',
                      background: result.stock === 'In Stock' ? '#dcfce7' : '#fef3c7',
                      color: result.stock === 'In Stock' ? '#166534' : '#d97706'
                    }}>
                      {result.stock}
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '5px' }}>
                    <button 
                      onClick={() => addToCart(result)}
                      style={{ 
                        background: '#8b5cf6', 
                        color: 'white', 
                        border: 'none',
                        fontSize: '12px', 
                        padding: '5px 10px',
                        borderRadius: '3px',
                        cursor: 'pointer'
                      }}
                    >
                      🛒 Add to List
                    </button>
                    <button 
                      style={{ 
                        background: '#3b82f6', 
                        color: 'white', 
                        border: 'none',
                        fontSize: '12px', 
                        padding: '5px 10px',
                        borderRadius: '3px',
                        cursor: 'pointer'
                      }}
                    >
                      📍 Directions
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div style={{ 
              marginTop: '20px', 
              padding: '15px', 
              background: '#f0f9ff', 
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <div style={{ fontWeight: 'bold', color: '#1e40af', marginBottom: '5px' }}>
                🤖 AI Recommendation: Save R{medicationResults.length > 1 ? (parseFloat(medicationResults[medicationResults.length - 1]?.price || 0) - parseFloat(medicationResults[0]?.price || 0)).toFixed(2) : '0.00'} by choosing the best option!
              </div>
              <div style={{ fontSize: '14px', color: '#666' }}>
                Consider travel costs and convenience when making your choice. Add items to your shopping list to track purchases.
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const DealsTab = () => (
    <div>
      <h2 style={{ marginBottom: '20px' }}>🎯 AI-Powered Deals</h2>
      
      {personalizedDeals.length > 0 && (
        <div style={{ 
          background: 'white', 
          padding: '20px', 
          borderRadius: '10px', 
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          marginBottom: '20px'
        }}>
          <h3 style={{ marginBottom: '20px', color: '#10b981' }}>
            🛒 Deals on Your Usual Items
          </h3>
          <div style={{ display: 'grid', gap: '15px' }}>
            {personalizedDeals.map(deal => (
              <div key={deal.id} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '15px',
                background: '#f0fdf4',
                borderRadius: '8px',
                border: '2px solid #22c55e'
              }}>
                <div>
                  <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{deal.item}</div>
                  <div style={{ fontSize: '14px', color: '#666' }}>📍 {deal.store}</div>
                  <div style={{ fontSize: '12px', color: '#666' }}>⏰ Expires: {deal.expires}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#22c55e' }}>
                    R{deal.price}
                  </div>
                  <div style={{ fontSize: '14px', color: '#666', textDecoration: 'line-through' }}>
                    R{deal.originalPrice}
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#22c55e' }}>
                    Save R{deal.savings}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '5px' }}>
                  <button 
                    onClick={() => addToCart(deal)}
                    style={{ 
                      background: '#8b5cf6', 
                      color: 'white', 
                      border: 'none', 
                      padding: '8px 12px', 
                      borderRadius: '5px',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    📋 Add to List
                  </button>
                  <button style={{ 
                    background: '#10b981', 
                    color: 'white', 
                    border: 'none', 
                    padding: '8px 12px', 
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}>
                    🛒 Get Deal
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const CartTab = () => {
    const groupedItems = shoppingCart.reduce((groups, item) => {
      const category = item.category || 'other';
      if (!groups[category]) groups[category] = [];
      groups[category].push(item);
      return groups;
    }, {});

    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2>📋 Smart Shopping List</h2>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={clearCart}
              disabled={shoppingCart.length === 0}
              style={{
                background: shoppingCart.length === 0 ? '#ccc' : '#ef4444',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '5px',
                cursor: shoppingCart.length === 0 ? 'not-allowed' : 'pointer'
              }}
            >
              🗑️ Clear All
            </button>
          </div>
        </div>

        {/* Cart Summary */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '20px', 
          marginBottom: '30px' 
        }}>
          <div style={{ 
            background: '#eff6ff', 
            padding: '20px',
            borderRadius: '10px',
            border: '1px solid #dbeafe'
          }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1e40af' }}>
              {cartTotals.itemCount}
            </div>
            <div style={{ fontSize: '14px', color: '#3b82f6' }}>Total Items</div>
          </div>
          
          <div style={{ 
            background: '#f0fdf4', 
            padding: '20px',
            borderRadius: '10px',
            border: '1px solid #bbf7d0'
          }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#166534' }}>
              {cartTotals.checkedCount}
            </div>
            <div style={{ fontSize: '14px', color: '#16a34a' }}>Items Checked</div>
          </div>
          
          <div style={{ 
            background: '#fef3c7', 
            padding: '20px',
            borderRadius: '10px',
            border: '1px solid #fbbf24'
          }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#d97706' }}>
              R{cartTotals.total.toFixed(2)}
            </div>
            <div style={{ fontSize: '14px', color: '#f59e0b' }}>Total Cost</div>
          </div>
          
          <div style={{ 
            background: '#f3e8ff', 
            padding: '20px',
            borderRadius: '10px',
            border: '1px solid #c4b5fd'
          }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#7c3aed' }}>
              R{cartTotals.checkedTotal.toFixed(2)}
            </div>
            <div style={{ fontSize: '14px', color: '#8b5cf6' }}>Checked Total</div>
          </div>
        </div>

        {shoppingCart.length === 0 ? (
          <div style={{ 
            background: 'white', 
            padding: '40px', 
            borderRadius: '10px', 
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>🛒</div>
            <h3 style={{ color: '#666', marginBottom: '10px' }}>Your shopping list is empty</h3>
            <p style={{ color: '#888', marginBottom: '20px' }}>
              Add items from medicine search, deals, or manually create your list
            </p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button
                onClick={() => setActiveTab('search')}
                style={{
                  background: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '5px',
                  cursor: 'pointer'
                }}
              >
                🔍 Search Medicine
              </button>
              <button
                onClick={() => setActiveTab('deals')}
                style={{
                  background: '#10b981',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '5px',
                  cursor: 'pointer'
                }}
              >
                🎯 Browse Deals
              </button>
            </div>
          </div>
        ) : (
          <div style={{ 
            background: 'white', 
            padding: '20px', 
            borderRadius: '10px', 
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)' 
          }}>
            <h3 style={{ marginBottom: '20px' }}>🛒 Your Items</h3>
            
            {Object.entries(groupedItems).map(([category, items]) => (
              <div key={category} style={{ marginBottom: '30px' }}>
                <h4 style={{ 
                  color: '#374151', 
                  marginBottom: '15px',
                  textTransform: 'capitalize',
                  borderBottom: '2px solid #e5e7eb',
                  paddingBottom: '5px'
                }}>
                  {category} ({items.length} items)
                </h4>
                
                <div style={{ display: 'grid', gap: '10px' }}>
                  {items.map((item) => (
                    <div key={item.id} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '15px',
                      padding: '15px',
                      background: item.checked ? '#f0fdf4' : '#f8fafc',
                      borderRadius: '8px',
                      border: item.checked ? '2px solid #22c55e' : '1px solid #e2e8f0'
                    }}>
                      <input
                        type="checkbox"
                        checked={item.checked}
                        onChange={(e) => updateCartItem(item.id, { checked: e.target.checked })}
                        style={{ 
                          width: '18px', 
                          height: '18px',
                          cursor: 'pointer'
                        }}
                      />
                      
                      <div style={{ flex: 1 }}>
                        <div style={{ 
                          fontWeight: 'bold', 
                          fontSize: '16px',
                          textDecoration: item.checked ? 'line-through' : 'none',
                          color: item.checked ? '#666' : '#000'
                        }}>
                          {item.name}
                        </div>
                        {item.store && (
                          <div style={{ fontSize: '14px', color: '#666' }}>
                            📍 {item.store} {item.location && `- ${item.location}`}
                          </div>
                        )}
                      </div>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <label style={{ fontSize: '14px', color: '#666' }}>Qty:</label>
                          <StableInput
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => updateCartItem(item.id, { quantity: parseInt(e.target.value) || 1 })}
                            style={{
                              width: '60px',
                              padding: '5px',
                              border: '1px solid #ccc',
                              borderRadius: '3px',
                              textAlign: 'center'
                            }}
                          />
                        </div>
                        
                        <div style={{ textAlign: 'right', minWidth: '80px' }}>
                          <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#374151' }}>
                            R{(item.price * item.quantity).toFixed(2)}
                          </div>
                          {item.quantity > 1 && (
                            <div style={{ fontSize: '12px', color: '#666' }}>
                              R{item.price.toFixed(2)} each
                            </div>
                          )}
                        </div>
                        
                        <button
                          onClick={() => removeFromCart(item.id)}
                          style={{
                            background: '#ef4444',
                            color: 'white',
                            border: 'none',
                            padding: '5px 8px',
                            borderRadius: '3px',
                            cursor: 'pointer',
                            fontSize: '12px'
                          }}
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            
            {/* Cart Actions */}
            <div style={{ 
              marginTop: '30px', 
              padding: '20px', 
              background: '#f8fafc', 
              borderRadius: '8px',
              border: '1px solid #e2e8f0'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#374151' }}>
                    Total: R{cartTotals.total.toFixed(2)}
                  </div>
                  <div style={{ fontSize: '14px', color: '#666' }}>
                    {cartTotals.checkedCount} of {cartTotals.itemCount} items checked 
                    {cartTotals.checkedCount > 0 && ` (R${cartTotals.checkedTotal.toFixed(2)})`}
                  </div>
                </div>
                
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    onClick={() => {
                      const allChecked = shoppingCart.every(item => item.checked);
                      shoppingCart.forEach(item => {
                        updateCartItem(item.id, { checked: !allChecked });
                      });
                    }}
                    style={{
                      background: '#6b7280',
                      color: 'white',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '5px',
                      cursor: 'pointer'
                    }}
                  >
                    {shoppingCart.every(item => item.checked) ? '☐ Uncheck All' : '☑️ Check All'}
                  </button>
                </div>
              </div>
              
              {cartTotals.checkedCount > 0 && (
                <div style={{ 
                  marginTop: '15px', 
                  padding: '10px', 
                  background: '#dcfce7', 
                  borderRadius: '5px',
                  fontSize: '14px',
                  color: '#166534'
                }}>
                  💡 <strong>Budget Impact:</strong> Your checked items (R{cartTotals.checkedTotal.toFixed(2)}) represent {((cartTotals.checkedTotal / (userConfig.categories?.food || 1)) * 100).toFixed(1)}% of your monthly food budget.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  const MealPlanTab = () => {
    const generatePersonalizedMealPlan = useMemo(() => {
      const proteins = userConfig.foodPreferences?.proteins || ['chicken', 'eggs'];
      const vegetables = userConfig.foodPreferences?.vegetables || ['potatoes', 'onions'];
      const grains = userConfig.foodPreferences?.grains || ['rice', 'pap'];
      const people = userConfig.people || 1;
      
      return [
        { 
          day: 'Monday', 
          meal: `${proteins[0]} & ${grains[0]} Curry`, 
          cost: 45.20 + (people - 4) * 8, 
          serves: people,
          ingredients: [proteins[0], grains[0], vegetables[0] || 'onions'],
          calories: 520
        },
        { 
          day: 'Tuesday', 
          meal: `${proteins[1] || proteins[0]} & ${vegetables[0]} Scramble`, 
          cost: 28.50 + (people - 4) * 5, 
          serves: people,
          ingredients: [proteins[1] || proteins[0], vegetables[0]],
          calories: 380
        },
        { 
          day: 'Wednesday', 
          meal: `${proteins[0]} Stir Fry`, 
          cost: 52.80 + (people - 4) * 10, 
          serves: people,
          ingredients: [proteins[0], vegetables[1] || vegetables[0] || 'mixed vegetables'],
          calories: 450
        },
        { 
          day: 'Thursday', 
          meal: `${grains[0]} & Lentil Bowl`, 
          cost: 32.20 + (people - 4) * 6, 
          serves: people,
          ingredients: ['Lentils', grains[0], vegetables[0] || 'onions'],
          calories: 420
        },
        { 
          day: 'Friday', 
          meal: `${vegetables[0]} Curry`, 
          cost: 25.90 + (people - 4) * 4, 
          serves: people,
          ingredients: [vegetables[0], 'Curry spices', 'tomatoes'],
          calories: 350
        }
      ];
    }, [userConfig]);

    const totalMealCost = generatePersonalizedMealPlan.reduce((sum, meal) => sum + meal.cost, 0);
    const weeklyFoodBudget = (userConfig.categories?.food || 0) / 4;

    return (
      <div>
        <h2 style={{ marginBottom: '20px' }}>🍽️ AI Meal Planner</h2>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '20px', 
          marginBottom: '30px' 
        }}>
          <div style={{ 
            background: '#eff6ff', 
            border: '1px solid #dbeafe',
            padding: '20px',
            borderRadius: '10px'
          }}>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#1e40af' }}>
              R{totalMealCost.toFixed(2)}
            </div>
            <div style={{ fontSize: '14px', color: '#3b82f6' }}>Weekly Cost</div>
          </div>
          <div style={{ 
            background: '#f0fdf4', 
            border: '1px solid #bbf7d0',
            padding: '20px',
            borderRadius: '10px'
          }}>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#166534' }}>
              R{weeklyFoodBudget.toFixed(2)}
            </div>
            <div style={{ fontSize: '14px', color: '#16a34a' }}>Food Budget</div>
          </div>
          <div style={{ 
            background: totalMealCost <= weeklyFoodBudget ? '#f0fdf4' : '#fef2f2', 
            border: `1px solid ${totalMealCost <= weeklyFoodBudget ? '#bbf7d0' : '#fecaca'}`,
            padding: '20px',
            borderRadius: '10px'
          }}>
            <div style={{ 
              fontSize: '20px', 
              fontWeight: 'bold', 
              color: totalMealCost <= weeklyFoodBudget ? '#166534' : '#dc2626'
            }}>
              {totalMealCost <= weeklyFoodBudget ? '✓' : '⚠️'}
            </div>
            <div style={{ 
              fontSize: '14px', 
              color: totalMealCost <= weeklyFoodBudget ? '#16a34a' : '#dc2626'
            }}>
              {totalMealCost <= weeklyFoodBudget ? 'Within Budget' : 'Over Budget'}
            </div>
          </div>
        </div>

        <div style={{ 
          background: 'white', 
          padding: '20px', 
          borderRadius: '10px', 
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)' 
        }}>
          <h3 style={{ marginBottom: '20px' }}>📅 Your AI-Generated Meal Plan</h3>
          
          {generatePersonalizedMealPlan.map((meal, index) => (
            <div key={index} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '15px',
              marginBottom: '10px',
              background: '#f8fafc',
              borderRadius: '8px',
              border: '1px solid #e2e8f0'
            }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{meal.day}</div>
                <div style={{ fontSize: '16px', marginBottom: '5px' }}>{meal.meal}</div>
                <div style={{ fontSize: '14px', color: '#666' }}>
                  🥘 {meal.ingredients.join(', ')} • {meal.calories} calories
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#10b981' }}>
                  R{meal.cost.toFixed(2)}
                </div>
                <div style={{ fontSize: '12px', color: '#666' }}>
                  R{(meal.cost / meal.serves).toFixed(2)}/person
                </div>
              </div>
              <button
                onClick={() => {
                  const mealAsCartItem = {
                    name: `${meal.day}: ${meal.meal}`,
                    price: meal.cost,
                    store: 'Meal Plan',
                    location: 'Home Cooking',
                    category: 'food'
                  };
                  addToCart(mealAsCartItem);
                }}
                style={{
                  background: '#8b5cf6',
                  color: 'white',
                  border: 'none',
                  padding: '5px 10px',
                  borderRadius: '3px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  marginLeft: '15px'
                }}
              >
                📋 Add to List
              </button>
            </div>
          ))}
          
          <div style={{ 
            marginTop: '20px', 
            padding: '15px', 
            background: '#f0f9ff', 
            borderRadius: '8px',
            border: '1px solid #dbeafe'
          }}>
            <div style={{ fontWeight: 'bold', color: '#1e40af', marginBottom: '5px' }}>
              🤖 AI Meal Planning Tips:
            </div>
            <div style={{ fontSize: '14px', color: '#666' }}>
              • Plan based on your food preferences and household size<br/>
              • Shop for ingredients in bulk to save money<br/>
              • Use your location-based price search to find best deals<br/>
              • Add meal ingredients to your shopping list for easy tracking
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      <div style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
        color: 'white', 
        padding: '20px' 
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ margin: '0 0 10px 0', fontSize: '28px' }}>🏠 Personal Budget AI</h1>
            <p style={{ margin: 0, opacity: 0.9 }}>
              Multi-Location Budget Management • {userProfile.name || user.email}
            </p>
          </div>
          <button 
            onClick={onLogout} 
            style={{ 
              background: '#dc2626', 
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            🚪 Logout
          </button>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
        <div style={{ 
          background: 'white', 
          borderRadius: '10px', 
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          overflow: 'hidden'
        }}>
          <div style={{ 
            display: 'flex', 
            borderBottom: '1px solid #e2e8f0',
            background: '#f8fafc',
            overflowX: 'auto'
          }}>
            {[
              { id: 'dashboard', label: '🏠 Dashboard' },
              { id: 'profile', label: '👤 Profile' },
              { id: 'config', label: '⚙️ Budget' },
              { id: 'search', label: '💊 Med Search' },
              { id: 'deals', label: '🎯 My Deals' },
              { id: 'cart', label: '📋 Shopping List' },
              { id: 'meals', label: '🍽️ Meal Plans' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  flex: 1,
                  minWidth: '120px',
                  padding: '15px 10px',
                  border: 'none',
                  background: activeTab === tab.id ? 'white' : 'transparent',
                  color: activeTab === tab.id ? '#3b82f6' : '#666',
                  fontWeight: activeTab === tab.id ? 'bold' : 'normal',
                  cursor: 'pointer',
                  borderBottom: activeTab === tab.id ? '2px solid #3b82f6' : 'none'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div style={{ padding: '30px' }}>
            {activeTab === 'dashboard' && <DashboardTab />}
            {activeTab === 'profile' && <ProfileTab />}
            {activeTab === 'config' && <ConfigTab />}
            {activeTab === 'search' && <SearchTab />}
            {activeTab === 'deals' && <DealsTab />}
            {activeTab === 'cart' && <CartTab />}
            {activeTab === 'meals' && <MealPlanTab />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
