import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Lock, 
  CreditCard, 
  QrCode, 
  Building2, 
  Wallet, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight, 
  Download,
  AlertCircle,
  HelpCircle
} from 'lucide-react';

export const CheckoutModal = ({ plan, billingCycle, onClose, onSuccess }) => {
  const [paymentMethod, setPaymentMethod] = useState('upi'); // 'upi' | 'card' | 'netbanking' | 'wallet'
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [studentName, setStudentName] = useState('');
  const [upiId, setUpiId] = useState('');
  const [upiVerified, setUpiVerified] = useState(false);
  
  // Card details
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardName, setCardName] = useState('');

  // Netbanking bank
  const [selectedBank, setSelectedBank] = useState('HDFC');

  // Checkout states: 'form' | 'processing' | 'success'
  const [checkoutState, setCheckoutState] = useState('form');
  const [orderId, setOrderId] = useState('');

  if (!plan) return null;

  const basePrice = billingCycle === 'annual' ? plan.priceAnnual : plan.priceMonthly;
  const billingMonths = billingCycle === 'annual' ? 12 : 1;
  const subtotal = basePrice * billingMonths;
  const gst = Math.round(subtotal * 0.18);
  const total = subtotal + gst;

  const handleVerifyUpi = (e) => {
    e.preventDefault();
    if (upiId.includes('@')) {
      setUpiVerified(true);
    }
  };

  const handlePay = (e) => {
    e.preventDefault();
    setCheckoutState('processing');

    setTimeout(() => {
      const generatedId = `CK-${Math.floor(100000 + Math.random() * 900000)}`;
      setOrderId(generatedId);
      setCheckoutState('success');
      if (onSuccess) {
        onSuccess({ plan, orderId: generatedId, total });
      }
    }, 1800);
  };

  const formatCardNumber = (val) => {
    const clean = val.replace(/\D/g, '').slice(0, 16);
    return clean.replace(/(\d{4})(?=\d)/g, '$1 ');
  };

  const formatExpiry = (val) => {
    const clean = val.replace(/\D/g, '').slice(0, 4);
    if (clean.length >= 3) {
      return `${clean.slice(0, 2)}/${clean.slice(2, 4)}`;
    }
    return clean;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="relative bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-gray-100 overflow-hidden my-auto max-h-[95vh] flex flex-col">
        
        {/* Modal Header Bar */}
        <div className="bg-[#1c4a27] text-white px-5 py-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#489f1f] flex items-center justify-center text-white font-black text-sm shadow-inner">
              ♟
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">ChessKid Secure Checkout</h3>
                <span className="bg-[#489f1f]/80 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded text-white flex items-center gap-1">
                  <Lock className="w-2.5 h-2.5" /> 256-Bit SSL
                </span>
              </div>
              <p className="text-[11px] text-white/80">Authorized Subscription Gateway</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        {checkoutState === 'processing' && (
          <div className="py-20 px-6 flex flex-col items-center justify-center text-center space-y-4">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-emerald-200 border-t-[#489f1f] rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center text-xl">♟</div>
            </div>
            <h4 className="text-lg font-bold text-gray-900">Processing Your Payment...</h4>
            <p className="text-xs text-gray-500 max-w-sm">
              Please do not refresh or close this window. We are securely finalizing your {plan.name} subscription.
            </p>
          </div>
        )}

        {checkoutState === 'success' && (
          <div className="p-6 sm:p-8 flex flex-col items-center text-center space-y-4 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full border border-emerald-200">
                Payment Successful!
              </span>
              <h3 className="text-2xl font-black text-gray-900 mt-2">Welcome to {plan.name}!</h3>
              <p className="text-xs sm:text-sm text-gray-600 mt-1 max-w-md">
                Your subscription has been activated immediately. You now have full access to the requested chess curriculum and learning materials!
              </p>
            </div>

            {/* Receipt Summary Box */}
            <div className="w-full max-w-md bg-gray-50 border border-gray-200 rounded-xl p-4 text-left text-xs space-y-2">
              <div className="flex justify-between pb-2 border-b border-gray-200">
                <span className="text-gray-500 font-medium">Order Reference:</span>
                <span className="font-mono font-bold text-gray-900">{orderId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 font-medium">Plan Selected:</span>
                <span className="font-bold text-gray-900">{plan.name} ({billingCycle === 'annual' ? 'Annual Billing' : 'Monthly'})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 font-medium">Amount Paid:</span>
                <span className="font-bold text-emerald-700">₹{total.toLocaleString('en-IN')} (incl. GST)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 font-medium">Recipient / Kid:</span>
                <span className="font-semibold text-gray-900">{studentName || customerName || 'Young Grandmaster'}</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-gray-500 font-medium">Status:</span>
                <span className="inline-flex items-center gap-1 font-bold text-emerald-600">
                  <Sparkles className="w-3 h-3" /> Active Subscription
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5 w-full max-w-md pt-2">
              <button
                onClick={onClose}
                className="flex-1 py-3 px-4 rounded-xl bg-[#489f1f] hover:bg-[#3c8719] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Start Learning Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => window.print()}
                className="py-3 px-4 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download Invoice</span>
              </button>
            </div>
          </div>
        )}

        {checkoutState === 'form' && (
          <form onSubmit={handlePay} className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 md:grid-cols-12 gap-5">
            
            {/* Left Column: Customer Details & Order Summary */}
            <div className="md:col-span-5 space-y-4">
              
              {/* Plan Card Mini */}
              <div className="bg-[#edf3f8] border border-sky-200 rounded-xl p-3.5">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-sky-800">
                    Selected Subscription
                  </span>
                  <span className="text-base">{plan.icon}</span>
                </div>
                <h4 className="font-bold text-gray-900 text-sm sm:text-base">{plan.name}</h4>
                <p className="text-xs text-gray-600 mb-2">{plan.tagline}</p>
                <div className="flex items-baseline gap-1.5 pt-1 border-t border-sky-200">
                  <span className="text-xl font-black text-gray-900">₹{basePrice.toLocaleString('en-IN')}</span>
                  <span className="text-xs text-gray-600 font-medium">/ month</span>
                  {billingCycle === 'annual' && (
                    <span className="ml-auto text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                      Billed Annually
                    </span>
                  )}
                </div>
              </div>

              {/* Account Information */}
              <div className="space-y-2.5">
                <h5 className="text-xs font-bold text-gray-800 uppercase tracking-wider">Account Credentials</h5>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-700 mb-1">Parent or Coach Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Sharma"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#489f1f] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-700 mb-1">Email Address (for login & invoice) *</label>
                  <input
                    type="email"
                    required
                    placeholder="parent@example.com"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#489f1f] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-700 mb-1">Kid / Student Username</label>
                  <input
                    type="text"
                    placeholder="e.g. Anand_FutureMaster"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#489f1f] focus:border-transparent"
                  />
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs space-y-1.5">
                <div className="flex justify-between text-gray-600">
                  <span>Base Plan ({billingMonths} {billingMonths > 1 ? 'months' : 'month'})</span>
                  <span className="font-semibold text-gray-900">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span className="flex items-center gap-1">
                    GST (18% Statutory)
                    <HelpCircle className="w-3 h-3 text-gray-400" />
                  </span>
                  <span className="font-semibold text-gray-900">₹{gst.toLocaleString('en-IN')}</span>
                </div>
                <div className="pt-2 border-t border-gray-200 flex justify-between items-baseline font-bold text-gray-900 text-sm">
                  <span>Total Amount</span>
                  <span className="text-base text-emerald-700 font-black">₹{total.toLocaleString('en-IN')}</span>
                </div>
                <div className="text-[10px] text-gray-500 pt-1 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>7-Day 100% Money-Back Guarantee included</span>
                </div>
              </div>

            </div>

            {/* Right Column: Payment Method Selection & Inputs */}
            <div className="md:col-span-7 space-y-4 flex flex-col justify-between">
              
              <div>
                <h5 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-2">
                  Select Payment Method
                </h5>

                {/* Tabs for Payment Method */}
                <div className="grid grid-cols-4 gap-1.5 bg-gray-100 p-1 rounded-xl mb-4">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('upi')}
                    className={`py-2 px-1 text-center rounded-lg text-xs font-bold transition-all flex flex-col items-center gap-1 cursor-pointer ${
                      paymentMethod === 'upi'
                        ? 'bg-white text-[#489f1f] shadow-xs'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <QrCode className="w-4 h-4" />
                    <span>UPI / QR</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`py-2 px-1 text-center rounded-lg text-xs font-bold transition-all flex flex-col items-center gap-1 cursor-pointer ${
                      paymentMethod === 'card'
                        ? 'bg-white text-[#489f1f] shadow-xs'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Card</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('netbanking')}
                    className={`py-2 px-1 text-center rounded-lg text-xs font-bold transition-all flex flex-col items-center gap-1 cursor-pointer ${
                      paymentMethod === 'netbanking'
                        ? 'bg-white text-[#489f1f] shadow-xs'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Building2 className="w-4 h-4" />
                    <span>NetBank</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('wallet')}
                    className={`py-2 px-1 text-center rounded-lg text-xs font-bold transition-all flex flex-col items-center gap-1 cursor-pointer ${
                      paymentMethod === 'wallet'
                        ? 'bg-white text-[#489f1f] shadow-xs'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Wallet className="w-4 h-4" />
                    <span>Wallets</span>
                  </button>
                </div>

                {/* UPI Content */}
                {paymentMethod === 'upi' && (
                  <div className="space-y-3.5 bg-sky-50/50 border border-sky-200 rounded-xl p-3.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-gray-800">Scan QR with any UPI App</span>
                      <span className="text-[11px] font-semibold text-[#1ba3e1]">GPay / PhonePe / Paytm</span>
                    </div>

                    <div className="flex items-center gap-4 bg-white p-3 rounded-lg border border-sky-100 shadow-xs">
                      {/* Realistic simulated QR code */}
                      <div className="w-24 h-24 bg-white p-1.5 border border-gray-300 rounded-lg flex-shrink-0 flex flex-col items-center justify-center">
                        <div className="grid grid-cols-4 gap-0.5 w-full h-full p-1 bg-gray-900 rounded">
                          <div className="bg-white rounded-xs"></div>
                          <div className="bg-gray-900"></div>
                          <div className="bg-white rounded-xs"></div>
                          <div className="bg-white rounded-xs"></div>
                          <div className="bg-white"></div>
                          <div className="bg-white rounded-xs"></div>
                          <div className="bg-gray-900"></div>
                          <div className="bg-white"></div>
                          <div className="bg-white rounded-xs"></div>
                          <div className="bg-gray-900"></div>
                          <div className="bg-white"></div>
                          <div className="bg-white rounded-xs"></div>
                          <div className="bg-gray-900"></div>
                          <div className="bg-white rounded-xs"></div>
                          <div className="bg-white rounded-xs"></div>
                          <div className="bg-white rounded-xs"></div>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="text-xs font-bold text-gray-900">UPI Instant Autopay</div>
                        <p className="text-[11px] text-gray-500 leading-relaxed">
                          Scan and approve payment from your mobile banking app.
                        </p>
                        <div className="text-[11px] font-bold text-emerald-700">Zero Gateway Surcharge</div>
                      </div>
                    </div>

                    <div className="relative flex py-1 items-center">
                      <div className="flex-grow border-t border-gray-200"></div>
                      <span className="flex-shrink mx-2 text-[11px] text-gray-400 font-medium">OR ENTER UPI ID</span>
                      <div className="flex-grow border-t border-gray-200"></div>
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="yourname@okhdfcbank"
                        value={upiId}
                        onChange={(e) => {
                          setUpiId(e.target.value);
                          setUpiVerified(false);
                        }}
                        className="flex-1 text-xs px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#489f1f]"
                      />
                      <button
                        type="button"
                        onClick={handleVerifyUpi}
                        className="px-3 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                      >
                        {upiVerified ? 'Verified ✓' : 'Verify'}
                      </button>
                    </div>
                  </div>
                )}

                {/* Card Content */}
                {paymentMethod === 'card' && (
                  <div className="space-y-3 bg-gray-50 border border-gray-200 rounded-xl p-3.5">
                    {/* Simulated Credit Card Preview */}
                    <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-emerald-950 text-white p-3.5 rounded-xl shadow-md space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-semibold tracking-wider text-sky-300">ChessKid SafePay</span>
                        <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded font-mono">DEBIT / CREDIT</span>
                      </div>
                      <div className="font-mono text-sm tracking-widest pt-1">
                        {cardNumber || '•••• •••• •••• ••••'}
                      </div>
                      <div className="flex justify-between items-end text-[10px] pt-1 text-white/80">
                        <div>
                          <span className="text-[8px] uppercase tracking-wider block text-white/60">Cardholder</span>
                          <span className="font-medium uppercase">{cardName || customerName || 'YOUR NAME'}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-[8px] uppercase tracking-wider block text-white/60">Expires</span>
                          <span className="font-medium font-mono">{cardExpiry || 'MM/YY'}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-gray-700 mb-1">Card Number</label>
                      <input
                        type="text"
                        maxLength="19"
                        placeholder="1234 5678 9012 3456"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                        className="w-full text-xs px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#489f1f]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] font-semibold text-gray-700 mb-1">Expiry Date</label>
                        <input
                          type="text"
                          maxLength="5"
                          placeholder="MM/YY"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                          className="w-full text-xs px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#489f1f]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-gray-700 mb-1">CVV / CVC</label>
                        <input
                          type="password"
                          maxLength="4"
                          placeholder="•••"
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))}
                          className="w-full text-xs px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#489f1f]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-gray-700 mb-1">Name on Card</label>
                      <input
                        type="text"
                        placeholder="Name as printed on card"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        className="w-full text-xs px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#489f1f]"
                      />
                    </div>
                  </div>
                )}

                {/* Net Banking */}
                {paymentMethod === 'netbanking' && (
                  <div className="space-y-3 bg-gray-50 border border-gray-200 rounded-xl p-3.5">
                    <span className="text-xs font-bold text-gray-800">Popular Indian Banks</span>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {['HDFC Bank', 'ICICI Bank', 'State Bank of India', 'Axis Bank', 'Kotak Mahindra', 'Punjab National Bank'].map((bank) => (
                        <label
                          key={bank}
                          className={`flex items-center gap-2 p-2.5 rounded-lg border cursor-pointer transition-all ${
                            selectedBank === bank
                              ? 'bg-emerald-50 border-emerald-500 font-bold text-emerald-900 shadow-xs'
                              : 'bg-white border-gray-200 hover:border-gray-300 text-gray-700'
                          }`}
                        >
                          <input
                            type="radio"
                            name="bank"
                            checked={selectedBank === bank}
                            onChange={() => setSelectedBank(bank)}
                            className="text-[#489f1f] focus:ring-[#489f1f]"
                          />
                          <span>{bank}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Wallets */}
                {paymentMethod === 'wallet' && (
                  <div className="space-y-2 bg-gray-50 border border-gray-200 rounded-xl p-3.5 text-xs">
                    <span className="font-bold text-gray-800">Select Mobile Wallet</span>
                    <div className="space-y-2 pt-1">
                      {['Paytm Wallet', 'Amazon Pay Balance', 'PhonePe Wallet', 'MobiKwik'].map((wallet) => (
                        <label
                          key={wallet}
                          className="flex items-center justify-between p-2.5 bg-white border border-gray-200 rounded-lg cursor-pointer hover:border-emerald-300"
                        >
                          <span className="font-semibold text-gray-800">{wallet}</span>
                          <input type="radio" name="wallet" defaultChecked={wallet.includes('Paytm')} className="text-[#489f1f]" />
                        </label>
                      ))}
                    </div>
                  </div>
                )}

              </div>

              {/* Submit Button */}
              <div className="pt-3 border-t border-gray-200 space-y-2">
                <button
                  type="submit"
                  className="w-full py-3.5 px-4 rounded-xl bg-[#489f1f] hover:bg-[#3c8719] text-white font-black text-sm sm:text-base shadow-lg hover:shadow-emerald-300/40 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Lock className="w-4 h-4" />
                  <span>Pay ₹{total.toLocaleString('en-IN')} & Activate Now</span>
                </button>
                <p className="text-[10px] text-center text-gray-500">
                  By clicking Pay, you agree to ChessKid Terms of Service. Safe & encrypted by 256-bit SSL.
                </p>
              </div>

            </div>

          </form>
        )}

      </div>
    </div>
  );
};
