import React, { useEffect, useMemo, useState } from 'react'
import {
  Search, ShoppingBag, Menu, X, Instagram, MessageCircle,
  ChevronDown, Plus, Minus, ArrowUpRight, ArrowUp, ArrowDown, PawPrint,
  LogIn, LogOut, Package, Tags, ImagePlus, Trash2,
  Edit3, Check, AlertCircle, Truck, ShieldCheck,
  Headphones, Sparkles, Heart, ShoppingBasket, UserRound,
  Loader2, RefreshCw, ClipboardList, Cat
} from 'lucide-react'
import { isSupabaseConfigured, supabase } from './supabase.js'

const WA = (import.meta.env.VITE_WHATSAPP_NUMBER || '96871394358').replace(/\D/g, '')
// Reduce large product photos before uploading. Animated GIFs and unsupported
// browsers keep the original file to avoid changing their appearance.
async function optimizeImageForUpload(file, maxSide = 1400, quality = 0.82) {
  if (!file || !file.type?.startsWith('image/') || file.type === 'image/gif') return file
  if (typeof createImageBitmap !== 'function') return file
  try {
    const bitmap = await createImageBitmap(file)
    const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height))
    if (scale === 1 && file.size < 450 * 1024) {
      bitmap.close?.()
      return file
    }
    const canvas = document.createElement('canvas')
    canvas.width = Math.max(1, Math.round(bitmap.width * scale))
    canvas.height = Math.max(1, Math.round(bitmap.height * scale))
    const context = canvas.getContext('2d')
    if (!context) {
      bitmap.close?.()
      return file
    }
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
    bitmap.close?.()
    const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/webp', quality))
    if (!blob || blob.size >= file.size) return file
    const baseName = (file.name || 'image').replace(/\.[^.]+$/, '')
    return new File([blob], `${baseName}.webp`, { type: 'image/webp', lastModified: Date.now() })
  } catch (error) {
    console.warn('Image optimization skipped:', error)
    return file
  }
}


const NO_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='900' height='700' viewBox='0 0 900 700'%3E%3Crect width='900' height='700' fill='%23f1eee5'/%3E%3Cg fill='none' stroke='%23b6b09f' stroke-width='12' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='300' y='190' width='300' height='270' rx='28'/%3E%3Cpath d='M360 390l75-80 55 55 45-48 55 73'/%3E%3Ccircle cx='390' cy='260' r='22'/%3E%3C/g%3E%3Ctext x='450' y='540' text-anchor='middle' font-family='Arial,sans-serif' font-size='30' fill='%23817b6d'%3ENo image available%3C/text%3E%3C/svg%3E"

const OMAN_GOVERNORATES = [
  {
    value: 'Musandam',
    ar: 'مسندم',
    en: 'Musandam',
    wilayats: [
      { value: 'Khasab', ar: 'خصب', en: 'Khasab' },
      { value: 'Bukha', ar: 'بخاء', en: 'Bukha' },
      { value: 'Dibba', ar: 'دبا', en: 'Dibba' },
      { value: 'Madha', ar: 'مدحاء', en: 'Madha' }
    ]
  },
  {
    value: 'Al Buraimi',
    ar: 'البريمي',
    en: 'Al Buraimi',
    wilayats: [
      { value: 'Al Buraimi', ar: 'البريمي', en: 'Al Buraimi' },
      { value: 'Al Sunaynah', ar: 'السنينة', en: 'Al Sunaynah' },
      { value: 'Mahdah', ar: 'محضة', en: 'Mahdah' }
    ]
  },
  {
    value: 'Al Batinah North',
    ar: 'شمال الباطنة',
    en: 'Al Batinah North',
    wilayats: [
      { value: 'Sohar', ar: 'صحار', en: 'Sohar' },
      { value: 'Al Khabourah', ar: 'الخابورة', en: 'Al Khabourah' },
      { value: 'Al Suwaiq', ar: 'السويق', en: 'Al Suwaiq' },
      { value: 'Liwa', ar: 'لوى', en: 'Liwa' },
      { value: 'Saham', ar: 'صحم', en: 'Saham' },
      { value: 'Shinas', ar: 'شناص', en: 'Shinas' }
    ]
  },
  {
    value: 'Al Batinah South',
    ar: 'جنوب الباطنة',
    en: 'Al Batinah South',
    wilayats: [
      { value: 'Al Rustaq', ar: 'الرستاق', en: 'Al Rustaq' },
      { value: 'Al Awabi', ar: 'العوابي', en: 'Al Awabi' },
      { value: 'Al Musannah', ar: 'المصنعة', en: 'Al Musannah' },
      { value: 'Barka', ar: 'بركاء', en: 'Barka' },
      { value: 'Nakhal', ar: 'نخل', en: 'Nakhal' },
      { value: 'Wadi Al Maawil', ar: 'وادي المعاول', en: 'Wadi Al Maawil' }
    ]
  },
  {
    value: 'Muscat',
    ar: 'مسقط',
    en: 'Muscat',
    wilayats: [
      { value: 'Muscat', ar: 'مسقط', en: 'Muscat' },
      { value: 'Al Amirat', ar: 'العامرات', en: 'Al Amirat' },
      { value: 'A Seeb', ar: 'السيب', en: 'A Seeb' },
      { value: 'Boushar', ar: 'بوشر', en: 'Boushar' },
      { value: 'Matrah', ar: 'مطرح', en: 'Matrah' },
      { value: 'Qurayyat', ar: 'قريات', en: 'Qurayyat' }
    ]
  },
  {
    value: 'A Dhahirah',
    ar: 'الظاهرة',
    en: 'A Dhahirah',
    wilayats: [
      { value: 'Ibri', ar: 'عبري', en: 'Ibri' },
      { value: 'Dhank', ar: 'ضنك', en: 'Dhank' },
      { value: 'Yankul', ar: 'ينقل', en: 'Yankul' }
    ]
  },
  {
    value: 'A Dakhiliya',
    ar: 'الداخلية',
    en: 'A Dakhiliya',
    wilayats: [
      { value: 'Nizwa', ar: 'نزوى', en: 'Nizwa' },
      { value: 'Adam', ar: 'أدم', en: 'Adam' },
      { value: 'Al Hamra', ar: 'الحمراء', en: 'Al Hamra' },
      { value: 'Bahla', ar: 'بهلاء', en: 'Bahla' },
      { value: 'Bid Bid', ar: 'بدبد', en: 'Bid Bid' },
      { value: 'Izki', ar: 'إزكي', en: 'Izki' },
      { value: 'Manah', ar: 'منح', en: 'Manah' },
      { value: 'Samail', ar: 'سمائل', en: 'Samail' }
    ]
  },
  {
    value: 'A Sharqiyah North',
    ar: 'شمال الشرقية',
    en: 'A Sharqiyah North',
    wilayats: [
      { value: 'Ibra', ar: 'إبراء', en: 'Ibra' },
      { value: 'Bidiya', ar: 'بدية', en: 'Bidiya' },
      { value: 'Al Kabil', ar: 'القابل', en: 'Al Kabil' },
      { value: 'Al Mudhaibi', ar: 'المضيبي', en: 'Al Mudhaibi' },
      { value: 'Dima W Attayeen', ar: 'دماء والطائيين', en: 'Dima W Attayeen' },
      { value: 'Wadi Bani Khalid', ar: 'وادي بني خالد', en: 'Wadi Bani Khalid' }
    ]
  },
  {
    value: 'A Sharqiyah South',
    ar: 'جنوب الشرقية',
    en: 'A Sharqiyah South',
    wilayats: [
      { value: 'Sur', ar: 'صور', en: 'Sur' },
      { value: 'Al Kamil W Al Wafi', ar: 'الكامل والوافي', en: 'Al Kamil W Al Wafi' },
      { value: 'Jaalan Bani Bu Ali', ar: 'جعلان بني بو علي', en: 'Jaalan Bani Bu Ali' },
      { value: 'Jaalan Bani Bu Hassan', ar: 'جعلان بني بو حسن', en: 'Jaalan Bani Bu Hassan' },
      { value: 'Masirah', ar: 'مصيرة', en: 'Masirah' }
    ]
  },
  {
    value: 'Al Wusta',
    ar: 'الوسطى',
    en: 'Al Wusta',
    wilayats: [
      { value: 'Haima', ar: 'هيماء', en: 'Haima' },
      { value: 'Al Jazer', ar: 'الجازر', en: 'Al Jazer' },
      { value: 'Duqm', ar: 'الدقم', en: 'Duqm' },
      { value: 'Mahout', ar: 'محوت', en: 'Mahout' }
    ]
  },
  {
    value: 'Dhofar',
    ar: 'ظفار',
    en: 'Dhofar',
    wilayats: [
      { value: 'Salalah', ar: 'صلالة', en: 'Salalah' },
      { value: 'Al Mazyona', ar: 'المزيونة', en: 'Al Mazyona' },
      { value: 'Dhalkut', ar: 'ضلكوت', en: 'Dhalkut' },
      { value: 'Mirbat', ar: 'مرباط', en: 'Mirbat' },
      { value: 'Muqshin', ar: 'مقشن', en: 'Muqshin' },
      { value: 'Rakhyut', ar: 'رخيوت', en: 'Rakhyut' },
      { value: 'Sadah', ar: 'سدح', en: 'Sadah' },
      { value: 'Shalim and Hallaniyat Islands', ar: 'شليم وجزر الحلانيات', en: 'Shalim and Hallaniyat Islands' },
      { value: 'Taqah', ar: 'طاقة', en: 'Taqah' },
      { value: 'Thumrait', ar: 'ثمريت', en: 'Thumrait' }
    ]
  }
]


const translations = {
  ar: {
    announcement: 'توصيل لجميع ولايات سلطنة عُمان',
    home: 'الرئيسية', shop: 'المنتجات', about: 'من نحن', contact: 'تواصل معنا', gallery: 'المعرض', trackOrder: 'تتبع الطلب', ordersNav: 'طلباتي',
    search: 'ابحث عن المنتجات...', categories: 'تسوق حسب الفئة',
    featured: 'منتجات مميزة', allProducts: 'جميع المنتجات', viewAll: 'عرض الكل',
    add: 'أضف إلى السلة', details: 'التفاصيل', cart: 'سلة التسوق',
    emptyCart: 'سلتك فارغة حالياً', continue: 'تابع التسوق', total: 'الإجمالي',
    checkout: 'إتمام الطلب عبر واتساب', name: 'الاسم', phone: 'رقم الهاتف',
    address: 'العنوان والولاية', notes: 'ملاحظات إضافية', sendOrder: 'إرسال الطلب',
    quantity: 'الكمية', delivery: 'توصيل لجميع الولايات',
    quality: 'منتجات مختارة بعناية', support: 'نحن هنا لمساعدتك',
    heroTitle: 'كل التفاصيل الحلوة لراحة قطك وسعادته',
heroText: 'من المنتجات اليومية إلى الأشياء المميزة، اختار لقطك كل اللي يحبه ويحتاجه.',

aboutTitle: 'لأن قطك يستاهل الدلال',
aboutText: 'في NIZWA CAT، نعرف إن قطك ليس مجرد حيوان أليف، هو فرد من العائلة ويستاهل كل الحب والاهتمام. عشان كذا اخترنا لكم منتجات تجمع بين الجودة والراحة والذوق، ونتمنى نكون دايم جزء من لحظاتكم الحلوة مع قططكم.',
    footerText: 'من نزوى، نختار لقططكم أشياء تستاهل الدلال.',
    admin: 'لوحة الإدارة', login: 'تسجيل دخول المدير', email: 'البريد الإلكتروني',
    password: 'كلمة المرور', signIn: 'دخول', logout: 'تسجيل الخروج',
    products: 'المنتجات', manageCategories: 'إدارة الفئات',
    addProduct: 'إضافة منتج', editProduct: 'تعديل المنتج',
    productNameEn: 'اسم المنتج بالإنجليزية', productNameAr: 'اسم المنتج بالعربية',
    descriptionEn: 'الوصف بالإنجليزية', descriptionAr: 'الوصف بالعربية',
    price: 'السعر (ر.ع)', category: 'الفئة', image: 'صورة المنتج',
    featuredProduct: 'منتج مميز', save: 'حفظ', cancel: 'إلغاء', delete: 'حذف',
    addCategory: 'إضافة فئة', editCategory: 'تعديل', updateCategory: 'حفظ التعديلات', categoryNameEn: 'اسم الفئة بالإنجليزية',
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
    
deliveryMethod: 'طريقة التوصيل',
homeDelivery: 'توصيل للبيت',
officeDelivery: 'توصيل للمكتب',
deliveryFee: 'رسوم التوصيل',
subtotal: 'المجموع الفرعي',
finalTotal: 'الإجمالي النهائي',
governorate: 'المحافظة',
wilayat: 'الولاية',
selectGovernorate: 'اختر المحافظة',
selectWilayat: 'اختر الولاية',
deliveryWeightNote: 'قد تزيد رسوم التوصيل للطلبات التي يزيد وزنها عن 20 كجم.',
orderDeliveryType: 'طريقة التوصيل',

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
    home: 'Home', shop: 'Shop', about: 'About Us', contact: 'Contact', gallery: 'Gallery', trackOrder: 'Track Order', ordersNav: 'Orders',
    search: 'Search products...', categories: 'Shop by category',
    featured: 'Featured products', allProducts: 'All products', viewAll: 'View all',
    add: 'Add to cart', details: 'Details', cart: 'Shopping cart',
    emptyCart: 'Your cart is currently empty', continue: 'Continue shopping',
    total: 'Total', checkout: 'Checkout via WhatsApp', name: 'Name',
    phone: 'Phone number', address: 'Address and wilayat',
    notes: 'Additional notes', sendOrder: 'Send order', quantity: 'Quantity',
    delivery: 'Delivery across Oman', quality: 'Carefully selected products',
    support: 'We are here to help',
    heroTitle: 'Little details for your cat’s comfort and happiness',
heroText: 'From everyday essentials to special little finds, choose everything your cat loves and needs.',
    aboutTitle: 'Because your cat deserves to be spoiled',

    aboutText: 'At NIZWA CAT, we know your cat is more than just a pet — they are part of your family and deserve all the love and care. That is why we bring together products that combine quality, comfort, and style, hoping to be part of your beautiful moments with your cats.',
    footerText: 'From Nizwa, with love and a little extra pampering for your cats.',
    admin: 'Admin panel', login: 'Admin login', email: 'Email',
    password: 'Password', signIn: 'Sign in', logout: 'Log out',
    products: 'Products', manageCategories: 'Manage categories',
    addProduct: 'Add product', editProduct: 'Edit product',
    productNameEn: 'Product name in English', productNameAr: 'Product name in Arabic',
    descriptionEn: 'Description in English', descriptionAr: 'Description in Arabic',
    price: 'Price (OMR)', category: 'Category', image: 'Product image',
    featuredProduct: 'Featured product', save: 'Save', cancel: 'Cancel',
    delete: 'Delete', addCategory: 'Add category', editCategory: 'Edit', updateCategory: 'Save changes',
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
    
deliveryMethod: 'Delivery Method',
homeDelivery: 'Home Delivery',
officeDelivery: 'Office Delivery',
deliveryFee: 'Delivery Fee',
subtotal: 'Subtotal',
finalTotal: 'Final Total',
governorate: 'Governorate',
wilayat: 'Wilayat',
selectGovernorate: 'Select Governorate',
selectWilayat: 'Select Wilayat',
deliveryWeightNote: 'Delivery fees may increase for orders over 20 kg.',
orderDeliveryType: 'Delivery Method',

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

function productDisplayPrice(product) {
  return product?.sale_price != null && Number(product.sale_price) > 0
    ? product.sale_price
    : product?.price
}

function categoryTitle(category, lang) {
  return lang === 'ar'
    ? (category.name_ar || category.name_en || '')
    : (category.name_en || category.name_ar || '')
}

function isKittenCategory(category) {
  return /kitten|kittens|القطط الصغيرة|قطط صغيرة/i.test(
    `${category?.name_en || ''} ${category?.name_ar || ''}`
  )
}

function isAdultCategory(category) {
  return /adult cats|adult|القطط البالغة|قطط بالغة/i.test(
    `${category?.name_en || ''} ${category?.name_ar || ''}`
  )
}

function isAgeCategory(category) {
  return isKittenCategory(category) || isAdultCategory(category)
}

function categorySlug(category) {
  const source = String(category?.name_en || category?.name_ar || category?.id || '')
  const slug = source
    .normalize('NFKD')
    .toLowerCase()
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  return slug || String(category?.id || 'category')
}

function categoryBannerImages(category) {
  // A custom banner selected in the admin panel always takes priority.
  // Read every useful category identifier: database labels and slugs may differ.
  const categoryText = [
    category?.name_en,
    category?.name_ar,
    category?.name,
    category?.slug,
    category?.slug_en,
    category?.slug_ar,
    category?.id,
  ]
    .filter(Boolean)
    .join(' ')
    .normalize('NFKC')
    .toLowerCase()
    .replace(/[أإآ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/[ًٌٍَُِّْ]/g, ' ')
    .replace(/[_–—]+/g, '-')

  let baseName = ''
  if (/kitten|kittens|قطط صغيرة|القطط الصغيرة/.test(categoryText)) {
    baseName = 'category-kitten'
  } else if (/adult[- ]?cats?|adult|القطط البالغة|قطط بالغة/.test(categoryText)) {
    baseName = 'category-adult-cats'
  } else if (/litter|cat[- ]?sand|sand[- ]?cat|cat[- ]?litter|رمل|الرمل|تراب|فضلات القطط/.test(categoryText)) {
    baseName = 'category-cat-litter'
  } else if (/dry[- ]?food|food[- ]?dry|dry[- ]?cat[- ]?food|kibble|غذاء جاف|طعام جاف|اكل جاف|أكل جاف/.test(categoryText)) {
    baseName = 'category-dry-food'
  }

  if (!baseName) return [category?.banner_url, '/images/hero-luxury-cat.jpeg'].filter(Boolean)

  // Put the exact uploaded filenames first so the correct banner loads immediately.
  const exactUploadedFiles = {
    'category-dry-food': '/images/category-dry-food.jpeg.JPG',
    'category-cat-litter': '/images/category-cat-litter.jpeg.JPG',
    'category-kitten': '/images/category-kitten.jpeg.JPG.JPG',
    'category-adult-cats': '/images/category-adult-cats.jpeg.JPG.JPG',
  }

  return [
    category?.banner_url,
    exactUploadedFiles[baseName],
    `/images/${baseName}.jpeg.JPG.JPG`,
    `/images/${baseName}.jpg.JPG.JPG`,
    `/images/${baseName}.jpeg.JPG`,
    `/images/${baseName}.jpg.JPG`,
    `/images/${baseName}.jpeg`,
    `/images/${baseName}.jpg`,
    `/images/${baseName}.JPG`,
    '/images/hero-luxury-cat.jpeg',
  ].filter((value, index, items) => value && items.indexOf(value) === index)
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


  useEffect(() => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return

    const selector = '.product-card, .category-section .category-card, .age-category-card, .subcategory-card, .subcategory-item'
    const revealed = new WeakSet()

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('nizwa-reveal-visible')
          observer.unobserve(entry.target)
        }
      })
    }, { threshold: 0.08, rootMargin: '0px 0px -35px 0px' })

    const scan = (root = document) => {
      if (root.matches?.(selector) && !revealed.has(root)) {
        revealed.add(root)
        root.classList.add('nizwa-reveal')
        observer.observe(root)
      }
      root.querySelectorAll?.(selector).forEach((element, index) => {
        if (revealed.has(element)) return
        revealed.add(element)
        element.style.setProperty('--nizwa-reveal-delay', `${Math.min(index, 7) * 35}ms`)
        element.classList.add('nizwa-reveal')
        observer.observe(element)
      })
    }

    scan()
    const mutationObserver = new MutationObserver(mutations => {
      mutations.forEach(mutation => mutation.addedNodes.forEach(node => {
        if (node.nodeType === 1) scan(node)
      }))
    })
    mutationObserver.observe(document.body, { childList: true, subtree: true })

    return () => {
      observer.disconnect()
      mutationObserver.disconnect()
    }
  }, [])



useEffect(() => {
  const syncAdminRoute = () => {
    const isAdminRoute = window.location.pathname.replace(/\/+$/, '') === '/admin'
    setAdminOpen(isAdminRoute)
    if (isAdminRoute) setMobileOpen(false)
  }
  syncAdminRoute()
  window.addEventListener('popstate', syncAdminRoute)
  return () => window.removeEventListener('popstate', syncAdminRoute)
}, [])

