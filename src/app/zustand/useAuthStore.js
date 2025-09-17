import { create } from 'zustand'

export const useAuthStore = create((set) => ({
    authDetails: '',
    updateAuthdetails: (details) => set({authDetails: details}), updateAuthName: (name) => set({authName: name})
 }))
 