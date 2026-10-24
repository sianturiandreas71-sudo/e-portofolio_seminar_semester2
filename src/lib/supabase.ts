// Memaksa aplikasi menggunakan data lokal bawaan portofolio
export const supabase = {
  from: () => ({
    select: () => Promise.resolve({ data: null, error: new Error('Pindah ke data lokal') }),
    insert: () => Promise.resolve({ data: null, error: new Error('Pindah ke data lokal') }),
    update: () => Promise.resolve({ data: null, error: new Error('Pindah ke data lokal') }),
    delete: () => Promise.resolve({ data: null, error: new Error('Pindah ke data lokal') }),
  }),
  auth: {
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    getSession: () => Promise.resolve({ data: { session: null }, error: null }),
  }
} as any;