/**
 * MOBILE SHOP PRO — MAIN UTILITIES & HELPERS
 * Shared functions, DOM helpers, and general utilities
 */

const Utils = {
  /**
   * Format number as Pakistani Rupees
   * @param {number} amount
   * @returns {string}
   */
  formatCurrency(amount) {
    return `Rs ${amount?.toLocaleString('en-PK')}`;
  },

  /**
   * Format date to readable format
   * @param {string|Date} date
   * @returns {string}
   */
  formatDate(date) {
    return new Date(date).toLocaleDateString('en-PK', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  },

  /**
   * Format date and time
   * @param {string|Date} date
   * @returns {string}
   */
  formatDateTime(date) {
    return new Date(date).toLocaleString('en-PK', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  },

  /**
   * Calculate days until date
   * @param {string|Date} date
   * @returns {number}
   */
  daysUntil(date) {
    const target = new Date(date);
    const today = new Date();
    const diff = target - today;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  },

  /**
   * Check if date is expired
   * @param {string|Date} date
   * @returns {boolean}
   */
  isExpired(date) {
    return this.daysUntil(date) < 0;
  },

  /**
   * Generate random ID
   * @param {number} length
   * @returns {string}
   */
  generateId(length = 10) {
    return Math.random().toString(36).substr(2, length);
  },

  /**
   * Copy text to clipboard
   * @param {string} text
   * @returns {boolean}
   */
  copyToClipboard(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    const success = document.execCommand('copy');
    document.body.removeChild(textarea);
    return success;
  },

  /**
   * Show toast notification
   * @param {string} message
   * @param {string} type - 'success', 'error', 'warning', 'info'
   * @param {number} duration - Duration in ms
   */
  showToast(message, type = 'info', duration = 3000) {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    toast.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: ${this._getToastColor(type)};
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 8px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.3);
      z-index: 9999;
      animation: slideIn 0.3s ease;
    `;

    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.animation = 'slideOut 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  },

  _getToastColor(type) {
    const colors = {
      success: '#10b981',
      error: '#ef4444',
      warning: '#f59e0b',
      info: '#3b82f6',
    };
    return colors[type] || colors.info;
  },

  /**
   * Show confirmation dialog
   * @param {string} message
   * @param {function} onConfirm
   * @param {function} onCancel
   */
  confirm(message, onConfirm, onCancel) {
    const backdrop = document.createElement('div');
    backdrop.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.5);
      z-index: 2000;
      display: flex;
      align-items: center;
      justify-content: center;
    `;

    const dialog = document.createElement('div');
    dialog.style.cssText = `
      background: var(--card);
      border: 1px solid var(--border);
      padding: 2rem;
      border-radius: 14px;
      max-width: 400px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.5);
    `;

    dialog.innerHTML = `
      <p style="margin-bottom: 1.5rem; color: var(--text); font-size: 1rem;">${message}</p>
      <div style="display: flex; gap: 1rem;">
        <button id="confirmBtn" class="btn btn-primary" style="flex: 1;">Confirm</button>
        <button id="cancelBtn" class="btn btn-secondary" style="flex: 1;">Cancel</button>
      </div>
    `;

    backdrop.appendChild(dialog);
    document.body.appendChild(backdrop);

    document.getElementById('confirmBtn').onclick = () => {
      backdrop.remove();
      if (onConfirm) onConfirm();
    };

    document.getElementById('cancelBtn').onclick = () => {
      backdrop.remove();
      if (onCancel) onCancel();
    };
  },

  /**
   * Validate email
   * @param {string} email
   * @returns {boolean}
   */
  isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  },

  /**
   * Validate phone number (Pakistan)
   * @param {string} phone
   * @returns {boolean}
   */
  isValidPhone(phone) {
    const re = /^(\+92|0)?[3][0-9]{2}[0-9]{7}$/;
    return re.test(phone.replace(/-/g, ''));
  },

  /**
   * Get URL query parameter
   * @param {string} name
   * @returns {string|null}
   */
  getQueryParam(name) {
    const params = new URLSearchParams(window.location.search);
    return params.get(name);
  },

  /**
   * Get all URL query parameters
   * @returns {object}
   */
  getQueryParams() {
    const params = new URLSearchParams(window.location.search);
    const obj = {};
    for (const [key, value] of params) {
      obj[key] = value;
    }
    return obj;
  },

  /**
   * Scroll to element
   * @param {string|element} selector
   * @param {number} offset
   */
  scrollTo(selector, offset = 60) {
    const element = typeof selector === 'string'
      ? document.querySelector(selector)
      : selector;

    if (!element) return;

    window.scrollTo({
      top: element.offsetTop - offset,
      behavior: 'smooth',
    });
  },

  /**
   * Add scroll event listener to navbar
   */
  setupNavbarScroll() {
    const nav = document.getElementById('nav');
    if (!nav) return;

    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    });
  },

  /**
   * Setup mobile menu toggle
   */
  setupMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    if (!hamburger) return;

    hamburger.addEventListener('click', () => {
      const navLinks = document.querySelector('.nav-links');
      if (navLinks) {
        navLinks.style.display =
          navLinks.style.display === 'flex' ? 'none' : 'flex';
      }
    });
  },

  /**
   * Debounce function
   * @param {function} func
   * @param {number} delay
   * @returns {function}
   */
  debounce(func, delay = 300) {
    let timeoutId;
    return function (...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
  },

  /**
   * Throttle function
   * @param {function} func
   * @param {number} limit
   * @returns {function}
   */
  throttle(func, limit = 300) {
    let inThrottle;
    return function (...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  },

  /**
   * Deep clone object
   * @param {object} obj
   * @returns {object}
   */
  deepClone(obj) {
    if (obj === null || typeof obj !== 'object') return obj;
    if (obj instanceof Date) return new Date(obj.getTime());
    if (obj instanceof Array) return obj.map(item => this.deepClone(item));
    if (obj instanceof Object) {
      const clonedObj = {};
      for (const key in obj) {
        clonedObj[key] = this.deepClone(obj[key]);
      }
      return clonedObj;
    }
  },

  /**
   * Merge objects (shallow)
   * @param {...object} objs
   * @returns {object}
   */
  merge(...objs) {
    return Object.assign({}, ...objs);
  },

  /**
   * Check if element is in viewport
   * @param {element} element
   * @returns {boolean}
   */
  isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  },

  /**
   * Add CSS animations
   */
  addAnimations() {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideIn {
        from {
          transform: translateX(400px);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }

      @keyframes slideOut {
        from {
          transform: translateX(0);
          opacity: 1;
        }
        to {
          transform: translateX(400px);
          opacity: 0;
        }
      }

      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }

      @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  },
};

// Initialize utilities on page load
document.addEventListener('DOMContentLoaded', () => {
  Utils.setupNavbarScroll();
  Utils.setupMobileMenu();
  Utils.addAnimations();
});
