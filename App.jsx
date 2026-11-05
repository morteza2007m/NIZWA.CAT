import React, { useEffect, useMemo, useState } from 'react'
import {
  Search, ShoppingBag, Menu, X, Instagram, MessageCircle,
  ChevronDown, Plus, Minus, ArrowUpRight, PawPrint,
  LogIn, LogOut, Package, Tags, ImagePlus, Trash2,
  Edit3, Check, AlertCircle, Truck, ShieldCheck,
  Headphones, Sparkles, Bone, Heart, ShoppingBasket,
  Loader2, RefreshCw
} from 'lucide-react'
import { isSupabaseConfigured, supabase } from './supabase.js'

const WA = (import.meta.env.VITE_WHATSAPP_NUMBER || '96871394358').replace(/\D/g, '')
const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=900'

const translations = {
  ar: {
    announcement: 'توصيل لجميع ولايات سلطنة عُمان',
    home: 'الرئيسية',
    shop: 'المتجر',
    about: 'من نحن',
    contact: 'تواصل معنا',
    search: 'ابحث عن المنتجات...',
    categories: 'تسوق حسب الفئة',
    featured: 'منتجات مميزة',
    allProducts: 'جميع المنتجات',
    viewAll: 'عرض الكل',
    add: 'أضف إلى السلة',
    details: 'التفاصيل',
    cart: 'سلة التسوق',
    emptyCart: 'سلتك فارغة حالياً',
    continue: 'تابع التسوق',
    total: 'الإجمالي',
    checkout: 'إتمام الطلب عبر واتساب',
    name: 'الاسم',
    phone: 'رقم الهاتف',
    address: 'العنوان والولاية',
    notes: 'ملاحظات إضافية',
    sendOrder: 'إرسال الطلب',
    quantity: 'الكمية',
    delivery: 'توصيل لجميع الولايات',
    quality: 'منتجات مختارة بعناية',
    support: 'نحن هنا لمساعدتك',
    aboutTitle: 'كل ما يحتاجه قطك في مكان واحد',
    aboutText: 'في نزوى كت نوفر مستلزمات القطط المختارة بعناية، مع خدمة توصيل إلى جميع أنحاء سلطنة عُمان.',
    admin: 'لوحة الإدارة',
    login: 'تسجيل دخول المدير',
    email: 'البريد الإلكتروني',
    password: 'كلمة المرور',
    signIn: 'دخول',
    logout: 'تسجيل الخروج',
    products: 'المنتجات',
    manageCategories: 'إدارة الفئات',
    addProduct: 'إضافة منتج',
    editProduct: 'تعديل المنتج',
    productNameEn: 'اسم المنتج بالإنجليزية',
    productNameAr: 'اسم المنتج بالعربية',
    descriptionEn: 'الوصف بالإنجليزية',
    descriptionAr: 'الوصف بالعربية',
    price: 'السعر (ر.ع)',
    category: 'الفئة',
    image: 'صورة المنتج',
    featuredProduct: 'منتج مميز',
    save: 'حفظ',
    cancel: 'إلغاء',
    delete: 'حذف',
    addCategory: 'إضافة فئة',
    categoryNameEn: 'اسم الفئة بالإنجليزية',
    categoryNameAr: 'اسم الفئة بالعربية',
    loading: 'جارٍ التحميل...',
    noProducts: 'لا توجد منتجات حالياً',
    noResults: 'لم يتم العثور على منتجات',
    added: 'تمت الإضافة إلى السلة',
    saved: 'تم الحفظ بنجاح',
    deleted: 'تم الحذف بنجاح',
    loginError: 'تعذر تسجيل الدخول. تحقق من البيانات.',
    setup: 'يرجى إعداد اتصال Supabase أولاً.',
    required: 'يرجى تعبئة الحقول المطلوبة.',
    deleteConfirm: 'هل أنت متأكد من حذف هذا المنتج؟',
    deleteCategoryConfirm: 'هل أنت متأكد من حذف هذه الفئة؟',
    uploadError: 'تعذر رفع الصورة.',
    storeError: 'تعذر تحميل بيانات المتجر.',
    adminHint: 'سجل الدخول بحساب المدير لإدارة المنتجات والفئات.',
    orderIntro: 'مرحباً، أود تأكيد الطلب التالي:',
    orderName: 'الاسم',
    orderPhone: 'الهاتف',
    orderAddress: 'العنوان',
    orderNotes: 'ملاحظات',
    orderTotal: 'الإجمالي',
    currency: 'ر.ع',
    categoryAll: 'الكل',
    close: 'إغلاق',
    remove: 'إزالة'
  },
  en: {
    announcement: 'Delivery available across all Oman',
    home: 'Home',
    shop: 'Shop',
    about: 'About',
    contact: 'Contact',
    search: 'Search products...',
    categories: 'Shop by category',
    featured: 'Featured products',
    allProducts: 'All products',
    viewAll: 'View all',
    add: 'Add to cart',
    details: 'Details',
    cart: 'Shopping cart',
    emptyCart: 'Your cart is currently empty',
    continue: 'Continue shopping',
    total: 'Total',
    checkout: 'Checkout via WhatsApp',
    name: 'Name',
    phone: 'Phone number',
    address: 'Address and wilayat',
    notes: 'Additional notes',
    sendOrder: 'Send order',
    quantity: 'Quantity',
    delivery: 'Delivery across Oman',
    quality: 'Carefully selected products',
    support: 'We are here to help',
    aboutTitle: 'Everything your cat needs in one place',
    aboutText: 'NIZWA CAT offers carefully selected cat supplies with delivery throughout the Sultanate of Oman.',
    admin: 'Admin panel',
    login: 'Admin login',
    email: 'Email',
    password: 'Password',
    signIn: 'Sign in',
    logout: 'Log out',
    products: 'Products',
    manageCategories: 'Manage categories',
    addProduct: 'Add product',
    editProduct: 'Edit product',
    productNameEn: 'Product name in English',
    productNameAr: 'Product name in Arabic',
    descriptionEn: 'Description in English',
    descriptionAr: 'Description in Arabic',
    price: 'Price (OMR)',
    category: 'Category',
    image: 'Product image',
    featuredProduct: 'Featured product',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    addCategory: 'Add category',
    categoryNameEn: 'Category name in English',
    categoryNameAr: 'Category name in Arabic',
    loading: 'Loading...',
    noProducts: 'No products available yet',
    noResults: 'No products found',
    added: 'Added to cart',
    saved: 'Saved successfully',
    deleted: 'Deleted successfully',
    loginError: 'Login failed. Please check your details.',
    setup: 'Please configure Supabase first.',
    required: 'Please fill in the required fields.',
    deleteConfirm: 'Are you sure you want to delete this product?',
    deleteCategoryConfirm: 'Are you sure you want to delete this category?',
    uploadError: 'Image upload failed.',
    storeError: 'Could not load store data.',
    adminHint: 'Sign in with your admin account to manage products and categories.',
    orderIntro: 'Hello, I would like to place the following order:',
    orderName: 'Name',
    orderPhone: 'Phone',
    orderAddress: 'Address',
    orderNotes: 'Notes',
    orderTotal: 'Total',
    currency: 'OMR',
    categoryAll: 'All',
    close: 'Close',
    remove: 'Remove'
  }
}

