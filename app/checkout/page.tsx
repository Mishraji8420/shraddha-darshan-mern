"use client";

import { useMemo, useState } from "react";
import { useCart } from "@/context/CartContext";
import { MapPin, Phone, User, Mail, Truck } from "lucide-react";

export default function CheckoutPage() {
  const { items, cartTotal, isHydrated } = useCart();

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    pincode: "",
  });

  const shippingCharge = useMemo(() => {
    return cartTotal >= 999 ? 0 : 99;
  }, [cartTotal]);

  const grandTotal = useMemo(() => {
    return cartTotal + shippingCharge;
  }, [cartTotal, shippingCharge]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const [loading, setLoading] = useState(false);

const validateForm = () => {
  if (!form.fullName.trim()) {
    alert("Please enter your full name");
    return false;
  }

  if (!/^[6-9]\d{9}$/.test(form.phone)) {
    alert("Please enter a valid 10-digit phone number");
    return false;
  }

  if (
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)
  ) {
    alert("Please enter a valid email address");
    return false;
  }

  if (!form.address1.trim()) {
    alert("Please enter your address");
    return false;
  }

  if (!form.city.trim()) {
    alert("Please enter your city");
    return false;
  }

  if (!form.state.trim()) {
    alert("Please enter your state");
    return false;
  }

  if (!/^\d{6}$/.test(form.pincode)) {
    alert("Please enter a valid 6-digit pincode");
    return false;
  }

  if (items.length === 0) {
    alert("Your cart is empty.");
    return false;
  }

  return true;
};

