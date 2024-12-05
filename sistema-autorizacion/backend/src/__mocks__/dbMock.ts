const dbMock = {
  query: jest.fn((query: string, params: any[]) => {
    if (query.includes('SELECT')) {
      return { rows: [{ id: 1, nombre: 'Test User', rol: 'Administrador' }] };
    } else if (query.includes('INSERT')) {
      return { rowCount: 1 };
    } else if (query.includes('UPDATE')) {
      return { rowCount: 1 };
    }
    return { rows: [] };
  }),
};

export default dbMock;
