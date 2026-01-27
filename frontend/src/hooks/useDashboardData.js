import { useReducer, useEffect, useCallback, useRef } from 'react';
import { deleteCategory, getCategories } from '../api/category.api';
import {
  deleteSubcategory,
  getSubcategoriesByCategory,
} from '../api/subcategory.api';
import { deleteProduct, getProductsBySubcategory } from '../api/product.api';

const initialState = {
  categories: [],
  subcategories: [],
  products: [],
  loading: {
    categories: true,
    subcategories: false,
    products: false,
  },
  successMsg: '',
  errorMsg: '',
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

  SET_SUCCESS: 'SET_SUCCESS',
  SET_ERROR: 'SET_ERROR',
  CLEAR_MESSAGES: 'CLEAR_MESSAGES',
};

function dataReducer(state, action) {
  switch (action.type) {
    case ACTIONS.FETCH_CATEGORIES_START:
      return {
        ...state,
        loading: { ...state.loading, categories: true },
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
        errorMsg: action.payload,
      };

    case ACTIONS.FETCH_SUBCATEGORIES_START:
      return {
        ...state,
        subcategories: [],
        products: [],
        loading: { ...state.loading, subcategories: true },
      };

    case ACTIONS.FETCH_SUBCATEGORIES_SUCCESS:
      return {
        ...state,
        subcategories: action.payload,
        loading: { ...state.loading, subcategories: false },
      };

    case ACTIONS.FETCH_SUBCATEGORIES_ERROR:
      return {
        ...state,
        loading: { ...state.loading, subcategories: false },
        errorMsg: action.payload,
      };

    case ACTIONS.FETCH_PRODUCTS_START:
      return {
        ...state,
        loading: { ...state.loading, products: true },
        products: [],
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
        errorMsg: action.payload,
      };

    case ACTIONS.SET_SUCCESS:
      return {
        ...state,
        successMsg: action.payload,
        errorMsg: '',
      };

    case ACTIONS.SET_ERROR:
      return {
        ...state,
        errorMsg: action.payload,
        successMsg: '',
      };

    case ACTIONS.CLEAR_MESSAGES:
      return {
        ...state,
        successMsg: '',
        errorMsg: '',
      };

    default:
      return state;
  }
}

export default function useDashboardData() {
  const [state, dispatch] = useReducer(dataReducer, initialState);

  const activeCategoryId = useRef(null);
  const activeSubcategoryId = useRef(null);

  const setSuccess = (msg) => dispatch({
    type: ACTIONS.SET_SUCCESS, payload: msg
  });

  const setError = (msg) => dispatch({
    type: ACTIONS.SET_ERROR, payload: msg
  });

  const fetchCategories = useCallback(async () => {
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
        payload: 'Unable to load categories. Please try again.',
      });
    }
  }, []);

  const fetchSubcategories = useCallback(async (categoryId) => {
    activeCategoryId.current = categoryId;
    dispatch({ type: ACTIONS.FETCH_SUBCATEGORIES_START });
    try {
      const res = await getSubcategoriesByCategory(categoryId);
      dispatch({
        type: ACTIONS.FETCH_SUBCATEGORIES_SUCCESS,
        payload: res.data,
      });
    } catch {
      dispatch({
        type: ACTIONS.FETCH_SUBCATEGORIES_ERROR,
        payload: 'Unable to load subcategories. Please try again.',
      });
    }
  }, []);

  const fetchProducts = useCallback(async (subcategoryId) => {
    activeSubcategoryId.current = subcategoryId;
    dispatch({ type: ACTIONS.FETCH_PRODUCTS_START });
    try {
      const res = await getProductsBySubcategory(subcategoryId);
      dispatch({
        type: ACTIONS.FETCH_PRODUCTS_SUCCESS,
        payload: res.data,
      });
    } catch {
      dispatch({
        type: ACTIONS.FETCH_PRODUCTS_ERROR,
        payload: 'Unable to load products. Please try again.',
      });
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    if  (state.successMsg || state.errorMsg) {
      const timer = setTimeout(
        () => dispatch({
          type: ACTIONS.CLEAR_MESSAGES
        }),
        3000
      );
      return () => clearTimeout(timer);
    }
  }, [state.successMsg, state.errorMsg]);

  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Delete this category?')) return;

    try {
      await deleteCategory(id);
      setSuccess('Category deleted successfully.');
      fetchCategories();
    } catch {
      setError('Failed to delete category.');
    }
  };

  const handleDeleteSubcategory = async (id) => {
    if (!window.confirm('Delete this subcategory?')) return;

    try {
      await deleteSubcategory(id);
      setSuccess("Subcategory deleted successfully.");
      if (activeCategoryId.current) {
        fetchSubcategories(activeCategoryId.current);
      }
    } catch {
      setError('Failed to delete subcategory.');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Delete this product?')) return;

    try {
      await deleteProduct(id);
      setSuccess('Product deleted successfully.');
      if (activeSubcategoryId.current) {
        fetchProducts(activeSubcategoryId.current);
      }
    } catch {
      setError('Failed to delete product.');
    }
  };

  return {
    ...state,
    fetchCategories,
    fetchSubcategories,
    fetchProducts,
    handleDeleteCategory,
    handleDeleteSubcategory,
    handleDeleteProduct,
  };
}
