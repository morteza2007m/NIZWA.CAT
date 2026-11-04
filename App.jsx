import React, { useEffect, useMemo, useState } from 'react'
import {
  Search, ShoppingBag, Menu, X, Instagram, MessageCircle,
  ChevronDown, Plus, Minus, ArrowUpRight, PawPrint,
  SlidersHorizontal, LogIn, LogOut, Package, Tags,
  ImagePlus, Trash2, Edit3, Check, AlertCircle, Truck,
  ShieldCheck, Headphones, Sparkles, Bone, Gamepad2,
  Heart, ShoppingBasket
} from 'lucide-react'

import { isSupabaseConfigured, supabase } from './supabase.js'

const WA = (import.meta.env.VITE_WHATSAPP_NUMBER || '96871394358').replace(/\D/g, '')

const demoCategories = [
  { id: 'all', name_en: 'All products', name_ar: 'كل المنتجات' },
  { id: 'food', name_en: 'Food & treats', name_ar: 'الأكل والمكافآت' },
  { id: 'toys', name_en: 'Toys & play', name_ar: 'الألعاب والتسلية' },
  { id: 'care', name_en: 'Care & hygiene', name_ar: 'العناية والنظافة' },
  { id: 'accessories', name_en: 'Accessories', name_ar: 'الإكسسوارات' }
]

