import React, { useState, useEffect, useCallback, useMemo } from 'react';

// Simulated user database
let userDatabase = {
  users: {
    'demo@example.com': {
      id: 'demo-user',
      email: 'demo@example.com',
      password: 'demo123',
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

// Auth service
const authService = {
  currentUser: null,
  
  signIn: async (email, password) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const user = userDatabase.users[email.toLowerCase()];
    if (!user || user.password !== password) {
      throw new Error('Invalid email or password');
    }
    authService.currentUser = { id: user.id, email: user.email, profile: user.profile };
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
        locations: [{
          id: 'home', name: 'Home', city: 'Benoni', province: 'Gauteng', country: 'South Africa',
          coordinates: { lat: -26.1889, lng: 28.3119 }, isActive: true, isPrimary: true
        }],
        activeLocationId: 'home'
      },
      config: {
        salary: 20000, people: 1, savingsGoal: 2000,
        categories: {
          rent: 6000, electricity: 600, water: 300, gas: 150, internet: 599,
          food: 4000, cleaning: 300, medication: 400, petcare: 0,
          transport: 1000, fuel: 800, entertainment: 400, clothing: 300, other: 500
        },
        usualItems: [],
        foodPreferences: { proteins: ['chicken', 'eggs'], vegetables: ['potatoes', 'onions'], grains: ['rice', 'pap'] },
        medications: [], pets: []
      },
      shoppingCart: []
    };
    
    userDatabase.users[email.toLowerCase()] = newUser;
    authService.currentUser = { id: newUser.id, email: newUser.email, profile: newUser.profile };
    return authService.currentUser;
  },
  
  sendPasswordReset: async (email) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const user = userDatabase.users[email.toLowerCase()];
    if (!user) throw new Error('No user found with this email address');
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

// Database service
const dbService = {
  getUserConfig: async (userId) => {
    const user = Object.values(userDatabase.users).find(u => u.id === userId);
    return user ? user.config : null;
  },
  
  saveUserConfig: async (userId, config) => {
    const user = Object.values(userDatabase.users).find(u => u.id === userId);
    if (user) {
      user.config = { ...user.config, ...config };
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
    }
  }
};

// Input components
const SearchInput = ({ value = '', onChange, onKeyPress, placeholder, disabled, style, type = "text", min, ...props }) => {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChange = (e) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    if (onChange) {
      onChange({ target: { value: newValue } });
    }
  };

  return (
    <input
      type={type}
      min={min}
      value={localValue}
      onChange={handleChange}
      onKeyPress={onKeyPress}
      placeholder={placeholder}
      disabled={disabled}
      style={style}
      {...props}
    />
  );
};

const FixedInput = ({ value = '', onChange, onBlur, onKeyPress, placeholder, disabled, style, type = "text", min, ...props }) => {
  const [localValue, setLocalValue] = useState(value);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (!isFocused) {
      setLocalValue(value);
    }
  }, [value, isFocused]);

  const handleChange = (e) => {
    setLocalValue(e.target.value);
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = (e) => {
    setIsFocused(false);
    if (onChange && localValue !== value) {
      onChange({ target: { value: localValue } });
    }
    if (onBlur) {
      onBlur(e);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && onChange && localValue !== value) {
      onChange({ target: { value: localValue } });
    }
    if (onKeyPress) {
      onKeyPress(e);
    }
  };

  return (
    <input
      type={type}
      min={min}
      value={localValue}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onKeyPress={handleKeyPress}
      placeholder={placeholder}
      disabled={disabled}
      style={style}
      {...props}
    />
  );
};

