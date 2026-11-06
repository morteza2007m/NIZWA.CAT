import React, { useEffect, useMemo, useState } from 'react'
import {
  Search, ShoppingBag, Menu, X, Instagram, MessageCircle,
  ChevronDown, Plus, Minus, ArrowUpRight, PawPrint,
  LogIn, LogOut, Package, Tags, ImagePlus, Trash2,
  Edit3, Check, AlertCircle, Truck, ShieldCheck,
  Headphones, Sparkles, Bone, Heart, ShoppingBasket,
  Loader2, RefreshCw, ClipboardList
} from 'lucide-react'
import { isSupabaseConfigured, supabase } from './supabase.js'

const WA = (import.meta.env.VITE_WHATSAPP_NUMBER || '96871394358').replace(/\D/g, '')
const NO_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='900' height='700' viewBox='0 0 900 700'%3E%3Crect width='900' height='700' fill='%23f1eee5'/%3E%3Cg fill='none' stroke='%23b6b09f' stroke-width='12' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='300' y='190' width='300' height='270' rx='28'/%3E%3Cpath d='M360 390l75-80 55 55 45-48 55 73'/%3E%3Ccircle cx='390' cy='260' r='22'/%3E%3C/g%3E%3Ctext x='450' y='540' text-anchor='middle' font-family='Arial,sans-serif' font-size='30' fill='%23817b6d'%3ENo image available%3C/text%3E%3C/svg%3E"

