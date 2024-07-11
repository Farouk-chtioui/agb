import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  fetchMagasins as fetchMagasinsAPI,
  addMagasin as addMagasinAPI,
  deleteMagasin as deleteMagasinAPI,
  modifyMagasin as modifyMagasinAPI,
  searchMagasins as searchMagasinsAPI,
} from '../../api/marketService';

export const fetchMagasins = createAsyncThunk('magasins/fetchMagasins', async (page) => {
  const response = await fetchMagasinsAPI(page);
  return response;
});

export const addMagasin = createAsyncThunk('magasins/addMagasin', async (magasin) => {
  const response = await addMagasinAPI(magasin);
  return response;
});

export const deleteMagasin = createAsyncThunk('magasins/deleteMagasin', async (id) => {
  await deleteMagasinAPI(id);
  return id;
});

export const modifyMagasin = createAsyncThunk('magasins/modifyMagasin', async (magasin) => {
  const response = await modifyMagasinAPI(magasin);
  return response;
});

export const searchMagasins = createAsyncThunk('magasins/searchMagasins', async (searchTerm) => {
  const response = await searchMagasinsAPI(searchTerm);
  return response;
});

const magasinSlice = createSlice({
  name: 'magasins',
  initialState: {
    items: [],
    loading: false,
    error: null,
    postalCodes: {},
  },
  reducers: {
    setPostalCode: (state, action) => {
      const { marketId, postalCode } = action.payload;
      state.postalCodes[marketId] = postalCode;  // Link postal code with market ID
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMagasins.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMagasins.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchMagasins.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addMagasin.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(deleteMagasin.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item._id !== action.payload);
      })
      .addCase(modifyMagasin.fulfilled, (state, action) => {
        const index = state.items.findIndex((item) => item._id === action.payload._id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(searchMagasins.fulfilled, (state, action) => {
        state.items = action.payload;
      });
  },
});
export const { setPostalCode } = magasinSlice.actions;

export default magasinSlice.reducer;
