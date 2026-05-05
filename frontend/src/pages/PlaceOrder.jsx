import React, { useContext, useEffect, useState } from "react";
import DeliveryInfo from "../components/DeliveryInfo";
import DeliveryMethod from "../components/DeliveryMethod";
import PaymentMethod from "../components/PaymentMethod";
import MyOrder from "../components/MyOrder";
import Footer from "../components/Footer";
import EditShippingInfo from "../components/EditShippingInfo";
import ContactInfo from "../components/ContactInfo";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ShopContext } from "../context/ShopContext";
import { useAuth } from "../context/AuthContext";
import { createOrder } from "../api";

const PlaceOrder = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { cartItems, clearCart } = useContext(ShopContext);

  const [deliveryList, setDeliveryList] = useState(
    JSON.parse(localStorage.getItem("deliveryInfo") || "[]")
  );
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [editIndex, setEditIndex] = useState(null);

  const [deliveryMethod, setDeliveryMethod] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Redirect to login if user isn't authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      toast.error("Please log in to complete your order.");
      navigate("/login", { replace: true });
    }
  }, [authLoading, user, navigate]);

  const handleEditDelivery = (index) => setEditIndex(index);

  const handleSaveEdit = (data) => {
    const updated = [...deliveryList];
    updated[editIndex] = data;
    setDeliveryList(updated);
    setEditIndex(null);
    localStorage.setItem("deliveryInfo", JSON.stringify(updated));
  };

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) return toast.error("Your cart is empty.");
    if (deliveryList.length === 0)
      return toast.error("Add a delivery address first.");
    if (!deliveryMethod) return toast.error("Choose a delivery method.");
    if (!paymentMethod) return toast.error("Choose a payment method.");

    const selectedAddress = deliveryList[selectedIndex] || deliveryList[0];

    const itemsPrice = cartItems.reduce(
      (sum, it) => sum + (Number(it.price) || 0) * (Number(it.quantity) || 0),
      0
    );
    const shippingPrice = itemsPrice > 0 ? 1000 : 0;
    const taxPrice = 0;

    const payload = {
      orderItems: cartItems.map((it) => ({
        product: it._id,
        qty: it.quantity,
        price: Number(it.price) || 0,
        name: it.name,
        image: Array.isArray(it.image) ? it.image[0] : it.image,
      })),
      shippingAddress: {
        address:
          selectedAddress.address ||
          selectedAddress.streetAddress ||
          selectedAddress.line1 ||
          "",
        city: selectedAddress.city || "N/A",
        postalCode: selectedAddress.postalCode || "N/A",
        country: selectedAddress.country || "Nigeria",
        phone: selectedAddress.phone || selectedAddress.phoneNumber || "",
        recipient:
          selectedAddress.fullName ||
          `${selectedAddress.firstName || ""} ${
            selectedAddress.lastName || ""
          }`.trim() ||
          `${user?.firstName || ""} ${user?.lastName || ""}`.trim(),
      },
      deliveryMethod,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice: itemsPrice + shippingPrice + taxPrice,
      customerName: `${user?.firstName || ""} ${user?.lastName || ""}`.trim(),
      customerPhone:
        selectedAddress.phone ||
        selectedAddress.phoneNumber ||
        user?.whatAppNumber ||
        "",
    };

    try {
      setSubmitting(true);
      const order = await createOrder(payload);
      const orderId =
        order?.data?._id || order?._id || order?.data?.order?._id;
      if (orderId) localStorage.setItem("latestOrderId", orderId);
      localStorage.setItem("selectedDeliveryMethod", deliveryMethod);
      localStorage.setItem("selectedPaymentMethod", paymentMethod);
      localStorage.setItem("orderedItems", JSON.stringify(cartItems));
      localStorage.setItem(
        "orderSuccessMessage",
        orderId ? `Thank you! Your Order ID is ${orderId}` : "Thank you!"
      );
      toast.success("Order placed!");
      clearCart();
      navigate("/order-success");
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.message ||
        "Could not place order. Please try again.";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fafafa]">
      <div className="w-full max-w-[1440px] mx-auto px-4 py-10 flex-1">
        <div className="flex flex-col lg:flex-row lg:items-start gap-8">
          <div className="w-full lg:w-2/3 space-y-8">
            {editIndex !== null ? (
              <EditShippingInfo
                initialData={deliveryList[editIndex]}
                onContinue={handleSaveEdit}
              />
            ) : (
              <DeliveryInfo
                deliveries={deliveryList}
                readOnly={true}
                selectedIndex={selectedIndex}
                onSelect={setSelectedIndex}
                onEdit={handleEditDelivery}
              />
            )}

            <DeliveryMethod
              selected={deliveryMethod}
              onChange={setDeliveryMethod}
            />
            <PaymentMethod
              selected={paymentMethod}
              onChange={setPaymentMethod}
            />
          </div>

          <div className="w-full lg:w-1/3">
            <MyOrder
              mode="place"
              onPlaceOrder={handlePlaceOrder}
              submitting={submitting}
            />
          </div>
        </div>
      </div>

      <div className="bg-white border-t">
        <div className="w-full max-w-[1440px] mx-auto px-4 py-10">
          <ContactInfo />
        </div>
      </div>

      <footer className="mt-auto bg-white">
        <Footer />
      </footer>
    </div>
  );
};

export default PlaceOrder;