const demoProducts = [
  {
    id: 'p1',
    name_en: 'Daily comfort bowl',
    name_ar: 'وعاء طعام يومي',
    description_en: 'A simple, elegant bowl for everyday meals.',
    description_ar: 'وعاء أنيق وعملي لوجبات قطتك اليومية.',
    price: 4.5,
    category_id: 'accessories',
    image_url: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=900',
    featured: true
  },
  {
    id: 'p2',
    name_en: 'Playful cat toy',
    name_ar: 'لعبة مرحة للقطط',
    description_en: 'A little playtime goes a long way.',
    description_ar: 'وقت لعب ممتع يضيف لحظات حلوة ليوم قطتك.',
    price: 2.8,
    category_id: 'toys',
    image_url: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=900',
    featured: true
  },
  {
    id: 'p3',
    name_en: 'Cozy cat essentials',
    name_ar: 'أساسيات راحة قطتك',
    description_en: 'Thoughtful essentials for a cozy corner.',
    description_ar: 'اختيارات لطيفة لركن مريح وآمن لقطتك.',
    price: 8.0,
    category_id: 'care',
    image_url: 'https://images.unsplash.com/photo-1511044568932-338cba0ad803?w=900',
    featured: false
  },
  {
    id: 'p4',
    name_en: 'Treat time',
    name_ar: 'وقت المكافآت',
    description_en: 'A tasty little reward for your best friend.',
    description_ar: 'مكافأة لذيذة لصديقك المشاغب.',
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
    alt: 'Premium cat food',
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
    alt: 'Cat grooming and care',
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
    navAbout: 'عن المتجر',
    search: 'ابحث عن منتج...',
    heroEyebrow: 'كل التفاصيل الصغيرة تصنع فرقاً',
    heroTitle: 'عالم قطتك،',
    heroTitle2: 'اختير بحب.',
    heroText: 'من التغذية اليومية إلى اللعب والراحة، اكتشف مستلزمات مختارة بعناية لقطتك، مع تجربة تسوّق سهلة من عُمان.',
    shopNow: 'تسوّق الآن',
    explore: 'اكتشف المجموعة',
    categories: 'تسوّق حسب الفئة',
    featured: 'الأكثر تميزاً لقطتك',
    featuredText: 'منتجات نحبها، لتفاصيل يوم أجمل مع قطتك.',
    allProducts: 'كل المنتجات',
    add: 'أضف للسلة',
    details: 'التفاصيل',
    aboutTitle: 'رفاهية صغيرة،',
    aboutTitle2: 'وسعادة كبيرة.',
    aboutText: 'NIZWA CAT متجر إلكتروني في عُمان، نختار فيه مستلزمات القطط بعناية وحب. هدفنا نخلي تجربة التسوق لك ولقطتك أسهل وأجمل.',
    cart: 'سلة التسوق',
    empty: 'سلتك فاضية حالياً',
    subtotal: 'المجموع التقريبي',
    delivery: 'طريقة الاستلام',
    office: 'استلام من المكتب',
    home: 'توصيل للبيت',
    name: 'اسمك',
    phone: 'رقم هاتفك',
    notes: 'ملاحظات إضافية (اختياري)',
    send: 'إرسال الطلب عبر واتساب',
    deliveryNote: 'تكلفة التوصيل تعتمد على وزن الطلب ونتفق عليها معك بشكل منفصل. ما فيه دفع عند الاستلام.',
    close: 'إغلاق',
    admin: 'الإدارة',
    login: 'دخول الإدارة',
    email: 'البريد الإلكتروني',
    password: 'كلمة المرور',
    signIn: 'تسجيل الدخول',
    products: 'المنتجات',
    categoriesAdmin: 'الفئات',
    orders: 'الطلبات',
    addProduct: 'إضافة منتج',
    save: 'حفظ',
    cancel: 'إلغاء',
    nameAr: 'الاسم بالعربي',
    nameEn: 'الاسم بالإنجليزي',
    price: 'السعر (ر.ع)',
    image: 'رابط صورة المنتج',
    category: 'الفئة',
    description: 'الوصف',
    featuredLabel: 'منتج مميز',
    delete: 'حذف',
    edit: 'تعديل',
    noProducts: 'ما فيه منتجات في هالفئة حالياً',
    config: 'المتجر في وضع المعاينة. سيتم ربط البيانات بعد إعداد Supabase.',
    adminHint: 'لإدارة المنتجات، سجّل الدخول بحساب أنشأته في Supabase Authentication.',
    saved: 'تم الحفظ',
    required: 'يرجى تعبئة الاسم والسعر.',
    currency: 'ر.ع'
  },

  en: {
    navHome: 'Home',
    navShop: 'Shop',
    navAbout: 'Our story',
    search: 'Search products...',
    heroEyebrow: 'THE LITTLE THINGS MATTER',
    heroTitle: 'A happier world,',
    heroTitle2: 'for your cat.',
    heroText: 'From everyday nutrition to playtime and comfort, discover thoughtfully selected essentials for your cat, with an easy shopping experience in Oman.',
    shopNow: 'Shop now',
    explore: 'Explore the collection',
    categories: 'Shop by category',
    featured: 'Favourites for your cat',
    featuredText: 'Thoughtfully chosen products for happier everyday moments.',
    allProducts: 'All products',
    add: 'Add to bag',
    details: 'Details',
    aboutTitle: 'Little luxuries,',
    aboutTitle2: 'big happiness.',
    aboutText: 'NIZWA CAT is an online store in Oman, bringing together thoughtfully selected essentials for cats. We make shopping for you and your cat simple and delightful.',
    cart: 'Your bag',
    empty: 'Your bag is empty for now',
    subtotal: 'Estimated subtotal',
    delivery: 'Collection method',
    office: 'Collect from office',
    home: 'Home delivery',
    name: 'Your name',
    phone: 'Phone number',
    notes: 'Additional notes (optional)',
    send: 'Send order via WhatsApp',
    deliveryNote: 'Delivery cost depends on order weight and will be agreed separately. Cash on delivery is not available.',
    close: 'Close',
    admin: 'Admin',
    login: 'Admin sign in',
    email: 'Email',
    password: 'Password',
    signIn: 'Sign in',
    products: 'Products',
    categoriesAdmin: 'Categories',
    orders: 'Orders',
    addProduct: 'Add product',
    save: 'Save',
    cancel: 'Cancel',
    nameAr: 'Arabic name',
    nameEn: 'English name',
    price: 'Price (OMR)',
    image: 'Product image URL',
    category: 'Category',
    description: 'Description',
    featuredLabel: 'Featured product',
    delete: 'Delete',
    edit: 'Edit',
    noProducts: 'No products in this category yet',
    config: 'Preview mode is active. Your store data will connect after Supabase setup.',
    adminHint: 'To manage products, sign in with a user created in Supabase Authentication.',
    saved: 'Saved',
    required: 'Please enter a name and price.',
    currency: 'OMR'
  }
}

