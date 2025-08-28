export const logger = {
  // === 開発・デバッグ用ログ ===
  debug: (message: string): void => {
    console.log(`[DEBUG] ${message}`);
  },

  info: (message: string): void => {
    console.log(`[INFO] ${message}`);
  },

  warn: (message: string): void => {
    console.warn(`[WARN] ${message}`);
  },

  error: (message: string): void => {
    console.error(`[ERROR] ${message}`);
  },

  // === ユーザー向け出力 ===
  userError: (message: string, options?: { usage?: string; hint?: string }): void => {
    console.error(`Error: ${message}`);
    if (options?.usage) {
      console.error('Usage:');
      console.error(options.usage);
    } else if (options?.hint) {
      console.error(options.hint);
    }
  },

  userInfo: (message: string): void => {
    console.log(message);
  },
};