const translations = {
  ar: {
    announcement: 'توصيل لجميع ولايات سلطنة عُمان',
    home: 'الرئيسية', shop: 'المتجر', about: 'من نحن', contact: 'تواصل معنا',
    search: 'ابحث عن المنتجات...', categories: 'تسوق حسب الفئة',
    featured: 'منتجات مميزة', allProducts: 'جميع المنتجات', viewAll: 'عرض الكل',
    add: 'أضف إلى السلة', details: 'التفاصيل', cart: 'سلة التسوق',
    emptyCart: 'سلتك فارغة حالياً', continue: 'تابع التسوق', total: 'الإجمالي',
    checkout: 'إتمام الطلب عبر واتساب', name: 'الاسم', phone: 'رقم الهاتف',
    address: 'العنوان والولاية', notes: 'ملاحظات إضافية', sendOrder: 'إرسال الطلب',
    quantity: 'الكمية', delivery: 'توصيل لجميع الولايات',
    quality: 'منتجات مختارة بعناية', support: 'نحن هنا لمساعدتك',
    aboutTitle: 'كل ما يحتاجه قطك في مكان واحد',
    aboutText: 'في نزوى كت نوفر مستلزمات القطط المختارة بعناية، مع خدمة توصيل إلى جميع أنحاء سلطنة عُمان.',
    admin: 'لوحة الإدارة', login: 'تسجيل دخول المدير', email: 'البريد الإلكتروني',
    password: 'كلمة المرور', signIn: 'دخول', logout: 'تسجيل الخروج',
    products: 'المنتجات', manageCategories: 'إدارة الفئات',
    addProduct: 'إضافة منتج', editProduct: 'تعديل المنتج',
    productNameEn: 'اسم المنتج بالإنجليزية', productNameAr: 'اسم المنتج بالعربية',
    descriptionEn: 'الوصف بالإنجليزية', descriptionAr: 'الوصف بالعربية',
    price: 'السعر (ر.ع)', category: 'الفئة', image: 'صورة المنتج',
    featuredProduct: 'منتج مميز', save: 'حفظ', cancel: 'إلغاء', delete: 'حذف',
    addCategory: 'إضافة فئة', categoryNameEn: 'اسم الفئة بالإنجليزية',
    categoryNameAr: 'اسم الفئة بالعربية', loading: 'جارٍ التحميل...',
    noProducts: 'لا توجد منتجات حالياً', noResults: 'لم يتم العثور على منتجات',
    added: 'تمت الإضافة إلى السلة', saved: 'تم الحفظ بنجاح',
    deleted: 'تم الحذف بنجاح', loginError: 'تعذر تسجيل الدخول. تحقق من البيانات.',
    setup: 'يرجى إعداد اتصال Supabase أولاً.', required: 'يرجى تعبئة الحقول المطلوبة.',
    deleteConfirm: 'هل أنت متأكد من حذف هذا المنتج؟',
    deleteCategoryConfirm: 'هل أنت متأكد من حذف هذه الفئة؟',
    categoryInUse: 'لا يمكن حذف هذه الفئة لأنها مرتبطة بمنتجات.',
    uploadError: 'تعذر رفع الصورة. تحقق من إعدادات مساحة التخزين.',
    invalidImage: 'يرجى اختيار صورة بصيغة JPG أو PNG أو WEBP أو GIF وبحجم لا يتجاوز 5 ميجابايت.',
    invalidPrice: 'يرجى إدخال سعر صحيح أكبر من أو يساوي صفر.',
    storeError: 'تعذر تحميل بيانات المتجر.',
    adminHint: 'سجل الدخول بحساب المدير لإدارة المنتجات والفئات.',
    orderIntro: 'مرحباً، أود تأكيد الطلب التالي:',
    orderName: 'الاسم', orderPhone: 'الهاتف', orderAddress: 'العنوان',
    orderNotes: 'ملاحظات', orderTotal: 'الإجمالي', currency: 'ر.ع',
    categoryAll: 'الكل', close: 'إغلاق', remove: 'إزالة',
    imageMissing: 'الصورة غير متوفرة',
    orders: 'الطلبات', orderNumber: 'رقم الطلب', orderDate: 'تاريخ الطلب',
    orderStatus: 'حالة الطلب', customerDetails: 'بيانات العميل', orderItems: 'المنتجات',
    noOrders: 'لا توجد طلبات حتى الآن', loadingOrders: 'جارٍ تحميل الطلبات...',
    orderSaved: 'تم حفظ الطلب. سيتم فتح واتساب الآن.', orderFailed: 'تعذر حفظ الطلب. لم يتم إرسال الطلب إلى واتساب.',
    statuses: { new: 'جديد', confirmed: 'تم التأكيد', shipped: 'تم الشحن', completed: 'مكتمل', cancelled: 'ملغي' }
  },
  en: {
    announcement: 'Delivery available across all Oman',
    home: 'Home', shop: 'Shop', about: 'About', contact: 'Contact',
    search: 'Search products...', categories: 'Shop by category',
    featured: 'Featured products', allProducts: 'All products', viewAll: 'View all',
    add: 'Add to cart', details: 'Details', cart: 'Shopping cart',
    emptyCart: 'Your cart is currently empty', continue: 'Continue shopping',
    total: 'Total', checkout: 'Checkout via WhatsApp', name: 'Name',
    phone: 'Phone number', address: 'Address and wilayat',
    notes: 'Additional notes', sendOrder: 'Send order', quantity: 'Quantity',
    delivery: 'Delivery across Oman', quality: 'Carefully selected products',
    support: 'We are here to help',
    aboutTitle: 'Everything your cat needs in one place',
    aboutText: 'NIZWA CAT offers carefully selected cat supplies with delivery throughout the Sultanate of Oman.',
    admin: 'Admin panel', login: 'Admin login', email: 'Email',
    password: 'Password', signIn: 'Sign in', logout: 'Log out',
    products: 'Products', manageCategories: 'Manage categories',
    addProduct: 'Add product', editProduct: 'Edit product',
    productNameEn: 'Product name in English', productNameAr: 'Product name in Arabic',
    descriptionEn: 'Description in English', descriptionAr: 'Description in Arabic',
    price: 'Price (OMR)', category: 'Category', image: 'Product image',
    featuredProduct: 'Featured product', save: 'Save', cancel: 'Cancel',
    delete: 'Delete', addCategory: 'Add category',
    categoryNameEn: 'Category name in English', categoryNameAr: 'Category name in Arabic',
    loading: 'Loading...', noProducts: 'No products available yet',
    noResults: 'No products found', added: 'Added to cart',
    saved: 'Saved successfully', deleted: 'Deleted successfully',
    loginError: 'Login failed. Please check your details.',
    setup: 'Please configure Supabase first.',
    required: 'Please fill in the required fields.',
    deleteConfirm: 'Are you sure you want to delete this product?',
    deleteCategoryConfirm: 'Are you sure you want to delete this category?',
    categoryInUse: 'This category cannot be deleted because products use it.',
    uploadError: 'Image upload failed. Check your storage configuration.',
    invalidImage: 'Choose a JPG, PNG, WEBP or GIF image no larger than 5 MB.',
    invalidPrice: 'Enter a valid price greater than or equal to zero.',
    storeError: 'Could not load store data.',
    adminHint: 'Sign in with your admin account to manage products and categories.',
    orderIntro: 'Hello, I would like to place the following order:',
    orderName: 'Name', orderPhone: 'Phone', orderAddress: 'Address',
    orderNotes: 'Notes', orderTotal: 'Total', currency: 'OMR',
    categoryAll: 'All', close: 'Close', remove: 'Remove',
    imageMissing: 'Image unavailable',
    orders: 'Orders', orderNumber: 'Order ID', orderDate: 'Order date',
    orderStatus: 'Order status', customerDetails: 'Customer details', orderItems: 'Items',
    noOrders: 'No orders yet', loadingOrders: 'Loading orders...',
    orderSaved: 'Order saved. WhatsApp will open now.', orderFailed: 'Could not save the order. It was not sent to WhatsApp.',
    statuses: { new: 'New', confirmed: 'Confirmed', shipped: 'Shipped', completed: 'Completed', cancelled: 'Cancelled' }
  }
}

function money(value, lang) {
  const amount = Number(value || 0).toFixed(3)
  return `${amount} ${lang === 'ar' ? 'ر.ع' : 'OMR'}`
}

function productTitle(product, lang) {
  return lang === 'ar'
    ? (product.name_ar || product.name_en || '')
    : (product.name_en || product.name_ar || '')
}

function productDescription(product, lang) {
  return lang === 'ar'
    ? (product.description_ar || product.description_en || '')
    : (product.description_en || product.description_ar || '')
}

function categoryTitle(category, lang) {
  return lang === 'ar'
    ? (category.name_ar || category.name_en || '')
    : (category.name_en || category.name_ar || '')
}

function IconButton({ onClick, label, children, className = '' }) {
  return (
    <button
      type="button"
      className={`icon-button ${className}`}
      onClick={onClick}
      aria-label={label}
      title={label}
    >
      {children}
    </button>
  )
}

