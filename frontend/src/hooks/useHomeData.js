import { useState, useReducer, useEffect } from 'react';
import { getProductsBySubcategory } from '../api/product.api';
import { getSubcategoriesByCategory } from '../api/subcategory.api';
import { getCategories } from '../api/category.api';

const initialState = {
  categories: [],
  subcategories: [],
  products: [],
  loading: {
    categories: true,
    subcategories: false,
    products: false,
  },
  error: '',
};

const ACTIONS = {
  FETCH_CATEGORIES_START: 'FETCH_CATEGORIES_START',
  FETCH_CATEGORIES_SUCCESS: 'FETCH_CATEGORIES_SUCCESS',
  FETCH_CATEGORIES_ERROR: 'FETCH_CATEGORIES_ERROR',

  FETCH_SUBCATEGORIES_START: 'FETCH_SUBCATEGORIES_START',
  FETCH_SUBCATEGORIES_SUCCESS: 'FETCH_SUBCATEGORIES_SUCCESS',
  FETCH_SUBCATEGORIES_ERROR: 'FETCH_SUBCATEGORIES_ERROR',

  FETCH_PRODUCTS_START: 'FETCH_PRODUCTS_START',
  FETCH_PRODUCTS_SUCCESS: 'FETCH_PRODUCTS_SUCCESS',
  FETCH_PRODUCTS_ERROR: 'FETCH_PRODUCTS_ERROR',

  CLEAR_ERROR: 'CLEAR_ERROR',
};

function dataReducer(state, action) {
  switch (action.type) {
    case ACTIONS.FETCH_CATEGORIES_START:
      return {
        ...state,
        loading: { ...state.loading, categories: true },
        error: '',
      };

    case ACTIONS.FETCH_CATEGORIES_SUCCESS:
      return {
        ...state,
        categories: action.payload,
        loading: { ...state.loading, categories: false },
      };

    case ACTIONS.FETCH_CATEGORIES_ERROR:
      return {
        ...state,
        loading: { ...state.loading, categories: false },
        error: action.payload,
      };

    case ACTIONS.FETCH_SUBCATEGORIES_START:
      return {
        ...state,
        loading: { ...state.loading, subcategories: true },
        products: [],
        error: '',
      };

    case ACTIONS.FETCH_SUBCATEGORIES_SUCCESS:
      return {
        ...state,
        subcategories: action.payload,
        products: [],
        loading: { ...state.loading, subcategories: false },
      };

    case ACTIONS.FETCH_SUBCATEGORIES_ERROR:
      return {
        ...state,
        loading: { ...state.loading, subcategories: false },
        error: action.payload,
      };

    case ACTIONS.FETCH_PRODUCTS_START:
      return {
        ...state,
        loading: { ...state.loading, products: true },
        error: '',
      };

    case ACTIONS.FETCH_PRODUCTS_SUCCESS:
      return {
        ...state,
        products: action.payload,
        loading: { ...state.loading, products: false },
      };

    case ACTIONS.FETCH_PRODUCTS_ERROR:
      return {
        ...state,
        loading: { ...state.loading, products: false },
        error: action.payload,
      };

    case ACTIONS.CLEAR_ERROR:
      return { ...state, error: '' };

    default:
      return state;
  }
}

export default function useHomeData() {
  const [state, dispatch] = useReducer(dataReducer, initialState);

  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState(null);

  const { categories, subcategories, products, loading, error } = state;

  // Fetch categories on page load

  useEffect(() => {
    const fetchCategories = async () => {
      dispatch({ type: ACTIONS.FETCH_CATEGORIES_START });
      try {
        const res = await getCategories();
        dispatch({
          type: ACTIONS.FETCH_CATEGORIES_SUCCESS,
          payload: res.data,
        });
      } catch {
        dispatch({
          type: ACTIONS.FETCH_CATEGORIES_ERROR,
          payload: 'Unable to load data right now. Please refresh the page.',
        });
      }
    };

    fetchCategories();
  }, []);

  // Fetch subcategories when category is selected

  useEffect(() => {
    if (!selectedCategoryId) return;

    const fetchSubcategories = async () => {
      dispatch({ type: ACTIONS.FETCH_SUBCATEGORIES_START });
      try {
        const res = await getSubcategoriesByCategory(selectedCategoryId);
        dispatch({
          type: ACTIONS.FETCH_SUBCATEGORIES_SUCCESS,
          payload: res.data,
        });
        setSelectedSubcategoryId(null);
      } catch {
        dispatch({
          type: ACTIONS.FETCH_SUBCATEGORIES_ERROR,
          payload: 'Unable to load data right now. Please refresh the page.',
        });
      }
    };

    fetchSubcategories();
  }, [selectedCategoryId]);

  // Fetch products when subcategory is selected
  useEffect(() => {
    if (!selectedSubcategoryId) return;

    const fetchProducts = async () => {
      dispatch({ type: ACTIONS.FETCH_PRODUCTS_START });
      try {
        const res = await getProductsBySubcategory(selectedSubcategoryId);
        dispatch({
          type: ACTIONS.FETCH_PRODUCTS_SUCCESS,
          payload: res.data,
        });
      } catch {
        dispatch({
          type: ACTIONS.FETCH_PRODUCTS_ERROR,
          payload: 'Unable to load data right now. Please refresh the page.',
        });
      }
    };

    fetchProducts();
  }, [selectedSubcategoryId]);

  return {
    categories,
    subcategories,
    products,
    loading,
    error,
    selectedCategoryId,
    setSelectedCategoryId,
    selectedSubcategoryId,
    setSelectedSubcategoryId,
  };
}
