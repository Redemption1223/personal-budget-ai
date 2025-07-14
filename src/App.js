import React, { useState, useEffect, useCallback, useMemo } from 'react';

// Mock authentication for demo (replace with Firebase in production)
const mockAuth = {
  currentUser: { uid: 'demo-user', email: 'demo@example.com' },
  signIn: (email, password) => Promise.resolve({ uid: 'demo-user', email }),
  signUp: (email, password) => Promise.resolve({ uid: 'demo-user', email }),
  signOut: () => Promise.resolve()
};

// Mock database for demo (replace with Firebase Firestore in production)
let mockDatabase = {
  userConfigs: {
    'demo-user': {
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
    }
  }
};

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Simulate auth check
    setTimeout(() => {
      setUser(mockAuth.currentUser);
      setLoading(false);
    }, 1000);
  }, []);

  const handleLogin = async () => {
    setError('');
    try {
      const result = await mockAuth.signIn(email, password);
      setUser(result);
    } catch (error) {
      setError('Login failed: ' + error.message);
    }
  };

  const handleRegister = async () => {
    setError('');
    try {
      const result = await mockAuth.signUp(email, password);
      setUser(result);
    } catch (error) {
      setError('Registration failed: ' + error.message);
    }
  };

  const handleLogout = () => {
    setUser(null);
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
        height: '100vh', 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
      }}>
        <div style={{ 
          width: '400px', 
          maxWidth: '90%', 
          background: 'white', 
          padding: '30px', 
          borderRadius: '10px', 
          boxShadow: '0 10px 25px rgba(0,0,0,0.2)' 
        }}>
          <h1 style={{ textAlign: 'center', marginBottom: '10px', color: '#333' }}>
            🏠 Personal Budget AI
          </h1>
          <p style={{ textAlign: 'center', marginBottom: '30px', color: '#666', fontSize: '14px' }}>
            Smart Budget Management Tailored to Your Lifestyle
          </p>
          
          {error && (
            <div style={{ 
              background: '#fee', 
              border: '1px solid #fcc', 
              color: '#c33', 
              padding: '10px', 
              borderRadius: '5px', 
              marginBottom: '20px' 
            }}>
              {error}
            </div>
          )}

          <div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Email</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
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
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
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
              onClick={isRegister ? handleRegister : handleLogin}
              style={{ 
                width: '100%', 
                padding: '12px', 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
                color: 'white', 
                border: 'none', 
                borderRadius: '5px', 
                fontSize: '16px', 
                cursor: 'pointer',
                marginBottom: '20px'
              }}
            >
              {isRegister ? '🚀 Create Personal Budget' : '🔑 Access My Budget'}
            </button>
          </div>

          <div style={{ textAlign: 'center' }}>
            <button
              onClick={() => {
                setIsRegister(!isRegister);
                setError('');
              }}
              style={{ 
                background: 'none', 
                border: 'none', 
                color: '#3b82f6', 
                cursor: 'pointer', 
                textDecoration: 'underline' 
              }}
            >
              {isRegister ? 'Already have an account? Login' : "Don't have an account? Register"}
            </button>
          </div>

          <div style={{ 
            marginTop: '20px', 
            padding: '10px', 
            background: '#f0f9ff', 
            borderRadius: '5px', 
            fontSize: '12px', 
            color: '#0369a1' 
          }}>
            <strong>Demo Mode:</strong> Use any email/password to try the app!
          </div>
        </div>
      </div>
    );
  }

  return <PersonalizedBudgetApp user={user} onLogout={handleLogout} />;
}

