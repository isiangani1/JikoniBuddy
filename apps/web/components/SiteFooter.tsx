export default function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-[#0d0a14] px-6 py-12 text-white/70">
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-5">
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-white">Jikoni Buddy</h3>
          <p className="text-sm">Trusted food marketplace in Nairobi.</p>
        </div>
        <div className="space-y-2 text-sm">
          <h4 className="font-semibold text-white">Company</h4>
          <a href="#" className="block hover:text-white">About Us</a>
          <a href="#" className="block hover:text-white">How it Works</a>
          <a href="#" className="block hover:text-white">Careers</a>
          <a href="#" className="block hover:text-white">Blog</a>
        </div>
        <div className="space-y-2 text-sm">
          <h4 className="font-semibold text-white">For Sellers</h4>
          <a href="#" className="block hover:text-white">Become a Seller</a>
          <a href="#" className="block hover:text-white">Seller Guidelines</a>
          <a href="#" className="block hover:text-white">Buddy Pool</a>
          <a href="#" className="block hover:text-white">Seller Support</a>
        </div>
        <div className="space-y-2 text-sm">
          <h4 className="font-semibold text-white">Support</h4>
          <a href="#" className="block hover:text-white">Help Center</a>
          <a href="#" className="block hover:text-white">Disputes & Refunds</a>
          <a href="#" className="block hover:text-white">Contact Us</a>
          <a href="#" className="block hover:text-white">WhatsApp Support</a>
        </div>
        <div className="space-y-2 text-sm">
          <h4 className="font-semibold text-white">Legal</h4>
          <a href="#" className="block hover:text-white">Terms of Service</a>
          <a href="#" className="block hover:text-white">Privacy Policy</a>
          <a href="#" className="block hover:text-white">Refund Policy</a>
        </div>
      </div>
      <div className="mx-auto mt-10 flex max-w-6xl flex-col gap-2 border-t border-white/10 pt-6 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between">
        <span>© 2026 Jikoni Buddy</span>
        <span>Powered by secure payments (M-Pesa)</span>
      </div>
    </footer>
  );
}
