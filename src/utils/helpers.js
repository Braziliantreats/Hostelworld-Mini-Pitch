export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function getRandomDelay(min = 1000, max = 5000) {
  return Math.random() * (max - min) + min;
}

export async function delayedCall(fn, delay = 2000) {
  await sleep(delay);
  const randomDelay = getRandomDelay();
  await sleep(randomDelay);
  return fn();
}

export function formatPrice(price) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(price);
}

export function formatDate(dateStr) {
  if (typeof dateStr === 'string') {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }
  return dateStr;
}

export function getDealPercentage(actualPrice, targetPrice) {
  return Math.round(((targetPrice - actualPrice) / targetPrice) * 100);
}

export function logProgress(message) {
  console.log(`[${new Date().toLocaleTimeString()}] ${message}`);
}

export function logError(message, error) {
  console.error(`[ERROR] ${message}`, error?.message || '');
}

export function isBelowTarget(price, target) {
  return price <= target;
}
