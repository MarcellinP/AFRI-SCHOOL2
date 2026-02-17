/**
 * TokenManager - Handles JWT access token storage and retrieval
 * 
 * Strategy:
 * - Access Token: Stored in memory (RAM) - Fast, secure against XSS
 * - Refresh Token: httpOnly cookie - Secure against XSS, auto-sent by browser
 * - Never store sensitive tokens in localStorage
 */

export interface ITokenData {
  accessToken: string;
  expiresAt: number; // Timestamp when token expires
}

class TokenManager {
  private static accessTokenData: ITokenData | null = null;
  private static refreshTimeout: NodeJS.Timeout | null = null;

  /**
   * Set access token in memory
   * Access tokens are short-lived (15-30 minutes)
   */
  static setAccessToken(token: string, expiresIn: number = 15 * 60 * 1000): void {
    this.accessTokenData = {
      accessToken: token,
      expiresAt: Date.now() + expiresIn,
    };
  }

  /**
   * Get access token from memory
   * Returns null if token doesn't exist or has expired
   */
  static getAccessToken(): string | null {
    if (!this.accessTokenData) {
      return null;
    }

    // Check if token has expired
    if (Date.now() > this.accessTokenData.expiresAt) {
      this.clearAccessToken();
      return null;
    }

    return this.accessTokenData.accessToken;
  }

  /**
   * Check if access token exists and is not expired
   */
  static hasValidAccessToken(): boolean {
    return this.getAccessToken() !== null;
  }

  /**
   * Get time until token expires (in milliseconds)
   * Useful for scheduling automatic refresh
   */
  static getTimeUntilExpiry(): number {
    if (!this.accessTokenData) {
      return 0;
    }

    const timeUntilExpiry = this.accessTokenData.expiresAt - Date.now();
    return timeUntilExpiry > 0 ? timeUntilExpiry : 0;
  }

  /**
   * Clear access token from memory
   */
  static clearAccessToken(): void {
    this.accessTokenData = null;
    this.clearRefreshSchedule();
  }

  /**
   * Decode token (without verification - for client-side use)
   * DO NOT use this for security decisions on the backend
   */
  static decodeToken(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );

      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Failed to decode token:', error);
      return null;
    }
  }

  /**
   * Get user info from current access token
   */
  static getUserFromToken(): any {
    const token = this.getAccessToken();
    if (!token) {
      return null;
    }

    return this.decodeToken(token);
  }

  /**
   * Schedule automatic token refresh before expiry
   * This prevents token expiry during active user sessions
   */
  static scheduleRefresh(
    onRefresh: () => Promise<void>,
    bufferTime: number = 1 * 60 * 1000 // Refresh 1 minute before expiry
  ): void {
    // Clear any existing scheduled refresh
    this.clearRefreshSchedule();

    if (!this.accessTokenData) {
      return;
    }

    const timeUntilExpiry = this.getTimeUntilExpiry();
    const timeUntilRefresh = timeUntilExpiry - bufferTime;

    if (timeUntilRefresh > 0) {
      this.refreshTimeout = setTimeout(async () => {
        try {
          await onRefresh();
          // Schedule next refresh after new token is obtained
          this.scheduleRefresh(onRefresh, bufferTime);
        } catch (error) {
          console.error('Automatic token refresh failed:', error);
        }
      }, timeUntilRefresh);
    }
  }

  /**
   * Clear scheduled token refresh
   */
  static clearRefreshSchedule(): void {
    if (this.refreshTimeout) {
      clearTimeout(this.refreshTimeout);
      this.refreshTimeout = null;
    }
  }

  /**
   * Reset all token data (logout scenario)
   */
  static clear(): void {
    this.clearAccessToken();
  }

  /**
   * Get token information (for debugging/development)
   */
  static getTokenInfo(): {
    hasToken: boolean;
    isExpired: boolean;
    expiresAt: string | null;
    timeUntilExpiry: number;
  } {
    return {
      hasToken: this.accessTokenData !== null,
      isExpired: this.accessTokenData ? Date.now() > this.accessTokenData.expiresAt : false,
      expiresAt: this.accessTokenData
        ? new Date(this.accessTokenData.expiresAt).toISOString()
        : null,
      timeUntilExpiry: this.getTimeUntilExpiry(),
    };
  }
}

export default TokenManager;