// Mock web search function
const mockWebSearch = async (query, locations) => {
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const results = [];
  const storeData = {
    'Pick n Pay': { type: 'supermarket', multiplier: 1.0, phone: '0800-11-22-88' },
    'Shoprite': { type: 'supermarket', multiplier: 0.95, phone: '0800-01-43-77' },
    'Checkers': { type: 'supermarket', multiplier: 1.05, phone: '0800-01-43-77' },
    'Spar': { type: 'supermarket', multiplier: 1.02, phone: '0861-77-27-27' },
    'Woolworths': { type: 'supermarket', multiplier: 1.25, phone: '0861-50-02-00' },
    'Dis-Chem': { type: 'pharmacy', multiplier: 1.15, phone: '0860-34-72-43' },
    'Clicks': { type: 'pharmacy', multiplier: 1.12, phone: '0860-254-257' },
    'Game': { type: 'department', multiplier: 1.08, phone: '0861-426-3' },
    'Makro': { type: 'wholesale', multiplier: 0.88, phone: '0860-100-006' }
  };

  const getBasePrice = (query) => {
    const productName = query.toLowerCase();
    if (productName.includes('bread') || productName.includes('loaf')) return 18.99;
    if (productName.includes('milk') && productName.includes('2l')) return 24.99;
    if (productName.includes('milk') && productName.includes('1l')) return 16.99;
    if (productName.includes('panado') || productName.includes('panadol')) return 45.99;
    if (productName.includes('eggs') && productName.includes('dozen')) return 35.99;
    if (productName.includes('rice') && productName.includes('kg')) return 28.99;
    if (productName.includes('chicken') && productName.includes('kg')) return 89.99;
    if (productName.includes('potatoes') && productName.includes('kg')) return 22.99;
    if (productName.includes('onions') && productName.includes('kg')) return 18.99;
    return 25.99 + Math.random() * 50;
  };

  locations.forEach(location => {
    Object.entries(storeData).forEach(([storeName, storeInfo]) => {
      const basePrice = getBasePrice(query);
      const locationMultiplier = location.city === 'Johannesburg' ? 1.08 : 1.0;
      const finalPrice = basePrice * storeInfo.multiplier * locationMultiplier;
      
      if (Math.random() > 0.15) {
        results.push({
          product: query,
          name: query,
          store: storeName,
          price: finalPrice.toFixed(2),
          location: `${location.city} ${storeName}`,
          distance: (Math.random() * 15 + 1).toFixed(1) + 'km',
          stock: Math.random() > 0.25 ? 'In Stock' : 'Limited Stock',
          phone: storeInfo.phone,
          address: `${Math.floor(Math.random() * 999 + 1)} Main St, ${location.city}`,
          locationName: location.name,
          city: location.city,
          province: location.province,
          isActiveLocation: location.isActive || false,
          storeType: storeInfo.type,
          special: Math.random() > 0.7 ? `Save R${(finalPrice * 0.1).toFixed(2)}` : null
        });
      }
    });
  });

  return results.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
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

  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);
  const handleNameChange = (e) => setName(e.target.value);
  const handleResetEmailChange = (e) => setResetEmail(e.target.value);

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
            Smart Budget Management with Real AI Search
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
                <FixedInput 
                  type="email" 
                  value={resetEmail} 
                  onChange={handleResetEmailChange}
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
                  <FixedInput 
                    type="text" 
                    value={name} 
                    onChange={handleNameChange}
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
                <FixedInput 
                  type="email" 
                  value={email} 
                  onChange={handleEmailChange}
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
                <FixedInput 
                  type="password" 
                  value={password} 
                  onChange={handlePasswordChange}
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
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [editingLocation, setEditingLocation] = useState(null);
  const [locationForm, setLocationForm] = useState({
    name: '',
    city: '',
    province: '',
    country: 'South Africa'
  });

  const getActiveLocation = useCallback(() => {
    const locations = userProfile?.locations || [];
    if (locations.length === 0) return null;
    const activeLocation = locations.find(loc => loc?.id === userProfile?.activeLocationId);
    return activeLocation || locations[0] || null;
  }, [userProfile]);

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

  const saveUserConfig = useCallback(async (newConfig) => {
    try {
      const updatedConfig = { ...userConfig, ...newConfig };
      await dbService.saveUserConfig(user.id, updatedConfig);
      setUserConfig(updatedConfig);
    } catch (error) {
      console.error('Error saving config:', error);
    }
  }, [user.id, userConfig]);

  const saveUserProfile = useCallback(async (newProfile) => {
    try {
      const updatedProfile = { ...userProfile, ...newProfile };
      await dbService.saveUserProfile(user.id, updatedProfile);
      setUserProfile(updatedProfile);
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  }, [user.id, userProfile]);

  const saveShoppingCart = useCallback(async (newCart) => {
    try {
      await dbService.saveShoppingCart(user.id, newCart);
      setShoppingCart(newCart);
    } catch (error) {
      console.error('Error saving cart:', error);
    }
  }, [user.id]);

  const handleLocationFormChange = (field, value) => {
    setLocationForm(prev => ({ ...prev, [field]: value }));
  };

  const addLocation = () => {
    if (!locationForm.name?.trim() || !locationForm.city?.trim() || !locationForm.province) {
      alert('Please fill in all required fields');
      return;
    }
    const locationId = `loc-${Date.now()}`;
    const newLoc = {
      id: locationId,
      name: locationForm.name.trim(),
      city: locationForm.city.trim(),
      province: locationForm.province,
      country: locationForm.country,
      coordinates: { lat: 0, lng: 0 },
      isActive: false,
      isPrimary: false
    };
    const updatedLocations = [...(userProfile.locations || []), newLoc];
    saveUserProfile({ locations: updatedLocations });
    setEditingLocation(null);
    setLocationForm({ name: '', city: '', province: '', country: 'South Africa' });
  };

  const updateLocation = (locationId) => {
    if (!locationForm.name?.trim() || !locationForm.city?.trim() || !locationForm.province) {
      alert('Please fill in all required fields');
      return;
    }
    const updatedLocations = (userProfile.locations || []).map(loc => 
      loc.id === locationId 
        ? { ...loc, name: locationForm.name.trim(), city: locationForm.city.trim(), province: locationForm.province, country: locationForm.country }
        : loc
    );
    saveUserProfile({ locations: updatedLocations });
    setEditingLocation(null);
    setLocationForm({ name: '', city: '', province: '', country: 'South Africa' });
  };

  const deleteLocation = (locationId) => {
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
    const updatedLocations = locations.filter(loc => loc.id !== locationId);
    let updatedProfile = { locations: updatedLocations };
    if (userProfile.activeLocationId === locationId) {
      const primaryLocation = updatedLocations.find(loc => loc.isPrimary);
      updatedProfile.activeLocationId = primaryLocation?.id || updatedLocations[0]?.id;
    }
    saveUserProfile(updatedProfile);
  };

  const switchActiveLocation = (locationId) => {
    saveUserProfile({ activeLocationId: locationId });
  };

  const setPrimaryLocation = (locationId) => {
    const updatedLocations = (userProfile.locations || []).map(loc => ({
      ...loc,
      isPrimary: loc.id === locationId
    }));
    saveUserProfile({ locations: updatedLocations });
  };

  const performAISearch = async (query) => {
    if (!query?.trim()) {
      setSearchError('Please enter a search term');
      return;
    }
    setIsSearching(true);
    setSearchError('');
    setSearchResults([]);
    try {
      const locations = userProfile?.locations || [];
      if (locations.length === 0) {
        setSearchError('Please add at least one location in your profile');
        setIsSearching(false);
        return;
      }
      const results = await mockWebSearch(query, locations);
      if (results.length === 0) {
        setSearchError(`No results found for "${query}" in your areas`);
      } else {
        setSearchResults(results);
      }
    } catch (error) {
      console.error('Search error:', error);
      setSearchError('Search failed. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const addToCart = (item) => {
    const cartItem = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      name: item.name || item.product || item.item || 'Unknown Item',
      price: parseFloat(item.price) || 0,
      store: item.store || '',
      location: item.location || '',
      address: item.address || '',
      phone: item.phone || '',
      quantity: 1,
      checked: false,
      category: item.category || 'other',
      special: item.special || null
    };
    const newCart = [...shoppingCart, cartItem];
    saveShoppingCart(newCart);
    alert(`Added "${cartItem.name}" to your shopping list!`);
  };

  const updateCartItem = (itemId, updates) => {
    const newCart = shoppingCart.map(item => 
      item.id === itemId ? { ...item, ...updates } : item
    );
    saveShoppingCart(newCart);
  };

  const removeFromCart = (itemId) => {
    const newCart = shoppingCart.filter(item => item.id !== itemId);
    saveShoppingCart(newCart);
  };

  const clearCart = () => {
    if (window.confirm('Are you sure you want to clear your entire shopping list?')) {
      saveShoppingCart([]);
    }
  };

  const cartTotals = useMemo(() => {
    const total = shoppingCart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const checkedTotal = shoppingCart.filter(item => item.checked).reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const itemCount = shoppingCart.length;
    const checkedCount = shoppingCart.filter(item => item.checked).length;
    return { total, checkedTotal, itemCount, checkedCount };
  }, [shoppingCart]);

  const personalizedDeals = useMemo(() => {
    const usualItems = userConfig.usualItems || [];
    return usualItems.map((item, index) => ({
      id: `deal-${index}`,
      item: `${item.name} ${item.brand}`,
      name: item.name,
      product: item.name,
      price: (item.currentPrice * 0.85).toFixed(2),
      originalPrice: item.currentPrice,
      store: ['Spar', 'Shoprite', 'Pick n Pay', 'Checkers'][index % 4],
      savings: (item.currentPrice * 0.15).toFixed(2),
      category: item.category,
      isUsualItem: true,
      expires: new Date(Date.now() + (3 + index) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      special: `Save R${(item.currentPrice * 0.15).toFixed(2)}`
    }));
  }, [userConfig.usualItems]);

  const getDirections = (item) => {
    const query = encodeURIComponent(`${item.store} ${item.location || item.city || ''}`);
    const url = `https://www.google.com/maps/search/${query}`;
    window.open(url, '_blank');
  };

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
            <div style={{ fontSize: '24px' }}>🔍</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                AI-Powered Multi-Location Search
              </div>
              <div style={{ fontSize: '14px', color: '#666' }}>
                Search for products across all stores in your areas
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
              Search Products
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

  const SearchTab = () => {
    const locations = userProfile.locations || [];

    const handleSearch = () => {
      performAISearch(searchQuery);
    };

    const handleSearchChange = (e) => {
      setSearchQuery(e.target.value);
    };

    const handleKeyPress = (e) => {
      if (e.key === 'Enter') {
        handleSearch();
      }
    };

    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2>🔍 AI Multi-Location Product Search</h2>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '14px', color: '#666' }}>
              🗺️ Searching across {locations.length} location{locations.length !== 1 ? 's' : ''}
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
            <SearchInput
              placeholder="Search for any product (e.g., Panado, Bread, Milk, Detergent)"
              value={searchQuery}
              onChange={handleSearchChange}
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
              disabled={isSearching || !searchQuery.trim()}
              style={{ 
                background: isSearching || !searchQuery.trim() ? '#ccc' : '#3b82f6', 
                color: 'white', 
                border: 'none', 
                padding: '12px 20px', 
                borderRadius: '5px',
                cursor: isSearching || !searchQuery.trim() ? 'not-allowed' : 'pointer'
              }}
            >
              {isSearching ? '🔍 Searching...' : '🔍 Search All Stores'}
            </button>
          </div>
          
          <div style={{ fontSize: '14px', color: '#666', marginBottom: '10px' }}>
            🤖 AI searches ALL stores across your locations: pharmacies, supermarkets, department stores, and more!
          </div>
          
          {locations.length > 1 && (
            <div style={{ 
              padding: '10px', 
              background: '#f0f9ff', 
              borderRadius: '5px',
              fontSize: '12px'
            }}>
              <strong>Multi-Location Coverage:</strong> {locations.map(loc => 
                `${loc?.name || 'Unknown'} (${loc?.city || 'Unknown'}, ${loc?.province || 'Unknown'})`
              ).join(' • ')}
            </div>
          )}

          {searchError && (
            <div style={{ 
              marginTop: '10px',
              padding: '10px', 
              background: '#fef2f2', 
              borderRadius: '5px',
              color: '#dc2626',
              fontSize: '14px'
            }}>
              ⚠️ {searchError}
            </div>
          )}
        </div>

        {searchResults.length > 0 && (
          <div style={{ 
            background: 'white', 
            padding: '20px', 
            borderRadius: '10px', 
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)' 
          }}>
            <h3 style={{ marginBottom: '20px' }}>
              📊 Best Prices for "{searchQuery}" Across All Your Locations
            </h3>
            
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
                  R{searchResults[0]?.price || '0.00'}
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
                  R{searchResults.length > 1 ? (parseFloat(searchResults[searchResults.length - 1]?.price || 0) - parseFloat(searchResults[0]?.price || 0)).toFixed(2) : '0.00'}
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
                  {new Set(searchResults.map(r => r?.city || 'Unknown')).size}
                </div>
                <div style={{ fontSize: '12px', color: '#666' }}>Cities Searched</div>
              </div>

              <div style={{ 
                background: '#f3e8ff', 
                padding: '15px', 
                borderRadius: '8px',
                textAlign: 'center',
                border: '1px solid #c4b5fd'
              }}>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#8b5cf6' }}>
                  {searchResults.length}
                </div>
                <div style={{ fontSize: '12px', color: '#666' }}>Stores Found</div>
              </div>
            </div>
            
            <div style={{ display: 'grid', gap: '15px' }}>
              {searchResults.map((result, index) => (
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
                      <span style={{ 
                        marginLeft: '10px', 
                        padding: '2px 6px', 
                        background: '#e5e7eb', 
                        borderRadius: '10px', 
                        fontSize: '10px',
                        textTransform: 'uppercase'
                      }}>
                        {result.storeType}
                      </span>
                    </div>
                    <div style={{ fontSize: '14px', color: '#666', marginBottom: '2px' }}>
                      📍 {result.location}
                    </div>
                    <div style={{ fontSize: '12px', color: '#888' }}>
                      🗺️ {result.locationName} ({result.city}, {result.province}) • {result.distance} away
                    </div>
                    {result.special && (
                      <div style={{ 
                        fontSize: '11px', 
                        color: '#dc2626', 
                        fontWeight: 'bold',
                        marginTop: '3px'
                      }}>
                        🎯 {result.special}
                      </div>
                    )}
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
                        +R{(parseFloat(result.price) - parseFloat(searchResults[0].price)).toFixed(2)}
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
                  
                  <div style={{ display: 'flex', gap: '5px', flexDirection: 'column' }}>
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
                      📋 Add to List
                    </button>
                    <button 
                      onClick={() => getDirections(result)}
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
                🤖 AI Search Complete: Found {searchResults.length} results across {new Set(searchResults.map(r => r.city)).size} cities
              </div>
              <div style={{ fontSize: '14px', color: '#666' }}>
                {searchResults.length > 1 && `Save up to R${(parseFloat(searchResults[searchResults.length - 1]?.price || 0) - parseFloat(searchResults[0]?.price || 0)).toFixed(2)} by choosing the best option! `}
                Add items to your shopping list to track purchases and manage your budget.
              </div>
            </div>
          </div>
        )}
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
              { id: 'search', label: '🔍 AI Search' }
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
            {activeTab === 'search' && <SearchTab />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