useEffect(() => {
  if (!new URLSearchParams(window.location.search).has('debug')) return

  const measure = () => {
    const getTop = (selector) => {
      const el = document.querySelector(selector)
      return el
        ? Math.round(el.getBoundingClientRect().top)
        : 'not found'
    }

    setDebugInfo({
      scrollY: Math.round(window.scrollY),
      docScrollTop: Math.round(document.documentElement.scrollTop),
      viewportOffsetTop: Math.round(window.visualViewport?.offsetTop ?? -1),
      viewportPageTop: Math.round(window.visualViewport?.pageTop ?? -1),
      viewportHeight: Math.round(window.visualViewport?.height ?? -1),
      announcementTop: getTop('.announcement'),
      headerTop: getTop('.site-header'),
      heroTop: getTop('.hero'),
      eyebrowTop: getTop('.hero-content .eyebrow'),
    })
  }

  measure()

  window.addEventListener('scroll', measure, { passive: true })
  window.visualViewport?.addEventListener('scroll', measure)
  window.visualViewport?.addEventListener('resize', measure)
  window.addEventListener('resize', measure)

  const interval = window.setInterval(measure, 500)

  return () => {
    window.removeEventListener('scroll', measure)
    window.visualViewport?.removeEventListener('scroll', measure)
    window.visualViewport?.removeEventListener('resize', measure)
    window.removeEventListener('resize', measure)
    window.clearInterval(interval)
  }
}, [])
  const [lang, setLang] = useState('ar')
  const [introVisible, setIntroVisible] = useState(() => {
  try {
    return sessionStorage.getItem('nizwa-cat-intro-seen') !== '1'
  } catch {
    return true
  }
})
  const [introLeaving, setIntroLeaving] = useState(false)
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [subcategories, setSubcategories] = useState([])
  const [productCategoryLinks, setProductCategoryLinks] = useState([])
  const [activeSubcategory, setActiveSubcategory] = useState('all')
  const [productOptions, setProductOptions] = useState([])
  const [optionValues, setOptionValues] = useState([])
  const [productVariants, setProductVariants] = useState([])
  const [variantValues, setVariantValues] = useState([])
  const [productMedia, setProductMedia] = useState([])
  const [activeMediaIndex, setActiveMediaIndex] = useState(0)
  const [mediaUploading, setMediaUploading] = useState(false)
  const [selectedVariantValues, setSelectedVariantValues] = useState({})
  const [activeCategory, setActiveCategory] = useState('all')
  const [categoryPageId, setCategoryPageId] = useState(() => {
    const match = window.location.pathname.match(/^\/category\/([^/]+)\/?$/)
    return match ? decodeURIComponent(match[1]) : null
  })
  const [agePage, setAgePage] = useState(null)
  const [activeView, setActiveView] = useState(null)
  const [lookupPhone, setLookupPhone] = useState('')
  const [lookupOrderId, setLookupOrderId] = useState('')
  const [customerOrders, setCustomerOrders] = useState([])
  const [customerOrdersLoading, setCustomerOrdersLoading] = useState(false)
  const [customerOrdersError, setCustomerOrdersError] = useState('')
  const [customerOrdersSearched, setCustomerOrdersSearched] = useState(false)
  const [search, setSearch] = useState('')
  const [cart, setCart] = useState([])
  const [cartOpen, setCartOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [imageZoomOpen, setImageZoomOpen] = useState(false)
  const [adminOpen, setAdminOpen] = useState(() => window.location.pathname.replace(/\/+$/, '') === '/admin')
  const [adminTab, setAdminTab] = useState('products')
  const [orders, setOrders] = useState([])
  const [ordersLoading, setOrdersLoading] = useState(false)
  const [ordersError, setOrdersError] = useState('')
  const [analyticsRows, setAnalyticsRows] = useState([])
  const [analyticsLoading, setAnalyticsLoading] = useState(false)
  const [analyticsError, setAnalyticsError] = useState('')
  const [session, setSession] = useState(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({
    name_en: '', name_ar: '', description_en: '', description_ar: '',
    price: '', stock: '', category_id: '', subcategory_id: '', selected_category_ids: [], image_url: '', featured: false
  })
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState('')
  const [categoryForm, setCategoryForm] = useState({ name_en: '', name_ar: '' })
  const [subcategoryForm, setSubcategoryForm] = useState({ category_id: '', name_en: '', name_ar: '' })
  const [editingSubcategory, setEditingSubcategory] = useState(null)
  const [editSubcategoryForm, setEditSubcategoryForm] = useState({ name_en: '', name_ar: '' })
  const [editingCategory, setEditingCategory] = useState(null)
  const [adminOrderCategory, setAdminOrderCategory] = useState('all')
  const [reorderingProducts, setReorderingProducts] = useState(false)
  const [editCategoryForm, setEditCategoryForm] = useState({ name_en: '', name_ar: '' })
  const [categoryMediaFiles, setCategoryMediaFiles] = useState({})
  const [categoryMediaPreviews, setCategoryMediaPreviews] = useState({})
  const [categoryMediaRemovals, setCategoryMediaRemovals] = useState({})
  const [optionDraft, setOptionDraft] = useState({ name_en: '', name_ar: '', values: '' })
  const [editingOptionId, setEditingOptionId] = useState(null)
  const [optionEditDraft, setOptionEditDraft] = useState({ name_en: '', name_ar: '', values: '' })
  const [variantBusy, setVariantBusy] = useState(false)
  const [variantImageUploading, setVariantImageUploading] = useState(null)
  
const [customer, setCustomer] = useState({
  name: '',
  phone: '',
  address: '',
  notes: '',
  governorate: '',
  wilayat: '',
  deliveryType: 'home'
})

  const [notice, setNotice] = useState('')
  const [loading, setLoading] = useState(Boolean(isSupabaseConfigured))
  const [saving, setSaving] = useState(false)
  const [storeError, setStoreError] = useState('')
const [debugInfo, setDebugInfo] = useState(null)

useEffect(() => {
  if (!new URLSearchParams(window.location.search).has('debug')) return

  const measure = () => {
    const getTop = (selector) => {
      const el = document.querySelector(selector)
      return el ? Math.round(el.getBoundingClientRect().top) : 'not found'
    }

    setDebugInfo({
      scrollY: Math.round(window.scrollY),
      docScrollTop: Math.round(document.documentElement.scrollTop),
      viewportOffsetTop: Math.round(window.visualViewport?.offsetTop ?? -1),
      viewportPageTop: Math.round(window.visualViewport?.pageTop ?? -1),
      viewportHeight: Math.round(window.visualViewport?.height ?? -1),
      announcementTop: getTop('.announcement'),
      headerTop: getTop('.site-header'),
      heroTop: getTop('.hero'),
      eyebrowTop: getTop('.hero-content .eyebrow'),
    })
  }

  measure()

  window.addEventListener('scroll', measure, { passive: true })
  window.visualViewport?.addEventListener('scroll', measure)
  window.visualViewport?.addEventListener('resize', measure)
  window.addEventListener('resize', measure)

  const interval = window.setInterval(measure, 500)

  return () => {
    window.removeEventListener('scroll', measure)
    window.visualViewport?.removeEventListener('scroll', measure)
    window.visualViewport?.removeEventListener('resize', measure)
    window.removeEventListener('resize', measure)
    window.clearInterval(interval)
  }
}, [])
  const t = translations[lang]
  const rtl = lang === 'ar'

  // Anonymous, privacy-light visitor tracking. One record per visitor per Oman day;
  // the database RPC increments page_views for each distinct page visit.
  useEffect(() => {
    if (!supabase || typeof window === 'undefined') return
    // Do not count visits made while the admin account is signed in.
    if (session) return
    if (window.location.pathname.replace(/\/+$/, '') === '/admin') return
    try {
      let visitorId = window.localStorage.getItem('nizwa-cat-visitor-id')
      if (!visitorId) {
        visitorId = window.crypto?.randomUUID?.()
        if (!visitorId) visitorId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, char => {
          const random = Math.random() * 16 | 0
          return (char === 'x' ? random : (random & 3 | 8)).toString(16)
        })
        window.localStorage.setItem('nizwa-cat-visitor-id', visitorId)
      }
      const path = (window.location.pathname + window.location.search).slice(0, 300) || '/'
      const previous = JSON.parse(window.sessionStorage.getItem('nizwa-cat-last-view') || 'null')
      const now = Date.now()
      if (previous?.path === path && now - Number(previous.time || 0) < 1500) return
      window.sessionStorage.setItem('nizwa-cat-last-view', JSON.stringify({ path, time: now }))
      supabase.rpc('record_site_visit', { p_visitor_id: visitorId, p_page_path: path })
        .then(({ error }) => { if (error) console.warn('Site visit could not be recorded:', error.message) })
    } catch (error) {
      console.warn('Visitor tracking unavailable:', error)
    }
  }, [categoryPageId, agePage, activeView, session])

  const selectedCategoryPage = categories.find(category =>
    String(category.id) === String(categoryPageId) || categorySlug(category) === String(categoryPageId)
  ) || null

  useEffect(() => {
    if (!categoryPageId || !categories.length) return
    if (!selectedCategoryPage) {
      setCategoryPageId(null)
      setActiveCategory('all')
      window.history.replaceState({}, '', '/')
      return
    }
    const canonicalSlug = categorySlug(selectedCategoryPage)
    if (categoryPageId !== canonicalSlug) {
      window.history.replaceState({}, '', `/category/${encodeURIComponent(canonicalSlug)}`)
      setCategoryPageId(canonicalSlug)
    }
    setAgePage(null)
    setActiveCategory(String(selectedCategoryPage.id))
    const categoryHasSubcategories = subcategories.some(item => String(item.category_id) === String(selectedCategoryPage.id))
    setActiveSubcategory(categoryHasSubcategories ? 'choose' : 'all')
  }, [categoryPageId, categories, selectedCategoryPage, subcategories])

  useEffect(() => {
    const syncRoute = () => {
      const match = window.location.pathname.match(/^\/category\/([^/]+)\/?$/)
      setCategoryPageId(match ? decodeURIComponent(match[1]) : null)
      setAgePage(null)
      const nextSlug = match ? decodeURIComponent(match[1]) : null
      const nextCategory = categories.find(item => categorySlug(item) === nextSlug)
      const nextCategoryHasSubcategories = nextCategory && subcategories.some(item => String(item.category_id) === String(nextCategory.id))
      setActiveSubcategory(nextCategoryHasSubcategories ? 'choose' : 'all')
      setSearch('')
      setActiveCategory(nextCategory ? String(nextCategory.id) : 'all')
    }
    window.addEventListener('popstate', syncRoute)
    return () => window.removeEventListener('popstate', syncRoute)
  }, [categories, subcategories])

  // Always show the category banner first when entering or switching pages.
  useEffect(() => {
    if (agePage || categoryPageId) {
      window.scrollTo({ top: 0, behavior: 'instant' })
    }
  }, [agePage, categoryPageId])

  function openCategoryPage(category) {
    // Start downloading the destination banner before React paints the category page.
    const bannerUrl = categoryBannerImages(category)?.[0]
    if (bannerUrl && typeof window !== 'undefined') {
      const bannerPreload = new window.Image()
      bannerPreload.decoding = 'async'
      bannerPreload.src = bannerUrl
    }
    const slug = categorySlug(category)
    window.history.pushState({}, '', `/category/${encodeURIComponent(slug)}`)
    setCategoryPageId(slug)
    setAgePage(null)
    setActiveCategory(String(category.id))
    const categoryHasSubcategories = subcategories.some(item => String(item.category_id) === String(category.id))
    setActiveSubcategory(categoryHasSubcategories ? 'choose' : 'all')
    setSearch('')
    setMobileOpen(false)
    window.scrollTo({ top: 0, behavior: 'instant' })
  }

  function goHome() {
    setActiveView(null)
    window.history.pushState({}, '', '/')
    setCategoryPageId(null)
    setAgePage(null)
    setActiveCategory('all')
    setActiveSubcategory('all')
    setSearch('')
    setMobileOpen(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  useEffect(() => {
    if (!introVisible) return undefined

    // Keep the page anchored at the top while the welcome screen is shown.
    // This avoids a stale scroll position when Chrome on iOS changes its
    // visual viewport as the browser address bar expands or collapses.
    const root = document.documentElement
    const body = document.body
    const previousOverscroll = root.style.overscrollBehavior
    const previousOverflow = body.style.overflow

    root.style.overscrollBehavior = 'none'
    body.style.overflow = 'hidden'
    window.scrollTo(0, 0)

    const leaveTimeout = window.setTimeout(() => setIntroLeaving(true), 2550)
    const hideTimeout = window.setTimeout(() => {
      setIntroVisible(false)
      try { sessionStorage.setItem('nizwa-cat-intro-seen', '1') } catch {}
    }, 3200)

    return () => {
      window.clearTimeout(leaveTimeout)
      window.clearTimeout(hideTimeout)
      root.style.overscrollBehavior = previousOverscroll
      body.style.overflow = previousOverflow
      window.requestAnimationFrame(() => window.scrollTo(0, 0))
    }
  }, [introVisible])

  // Lock the page behind the cart drawer while it is open.
  // Store the current scroll position because iOS Safari/Chrome can still
  // move the document when only overflow:hidden is applied to the body.
  useEffect(() => {
    if (!cartOpen) return undefined

    const scrollY = window.scrollY
    const body = document.body
    const root = document.documentElement

    const previous = {
      position: body.style.position,
      top: body.style.top,
      left: body.style.left,
      right: body.style.right,
      width: body.style.width,
      overflow: body.style.overflow,
      rootOverflow: root.style.overflow,
    }

    body.style.position = 'fixed'
    body.style.top = `-${scrollY}px`
    body.style.left = '0'
    body.style.right = '0'
    body.style.width = '100%'
    body.style.overflow = 'hidden'
    root.style.overflow = 'hidden'

    return () => {
      body.style.position = previous.position
      body.style.top = previous.top
      body.style.left = previous.left
      body.style.right = previous.right
      body.style.width = previous.width
      body.style.overflow = previous.overflow
      root.style.overflow = previous.rootOverflow

      window.scrollTo(0, scrollY)
    }
  }, [cartOpen])

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
        setProductCategoryLinks([])
        setCategories([])
        setProductOptions([])
        setOptionValues([])
        setProductVariants([])
        setVariantValues([])
        setStoreError(translations[lang].setup)
        setLoading(false)
      }
      return
    }

    setLoading(true)
    setStoreError('')
    try {
      const [
        productResult, categoryResult, subcategoryResult, optionsResult,
        valuesResult, variantsResult, variantValuesResult, mediaResult, productCategoriesResult
      ] = await Promise.all([
        supabase.from('products').select('*').order('created_at', { ascending: false }),
        supabase.from('categories').select('*').order('sort_order', { ascending: true }).order('id', { ascending: true }),
        supabase.from('category_subcategories').select('*').order('display_order', { ascending: true }),
        supabase.from('product_options').select('*').order('display_order', { ascending: true }),
        supabase.from('product_option_values').select('*').order('display_order', { ascending: true }),
        supabase.from('product_variants').select('*'),
        supabase.from('product_variant_values').select('*'),
        supabase.from('product_media').select('*').order('display_order', { ascending: true }),
        supabase.from('product_categories').select('*')
      ])
      for (const result of [productResult, categoryResult, optionsResult, valuesResult, variantsResult, variantValuesResult]) {
        if (result.error) throw result.error
      }
      if (mounted) {
        setProducts(Array.isArray(productResult.data) ? productResult.data : [])
        setProductCategoryLinks(!productCategoriesResult.error && Array.isArray(productCategoriesResult.data) ? productCategoriesResult.data : [])
        setCategories(Array.isArray(categoryResult.data) ? categoryResult.data : [])
        setSubcategories(!subcategoryResult.error && Array.isArray(subcategoryResult.data) ? subcategoryResult.data : [])
        setProductOptions(Array.isArray(optionsResult.data) ? optionsResult.data : [])
        setOptionValues(Array.isArray(valuesResult.data) ? valuesResult.data : [])
        setProductVariants(Array.isArray(variantsResult.data) ? variantsResult.data : [])
        setVariantValues(Array.isArray(variantValuesResult.data) ? variantValuesResult.data : [])
        setProductMedia(!mediaResult.error && Array.isArray(mediaResult.data) ? mediaResult.data : [])
        setStoreError('')
      }
    } catch (error) {
      console.error('Store loading error:', error)
      if (mounted) {
        setProducts([])
        setCategories([])
        setProductOptions([])
        setOptionValues([])
        setProductVariants([])
        setVariantValues([])
        setProductMedia([])
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
    const visible = products.filter(product => {
      if (product.is_active === false) return false
      const productLinks = productCategoryLinks.filter(link => String(link.product_id) === String(product.id))
      const productCategoryIds = productLinks.map(link => String(link.category_id))
      // Once a product has relation rows, those rows are authoritative. This
      // allows removing its former primary category without it reappearing there.
      const matchesCategory = activeCategory === 'all' || (productLinks.length
        ? productCategoryIds.includes(String(activeCategory))
        : String(product.category_id || '') === String(activeCategory))
      const categoryLink = productLinks.find(link => String(link.category_id) === String(activeCategory))
      const linkedSubcategoryId = categoryLink?.subcategory_id || (
        String(product.category_id || '') === String(activeCategory) ? product.subcategory_id : null
      )
      const matchesSubcategory = activeSubcategory === 'all' ||
        String(linkedSubcategoryId || '') === String(activeSubcategory)
      const searchable = [
        product.name_en, product.name_ar,
        product.description_en, product.description_ar
      ].filter(Boolean).join(' ').toLowerCase()
      return matchesCategory && matchesSubcategory && (!term || searchable.includes(term))
    })
    if (activeCategory === 'all') return visible
    return [...visible].sort((a, b) => {
      const aOrder = a.display_order !== null && a.display_order !== undefined && Number.isFinite(Number(a.display_order))
        ? Number(a.display_order) : products.indexOf(a)
      const bOrder = b.display_order !== null && b.display_order !== undefined && Number.isFinite(Number(b.display_order))
        ? Number(b.display_order) : products.indexOf(b)
      return aOrder - bOrder
    })
  }, [products, productCategoryLinks, activeCategory, activeSubcategory, search])

  const adminOrderProducts = useMemo(() => {
    const scoped = products.filter(product => {
      if (adminOrderCategory === 'all') return true
      const links = productCategoryLinks.filter(link => String(link.product_id) === String(product.id))
      return links.length
        ? links.some(link => String(link.category_id) === String(adminOrderCategory))
        : String(product.category_id || '') === String(adminOrderCategory)
    })
    return [...scoped].sort((a, b) => {
      if (adminOrderCategory === 'all') {
        const categoryDifference = categories.findIndex(item => String(item.id) === String(a.category_id)) -
          categories.findIndex(item => String(item.id) === String(b.category_id))
        if (categoryDifference !== 0) return categoryDifference
      }
      const aOrder = a.display_order !== null && a.display_order !== undefined && Number.isFinite(Number(a.display_order))
        ? Number(a.display_order) : products.indexOf(a)
      const bOrder = b.display_order !== null && b.display_order !== undefined && Number.isFinite(Number(b.display_order))
        ? Number(b.display_order) : products.indexOf(b)
      return aOrder - bOrder
    })
  }, [products, categories, productCategoryLinks, adminOrderCategory])

  async function moveProductInCategory(product, direction) {
    if (!supabase || !session || reorderingProducts) return
    const categoryProducts = products.filter(item => String(item.category_id || '') === String(product.category_id || ''))
      .sort((a, b) => {
        const aOrder = a.display_order !== null && a.display_order !== undefined && Number.isFinite(Number(a.display_order))
          ? Number(a.display_order) : products.indexOf(a)
        const bOrder = b.display_order !== null && b.display_order !== undefined && Number.isFinite(Number(b.display_order))
          ? Number(b.display_order) : products.indexOf(b)
        return aOrder - bOrder
      })
    const currentIndex = categoryProducts.findIndex(item => String(item.id) === String(product.id))
    const targetIndex = currentIndex + direction
    if (currentIndex < 0 || targetIndex < 0 || targetIndex >= categoryProducts.length) return
    const reordered = [...categoryProducts]
    ;[reordered[currentIndex], reordered[targetIndex]] = [reordered[targetIndex], reordered[currentIndex]]
    setReorderingProducts(true)
    try {
      const updates = await Promise.all(reordered.map((item, index) =>
        supabase.from('products').update({ display_order: index }).eq('id', item.id)
      ))
      const failed = updates.find(result => result.error)
      if (failed?.error) throw failed.error
      setProducts(previous => previous.map(item => {
        const nextIndex = reordered.findIndex(entry => String(entry.id) === String(item.id))
        return nextIndex === -1 ? item : { ...item, display_order: nextIndex }
      }))
      setNotice(lang === 'ar' ? 'تم تحديث ترتيب المنتجات.' : 'Product order updated.')
    } catch (error) {
      console.error('Reorder products error:', error)
      setNotice(error?.message || (lang === 'ar' ? 'تعذر تحديث الترتيب.' : 'Could not update product order.'))
    } finally {
      setReorderingProducts(false)
    }
  }

  const featuredProducts = useMemo(
    () => products.filter(product => product.is_active !== false && product.featured).slice(0, 8),
    [products]
  )
    const ageCategories = useMemo(() => {
    const isKitten = category =>
      /kitten|kittens|القطط الصغيرة|قطط صغيرة/i.test(
        `${category.name_en || ''} ${category.name_ar || ''}`
      )

    const isAdult = category =>
      /adult cats|adult|القطط البالغة|قطط بالغة/i.test(
        `${category.name_en || ''} ${category.name_ar || ''}`
      )

    return {
      kitten: categories.find(isKitten),
      adult: categories.find(isAdult)
    }
  }, [categories])

  // Homepage Explore is reserved for broad shopping departments. Food types
  // (Dry Food, Wet Food, Treats, etc.) belong inside Kitten / Adult Cats.
  // Keep the underlying categories and product links intact; this only changes
  // which category cards are shown on the homepage.
  const isFoodTypeCategory = category =>
    /\b(dry\s*food|wet\s*food|cat\s*food|food|treats?|snacks?|milk|supplements?|nutrition)\b|\b(غذاء|طعام|أطعمة|اكل|أكل|وجبات|مكافآت|حليب|مكملات)\b/i.test(
      `${category.name_en || ''} ${category.name_ar || ''}`
    )

  const homepageCategoryOrder = category => {
    const label = `${category.name_en || ''} ${category.name_ar || ''}`.toLowerCase()
    if (/litter|رمل|مستلزمات/.test(label)) return 0
    if (/toy|ألعاب|العاب/.test(label)) return 1
    if (/groom|care|hygiene|شامبو|شامب|مشط|تمشيط|عناية|نظافة/.test(label)) return 2
    if (/accessor|إكسسوار|اكسسوار|إكسسوارات|اكسسوارات/.test(label)) return 3
    return 4
  }

  const otherCategories = categories
    .filter(category =>
      String(category.id) !== String(ageCategories.kitten?.id || '') &&
      String(category.id) !== String(ageCategories.adult?.id || '') &&
      !isFoodTypeCategory(category)
    )
    .sort((a, b) => homepageCategoryOrder(a) - homepageCategoryOrder(b))
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)
  const cartTotal = cart.reduce(
    (sum, item) => sum + Number(item.price || 0) * item.quantity, 0
  )

const deliveryFee = customer.deliveryType === 'office' ? 1 : 2

const orderGrandTotal = cartTotal + deliveryFee

const selectedGovernorate = OMAN_GOVERNORATES.find(
  item => item.value === customer.governorate
)

const availableWilayats = selectedGovernorate?.wilayats || []

  function openProductDetails(product) {
    // Warm the browser cache so the detail view can reuse the product-card image.
    if (product?.image_url && typeof window !== 'undefined') {
      const productPreload = new window.Image()
      productPreload.decoding = 'async'
      productPreload.src = product.image_url
    }
    setSelectedProduct(product)
    // Start with the selected variant's own image when one is configured.
    setActiveMediaIndex(-1)
    const groups = productOptions.filter(option => String(option.product_id) === String(product.id))
    const defaults = {}
    groups.forEach(option => {
      const firstValue = optionValues.find(value => String(value.option_id) === String(option.id))
      if (firstValue) defaults[option.id] = String(firstValue.id)
    })
    setSelectedVariantValues(defaults)
  }

  const selectedProductOptions = selectedProduct
    ? productOptions.filter(option => String(option.product_id) === String(selectedProduct.id))
    : []

  const selectedProductVariants = selectedProduct
    ? productVariants.filter(variant => String(variant.product_id) === String(selectedProduct.id) && variant.is_active === true)
    : []

  const selectedVariant = selectedProduct && selectedProductOptions.length > 0
    ? selectedProductVariants.find(variant => {
        const links = variantValues.filter(link => String(link.variant_id) === String(variant.id))
        return selectedProductOptions.every(option =>
          links.some(link =>
            String(link.option_id) === String(option.id) &&
            String(link.option_value_id) === String(selectedVariantValues[option.id] || '')
          )
        ) && links.length === selectedProductOptions.length
      }) || null
    : null

  const selectedProductMedia = selectedProduct
    ? productMedia.filter(item => String(item.product_id) === String(selectedProduct.id)).sort((a, b) => Number(Boolean(b.is_primary)) - Number(Boolean(a.is_primary)) || Number(a.display_order || 0) - Number(b.display_order || 0))
    : []
  const selectedVariantMediaUrl = selectedVariant?.image_url || ''
  const visibleProductMedia = selectedProductMedia.length
    ? selectedProductMedia
    : (selectedProduct?.image_url ? [{ id: 'legacy-cover', media_type: 'image', media_url: selectedProduct.image_url, is_primary: true }] : [])
  const activeProductMedia = visibleProductMedia[activeMediaIndex] || visibleProductMedia[0] || null
  const isVariantImageActive = activeMediaIndex === -1 && Boolean(selectedVariantMediaUrl)
  const displayedProductImageUrl = isVariantImageActive
    ? selectedVariantMediaUrl
    : (activeProductMedia?.media_type === 'image' ? activeProductMedia.media_url : selectedProduct?.image_url || NO_IMAGE)

  function variantForOptionValue(option, value) {
    if (!selectedProduct) return null
    const targetValues = { ...selectedVariantValues, [option.id]: String(value.id) }
    return selectedProductVariants.find(variant => {
      const links = variantValues.filter(link => String(link.variant_id) === String(variant.id))
      return selectedProductOptions.every(group => links.some(link =>
        String(link.option_id) === String(group.id) &&
        String(link.option_value_id) === String(targetValues[group.id] || '')
      )) && links.length === selectedProductOptions.length
    }) || null
  }

  function selectVariantOptionValue(option, value) {
    setSelectedVariantValues(current => ({ ...current, [option.id]: String(value.id) }))
    // Return the main viewer to the selected variant image. Customers can still
    // tap any gallery thumbnail to browse the product's other photos/videos.
    setActiveMediaIndex(-1)
  }

  function moveZoomMedia(direction) {
    if (!visibleProductMedia.length) return
    // When the selected variant image is enlarged, the next/previous arrows
    // enter the product gallery without closing the zoom viewer.
    setActiveMediaIndex(current => {
      if (current === -1) return direction > 0 ? 0 : visibleProductMedia.length - 1
      return (current + direction + visibleProductMedia.length) % visibleProductMedia.length
    })
  }

  function variantOptionSummary(variant, language = lang) {
    if (!variant) return ''
    const links = variantValues.filter(link => String(link.variant_id) === String(variant.id))
    return links.map(link => {
      const value = optionValues.find(optionValue => String(optionValue.id) === String(link.option_value_id))
      if (!value) return ''
      return `${language === 'ar' ? value.label_ar || value.label_en : value.label_en || value.label_ar}`
    }).filter(Boolean).join(' / ')
  }

  function addToCart(product, variant = null) {
    const cartKey = `${product.id}:${variant ? variant.id : 'simple'}`
    const cartItem = {
      ...product,
      price: variant
        ? (variant.sale_price != null && Number(variant.sale_price) > 0 ? variant.sale_price : variant.price)
        : (product.sale_price != null && Number(product.sale_price) > 0 ? product.sale_price : product.price),
      image_url: variant?.image_url || product.image_url,
      variant_id: variant?.id || null,
      variant_sku: variant?.sku || '',
      variant_label: variantOptionSummary(variant),
      cartKey,
      quantity: 1
    }
    setCart(current => {
      const found = current.find(item => item.cartKey === cartKey)
      if (found) return current.map(item =>
        item.cartKey === cartKey ? { ...item, quantity: item.quantity + 1 } : item
      )
      return [...current, cartItem]
    })
    setNotice(t.added)
    if (selectedProduct) setSelectedProduct(null)
  }

  function changeQuantity(cartKey, amount) {
    setCart(current => current
      .map(item => item.cartKey === cartKey
        ? { ...item, quantity: item.quantity + amount } : item)
      .filter(item => item.quantity > 0)
    )
  }

  function removeFromCart(cartKey) {
    setCart(current => current.filter(item => item.cartKey !== cartKey))
  }

  
