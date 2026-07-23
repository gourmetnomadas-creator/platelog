export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function getMealTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    breakfast: 'Breakfast',
    lunch: 'Lunch',
    dinner: 'Dinner',
    snack: 'Snack',
  };
  return labels[type] ?? type;
}

export function getWeightContextLabel(context: string): string {
  const labels: Record<string, string> = {
    whole_plate: 'Whole plate',
    one_ingredient: 'One ingredient only',
    separate_ingredients: 'Ingredients weighed separately',
  };
  return labels[context] ?? context;
}

export function formatTime(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatDate(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}

export function formatShortDate(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

export function todayISO(): string {
  const d = new Date();
  return d.toISOString().split('T')[0];
}

export function generateId(): string {
  return crypto.randomUUID?.() ?? Math.random().toString(36).substring(2, 15);
}

export const timeOfDayLabels: Record<import('@/types').TimeOfDay, string> = {
  morning: '☀️ Morning',
  midday: '🌤 Midday',
  evening: '🌇 Evening',
  night: '🌙 Night',
};
