-- NIZWA CAT: secure checkout support for optional product variants
-- Run once in Supabase SQL Editor after the five variant tables have been created.
-- Legacy cart items with product_id only remain supported.

CREATE OR REPLACE FUNCTION public.create_store_order_v2(
  p_customer_name text,
  p_customer_phone text,
  p_customer_address text,
  p_customer_notes text,
  p_language text,
  p_items jsonb,
  p_delivery_type text,
  p_governorate text,
  p_wilayat text
)
RETURNS TABLE(order_id bigint, order_total numeric)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'pg_temp'
AS $function$
DECLARE
  v_item jsonb;
  v_product record;
  v_variant record;
  v_product_id bigint;
  v_variant_id bigint;
  v_quantity integer;
  v_items jsonb := '[]'::jsonb;
  v_total numeric(12,3) := 0;
  v_unit_price numeric(12,3);
  v_line_total numeric(12,3);
  v_delivery_fee numeric(12,3);
  v_order_id bigint;
  v_item_count integer := 0;
BEGIN
  IF COALESCE(trim(p_customer_name), '') = ''
     OR COALESCE(trim(p_customer_phone), '') = ''
     OR COALESCE(trim(p_customer_address), '') = '' THEN
    RAISE EXCEPTION 'Customer information is required';
  END IF;

  IF COALESCE(p_language, '') NOT IN ('ar', 'en') THEN
    RAISE EXCEPTION 'Invalid language';
  END IF;

  IF p_delivery_type = 'home' THEN
    v_delivery_fee := 2;
  ELSIF p_delivery_type = 'office' THEN
    v_delivery_fee := 1;
  ELSE
    RAISE EXCEPTION 'Invalid delivery type';
  END IF;

  IF COALESCE(trim(p_governorate), '') = ''
     OR COALESCE(trim(p_wilayat), '') = '' THEN
    RAISE EXCEPTION 'Governorate and wilayat are required';
  END IF;

  IF p_items IS NULL OR jsonb_typeof(p_items) <> 'array'
     OR jsonb_array_length(p_items) = 0
     OR jsonb_array_length(p_items) > 30 THEN
    RAISE EXCEPTION 'Invalid order items';
  END IF;

  FOR v_item IN SELECT value FROM jsonb_array_elements(p_items)
  LOOP
    v_item_count := v_item_count + 1;

    IF COALESCE(v_item->>'product_id', '') !~ '^[0-9]+$' THEN
      RAISE EXCEPTION 'Invalid product ID';
    END IF;
    v_product_id := (v_item->>'product_id')::bigint;

    IF COALESCE(v_item->>'quantity', '') !~ '^[0-9]+$' THEN
      RAISE EXCEPTION 'Invalid quantity';
    END IF;
    v_quantity := (v_item->>'quantity')::integer;

    IF v_quantity < 1 OR v_quantity > 50 THEN
      RAISE EXCEPTION 'Invalid quantity';
    END IF;

    IF NULLIF(v_item->>'variant_id', '') IS NOT NULL THEN
      IF (v_item->>'variant_id') !~ '^[0-9]+$' THEN
        RAISE EXCEPTION 'Invalid variant ID';
      END IF;
      v_variant_id := (v_item->>'variant_id')::bigint;

      SELECT
        v.id, v.product_id, v.sku, v.price, v.sale_price,
        v.stock, v.image_url,
        p.name_en, p.name_ar, p.is_active,
        COALESCE(v.image_url, p.image_url) AS final_image
      INTO v_variant
      FROM public.product_variants v
      JOIN public.products p ON p.id = v.product_id
      WHERE v.id = v_variant_id
        AND v.product_id = v_product_id
        AND v.is_active = true
        AND COALESCE(p.is_active, true) = true
      FOR UPDATE OF v;

      IF NOT FOUND THEN
        RAISE EXCEPTION 'Selected variant is unavailable';
      END IF;

      IF COALESCE(v_variant.stock, 0) < v_quantity THEN
        RAISE EXCEPTION 'Insufficient variant stock for product %', v_product_id;
      END IF;

      v_unit_price := COALESCE(
        NULLIF(v_variant.sale_price, 0),
        v_variant.price
      );

      IF v_unit_price IS NULL OR v_unit_price < 0 THEN
        RAISE EXCEPTION 'Invalid variant price';
      END IF;

      UPDATE public.product_variants
      SET stock = COALESCE(stock, 0) - v_quantity,
          updated_at = now()
      WHERE id = v_variant_id;

      v_items := v_items || jsonb_build_array(jsonb_build_object(
        'product_id', v_product_id,
        'variant_id', v_variant.id,
        'sku', v_variant.sku,
        'name_en', v_variant.name_en,
        'name_ar', v_variant.name_ar,
        'image_url', v_variant.final_image,
        'unit_price', v_unit_price,
        'quantity', v_quantity,
        'line_total', v_unit_price * v_quantity
      ));
    ELSE
      SELECT id, name_en, name_ar, price, sale_price, image_url, is_active
      INTO v_product
      FROM public.products
      WHERE id = v_product_id
      FOR UPDATE;

      IF NOT FOUND OR COALESCE(v_product.is_active, true) = false THEN
        RAISE EXCEPTION 'Product is unavailable: %', v_product_id;
      END IF;

      v_unit_price := COALESCE(
        NULLIF(v_product.sale_price, 0),
        v_product.price
      );

      IF v_unit_price IS NULL OR v_unit_price < 0 THEN
        RAISE EXCEPTION 'Invalid product price';
      END IF;

      v_items := v_items || jsonb_build_array(jsonb_build_object(
        'product_id', v_product.id,
        'name_en', v_product.name_en,
        'name_ar', v_product.name_ar,
        'image_url', v_product.image_url,
        'unit_price', v_unit_price,
        'quantity', v_quantity,
        'line_total', v_unit_price * v_quantity
      ));
    END IF;

    v_line_total := v_unit_price * v_quantity;
    v_total := v_total + v_line_total;
  END LOOP;

  v_total := v_total + v_delivery_fee;

  INSERT INTO public.orders (
    customer_name, phone, address, delivery_type, governorate,
    wilayat, delivery_fee, notes, items, total_amount
  )
  VALUES (
    trim(p_customer_name), trim(p_customer_phone), trim(p_customer_address),
    p_delivery_type, trim(p_governorate), trim(p_wilayat), v_delivery_fee,
    COALESCE(p_customer_notes, ''), v_items, v_total
  )
  RETURNING id INTO v_order_id;

  RETURN QUERY SELECT v_order_id, v_total;
END;
$function$;

-- Keep guest checkout working while removing the broader PUBLIC grant.
REVOKE ALL ON FUNCTION public.create_store_order_v2(
  text, text, text, text, text, jsonb, text, text, text
) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.create_store_order_v2(
  text, text, text, text, text, jsonb, text, text, text
) TO anon, authenticated;
