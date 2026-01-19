import { useReducer, useEffect, useCallback } from 'react';
import { deleteCategory, getCategories } from '../api/category.api';
import { deleteSubcategory, getSubcategoriesByCategory } from '../api/subcategory.api';
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

  const { categories, subcategories, products, loading, successMsg, errorMsg } =
    state;

  const fetchCategories = useCallback(async () => {
    dispatch({ type: ACTIONS.FETCH_CATEGORIES_START });
    try {
      const res = await getCategories();
      dispatch({
        type: ACTIONS.FETCH_CATEGORIES_SUCCESS,
        payload: res.data,
      });
    } catch (error) {
      dispatch({
        type: ACTIONS.FETCH_CATEGORIES_ERROR,
        payload: error.message || 'Failed to load categories',
      });
    }
  }, [dispatch]);

  const fetchSubcategories = useCallback(async (categoryId) => {
    dispatch({ type: ACTIONS.FETCH_SUBCATEGORIES_START });
    try {
      const res = await getSubcategoriesByCategory(categoryId);
      dispatch({
        type: ACTIONS.FETCH_SUBCATEGORIES_SUCCESS,
        payload: res.data,
      });
    } catch (error) {
      dispatch({
        type: ACTIONS.FETCH_SUBCATEGORIES_ERROR,
        payload: error.message || 'Failed to load subcategories',
      });
    }
  }, [dispatch]);

  const fetchProducts = useCallback(async (subcategoryId) => {
    dispatch({ type: ACTIONS.FETCH_PRODUCTS_START });
    try {
      const res = await getProductsBySubcategory(subcategoryId);
      dispatch({
        type: ACTIONS.FETCH_PRODUCTS_SUCCESS,
        payload: res.data,
      });
    } catch (error) {
      dispatch({
        type: ACTIONS.FETCH_PRODUCTS_ERROR,
        payload: error.message || 'Failed to load products',
      });
    }
  }, [dispatch]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const showSuccessMsg = (msg) => {
    dispatch({ type: ACTIONS.SET_SUCCESS, payload: msg });
  };

  const showErrorMsg = (msg) => {
    dispatch({ type: ACTIONS.SET_ERROR, payload: msg });
  };

  useEffect(() => {
    if (!successMsg && !errorMsg) return;

    const timer = setTimeout(() => {
      dispatch({ type: ACTIONS.CLEAR_MESSAGES });
    }, 2000);

    return () => clearTimeout(timer);
  }, [successMsg, errorMsg]);

  const handleDeleteCategory = async (id) => {
    const confirmDeleteCategory = window.confirm(
      'Are you sure you want to delete this category?\nThis action cannot be undone.',
    );
    if (!confirmDeleteCategory) return;

    try {
      await deleteCategory(id);
      fetchCategories();
      showSuccessMsg('Category deleted successfully');
    } catch (error) {
      showErrorMsg( error.message || 'Failed to delete category');
    }
  };

  const handleDeleteSubcategory = async (id) => {
    const confirmDeleteSubcategory = window.confirm(
      'Are you sure you want to delete this subcategory?\nThis action cannot be undone.',
    );
    if (!confirmDeleteSubcategory) return;

    try {
      await deleteSubcategory(id);
      fetchSubcategories();
      showSuccessMsg('Subcategory deleted successfully');
    } catch (error) {
      showErrorMsg(error.message || 'Failed to delete subcategory');
    }
  };

  const handleDeleteProduct = async (id) => {
    const confirmDeleteProduct = window.confirm(
      'Are you sure you want to delete this product?\nThis action cannot be undone.',
    );
    if (!confirmDeleteProduct) return;

    try {
      await deleteProduct(id);
      fetchProducts();
      showSuccessMsg('Product deleted successfully');
    } catch (error) {
      showErrorMsg(error.message || 'Failed to delete product');
    }
  };

  return {
    categories,
    subcategories,
    products,
    loading,
    successMsg,
    errorMsg,

    fetchCategories,
    fetchSubcategories,
    fetchProducts,

    handleDeleteCategory,
    handleDeleteSubcategory,
    handleDeleteProduct,

    showSuccessMsg,
  };
}