const handlePlaceOrder = async () => {
  if (!validateForm()) return;

  setLoading(true);

  try {
    // Next step me yahin Order API call hogi
    console.log({
      customer: form,
      items,
      subtotal: cartTotal,
      shipping: shippingCharge,
      total: grandTotal,
    });

    alert("Validation successful. Order API will be connected next.");
  } catch (error) {
    console.error(error);
    alert("Something went wrong.");
  } finally {
    setLoading(false);
  }
};

  if (!isHydrated) {
    return (
      <main className="min-h-screen bg-[#0b0b0b]" />
    );
  }



  return (
    <main className="min-h-screen bg-[#0b0b0b] text-white">

      {/* Hero */}
      <section className="border-b border-white/10 bg-gradient-to-b from-[#121212] to-[#0b0b0b]">
        <div className="mx-auto max-w-7xl px-4 py-14">

          <span className="inline-flex items-center gap-2 rounded-full border border-yellow-500/30 bg-yellow-500/10 px-4 py-2 text-xs uppercase tracking-[0.25em] text-yellow-400">
            <Truck size={14} />
            Secure Checkout
          </span>

          <h1 className="mt-5 text-4xl font-bold sm:text-5xl">
            Checkout
          </h1>

          <p className="mt-3 max-w-2xl text-gray-400">
            Complete your order securely with encrypted checkout
            and premium delivery across India.
          </p>

        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-14 lg:grid-cols-3">

        {/* LEFT */}
        <div className="lg:col-span-2">

          <div className="rounded-3xl border border-white/10 bg-[#111111] p-8">

            <h2 className="mb-8 text-2xl font-bold">
              Shipping Address
            </h2>

            <div className="grid gap-6">

              {/* Full Name */}
              <div>

                <label className="mb-2 flex items-center gap-2 text-sm text-gray-300">
                  <User size={16} />
                  Full Name
                </label>

                <input
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="w-full rounded-xl border border-white/10 bg-[#1a1a1a] px-4 py-3 outline-none transition focus:border-yellow-500"
                />

              </div>

              {/* Phone + Email */}

              <div className="grid gap-6 md:grid-cols-2">

                <div>

                  <label className="mb-2 flex items-center gap-2 text-sm text-gray-300">
                    <Phone size={16} />
                    Phone Number
                  </label>

                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+91 XXXXX XXXXX"
                    className="w-full rounded-xl border border-white/10 bg-[#1a1a1a] px-4 py-3 outline-none transition focus:border-yellow-500"
                  />

                </div>

                <div>

                  <label className="mb-2 flex items-center gap-2 text-sm text-gray-300">
                    <Mail size={16} />
                    Email Address
                  </label>

                  <input
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-white/10 bg-[#1a1a1a] px-4 py-3 outline-none transition focus:border-yellow-500"
                  />

                </div>

              </div>

              {/* Address */}

              <div>

                <label className="mb-2 flex items-center gap-2 text-sm text-gray-300">
                  <MapPin size={16} />
                  Address Line 1
                </label>

                <input
                  name="address1"
                  value={form.address1}
                  onChange={handleChange}
                  placeholder="House No, Street"
                  className="w-full rounded-xl border border-white/10 bg-[#1a1a1a] px-4 py-3 outline-none transition focus:border-yellow-500"
                />

              </div>

              <div>

                <label className="mb-2 text-sm text-gray-300 block">
                  Address Line 2 (Optional)
                </label>

                <input
                  name="address2"
                  value={form.address2}
                  onChange={handleChange}
                  placeholder="Landmark, Apartment"
                  className="w-full rounded-xl border border-white/10 bg-[#1a1a1a] px-4 py-3 outline-none transition focus:border-yellow-500"
                />

              </div>

              {/* City */}

              <div className="grid gap-6 md:grid-cols-3">

                <input
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  placeholder="City"
                  className="rounded-xl border border-white/10 bg-[#1a1a1a] px-4 py-3 outline-none transition focus:border-yellow-500"
                />

                <input
                  name="state"
                  value={form.state}
                  onChange={handleChange}
                  placeholder="State"
                  className="rounded-xl border border-white/10 bg-[#1a1a1a] px-4 py-3 outline-none transition focus:border-yellow-500"
                />

                <input
                  name="pincode"
                  value={form.pincode}
                  onChange={handleChange}
                  placeholder="Pincode"
                  className="rounded-xl border border-white/10 bg-[#1a1a1a] px-4 py-3 outline-none transition focus:border-yellow-500"
                />

              </div>

            </div>

          </div>

        </div>
                {/* RIGHT SIDE - Order Summary */}
        <div>

          <div className="sticky top-24 rounded-3xl border border-yellow-500/20 bg-gradient-to-b from-[#151515] to-[#101010] p-6 shadow-2xl">

            <h2 className="text-2xl font-bold">
              Order Summary
            </h2>

            <p className="mt-2 text-sm text-gray-400">
              {items.length} item{items.length !== 1 ? "s" : ""} in your cart
            </p>

            <div className="mt-6 max-h-80 space-y-4 overflow-y-auto pr-1">

              {items.map(({ product, quantity }) => (

                <div
                  key={product.id}
                  className="flex items-center gap-4 rounded-2xl border border-white/10 bg-[#181818] p-3"
                >

                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-20 w-20 rounded-xl object-cover"
                  />

                  <div className="min-w-0 flex-1">

                    <h3 className="truncate font-semibold text-white">
                      {product.name}
                    </h3>

                    <p className="text-xs text-gray-500">
                      Qty : {quantity}
                    </p>

                    <p className="mt-1 text-sm font-semibold text-yellow-400">
                      ₹{(product.price * quantity).toLocaleString("en-IN")}
                    </p>

                  </div>

                </div>

              ))}

            </div>

            <div className="my-6 border-t border-white/10" />

            <div className="space-y-3">

              <div className="flex justify-between text-gray-400">
                <span>Subtotal</span>
                <span className="text-white">
                  ₹{cartTotal.toLocaleString("en-IN")}
                </span>
              </div>

              <div className="flex justify-between text-gray-400">
                <span>Shipping</span>

                {shippingCharge === 0 ? (
                  <span className="font-semibold text-green-400">
                    FREE
                  </span>
                ) : (
                  <span className="text-white">
                    ₹{shippingCharge}
                  </span>
                )}

              </div>

              <div className="border-t border-white/10 pt-4" />

              <div className="flex justify-between text-xl font-bold">

                <span>Total</span>

                <span className="text-yellow-400">
                  ₹{grandTotal.toLocaleString("en-IN")}
                </span>

              </div>

            </div>

            {shippingCharge === 0 && (

              <div className="mt-6 rounded-2xl border border-green-500/20 bg-green-500/10 p-4">

                <p className="font-semibold text-green-400">
                  🎉 Congratulations!
                </p>

                <p className="mt-1 text-sm text-gray-300">
                  Your order qualifies for FREE shipping.
                </p>

              </div>

            )}
            <button
  type="button"
  onClick={handlePlaceOrder}
  disabled={loading}
  className="mt-8 w-full rounded-2xl bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-500 py-4 text-lg font-bold text-black transition duration-300 hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
>
  {loading ? (
    <span className="flex items-center justify-center gap-2">
      <svg
        className="h-5 w-5 animate-spin"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4z"
        />
      </svg>
      Processing...
    </span>
  ) : (
    "Place Order"
  )}
</button>


            <p className="mt-4 text-center text-xs text-gray-500">
              🔒 Secure Checkout • SSL Encrypted • Razorpay Payment
            </p>

          </div>

        </div>

      </section>

    </main>

  );
}