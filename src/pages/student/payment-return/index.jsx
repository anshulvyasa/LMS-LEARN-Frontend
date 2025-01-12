import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { captureAndFinalizePaymentService } from "@/services";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const PayPalPaymentReturnPage = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const paymentId = params.get("paymentId");
  const payerId = params.get("PayerID");
  const orderId = JSON.parse(sessionStorage.getItem("currentOrderId"));

  const paymentFormData = {
    paymentId,
    payerId,
    orderId,
  };

  async function handlePaymentProcessing() {
    const response = await captureAndFinalizePaymentService(paymentFormData);
    if (response?.success) {
      sessionStorage.removeItem("currentOrderId");
      window.location.href = "student-courses";
    }
  }

  useEffect(() => {
    handlePaymentProcessing();
  }, [paymentId, payerId]);

  return (
    <div className="flex h-screen w-screen justify-center items-center">
      <div className="min-h-20 min-w-40">
        <Card className="w-full h-full">
          <CardHeader>
            <CardTitle>Processing Payment... Please Wait</CardTitle>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
};

export default PayPalPaymentReturnPage;