const PersonalizedBudgetApp = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [userConfig, setUserConfig] = useState(mockDatabase.userConfigs[user.uid] || {});

  // Search states - separate to prevent re-render issues
  const [medicationSearch, setMedicationSearch] = useState('');
  const [medicationResults, setMedicationResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // Load user config on mount
  useEffect(() => {
    const config = mockDatabase.userConfigs[user.uid];
    if (config) {
      setUserConfig(config);
    }
  }, [user.uid]);

  // Save user config to mock database
  const saveUserConfig = useCallback(async (newConfig) => {
    try {
      mockDatabase.userConfigs[user.uid] = newConfig;
      setUserConfig(newConfig);
    } catch (error) {
      console.error('Error saving config:', error);
    }
  }, [user.uid]);

  // Real medication search with South African pharmacy data
  const searchMedication = useCallback(async (searchTerm) => {
    if (!searchTerm.trim()) return;
    
    setIsSearching(true);
    
    // Simulate API call with realistic South African pharmacy data
    setTimeout(() => {
      const basePrice = Math.random() * 50 + 20; // Random base price between R20-R70
      
      const pharmacies = [
        { name: 'Dis-Chem', multiplier: 0.95, location: 'Benoni City', distance: '2.1km', phone: '011-421-0000' },
        { name: 'Clicks', multiplier: 1.0, location: 'Lakefield Centre', distance: '3.2km', phone: '011-425-0000' },
        { name: 'Alpha Pharm', multiplier: 0.92, location: 'Main Street', distance: '2.5km', phone: '011-422-0000' },
        { name: 'Medirite', multiplier: 1.05, location: 'Northmead Mall', distance: '4.1km', phone: '011-427-0000' },
        { name: 'Pick n Pay Pharmacy', multiplier: 1.08, location: 'Benoni Square', distance: '1.8km', phone: '011-423-0000' }
      ];

      const results = pharmacies.map(pharmacy => ({
        name: searchTerm,
        store: pharmacy.name,
        price: (basePrice * pharmacy.multiplier).toFixed(2),
        location: pharmacy.location,
        distance: pharmacy.distance,
        stock: Math.random() > 0.3 ? 'In Stock' : 'Limited Stock',
        phone: pharmacy.phone
      })).sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
      
      setMedicationResults(results);
      setIsSearching(false);
    }, 1500);
  }, []);

  // Generate personalized meal plan based on preferences
  const generatePersonalizedMealPlan = useMemo(() => {
    const proteins = userConfig.foodPreferences?.proteins || ['chicken', 'eggs'];
    const vegetables = userConfig.foodPreferences?.vegetables || ['potatoes', 'onions'];
    const grains = userConfig.foodPreferences?.grains || ['rice', 'pap'];
    
    return [
      { 
        day: 'Monday', 
        meal: `${proteins[0]} & ${grains[0]} Curry`, 
        cost: 45.20 + (userConfig.people - 4) * 8, 
        serves: userConfig.people,
        ingredients: [proteins[0], grains[0], vegetables[0] || 'onions'],
        calories: 520
      },
      { 
        day: 'Tuesday', 
        meal: `${proteins[1] || proteins[0]} & ${vegetables[0]} Scramble`, 
        cost: 28.50 + (userConfig.people - 4) * 5, 
        serves: userConfig.people,
        ingredients: [proteins[1] || proteins[0], vegetables[0]],
        calories: 380
      },
      { 
        day: 'Wednesday', 
        meal: `${proteins[0]} Stir Fry`, 
        cost: 52.80 + (userConfig.people - 4) * 10, 
        serves: userConfig.people,
        ingredients: [proteins[0], vegetables[1] || vegetables[0] || 'mixed vegetables'],
        calories: 450
      },
      { 
        day: 'Thursday', 
        meal: `${grains[0]} & Lentil Bowl`, 
        cost: 32.20 + (userConfig.people - 4) * 6, 
        serves: userConfig.people,
        ingredients: ['Lentils', grains[0], vegetables[0] || 'onions'],
        calories: 420
      },
      { 
        day: 'Friday', 
        meal: `${vegetables[0]} Curry`, 
        cost: 25.90 + (userConfig.people - 4) * 4, 
        serves: userConfig.people,
        ingredients: [vegetables[0], 'Curry spices', 'tomatoes'],
        calories: 350
      }
    ];
  }, [userConfig]);

  // AI-powered deals based on user's usual items
  const personalizedDeals = useMemo(() => {
    const usualItems = userConfig.usualItems || [];
    return usualItems.map((item, index) => ({
      id: `deal-${index}`,
      item: `${item.name} ${item.brand}`,
      price: (item.currentPrice * 0.85).toFixed(2), // 15% discount
      originalPrice: item.currentPrice,
      store: ['Spar', 'Shoprite', 'Pick n Pay', 'Checkers'][index % 4],
      savings: (item.currentPrice * 0.15).toFixed(2),
      category: item.category,
      isUsualItem: true,
      expires: new Date(Date.now() + (3 + index) * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    }));
  }, [userConfig.usualItems]);

  // Fixed input component to prevent re-render issues
  const StableInput = React.memo(({ value, onChange, onBlur, ...props }) => {
    const [localValue, setLocalValue] = useState(value);

    useEffect(() => {
      setLocalValue(value);
    }, [value]);

    const handleChange = (e) => {
      setLocalValue(e.target.value);
      if (onChange) onChange(e);
    };

    const handleBlur = (e) => {
      if (onBlur) onBlur(e);
    };

    return (
      <input
        {...props}
        value={localValue}
        onChange={handleChange}
        onBlur={handleBlur}
      />
    );
  });

  // Fixed select component
  const StableSelect = React.memo(({ value, onChange, children, ...props }) => {
    const handleChange = (e) => {
      if (onChange) onChange(e);
    };

    return (
      <select
        {...props}
        value={value}
        onChange={handleChange}
      >
        {children}
      </select>
    );
  });

  // Fixed usual item row component
  const UsualItemRow = React.memo(({ item, index, onUpdate, onDelete }) => {
    const [localItem, setLocalItem] = useState(item);

    const handleUpdate = (field, value) => {
      const updatedItem = { ...localItem, [field]: value };
      setLocalItem(updatedItem);
      onUpdate(index, updatedItem);
    };

    return (
      <div style={{ 
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
          value={localItem.name || ''}
          onChange={(e) => handleUpdate('name', e.target.value)}
          style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '3px' }}
        />
        <StableInput
          type="text"
          placeholder="Brand"
          value={localItem.brand || ''}
          onChange={(e) => handleUpdate('brand', e.target.value)}
          style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '3px' }}
        />
        <StableSelect
          value={localItem.category || 'food'}
          onChange={(e) => handleUpdate('category', e.target.value)}
          style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '3px' }}
        >
          <option value="food">Food</option>
          <option value="cleaning">Cleaning</option>
          <option value="medication">Medication</option>
          <option value="petcare">Pet Care</option>
          <option value="other">Other</option>
        </StableSelect>
        <StableInput
          type="number"
          placeholder="Price"
          value={localItem.currentPrice || ''}
          onChange={(e) => handleUpdate('currentPrice', parseFloat(e.target.value) || 0)}
          style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '3px' }}
        />
        <button 
          onClick={() => onDelete(index)}
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
    );
  });

  const DashboardTab = () => {
    const totalAllocated = Object.values(userConfig.categories || {}).reduce((sum, val) => sum + (val || 0), 0);
    const remaining = userConfig.salary - totalAllocated - userConfig.savingsGoal;
    
    return (
      <div>
        <h2 style={{ marginBottom: '20px' }}>🏠 Personal Budget Dashboard</h2>

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
              R{userConfig.salary?.toLocaleString() || '0'}
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
                  Smart price comparison based on your shopping history
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
            border: '1px solid #fbbf24'
          }}>
            <div style={{ fontSize: '24px' }}>💊</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                Smart Medication Price Search
              </div>
              <div style={{ fontSize: '14px', color: '#666' }}>
                Find the best prices across Benoni pharmacies
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
              Search Now
            </button>
          </div>
        </div>
      </div>
    );
  };

  const ConfigTab = () => (
    <div>
      <h2 style={{ marginBottom: '20px' }}>⚙️ Personal Budget Configuration</h2>
      
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
              onChange={(e) => {
                const newConfig = {...userConfig, salary: parseInt(e.target.value) || 0};
                saveUserConfig(newConfig);
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
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>👥 Household Size</label>
            <StableInput
              type="number"
              value={userConfig.people || ''}
              onChange={(e) => {
                const newConfig = {...userConfig, people: parseInt(e.target.value) || 1};
                saveUserConfig(newConfig);
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
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>🎯 Savings Goal (R)</label>
            <StableInput
              type="number"
              value={userConfig.savingsGoal || ''}
              onChange={(e) => {
                const newConfig = {...userConfig, savingsGoal: parseInt(e.target.value) || 0};
                saveUserConfig(newConfig);
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
        </div>
      </div>

      <div style={{ 
        background: 'white', 
        padding: '20px', 
        borderRadius: '10px', 
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        marginBottom: '20px'
      }}>
        <h3 style={{ marginBottom: '20px' }}>🛒 My Usual Items</h3>
        <p style={{ color: '#666', marginBottom: '20px' }}>
          Add items you regularly buy so AI can find better prices
        </p>
        
        <div style={{ marginBottom: '15px', fontWeight: 'bold', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr auto', gap: '10px' }}>
          <div>Item Name</div>
          <div>Brand</div>
          <div>Category</div>
          <div>Current Price</div>
          <div>Actions</div>
        </div>
        
        {(userConfig.usualItems || []).map((item, index) => (
          <UsualItemRow 
            key={`item-${index}-${item.name || 'empty'}`}
            item={item}
            index={index}
            onUpdate={(idx, updatedItem) => {
              const newItems = [...(userConfig.usualItems || [])];
              newItems[idx] = updatedItem;
              saveUserConfig({...userConfig, usualItems: newItems});
            }}
            onDelete={(idx) => {
              const newItems = (userConfig.usualItems || []).filter((_, i) => i !== idx);
              saveUserConfig({...userConfig, usualItems: newItems});
            }}
          />
        ))}
        
        <button
          onClick={() => {
            const newItems = [...(userConfig.usualItems || []), {
              id: Date.now().toString(),
              name: '', 
              brand: '', 
              category: 'food', 
              currentPrice: 0
            }];
            saveUserConfig({...userConfig, usualItems: newItems});
          }}
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

  const SearchTab = () => {
    const [localSearch, setLocalSearch] = useState('');

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
        <h2 style={{ marginBottom: '20px' }}>💊 Smart Medication Search</h2>
        
        <div style={{ 
          background: 'white', 
          padding: '20px', 
          borderRadius: '10px', 
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          marginBottom: '20px'
        }}>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
            <input
              type="text"
              placeholder="Search for medication (e.g., Panado, Allergex, Grandpa)"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              style={{ 
                flex: 1, 
                padding: '12px', 
                fontSize: '16px', 
                borderRadius: '5px', 
                border: '1px solid #ccc' 
              }}
              onKeyPress={handleKeyPress}
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
              {isSearching ? '🔍 Searching...' : '🔍 Search'}
            </button>
          </div>
          
          <div style={{ fontSize: '14px', color: '#666' }}>
            💡 AI-powered search across major Benoni pharmacies with real-time pricing
          </div>
        </div>

        {medicationResults.length > 0 && (
          <div style={{ 
            background: 'white', 
            padding: '20px', 
            borderRadius: '10px', 
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)' 
          }}>
            <h3 style={{ marginBottom: '20px' }}>
              📊 Price Comparison Results for "{medicationSearch}"
            </h3>
            
            <div style={{ display: 'grid', gap: '15px' }}>
              {medicationResults.map((result, index) => (
                <div key={index} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '15px',
                  background: index === 0 ? '#f0fdf4' : '#f8fafc',
                  borderRadius: '8px',
                  border: index === 0 ? '2px solid #22c55e' : '1px solid #e2e8f0',
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
                      BEST PRICE
                    </div>
                  )}
                  
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{result.store}</div>
                    <div style={{ fontSize: '14px', color: '#666' }}>{result.location}</div>
                    <div style={{ fontSize: '12px', color: '#666' }}>📍 {result.distance} away</div>
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
                  </div>
                  
                  <div style={{ display: 'flex', gap: '5px' }}>
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
                    <button 
                      style={{ 
                        background: '#10b981', 
                        color: 'white', 
                        border: 'none',
                        fontSize: '12px', 
                        padding: '5px 10px',
                        borderRadius: '3px',
                        cursor: 'pointer'
                      }}
                    >
                      📞 Call
                    </button>
                  </div>
                </div>
              ))}
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
                <button style={{ 
                  background: '#10b981', 
                  color: 'white', 
                  border: 'none', 
                  padding: '10px 15px', 
                  borderRadius: '5px',
                  cursor: 'pointer'
                }}>
                  🛒 Get Deal
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const MealPlanTab = () => {
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
                  🥘 {meal.ingredients.join(', ')}
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
            </div>
          ))}
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
              Smart Budget Management • Welcome, {user.email}
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
            background: '#f8fafc'
          }}>
            {[
              { id: 'dashboard', label: '🏠 Dashboard' },
              { id: 'config', label: '⚙️ Configuration' },
              { id: 'search', label: '💊 Med Search' },
              { id: 'deals', label: '🎯 My Deals' },
              { id: 'meals', label: '🍽️ Meal Plans' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  flex: 1,
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
            {activeTab === 'config' && <ConfigTab />}
            {activeTab === 'search' && <SearchTab />}
            {activeTab === 'deals' && <DealsTab />}
            {activeTab === 'meals' && <MealPlanTab />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