function App() {
  const [lang, setLang] = useState('ar')
  const [products, setProducts] = useState(demoProducts)
  const [categories, setCategories] = useState(demoCategories.slice(1))
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
    } = supabase.auth.onAuthStateChange((_e, s) => setSession(s))

    return () => subscription.unsubscribe()
  }, [])

  async function loadStore() {
    const [
      { data: p, error: pe },
      { data: c, error: ce }
    ] = await Promise.all([
      supabase.from('products').select('*').order('created_at', { ascending: false }),
      supabase.from('categories').select('*').order('name_en')
    ])

    if (!pe && p?.length) setProducts(p)
    if (!ce && c?.length) setCategories(c)
  }

  const categoryList = [
    { id: 'all', name_en: 'All products', name_ar: 'كل المنتجات' },
    ...categories
  ]

  const filtered = useMemo(() => products.filter(p =>
    (activeCat === 'all' || String(p.category_id) === String(activeCat)) &&
    (`${p.name_en || ''} ${p.name_ar || ''}`).toLowerCase().includes(query.toLowerCase())
  ), [products, activeCat, query])

  const featured = products.filter(p => p.featured)
  const count = cart.reduce((s, i) => s + i.qty, 0)
  const total = cart.reduce((s, i) => s + Number(i.price || 0) * i.qty, 0)

  const title = (p) => rtl
    ? (p.name_ar || p.name_en)
    : (p.name_en || p.name_ar)

  const description = (p) => rtl
    ? (p.description_ar || p.description_en)
    : (p.description_en || p.description_ar)

  function add(p) {
    setCart(old => {
      const found = old.find(x => x.id === p.id)

      return found
        ? old.map(x => x.id === p.id ? { ...x, qty: x.qty + 1 } : x)
        : [...old, { ...p, qty: 1 }]
    })

    setSelected(null)
    setCartOpen(true)
  }

  function changeQty(id, d) {
    setCart(old =>
      old
        .map(x => x.id === id ? { ...x, qty: x.qty + d } : x)
        .filter(x => x.qty > 0)
    )
  }

  function sendWhatsApp() {
    if (!customer.name.trim() || !customer.phone.trim()) {
      setNotice(t.required)
      return
    }

    const lines = cart.map(i =>
      `• ${title(i)} × ${i.qty} = ${(Number(i.price) * i.qty).toFixed(3)} OMR`
    )

    const method = delivery === 'office'
      ? (rtl ? 'استلام من المكتب' : 'Collect from office')
      : (rtl ? 'توصيل للبيت' : 'Home delivery')

    const msg = [
      `NIZWA CAT | ${rtl ? 'طلب جديد' : 'New order'}`,
      `${rtl ? 'الاسم' : 'Name'}: ${customer.name}`,
      `${rtl ? 'الهاتف' : 'Phone'}: ${customer.phone}`,
      `${rtl ? 'طريقة الاستلام' : 'Collection'}: ${method}`,
      '',
      ...lines,
      '',
      `${rtl ? 'المجموع التقريبي' : 'Estimated subtotal'}: ${total.toFixed(3)} OMR`,
      rtl
        ? 'التوصيل غير محسوب. يتم تحديد التكلفة حسب الوزن والاتفاق بشكل منفصل.'
        : 'Delivery is not included. Cost will be agreed separately based on weight.',
      customer.notes ? `${rtl ? 'ملاحظات' : 'Notes'}: ${customer.notes}` : ''
    ].join('\n')

    window.open(`https://wa.me/${WA}?text=${encodeURIComponent(msg)}`, '_blank')
  }

  async function signIn(e) {
    e.preventDefault()

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
    await supabase.auth.signOut()
    setSession(null)
  }

  async function saveProduct(e) {
    e.preventDefault()

    const f = new FormData(e.currentTarget)

    const payload = {
      name_en: f.get('name_en'),
      name_ar: f.get('name_ar'),
      description_en: f.get('description_en'),
      description_ar: f.get('description_ar'),
      price: Number(f.get('price')),
      category_id: f.get('category_id') || null,
      image_url: f.get('image_url'),
      featured: f.get('featured') === 'on'
    }

    const file = f.get('image_file')

    if (file && file.size && supabase) {
      const ext = file.name.split('.').pop()
      const path = `${Date.now()}.${ext}`

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
    loadStore()
  }

  async function deleteProduct(id) {
    if (!confirm(rtl ? 'هل تريد حذف هذا المنتج؟' : 'Delete this product?')) return

    const { error } = await supabase.from('products').delete().eq('id', id)

    if (error) setNotice(error.message)
    else loadStore()
  }

  function ProductCard({ p }) {
    return (
      <article className="product-card">
        <button className="product-image" onClick={() => setSelected(p)}>
          <img src={p.image_url} alt={title(p)} loading="lazy" />

          {p.featured && (
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
            {categoryList.find(c => String(c.id) === String(p.category_id))?.[rtl ? 'name_ar' : 'name_en'] || 'NIZWA CAT'}
          </span>

          <h3>{title(p)}</h3>

          <div className="product-bottom">
            <strong>
              {Number(p.price || 0).toFixed(3)}
              <small>{t.currency}</small>
            </strong>

            <button className="add-btn" onClick={() => add(p)} aria-label={t.add}>
              <Plus size={18} />
            </button>
          </div>
        </div>
      </article>
    )
  }

  return (
    <div className={rtl ? 'app rtl' : 'app ltr'}>

      {/* Premium category design */}
      <style>{`
        .category-section {
          position: relative;
          isolation: isolate;
          padding-top: 85px;
          padding-bottom: 85px;
        }

        .category-section::before {
          content: "";
          position: absolute;
          width: 360px;
          height: 360px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(190,160,100,.13), transparent 70%);
          top: 20px;
          left: -130px;
          z-index: -1;
          pointer-events: none;
        }

        .category-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 22px;
          perspective: 1200px;
          margin-top: 34px;
        }

        .category-card {
          position: relative;
          display: block;
          width: 100%;
          min-width: 0;
          height: 360px;
          padding: 0;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,.55);
          border-radius: 22px;
          background: #e9e5dc;
          text-align: inherit;
          cursor: pointer;
          isolation: isolate;
          box-shadow: 0 14px 35px rgba(28,39,28,.10);
          transform-style: preserve-3d;
          transition:
            transform .55s cubic-bezier(.2,.8,.2,1),
            box-shadow .55s ease,
            border-color .35s ease;
          animation: categoryEnter .8s both;
        }

        .category-card:nth-child(2) { animation-delay: .08s; }
        .category-card:nth-child(3) { animation-delay: .16s; }
        .category-card:nth-child(4) { animation-delay: .24s; }

        @keyframes categoryEnter {
          from { opacity: 0; transform: translateY(28px) scale(.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        .category-card > img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform .9s cubic-bezier(.2,.8,.2,1), filter .6s ease;
        }

        .category-card-overlay {
          position: absolute;
          inset: 0;
          z-index: 1;
          background:
            linear-gradient(180deg, rgba(12,20,13,.02) 15%, rgba(12,20,13,.18) 42%, rgba(12,20,13,.88) 100%);
          transition: background .4s ease;
        }

        .category-card::after {
          content: "";
          position: absolute;
          inset: 10px;
          border: 1px solid rgba(255,255,255,.38);
          border-radius: 15px;
          z-index: 2;
          pointer-events: none;
          transition: inset .4s ease, border-color .4s ease;
        }

        .category-card-copy {
          position: absolute;
          z-index: 3;
          inset-inline: 25px;
          bottom: 25px;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          color: #fff;
          text-align: start;
          transform: translateZ(35px);
        }

        .category-card-copy small {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 10px;
          letter-spacing: 2px;
          color: rgba(255,255,255,.78);
          margin-bottom: 12px;
          font-weight: 700;
        }

        .category-card-copy b {
          font-size: clamp(17px, 1.7vw, 23px);
          line-height: 1.35;
          font-weight: 700;
          color: #fff;
          margin-bottom: 12px;
          text-shadow: 0 2px 12px rgba(0,0,0,.15);
        }

        .category-card-copy em {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          font-style: normal;
          font-weight: 600;
          color: #e5d2a5;
          transition: gap .3s ease;
        }

        .category-icon {
          position: absolute;
          z-index: 3;
          top: 25px;
          inset-inline-start: 25px;
          width: 54px;
          height: 54px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(255,255,255,.55);
          border-radius: 18px;
          color: #fff;
          background: rgba(255,255,255,.16);
          backdrop-filter: blur(12px);
          box-shadow: 0 8px 24px rgba(0,0,0,.12);
          transform: translateZ(45px);
          transition: transform .45s ease, background .4s ease;
        }

        .category-card.active {
          border-color: #b69b63;
          box-shadow: 0 18px 45px rgba(91,111,74,.25);
        }

        .category-card.active::after {
          border-color: #e5d2a5;
          inset: 7px;
        }

        @media (hover: hover) {
          .category-card:hover {
            transform: translateY(-10px) rotateX(2deg) rotateY(-2deg);
            box-shadow: 0 28px 55px rgba(28,39,28,.22);
          }

          .category-card:hover > img {
            transform: scale(1.12);
            filter: saturate(1.12);
          }

          .category-card:hover .category-icon {
            transform: translateZ(55px) rotate(-8deg) scale(1.08);
            background: rgba(255,255,255,.27);
          }

          .category-card:hover .category-card-copy em {
            gap: 14px;
          }
        }

        .category-card:focus-visible {
          outline: 3px solid #b69b63;
          outline-offset: 5px;
        }

        @media (max-width: 900px) {
          .category-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 16px;
          }

          .category-card {
            height: 310px;
          }
        }

        @media (max-width: 520px) {
          .category-section {
            padding-top: 55px;
            padding-bottom: 55px;
          }

          .category-grid {
            gap: 12px;
            margin-top: 24px;
          }

          .category-card {
            height: 245px;
            border-radius: 17px;
          }

          .category-card::after {
            inset: 7px;
            border-radius: 12px;
          }

          .category-card-copy {
            inset-inline: 15px;
            bottom: 17px;
          }

          .category-card-copy small {
            font-size: 9px;
            margin-bottom: 7px;
          }

          .category-card-copy b {
            font-size: 15px;
            margin-bottom: 8px;
          }

          .category-card-copy em {
            font-size: 10px;
          }

          .category-icon {
            top: 16px;
            inset-inline-start: 15px;
            width: 42px;
            height: 42px;
            border-radius: 14px;
          }

          .category-icon svg {
            width: 19px;
            height: 19px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .category-card,
          .category-card > img,
          .category-icon,
          .category-card-copy em {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>

      <div className="announcement">
        {rtl
          ? 'تجربة تسوّق لطيفة لك ولقطتك · من عُمان بكل حب'
          : 'A little more joy for your cat · Thoughtfully selected in Oman'}
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
              alt="Beautiful cat"
            />
          </div>

          <div className="hero-shade" />

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

        {/* PREMIUM CATEGORY SECTION */}
        <section className="category-section section-wrap" id="categories">
          <div className="section-heading">
            <div>
              <span className="eyebrow">
                {rtl ? 'عالم من الاختيارات' : 'CURATED FOR CATS'}
              </span>
              <h2>{t.categories}</h2>
            </div>

            <a href="#shop" className="text-link">
              {t.allProducts}
              <ArrowUpRight size={16} />
            </a>
          </div>

          <div className="category-grid">
            {categories.map((c, i) => {
              const visual = categoryVisuals.find(v => v.id === c.id)
                || categoryVisuals[i % categoryVisuals.length]

              const CategoryIcon = visual.icon

              return (
                <button
                  key={c.id}
                  className={
                    activeCat === c.id
                      ? 'category-card active'
                      : 'category-card'
                  }
                  onClick={() => {
                    setActiveCat(c.id)
                    document.querySelector('#shop')?.scrollIntoView({
                      behavior: 'smooth'
                    })
                  }}
                >
                  <img
                    src={visual.image}
                    alt={visual.alt}
                    loading="lazy"
                  />

                  <span className="category-card-overlay" />

                  <span className="category-icon">
                    <CategoryIcon size={23} strokeWidth={1.7} />
                  </span>

                  <span className="category-card-copy">
                    <small>{visual.number} / 04</small>

                    <b>
                      {rtl
                        ? (c.name_ar || c.name_en)
                        : (c.name_en || c.name_ar)}
                    </b>

                    <em>
                      {rtl ? 'اكتشف المجموعة' : 'Explore collection'}
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
                {rtl ? 'اختيارات بعناية' : 'THE NIZWA EDIT'}
              </span>

              <h2>{t.featured}</h2>
              <p>{t.featuredText}</p>
            </div>

            <div className="shop-tools">
              <label className="search-box">
                <Search size={17} />
                <input
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder={t.search}
                />
              </label>
            </div>
          </div>

          <div className="product-grid">
            {(query || activeCat !== 'all'
              ? filtered
              : (featured.length ? featured : products)
            ).map(p => (
              <ProductCard key={p.id} p={p} />
            ))}
          </div>

          {!filtered.length && (
            <p className="empty-products">{t.noProducts}</p>
          )}
        </section>

        <section className="trust-section" aria-label={rtl ? 'مميزات المتجر' : 'Store benefits'}>
          <div className="trust-inner">
            <div className="trust-item">
              <span className="trust-icon"><ShieldCheck size={23} /></span>
              <div>
                <b>{rtl ? 'اختيارات بعناية' : 'Thoughtful selection'}</b>
                <small>{rtl ? 'منتجات نختارها لراحة قطتك' : 'Products chosen with care'}</small>
              </div>
            </div>

            <div className="trust-item">
              <span className="trust-icon"><Truck size={23} /></span>
              <div>
                <b>{rtl ? 'توصيل داخل عُمان' : 'Delivery across Oman'}</b>
                <small>{rtl ? 'تواصل معنا لمعرفة تفاصيل التوصيل' : 'Ask us about delivery options'}</small>
              </div>
            </div>

            <div className="trust-item">
              <span className="trust-icon"><Headphones size={23} /></span>
              <div>
                <b>{rtl ? 'نحن هنا لمساعدتك' : 'Here to help'}</b>
                <small>{rtl ? 'دعم سريع عبر واتساب' : 'Quick support on WhatsApp'}</small>
              </div>
            </div>
          </div>
        </section>

        <section className="about-section" id="about">
          <div className="about-image">
            <img
              src="https://images.unsplash.com/photo-1511044568932-338cba0ad803?w=1200"
              alt="Cat resting"
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
          >
            <Instagram size={18} />
          </a>

          <a
            href={`https://wa.me/${WA}`}
            target="_blank"
            rel="noreferrer"
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
          <div className="detail-modal" onClick={e => e.stopPropagation()}>
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
          <aside className="cart-drawer" onClick={e => e.stopPropagation()}>
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
                  {cart.map(i => (
                    <div className="cart-item" key={i.id}>
                      <img src={i.image_url} alt="" />

                      <div className="cart-item-info">
                        <b>{title(i)}</b>
                        <span>{Number(i.price).toFixed(3)} {t.currency}</span>

                        <div className="qty">
                          <button onClick={() => changeQty(i.id, -1)}>
                            <Minus size={13} />
                          </button>

                          <span>{i.qty}</span>

                          <button onClick={() => changeQty(i.id, 1)}>
                            <Plus size={13} />
                          </button>
                        </div>
                      </div>

                      <strong>
                        {(Number(i.price) * i.qty).toFixed(3)}
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
                      onSubmit={e => {
                        e.preventDefault()
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
                        onChange={e => setCustomer({ ...customer, name: e.target.value })}
                      />

                      <input
                        required
                        placeholder={t.phone}
                        value={customer.phone}
                        onChange={e => setCustomer({ ...customer, phone: e.target.value })}
                      />

                      <textarea
                        placeholder={t.notes}
                        value={customer.notes}
                        onChange={e => setCustomer({ ...customer, notes: e.target.value })}
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
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
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
                  onChange={e => setAuth({ ...auth, email: e.target.value })}
                />

                <input
                  type="password"
                  required
                  placeholder={t.password}
                  value={auth.password}
                  onChange={e => setAuth({ ...auth, password: e.target.value })}
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
                    {rtl ? 'خروج' : 'Sign out'}
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

                    {products.map(p => (
                      <div className="admin-row" key={p.id}>
                        <img src={p.image_url} alt="" />
                        <span>{title(p)}</span>

                        <button onClick={() => setEditing(p)}>
                          <Edit3 size={16} />
                        </button>

                        <button onClick={() => deleteProduct(p.id)}>
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
                    placeholder="الوصف بالعربي"
                  />

                  <input
                    name="price"
                    type="number"
                    step="0.001"
                    min="0"
                    defaultValue={editing.price ?? ''}
                    placeholder={t.price}
                  />

                  <input
                    name="image_url"
                    defaultValue={editing.image_url || ''}
                    placeholder={t.image}
                  />

                  <label className="file-label">
                    {rtl
                      ? 'یا تصویر را از گوشی انتخاب کن'
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

                    {categories.map(c => (
                      <option value={c.id} key={c.id}>
                        {c.name_en || c.name_ar}
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
  const [err, setErr] = useState('')

  async function add(e) {
    e.preventDefault()

    const { error } = await supabase
      .from('categories')
      .insert({ name_en: en, name_ar: ar })

    if (error) {
      setErr(error.message)
    } else {
      setEn('')
      setAr('')
      onDone()
    }
  }

  async function del(id) {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id)

    if (error) setErr(error.message)
    else onDone()
  }

  return (
    <div className="category-admin">
      <form onSubmit={add}>
        <input
          value={en}
          onChange={e => setEn(e.target.value)}
          placeholder={t.nameEn}
          required
        />

        <input
          value={ar}
          onChange={e => setAr(e.target.value)}
          placeholder={t.nameAr}
        />

        <button className="primary-btn full">
          {t.save}
        </button>
      </form>

      {categories.map(c => (
        <div className="admin-row" key={c.id}>
          <span>{c.name_en} / {c.name_ar}</span>

          <button onClick={() => del(c.id)}>
            <Trash2 size={16} />
          </button>
        </div>
      ))}

      {err && <p className="notice">{err}</p>}
    </div>
  )
}

export default App
