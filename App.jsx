import React, { useEffect, useMemo, useState } from 'react' import { Search, ShoppingBag, Menu, X, Instagram, MessageCircle, Plus, Minus, ArrowUpRight, PawPrint, LogIn, LogOut, Package, Tags, Trash2, Edit3, AlertCircle, Truck, ShieldCheck, Headphones, Sparkles, Bone, Gamepad2, Heart, ShoppingBasket, Check, Loader2 } from 'lucide-react' import { isSupabaseConfigured, supabase } from './supabase.js'
const WA = (import.meta.env.VITE_WHATSAPP_NUMBER || '96871394358').replace(/\D/g, '') const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=900'
const demoCategories = [ { id: 'food', name_en: 'Food & treats', name_ar: 'الطعام والمكافآت' }, { id: 'toys', name_en: 'Toys & play', name_ar: 'الألعاب والتسلية' }, { id: 'care', name_en: 'Care & hygiene', name_ar: 'العناية والنظافة' }, { id: 'accessories', name_en: 'Accessories', name_ar: 'الإكسسوارات' } ]
const demoProducts = [ { id: 'demo-1', name_en: 'Daily comfort bowl', name_ar: 'وعاء طعام يومي', description_en: 'A practical bowl for your cat’s everyday meals.', description_ar: 'وعاء عملي وأنيق لوجبات قطتك اليومية.', price: 4.5, category_id: 'accessories', image_url: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=900', featured: true }, { id: 'demo-2', name_en: 'Playful cat toy', name_ar: 'لعبة ممتعة للقطط', description_en: 'A fun toy to keep your cat active.', description_ar: 'لعبة لطيفة لتمنح قطتك وقتاً ممتعاً من الحركة واللعب.', price: 2.8, category_id: 'toys', image_url: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=900', featured: true }, { id: 'demo-3', name_en: 'Cat care essentials', name_ar: 'مستلزمات العناية بالقطط', description_en: 'Everyday essentials for your cat’s comfort.', description_ar: 'مستلزمات أساسية للعناية بقطتك وراحتها.', price: 8, category_id: 'care', image_url: 'https://images.unsplash.com/photo-1511044568932-338cba0ad803?w=900', featured: false }, { id: 'demo-4', name_en: 'Tasty cat treats', name_ar: 'مكافآت لذيذة لقطتك', description_en: 'A tasty reward for your favourite companion.', description_ar: 'مكافأة لذيذة لقطتك في أي وقت.', price: 3.2, category_id: 'food', image_url: 'https://images.unsplash.com/photo-1495360010541-f48722b34f7d?w=900', featured: true } ]
const categoryArtwork = [ { image: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=1000', icon: Bone, number: '01' }, { image: 'https://images.unsplash.com/photo-1545249390-6bdfa286032f?w=1000', icon: Gamepad2, number: '02' }, { image: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=1000', icon: Heart, number: '03' }, { image: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=1000', icon: ShoppingBasket, number: '04' } ]
const words = { ar: { home: 'الرئيسية', shop: 'تسوّق', about: 'من نحن', search: 'ابحث عن احتياجات قطتك...', eyebrow: 'كل ما تحبه قطتك، في مكان واحد', hero1: 'لأن قطتك', hero2: 'تستحق الأفضل.', heroText: 'من الطعام والمكافآت إلى الألعاب ومستلزمات العناية، اكتشف كل ما تحتاجه قطتك في نزوى كت. تسوّق بسهولة من عُمان.', shopNow: 'تسوّق الآن', explore: 'اكتشف الأقسام', categories: 'تسوّق حسب الفئة', featured: 'اختياراتنا لقطتك', featuredText: 'منتجات مختارة بعناية لتجعل كل يوم أجمل لقطتك.', all: 'جميع المنتجات', add: 'أضف إلى السلة', details: 'التفاصيل', emptyProducts: 'لا توجد منتجات في هذه الفئة حالياً.', cart: 'سلة التسوق', emptyCart: 'سلتك فارغة حالياً', subtotal: 'إجمالي المنتجات', continue: 'متابعة الطلب', delivery: 'طريقة الاستلام', office: 'استلام من المكتب', homeDelivery: 'توصيل إلى المنزل', name: 'الاسم', phone: 'رقم الهاتف', notes: 'ملاحظات إضافية (اختياري)', send: 'إرسال الطلب عبر واتساب', deliveryNote: 'رسوم التوصيل تُحدد حسب وزن الطلب وموقع التوصيل، ويتم تأكيدها معك قبل إتمام الطلب. لا يتوفر الدفع عند الاستلام.', aboutTitle: 'كل ما تحتاجه قطتك،', aboutTitle2: 'نهتم بتوفيره.', aboutText: 'نزوى كت NIZWA CAT متجر إلكتروني في عُمان، يجمع لك مستلزمات قطتك في مكان واحد. نوفر منتجات متنوعة تشمل الطعام والمكافآت والألعاب والعناية والإكسسوارات، لتجد ما تحتاجه بسهولة.', selected: 'منتجات مختارة بعناية', selectedSub: 'خيارات تناسب احتياجات قطتك', deliveryTrust: 'التوصيل داخل عُمان', deliverySub: 'اسألنا عن خيارات التوصيل', support: 'نحن هنا لمساعدتك', supportSub: 'تواصل معنا عبر واتساب', admin: 'الإدارة', login: 'دخول الإدارة', email: 'البريد الإلكتروني', password: 'كلمة المرور', signIn: 'تسجيل الدخول', signOut: 'تسجيل الخروج', products: 'المنتجات', categoriesAdmin: 'الفئات', addProduct: 'إضافة منتج', save: 'حفظ', cancel: 'إلغاء', nameAr: 'اسم المنتج بالعربية', nameEn: 'اسم المنتج بالإنجليزية', price: 'السعر (ر.ع)', image: 'رابط صورة المنتج', category: 'الفئة', description: 'الوصف', featuredLabel: 'عرض كمنتج مميز', deleteConfirm: 'هل تريد حذف هذا المنتج؟', deleteCategoryConfirm: 'هل تريد حذف هذه الفئة؟', config: 'المتجر في وضع المعاينة. تأكد من إعداد متغيرات Supabase في Netlify.', adminHint: 'سجّل الدخول باستخدام حساب تم إنشاؤه في Supabase Authentication.', required: 'يرجى إدخال الاسم ورقم الهاتف.', saved: 'تم حفظ التغييرات بنجاح.', loading: 'جارٍ تحميل المنتجات...', noImage: 'لا توجد صورة', upload: 'أو اختر صورة من هاتفك', connectionError: 'تعذر تحميل بيانات المتجر. تحقق من إعدادات Supabase وصلاحيات قاعدة البيانات.', currency: 'ر.ع', exploreProducts: 'اكتشف المنتجات', note: 'ملاحظات' }, en: { home: 'Home', shop: 'Shop', about: 'About us', search: 'Search for your cat’s essentials...', eyebrow: 'EVERYTHING YOUR CAT LOVES', hero1: 'Because your cat', hero2: 'deserves the best.', heroText: 'From food and treats to toys and care essentials, find what your cat needs at NIZWA CAT. Easy shopping, right here in Oman.', shopNow: 'Shop now', explore: 'Explore categories', categories: 'Shop by category', featured: 'Our picks for your cat', featuredText: 'Carefully selected products to make every day better for your cat.', all: 'All products', add: 'Add to cart', details: 'View details', emptyProducts: 'There are no products in this category yet.', cart: 'Shopping cart', emptyCart: 'Your cart is empty', subtotal: 'Products subtotal', continue: 'Continue to order', delivery: 'Collection method', office: 'Collect from office', homeDelivery: 'Home delivery', name: 'Your name', phone: 'Phone number', notes: 'Additional notes (optional)', send: 'Send order via WhatsApp', deliveryNote: 'Delivery fees depend on order weight and location. The fee will be confirmed before completing the order. Cash on delivery is not available.', aboutTitle: 'Everything your cat needs,', aboutTitle2: 'all in one place.', aboutText: 'NIZWA CAT is an online store in Oman, bringing your cat’s essentials together in one place. Discover food, treats, toys, care products and accessories, and enjoy a simple shopping experience.', selected: 'Carefully selected', selectedSub: 'Products for your cat’s needs', deliveryTrust: 'Delivery in Oman', deliverySub: 'Ask us about delivery options', support: 'Here to help', supportSub: 'Message us on WhatsApp', admin: 'Admin', login: 'Admin sign in', email: 'Email', password: 'Password', signIn: 'Sign in', signOut: 'Sign out', products: 'Products', categoriesAdmin: 'Categories', addProduct: 'Add product', save: 'Save', cancel: 'Cancel', nameAr: 'Product name in Arabic', nameEn: 'Product name in English', price: 'Price (OMR)', image: 'Product image URL', category: 'Category', description: 'Description', featuredLabel: 'Mark as featured', deleteConfirm: 'Delete this category?', deleteCategoryConfirm: 'Delete this category?', config: 'Preview mode is active. Check your Supabase environment variables in Netlify.', adminHint: 'Sign in with a user created in Supabase Authentication.', required: 'Please enter your name and phone number.', saved: 'Changes saved successfully.', loading: 'Loading products...', noImage: 'No image', upload: 'Or choose an image from your phone', connectionError: 'Could not load store data. Check Supabase settings and database permissions.', currency: 'OMR', exploreProducts: 'Explore products', note: 'Notes' } }
function money(value) { return Number(value || 0).toFixed(3) }
function App() { const [lang, setLang] = useState('ar') const [products, setProducts] = useState(demoProducts) const [categories, setCategories] = useState(demoCategories) const [activeCat, setActiveCat] = useState('all') const [query, setQuery] = useState('') const [cart, setCart] = useState([]) const [cartOpen, setCartOpen] = useState(false) const [mobileOpen, setMobileOpen] = useState(false) const [selected, setSelected] = useState(null) const [checkout, setCheckout] = useState(false) const [delivery, setDelivery] = useState('office') const [customer, setCustomer] = useState({ name: '', phone: '', notes: '' }) const [adminOpen, setAdminOpen] = useState(false) const [session, setSession] = useState(null) const [adminTab, setAdminTab] = useState('products') const [auth, setAuth] = useState({ email: '', password: '' }) const [editing, setEditing] = useState(null) const [notice, setNotice] = useState('') const [storeLoading, setStoreLoading] = useState(Boolean(isSupabaseConfigured)) const [storeError, setStoreError] = useState('') const [saving, setSaving] = useState(false)
const rtl = lang === 'ar' const t = words[lang]
useEffect(() => { document.documentElement.lang = lang document.documentElement.dir = rtl ? 'rtl' : 'ltr' }, [lang, rtl])
useEffect(() => { if (!supabase) { setStoreLoading(false) return undefined } loadStore() supabase.auth.getSession().then(({ data }) => setSession(data.session)) const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, current) => setSession(current)) return () => subscription.unsubscribe() }, [])
async function loadStore() { if (!supabase) return setStoreLoading(true) setStoreError('') const [ { data: productData, error: productError }, { data: categoryData, error: categoryError } ] = await Promise.all([ supabase.from('products').select('').order('created_at', { ascending: false }), supabase.from('categories').select('').order('name_en') ]) if (productError || categoryError) { setStoreError(productError?.message || categoryError?.message || t.connectionError) } else { setProducts(productData || []) setCategories(categoryData || []) } setStoreLoading(false) }
const categoryList = [{ id: 'all', name_en: 'All products', name_ar: 'جميع المنتجات' }, ...categories] const filtered = useMemo(() => products.filter(product => { const matchesCategory = activeCat === 'all' || String(product.category_id) === String(activeCat) const searchable = ${product.name_en || ''} ${product.name_ar || ''} ${product.description_en || ''} ${product.description_ar || ''}.toLowerCase() return matchesCategory && searchable.includes(query.trim().toLowerCase()) }), [products, activeCat, query]) const featured = products.filter(product => product.featured) const visibleProducts = query || activeCat !== 'all' ? filtered : (featured.length ? featured : products) const count = cart.reduce((sum, item) => sum + item.qty, 0) const total = cart.reduce((sum, item) => sum + Number(item.price || 0) * item.qty, 0) const titleOf = product => rtl ? (product.name_ar || product.name_en) : (product.name_en || product.name_ar) const descriptionOf = product => rtl ? (product.description_ar || product.description_en) : (product.description_en || product.description_ar)
function addToCart(product) { setCart(current => { const existing = current.find(item => String(item.id) === String(product.id)) return existing ? current.map(item => String(item.id) === String(product.id) ? { ...item, qty: item.qty + 1 } : item) : [...current, { ...product, qty: 1 }] }) setSelected(null) setCartOpen(true)
setCheckout(false)
}
function changeQty(id, delta) { setCart(current => current.map(item => String(item.id) === String(id) ? { ...item, qty: item.qty + delta } : item).filter(item => item.qty > 0)) }
function sendWhatsApp() { if (!customer.name.trim() || !customer.phone.trim()) { setNotice(t.required) return } const lines = cart.map(item => • ${titleOf(item)} × ${item.qty} = ${money(Number(item.price) * item.qty)} OMR) const method = delivery === 'office' ? (rtl ? 'استلام من المكتب' : 'Collect from office') : (rtl ? 'توصيل إلى المنزل' : 'Home delivery') const message = [ NIZWA CAT | ${rtl ? 'طلب جديد' : 'New order'}, ${rtl ? 'الاسم' : 'Name'}: ${customer.name}, ${rtl ? 'الهاتف' : 'Phone'}: ${customer.phone}, ${rtl ? 'طريقة الاستلام' : 'Collection'}: ${method}, '', ...lines, '', ${rtl ? 'إجمالي المنتجات' : 'Products subtotal'}: ${money(total)} OMR, rtl ? 'رسوم التوصيل غير مشمولة، وسيتم تأكيدها حسب الوزن والموقع.' : 'Delivery is not included and will be confirmed based on weight and location.', customer.notes ? ${rtl ? 'ملاحظات' : 'Notes'}: ${customer.notes} : '' ].filter(Boolean).join('\n') window.open(https://wa.me/${WA}?text=${encodeURIComponent(message)}, '_blank', 'noopener,noreferrer') }
async function signIn(event) { event.preventDefault() if (!supabase) return setNotice(t.config) setSaving(true) const { data, error } = await supabase.auth.signInWithPassword(auth) setSaving(false) if (error) setNotice(error.message) else { setSession(data.session); setNotice('') } }
async function signOut() { if (!supabase) return const { error } = await supabase.auth.signOut() if (error) setNotice(error.message) else { setSession(null); setEditing(null); setNotice('') } }
async function saveProduct(event) { event.preventDefault() if (!supabase) return setSaving(true) const form = new FormData(event.currentTarget) const payload = { name_en: String(form.get('name_en') || '').trim(), name_ar: String(form.get('name_ar') || '').trim(), description_en: String(form.get('description_en') || '').trim(), description_ar: String(form.get('description_ar') || '').trim(), price: Number(form.get('price')), category_id: form.get('category_id') || null, image_url: String(form.get('image_url') || '').trim(), featured: form.get('featured') === 'on' } const file = form.get('image_file') if (file && file.size) { const extension = (file.name.split('.').pop() || 'jpg').toLowerCase() const path = ${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${extension} const { error: uploadError } = await supabase.storage.from('product-images').upload(path, file, { upsert: false }) if (uploadError) { setSaving(false) setNotice(uploadError.message) return } const { data } = supabase.storage.from('product-images').getPublicUrl(path) payload.image_url = data.publicUrl } const result = editing?.id ? await supabase.from('products').update(payload).eq('id', editing.id) : await supabase.from('products').insert(payload) setSaving(false) if (result.error) { setNotice(result.error.message); return } setEditing(null) setNotice(t.saved) await loadStore() }
async function deleteProduct(id) { if (!supabase) return if (!window.confirm(t.deleteConfirm)) return const { error } = await supabase.from('products').delete().eq('id', id) if (error) setNotice(error.message) else { setNotice(t.saved); await loadStore() } }
function ProductCard({ product }) { const category = categories.find(item => String(item.id) === String(product.category_id)) return ( <article className="product-card"> <button className="product-image" onClick={() => setSelected(product)} aria-label={t.details}> <img src={product.image_url || FALLBACK_IMAGE} alt={titleOf(product)} loading="lazy" /> {product.featured && <span className="featured-tag"><Sparkles size={12} />{rtl ? 'اختيارنا' : 'OUR PICK'}</span>} <span className="quick-view">{t.details}<ArrowUpRight size={15} /></span> </button> <div className="product-info"> <span className="product-category">{category ? (rtl ? category.name_ar || category.name_en : category.name_en || category.name_ar) : 'NIZWA CAT'}</span> <h3>{titleOf(product)}</h3> <div className="product-bottom"> <strong>{money(product.price)} <small>{t.currency}</small></strong> <button className="add-btn" onClick={() => addToCart(product)} aria-label={t.add}><Plus size={18} /></button> </div> </div> </article> ) }
return ( <div className={app ${rtl ? 'rtl' : 'ltr'}}> <div className="announcement">{rtl ? 'كل احتياجات قطتك في مكان واحد · من عُمان بكل حب' : 'Your cat’s essentials in one place · Proudly in Oman'}</div>
  <header className="site-header">
    <a className="brand" href="#home" aria-label="NIZWA CAT">
      <span className="brand-mark"><PawPrint size={22} /></span>
      <span>NIZWA <b>CAT</b><small>نزوى كت</small></span>
    </a>
    <nav className="desktop-nav">
      <a href="#home">{t.home}</a><a href="#shop">{t.shop}</a><a href="#about">{t.about}</a>
    </nav>
    <div className="header-actions">
      <button className="language-btn" onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}>{rtl ? 'EN' : 'عربي'}</button>
      <button className="icon-btn cart-trigger" onClick={() => setCartOpen(true)} aria-label={t.cart}><ShoppingBag size={20} /><span>{count}</span></button>
      <button className="mobile-menu-btn" onClick={() => setMobileOpen(open => !open)} aria-label="Menu">{mobileOpen ? <X /> : <Menu />}</button>
    </div>
    {mobileOpen && <nav className="mobile-nav"><a href="#home" onClick={() => setMobileOpen(false)}>{t.home}</a><a href="#shop" onClick={() => setMobileOpen(false)}>{t.shop}</a><a href="#about" onClick={() => setMobileOpen(false)}>{t.about}</a></nav>}
  </header>

  <main>
    <section className="hero" id="home">
      <div className="hero-photo">
        <img src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=1800" alt="Cat" />
        <video autoPlay muted loop playsInline preload="metadata" poster="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=1800">
          <source src="https://videos.pexels.com/video-files/5871756/5871756-hd_1920_1080_25fps.mp4" type="video/mp4" />
        </video>
      </div>
      <div className="hero-shade" />
      <div className="hero-brand-lockup"><span className="brand-mark"><PawPrint size={22} /></span><span>NIZWA <b>CAT</b><small>نزوى كت</small></span></div>
      <div className="hero-content">
        <span className="hero-eyebrow"><Sparkles size={15} />{t.eyebrow}</span>
        <h1>{t.hero1}<br /><em>{t.hero2}</em></h1>
        <p>{t.heroText}</p>
        <div className="hero-actions"><a href="#shop" className="primary-btn">{t.shopNow}<ArrowUpRight size={17} /></a><a href="#categories" className="hero-secondary">{t.explore}</a></div>
      </div>
      <div className="hero-caption">01 <i /> NIZWA CAT · OMAN</div>
    </section>

    <section className="category-section section-wrap" id="categories">
      <div className="section-heading">
        <div><span className="eyebrow">{rtl ? 'كل ما تحتاجه قطتك' : 'MADE FOR CATS'}</span><h2>{t.categories}</h2></div>
        <button className="text-link link-button" onClick={() => { setActiveCat('all'); document.querySelector('#shop')?.scrollIntoView({ behavior: 'smooth' }) }}>{t.all}<ArrowUpRight size={16} /></button>
      </div>
      <div className="category-grid">
        {categories.map((category, index) => {
          const visual = categoryArtwork[index % categoryArtwork.length]
          const Icon = visual.icon
          return <button key={category.id} className={`category-card ${String(activeCat) === String(category.id) ? 'active' : ''}`} onClick={() => { setActiveCat(category.id); document.querySelector('#shop')?.scrollIntoView({ behavior: 'smooth' }) }}>
            <img src={visual.image} alt="" loading="lazy" /><span className="category-card-overlay" />
            <span className="category-icon"><Icon size={22} strokeWidth={1.7} /></span>
            <span className="category-card-copy"><small>{visual.number} / {String(categories.length).padStart(2, '0')}</small><b>{rtl ? category.name_ar || category.name_en : category.name_en || category.name_ar}</b><em>{t.exploreProducts}<ArrowUpRight size={15} /></em></span>
          </button>
        })}
      </div>
    </section>

    <section className="shop-section section-wrap" id="shop">
      <div className="section-heading shop-heading">
        <div><span className="eyebrow">{rtl ? 'اختيارات نزوى كت' : 'THE NIZWA EDIT'}</span><h2>{t.featured}</h2><p>{t.featuredText}</p></div>
        <label className="search-box"><Search size={17} /><input value={query} onChange={event => setQuery(event.target.value)} placeholder={t.search} /></label>
      </div>
      {storeLoading && <div className="state-message"><Loader2 className="spin" size={22} />{t.loading}</div>}
      {!storeLoading && storeError && <div className="state-message error-state"><AlertCircle size={21} /><span>{storeError}</span><button className="secondary-btn" onClick={loadStore}>{rtl ? 'إعادة المحاولة' : 'Try again'}</button></div>}
      <div className="product-grid">
        {visibleProducts.map(product => <ProductCard key={product.id} product={product} />)}
      </div>
      {!storeLoading && !storeError && !visibleProducts.length && <p className="empty-products">{t.emptyProducts}</p>}
    </section>

    <section className="trust-section"><div className="trust-inner">
      <div className="trust-item"><span className="trust-icon"><ShieldCheck size={23} /></span><div><b>{t.selected}</b><small>{t.selectedSub}</small></div></div>
      <div className="trust-item"><span className="trust-icon"><Truck size={23} /></span><div><b>{t.deliveryTrust}</b><small>{t.deliverySub}</small></div></div>
      <div className="trust-item"><span className="trust-icon"><Headphones size={23} /></span><div><b>{t.support}</b><small>{t.supportSub}</small></div></div>
    </div></section>

    <section className="about-section" id="about">
      <div className="about-image"><img src="https://images.unsplash.com/photo-1511044568932-338cba0ad803?w=1200" alt="Relaxed cat" loading="lazy" /></div>
      <div className="about-copy"><span className="eyebrow">{rtl ? 'حكاية نزوى كت' : 'A LITTLE ABOUT US'}</span><h2>{t.aboutTitle}<br /><em>{t.aboutTitle2}</em></h2><p>{t.aboutText}</p><a href="https://www.instagram.com/nizwa.cat/" target="_blank" rel="noreferrer" className="text-link"><Instagram size={17} />@nizwa.cat<ArrowUpRight size={16} /></a></div>
    </section>
  </main>

  <footer className="footer">
    <a className="brand footer-brand" href="#home"><span className="brand-mark"><PawPrint size={20} /></span><span>NIZWA <b>CAT</b><small>نزوى كت</small></span></a>
    <span>© {new Date().getFullYear()} NIZWA CAT · OMAN</span>
    <div><a href="https://www.instagram.com/nizwa.cat/" target="_blank" rel="noreferrer" aria-label="Instagram"><Instagram size={18} /></a><a href={`https://wa.me/${WA}`} target="_blank" rel="noreferrer" aria-label="WhatsApp"><MessageCircle size={18} /></a><button onClick={() => { setAdminOpen(true); setNotice('') }} className="admin-link">{t.admin}</button></div>
  </footer>

  {selected && <div className="overlay" onClick={() => setSelected(null)}><div className="detail-modal" onClick={event => event.stopPropagation()}>
        <button className="close-btn modal-close" onClick={() => setSelected(null)} aria-label="Close"><X /></button>
        <img src={selected.image_url || FALLBACK_IMAGE} alt={titleOf(selected)} />
        <div className="detail-copy"><span className="eyebrow">NIZWA CAT</span><h2>{titleOf(selected)}</h2><p>{descriptionOf(selected)}</p><strong className="price">{money(selected.price)} {t.currency}</strong><button className="primary-btn" onClick={() => addToCart(selected)}>{t.add}<Plus size={17} /></button></div>
      </div></div>}

      {cartOpen && <div className="overlay drawer-overlay" onClick={() => { setCartOpen(false); setCheckout(false) }}>
        <aside className="cart-drawer" onClick={event => event.stopPropagation()}>
          <div className="drawer-head"><h2>{t.cart}</h2><button className="close-btn" onClick={() => { setCartOpen(false); setCheckout(false) }}><X /></button></div>
          {!cart.length ? <div className="empty-cart"><ShoppingBag size={36} /><p>{t.emptyCart}</p><button className="text-link link-button" onClick={() => setCartOpen(false)}>{t.shopNow}</button></div> : <>
            <div className="cart-items">{cart.map(item => <div className="cart-item" key={item.id}>
              <img src={item.image_url || FALLBACK_IMAGE} alt={titleOf(item)} />
              <div className="cart-item-info"><b>{titleOf(item)}</b><span>{money(item.price)} {t.currency}</span><div className="qty"><button onClick={() => changeQty(item.id, -1)} aria-label="Decrease"><Minus size={13} /></button><span>{item.qty}</span><button onClick={() => changeQty(item.id, 1)} aria-label="Increase"><Plus size={13} /></button></div></div>
              <strong>{money(Number(item.price) * item.qty)}</strong>
            </div>)}</div>
            <div className="cart-summary"><div className="sum-row"><span>{t.subtotal}</span><b>{money(total)} {t.currency}</b></div>
              {!checkout ? <button className="primary-btn full" onClick={() => { setCheckout(true); setNotice('') }}>{t.continue}<ArrowUpRight size={17} /></button> : <form className="checkout-form" onSubmit={event => { event.preventDefault(); sendWhatsApp() }}>
                <label>{t.delivery}</label><div className="delivery-options"><button type="button" className={delivery === 'office' ? 'selected' : ''} onClick={() => setDelivery('office')}>{t.office}</button><button type="button" className={delivery === 'home' ? 'selected' : ''} onClick={() => setDelivery('home')}>{t.homeDelivery}</button></div>
                <input required placeholder={t.name} value={customer.name} onChange={event => setCustomer({ ...customer, name: event.target.value })} />
                <input required type="tel" placeholder={t.phone} value={customer.phone} onChange={event => setCustomer({ ...customer, phone: event.target.value })} />
                <textarea placeholder={t.notes} value={customer.notes} onChange={event => setCustomer({ ...customer, notes: event.target.value })} />
                <p className="delivery-note">{t.deliveryNote}</p>{notice && <p className="notice">{notice}</p>}
                <button className="primary-btn full" type="submit"><MessageCircle size={17} />{t.send}</button>
              </form>}
            </div>
          </>}
        </aside>
      </div>}

      {adminOpen && <div className="overlay admin-overlay" onClick={() => setAdminOpen(false)}><div className="admin-modal" onClick={event => event.stopPropagation()}>
        <div className="drawer-head"><h2>{t.admin}</h2><button className="close-btn" onClick={() => setAdminOpen(false)}><X /></button></div>
        {!isSupabaseConfigured ? <div className="admin-warning"><AlertCircle /><p>{t.config}</p><small>{t.adminHint}</small></div> : !session ? <form className="admin-login" onSubmit={signIn}>
          <h3>{t.login}</h3><input type="email" required placeholder={t.email} value={auth.email} onChange={event => setAuth({ ...auth, email: event.target.value })} /><input type="password" required placeholder={t.password} value={auth.password} onChange={event => setAuth({ ...auth, password: event.target.value })} />
          <button className="primary-btn full" disabled={saving}>{saving ? <Loader2 className="spin" size={16} /> : <LogIn size={16} />}{t.signIn}</button>{notice && <p className="notice">{notice}</p>}
        </form> : <div className="admin-content">
          <div className="admin-toolbar"><div className="admin-tabs"><button className={adminTab === 'products' ? 'active' : ''} onClick={() => { setAdminTab('products'); setEditing(null) }}><Package size={15} />{t.products}</button><button className={adminTab === 'categories' ? 'active' : ''} onClick={() => { setAdminTab('categories'); setEditing(null) }}><Tags size={15} />{t.categoriesAdmin}</button></div><button className="logout-btn" onClick={signOut}><LogOut size={15} />{t.signOut}</button></div>
          {adminTab === 'products' ? <>
            <button className="primary-btn full admin-add" onClick={() => { setEditing({}); setNotice('') }}><Plus size={16} />{t.addProduct}</button>
            {products.map(product => <div className="admin-row" key={product.id}><img src={product.image_url || FALLBACK_IMAGE} alt="" /><span>{titleOf(product)}</span><button aria-label="Edit" onClick={() => { setEditing(product); setNotice('') }}><Edit3 size={16} /></button><button aria-label="Delete" onClick={() => deleteProduct(product.id)}><Trash2 size={16} /></button></div>)}
          </> : <CategoryManager categories={categories} onDone={loadStore} t={t} rtl={rtl} />}
        </div>}
        {session && editing && adminTab === 'products' && <div className="edit-panel"><form onSubmit={saveProduct}>
          <h3>{editing.id ? t.edit || (rtl ? 'تعديل المنتج' : 'Edit product') : t.addProduct}</h3>
          <input name="name_en" defaultValue={editing.name_en || ''} placeholder={t.nameEn} required />
          <input name="name_ar" defaultValue={editing.name_ar || ''} placeholder={t.nameAr} />
          <textarea name="description_en" defaultValue={editing.description_en || ''} placeholder="Description (English)" />
          <textarea name="description_ar" defaultValue={editing.description_ar || ''} placeholder="الوصف بالعربية" />
          <input name="price" type="number" step="0.001" min="0" defaultValue={editing.price ?? ''} placeholder={t.price} required />
          <input name="image_url" defaultValue={editing.image_url || ''} placeholder={t.image} />
          <label className="file-label">{t.upload}<input name="image_file" type="file" accept="image/*" /></label>
          <select name="category_id" defaultValue={editing.category_id || ''}><option value="">{t.category}</option>{categories.map(category => <option value={category.id} key={category.id}>{category.name_en || category.name_ar}</option>)}</select>
          <label className="check-label"><input name="featured" type="checkbox" defaultChecked={!!editing.featured} />{t.featuredLabel}</label>
          {notice && <p className="notice">{notice}</p>}
          <div className="form-actions"><button type="button" className="secondary-btn" onClick={() => setEditing(null)}>{t.cancel}</button><button className="primary-btn" disabled={saving}>{saving ? <Loader2 className="spin" size={16} /> : <Check size={16} />}{t.save}</button></div>
        </form></div>}
      </div></div>}
    </div>
  )
}

function CategoryManager({ categories, onDone, t, rtl }) {
  const [en, setEn] = useState('')
  const [ar, setAr] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [saving, setSaving] = useState(false)

  async function addCategory(event) {
    event.preventDefault()
    if (!supabase) return
    setSaving(true)
    const { error } = await supabase.from('categories').insert({ name_en: en.trim(), name_ar: ar.trim() })
    setSaving(false)
    if (error) setErrorMessage(error.message)
    else { setEn(''); setAr(''); setErrorMessage(''); await onDone() }
  }

  async function deleteCategory(id) {
    if (!supabase || !window.confirm(t.deleteCategoryConfirm)) return
    const { error } = await supabase.from('categories').delete().eq('id', id)
    if (error) setErrorMessage(error.message)
    else await onDone()
  }

  return <div className="category-admin">
    <form onSubmit={addCategory}><input value={en} onChange={event => setEn(event.target.value)} placeholder={t.nameEn} required /><input value={ar} onChange={event => setAr(event.target.value)} placeholder={t.nameAr} /><button className="primary-btn full" disabled={saving}>{t.save}</button></form>
    {categories.map(category => <div className="admin-row" key={category.id}><span>{category.name_en} / {category.name_ar}</span><button aria-label="Delete category" onClick={() => deleteCategory(category.id)}><Trash2 size={16} /></button></div>)}
    {errorMessage && <p className="notice">{errorMessage}</p>}
  </div>
}

export default App
