/**
 * MOBILE SHOP PRO — AUTHENTICATION & SESSION MANAGEMENT
 * Handles user login, registration, and session persistence
 */

const Auth = {
  // Session storage keys
  SESSION_KEY: 'user',
  TOKEN_KEY: 'auth_token',
  EXPIRE_KEY: 'token_expire',

  /**
   * Login user or create session
   * @param {object} user - User object {id, email, name, role, ...}
   * @param {number} expiresIn - Expiration time in minutes
   */
  login(user, expiresIn = 1440) {
    // Store user data
    sessionStorage.setItem(this.SESSION_KEY, JSON.stringify(user));

    // Store token expiration time
    const expirationTime = Date.now() + expiresIn * 60 * 1000;
    sessionStorage.setItem(this.EXPIRE_KEY, expirationTime);

    // Generate simple auth token
    const token = this._generateToken();
    sessionStorage.setItem(this.TOKEN_KEY, token);

    // Update UI
    this.updateUI();
  },

  /**
   * Logout user
   */
  logout() {
    sessionStorage.removeItem(this.SESSION_KEY);
    sessionStorage.removeItem(this.TOKEN_KEY);
    sessionStorage.removeItem(this.EXPIRE_KEY);
    this.updateUI();
  },

  /**
   * Check if user is authenticated
   * @returns {boolean}
   */
  isAuthenticated() {
    const user = this.getCurrentUser();
    if (!user) return false;

    // Check if token has expired
    const expirationTime = sessionStorage.getItem(this.EXPIRE_KEY);
    if (expirationTime && Date.now() > parseInt(expirationTime)) {
      this.logout();
      return false;
    }

    return true;
  },

  /**
   * Get current user
   * @returns {object|null}
   */
  getCurrentUser() {
    const userStr = sessionStorage.getItem(this.SESSION_KEY);
    if (!userStr) return null;

    try {
      return JSON.parse(userStr);
    } catch (e) {
      return null;
    }
  },

  /**
   * Get auth token
   * @returns {string|null}
   */
  getToken() {
    return sessionStorage.getItem(this.TOKEN_KEY);
  },

  /**
   * Update user data
   * @param {object} updates - Updated user fields
   */
  updateUser(updates) {
    const user = this.getCurrentUser();
    if (!user) return;

    const updatedUser = { ...user, ...updates };
    sessionStorage.setItem(this.SESSION_KEY, JSON.stringify(updatedUser));
  },

  /**
   * Check session and redirect if needed
   */
  checkSession() {
    const user = this.getCurrentUser();

    // Show dashboard link if authenticated
    const dashboardLink = document.getElementById('dashboardLink');
    if (dashboardLink) {
      dashboardLink.style.display = user ? 'block' : 'none';
    }

    // Show logout button if authenticated
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
      logoutBtn.style.display = user ? 'block' : 'none';
    }

    // Show user greeting if on dashboard
    const userGreeting = document.getElementById('userGreeting');
    if (userGreeting && user) {
      userGreeting.textContent = `Hello, ${user.name}!`;
    }

    // Set up logout handler
    if (logoutBtn) {
      logoutBtn.onclick = (e) => {
        e.preventDefault();
        this.logout();
        window.location.href = 'index.html';
      };
    }
  },

  /**
   * Update UI based on auth status
   */
  updateUI() {
    const user = this.getCurrentUser();

    // Update navigation
    const dashboardLink = document.getElementById('dashboardLink');
    const logoutBtn = document.getElementById('logoutBtn');

    if (dashboardLink) {
      dashboardLink.style.display = user ? 'block' : 'none';
    }

    if (logoutBtn) {
      logoutBtn.style.display = user ? 'block' : 'none';
    }
  },

  /**
   * Generate JWT-like token for frontend use
   * @returns {string}
   */
  _generateToken() {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(
      JSON.stringify({
        user: this.getCurrentUser()?.id,
        iat: Math.floor(Date.now() / 1000),
      })
    );
    const signature = btoa('secret');
    return `${header}.${payload}.${signature}`;
  },

  /**
   * Mock login for testing
   * @param {string} email - Email address
   * @param {string} password - Password
   */
  async mockLogin(email, password) {
    // In production, this would call API.authenticateUser()
    if (!email || !password) {
      throw new Error('Email and password required');
    }

    // Mock user object
    const user = {
      id: 'USER_' + Math.random().toString(36).substr(2, 9),
      email,
      name: email.split('@')[0],
      role: email.includes('admin') ? 'admin' : 'user',
      shopName: 'My Mobile Shop',
    };

    this.login(user);
    return user;
  },

  /**
   * Mock registration
   * @param {object} data - {email, password, shopName, ...}
   */
  async mockRegister(data) {
    if (!data.email || !data.password) {
      throw new Error('Email and password required');
    }

    const user = {
      id: 'USER_' + Math.random().toString(36).substr(2, 9),
      email: data.email,
      name: data.shopName || data.email.split('@')[0],
      role: 'user',
      shopName: data.shopName,
      phone: data.phone,
    };

    this.login(user);
    return user;
  },

  /**
   * Refresh token / extend session
   */
  refreshToken() {
    const user = this.getCurrentUser();
    if (!user) return false;

    // Extend expiration by 1440 minutes (24 hours)
    const expirationTime = Date.now() + 1440 * 60 * 1000;
    sessionStorage.setItem(this.EXPIRE_KEY, expirationTime);

    return true;
  },

  /**
   * Check if user has specific role
   * @param {string} role - Role to check
   * @returns {boolean}
   */
  hasRole(role) {
    const user = this.getCurrentUser();
    return user && user.role === role;
  },

  /**
   * Check if user has specific permission
   * @param {string} permission - Permission to check
   * @returns {boolean}
   */
  hasPermission(permission) {
    const user = this.getCurrentUser();
    if (!user) return false;

    // Admin has all permissions
    if (user.role === 'admin') return true;

    // Check specific permissions
    return user.permissions && user.permissions[permission] === true;
  },
};

// Initialize authentication on page load
document.addEventListener('DOMContentLoaded', () => {
  Auth.checkSession();
});