const demoCategories = [
  { id: 'food', name_en: 'Food', name_ar: 'طعام', slug: 'food' },
  { id: 'litter', name_en: 'Cat Litter', name_ar: 'رمل القطط', slug: 'litter' },
  { id: 'toys', name_en: 'Toys', name_ar: 'ألعاب', slug: 'toys' },
  { id: 'care', name_en: 'Care', name_ar: 'العناية', slug: 'care' },
  { id: 'accessories', name_en: 'Accessories', name_ar: 'إكسسوارات', slug: 'accessories' }
]

const demoProducts = [
  {
    id: 'demo-1',
    name_en: 'Premium Cat Food',
    name_ar: 'طعام قطط مميز',
    description_en: 'A delicious everyday meal for your cat.',
    description_ar: 'وجبة لذيذة ومناسبة لقطتك كل يوم.',
    price: 3.5,
    image_url: FALLBACK_IMAGE,
    featured: true,
    category_id: 'food'
  },
  {
    id: 'demo-2',
    name_en: 'Tofu Cat Litter',
    name_ar: 'رمل قطط توفو',
    description_en: 'Comfortable and practical tofu litter.',
    description_ar: 'رمل توفو عملي ومريح للقطط.',
    price: 3.8,
    image_url: FALLBACK_IMAGE,
    featured: true,
    category_id: 'litter'
  },
  {
    id: 'demo-3',
    name_en: 'Cat Toy',
    name_ar: 'لعبة للقطط',
    description_en: 'A fun toy to keep your cat active.',
    description_ar: 'لعبة ممتعة لإبقاء قطتك نشيطة.',
    price: 1.2,
    image_url: FALLBACK_IMAGE,
    featured: false,
    category_id: 'toys'
  }
]

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
  const [products, setProducts] = useState(demoProducts)
  const [categories, setCategories] = useState(demoCategories)
  const [activeCategory, setActiveCategory] = useState('all')
  const [search, setSearch] = useState('')
  const [cart, setCart] = useState([])
  const [cartOpen, setCartOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [adminOpen, setAdminOpen] = useState(false)
  const [adminTab, setAdminTab] = useState('products')
  const [session, setSession] = useState(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({
    name_en: '',
    name_ar: '',
    description_en: '',
    description_ar: '',
    price: '',
    category_id: '',
    image_url: '',
    featured: false
  })
  const [imageFile, setImageFile] = useState(null)
  const [categoryForm, setCategoryForm] = useState({ name_en: '', name_ar: '' })
  const [customer, setCustomer] = useState({ name: '', phone: '', address: '', notes: '' })
  const [notice, setNotice] = useState('')
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [storeError, setStoreError] = useState('')

  const t = translations[lang]
  const rtl = lang === 'ar'

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return undefined

    let mounted = true

    const initialize = async () => {
      const { data } = await supabase.auth.getSession()
      if (mounted) setSession(data?.session || null)
      await loadStore(mounted)
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
    if (!isSupabaseConfigured || !supabase) return

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
        setProducts(productResult.data || [])
        setCategories(categoryResult.data || [])
      }
    } catch (error) {
      console.error('Store loading error:', error)
      if (mounted) setStoreError(t.storeError)
    } finally {
      if (mounted) setLoading(false)
    }
  }

  useEffect(() => {
    if (!notice) return undefined
    const timeout = setTimeout(() => setNotice(''), 3000)
    return () => clearTimeout(timeout)
  }, [notice])

  const filteredProducts = useMemo(() => {
    const term = search.trim().toLowerCase()

    return products.filter(product => {
      const matchesCategory =
        activeCategory === 'all' ||
        String(product.category_id || '') === String(activeCategory)

      const searchable = [
        product.name_en,
        product.name_ar,
        product.description_en,
        product.description_ar
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
    (sum, item) => sum + Number(item.price || 0) * item.quantity,
    0
  )

  function addToCart(product) {
    setCart(current => {
      const found = current.find(item => item.id === product.id)
      if (found) {
        return current.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...current, { ...product, quantity: 1 }]
    })
    setNotice(t.added)
  }

  function changeQuantity(productId, amount) {
    setCart(current =>
      current
        .map(item =>
          item.id === productId
            ? { ...item, quantity: item.quantity + amount }
            : item
        )
        .filter(item => item.quantity > 0)
    )
  }

  function removeFromCart(productId) {
    setCart(current => current.filter(item => item.id !== productId))
  }

  function sendWhatsAppOrder() {
    if (!cart.length) {
      setNotice(t.emptyCart)
      return
    }

    if (!customer.name.trim() || !customer.phone.trim() || !customer.address.trim()) {
      setNotice(t.required)
      return
    }

    const lines = cart.map(item =>
      `• ${productTitle(item, lang)} × ${item.quantity} — ${money(Number(item.price || 0) * item.quantity, lang)}`
    )

    const message = [
      t.orderIntro,
      '',
      ...lines,
      '',
      `${t.orderTotal}: ${money(cartTotal, lang)}`,
      '',
      `${t.orderName}: ${customer.name}`,
      `${t.orderPhone}: ${customer.phone}`,
      `${t.orderAddress}: ${customer.address}`,
      customer.notes ? `${t.orderNotes}: ${customer.notes}` : ''
    ].filter(Boolean).join('\n')

    const url = `https://wa.me/${WA}?text=${encodeURIComponent(message)}`
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  async function handleLogin(event) {
    event.preventDefault()

    if (!supabase || !isSupabaseConfigured) {
      setNotice(t.setup)
      return
    }

    setSaving(true)
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password
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
      name_en: '',
      name_ar: '',
      description_en: '',
      description_ar: '',
      price: '',
      category_id: categories[0]?.id || '',
      image_url: '',
      featured: false
    })
    setAdminTab('products')
  }

  function startEditProduct(product) {
    setEditing(product)
    setImageFile(null)
    setForm({
      name_en: product.name_en || '',
      name_ar: product.name_ar || '',
      description_en: product.description_en || '',
      description_ar: product.description_ar || '',
      price: product.price ?? '',
      category_id: product.category_id || '',
      image_url: product.image_url || '',
      featured: Boolean(product.featured)
    })
    setAdminTab('products')
  }

  async function uploadProductImage() {
    if (!imageFile) return form.image_url

    const extension = imageFile.name.split('.').pop() || 'jpg'
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${extension}`

    const { error } = await supabase.storage
      .from('product-images')
      .upload(path, imageFile, { upsert: false })

    if (error) throw error

    const { data } = supabase.storage
      .from('product-images')
      .getPublicUrl(path)

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

    setSaving(true)

    try {
      let imageUrl = form.image_url
      if (imageFile) imageUrl = await uploadProductImage()

      const payload = {
        name_en: form.name_en.trim(),
        name_ar: form.name_ar.trim(),
        description_en: form.description_en.trim(),
        description_ar: form.description_ar.trim(),
        price: Number(form.price || 0),
        category_id: form.category_id || null,
        image_url: imageUrl || null,
        featured: Boolean(form.featured)
      }

      let result

      if (editing) {
        result = await supabase
          .from('products')
          .update(payload)
          .eq('id', editing.id)
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

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', product.id)

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
    if (!window.confirm(t.deleteCategoryConfirm)) return
    if (!supabase || !session) return

    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', category.id)

    if (error) {
      setNotice(error.message)
      return
    }

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
        <Sparkles size={15} />
        <span>{t.announcement}</span>
      </div>

      <header className="site-header">
        <div className="header-inner">
          <button
            type="button"
            className="brand"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <span className="brand-icon"><PawPrint size={25} /></span>
            <span className="brand-copy">
              <strong>NIZWA CAT</strong>
              <small>نزوى كت</small>
            </span>
          </button>

          <nav className={`main-nav ${mobileOpen ? 'open' : ''}`}>
            <button type="button" onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); setMobileOpen(false) }}>{t.home}</button>
            <button type="button" onClick={scrollToShop}>{t.shop}</button>
            <button type="button" onClick={() => { document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' }); setMobileOpen(false) }}>{t.about}</button>
            <a href={`https://wa.me/${WA}`} target="_blank" rel="noreferrer" onClick={() => setMobileOpen(false)}>{t.contact}</a>
          </nav>

          <div className="header-actions">
            <button
              type="button"
              className="language-toggle"
              onClick={() => setLang(current => current === 'ar' ? 'en' : 'ar')}
            >
              {lang === 'ar' ? 'EN' : 'عربي'}
            </button>
            <button
              type="button"
              className="cart-button"
              onClick={() => setCartOpen(true)}
              aria-label={t.cart}
            >
              <ShoppingBag size={20} />
              <span>{cartCount}</span>
            </button>
            <button
              type="button"
              className="mobile-menu-button"
              onClick={() => setMobileOpen(current => !current)}
              aria-label="Menu"
            >
              {mobileOpen ? <X size={23} /> : <Menu size={23} />}
            </button>
          </div>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="hero-content">
            <span className="eyebrow"><PawPrint size={16} /> NIZWA CAT</span>
            <h1>{t.aboutTitle}</h1>
            <p>{t.aboutText}</p>
            <button type="button" className="primary-button" onClick={scrollToShop}>
              {t.shop} <ArrowUpRight size={18} />
            </button>
          </div>
          <div className="hero-image">
            <img src={FALLBACK_IMAGE} alt="Cute cat" />
            <div className="hero-sticker"><Heart size={18} fill="currentColor" /> Made for cats</div>
          </div>
        </section>

        <section className="benefits">
          <div className="benefit-item">
            <Truck size={25} />
            <div><strong>{t.delivery}</strong><small>Oman-wide service</small></div>
          </div>
          <div className="benefit-item">
            <ShieldCheck size={25} />
            <div><strong>{t.quality}</strong><small>Selected with care</small></div>
          </div>
          <div className="benefit-item">
            <Headphones size={25} />
            <div><strong>{t.support}</strong><small>Contact us anytime</small></div>
          </div>
        </section>

        <section className="category-section">
          <div className="section-heading">
            <div><span className="eyebrow">EXPLORE</span><h2>{t.categories}</h2></div>
            <button type="button" className="text-link" onClick={scrollToShop}>{t.viewAll} <ArrowUpRight size={16} /></button>
          </div>
          <div className="category-grid">
            {categories.map((category, index) => (
              <button
                type="button"
                className="category-card"
                key={category.id}
                onClick={() => {
                  setActiveCategory(category.id)
                  scrollToShop()
                }}
              >
                <span className={`category-icon category-icon-${index % 5}`}>
                  {index % 5 === 0 ? <Bone /> : index % 5 === 1 ? <ShoppingBasket /> : index % 5 === 2 ? <Sparkles /> : index % 5 === 3 ? <Heart /> : <PawPrint />}
                </span>
                <strong>{categoryTitle(category, lang)}</strong>
                <ArrowUpRight size={16} />
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
                <ProductCard
                  key={product.id}
                  product={product}
                  lang={lang}
                  t={t}
                  onAdd={() => addToCart(product)}
                  onDetails={() => setSelectedProduct(product)}
                />
              ))}
            </div>
          </section>
        )}

        <section className="shop-section" id="shop">
          <div className="section-heading">
            <div><span className="eyebrow">THE COLLECTION</span><h2>{t.allProducts}</h2></div>
            <div className="search-box">
              <Search size={18} />
              <input
                value={search}
                onChange={event => setSearch(event.target.value)}
                placeholder={t.search}
                aria-label={t.search}
              />
              {search && <button type="button" onClick={() => setSearch('')} aria-label={t.close}><X size={16} /></button>}
            </div>
          </div>

          <div className="filter-row">
            <button
              type="button"
              className={activeCategory === 'all' ? 'filter-chip active' : 'filter-chip'}
              onClick={() => setActiveCategory('all')}
            >
              {t.categoryAll}
            </button>
            {categories.map(category => (
              <button
                type="button"
                key={category.id}
                className={activeCategory === category.id ? 'filter-chip active' : 'filter-chip'}
                onClick={() => setActiveCategory(category.id)}
              >
                {categoryTitle(category, lang)}
              </button>
            ))}
          </div>

          {loading && <div className="loading-state"><Loader2 className="spin" /> {t.loading}</div>}
          {storeError && <div className="notice error"><AlertCircle size={17} /> {storeError}</div>}

          {!loading && filteredProducts.length > 0 && (
            <div className="product-grid">
              {filteredProducts.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  lang={lang}
                  t={t}
                  onAdd={() => addToCart(product)}
                  onDetails={() => setSelectedProduct(product)}
                />
              ))}
            </div>
          )}

          {!loading && filteredProducts.length === 0 && (
            <div className="empty-state">
              <Package size={38} />
              <p>{search ? t.noResults : t.noProducts}</p>
            </div>
          )}
        </section>

        <section className="about-section" id="about">
          <div className="about-icon"><PawPrint size={42} /></div>
          <div>
            <span className="eyebrow">ABOUT NIZWA CAT</span>
            <h2>{t.aboutTitle}</h2>
            <p>{t.aboutText}</p>
            <a href={`https://wa.me/${WA}`} target="_blank" rel="noreferrer" className="text-link">
              <MessageCircle size={17} /> {t.contact}
            </a>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="footer-brand">
          <PawPrint size={25} />
          <strong>NIZWA CAT</strong>
          <span>نزوى كت</span>
        </div>
        <p>{t.aboutText}</p>
        <div className="footer-links">
          <a href={`https://wa.me/${WA}`} target="_blank" rel="noreferrer"><MessageCircle size={19} /></a>
          <a href="https://instagram.com/" target="_blank" rel="noreferrer"><Instagram size={19} /></a>
          <button type="button" onClick={() => setAdminOpen(true)} aria-label={t.admin}><LogIn size={18} /></button>
        </div>
        <small>© {new Date().getFullYear()} NIZWA CAT. All rights reserved.</small>
      </footer>

      <button type="button" className="floating-whatsapp" onClick={() => window.open(`https://wa.me/${WA}`, '_blank', 'noopener,noreferrer')} aria-label="WhatsApp">
        <MessageCircle size={25} />
      </button>

      {notice && <div className="toast"><Check size={17} /> {notice}</div>}

      {selectedProduct && (
        <div className="overlay" onClick={() => setSelectedProduct(null)}>
          <div className="product-modal" onClick={event => event.stopPropagation()}>
            <IconButton label={t.close} onClick={() => setSelectedProduct(null)} className="modal-close"><X /></IconButton>
            <img src={selectedProduct.image_url || FALLBACK_IMAGE} alt={productTitle(selectedProduct, lang)} />
            <div className="product-modal-content">
              <h2>{productTitle(selectedProduct, lang)}</h2>
              <p>{productDescription(selectedProduct, lang)}</p>
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
                <ShoppingBag size={40} />
                <p>{t.emptyCart}</p>
                <button type="button" className="primary-button" onClick={() => setCartOpen(false)}>{t.continue}</button>
              </div>
            ) : (
              <>
                <div className="cart-items">
                  {cart.map(item => (
                    <div className="cart-item" key={item.id}>
                      <img src={item.image_url || FALLBACK_IMAGE} alt={productTitle(item, lang)} />
                      <div className="cart-item-info">
                        <strong>{productTitle(item, lang)}</strong>
                        <span>{money(item.price, lang)}</span>
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
                    <button type="submit" className="primary-button full-button"><MessageCircle size={18} /> {t.checkout}</button>
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
                <h3>{t.login}</h3>
                <p>{t.adminHint}</p>
                {!isSupabaseConfigured && <div className="notice error"><AlertCircle size={16} /> {t.setup}</div>}
                <input type="email" required placeholder={t.email} value={email} onChange={event => setEmail(event.target.value)} />
                <input type="password" required placeholder={t.password} value={password} onChange={event => setPassword(event.target.value)} />
                <button type="submit" className="primary-button full-button" disabled={saving || !isSupabaseConfigured}>
                  {saving ? <Loader2 className="spin" size={18} /> : <LogIn size={18} />}
                  {t.signIn}
                </button>
              </form>
            ) : (
              <div className="admin-content">
                <div className="admin-toolbar">
                  <div className="admin-tabs">
                    <button type="button" className={adminTab === 'products' ? 'active' : ''} onClick={() => setAdminTab('products')}><Package size={16} /> {t.products}</button>
                    <button type="button" className={adminTab === 'categories' ? 'active' : ''} onClick={() => setAdminTab('categories')}><Tags size={16} /> {t.manageCategories}</button>
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
                      <input required placeholder={t.productNameEn} value={form.name_en} onChange={event => setForm({ ...form, name_en: event.target.value })} />
                      <input placeholder={t.productNameAr} value={form.name_ar} onChange={event => setForm({ ...form, name_ar: event.target.value })} />
                      <textarea placeholder={t.descriptionEn} value={form.description_en} onChange={event => setForm({ ...form, description_en: event.target.value })} rows="2" />
                      <textarea placeholder={t.descriptionAr} value={form.description_ar} onChange={event => setForm({ ...form, description_ar: event.target.value })} rows="2" />
                      <input required type="number" min="0" step="0.001" placeholder={t.price} value={form.price} onChange={event => setForm({ ...form, price: event.target.value })} />
                      <select value={form.category_id} onChange={event => setForm({ ...form, category_id: event.target.value })}>
                        <option value="">{t.category}</option>
                        {categories.map(category => <option key={category.id} value={category.id}>{categoryTitle(category, lang)}</option>)}
                      </select>
                      <label className="upload-field">
                        <ImagePlus size={19} />
                        <span>{imageFile ? imageFile.name : t.image}</span>
                        <input type="file" accept="image/*" onChange={event => setImageFile(event.target.files?.[0] || null)} />
                      </label>
                      {form.image_url && !imageFile && <img className="admin-image-preview" src={form.image_url} alt="Product preview" />}
                      {imageFile && <img className="admin-image-preview" src={URL.createObjectURL(imageFile)} alt="New product preview" />}
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
                          <img src={product.image_url || FALLBACK_IMAGE} alt={productTitle(product, lang)} />
                          <div className="admin-list-info">
                            <strong>{productTitle(product, lang)}</strong>
                            <small>{money(product.price, lang)}</small>
                          </div>
                          <IconButton label={t.editProduct} onClick={() => startEditProduct(product)}><Edit3 size={17} /></IconButton>
                          <IconButton label={t.delete} onClick={() => deleteProduct(product)}><Trash2 size={17} /></IconButton>
                        </div>
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
                          <div className="admin-list-info">
                            <strong>{categoryTitle(category, lang)}</strong>
                            <small>{category.name_en || ''}</small>
                          </div>
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
        <img
          src={product.image_url || FALLBACK_IMAGE}
          alt={productTitle(product, lang)}
          loading="lazy"
          onError={event => { event.currentTarget.src = FALLBACK_IMAGE }}
        />
        {product.featured && <span className="product-badge"><Sparkles size={13} /> {t.featured}</span>}
        <span className="product-view"><ArrowUpRight size={18} /></span>
      </button>
      <div className="product-card-content">
        <button type="button" className="product-name" onClick={onDetails}>
          {productTitle(product, lang)}
        </button>
        <p>{productDescription(product, lang)}</p>
        <div className="product-card-bottom">
          <strong className="product-price">{money(product.price, lang)}</strong>
          <button type="button" className="add-cart-button" onClick={onAdd} aria-label={t.add}>
            <Plus size={19} />
          </button>
        </div>
      </div>
    </article>
  )
}
