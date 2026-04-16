export function transformRecordToOption<T extends Record<string, App.I18n.I18nKey>>(record: T) {
  return Object.entries(record).map(([value, label]) => ({
    value,
    label
  }));
}

export function translateOptions<T extends { value: string; label: App.I18n.I18nKey }>(
  options: T[],
  $t: (key: App.I18n.I18nKey) => string
): Array<{ value: string; label: string }> {
  return options.map(option => ({
    value: option.value,
    label: $t(option.label)
  }));
}

export function toggleHtmlClass(className: string) {
  function add() {
    document.documentElement.classList.add(className);
  }

  function remove() {
    document.documentElement.classList.remove(className);
  }

  return {
    add,
    remove
  };
}

export function getDateFormat(date: Date, format: string): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return format
    .replace('YYYY', String(year))
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds);
}

export function getDynamicProps<T extends Record<string, unknown>, U extends keyof T>(obj: T, keys: U[]): Pick<T, U> {
  const result = {} as Pick<T, U>;
  keys.forEach(key => {
    if (key in obj) {
      result[key] = obj[key];
    }
  });
  return result;
}

export function isUrl(path: string): boolean {
  const reg = /^(http|https):\/\/.*/;
  return reg.test(path);
}

export function getFileExtension(filename: string): string {
  const parts = filename.split('.');
  return parts.length > 1 ? parts[parts.length - 1] : '';
}

export function formatAmount(amount: number, decimals = 2): string {
  return amount.toFixed(decimals);
}

export function formatPercentage(value: number, decimals = 2): string {
  return `${(value * 100).toFixed(decimals)}%`;
}

export function debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  return function debounced(this: any, ...args: Parameters<T>) {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      func.apply(this, args);
    }, wait);
  };
}

export function throttle<T extends (...args: any[]) => any>(func: T, limit: number): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return function throttled(this: any, ...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}
