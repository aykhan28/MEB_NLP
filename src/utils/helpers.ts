// UUID yerine kullanılacak basit ID üretici
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

// Tarih formatlama fonksiyonu
export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('tr-TR');
};

// Tarih string'ini Date objesine çevirme
export const parseDate = (dateString: string): Date => {
  return new Date(dateString);
};

// Örnek veri oluşturma fonksiyonları
export const generateSampleData = () => {
  // Burada örnek veriler oluşturulabilir
}; 