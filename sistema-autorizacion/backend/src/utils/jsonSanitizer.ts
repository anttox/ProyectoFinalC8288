// src/utils/jsonSanitizer.ts
export const removeCircularReferences = (data: any): any => {
    const seen = new WeakSet();
  
    const recurse = (obj: any): any => {
      if (typeof obj !== 'object' || obj === null) return obj; // Si no es objeto, devolver el valor directamente
      if (seen.has(obj)) return undefined; // Eliminar referencias circulares
  
      seen.add(obj);
  
      return Array.isArray(obj)
        ? obj.map(recurse) // Si es un array, iterar sobre sus elementos
        : Object.keys(obj).reduce((acc, key) => {
            acc[key] = recurse(obj[key]); // Recursión sobre los valores de las claves del objeto
            return acc;
          }, {} as Record<string, any>); // Inicializar un objeto vacío para construirlo
    };
  
    return recurse(data); // Llamada inicial
  };
  