async function sendWhatsAppOrder() {
  if (!cart.length) {
    setNotice(t.emptyCart)
    return
  }

  if (
    !customer.name.trim() ||
    !customer.phone.trim() ||
    !customer.address.trim() ||
    !customer.governorate ||
    !customer.wilayat
  ) {
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
      ...(item.variant_id ? { variant_id: item.variant_id } : {}),
      quantity: item.quantity
    }))

    const { data, error } = await supabase.rpc('create_store_order_v2', {
      p_customer_name: customer.name.trim(),
      p_customer_phone: customer.phone.trim(),
      p_customer_address: customer.address.trim(),
      p_customer_notes: customer.notes.trim(),
      p_language: lang,
      p_items: rpcItems,
      p_delivery_type: customer.deliveryType,
      p_governorate: customer.governorate,
      p_wilayat: customer.wilayat
    })

    if (error) throw error

    const savedOrder = Array.isArray(data) ? data[0] : data
    const orderId = savedOrder?.order_id
    const savedTotal = savedOrder?.order_total

    if (!orderId) {
      throw new Error('Order was saved without a returned order ID.')
    }

    const lines = cart.map(item => {
      const details = [item.variant_label, item.variant_sku ? `SKU: ${item.variant_sku}` : ''].filter(Boolean).join(' · ')
      const galleryImage = productMedia.find(media =>
        String(media.product_id) === String(item.id) &&
        media.media_type === 'image' &&
        (media.is_primary || !productMedia.some(primary => String(primary.product_id) === String(item.id) && primary.media_type === 'image' && primary.is_primary))
      )?.media_url
      const photoUrl = item.image_url || galleryImage || item.product_image_url || ''
      const safePhotoUrl = /^https?:\/\//i.test(photoUrl) ? photoUrl : ''
      const productLine = `• ${productTitle(item, lang)}${details ? ` (${details})` : ''} × ${item.quantity} — ${money(Number(item.price || 0) * item.quantity, lang)}`
      return safePhotoUrl ? `${productLine}\n📷 ${safePhotoUrl}` : productLine
    })

    const deliveryName = customer.deliveryType === 'home'
      ? t.homeDelivery
      : t.officeDelivery

    const governorateName =
      OMAN_GOVERNORATES.find(item => item.value === customer.governorate)?.[lang]
      || customer.governorate

    const wilayatName =
      OMAN_GOVERNORATES
        .flatMap(item => item.wilayats)
        .find(item => item.value === customer.wilayat)?.[lang]
      || customer.wilayat

    const message = [
      t.orderIntro,
      `${t.orderNumber}: ${orderId}`,
      '',
      ...lines,
      '',
      `${t.subtotal}: ${money(cartTotal, lang)}`,
      `${t.deliveryMethod}: ${deliveryName}`,
      `${t.deliveryFee}: ${money(deliveryFee, lang)}`,
      `${t.orderTotal}: ${money(savedTotal, lang)}`,
      '',
      `${t.orderName}: ${customer.name}`,
      `${t.orderPhone}: ${customer.phone}`,
      `${t.governorate}: ${governorateName}`,
      `${t.wilayat}: ${wilayatName}`,
      `${t.orderAddress}: ${customer.address}`,
      customer.notes ? `${t.orderNotes}: ${customer.notes}` : ''
    ].filter(Boolean).join('\n')

    const url = `https://wa.me/${WA}?text=${encodeURIComponent(message)}`

    setCart([])
    setCustomer({
      name: '',
      phone: '',
      address: '',
      notes: '',
      governorate: '',
      wilayat: '',
      deliveryType: 'home'
    })

    setCartOpen(false)
    setNotice(t.orderSaved)

    window.location.assign(url)

  } catch (error) {
    console.error('Create order error:', error)
    setNotice(`${t.orderFailed} ${error?.message || ''}`)
  } finally {
    setSaving(false)
  }
}
async function loadAnalytics() {
    if (!supabase || !session) return
    setAnalyticsLoading(true)
    setAnalyticsError('')
    try {
      const since = new Date()
      since.setDate(since.getDate() - 29)
      const localDate = new Date(since.getTime() - since.getTimezoneOffset() * 60000).toISOString().slice(0, 10)
      const { data, error } = await supabase
        .from('site_visits')
        .select('visitor_id,visit_date,page_views,last_path,last_seen_at')
        .gte('visit_date', localDate)
        .order('visit_date', { ascending: false })
        .limit(1000)
      if (error) throw error
      setAnalyticsRows(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Load site analytics error:', error)
      setAnalyticsError(error.message || (lang === 'ar' ? 'تعذر تحميل الإحصائيات.' : 'Could not load analytics.'))
      setAnalyticsRows([])
    } finally {
      setAnalyticsLoading(false)
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

  async function lookupCustomerOrders(event, view = activeView) {
    event?.preventDefault?.()
    const phone = lookupPhone.trim()
    const orderId = lookupOrderId.trim()
    if (!phone || !orderId) {
      setCustomerOrdersError(lang === 'ar'
        ? 'أدخل رقم الطلب ورقم الهاتف المسجل في الطلب.'
        : 'Enter the order number and the phone number used for the order.')
      return
    }
    if (!/^\d+$/.test(orderId)) {
      setCustomerOrdersError(lang === 'ar' ? 'رقم الطلب غير صحيح.' : 'Please enter a valid order number.')
      return
    }
    if (!supabase) {
      setCustomerOrdersError(t.setup)
      return
    }
    setCustomerOrdersLoading(true)
    setCustomerOrdersError('')
    setCustomerOrdersSearched(false)
    setCustomerOrders([])
    try {
      const { data, error } = await supabase.rpc('lookup_customer_orders', {
        p_customer_phone: phone,
        p_order_id: Number(orderId)
      })
      if (error) throw error
      const rows = Array.isArray(data) ? data : (Array.isArray(data?.orders) ? data.orders : [])
      const visibleRows = view === 'track-order'
        ? rows.filter(order => String(order.id) === orderId)
        : rows
      setCustomerOrders(visibleRows)
      setCustomerOrdersSearched(true)
    } catch (error) {
      console.error('Customer order lookup error:', error)
      setCustomerOrdersError(lang === 'ar'
        ? 'تعذر العثور على الطلب. تأكد من رقم الطلب ورقم الهاتف.'
        : 'Could not retrieve the order. Check the order number and phone number.')
    } finally {
      setCustomerOrdersLoading(false)
    }
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
    // Re-fetch products and categories with the authenticated admin session.
    await loadStore()
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
      price: '', stock: '', category_id: categories[0]?.id || '', subcategory_id: '', subcategory_assignments: {}, selected_category_ids: categories[0]?.id ? [String(categories[0].id)] : [],
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
      price: product.price ?? '', stock: product.stock == null ? '' : String(product.stock), category_id: product.category_id || '', subcategory_id: product.subcategory_id || '',
      subcategory_assignments: (() => {
        const links = productCategoryLinks.filter(link => String(link.product_id) === String(product.id))
        const assignments = {}
        links.forEach(link => { if (link.subcategory_id) assignments[String(link.category_id)] = String(link.subcategory_id) })
        const legacySubcategory = subcategories.find(item => String(item.id) === String(product.subcategory_id || ''))
        if (legacySubcategory && !assignments[String(legacySubcategory.category_id)]) {
          assignments[String(legacySubcategory.category_id)] = String(legacySubcategory.id)
        }
        return assignments
      })(),
      selected_category_ids: [...new Set((productCategoryLinks.filter(link => String(link.product_id) === String(product.id)).length
        ? productCategoryLinks.filter(link => String(link.product_id) === String(product.id)).map(link => String(link.category_id))
        : [String(product.category_id || '')]).filter(Boolean))],
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
    const uploadFile = await optimizeImageForUpload(imageFile)
    const extension = uploadFile.type === 'image/webp' ? 'webp' : extensionByType[uploadFile.type]
    const path = `products/${Date.now()}-${Math.random().toString(36).slice(2)}.${extension}`
    const { error } = await supabase.storage
      .from('product-images')
      .upload(path, uploadFile, {
        upsert: false, contentType: uploadFile.type, cacheControl: '31536000'
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
    // When editing an existing product, preserve its current price if the
    // admin is only changing category assignments and leaves the price blank.
    const effectivePrice = form.price === '' && editing
      ? (editing.price ?? 0)
      : form.price
    const price = Number(effectivePrice)
    if (effectivePrice === '' || effectivePrice == null || !Number.isFinite(price) || price < 0) {
      setNotice(t.invalidPrice)
      return
    }

    const selectedIds = [...new Set((form.selected_category_ids || []).map(String).filter(Boolean))]
    if (!selectedIds.length) {
      setNotice(lang === 'ar' ? 'اختر قسمًا واحدًا على الأقل للمنتج.' : 'Select at least one category for this product.')
      return
    }
    const primaryCategoryId = selectedIds.includes(String(form.category_id || '')) ? String(form.category_id) : selectedIds[0]
    const subcategoryAssignments = Object.fromEntries(
      Object.entries(form.subcategory_assignments || {}).filter(([categoryId, subcategoryId]) =>
        selectedIds.includes(String(categoryId)) && subcategories.some(item =>
          String(item.id) === String(subcategoryId) && String(item.category_id) === String(categoryId)
        )
      )
    )
    // Backward compatibility: retain the legacy single subcategory selection
    // when it belongs to one of the selected categories.
    const legacySelectedSubcategory = subcategories.find(item => String(item.id) === String(form.subcategory_id || ''))
    if (legacySelectedSubcategory && selectedIds.includes(String(legacySelectedSubcategory.category_id)) &&
        !subcategoryAssignments[String(legacySelectedSubcategory.category_id)]) {
      subcategoryAssignments[String(legacySelectedSubcategory.category_id)] = String(legacySelectedSubcategory.id)
    }
    const primarySubcategoryId = subcategoryAssignments[primaryCategoryId] ||
      (legacySelectedSubcategory && String(legacySelectedSubcategory.category_id) === primaryCategoryId ? legacySelectedSubcategory.id : null)

    setSaving(true)
    try {
      const imageUrl = imageFile ? await uploadProductImage() : form.image_url
      const payload = {
        name_en: form.name_en.trim(), name_ar: form.name_ar.trim(),
        description_en: form.description_en.trim(),
        description_ar: form.description_ar.trim(),
        price,
        // Blank stock means inventory is not tracked for this simple product.
        stock: form.stock === '' ? null : Math.max(0, parseInt(form.stock, 10) || 0),
        category_id: primaryCategoryId || null,
        subcategory_id: primarySubcategoryId || null,
        display_order: editing
          ? (editing.display_order ?? products.filter(item => String(item.category_id || '') === primaryCategoryId).length)
          : products.filter(item => String(item.category_id || '') === primaryCategoryId).reduce((max, item) => Math.max(max, Number(item.display_order ?? -1)), -1) + 1,
        image_url: imageUrl || null, featured: Boolean(form.featured)
      }
      let result
      if (editing) {
        result = await supabase.from('products').update(payload).eq('id', editing.id).select('id').single()
      } else {
        result = await supabase.from('products').insert(payload).select('id').single()
      }
      if (result.error) throw result.error
      const savedProductId = result.data.id
      // product_categories stores only the product/category relationship;
      // ordering remains on the single products row.
      const relationRows = selectedIds.map(categoryId => ({
        product_id: savedProductId,
        category_id: categoryId,
        subcategory_id: subcategoryAssignments[categoryId] || null
      }))
      const { error: linkError } = await supabase.from('product_categories')
        .upsert(relationRows, { onConflict: 'product_id,category_id' })
      if (linkError) throw linkError
      // Read current assignments, then delete only the unchecked relations.
      // Explicit per-category deletes avoid PostgREST NOT IN parsing issues
      // and never create a duplicate product row.
      const { data: existingLinks, error: existingLinksError } = await supabase
        .from('product_categories').select('category_id').eq('product_id', savedProductId)
      if (existingLinksError) throw existingLinksError
      const uncheckedIds = (existingLinks || [])
        .map(link => String(link.category_id))
        .filter(categoryId => !selectedIds.includes(categoryId))
      for (const categoryId of uncheckedIds) {
        const { error: deleteLinkError } = await supabase.from('product_categories')
          .delete().eq('product_id', savedProductId).eq('category_id', categoryId)
        if (deleteLinkError) throw deleteLinkError
      }
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

  async function addProductOption(event) {
    event.preventDefault()
    if (!supabase || !session || !editing) return
    const entries = optionDraft.values.split('\n').map(line => line.trim()).filter(Boolean).map(line => {
      const parts = line.split('|').map(part => part.trim())
      return { label_en: parts[0] || '', label_ar: parts[1] || parts[0] || '' }
    }).filter(item => item.label_en || item.label_ar)
    if ((!optionDraft.name_en.trim() && !optionDraft.name_ar.trim()) || entries.length < 2) {
      setNotice(lang === 'ar' ? 'أدخل اسم الخيار وقيمتين على الأقل.' : 'Enter an option name and at least two values.')
      return
    }
    setVariantBusy(true)
    try {
      const { data: option, error: optionError } = await supabase.from('product_options').insert({
        product_id: editing.id,
        name_en: optionDraft.name_en.trim(),
        name_ar: optionDraft.name_ar.trim(),
        display_order: productOptions.filter(item => String(item.product_id) === String(editing.id)).length,
        is_required: true
      }).select().single()
      if (optionError) throw optionError
      const valuesPayload = entries.map((item, index) => ({
        option_id: option.id,
        label_en: item.label_en,
        label_ar: item.label_ar,
        value_code: (item.label_en || item.label_ar).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || `value-${index + 1}`,
        display_order: index
      }))
      const { error: valuesError } = await supabase.from('product_option_values').insert(valuesPayload)
      if (valuesError) throw valuesError
      setOptionDraft({ name_en: '', name_ar: '', values: '' })
      await loadStore()
      setNotice(lang === 'ar' ? 'تم حفظ الخيار والقيم.' : 'Option and values saved.')
    } catch (error) {
      console.error('Add product option error:', error)
      setNotice(error?.message || (lang === 'ar' ? 'تعذر حفظ الخيار.' : 'Could not save option.'))
    } finally {
      setVariantBusy(false)
    }
  }


  function startEditProductOption(option) {
    const values = optionValues
      .filter(value => String(value.option_id) === String(option.id))
      .sort((a, b) => Number(a.display_order || 0) - Number(b.display_order || 0))
    setEditingOptionId(option.id)
    setOptionEditDraft({
      name_en: option.name_en || '',
      name_ar: option.name_ar || '',
      values: values.map(value => `${value.label_en || ''} | ${value.label_ar || value.label_en || ''}`).join('\n')
    })
  }

  async function saveProductOption(event) {
    event.preventDefault()
    if (!supabase || !session || !editing || !editingOptionId) return
    const entries = optionEditDraft.values.split('\n').map(line => line.trim()).filter(Boolean).map(line => {
      const parts = line.split('|').map(part => part.trim())
      return { label_en: parts[0] || '', label_ar: parts[1] || parts[0] || '' }
    }).filter(item => item.label_en || item.label_ar)
    if ((!optionEditDraft.name_en.trim() && !optionEditDraft.name_ar.trim()) || entries.length < 1) {
      setNotice(lang === 'ar' ? 'أدخل اسم الخيار وقيمة واحدة على الأقل.' : 'Enter an option name and at least one value.')
      return
    }
    setVariantBusy(true)
    try {
      const currentValues = optionValues
        .filter(value => String(value.option_id) === String(editingOptionId))
        .sort((a, b) => Number(a.display_order || 0) - Number(b.display_order || 0))
      const removedValues = currentValues.slice(entries.length)
      if (removedValues.length) {
        const removedIds = removedValues.map(value => value.id)
        const { data: usedLinks, error: usedError } = await supabase
          .from('product_variant_values').select('variant_id')
          .in('option_value_id', removedIds)
        if (usedError) throw usedError
        const affectedVariantIds = [...new Set((usedLinks || []).map(link => link.variant_id).filter(Boolean))]
        if (affectedVariantIds.length) {
          // Keep variant rows (and any order history referencing them), but retire combinations
          // that contain a value being removed.
          const { error: deactivateError } = await supabase.from('product_variants')
            .update({ is_active: false }).in('id', affectedVariantIds)
          if (deactivateError) throw deactivateError
          const { error: unlinkError } = await supabase.from('product_variant_values')
            .delete().in('variant_id', affectedVariantIds).in('option_value_id', removedIds)
          if (unlinkError) throw unlinkError
        }
      }
      const { error: optionError } = await supabase.from('product_options').update({
        name_en: optionEditDraft.name_en.trim(),
        name_ar: optionEditDraft.name_ar.trim()
      }).eq('id', editingOptionId)
      if (optionError) throw optionError
      for (let index = 0; index < Math.min(currentValues.length, entries.length); index++) {
        const entry = entries[index]
        const { error } = await supabase.from('product_option_values').update({
          label_en: entry.label_en,
          label_ar: entry.label_ar,
          value_code: (entry.label_en || entry.label_ar).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || `value-${index + 1}`,
          display_order: index
        }).eq('id', currentValues[index].id)
        if (error) throw error
      }
      if (entries.length > currentValues.length) {
        const newValues = entries.slice(currentValues.length).map((entry, index) => ({
          option_id: editingOptionId,
          label_en: entry.label_en,
          label_ar: entry.label_ar,
          value_code: (entry.label_en || entry.label_ar).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || `value-${currentValues.length + index + 1}`,
          display_order: currentValues.length + index
        }))
        const { error } = await supabase.from('product_option_values').insert(newValues)
        if (error) throw error
      }
      if (removedValues.length) {
        const { error } = await supabase.from('product_option_values').delete().in('id', removedValues.map(value => value.id))
        if (error) throw error
      }
      setEditingOptionId(null)
      setOptionEditDraft({ name_en: '', name_ar: '', values: '' })
      await loadStore()
      setNotice(lang === 'ar' ? 'تم تحديث الخيار بنجاح.' : 'Option updated successfully.')
    } catch (error) {
      console.error('Update product option error:', error)
      setNotice(error?.message || (lang === 'ar' ? 'تعذر تحديث الخيار.' : 'Could not update option.'))
    } finally {
      setVariantBusy(false)
    }
  }

  async function deleteProductOption(option) {
    if (!supabase || !session) return
    const confirmed = window.confirm(lang === 'ar'
      ? 'هل تريد حذف هذا الخيار وقيمه نهائياً؟ سيتم إيقاف التركيبات المرتبطة به عن البيع مع الاحتفاظ بسجلات الطلبات السابقة.'
      : 'Permanently delete this option and its values? Related variants will be deactivated while past order records are preserved.')
    if (!confirmed) return
    setVariantBusy(true)
    try {
      // The link table stores option_value_id (not option_id), so resolve the
      // option's values first and remove their links before deleting the values.
      const { data: optionValuesForDelete, error: valuesLookupError } = await supabase
        .from('product_option_values')
        .select('id')
        .eq('option_id', option.id)
      if (valuesLookupError) throw valuesLookupError

      const valueIds = (optionValuesForDelete || []).map(value => value.id)
      if (valueIds.length) {
        const { data: linkedRows, error: linksLookupError } = await supabase
          .from('product_variant_values')
          .select('variant_id')
          .in('option_value_id', valueIds)
        if (linksLookupError) throw linksLookupError

        const affectedVariantIds = [...new Set((linkedRows || []).map(row => row.variant_id).filter(Boolean))]
        if (affectedVariantIds.length) {
          // Preserve variant/order rows; only deactivate variants and remove
          // their links to the option values being deleted.
          const { error: deactivateError } = await supabase
            .from('product_variants')
            .update({ is_active: false })
            .in('id', affectedVariantIds)
          if (deactivateError) throw deactivateError

          const { error: unlinkError } = await supabase
            .from('product_variant_values')
            .delete()
            .in('option_value_id', valueIds)
          if (unlinkError) throw unlinkError
        }

        const { error: deleteValuesError } = await supabase
          .from('product_option_values')
          .delete()
          .in('id', valueIds)
        if (deleteValuesError) throw deleteValuesError
      }

      const { error: deleteOptionError } = await supabase
        .from('product_options')
        .delete()
        .eq('id', option.id)
      if (deleteOptionError) throw deleteOptionError

      if (String(editingOptionId) === String(option.id)) {
        setEditingOptionId(null)
        setOptionEditDraft({ name_en: '', name_ar: '', values: '' })
      }
      await loadStore()
      setNotice(lang === 'ar' ? 'تم حذف الخيار وقيمه بنجاح.' : 'Option and its values deleted successfully.')
    } catch (error) {
      console.error('Delete product option error:', error)
      setNotice(error?.message || (lang === 'ar' ? 'تعذر حذف الخيار.' : 'Could not delete option.'))
    } finally {
      setVariantBusy(false)
    }
  }

  async function generateProductVariants() {
    if (!supabase || !session || !editing) return
    const options = productOptions.filter(option => String(option.product_id) === String(editing.id))
    if (!options.length || options.some(option => !optionValues.some(value => String(value.option_id) === String(option.id)))) {
      setNotice(lang === 'ar' ? 'أضف خيارًا واحدًا على الأقل مع قيمه أولاً.' : 'Add at least one option and its values first.')
      return
    }
    const valueGroups = options.map(option => optionValues.filter(value => String(value.option_id) === String(option.id)))
    let combinations = [[]]
    for (const group of valueGroups) combinations = combinations.flatMap(combo => group.map(value => [...combo, value]))
    if (combinations.length > 100) {
      setNotice(lang === 'ar' ? 'عدد التركيبات يتجاوز 100. قلل القيم.' : 'More than 100 combinations. Reduce the option values.')
      return
    }
    setVariantBusy(true)
    try {
      const { data: existingVariants, error: existingError } = await supabase.from('product_variants').select('id,sku,price,stock').eq('product_id', editing.id)
      if (existingError) throw existingError
      const { data: existingLinks, error: linksError } = await supabase.from('product_variant_values').select('variant_id,option_value_id').eq('product_id', editing.id)
      if (linksError) throw linksError
      const byVariant = new Map()
      ;(existingLinks || []).forEach(link => {
        if (!byVariant.has(String(link.variant_id))) byVariant.set(String(link.variant_id), [])
        byVariant.get(String(link.variant_id)).push(String(link.option_value_id))
      })
      const existingSets = new Set((existingVariants || []).map(variant => (byVariant.get(String(variant.id)) || []).sort().join(',')))
      let created = 0
      for (let index = 0; index < combinations.length; index++) {
        const combo = combinations[index]
        const signature = combo.map(value => String(value.id)).sort().join(',')
        if (existingSets.has(signature)) continue
        const labels = combo.map(value => value.value_code || value.label_en || value.label_ar).join('-').toUpperCase().replace(/[^A-Z0-9-]/g, '').slice(0, 32)
        const { data: variant, error: variantError } = await supabase.from('product_variants').insert({
          product_id: editing.id,
          sku: `P${editing.id}-${labels || index + 1}`,
          price: Number(form.price || editing.price || 0),
          stock: 0,
          is_active: true
        }).select().single()
        if (variantError) throw variantError
        const { error: linkInsertError } = await supabase.from('product_variant_values').insert(combo.map(value => ({
          variant_id: variant.id, product_id: editing.id, option_id: value.option_id, option_value_id: value.id
        })))
        if (linkInsertError) throw linkInsertError
        created++
      }
      await loadStore()
      setNotice(lang === 'ar' ? `تم إنشاء ${created} تركيبة جديدة.` : `${created} new variant combinations created.`)
    } catch (error) {
      console.error('Generate variants error:', error)
      setNotice(error?.message || (lang === 'ar' ? 'تعذر إنشاء التركيبات.' : 'Could not generate combinations.'))
      await loadStore()
    } finally {
      setVariantBusy(false)
    }
  }

  async function updateVariant(variant, field, rawValue) {
    if (!supabase || !session) return
    const value = field === 'is_active' ? Boolean(rawValue) : field === 'stock' ? Math.max(0, parseInt(rawValue || '0', 10)) : (field === 'price' || field === 'sale_price') ? (rawValue === '' && field === 'sale_price' ? null : Math.max(0, Number(rawValue || 0))) : (String(rawValue).trim() || null)
    const { error } = await supabase.from('product_variants').update({ [field]: value }).eq('id', variant.id)
    if (error) {
      setNotice(error.message)
      return
    }
    await loadStore()
    setNotice(lang === 'ar' ? 'تم تحديث التركيبة.' : 'Variant updated.')
  }

  async function uploadVariantImage(variant, file) {
    if (!file) return
    if (!supabase || !session) {
      setNotice(lang === 'ar' ? 'يرجى تسجيل الدخول كمدير أولاً.' : 'Please sign in as admin first.')
      return
    }
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!allowedTypes.includes(file.type) || file.size > 5 * 1024 * 1024) {
      setNotice(lang === 'ar' ? 'اختر صورة JPG أو PNG أو WEBP أو GIF بحجم أقل من 5MB.' : 'Choose a JPG, PNG, WEBP, or GIF image under 5MB.')
      return
    }
    const extensionByType = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/gif': 'gif' }
    const uploadFile = await optimizeImageForUpload(file)
    const extension = uploadFile.type === 'image/webp' ? 'webp' : extensionByType[uploadFile.type]
    const path = `variants/${variant.product_id}/${variant.id}-${Date.now()}.${extension}`
    setVariantImageUploading(variant.id)
    try {
      const { error: uploadError } = await supabase.storage.from('product-images').upload(path, uploadFile, {
        upsert: false, contentType: uploadFile.type, cacheControl: '31536000'
      })
      if (uploadError) throw uploadError
      const { data } = supabase.storage.from('product-images').getPublicUrl(path)
      if (!data?.publicUrl) throw new Error(lang === 'ar' ? 'تعذر إنشاء رابط الصورة.' : 'Could not create image URL.')
      const { error: updateError } = await supabase.from('product_variants').update({ image_url: data.publicUrl }).eq('id', variant.id)
      if (updateError) throw updateError
      await loadStore()
      setNotice(lang === 'ar' ? 'تم رفع صورة التركيبة وحفظها بنجاح.' : 'Variant image uploaded and saved successfully.')
    } catch (error) {
      console.error('Variant image upload error:', error)
      setNotice(error?.message || (lang === 'ar' ? 'فشل رفع الصورة. تحقق من إعدادات التخزين.' : 'Image upload failed. Check storage settings.'))
    } finally {
      setVariantImageUploading(null)
    }
  }

  async function uploadProductMedia(product, files) {
    const selectedFiles = Array.from(files || [])
    if (!selectedFiles.length || !supabase || !session) return
    const maxImage = 5 * 1024 * 1024
    const maxVideo = 50 * 1024 * 1024
    for (const file of selectedFiles) {
      const isImage = file.type.startsWith('image/') && ['image/jpeg','image/png','image/webp','image/gif'].includes(file.type)
      const isVideo = ['video/mp4','video/webm','video/quicktime'].includes(file.type)
      if ((!isImage && !isVideo) || file.size > (isVideo ? maxVideo : maxImage)) {
        setNotice(lang === 'ar'
          ? 'الصور: JPG/PNG/WEBP/GIF حتى 5MB. الفيديو: MP4/WEBM/MOV حتى 50MB.'
          : 'Images: JPG/PNG/WEBP/GIF up to 5MB. Videos: MP4/WEBM/MOV up to 50MB.')
        return
      }
    }
    setMediaUploading(true)
    try {
      let nextOrder = productMedia.filter(item => String(item.product_id) === String(product.id)).length
      let hasPrimaryImage = productMedia.some(item => String(item.product_id) === String(product.id) && item.is_primary)
      for (const file of selectedFiles) {
        const isVideo = file.type.startsWith('video/')
        const uploadFile = isVideo ? file : await optimizeImageForUpload(file)
        const extension = uploadFile.type === 'image/webp' ? 'webp' : (uploadFile.name.split('.').pop() || (isVideo ? 'mp4' : 'jpg')).toLowerCase()
        const path = `products/${product.id}/gallery-${Date.now()}-${Math.random().toString(36).slice(2)}.${extension}`
        const { error: uploadError } = await supabase.storage.from('product-images').upload(path, uploadFile, {
          upsert: false, contentType: uploadFile.type, cacheControl: '31536000'
        })
        if (uploadError) throw uploadError
        const { data } = supabase.storage.from('product-images').getPublicUrl(path)
        if (!data?.publicUrl) throw new Error(lang === 'ar' ? 'تعذر إنشاء رابط الملف.' : 'Could not create file URL.')
        const { error: insertError } = await supabase.from('product_media').insert({
          product_id: product.id,
          media_type: isVideo ? 'video' : 'image',
          media_url: data.publicUrl,
          thumbnail_url: isVideo ? null : data.publicUrl,
          alt_en: product.name_en || '',
          alt_ar: product.name_ar || '',
          display_order: nextOrder++,
          is_primary: !hasPrimaryImage && !isVideo
        })
        if (insertError) throw insertError
        if (!isVideo && !hasPrimaryImage) hasPrimaryImage = true
      }
      await loadStore()
      setNotice(lang === 'ar' ? 'تم رفع ملفات المعرض بنجاح.' : 'Gallery files uploaded successfully.')
    } catch (error) {
      console.error('Product media upload error:', error)
      setNotice(error?.message || (lang === 'ar' ? 'تعذر رفع ملفات المعرض.' : 'Could not upload gallery files.'))
    } finally {
      setMediaUploading(false)
    }
  }

  async function updateProductMedia(media, patch) {
    if (!supabase || !session) return
    if (patch.is_primary) {
      const { error: clearError } = await supabase.from('product_media')
        .update({ is_primary: false }).eq('product_id', media.product_id)
      if (clearError) { setNotice(clearError.message); return }
    }
    const { error } = await supabase.from('product_media').update(patch).eq('id', media.id)
    if (error) { setNotice(error.message); return }
    await loadStore()
    setNotice(lang === 'ar' ? 'تم تحديث المعرض.' : 'Gallery updated.')
  }

  async function deleteProductMedia(media) {
    if (!window.confirm(lang === 'ar' ? 'هل تريد حذف هذا الملف من المعرض؟' : 'Remove this file from the gallery?')) return
    const { error } = await supabase.from('product_media').delete().eq('id', media.id)
    if (error) { setNotice(error.message); return }
    await loadStore()
    setNotice(lang === 'ar' ? 'تم حذف الملف.' : 'Media removed.')
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
    const nextSortOrder = categories.reduce(
      (max, category) => Math.max(max, Number(category.sort_order ?? -1)),
      -1
    ) + 1
    const { error } = await supabase.from('categories').insert({
      name_en: categoryForm.name_en.trim(),
      name_ar: categoryForm.name_ar.trim(),
      sort_order: nextSortOrder
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

  async function addSubcategory(event) {
    event.preventDefault()
    if (!supabase || !session) return
    if (!subcategoryForm.category_id || (!subcategoryForm.name_en.trim() && !subcategoryForm.name_ar.trim())) {
      setNotice(t.required)
      return
    }
    setSaving(true)
    try {
      const { error } = await supabase.from('category_subcategories').insert({
        category_id: subcategoryForm.category_id,
        name_en: subcategoryForm.name_en.trim(),
        name_ar: subcategoryForm.name_ar.trim(),
        display_order: subcategories
          .filter(item => String(item.category_id) === String(subcategoryForm.category_id))
          .reduce((max, item) => Math.max(max, Number(item.display_order ?? -1)), -1) + 1
      })
      if (error) throw error
      setSubcategoryForm({ category_id: '', name_en: '', name_ar: '' })
      await loadStore()
      setNotice(t.saved)
    } catch (error) {
      setNotice(error?.message || (lang === 'ar' ? 'تعذر إضافة القسم الفرعي. تأكد من تشغيل SQL أولاً.' : 'Could not add subcategory. Make sure the SQL has been run.'))
    } finally {
      setSaving(false)
    }
  }

  function startEditSubcategory(subcategory) {
    setEditingSubcategory(subcategory.id)
    setEditSubcategoryForm({ name_en: subcategory.name_en || '', name_ar: subcategory.name_ar || '' })
  }

  async function saveSubcategoryEdit(event, subcategory) {
    event.preventDefault()
    if (!supabase || !session) return
    if (!editSubcategoryForm.name_en.trim() && !editSubcategoryForm.name_ar.trim()) {
      setNotice(t.required)
      return
    }
    setSaving(true)
    try {
      const iconFile = categoryMediaFiles[subcategory.id]?.subcategoryIcon
      const iconUrl = iconFile ? await uploadCategoryImage(iconFile, subcategory.id, 'subcategory-icon') : null
      const updates = {
        name_en: editSubcategoryForm.name_en.trim(),
        name_ar: editSubcategoryForm.name_ar.trim()
      }
      if (iconUrl) updates.icon_url = iconUrl
      const { error } = await supabase.from('category_subcategories').update(updates).eq('id', subcategory.id)
      if (error) throw error
      setEditingSubcategory(null)
      setEditSubcategoryForm({ name_en: '', name_ar: '' })
      setCategoryMediaFiles(current => ({ ...current, [subcategory.id]: {} }))
      setCategoryMediaPreviews(current => ({ ...current, [subcategory.id]: {} }))
      await loadStore()
      setNotice(t.saved)
    } catch (error) {
      setNotice(error?.message || t.uploadError)
    } finally {
      setSaving(false)
    }
  }

  async function deleteSubcategory(subcategory) {
    if (!supabase || !session) return
    const used = products.some(product => String(product.subcategory_id || '') === String(subcategory.id))
    if (used) {
      setNotice(lang === 'ar' ? 'لا يمكن حذف قسم فرعي مرتبط بمنتجات. انقل المنتجات أولاً.' : 'This subcategory has products. Reassign them before deleting it.')
      return
    }
    if (!window.confirm(lang === 'ar' ? 'هل تريد حذف هذا القسم الفرعي؟' : 'Delete this subcategory?')) return
    const { error } = await supabase.from('category_subcategories').delete().eq('id', subcategory.id)
    if (error) {
      setNotice(error.message)
      return
    }
    await loadStore()
    setNotice(t.deleted)
  }

  function handleCategoryMediaSelect(categoryId, kind, file) {
    if (!file) return
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!allowedTypes.includes(file.type) || file.size > 5 * 1024 * 1024) {
      setNotice(t.invalidImage)
      return
    }
    setCategoryMediaFiles(current => ({
      ...current,
      [categoryId]: { ...(current[categoryId] || {}), [kind]: file }
    }))
    setCategoryMediaRemovals(current => ({
      ...current,
      [categoryId]: { ...(current[categoryId] || {}), [kind]: false }
    }))
    const reader = new FileReader()
    reader.onload = () => setCategoryMediaPreviews(current => ({
      ...current,
      [categoryId]: { ...(current[categoryId] || {}), [kind]: String(reader.result || '') }
    }))
    reader.readAsDataURL(file)
  }

  async function uploadCategoryImage(file, categoryId, kind) {
    if (!file) return null
    const extensionByType = {
      'image/jpeg': 'jpg', 'image/png': 'png',
      'image/webp': 'webp', 'image/gif': 'gif'
    }
    const uploadFile = await optimizeImageForUpload(file)
    const extension = uploadFile.type === 'image/webp' ? 'webp' : extensionByType[uploadFile.type]
    const path = `categories/${categoryId}/${kind}-${Date.now()}-${Math.random().toString(36).slice(2)}.${extension}`
    const { error } = await supabase.storage.from('product-images').upload(path, uploadFile, {
      upsert: false, contentType: uploadFile.type, cacheControl: '31536000'
    })
    if (error) throw error
    const { data } = supabase.storage.from('product-images').getPublicUrl(path)
    if (!data?.publicUrl) throw new Error(t.uploadError)
    return data.publicUrl
  }

  function startEditCategory(category) {
    setEditingCategory(category.id)
    setEditCategoryForm({
      name_en: category.name_en || '',
      name_ar: category.name_ar || ''
    })
    setCategoryMediaFiles(current => ({ ...current, [category.id]: {} }))
    setCategoryMediaPreviews(current => ({ ...current, [category.id]: {} }))
    setCategoryMediaRemovals(current => ({ ...current, [category.id]: {} }))
  }

  function cancelEditCategory() {
    setEditingCategory(null)
    setEditCategoryForm({ name_en: '', name_ar: '' })
  }

  async function saveCategoryEdit(event, category) {
    event.preventDefault()
    if (!supabase || !session) return
    if (!editCategoryForm.name_en.trim() && !editCategoryForm.name_ar.trim()) {
      setNotice(t.required)
      return
    }
    setSaving(true)
    try {
      const selectedFiles = categoryMediaFiles[category.id] || {}
      const [iconUrl, bannerUrl] = await Promise.all([
        uploadCategoryImage(selectedFiles.icon, category.id, 'icon'),
        uploadCategoryImage(selectedFiles.banner, category.id, 'banner')
      ])
      const updates = {
        name_en: editCategoryForm.name_en.trim(),
        name_ar: editCategoryForm.name_ar.trim()
      }
      if (iconUrl) updates.icon_url = iconUrl
      if (bannerUrl) updates.banner_url = bannerUrl
      if (categoryMediaRemovals[category.id]?.icon) updates.icon_url = null
      if (categoryMediaRemovals[category.id]?.banner) updates.banner_url = null
      const { error } = await supabase.from('categories').update(updates).eq('id', category.id)
      if (error) throw error
      setSaving(false)
      cancelEditCategory()
      await loadStore()
      setNotice(t.saved)
    } catch (error) {
      setSaving(false)
      setNotice(error?.message || t.uploadError)
    }
  }

  async function moveCategory(category, index, direction) {
    if (!supabase || !session || index < 2 || saving) return

    const targetIndex = index + direction
    if (targetIndex < 2 || targetIndex >= categories.length) return

    const otherCategory = categories[targetIndex]
    const currentOrder = Number(category.sort_order ?? index)
    const otherOrder = Number(otherCategory.sort_order ?? targetIndex)

    setSaving(true)
    try {
      const firstUpdate = await supabase.from('categories')
        .update({ sort_order: otherOrder })
        .eq('id', category.id)
      if (firstUpdate.error) throw firstUpdate.error

      const secondUpdate = await supabase.from('categories')
        .update({ sort_order: currentOrder })
        .eq('id', otherCategory.id)
      if (secondUpdate.error) {
        // Restore the first row if the second update fails.
        await supabase.from('categories')
          .update({ sort_order: currentOrder })
          .eq('id', category.id)
        throw secondUpdate.error
      }

      await loadStore()
      setNotice(t.saved)
    } catch (error) {
      setNotice(error?.message || 'Could not reorder categories')
      await loadStore()
    } finally {
      setSaving(false)
    }
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
    setActiveView(null)
    document.getElementById(categoryPageId || agePage ? 'shop' : 'category-section')?.scrollIntoView({ behavior: 'smooth' })
    setMobileOpen(false)
  }

  return (
    <div className={`app ${rtl ? 'rtl' : 'ltr'}`} dir={rtl ? 'rtl' : 'ltr'}>
      <style>{`

        .nizwa-reveal {
          opacity: 0;
          transform: translateY(14px);
          transition: opacity 360ms ease, transform 420ms cubic-bezier(.2,.7,.2,1);
          transition-delay: var(--nizwa-reveal-delay, 0ms);
          will-change: opacity, transform;
        }
        .nizwa-reveal.nizwa-reveal-visible {
          opacity: 1;
          transform: translateY(0);
        }
        .product-card .product-image-button img {
          transition: transform 420ms cubic-bezier(.2,.7,.2,1);
        }
        .product-card:hover .product-image-button img {
          transform: scale(1.035);
        }
        .category-section .category-card,
        .age-category-card {
          transition: transform 260ms ease, box-shadow 260ms ease;
        }
        .category-section .category-card:hover,
        .age-category-card:hover {
          transform: translateY(-3px);
        }
        .primary-button, .add-to-cart-button, .icon-button {
          transition: transform 180ms ease, opacity 180ms ease;
        }
        .primary-button:active, .add-to-cart-button:active, .icon-button:active {
          transform: scale(.98);
        }
        @media (prefers-reduced-motion: reduce) {
          .nizwa-reveal, .nizwa-reveal.nizwa-reveal-visible,
          .product-card .product-image-button img,
          .category-section .category-card, .age-category-card,
          .primary-button, .add-to-cart-button, .icon-button {
            opacity: 1 !important;
            transform: none !important;
            transition: none !important;
            animation: none !important;
          }
        }
        .nizwa-reference-header{display:flex;flex-direction:column;background:#fff;border-bottom:1px solid #eee8f3}
        .nizwa-header-top{width:min(100% - 40px,1240px);margin:0 auto;display:grid;grid-template-columns:auto minmax(220px,1fr) auto;align-items:center;gap:28px;min-height:68px;padding:8px 0}
        .nizwa-header-top .brand{justify-self:start;white-space:nowrap}
        .nizwa-header-search{height:40px;max-width:520px;width:100%;justify-self:center;border:1px solid #ddd5e8;border-radius:24px;display:flex;align-items:center;gap:10px;padding:0 14px;color:#44306f;background:#fff}
        .nizwa-header-search input{border:0!important;outline:0!important;box-shadow:none!important;background:transparent!important;width:100%;min-width:0;color:#30224f;font:inherit;font-size:13px}
        .nizwa-top-actions{display:flex;align-items:center;gap:16px;white-space:nowrap}
        .nizwa-icon-action{border:0;background:transparent;color:#211344;padding:6px;display:grid;place-items:center;cursor:pointer}
        .nizwa-reference-nav{display:flex;justify-content:center;align-items:center;gap:clamp(16px,3vw,38px);min-height:36px;border-top:1px solid #f4f0f7;padding:0 12px}
        .nizwa-reference-nav button,.nizwa-reference-nav a{font-size:12px;font-weight:650;color:#241744;text-decoration:none;padding:9px 2px;white-space:nowrap}
        .nizwa-reference-nav button:hover,.nizwa-reference-nav a:hover{color:#6530a0}
        @media(max-width:760px){.nizwa-header-top{width:calc(100% - 24px);grid-template-columns:1fr auto;gap:8px;min-height:60px}.nizwa-header-search{grid-column:1 / -1;grid-row:2;max-width:none;margin:0 0 8px}.nizwa-top-actions{gap:8px}.nizwa-top-actions .language-toggle{font-size:11px}.nizwa-reference-nav{display:none;flex-wrap:wrap;gap:8px 18px;padding:10px 16px}.nizwa-reference-nav.open{display:flex}.nizwa-reference-nav button,.nizwa-reference-nav a{font-size:13px}.nizwa-header-top .brand-copy small{font-size:10px}}
        .nizwa-intro{position:fixed;inset:0;z-index:99999;display:flex;align-items:center;justify-content:center;flex-direction:column;overflow:hidden;background:radial-gradient(circle at 50% 35%,#fffaf2 0,#f5e9d9 58%,#ead9c6 100%);color:#49372d;animation:introFadeIn .55s ease both}
        .nizwa-intro::before,.nizwa-intro::after{content:"";position:absolute;border-radius:50%;background:rgba(255,255,255,.36);pointer-events:none}
        .nizwa-intro::before{width:330px;height:330px;top:-145px;left:-110px}.nizwa-intro::after{width:260px;height:260px;right:-90px;bottom:-100px}
        .nizwa-intro-cat{display:block;width:min(96vw,1050px);max-height:68vh;height:auto;object-fit:contain;position:relative;z-index:1;border-radius:18px;box-shadow:0 18px 42px rgba(73,58,48,.13);animation:catWelcome 1.15s cubic-bezier(.2,.8,.2,1) both}
        @media(max-width:600px){.nizwa-intro-cat{width:100vw;max-height:none;border-radius:0;box-shadow:none}.nizwa-intro-tagline{margin-top:18px;font-size:clamp(17px,4.6vw,21px)}}
        .nizwa-intro-brand{z-index:1;margin:8px 0 0;font-family:Georgia,serif;font-size:clamp(30px,7vw,46px);font-weight:800;letter-spacing:.14em;color:#49372d;animation:introText .8s .35s both}
        .nizwa-intro-ar{z-index:1;margin:5px 0 0;font-size:15px;letter-spacing:.12em;color:#8d6d55;animation:introText .8s .48s both}
        .nizwa-intro-tagline{z-index:1;margin:18px 18px 0;font-size:clamp(16px,4vw,20px);font-weight:700;text-align:center;color:#72543f;animation:introText .8s .65s both}
        .nizwa-intro-sub{z-index:1;margin:8px 18px 0;font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:#a78b73;animation:introText .8s .8s both}
        .nizwa-intro-leaves{position:absolute;inset:0;pointer-events:none;opacity:.55;background-image:radial-gradient(#c99d75 1.5px,transparent 1.5px);background-size:42px 42px;mask-image:linear-gradient(transparent,#000 35%,#000 70%,transparent)}
        @keyframes introFadeIn{from{opacity:0}to{opacity:1}}@keyframes catWelcome{0%{opacity:0;transform:translateY(42px) scale(.82) rotate(-5deg)}70%{opacity:1;transform:translateY(-7px) scale(1.04) rotate(2deg)}100%{transform:translateY(0) scale(1) rotate(0)}}@keyframes catFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-9px)}}@keyframes introText{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        .nizwa-intro-exit{animation:introExit .65s ease forwards}@keyframes introExit{to{opacity:0;visibility:hidden;transform:scale(1.025)}}

        /* Refined boutique navigation and a continuous delivery announcement. */
        .announcement{
          display:flex!important;align-items:center!important;justify-content:center!important;gap:12px!important;
          width:100%!important;min-height:36px!important;padding:7px 16px!important;overflow:hidden!important;
          background:#493A30!important;color:#FFFCF7!important;border:0!important;
        }
        .announcement>svg{flex:0 0 auto!important;color:#D8BE9F!important;}
        .announcement-marquee{display:block!important;flex:1 1 auto!important;min-width:0!important;overflow:hidden!important;white-space:nowrap!important;}
        .announcement-track{display:flex!important;align-items:center!important;gap:clamp(54px,10vw,120px)!important;width:max-content!important;direction:ltr!important;will-change:transform!important;animation:nizwaAnnouncementTravel 19s linear infinite!important;}
        .announcement-track span{display:block!important;flex:0 0 auto!important;direction:rtl!important;font-size:12px!important;font-weight:650!important;letter-spacing:.025em!important;color:#FFFCF7!important;}
        .announcement:hover .announcement-track{animation-play-state:paused!important;}
        @keyframes nizwaAnnouncementTravel{from{transform:translateX(50%)}to{transform:translateX(-50%)}}
        .nizwa-top-actions .language-toggle{
          min-height:34px!important;padding:0 13px!important;border:1px solid #E9DFD2!important;border-radius:999px!important;
          background:#F7F3EC!important;color:#493A30!important;font-size:11px!important;font-weight:700!important;
          cursor:pointer!important;transition:background .2s ease,color .2s ease,border-color .2s ease,transform .2s ease!important;
        }
        .nizwa-top-actions .language-toggle:hover{background:#493A30!important;border-color:#493A30!important;color:#FFFCF7!important;transform:translateY(-1px)!important;}
        .nizwa-top-actions .nizwa-icon-action,.nizwa-top-actions .cart-button,.nizwa-top-actions .mobile-menu-button{
          position:relative!important;display:grid!important;place-items:center!important;width:38px!important;height:38px!important;
          min-width:38px!important;padding:0!important;border:1px solid #E9DFD2!important;border-radius:50%!important;
          background:#FFFCF7!important;color:#493A30!important;box-shadow:0 3px 10px rgba(73,58,48,.045)!important;
          transition:transform .22s ease,background .22s ease,color .22s ease,border-color .22s ease,box-shadow .22s ease!important;
        }
        .nizwa-top-actions .nizwa-icon-action:hover,.nizwa-top-actions .cart-button:hover,.nizwa-top-actions .mobile-menu-button:hover{
          transform:translateY(-2px)!important;background:#493A30!important;color:#FFFCF7!important;border-color:#493A30!important;
          box-shadow:0 7px 16px rgba(73,58,48,.13)!important;
        }
        .nizwa-top-actions .cart-button span{background:#B69A7D!important;color:#fff!important;border:2px solid #FFFCF7!important;}
        .nizwa-reference-nav{gap:clamp(8px,1.7vw,20px)!important;padding:8px 14px!important;min-height:48px!important;background:#FFFCF7!important;border-top:1px solid #F0E8DE!important;}
        .nizwa-reference-nav button,.nizwa-reference-nav a{
          position:relative!important;display:inline-flex!important;align-items:center!important;justify-content:center!important;
          min-height:34px!important;padding:7px 15px!important;border:1px solid transparent!important;border-radius:999px!important;
          background:transparent!important;color:#493A30!important;font-size:12px!important;font-weight:700!important;
          text-decoration:none!important;transition:background .2s ease,color .2s ease,border-color .2s ease,transform .2s ease,box-shadow .2s ease!important;
        }
        .nizwa-reference-nav button:hover,.nizwa-reference-nav a:hover{
          color:#493A30!important;background:#F7F3EC!important;border-color:#E9DFD2!important;
          transform:translateY(-1px)!important;box-shadow:0 4px 10px rgba(73,58,48,.06)!important;
        }
        @media(max-width:760px){
          .announcement{min-height:34px!important;padding:7px 12px!important;gap:9px!important;}
          .announcement-track{animation-duration:15s!important;}
          .announcement-track span{font-size:11px!important;}
          .nizwa-reference-nav.open button,.nizwa-reference-nav.open a{min-height:44px!important;border-radius:10px!important;margin:2px 0!important;}
          .nizwa-top-actions .nizwa-icon-action,.nizwa-top-actions .cart-button,.nizwa-top-actions .mobile-menu-button{width:34px!important;height:34px!important;min-width:34px!important;}
        }
        @media(prefers-reduced-motion:reduce){.announcement-track{animation:none!important;transform:none!important}.nizwa-top-actions button,.nizwa-reference-nav button,.nizwa-reference-nav a{transition:none!important}}
        .hero{display:grid!important;grid-template-columns:1fr 1.08fr;align-items:center;gap:clamp(22px,5vw,64px);padding:clamp(30px,6vw,76px)!important;border-radius:30px;background:linear-gradient(115deg,#fbf5ed 0%,#f1e4d5 100%);overflow:hidden}
        .hero-content{position:relative;z-index:2}.hero-content h1{max-width:620px;line-height:1.2}.hero-content p{max-width:540px;line-height:1.9}
        .hero-image{position:relative!important;min-height:clamp(250px,34vw,440px);height:100%;border-radius:26px;overflow:hidden;box-shadow:0 22px 55px rgba(76,52,36,.16);background:#e7d8c7}
        .hero-image img{width:100%;height:100%;min-height:clamp(250px,34vw,440px);object-fit:cover;display:block;transform:scale(1.015);transition:transform .8s ease}.hero-image:hover img{transform:scale(1.06)}
        .hero-sticker{backdrop-filter:blur(12px)}
        @media(max-width:760px){
          .hero{display:flex!important;flex-direction:column!important;align-items:stretch!important;justify-content:flex-start!important;grid-template-columns:1fr!important;width:calc(100% - 24px)!important;min-height:0!important;height:auto!important;margin:14px auto 0!important;padding:24px 18px 18px!important;gap:18px!important;border-radius:22px!important;overflow:visible!important}
          .hero-content{display:block!important;position:relative!important;order:0!important;width:100%!important;max-width:none!important;min-height:0!important;height:auto!important;margin:0!important;padding:0!important;visibility:visible!important;opacity:1!important;transform:none!important;text-align:center!important;z-index:2!important}
          .hero-content .eyebrow{display:inline-flex!important;position:static!important;visibility:visible!important;opacity:1!important;justify-content:center!important;margin:0 auto 8px!important}
          .hero-content h1{display:block!important;position:static!important;visibility:visible!important;opacity:1!important;max-width:100%!important;margin:4px auto 10px!important;line-height:1.55!important;overflow:visible!important}
          .hero-content p{display:block!important;visibility:visible!important;opacity:1!important;max-width:100%!important;margin:0 auto!important}
          .hero-content .primary-button{margin:15px auto 0!important}
          .hero-image{order:1!important;width:100%!important;min-height:0!important;height:auto!important;max-height:none!important;margin:0!important;aspect-ratio:auto!important;border-radius:20px!important;overflow:hidden!important}
          .hero-image img{display:block!important;width:100%!important;height:auto!important;min-height:0!important;max-height:none!important;aspect-ratio:auto!important;object-fit:contain!important;object-position:center!important;transform:none!important}
        }
        /* iPhone Chrome: keep the hero heading in normal document flow */
        @media(max-width:760px){
        .app{overflow-x:clip!important;overflow-y:visible!important}
          .hero{position:relative!important;display:flex!important;flex-direction:column!important;align-items:stretch!important;justify-content:flex-start!important;min-height:0!important;height:auto!important;max-height:none!important;overflow:visible!important;transform:none!important;contain:none!important}
          .hero-content{position:relative!important;inset:auto!important;display:flex!important;flex:0 0 auto!important;flex-direction:column!important;align-items:center!important;justify-content:flex-start!important;width:100%!important;height:auto!important;min-height:max-content!important;max-height:none!important;overflow:visible!important;clip-path:none!important;visibility:visible!important;opacity:1!important;transform:none!important}
          .hero-content .eyebrow,.hero-content h1,.hero-content p,.hero-content .primary-button{position:relative!important;inset:auto!important;display:block!important;flex:0 0 auto!important;width:auto!important;height:auto!important;min-height:0!important;max-height:none!important;overflow:visible!important;clip-path:none!important;visibility:visible!important;opacity:1!important;transform:none!important}
          .hero-content .eyebrow{display:inline-flex!important;}
          .hero-content h1{width:100%!important;line-height:1.6!important;overflow-wrap:anywhere!important;margin:6px auto 12px!important;}
          .hero-content p{width:100%!important;white-space:normal!important;}
          .hero-image{flex:0 0 auto!important;position:relative!important;}
        }
        /* Complete responsive header: keep every navigation destination visible on phones. */
        .nizwa-reference-header{position:relative;z-index:50}
        .nizwa-reference-nav{scrollbar-width:thin;scrollbar-color:#c8b69f transparent}
        @media(max-width:760px){
          .nizwa-header-top{grid-template-columns:minmax(0,1fr) auto!important;align-items:center!important}
          .nizwa-header-top .brand{grid-column:2;grid-row:1;justify-self:end}
          .nizwa-top-actions{grid-column:1;grid-row:1;justify-self:start;gap:7px!important}
          .nizwa-header-search{grid-column:1 / -1!important;grid-row:2!important;margin:2px 0 9px!important;height:42px!important}
          .nizwa-reference-nav{display:flex!important;flex-wrap:nowrap!important;justify-content:flex-start!important;gap:18px!important;min-height:42px!important;padding:0 14px 5px!important;overflow-x:auto!important;overflow-y:hidden!important;white-space:nowrap!important;-webkit-overflow-scrolling:touch}
          .nizwa-reference-nav button,.nizwa-reference-nav a{flex:0 0 auto!important;padding:10px 2px!important;font-size:12px!important}
          .nizwa-reference-nav.open{flex-wrap:wrap!important;overflow:visible!important;white-space:normal!important;justify-content:center!important;padding:10px 14px!important;background:#fffaf2!important;border-top:1px solid #eee3d5!important}
          .nizwa-reference-nav.open button,.nizwa-reference-nav.open a{padding:9px 12px!important;border:1px solid #e8ddce!important;border-radius:999px!important;background:#fff!important}
          .nizwa-top-actions .language-toggle{padding:7px 9px!important;border-radius:20px!important}
        }
        /* Homepage departments become generous visual cards like the age cards. */
        .category-section .category-grid{display:grid!important;grid-template-columns:repeat(4,minmax(0,1fr))!important;gap:16px!important}
        .category-section .category-card{position:relative!important;display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:center!important;gap:14px!important;min-height:210px!important;padding:22px 14px!important;border:1px solid #e8ddce!important;border-radius:22px!important;background:linear-gradient(145deg,#fffdf8 0%,#f3ecdf 100%)!important;color:#49372d!important;text-align:center!important;box-shadow:0 8px 24px rgba(76,52,36,.045)!important;transition:transform .2s ease,box-shadow .2s ease!important}
        .category-section .category-card:hover{transform:translateY(-4px)!important;box-shadow:0 14px 30px rgba(76,52,36,.10)!important}
        .category-section .category-card .category-icon{display:grid!important;place-items:center!important;width:112px!important;height:112px!important;flex:0 0 112px!important;overflow:hidden!important;border-radius:24px!important;background:#fffaf2!important;color:#88735d!important}
        .category-section .category-card .category-icon img{width:100%!important;height:100%!important;object-fit:contain!important;padding:8px!important;border-radius:inherit!important}
        .category-section .category-card strong{font-size:15px!important;line-height:1.5!important;font-weight:750!important}
        .category-section .category-card>svg:last-child{position:absolute!important;inset-inline-end:14px!important;top:14px!important;color:#9b8067!important}
        @media(max-width:760px){.category-section .category-grid{grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:12px!important}.category-section .category-card{min-height:178px!important;padding:16px 10px!important;border-radius:18px!important}.category-section .category-card .category-icon{width:88px!important;height:88px!important;flex-basis:88px!important;border-radius:20px!important}.category-section .category-card strong{font-size:13px!important}}
        /* NIZWA CAT premium collection cards: soft depth, calm motion, warm neutrals. */
        .category-section .category-card{
          isolation:isolate!important;overflow:hidden!important;min-height:222px!important;
          border:1px solid #e8ddcf!important;border-radius:25px!important;
          background:linear-gradient(155deg,#fffdf9 0%,#f5eee4 100%)!important;
          box-shadow:0 5px 18px rgba(73,58,48,.045)!important;
          transition:transform .28s cubic-bezier(.2,.7,.2,1),box-shadow .28s ease,border-color .28s ease!important
        }
        .category-section .category-card::after{
          content:"";position:absolute;inset:auto -24px -42px auto;width:112px;height:112px;border-radius:50%;
          background:rgba(182,154,125,.10);z-index:-1;transition:transform .35s ease
        }
        .category-section .category-card:hover,.category-section .category-card:focus-visible{
          transform:translateY(-5px)!important;border-color:#cdb99f!important;
          box-shadow:0 15px 32px rgba(73,58,48,.105)!important;outline:none
        }
        .category-section .category-card:hover::after{transform:scale(1.35)}
        .category-section .category-card .category-icon{
          width:120px!important;height:120px!important;flex-basis:120px!important;border-radius:27px!important;
          background:#fffaf3!important;box-shadow:0 5px 15px rgba(73,58,48,.055)!important;
          transition:transform .3s ease,box-shadow .3s ease!important
        }
        .category-section .category-card:hover .category-icon{transform:translateY(-3px) scale(1.025);box-shadow:0 9px 20px rgba(73,58,48,.09)!important}
        .category-section .category-card .category-icon img{object-fit:contain!important;padding:9px!important}
        .category-section .category-card strong{font-size:15px!important;letter-spacing:.01em;color:#493a30!important}
        .category-section .category-card>svg:last-child{width:28px;height:28px;padding:6px;border-radius:50%;background:#fffaf3;color:#927b68!important;transition:transform .25s ease}
        .category-section .category-card:hover>svg:last-child{transform:translate(-2px,2px)}
        .age-category-card{border-radius:27px!important;overflow:hidden!important;box-shadow:0 8px 24px rgba(73,58,48,.09)!important;transition:transform .3s ease,box-shadow .3s ease!important}
        .age-category-card:hover{transform:translateY(-5px)!important;box-shadow:0 17px 36px rgba(73,58,48,.15)!important}
        .age-category-card img{transition:transform .65s cubic-bezier(.2,.7,.2,1)!important}
        .age-category-card:hover img{transform:scale(1.045)!important}
        .age-category-overlay{background:linear-gradient(180deg,rgba(32,24,18,0) 22%,rgba(32,24,18,.70) 100%)!important}
        .age-category-link{display:inline-flex!important;align-items:center!important;gap:8px!important;padding:9px 14px!important;border:1px solid rgba(255,255,255,.55)!important;border-radius:999px!important;background:rgba(255,252,247,.16)!important;backdrop-filter:blur(8px)!important;transition:background .2s ease,transform .2s ease!important}
        .age-category-card:hover .age-category-link{background:rgba(255,252,247,.28)!important;transform:translateY(-2px)}
        .product-grid{gap:clamp(12px,2vw,22px)!important;align-items:stretch!important}
        .product-card{
          position:relative!important;display:flex!important;flex-direction:column!important;overflow:hidden!important;
          border:1px solid #e9dfd2!important;border-radius:22px!important;background:#fffdf9!important;
          box-shadow:0 5px 18px rgba(73,58,48,.045)!important;
          transition:transform .28s cubic-bezier(.2,.7,.2,1),box-shadow .28s ease,border-color .28s ease!important
        }
        .product-card:hover{transform:translateY(-4px)!important;border-color:#d8c7b3!important;box-shadow:0 15px 30px rgba(73,58,48,.10)!important}
        .product-card .product-image-button{position:relative!important;display:block!important;width:100%!important;overflow:hidden!important;aspect-ratio:1/1!important;background:linear-gradient(145deg,#faf6ef,#f1e9de)!important;border:0!important;border-radius:0!important}
        .product-card .product-image-button img{display:block!important;width:100%!important;height:100%!important;object-fit:contain!important;padding:12px!important;mix-blend-mode:multiply!important}
        .product-card .product-badge{position:absolute!important;top:12px!important;inset-inline-start:12px!important;display:inline-flex!important;align-items:center!important;gap:5px!important;padding:6px 10px!important;border-radius:999px!important;background:#927b68!important;color:#fff!important;font-size:10px!important;font-weight:700!important;box-shadow:0 3px 10px rgba(73,58,48,.12)!important}
        .product-card .product-view{position:absolute!important;inset-inline-end:12px!important;bottom:12px!important;width:32px!important;height:32px!important;display:grid!important;place-items:center!important;border:1px solid rgba(146,123,104,.22)!important;border-radius:50%!important;background:rgba(255,252,247,.9)!important;color:#493a30!important;opacity:.92!important;transition:transform .2s ease,background .2s ease!important}
        .product-card:hover .product-view{transform:translateY(-2px)!important;background:#fff!important}
        .product-card-content{display:flex!important;flex:1!important;flex-direction:column!important;gap:7px!important;padding:14px 14px 13px!important;background:#fffdf9!important}
        .product-card .product-name{display:-webkit-box!important;-webkit-line-clamp:2!important;-webkit-box-orient:vertical!important;overflow:hidden!important;min-height:2.8em!important;text-align:start!important;color:#493a30!important;font-size:13px!important;font-weight:750!important;line-height:1.45!important}
        .product-card-content>p{display:-webkit-box!important;-webkit-line-clamp:2!important;-webkit-box-orient:vertical!important;overflow:hidden!important;min-height:2.6em!important;margin:0!important;color:#8c8176!important;font-size:11px!important;line-height:1.45!important}
        .product-card-pricing{display:flex!important;align-items:baseline!important;flex-wrap:wrap!important;gap:7px!important;margin-top:2px!important}
        .product-card .product-price{color:#493a30!important;font-size:16px!important;font-weight:800!important;letter-spacing:-.02em!important}
        .product-card .product-sale-price{color:#9b594b!important}
        .product-card .product-old-price{color:#a69a8d!important;font-size:11px!important}
        .product-card .product-stock-label{align-self:flex-start!important;padding:4px 8px!important;border-radius:999px!important;background:#edf2e9!important;color:#5f7656!important;font-size:10px!important;font-weight:700!important}
        .product-card .product-stock-label.out-of-stock{background:#f7e9e5!important;color:#a65345!important}
        .product-card-bottom{display:flex!important;align-items:center!important;justify-content:space-between!important;gap:8px!important;margin-top:auto!important;padding-top:8px!important;border-top:1px solid #f0e9e0!important}
        .product-card .product-card-hint{color:#8c8176!important;font-size:10px!important}
        .product-card .add-cart-button{width:36px!important;height:36px!important;min-width:36px!important;display:grid!important;place-items:center!important;border:0!important;border-radius:50%!important;background:#493a30!important;color:#fff!important;box-shadow:0 4px 10px rgba(73,58,48,.14)!important;transition:transform .2s ease,background .2s ease!important}
        .product-card .add-cart-button:hover:not(:disabled){transform:scale(1.06)!important;background:#927b68!important}
        .product-card .add-cart-button:disabled{opacity:.35!important;cursor:not-allowed!important}
        .shop-section .category-card{border-radius:20px!important;background:#fffdf8!important;border:1px solid #e9dfd2!important;box-shadow:0 5px 16px rgba(73,58,48,.045)!important;transition:transform .25s ease,box-shadow .25s ease!important}
        .shop-section .category-card:hover{transform:translateY(-3px)!important;box-shadow:0 12px 24px rgba(73,58,48,.09)!important}
        @media(max-width:760px){
          .category-section .category-card{min-height:170px!important;padding:15px 9px!important;border-radius:19px!important;gap:10px!important}
          .category-section .category-card .category-icon{width:92px!important;height:92px!important;flex-basis:92px!important;border-radius:21px!important}
          .category-section .category-card strong{font-size:12px!important}
          .product-grid{grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:11px!important}
          .product-card{border-radius:17px!important}
          .product-card-content{padding:10px 10px 11px!important;gap:6px!important}
          .product-card .product-image-button img{padding:8px!important}
          .product-card .product-name{font-size:11.5px!important;min-height:2.8em!important}
          .product-card-content>p{font-size:10px!important;min-height:2.5em!important}
          .product-card .product-price{font-size:14px!important}
          .product-card .product-stock-label{font-size:9px!important}
          .product-card .add-cart-button{width:33px!important;height:33px!important;min-width:33px!important}
          .age-category-card{border-radius:20px!important}
        }
        @media(prefers-reduced-motion:reduce){.product-card,.product-card *,.age-category-card,.age-category-card *,.category-section .category-card,.category-section .category-card *{transition:none!important;animation:none!important}}

        @media(prefers-reduced-motion:reduce){.category-section .category-card{transition:none!important}}
        @media(prefers-reduced-motion:reduce){.nizwa-intro-cat,.nizwa-intro-brand,.nizwa-intro-ar,.nizwa-intro-tagline,.nizwa-intro-sub{animation:none!important}.hero-image img{transition:none}}
        
/* Checkout delivery and order summary */
.checkout-field {
  display: flex;
  flex-direction: column;
  gap: 9px;
  margin: 12px 0;
}

.checkout-field > label {
  font-size: 14px;
  font-weight: 700;
}

.checkout-field select {
  width: 100%;
  min-height: 46px;
  padding: 10px 12px;
  border: 1px solid var(--border, #ddd);
  border-radius: 10px;
  background: var(--surface, #fff);
  color: inherit;
  font: inherit;
}

.checkout-field select:disabled {
  opacity: .5;
  cursor: not-allowed;
}

.delivery-options {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 9px;
}

.delivery-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-width: 0;
  padding: 14px 8px;
  border: 1px solid var(--border, #ddd);
  border-radius: 12px;
  background: var(--surface, #fff);
  color: inherit;
  font: inherit;
  cursor: pointer;
  transition: .2s ease;
}

.delivery-option.active {
  border-color: #71835d;
  background: #f0f2e9;
  color: #435437;
  box-shadow: 0 0 0 1px #71835d;
}

.delivery-option span {
  font-size: 13px;
  font-weight: 600;
  text-align: center;
}

.delivery-option strong {
  font-size: 14px;
}

.delivery-weight-note {
  display: block;
  color: var(--muted, #777);
  font-size: 12px;
  line-height: 1.7;
}

.checkout-total-breakdown {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin: 16px 0;
  padding-top: 12px;
  border-top: 1px solid var(--border, #ddd);
}

.checkout-summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  font-size: 14px;
}

.checkout-grand-total {
  padding-top: 12px;
  border-top: 1px solid var(--border, #ddd);
  font-size: 16px;
  font-weight: 800;
}

@media(max-width:480px) {
  .delivery-options {
    gap: 7px;
  }

  .delivery-option {
    padding: 12px 5px;
  }
}


        /* Final mobile header repair: separate brand, controls, search and navigation without overlap. */
        @media (max-width:760px){
          .nizwa-reference-header{width:100%!important;overflow:visible!important}
          .nizwa-header-top{
            box-sizing:border-box!important;
            width:100%!important;
            max-width:100%!important;
            margin:0!important;
            padding:10px 12px!important;
            display:grid!important;
            grid-template-columns:minmax(0,1fr) auto!important;
            grid-template-areas:"actions brand" "search search"!important;
            align-items:center!important;
            column-gap:8px!important;
            row-gap:9px!important;
            min-height:0!important;
            direction:ltr!important;
          }
          .nizwa-header-top>.brand{
            grid-area:brand!important;
            justify-self:end!important;
            align-self:center!important;
            display:flex!important;
            flex-direction:row!important;
            align-items:center!important;
            gap:7px!important;
            min-width:0!important;
            max-width:142px!important;
            padding:0!important;
            white-space:normal!important;
            direction:rtl!important;
          }
          .nizwa-header-top>.brand .brand-icon{display:grid!important;place-items:center!important;flex:0 0 38px!important;width:38px!important;height:38px!important;margin:0!important}
          .nizwa-header-top>.brand .brand-copy{display:flex!important;flex-direction:column!important;min-width:0!important;line-height:1.15!important;text-align:right!important}
          .nizwa-header-top>.brand .brand-copy strong{font-size:14px!important;letter-spacing:.06em!important;white-space:nowrap!important}
          .nizwa-header-top>.brand .brand-copy small{display:block!important;font-size:9px!important;white-space:nowrap!important;letter-spacing:0!important}
          .nizwa-top-actions{
            grid-area:actions!important;
            justify-self:start!important;
            align-self:center!important;
            display:flex!important;
            flex-direction:row!important;
            align-items:center!important;
            justify-content:flex-start!important;
            flex-wrap:nowrap!important;
            gap:5px!important;
            min-width:0!important;
            width:auto!important;
            direction:ltr!important;
          }
          .nizwa-top-actions>*{flex:0 0 auto!important;margin:0!important}
          .nizwa-top-actions .language-toggle{order:5!important;max-width:58px!important;min-width:48px!important;padding:6px 5px!important;font-size:9px!important;line-height:1.2!important;white-space:nowrap!important;overflow:hidden!important}
          .nizwa-top-actions .nizwa-icon-action{width:30px!important;height:34px!important;padding:4px!important}
          .nizwa-top-actions .nizwa-icon-action svg{width:19px!important;height:19px!important}
          .nizwa-top-actions .cart-button{width:34px!important;height:34px!important;min-width:34px!important;padding:5px!important;position:relative!important}
          .nizwa-top-actions .mobile-menu-button{display:grid!important;place-items:center!important;width:32px!important;height:34px!important;padding:4px!important;order:-1!important}
          .nizwa-header-search{grid-area:search!important;display:flex!important;position:relative!important;box-sizing:border-box!important;width:100%!important;max-width:none!important;height:42px!important;min-height:42px!important;margin:0!important;padding:0 13px!important;justify-self:stretch!important}
          .nizwa-header-search input{font-size:13px!important;min-width:0!important}
          .nizwa-reference-nav{
            box-sizing:border-box!important;
            display:flex!important;
            flex-direction:row!important;
            flex-wrap:wrap!important;
            justify-content:center!important;
            align-items:center!important;
            gap:2px 12px!important;
            width:100%!important;
            min-height:40px!important;
            height:auto!important;
            max-height:none!important;
            overflow:visible!important;
            white-space:normal!important;
            padding:6px 10px 8px!important;
            direction:rtl!important;
            border-top:1px solid #f0e8dc!important;
            background:#fffdf8!important;
          }
          .nizwa-reference-nav button,.nizwa-reference-nav a{
            display:inline-flex!important;
            flex:0 0 auto!important;
            align-items:center!important;
            justify-content:center!important;
            min-height:28px!important;
            padding:5px 4px!important;
            font-size:11px!important;
            line-height:1.25!important;
            white-space:nowrap!important;
          }
          .nizwa-reference-nav.open{display:flex!important;flex-wrap:wrap!important;overflow:visible!important}
        }
        @media(max-width:390px){
          .nizwa-header-top{padding-inline:9px!important;column-gap:5px!important}
          .nizwa-header-top>.brand{max-width:126px!important;gap:5px!important}
          .nizwa-header-top>.brand .brand-icon{flex-basis:34px!important;width:34px!important;height:34px!important}
          .nizwa-header-top>.brand .brand-copy strong{font-size:12px!important}
          .nizwa-header-top>.brand .brand-copy small{font-size:8px!important}
          .nizwa-top-actions{gap:3px!important}
          .nizwa-top-actions .language-toggle{min-width:43px!important;max-width:48px!important;font-size:8px!important}
          .nizwa-top-actions .nizwa-icon-action{width:27px!important}
          .nizwa-top-actions .cart-button{width:30px!important;min-width:30px!important}
          .nizwa-top-actions .mobile-menu-button{width:28px!important}
          .nizwa-reference-nav{column-gap:8px!important}
          .nizwa-reference-nav button,.nizwa-reference-nav a{font-size:10px!important}
        }
        /* Keep the mobile navigation collapsed by default so it never covers the homepage hero copy. */
        @media(max-width:760px){
          .nizwa-reference-header{position:relative!important;z-index:100!important;overflow:visible!important}
          .nizwa-reference-nav:not(.open){display:none!important;height:0!important;min-height:0!important;padding:0!important;border:0!important;overflow:hidden!important}
          .nizwa-reference-nav.open{
            display:flex!important;
            position:absolute!important;
            top:100%!important;
            left:0!important;
            right:0!important;
            z-index:101!important;
            width:100%!important;
            max-height:min(60vh,420px)!important;
            overflow-y:auto!important;
            overflow-x:hidden!important;
            flex-direction:column!important;
            flex-wrap:nowrap!important;
            align-items:stretch!important;
            justify-content:flex-start!important;
            gap:0!important;
            padding:8px 16px 12px!important;
            background:#fffdf8!important;
            border-top:1px solid #eee3d5!important;
            border-bottom:1px solid #e8ddce!important;
            box-shadow:0 14px 24px rgba(50,38,27,.12)!important;
          }
          .nizwa-reference-nav.open button,.nizwa-reference-nav.open a{
            display:flex!important;
            width:100%!important;
            min-height:42px!important;
            justify-content:center!important;
            border:0!important;
            border-bottom:1px solid #eee8df!important;
            border-radius:0!important;
            background:transparent!important;
            font-size:13px!important;
          }
          .hero-content{visibility:visible!important;opacity:1!important}
          .hero-content .eyebrow,.hero-content h1,.hero-content p,.hero-content .primary-button{visibility:visible!important;opacity:1!important}
        }

        /* NIZWA CAT launch polish: warmer header details and a clearer hero action area. */
        .nizwa-reference-header{position:relative!important;background:rgba(255,252,247,.97)!important;box-shadow:0 8px 28px rgba(73,58,48,.045)!important;z-index:20!important}
        .nizwa-header-top .brand{gap:10px!important;align-items:center!important;text-decoration:none!important}
        .nizwa-header-top .brand-icon{width:42px!important;height:42px!important;display:grid!important;place-items:center!important;border-radius:15px!important;background:linear-gradient(145deg,#B69A7D,#927B68)!important;color:#FFFCF7!important;box-shadow:0 5px 14px rgba(73,58,48,.14)!important;transition:transform .25s ease,box-shadow .25s ease!important}
        .nizwa-header-top .brand:hover .brand-icon{transform:rotate(-7deg) translateY(-2px)!important;box-shadow:0 8px 18px rgba(73,58,48,.18)!important}
        .nizwa-header-top .brand-copy strong{font-family:Georgia,serif!important;letter-spacing:.11em!important;color:#493A30!important;font-size:17px!important}
        .nizwa-header-top .brand-copy small{color:#927B68!important;letter-spacing:.045em!important;font-size:10px!important}
        .nizwa-header-search{background:#F7F3EC!important;border-color:#E9DFD2!important;color:#927B68!important;transition:border-color .2s ease,box-shadow .2s ease,background .2s ease!important}
        .nizwa-header-search:focus-within{background:#FFFCF7!important;border-color:#B69A7D!important;box-shadow:0 0 0 4px rgba(182,154,125,.13)!important}
        .nizwa-header-search input{color:#493A30!important}
        .nizwa-reference-nav{gap:clamp(5px,1.2vw,16px)!important}
        .nizwa-reference-nav button,.nizwa-reference-nav a{letter-spacing:.01em!important}
        .nizwa-reference-nav button:focus-visible,.nizwa-reference-nav a:focus-visible,.nizwa-top-actions button:focus-visible{outline:2px solid #B69A7D!important;outline-offset:3px!important}
        .hero{position:relative!important;isolation:isolate!important;border:1px solid rgba(182,154,125,.18)!important;box-shadow:0 18px 50px rgba(73,58,48,.055)!important}
        .hero:before{content:"";position:absolute;z-index:-1;width:320px;height:320px;left:-150px;top:-180px;border-radius:50%;background:rgba(255,255,255,.48);pointer-events:none}
        .hero-content .eyebrow{display:inline-flex!important;align-items:center!important;gap:8px!important;padding:8px 13px!important;border:1px solid rgba(182,154,125,.28)!important;border-radius:999px!important;background:rgba(255,252,247,.7)!important;color:#927B68!important;font-size:11px!important;font-weight:750!important;letter-spacing:.12em!important}
        .hero-content h1{color:#493A30!important;letter-spacing:-.025em!important}
        .hero-content p{color:#76685B!important}
        .hero-actions{display:flex!important;align-items:center!important;gap:12px!important;flex-wrap:wrap!important;margin-top:22px!important}
        .hero-actions .primary-button{margin:0!important;min-height:48px!important;padding:0 23px!important;border-radius:999px!important;box-shadow:0 8px 18px rgba(73,58,48,.14)!important}
        .hero-contact-button{display:inline-flex!important;align-items:center!important;justify-content:center!important;gap:8px!important;min-height:46px!important;padding:0 19px!important;border:1px solid #D9C8B5!important;border-radius:999px!important;background:rgba(255,252,247,.68)!important;color:#493A30!important;font-size:13px!important;font-weight:700!important;text-decoration:none!important;transition:transform .2s ease,background .2s ease,border-color .2s ease,box-shadow .2s ease!important}
        .hero-contact-button:hover{transform:translateY(-2px)!important;background:#FFFCF7!important;border-color:#B69A7D!important;box-shadow:0 7px 16px rgba(73,58,48,.09)!important}
        .hero-image{box-shadow:0 24px 55px rgba(73,58,48,.16)!important}
        .hero-sticker{border:1px solid rgba(255,255,255,.65)!important;box-shadow:0 8px 22px rgba(73,58,48,.12)!important}
        @media(max-width:760px){
          .nizwa-header-top .brand-icon{width:36px!important;height:36px!important;border-radius:12px!important}
          .nizwa-header-top .brand-copy strong{font-size:15px!important}
          .hero-actions{justify-content:center!important;width:100%!important;gap:9px!important;margin-top:17px!important}
          .hero-actions .primary-button,.hero-contact-button{min-height:44px!important;padding:0 17px!important;font-size:12px!important}
        }
        @media(prefers-reduced-motion:reduce){.nizwa-header-top .brand-icon,.hero-contact-button{transition:none!important}}
      `}</style>
      {debugInfo && (
  <div
    style={{
      position: 'fixed',
      top: 8,
      left: 8,
      zIndex: 999999,
      background: '#111',
      color: '#00ff00',
      padding: 10,
      fontSize: 11,
      direction: 'ltr',
      maxWidth: '95vw',
      pointerEvents: 'none',
      whiteSpace: 'pre-wrap',
      textAlign: 'left',
    }}
  >
    {Object.entries(debugInfo)
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n')}
  </div>
)}
      {introVisible && (
        <div className={`nizwa-intro ${introLeaving ? 'nizwa-intro-exit' : ''}`} role="status" aria-label="Welcome to NIZWA CAT">
          <div className="nizwa-intro-leaves" />
          <img decoding="async"
            className="nizwa-intro-cat"
            src="/images/welcome-nizwa-cat.jpeg"
            alt="NIZWA CAT — قطك يستاهل الأفضل"
            fetchPriority="high"
          />
          <div className="nizwa-intro-tagline">قطك يستاهل الأفضل</div>
          <div className="nizwa-intro-sub">LOVE · CARE · HEALTH</div>
        </div>
      )}
      <div className="announcement" aria-label={t.announcement}>
        <Sparkles size={15} aria-hidden="true" />
        <div className="announcement-marquee">
          <div className="announcement-track">
            <span>{t.announcement}</span>
            <span aria-hidden="true">{t.announcement}</span>
          </div>
        </div>
      </div>

      <header className="site-header nizwa-reference-header">
        <div className="header-inner nizwa-header-top">
          <button type="button" className="brand" onClick={goHome}>
            <span className="brand-icon"><PawPrint size={25} /></span>
            <span className="brand-copy"><strong>NIZWA CAT</strong><small>Happy Cats, Happy Lives</small></span>
          </button>
          <label className="nizwa-header-search">
            <input value={search} onChange={event => setSearch(event.target.value)}
              onKeyDown={event => { if (event.key === 'Enter') scrollToShop() }}
              placeholder={lang === 'ar' ? 'ابحث عن المنتجات...' : 'Search for products...'} />
            <Search size={18} />
          </label>
          <div className="header-actions nizwa-top-actions">
            <button type="button" className="language-toggle" onClick={() => setLang(current => current === 'ar' ? 'en' : 'ar')}>
              {lang === 'ar' ? 'العربية | English' : 'العربية | English'}
            </button>
            <button type="button" className="nizwa-icon-action" aria-label="My account" onClick={() => { setActiveView('orders'); setCustomerOrders([]); setCustomerOrdersSearched(false); setCustomerOrdersError(''); window.scrollTo({ top: 0, behavior: 'smooth' }) }}><UserRound size={21} /></button>
            <button type="button" className="nizwa-icon-action" aria-label="Wishlist" onClick={() => setNotice(lang === 'ar' ? 'قائمة المفضلة قريبًا' : 'Wishlist coming soon')}><Heart size={22} /></button>
            <button type="button" className="cart-button" onClick={() => setCartOpen(true)} aria-label={t.cart}><ShoppingBag size={21} /><span>{cartCount}</span></button>
            <button type="button" className="mobile-menu-button" onClick={() => setMobileOpen(current => !current)} aria-label="Menu">
              {mobileOpen ? <X size={23} /> : <Menu size={23} />}
            </button>
          </div>
        </div>
        <nav className={`main-nav nizwa-reference-nav ${mobileOpen ? 'open' : ''}`}>
          <button type="button" onClick={goHome}>{t.home}</button>
          <button type="button" onClick={scrollToShop}>{t.shop}</button>
          <button type="button" onClick={() => { setActiveView(null); document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' }); setMobileOpen(false) }}>{t.about}</button>
          <a href={`https://wa.me/${WA}`} target="_blank" rel="noreferrer" onClick={() => setMobileOpen(false)}>{t.contact}</a>
          <button type="button" onClick={() => { setActiveView('track-order'); setMobileOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }) }}>{t.trackOrder}</button>
          <button type="button" onClick={() => { setActiveView('orders'); setCustomerOrders([]); setCustomerOrdersSearched(false); setCustomerOrdersError(''); setMobileOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }) }}>{t.ordersNav}</button>
        </nav>
      </header>

      <main>
      {activeView === 'orders' ? (
        <section className="shop-section customer-orders-page" style={{ minHeight: '55vh', maxWidth: 900, margin: '0 auto', padding: '42px 20px' }}>
          <div className="section-heading"><div><span className="eyebrow">NIZWA CAT</span><h2>{lang === 'ar' ? 'طلباتي' : 'My Orders'}</h2></div></div>
          <p style={{ color: 'var(--muted, #817568)', lineHeight: 1.8, marginBottom: 20 }}>{lang === 'ar' ? 'للتأكد من ملكية الطلب، أدخل رقم أحد طلباتك ورقم الهاتف المسجل فيه. بعدها ستظهر طلباتك المرتبطة بهذا الرقم.' : 'To verify your orders, enter one order number and the phone number used at checkout. Your orders linked to that phone will then appear.'}</p>
          <form onSubmit={event => lookupCustomerOrders(event, 'orders')} style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 22 }}>
            <input type="text" inputMode="numeric" value={lookupOrderId} onChange={event => setLookupOrderId(event.target.value)} placeholder={lang === 'ar' ? 'رقم الطلب' : 'Order number'} required style={{ flex: '1 1 150px', minWidth: 0, padding: 14, border: '1px solid var(--border, #ddd)', borderRadius: 12, background: 'var(--surface, #fff)', color: 'inherit' }} />
            <input type="tel" inputMode="tel" autoComplete="tel" value={lookupPhone} onChange={event => setLookupPhone(event.target.value)} placeholder={lang === 'ar' ? 'رقم الهاتف' : 'Phone number'} required style={{ flex: '1 1 220px', minWidth: 0, padding: 14, border: '1px solid var(--border, #ddd)', borderRadius: 12, background: 'var(--surface, #fff)', color: 'inherit' }} />
            <button type="submit" className="primary-button" disabled={customerOrdersLoading}>{customerOrdersLoading ? <Loader2 className="spin" size={17} /> : <ClipboardList size={17} />} {lang === 'ar' ? 'عرض طلباتي' : 'Find my orders'}</button>
          </form>
          {customerOrdersError && <div className="notice error"><AlertCircle size={16} /> {customerOrdersError}</div>}
          {customerOrdersLoading && <div className="loading-state"><Loader2 className="spin" /> {t.loadingOrders}</div>}
          {customerOrdersSearched && !customerOrdersLoading && !customerOrders.length && <div className="empty-state"><Package size={36} /><p>{lang === 'ar' ? 'لم نعثر على طلبات مرتبطة بهذا الرقم.' : 'No orders were found for this phone number.'}</p></div>}
          <div className="admin-orders" style={{ display: 'grid', gap: 14 }}>
            {customerOrders.map(order => (
              <article className="admin-list-item order-admin-card" key={order.id} style={{ display: 'grid', gap: 10, padding: 16, border: '1px solid var(--border, #e4d8ca)', borderRadius: 14, background: 'var(--surface, #fff)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}><strong>{t.orderNumber}: {order.id}</strong><small>{order.created_at ? new Date(order.created_at).toLocaleString(lang === 'ar' ? 'ar-OM' : 'en-OM') : ''}</small></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}><span>{t.orderStatus}: {t.statuses?.[order.status] || order.status || '-'}</span><strong>{money(order.total_amount, lang)}</strong></div>
                <div><strong>{t.orderItems}</strong>{(Array.isArray(order.items) ? order.items : []).map((item, index) => <div key={`${order.id}-${index}`} style={{ marginTop: 5, color: 'var(--muted, #817568)' }}>{item.name || item.product_name || item.title || (lang === 'ar' ? 'منتج' : 'Product')} × {item.quantity || 1}</div>)}</div>
              </article>
            ))}
          </div>
        </section>
      ) : activeView === 'gallery' ? (
        <section aria-label={t.gallery} style={{ minHeight: '55vh' }} />
      ) : activeView === 'track-order' ? (
        <section className="shop-section customer-orders-page" aria-label={t.trackOrder} style={{ minHeight: '55vh', maxWidth: 900, margin: '0 auto', padding: '42px 20px' }}>
          <div className="section-heading"><div><span className="eyebrow">NIZWA CAT</span><h2>{lang === 'ar' ? 'تتبع الطلب' : 'Track Order'}</h2></div></div>
          <p style={{ color: 'var(--muted, #817568)', lineHeight: 1.8, marginBottom: 20 }}>{lang === 'ar' ? 'أدخل رقم الطلب ورقم الهاتف المسجل عند إتمام الشراء لمتابعة حالة طلبك.' : 'Enter your order number and the phone number used at checkout to check its status.'}</p>
          <form onSubmit={event => lookupCustomerOrders(event, 'track-order')} style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 22 }}>
            <input type="text" inputMode="numeric" value={lookupOrderId} onChange={event => setLookupOrderId(event.target.value)} placeholder={lang === 'ar' ? 'رقم الطلب' : 'Order number'} required style={{ flex: '1 1 150px', minWidth: 0, padding: 14, border: '1px solid var(--border, #ddd)', borderRadius: 12, background: 'var(--surface, #fff)', color: 'inherit' }} />
            <input type="tel" inputMode="tel" autoComplete="tel" value={lookupPhone} onChange={event => setLookupPhone(event.target.value)} placeholder={lang === 'ar' ? 'رقم الهاتف' : 'Phone number'} required style={{ flex: '1 1 220px', minWidth: 0, padding: 14, border: '1px solid var(--border, #ddd)', borderRadius: 12, background: 'var(--surface, #fff)', color: 'inherit' }} />
            <button type="submit" className="primary-button" disabled={customerOrdersLoading}>{customerOrdersLoading ? <Loader2 className="spin" size={17} /> : <Package size={17} />} {lang === 'ar' ? 'تتبع الطلب' : 'Track order'}</button>
          </form>
          {customerOrdersError && <div className="notice error"><AlertCircle size={16} /> {customerOrdersError}</div>}
          {customerOrdersLoading && <div className="loading-state"><Loader2 className="spin" /> {t.loadingOrders}</div>}
          {customerOrdersSearched && !customerOrdersLoading && !customerOrders.length && <div className="empty-state"><Package size={36} /><p>{lang === 'ar' ? 'لم نعثر على طلب بهذا الرقم. تأكد من البيانات وحاول مرة ثانية.' : 'No order found. Check the details and try again.'}</p></div>}
          {customerOrders.map(order => <article className="admin-list-item order-admin-card" key={order.id} style={{ display: 'grid', gap: 12, padding: 18, border: '1px solid var(--border, #e4d8ca)', borderRadius: 14, background: 'var(--surface, #fff)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}><strong>{t.orderNumber}: {order.id}</strong><small>{order.created_at ? new Date(order.created_at).toLocaleString(lang === 'ar' ? 'ar-OM' : 'en-OM') : ''}</small></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}><strong>{t.orderStatus}: {t.statuses?.[order.status] || order.status || '-'}</strong><strong>{money(order.total_amount, lang)}</strong></div>
            <div><strong>{t.orderItems}</strong>{(Array.isArray(order.items) ? order.items : []).map((item, index) => <div key={`${order.id}-${index}`} style={{ marginTop: 5, color: 'var(--muted, #817568)' }}>{lang === 'ar' ? (item.name_ar || item.name_en) : (item.name_en || item.name_ar)} × {item.quantity || 1}</div>)}</div>
          </article>)}
        </section>
      ) : <>
     {!agePage && !categoryPageId ? (
  <section className="hero">
          <div className="hero-content">
            <span className="eyebrow"><PawPrint size={16} /> NIZWA CAT</span>
         <h1>{t.heroTitle}</h1>
<p>{t.heroText}</p>
            <div className="hero-actions">
              <button type="button" className="primary-button" onClick={scrollToShop}>
                {t.shop} <ArrowUpRight size={18} />
              </button>
              <a className="hero-contact-button" href={`https://wa.me/${WA}`} target="_blank" rel="noreferrer">
                {lang === 'ar' ? 'تواصل معنا' : 'Talk to us'}
                <ArrowUpRight size={16} />
              </a>
            </div>
          </div>
          <div className="hero-image">
            <img decoding="async" src="/images/hero-luxury-cat.jpeg" alt={lang === 'ar' ? 'قطة أنيقة من NIZWA CAT' : 'Elegant NIZWA CAT hero cat'} fetchPriority="high" />
            <div className="hero-sticker"><Heart size={18} fill="currentColor" /> {lang === 'ar' ? 'كل الحب لقطك' : 'Made for cats'}</div>
          </div>
        </section>

          
) : agePage ? (
  <section className="hero age-page-hero">
    <div className="hero-content">
      <span className="eyebrow"><PawPrint size={16} /> NIZWA CAT</span>
      <h1>
        {agePage === 'kitten'
          ? (lang === 'ar' ? 'عالم القطط الصغيرة' : 'Kitten Collection')
          : (lang === 'ar' ? 'عالم القطط البالغة' : 'Adult Cats Collection')}
      </h1>
      <p>
        {agePage === 'kitten'
          ? (lang === 'ar' ? 'كل ما تحتاجه قطتك الصغيرة لنمو سعيد وصحي.' : 'Everything your little kitten needs to grow happy and healthy.')
          : (lang === 'ar' ? 'منتجات مختارة لراحة وسعادة قطتك البالغة.' : 'Carefully selected essentials for your adult cat.')}
      </p>
      <button
        type="button"
        className="primary-button"
        onClick={() => {
          setAgePage(null)
          setActiveCategory('all')
          setSearch('')
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }}
      >
        {lang === 'ar' ? 'العودة إلى المتجر' : 'Back to Home'}
      </button>
    </div>
    <div className="hero-image">
      <img decoding="async"
        src={categoryBannerImages(agePage === 'kitten' ? ageCategories.kitten : ageCategories.adult)[0]}
        alt={agePage === 'kitten' ? 'Kitten' : 'Adult cat'}
        onError={event => {
          const image = event.currentTarget
          const category = agePage === 'kitten' ? ageCategories.kitten : ageCategories.adult
          const candidates = category ? categoryBannerImages(category) : ['/images/hero-luxury-cat.jpeg']
          const currentIndex = Number(image.dataset.bannerCandidate || 0)
          const nextIndex = currentIndex + 1
          if (nextIndex < candidates.length) {
            image.dataset.bannerCandidate = String(nextIndex)
            image.src = candidates[nextIndex]
          }
        }}
      />
    </div>
  </section>
) : (
  <section className="hero category-page-hero">
    <div className="hero-content">
      <span className="eyebrow"><PawPrint size={16} /> NIZWA CAT COLLECTION</span>
      <h1>{selectedCategoryPage ? categoryTitle(selectedCategoryPage, lang) : t.shop}</h1>
      <p>{lang === 'ar' ? 'اكتشف المنتجات المختارة بعناية لراحة وسعادة قطتك.' : 'Explore carefully selected products for your cat’s comfort and happiness.'}</p>
      <button type="button" className="primary-button" onClick={scrollToShop}>{lang === 'ar' ? 'تصفح المنتجات' : 'Browse Products'} <ArrowUpRight size={18} /></button>
    </div>
    <div className="hero-image">
      {selectedCategoryPage && (
        <img decoding="async"
          key={String(selectedCategoryPage.id)}
          src={categoryBannerImages(selectedCategoryPage)[0]}
          alt={`${categoryTitle(selectedCategoryPage, lang)} - NIZWA CAT`}
          loading="eager"
          fetchPriority="high"
          onError={event => {
            const image = event.currentTarget
            const candidates = categoryBannerImages(selectedCategoryPage)
            const currentIndex = Number(image.dataset.bannerCandidate || 0)
            const nextIndex = currentIndex + 1
            if (nextIndex < candidates.length) {
              image.dataset.bannerCandidate = String(nextIndex)
              image.src = candidates[nextIndex]
            }
          }}
        />
      )}
    </div>
  </section>
)}
{!agePage && !categoryPageId && (
        <section className="age-category-section">
  <div className="section-heading">
    <div>
      <span className="eyebrow">SHOP BY AGE</span>
      <h2>{lang === 'ar' ? 'اختر حسب عمر قطتك' : 'Shop by Age'}</h2>
    </div>
  </div>

  <div className="age-category-grid">
    {[
      {
        category: ageCategories.kitten,
        title: 'KITTEN',
        subtitle: lang === 'ar' ? 'للقطط الصغيرة' : 'For little kittens'
      },
      {
        category: ageCategories.adult,
        title: 'ADULT CATS',
        subtitle: lang === 'ar' ? 'للقطط البالغة' : 'For grown-up cats'
      }
    ].filter(item => item.category).map(item => {
      // Use the image saved on the category record so changing the category
      // banner in the admin panel also updates its homepage age card.
      // Keep the existing Storage photos as fallbacks for older records.
      const fallbackAgeImage = item.title === 'KITTEN'
        ? 'https://kdvhkhrabefijguvkbew.supabase.co/storage/v1/object/public/category-images/kitten.jpg.JPG'
        : 'https://kdvhkhrabefijguvkbew.supabase.co/storage/v1/object/public/category-images/adult-cats.jpg.JPG'
      const categoryImage = item.category.icon_url || item.category.banner_url || fallbackAgeImage
      return (
        <button
          type="button"
          className="age-category-card"
          key={item.category.id}
          onClick={() => openCategoryPage(item.category)}
        >
          <img decoding="async"
            src={categoryImage}
            alt={item.title}
            loading="eager"
            fetchPriority="high"
          />
          <span className="age-category-overlay">
            <strong>{item.title}</strong>
            <small>{item.subtitle}</small>
            <span className="age-category-link">
              {lang === 'ar' ? 'تسوق الآن' : 'SHOP NOW'}
              <ArrowUpRight size={16} />
            </span>
          </span>
        </button>
      )
    })}
  </div>
</section>
    )}
       {!agePage && !categoryPageId && (
  <>
    <section className="category-section" id="category-section">
          <div className="section-heading">
            <div><span className="eyebrow">EXPLORE</span><h2>{t.categories}</h2></div>
            <button type="button" className="text-link" onClick={scrollToShop}>{t.viewAll} <ArrowUpRight size={16} /></button>
          </div>
          <div className="category-grid">
          {otherCategories.map((category, index) => (
              <button type="button" className="category-card" key={category.id}
                onClick={() => openCategoryPage(category)}>
                <span className={`category-icon category-icon-${index % 5}`}>
                  {category.icon_url ? (
                    <img decoding="async"
                      src={category.icon_url}
                      alt={categoryTitle(category, lang)}
                      loading={index < 4 ? 'eager' : 'lazy'}
                      fetchPriority={index < 4 ? 'high' : 'auto'}
                      style={{ width: '100%', height: '100%', display: 'block', objectFit: 'cover', borderRadius: 'inherit' }}
                    />
                  ) : (
                    index % 5 === 0 ? <Cat /> : index % 5 === 1 ? <ShoppingBasket /> : index % 5 === 2 ? <Sparkles /> : index % 5 === 3 ? <Heart /> : <PawPrint />
                  )}
                </span>
                <strong>{categoryTitle(category, lang)}</strong><ArrowUpRight size={16} />
              </button>
            ))}
          </div>
        </section>

        {!agePage && !categoryPageId && (
          <section className="benefits" aria-label={lang === 'ar' ? 'لماذا تتسوق من نزوى كت' : 'Why shop with NIZWA CAT'}>
            <div className="benefit-item">
              <span className="benefit-icon"><Truck size={23} /></span>
              <div><strong>{t.delivery}</strong><small>{lang === 'ar' ? 'توصيل متوفر لجميع ولايات عُمان' : 'Delivery available across Oman'}</small></div>
            </div>
            <div className="benefit-item">
              <span className="benefit-icon"><ShieldCheck size={23} /></span>
              <div><strong>{t.quality}</strong><small>{lang === 'ar' ? 'منتجات مختارة بعناية لقطك' : 'Products selected with care'}</small></div>
            </div>
            <a className="benefit-item benefit-contact-link" href={`https://wa.me/${WA}`} target="_blank" rel="noreferrer">
              <span className="benefit-icon"><Headphones size={23} /></span>
              <div><strong>{t.support}</strong><small>{lang === 'ar' ? 'نحن هنا لمساعدتك عبر واتساب' : 'We’re here to help on WhatsApp'}</small></div>
              <ArrowUpRight className="benefit-arrow" size={16} />
            </a>
            <button type="button" className="benefit-item benefit-track-link" onClick={() => setActiveView('track-order')}>
              <span className="benefit-icon"><Package size={23} /></span>
              <div><strong>{lang === 'ar' ? 'متابعة الطلب' : 'Order tracking'}</strong><small>{lang === 'ar' ? 'تابع حالة طلبك بسهولة' : 'Check your order status easily'}</small></div>
              <ArrowUpRight className="benefit-arrow" size={16} />
            </button>
          </section>
        )}

</>
  )}
        
   

        {(agePage || categoryPageId) && <section className="shop-section" id="shop">
          <div className="section-heading">
         <div>
  <span className="eyebrow">
    {agePage || categoryPageId ? 'NIZWA CAT COLLECTION' : 'THE COLLECTION'}
  </span>
  <h2>
    {selectedCategoryPage
      ? categoryTitle(selectedCategoryPage, lang)
      : agePage === 'kitten'
        ? (lang === 'ar' ? 'منتجات القطط الصغيرة' : 'Kitten Products')
        : agePage === 'adult'
          ? (lang === 'ar' ? 'منتجات القطط البالغة' : 'Adult Cat Products')
          : t.allProducts}
  </h2>
</div>
            <div style={{display:'flex',alignItems:'center',gap:10,flexWrap:'wrap'}}>
              <button type="button" className="secondary-button" onClick={goHome}>{lang === 'ar' ? 'العودة للرئيسية' : 'Back to Home'}</button>
              <div className="search-box">
              <Search size={18} />
              <input value={search} onChange={event => setSearch(event.target.value)}
                placeholder={t.search} aria-label={t.search} />
              {search && <button type="button" onClick={() => setSearch('')} aria-label={t.close}><X size={16} /></button>}
              </div>
            </div>
          </div>
       {!agePage && !categoryPageId && (
  <div className="filter-row">
            <button type="button" className={activeCategory === 'all' ? 'filter-chip active' : 'filter-chip'}
              onClick={() => setActiveCategory('all')}>{t.categoryAll}</button>
            {categories.map(category => (
              <button type="button" key={category.id}
                className={activeCategory === category.id ? 'filter-chip active' : 'filter-chip'}
                onClick={() => setActiveCategory(category.id)}>
                {category.icon_url && <img decoding="async" loading="lazy" src={category.icon_url} alt="" style={{ width: 26, height: 26, objectFit: 'cover', borderRadius: 7, verticalAlign: 'middle', marginInlineEnd: 8, flex: '0 0 auto' }} />}
                {categoryTitle(category, lang)}
              </button>
            ))}
          </div>
                    )}
          {selectedCategoryPage && subcategories.some(item => String(item.category_id) === String(selectedCategoryPage.id)) && (
            <div style={{ margin: '4px 0 28px' }}>
              <div className="section-heading" style={{ marginBottom: 18 }}>
                <div>
                  <span className="eyebrow">{lang === 'ar' ? 'تسوق حسب النوع' : 'SHOP BY SUBCATEGORY'}</span>
                  <h2 style={{ fontSize: 'clamp(1.25rem, 3vw, 1.8rem)' }}>{lang === 'ar' ? 'اختر القسم الفرعي' : 'Choose a subcategory'}</h2>
                </div>
                {activeSubcategory !== 'choose' && (
                  <button type="button" className="secondary-button" onClick={() => { setActiveSubcategory('choose'); setSearch('') }}>
                    {lang === 'ar' ? 'كل الأنواع' : 'All types'}
                  </button>
                )}
              </div>
              {subcategories.filter(item => String(item.category_id) === String(selectedCategoryPage.id)).length > 0 ? (
              <div className="category-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(145px, 1fr))', gap: 14 }}>
                {subcategories.filter(item => String(item.category_id) === String(selectedCategoryPage.id)).map((item, index) => {
                  const label = `${item.name_en || ''} ${item.name_ar || ''}`.toLowerCase()
                  const TypeIcon = /dry|جاف|يابس/.test(label) ? ShoppingBasket
                    : /wet|رطب|معلب/.test(label) ? Package
                    : /litter|رمل|تراب/.test(label) ? Sparkles
                    : /toy|لعب/.test(label) ? Heart
                    : /accessor|مستلزم|اكسسوار/.test(label) ? PawPrint
                    : Cat
                  const isSelected = String(activeSubcategory) === String(item.id)
                  return (
                    <button type="button" key={item.id}
                      className={`category-card${isSelected ? ' active' : ''}`}
                      onClick={() => {
  setActiveSubcategory(String(item.id))
  setSearch('')

  // Wait for filtered products to render, then scroll smoothly.
  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(() => {
      document.getElementById('category-products')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      })
    })
  })
}}
                      aria-pressed={isSelected}
                      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, minHeight: 150, padding: 18, textAlign: 'center', border: isSelected ? '2px solid var(--accent, #8b6f9f)' : undefined }}>
                      <span className={`category-icon category-icon-${index % 5}`} style={{ width: 66, height: 66, display: 'grid', placeItems: 'center', overflow: 'hidden' }}>
                        {item.icon_url ? <img decoding="async" loading="lazy" src={item.icon_url} alt={categoryTitle(item, lang)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <TypeIcon size={30} strokeWidth={1.6} />}
                      </span>
                      <strong>{categoryTitle(item, lang)}</strong>
                    </button>
                  )
                })}
              </div>
              ) : (
                <div className="empty-state"><Package size={30} /><p>{lang === 'ar' ? 'لا توجد أقسام فرعية لهذا القسم بعد.' : 'No subcategories have been added to this category yet.'}</p></div>
              )}
            </div>
          )}
          {loading && <div className="loading-state"><Loader2 className="spin" /> {t.loading}</div>}
          {storeError && <div className="notice error"><AlertCircle size={17} /> {storeError}</div>}
          {!(selectedCategoryPage && subcategories.some(item => String(item.category_id) === String(selectedCategoryPage.id)) && activeSubcategory === 'choose') && (
            <>
              {!loading && filteredProducts.length > 0 && (
                <div
  className="product-grid"
  id="category-products"
  style={{ scrollMarginTop: '24px' }}
>
                  {filteredProducts.map((product, index) => (
                    <ProductCard key={product.id} product={product} lang={lang} t={t} imagePriority={index < 6}
                      hasVariants={productOptions.some(option => String(option.product_id) === String(product.id))}
                      variants={productVariants.filter(variant => String(variant.product_id) === String(product.id) && variant.is_active === true)}
                      onAdd={() => addToCart(product)} onDetails={() => openProductDetails(product)} />
                  ))}
                </div>
              )}
              {!loading && filteredProducts.length === 0 && (
              <div
  className="empty-state"
  id="category-products"
  style={{ scrollMarginTop: '24px' }}
>
  <Package size={38} />
  <p>{search ? t.noResults : t.noProducts}</p>
</div>
              )}
            </>
          )}
        </section>}
{!agePage && !categoryPageId && (
        <section className="about-section" id="about">
          <div className="about-icon"><PawPrint size={42} /></div>
          <div>
            <span className="eyebrow">ABOUT NIZWA CAT</span><h2>{t.aboutTitle}</h2><p>{t.aboutText}</p>
            <a href={`https://wa.me/${WA}`} target="_blank" rel="noreferrer" className="text-link">
              <MessageCircle size={17} /> {t.contact}
            </a>
          </div>
        </section>
  )}
      </>}
      </main>

      <footer className="site-footer">
        <div className="footer-brand"><PawPrint size={25} /><strong>NIZWA CAT</strong><span>نزوى كت</span></div>
     <p>{t.footerText}</p>
        <div className="footer-links">
          <a href={`https://wa.me/${WA}`} target="_blank" rel="noreferrer"><MessageCircle size={19} /></a>
          <a href="https://instagram.com/" target="_blank" rel="noreferrer"><Instagram size={19} /></a>
        </div>
        <small>© {new Date().getFullYear()} NIZWA CAT. All rights reserved.</small>
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
            <div className="product-media-viewer">
              {!isVariantImageActive && activeProductMedia?.media_type === 'video' ? (
                <video className="product-modal-video" src={activeProductMedia.media_url} controls playsInline preload="metadata" />
              ) : (
                <button type="button" className="product-modal-image-trigger" onClick={() => setImageZoomOpen(true)} aria-label={lang === 'ar' ? 'تكبير صورة المنتج' : 'Zoom product image'}>
                  <img decoding="async" src={displayedProductImageUrl} alt={productTitle(selectedProduct, lang)} />
                  <span className="image-zoom-hint">{lang === 'ar' ? 'اضغط لتكبير الصورة' : 'Tap to enlarge'}</span>
                </button>
              )}
              {visibleProductMedia.length > 1 && (
                <div className="product-media-thumbnails">
                  {visibleProductMedia.map((media, index) => (
                    <button type="button" key={media.id} className={index === activeMediaIndex ? 'active' : ''} onClick={() => setActiveMediaIndex(index)} aria-label={`${lang === 'ar' ? 'وسيط' : 'Media'} ${index + 1}`}>
                      {media.media_type === 'video' ? <span className="media-video-thumb">▶</span> : <img decoding="async" src={media.thumbnail_url || media.media_url} alt="" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="product-modal-content">
              <h2>{productTitle(selectedProduct, lang)}</h2><p>{productDescription(selectedProduct, lang)}</p>
              {selectedProductOptions.map(option => {
                const values = optionValues.filter(value => String(value.option_id) === String(option.id))
                return (
                  <div className="variant-option-field" key={option.id}>
                    <label>{lang === 'ar' ? option.name_ar || option.name_en : option.name_en || option.name_ar}</label>
                    <div className="variant-image-choices">
                      {values.map(value => {
                        const matchingVariant = variantForOptionValue(option, value)
                        const isSelected = String(selectedVariantValues[option.id] || '') === String(value.id)
                        const valueLabel = lang === 'ar' ? value.label_ar || value.label_en : value.label_en || value.label_ar
                        return (
                          <button
                            type="button"
                            key={value.id}
                            className={`variant-image-choice${isSelected ? ' active' : ''}${matchingVariant?.image_url ? ' has-image' : ''}`}
                            onClick={() => selectVariantOptionValue(option, value)}
                            aria-pressed={isSelected}
                          >
                            {matchingVariant?.image_url
                              ? <img decoding="async" src={matchingVariant.image_url} alt={valueLabel} />
                              : <span className="variant-image-choice-placeholder">{valueLabel}</span>}
                            <span className="variant-image-choice-label">{valueLabel}</span>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
              {selectedProductOptions.length > 0 ? (
                selectedVariant ? (
                  <>
                    <strong className="product-price">{money(selectedVariant.sale_price != null && Number(selectedVariant.sale_price) > 0 ? selectedVariant.sale_price : selectedVariant.price, lang)}</strong>
                    {Number(selectedVariant.stock ?? 0) > 0 ? (
                      <button type="button" className="primary-button full-button" onClick={() => addToCart(selectedProduct, selectedVariant)}>
                        <ShoppingBag size={18} /> {t.add}
                      </button>
                    ) : (
                      <p className="variant-unavailable">{lang === 'ar' ? 'نفد المخزون من هذا الخيار.' : 'This variant is out of stock.'}</p>
                    )}
                  </>
                ) : (
                  <p className="variant-unavailable">
                    {lang === 'ar' ? 'هذا الخيار غير متوفر حالياً.' : 'This combination is currently unavailable.'}
                  </p>
                )
              ) : (
                <>
                  <strong className="product-price">{money(productDisplayPrice(selectedProduct), lang)}</strong>
                  {selectedProduct.stock != null && Number(selectedProduct.stock) <= 0 ? (
                    <p className="variant-unavailable">{lang === 'ar' ? 'نفد المخزون' : 'Out of stock'}</p>
                  ) : (
                    <button type="button" className="primary-button full-button" onClick={() => addToCart(selectedProduct)}>
                      <ShoppingBag size={18} /> {t.add}
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {imageZoomOpen && selectedProduct && (
        <div className="image-zoom-overlay" onClick={() => setImageZoomOpen(false)}>
          <button
            type="button"
            className="image-zoom-close"
            onClick={() => setImageZoomOpen(false)}
            aria-label={t.close}
          ><X size={25} /></button>
          {visibleProductMedia.length > 1 && (
            <>
              <button
                type="button"
                className="image-zoom-nav image-zoom-prev"
                onClick={event => { event.stopPropagation(); moveZoomMedia(-1) }}
                aria-label={lang === 'ar' ? 'الصورة السابقة' : 'Previous image'}
              ><ChevronDown size={27} /></button>
              <button
                type="button"
                className="image-zoom-nav image-zoom-next"
                onClick={event => { event.stopPropagation(); moveZoomMedia(1) }}
                aria-label={lang === 'ar' ? 'الصورة التالية' : 'Next image'}
              ><ChevronDown size={27} /></button>
              <span className="image-zoom-counter">
                {activeMediaIndex === -1 ? '1' : String(activeMediaIndex + 1)} / {visibleProductMedia.length}
              </span>
            </>
          )}
          <img decoding="async"
            src={displayedProductImageUrl}
            alt={productTitle(selectedProduct, lang)}
            onClick={event => event.stopPropagation()}
          />
          <span className="image-zoom-caption">{lang === 'ar' ? 'يمكنك التنقل بين الصور من الأسهم' : 'Use the arrows to browse photos'}</span>
        </div>
      )}

      {cartOpen && (
        <div className="overlay cart-overlay cart-full-page-overlay">
          <aside className="cart-drawer cart-full-page-layout">
            <style>{`
              .cart-full-page-overlay{position:fixed!important;inset:0!important;z-index:10000!important;display:block!important;overflow-y:auto!important;overscroll-behavior:contain;background:radial-gradient(ellipse at 12% 0%,rgba(182,154,125,.18),transparent 34%),linear-gradient(145deg,#F8F4ED 0%,#F2EBE1 100%)!important;padding:0!important}
              .cart-full-page-layout{position:relative!important;inset:auto!important;transform:none!important;width:100%!important;max-width:1240px!important;min-height:100vh!important;height:auto!important;margin:0 auto!important;padding:clamp(22px,4.5vw,58px)!important;border-radius:0!important;box-shadow:none!important;overflow:visible!important;display:grid!important;grid-template-columns:minmax(0,1.18fr) minmax(320px,.82fr)!important;align-content:start!important;align-items:start!important;gap:30px!important;background:transparent!important}
              .cart-full-page-layout>.drawer-heading{grid-column:1/-1!important;position:sticky;top:0;z-index:5;background:rgba(248,244,237,.94);backdrop-filter:blur(14px);padding:15px 0 22px!important;border-bottom:1px solid rgba(146,123,104,.22);display:flex;align-items:center;justify-content:space-between}
              .cart-full-page-layout>.drawer-heading h2{display:flex;align-items:center;gap:12px;color:#493A30;font-family:'DM Sans','IBM Plex Sans Arabic',sans-serif;font-size:clamp(25px,3vw,34px);font-weight:700;letter-spacing:-.7px}
              .cart-full-page-layout>.drawer-heading h2 svg{color:#B69A7D;width:27px;height:27px}
              .cart-full-page-layout>.cart-items{max-height:none!important;height:auto!important;overflow:visible!important;min-width:0;padding-top:4px}
              .cart-full-page-layout>.checkout-area{position:sticky;top:108px;max-height:none!important;height:auto!important;overflow:visible!important;min-width:0;background:linear-gradient(160deg,#FFFCF7 0%,#F9F4EC 100%);border:1px solid rgba(182,154,125,.42);border-radius:25px;padding:clamp(20px,2.5vw,30px)!important;box-shadow:0 22px 60px rgba(73,58,48,.11),inset 0 1px 0 rgba(255,255,255,.9)}
              .cart-full-page-layout>.checkout-area:before{content:'YOUR ORDER';display:block;color:#B69A7D;font:700 10px 'DM Sans',sans-serif;letter-spacing:2.8px;margin-bottom:13px}
              .cart-full-page-layout>.checkout-area .cart-total{padding:17px 0 20px;margin-bottom:20px;border-bottom:1px solid rgba(146,123,104,.22);font-size:18px;color:#493A30}
              .cart-full-page-layout>.checkout-area .cart-total strong:last-child{font-size:24px;color:#80664F;font-weight:800}
              .cart-full-page-layout>.empty-state{grid-column:1/-1;min-height:48vh;display:flex;flex-direction:column;align-items:center;justify-content:center;background:rgba(255,252,247,.72);border:1px solid rgba(182,154,125,.28);border-radius:28px;margin-top:12px}
              .cart-full-page-layout>.empty-state svg{width:58px;height:58px;color:#B69A7D;margin-bottom:12px}
              .cart-full-page-layout .cart-item{position:relative;display:flex;align-items:center;gap:18px;background:rgba(255,252,247,.94);border:1px solid rgba(182,154,125,.28);border-radius:22px;padding:17px;margin-bottom:15px;box-shadow:0 8px 24px rgba(73,58,48,.045);transition:transform .2s ease,box-shadow .2s ease,border-color .2s ease}
              .cart-full-page-layout .cart-item:hover{transform:translateY(-2px);border-color:rgba(146,123,104,.55);box-shadow:0 14px 30px rgba(73,58,48,.08)}
              .cart-full-page-layout .cart-item>img{width:112px!important;height:112px!important;flex:0 0 112px;object-fit:contain!important;background:#F3EDE3;border-radius:17px;padding:8px}
              .cart-full-page-layout .cart-item-info{display:flex;flex:1;min-width:0;flex-direction:column;align-items:flex-start;gap:7px}
              .cart-full-page-layout .cart-item-info>strong{color:#493A30;font-size:15px;line-height:1.5;font-weight:700}
              .cart-full-page-layout .cart-item-info>span{color:#8A6F56;font-size:15px;font-weight:800}
              .cart-full-page-layout .cart-item-info>small{color:#8C8176;font-size:11px}
              .cart-full-page-layout .quantity-control{display:flex;align-items:center;gap:13px;background:#F4EEE6;border:1px solid #E9DFD2;border-radius:30px;padding:4px 8px;margin-top:3px}
              .cart-full-page-layout .quantity-control button{width:29px;height:29px;border-radius:50%;background:#FFFCF7;border:1px solid #E3D6C7;color:#6B5746;display:grid;place-items:center}
              .cart-full-page-layout .quantity-control span{min-width:14px;text-align:center;color:#493A30;font-weight:700}
              .cart-full-page-layout .checkout-form{gap:16px}
              .cart-full-page-layout .checkout-form input,.cart-full-page-layout .checkout-form select,.cart-full-page-layout .checkout-form textarea{border-radius:13px!important;border-color:#E5D9CA!important;background:#fffdfa!important;min-height:47px}
              .cart-full-page-layout .delivery-option{border-radius:14px!important;border-color:#E5D9CA!important;background:#fffdfa!important;padding:13px!important}
              .cart-full-page-layout .delivery-option.active{border-color:#927B68!important;background:#F3EDE5!important;box-shadow:0 0 0 3px rgba(146,123,104,.10)}
              .cart-full-page-layout .primary-button{border-radius:14px!important;min-height:52px;box-shadow:0 9px 20px rgba(73,58,48,.15);letter-spacing:.2px}
              .cart-full-page-layout .cart-section-heading,.cart-full-page-layout .checkout-section-heading{display:flex;align-items:center;justify-content:space-between;gap:12px;margin:5px 2px 15px;color:#80664F}
              .cart-full-page-layout .cart-section-heading span,.cart-full-page-layout .checkout-section-heading span{font:700 11px 'DM Sans',sans-serif;letter-spacing:2px}
              .cart-full-page-layout .cart-section-heading small,.cart-full-page-layout .checkout-section-heading small{font-size:11px;color:#9A8B7C;text-align:end}
              .cart-full-page-layout .checkout-section-heading{display:block;margin:0 0 17px}
              .cart-full-page-layout .checkout-section-heading small{display:block;margin-top:6px;text-align:start;font-size:12px}
              .cart-full-page-layout .checkout-whatsapp-note{display:flex;align-items:flex-start;gap:9px;margin:2px 0 13px;padding:11px 12px;border:1px solid rgba(182,154,125,.24);border-radius:12px;background:rgba(243,237,227,.65);color:#806F5D;font-size:11px;line-height:1.65}
              .cart-full-page-layout .checkout-whatsapp-note svg{flex:0 0 auto;margin-top:1px;color:#927B68}
              .cart-full-page-layout .checkout-area .full-button{width:100%;display:flex;align-items:center;justify-content:center;gap:9px;font-weight:700}
              @media(max-width:760px){.cart-full-page-layout .cart-section-heading{margin-top:2px}.cart-full-page-layout .cart-section-heading span,.cart-full-page-layout .checkout-section-heading span{font-size:10px}.cart-full-page-layout .cart-section-heading small{font-size:10px}.cart-full-page-layout .checkout-whatsapp-note{font-size:10px}.cart-full-page-layout{grid-template-columns:minmax(0,1fr)!important;gap:19px!important;padding:16px 13px 30px!important}.cart-full-page-layout>.drawer-heading{position:static;padding:9px 0 16px!important}.cart-full-page-layout>.checkout-area{position:static;padding:19px!important}.cart-full-page-layout>.cart-items{width:100%}.cart-full-page-layout .cart-item{gap:12px;padding:11px;border-radius:17px}.cart-full-page-layout .cart-item>img{width:88px!important;height:88px!important;flex-basis:88px}.cart-full-page-layout .cart-item-info>strong{font-size:13px}.cart-full-page-layout .cart-item>button{align-self:flex-start}}
              @media(prefers-reduced-motion:reduce){.cart-full-page-layout .cart-item{transition:none}}
      
        /* NIZWA CAT — product detail experience */
        .product-modal {
          background: #FFFCF7 !important;
          border: 1px solid rgba(182,154,125,.28) !important;
          border-radius: 24px !important;
          box-shadow: 0 28px 80px rgba(48,36,26,.24) !important;
          overflow: hidden !important;
        }
        .product-media-viewer {
          background: radial-gradient(circle at 50% 42%, #fffdf9 0%, #F3EDE3 78%) !important;
          padding: 20px !important;
          border-bottom: 1px solid #E9DFD2 !important;
        }
        .product-modal-image-trigger {
          border-radius: 18px !important;
          overflow: hidden !important;
          background: transparent !important;
          cursor: zoom-in !important;
        }
        .product-modal-image-trigger img {
          transition: transform .35s ease !important;
        }
        .product-modal-image-trigger:hover img {
          transform: scale(1.025) !important;
        }
        .image-zoom-hint {
          border: 1px solid rgba(182,154,125,.25) !important;
          background: rgba(255,252,247,.88) !important;
          color: #76685B !important;
          border-radius: 999px !important;
          padding: 7px 12px !important;
          font-size: 11px !important;
          backdrop-filter: blur(8px) !important;
        }
        .product-media-thumbnails {
          display: flex !important;
          gap: 9px !important;
          justify-content: center !important;
          flex-wrap: wrap !important;
          padding-top: 14px !important;
        }
        .product-media-thumbnails button {
          width: 58px !important;
          height: 58px !important;
          padding: 3px !important;
          border: 1px solid #E9DFD2 !important;
          border-radius: 13px !important;
          background: #FFFCF7 !important;
          overflow: hidden !important;
          transition: border-color .2s ease, transform .2s ease, box-shadow .2s ease !important;
        }
        .product-media-thumbnails button.active {
          border: 2px solid #927B68 !important;
          box-shadow: 0 0 0 3px rgba(182,154,125,.16) !important;
          transform: translateY(-2px) !important;
        }
        .product-modal-content {
          padding: 25px 27px 28px !important;
          background: #FFFCF7 !important;
        }
        .product-modal-content h2 {
          color: #493A30 !important;
          font-size: clamp(20px, 2.4vw, 27px) !important;
          line-height: 1.35 !important;
          letter-spacing: -.02em !important;
          margin: 0 0 9px !important;
        }
        .product-modal-content > p:not(.variant-unavailable) {
          color: #817467 !important;
          font-size: 13px !important;
          line-height: 1.85 !important;
          margin: 0 0 20px !important;
        }
        .variant-option-field {
          padding: 15px 0 16px !important;
          border-top: 1px solid #EEE5DA !important;
        }
        .variant-option-field > label {
          display: block !important;
          color: #493A30 !important;
          font-size: 13px !important;
          font-weight: 750 !important;
          margin-bottom: 11px !important;
        }
        .variant-image-choices {
          display: flex !important;
          flex-wrap: wrap !important;
          gap: 10px !important;
        }
        .variant-image-choice {
          min-width: 76px !important;
          min-height: 78px !important;
          padding: 6px 7px 8px !important;
          border: 1px solid #E9DFD2 !important;
          border-radius: 14px !important;
          background: #F9F5EF !important;
          color: #65564A !important;
          transition: border-color .2s ease, background .2s ease, box-shadow .2s ease, transform .2s ease !important;
        }
        .variant-image-choice:hover {
          transform: translateY(-2px) !important;
          border-color: #C6AE95 !important;
        }
        .variant-image-choice.active {
          border: 2px solid #927B68 !important;
          background: #F3EDE3 !important;
          box-shadow: 0 0 0 3px rgba(182,154,125,.14) !important;
          color: #493A30 !important;
        }
        .variant-image-choice img,
        .variant-image-choice-placeholder {
          width: 42px !important;
          height: 42px !important;
          border-radius: 10px !important;
          object-fit: contain !important;
          background: #FFFCF7 !important;
        }
        .variant-image-choice-label {
          display: block !important;
          margin-top: 5px !important;
          font-size: 11px !important;
          font-weight: 700 !important;
          line-height: 1.3 !important;
        }
        .product-modal-content > .product-price {
          display: block !important;
          color: #493A30 !important;
          font-size: 25px !important;
          font-weight: 800 !important;
          margin: 14px 0 15px !important;
        }
        .product-modal-content .full-button {
          min-height: 52px !important;
          width: 100% !important;
          border-radius: 15px !important;
          background: linear-gradient(135deg,#493A30,#6B5544) !important;
          box-shadow: 0 9px 20px rgba(73,58,48,.16) !important;
          font-weight: 750 !important;
          letter-spacing: .01em !important;
          transition: transform .2s ease, box-shadow .2s ease !important;
        }
        .product-modal-content .full-button:hover {
          transform: translateY(-2px) !important;
          box-shadow: 0 12px 24px rgba(73,58,48,.2) !important;
        }
        .variant-unavailable {
          padding: 12px 14px !important;
          border: 1px solid #EAD9D1 !important;
          border-radius: 12px !important;
          background: #FBF1ED !important;
          color: #986653 !important;
          font-size: 13px !important;
          line-height: 1.6 !important;
        }
        @media(max-width:760px) {
          .product-modal {
            width: min(94vw, 520px) !important;
            max-height: 91dvh !important;
            border-radius: 21px !important;
          }
          .product-media-viewer { padding: 13px !important; }
          .product-modal-content { padding: 19px 17px 21px !important; }
          .product-modal-content h2 { font-size: 20px !important; }
          .variant-image-choice { min-width: 70px !important; }
          .product-modal-content .full-button { min-height: 49px !important; }
        }
        @media(prefers-reduced-motion:reduce) {
          .product-modal-image-trigger img, .product-media-thumbnails button,
          .variant-image-choice, .product-modal-content .full-button {
            transition: none !important;
          }
        }

        /* NIZWA CAT — trust and brand finish */
        .benefits {
          display: grid !important;
          grid-template-columns: repeat(4,minmax(0,1fr)) !important;
          gap: 12px !important;
          margin: 26px auto 34px !important;
          padding: 0 !important;
          background: transparent !important;
        }
        .benefit-item {
          position: relative !important;
          display: flex !important;
          align-items: center !important;
          gap: 12px !important;
          min-width: 0 !important;
          min-height: 88px !important;
          padding: 15px 14px !important;
          border: 1px solid #E9DFD2 !important;
          border-radius: 17px !important;
          background: linear-gradient(145deg,#FFFCF7,#F8F3EC) !important;
          color: #493A30 !important;
          text-align: start !important;
          text-decoration: none !important;
          box-shadow: 0 7px 20px rgba(73,58,48,.045) !important;
          transition: transform .22s ease,border-color .22s ease,box-shadow .22s ease !important;
        }
        .benefit-item:hover {
          transform: translateY(-3px) !important;
          border-color: #CDB79F !important;
          box-shadow: 0 12px 24px rgba(73,58,48,.085) !important;
        }
        .benefit-icon {
          display: grid !important;
          place-items: center !important;
          flex: 0 0 43px !important;
          width: 43px !important;
          height: 43px !important;
          border: 1px solid rgba(182,154,125,.25) !important;
          border-radius: 14px !important;
          background: #F0E7DC !important;
          color: #806B57 !important;
        }
        .benefit-item > div { min-width: 0 !important; display: grid !important; gap: 5px !important; }
        .benefit-item strong { color: #493A30 !important; font-size: 13px !important; font-weight: 800 !important; line-height: 1.35 !important; }
        .benefit-item small { color: #897C70 !important; font-size: 10.5px !important; line-height: 1.55 !important; }
        .benefit-arrow { flex: 0 0 auto !important; margin-inline-start: auto !important; color: #A38B73 !important; }
        .site-footer {
          position: relative !important;
          margin-top: 44px !important;
          padding: 42px 22px 24px !important;
          border-top: 1px solid #E9DFD2 !important;
          background: linear-gradient(180deg,#F7F3EC 0%,#EFE6DA 100%) !important;
          color: #76685B !important;
          text-align: center !important;
        }
        .footer-brand { display: flex !important; align-items: center !important; justify-content: center !important; gap: 10px !important; color: #493A30 !important; }
        .footer-brand strong { font-size: 18px !important; letter-spacing: .12em !important; }
        .footer-brand span { color: #927B68 !important; font-size: 13px !important; }
        .site-footer > p { max-width: 440px !important; margin: 13px auto 18px !important; color: #817467 !important; font-size: 13px !important; line-height: 1.9 !important; }
        .footer-links { display: flex !important; justify-content: center !important; gap: 10px !important; margin: 18px 0 22px !important; }
        .footer-links a { display: grid !important; place-items: center !important; width: 40px !important; height: 40px !important; border: 1px solid #DCCDBB !important; border-radius: 50% !important; background: rgba(255,252,247,.7) !important; color: #6D5947 !important; transition: transform .2s ease,background .2s ease !important; }
        .footer-links a:hover { transform: translateY(-2px) !important; background: #FFFCF7 !important; }
        .site-footer > small { display: block !important; padding-top: 17px !important; border-top: 1px solid rgba(182,154,125,.24) !important; color: #9A8C7F !important; font-size: 10px !important; }
        @media(max-width:900px) {
          .benefits { grid-template-columns: repeat(2,minmax(0,1fr)) !important; }
        }
        @media(max-width:520px) {
          .benefits { width: calc(100% - 24px) !important; gap: 9px !important; margin: 18px auto 26px !important; }
          .benefit-item { min-height: 80px !important; padding: 11px 9px !important; gap: 8px !important; border-radius: 14px !important; }
          .benefit-icon { flex-basis: 35px !important; width: 35px !important; height: 35px !important; border-radius: 11px !important; }
          .benefit-icon svg { width: 19px !important; height: 19px !important; }
          .benefit-item strong { font-size: 11.5px !important; }
          .benefit-item small { font-size: 9.5px !important; }
          .benefit-arrow { width: 13px !important; }
          .site-footer { padding: 34px 17px 20px !important; }
        }
        @media(prefers-reduced-motion:reduce) {
          .benefit-item,.footer-links a { transition: none !important; }
        }
      `}</style>
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
                  <div className="cart-section-heading">
                    <span>{lang === 'ar' ? 'مشترياتك' : 'YOUR ITEMS'}</span>
                    <small>{lang === 'ar' ? `${cartCount} منتجات في السلة` : `${cartCount} items in your bag`}</small>
                  </div>
                  {cart.map(item => (
                    <div className="cart-item" key={item.cartKey || `${item.id}:simple`}>
                      <img decoding="async" src={item.image_url || NO_IMAGE} alt={productTitle(item, lang)} />
                      <div className="cart-item-info">
                        <strong>{productTitle(item, lang)}</strong>
                        {item.variant_label && <small>{item.variant_label}</small>}
                        {item.variant_sku && <small>SKU: {item.variant_sku}</small>}
                        <span>{money(item.price, lang)}</span>
                        <div className="quantity-control">
                          <button type="button" onClick={() => changeQuantity(item.cartKey || `${item.id}:simple`, -1)}><Minus size={14} /></button>
                          <span>{item.quantity}</span>
                          <button type="button" onClick={() => changeQuantity(item.cartKey || `${item.id}:simple`, 1)}><Plus size={14} /></button>
                        </div>
                      </div>
                      <IconButton label={t.remove} onClick={() => removeFromCart(item.cartKey || `${item.id}:simple`)}><Trash2 size={17} /></IconButton>
                    </div>
                  ))}
                </div>
                <div className="checkout-area">
                  <div className="checkout-section-heading">
                    <span>{lang === 'ar' ? 'تفاصيل التوصيل' : 'DELIVERY DETAILS'}</span>
                    <small>{lang === 'ar' ? 'كمّل بياناتك عشان نجهّز طلبك' : 'Add your details so we can prepare your order'}</small>
                  </div>
                  <div className="cart-total"><strong>{t.total}</strong><strong>{money(cartTotal, lang)}</strong></div>
                  <form onSubmit={event => { event.preventDefault(); sendWhatsAppOrder() }} className="checkout-form">
                  
<div className="checkout-field">
  <label>{t.deliveryMethod}</label>

  <div className="delivery-options">
    <button
      type="button"
      className={`delivery-option ${customer.deliveryType === 'home' ? 'active' : ''}`}
      onClick={() => setCustomer({ ...customer, deliveryType: 'home' })}
    >
      <span>{t.homeDelivery}</span>
      <strong>{money(2, lang)}</strong>
    </button>

    <button
      type="button"
      className={`delivery-option ${customer.deliveryType === 'office' ? 'active' : ''}`}
      onClick={() => setCustomer({ ...customer, deliveryType: 'office' })}
    >
      <span>{t.officeDelivery}</span>
      <strong>{money(1, lang)}</strong>
    </button>
  </div>

  <small className="delivery-weight-note">
    {t.deliveryWeightNote}
  </small>
</div>

<div className="checkout-field">
  <label>{t.governorate}</label>
  <select
    required
    value={customer.governorate}
    onChange={event =>
      setCustomer({
        ...customer,
        governorate: event.target.value,
        wilayat: ''
      })
    }
  >
    <option value="">{t.selectGovernorate}</option>
    {OMAN_GOVERNORATES.map(item => (
      <option key={item.value} value={item.value}>
        {item[lang]}
      </option>
    ))}
  </select>
</div>

<div className="checkout-field">
  <label>{t.wilayat}</label>
  <select
    required
    disabled={!customer.governorate}
    value={customer.wilayat}
    onChange={event =>
      setCustomer({ ...customer, wilayat: event.target.value })
    }
  >
    <option value="">{t.selectWilayat}</option>
    {availableWilayats.map(item => (
      <option key={item.value} value={item.value}>
        {item[lang]}
      </option>
    ))}
  </select>
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
  type="tel"
  placeholder={t.phone}
  value={customer.phone}
  onChange={event =>
    setCustomer({ ...customer, phone: event.target.value })
  }
/>

<textarea
  required
  placeholder={t.address}
  value={customer.address}
  onChange={event =>
    setCustomer({ ...customer, address: event.target.value })
  }
  rows="2"
/>

<textarea
  placeholder={t.notes}
  value={customer.notes}
  onChange={event =>
    setCustomer({ ...customer, notes: event.target.value })
  }
  rows="2"
/>

<div className="checkout-total-breakdown">
  <div className="checkout-summary-row">
    <span>{t.subtotal}</span>
    <strong>{money(cartTotal, lang)}</strong>
  </div>

  <div className="checkout-summary-row">
    <span>{t.deliveryFee}</span>
    <strong>{money(deliveryFee, lang)}</strong>
  </div>

  <div className="checkout-summary-row checkout-grand-total">
    <span>{t.finalTotal}</span>
    <strong>{money(orderGrandTotal, lang)}</strong>
  </div>
</div>

                    <div className="checkout-whatsapp-note">
                      <MessageCircle size={16} />
                      <span>{lang === 'ar' ? 'بعد الضغط، بنفتح واتساب لإرسال تفاصيل طلبك وتأكيده.' : 'WhatsApp will open so you can send your order details and confirm.'}</span>
                    </div>
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
                    <button type="button" className={adminTab === 'categories' ? 'active' : ''} onClick={() => { setAdminTab('categories'); loadStore() }}><Tags size={16} /> {t.manageCategories}</button>
                    <button type="button" className={adminTab === 'orders' ? 'active' : ''} onClick={() => { setAdminTab('orders'); loadOrders() }}><ClipboardList size={16} /> {t.orders}</button>
                    <button type="button" className={adminTab === 'analytics' ? 'active' : ''} onClick={() => { setAdminTab('analytics'); loadAnalytics() }}><span>▥</span> {lang === 'ar' ? 'إحصائيات الزيارات' : 'Analytics'}</button>
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
                      <input required={!editing} type="number" min="0" step="0.001" placeholder={t.price} value={form.price} onChange={event => setForm({ ...form, price: event.target.value })} />
                      <label className="admin-stock-field" style={{ display: 'grid', gap: 8, gridColumn: '1 / -1' }}>
                        <span>{lang === 'ar' ? 'الكمية في المخزون (اختياري)' : 'Stock quantity (optional)'}</span>
                        <input type="number" min="0" step="1" placeholder={lang === 'ar' ? 'اتركه فارغًا لعدم تتبع المخزون' : 'Leave blank to not track stock'} value={form.stock} onChange={event => setForm({ ...form, stock: event.target.value })} />
                        <small style={{ color: '#8b8175', lineHeight: 1.6 }}>{lang === 'ar' ? 'لا تحتاج إلى إضافة خيارات أو تركيبات. المنتج البسيط سيكون متاحًا للبيع.' : 'No options or variants are required. A simple product will be available for sale.'}</small>
                      </label>
                      <select value={form.category_id} onChange={event => setForm(current => ({
                        ...current,
                        category_id: event.target.value,
                        selected_category_ids: event.target.value
                          ? [...new Set([...(current.selected_category_ids || []).map(String), String(event.target.value)])]
                          : (current.selected_category_ids || [])
                      }))}>
                        <option value="">{t.category}</option>
                        {categories.map(category => <option key={category.id} value={category.id}>{categoryTitle(category, lang)}</option>)}
                      </select>
                      <fieldset className="admin-multi-category" style={{ gridColumn: '1 / -1', border: '1px solid #ded5c7', borderRadius: 12, padding: 12, display: 'grid', gap: 9 }}>
                        <legend style={{ padding: '0 6px', fontWeight: 700 }}>{lang === 'ar' ? 'عرض المنتج أيضًا في أقسام أخرى' : 'Also show this product in other categories'}</legend>
                        <small style={{ color: '#8b8175' }}>{lang === 'ar' ? 'يمكنك اختيار أكثر من قسم. سيبقى المنتج والصورة والسعر والمخزون نسخة واحدة.' : 'Select multiple categories. The product, image, price and stock remain a single shared item.'}</small>
                        {categories.map(category => {
                          const checked = (form.selected_category_ids || []).map(String).includes(String(category.id))
                          return <label key={category.id} style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                            <input type="checkbox" checked={checked} onChange={event => setForm(current => {
                              const nextIds = event.target.checked
                                ? [...new Set([...(current.selected_category_ids || []).map(String), String(category.id)])]
                                : (current.selected_category_ids || []).filter(id => String(id) !== String(category.id))
                              const nextPrimary = nextIds.includes(String(current.category_id || ''))
                                ? current.category_id : (nextIds[0] || '')
                              const currentSubcategory = subcategories.find(item => String(item.id) === String(current.subcategory_id || ''))
                              const keepSubcategory = currentSubcategory && nextIds.includes(String(currentSubcategory.category_id))
                              return {
                                ...current,
                                selected_category_ids: nextIds,
                                category_id: nextPrimary,
                                subcategory_id: keepSubcategory ? current.subcategory_id : ''
                              }
                            })} />
                            {categoryTitle(category, lang)}
                          </label>
                        })}
                      </fieldset>
                      {(form.selected_category_ids || []).map(String).filter(id => subcategories.some(item => String(item.category_id) === id)).map(categoryId => {
                        const parentCategory = categories.find(category => String(category.id) === categoryId)
                        const categorySubcategories = subcategories.filter(item => String(item.category_id) === categoryId)
                        return (
                          <label key={`category-subcategory-${categoryId}`} style={{ display: 'grid', gap: 7, gridColumn: '1 / -1', padding: 12, border: '1px solid #e5dccf', borderRadius: 12 }}>
                            <span style={{ fontWeight: 700 }}>{lang === 'ar' ? `القسم الفرعي داخل ${categoryTitle(parentCategory, lang)}` : `Subcategory inside ${categoryTitle(parentCategory, lang)}`}</span>
                            <small style={{ color: '#8b8175' }}>{lang === 'ar' ? 'اختر القسم الفرعي الذي سيظهر فيه المنتج.' : 'Choose the subcategory where this product should appear.'}</small>
                            <select value={(form.subcategory_assignments || {})[categoryId] || ''} onChange={event => setForm(current => ({
                              ...current,
                              subcategory_assignments: { ...(current.subcategory_assignments || {}), [categoryId]: event.target.value }
                            }))}>
                              <option value="">{lang === 'ar' ? 'اختر القسم الفرعي' : 'Choose product type'}</option>
                              {categorySubcategories.map(item => <option key={item.id} value={item.id}>{categoryTitle(item, lang)}</option>)}
                            </select>
                            {categorySubcategories.length === 0 && <small style={{ color: '#a05b4f' }}>{lang === 'ar' ? 'أضف أقسامًا فرعية أولاً من إدارة الأقسام الفرعية.' : 'Add subcategories first in Manage subcategories.'}</small>}
                          </label>
                        )
                      })}
                      <label className="upload-field">
                        <ImagePlus size={19} /><span>{imageFile ? imageFile.name : t.image}</span>
                        <input type="file" accept="image/jpeg,image/png,image/webp,image/gif"
                          onChange={event => setImageFile(event.target.files?.[0] || null)} />
                      </label>
                      {(imagePreview || form.image_url) && (
                        <img decoding="async" className="admin-image-preview" src={imagePreview || form.image_url} alt="Product preview" />
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
                    {editing && (
                      <section className="variant-admin-panel product-gallery-admin">
                        <div className="admin-section-title"><h3>{lang === 'ar' ? 'معرض صور وفيديو المنتج' : 'Product photo & video gallery'}</h3></div>
                        <p className="variant-admin-help">{lang === 'ar' ? 'اختر عدة صور أو فيديوهات من جهازك. الصور حتى 5MB والفيديوهات حتى 50MB لكل ملف.' : 'Select multiple photos or videos from your device. Images up to 5MB and videos up to 50MB each.'}</p>
                        <label className="variant-image-picker">
                          <ImagePlus size={17} /> {mediaUploading ? (lang === 'ar' ? 'جارٍ الرفع...' : 'Uploading...') : (lang === 'ar' ? 'إضافة صور وفيديوهات' : 'Add photos & videos')}
                          <input type="file" multiple accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm,video/quicktime" disabled={mediaUploading} onChange={event => { const files = event.target.files; if (files?.length) uploadProductMedia(editing, files); event.target.value = ''; }} />
                        </label>
                        <div className="product-gallery-admin-grid">
                          {productMedia.filter(item => String(item.product_id) === String(editing.id)).map(media => (
                            <div className="product-gallery-admin-item" key={media.id}>
                              {media.media_type === 'video' ? <video src={media.media_url} muted playsInline preload="metadata" /> : <img decoding="async" src={media.thumbnail_url || media.media_url} alt={media.alt_en || ''} />}
                              <div className="product-gallery-admin-actions">
                                {media.media_type === 'image' && <button type="button" onClick={() => updateProductMedia(media, { is_primary: true })}>{media.is_primary ? (lang === 'ar' ? 'الصورة الرئيسية' : 'Main image') : (lang === 'ar' ? 'تعيين كرئيسية' : 'Set as main')}</button>}
                                <button type="button" onClick={() => deleteProductMedia(media)} aria-label={t.delete}><Trash2 size={14} /></button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </section>
                    )}
                    {editing && (
                      <section className="variant-admin-panel">
                        <div className="admin-section-title">
                          <h3>{lang === 'ar' ? 'خيارات ومتغيرات المنتج' : 'Product options & variants'}</h3>
                        </div>
                        <p className="variant-admin-help">
                          {lang === 'ar'
                            ? 'الخيارات مثل الوزن أو اللون اختيارية. يمكنك بيع المنتج مباشرة بدون إضافة أي خيار.'
                            : 'Options such as weight or color are optional. You can sell this product directly without adding any options.'}
                        </p>
                        <form className="variant-option-form" onSubmit={addProductOption}>
                          <input placeholder={lang === 'ar' ? 'اسم الخيار بالإنجليزية' : 'Option name (English)'} value={optionDraft.name_en} onChange={event => setOptionDraft({ ...optionDraft, name_en: event.target.value })} />
                          <input placeholder={lang === 'ar' ? 'اسم الخيار بالعربية' : 'Option name (Arabic)'} value={optionDraft.name_ar} onChange={event => setOptionDraft({ ...optionDraft, name_ar: event.target.value })} />
                          <textarea rows="4" placeholder={'500g | ٥٠٠ جرام\n1kg | ١ كجم'} value={optionDraft.values} onChange={event => setOptionDraft({ ...optionDraft, values: event.target.value })} />
                          <button type="submit" className="secondary-button" disabled={variantBusy}><Plus size={16} /> {lang === 'ar' ? 'حفظ الخيار' : 'Save option'}</button>
                        </form>
                        <div className="variant-admin-options">
                          {productOptions.filter(option => String(option.product_id) === String(editing.id)).map(option => (
                            <div className="variant-admin-option" key={option.id}>
                              <div style={{ minWidth: 0, flex: 1 }}>
                                <strong>{lang === 'ar' ? (option.name_ar || option.name_en) : (option.name_en || option.name_ar)}</strong>
                                <small>{optionValues.filter(value => String(value.option_id) === String(option.id)).sort((a, b) => Number(a.display_order || 0) - Number(b.display_order || 0)).map(value => lang === 'ar' ? (value.label_ar || value.label_en) : (value.label_en || value.label_ar)).join(' · ')}</small>
                              </div>
                              <div style={{ display: 'flex', gap: 7, flexShrink: 0 }}>
                                <button type="button" className="secondary-button" style={{ padding: '7px 10px' }} onClick={() => startEditProductOption(option)} disabled={variantBusy}><Edit3 size={15} /> {lang === 'ar' ? 'تعديل' : 'Edit'}</button>
                                <button type="button" className="secondary-button" style={{ padding: '7px 10px', color: '#a65348' }} onClick={() => deleteProductOption(option)} disabled={variantBusy}><Trash2 size={15} /> {lang === 'ar' ? 'حذف' : 'Delete'}</button>
                              </div>
                            </div>
                          ))}
                        </div>
                        {productOptions.some(option => String(option.id) === String(editingOptionId)) && (
                          <form className="variant-option-form" onSubmit={saveProductOption} style={{ marginTop: 12 }}>
                            <strong>{lang === 'ar' ? 'تعديل الخيار' : 'Edit option'}</strong>
                            <input placeholder={lang === 'ar' ? 'اسم الخيار بالإنجليزية' : 'Option name (English)'} value={optionEditDraft.name_en} onChange={event => setOptionEditDraft({ ...optionEditDraft, name_en: event.target.value })} />
                            <input placeholder={lang === 'ar' ? 'اسم الخيار بالعربية' : 'Option name (Arabic)'} value={optionEditDraft.name_ar} onChange={event => setOptionEditDraft({ ...optionEditDraft, name_ar: event.target.value })} />
                            <textarea rows="4" placeholder={'500g | ٥٠٠ جرام\n1kg | ١ كجم'} value={optionEditDraft.values} onChange={event => setOptionEditDraft({ ...optionEditDraft, values: event.target.value })} />
                            <div style={{ display: 'flex', gap: 8 }}>
                              <button type="submit" className="primary-button" disabled={variantBusy}><Check size={16} /> {lang === 'ar' ? 'حفظ التعديلات' : 'Save changes'}</button>
                              <button type="button" className="secondary-button" onClick={() => setEditingOptionId(null)} disabled={variantBusy}>{lang === 'ar' ? 'إلغاء' : 'Cancel'}</button>
                            </div>
                            <small className="variant-admin-help">{lang === 'ar' ? 'كل سطر يمثل قيمة واحدة: الاسم بالإنجليزية | الاسم بالعربية. حذف قيمة مستخدمة سيوقف التركيبات المرتبطة بها عن البيع مع الاحتفاظ بسجلاتها.' : 'One value per line: English label | Arabic label. Removing a value used by variants deactivates those combinations while preserving their records.'}</small>
                          </form>
                        )}
                        <button type="button" className="primary-button" onClick={generateProductVariants} disabled={variantBusy || !productOptions.some(option => String(option.product_id) === String(editing.id))}>
                          {variantBusy ? <Loader2 className="spin" size={16} /> : <Sparkles size={16} />}
                          {lang === 'ar' ? 'إنشاء جميع التركيبات' : 'Generate all combinations'}
                        </button>
                        <div className="variant-admin-list">
                          {productVariants.filter(variant => String(variant.product_id) === String(editing.id)).map(variant => (
                            <div className="variant-admin-row" key={variant.id}>
                              <div className="variant-admin-row-title">
                                <strong>{variantOptionSummary(variant, lang) || (variant.sku || `#${variant.id}`)}</strong>
                                <small>#{variant.id}</small>
                              </div>
                              <label>SKU<input type="text" defaultValue={variant.sku || ''} onBlur={event => updateVariant(variant, 'sku', event.target.value)} /></label>
                              <label>{lang === 'ar' ? 'السعر' : 'Price'}<input type="number" min="0" step="0.001" defaultValue={variant.price ?? 0} onBlur={event => updateVariant(variant, 'price', event.target.value)} /></label>
                              <label>{lang === 'ar' ? 'سعر التخفيض' : 'Sale price'}<input type="number" min="0" step="0.001" placeholder="—" defaultValue={variant.sale_price ?? ''} onBlur={event => updateVariant(variant, 'sale_price', event.target.value)} /></label>
                              <label>{lang === 'ar' ? 'المخزون' : 'Stock'}<input type="number" min="0" step="1" defaultValue={variant.stock ?? 0} onBlur={event => updateVariant(variant, 'stock', event.target.value)} /></label>
                              <label className="variant-active-toggle"><input type="checkbox" checked={variant.is_active !== false} onChange={event => updateVariant(variant, 'is_active', event.target.checked)} /> {lang === 'ar' ? 'متاح للبيع' : 'Active for sale'}</label>
                              <div className="variant-image-upload">
                                <span>{lang === 'ar' ? 'صورة هذه التركيبة' : 'Variant image'}</span>
                                {variant.image_url && <img decoding="async" className="variant-image-preview" src={variant.image_url} alt={variantOptionSummary(variant, lang)} />}
                                <label className="variant-image-picker">
                                  <ImagePlus size={16} />
                                  {variantImageUploading === variant.id
                                    ? (lang === 'ar' ? 'جارٍ الرفع...' : 'Uploading...')
                                    : (lang === 'ar' ? 'اختيار صورة من المعرض' : 'Choose from gallery')}
                                  <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" disabled={variantImageUploading !== null} onChange={event => { const file = event.target.files?.[0]; if (file) uploadVariantImage(variant, file); event.target.value = ''; }} />
                                </label>
                                <small>{lang === 'ar' ? 'JPG أو PNG أو WEBP أو GIF · الحد الأقصى 5MB' : 'JPG, PNG, WEBP or GIF · Max 5MB'}</small>
                              </div>
                            </div>
                          ))}
                          {!productVariants.some(variant => String(variant.product_id) === String(editing.id)) && (
                            <p className="variant-admin-help">{lang === 'ar' ? 'لا توجد تركيبات بعد. أضف الخيارات ثم اضغط إنشاء جميع التركيبات.' : 'No variants yet. Add options, then generate combinations.'}</p>
                          )}
                        </div>
                      </section>
                    )}
                    <div className="admin-section-title" style={{ marginTop: 24 }}>
                      <h3>{lang === 'ar' ? 'ترتيب ظهور المنتجات' : 'Product display order'}</h3>
                      <select value={adminOrderCategory} onChange={event => setAdminOrderCategory(event.target.value)} aria-label={lang === 'ar' ? 'اختر الفئة لترتيب منتجاتها' : 'Choose category to reorder'}>
                        <option value="all">{lang === 'ar' ? 'كل الفئات' : 'All categories'}</option>
                        {categories.map(category => <option key={category.id} value={category.id}>{categoryTitle(category, lang)}</option>)}
                      </select>
                    </div>
                    <p className="variant-admin-help">{lang === 'ar' ? 'استخدم السهمين لتحديد المنتج الذي يظهر أولاً داخل فئته. يتم حفظ الترتيب تلقائياً.' : 'Use the arrows to choose which product appears first within its category. Order is saved automatically.'}</p>
                    <div className="admin-list">
                      {adminOrderProducts.map((product, index) => (
                        <div className="admin-list-item" key={product.id}>
                          <img decoding="async" src={product.image_url || NO_IMAGE} alt={productTitle(product, lang)} />
                          <div className="admin-list-info"><strong>{productTitle(product, lang)}</strong><small>{money(productDisplayPrice(product), lang)}</small></div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                            <button type="button" className="secondary-button" style={{ padding: '6px 9px', minWidth: 36 }} disabled={reorderingProducts || index === 0 || (adminOrderCategory === 'all' && String(adminOrderProducts[index - 1]?.category_id || '') !== String(product.category_id || ''))} onClick={() => moveProductInCategory(product, -1)} aria-label={lang === 'ar' ? 'تحريك لأعلى' : 'Move up'}><ArrowUp size={15} /></button>
                            <button type="button" className="secondary-button" style={{ padding: '6px 9px', minWidth: 36 }} disabled={reorderingProducts || index === adminOrderProducts.length - 1 || (adminOrderCategory === 'all' && String(adminOrderProducts[index + 1]?.category_id || '') !== String(product.category_id || ''))} onClick={() => moveProductInCategory(product, 1)} aria-label={lang === 'ar' ? 'تحريك لأسفل' : 'Move down'}><ArrowDown size={15} /></button>
                          </div>
                          <IconButton label={t.editProduct} onClick={() => startEditProduct(product)}><Edit3 size={17} /></IconButton>
                          <IconButton label={t.delete} onClick={() => deleteProduct(product)}><Trash2 size={17} /></IconButton>
                        </div>
                      ))}
                      {adminOrderProducts.length === 0 && <p className="variant-admin-help">{lang === 'ar' ? 'لا توجد منتجات في هذه الفئة.' : 'No products in this category yet.'}</p>}
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

<small>
  {t.deliveryMethod}:{' '}
  {order.delivery_type === 'office'
    ? t.officeDelivery
    : t.homeDelivery}
</small>

<small>
  {t.governorate}:{' '}
  {OMAN_GOVERNORATES.find(
    item => item.value === order.governorate
  )?.[lang] || order.governorate || '-'}
</small>

<small>
  {t.wilayat}:{' '}
  {OMAN_GOVERNORATES
    .flatMap(item => item.wilayats)
    .find(item => item.value === order.wilayat)?.[lang]
    || order.wilayat
    || '-'}
</small>

{order.notes && <small>{t.notes}: {order.notes}</small>}

<strong>{t.orderItems}</strong>

{(Array.isArray(order.items) ? order.items : []).map((item, index) => (
  <small key={`${order.id}-${index}`}>
    {lang === 'ar'
      ? (item.name_ar || item.name_en)
      : (item.name_en || item.name_ar)} × {item.quantity} · {money(item.line_total, lang)}
  </small>
))}

<strong>
  {t.subtotal}: {money(Number(order.total_amount) - Number(order.delivery_fee || 0), lang)}
</strong>

<strong>
  {t.deliveryFee}: {money(order.delivery_fee, lang)}
</strong>

<strong>
  {t.finalTotal}: {money(order.total_amount, lang)}
</strong>
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
                {adminTab === 'analytics' && (() => {
                  const totalViews = analyticsRows.reduce((sum, row) => sum + Number(row.page_views || 0), 0)
                  const uniqueVisitors = new Set(analyticsRows.map(row => row.visitor_id)).size
                  const daily = Object.values(analyticsRows.reduce((acc, row) => {
                    const key = row.visit_date
                    if (!acc[key]) acc[key] = { date: key, views: 0, visitors: new Set() }
                    acc[key].views += Number(row.page_views || 0)
                    acc[key].visitors.add(row.visitor_id)
                    return acc
                  }, {})).sort((a, b) => b.date.localeCompare(a.date))
                  const dateLabel = value => new Date(`${value}T12:00:00`).toLocaleDateString(lang === 'ar' ? 'ar-OM' : 'en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
                  return (
                    <div className="admin-section">
                      <div className="section-heading">
                        <div><span className="eyebrow">STORE TRAFFIC</span><h2>{lang === 'ar' ? 'إحصائيات الزيارات' : 'Store Analytics'}</h2><p style={{ color: 'var(--muted, #8C8176)', marginTop: 6 }}>{lang === 'ar' ? 'آخر 30 يومًا' : 'Last 30 days'}</p></div>
                        <button type="button" className="secondary-button" onClick={loadAnalytics} disabled={analyticsLoading}>{analyticsLoading ? (lang === 'ar' ? 'جاري التحديث...' : 'Refreshing...') : (lang === 'ar' ? 'تحديث' : 'Refresh')}</button>
                      </div>
                      {analyticsError ? <p className="error-message">{analyticsError}</p> : (
                        <>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12, margin: '18px 0' }}>
                            <div style={{ padding: 18, border: '1px solid var(--line, #E9DFD2)', borderRadius: 14, background: 'var(--paper, #FFFCF7)' }}><small style={{ color: 'var(--muted, #8C8176)' }}>{lang === 'ar' ? 'مشاهدات الصفحات' : 'Page views'}</small><div style={{ fontSize: 28, fontWeight: 700, marginTop: 6 }}>{analyticsLoading ? '—' : totalViews.toLocaleString()}</div></div>
                            <div style={{ padding: 18, border: '1px solid var(--line, #E9DFD2)', borderRadius: 14, background: 'var(--paper, #FFFCF7)' }}><small style={{ color: 'var(--muted, #8C8176)' }}>{lang === 'ar' ? 'زوار مميزون' : 'Unique visitors'}</small><div style={{ fontSize: 28, fontWeight: 700, marginTop: 6 }}>{analyticsLoading ? '—' : uniqueVisitors.toLocaleString()}</div></div>
                            <div style={{ padding: 18, border: '1px solid var(--line, #E9DFD2)', borderRadius: 14, background: 'var(--paper, #FFFCF7)' }}><small style={{ color: 'var(--muted, #8C8176)' }}>{lang === 'ar' ? 'أيام الزيارة' : 'Visitor-days'}</small><div style={{ fontSize: 28, fontWeight: 700, marginTop: 6 }}>{analyticsLoading ? '—' : analyticsRows.length.toLocaleString()}</div></div>
                          </div>
                          {analyticsLoading ? <p>{lang === 'ar' ? 'جاري تحميل الإحصائيات...' : 'Loading analytics...'}</p> : daily.length === 0 ? <div className="empty-state"><p>{lang === 'ar' ? 'لا توجد زيارات مسجلة حتى الآن. افتح المتجر من نافذة خاصة أو جهاز آخر ثم حدّث الإحصائيات.' : 'No visits recorded yet. Open the storefront in a private window or another device, then refresh.'}</p></div> : (
                            <div style={{ display: 'grid', gap: 8 }}>
                              {daily.map(day => (
                                <div key={day.date} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap', padding: '13px 15px', border: '1px solid var(--line, #E9DFD2)', borderRadius: 12 }}>
                                  <strong>{dateLabel(day.date)}</strong>
                                  <span style={{ color: 'var(--muted, #8C8176)' }}>{day.visitors.size} {lang === 'ar' ? 'زائر' : 'visitors'} · {day.views} {lang === 'ar' ? 'مشاهدة' : 'views'}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  )
                })()}
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
                    <div className="variant-admin-panel" style={{ marginTop: 18 }}>
                      <h3>{lang === 'ar' ? 'إدارة الأقسام الفرعية لجميع الفئات' : 'Manage subcategories for all categories'}</h3>
                      <p className="variant-admin-help">{lang === 'ar' ? 'أنشئ أقسامًا فرعية لأي فئة، وستظهر للعميل داخل صفحة تلك الفئة.' : 'Create subcategories for any category. They will appear inside that category page.'}</p>
                      <form className="admin-form" onSubmit={addSubcategory}>
                        <select required value={subcategoryForm.category_id} onChange={event => setSubcategoryForm(current => ({ ...current, category_id: event.target.value }))}>
                          <option value="">{lang === 'ar' ? 'اختر الفئة الرئيسية' : 'Choose parent category'}</option>
                          {categories.map(category => <option key={category.id} value={category.id}>{categoryTitle(category, lang)}</option>)}
                        </select>
                        <input placeholder={lang === 'ar' ? 'اسم القسم بالإنجليزية' : 'Subcategory name in English'} value={subcategoryForm.name_en} onChange={event => setSubcategoryForm(current => ({ ...current, name_en: event.target.value }))} />
                        <input placeholder={lang === 'ar' ? 'اسم القسم بالعربية' : 'Subcategory name in Arabic'} value={subcategoryForm.name_ar} onChange={event => setSubcategoryForm(current => ({ ...current, name_ar: event.target.value }))} />
                        <button type="submit" className="primary-button" disabled={saving}>{saving ? <Loader2 className="spin" size={16} /> : <Plus size={16} />} {lang === 'ar' ? 'إضافة قسم فرعي' : 'Add subcategory'}</button>
                      </form>
                      <div className="admin-list" style={{ marginTop: 12 }}>
                        {categories.map(category => (
                          <div key={category.id} className="admin-list-item" style={{ flexWrap: 'wrap' }}>
                            <strong style={{ flexBasis: '100%' }}>{categoryTitle(category, lang)}</strong>
                            {subcategories.filter(item => String(item.category_id) === String(category.id)).map(item => (
                              <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 10px', borderRadius: 10, background: '#f5f0e8', flexWrap: 'wrap' }}>
                                {String(editingSubcategory) === String(item.id) ? (
                                  <form onSubmit={event => saveSubcategoryEdit(event, item)} style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                                    <input aria-label="English subcategory name" value={editSubcategoryForm.name_en} onChange={event => setEditSubcategoryForm(current => ({ ...current, name_en: event.target.value }))} placeholder="English name" style={{ width: 125 }} />
                                    <input aria-label="Arabic subcategory name" value={editSubcategoryForm.name_ar} onChange={event => setEditSubcategoryForm(current => ({ ...current, name_ar: event.target.value }))} placeholder="Arabic name" style={{ width: 125 }} />
                                    <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11 }}>
                                      <img decoding="async" src={categoryMediaPreviews[item.id]?.subcategoryIcon || item.icon_url || NO_IMAGE} alt="" style={{ width: 38, height: 38, objectFit: 'cover', borderRadius: 8 }} />
                                      {lang === 'ar' ? 'تغيير صورة أيقونة النوع' : 'Change product-type icon image'}
                                      <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={event => handleCategoryMediaSelect(item.id, 'subcategoryIcon', event.target.files?.[0])} style={{ width: 125 }} />
                                    </label>
                                    <button type="submit" className="secondary-button" style={{ padding: '5px 8px' }} disabled={saving}><Check size={14} /></button>
                                    <button type="button" className="secondary-button" style={{ padding: '5px 8px' }} onClick={() => setEditingSubcategory(null)}><X size={14} /></button>
                                  </form>
                                ) : (
                                  <>
                                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                                      {item.icon_url ? <img decoding="async" loading="lazy" src={item.icon_url} alt="" style={{ width: 32, height: 32, objectFit: 'cover', borderRadius: 8 }} /> : null}
                                      {categoryTitle(item, lang)}
                                    </span>
                                    <button type="button" className="secondary-button" style={{ padding: '5px 8px' }} onClick={() => startEditSubcategory(item)} aria-label={t.editCategory}><Edit3 size={14} /></button>
                                    <button type="button" className="secondary-button" style={{ padding: '5px 8px' }} onClick={() => deleteSubcategory(item)} aria-label={t.delete}><Trash2 size={14} /></button>
                                  </>
                                )}
                              </div>
                            ))}
                            {!subcategories.some(item => String(item.category_id) === String(category.id)) && <small className="variant-admin-help">{lang === 'ar' ? 'لا توجد أقسام فرعية بعد.' : 'No subcategories yet.'}</small>}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="admin-list">
                      {categories.map((category, index) => (
                        <div className="admin-list-item" key={category.id} style={{ flexWrap: 'wrap' }}>
                          <div className="category-admin-icon">
                            {category.icon_url ? <img decoding="async" loading="lazy" src={category.icon_url} alt="" style={{ width: 42, height: 42, objectFit: 'cover', borderRadius: 10 }} /> : <Tags size={19} />}
                          </div>
                          {String(editingCategory) === String(category.id) ? (
                            <form onSubmit={event => saveCategoryEdit(event, category)} style={{ display: 'flex', flex: '1 1 240px', flexWrap: 'wrap', gap: '8px', minWidth: 0 }}>
                              <input
                                aria-label={t.categoryNameEn}
                                placeholder={t.categoryNameEn}
                                value={editCategoryForm.name_en}
                                onChange={event => setEditCategoryForm(current => ({ ...current, name_en: event.target.value }))}
                                style={{ flex: '1 1 150px', minWidth: 0 }}
                              />
                              <input
                                aria-label={t.categoryNameAr}
                                placeholder={t.categoryNameAr}
                                value={editCategoryForm.name_ar}
                                onChange={event => setEditCategoryForm(current => ({ ...current, name_ar: event.target.value }))}
                                style={{ flex: '1 1 150px', minWidth: 0 }}
                              />
                              <label style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: '1 1 150px', fontSize: 12 }}>
                                {lang === 'ar' ? 'صورة أيقونة بطاقة الفئة في الصفحة الرئيسية' : 'Homepage category card icon image'}
                                <img decoding="async" src={categoryMediaPreviews[category.id]?.icon || (categoryMediaRemovals[category.id]?.icon ? NO_IMAGE : category.icon_url) || NO_IMAGE} alt="Icon preview" style={{ width: 76, height: 76, objectFit: 'cover', borderRadius: 12, background: '#F3EDE3' }} />
                                <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={event => handleCategoryMediaSelect(category.id, 'icon', event.target.files?.[0])} />
                                {category.icon_url && <button type="button" className="secondary-button" style={{ padding: '6px 9px' }} onClick={() => setCategoryMediaRemovals(current => ({ ...current, [category.id]: { ...(current[category.id] || {}), icon: !current[category.id]?.icon } }))}>{categoryMediaRemovals[category.id]?.icon ? (lang === 'ar' ? 'إلغاء الإزالة' : 'Keep current image') : (lang === 'ar' ? 'إزالة الصورة' : 'Remove image')}</button>}
                              </label>
                              <label style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: '1 1 190px', fontSize: 12 }}>
                                {lang === 'ar' ? 'صورة غلاف صفحة الفئة' : 'Category page banner'}
                                <img decoding="async" src={categoryMediaPreviews[category.id]?.banner || (categoryMediaRemovals[category.id]?.banner ? NO_IMAGE : category.banner_url || categoryBannerImages(category)[0]) || NO_IMAGE} alt="Banner preview" style={{ width: '100%', maxWidth: 220, height: 76, objectFit: 'cover', borderRadius: 12, background: '#F3EDE3' }} />
                                <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={event => handleCategoryMediaSelect(category.id, 'banner', event.target.files?.[0])} />
                                {category.banner_url && <button type="button" className="secondary-button" style={{ padding: '6px 9px' }} onClick={() => setCategoryMediaRemovals(current => ({ ...current, [category.id]: { ...(current[category.id] || {}), banner: !current[category.id]?.banner } }))}>{categoryMediaRemovals[category.id]?.banner ? (lang === 'ar' ? 'إلغاء الإزالة' : 'Keep current image') : (lang === 'ar' ? 'إزالة الصورة' : 'Remove image')}</button>}
                              </label>
                              <small style={{ flexBasis: '100%', color: 'var(--muted, #777)' }}>{lang === 'ar' ? 'JPG أو PNG أو WEBP أو GIF — حتى 5MB لكل صورة' : 'JPG, PNG, WEBP or GIF — up to 5MB per image'}</small>
                              <button type="submit" className="primary-button" disabled={saving}>
                                {saving ? <Loader2 className="spin" size={16} /> : <Check size={16} />} {t.updateCategory}
                              </button>
                              <IconButton label={t.cancel} onClick={cancelEditCategory}><X size={17} /></IconButton>
                            </form>
                          ) : (
                            <>
                              <div className="admin-list-info" style={{ flex: '1 1 150px', minWidth: 0 }}><strong>{categoryTitle(category, lang)}</strong><small>{category.name_en || ''}</small></div>
                              {index >= 2 && (
                                <>
                                  {index > 2 && (
                                    <IconButton label={lang === 'ar' ? 'تحريك للأعلى' : 'Move up'} onClick={() => moveCategory(category, index, -1)}>↑</IconButton>
                                  )}
                                  {index < categories.length - 1 && (
                                    <IconButton label={lang === 'ar' ? 'تحريك للأسفل' : 'Move down'} onClick={() => moveCategory(category, index, 1)}>↓</IconButton>
                                  )}
                                </>
                              )}
                              <IconButton label={t.editCategory} onClick={() => startEditCategory(category)}><Edit3 size={17} /></IconButton>
                              <IconButton label={t.delete} onClick={() => deleteCategory(category)}><Trash2 size={17} /></IconButton>
                            </>
                          )}
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

function ProductCard({ product, lang, t, onAdd, onDetails, hasVariants = false, variants = [], imagePriority = false }) {
  const variantPrices = variants
    .filter(variant => Number(variant.price) > 0)
    .sort((a, b) => {
      const priceA = Number(a.sale_price) > 0 ? Number(a.sale_price) : Number(a.price)
      const priceB = Number(b.sale_price) > 0 ? Number(b.sale_price) : Number(b.price)
      return priceA - priceB
    })
  const cheapestVariant = variantPrices[0] || null
  const regularPrice = cheapestVariant
    ? Number(cheapestVariant.price)
    : Number(product.price || 0)
  const salePrice = cheapestVariant
    ? (Number(cheapestVariant.sale_price) > 0 && Number(cheapestVariant.sale_price) < regularPrice ? Number(cheapestVariant.sale_price) : null)
    : (Number(product.sale_price) > 0 && Number(product.sale_price) < Number(product.price || 0) ? Number(product.sale_price) : null)
  const hasSale = salePrice != null
  const stockCount = hasVariants
    ? variants.reduce((total, variant) => total + Math.max(0, Number(variant.stock || 0)), 0)
    : (product.stock == null ? null : Math.max(0, Number(product.stock || 0)))
  const simpleOutOfStock = !hasVariants && product.stock != null && Number(product.stock) <= 0

  return (
    <article className="product-card">
      <button type="button" className="product-image-button" onClick={onDetails}>
        <img src={product.image_url || NO_IMAGE} alt={productTitle(product, lang)}
          loading={imagePriority ? 'eager' : 'lazy'} decoding="async" fetchPriority={imagePriority ? 'high' : 'auto'} onError={event => { event.currentTarget.onerror = null; event.currentTarget.src = NO_IMAGE }} />
        {product.featured && <span className="product-badge"><Sparkles size={13} /> {t.featured}</span>}
        <span className="product-view"><ArrowUpRight size={18} /></span>
      </button>
      <div className="product-card-content">
        <button type="button" className="product-name" onClick={onDetails}>{productTitle(product, lang)}</button>
        <p>{productDescription(product, lang)}</p>
        <div className="product-card-pricing">
          {hasSale ? (
            <>
              <del className="product-old-price">{money(regularPrice, lang)}</del>
              <strong className="product-price product-sale-price">{money(salePrice, lang)}</strong>
            </>
          ) : (
            <strong className="product-price">{money(cheapestVariant ? regularPrice : (product.price ?? productDisplayPrice(product)), lang)}</strong>
          )}
        </div>
        {stockCount != null && (
          <div className={`product-stock-label${stockCount <= 0 ? ' out-of-stock' : ''}`}>
            {stockCount > 0
              ? (lang === 'ar' ? `المتوفر: ${stockCount}` : `In stock: ${stockCount}`)
              : (lang === 'ar' ? 'نفد المخزون' : 'Out of stock')}
          </div>
        )}
        <div className="product-card-bottom">
          <span className="product-card-hint">{hasVariants ? (lang === 'ar' ? 'اختر النوع' : 'Choose options') : ''}</span>
          <button type="button" className="add-cart-button" onClick={hasVariants ? onDetails : onAdd} disabled={simpleOutOfStock || (hasVariants && stockCount <= 0)} aria-label={hasVariants ? (lang === 'ar' ? 'اختر الخيارات' : 'Choose options') : t.add}><Plus size={19} /></button>
        </div>
      </div>
    </article>
  )
}
