import { Separator } from "@/shared/components/ui/separator";
import { Facebook, MapPin, Phone, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import truelookLogo from "@/shared/pictures/trueLookLogotachnen-removebg-preview.png";

const TiktokIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.1z" />
  </svg>
);

export function Footer() {
  return (
    <footer className="w-full bg-card mt-12 border-t border-border/40">
      <div className="mx-auto max-w-7xl px-4 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand & Bio */}
          <div className="md:col-span-1 space-y-4">
            <Link to="/" className="inline-block hover:opacity-80 transition mb-2">
              <img 
                src={truelookLogo} 
                alt="True Look" 
                className="h-28 w-auto object-contain invert dark:invert-0 scale-125 origin-left" 
              />
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              True Look là thiên đường kính mắt thời trang dành riêng cho Gen Z. Chúng tôi liên tục cập nhật những xu hướng mới nhất, giúp bạn tự tin thể hiện cá tính độc bản.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <a
                href="https://www.facebook.com/profile.php?id=61560642944447"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-full bg-muted text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all"
                aria-label="Facebook"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href="https://www.tiktok.com/@truelook3?lang=en"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-full bg-muted text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all"
                aria-label="TikTok"
              >
                <TiktokIcon className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-1 space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider">Khám phá</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <Link to="/products" className="hover:text-primary transition-colors">Bộ sưu tập</Link>
              </li>
              <li>
                <Link to="/" className="hover:text-primary transition-colors">Sản phẩm mới</Link>
              </li>
              <li>
                <Link to="/" className="hover:text-primary transition-colors">Ưu đãi</Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="md:col-span-1 space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider">Chăm sóc khách hàng</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-primary transition-colors">Chính sách bảo hành</a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">Đổi trả & Hoàn tiền</a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">Giao hàng</a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="md:col-span-1 space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider">Liên hệ</h3>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li className="flex items-start gap-3">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                <span>TP. Hồ Chí Minh, Việt Nam</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 shrink-0" />
                <span>+84 123 456 789</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 shrink-0" />
                <span>contact@truelook.vn</span>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-8" />
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} True Look. Tất cả quyền được bảo lưu.
          </p>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground transition">Quyền riêng tư</a>
            <a href="#" className="hover:text-foreground transition">Điều khoản</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
