
import React, { useEffect, useMemo, useState } from 'react'
import {
  Search, ShoppingBag, Menu, X, Instagram, MessageCircle,
  Plus, Minus, ArrowUpRight, PawPrint, LogIn, LogOut,
  Package, Tags, Trash2, Edit3, AlertCircle, Truck,
  ShieldCheck, Headphones, Sparkles, Bone, Gamepad2,
  Heart, ShoppingBasket
} from 'lucide-react'

import { isSupabaseConfigured, supabase } from './supabase.js'

const WA = (import.meta.env.VITE_WHATSAPP_NUMBER || '96871394358').replace(/\D/g, '')

const demoCategories = [
  { id: 'food', name_en: 'Food & treats', name_ar: 'الطعام والمكافآت' },
  { id: 'toys', name_en: 'Toys & play', name_ar: 'الألعاب والتسلية' },
  { id: 'care', name_en: 'Care & hygiene', name_ar: 'العناية والنظافة' },
  { id: 'accessories', name_en: 'Accessories', name_ar: 'الإكسسوارات' }
]

const demoProducts = [
  {
    id: 'p1',
    name_en: 'Daily comfort bowl',
    name_ar: 'وعاء طعام يومي',
    description_en: 'A practical bowl for your cat’s everyday meals.',
    description_ar: 'وعاء عملي وأنيق لوجبات قطتك اليومية.',
    price: 4.5,
    category_id: 'accessories',
    image_url: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=900',
    featured: true
  },
  {
    id: 'p2',
    name_en: 'Playful cat toy',
    name_ar: 'لعبة ممتعة للقطط',
    description_en: 'A fun little toy to keep your cat active.',
    description_ar: 'لعبة لطيفة لتمنح قطتك وقتاً ممتعاً من الحركة واللعب.',
    price: 2.8,
    category_id: 'toys',
    image_url: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=900',
    featured: true
  },
  {
    id: 'p3',
    name_en: 'Cat care essentials',
    name_ar: 'مستلزمات العناية بالقطط',
    description_en: 'Everyday essentials for your cat’s comfort.',
    description_ar: 'مستلزمات أساسية للعناية بقطتك وراحتها.',
    price: 8,
    category_id: 'care',
    image_url: 'https://images.unsplash.com/photo-1511044568932-338cba0ad803?w=900',
    featured: false
  },
  {
    id: 'p4',
    name_en: 'Tasty cat treats',
    name_ar: 'مكافآت لذيذة لقطتك',
    description_en: 'A tasty reward for your favourite companion.',
    description_ar: 'مكافأة لذيذة لقطتك في أي وقت.',
    price: 3.2,
    category_id: 'food',
    image_url: 'https://images.unsplash.com/photo-1495360010541-f48722b34f7d?w=900',
    featured: true
  }
]

const categoryVisuals = [
  {
    id: 'food',
    image: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=1000',
    alt: 'Cat food',
    icon: Bone,
    number: '01'
  },
  {
    id: 'toys',
    image: 'https://images.unsplash.com/photo-1545249390-6bdfa286032f?w=1000',
    alt: 'Cat toys',
    icon: Gamepad2,
    number: '02'
  },
  {
    id: 'care',
    image: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=1000',
    alt: 'Cat care',
    icon: Heart,
    number: '03'
  },
  {
    id: 'accessories',
    image: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=1000',
    alt: 'Cat accessories',
    icon: ShoppingBasket,
    number: '04'
  }
]