export default function App() {
  const [lang, setLang] = useState('ar')
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [activeCategory, setActiveCategory] = useState('all')
  const [search, setSearch] = useState('')
  const [cart, setCart] = useState([])
  const [cartOpen, setCartOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [adminOpen, setAdminOpen] = useState(false)
  const [adminTab, setAdminTab] = useState('products')
  const [orders, setOrders] = useState([])
  const [ordersLoading, setOrdersLoading] = useState(false)
  const [ordersError, setOrdersError] = useState('')
  const [session, setSession] = useState(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({
    name_en: '', name_ar: '', description_en: '', description_ar: '',
    price: '', category_id: '', image_url: '', featured: false
  })
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState('')
  const [categoryForm, setCategoryForm] = useState({ name_en: '', name_ar: '' })
  const [customer, setCustomer] = useState({ name: '', phone: '', address: '', notes: '' })
  const [notice, setNotice] = useState('')
  const [loading, setLoading] = useState(Boolean(isSupabaseConfigured))
  const [saving, setSaving] = useState(false)
  const [storeError, setStoreError] = useState('')

  const t = translations[lang]
  const rtl = lang === 'ar'

  useEffect(() => {
    if (!imageFile) {
      setImagePreview('')
      return undefined
    }
    const objectUrl = URL.createObjectURL(imageFile)
    setImagePreview(objectUrl)
    return () => URL.revokeObjectURL(objectUrl)
  }, [imageFile])

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setStoreError(translations.ar.setup)
      setLoading(false)
      return undefined
    }

    let mounted = true
    const initialize = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()
        if (error) throw error
        if (mounted) setSession(data?.session || null)
        await loadStore(mounted)
      } catch (error) {
        console.error('Initialization error:', error)
        if (mounted) {
          setProducts([])
          setCategories([])
          setStoreError(translations.ar.storeError)
          setLoading(false)
        }
      }
    }
    initialize()

    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (mounted) setSession(nextSession)
    })

    return () => {
      mounted = false
      listener?.subscription?.unsubscribe()
    }
  }, [])

  async function loadStore(mounted = true) {
    if (!isSupabaseConfigured || !supabase) {
      if (mounted) {
        setProducts([])
        setCategories([])
        setStoreError(translations[lang].setup)
        setLoading(false)
      }
      return
    }

    setLoading(true)
    setStoreError('')
    try {
      const [productResult, categoryResult] = await Promise.all([
        supabase.from('products').select('*').order('created_at', { ascending: false }),
        supabase.from('categories').select('*').order('name_en', { ascending: true })
      ])
      if (productResult.error) throw productResult.error
      if (categoryResult.error) throw categoryResult.error
      if (mounted) {
        setProducts(Array.isArray(productResult.data) ? productResult.data : [])
        setCategories(Array.isArray(categoryResult.data) ? categoryResult.data : [])
        setStoreError('')
      }
    } catch (error) {
      console.error('Store loading error:', error)
      if (mounted) {
        setProducts([])
        setCategories([])
        setStoreError(translations[lang].storeError)
      }
    } finally {
      if (mounted) setLoading(false)
    }
  }

  useEffect(() => {
    if (!notice) return undefined
    const timeout = setTimeout(() => setNotice(''), 3500)
    return () => clearTimeout(timeout)
  }, [notice])

  const filteredProducts = useMemo(() => {
    const term = search.trim().toLowerCase()
    return products.filter(product => {
      const matchesCategory = activeCategory === 'all' ||
        String(product.category_id || '') === String(activeCategory)
      const searchable = [
        product.name_en, product.name_ar,
        product.description_en, product.description_ar
      ].filter(Boolean).join(' ').toLowerCase()
      return matchesCategory && (!term || searchable.includes(term))
    })
  }, [products, activeCategory, search])

  const featuredProducts = useMemo(
    () => products.filter(product => product.featured).slice(0, 8),
    [products]
  )
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)
  const cartTotal = cart.reduce(
    (sum, item) => sum + Number(item.price || 0) * item.quantity, 0
  )

  function addToCart(product) {
    setCart(current => {
      const found = current.find(item => item.id === product.id)
      if (found) return current.map(item =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      )
      return [...current, { ...product, quantity: 1 }]
    })
    setNotice(t.added)
  }

  function changeQuantity(productId, amount) {
    setCart(current => current
      .map(item => item.id === productId
        ? { ...item, quantity: item.quantity + amount } : item)
      .filter(item => item.quantity > 0)
    )
  }

  function removeFromCart(productId) {
    setCart(current => current.filter(item => item.id !== productId))
  }

  async function sendWhatsAppOrder() {
    if (!cart.length) {
      setNotice(t.emptyCart)
      return
    }
    if (!customer.name.trim() || !customer.phone.trim() || !customer.address.trim()) {
      setNotice(t.required)
      return
    }
    if (!supabase || !isSupabaseConfigured || saving) {
      setNotice(t.setup)
      return
    }

    setSaving(true)
    try {
      const rpcItems = cart.map(item => ({
        product_id: item.id,
        quantity: item.quantity
      }))
      const { data, error } = await supabase.rpc('create_store_order', {
        p_customer_name: customer.name.trim(),
        p_customer_phone: customer.phone.trim(),
        p_customer_address: customer.address.trim(),
        p_customer_notes: customer.notes.trim(),
        p_language: lang,
        p_items: rpcItems
      })
      if (error) throw error

      const savedOrder = Array.isArray(data) ? data[0] : data
      const orderId = savedOrder?.order_id
      const savedTotal = savedOrder?.order_total
      if (!orderId) throw new Error('Order was saved without a returned order ID.')

      const lines = cart.map(item =>
        `• ${productTitle(item, lang)} × ${item.quantity} — ${money(Number(item.price || 0) * item.quantity, lang)}`
      )
      const message = [
        t.orderIntro,
        `${t.orderNumber}: ${orderId}`,
        '', ...lines, '',
        `${t.orderTotal}: ${money(savedTotal, lang)}`, '',
        `${t.orderName}: ${customer.name}`,
        `${t.orderPhone}: ${customer.phone}`,
        `${t.orderAddress}: ${customer.address}`,
        customer.notes ? `${t.orderNotes}: ${customer.notes}` : ''
      ].filter(Boolean).join('\n')
      const url = `https://wa.me/${WA}?text=${encodeURIComponent(message)}`

      setCart([])
      setCustomer({ name: '', phone: '', address: '', notes: '' })
      setCartOpen(false)
      setNotice(t.orderSaved)
      // Open WhatsApp in the same tab so the browser Back button returns to the store.
      window.location.assign(url)
    } catch (error) {
      console.error('Create order error:', error)
      setNotice(`${t.orderFailed} ${error?.message || ''}`)
    } finally {
      setSaving(false)
    }
  }

  async function loadOrders() {
    if (!supabase || !session) return
    setOrdersLoading(true)
    setOrdersError('')
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) {
      console.error('Load orders error:', error)
      setOrdersError(error.message)
      setOrders([])
    } else {
      setOrders(Array.isArray(data) ? data : [])
    }
    setOrdersLoading(false)
  }

  async function updateOrderStatus(orderId, status) {
    if (!supabase || !session) return
    const previousOrders = orders
    setOrders(current => current.map(order =>
      order.id === orderId ? { ...order, status } : order
    ))
    const { error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId)
    if (error) {
      setOrders(previousOrders)
      setNotice(error.message)
      return
    }
    setNotice(t.saved)
  }

  async function handleLogin(event) {
    event.preventDefault()
    if (!supabase || !isSupabaseConfigured) {
      setNotice(t.setup)
      return
    }
    setSaving(true)
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(), password
    })
    setSaving(false)
    if (error) {
      setNotice(t.loginError)
      return
    }
    setSession(data.session)
    setPassword('')
    setNotice(t.saved)
  }

  async function handleLogout() {
    if (supabase) await supabase.auth.signOut()
    setSession(null)
    setAdminOpen(false)
  }

  function startNewProduct() {
    setEditing(null)
    setImageFile(null)
    setForm({
      name_en: '', name_ar: '', description_en: '', description_ar: '',
      price: '', category_id: categories[0]?.id || '',
      image_url: '', featured: false
    })
    setAdminTab('products')
  }

  function startEditProduct(product) {
    setEditing(product)
    setImageFile(null)
    setForm({
      name_en: product.name_en || '', name_ar: product.name_ar || '',
      description_en: product.description_en || '',
      description_ar: product.description_ar || '',
      price: product.price ?? '', category_id: product.category_id || '',
      image_url: product.image_url || '', featured: Boolean(product.featured)
    })
    setAdminTab('products')
  }

  async function uploadProductImage() {
    if (!imageFile) return form.image_url
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!allowedTypes.includes(imageFile.type) || imageFile.size > 5 * 1024 * 1024) {
      throw new Error(t.invalidImage)
    }
    const extensionByType = {
      'image/jpeg': 'jpg', 'image/png': 'png',
      'image/webp': 'webp', 'image/gif': 'gif'
    }
    const extension = extensionByType[imageFile.type]
    const path = `products/${Date.now()}-${Math.random().toString(36).slice(2)}.${extension}`
    const { error } = await supabase.storage
      .from('product-images')
      .upload(path, imageFile, {
        upsert: false, contentType: imageFile.type, cacheControl: '3600'
      })
    if (error) throw error
    const { data } = supabase.storage.from('product-images').getPublicUrl(path)
    if (!data?.publicUrl) throw new Error(t.uploadError)
    return data.publicUrl
  }

  async function saveProduct(event) {
    event.preventDefault()
    if (!supabase || !session) {
      setNotice(t.setup)
      return
    }
    if (!form.name_en.trim() && !form.name_ar.trim()) {
      setNotice(t.required)
      return
    }
    const price = Number(form.price)
    if (form.price === '' || !Number.isFinite(price) || price < 0) {
      setNotice(t.invalidPrice)
      return
    }

    setSaving(true)
    try {
      const imageUrl = imageFile ? await uploadProductImage() : form.image_url
      const payload = {
        name_en: form.name_en.trim(), name_ar: form.name_ar.trim(),
        description_en: form.description_en.trim(),
        description_ar: form.description_ar.trim(),
        price, category_id: form.category_id || null,
        image_url: imageUrl || null, featured: Boolean(form.featured)
      }
      let result
      if (editing) {
        result = await supabase.from('products').update(payload).eq('id', editing.id)
      } else {
        result = await supabase.from('products').insert(payload)
      }
      if (result.error) throw result.error
      await loadStore()
      startNewProduct()
      setNotice(t.saved)
    } catch (error) {
      console.error('Save product error:', error)
      setNotice(error?.message || t.uploadError)
    } finally {
      setSaving(false)
    }
  }

  async function deleteProduct(product) {
    if (!window.confirm(t.deleteConfirm)) return
    if (!supabase || !session) return
    const { error } = await supabase.from('products').delete().eq('id', product.id)
    if (error) {
      setNotice(error.message)
      return
    }
    await loadStore()
    setNotice(t.deleted)
  }

  async function addCategory(event) {
    event.preventDefault()
    if (!supabase || !session) return
    if (!categoryForm.name_en.trim() && !categoryForm.name_ar.trim()) {
      setNotice(t.required)
      return
    }
    setSaving(true)
    const { error } = await supabase.from('categories').insert({
      name_en: categoryForm.name_en.trim(),
      name_ar: categoryForm.name_ar.trim()
    })
    setSaving(false)
    if (error) {
      setNotice(error.message)
      return
    }
    setCategoryForm({ name_en: '', name_ar: '' })
    await loadStore()
    setNotice(t.saved)
  }

  async function deleteCategory(category) {
    if (!supabase || !session) return
    const inUse = products.some(product =>
      String(product.category_id || '') === String(category.id)
    )
    if (inUse) {
      setNotice(t.categoryInUse)
      return
    }
    if (!window.confirm(t.deleteCategoryConfirm)) return
    const { error } = await supabase.from('categories').delete().eq('id', category.id)
    if (error) {
      setNotice(error.message)
      return
    }
    if (String(activeCategory) === String(category.id)) setActiveCategory('all')
    await loadStore()
    setNotice(t.deleted)
  }

  function scrollToShop() {
    document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' })
    setMobileOpen(false)
  }

  return (
    <div className={`app ${rtl ? 'rtl' : 'ltr'}`} dir={rtl ? 'rtl' : 'ltr'}>
      <div className="announcement">
        <Sparkles size={15} /><span>{t.announcement}</span>
      </div>

      <header className="site-header">
        <div className="header-inner">
          <button type="button" className="brand"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <span className="brand-icon"><PawPrint size={25} /></span>
            <span className="brand-copy"><strong>NIZWA CAT</strong><small>نزوى كت</small></span>
          </button>
          <nav className={`main-nav ${mobileOpen ? 'open' : ''}`}>
            <button type="button" onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); setMobileOpen(false) }}>{t.home}</button>
            <button type="button" onClick={scrollToShop}>{t.shop}</button>
            <button type="button" onClick={() => { document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' }); setMobileOpen(false) }}>{t.about}</button>
            <a href={`https://wa.me/${WA}`} target="_blank" rel="noreferrer" onClick={() => setMobileOpen(false)}>{t.contact}</a>
          </nav>
          <div className="header-actions">
            <button type="button" className="language-toggle"
              onClick={() => setLang(current => current === 'ar' ? 'en' : 'ar')}>
              {lang === 'ar' ? 'EN' : 'عربي'}
            </button>
            <button type="button" className="cart-button" onClick={() => setCartOpen(true)} aria-label={t.cart}>
              <ShoppingBag size={20} /><span>{cartCount}</span>
            </button>
            <button type="button" className="mobile-menu-button"
              onClick={() => setMobileOpen(current => !current)} aria-label="Menu">
              {mobileOpen ? <X size={23} /> : <Menu size={23} />}
            </button>
          </div>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="hero-content">
            <span className="eyebrow"><PawPrint size={16} /> NIZWA CAT</span>
            <h1>{t.aboutTitle}</h1><p>{t.aboutText}</p>
            <button type="button" className="primary-button" onClick={scrollToShop}>
              {t.shop} <ArrowUpRight size={18} />
            </button>
          </div>
          <div className="hero-image">
            <img src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=1200" alt="Cute cat" />
            <div className="hero-sticker"><Heart size={18} fill="currentColor" /> Made for cats</div>
          </div>
        </section>

        <section className="benefits">
          <div className="benefit-item"><Truck size={25} /><div><strong>{t.delivery}</strong><small>Oman-wide service</small></div></div>
          <div className="benefit-item"><ShieldCheck size={25} /><div><strong>{t.quality}</strong><small>Selected with care</small></div></div>
          <div className="benefit-item"><Headphones size={25} /><div><strong>{t.support}</strong><small>Contact us anytime</small></div></div>
        </section>

        <section className="category-section">
          <div className="section-heading">
            <div><span className="eyebrow">EXPLORE</span><h2>{t.categories}</h2></div>
            <button type="button" className="text-link" onClick={scrollToShop}>{t.viewAll} <ArrowUpRight size={16} /></button>
          </div>
          <div className="category-grid">
            {categories.map((category, index) => (
              <button type="button" className="category-card" key={category.id}
                onClick={() => { setActiveCategory(category.id); scrollToShop() }}>
                <span className={`category-icon category-icon-${index % 5}`}>
                  {index % 5 === 0 ? <Bone /> : index % 5 === 1 ? <ShoppingBasket /> : index % 5 === 2 ? <Sparkles /> : index % 5 === 3 ? <Heart /> : <PawPrint />}
                </span>
                <strong>{categoryTitle(category, lang)}</strong><ArrowUpRight size={16} />
              </button>
            ))}
          </div>
        </section>

        {featuredProducts.length > 0 && (
          <section className="featured-section">
            <div className="section-heading">
              <div><span className="eyebrow">OUR PICKS</span><h2>{t.featured}</h2></div>
              <button type="button" className="text-link" onClick={scrollToShop}>{t.viewAll} <ArrowUpRight size={16} /></button>
            </div>
            <div className="product-grid">
              {featuredProducts.map(product => (
                <ProductCard key={product.id} product={product} lang={lang} t={t}
                  onAdd={() => addToCart(product)} onDetails={() => setSelectedProduct(product)} />
              ))}
            </div>
          </section>
        )}

        <section className="shop-section" id="shop">
          <div className="section-heading">
            <div><span className="eyebrow">THE COLLECTION</span><h2>{t.allProducts}</h2></div>
            <div className="search-box">
              <Search size={18} />
              <input value={search} onChange={event => setSearch(event.target.value)}
                placeholder={t.search} aria-label={t.search} />
              {search && <button type="button" onClick={() => setSearch('')} aria-label={t.close}><X size={16} /></button>}
            </div>
          </div>
          <div className="filter-row">
            <button type="button" className={activeCategory === 'all' ? 'filter-chip active' : 'filter-chip'}
              onClick={() => setActiveCategory('all')}>{t.categoryAll}</button>
            {categories.map(category => (
              <button type="button" key={category.id}
                className={activeCategory === category.id ? 'filter-chip active' : 'filter-chip'}
                onClick={() => setActiveCategory(category.id)}>{categoryTitle(category, lang)}</button>
            ))}
          </div>
          {loading && <div className="loading-state"><Loader2 className="spin" /> {t.loading}</div>}
          {storeError && <div className="notice error"><AlertCircle size={17} /> {storeError}</div>}
          {!loading && filteredProducts.length > 0 && (
            <div className="product-grid">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} lang={lang} t={t}
                  onAdd={() => addToCart(product)} onDetails={() => setSelectedProduct(product)} />
              ))}
            </div>
          )}
          {!loading && filteredProducts.length === 0 && (
            <div className="empty-state"><Package size={38} /><p>{search ? t.noResults : t.noProducts}</p></div>
          )}
        </section>

        <section className="about-section" id="about">
          <div className="about-icon"><PawPrint size={42} /></div>
          <div>
            <span className="eyebrow">ABOUT NIZWA CAT</span><h2>{t.aboutTitle}</h2><p>{t.aboutText}</p>
            <a href={`https://wa.me/${WA}`} target="_blank" rel="noreferrer" className="text-link">
              <MessageCircle size={17} /> {t.contact}
            </a>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="footer-brand"><PawPrint size={25} /><strong>NIZWA CAT</strong><span>نزوى كت</span></div>
        <p>{t.aboutText}</p>
        <div className="footer-links">
          <a href={`https://wa.me/${WA}`} target="_blank" rel="noreferrer"><MessageCircle size={19} /></a>
          <a href="https://instagram.com/" target="_blank" rel="noreferrer"><Instagram size={19} /></a>
        </div>
        <small>© {new Date().getFullYear()} NIZWA CAT. All rights reserved.</small>
        <button
          type="button"
          className="admin-secret-trigger"
          onClick={() => setAdminOpen(true)}
          aria-label={t.admin}
          title={t.admin}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '44px',
            height: '28px',
            margin: '2px auto 0',
            padding: 0,
            border: 0,
            background: 'transparent',
            color: 'inherit',
            opacity: 0.12,
            cursor: 'pointer',
            WebkitTapHighlightColor: 'transparent'
          }}
        >
          <span
            aria-hidden="true"
            style={{
              display: 'block',
              width: '4px',
              height: '4px',
              borderRadius: '50%',
              background: 'currentColor'
            }}
          />
        </button>
      </footer>

      <button type="button" className="floating-whatsapp"
        onClick={() => window.open(`https://wa.me/${WA}`, '_blank', 'noopener,noreferrer')} aria-label="WhatsApp">
        <MessageCircle size={25} />
      </button>
      {notice && <div className="toast"><Check size={17} /> {notice}</div>}

      {selectedProduct && (
        <div className="overlay" onClick={() => setSelectedProduct(null)}>
          <div className="product-modal" onClick={event => event.stopPropagation()}>
            <IconButton label={t.close} onClick={() => setSelectedProduct(null)} className="modal-close"><X /></IconButton>
            <img src={selectedProduct.image_url || NO_IMAGE} alt={productTitle(selectedProduct, lang)} />
            <div className="product-modal-content">
              <h2>{productTitle(selectedProduct, lang)}</h2><p>{productDescription(selectedProduct, lang)}</p>
              <strong className="product-price">{money(selectedProduct.price, lang)}</strong>
              <button type="button" className="primary-button full-button" onClick={() => addToCart(selectedProduct)}>
                <ShoppingBag size={18} /> {t.add}
              </button>
            </div>
          </div>
        </div>
      )}

      {cartOpen && (
        <div className="overlay cart-overlay" onClick={() => setCartOpen(false)}>
          <aside className="cart-drawer" onClick={event => event.stopPropagation()}>
            <div className="drawer-heading">
              <h2><ShoppingBag size={22} /> {t.cart} ({cartCount})</h2>
              <IconButton label={t.close} onClick={() => setCartOpen(false)}><X /></IconButton>
            </div>
            {cart.length === 0 ? (
              <div className="empty-state cart-empty">
                <ShoppingBag size={40} /><p>{t.emptyCart}</p>
                <button type="button" className="primary-button" onClick={() => setCartOpen(false)}>{t.continue}</button>
              </div>
            ) : (
              <>
                <div className="cart-items">
                  {cart.map(item => (
                    <div className="cart-item" key={item.id}>
                      <img src={item.image_url || NO_IMAGE} alt={productTitle(item, lang)} />
                      <div className="cart-item-info">
                        <strong>{productTitle(item, lang)}</strong><span>{money(item.price, lang)}</span>
                        <div className="quantity-control">
                          <button type="button" onClick={() => changeQuantity(item.id, -1)}><Minus size={14} /></button>
                          <span>{item.quantity}</span>
                          <button type="button" onClick={() => changeQuantity(item.id, 1)}><Plus size={14} /></button>
                        </div>
                      </div>
                      <IconButton label={t.remove} onClick={() => removeFromCart(item.id)}><Trash2 size={17} /></IconButton>
                    </div>
                  ))}
                </div>
                <div className="checkout-area">
                  <div className="cart-total"><strong>{t.total}</strong><strong>{money(cartTotal, lang)}</strong></div>
                  <form onSubmit={event => { event.preventDefault(); sendWhatsAppOrder() }} className="checkout-form">
                    <input required placeholder={t.name} value={customer.name} onChange={event => setCustomer({ ...customer, name: event.target.value })} />
                    <input required placeholder={t.phone} value={customer.phone} onChange={event => setCustomer({ ...customer, phone: event.target.value })} />
                    <textarea required placeholder={t.address} value={customer.address} onChange={event => setCustomer({ ...customer, address: event.target.value })} rows="2" />
                    <textarea placeholder={t.notes} value={customer.notes} onChange={event => setCustomer({ ...customer, notes: event.target.value })} rows="2" />
                    <button type="submit" className="primary-button full-button" disabled={saving}><MessageCircle size={18} /> {saving ? <Loader2 className="spin" size={18} /> : t.checkout}</button>
                  </form>
                </div>
              </>
            )}
          </aside>
        </div>
      )}

      {adminOpen && (
        <div className="overlay admin-overlay" onClick={() => setAdminOpen(false)}>
          <section className="admin-modal" onClick={event => event.stopPropagation()}>
            <div className="drawer-heading">
              <h2><Package size={22} /> {t.admin}</h2>
              <IconButton label={t.close} onClick={() => setAdminOpen(false)}><X /></IconButton>
            </div>
            {!session ? (
              <form className="admin-login" onSubmit={handleLogin}>
                <div className="admin-login-icon"><PawPrint size={34} /></div>
                <h3>{t.login}</h3><p>{t.adminHint}</p>
                {!isSupabaseConfigured && <div className="notice error"><AlertCircle size={16} /> {t.setup}</div>}
                <input type="email" required placeholder={t.email} value={email} onChange={event => setEmail(event.target.value)} />
                <input type="password" required placeholder={t.password} value={password} onChange={event => setPassword(event.target.value)} />
                <button type="submit" className="primary-button full-button" disabled={saving || !isSupabaseConfigured}>
                  {saving ? <Loader2 className="spin" size={18} /> : <LogIn size={18} />} {t.signIn}
                </button>
              </form>
            ) : (
              <div className="admin-content">
                <div className="admin-toolbar">
                  <div className="admin-tabs">
                    <button type="button" className={adminTab === 'products' ? 'active' : ''} onClick={() => setAdminTab('products')}><Package size={16} /> {t.products}</button>
                    <button type="button" className={adminTab === 'categories' ? 'active' : ''} onClick={() => setAdminTab('categories')}><Tags size={16} /> {t.manageCategories}</button>
                    <button type="button" className={adminTab === 'orders' ? 'active' : ''} onClick={() => { setAdminTab('orders'); loadOrders() }}><ClipboardList size={16} /> {t.orders}</button>
                  </div>
                  <button type="button" className="logout-button" onClick={handleLogout}><LogOut size={16} /> {t.logout}</button>
                </div>
                {adminTab === 'products' && (
                  <div className="admin-products">
                    <div className="admin-section-title">
                      <h3>{editing ? t.editProduct : t.addProduct}</h3>
                      <button type="button" className="secondary-button" onClick={startNewProduct}><Plus size={16} /> {t.addProduct}</button>
                    </div>
                    <form className="admin-form" onSubmit={saveProduct}>
                      <input placeholder={t.productNameEn} value={form.name_en} onChange={event => setForm({ ...form, name_en: event.target.value })} />
                      <input placeholder={t.productNameAr} value={form.name_ar} onChange={event => setForm({ ...form, name_ar: event.target.value })} />
                      <textarea placeholder={t.descriptionEn} value={form.description_en} onChange={event => setForm({ ...form, description_en: event.target.value })} rows="2" />
                      <textarea placeholder={t.descriptionAr} value={form.description_ar} onChange={event => setForm({ ...form, description_ar: event.target.value })} rows="2" />
                      <input required type="number" min="0" step="0.001" placeholder={t.price} value={form.price} onChange={event => setForm({ ...form, price: event.target.value })} />
                      <select value={form.category_id} onChange={event => setForm({ ...form, category_id: event.target.value })}>
                        <option value="">{t.category}</option>
                        {categories.map(category => <option key={category.id} value={category.id}>{categoryTitle(category, lang)}</option>)}
                      </select>
                      <label className="upload-field">
                        <ImagePlus size={19} /><span>{imageFile ? imageFile.name : t.image}</span>
                        <input type="file" accept="image/jpeg,image/png,image/webp,image/gif"
                          onChange={event => setImageFile(event.target.files?.[0] || null)} />
                      </label>
                      {(imagePreview || form.image_url) && (
                        <img className="admin-image-preview" src={imagePreview || form.image_url} alt="Product preview" />
                      )}
                      <label className="featured-check">
                        <input type="checkbox" checked={form.featured} onChange={event => setForm({ ...form, featured: event.target.checked })} />
                        {t.featuredProduct}
                      </label>
                      <div className="admin-form-actions">
                        <button type="submit" className="primary-button" disabled={saving}>
                          {saving ? <Loader2 className="spin" size={17} /> : <Check size={17} />} {t.save}
                        </button>
                        {editing && <button type="button" className="secondary-button" onClick={startNewProduct}>{t.cancel}</button>}
                      </div>
                    </form>
                    <div className="admin-list">
                      {products.map(product => (
                        <div className="admin-list-item" key={product.id}>
                          <img src={product.image_url || NO_IMAGE} alt={productTitle(product, lang)} />
                          <div className="admin-list-info"><strong>{productTitle(product, lang)}</strong><small>{money(product.price, lang)}</small></div>
                          <IconButton label={t.editProduct} onClick={() => startEditProduct(product)}><Edit3 size={17} /></IconButton>
                          <IconButton label={t.delete} onClick={() => deleteProduct(product)}><Trash2 size={17} /></IconButton>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {adminTab === 'orders' && (
                  <div className="admin-orders">
                    <div className="admin-section-title">
                      <h3>{t.orders} ({orders.length})</h3>
                      <button type="button" className="secondary-button" onClick={loadOrders} disabled={ordersLoading}>
                        <RefreshCw size={16} /> {lang === 'ar' ? 'تحديث' : 'Refresh'}
                      </button>
                    </div>
                    {ordersLoading && <div className="loading-state"><Loader2 className="spin" /> {t.loadingOrders}</div>}
                    {ordersError && <div className="notice error"><AlertCircle size={16} /> {ordersError}</div>}
                    {!ordersLoading && !ordersError && orders.length === 0 && (
                      <div className="empty-state"><ClipboardList size={36} /><p>{t.noOrders}</p></div>
                    )}
                    <div className="admin-list">
                      {orders.map(order => (
                        <article className="admin-list-item order-admin-card" key={order.id} style={{ alignItems: 'flex-start', flexWrap: 'wrap', padding: '16px' }}>
                          <div className="admin-list-info" style={{ minWidth: '220px', flex: '1 1 260px', gap: '7px' }}>
                            <strong>{t.orderNumber}: {order.id}</strong>
                            <small>{new Date(order.created_at).toLocaleString(lang === 'ar' ? 'ar-OM' : 'en-OM')}</small>
                            <strong>{order.customer_name}</strong>
                            <small>{order.phone}</small>
                            <small>{order.address}</small>
                            {order.notes && <small>{t.notes}: {order.notes}</small>}
                            <strong>{t.orderItems}</strong>
                            {(Array.isArray(order.items) ? order.items : []).map((item, index) => (
                              <small key={`${order.id}-${index}`}>
                                {lang === 'ar' ? (item.name_ar || item.name_en) : (item.name_en || item.name_ar)} × {item.quantity} · {money(item.line_total, lang)}
                              </small>
                            ))}
                            <strong>{t.total}: {money(order.total_amount, lang)}</strong>
                          </div>
                          <label style={{ display: 'flex', flexDirection: 'column', gap: '6px', minWidth: '145px', fontSize: '13px' }}>
                            {t.orderStatus}
                            <select value={order.status} onChange={event => updateOrderStatus(order.id, event.target.value)} style={{ maxWidth: '100%', padding: '9px', borderRadius: '8px', border: '1px solid var(--border, #ddd)', background: 'var(--surface, #fff)', color: 'inherit' }}>
                              {Object.entries(t.statuses).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                            </select>
                          </label>
                        </article>
                      ))}
                    </div>
                  </div>
                )}
                {adminTab === 'categories' && (
                  <div className="admin-categories">
                    <h3>{t.manageCategories}</h3>
                    <form className="admin-form" onSubmit={addCategory}>
                      <input placeholder={t.categoryNameEn} value={categoryForm.name_en} onChange={event => setCategoryForm({ ...categoryForm, name_en: event.target.value })} />
                      <input placeholder={t.categoryNameAr} value={categoryForm.name_ar} onChange={event => setCategoryForm({ ...categoryForm, name_ar: event.target.value })} />
                      <button type="submit" className="primary-button" disabled={saving}>
                        {saving ? <Loader2 className="spin" size={17} /> : <Plus size={17} />} {t.addCategory}
                      </button>
                    </form>
                    <div className="admin-list">
                      {categories.map(category => (
                        <div className="admin-list-item" key={category.id}>
                          <div className="category-admin-icon"><Tags size={19} /></div>
                          <div className="admin-list-info"><strong>{categoryTitle(category, lang)}</strong><small>{category.name_en || ''}</small></div>
                          <IconButton label={t.delete} onClick={() => deleteCategory(category)}><Trash2 size={17} /></IconButton>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  )
}

function ProductCard({ product, lang, t, onAdd, onDetails }) {
  return (
    <article className="product-card">
      <button type="button" className="product-image-button" onClick={onDetails}>
        <img src={product.image_url || NO_IMAGE} alt={productTitle(product, lang)}
          loading="lazy" onError={event => { event.currentTarget.onerror = null; event.currentTarget.src = NO_IMAGE }} />
        {product.featured && <span className="product-badge"><Sparkles size={13} /> {t.featured}</span>}
        <span className="product-view"><ArrowUpRight size={18} /></span>
      </button>
      <div className="product-card-content">
        <button type="button" className="product-name" onClick={onDetails}>{productTitle(product, lang)}</button>
        <p>{productDescription(product, lang)}</p>
        <div className="product-card-bottom">
          <strong className="product-price">{money(product.price, lang)}</strong>
          <button type="button" className="add-cart-button" onClick={onAdd} aria-label={t.add}><Plus size={19} /></button>
        </div>
      </div>
    </article>
  )
}
