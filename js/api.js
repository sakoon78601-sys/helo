/**
 * MOBILE SHOP PRO — API WRAPPER
 * Communicates with Google Apps Script Backend
 * All requests use GET with URL query parameters
 */

const API = {
  // Google Apps Script Deployment URL
  BASE_URL: 'https://script.google.com/macros/s/AKfycbzvPULDeTjlHYS_V4qM1jyeleGzPhyieNOks079JrAkHOGW73vsu-Hdj6SuauLeDubynQ/exec',

  /**
   * Helper function to make API calls
   * @param {string} action - The action to perform
   * @param {object} params - Additional parameters
   * @returns {Promise<object>} Response from backend
   */
  async call(action, params = {}) {
    try {
      const url = new URL(this.BASE_URL);
      url.searchParams.append('action', action);

      // Add params to URL
      for (const [key, value] of Object.entries(params)) {
        url.searchParams.append(key, value);
      }

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  // ═══════════════════════════════════════════════════════════════
  // PUBLIC ENDPOINTS
  // ═══════════════════════════════════════════════════════════════

  /**
   * Get all available products
   * @param {string} coupon - Optional coupon code
   * @returns {Promise<object>}
   */
  async getProducts(coupon = '') {
    return this.call('getProducts', { coupon });
  },

  /**
   * Validate and get discount for a coupon
   * @param {string} coupon - Coupon code
   * @param {string} plan - Plan type (starter, professional, premium)
   * @returns {Promise<object>}
   */
  async validateCoupon(coupon, plan) {
    return this.call('validateCoupon', { coupon, plan });
  },

  /**
   * Check license status and validity
   * @param {string} key - License key
   * @param {string} email - Email address
   * @returns {Promise<object>}
   */
  async checkLicense(key, email) {
    return this.call('checkLicense', { key, email });
  },

  /**
   * Get license details for a user
   * @param {string} userId - User ID
   * @returns {Promise<object>}
   */
  async getUserLicenses(userId) {
    return this.call('getUserLicenses', { userId });
  },

  /**
   * Get transaction history for a user
   * @param {string} userId - User ID
   * @returns {Promise<object>}
   */
  async getUserTransactions(userId) {
    return this.call('getUserTransactions', { userId });
  },

  // ═══════════════════════════════════════════════════════════════
  // PAYMENT ENDPOINTS
  // ═══════════════════════════════════════════════════════════════

  /**
   * Initiate payment verification
   * @param {object} params - {trx, name, amount, plan, email, phone}
   * @returns {Promise<object>}
   */
  async verifyPayment(params) {
    return this.call('verify', params);
  },

  /**
   * Get payment status
   * @param {string} transactionId - Transaction ID
   * @returns {Promise<object>}
   */
  async getPaymentStatus(transactionId) {
    return this.call('getPaymentStatus', { txnid: transactionId });
  },

  // ═══════════════════════════════════════════════════════════════
  // PARTNER ENDPOINTS
  // ═══════════════════════════════════════════════════════════════

  /**
   * Register a new partner
   * @param {object} data - Partner registration data
   * @returns {Promise<object>}
   */
  async registerPartner(data) {
    return this.call('registerPartner', data);
  },

  /**
   * Get partner dashboard data
   * @param {string} partnerId - Partner ID
   * @returns {Promise<object>}
   */
  async getPartnerDashboard(partnerId) {
    return this.call('getPartnerDashboard', { partnerId });
  },

  /**
   * Get partner earnings and referrals
   * @param {string} partnerId - Partner ID
   * @returns {Promise<object>}
   */
  async getPartnerEarnings(partnerId) {
    return this.call('getPartnerEarnings', { partnerId });
  },

  /**
   * Request withdrawal
   * @param {string} partnerId - Partner ID
   * @param {number} amount - Amount to withdraw
   * @returns {Promise<object>}
   */
  async requestWithdrawal(partnerId, amount) {
    return this.call('requestWithdrawal', { partnerId, amount });
  },

  /**
   * Get withdrawal history
   * @param {string} partnerId - Partner ID
   * @returns {Promise<object>}
   */
  async getWithdrawalHistory(partnerId) {
    return this.call('getWithdrawalHistory', { partnerId });
  },

  // ═══════════════════════════════════════════════════════════════
  // ADMIN ENDPOINTS
  // ═══════════════════════════════════════════════════════════════

  /**
   * Get all users (admin only)
   * @returns {Promise<object>}
   */
  async getAllUsers() {
    return this.call('getAllUsers', {});
  },

  /**
   * Get all licenses (admin only)
   * @returns {Promise<object>}
   */
  async getAllLicenses() {
    return this.call('getAllLicenses', {});
  },

  /**
   * Generate a new license key (admin only)
   * @param {object} params - {email, plan, duration}
   * @returns {Promise<object>}
   */
  async generateLicense(params) {
    return this.call('generateLicense', params);
  },

  /**
   * Get all partners (admin only)
   * @returns {Promise<object>}
   */
  async getAllPartners() {
    return this.call('getAllPartners', {});
  },

  /**
   * Get all transactions (admin only)
   * @returns {Promise<object>}
   */
  async getAllTransactions() {
    return this.call('getAllTransactions', {});
  },

  /**
   * Approve partner registration (admin only)
   * @param {string} partnerId - Partner ID
   * @returns {Promise<object>}
   */
  async approvePartner(partnerId) {
    return this.call('approvePartnerAction', { partnerId });
  },

  /**
   * Decline partner registration (admin only)
   * @param {string} partnerId - Partner ID
   * @param {string} reason - Rejection reason
   * @returns {Promise<object>}
   */
  async declinePartner(partnerId, reason) {
    return this.call('declinePartnerAction', { partnerId, reason });
  },

  /**
   * Approve withdrawal request (admin only)
   * @param {string} withdrawalId - Withdrawal ID
   * @returns {Promise<object>}
   */
  async approveWithdrawal(withdrawalId) {
    return this.call('approveWithdrawalAction', { withdrawalId });
  },

  /**
   * Decline withdrawal request (admin only)
   * @param {string} withdrawalId - Withdrawal ID
   * @param {string} reason - Rejection reason
   * @returns {Promise<object>}
   */
  async declineWithdrawal(withdrawalId, reason) {
    return this.call('declineWithdrawalAction', { withdrawalId, reason });
  },

  /**
   * Update product details (admin only)
   * @param {object} params - Product data
   * @returns {Promise<object>}
   */
  async updateProduct(params) {
    return this.call('updateProduct', params);
  },

  /**
   * Get dashboard statistics (admin only)
   * @returns {Promise<object>}
   */
  async getDashboardStats() {
    return this.call('getDashboardStats', {});
  },

  // ═══════════════════════════════════════════════════════════════
  // UTILITY METHODS
  // ═══════════════════════════════════════════════════════════════

  /**
   * Search for a license
   * @param {string} query - Search query
   * @returns {Promise<object>}
   */
  async searchLicense(query) {
    return this.call('searchLicense', { query });
  },

  /**
   * Search for a user
   * @param {string} query - Search query
   * @returns {Promise<object>}
   */
  async searchUser(query) {
    return this.call('searchUser', { query });
  },

  /**
   * Search for a partner
   * @param {string} query - Search query
   * @returns {Promise<object>}
   */
  async searchPartner(query) {
    return this.call('searchPartner', { query });
  },

  /**
   * Refresh NayaPay OCR data
   * @returns {Promise<object>}
   */
  async refreshNayaPayOCR() {
    return this.call('refreshNayaPayOCR', {});
  },

  /**
   * Get support emails
   * @returns {Promise<object>}
   */
  async getSupportInfo() {
    return this.call('getSupportInfo', {});
  },
};

// Mock API responses for development
// Comment out when backend is ready
const API_MOCK = {
  getProducts() {
    return Promise.resolve({
      success: true,
      products: [
        {
          slug: 'starter',
          name: 'Starter',
          price: 1500,
          discount: 15,
          duration: '1 Month',
          popular: false,
        },
        {
          slug: 'professional',
          name: 'Professional',
          price: 3500,
          discount: 20,
          duration: '3 Months',
          popular: true,
        },
        {
          slug: 'premium',
          name: 'Premium',
          price: 7000,
          discount: 25,
          duration: '1 Year',
          popular: false,
        },
      ],
    });
  },

  validateCoupon() {
    return Promise.resolve({
      valid: true,
      code: 'SAVE20',
      discount_amount: 700,
      max_uses: 100,
      used: 45,
    });
  },

  checkLicense() {
    return Promise.resolve({
      valid: true,
      key: 'MSPO-XXXX-XXXX-0001',
      plan: 'Professional',
      status: 'active',
      activated: '2024-01-15',
      expiry: '2024-04-15',
      days_remaining: 60,
    });
  },

  getUserLicenses() {
    return Promise.resolve([
      {
        key: 'MSPO-XXXX-XXXX-0001',
        plan: 'Professional',
        activated: '2024-01-15',
        expiry: '2024-04-15',
      },
    ]);
  },

  getUserTransactions() {
    return Promise.resolve([
      {
        date: '2024-05-15',
        description: 'Professional License Purchase',
        amount: 2800,
        status: 'completed',
      },
    ]);
  },

  registerPartner() {
    return Promise.resolve({
      success: true,
      partner: {
        id: 'PT001',
        name: 'Test Partner',
        totalReferrals: 0,
        completedSales: 0,
        totalEarnings: 0,
        balance: 0,
        recentSales: [],
        withdrawals: [],
      },
    });
  },
};