const copy = {
  ar: {
    navHome: 'الرئيسية',
    navShop: 'تسوّق',
    navAbout: 'من نحن',
    search: 'ابحث عن احتياجات قطتك...',
    heroEyebrow: 'كل ما تحبه قطتك، في مكان واحد',
    heroTitle: 'لأن قطتك',
    heroTitle2: 'تستحق الأفضل.',
    heroText: 'من الطعام والمكافآت إلى الألعاب ومستلزمات العناية، اكتشف كل ما تحتاجه قطتك في نزوى كت. تسوّق بسهولة من عُمان.',
    shopNow: 'تسوّق الآن',
    explore: 'اكتشف المنتجات',
    categories: 'تسوّق حسب الفئة',
    featured: 'اختياراتنا لقطتك',
    featuredText: 'منتجات مختارة بعناية لتجعل كل يوم أجمل لقطتك.',
    allProducts: 'عرض جميع المنتجات',
    add: 'أضف إلى السلة',
    details: 'عرض التفاصيل',
    aboutTitle: 'كل ما تحتاجه قطتك،',
    aboutTitle2: 'نهتم بتوفيره.',
    aboutText: 'نزوى كت NIZWA CAT متجر إلكتروني في عُمان، يجمع لك مستلزمات قطتك في مكان واحد. نوفر منتجات متنوعة تشمل الطعام والمكافآت والألعاب والعناية والإكسسوارات، لتجد ما تحتاجه بسهولة وتختار لقطتك بكل راحة.',
    cart: 'سلة التسوق',
    empty: 'سلتك فارغة حالياً',
    subtotal: 'إجمالي المنتجات',
    delivery: 'طريقة الاستلام',
    office: 'استلام من المكتب',
    home: 'توصيل إلى المنزل',
    name: 'الاسم',
    phone: 'رقم الهاتف',
    notes: 'ملاحظات إضافية (اختياري)',
    send: 'إرسال الطلب عبر واتساب',
    deliveryNote: 'رسوم التوصيل تُحدد حسب وزن الطلب وموقع التوصيل، ويتم تأكيدها معك قبل إتمام الطلب. لا يتوفر الدفع عند الاستلام.',
    close: 'إغلاق',
    admin: 'الإدارة',
    login: 'دخول الإدارة',
    email: 'البريد الإلكتروني',
    password: 'كلمة المرور',
    signIn: 'تسجيل الدخول',
    products: 'المنتجات',
    categoriesAdmin: 'الفئات',
    addProduct: 'إضافة منتج',
    save: 'حفظ',
    cancel: 'إلغاء',
    nameAr: 'اسم المنتج بالعربية',
    nameEn: 'اسم المنتج بالإنجليزية',
    price: 'السعر (ر.ع)',
    image: 'رابط صورة المنتج',
    category: 'الفئة',
    description: 'الوصف',
    featuredLabel: 'عرض كمنتج مميز',
    delete: 'حذف',
    edit: 'تعديل',
    noProducts: 'لا توجد منتجات في هذه الفئة حالياً.',
    config: 'المتجر في وضع المعاينة. تأكد من إعداد Supabase لربط المنتجات.',
    adminHint: 'لإدارة المنتجات، سجّل الدخول باستخدام حساب تم إنشاؤه في Supabase Authentication.',
    saved: 'تم حفظ التغييرات بنجاح.',
    required: 'يرجى إدخال الاسم ورقم الهاتف.',
    currency: 'ر.ع'
  },

  en: {
    navHome: 'Home',
    navShop: 'Shop',
    navAbout: 'About us',
    search: 'Search for your cat’s essentials...',
    heroEyebrow: 'EVERYTHING YOUR CAT LOVES',
    heroTitle: 'Because your cat',
    heroTitle2: 'deserves the best.',
    heroText: 'From food and treats to toys and care essentials, find what your cat needs at NIZWA CAT. Easy shopping, right here in Oman.',
    shopNow: 'Shop now',
    explore: 'Explore products',
    categories: 'Shop by category',
    featured: 'Our picks for your cat',
    featuredText: 'Carefully selected products to make every day better for your cat.',
    allProducts: 'View all products',
    add: 'Add to cart',
    details: 'View details',
    aboutTitle: 'Everything your cat needs,',
    aboutTitle2: 'all in one place.',
    aboutText: 'NIZWA CAT is an online store in Oman, bringing your cat’s essentials together in one place. Discover food, treats, toys, care products and accessories, and enjoy a simple shopping experience.',
    cart: 'Shopping cart',
    empty: 'Your cart is empty',
    subtotal: 'Products subtotal',
    delivery: 'Collection method',
    office: 'Collect from office',
    home: 'Home delivery',
    name: 'Your name',
    phone: 'Phone number',
    notes: 'Additional notes (optional)',
    send: 'Send order via WhatsApp',
    deliveryNote: 'Delivery fees depend on the order weight and delivery location. The fee will be confirmed before completing your order. Cash on delivery is not available.',
    close: 'Close',
    admin: 'Admin',
    login: 'Admin sign in',
    email: 'Email',
    password: 'Password',
    signIn: 'Sign in',
    products: 'Products',
    categoriesAdmin: 'Categories',
    addProduct: 'Add product',
    save: 'Save',
    cancel: 'Cancel',
    nameAr: 'Product name in Arabic',
    nameEn: 'Product name in English',
    price: 'Price (OMR)',
    image: 'Product image URL',
    category: 'Category',
    description: 'Description',
    featuredLabel: 'Mark as featured',
    delete: 'Delete',
    edit: 'Edit',
    noProducts: 'There are no products in this category yet.',
    config: 'Preview mode is active. Configure Supabase to connect your store products.',
    adminHint: 'To manage products, sign in with a user created in Supabase Authentication.',
    saved: 'Changes saved successfully.',
    required: 'Please enter your name and phone number.',
    currency: 'OMR'
  }
}

function App() {
  const [lang, setLang] = useState('ar')
  const [products, setProducts] = useState(demoProducts)
  const [categories, setCategories] = useState(demoCategories)
  const [activeCat, setActiveCat] = useState('all')
  const [query, setQuery] = useState('')
  const [cart, setCart] = useState([])
  const [cartOpen, setCartOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [selected, setSelected] = useState(null)
  const [checkout, setCheckout] = useState(false)
  const [delivery, setDelivery] = useState('office')
  const [customer, setCustomer] = useState({ name: '', phone: '', notes: '' })
  const [adminOpen, setAdminOpen] = useState(false)
  const [session, setSession] = useState(null)
  const [adminTab, setAdminTab] = useState('products')
  const [auth, setAuth] = useState({ email: '', password: '' })
  const [editing, setEditing] = useState(null)
  const [notice, setNotice] = useState('')

  const t = copy[lang]
  const rtl = lang === 'ar'

  useEffect(() => {
    document.documentElement.lang = lang
    document.documentElement.dir = rtl ? 'rtl' : 'ltr'
  }, [lang, rtl])

  useEffect(() => {
    if (!isSupabaseConfigured) return

    loadStore()
    supabase.auth.getSession().then(({ data }) => setSession(data.session))

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      setSession(currentSession)
    })

    return () => subscription.unsubscribe()
  }, [])

  async function loadStore() {
    if (!supabase) return

    const [
      { data: productData, error: productError },
      { data: categoryData, error: categoryError }
    ] = await Promise.all([
      supabase.from('products').select('*').order('created_at', { ascending: false }),
      supabase.from('categories').select('*').order('name_en')
    ])

    if (!productError && productData?.length) setProducts(productData)
    if (!categoryError && categoryData?.length) setCategories(categoryData)
  }

  const categoryList = [
    { id: 'all', name_en: 'All products', name_ar: 'جميع المنتجات' },
    ...categories
  ]

  const filtered = useMemo(() => products.filter(product => {
    const matchesCategory =
      activeCat === 'all' ||
      String(product.category_id) === String(activeCat)

    const searchText =
      `${product.name_en || ''} ${product.name_ar || ''}`.toLowerCase()

    return matchesCategory && searchText.includes(query.toLowerCase())
  }), [products, activeCat, query])

  const featured = products.filter(product => product.featured)
  const visibleProducts = query || activeCat !== 'all'
    ? filtered
    : (featured.length ? featured : products)

  const count = cart.reduce((sum, item) => sum + item.qty, 0)
  const total = cart.reduce(
    (sum, item) => sum + Number(item.price || 0) * item.qty,
    0
  )

  const title = product => rtl
    ? (product.name_ar || product.name_en)
    : (product.name_en || product.name_ar)

  const description = product => rtl
    ? (product.description_ar || product.description_en)
    : (product.description_en || product.description_ar)

  function add(product) {
    setCart(oldCart => {
      const found = oldCart.find(item => item.id === product.id)

      return found
        ? oldCart.map(item =>
            item.id === product.id
              ? { ...item, qty: item.qty + 1 }
              : item
          )
        : [...oldCart, { ...product, qty: 1 }]
    })

    setSelected(null)
    setCartOpen(true)
  }

  function changeQty(id, difference) {
    setCart(oldCart =>
      oldCart
        .map(item =>
          item.id === id
            ? { ...item, qty: item.qty + difference }
            : item
        )
        .filter(item => item.qty > 0)
    )
  }

  function sendWhatsApp() {
    if (!customer.name.trim() || !customer.phone.trim()) {
      setNotice(t.required)
      return
    }

    const lines = cart.map(item =>
      `• ${title(item)} × ${item.qty} = ${(Number(item.price) * item.qty).toFixed(3)} OMR`
    )

    const method = delivery === 'office'
      ? (rtl ? 'استلام من المكتب' : 'Collect from office')
      : (rtl ? 'توصيل إلى المنزل' : 'Home delivery')

    const message = [
      `NIZWA CAT | ${rtl ? 'طلب جديد' : 'New order'}`,
      `${rtl ? 'الاسم' : 'Name'}: ${customer.name}`,
      `${rtl ? 'الهاتف' : 'Phone'}: ${customer.phone}`,
      `${rtl ? 'طريقة الاستلام' : 'Collection'}: ${method}`,
      '',
      ...lines,
      '',
      `${rtl ? 'إجمالي المنتجات' : 'Products subtotal'}: ${total.toFixed(3)} OMR`,
      rtl
        ? 'رسوم التوصيل غير مشمولة، وسيتم تأكيدها حسب الوزن والموقع.'
        : 'Delivery is not included and will be confirmed based on weight and location.',
      customer.notes
        ? `${rtl ? 'ملاحظات' : 'Notes'}: ${customer.notes}`
        : ''
    ].join('\n')

    window.open(
      `https://wa.me/${WA}?text=${encodeURIComponent(message)}`,
      '_blank'
    )
  }

  async function signIn(event) {
    event.preventDefault()

    if (!supabase) {
      setNotice(t.config)
      return
    }

    const { data, error } = await supabase.auth.signInWithPassword(auth)

    if (error) setNotice(error.message)
    else {
      setSession(data.session)
      setNotice('')
    }
  }

  async function signOut() {
    if (!supabase) return
    await supabase.auth.signOut()
    setSession(null)
  }

  async function saveProduct(event) {
    event.preventDefault()
    if (!supabase) return

    const form = new FormData(event.currentTarget)

    const payload = {
      name_en: form.get('name_en'),
      name_ar: form.get('name_ar'),
      description_en: form.get('description_en'),
      description_ar: form.get('description_ar'),
      price: Number(form.get('price')),
      category_id: form.get('category_id') || null,
      image_url: form.get('image_url'),
      featured: form.get('featured') === 'on'
    }

    const file = form.get('image_file')

    if (file && file.size) {
      const extension = file.name.split('.').pop()
      const path = `${Date.now()}.${extension}`

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(path, file, { upsert: true })

      if (uploadError) {
        setNotice(uploadError.message)
        return
      }

      const { data } = supabase.storage
        .from('product-images')
        .getPublicUrl(path)

      payload.image_url = data.publicUrl
    }

    const result = editing?.id
      ? await supabase.from('products').update(payload).eq('id', editing.id)
      : await supabase.from('products').insert(payload)

    if (result.error) {
      setNotice(result.error.message)
      return
    }

    setEditing(null)
    setNotice(t.saved)
    await loadStore()
  }

  async function deleteProduct(id) {
    if (!supabase) return

    const confirmed = window.confirm(
      rtl ? 'هل تريد حذف هذا المنتج؟' : 'Delete this product?'
    )

    if (!confirmed) return

    const { error } = await supabase.from('products').delete().eq('id', id)

    if (error) setNotice(error.message)
    else loadStore()
  }

  function ProductCard({ product }) {
    return (
      <article className="product-card">
        <button
          className="product-image"
          onClick={() => setSelected(product)}
          aria-label={t.details}
        >
          <img src={product.image_url} alt={title(product)} loading="lazy" />

          {product.featured && (
            <span className="featured-tag">
              <Sparkles size={12} />
              {rtl ? 'اختيارنا' : 'OUR PICK'}
            </span>
          )}

          <span className="quick-view">
            {t.details}
            <ArrowUpRight size={15} />
          </span>
        </button>

        <div className="product-info">
          <span className="product-category">
            {categoryList.find(category =>
              String(category.id) === String(product.category_id)
            )?.[rtl ? 'name_ar' : 'name_en'] || 'NIZWA CAT'}
          </span>

          <h3>{title(product)}</h3>

          <div className="product-bottom">
            <strong>
              {Number(product.price || 0).toFixed(3)}
              <small>{t.currency}</small>
            </strong>

            <button
              className="add-btn"
              onClick={() => add(product)}
              aria-label={t.add}
            >
              <Plus size={18} />
            </button>
          </div>
        </div>
      </article>
    )
  }

  return (
    <div className={rtl ? 'app rtl' : 'app ltr'}>

      <style>{`
        .hero-photo {
          position: absolute;
          inset: 0;
          overflow: hidden;
        }

        .hero-photo img,
        .hero-photo video {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center 42%;
        }

        .hero-brand-lockup {
          position: absolute;
          z-index: 4;
          top: 30px;
          inset-inline-start: 7%;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 11px 16px;
          border: 1px solid rgba(255,255,255,.4);
          border-radius: 16px;
          color: #fff;
          background: rgba(20,32,22,.42);
          backdrop-filter: blur(12px);
          direction: ltr;
          font-size: 15px;
          font-weight: 700;
          letter-spacing: 1px;
        }

        .hero-brand-lockup b { color: #e5d2a5; }

        .hero-brand-lockup small {
          display: block;
          margin-top: 4px;
          text-align: center;
          font-size: 10px;
          letter-spacing: 0;
        }

        .hero-brand-lockup .brand-mark {
          width: 42px;
          height: 42px;
          display: grid;
          place-items: center;
          border-radius: 13px;
          color: white;
          background: rgba(255,255,255,.16);
        }

        .category-section {
          position: relative;
          isolation: isolate;
          padding-top: 75px;
          padding-bottom: 75px;
        }

        .category-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 20px;
          margin-top: 32px;
        }

        .category-card {
          position: relative;
          display: block;
          width: 100%;
          min-width: 0;
          height: 350px;
          padding: 0;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,.55);
          border-radius: 22px;
          background: #e9e5dc;
          text-align: inherit;
          cursor: pointer;
          isolation: isolate;
          box-shadow: 0 14px 35px rgba(28,39,28,.10);
          transition: transform .45s ease, box-shadow .45s ease;
        }

        .category-card > img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform .8s ease;
        }

        .category-card-overlay {
          position: absolute;
          inset: 0;
          z-index: 1;
          background: linear-gradient(180deg, rgba(12,20,13,.02) 15%, rgba(12,20,13,.85) 100%);
        }

        .category-card::after {
          content: "";
          position: absolute;
          inset: 10px;
          z-index: 2;
          border: 1px solid rgba(255,255,255,.38);
          border-radius: 15px;
          pointer-events: none;
        }

        .category-card-copy {
          position: absolute;
          z-index: 3;
          inset-inline: 23px;
          bottom: 24px;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          color: #fff;
          text-align: start;
        }

        .category-card-copy small {
          margin-bottom: 10px;
          color: rgba(255,255,255,.8);
          font-size: 10px;
          letter-spacing: 2px;
        }

        .category-card-copy b {
          margin-bottom: 10px;
          color: #fff;
          font-size: 20px;
        }

        .category-card-copy em {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #e5d2a5;
          font-size: 11px;
          font-style: normal;
        }

        .category-icon {
          position: absolute;
          z-index: 3;
          top: 23px;
          inset-inline-start: 23px;
          width: 50px;
          height: 50px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(255,255,255,.55);
          border-radius: 16px;
          color: #fff;
          background: rgba(255,255,255,.16);
          backdrop-filter: blur(12px);
        }

        .category-card.active {
          border-color: #b69b63;
          box-shadow: 0 18px 45px rgba(91,111,74,.25);
        }

        @media (hover:hover) {
          .category-card:hover {
            transform: translateY(-8px);
            box-shadow: 0 25px 50px rgba(28,39,28,.2);
          }

          .category-card:hover > img { transform: scale(1.1); }
        }

        @media (max-width: 900px) {
          .category-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .category-card { height: 290px; }
        }

        @media (max-width: 650px) {
          .hero-brand-lockup {
            top: 16px;
            inset-inline-start: 16px;
            font-size: 13px;
          }

          .hero-brand-lockup .brand-mark {
            width: 36px;
            height: 36px;
          }

          .category-section {
            padding-top: 55px;
            padding-bottom: 55px;
          }

          .category-grid {
            gap: 11px;
            margin-top: 23px;
          }

          .category-card {
            height: 225px;
            border-radius: 17px;
          }

          .category-card-copy {
            inset-inline: 14px;
            bottom: 16px;
          }

          .category-card-copy b { font-size: 14px; }
          .category-card-copy em { font-size: 9px; }

          .category-icon {
            top: 15px;
            inset-inline-start: 15px;
            width: 40px;
            height: 40px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .category-card,
          .category-card > img {
            transition: none !important;
          }
        }
      `}</style>

      <div className="announcement">
        {rtl
          ? 'كل احتياجات قطتك في مكان واحد · من عُمان بكل حب'
          : 'Your cat’s essentials in one place · Proudly in Oman'}
      </div>

      <header className="site-header">
        <a className="brand" href="#">
          <span className="brand-mark"><PawPrint size={22} /></span>
          <span>NIZWA <b>CAT</b><small>نزوى كت</small></span>
        </a>

        <nav className="desktop-nav">
          <a href="#home">{t.navHome}</a>
          <a href="#shop">{t.navShop}</a>
          <a href="#about">{t.navAbout}</a>
        </nav>

        <div className="header-actions">
          <button
            className="language-btn"
            onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
          >
            {lang === 'ar' ? 'EN' : 'عربي'}
          </button>

          <button
            className="icon-btn cart-trigger"
            onClick={() => setCartOpen(true)}
            aria-label={t.cart}
          >
            <ShoppingBag size={20} />
            <span>{count}</span>
          </button>

          <button
            className="mobile-menu-btn"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            {mobileOpen ? <X /> : <Menu />}
          </button>
        </div>

        {mobileOpen && (
          <nav className="mobile-nav">
            <a href="#home" onClick={() => setMobileOpen(false)}>{t.navHome}</a>
            <a href="#shop" onClick={() => setMobileOpen(false)}>{t.navShop}</a>
            <a href="#about" onClick={() => setMobileOpen(false)}>{t.navAbout}</a>
          </nav>
        )}
      </header>

      <main>
        <section className="hero" id="home">
          <div className="hero-photo">
            <img
              src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=1800"
              alt="A happy cat"
            />

            <video
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              poster="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=1800"
            >
              <source
                src="https://videos.pexels.com/video-files/5871756/5871756-hd_1920_1080_25fps.mp4"
                type="video/mp4"
              />
            </video>
          </div>

          <div className="hero-shade" />

          <a className="hero-brand-lockup" href="#home">
            <span className="brand-mark"><PawPrint size={22} /></span>
            <span>
              NIZWA <b>CAT</b>
              <small>نزوى كت</small>
            </span>
          </a>

          <div className="hero-content">
            <span className="hero-eyebrow">
              <Sparkles size={15} />
              {t.heroEyebrow}
            </span>

            <h1>
              {t.heroTitle}
              <br />
              <em>{t.heroTitle2}</em>
            </h1>

            <p>{t.heroText}</p>

            <div className="hero-actions">
              <a href="#shop" className="primary-btn">
                {t.shopNow}
                <ArrowUpRight size={17} />
              </a>

              <a href="#categories" className="hero-secondary">
                {t.explore}
              </a>
            </div>
          </div>

          <div className="hero-caption">
            <span>01</span>
            <i />
            NIZWA CAT · OMAN
          </div>
        </section>

        <section className="category-section section-wrap" id="categories">
          <div className="section-heading">
            <div>
              <span className="eyebrow">
                {rtl ? 'كل ما تحتاجه قطتك' : 'MADE FOR CATS'}
              </span>
              <h2>{t.categories}</h2>
            </div>

            <a href="#shop" className="text-link">
              {t.allProducts}
              <ArrowUpRight size={16} />
            </a>
          </div>

          <div className="category-grid">
            {categories.map((category, index) => {
              const visual = categoryVisuals.find(item => item.id === category.id)
                || categoryVisuals[index % categoryVisuals.length]

              const CategoryIcon = visual.icon

              return (
                <button
                  key={category.id}
                  className={
                    activeCat === category.id
                      ? 'category-card active'
                      : 'category-card'
                  }
                  onClick={() => {
                    setActiveCat(category.id)
                    document.querySelector('#shop')?.scrollIntoView({
                      behavior: 'smooth'
                    })
                  }}
                >
                  <img src={visual.image} alt={visual.alt} loading="lazy" />
                  <span className="category-card-overlay" />

                  <span className="category-icon">
                    <CategoryIcon size={22} strokeWidth={1.7} />
                  </span>

                  <span className="category-card-copy">
                    <small>{visual.number} / 04</small>
                    <b>
                      {rtl
                        ? (category.name_ar || category.name_en)
                        : (category.name_en || category.name_ar)}
                    </b>
                    <em>
                      {rtl ? 'اكتشف المنتجات' : 'Explore products'}
                      <ArrowUpRight size={15} />
                    </em>
                  </span>
                </button>
              )
            })}
          </div>
        </section>

        <section className="shop-section section-wrap" id="shop">
          <div className="section-heading">
            <div>
              <span className="eyebrow">
                {rtl ? 'اختيارات نزوى كت' : 'THE NIZWA EDIT'}
              </span>
              <h2>{t.featured}</h2>
              <p>{t.featuredText}</p>
            </div>

            <div className="shop-tools">
              <label className="search-box">
                <Search size={17} />
                <input
                  value={query}
                  onChange={event => setQuery(event.target.value)}
                  placeholder={t.search}
                />
              </label>
            </div>
          </div>

          <div className="product-grid">
            {visibleProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {!visibleProducts.length && (
            <p className="empty-products">{t.noProducts}</p>
          )}
        </section>

        <section className="trust-section">
          <div className="trust-inner">
            <div className="trust-item">
              <span className="trust-icon"><ShieldCheck size={23} /></span>
              <div>
                <b>{rtl ? 'منتجات مختارة بعناية' : 'Carefully selected'}</b>
                <small>{rtl ? 'خيارات تناسب احتياجات قطتك' : 'Products for your cat’s needs'}</small>
              </div>
            </div>

            <div className="trust-item">
              <span className="trust-icon"><Truck size={23} /></span>
              <div>
                <b>{rtl ? 'التوصيل داخل عُمان' : 'Delivery in Oman'}</b>
                <small>{rtl ? 'اسألنا عن خيارات التوصيل' : 'Ask us about delivery options'}</small>
              </div>
            </div>

            <div className="trust-item">
              <span className="trust-icon"><Headphones size={23} /></span>
              <div>
                <b>{rtl ? 'نحن هنا لمساعدتك' : 'Here to help'}</b>
                <small>{rtl ? 'تواصل معنا عبر واتساب' : 'Message us on WhatsApp'}</small>
              </div>
            </div>
          </div>
        </section>

        <section className="about-section" id="about">
          <div className="about-image">
            <img
              src="https://images.unsplash.com/photo-1511044568932-338cba0ad803?w=1200"
              alt="A relaxed cat"
              loading="lazy"
            />
          </div>

          <div className="about-copy">
            <span className="eyebrow">
              {rtl ? 'حكاية نزوى كت' : 'A LITTLE ABOUT US'}
            </span>

            <h2>
              {t.aboutTitle}
              <br />
              <em>{t.aboutTitle2}</em>
            </h2>

            <p>{t.aboutText}</p>

            <a
              href="https://www.instagram.com/nizwa.cat/"
              target="_blank"
              rel="noreferrer"
              className="text-link"
            >
              <Instagram size={17} />
              @nizwa.cat
              <ArrowUpRight size={16} />
            </a>
          </div>
        </section>
      </main>

      <footer className="footer">
        <a className="brand footer-brand" href="#">
          <span className="brand-mark"><PawPrint size={20} /></span>
          <span>NIZWA <b>CAT</b><small>نزوى كت</small></span>
        </a>

        <span>© {new Date().getFullYear()} NIZWA CAT · OMAN</span>

        <div>
          <a
            href="https://www.instagram.com/nizwa.cat/"
            target="_blank"
            rel="noreferrer"
            aria-label="Instagram"
          >
            <Instagram size={18} />
          </a>

          <a
            href={`https://wa.me/${WA}`}
            target="_blank"
            rel="noreferrer"
            aria-label="WhatsApp"
          >
            <MessageCircle size={18} />
          </a>

          <button
            onClick={() => setAdminOpen(true)}
            className="admin-link"
          >
            {t.admin}
          </button>
        </div>
      </footer>

      {selected && (
        <div className="overlay" onClick={() => setSelected(null)}>
          <div className="detail-modal" onClick={event => event.stopPropagation()}>
            <button className="close-btn" onClick={() => setSelected(null)}>
              <X />
            </button>

            <img src={selected.image_url} alt={title(selected)} />

            <div className="detail-copy">
              <span className="eyebrow">NIZWA CAT</span>
              <h2>{title(selected)}</h2>
              <p>{description(selected)}</p>

              <strong className="price">
                {Number(selected.price || 0).toFixed(3)} {t.currency}
              </strong>

              <button className="primary-btn" onClick={() => add(selected)}>
                {t.add}
                <Plus size={17} />
              </button>
            </div>
          </div>
        </div>
      )}

      {cartOpen && (
        <div
          className="overlay drawer-overlay"
          onClick={() => {
            setCartOpen(false)
            setCheckout(false)
          }}
        >
          <aside className="cart-drawer" onClick={event => event.stopPropagation()}>
            <div className="drawer-head">
              <h2>{t.cart}</h2>

              <button
                className="close-btn"
                onClick={() => {
                  setCartOpen(false)
                  setCheckout(false)
                }}
              >
                <X />
              </button>
            </div>

            {!cart.length ? (
              <div className="empty-cart">
                <ShoppingBag size={36} />
                <p>{t.empty}</p>

                <button
                  className="text-link"
                  onClick={() => setCartOpen(false)}
                >
                  {t.shopNow}
                </button>
              </div>
            ) : (
              <>
                <div className="cart-items">
                  {cart.map(item => (
                    <div className="cart-item" key={item.id}>
                      <img src={item.image_url} alt={title(item)} />

                      <div className="cart-item-info">
                        <b>{title(item)}</b>
                        <span>{Number(item.price).toFixed(3)} {t.currency}</span>

                        <div className="qty">
                          <button onClick={() => changeQty(item.id, -1)}>
                            <Minus size={13} />
                          </button>

                          <span>{item.qty}</span>

                          <button onClick={() => changeQty(item.id, 1)}>
                            <Plus size={13} />
                          </button>
                        </div>
                      </div>

                      <strong>
                        {(Number(item.price) * item.qty).toFixed(3)}
                      </strong>
                    </div>
                  ))}
                </div>

                <div className="cart-summary">
                  <div className="sum-row">
                    <span>{t.subtotal}</span>
                    <b>{total.toFixed(3)} {t.currency}</b>
                  </div>

                  {!checkout ? (
                    <button
                      className="primary-btn full"
                      onClick={() => setCheckout(true)}
                    >
                      {rtl ? 'متابعة الطلب' : 'Continue to order'}
                      <ArrowUpRight size={17} />
                    </button>
                  ) : (
                    <form
                      className="checkout-form"
                      onSubmit={event => {
                        event.preventDefault()
                        sendWhatsApp()
                      }}
                    >
                      <label>{t.delivery}</label>

                      <div className="delivery-options">
                        <button
                          type="button"
                          className={delivery === 'office' ? 'selected' : ''}
                          onClick={() => setDelivery('office')}
                        >
                          {t.office}
                        </button>

                        <button
                          type="button"
                          className={delivery === 'home' ? 'selected' : ''}
                          onClick={() => setDelivery('home')}
                        >
                          {t.home}
                        </button>
                      </div>

                      <input
                        required
                        placeholder={t.name}
                        value={customer.name}
                        onChange={event =>
                          setCustomer({ ...customer, name: event.target.value })
                        }
                      />

                      <input
                        required
                        placeholder={t.phone}
                        value={customer.phone}
                        onChange={event =>
                          setCustomer({ ...customer, phone: event.target.value })
                        }
                      />

                      <textarea
                        placeholder={t.notes}
                        value={customer.notes}
                        onChange={event =>
                          setCustomer({ ...customer, notes: event.target.value })
                        }
                      />

                      <p className="delivery-note">{t.deliveryNote}</p>

                      {notice && <p className="notice">{notice}</p>}

                      <button className="primary-btn full" type="submit">
                        <MessageCircle size={17} />
                        {t.send}
                      </button>
                    </form>
                  )}
                </div>
              </>
            )}
          </aside>
        </div>
      )}

      {adminOpen && (
        <div className="overlay" onClick={() => setAdminOpen(false)}>
          <div className="admin-modal" onClick={event => event.stopPropagation()}>
            <div className="drawer-head">
              <h2>{t.admin}</h2>

              <button
                className="close-btn"
                onClick={() => setAdminOpen(false)}
              >
                <X />
              </button>
            </div>

            {!isSupabaseConfigured ? (
              <div className="admin-warning">
                <AlertCircle />
                <p>{t.config}</p>
                <small>{t.adminHint}</small>
              </div>
            ) : !session ? (
              <form className="admin-login" onSubmit={signIn}>
                <h3>{t.login}</h3>

                <input
                  type="email"
                  required
                  placeholder={t.email}
                  value={auth.email}
                  onChange={event =>
                    setAuth({ ...auth, email: event.target.value })
                  }
                />

                <input
                  type="password"
                  required
                  placeholder={t.password}
                  value={auth.password}
                  onChange={event =>
                    setAuth({ ...auth, password: event.target.value })
                  }
                />

                <button className="primary-btn full">
                  {t.signIn}
                  <LogIn size={16} />
                </button>

                {notice && <p className="notice">{notice}</p>}
              </form>
            ) : (
              <div className="admin-content">
                <div className="admin-tabs">
                  <button
                    className={adminTab === 'products' ? 'active' : ''}
                    onClick={() => setAdminTab('products')}
                  >
                    <Package size={15} />
                    {t.products}
                  </button>

                  <button
                    className={adminTab === 'categories' ? 'active' : ''}
                    onClick={() => setAdminTab('categories')}
                  >
                    <Tags size={15} />
                    {t.categoriesAdmin}
                  </button>

                  <button onClick={signOut}>
                    <LogOut size={15} />
                    {rtl ? 'تسجيل الخروج' : 'Sign out'}
                  </button>
                </div>

                {adminTab === 'products' ? (
                  <>
                    <button
                      className="primary-btn full"
                      onClick={() => setEditing({})}
                    >
                      <Plus size={16} />
                      {t.addProduct}
                    </button>

                    {products.map(product => (
                      <div className="admin-row" key={product.id}>
                        <img src={product.image_url} alt="" />
                        <span>{title(product)}</span>

                        <button onClick={() => setEditing(product)}>
                          <Edit3 size={16} />
                        </button>

                        <button onClick={() => deleteProduct(product.id)}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </>
                ) : (
                  <CategoryManager
                    categories={categories}
                    onDone={loadStore}
                    t={t}
                  />
                )}
              </div>
            )}

            {editing && (
              <div className="edit-panel">
                <form onSubmit={saveProduct}>
                  <h3>{editing.id ? t.edit : t.addProduct}</h3>

                  <input
                    name="name_en"
                    defaultValue={editing.name_en || ''}
                    placeholder={t.nameEn}
                    required
                  />

                  <input
                    name="name_ar"
                    defaultValue={editing.name_ar || ''}
                    placeholder={t.nameAr}
                  />

                  <textarea
                    name="description_en"
                    defaultValue={editing.description_en || ''}
                    placeholder="Description (English)"
                  />

                  <textarea
                    name="description_ar"
                    defaultValue={editing.description_ar || ''}
                    placeholder="الوصف بالعربية"
                  />

                  <input
                    name="price"
                    type="number"
                    step="0.001"
                    min="0"
                    defaultValue={editing.price ?? ''}
                    placeholder={t.price}
                    required
                  />

                  <input
                    name="image_url"
                    defaultValue={editing.image_url || ''}
                    placeholder={t.image}
                  />

                  <label className="file-label">
                    {rtl
                      ? 'أو اختر صورة من هاتفك'
                      : 'Or choose an image from your phone'}

                    <input
                      name="image_file"
                      type="file"
                      accept="image/*"
                    />
                  </label>

                  <select
                    name="category_id"
                    defaultValue={editing.category_id || ''}
                  >
                    <option value="">{t.category}</option>

                    {categories.map(category => (
                      <option value={category.id} key={category.id}>
                        {category.name_en || category.name_ar}
                      </option>
                    ))}
                  </select>

                  <label className="check-label">
                    <input
                      name="featured"
                      type="checkbox"
                      defaultChecked={!!editing.featured}
                    />
                    {t.featuredLabel}
                  </label>

                  <div className="form-actions">
                    <button
                      type="button"
                      className="secondary-btn"
                      onClick={() => setEditing(null)}
                    >
                      {t.cancel}
                    </button>

                    <button className="primary-btn">
                      {t.save}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function CategoryManager({ categories, onDone, t }) {
  const [en, setEn] = useState('')
  const [ar, setAr] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  async function addCategory(event) {
    event.preventDefault()
    if (!supabase) return

    const { error } = await supabase
      .from('categories')
      .insert({ name_en: en, name_ar: ar })

    if (error) {
      setErrorMessage(error.message)
    } else {
      setEn('')
      setAr('')
      setErrorMessage('')
      onDone()
    }
  }

  async function deleteCategory(id) {
    if (!supabase) return

    const confirmed = window.confirm('Delete this category?')
    if (!confirmed) return

    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id)

    if (error) setErrorMessage(error.message)
    else onDone()
  }

  return (
    <div className="category-admin">
      <form onSubmit={addCategory}>
        <input
          value={en}
          onChange={event => setEn(event.target.value)}
          placeholder={t.nameEn}
          required
        />

        <input
          value={ar}
          onChange={event => setAr(event.target.value)}
          placeholder={t.nameAr}
        />

        <button className="primary-btn full">
          {t.save}
        </button>
      </form>

      {categories.map(category => (
        <div className="admin-row" key={category.id}>
          <span>{category.name_en} / {category.name_ar}</span>

          <button onClick={() => deleteCategory(category.id)}>
            <Trash2 size={16} />
          </button>
        </div>
      ))}

      {errorMessage && <p className="notice">{errorMessage}</p>}
    </div>
  )
}

export default App
